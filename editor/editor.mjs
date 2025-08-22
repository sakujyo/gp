const fps = 15
var maploc2i = new Map()
var tabstep = 4

const [ container, containercode, buttons, output ] = (function (l) {
	return l.map(x => creatediv(x))
})([ 'container', 'containercode', 'buttons', 'output' ])

container.appendChild(containercode)
container.appendChild(buttons)
container.appendChild(output)

const sheet = new CSSStyleSheet()
sheet.replaceSync(`body {
	background-color: #232323;
	color: #ffffff;
	margin: 0px;
	text-size-adjust: none;
}

#container {
	background-color: #232323;
	font-family: Menlo, Monaco, Consolas, "Andale Mono", "Ubuntu Mono", "Courier New", monospace;
}
#containercode {
	white-space: pre;
	tab-size: ${tabstep};
	-moz-tab-size: ${tabstep}; /* for Firefox */
}

.keyword {
	color: #66ffff;
}
.preposition {
	color: #f5c;
}`)

const fontwidth = getFontWidth('c')

function translateToAccessibleURL(s) {
	// For smartphones, githubusercontent url tends to be retrieved
    return !s.match(/raw\/refs/) ? s : s.replace('github', 'raw.githubusercontent').replace('raw/refs', 'refs')
}
async function getGithubSrc(url) {
	const res = await fetch(translateToAccessibleURL(url))
	return await res.text()
}

const querystring = document.location.href.split('?')
void (async function main() {
	const vresult = v(decorator1, (querystring[1] ? await getGithubSrc(querystring[1]): srcgen)
		.replace(/\r/g, '')
		.replace(/(?<=\n)\s*\/\/.*?(?=\n)/g, '')
	)
	const asobj = [ vresult.length, ((i) => vresult.slice(i, Math.min(vresult.length, i + 60)))(Math.floor(vresult.length / 2)) ]
	console.log(asobj)
	setsrc(vresult)

	output.innerText = decl.filter(x => x.category === 'function').map(x => [ x.name, x.loc.start.line, x.loc.start.column ]).join('\n')
	//setTimeout(() => {
	//	void ([...document.querySelectorAll('div')].filter(x => x.scrollWidth > 29200)[3].innerText='')
	//}, 99)

	setTimeout(() => {
		observer = new IntersectionObserver(entries => {
			const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
			async function raf(timestamp) {
				await sleep((((timestamp - Math.floor(timestamp)) * 1000 * 10) % 667) / 10)
				entries.forEach(entry => {
					if (entry.isIntersecting) {
						entry.target.style.animationIterationCount = 'infinite'
					} else
						entry.target.style.animationIterationCount = 1
				});
			}
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					entry.target.style.animationIterationCount = 'infinite' 
				}
				else {
					entry.target.style.animationIterationCount = 1
				}
			})
		}, { threshold: 0 });

		for (let i = 0; i < 7; i++) {
			document.querySelectorAll(`.gr${i}`).forEach(el => observer.observe(el));
		}
	}, 500)
})()

var idcolor = 'white'

const segmenter = new Intl.Segmenter('ja', {
	granularity: 'grapheme',
})
const translationid = {
	n: '🌿',
	k: '📛',
	key: '🔑',
	name: '📛',
	e: '📘',
	args: '📚',
}
const ccfontsize = window.getComputedStyle(containercode).fontSize
function styleid(x) {
	return decl[x].name in translationid ? `.id${x}::before { content: "${
		translationid[decl[x].name]
	}"; font-size:${'20px'};}` : ''
}


function randomcolor() {
	const f = () => '9abc'[Math.floor(Math.random() * 4)]
	return `#${f()}${f()}${f()}`
}
function generateanimation(n) {

	return `
.gr${n} {
	font-weight: bold;
	will-change: background-color;
	/*animation: hueRotate 1s linear infinite;*/
	animation: hueRotate ${43 / fps}s steps(1, end) infinite;
	/*animation-play-state: paused;*/
	/*animation-delay: ${n / 7 + (n % 7 * 1 / 7)}s*/
	animation-delay: ${(n % 7) * Math.floor(43/7) / fps}s
}
@keyframes hueRotate {
0%{background-color:hsl(0,100%,50%);}
2.33%{background-color:hsl(10,100%,50%);}
4.65%{background-color:hsl(20,100%,50%);}
6.98%{background-color:hsl(25,100%,49%);}
9.3%{background-color:hsl(30,100%,50%);}
11.63%{background-color:hsl(35,100%,49%);}
13.95%{background-color:hsl(40,100%,49%);}
16.28%{background-color:hsl(45,100%,48%);}
18.6%{background-color:hsl(50,100%,47%);}
20.93%{background-color:hsl(55,100%,44%);}
23.26%{background-color:hsl(60,100%,42%);}
25.58%{background-color:hsl(65,100%,43%);}
27.91%{background-color:hsl(70,100%,44%);}
30.23%{background-color:hsl(75,100%,45%);}
32.56%{background-color:hsl(80,100%,45%);}
34.88%{background-color:hsl(85,100%,45%);}
37.21%{background-color:hsl(90,100%,46%);}
39.53%{background-color:hsl(95,100%,46%);}
41.86%{background-color:hsl(105,100%,45%);}
44.19%{background-color:hsl(120,100%,46%);}
46.51%{background-color:hsl(135,100%,46%);}
48.84%{background-color:hsl(145,100%,46%);}
51.16%{background-color:hsl(150,100%,45%);}
53.49%{background-color:hsl(155,100%,44%);}
55.81%{background-color:hsl(160,100%,43%);}
58.14%{background-color:hsl(165,100%,42%);}
60.47%{background-color:hsl(170,100%,43%);}
62.79%{background-color:hsl(175,100%,42%);}
65.12%{background-color:hsl(180,100%,44%);}
67.44%{background-color:hsl(185,100%,47%);}
69.77%{background-color:hsl(190,100%,49%);}
72.09%{background-color:hsl(195,100%,49%);}
74.42%{background-color:hsl(200,100%,50%);}
76.74%{background-color:hsl(205,100%,50%);}
79.07%{background-color:hsl(210,100%,50%);}
81.4%{background-color:hsl(215,100%,50%);}
83.72%{background-color:hsl(220,100%,50%);}
86.05%{background-color:hsl(240,100%,50%);}
88.37%{background-color:hsl(260,100%,49%);}
90.7%{background-color:hsl(280,100%,50%);}
93.02%{background-color:hsl(300,100%,50%);}
95.35%{background-color:hsl(320,100%,50%);}
97.67%{background-color:hsl(340,100%,50%);}
100%{background-color:hsl(0,100%,50%);}}`
}

