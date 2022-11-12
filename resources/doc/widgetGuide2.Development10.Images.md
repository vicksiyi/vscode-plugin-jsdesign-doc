# 小组件中的图片

你可以使用`<Image>`组件或使用`<Frame>`和`<Rectgle>`元素的 fill 属性将图片呈现为小组件的一部分。

```TypeScript
const { widget } = jsDesign
const { Image, Frame, AutoLayout } = widget

function ImageExamples() {
  return <AutoLayout>
    <Image
      // Pass a data uri directly as the image
      src="data:image/png;base64,……"

      width={100}
      height={100}
    />
    <Frame
      fill={{
        type: 'image',
        src: jsDesign.currentUser.photoUrl
      }}

      width={100}
      height={100}
    />
    </AutoLayout>
}

widget.register(ImageExamples)
```