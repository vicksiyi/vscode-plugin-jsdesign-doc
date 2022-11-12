# 管理多个小组件

除了单个独立的小组件外，我们有时候也需要在同一文件中协调多个小组件，以下是相关的介绍。

## WidgetNode.widgetId 和 jsDesign.widgetId

每个小组件节点都与其对应的`manifest.json`中的`"id"`字段相关联，你可以使用插件 API 读取此值以检查指定的小组件节点是否属于你的小组件。

```TypeScript
const allWidgetNodes: WidgetNode[] = jsDesign.currentPage.findAll(node => {
  return node.type === "WIDGET"
})

const myWidgetNodes: WidgetNode[] = allWidgetNodes.filter(node => {
  return node.widgetId === jsDesign.widgetId
})
```

## findWidgetNodesByWidgetId

如果要查找匹配`node.widgetId`的所有小组件节点，可以使用此方法。

```TypeScript
 findWidgetNodesByWidgetId(widgetId: string): Array<WidgetNode>
```

## WidgetNode.widgetSyncedState

使用插件 API，我们可以通过此方法读取指定小组件节点的`syncedState`。

与`pluginData`类似，对该数据的访问是小组件特有的，每个小组件节点上的同步状态仅对具有相同`WidgetNode.widgetId`的小组件可见。

例如，我们可以实现一个投票小组件，通过枚举当前文件中的所有小组件来汇总特定用户的投票总数。

```TypeScript
const { widget } = jsDesign
const { Text, useSyncedMap } = widget

const MAX_VOTES_ALLOWED = 5

function CounterWidget() {
  const votes = useSyncedMap<number>("votes")

  return (
    <Text
      onClick={() => {
        let numVotes = 0
        jsDesign.currentPage.children.forEach(node => {
          if (node.type === "WIDGET" && node.widgetId === jsDesign.widgetId) {
            numVotes += node.widgetSyncedState[jsDesign.currentUser.id]
          }
        })

        if (numVotes >= MAX_VOTES_ALLOWED) {
          jsDesign.notify(`你已经投出 ${MAX_VOTES_ALLOWED} 票。`)
        } else {
          votes.set(jsDesign.currentUser.id, 1)
        }
      }}
    >
      {votes.size()}
    </Text>
  )
}

widget.register(CounterWidget)
```

## WidgetNode.cloneWidget

我们可以指定一个小组件节点，通过`WidgetNode.cloneWidget`克隆它，让其具有自定义的同步状态和同步映射值。

```TypeScript
interface WidgetNode {
  cloneWidget(
    syncedStateOverrides: { [name: string]: any },
    syncedMapOverrides?: { [mapName: string]: { [key: string]: any } }
  ): WidgetNode
}
```

注意：`syncedMapOverrides`中的每个`key`都将覆盖整个相应的同步映射，并删除映射中所有现有的`key`。如果你希望保留映射中的某些`key`，则需要在覆盖中明确指定它们。

与`WidgetNode.widgetSyncedState`类似，仅支持具备相同`WidgetNode.widgetId`的小组件。

当与`useWidgetId`Hook 结合使用时，我们可以实现更丰富的多小组件体验，例如可视化图表，每个图标对应单独的小组件。

与`WidgetNode.clone`类似，创建的副本将成为`jsDesign.currentPage`的子级，所以需要考虑原始小组件在不同节点下对应父级的情况。

## WidgetNode.setWidgetSyncedState

我们不仅可以使用新的同步状态和同步映射值克隆小组件，还可以使用`setWidgetSyncedState`在匹配相同`node.widgetId`的现有小组件上设置状态。

这有助于管理多个小组件，用户可以通过对单个小组件采取操作来更新其他小组件。

```TypeScript
  interface WidgetNode {
    setWidgetSyncedState(
      syncedState: { [name: string]: any },
      syncedMap?: { [mapName: string]: { [key: string]: any } },
    ): void
  }
```