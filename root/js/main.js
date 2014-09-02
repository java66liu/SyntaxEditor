function demo() {
	var a = void delete typeof + - ~ !a;
}

$(function() {
	var text = demo.toString()
	text = text.substring(17, text.length-2)
	var ast = esprima.parse(text)
	console.log(ast)
	var dom = ast_to_dom(ast)
	$('#ast-view').append(dom)
})

var handler_map = {
	'Program': function(ast) {
		return append(_class(div(), ast.type), ast_list_to_dom(ast.body))
	},
	'VariableDeclaration': function(ast) {
		var d = _class(div(), ast.type)
		append(d, text(_class(div(), 'var'), 'var '))
		var box = _class(div(), 'box')
		append(box, ast_list_to_dom(ast.declarations))
		append(d, box)
		return d
	},
	'VariableDeclarator': function(ast) {
		if (ast.init) {
			var d = _class(div(), ast.type)
			// id
			var id = _class(div(), 'id')
			append(id, ast_to_dom(ast.id))
			append(d, id)
			// =
			append(d, text(_class(div(), 'equ'), ' = '))
			// init
			var init = _class(div(), 'init')
			append(init, ast_to_dom(ast.init))
			append(d, init)
			return d
		}
		else {
			return append(_class(div(), ast.type), ast_to_dom(ast.id))
		}
	},
	'Identifier': function(ast) {
		return text(_class(div(), ast.type), ast.name)
	},
	'Literal': function(ast) {
		return text(_class(div(), ast.type), ast.raw)
	},
	'IfStatement': function(ast) {
		var d = _class(div(), ast.type)
		append(d, text(_class(div(), 'if'), 'if '))
		// test
		var test = _class(div(), 'test')
		//append(test, text(_class(div(), ['bracket', 'left']), '('))
		append(test, ast_to_dom(ast.test))
		//append(test, text(_class(div(), ['bracket', 'right']), ')'))
		append(d, test)
		// consequent
		var consequent = _class(div(), 'consequent')
		append(consequent, ast_to_dom(ast.consequent))
		append(d, consequent)
		// alternate
		append(d, text(_class(div(), 'else'), 'else'))
		var alternate = _class(div(), 'alternate')
		append(alternate, ast_to_dom(ast.alternate))
		append(d, alternate)
		return d
	},
	'BlockStatement': function(ast) {
		var d = _class(div(), ast.type)
		append(d, ast_list_to_dom(ast.body))
		return d
	},
	'BinaryExpression': function(ast) {
		var d = _class(div(), ast.type)
		append(d, ast_to_dom(ast.left))
		append(d, text(_class(div(), 'operator'), ' ' + ast.operator + ' '))
		append(d, ast_to_dom(ast.right))
		return d
	},
	'UpdateExpression': function(ast) {
		var d = _class(div(), ast.type)
		if (ast.prefix) {
			append(d, text(_class(div(), 'operator'), ' ' + ast.operator))
			append(d, ast_to_dom(ast.argument))
		}
		else {
			append(d, ast_to_dom(ast.argument))
			append(d, text(_class(div(), 'operator'), ast.operator + ' '))
		}
		return d
	},
	'UnaryExpression': function(ast) {
		var d = _class(div(), ast.type)
		if (ast.prefix) {
			append(d, text(_class(div(), 'operator'), ' ' + ast.operator + ' '))
			append(d, ast_to_dom(ast.argument))
		}
		else {
			append(d, ast_to_dom(ast.argument))
			append(d, text(_class(div(), 'operator'), ' ' + ast.operator + ' '))
		}
		return d
	}
}

function ast_to_dom(ast) {
	var handler = handler_map[ast.type]
	if (!handler) return null
	else return handler(ast)
}

function ast_list_to_dom(ast_list) {
	if (!ast_list || ast_list.length < 1) return null
	var dom_list = []
	ast_list.forEach(function(ast) {
		var dom = ast_to_dom(ast)
		if (dom) dom_list.push(dom)
	})
	// 绝不会返回空列表，只会返回 null 或非空列表
	if (dom_list.length < 1) return null
	else return dom_list
}

function div() {
	return document.createElement('div')
}

function _class(e, list) {
	if (!e) return
	if (!Array.isArray(list)) list = [list]
	list.forEach(function(c) {
		if (c) e.classList.add(c)
	})
	return e
}

function text(e, v) {
	if (!e) return e
	e.textContent = v
	return e
}

function append(e, list) {
	if (!e) return
	if (!Array.isArray(list)) list = [list]
	list.forEach(function(item) {
		if (item) e.appendChild(item)
	})
	return e
}