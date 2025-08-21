const iconmap = {
	const: '🦀📎',
	function: '🎹', //'🎹🎼',
	return: '↩🎾',
}
function fmap(iconmap, fs) {
	return function (k) {
		const content = iconmap[k]
		return `
.${k} {
	font-size: 0;
}
.${k}::before {
	content: "${content}";
	font-size: ${fs};
${['function'].includes(k) ? '' : `
	position: absolute;
	left: 0;
`}}
.${k}:hover {
	content: "${k}";
	font-size: ${fs};
}`
	}
}