function rainbow(n) {
	return [
		'#00e5ff', '#40acf9',
		'#8073f2', '#bf39ec',
		'#ff00e5', '#f940ac',
		'#f28073', '#ecbf39',
		'#e5ff00', '#acf940',
		'#73f280', '#39ecbf'
	][n % 12]
}
var tickCount = 0
const preparedStylesCount = 12

var idsheet = new CSSStyleSheet()
idsheet.replaceSync(Object.keys([...Array(7)]).map(x => generateanimation(parseInt(x))).join('\n'))
const initialStyleSheets = [...document.adoptedStyleSheets]

document.body.appendChild(container)

const sheetkeyword = new CSSStyleSheet()
const fontsizecontainercode = window.getComputedStyle(containercode).fontSize
sheetkeyword.replaceSync([ 'function', 'const', 'return', ].map(fmap(iconmap, fontsizecontainercode)).join(''))
document.adoptedStyleSheets = [ sheet, sheetkeyword, idsheet]

containercode.addEventListener('compositionupdate',  (e) => {
	if (e.data.match(/:eval$/)) {
		const m = containercode.innerText.match(/:eva/)
		if (m) evalfunc(containercode.innerText.slice(0, m.index))
	}
	if (e.data.match(/:sc$/)) {
		const m = containercode.innerText.match(/:s/)
		output.innerText = `m.index: ${m.index}`
		if (m) evalfunc(containercode.innerText.slice(0, m.index), true)
	}
})

var keyacc = ''
containercode.onkeydown = (e) => {
	if (e.ctrlKey || e.altKey) return
	switch (e.key) {
		case 'Shift':
			break
		case 'Escape':
			keyacc = ''
			e.target.blur()
			break
		default:
			keyacc += e.key
			if (keyacc.match(/:eval$/)) {
				keyacc = ''
				const m = containercode.innerText.match(/:eva/)
				if (m) evalfunc(containercode.innerText.slice(0, m.index))
			}
			if (keyacc.match(/:sc$/)) {
				keyacc = ''
				const m = containercode.innerText.match(/:s/)
				if (m) evalfunc(containercode.innerText.slice(0, m.index), true)
			}
			break
	}
}

const cl = [ '#f57', '#b7f', '#4e8', '#fe2', '#17f', ]
function c() {
	return cl[Math.floor(Math.random() * cl.length)]
}

function setsrc(src) {
	containercode.innerHTML = src
	setTimeout(() => {
		document.querySelectorAll('.func').forEach(el => {
			el.oninput = (e) => {
				function fremove(el) {
					if (el.className === 'func') {
						for (const c of el.children) {
							fremove(c)
						}
					}
					if ( [ 'function', 'const', 'return', ].includes(el.className) && el.innerText !== el.className) {
						el.parentElement.insertBefore(document.createTextNode(el.innerText), el)
						el.remove()
					}
				}
				fremove(e.target)
			}
		})
	}, 99)
}

function evalfunc(src, onlysyntaxcheck=false) {
	try {
		parse(src)
		if (!onlysyntaxcheck) eval(src)
		containercode.innerHTML = v(decorator1, src
			.replace(/\r/g, '')
			.replace(/(?<=\n)\s*\/\/.*?(?=\n)/g, '')
		)
	} catch (err) {
		console.log(err)
		containercode.innerHTML = containercode.innerHTML.replace(onlysyntaxcheck ? ':s' : ':eva',
			`<div style="white-space: pre;">${err}</div>`
		)
	}
}
var tid

function ce(elementType) {
	return document.createElement(elementType)
}

function creatediv(id) {
	const e = ce('div')
	e.id = id
	return e
}

function getFontWidth(text) {
    const d = ce('div')
    d.innerHTML = text
    d.style.width = 'fit-content'
    d.style.fontFamily = 'Menlo, Monaco, Consolas, "Andale Mono", "Ubuntu Mono", "Courier New", monospace'
    d.style.position = 'absolute'
    document.body.appendChild(d)
    const result = d.clientWidth
	document.body.removeChild(d)
	return result
}
