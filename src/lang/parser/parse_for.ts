import { ErrorHelper } from "../errors/ErrorHelper";
import { Lexer } from "./lexer";
import { get_function } from "../interpreter/interpreter_helper";
import { TScript } from "..";
import { Typeid } from "../helpers/typeIds";
import { parse_expression } from "./parse_expression";
import { parse_statement } from "./parse_statement";
import { parse_name } from "./parse_name";

export function parse_for(state, parent, options) {
	// handle "for" keyword
	let where = state.get();
	let token = Lexer.get_token(state, options);
	ErrorHelper.assert(
		token.type === "keyword" && token.value === "for",
		"[parse_for] internal error"
	);

	// create the loop object
	let forloop: any = {
		petype: "for-loop",
		where: where,
		parent: parent,
		names: {},
		step: function () {
			let frame = this.stack[this.stack.length - 1];
			let pe: any = frame.pe[frame.pe.length - 1];
			let ip = frame.ip[frame.ip.length - 1];
			if (ip === -2) {
				// handle "break" statement
				frame.temporaries.pop();
				frame.temporaries.pop();
				frame.pe.pop();
				frame.ip.pop();
				return false;
			} else if (ip === -1) {
				// recover from "continue", jump to ip = 4
				frame.ip[frame.ip.length - 1] = 4 - 1;
				return false;
			} else if (ip === 0) {
				// preparation phase: evaluate the iterable container
				frame.pe.push(pe.iterable);
				frame.ip.push(-1);
				return false;
			} else if (ip === 1) {
				// preparation phase: push a copy of the container and the first index onto the temporaries stack
				let iterable = frame.temporaries.pop();
				let container: any = TScript.isDerivedFrom(
					iterable.type,
					Typeid.typeid_range
				)
					? {
							rangemarker: null,
							begin: iterable.value.b.begin,
							end: iterable.value.b.end,
							length: Math.max(
								0,
								iterable.value.b.end - iterable.value.b.begin
							),
					  }
					: new Array();
				if (TScript.isDerivedFrom(iterable.type, Typeid.typeid_array)) {
					for (let i = 0; i < iterable.value.b.length; i++)
						container.push(iterable.value.b[i]);
				} else if (
					!TScript.isDerivedFrom(iterable.type, Typeid.typeid_range)
				)
					state.error("/argument-mismatch/am-34", [
						TScript.displayname(iterable.type),
					]);
				frame.temporaries.push(container);
				frame.temporaries.push(0);
				return false;
			} else if (ip === 2) {
				// check the end-of-loop condition and set the loop variable
				let container = frame.temporaries[frame.temporaries.length - 2];
				let index = frame.temporaries[frame.temporaries.length - 1];
				if (index >= container.length) {
					frame.temporaries.pop();
					frame.temporaries.pop();
					frame.pe.pop();
					frame.ip.pop();
				} else if (pe.hasOwnProperty("var_id")) {
					let typedvalue = container.hasOwnProperty("rangemarker")
						? {
								type: this.program.types[Typeid.typeid_integer],
								value: { b: (container.begin + index) | 0 },
						  }
						: container[index];
					if (pe.var_scope === "global")
						this.stack[0].variables[pe.var_id] = typedvalue;
					else if (pe.var_scope === "local")
						frame.variables[pe.var_id] = typedvalue;
					else if (pe.var_scope === "object")
						frame.object.value.a[pe.var_id] = typedvalue;
					else
						ErrorHelper.assert(
							false,
							"unknown scope: " + pe.var_scope
						);
				}
				return true;
			} else if (ip === 3) {
				// push the body onto the stack
				frame.pe.push(pe.body);
				frame.ip.push(-1);
				return false;
			} else if (ip === 4) {
				// increment the loop counter and jump to ip = 2
				frame.temporaries[frame.temporaries.length - 1]++;
				frame.ip[frame.ip.length - 1] = 2 - 1;
				return false;
			}
		},
		sim: function () {
			let frame = this.stack[this.stack.length - 1];
			let ip = frame.ip[frame.ip.length - 1];
			return ip === 2;
		},
	};

	// parse the variable
	let vardecl = false;
	where = state.get();
	token = Lexer.get_token(state, options, true);
	if (token.type === "keyword" && token.value === "var") {
		// create and register a new variable
		// Note: the program element does *not* need a step function, it is only there to define the variable's id
		Lexer.get_token(state, options);
		token = Lexer.get_token(state, options);
		if (token.type !== "identifier") state.error("/syntax/se-70");
		let fn = get_function(parent);
		let id = fn.variables.length;
		let pe: any = {
			petype: "variable",
			where: where,
			parent: forloop,
			name: token.value,
			id: id,
			scope: "local",
		};
		fn.variables.push(pe);
		forloop.names[token.value] = pe;
		forloop.var_id = id;
		forloop.var_scope = "local";

		// parse "in"
		token = Lexer.get_token(state, options);
		if (token.type !== "identifier" || token.value !== "in")
			state.error("/syntax/se-71");

		// parse the iterable object
		forloop.iterable = parse_expression(state, parent, options);

		// parse the "do" keyword
		token = Lexer.get_token(state, options);
		if (token.type !== "keyword" || token.value !== "do")
			state.error("/syntax/se-72");
	} else {
		let w = state.get();
		let ex = parse_expression(state, forloop, options);

		token = Lexer.get_token(state, options);
		if (token.type === "identifier" && token.value === "in") {
			state.set(w);
			let result = parse_name(state, parent, options, "for-loop");
			let v = result.lookup;
			if (v.petype !== "variable" && v.petype !== "attribute")
				state.error("/argument-mismatch/am-35", [
					result.name,
					result.lookup.petype,
				]);
			forloop.var_id = v.id;
			forloop.var_scope = v.scope;

			// parse "in"
			token = Lexer.get_token(state, options);
			ErrorHelper.assert(
				token.type === "identifier" && token.value === "in",
				"[parse_for] internal error"
			);

			// parse the iterable object
			forloop.iterable = parse_expression(state, parent, options);

			// parse the "do" keyword
			token = Lexer.get_token(state, options);
			if (token.type !== "keyword" || token.value !== "do")
				state.error("/syntax/se-72");
		} else if (token.type === "keyword" && token.value === "do") {
			forloop.iterable = ex;
		} else state.error("/syntax/se-73");
	}

	// parse the loop body
	forloop.body = parse_statement(state, forloop, options);

	return forloop;
}
