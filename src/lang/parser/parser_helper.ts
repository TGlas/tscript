import { ParserState } from ".";
import { TScript } from "..";
import { Typeid } from "../helpers/typeIds";
import { isKeyword, Keyword } from "./lexer";

///////////////////////////////////////////////////////////
// The parser parses source code and translates the program
// into a description object, based on an abstract syntax
// tree. Each object in the structure shall provide the
// following fields:
//  * petype: program element type, a string
//  * parent: parent scope
//  * step: function executing the current "step" (as in
//          "step-into" debugging). The function has no
//          parameters, but it has access to the
//          interpreter as its "this" context.
//          The function may modify the instruction pointer,
//          but it is not guaranteed to point to the next
//          step. Possible return values are:
//          true  - step was executed
//          false - possibly something was done, but not a
//                  full step; increment the IP and
//                  continue
//  * sim: function providing the return value of the next
//         call to step without actually running it.
//  * where: object with fields pos, line, ch and filename
//           describing the location in the source code
//           where the program element is defined (missing
//           where the implicit elements, as well as for
//           built-ins).
//

export const assignments = {
	"=": true,
	"+=": true,
	"-=": true,
	"*=": true,
	"/=": true,
	"//=": true,
	"%=": true,
	"^=": true,
};

export const left_unary_operator_precedence = {
	"+": 2,
	"-": 2,
	not: 7,
};

export const binary_operator_precedence = {
	"+": 4,
	"-": 4,
	"*": 3,
	"/": 3,
	"//": 3,
	"%": 3,
	"^": 1,
	":": 5,
	"==": 6,
	"!=": 6,
	"<": 6,
	"<=": 6,
	">": 6,
	">=": 6,
	and: 8,
	or: 9,
	xor: 9,
};

export const left_unary_operator_impl = {
	not: function (arg) {
		if (TScript.isDerivedFrom(arg.type, Typeid.typeid_boolean))
			return {
				type: this.program.types[Typeid.typeid_boolean],
				value: { b: !arg.value.b },
			};
		else if (TScript.isDerivedFrom(arg.type, Typeid.typeid_integer))
			return {
				type: this.program.types[Typeid.typeid_integer],
				value: { b: ~arg.value.b },
			};
		else
			this.error("/argument-mismatch/am-2", [
				TScript.displayname(arg.type),
			]);
	},
	"+": function (arg) {
		if (TScript.isDerivedFrom(arg.type, Typeid.typeid_integer))
			return {
				type: this.program.types[Typeid.typeid_integer],
				value: { b: arg.value.b },
			};
		else if (TScript.isDerivedFrom(arg.type, Typeid.typeid_real))
			return {
				type: this.program.types[Typeid.typeid_real],
				value: { b: arg.value.b },
			};
		else
			this.error("/argument-mismatch/am-3", [
				TScript.displayname(arg.type),
			]);
	},
	"-": function (arg) {
		if (TScript.isDerivedFrom(arg.type, Typeid.typeid_integer))
			return {
				type: this.program.types[Typeid.typeid_integer],
				value: { b: -arg.value.b | 0 },
			};
		else if (TScript.isDerivedFrom(arg.type, Typeid.typeid_real))
			return {
				type: this.program.types[Typeid.typeid_real],
				value: { b: -arg.value.b },
			};
		else
			this.error("/argument-mismatch/am-4", [
				TScript.displayname(arg.type),
			]);
	},
};

