# 处理用户事件

用户可以通过多种方式与小组件进行交互：

- 点击事件

- 属性菜单

- 文本编辑

- 打开 iframe

- Hover 悬停状态

## 点击事件

小组件可以注册响应用户事件的事件监听器，不过目前只支持小组件内节点上的`点击 onClick`事件。

```TypeScript
const { widget } = jsDesign
const { Text } = widget

function ConsoleWidget() {
  return <Text onClick={() => console.log('Hello!')}>点击按钮</Text>
}

widget.register(ConsoleWidget)
```

当用户点击小组件时，我们会运行传递给`onClick`的方法，然后终止小组件。

不过通常情况下，我们可能不希望点击后立即终止小组件代码的运行，比如会需要在点击后打开在 iframe 来执行更多操作，所以也支持了通过异步回调让小组件不被立即终止。

下面是一个在点击方法中使用 `async`/`wait` 的示例：

```TypeScript
const { widget } = jsDesign
const { Text } = widget

function AsyncClickWidget() {
  return (
    <Text
      onClick={async () => {
        const fonts = await jsDesign.listAvailableFontsAsync()
        // 这里加入需要执行的代码
      }}
    >
      点击按钮
    </Text>
  )
}

widget.register(AsyncClickWidget)
```

如果你的回调返回的是 Promise，那小组件只有在 Promise 被解决或调用`jsDesign.closePlugin()`时才会终止。

```TypeScript
const { widget } = jsDesign
const { Text } = widget

function PromiseWidget() {
  return (
    <Text
      onClick={() =>
        new Promise((resolve) => {
          setTimeout(() => {
            console.log('This is a delayed action')
            resolve(null)
          }, 1000)
        })
      }
    >
      点击按钮
    </Text>
  )
}

widget.register(PromiseWidget)
```

在上面的示例中，我们传递给组件的`onClick`没有接受任何参数，当然我们也可以通过传递给`onClick`参数来实现更多效果。

```TypeScript
const { widget } = jsDesign
const { Frame } = widget

function XYWidget() {
  return (
    <Frame
      width={200}
      height={200}
      fill="#f00"
      onClick={(event) => {
        // 通过 offsetX 和 offsetY 定位画板内容
        console.log('offset coords:', event.offsetX, event.offsetY)

        // 通过 canvasX 和 canvasY 定位小部件之外相对于画布位置的对象
        console.log('canvas coords:', event.canvasX, event.canvasY)
      }}
    />
  )
}
widget.register(XYWidget)
```

## 属性菜单

属性菜单是一个可选的菜单，可以在用户选中小组件时显示，如果有无法直接在小组件上完成的辅助操作（例如小组件设置）时使用属性菜单。

这是一个小组件的示例，它显示了一个包含两个项目的属性菜单：

```TypeScript
const { widget } = jsDesign
const { Text, usePropertyMenu } = widget

function PropertyMenuExample() {
  usePropertyMenu(
    [
      {
        tooltip: 'One',
        propertyName: 'one',
        itemType: 'action',
      },
      {
        tooltip: 'Two',
        propertyName: 'two',
        itemType: 'action',
      },
    ],
    (e) => {
      console.log(e.propertyName)
    },
  )

  return <Text>Select Me</Text>
}

widget.register(PropertyMenuExample)
```

有关属性菜单的相关 API 介绍，可查看 [小组件 API 手册 →](/developer-doc/widget/API/1.Reference/1.intro)

## iFrames

如果你的小组件需要实现更多复杂的功能，可以通过打开 iFrame 窗口来实现。

有关`ui.html`的介绍，可查看插件文档中的 [GUI 用户界面 →](/developer-doc/plugin/Guide/2.Development/2.GUI)

在`useEffects()`中使用`jsDesign.ui.onmessage`可以确保在小组件加载时处理程序被正常设置。

例如，通过从 iframe 接收的名称用于更新小组件中的`name`状态，在设置名称后，需要通过调用`jsDesign.closePlugin()`关闭 iframe。

```TypeScript
const { widget } = jsDesign
const { Text, useSyncedState, useEffect } = widget

function IFrameExample() {
  const [name, setName] = useSyncedState('name', '[Enter your name]')
  useEffect(() => {
    jsDesign.ui.onmessage = (message) => {
      if (message.type === 'name') {
        setName(message.name)
        jsDesign.closePlugin()
      }
    }
  })

  return (
    <Text
      onClick={() => {
        return new Promise((resolve) => {
          jsDesign.showUI(`
            <input id="name" type="text" placeholder="Name">
            <button id="submit">Submit</button>
            <script>
              document.getElementById('submit').onclick = () => {
                const textbox = document.getElementById('name')
                const name = textbox.value
                const message = { pluginMessage: {type: 'name', name} }
                parent.postMessage(message, '*')
              }
            </script>
        `)
        })
      }}
    >
      你好，{name}
    </Text>
  )
}

widget.register(IFrameExample)
```