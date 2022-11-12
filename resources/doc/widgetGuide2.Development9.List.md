# 使用列表

在某些情况下，我们可能想要批量渲染一些的所有内容，比如一份图片的 URL 列表。

在 JSX 中实现这一点的常见方式是使用映射，如下所示：

```TypeScript
const { widget } = jsDesign
const { AutoLayout, Image } = widget

const userPhotoUrls = [
  "https://....",
  "https://....",
  "https://....",
]

function ListExample() {
  return (
    <AutoLayout>
      {userPhotoUrls.map(url => {
        return <Image key={url} src={url} />
      })}
    </AutoLayout>
  )
}

widget.register(ListExample);
```

在示例中，我们为每张图片上指定了一个`key`，这可以帮助我们识别哪些项目在重新渲染中发生了更改/添加/删除，以提高重新渲染这些项目的性能。