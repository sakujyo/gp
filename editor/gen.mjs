function rc() {
	const colors = [ '424', '224', '323', '332', ] //, '443', '552', '334'
	return `#${colors[Math.floor(Math.random() * colors.length)]}`
	const f = () => '2345'[Math.floor(Math.random() * 4)]
	return `#${f()}${f()}${f()}`
}

function decorator1(text, className, stylingcolor=true, indent = false, bordercolor=false) {
	if (className !== 'func') {
		return `<span class="${className}">${text}</span>`
	}

	if (className === 'func') {
		const isContainer = !bordercolor && stylingcolor
		const style = ` style="`
			+ (isContainer ? ` background-color: ${rc()};` : '')
			+ (indent ? ` margin-left: ${fontwidth * tabstep}px;` : '')
			+ '"'
		return `<div class="${className}"${style}${
			isContainer ? ' contenteditable' : ''
		}>${text}</div>`
	}
}

const declmap = new Map()
function v(decorator1, targetsrc) {
	ast = parse(targetsrc.replace(/\/\*.*?\*\/()/gs, '').replace(/<(?!=)/g, '</**/'), {
		sourceType: 'module',
		errorRecovery: true,
	})
	decl=[],ref=[]
	void [...trav(ast)]
	return gen(ast).replace(/<\/\s?\*\*\s?\/()/g, '&lt;')
}

function declpush(...args) {
	for (const e of args) {
		declmap.set(e.name, decl.length)
		decl.push(e)
	}
}

function* trav(n, depth=0) {
	for (const k of Object.keys(n)) {
		if (k === 'loc') continue
		const e = n[k]
		if (e && typeof e === 'object') {
			switch (e.type) {
				case 'VariableDeclarator':
					declpush(e.id)
					break
				case 'FunctionDeclaration':
				case 'FunctionExpression':
				case 'ArrowFunctionExpression':
					if (e.id) e.id.category = 'function'
					e.id && declpush(e.id) // function name


					for (const x of e.params) {
						if (x.type === 'Identifier')
							declpush(x)
						if (x.type === 'AssignmentPattern')
							declpush(x.left)
					}
					break
				case 'Identifier':
					if (k === 'property' && n.computed === false) continue
					const i = declmap.get(e.name)
					ref.push(
						/* di = -1 when i = -1 if decl not include e */
						{
							id: e,
							di: i,
							decl: i ? decl[i] : undefined,
						}
					)
					maploc2i.set(e.start, i)
					continue
				case 'RestElement':
					declpush(e.argument)
					break
				case 'ThisExpression':
				case 'StringLiteral':
					continue
				case 'MemberExpression':
					yield* trav(e, depth + 1)
					continue
				case 'ObjectPattern':
					declpush(...e.properties.map(x => x.value))
					break
				case 'ArrayPattern':
					declpush(...e.elements.filter(x => x))
					break
				default:
					break



			}


			yield* trav(e, depth + 1)
		}
	}
}

