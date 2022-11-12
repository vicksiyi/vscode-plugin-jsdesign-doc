# 发送网络请求

使用小组件发送网络请求的机制与插件相似，我们需要创建一个`<iframe>`来访问相关的浏览器 API。

通过创建一个不可见的`<iframe>`作为进程，然后使用它发出网络请求，当获得到该网络请求的结果时，用它来设置和更新小组件的状态。

```TypeScript
const { widget } = jsDesign
const { Text, useSyncedState, useEffect, waitForTask } = widget

function NetworkWidget() {
  const [text, setText] = useSyncedState("text", "initial")

  useEffect(() => {
    waitForTask(new Promise(resolve => {
      jsDesign.showUI(__html__, { visible: false })
      jsDesign.ui.postMessage({ type: 'networkRequest' })

      jsDesign.ui.onmessage = async (msg) => {
        // 更新小组件状态
        setText(msg)
        
        resolve()
      }
    }))
  })
}

widget.register(NetworkWidget)
```

请求线程（不可见的`<iframe>`）通过在`manifest.json`中 UI 部分引用的单独 html 文件实现，只需要简单地创建一个标准的`XMLHttpRequest`并将结果发送回主线程即可。

```HTML
<script>
window.onmessage = async (event) => {
  if (event.data.pluginMessage.type === 'networkRequest') {
    var request = new XMLHttpRequest()
    request.open('GET', 'https://...')
    request.responseType = 'text'
    request.onload = () => {
      window.parent.postMessage({pluginMessage: request.response}, '*')
    };
    request.send()
  }
}
</script>
```

> 因为小组件在浏览器环境中运行，所以适用[跨源资源共享](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)策略。小组件 iframe 有一个空的 origin，所以只能使用`Access-Control-Allow-Origin：*`调用 API（即允许从任何源访问的 API）。