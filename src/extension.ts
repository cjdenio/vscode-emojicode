import * as vscode from "vscode";
import * as fs from "fs";
import * as os from "os";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand("vscode-emojicode.runProgram", async () => {
      const dir = await fs.promises.mkdtemp(os.tmpdir());
      const file = vscode.window.activeTextEditor?.document.fileName;

      await vscode.window.activeTextEditor?.document.save();

      const task = new vscode.Task(
        {
          type: "Emojicode",
        },
        (vscode.workspace.workspaceFolders as vscode.WorkspaceFolder[])[0],
        "Run Emojicode program",
        "Emojicode",
        new vscode.ShellExecution(
          `emojicodec "${file}" -o "${dir}/out" && ${dir}/out && rm -rf ${dir}`
        )
      );

      task.presentationOptions.focus = false;

      await vscode.tasks.executeTask(task);
    })
  );

  context.subscriptions.push(
    vscode.languages.registerCodeLensProvider("emojicode", {
      provideCodeLenses(document, _token) {
        return [
          new vscode.CodeLens(document.lineAt(0).range, {
            title: "Run Emojicode program",
            command: "vscode-emojicode.runProgram",
          }),
        ];
      },
    })
  );
}

export function deactivate() {
  console.log("deactivate");
}
