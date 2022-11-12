# 文本编辑

## \<Input /\> 组件

要允许用户直接在小组件中输入文本，可以使用`<Input />`组件。

Input 组件提供了一个`onTextEditEnd`回调，当用户退出 Input 组件时触发该回调。

Input 组件也可以设置样式：

- 文本

- 占位符（通过`placeholderProps`）

- 外层画板（通过`inputFrameProps`）

## 示例

我们可以使用`useSyncedState`或`useSyncedMap``）`来存储 Input 组件显示的文本，然后在`onTextEditEnd`回调中更新它们。

使用 Input 组件的示例：

```TypeScript
const { widget } = jsDesign
const { useSyncedState, AutoLayout, Input } = widget

function InputWidget() {
  const [text, setText] = useSyncedState("text", "")

  return (
    <Input
      value={text}
      placeholder="输入文本"
      onTextEditEnd={(e) => {
        setText(e.characters);
      }}
      fontSize={64}
      fill="#7f1d1d"
      width={500}
      inputFrameProps={{
        fill: "#F2F2F2",
        stroke: "#3C6CC7",
        cornerRadius: 8,
        padding: 20,
      }}
      inputBehavior="wrap"
    />
  )
}

widget.register(InputWidget)
```