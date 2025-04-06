import { ErrorHelper } from "../errors/ErrorHelper";
import { Lexer } from "./lexer";
import { get_function } from "../helpers/getParents";
import { simfalse } from "../helpers/sims";
import { Typeid } from "../helpers/typeIds";
import { parse_expression } from "./parse_expression";
import { ParseOptions, ParserState } from ".";

// Parse a "var" statement. Even for multiple variables it is treated as
// a single statement. The variables are placed into the container,
// which defaults to the enclosing function or global scope.
export function parse_var(
	state: ParserState,
	parent,
	options: ParseOptions,
	container: any = undefined
) {
	container =
		typeof container !== "undefined" ? container : get_function(parent);

	// handle "var" keyword
	let where = state.get();
	let token = Lexer.get_token(state, options);
	ErrorHelper.assert(
		token.type === "keyword" && token.value === "var",
		"[parse_var] internal error"
	);

	// prepare "group of variable declarations" object
	let ret = {
		petype: "variable declaration",
		children: new Array(),
		where: where,
		parent: parent,
		vars: new Array(),
		step: function () {
			let frame = this.stack[this.stack.length - 1];
			let pe: any = frame.pe[frame.pe.length - 1];
			let ip = frame.ip[frame.ip.length - 1];
			if (ip < pe.vars.length) {
				// push the var onto the stack
				frame.pe.push(pe.vars[ip]);
				frame.ip.push(-1);
				return false;
			} else {
				frame.pe.pop();
				frame.ip.pop();
				return false;
			}
		},
		sim: simfalse,
	};

	// parse individual variables
	while (true) {
		// obtain variable name
		let where = state.get();
		token = Lexer.get_token(state, options);
		if (token.type !== "identifier") state.error("/syntax/se-50");
		if (parent.names.hasOwnProperty(token.value))
			state.error("/name/ne-14", [token.value]);

		// check variable name
		if (
			options.checkstyle &&
			!state.builtin() &&
			token.value[0] >= "A" &&
			token.value[0] <= "Z"
		) {
			state.set(Lexer.before_token);
			state.error("/style/ste-3", ["variable", token.value]);
		}

		// create the variable
		let id =
			container.petype === "type"
				? container.objectsize
				: container.variables.length;
		let pe: any = {
			petype: "variable",
			where: where,
			parent: parent,
			name: token.value,
			id: id,
			step: function () {
				let frame = this.stack[this.stack.length - 1];
				let pe: any = frame.pe[frame.pe.length - 1];
				let ip = frame.ip[frame.ip.length - 1];
				if (ip === 0) {
					// push the value onto the stack
					if (pe.hasOwnProperty("initializer")) {
						frame.pe.push(pe.initializer);
						frame.ip.push(-1);
						return false;
					} else {
						frame.temporaries.push({
							type: this.program.types[Typeid.typeid_null],
							value: { b: null },
						});
						return true;
					}
				} else if (ip === 1) {
					// assign the value to the variable
					frame.variables[pe.id] = frame.temporaries.pop();
					return false;
				} else {
					frame.pe.pop();
					frame.ip.pop();
					return false;
				}
			},
			sim: function () {
				let frame = this.stack[this.stack.length - 1];
				let ip = frame.ip[frame.ip.length - 1];
				if (ip === 0) {
					let pe: any = frame.pe[frame.pe.length - 1];
					return !pe.hasOwnProperty("initializer");
				} else return false;
			},
		};

		// remember the scope to which the variable's id refers
		if (container.petype === "global scope") pe.scope = "global";
		else if (
			container.petype === "function" ||
			container.petype === "method"
		)
			pe.scope = "local";
		else if (container.petype === "type") pe.scope = "object";
		else ErrorHelper.assert(false, "unknown variable scope");

		// parse the initializer
		token = Lexer.get_token(state, options);
		if (token.type === "operator" && token.value === "=") {
			pe.initializer = parse_expression(state, parent, options);
			pe.children = [pe.initializer];
			token = Lexer.get_token(state, options);
		}

		// register the variable
		container.variables.push(pe);
		parent.names[pe.name] = pe;
		ret.vars.push(pe);
		ret.children.push(pe);
		if (container.petype === "type") parent.objectsize++;

		// parse the delimiter
		if (token.type === "delimiter" && token.value === ";") break;
		else if (token.type !== "delimiter" || token.value !== ",") {
			state.set(Lexer.before_token);
			state.error(pe.initializer ? "/syntax/se-51b" : "/syntax/se-51");
		}
	}
	return ret;
}
