import { ErrorHelper } from "../errors/ErrorHelper";
import { TScript } from "..";
import { Typeid } from "../helpers/typeIds";
import { Version } from "../version";
import { simfalse, simtrue } from "../helpers/sims";
import { tscript_core } from "./core.tscript";
import { Interpreter, StackFrame } from "../interpreter/interpreter";

export const core = {
	source: tscript_core,

	impl: {
		Null: {
			constructor: function (object) {
				object.value.b = null;
			},
		},
		Boolean: {
			constructor: function (object, value) {
				if (value.value.b === undefined)
					this.error("/argument-mismatch/am-50");
				if (!TScript.isDerivedFrom(value.type, Typeid.typeid_boolean))
					this.error("/argument-mismatch/am-1", [
						"value",
						"Boolean.constructor",
						"boolean",
						TScript.displayname(value.type),
					]);
				object.value.b = value.value.b;
			},
		},
		Integer: {
			constructor: function (object, arg) {
				if (arg.value.b === undefined)
					this.error("/argument-mismatch/am-50");
				if (TScript.isDerivedFrom(arg.type, Typeid.typeid_boolean))
					object.value.b = arg.value.b ? 1 : 0;
				else if (TScript.isDerivedFrom(arg.type, Typeid.typeid_integer))
					object.value.b = arg.value.b;
				else if (TScript.isDerivedFrom(arg.type, Typeid.typeid_real)) {
					if (!Number.isFinite(arg.value.b))
						this.error("/argument-mismatch/am-13");
					object.value.b = Math.floor(arg.value.b) | 0;
				} else if (
					TScript.isDerivedFrom(arg.type, Typeid.typeid_string)
				) {
					let s = arg.value.b.trim();
					let v = 1;
					if (s.length === 0) this.error("/argument-mismatch/am-14");
					if (s[0] === "-") {
						v = -1;
						s = s.substr(1);
					} else if (s[0] === "+") {
						s = s.substr(1);
					}
					if (s.length === 0 || "0123456789.".indexOf(s[0]) < 0)
						this.error("/argument-mismatch/am-14");
					v *= Number(s);
					if (!Number.isFinite(v))
						this.error("/argument-mismatch/am-13");
					object.value.b = Math.floor(v) | 0;
				} else
					this.error("/argument-mismatch/am-1", [
						"value",
						"Integer.constructor",
						"boolean, integer, real, or string",
						TScript.displayname(arg.type),
					]);
			},
		},
		Real: {
			constructor: function (object, arg) {
				if (arg.value.b === undefined)
					this.error("/argument-mismatch/am-50");
				if (TScript.isDerivedFrom(arg.type, Typeid.typeid_boolean))
					object.value.b = arg.value.b ? 1 : 0;
				else if (
					TScript.isDerivedFrom(arg.type, Typeid.typeid_integer) ||
					TScript.isDerivedFrom(arg.type, Typeid.typeid_real)
				)
					object.value.b = arg.value.b;
				else if (
					TScript.isDerivedFrom(arg.type, Typeid.typeid_string)
				) {
					// parse a number by the same rules as Lexer::get_token, but also accept leading sign characters
					let s: string = arg.value.b.trim();
					let start: number = 0;
					let error = false;
					let factor = 1.0;
					while (
						start < s.length &&
						(s[start] == "-" || s[start] == "+" || s[start] == " ")
					) {
						if (s[start] == "-") factor *= -1.0;
						start++;
					}
					let pos: number = start;
					if (pos >= s.length || s[pos] < "0" || s[pos] > "9")
						error = true;
					while (pos < s.length && s[pos] >= "0" && s[pos] <= "9")
						pos++;
					if (pos < s.length && s[pos] === ".") {
						pos++;
						if (pos >= s.length || s[pos] < "0" || s[pos] > "9")
							error = true;
						while (pos < s.length && s[pos] >= "0" && s[pos] <= "9")
							pos++;
					}
					if (pos < s.length && (s[pos] === "e" || s[pos] === "E")) {
						pos++;
						if (s[pos] === "+" || s[pos] === "-") pos++;
						if (pos >= s.length || s[pos] < "0" || s[pos] > "9")
							error = true;
						while (pos < s.length && s[pos] >= "0" && s[pos] <= "9")
							pos++;
					}
					if (pos < s.length) error = true;
					if (error) object.value.b = NaN;
					else object.value.b = factor * Number(s.substring(start));
				} else object.value.b = NaN;
			},
			isFinite: function (object) {
				return {
					type: this.program.types[Typeid.typeid_boolean],
					value: { b: Number.isFinite(object.value.b) },
				};
			},
			isInfinite: function (object) {
				return {
					type: this.program.types[Typeid.typeid_boolean],
					value: {
						b:
							object.value.b === Number.POSITIVE_INFINITY ||
							object.value.b === Number.NEGATIVE_INFINITY,
					},
				};
			},
			isNan: function (object) {
				return {
					type: this.program.types[Typeid.typeid_boolean],
					value: { b: Number.isNaN(object.value.b) },
				};
			},
			inf: function (first, second) {
				return {
					type: this.program.types[Typeid.typeid_real],
					value: { b: Infinity },
				};
			},
			nan: function (first, second) {
				return {
					type: this.program.types[Typeid.typeid_real],
					value: { b: NaN },
				};
			},
		},
		String: {
			constructor: function (object, value) {
				if (value.value.b === undefined)
					this.error("/argument-mismatch/am-50");
				object.value.b = TScript.toString.call(this, value);
			},
			size: function (object) {
				return {
					type: this.program.types[Typeid.typeid_integer],
					value: { b: object.value.b.length },
				};
			},
			find: function (object, searchterm, start, backward) {
				if (
					!TScript.isDerivedFrom(
						searchterm.type,
						Typeid.typeid_string
					)
				)
					this.error("/argument-mismatch/am-1", [
						"searchterm",
						"String.find",
						"string",
						TScript.displayname(searchterm.type),
					]);
				if (!TScript.isDerivedFrom(start.type, Typeid.typeid_integer))
					this.error("/argument-mismatch/am-1", [
						"start",
						"String.find",
						"integer",
						TScript.displayname(start.type),
					]);
				if (
					!TScript.isDerivedFrom(backward.type, Typeid.typeid_boolean)
				)
					this.error("/argument-mismatch/am-1", [
						"backward",
						"String.find",
						"boolean",
						TScript.displayname(backward.type),
					]);
				let pos;
				if (backward.value.b)
					pos = object.value.b.lastIndexOf(
						searchterm.value.b,
						start.value.b
					);
				else
					pos = object.value.b.indexOf(
						searchterm.value.b,
						start.value.b
					);
				if (pos === -1)
					return {
						type: this.program.types[Typeid.typeid_null],
						value: { b: null },
					};
				else
					return {
						type: this.program.types[Typeid.typeid_integer],
						value: { b: pos },
					};
			},
			split: function (object, separator) {
				if (
					!TScript.isDerivedFrom(separator.type, Typeid.typeid_string)
				)
					this.error("/argument-mismatch/am-1", [
						"separator",
						"String.split",
						"string",
						TScript.displayname(separator.type),
					]);
				let a = object.value.b.split(separator.value.b);
				let arr = new Array();
				for (let i = 0; i < a.length; i++)
					arr.push({
						type: this.program.types[Typeid.typeid_string],
						value: { b: a[i] },
					});
				return {
					type: this.program.types[Typeid.typeid_array],
					value: { b: arr },
				};
			},
			fromUnicode: function (characters) {
				let s = "";
				if (
					TScript.isDerivedFrom(
						characters.type,
						Typeid.typeid_integer
					)
				) {
					s += String.fromCharCode(characters.value.b);
				} else if (
					TScript.isDerivedFrom(characters.type, Typeid.typeid_array)
				) {
					for (let i = 0; i < characters.value.b.length; i++) {
						let sub = characters.value.b[i];
						if (
							!TScript.isDerivedFrom(
								sub.type,
								Typeid.typeid_integer
							)
						)
							this.error("/argument-mismatch/am-1", [
								"characters",
								"String.fromUnicode",
								"integer or an array of integers",
								"array containing '" +
									TScript.displayname(sub.type) +
									"'",
							]);
						s += String.fromCharCode(sub.value.b);
					}
				} else
					this.error("/argument-mismatch/am-1", [
						"characters",
						"String.fromUnicode",
						"integer or an array of integers",
						TScript.displayname(characters.type),
					]);
				return {
					type: this.program.types[Typeid.typeid_string],
					value: { b: s },
				};
			},
			join: function (array, separator) {
				if (!TScript.isDerivedFrom(array.type, Typeid.typeid_array))
					this.error("/argument-mismatch/am-1", [
						"array",
						"String.join",
						"array",
						TScript.displayname(array.type),
					]);
				let sep = TScript.toString.call(this, separator);
				let arr = new Array();
				for (let e of array.value.b)
					arr.push(TScript.toString.call(this, e));
				return {
					type: this.program.types[Typeid.typeid_string],
					value: { b: arr.join(sep) },
				};
			},
			toLowerCase: function (object) {
				return {
					type: this.program.types[Typeid.typeid_string],
					value: { b: object.value.b.toLowerCase() },
				};
			},
			toUpperCase: function (object) {
				return {
					type: this.program.types[Typeid.typeid_string],
					value: { b: object.value.b.toUpperCase() },
				};
			},
			replace: function (object, pattern, replacement) {
				if (!TScript.isDerivedFrom(pattern.type, Typeid.typeid_string))
					this.error("/argument-mismatch/am-1", [
						"pattern",
						"String.replace",
						"string",
						TScript.displayname(pattern.type),
					]);
				if (
					!TScript.isDerivedFrom(
						replacement.type,
						Typeid.typeid_string
					)
				)
					this.error("/argument-mismatch/am-1", [
						"replacement",
						"String.replace",
						"string",
						TScript.displayname(replacement.type),
					]);
				return {
					type: this.program.types[Typeid.typeid_string],
					value: {
						b: object.value.b.replaceAll(
							pattern.value.b,
							replacement.value.b
						),
					},
				};
			},
		},
		Array: {
			constructor: function (object, size_or_other, value) {
				if (
					TScript.isDerivedFrom(
						size_or_other.type,
						Typeid.typeid_integer
					)
				) {
					if (size_or_other.value.b < 0)
						this.error("/argument-mismatch/am-17");
					let ret = new Array();
					for (let i = 0; i < size_or_other.value.b; i++)
						ret.push(value);
					object.value.b = ret;
				} else if (
					TScript.isDerivedFrom(
						size_or_other.type,
						Typeid.typeid_array
					)
				) {
					if (size_or_other.value.b === undefined)
						this.error("/argument-mismatch/am-50");
					object.value.b = size_or_other.value.b.slice();
				} else if (
					TScript.isDerivedFrom(
						size_or_other.type,
						Typeid.typeid_range
					)
				) {
					object.value.b = [];
					for (
						let i = size_or_other.value.b.begin;
						i < size_or_other.value.b.end;
						i++
					) {
						object.value.b.push({
							type: this.program.types[Typeid.typeid_integer],
							value: { b: i },
						});
					}
				} else
					this.error("/argument-mismatch/am-1", [
						"size_or_other",
						"Array.constructor",
						"integer, an array, or a range",
						TScript.displayname(size_or_other.type),
					]);
			},
			size: function (object) {
				return {
					type: this.program.types[Typeid.typeid_integer],
					value: { b: object.value.b.length },
				};
			},
			slice: function (object, start, end) {
				if (!TScript.isDerivedFrom(start.type, Typeid.typeid_integer)) {
					this.error("/argument-mismatch/am-1", [
						"start",
						"Array.slice",
						"integer",
						TScript.displayname(start.type),
					]);
				}

				if (!TScript.isDerivedFrom(end.type, Typeid.typeid_integer)) {
					this.error("/argument-mismatch/am-1", [
						"end",
						"Array.slice",
						"integer",
						TScript.displayname(end.type),
					]);
				}
				return {
					type: this.program.types[Typeid.typeid_array],
					value: {
						b: object.value.b.slice(start.value.b, end.value.b),
					},
				};
			},
			push: function (object, item) {
				object.value.b.push(item);
				return {
					type: this.program.types[Typeid.typeid_null],
					value: { b: null },
				};
			},
			pop: function (object) {
				if (object.value.b.length === 0)
					this.error("/argument-mismatch/am-18b");
				return object.value.b.pop();
			},
			insert: function (object, position, item) {
				if (
					!TScript.isDerivedFrom(position.type, Typeid.typeid_integer)
				)
					this.error("/argument-mismatch/am-1", [
						"position",
						"Array.insert",
						"integer",
						TScript.displayname(position.type),
					]);
				let index = position.value.b;
				if (index < 0 || index > object.value.b.length)
					this.error("/argument-mismatch/am-18", [
						index,
						object.value.b.length,
					]);
				object.value.b.splice(position.value.b, 0, item);
				return {
					type: this.program.types[Typeid.typeid_null],
					value: { b: null },
				};
			},
			remove: function (object, range) {
				let a, b;
				if (TScript.isDerivedFrom(range.type, Typeid.typeid_range)) {
					a = range.value.b.begin;
					b = range.value.b.end;
				} else if (
					TScript.isDerivedFrom(range.type, Typeid.typeid_integer)
				) {
					a = range.value.b;
					b = range.value.b + 1;
				} else
					this.error("/argument-mismatch/am-1", [
						"range",
						"Array.remove",
						"range or an integer",
						TScript.displayname(range.type),
					]);
				if (a < 0) a = 0;
				if (b > object.value.b.length) b = object.value.b.length;
				object.value.b.splice(a, b - a);
				return {
					type: this.program.types[Typeid.typeid_null],
					value: { b: null },
				};
			},
			sort: {
				step(this: Interpreter) {
					// iterative merge sort
					let frame = this.stack[this.stack.length - 1];
					let pe = frame.pe[frame.pe.length - 1];
					let ip = frame.ip[frame.ip.length - 1];
					if (ip === 0) {
						if (frame.object.value.b.length <= 1) {
							// trivial case
							this.stack.pop();
							this.stack[this.stack.length - 1].temporaries.push({
								type: this.program.types[Typeid.typeid_null],
								value: { b: null },
							});
							return false;
						}
						if (
							TScript.isDerivedFrom(
								frame.variables[0].type,
								Typeid.typeid_null
							)
						) {
							// one-step solution
							let interpreter = this;
							frame.object.value.b.sort(function (lhs, rhs) {
								return TScript.order.call(
									interpreter,
									lhs,
									rhs
								);
							});

							// return null
							this.stack.pop();
							this.stack[this.stack.length - 1].temporaries.push({
								type: this.program.types[Typeid.typeid_null],
								value: { b: null },
							});
							return false;
						} else if (
							TScript.isDerivedFrom(
								frame.variables[0].type,
								Typeid.typeid_function
							) &&
							frame.variables[0].value.b.func.params.length === 2
						) {
							// prepare the merge sort state data structure
							let state = {
								src: frame.object.value.b, // source array
								dst: [], // destination array
								chunksize: 1, // size of chunks to merge
								lb: 0,
								le: 1, // "left" chunk [lb, le[
								rb: 1,
								re: 2, // "right" chunk [rb, re[
							};
							frame.temporaries.push(state);
							return false;
						} else
							this.error("/argument-mismatch/am-1", [
								"comparator",
								"Array.sort",
								"function of two arguments",
								TScript.displayname(frame.variables[0].type),
							]);
					} else if (ip === 1) {
						// push the next comparison onto the stack
						let state =
							frame.temporaries[frame.temporaries.length - 1];
						let comp = frame.variables[0].value.b;
						let params = [state.src[state.lb], state.src[state.rb]];
						if (comp.hasOwnProperty("enclosed"))
							params = comp.enclosed.concat(params);
						let newframe: StackFrame = {
							pe: [comp.func],
							ip: [-1],
							temporaries: [],
							variables: params,
							object: null,
							enclosed: null,
						};
						if (comp.hasOwnProperty("object"))
							newframe.object = comp.object;
						if (comp.hasOwnProperty("enclosed"))
							newframe.enclosed = comp.enclosed;
						this.stack.push(newframe);
						if (this.stack.length >= this.maxStackSize)
							this.error("/logic/le-1");
						return false;
					} else if (ip === 2) {
						// evaluate the comparison
						let result = frame.temporaries.pop();
						if (!TScript.isNumeric(result.type))
							this.error("/argument-mismatch/am-19", [
								TScript.displayname(result.type),
							]);

						let state =
							frame.temporaries[frame.temporaries.length - 1];

						// perform a merge step
						if (result.value.b <= 0) {
							state.dst.push(state.src[state.lb]);
							state.lb++;
							if (state.lb === state.le) {
								while (state.rb < state.re) {
									state.dst.push(state.src[state.rb]);
									state.rb++;
								}
							}
						} else {
							state.dst.push(state.src[state.rb]);
							state.rb++;
							if (state.rb === state.re) {
								while (state.lb < state.le) {
									state.dst.push(state.src[state.lb]);
									state.lb++;
								}
							}
						}

						if (state.lb === state.le) {
							// merging the current chunks is complete
							if (
								state.src.length - state.re <=
								state.chunksize
							) {
								// copy the last chunk
								while (state.re < state.src.length) {
									state.dst.push(state.src[state.re]);
									state.re++;
								}

								// move on to larger chunks
								state.chunksize *= 2;
								state.lb = 0;
								state.le = state.chunksize;
								state.rb = state.chunksize;
								state.re = Math.min(
									2 * state.chunksize,
									state.src.length
								);
								state.src = state.dst;
								state.dst = [];

								// check whether we are done
								if (state.chunksize >= state.src.length)
									return false;
							} else {
								// prepare the next chunk
								state.lb = state.dst.length;
								state.le = state.lb + state.chunksize;
								state.rb = state.le;
								state.re = Math.min(
									state.rb + state.chunksize,
									state.src.length
								);
							}
						}

						// move back to step 1
						frame.ip[frame.ip.length - 1] = 1 - 1;
						return false;
					} else {
						// clean up
						let state =
							frame.temporaries[frame.temporaries.length - 1];
						frame.object.value.b = state.src;
						frame.temporaries.pop();

						// return null
						ErrorHelper.assert(
							frame.temporaries.length === 0,
							"non-empty temporaries stack in return from Array.sort"
						);
						this.stack.pop();
						this.stack[this.stack.length - 1].temporaries.push({
							type: this.program.types[Typeid.typeid_null],
							value: { b: null },
						});
						return false;
					}
				},
				sim: simfalse,
			},
			keys: function (object) {
				return {
					type: this.program.types[Typeid.typeid_range],
					value: { b: { begin: 0, end: object.value.b.length } },
				};
			},
			values: function (object) {
				return object;
			},
			concat: function (first, second) {
				if (!TScript.isDerivedFrom(first.type, Typeid.typeid_array))
					this.error("/argument-mismatch/am-1", [
						"first",
						"Array.concat",
						"array",
						TScript.displayname(first.type),
					]);
				if (!TScript.isDerivedFrom(second.type, Typeid.typeid_array))
					this.error("/argument-mismatch/am-1", [
						"second",
						"Array.concat",
						"array",
						TScript.displayname(second.type),
					]);
				let arr = new Array();
				for (let i = 0; i < first.value.b.length; i++)
					arr.push(first.value.b[i]);
				for (let i = 0; i < second.value.b.length; i++)
					arr.push(second.value.b[i]);
				return {
					type: this.program.types[Typeid.typeid_array],
					value: { b: arr },
				};
			},
		},
		Dictionary: {
			constructor: function (object, other) {
				if (TScript.isDerivedFrom(other.type, Typeid.typeid_null)) {
					object.value.b = {};
				} else if (
					TScript.isDerivedFrom(other.type, Typeid.typeid_dictionary)
				) {
					if (other.value.b === undefined)
						this.error("/argument-mismatch/am-50");
					object.value.b = Object.assign({}, other.value.b);
				} else
					this.error("/argument-mismatch/am-1", [
						"other",
						"Dictionary.constructor",
						"null or a dictionary",
						TScript.displayname(other.type),
					]);
			},
			size: function (object) {
				return {
					type: this.program.types[Typeid.typeid_integer],
					value: { b: Object.keys(object.value.b).length },
				};
			},
			has: function (object, key) {
				if (!TScript.isDerivedFrom(key.type, Typeid.typeid_string))
					this.error("/argument-mismatch/am-1", [
						"key",
						"Dictionary.has",
						"string",
						TScript.displayname(key.type),
					]);
				let ret = object.value.b.hasOwnProperty("#" + key.value.b);
				return {
					type: this.program.types[Typeid.typeid_boolean],
					value: { b: ret },
				};
			},
			remove: function (object, key) {
				if (!TScript.isDerivedFrom(key.type, Typeid.typeid_string))
					this.error("/argument-mismatch/am-1", [
						"key",
						"Dictionary.remove",
						"string",
						TScript.displayname(key.type),
					]);
				delete object.value.b["#" + key.value.b];
				return {
					type: this.program.types[Typeid.typeid_null],
					value: { b: null },
				};
			},
			keys: function (object) {
				let arr = new Array();
				for (let key in object.value.b) {
					if (!object.value.b.hasOwnProperty(key)) continue;
					arr.push({
						type: this.program.types[Typeid.typeid_string],
						value: { b: key.substring(1) },
					});
				}
				return {
					type: this.program.types[Typeid.typeid_array],
					value: { b: arr },
				};
			},
			values: function (object) {
				let arr = new Array();
				for (let key in object.value.b) {
					if (!object.value.b.hasOwnProperty(key)) continue;
					arr.push(object.value.b[key]);
				}
				return {
					type: this.program.types[Typeid.typeid_array],
					value: { b: arr },
				};
			},
			merge: function (first, second) {
				if (
					!TScript.isDerivedFrom(first.type, Typeid.typeid_dictionary)
				)
					this.error("/argument-mismatch/am-1", [
						"first",
						"Dictionary.merge",
						"dictionary",
						TScript.displayname(first.type),
					]);
				if (
					!TScript.isDerivedFrom(
						second.type,
						Typeid.typeid_dictionary
					)
				)
					this.error("/argument-mismatch/am-1", [
						"second",
						"Dictionary.merge",
						"dictionary",
						TScript.displayname(second.type),
					]);
				let dict = {};
				for (let key in first.value.b) {
					if (!first.value.b.hasOwnProperty(key)) continue;
					dict[key] = first.value.b[key];
				}
				for (let key in second.value.b) {
					if (!second.value.b.hasOwnProperty(key)) continue;
					dict[key] = second.value.b[key];
				}
				return {
					type: this.program.types[Typeid.typeid_dictionary],
					value: { b: dict },
				};
			},
		},
		Function: {
			constructor: function (object, value) {
				if (!TScript.isDerivedFrom(value.type, Typeid.typeid_function))
					this.error("/argument-mismatch/am-1", [
						"value",
						"Function.constructor",
						"function",
						TScript.displayname(value.type),
					]);
				if (value.value.b === undefined)
					this.error("/argument-mismatch/am-50");
				object.value.b = value.value.b;
			},
		},
		Range: {
			constructor: function (object, begin, end) {
				if (TScript.isDerivedFrom(begin.type, Typeid.typeid_integer)) {
				} else if (
					TScript.isDerivedFrom(begin.type, Typeid.typeid_real) &&
					TScript.isInt32(begin.value.b)
				) {
				} else
					this.error("/argument-mismatch/am-1", [
						"begin",
						"Range.constructor",
						"integer",
						TScript.displayname(begin.type),
					]);
				if (TScript.isDerivedFrom(end.type, Typeid.typeid_integer)) {
				} else if (
					TScript.isDerivedFrom(end.type, Typeid.typeid_real) &&
					TScript.isInt32(end.value.b)
				) {
				} else
					this.error("/argument-mismatch/am-1", [
						"end",
						"Range.constructor",
						"integer",
						TScript.displayname(end.type),
					]);
				object.value.b = { begin: begin.value.b, end: end.value.b };

				if (!TScript.isInt32(object.value.b.end - object.value.b.begin))
					this.error("/argument-mismatch/am-45", [
						"Arguments",
						"of Integers",
					]);
			},
			size: function (object) {
				return {
					type: this.program.types[Typeid.typeid_real],
					value: {
						b: Math.max(
							0,
							object.value.b.end - object.value.b.begin
						),
					},
				};
			},
			begin: function (object) {
				return {
					type: this.program.types[Typeid.typeid_integer],
					value: { b: object.value.b.begin },
				};
			},
			end: function (object) {
				return {
					type: this.program.types[Typeid.typeid_integer],
					value: { b: object.value.b.end },
				};
			},
		},
		Type: {
			constructor: function (object, value) {
				object.value.b = value.type;
			},
			superclass: function (type) {
				if (!TScript.isDerivedFrom(type.type, Typeid.typeid_type))
					this.error("/argument-mismatch/am-1", [
						"type",
						"Type.superclass",
						"type",
						TScript.displayname(type.type),
					]);
				if (type.value.b.hasOwnProperty("superclass"))
					return {
						type: this.program.types[Typeid.typeid_type],
						value: { b: type.value.b.superclass },
					};
				else
					return {
						type: this.program.types[Typeid.typeid_null],
						value: { b: null },
					};
			},
			isOfType: function (value, type) {
				if (!TScript.isDerivedFrom(type.type, Typeid.typeid_type))
					this.error("/argument-mismatch/am-1", [
						"type",
						"Type.isOfType",
						"type",
						TScript.displayname(type.type),
					]);
				let ret = false;
				let sub = value.type;
				let sup = type.value.b;
				while (true) {
					if (sub === sup) {
						ret = true;
						break;
					}
					if (sub.hasOwnProperty("superclass")) sub = sub.superclass;
					else break;
				}
				return {
					type: this.program.types[Typeid.typeid_boolean],
					value: { b: ret },
				};
			},
			isDerivedFrom: function (subclass, superclass) {
				if (!TScript.isDerivedFrom(subclass.type, Typeid.typeid_type))
					this.error("/argument-mismatch/am-1", [
						"subclass",
						"Type.isDerivedFrom",
						"type",
						TScript.displayname(subclass.type),
					]);
				if (!TScript.isDerivedFrom(superclass.type, Typeid.typeid_type))
					this.error("/argument-mismatch/am-1", [
						"superclass",
						"Type.isDerivedFrom",
						"type",
						TScript.displayname(superclass.type),
					]);
				let ret = false;
				let sub = subclass.value.b;
				let sup = superclass.value.b;
				while (true) {
					if (sub === sup) {
						ret = true;
						break;
					}
					if (sub.hasOwnProperty("superclass")) sub = sub.superclass;
					else break;
				}
				return {
					type: this.program.types[Typeid.typeid_boolean],
					value: { b: ret },
				};
			},
		},

		terminate: function () {
			this.status = "finished";
			if (this.service.statechanged) this.service.statechanged(true);
		},
		assert: function (condition, message) {
			if (!TScript.isDerivedFrom(condition.type, Typeid.typeid_boolean))
				this.error("/argument-mismatch/am-1", [
					"condition",
					"assert",
					"boolean",
					TScript.displayname(condition.type),
				]);
			if (!TScript.isDerivedFrom(message.type, Typeid.typeid_string))
				this.error("/argument-mismatch/am-1", [
					"message",
					"assert",
					"string",
					TScript.displayname(message.type),
				]);
			if (!condition.value.b) this.error("/user/ue-1", [message.value.b]);
			return {
				type: this.program.types[Typeid.typeid_null],
				value: { b: null },
			};
		},
		error: function (message) {
			if (!TScript.isDerivedFrom(message.type, Typeid.typeid_string))
				this.error("/argument-mismatch/am-1", [
					"message",
					"error",
					"string",
					TScript.displayname(message.type),
				]);
			this.error("/user/ue-2", [message.value.b]);
		},
		same: function (first, second) {
			let result = first === second;
			if (
				first.type.id == Typeid.typeid_array ||
				first.type.id == Typeid.typeid_dictionary
			)
				result = first.value.b === second.value.b;
			else if (first.type.id >= Typeid.typeid_class)
				result = first.value.a === second.value.a;
			return {
				type: this.program.types[Typeid.typeid_boolean],
				value: { b: result },
			};
		},
		version: function () {
			let ret = {
				"#type": {
					type: this.program.types[Typeid.typeid_string],
					value: { b: Version.type },
				},
				"#major": {
					type: this.program.types[Typeid.typeid_integer],
					value: { b: Version.major },
				},
				"#minor": {
					type: this.program.types[Typeid.typeid_integer],
					value: { b: Version.minor },
				},
				"#patch": {
					type: this.program.types[Typeid.typeid_integer],
					value: { b: Version.patch },
				},
				"#day": {
					type: this.program.types[Typeid.typeid_integer],
					value: { b: Version.day },
				},
				"#month": {
					type: this.program.types[Typeid.typeid_integer],
					value: { b: Version.month },
				},
				"#year": {
					type: this.program.types[Typeid.typeid_integer],
					value: { b: Version.year },
				},
				"#full": {
					type: this.program.types[Typeid.typeid_string],
					value: { b: Version.full() },
				},
			};
			return {
				type: this.program.types[Typeid.typeid_dictionary],
				value: { b: ret },
			};
		},
		print: function (text) {
			let s = TScript.toString.call(this, text);
			if (this.service.print) this.service.print(s);
			return {
				type: this.program.types[Typeid.typeid_null],
				value: { b: null },
			};
		},
		alert: function (text) {
			let s = TScript.toString.call(this, text);
			if (!this.service.documentation_mode && this.service.alert) {
				this.status = "dialog";
				this.service.statechanged?.(false);
				this.dialogResult = null;
				this.service.alert(s).then(() => {
					this.dialogResult = {
						type: this.program.types[Typeid.typeid_null],
						value: { b: null },
					};
				});
			}
			return {
				type: this.program.types[Typeid.typeid_null],
				value: { b: null },
			};
		},
		confirm: function (text) {
			let s = TScript.toString.call(this, text);
			if (!this.service.documentation_mode && this.service.confirm) {
				this.status = "dialog";
				this.service.statechanged?.(false);
				this.dialogResult = null;
				this.service.confirm(s).then((result) => {
					this.dialogResult = {
						type: this.program.types[Typeid.typeid_boolean],
						value: { b: result },
					};
				});
			}
			return {
				type: this.program.types[Typeid.typeid_boolean],
				value: { b: false },
			};
		},
		prompt: function (text) {
			let s = TScript.toString.call(this, text);
			if (!this.service.documentation_mode && this.service.prompt) {
				this.status = "dialog";
				this.service.statechanged?.(false);
				this.dialogResult = null;
				this.service.prompt(s).then((result) => {
					if (result === null)
						this.dialogResult = {
							type: this.program.types[Typeid.typeid_null],
							value: { b: null },
						};
					else
						this.dialogResult = {
							type: this.program.types[Typeid.typeid_string],
							value: { b: result },
						};
				});
			}
			return {
				type: this.program.types[Typeid.typeid_string],
				value: { b: "" },
			};
		},
		wait: function (milliseconds) {
			if (!TScript.isNumeric(milliseconds.type))
				this.error("/argument-mismatch/am-1", [
					"milliseconds",
					"wait",
					"numeric argument",
					TScript.displayname(milliseconds.type),
				]);
			if (!this.service.documentation_mode)
				this.wait(milliseconds.value.b);
			return {
				type: this.program.types[Typeid.typeid_null],
				value: { b: null },
			};
		},
		time: function () {
			return {
				type: this.program.types[Typeid.typeid_real],
				value: { b: new Date().getTime() },
			};
		},
		localtime: function () {
			let d = new Date();
			return {
				type: this.program.types[Typeid.typeid_real],
				value: { b: d.getTime() - 60000.0 * d.getTimezoneOffset() },
			};
		},
		exists: function (key) {
			if (!TScript.isDerivedFrom(key.type, Typeid.typeid_string))
				this.error("/argument-mismatch/am-1", [
					"key",
					"exists",
					"string",
					TScript.displayname(key.type),
				]);
			let ret =
				this.service.localStorage.getItem(
					"tscript.data." + key.value.b
				) !== null;
			return {
				type: this.program.types[Typeid.typeid_boolean],
				value: { b: ret },
			};
		},
		load: function (key) {
			if (!TScript.isDerivedFrom(key.type, Typeid.typeid_string))
				this.error("/argument-mismatch/am-1", [
					"key",
					"load",
					"string",
					TScript.displayname(key.type),
				]);
			let s: any = this.service.localStorage.getItem(
				"tscript.data." + key.value.b
			);
			if (s === null)
				this.error("/argument-mismatch/am-38", [key.value.b]);
			let j = JSON.parse(s);
			return TScript.json2typed.call(this, j);
		},
		save: function (key, value) {
			if (!TScript.isDerivedFrom(key.type, Typeid.typeid_string))
				this.error("/argument-mismatch/am-1", [
					"key",
					"save",
					"string",
					TScript.displayname(key.type),
				]);
			try {
				let j = TScript.typed2json.call(this, value);
				let s = JSON.stringify(j);
				this.service.localStorage.setItem(
					"tscript.data." + key.value.b,
					s
				);
				return {
					type: this.program.types[Typeid.typeid_null],
					value: { b: null },
				};
			} catch (ex) {
				this.error("/argument-mismatch/am-39");
			}
		},
		listKeys: function () {
			return TScript.jsObject2typed(
				this.program,
				Object.keys(this.service.localStorage) //will always return an array
					.filter((key) => {
						return key.startsWith("tscript.data.");
					}) //filter all that are not data
					.map((key) => {
						return key.substr("tscript.data.".length);
					}) //remove the prefix from the name
			);
		},

		deepcopy: function (value) {
			try {
				let copy = function copy(v, k) {
					if (v.type.id < Typeid.typeid_array) return v;
					else if (v.type.id === Typeid.typeid_array) {
						if (k.has(v)) throw "recursive data structure";
						let known = new Set(k);
						known.add(v);
						let b = new Array();
						for (let i = 0; i < v.value.b.length; i++) {
							let c = copy.call(this, v.value.b[i], known);
							b.push(c);
						}
						return {
							type: this.program.types[Typeid.typeid_array],
							value: { b: b },
						};
					} else if (v.type.id === Typeid.typeid_dictionary) {
						if (k.has(v)) throw "recursive data structure";
						let known = new Set(k);
						known.add(v);
						let b = {};
						for (let key in v.value.b) {
							if (!v.value.b.hasOwnProperty(key)) continue;
							let c = copy.call(this, v.value.b[key], known);
							b[key] = c;
						}
						return {
							type: this.program.types[Typeid.typeid_dictionary],
							value: { b: b },
						};
					} else if (v.type.id === Typeid.typeid_function) {
						if (v.value.b.func.hasOwnProperty("closureparams"))
							throw "a lambda function in the data structure";
						else return v;
					} else if (v.type.id === Typeid.typeid_range) return v;
					else if (v.type.id === Typeid.typeid_type) return v;
					else throw "an object in the data structure";
				};

				return copy.call(this, value, new Set());
			} catch (ex) {
				this.error("/argument-mismatch/am-42", [ex]);
			}
		},
		setEventHandler: function (event, handler) {
			if (!TScript.isDerivedFrom(event.type, Typeid.typeid_string))
				this.error("/argument-mismatch/am-1", [
					"event",
					"setEventHandler",
					"string",
					TScript.displayname(event.type),
				]);
			let name = event.value.b;
			if (
				!this.service.documentation_mode &&
				!this.eventnames.hasOwnProperty(name)
			)
				this.error("/argument-mismatch/am-40", [name]);
			if (
				handler.type.id !== Typeid.typeid_null &&
				!TScript.isDerivedFrom(handler.type, Typeid.typeid_function)
			)
				this.error("/argument-mismatch/am-1", [
					"handler",
					"setEventHandler",
					"Null or Function",
					TScript.displayname(handler.type),
				]);
			if (handler.value.b && handler.value.b.func.params.length !== 1)
				this.error("/argument-mismatch/am-41");
			this.setEventHandler(name, handler);
			return {
				type: this.program.types[Typeid.typeid_null],
				value: { b: null },
			};
		},
		enterEventMode: {
			step: function () {
				if (this.service.documentation_mode) {
					this.status = "finished";
					return false;
				}

				if (this.eventmode) this.error("/logic/le-2");
				this.eventmode = true;
				this.stack[this.stack.length - 1].pe.push({
					// this cumbersome inner command is necessary since function.step is expected to always return false
					step(this: Interpreter) {
						let frame = this.stack[this.stack.length - 1];
						if (!this.eventmode) {
							// return from event mode
							this.stack.pop();
							this.stack[this.stack.length - 1].temporaries.push(
								this.eventmodeReturnValue
							);
							return true;
						}

						// infinite loop
						frame.ip[frame.ip.length - 1]--; // infinite loop
						frame.temporaries = []; // discard return values (hack...)

						if (this.eventqueue.length === 0) {
							if (!this.service.documentation_mode) this.wait(10);
						} else {
							// handle the next event
							let t = this.eventqueue[0].type;
							let e = this.eventqueue[0].event;
							this.eventqueue.splice(0, 1);
							// this allows another timer event to be enqueued,
							// while the timer event is executed
							if (t === "timer") this.timerEventEnqueued = false;

							if (t === "quit") {
								this.status = "finished";
								if (this.service.statechanged)
									this.service.statechanged(true);
							} else if (this.eventhandler.hasOwnProperty(t)) {
								let handler = this.eventhandler[t];

								// argument list for the call
								let params = new Array(1);
								params[0] = e;

								// handle closure parameters
								if (handler.hasOwnProperty("enclosed"))
									params = handler.enclosed.concat(params);

								// create a new stack frame with the function arguments as local variables
								let frame: StackFrame = {
									pe: [handler.func],
									ip: [-1],
									temporaries: [],
									variables: params,
									object: null,
									enclosed: null,
								};
								if (handler.hasOwnProperty("object"))
									frame.object = handler.object;
								if (handler.hasOwnProperty("enclosed"))
									frame.enclosed = handler.enclosed;
								this.stack.push(frame);
								if (this.stack.length >= this.maxStackSize)
									this.error("/logic/le-1");
							}
						}

						return true;
					},
					sim: simtrue,
				});
				return false;
			},
			sim: simfalse,
		},
		quitEventMode(this: Interpreter, result: any) {
			if (!this.eventmode) this.error("/logic/le-3");
			this.eventmode = false;
			this.eventmodeReturnValue = result;
			return {
				type: this.program.types[Typeid.typeid_null],
				value: { b: null },
			};
		},
	},
};
