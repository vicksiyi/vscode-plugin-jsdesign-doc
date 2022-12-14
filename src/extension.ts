'use strict';
import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import { marked } from 'marked';
import { DepNodeProvider } from './rootHandler';
import { searchFiles } from './search';
import { doc, fileNameHandler, generateSearchContent, getDocFlat } from './common';

const openDocCommand = 'extension.openDoc';
const searchCommand = 'jsDesignAPI.search';

export function activate(context: vscode.ExtensionContext) {
	const rootPath = (vscode.workspace.workspaceFolders && (vscode.workspace.workspaceFolders.length > 0))
		? vscode.workspace.workspaceFolders[0].uri.fsPath : undefined;


	const jsDesignDocProvider = new DepNodeProvider(rootPath);
	const registerTreeDataProvider = vscode.window.registerTreeDataProvider('jsDesignDocProvider', jsDesignDocProvider);
	const registerCommandOpenDoc = vscode.commands.registerCommand(openDocCommand, (docPath: string) => {
		const _filename = fileNameHandler(docPath);
		const _docFilePath = path.join(__filename, '..', '..', 'resources', 'doc', _filename);
		const _docContent = fs.readFileSync(_docFilePath, 'utf-8');
		// 显示webview
		APIDocPanel.createOrShow(context.extensionUri, _docContent);
	});
	// 搜索文档
	const registerCommandSearch = vscode.commands.registerCommand(searchCommand, () => {
		const searchOptions: vscode.InputBoxOptions = {
			title: '即时设计-API文档',
			placeHolder: '搜索关键词',
			prompt: '*Required',
		};
		vscode.window.showInputBox(searchOptions).then((searchQuery: string | undefined) => {
			if (!searchQuery) return;
			const _files = searchFiles(searchQuery);
			const _docFlat = getDocFlat();
			const _searchResult: keyStrAndValStr = {};
			// 符合条件的文档名称
			const _keys = (Object.keys(_docFlat) ?? []).filter(_key => _files.includes(fileNameHandler(_docFlat[_key])));
			_keys.forEach(_key => _searchResult[_key] = _docFlat[_key]);
			const mdResult = generateSearchContent(_searchResult);
			// 显示webview
			APIDocPanel.createOrShow(context.extensionUri, mdResult);
		})
	})
	context.subscriptions.push(registerTreeDataProvider);
	context.subscriptions.push(registerCommandOpenDoc);
	context.subscriptions.push(registerCommandSearch);
}

class APIDocPanel {
	public static currentPanel: APIDocPanel | undefined;
	public static readonly viewType = 'jsDesign.APIDoc';
	private readonly _panel: vscode.WebviewPanel;
	private _content: string;
	private readonly _extensionUri: vscode.Uri;
	private _disposables: vscode.Disposable[] = [];

	public static createOrShow(extensionUri: vscode.Uri, content: string) {
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

		APIDocPanel.currentPanel = new APIDocPanel(panel, extensionUri, content);
	}

	private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri, content: string) {
		this._panel = panel;
		this._extensionUri = extensionUri;
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

		// 监听消息
		this._panel.webview.onDidReceiveMessage(
			message => {
				switch (message?.command) {
					case 'tips-success':
						vscode.window.showInformationMessage(message?.text);
						return;
					case 'tips-error':
						vscode.window.showErrorMessage(message?.text);
						return;
					case 'navigate':
						this._navigateHandler(message?.url);
				}
			},
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

	private _navigateHandler(url: string) {
		if (url.startsWith('/developer-doc')) vscode.commands.executeCommand(openDocCommand, url);
		else vscode.commands.executeCommand('vscode.open', vscode.Uri.parse(url));
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