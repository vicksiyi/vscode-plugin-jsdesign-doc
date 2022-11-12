'use strict';
import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import { marked } from 'marked';
import { DepNodeProvider } from './rootHandler';

const SUFFIX = '.md';

export function activate(context: vscode.ExtensionContext) {
	const rootPath = (vscode.workspace.workspaceFolders && (vscode.workspace.workspaceFolders.length > 0))
		? vscode.workspace.workspaceFolders[0].uri.fsPath : undefined;

	// Samples of `window.registerTreeDataProvider`
	const jsDesignDocProvider = new DepNodeProvider(rootPath);
	vscode.window.registerTreeDataProvider('jsDesignDocProvider', jsDesignDocProvider);
	vscode.commands.registerCommand('extension.openDoc', (docPath: string, title: string) => {
		const _filename = docPath.split("/").splice(-4, 4).join('') + SUFFIX;
		const _docFilePath = path.join(__filename, '..', '..', 'resources', 'doc', _filename);
		const _docContent = fs.readFileSync(_docFilePath, 'utf-8');
		// 显示webview
		APIDocPanel.createOrShow(context.extensionUri, title, _docContent);
	});
}

class APIDocPanel {
	public static currentPanel: APIDocPanel | undefined;
	public static readonly viewType = 'jsDesign.APIDoc';
	private readonly _panel: vscode.WebviewPanel;
	private _title: string;
	private _content: string;
	private readonly _extensionUri: vscode.Uri;
	private _disposables: vscode.Disposable[] = [];

	public static createOrShow(extensionUri: vscode.Uri, title: string, content: string) {
		const column = vscode.window.activeTextEditor
			? vscode.window.activeTextEditor.viewColumn
			: undefined;
		// 如果已经存在，则直接显示
		if (APIDocPanel.currentPanel) {
			APIDocPanel.currentPanel._content = content;
			APIDocPanel.currentPanel._update();
			APIDocPanel.currentPanel._panel.reveal(column);
			return;
		}

		// 如果不存在，则创建一个新的webview
		const panel = vscode.window.createWebviewPanel(
			APIDocPanel.viewType,
			'即时设计API文档',
			column || vscode.ViewColumn.One,
			getWebviewOptions(extensionUri)
		);

		APIDocPanel.currentPanel = new APIDocPanel(panel, extensionUri, title, content);
	}

	private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri, title: string, content: string) {
		this._panel = panel;
		this._extensionUri = extensionUri;
		this._title = title;
		this._content = content;

		// 设置webview显示内容
		this._update();
		this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
		// 监听可视状态
		this._panel.onDidChangeViewState(
			e => { if (this._panel.visible) { this._update(); } },
			null,
			this._disposables
		);
	}

	public dispose() {
		APIDocPanel.currentPanel = undefined;

		// 清空资源
		this._panel.dispose();

		while (this._disposables.length) {
			const x = this._disposables.pop();
			if (x) { x.dispose(); }
		}
	}

	private _update() {
		const webview = this._panel.webview;
		webview.html = this._getHtmlForWebview();
	}

	private _getHtmlForWebview() {
		const content = this._content;
		const html = marked.parse(content);
		return html;
	}
}

/**
 * webview配置项
 * @param extensionUri 
 * @returns 
 */
function getWebviewOptions(extensionUri: vscode.Uri): vscode.WebviewOptions {
	return {
		enableScripts: true,
		localResourceRoots: [extensionUri]
	};
}