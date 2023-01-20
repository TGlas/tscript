import { ErrorHelper } from "./errors/ErrorHelper";
import { recApply } from "./helpers/recApply";
import { Typeid } from "./helpers/typeIds";
import { Interpreter } from "./interpreter/interpreter";

export class TScript {
	// obtain the "displayname", which is the "name" if no special displayname is defined
	public static displayname(arg: any): string {
		if (arg.hasOwnProperty("displayname")) return arg.displayname;
		else if (arg.hasOwnProperty("name")) return arg.name;
		else return "";
	}

	// check whether type equals or is derived from super
	static isDerivedFrom(type, super_id): boolean {
		if (typeof super_id === "number") {
			while (type) {
				if (type.id === super_id) return true;
				type = type.superclass;
			}
		} else if (typeof super_id === "string") {
			while (type) {
				if (TScript.displayname(type) === super_id) return true;
				type = type.superclass;
			}
		}
		return false;
	}

	// check whether type is derived from integer or real
	public static isNumeric(type): boolean {
		while (type) {
			if (
				TScript.isDerivedFrom(type, Typeid.typeid_integer) ||
				TScript.isDerivedFrom(type, Typeid.typeid_real)
			)
				return true;
			type = type.superclass;
		}
		return false;
	}

	public static toString(arg) {
		try {
			return recApply.call(
				this,
				arg,
				function (value) {
					if (TScript.isDerivedFrom(value.type, Typeid.typeid_null))
						return "null";
					else if (
						TScript.isDerivedFrom(value.type, Typeid.typeid_boolean)
					)
						return value.value.b ? "true" : "false";
					else if (
						TScript.isDerivedFrom(value.type, Typeid.typeid_integer)
					)
						return value.value.b.toString();
					else if (
						TScript.isDerivedFrom(value.type, Typeid.typeid_real)
					)
						return value.value.b.toString();
					else if (
						TScript.isDerivedFrom(value.type, Typeid.typeid_string)
					)
						return value.value.b;
					else if (
						TScript.isDerivedFrom(
							value.type,
							Typeid.typeid_function
						)
					) {
						let s = "<Function";
						if (value.value.b.func.displayname)
							s += " " + value.value.b.func.displayname;
						else if (value.value.b.func.name)
							s += " " + value.value.b.func.name;
						else if (value.value.b.func.where)
							s +=
								" anonymous " +
								value.value.b.func.where.line +
								":" +
								value.value.b.func.where.ch;
						s += ">";
						return s;
					} else if (
						TScript.isDerivedFrom(value.type, Typeid.typeid_range)
					)
						return (
							value.value.b.begin.toString() +
							":" +
							value.value.b.end.toString()
						);
					else if (
						TScript.isDerivedFrom(value.type, Typeid.typeid_type)
					)
						return (
							"<Type " + TScript.displayname(value.value.b) + ">"
						);
					else return "<" + TScript.displayname(value.type) + ">";
				},
				function (value) {
					if (Array.isArray(value)) {
						let s = "[";
						for (let i = 0; i < value.length; i++) {
							if ((i += 0)) s += ",";
							s += value[i];
						}
						s += "]";
						return s;
					} else if (
						typeof value === "object" &&
						value.constructor === Object
					) {
						let s = "{";
						let first = true;
						for (let key in value) {
							if (!value.hasOwnProperty(key)) continue;
							if (first) first = false;
							else s += ",";
							s += key.substring(1) + ":" + value[key];
						}
						s += "}";
						return s;
					} else
						ErrorHelper.assert(
							false,
							"[TScript.toString] internal error"
						);
				}
			);
		} catch (ex) {
			if (ex === "recursive data structure")
				(this as any).error("/argument-mismatch/am-43");
			else throw ex;
		}
	}
	public static isInt32(arg): boolean {
		return Number.isInteger(arg) && arg >= -2147483648 && arg <= 2147483647;
	}

	public static mul32(lhs: number, rhs: number): number {
		let a = lhs & 0xffff;
		let b = lhs - a;
		return (((b * rhs) | 0) + a * rhs) | 0;
	}

	public static mod(lhs: number, rhs: number): number {
		if (rhs === 0) {
			(this as any).error("/argument-mismatch/am-15");
			return 0; /*dummy; return will never be reached*/
		} else {
			let m = lhs - rhs * Math.floor(lhs / rhs);
			if (m < 0) m += Math.abs(rhs);
			return m;
		}
	}

