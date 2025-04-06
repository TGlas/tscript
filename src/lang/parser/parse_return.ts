import { ErrorHelper } from "../errors/ErrorHelper";
import { Lexer } from "./lexer";
import { get_function } from "../helpers/getParents";
import { Typeid } from "../helpers/typeIds";
import { parse_expression } from "./parse_expression";
import { ParserState } from ".";

export function parse_return(state: ParserState, parent, options) {
	// handle "return" keyword
	let where = state.get();
	let token = Lexer.get_token(state, options);
	ErrorHelper.assert(
		token.type === "keyword" && token.value === "return",
		"[parse_return] internal error"
	);

	// create the return object
	let ret: any = {
		petype: "return",
		where: where,
		parent: parent,
		step: function () {
			let frame = this.stack[this.stack.length - 1];
			let pe: any = frame.pe[frame.pe.length - 1];
			let ip = frame.ip[frame.ip.length - 1];

			if (ip === 0) {
				// evaluate the argument
				if (pe.hasOwnProperty("argument")) {
					frame.pe.push(pe.argument);
					frame.ip.push(-1);
				} else
					frame.temporaries.push({
						type: this.program.types[Typeid.typeid_null],
						value: { b: null },
					});
				return false;
			} else {
				// actual function return, move the argument to the then-current temporaries stack
				let arg = frame.temporaries.pop();
				this.stack.pop();
				if (this.stack.length > 0)
					this.stack[this.stack.length - 1].temporaries.push(arg);
				return true;
			}
		},
		sim: function () {
			let frame = this.stack[this.stack.length - 1];
			let ip = frame.ip[frame.ip.length - 1];
			return ip !== 0;
		},
	};

	// parse the optional argument
	token = Lexer.get_token(state, options, true);
	if (token.type !== "delimiter" || token.value !== ";") {
		ret.argument = parse_expression(state, parent, options);
		let fn = get_function(parent);
		if (fn.name === "constructor") state.error("/syntax/se-79");
		if (fn.petype === "global scope" || fn.petype === "namespace")
			state.error("/syntax/se-80");
		ret.children = [ret.argument];
	}

	// parse the closing semicolon
	token = Lexer.get_token(state, options);
	if (token.type !== "delimiter" || token.value !== ";") {
		state.set(Lexer.before_token);
		state.error("/syntax/se-81");
	}

	return ret;
}
