'use strict';
import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import { DepNodeProvider } from './rootHandler';

const SUFFIX = '.md';

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
	const _filename = docPath.split("/").splice(-4, 4).join('') + SUFFIX;
	const _docFilePath = path.join(__filename, '..', '..', 'resources', 'doc', _filename);
	const _docContent = fs.readFileSync(_docFilePath, 'utf-8');
	console.log(_docContent);
}