import { ErrorHelper } from "../errors/ErrorHelper";
import { Lexer } from "./lexer";
import { TScript } from "..";
import { parse_expression } from "./parse_expression";
import { ParserState } from ".";

export function parse_throw(state: ParserState, parent, options) {
	// handle "throw" keyword
	let where = state.get();
	let token = Lexer.get_token(state, options);
	ErrorHelper.assert(
		token.type === "keyword" && token.value === "throw",
		"[parse_throw] internal error"
	);

	// create the throw object
	let ret: any = {
		petype: "throw",
		where: where,
		parent: parent,
		step: function () {
			let frame = this.stack[this.stack.length - 1];
			let pe: any = frame.pe[frame.pe.length - 1];
			let ip = frame.ip[frame.ip.length - 1];

			if (ip === 0) {
				// evaluate the exception
				frame.pe.push(pe.argument);
				frame.ip.push(-1);
				return false;
			} else {
				// save the exception
				let ex = frame.temporaries.pop();

				// search for a try block
				let remove_frame = 0;
				let remove_pe = 0;
				while (true) {
					let f = this.stack[this.stack.length - remove_frame - 1];
					if (f.pe[f.pe.length - 1 - remove_pe].petype === "try")
						break;
					remove_pe++;
					if (remove_pe >= f.pe.length) {
						remove_pe = 0;
						remove_frame++;
						if (remove_frame >= this.stack.length)
							state.error("/user/ue-3", [TScript.toString(ex)]);
					}
				}

				// modify the stack so that we jump to the catch statement
				this.stack.splice(
					this.stack.length - remove_frame,
					remove_frame
				);
				let f = this.stack[this.stack.length - 1];
				ErrorHelper.assert(
					remove_pe <= f.pe.length - 2,
					"[throw] corrupted stack"
				);
				f.pe.splice(f.pe.length - remove_pe - 1, remove_pe + 1);
				f.ip.splice(f.ip.length - remove_pe - 2, remove_pe + 2, 1);

				// clean up temporaries
				while (
					f.temporaries.length > 0 &&
					!f.temporaries[f.temporaries.length - 1].hasOwnProperty(
						"try marker"
					)
				)
					f.temporaries.pop();

				// pass the exception into the catch block
				f.temporaries.push(ex);

				return true;
			}
		},
		sim: function () {
			let frame = this.stack[this.stack.length - 1];
			let ip = frame.ip[frame.ip.length - 1];
			return ip !== 0;
		},
	};

	// parse the exception argument
	ret.argument = parse_expression(state, parent, options);
	ret.children = [ret.argument];

	// parse the closing semicolon
	token = Lexer.get_token(state, options);
	if (token.type !== "delimiter" || token.value !== ";") {
		state.set(Lexer.before_token);
		state.error("/syntax/se-87");
	}

	return ret;
}
