# 小组件状态与多人操作

小组件的每个实例都有自己的状态，我们可以将小组件的状态视为其数据展示，具有相同状态的小组件应始终具备相同的展示效果。**如果想更改小组件的外观以响应用户交互，则需要更新其状态。**

这是一个小组件的示例，每次点击时可以增加一个计数：

```TypeScript
const { widget } = jsDesign
const { Text, useSyncedState } = widget

function SimpleCounter() {
  const [count, setCount] = useSyncedState("count", 0)
  return (
    <Text
      onClick={() => {
        setCount(count + 1)
      }}
    >
      {count}
    </Text>
  )
}

widget.register(SimpleCounter)
```

<p class="warn"><b>Tips</b><br>我们也可以将小组件的状态称为同步状态，因为目前小组件的所有状态都在所有客户端上同步。之后可能会考虑支持「本地状态」及相关的功能。</p>

我们使用上面的`useSyncedState`在小组件上声明一个默认为`0`的数据值。在底层，你可以把这个小组件的状态想象成一个 JSON 对象，如下所示：

```JavaScript
// initially
{
  "count": 0
}

// click once
{
  "count": 1
}

// click again
{
  "count": 2
}
```

如果你有多个`useSyncedState`调用，请确保为它们提供唯一的`key`。

每次更新此对象时，都会重新渲染关联的小组件以反映更改。任何 JSON 可序列化值都是有效的状态值。

## useSyncedState 与 useSyncedMap

在上面的计数器示例中，如果两个用户同时单击计数器，则两个用户都会将`count`设置为`count+1`，而实际上，这里需要的是`count`变为`count+2`。

我们可以通过使用`useSyncedMap`来存储`essionId`到计数器的映射来实现这一点——在后台同步映射时合并不同客户端创建/删除/更新的`key`。除了同步映射的顶级`key`之外，存储在其中的每个值的语义和单个同步状态的值完全相同。

![avatar](https://img.js.design/assets/developer-doc/widget/images/intro/state.png)

所以，在使用两者时，可以通过需求场景进行区分：

- `useSyncedState`：适合存储应始终覆盖最后值的简单值（如：显示隐藏等单一结果的内容）

- `useSyncedMap`：适合多个可能会相互覆盖值的用户协作编辑（如：投票、表格、文档等）

## 一个或多个 useSyncedState

由于`useSyncedState`的灵活性，我们最终或许会在单个`useSyncedState`调用中存储复杂的 JSON 结构，所以在有需要的时候，可以将其修改为多个`useSyncedState`调用。

```TypeScript
// 一个
useSyncedState("settings", {
  "color": "blue",
  "size": "large",
})

// 多个
useSyncedState("color", "blue")
useSyncedState("size", "large")
```

一般情况下，我们可以根据协作时如何去合并及更新这些值，来决定使用哪种结构，比如：

当使用单个`useSyncedState`时，如果进行同步，则其中的每个值都会被最新的用户操作替换掉。

```TypeScript
setState({
  color: "red", // <- 用户 A 修改蓝色为红色
  size: "large"
})

setState({
  color: "blue",
  size: "medium" // <- 用户 B 修改尺寸
})
```

而如果我们在这里使用多个`useSyncedState`，则可以实现多个用户修改的状态合并，单独应用每个`useSyncedState`。

```TypeScript
color="red", size="medium"
```

## 保证小组件正常工作

在开发小组件时，需要明确以下内容，确保小组件可以正常运行：

1. 小组件的渲染应仅取决于`useSyncedState`或`useSyncedMap`返回的值。

1. 小组件对所有用户来说都是完全相同的。

1. 更新小组件的唯一方法是更新其状态，这将自动重新渲染小组件。

1. 多个小组件添加到同一个文件中，但用户一次只能运行一个小组件。

1. 用户可以随时终止小组件代码。目前会终止小组件代码的事件如下：
   1. 用户离开/关闭文件
   2. 用户在正在运行的小组件 Toast 提示中点击了「取消」
   3. 用户删除了正在运行的小组件
   4. 用户与文件中的另一个小组件发生交互