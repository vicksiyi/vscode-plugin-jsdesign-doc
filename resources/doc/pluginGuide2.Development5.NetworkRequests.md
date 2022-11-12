# 发送网络请求

在「即时设计」插件中发送网络请求的方法与直接在浏览器中运行相应 JavaScript 的方式基本一致，且使用的 API 由浏览器而非「即时设计」提供。

调用浏览器 API 的方式我们前面也有提到，需要通过`<iframe>`访问，如果你的插件不需要用户界面，也可以通过创建一个不可见的`<iframe>`来发送网络请求。

示例如下，当通过网络请求获得结果时，创建一个包含响应内容的文本节点。

```TypeScript
jsDesign.showUI(__html__, { visible: false })
jsDesign.ui.postMessage({ type: 'networkRequest' })

jsDesign.ui.onmessage = async (msg) => {
  const text = jsDesign.createText()
  // 确保新建的文本节点在画布区域可见
  text.x = jsDesign.viewport.center.x
  text.y = jsDesign.viewport.center.y

  await jsDesign.loadFontAsync(text.fontName as FontName)
  text.characters = msg

  jsDesign.closePlugin()
}
```

对应的不可见的`<iframe>`同样和其他用户界面一样，需要在`manifest.json`中引用 HTML 文件，而实际使用时，我们只需要用它来执行`XMLHttpRequest`并返回结果即可。

```HTML
<script>
window.onmessage = async (event) => {
  if (event.data.pluginMessage.type === 'networkRequest') {
    var request = new XMLHttpRequest()
    // 这个链接会返回随机的文本内容
    request.open('GET', 'https://cors-anywhere.herokuapp.com/http://www.randomtext.me/download/text/lorem/ul-8/5-15')
    request.responseType = 'text'
    request.onload = () => {
      window.parent.postMessage({pluginMessage: request.response}, '*')
    };
    request.send()
  }
}
</script>
```