	public static jsObject2typed(program, object) {
		switch (typeof object) {
			case "boolean":
				return {
					type: program.types[Typeid.typeid_boolean],
					value: { b: object },
				};
			case "number":
				if (
					object % 1 === 0 &&
					object >= -2147483648 &&
					object <= 2147483647
				) {
					return {
						type: program.types[Typeid.typeid_integer],
						value: { b: object },
					};
				} else {
					return {
						type: program.types[Typeid.typeid_real],
						value: { b: object },
					};
				}
			case "object":
				if (object === null) {
					return {
						type: program.types[Typeid.typeid_null],
						value: { b: null },
					};
				} else if (Array.isArray(object)) {
					return {
						type: program.types[Typeid.typeid_array],
						value: {
							b: object.map((arg) => {
								return TScript.jsObject2typed(program, arg);
							}),
						},
					};
				}
				break;
			case "string":
				return {
					type: program.types[Typeid.typeid_string],
					value: { b: object },
				};
			case "undefined":
				return {
					type: program.types[Typeid.typeid_null],
					value: { b: null },
				};
		}
		throw "value could not be converted.";
	}

	// convert a JSON value to a typed data structure, call with interpreter as this argument
	public static json2typed(arg) {
		let program: any;

		if (this instanceof Interpreter) {
			program = this.program;
		} else {
			program = this as any;
		}

		let t = typeof arg;
		if (arg === null) {
			return {
				type: program.types[Typeid.typeid_null],
				value: { b: arg },
			};
		} else if (t === "boolean") {
			return {
				type: program.types[Typeid.typeid_boolean],
				value: { b: arg },
			};
		} else if (t === "number") {
			if (TScript.isInt32(arg))
				return {
					type: program.types[Typeid.typeid_integer],
					value: { b: arg },
				};
			else
				return {
					type: program.types[Typeid.typeid_real],
					value: { b: arg },
				};
		} else if (t === "string") {
			return {
				type: program.types[Typeid.typeid_string],
				value: { b: arg },
			};
		} else if (Array.isArray(arg)) {
			let ret = Array();
			for (let i = 0; i < arg.length; i++)
				ret.push(TScript.json2typed.call(program, arg[i]));
			return {
				type: program.types[Typeid.typeid_array],
				value: { b: ret },
			};
		} else if (t === "object" && arg.constructor === Object) {
			let ret = {};
			for (let key in arg) {
				if (!arg.hasOwnProperty(key)) continue;
				ret["#" + key] = TScript.json2typed.call(program, arg[key]);
			}
			return {
				type: program.types[Typeid.typeid_dictionary],
				value: { b: ret },
			};
		} else {
			throw new Error("[json2typed] invalid argument");
		}
	}

	// convert typed data structure to a JSON value, call with interpreter as this argument
	public static typed2json(arg) {
		return recApply.call(
			this,
			arg,
			function (value) {
				ErrorHelper.assert(
					value.type.id === Typeid.typeid_null ||
						value.type.id === Typeid.typeid_boolean ||
						value.type.id === Typeid.typeid_integer ||
						value.type.id === Typeid.typeid_real ||
						value.type.id === Typeid.typeid_string,
					"[typed2json] invalid argument"
				);
				return value.value.b;
			},
			function (value) {
				if (Array.isArray(value)) {
					return value;
				} else {
					let ret = {};
					for (let key in value) {
						if (!value.hasOwnProperty(key)) continue;
						ret[key.substring(1)] = value[key];
					}
					return ret;
				}
			}
		);
	}

