import { ExtensionContext } from "vscode";
import { ApiTesterEditor } from "./panels/ApiTesterEditor";

export function activate(context: ExtensionContext) {
  context.subscriptions.push(ApiTesterEditor.register(context));
}
