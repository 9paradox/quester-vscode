import { Disposable, Webview, WebviewPanel, window, Uri, ViewColumn } from "vscode";
import { getUri } from "../utilities/getUri";
import { getNonce } from "../utilities/getNonce";
import { apitester } from "@9paradox/apitester";

/**
 * This class manages the state and behavior of ApiTesterRunner webview panels.
 *
 * It contains all the data and methods for:
 *
 * - Creating and rendering ApiTesterRunner webview panels
 * - Properly cleaning up and disposing of webview resources when the panel is closed
 * - Setting the HTML (and by proxy CSS/JavaScript) content of the webview panel
 * - Setting message listeners so data can be passed between the webview and extension
 */
export class ApiTesterRunner {
  public static currentPanel: ApiTesterRunner | undefined;
  public static folderPath: string | undefined;
  private readonly _panel: WebviewPanel;
  private _disposables: Disposable[] = [];

  /**
   * The ApiTesterRunner class private constructor (called only from the render method).
   *
   * @param panel A reference to the webview panel
   * @param extensionUri The URI of the directory containing the extension
   */
  private constructor(panel: WebviewPanel, extensionUri: Uri) {
    this._panel = panel;

    // Set an event listener to listen for when the panel is disposed (i.e. when the user closes
    // the panel or when the panel is closed programmatically)
    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

    // Set the HTML content for the webview panel
    this._panel.webview.html = this._getWebviewContent(this._panel.webview, extensionUri);

    // Set an event listener to listen for messages passed from the webview context
    this._setWebviewMessageListener(this._panel.webview);
  }

  /**
   * Renders the current webview panel if it exists otherwise a new webview panel
   * will be created and displayed.
   *
   * @param extensionUri The URI of the directory containing the extension.
   */
  public static render(extensionUri: Uri, folderUri: Uri) {
    if (ApiTesterRunner.currentPanel && ApiTesterRunner.folderPath === folderUri.fsPath) {
      // If the webview panel already exists reveal it
      ApiTesterRunner.currentPanel._panel.reveal(ViewColumn.One);
    } else {
      // If a webview panel does not already exist create and show a new one
      const panel = window.createWebviewPanel(
        // Panel view type
        "apitesterRunner",
        // Panel title
        "Apitester Runner",
        // The editor column the panel should be displayed in
        ViewColumn.One,
        // Extra panel configurations
        {
          enableScripts: true,
          localResourceRoots: [
            Uri.joinPath(extensionUri, "out"),
            Uri.joinPath(extensionUri, "webview-ui/build"),
          ],
        }
      );

      ApiTesterRunner.currentPanel = new ApiTesterRunner(panel, extensionUri);
      ApiTesterRunner.folderPath = folderUri.fsPath;
    }
  }

  /**
   * Cleans up and disposes of webview resources when the webview panel is closed.
   */
  public dispose() {
    ApiTesterRunner.currentPanel = undefined;

    // Dispose of the current webview panel
    this._panel.dispose();

    // Dispose of all disposables (i.e. commands) associated with the current webview panel
    while (this._disposables.length) {
      const disposable = this._disposables.pop();
      if (disposable) {
        disposable.dispose();
      }
    }
  }

  /**
   * Defines and returns the HTML that should be rendered within the webview panel.
   *
   * @remarks This is also the place where *references* to CSS and JavaScript files
   * are created and inserted into the webview HTML.
   *
   * @param webview A reference to the extension webview
   * @param extensionUri The URI of the directory containing the extension
   * @returns A template string literal containing the HTML that should be
   * rendered within the webview panel
   */
  private _getWebviewContent(webview: Webview, extensionUri: Uri) {
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
        <body ui-mode="runner">
          <div id="root"></div>
          <script type="module" nonce="${nonce}" src="${scriptUri}"></script>
        </body>
      </html>
    `;
  }

  /**
   * Sets up an event listener to listen for messages passed from the webview context and
   * executes code based on the message that is received.
   *
   * @param webview A reference to the extension webview
   */
  private _setWebviewMessageListener(webview: Webview) {
    webview.onDidReceiveMessage(
      async (message: any) => {
        const command = message.command;
        switch (command) {
          case "loadTestCases":
            this.loadTestCases(webview);
            return;
          case "runTestCases":
            await this.runTestCases(webview, 1000);
            return;
        }
      },
      undefined,
      this._disposables
    );
  }

  private loadTestCases(webview: Webview) {
    const testCases = this.getTestCases();
    webview.postMessage({
      type: "runner-command",
      command: "loadTestCases",
      value: { testCases: testCases, folderPath: ApiTesterRunner.folderPath },
    });
  }

  private getTestCases() {
    if (!ApiTesterRunner.folderPath) {
      return [];
    }
    var testCases = apitester.getJsonTestCasesFromFolder(ApiTesterRunner.folderPath, [
      ".test.json",
      ".apitester",
    ]);

    return testCases;
  }

  delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

  private async runTestCases(webview: Webview, testCaseDelay: number = 1000) {
    try {
      const testCases = this.getTestCases();
      const multiTestCaseResult = await apitester.runTestCases(testCases, async (cd) => {
        if (cd.type !== "after") {
          return;
        }
        await this.delay(testCaseDelay);
        webview.postMessage({
          type: "runner-command",
          command: "testCasesCallback",
          value: cd,
        });
        console.log("callback", cd);
      });

      webview.postMessage({
        type: "runner-command",
        command: "testCasesResult",
        value: multiTestCaseResult,
      });
    } catch (e) {
      console.error("ApiTesterRunner.runTestCases", e);
    }
  }
}
