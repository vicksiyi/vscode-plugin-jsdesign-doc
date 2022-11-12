# 小组件开发工具

与插件一样，为了提高开发效率，我们也提供了封装好的「即时设计」小组件代码类型提示包，用于实现代码提示及自动补全等效果。

## **安装代码类型提示包**

```Bash
# 小组件 API
npm i --save-dev @jsdesigndeveloper/widget-typings
## or
yarn add -D @jsdesigndeveloper/widget-typings

# 插件 API
npm i --save-dev @jsdesigndeveloper/plugin-typings
## or
yarn add -D @jsdesigndeveloper/plugin-typings
```

## **编译配置**

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
