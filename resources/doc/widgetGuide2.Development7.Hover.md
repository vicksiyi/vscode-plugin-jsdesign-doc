# 添加悬停状态

任何组件都可以使用可选的`hoverStyle`属性来进行属性覆盖，当用户鼠标指针悬停在父级上时，应用这些覆盖属性。

组件的 hoverStyle 属性接受`HoverStyle`类型，并且是仅有的可被覆盖的属性有：

- 填充`fill`

- 描边`stroke`

- 不透明度`opacity`

目前所有具有`onClick`或`onTextEditEnd`事件的组件都可以成为**悬停目标**，当用户悬停在悬停目标上时，将递归应用目标及其所有子级的悬停样式，除非它们位于当前未悬停的**悬停目标**中。

## 示例

在下面的示例中，将鼠标悬停在按钮上会使包含的自动布局`AutoLayout`画板变黑，其子级的文本变白。

```TypeScript
const { widget } = jsDesign
const { useSyncedState, AutoLayout, Text } = widget

function Widget() {
  const [count, setCount] = useSyncedState('count', 0)

  return (
    <AutoLayout
      verticalAlignItems={'center'}
      spacing={8}
      padding={16}
      cornerRadius={8}
      fill={'#FFFFFF'}
      stroke={'#E6E6E6'}
      onClick={() => setCount(count + 1)}
      hoverStyle={{
        fill: '#000000',
      }}
    >
      <Text
        fill="#000000"
        hoverStyle={{
          fill: '#FFFFFF',
        }}
      >
        Count: {String(count)}
      </Text>
    </AutoLayout>
  )
}

widget.register(Widget)
```