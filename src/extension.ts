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
		webview.html = this._getHtmlForWebview(webview);
	}

	private _getHtmlForWebview(webview: vscode.Webview) {
		const nonce = getNonce();
		const content = this._content;
		const contentHtml = marked.parse(content);

		// 基础
		const baseScriptPathOnDisk = vscode.Uri.joinPath(this._extensionUri, 'media', 'base.js');
		const baseScriptUri = webview.asWebviewUri(baseScriptPathOnDisk);
		const styleBasePath = vscode.Uri.joinPath(this._extensionUri, 'media', 'base.css');
		const styleBaseUri = webview.asWebviewUri(styleBasePath);

		// 代码高亮
		const highlightScriptPathOnDisk = vscode.Uri.joinPath(this._extensionUri, 'media', 'highlight.min.js');
		const highlightScriptUri = webview.asWebviewUri(highlightScriptPathOnDisk);
		const styleHighlightPath = vscode.Uri.joinPath(this._extensionUri, 'media', 'highlight.min.css');
		const styleHighlightUri = webview.asWebviewUri(styleHighlightPath);

		const html = `
			<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">

				<!--
					CSP策略：1.仅允许Https文件运行；2.仅仅允许插件目录文件运行；3.仅仅运行含有特殊的nonce
				-->
				<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; img-src ${webview.cspSource} https:; script-src 'nonce-${nonce}';">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<link href="${styleHighlightUri}" rel="stylesheet">
				<link href="${styleBaseUri}" rel="stylesheet">
			</head>
			<body>
				${contentHtml}
				<script nonce="${nonce}" src="${highlightScriptUri}"></script>
				<script nonce="${nonce}" src="${baseScriptUri}"></script>
			</body>
			</html>
		`;
		return html;
	}
}

function getNonce() {
	let text = '';
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < 32; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
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