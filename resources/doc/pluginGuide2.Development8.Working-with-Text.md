# 处理文本内容

在处理文本节点`TextNode`时，要考虑的内容较多（如混合样式、加载字体以及字体缺失），所以单独在这部分进行介绍。

## 混合样式

因为每个字符都可以设置多种文本样式，所以在获取文本节点的属性时，往往都会返回`jsDesign.mixed`，所以我们应该要默认文本属性会具有混合值。

例如，一个文本节点内容为 "**Hello** World"（Hello 加粗），在获取其属性时，会有如下几种结果：

```TypeScript
textNode.fontName;
// 输出：jsDesign.mixed

textNode.getRangeFontName(0, 5);
// 输出：{family: 'Inter', style: 'Bold'}

textNode.getRangeFontName(5, 11);
// 输出：{family: 'Inter', style: 'Regular'}

textNode.getRangeFontName(4, 6);
// 输出：jsDesign.mixed

textNode.getStyledTextSegments(['fontName']);
/*
输出：
[
  {
    characters: "hello",
    start: 0,
    end: 5,
    fontName: { family: 'Inter', style: 'Bold' },
  },
  {
    characters: " world",
    start: 5,
    end: 11,
    fontName: { family: 'Inter', style: 'Regular' },
  }
]
*/
```

在文本节点部分，有很多相关的属性和方法，可以分情况使用：

- 获取/设置整个文本节点的样式或检查是否有混合值时，建议直接调用文本属性（如`fontSize`、`fontName`等）；

- 获取/设置特定范围字符样式时，使用`getRange*`和`setRange*`对应的函数； 

- 查看属性值以及其适用于哪些字符时，使用`getStyledTextSegments`。

更多相关 API 详情，可查看 [插件 API 手册](/developer-doc/plugin/API/2.Node-related/11.TextNode)。

## 加载字体

文本节点在修改内容时，需要加载字体，比如修改`fontSize`时，没有先加载该文本节点的字体，插件会异常，所以这部分也很重要。

如果要设置`.fontName`或`.textStyleId`属性，只需要加载新字体即可；而设置如下影响文本布局的属性和功能时，则需要加载当前文本节点已使用的所有字体：

- `characters`

- `fontSize`

- `fontName`

- `textStyleId`

- `textCase`

- `textDecoration`

- `letterSpacing`

- `lineHeight`

- `setRangeFontSize()`

- `setRangeFontName()`

- `setRangeTextCase()`

- `setRangeTextDecoration()`

- `setRangeLetterSpacing()`

- `setRangeLineHeight()`

- `setRangeTextStyleId()`

相对应的，还有一些属性及方法在修改时，不需要加载文本节点的字体：

- `.fills`

- `.fillStyleId`

- `.setRangeFills()`

- `.strokes`

- `.strokeWeight`

- `.strokeAlign`

- `.strokeStyleId`

- `.dashPattern`

加载字体是通过`jsDesign.loadFontAsync(fontname)`方法。

对于包含单一字体的文本节点，可以调用`jsDesign.loadFontAsync(node.fontName)`；包含多种字体的节点，可以调用`getRangeAllFontNames`API 来获取节点使用的所有字体，示例：

```JavaScript
await Promise.all(
  node.getRangeAllFontNames(0, node.characters.length)
    .map(jsDesign.loadFontAsync)
)
```

## 字体缺失

在实际工作中，用户经常会在导入文件或移除权限时遇到字体不可用的情况，所以加载字体之前，需要通过`text.hasMissingFont`检查文本节点所对应的字体是否缺失。

### 未加载字体 Unloaded fonts

除了缺失字体外，还有一种情况是未加载字体，即字体依然存在，但是插件并不会加载该字体，直到调用`loadFontAsync`加载。