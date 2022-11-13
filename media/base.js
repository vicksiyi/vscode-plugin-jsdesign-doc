(function () {
	const vscode = acquireVsCodeApi();
	window.onload = () => {
		document.body.scrollTop = document.documentElement.scrollTop = 0;
	}
	// 代码高亮
	hljs.highlightAll();

	//处理 颜色对照表的 颜色块
	const colorBlock = document.querySelectorAll('.colorBlock');
	colorBlock.length && colorBlock.forEach((item) => {
		let a = item.nextSibling.nodeValue;
		item.style.background = `${a}`
	})

	// 代码复制
	const pre = document.querySelectorAll('pre');
	pre.length > 0 && pre.forEach((item) => {
		const Text = item.innerText;
		item.style.position = 'relative'
		const copy_container = document.createElement('div');
		copy_container.className = 'hljs-button'
		copy_container.innerText = '复制'
		copy_container.addEventListener('click', (event) => { copy(Text); })
		item.appendChild(copy_container)
	})

	// 打开外链
	const a = document.querySelectorAll('a');
	a.length > 0 && a.forEach((item) => {
		let url = item.getAttribute('href');
		item.addEventListener('click', () => {
			vscode.postMessage({ command: 'navigate', url });
		})
	})

	function copy(val) {
		if (navigator.clipboard && window.isSecureContext) {
			vscode.postMessage({ command: 'tips-success', text: '复制成功' });
			return navigator.clipboard.writeText(val);
		} else {
			// 创建text area
			const textArea = document.createElement("textarea");
			textArea.value = val;
			// 使text area不在viewport，同时设置不可见
			document.body.appendChild(textArea);
			textArea.focus();
			textArea.select();
			vscode.postMessage({ command: 'tips-success', text: '复制成功' });
			return new Promise((res, rej) => {
				document.execCommand("copy") ? res() : rej();
				textArea.remove();
			});
		}
	}
})()