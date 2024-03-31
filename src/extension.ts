import { commands, ExtensionContext, window } from "vscode";
import { ApiTesterEditor } from "./panels/ApiTesterEditor";
import { ApiTesterRunner } from "./panels/ApiTesterRunner";

export function activate(context: ExtensionContext) {
  context.subscriptions.push(ApiTesterEditor.register(context));

  const showHelloWorldCommand = commands.registerCommand(
    "quester.apitesterRunner.open",
    (...args) => {
      ApiTesterRunner.render(context.extensionUri, args[0]);
    }
  );

  context.subscriptions.push(showHelloWorldCommand);
}
