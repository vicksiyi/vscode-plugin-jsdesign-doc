// 代码高亮
hljs.highlightAll();

//处理 颜色对照表的 颜色块
const pre = document.querySelectorAll('.colorBlock');
pre.length && pre.forEach((item) => {
	let a = item.nextSibling.nodeValue;
	item.style.background = `${a}`
})