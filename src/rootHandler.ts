import * as vscode from 'vscode';
import * as path from 'path';
import { doc } from './common';


export class DepNodeProvider implements vscode.TreeDataProvider<Dependency> {

	private _onDidChangeTreeData: vscode.EventEmitter<Dependency | undefined | void> = new vscode.EventEmitter<Dependency | undefined | void>();
	readonly onDidChangeTreeData: vscode.Event<Dependency | undefined | void> = this._onDidChangeTreeData.event;

	constructor(private workspaceRoot: string | undefined) {
	}

	refresh(): void {
		this._onDidChangeTreeData.fire();
	}

	getTreeItem(element: Dependency): vscode.TreeItem {
		return element;
	}

	getChildren(element?: Dependency): Thenable<Dependency[]> {
		if (element) {
			const { data } = element;
			let _docKeys = Object.keys(data) ?? [];
			return Promise.resolve(_docKeys.map((_key: string) => {
				return typeof data[_key] === 'string' ?
					new Dependency(_key, data[_key], vscode.TreeItemCollapsibleState.None, {
						command: 'extension.openDoc',
						title: '',
						arguments: [data[_key], _key]
					})
					:
					new Dependency(_key, data[_key], vscode.TreeItemCollapsibleState.Collapsed);
			}));
		} else {
			let _docKeys = Object.keys(doc) ?? [];
			return Promise.resolve(_docKeys.map((_key: string) => {
				return new Dependency(_key, doc[_key], vscode.TreeItemCollapsibleState.Collapsed);
			}));
		}

	}

	getDocKey(path: string, obj: any): string[] {
		if (!path) return Object.keys(obj);
		let _splitPath = path.split('/');
		let _key = _splitPath.shift() ?? '';
		return this.getDocKey(_splitPath.join('/'), obj[_key]);
	}
}

export class Dependency extends vscode.TreeItem {

	constructor(
		public readonly label: string,
		public readonly data: any,
		public readonly collapsibleState: vscode.TreeItemCollapsibleState,
		public readonly command?: vscode.Command
	) {
		super(label, collapsibleState);

		this.tooltip = `${this.label}`;
		this.description = '';
	}

	iconPath = {
		light: path.join(__filename, '..', '..', 'resources', 'icon', 'light', typeof this.data === 'string' ? 'doc.svg' : 'folder.svg'),
		dark: path.join(__filename, '..', '..', 'resources', 'icon', 'dark', typeof this.data === 'string' ? 'doc.svg' : 'folder.svg')
	};

	contextValue = 'dependency';
}