export const binary_operator_impl = {
	"+": function (lhs, rhs) {
		if (
			TScript.isDerivedFrom(lhs.type, Typeid.typeid_integer) &&
			TScript.isDerivedFrom(rhs.type, Typeid.typeid_integer)
		) {
			return {
				type: this.program.types[Typeid.typeid_integer],
				value: { b: (lhs.value.b + rhs.value.b) | 0 },
			};
		} else if (TScript.isNumeric(lhs.type) && TScript.isNumeric(rhs.type)) {
			return {
				type: this.program.types[Typeid.typeid_real],
				value: { b: lhs.value.b + rhs.value.b },
			};
		} else if (
			TScript.isDerivedFrom(lhs.type, Typeid.typeid_string) ||
			TScript.isDerivedFrom(rhs.type, Typeid.typeid_string)
		) {
			return {
				type: this.program.types[Typeid.typeid_string],
				value: {
					b:
						TScript.toString.call(this, lhs) +
						TScript.toString.call(this, rhs),
				},
			};
		} else
			this.error("/argument-mismatch/am-5", [
				TScript.displayname(lhs.type),
				TScript.displayname(rhs.type),
			]);
	},
	"-": function (lhs, rhs) {
		if (
			TScript.isDerivedFrom(lhs.type, Typeid.typeid_integer) &&
			TScript.isDerivedFrom(rhs.type, Typeid.typeid_integer)
		)
			return {
				type: this.program.types[Typeid.typeid_integer],
				value: { b: (lhs.value.b - rhs.value.b) | 0 },
			};
		else if (TScript.isNumeric(lhs.type) && TScript.isNumeric(rhs.type))
			return {
				type: this.program.types[Typeid.typeid_real],
				value: { b: lhs.value.b - rhs.value.b },
			};
		else
			this.error("/argument-mismatch/am-6", [
				TScript.displayname(rhs.type),
				TScript.displayname(lhs.type),
			]);
	},
	"*": function (lhs, rhs) {
		if (
			TScript.isDerivedFrom(lhs.type, Typeid.typeid_integer) &&
			TScript.isDerivedFrom(rhs.type, Typeid.typeid_integer)
		)
			return {
				type: this.program.types[Typeid.typeid_integer],
				value: { b: TScript.mul32(lhs.value.b, rhs.value.b) },
			};
		else if (TScript.isNumeric(lhs.type) && TScript.isNumeric(rhs.type))
			return {
				type: this.program.types[Typeid.typeid_real],
				value: { b: lhs.value.b * rhs.value.b },
			};
		else
			this.error("/argument-mismatch/am-7", [
				TScript.displayname(lhs.type),
				TScript.displayname(rhs.type),
			]);
	},
	"/": function (lhs, rhs) {
		if (TScript.isNumeric(lhs.type) && TScript.isNumeric(rhs.type)) {
			return {
				type: this.program.types[Typeid.typeid_real],
				value: { b: lhs.value.b / rhs.value.b },
			};
		} else
			this.error("/argument-mismatch/am-8", [
				TScript.displayname(lhs.type),
				TScript.displayname(rhs.type),
			]);
	},
	"//": function (lhs, rhs) {
		if (TScript.isNumeric(lhs.type) && TScript.isNumeric(rhs.type)) {
			if (
				TScript.isDerivedFrom(lhs.type, Typeid.typeid_integer) &&
				TScript.isDerivedFrom(rhs.type, Typeid.typeid_integer)
			) {
				let m = TScript.mod.call(this, lhs.value.b, rhs.value.b);
				let d = Math.round((lhs.value.b - m) / rhs.value.b);
				return {
					type: this.program.types[Typeid.typeid_integer],
					value: { b: d | 0 },
				};
			} else {
				let m =
					lhs.value.b -
					rhs.value.b * Math.floor(lhs.value.b / rhs.value.b);
				if (m < 0) m += Math.abs(rhs.value.b);
				let d =
					rhs.value.b === 0
						? lhs.value.b / rhs.value.b
						: Math.round((lhs.value.b - m) / rhs.value.b);
				return {
					type: this.program.types[Typeid.typeid_real],
					value: { b: d },
				};
			}
		} else
			this.error("/argument-mismatch/am-8", [
				TScript.displayname(lhs.type),
				TScript.displayname(rhs.type),
			]);
	},
	"%": function (lhs, rhs) {
		if (TScript.isNumeric(lhs.type) && TScript.isNumeric(rhs.type)) {
			if (
				TScript.isDerivedFrom(lhs.type, Typeid.typeid_integer) &&
				TScript.isDerivedFrom(rhs.type, Typeid.typeid_integer)
			)
				return {
					type: this.program.types[Typeid.typeid_integer],
					value: {
						b:
							Math.round(
								TScript.mod.call(this, lhs.value.b, rhs.value.b)
							) | 0,
					},
				};
			else
				return {
					type: this.program.types[Typeid.typeid_real],
					value: {
						b: TScript.mod.call(this, lhs.value.b, rhs.value.b),
					},
				};
		} else
			this.error("/argument-mismatch/am-9", [
				TScript.displayname(lhs.type),
				TScript.displayname(rhs.type),
			]);
	},
	"^": function (lhs, rhs) {
		if (TScript.isNumeric(lhs.type) && TScript.isNumeric(rhs.type)) {
			if (
				TScript.isDerivedFrom(lhs.type, Typeid.typeid_integer) &&
				TScript.isDerivedFrom(rhs.type, Typeid.typeid_integer) &&
				rhs.value.b >= 0
			) {
				let ret = 1;
				let factor = lhs.value.b;
				for (let i = 0; i < 32; i++) {
					if ((1 << i) & rhs.value.b)
						ret = TScript.mul32(ret, factor);
					factor = TScript.mul32(factor, factor);
				}
				return {
					type: this.program.types[Typeid.typeid_integer],
					value: { b: ret },
				};
			} else
				return {
					type: this.program.types[Typeid.typeid_real],
					value: { b: Math.pow(lhs.value.b, rhs.value.b) },
				};
		} else
			this.error("/argument-mismatch/am-10", [
				TScript.displayname(lhs.type),
				TScript.displayname(rhs.type),
			]);
	},
	":": function (lhs, rhs) {
		if (TScript.isDerivedFrom(lhs.type, Typeid.typeid_integer)) {
		} else if (
			TScript.isDerivedFrom(lhs.type, Typeid.typeid_real) &&
			TScript.isInt32(lhs.value.b)
		) {
		} else this.error("/argument-mismatch/am-11");
		if (TScript.isDerivedFrom(rhs.type, Typeid.typeid_integer)) {
		} else if (
			TScript.isDerivedFrom(rhs.type, Typeid.typeid_real) &&
			TScript.isInt32(rhs.value.b)
		) {
		} else this.error("/argument-mismatch/am-11");
		return {
			type: this.program.types[Typeid.typeid_range],
			value: { b: { begin: lhs.value.b | 0, end: rhs.value.b | 0 } },
		};
	},
	"==": function (lhs, rhs) {
		return {
			type: this.program.types[Typeid.typeid_boolean],
			value: { b: TScript.equal.call(this, lhs, rhs) },
		};
	},
	"!=": function (lhs, rhs) {
		return {
			type: this.program.types[Typeid.typeid_boolean],
			value: { b: !TScript.equal.call(this, lhs, rhs) },
		};
	},
	"<": function (lhs, rhs) {
		return {
			type: this.program.types[Typeid.typeid_boolean],
			value: { b: TScript.order.call(this, lhs, rhs) < 0 },
		};
	},
	"<=": function (lhs, rhs) {
		return {
			type: this.program.types[Typeid.typeid_boolean],
			value: { b: TScript.order.call(this, lhs, rhs) <= 0 },
		};
	},
	">": function (lhs, rhs) {
		return {
			type: this.program.types[Typeid.typeid_boolean],
			value: { b: TScript.order.call(this, lhs, rhs) > 0 },
		};
	},
	">=": function (lhs, rhs) {
		return {
			type: this.program.types[Typeid.typeid_boolean],
			value: { b: TScript.order.call(this, lhs, rhs) >= 0 },
		};
	},
	and: function (lhs, rhs) {
		if (
			TScript.isDerivedFrom(lhs.type, Typeid.typeid_boolean) &&
			TScript.isDerivedFrom(rhs.type, Typeid.typeid_boolean)
		) {
			return {
				type: this.program.types[Typeid.typeid_boolean],
				value: { b: lhs.value.b && rhs.value.b },
			};
		} else if (
			TScript.isDerivedFrom(lhs.type, Typeid.typeid_integer) &&
			TScript.isDerivedFrom(rhs.type, Typeid.typeid_integer)
		) {
			return {
				type: this.program.types[Typeid.typeid_integer],
				value: { b: lhs.value.b & rhs.value.b },
			};
		} else
			this.error("/argument-mismatch/am-12", [
				"and",
				TScript.displayname(lhs.type),
				TScript.displayname(rhs.type),
			]);
	},
	or: function (lhs, rhs) {
		if (
			TScript.isDerivedFrom(lhs.type, Typeid.typeid_boolean) &&
			TScript.isDerivedFrom(rhs.type, Typeid.typeid_boolean)
		) {
			return {
				type: this.program.types[Typeid.typeid_boolean],
				value: { b: lhs.value.b || rhs.value.b },
			};
		} else if (
			TScript.isDerivedFrom(lhs.type, Typeid.typeid_integer) &&
			TScript.isDerivedFrom(rhs.type, Typeid.typeid_integer)
		) {
			return {
				type: this.program.types[Typeid.typeid_integer],
				value: { b: lhs.value.b | rhs.value.b },
			};
		} else
			this.error("/argument-mismatch/am-12", [
				"or",
				TScript.displayname(lhs.type),
				TScript.displayname(rhs.type),
			]);
	},
	xor: function (lhs, rhs) {
		if (
			TScript.isDerivedFrom(lhs.type, Typeid.typeid_boolean) &&
			TScript.isDerivedFrom(rhs.type, Typeid.typeid_boolean)
		) {
			return {
				type: this.program.types[Typeid.typeid_boolean],
				value: { b: lhs.value.b !== rhs.value.b },
			};
		} else if (
			TScript.isDerivedFrom(lhs.type, Typeid.typeid_integer) &&
			TScript.isDerivedFrom(rhs.type, Typeid.typeid_integer)
		) {
			return {
				type: this.program.types[Typeid.typeid_integer],
				value: { b: lhs.value.b ^ rhs.value.b },
			};
		} else
			this.error("/argument-mismatch/am-12", [
				"xor",
				TScript.displayname(lhs.type),
				TScript.displayname(rhs.type),
			]);
	},
};

// This function checks whether the next token is a keyword. If so then
// the keyword is returned without altering the state, otherwise the
// function returns the empty string.
export function peek_keyword(state: ParserState): Keyword | "" {
	let where = state.get();
	state.skip();
	if (state.eof()) return "";

	let c = state.current();
	if ((c >= "A" && c <= "Z") || (c >= "a" && c <= "z") || c === "_") {
		// parse an identifier or a keyword
		let start = state.pos;
		state.advance();
		while (state.good()) {
			let c = state.current();
			if (
				(c >= "A" && c <= "Z") ||
				(c >= "a" && c <= "z") ||
				(c >= "0" && c <= "9") ||
				c === "_"
			)
				state.advance();
			else break;
		}
		let value = state.source.substring(start, state.pos);
		state.set(where);
		if (isKeyword(value)) return value;
		else return "";
	} else {
		state.set(where);
		return "";
	}
}