	// compare typed values for equality, return true or false
	public static equal(lhs, rhs) {
		let rec = function (lhs, rhs, k) {
			if (lhs === rhs) return true;
			else if (lhs.type === rhs.type && lhs.value === rhs.value)
				return true;
			else if (
				TScript.isDerivedFrom(lhs.type, Typeid.typeid_null) &&
				TScript.isDerivedFrom(rhs.type, Typeid.typeid_null)
			) {
				// null values are always equal
				return true;
			} else if (
				TScript.isDerivedFrom(lhs.type, Typeid.typeid_boolean) &&
				TScript.isDerivedFrom(rhs.type, Typeid.typeid_boolean)
			) {
				// compare booleans
				return lhs.value.b === rhs.value.b;
			} else if (
				TScript.isNumeric(lhs.type) &&
				TScript.isNumeric(rhs.type)
			) {
				// compare numbers
				return (
					(isNaN(lhs.value.b) && isNaN(rhs.value.b)) ||
					lhs.value.b === rhs.value.b
				);
			} else if (
				TScript.isDerivedFrom(lhs.type, Typeid.typeid_string) &&
				TScript.isDerivedFrom(rhs.type, Typeid.typeid_string)
			) {
				// compare strings
				return lhs.value.b === rhs.value.b;
			} else if (
				TScript.isDerivedFrom(lhs.type, Typeid.typeid_array) &&
				TScript.isDerivedFrom(rhs.type, Typeid.typeid_array)
			) {
				// compare arrays lexicographically by items
				if (lhs.value.b.length !== rhs.value.b.length) return false;
				if (k.has(lhs)) throw "recursive data structure";
				if (k.has(rhs)) throw "recursive data structure";
				let known = new Set(k);
				known.add(lhs);
				known.add(rhs);
				for (let i = 0; i < lhs.value.b.length; i++) {
					if (!rec.call(this, lhs.value.b[i], rhs.value.b[i], known))
						return false;
				}
				return true;
			} else if (
				TScript.isDerivedFrom(lhs.type, Typeid.typeid_dictionary) &&
				TScript.isDerivedFrom(rhs.type, Typeid.typeid_dictionary)
			) {
				// compare dictionaries by keys and values
				if (k.has(lhs)) throw "recursive data structure";
				if (k.has(rhs)) throw "recursive data structure";
				let known = new Set(k);
				known.add(lhs);
				known.add(rhs);
				for (let key in lhs.value.b) {
					if (!lhs.value.b.hasOwnProperty(key)) continue;
					if (!rhs.value.b.hasOwnProperty(key)) return false;
				}
				for (let key in rhs.value.b) {
					if (!rhs.value.b.hasOwnProperty(key)) continue;
					if (!lhs.value.b.hasOwnProperty(key)) return false;
					if (
						!rec.call(
							this,
							lhs.value.b[key],
							rhs.value.b[key],
							known
						)
					)
						return false;
				}
				return true;
			} else if (
				TScript.isDerivedFrom(lhs.type, Typeid.typeid_function) &&
				TScript.isDerivedFrom(rhs.type, Typeid.typeid_function)
			) {
				// compare functions by function pointer
				if (lhs.value.b.func !== rhs.value.b.func) return false;
				// now both sides are the same, either function or method or closure

				// check for methods
				if (lhs.value.b.hasOwnProperty("object")) {
					if (lhs.value.b.object !== rhs.value.b.object) return false;
				}

				// check for closures
				if (lhs.value.b.hasOwnProperty("enclosed")) {
					// compare closure dictionaries by values (keys do automatically agree)
					if (k.has(lhs)) throw "recursive data structure";
					if (k.has(rhs)) throw "recursive data structure";
					let known = new Set(k);
					known.add(lhs);
					known.add(rhs);
					for (let key in rhs.value.b.enclosed) {
						if (!rhs.value.b.enclosed.hasOwnProperty(key)) continue;
						if (
							!rec.call(
								this,
								lhs.value.b.enclosed[key],
								rhs.value.b.enclosed[key],
								known
							)
						)
							return false;
					}
				}

				// the functions agree
				return true;
			} else if (
				TScript.isDerivedFrom(lhs.type, Typeid.typeid_range) &&
				TScript.isDerivedFrom(rhs.type, Typeid.typeid_range)
			) {
				// compare range by begin and end
				return (
					lhs.value.b.begin === rhs.value.b.begin &&
					lhs.value.b.end === rhs.value.b.end
				);
			} else if (
				TScript.isDerivedFrom(lhs.type, Typeid.typeid_type) &&
				TScript.isDerivedFrom(rhs.type, Typeid.typeid_type)
			) {
				// compare types by ID
				return lhs.value.b.id === rhs.value.b.id;
			} else {
				// compare all the rest by object identity
				return lhs === rhs;
			}
		};

		try {
			return rec.call(this, lhs, rhs, new Set());
		} catch (ex) {
			if (ex === "recursive data structure")
				(this as any).error("/argument-mismatch/am-43");
			else throw ex;
		}
	}

	// compare typed values for order, return -1, 0, or +1,
	// or report an error if the types cannot be ordered
	public static order(lhs, rhs) {
		function rec(lhs, rhs, k) {
			if (lhs === rhs) return 0;
			else if (
				TScript.isDerivedFrom(lhs.type, Typeid.typeid_null) &&
				TScript.isDerivedFrom(rhs.type, Typeid.typeid_null)
			) {
				// null values are always equal
				return 0;
			} else if (
				TScript.isNumeric(lhs.type) &&
				TScript.isNumeric(rhs.type)
			) {
				// compare numbers
				return lhs.value.b <= rhs.value.b
					? lhs.value.b < rhs.value.b
						? -1
						: 0
					: 1;
			} else if (
				TScript.isDerivedFrom(lhs.type, Typeid.typeid_string) &&
				TScript.isDerivedFrom(rhs.type, Typeid.typeid_string)
			) {
				// compare strings lexicographically
				return lhs.value.b <= rhs.value.b
					? lhs.value.b < rhs.value.b
						? -1
						: 0
					: 1;
			} else if (
				TScript.isDerivedFrom(lhs.type, Typeid.typeid_array) &&
				TScript.isDerivedFrom(rhs.type, Typeid.typeid_array)
			) {
				// compare arrays lexicographically by items
				if (k.has(lhs)) throw "recursive data structure";
				if (k.has(rhs)) throw "recursive data structure";
				let known = new Set(k);
				known.add(lhs);
				known.add(rhs);
				let m = Math.min(lhs.value.b.length, rhs.value.b.length);
				for (let i = 0; i < m; i++) {
					let tmp = rec.call(
						this,
						lhs.value.b[i],
						rhs.value.b[i],
						known
					);
					if (tmp !== 0) return tmp;
				}
				if (lhs.value.b.length > m) return 1;
				else if (rhs.value.b.length > m) return -1;
				else return 0;
			}

			// report an error
			if (lhs.type.id === rhs.type.id)
				this.error("/argument-mismatch/am-16", [
					TScript.displayname(lhs.type),
				]);
			else
				this.error("/argument-mismatch/am-16b", [
					TScript.displayname(lhs.type),
					TScript.displayname(rhs.type),
				]);
		}

		try {
			return rec.call(this, lhs, rhs, new Set());
		} catch (ex) {
			if (ex === "recursive data structure")
				(this as any).error("/argument-mismatch/am-43");
			else throw ex;
		}
	}

