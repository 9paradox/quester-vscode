import * as vscode from "vscode";
import { getUri } from "../utilities/getUri";
import { apitester } from "@9paradox/apitester";
import { getNonce } from "../utilities/getNonce";

/**
 * Provider for apitester editors.
 *
 * apitester editors are used for `.apitester` files, which are just json files.
 * To get started, run this extension and open an empty `.apitester` file in VS Code.
 *
 * This provider demonstrates:
 *
 * - Setting up the initial webview for a custom editor.
 * - Loading scripts and styles in a custom editor.
 * - Synchronizing changes between a text document and a custom editor.
 */
export class ApiTesterEditor implements vscode.CustomTextEditorProvider {
  public static register(context: vscode.ExtensionContext): vscode.Disposable {
    const provider = new ApiTesterEditor(context);
    const providerRegistration = vscode.window.registerCustomEditorProvider(
      ApiTesterEditor.viewType,
      provider
    );
    return providerRegistration;
  }

  private static readonly viewType = "quester.apitesterEditor";

  constructor(private readonly context: vscode.ExtensionContext) {}

  /**
   * Called when our custom editor is opened.
   *
   *
   */
  public async resolveCustomTextEditor(
    document: vscode.TextDocument,
    webviewPanel: vscode.WebviewPanel,
    _token: vscode.CancellationToken
  ): Promise<void> {
    // Setup initial content for the webview
    webviewPanel.webview.options = {
      enableScripts: true,
      localResourceRoots: [
        vscode.Uri.joinPath(this.context.extensionUri, "out"),
        vscode.Uri.joinPath(this.context.extensionUri, "webview-ui/build"),
      ],
    };
    webviewPanel.webview.html = this.getWebviewContent(
      webviewPanel.webview,
      this.context.extensionUri
    );

    // function updateWebview() {
    //   webviewPanel.webview.postMessage({
    //     type: "update",
    //     text: document.getText(),
    //   });
    // }

    // Hook up event handlers so that we can synchronize the webview with the text document.
    //
    // The text document acts as our model, so we have to sync change in the document to our
    // editor and sync changes in the editor back to the document.
    //
    // Remember that a single text document can also be shared between multiple custom
    // editors (this happens for example when you split a custom editor)

    const changeDocumentSubscription = vscode.workspace.onDidChangeTextDocument((e) => {
      if (e.document.uri.toString() === document.uri.toString()) {
        //updateWebview();//TODO
      }
    });

    // Make sure we get rid of the listener when our editor is closed.
    webviewPanel.onDidDispose(() => {
      changeDocumentSubscription.dispose();
    });

    // Receive message from the webview.
    webviewPanel.webview.onDidReceiveMessage(async (message: any) => {
      const command = message.command;
      switch (command) {
        case "loadTestCase":
          webviewPanel.webview.postMessage({
            type: "command",
            command: "loadTestCase",
            value: this.getDocumentAsJson(document),
          });
          return;
        case "runTestCase":
          await this.runTestCase(webviewPanel.webview, message.value);
          return;
        case "saveTestCase":
          await this.saveTestCase(document, webviewPanel.webview, message.value);
          return;
      }
    });
  }

  /**
   * Defines and returns the HTML that should be rendered within the webview panel.
   *
   * @remarks This is also the place where references to the React webview build files
   * are created and inserted into the webview HTML.
   *
   * @param webview A reference to the extension webview
   * @param extensionUri The URI of the directory containing the extension
   * @returns A template string literal containing the HTML that should be
   * rendered within the webview panel
   */
  private getWebviewContent(webview: vscode.Webview, extensionUri: vscode.Uri) {
    // The JS file from the React build output
    const scriptUri = getUri(webview, extensionUri, ["webview-ui", "build", "assets", "index.js"]);

    const nonce = getNonce();

    // Tip: Install the es6-string-html VS Code extension to enable code highlighting below
    return /*html*/ `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'self' 'unsafe-inline' ${webview.cspSource}; script-src 'nonce-${nonce}';">
          <title>Hello World</title>
        </head>
        <body>
          <div id="root"></div>
          <script type="module" nonce="${nonce}" src="${scriptUri}"></script>
        </body>
      </html>
    `;
  }

  delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

  private async runTestCase(webview: vscode.Webview, testCaseData: any) {
    try {
      const testCase = apitester.createTestCase({
        title: testCaseData.title,
        callback: async (cd) => {
          if (cd.type !== "after") {
            return;
          }
          await this.delay(testCaseData.delay);
          webview.postMessage({
            type: "command",
            command: "callback",
            value: cd,
          });
        },
        steps: testCaseData.steps,
      });

      var result = await testCase.test();

      webview.postMessage({
        type: "command",
        command: "result",
        value: result,
      });
    } catch (e) {
      console.error("ApiTesterEditor.runTestCase", e);
    }
  }

  private async saveTestCase(
    document: vscode.TextDocument,
    webview: vscode.Webview,
    testCaseData: any
  ) {
    try {
      this.updateTextDocument(document, testCaseData);
      webview.postMessage({
        type: "command",
        command: "save",
        value: { success: true, message: "Testcase saved." },
      });
    } catch (e) {
      webview.postMessage({
        type: "command",
        command: "save",
        value: { success: false, message: "Failed to save." },
      });
      console.error("ApiTesterEditor.saveTestCase", e);
    }
  }

  /**
   * Try to get a current document as json text.
   */
  private getDocumentAsJson(document: vscode.TextDocument): any {
    const text = document.getText();
    if (text.trim().length === 0) {
      return { title: "api-test-case", steps: [] };
    }

    try {
      return JSON.parse(text);
    } catch {
      throw new Error("Could not get document as json. Content is not valid json");
    }
  }

  /**
   * Write out the json to a given document.
   */
  private updateTextDocument(document: vscode.TextDocument, json: any) {
    const edit = new vscode.WorkspaceEdit();

    // Just replace the entire document every time for this example extension.
    // A more complete extension should compute minimal edits instead.
    edit.replace(
      document.uri,
      new vscode.Range(0, 0, document.lineCount, 0),
      JSON.stringify(json, null, 2)
    );

    return vscode.workspace.applyEdit(edit);
  }
}
