import * as vscode from 'vscode';
import * as path from 'path';


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
		if (!this.workspaceRoot) {
			vscode.window.showInformationMessage('当前根目录为空');
			return Promise.resolve([]);
		}

		if (element) {
			const { data } = element;
			let _docKeys = Object.keys(data) ?? [];
			return Promise.resolve(_docKeys.map((_key: string) => {
				return typeof data[_key] === 'string' ?
					new Dependency(_key, data[_key], vscode.TreeItemCollapsibleState.None, {
						command: 'extension.openDoc',
						title: '',
						arguments: [data[_key]]
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


const doc: any = {
	'插件': {
		"开发者文档": {
			"开始使用": {
				"插件 API 简介": "/developer-doc/plugin/Guide/1.Start/Intro"
			},
			"开发指南": {
				"基础介绍": "/developer-doc/plugin/Guide/2.Development/1.Intro",
				"GUI 用户界面": "/developer-doc/plugin/Guide/2.Development/2.GUI",
				"访问及修改文件": "/developer-doc/plugin/Guide/2.Development/3.AccessingFile",
				"manifest.json": "/developer-doc/plugin/Guide/2.Development/4.manifest.json",
				"发送网络请求": "/developer-doc/plugin/Guide/2.Development/5.NetworkRequests",
				"插件的参数输入": "/developer-doc/plugin/Guide/2.Development/6.parameterOnly",
				"处理图片": "/developer-doc/plugin/Guide/2.Development/7.Working-with-Images",
				"处理文本内容": "/developer-doc/plugin/Guide/2.Development/8.Working-with-Text",
				"主题设置与 CSS 变量": "/developer-doc/plugin/Guide/2.Development/9.Theme",
				"颜色 Tokens 对照表": "/developer-doc/plugin/Guide/2.Development/ColorTokens"
			}
		},
		"插件开发指南": {
			"基础介绍": {
				"插件 API 概述": "/developer-doc/plugin/API/1.Reference/1.intro",
				"插件开发工具": "/developer-doc/plugin/API/1.Reference/2.Typings",
				jsDesign: "/developer-doc/plugin/API/1.Reference/3.jsDesign",
				"jsDesign.ui": "/developer-doc/plugin/API/1.Reference/4.jsDesign-ui",
				"jsDesign.parameters": "/developer-doc/plugin/API/1.Reference/5.jsDesign-parameters",
				"jsDesign.viewport": "/developer-doc/plugin/API/1.Reference/6.jsDesign-viewport",
				"jsDesign.clientStorage": "/developer-doc/plugin/API/1.Reference/7.jsDesign-clientStorage"
			},
			"节点相关": {
				"节点类型": "/developer-doc/plugin/API/2.Node-related/1.NodeType",
				"文件节点 DocumentNode": "/developer-doc/plugin/API/2.Node-related/2.DocumentNode",
				"页面节点 PageNode": "/developer-doc/plugin/API/2.Node-related/3.PageNode",
				"画板节点 FrameNode": "/developer-doc/plugin/API/2.Node-related/4.FrameNode",
				"分组节点 GroupNode": "/developer-doc/plugin/API/2.Node-related/5.GroupNode",
				"矩形节点 RectangleNode": "/developer-doc/plugin/API/2.Node-related/6.RectangleNode",
				"椭圆节点 EllipseNode": "/developer-doc/plugin/API/2.Node-related/7.EllipseNode",
				"线段节点 LineNode": "/developer-doc/plugin/API/2.Node-related/8.LineNode",
				"多边形节点 PolygonNode": "/developer-doc/plugin/API/2.Node-related/9.PolygonNode",
				"星形节点 StarNode": "/developer-doc/plugin/API/2.Node-related/10.StarNode",
				"文本节点 TextNode": "/developer-doc/plugin/API/2.Node-related/11.TextNode",
				"切片节点 SliceNode": "/developer-doc/plugin/API/2.Node-related/12.SliceNode",
				"矢量节点 VectorNode": "/developer-doc/plugin/API/2.Node-related/13.VectorNode",
				"布尔运算节点 BooleanOperationNode": "/developer-doc/plugin/API/2.Node-related/14.BooleanOperationNode",
				"引用组件节点 ComponentNode": "/developer-doc/plugin/API/2.Node-related/15.ComponentNode",
				"实例组件节点 InstanceNode": "/developer-doc/plugin/API/2.Node-related/16.InstanceNode",
				"变体节点 ComponentSetNode": "/developer-doc/plugin/API/2.Node-related/17.ComponentSetNode"
			},
			"样式相关": {
				"基础样式": "/developer-doc/plugin/API/3.Style-related/1.BaseStyle",
				"填充 Paint": "/developer-doc/plugin/API/3.Style-related/2.Paint",
				"填充样式 PaintStyle": "/developer-doc/plugin/API/3.Style-related/3.PaintStyle",
				"图片 Image": "/developer-doc/plugin/API/3.Style-related/4.Image",
				"特效 Effect": "/developer-doc/plugin/API/3.Style-related/5.Effect",
				"特效样式 EffectStyle": "/developer-doc/plugin/API/3.Style-related/6.EffectStyle",
				"网格布局 LayoutGrid": "/developer-doc/plugin/API/3.Style-related/7.LayoutGrid",
				"网格布局样式 GridStyle": "/developer-doc/plugin/API/3.Style-related/8.GridStyle",
				"文本样式 TextStyle": "/developer-doc/plugin/API/3.Style-related/9.TextStyle",
				"设置样式的文本段 StyledTextSegment": "/developer-doc/plugin/API/3.Style-related/10.StyledTextSegment",
				"文本子层 TextSublayer": "/developer-doc/plugin/API/3.Style-related/11.TextSublayer"
			},
			"其他": {
				"用户 User": "/developer-doc/plugin/API/4.Other/1.User",
				"矢量路径 VectorPath": "/developer-doc/plugin/API/4.Other/2.VectorPath",
				"矢量网格 VectorNetwork": "/developer-doc/plugin/API/4.Other/3.VectorNetwork",
				"曲线控制 HandleMirroring": "/developer-doc/plugin/API/4.Other/4.HandleMirroring",
				"混合模式 BlendMode": "/developer-doc/plugin/API/4.Other/5.BlendMode",
				"字体名称 FontName": "/developer-doc/plugin/API/4.Other/6.FontName",
				"字间距 LetterSpacing": "/developer-doc/plugin/API/4.Other/7.LetterSpacing",
				"行高 LineHeight": "/developer-doc/plugin/API/4.Other/8.LineHeight",
				"文本格式 TextCase": "/developer-doc/plugin/API/4.Other/9.TextCase",
				"文本装饰 TextDecoration": "/developer-doc/plugin/API/4.Other/10.TextDecoration",
				"超链接 HyperlinkTarget": "/developer-doc/plugin/API/4.Other/11.HyperlinkTarget",
				"响应式调整 Constraints": "/developer-doc/plugin/API/4.Other/12.Constraints",
				"辅助线 Guide": "/developer-doc/plugin/API/4.Other/13.Guide",
				"描边端点 StrokeCap": "/developer-doc/plugin/API/4.Other/14.StrokeCap",
				"描边顶点 StrokeJoin": "/developer-doc/plugin/API/4.Other/15.StrokeJoin",
				"RGB/RGBA": "/developer-doc/plugin/API/4.Other/16.RGB",
				"原型交互 - 触发 Trigger": "/developer-doc/plugin/API/4.Other/17.Trigger",
				"原型动作 Action": "/developer-doc/plugin/API/4.Other/18.Action",
				"原型交互 Reaction": "/developer-doc/plugin/API/4.Other/19.Reaction",
				"原型交互 - 过渡 Transition": "/developer-doc/plugin/API/4.Other/20.Transition",
				"弹层 Overlay": "/developer-doc/plugin/API/4.Other/21.Overlay",
				"溢出滚动 OverflowDirection": "/developer-doc/plugin/API/4.Other/22.OverflowDirection",
				"导出设置 ExportSettings": "/developer-doc/plugin/API/4.Other/23.ExportSettings"
			}
		}
	},
	'小组件': {
		"开发者文档": {
			"开始使用": {
				"小组件 API 简介": "/developer-doc/widget/Guide/1.Start/Intro"
			},
			"开发指南": {
				"基础介绍": "/developer-doc/widget/Guide/2.Development/1.Intro",
				"小组件 UI 及交互": "/developer-doc/widget/Guide/2.Development/2.UI",
				"小组件状态与多人操作": "/developer-doc/widget/Guide/2.Development/3.State-and-Multiplayer",
				"使用插件 API": "/developer-doc/widget/Guide/2.Development/4.Use-PluginAPI",
				"处理用户事件": "/developer-doc/widget/Guide/2.Development/5.Handling-User-Events",
				"文本编辑": "/developer-doc/widget/Guide/2.Development/6.TextEdit",
				"添加悬停状态": "/developer-doc/widget/Guide/2.Development/7.Hover",
				"发送网络请求": "/developer-doc/widget/Guide/2.Development/8.NetworkRequests",
				"使用列表": "/developer-doc/widget/Guide/2.Development/9.List",
				"小组件中的图片": "/developer-doc/widget/Guide/2.Development/10.Images",
				"管理多个小组件": "/developer-doc/widget/Guide/2.Development/11.Managing-Multiple-Widgets",
				"小组件的撤销和重做": "/developer-doc/widget/Guide/2.Development/12.Undo-and-Redo"
			}
		},
		"小组件开发指南": {
			"基础介绍": {
				"小组件 API 概述": "/developer-doc/widget/API/1.Reference/1.intro",
				"小组件开发工具": "/developer-doc/widget/API/1.Reference/2.Typings",
				"小组件 manifest": "/developer-doc/widget/API/1.Reference/3.manifest",
				"jsDesign.widget": "/developer-doc/widget/API/1.Reference/4.jsDesign.widget",
				register: "/developer-doc/widget/API/1.Reference/5.register",
				useWidgetId: "/developer-doc/widget/API/1.Reference/6.useWidgetId",
				useSyncedState: "/developer-doc/widget/API/1.Reference/7.useSyncedState",
				useSyncedMap: "/developer-doc/widget/API/1.Reference/8.useSyncedMap",
				usePropertyMenu: "/developer-doc/widget/API/1.Reference/9.usePropertyMenu",
				useEffect: "/developer-doc/widget/API/1.Reference/10.useEffect",
				waitForTask: "/developer-doc/widget/API/1.Reference/11.waitForTask"
			},
			"组件类型": {
				"自动布局 <AutoLayout />": "/developer-doc/widget/API/2.Component/1.AutoLayout",
				"画板 <Frame />": "/developer-doc/widget/API/2.Component/2.Frame",
				"文本 <Text />": "/developer-doc/widget/API/2.Component/3.Text",
				"矩形 <Rectangle />": "/developer-doc/widget/API/2.Component/4.Rectangle",
				"图片 <Image />": "/developer-doc/widget/API/2.Component/5.Image",
				"椭圆 <Ellipse />": "/developer-doc/widget/API/2.Component/6.Ellipse",
				"线段 <Line />": "/developer-doc/widget/API/2.Component/7.Line",
				"<SVG />": "/developer-doc/widget/API/2.Component/8.SVG",
				"输入 <Input />": "/developer-doc/widget/API/2.Component/9.Input",
				"<Fragment />": "/developer-doc/widget/API/2.Component/10.Fragment",
				"<Span />": "/developer-doc/widget/API/2.Component/11.Span"
			},
			"属性相关": {
				"对齐方式 AlignItems": "/developer-doc/widget/API/3.Property/1.AlignItems",
				"圆弧 ArcData": "/developer-doc/widget/API/3.Property/2.ArcData",
				"混合模式 BlendMode": "/developer-doc/widget/API/3.Property/3.BlendMode",
				"颜色 Color": "/developer-doc/widget/API/3.Property/4.Color",
				"约束 Constraint": "/developer-doc/widget/API/3.Property/5.Constraint",
				"圆角 CornerRadius": "/developer-doc/widget/API/3.Property/6.CornerRadius",
				"特效 Effect": "/developer-doc/widget/API/3.Property/7.Effect",
				"字重 FontWeight": "/developer-doc/widget/API/3.Property/8.FontWeight",
				"悬停样式 HoverStyle": "/developer-doc/widget/API/3.Property/9.HoverStyle",
				"边距 Padding": "/developer-doc/widget/API/3.Property/10.Padding",
				"填充 Paint": "/developer-doc/widget/API/3.Property/11.Paint",
				"属性菜单 PropertyMenu": "/developer-doc/widget/API/3.Property/12.PropertyMenu",
				"尺寸 Size": "/developer-doc/widget/API/3.Property/13.Size",
				"描边端点 StrokeCap": "/developer-doc/widget/API/3.Property/14.StrokeCap",
				"同步映射 SyncedMap": "/developer-doc/widget/API/3.Property/15.SyncedMap",
				"变换 Transform": "/developer-doc/widget/API/3.Property/16.Transform",
				"点击事件 WidgetClickEvent": "/developer-doc/widget/API/3.Property/17.WidgetClickEvent"
			}
		}
	}
}