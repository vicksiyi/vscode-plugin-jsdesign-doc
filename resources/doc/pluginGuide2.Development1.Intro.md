# 基础介绍

为了更好地开始「即时设计」插件开发，建议提前准备好如下内容：

与「即时设计」本身一样，插件也是基于 Web 端，插件的功能及 GUI 开发会涉及到 JavaScript、HTML 及 CSS 等，所以在开始前，你可能需要了解以下相关知识：

- HTML：https://developer.mozilla.org/en-US/docs/Web/HTML

- JavaScript：https://developer.mozilla.org/en-US/docs/Web/JavaScript

- CSS：https://developer.mozilla.org/en-US/docs/Web/CSS

此外，还有一些非必须但是会对开发插件有较大帮助的相关技术，可以选择性地学习或使用：

- TypeScript：https://www.typescriptlang.org/zh/docs/

- Webpack：https://webpack.docschina.org/guides/getting-started/

- React：https://reactjs.org/docs/getting-started.html

- Vue：https://staging-cn.vuejs.org/guide/introduction.html

- 其他

## 准备工具

### Visual Studio Code

微软开发的跨平台免费源代码编辑器，非常适合用于插件开发，结合 TypeScript 和我们提供的代码类型提示包，可以实现非常便利地代码自动补全等功能，更高效地进行开发。

**官网下载：**https://code.visualstudio.com/download

当然，VSCode 并非硬性要求，其他支持 JavaScript 的编译器也可以。

### Node.js 和 NPM

一般 node.js 中都会包含 NPM，所以只要安装 node.js 即可。

**Node.js 官网下载：**https://nodejs.org/en/download/

### TypeScript

安装 NPM 之后，可以直接在终端中运行以下命令安装 TypeScript：

```bash
sudo npm install -g typescript
```

### 「即时设计」插件开发工具

我们提供了封装好的「即时设计」插件 API 代码类型提示包，可以通过 NPM 或者 yarn 安装并配合 VSCode 等编辑器使用，实现代码提示和自动补全，提高开发效率。

**安装命令：**

```bash
npm i --save-dev @jsdesigndeveloper/plugin-typings
# or
yarn add -D @jsdesigndeveloper/plugin-typings
```

### 「即时设计」客户端

这一步是**必须**的，因为插件的开发和测试都需要通过客户端读取本地代码。

可直接从官网下载并安装「即时设计」**最新版**客户端：

**下载地址：**https://js.design/download

## 插件相关配置及参考

### 配置 TypeScript

为了方便开发，在安装好 TypeScript 和「即时设计」插件 API 代码类型提示包后，还需要在 VSCode 中进行配置才可以正常使用，配置方式如下：

进入 VS Code，输入快捷键——

- macOS：`⌘` + `⇧` + `B`

- Windows：`Ctrl` + `Shift` + `B`

然后选择`tsc： watch - tsconfig.json`

这样 VSCode 即可实时完成从`code.ts`到`code.js`的转译，保证我们的代码文件正常运行和保存。

### 调试插件接口

如果需要在编写完整的代码前对接口进行测试，可以通过客户端的菜单 > 插件 > 开发者 > 控制台，打开开发人员工具，在控制台中直接调用 API 执行相关操作，确认效果。

![avatar](https://img.js.design/assets/developer-doc/plugin/images/Developement/devtools.png)

<p class="warn"><b>Tips</b></br>在进行开发调试前，请确保 vm 模式已设置为「开发模式」。<p>


### 插件设计规范

我们不对插件的 UI 进行任何限制，如果想为自己的插件设计一个精美的界面，请自由发挥，尽情施展自己或者团队设计师的设计功底，当然，我们给开发者提供了一份在「即时设计」中通用的设计规范，其中有常用的组件和相关规范，如果需要的话，可以自行下载：

• **即时设计插件规范（公开版）：**https://js.design/f/bK-Ao7

### 插件 Demo 参考

我们还给开发者准备了一些插件示例代码，其中包含了：

1. 有用户界面的插件（3 款）

2. 无用户界面的插件（2 款）

3. 需输入参数运行的插件（1 款）

如果有需要，可直接到 GitHub 中查看：[即时设计插件 Demo](https://github.com/jsdesigndev/plugin-samples)

## 插件结构介绍

### 全局变量：jsDesign

通过全局变量`jsDesign`可调用大部分插件 API，并访问文件内容。

<p class="warn"><b>Tips</b></br>为了方便 Figma 插件开发者测试自己的插件，我们同时支持了 figma 全局变量，可以直接导入 Figma 的插件文件或者在开发工具中调用。<p>

### 插件 API 支持访问的内容

- 设计文件画布内的所有图层，如：画板、形状、路径等

- 与图层相关的属性，如：颜色、位置、层次结构、文本等

- 设计文件的本地样式、组件、实例组件

- 即时设计中的默认字体、个人云端字体、团队共享字体，以及本地字体

### 插件 API 不支持访问的内容

- 文件中位于画布之外的任何内容

- 共享设计库中的样式、组件

- 与「即时设计」无关联的外部 Web 字体

- 其他文件元数据，如：用户信息、文件的协作信息、文件所在的文件夹位置、权限、版本历史记录或与文件相关的任何评论

### 节点树及节点层级结构

「即时设计」中的每个文件都包含一棵**节点树**，文件的根节点为`DocumentNode`，其余节点均作为文件节点的子节点存在，如页面节点、画板节点、组件节点等，需要按照**节点层级结构**访问文件中的内容。

**节点层级结构：** `DocumentNode` → `PageNode` → `FrameNode` → ……

![avatar](https://img.js.design/assets/developer-doc/plugin/images/Developement/1.png)

**节点层级对应的伪代码：**

```TypeScript
const root = {
  type: DocumentNode, // 文件节点
  children: [
    {
      type: PageNode, // 页面节点
      children: [
        {
          type: FrameNode, // 画板节点
          children: [
            {
              type: ComponentNode, // 组件节点
              children: [
                { type: EllipseNode },  // 椭圆节点
                { type: RectangleNode } // 矩形节点
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

- 在「即时设计」中，每个标签页仅对应一个文件节点`DocumentNode`

- 每个文件节点中必定存在页面节点`PageNode`

- 文件节点可以有任意数量的子节点

- 不同类型的节点均具备多种属性，其中**全局属性**存在于每个节点中，而其余**特定属性**仅存在于对应的节点类型中

- 每个节点的属性都可通过 API 进行访问，实现对「即时设计」文件内容的增、删、改、查，详情见 → [插件 API 手册](/developer-doc/plugin/API/1.Reference/1.intro)