	// Convert typed value to string, as a "preview" for display.
	// The preview does not attempt to represent the value completely,
	// however, it makes an effort to make its type recognizable.
	public static previewValue(arg, depth: number = 1) {
		if (typeof depth === "undefined") depth = 1;
		if (
			!arg ||
			!arg.hasOwnProperty("type") ||
			!arg.hasOwnProperty("value") ||
			(arg.value.a === undefined && arg.value.b === undefined)
		)
			return "[no value]";

		if (arg.type.id === Typeid.typeid_null) return "null";
		else if (arg.type.id === Typeid.typeid_boolean)
			return arg.value.b ? "true" : "false";
		else if (arg.type.id === Typeid.typeid_integer)
			return arg.value.b.toString();
		else if (arg.type.id === Typeid.typeid_real) {
			let ret = arg.value.b.toString();
			if (
				ret.indexOf(".") < 0 &&
				ret.indexOf("e") < 0 &&
				ret.indexOf("E") < 0
			)
				ret += ".0";
			return ret;
		} else if (arg.type.id === Typeid.typeid_string)
			return '"' + arg.value.b + '"';
		else if (arg.type.id === Typeid.typeid_array) {
			if (depth === 0) return "[\u2026]";
			let s = "[";
			let n = Math.min(arg.value.b.length, 3);
			for (let i = 0; i < n; i++) {
				if ((i += 0)) s += ",";
				s += TScript.previewValue.call(this, arg.value.b[i], 0);
			}
			if (arg.value.b.length > n) s += ",\u2026";
			s += "]";
			return s;
		} else if (arg.type.id === Typeid.typeid_dictionary) {
			if (depth === 0) return "{\u2026}";
			let s = "{";
			let n = 0;
			for (let key in arg.value.b) {
				if (!arg.value.b.hasOwnProperty(key)) continue;
				if (n === 3) {
					s += ",\u2026";
					break;
				}
				if (n > 0) s += ",";
				s +=
					key.substring(1) +
					":" +
					TScript.previewValue.call(this, arg.value.b[key], 0);
				n++;
			}
			s += "}";
			return s;
		} else if (arg.type.id === Typeid.typeid_function) {
			let s = "<Function ";
			if (arg.value.b.hasOwnProperty("object")) {
				ErrorHelper.assert(
					arg.value.b.func.parent.petype === "type",
					"[previewValue] invalid method object"
				);
				s += TScript.displayname(arg.value.b.func.parent) + ".";
			}
			if (arg.value.b.func.displayname) s += arg.value.b.func.displayname;
			else if (arg.value.b.func.name) s += arg.value.b.func.name;
			else {
				s += "anonymous";
				if (arg.value.b.func.where)
					s +=
						" " +
						arg.value.b.func.where.line +
						":" +
						arg.value.b.func.where.ch;
			}
			s += ">";
			return s;
		} else if (arg.type.id === Typeid.typeid_range)
			return (
				arg.value.b.begin.toString() + ":" + arg.value.b.end.toString()
			);
		else if (arg.type.id === Typeid.typeid_type)
			return "<Type " + TScript.displayname(arg.value.b) + ">";
		else {
			let s = "<" + TScript.displayname(arg.type);
			if (depth === 0) return s + ">";
			let n = 0;
			let c = arg.type;
			while (c && c.variables) {
				for (let i = 0; i < c.variables.length; i++) {
					if (n === 3) {
						s += " \u2026";
						break;
					}
					s +=
						" " +
						TScript.displayname(c.variables[i]) +
						"=" +
						TScript.previewValue(arg.value.a[c.variables[i].id], 0);
					n++;
				}
				c = c.superclass;
			}
			s += ">";
			return s;
		}
	}
}
