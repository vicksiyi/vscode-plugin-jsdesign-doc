# 矢量节点 VectorNode

矢量节点通常有钢笔或铅笔工具创建，在用来绘制特定形状的元素时十分常用，既可以绘制单个顶点，也可以绘制不规则的线段和区域。

与分组类似，矢量节点`VectorNode`的位置和大小会随着其顶点自动调整，所以要注意在修改`vectorPaths`的相应数值后，对其整体位置的影响。



## 矢量属性

#### type: 'VECTOR' [readonly]

矢量节点对应的类型，由字符串`'VECTOR'`表示。



#### clone(): VectorNode

复制矢量节点。默认情况下，复制的节点将成为`jsDesign.currentPage`的子节点。



#### vectorNetwork: VectorNetwork

矢量网格相关属性，详情见`矢量网格`。



#### vectorPaths: VectorPaths

矢量路径相关属性，详情见`矢量路径`。



#### handleMirroring: HandleMirroring | PluginAPI['mixed'\]

矢量路径对应的曲线控制方式。



## 基础节点属性

#### id: string [readonly]

节点的 id，具有唯一性，插件一般需要通过 id 即可直接访问到节点。



#### parent: (BaseNode & ChildrenMixin) | null [readonly]

获取当前节点的父节点，如果不存在则返回`null`。



#### name: string

当前节点在图层面板中所显示的名称。



#### removed: boolean [readonly]

判断节点是否已被删除。



#### toString(): string

获取节点的字符串表示形式。



#### remove(): void

删除当前节点**及其所有子节点**。



#### setRelaunchData(data: { [command: string]: string }): void

设置重启插件相关数据，在选择节点时显示按钮和说明。



#### getRelaunchData(): { [command: string]: string }

获取当前节点上设置的`setRelaunchData`数据。



#### setPluginData(key: string, value: string): void

通过设置`key`在节点或样式上保存自定义信息，**完全私有，仅对你的插件生效**。



#### getPluginData(key: string): string

获取当前节点或样式上保存的自定义信息。



#### getPluginDataKeys(): string[]

获取当前节点或样式上的所有自定义信息对应`key`的列表。



#### setSharedPluginData(namespace: string, key: string, value: string): void

通过设置`key`在节点或样式上保存自定义信息，**公开给所有插件**。



#### getSharedPluginData(namespace: string, key: string): string

获取当前节点或样式上保存的公开的自定义信息。



#### getSharedPluginDataKeys(namespace: string): string[]

获取当前节点或样式上的所有公开的自定义信息对应`key`的列表。



## 画面节点属性

#### visible: boolean

设置节点是否可见（显示/隐藏），不影响插件访问节点。



#### locked: boolean

设置节点是否被锁定，防止用户在画布上的某些交互，如选择和拖动。不影响插件修改节点属性。



## 混合相关属性

#### opacity: number

节点的不透明度，须在 0 到 1 之间。



#### blendMode: 'NORMAL' | BlendMode

节点的混合模式，如正常、变暗、正片叠底等。



#### isMask: boolean

节点是否为蒙版。



#### isHideMaskLayer: boolean

创建为蒙版后，是否隐藏蒙版层，同时保持蒙版生效。



#### effects: ReadonlyArray\<Effect\>

节点的特效，即阴影、模糊效果。



#### effectStyleId: string

阴影或模糊样式 ID 。



## 圆角相关属性

#### cornerRadius: number | PluginAPI['mixed']

圆角半径。



#### cornerSmoothing: number

平滑圆角所对应的数值，范围从 0 到 1，常用的 iOS 规范为 0.6 。



## 图形相关属性

#### fills: ReadonlyArray\<Paint\> | PluginAPI['mixed']

图形的填充属性。



#### fillStyleId: string | PluginAPI['mixed']

填充样式 ID 。



#### fillGeometry: VectorPaths

填充对应的矢量路径。



#### strokes: ReadonlyArray\<Paint\>

图形的描边属性。



#### strokeStyleId: string

描边样式 ID 。



#### strokeWeight: number

描边的粗细数值。



#### strokeJoin: StrokeJoin | PluginAPI['mixed']

描边的顶点。



#### strokeAlign: 'CENTER' | 'INSIDE' | 'OUTSIDE'

描边的对齐方式，居中、内部、外部。



#### dashPattern: ReadonlyArray\<number\>

虚线描边对应的间隙数值。



#### strokeGeometry: VectorPaths

描边对应的矢量路径。



#### strokeCap: StrokeCap | PluginAPI['mixed']

描边的端点。



#### outlineStroke(): VectorNode | null

描边轮廓化的方法。



## 布局相关属性

#### absoluteTransform: Transform [readonly]

节点相对于包含它的页面的位置，返回对应的变换矩阵。



#### relativeTransform: Transform

节点相对于其父节点的位置，返回对应的变换矩阵。



#### x: number

节点的 x 轴位置，等价于`relativeTransform[0][2]`。



#### y: number

节点的 y 轴位置，等价于`relativeTransform[1][2]`。



#### rotation: number

节点的旋转角度，以度为单位，返回 -180 到180 之间的值。



#### width: number [readonly]

节点的宽度。



#### height: number [readonly]

节点的高度。



#### absoluteRenderBounds: Rect | null [readonly]

节点的实际边界，受阴影、模糊等属性影响。



#### constrainProportions: boolean

是否固定图层的宽高比例。



#### layoutAlign: 'MIN' | 'CENTER' | 'MAX' | 'STRETCH' | 'INHERIT'

自动布局相关属性，确定对齐方式。



#### layoutGrow: number

自动布局相关属性，确定拉伸方式，0 为固定，1 为自适应。



#### resize(width: number, height: number): void

调整节点尺寸的方法，会影响子级。



#### resizeWithoutConstraints(width: number, height: number): void

调整节点尺寸的方法， 不会影响子级。



#### rescale(scale: number): void

重新缩放节点，对应缩放工具。



#### constraints: Constraints

当前节点相对于包含其的画板节点`FrameNode`的响应式调整/约束设置。



## 导出相关属性

#### exportSettings: ReadonlyArray\<ExportSettings\>

节点的导出设置。



#### exportAsync(settings?: ExportSettings): Promise\<Uint8Array\>

将节点导出为对应编码的图片。



## 原型交互相关属性

#### reactions: ReadonlyArray\<Reaction\>

原型中与当前节点交互的方式及动作。



## 画板相关的原型属性

#### overflowDirection: OverflowDirection

溢出滚动设置。



#### numberOfFixedChildren: number

滚动时固定位置的子级。



#### overlayPositionType: OverlayPositionType [readonly]

弹层打开的位置。



#### overlayBackground: OverlayBackground [readonly]

弹层的背景遮罩设置。



#### overlayBackgroundInteraction: OverlayBackgroundInteraction [readonly]

弹层的交互方式。