function parenthesize(n, s) {
	return n.extra?.parenthesized ? `(${s})` : s
}
function gen(n, il = 0, decorator=decorator1) {
	return `${n.leadingComments ? n.leadingComments.map(x => gen(x)
	).join('') : ''}`
		+ parenthesize(n, _gen(n, il, decorator))
}
function _gen(n, il = 0, decorator) {
	const df = (...args) => (x) => decorator ? decorator(x, ...args) : x
	switch (n.type){
		case 'File':
			return gen(n.program)
		case 'Program':
			return [
				n.directives.map(x => gen(x)).join((decorator ? '<br>' : '\n')),
				n.body.map(x => df('func')(gen(x))).join((decorator ? '<br>' : '\n')),
			].join((decorator ? '<br>' : '\n'))
		case 'ExpressionStatement':
			return gen(n.expression, il)
		case 'BinaryExpression':
		case 'AssignmentExpression':
			return `${gen(n.left)} ${n.operator} ${gen(n.right, il + 1)}`
		case 'UnaryExpression':
			return `${n.operator} ${gen(n.argument)}`
		case 'ConditionalExpression':
			return `${gen(n.test)} ? ${gen(n.consequent)}\n : ${gen(n.alternate)}`
		case 'TemplateLiteral':
			return '`' + n.expressions.map((x, i) => `${
				n.quasis[i].value.raw}\${${gen(x)}}`).join('')
				+ n.quasis.at(-1).value.raw + '`'
		case 'TemplateElement':
			return n.value.raw
		case 'Identifier':
			const i = maploc2i.get(n.start)
			return df(i ? `gr${i % 7} id${i}` : 'external')(n.name)
		case 'NumericLiteral':
		case 'StringLiteral':
			return n.extra.raw
		case 'BooleanLiteral':
			return n.value
		case 'NullLiteral':
			return 'null'
		case 'RegExpLiteral':
			return `/${n.pattern}/${n.flags}`
		case 'FunctionDeclaration':
			return df('func')(`${n.async ? 'async ' : ''}${df('function')('function')}${n.generator ? '*' : ''} ${n.id ? gen(n.id) : ''}(${n.params.map(x => gen(x)).join(', ')}) ${gen(n.body, il + 1)}`)
		case 'FunctionExpression':
			return df('func')(`${n.async ? 'async ' : ''}${df('function')('function')}${n.generator ? '*' : ''} ${
				n.id ? gen(n.id) : ''}(${
					n.params.map(x => gen(x)).join(', ')}) ${gen(n.body, il + 1)}`)
		case 'ArrowFunctionExpression':
			return `${n.async ? 'async ' : ''}${n.generator ? '*' : ''}${
				n.id ? gen(n.id) : ''}(${
					n.params.map(x => gen(x)).join(', ')}) => ${gen(n.body, il + 0)}`
		case 'BlockStatement':
			return `{${(decorator ? '<br>' : '\n')}${df('func', true, true)(n.body.map(x => `${gen(x, il)}${(decorator ? '<br>' : '\n')}`).join(''))}}`
		case 'ReturnStatement':
			return `${df('return')('return' + (n.argument ? ' ' : ''))}${n.argument ? gen(n.argument, il) : ''}`
		case 'AssignmentPattern':
			return `${gen(n.left)} = ${gen(n.right)}`
		case 'VariableDeclaration':
			return df(n.kind)(n.kind + ' ') + n.declarations.map(x => gen(x, il)).join(', ')
		case 'VariableDeclarator':
			return `${gen(n.id)}${n.init ? ` = ${gen(n.init, il)}` : ''}`
		case 'ClassDeclaration':
		case 'ClassExpression':
			return `class${n.id ? ' ' + gen(n.id) : ''}${
				n.superClass ? ` extends ${gen(n.superClass)} ` : ''
			}{${(decorator ? '' : '\n')}${
				df('func', true, false)(gen(n.body, il))
			}}`
		case 'ClassBody':
			return n.body.map(x => gen(x, il + 1)).join('')
		case 'ClassMethod':
		case 'ObjectMethod':
			return df('func', true, true)(`${
				n.static ? 'static ' : ''}${
					n.async ? 'async ' : ''}${
						''/*n.kind !== 'method' ? `${n.kind} ` : ''*/}${
							n.generator ? '* ' : ''}${
								n.computed ? `[${gen(n.key)}]` : `${gen(n.key)}`}(${
									n.params.map(x => gen(x)).join(', ')}) ${
										gen(n.body, il + 1)}${(decorator ? '<br>' : '\n')}`)
		case 'Super':
			return 'super'
		case 'ThisExpression':
			return 'this'
		case 'CallExpression':
		case 'OptionalCallExpression':
			return `${gen(n.callee)}${n.optional ? '?.' : ''}(${n.arguments.map(x => gen(x, il)).join(', ')})`
		case 'MemberExpression':
			return `${gen(n.object)}${
				n.computed ? `[${gen(n.property)}]` : `.${gen(n.property)}`
			}`
		case 'OptionalMemberExpression':
			return `${gen(n.object)}?.${
				n.computed ? `[${gen(n.property)}]` : gen(n.property)
			}`
		case 'IfStatement':
			return `if (${gen(n.test)}) ${gen(n.consequent, il + 1)}${
				n.consequent.type === 'ExpressionStatement' ? '' : ' '
			}${n.alternate ? `else ${gen(n.alternate, il + 1)}` : ''}`
		case 'WhileStatement':
			return `while (${gen(n.test)}) ${gen(n.body, il + 1)}`
		case 'DoWhileStatement':
			return `do ${gen(n.body, il + 1)} while (${gen(n.test)})`
		case 'ForStatement':
			const init = n.init ? gen(n.init) : '';
			const test = n.test ? gen(n.test) : '';
			const update = n.update ? gen(n.update) : '';
			const body = gen(n.body, n.body.type === 'BlockStatement' ? il : il + 1);
			return `for (${init}; ${test}; ${update}) ${gen(n.body, il + 1)}`
		case 'ForOfStatement':
			return `for ${n.await ? 'await ' : ''}(${gen(n.left)} of ${gen(n.right)}) ${gen(n.body, il + 1)}`
		case 'ForInStatement':
			return `for ${n.await ? 'await ' : ''}(${gen(n.left)} in ${gen(n.right)}) ${gen(n.body, il + 1)}`
		case 'SwitchStatement':
			return df('func')(`switch (${gen(n.discriminant)}) {${(decorator ? '<br>': '\n')}${n.cases.map(x => gen(x, il + 1)).join('')}}`)
		case 'SwitchCase':
			return df('func')(`${ n.test ? `case ${gen(n.test)}:${(decorator ? '<br>' : '\n')}` : `default:${(decorator ? '<br>' : '\n')}` }${
				df('func', true, true)(n.consequent.map(x => gen(x, il) + (decorator ? '<br>' : '\n')).join(''))
			}`)
		case 'BreakStatement':
			return 'break'
		case 'ContinueStatement':
			return 'continue'
		case 'TryStatement':
			return `try ${gen(n.block, il + 1)}${
				n.handler ? gen(n.handler, il + 1) : ''}${
					n.finalizer ? ` finally ${gen(n.finalizer, il + 1)}` : ''
				}`
		case 'CatchClause':
			return ` catch${ n.param ? ` (${gen(n.param)})` : ''} ${gen(n.body, il)}`
		case 'ThrowStatement':
			return `throw ${gen(n.argument)}`
		case 'UpdateExpression':
			return `${
				n.prefix ?
					`${n.operator}${gen(n.argument)}` :
					`${gen(n.argument)}${n.operator}`
			}`
		case 'ArrayExpression':
			return `[ ${n.elements.map(x => gen(x) + ', ').join('')}]`
		case 'ArrayPattern':
			return `[ ${n.elements.map(x => x ? gen(x) : '').join(', ')} ]`
		case 'ObjectExpression':
			return `{${n.properties.map(x => /*iuh + */df('func', true, true)(gen(x, il + 1) + ',')).join('')}}`
		case 'NewExpression':
			return `new ${gen(n.callee)}(${n.arguments.map(x => gen(x)).join(', ')})`
		case 'LogicalExpression':
			return `${gen(n.left)} ${n.operator} ${gen(n.right, il + 1)}`
		case 'AwaitExpression':
			return `await ${gen(n.argument, il)}`
		case 'YieldExpression':
			return `yield${n.delegate ? '*' : ''} ${gen(n.argument, il)}`
		case 'SequenceExpression':
			return n.expressions.map(x => gen(x, il)).join(', ')
		case 'SpreadElement':
			return `...${gen(n.argument)}`
		case 'ObjectPattern':
			return `{ ${n.properties.map(x => gen(x)).join(', ')} }`
		case 'ObjectProperty':
			return n.shorthand ? gen(n.value) : `${
				n.computed ? `[${gen(n.key)}]` : gen(n.key)
			}: ${gen(n.value, il)}`
		case 'RestElement':
			return `...${gen(n.argument)}`
		case 'LabeledStatement':
			return `${gen(n.label)}: ${gen(n.body, il + 1)}`
		case 'EmptyStatement':
			return `;`
		case 'Import':
			return 'import'
		case 'CommentBlock':
			return `/*${n.value}*/`
		case 'CommentLine':
			return `//${n.value}${(decorator ? '<br>' : '\n')}`
		case 'Directive':
			return gen(n.value)
		case 'DirectiveLiteral':
			return `"${n.value}";`
		case 'ImportDeclaration':
			return `import ${n.specifiers.map(x => gen(x)).join('')} from '${gen(n.source)}'`
		case 'ImportNamespaceSpecifier':
			return `* as ${gen(n.local)}`
		case 'ImportDefaultSpecifier':
			return `${gen(n.local)}`
		case 'ImportSpecifier':
			return n.local.name === n.imported.name ?
				`{ ${gen(n.local)} }` :
				`{ ${gen(n.imported)} as ${gen(n.local)} }`
		case 'ExportDefaultDeclaration':
			return `export default ${gen(n.declaration)}`
		case 'TaggedTemplateExpression':
			return `${gen(n.tag)}${gen(n.quasi)}`
		case 'DebuggerStatement':
			return 'debugger'
		case 'ExportNamedDeclaration':
			return `export ${n.attributes.map(x => gen(x).join(' '))}${n.specifiers.map(x => gen(x)).join('')}${gen(n.declaration)}${n.source ? ` from ${n.source}` : ''}`
		default:
			return `not implemented(${n?.type})${(decorator ? '<br>' : '\n')}${JSON.stringify(n, null, 8)}`
			break
	}
}
