# 基础介绍

小组件的开发步骤与插件开发非常接近，如果你已经很熟悉「即时设计」的插件开发，可以随时跳过下面的内容。

## 准备工具

### **Visual Studio Code**

微软开发的跨平台免费源代码编辑器，非常适合用于插件开发，结合 TypeScript 和我们提供的代码类型提示包，可以实现非常便利地代码自动补全等功能，更高效地进行开发。

**官网下载：**https://code.visualstudio.com/download

当然，VSCode 并非硬性要求，其他支持 JavaScript 的编译器也可以。

### **Node.js 和 NPM**

一般 node.js 中都会包含 NPM，所以只要安装 node.js 即可。

**Node.js 官网下载：**https://nodejs.org/en/download/

### **TypeScript**

安装 NPM 之后，可以直接在终端中运行以下命令安装 TypeScript：

```Bash
sudo npm install -g typescript
```

### **「即时设计」小组件开发工具**

我们提供了封装好的「即时设计」小组件 API 代码类型提示包，可以通过 NPM 或者 yarn 安装并配合 VSCode 等编辑器使用，实现代码提示和自动补全，提高开发效率。

如果在开发中需要用到插件 API，可以同时安装插件对应的提示包。

**安装命令：**

```Bash
# 小组件
npm i --save-dev @jsdesigndeveloper/widget-typings
## or
yarn add -D @jsdesigndeveloper/widget-typings

# 插件
npm i --save-dev @jsdesigndeveloper/plugin-typings
## or
yarn add -D @jsdesigndeveloper/plugin-typings
```

### **「即时设计」客户端**

这一步是**必须**的，因为插件的开发和测试都需要通过客户端读取本地代码。

可直接从官网下载并安装「即时设计」**最新版**客户端：

**下载地址：**https://js.design/download

## 开发相关配置

### **配置 TypeScript**

为了方便开发，在安装好 TypeScript 和「即时设计」插件 API 代码类型提示包后，还需要在 VSCode 中进行配置才可以正常使用，配置方式如下：

进入 VS Code，输入快捷键——

- macOS：`⌘` + `⇧` + `B`

- Windows：`Ctrl` + `Shift` + `B`

然后选择`tsc： watch - tsconfig.json`

这样 VSCode 即可实时完成从`code.ts`到`code.js`的转译，保证我们的代码文件正常运行和保存。

```JSON
{
   "compilerOptions": {
      "jsx": "react",
      "jsxFactory": "jsDesign.widget.h",
      "jsxFragmentFactory": "jsDesign.widget.Fragment",
      "target": "es6",
      "strict": true,
      "typeRoots": [
         "./node_modules/@types",
         "./node_modules/@jsDesign"
      ]
   }
}
```

### **调试插件接口**

如果需要在编写完整的代码前对接口进行测试，可以通过客户端的菜单 > 小组件 > 开发者 > 控制台，打开开发人员工具，在控制台中直接调用 API 执行相关操作，确认效果。

## 创建小组件

1. 打开并登录「即时设计」客户端，进入任意文件;

1. 在菜单栏中选择 小组件 > 开发者 > 创建小组件；

1. 按照引导输入小组件信息；

1. 保存文件到本地任意位置即可完成创建。

## 导入已有小组件

1. 打开并登录「即时设计」客户端;

1. 在菜单栏中选择 小组件 > 开发者 > 从 manifest 导入插件；

1. 选择本地已有的即时设计或 Figma 小组件目录，打开 manifest.json 文件即可完成导入。

<p class="warn"><b>Tips</b></br>和插件一样，我们同时兼容 Figma 小组件，可以直接导入 Figma 的代码文件运行和调试。<p>

## 运行小组件

插件创建/导入完成后，在编辑页中通过工具栏按钮（或文件菜单）打开小组件目录（快捷键 E），将筛选项切换为开发中，即可查看已添加的小组件，拖拽置入画布后可使用。

![avatar](https://img.js.design/assets/developer-doc/widget/images/intro/developWidget.png)