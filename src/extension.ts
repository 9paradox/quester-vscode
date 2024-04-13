import { commands, ExtensionContext, Uri, window } from "vscode";
import { ApiTesterEditor } from "./panels/ApiTesterEditor";
import { ApiTesterRunner } from "./panels/ApiTesterRunner";
import * as fs from "fs";
import * as path from "path";

export function activate(context: ExtensionContext) {
  context.subscriptions.push(ApiTesterEditor.register(context));

  const questerRunnerCommand = commands.registerCommand(
    "quester.apitesterRunner.open",
    (...args) => {
      ApiTesterRunner.render(context.extensionUri, args[0]);
    }
  );

  context.subscriptions.push(questerRunnerCommand);

  let createFileCommand = commands.registerCommand("quester.apitesterEditor.new", (...args) => {
    createApitesterFile(args[0]);
  });

  context.subscriptions.push(createFileCommand);
}

async function createApitesterFile(folderUri: Uri) {
  const folderPath = folderUri.fsPath;
  const inputFileName = await window.showInputBox({
    prompt: "Enter the name for the new apitester file (without any extension)",
    validateInput: (value) => {
      if (!value.trim()) {
        return "File name cannot be empty";
      }
      return null;
    },
  });

  if (inputFileName) {
    const testCaseFileName = inputFileName.trim().replace(/\s+/g, "-").toLowerCase();
    const newJsonFilePath = path.join(folderPath, testCaseFileName + ".apitester");
    fs.writeFileSync(newJsonFilePath, `{ "title": "${inputFileName}", "steps": [] }`);
    window.showInformationMessage("New apitester file created successfully!");
  }
}
