# 小组件的撤销和重做

小组件撤销（undo）和重做（redo）的方式与常规的元素不同，小组件始终都是在渲染其同步状态，而当用户执行撤销和重做操作时，小组件的状态会相应更新，小组件会重新渲染以反映新状态。

## 运作方式

每个用户都有自己的撤销/重做堆栈，它记录的是对`useSyncedState`和`useSyncedMap`变量的更改。

例如，如果你的小组件使用以下 Hook：

```TypeScript
const { widget } = jsDesign
const { AutoLayout, useSyncedState, useSyncedMap } = widget

function UndoWidget() {
  const [count, setCount] = useSyncedState("count", 0)
  const [countMap] = useSyncedMap("countMap")

  return (
    <AutoLayout
      onClick={() => {
        countMap.set("userA", 1)
        countMap.set("userB", 2)
      }}
    >
      {String(count)}
    </AutoLayout>
  )
}

jsDesign.widget.register(UndoWidget)
```

这个映射可视化如下（用户点击小组件后）：

```JSON
{
  "count": 0,
  "countMap-userA": 1,
  "countMap-userB": 2
}
```

当用户与导致同步变量更改的小组件交互时，我们会记录更改的内容，在用户进行撤销操作后，会将记录的操作作为更改项应用于现有映射，并重新渲染小组件。

## useSyncedMap 和 useSyncedState

当我们想保留用户特定的对象/值时，需要用到`useSyncedMap`，以便在多人协作场景中正确应用来自多个用户的值。

而和之前提到的一样，有些单一结果的协作场景下，依然可以使用`useSyncedState`，例如修改主题，当用户 A 将主题值从「红色」更改为「蓝色」，而用户 B 将主题从「蓝色」更改为「紫色」时，用户 A 撤销，主题会变为「灰色」。

## 使用插件 API 的撤销方法

如果你的小组件还用到插件 API 来执行其他操作，在需要将某些操作记录到撤销/重做中时，可以使用`jsDesign.commitUndo()`。