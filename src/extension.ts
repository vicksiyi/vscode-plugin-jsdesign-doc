'use strict';

import * as vscode from 'vscode';

import { DepNodeProvider } from './rootHandler';

export function activate(context: vscode.ExtensionContext) {
	const rootPath = (vscode.workspace.workspaceFolders && (vscode.workspace.workspaceFolders.length > 0))
		? vscode.workspace.workspaceFolders[0].uri.fsPath : undefined;

	// Samples of `window.registerTreeDataProvider`
	const nodeDependenciesProvider = new DepNodeProvider(rootPath);
	vscode.window.registerTreeDataProvider('nodeDependencies', nodeDependenciesProvider);
	vscode.commands.registerCommand('extension.openDoc', openDocHandler);
}

/**
 * 打开查看文档
 * @param docPath 
 */
function openDocHandler(docPath: string) {
	vscode.window.showInformationMessage(docPath);
}