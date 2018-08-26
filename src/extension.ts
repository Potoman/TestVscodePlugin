'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

function getTerminal() {
    let terminalFound = vscode.window.terminals.find(terminal => terminal.name === "Test");
    if (terminalFound) {
        return terminalFound;
    }
    return vscode.window.createTerminal("Test")
}

function execute(cmd : string) {
    let terminal = getTerminal();
    terminal.show(true);
    terminal.sendText(cmd);
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "testt2" is now active!');


    let listenerRemoveDirectory = vscode.workspace.onDidChangeWorkspaceFolders(e => {
        e.added.forEach(element => {
            execute("echo add : " + element.uri);
        });
        e.removed.forEach(element => {
            execute("echo remove : " + element.uri);
        });
    });

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposableAddDirectory = vscode.commands.registerCommand('extension.addDirectory', () => {
        vscode.window.showOpenDialog({
            canSelectFiles : false,
            canSelectFolders : true,
            canSelectMany : true
        }).then(value => {
            if (value) {
                value.forEach(element => {
                    execute("add directory " + element.path);
                });
            } else {
                vscode.window.showInformationMessage("echo No value for 'Add directory'.");
            }
        });
    });

    let disposableAddModule = vscode.commands.registerCommand('extension.addModule', () => {
        vscode.window.showInputBox().then(value => {
            if (value) {
                execute("add module " + value);
            } else {
                vscode.window.showInformationMessage("echo No value for 'Add module'.");
            }
        });
    });

    let disposableRemoveModule = vscode.commands.registerCommand('extension.removeModule', () => {
        vscode.window.showInputBox().then(value => {
            if (value) {
                execute("remove " + value);
            } else {
                execute("echo No value for 'Remove module'.");
            }
        });
    });


    context.subscriptions.push(disposableAddDirectory);
    context.subscriptions.push(disposableAddModule);
    context.subscriptions.push(disposableRemoveModule);
    context.subscriptions.push(listenerRemoveDirectory);
}

// this method is called when your extension is deactivated
export function deactivate() {
    console.log('Congratulations, your extension "testt2" is now deactivate');
    getTerminal().dispose();
}