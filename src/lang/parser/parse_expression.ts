import { ErrorHelper } from "../errors/ErrorHelper";
import { Lexer } from "./lexer";
import {
	binary_operator_impl,
	binary_operator_precedence,
	left_unary_operator_impl,
	left_unary_operator_precedence,
} from "./parser_helper";
import {
	asConstant,
	constantstep,
	get_function,
	get_program,
	scopestep,
} from "../interpreter/interpreter_helper";
import { TScript } from "..";
import { simfalse } from "../helpers/sims";
import { Typeid } from "../helpers/typeIds";
import { parse_call } from "./parse_call";
import { parse_statement_or_declaration } from "./parse_statmentordeclaration";
import { parse_name } from "./parse_name";

export function parse_expression(
	state,
	parent,
	options,
	lhs: any | boolean = false
) {
	if (typeof lhs === "undefined") lhs = false;

	// stack of expressions and operators
	let stack = new Array();

	while (true) {
		// obtain the next token
		let where = state.get();
		let token = Lexer.get_token(state, options);

		// left-unary operators, parse now but handle later
		while (
			(token.type === "operator" || token.type === "keyword") &&
			left_unary_operator_impl.hasOwnProperty(token.value)
		) {
			if (lhs) state.error("/syntax/se-21");
			stack.push({
				operator: token.value,
				unary: true,
				precedence: left_unary_operator_precedence[token.value],
				where: where,
			});
			where = state.get();
			token = Lexer.get_token(state, options);
		}

		// actual core expression
		let ex: any = { parent: parent, where: where };
		if (token.type === "grouping" && token.value === "(") {
			ex.petype = "group";
			ex.sub = parse_expression(state, parent, options);
			let token = Lexer.get_token(state, options);
			if (token.type !== "grouping" || token.value !== ")")
				state.error("/syntax/se-22");
			ex.step = function () {
				let frame = this.stack[this.stack.length - 1];
				let ip = frame.ip[frame.ip.length - 1];
				let pe: any = frame.pe[frame.pe.length - 1];
				if (ip === 0) {
					frame.pe.push(pe.sub);
					frame.ip.push(-1);
					return false;
				} else {
					frame.pe.pop();
					frame.ip.pop();
					return false;
				}
			};
			ex.sim = simfalse;
		} else if (token.type === "keyword" && token.value === "null") {
			// constant
			ex.petype = "constant";
			ex.typedvalue = {
				type: get_program(parent).types[Typeid.typeid_null],
				value: { b: null },
			};
			ex.step = constantstep;
			ex.sim = simfalse;
		} else if (
			token.type === "keyword" &&
			(token.value === "true" || token.value === "false")
		) {
			// constant
			ex.petype = "constant";
			ex.typedvalue = {
				type: get_program(parent).types[Typeid.typeid_boolean],
				value: { b: token.value === "true" },
			};
			ex.step = constantstep;
			ex.sim = simfalse;
		} else if (token.type === "integer") {
			// constant
			let v = parseFloat(token.value);
			if (v > 2147483647) state.error("/syntax/se-23");
			v = v | 0;
			ex.petype = "constant";
			ex.typedvalue = {
				type: get_program(parent).types[Typeid.typeid_integer],
				value: { b: v },
			};
			ex.step = constantstep;
			ex.sim = simfalse;
		} else if (token.type === "real") {
			// constant
			let v = parseFloat(token.value);
			ex.petype = "constant";
			ex.typedvalue = {
				type: get_program(parent).types[Typeid.typeid_real],
				value: { b: v },
			};
			ex.step = constantstep;
			ex.sim = simfalse;
		} else if (token.type === "string") {
			// constant
			let v = token.value;
			while (true) {
				token = Lexer.get_token(state, options, true);
				if (token.type !== "string") break;
				token = Lexer.get_token(state, options);
				v += token.value;
			}
			ex.petype = "constant";
			ex.typedvalue = {
				type: get_program(parent).types[Typeid.typeid_string],
				value: { b: v },
			};
			ex.step = constantstep;
			ex.sim = simfalse;
		} else if (token.value === "[") {
			// create an array
			ex.petype = "array";
			ex.elements = new Array();
			ex.step = function () {
				let frame = this.stack[this.stack.length - 1];
				let pe: any = frame.pe[frame.pe.length - 1];
				let ip = frame.ip[frame.ip.length - 1];
				if (ip < pe.elements.length) {
					// get element number ip
					frame.pe.push(pe.elements[ip]);
					frame.ip.push(-1);
					return false;
				} else {
					// compose all elements to an array
					let a = new Array(pe.elements.length);
					for (let i = 0; i < pe.elements.length; i++) {
						a[pe.elements.length - 1 - i] = frame.temporaries.pop();
					}
					frame.temporaries.push({
						type: this.program.types[Typeid.typeid_array],
						value: { b: a },
					});
					frame.pe.pop();
					frame.ip.pop();
					return true;
				}
			};
			ex.sim = function () {
				let frame = this.stack[this.stack.length - 1];
				let pe: any = frame.pe[frame.pe.length - 1];
				let ip = frame.ip[frame.ip.length - 1];
				return ip >= pe.elements.length;
			};

			// parse the array elements
			let first = true;
			while (!state.eof()) {
				let token = Lexer.get_token(state, options, true);
				if (token.type === "grouping" && token.value === "]") {
					Lexer.get_token(state, options);
					break;
				}
				if (first) first = false;
				else {
					if (token.type !== "delimiter" || token.value !== ",")
						state.error("/syntax/se-24");
					Lexer.get_token(state, options);
					token = Lexer.get_token(state, options, true);
					if (token.type === "grouping" && token.value === "]") {
						Lexer.get_token(state, options);
						break;
					}
				}
				ex.elements.push(parse_expression(state, parent, options));
			}
			if (state.eof()) state.error("/syntax/se-25");

			// turn into a constant if possible
			let c = asConstant(ex, state);
			if (c !== null) ex = c;
		} else if (token.value === "{") {
			// create a dictionary
			ex.petype = "dictionary";
			ex.keys = new Array();
			ex.values = new Array();
			ex.step = function () {
				let frame = this.stack[this.stack.length - 1];
				let pe: any = frame.pe[frame.pe.length - 1];
				let ip = frame.ip[frame.ip.length - 1];
				let n = pe.keys.length;
				if (ip < n) {
					// get a value
					frame.pe.push(pe.values[ip]);
					frame.ip.push(-1);
					return false;
				} else {
					// compose all elements to a dictionary
					let d = {};
					for (let i = 0; i < n; i++) {
						let k = pe.keys[i];
						let v =
							frame.temporaries[frame.temporaries.length - n + i];
						ErrorHelper.assert(
							!d.hasOwnProperty("#" + k),
							"internal error; duplicate key in dictionary"
						);
						d["#" + k] = v;
					}
					frame.temporaries = frame.temporaries.slice(
						0,
						frame.temporaries.length - n
					);
					frame.temporaries.push({
						type: this.program.types[Typeid.typeid_dictionary],
						value: { b: d },
					});
					frame.pe.pop();
					frame.ip.pop();
					return true;
				}
			};
			ex.sim = function () {
				let frame = this.stack[this.stack.length - 1];
				let pe: any = frame.pe[frame.pe.length - 1];
				let ip = frame.ip[frame.ip.length - 1];
				let n = pe.keys.length;
				return ip >= n;
			};

			// parse the dictionary elements
			let first = true;
			let keys = {};
			while (!state.eof()) {
				let token = Lexer.get_token(state, options, true);
				if (token.type === "grouping" && token.value === "}") {
					Lexer.get_token(state, options);
					break;
				}
				if (first) first = false;
				else {
					if (token.type === "delimiter" && token.value !== ",")
						state.error("/syntax/se-27");
					Lexer.get_token(state, options);
					token = Lexer.get_token(state, options, true);
					if (token.type === "grouping" && token.value === "}") {
						Lexer.get_token(state, options);
						break;
					}
				}
				token = Lexer.get_token(state, options);
				if (token.type !== "string" && token.type !== "identifier")
					state.error("/syntax/se-28");
				if (keys.hasOwnProperty("#" + token.value))
					state.error("/syntax/se-26", [token.value]);
				keys["#" + token.value] = true;
				ex.keys.push(token.value);
				token = Lexer.get_token(state, options);
				if (token.type !== "operator" || token.value !== ":")
					state.error("/syntax/se-29");
				ex.values.push(parse_expression(state, parent, options));
			}
			if (state.eof()) state.error("/syntax/se-30");

			// turn into a constant if possible
			let c = asConstant(ex, state);
			if (c !== null) ex = c;
		} else if (
			token.type === "identifier" ||
			(token.type === "keyword" && token.value === "super")
		) {
			state.set(where);
			let result = parse_name(state, parent, options, "expression");
			let name = result.name;
			let lookup = result.lookup;

			// create the "name" object
			ex.petype = "name";
			ex.name = name;
			ex.reference = lookup;
			if (lookup.petype === "variable" || lookup.petype === "attribute") {
				ex.scope = lookup.scope;
				ex.id = lookup.id;
				ex.step = function () {
					let frame = this.stack[this.stack.length - 1];
					let pe: any = frame.pe[frame.pe.length - 1];
					let ip = frame.ip[frame.ip.length - 1];
					if (pe.scope === "global")
						frame.temporaries.push(this.stack[0].variables[pe.id]);
					else if (pe.scope === "local")
						frame.temporaries.push(frame.variables[pe.id]);
					else if (pe.scope === "object")
						frame.temporaries.push(frame.object.value.a[pe.id]);
					else
						ErrorHelper.assert(false, "unknown scope: " + pe.scope);
					frame.pe.pop();
					frame.ip.pop();
					return false;
				};
				ex.sim = simfalse;
			} else if (lookup.petype === "function") {
				ex.petype = "constant";
				ex.typedvalue = {
					type: get_program(parent).types[Typeid.typeid_function],
					value: { b: { func: lookup } },
				};
				ex.step = constantstep;
				ex.sim = simfalse;
			} else if (lookup.petype === "method") {
				ex.scope = lookup.scope;
				ex.id = lookup.id;
				ex.step = function () {
					let frame = this.stack[this.stack.length - 1];
					let pe: any = frame.pe[frame.pe.length - 1];
					let ip = frame.ip[frame.ip.length - 1];
					let result = {
						type: this.program.types[Typeid.typeid_function],
						value: {
							b: { func: pe.reference, object: frame.object },
						},
					};
					frame.temporaries.push(result);
					frame.pe.pop();
					frame.ip.pop();
					return false;
				};
				ex.sim = simfalse;
			} else if (lookup.petype === "type") {
				ex.petype = "constant";
				ex.typedvalue = {
					type: get_program(parent).types[Typeid.typeid_type],
					value: { b: lookup },
				};
				ex.step = constantstep;
				ex.sim = simfalse;
			} else
				ErrorHelper.assert(
					false,
					"If this assertion fails then error ne-10 must be re-activated."
				);
		} else if (token.type === "keyword" && token.value === "this") {
			// check for a method or an anonymous function
			let fn = get_function(parent);
			if (fn.petype === "method") {
				let cls = fn.parent;
				ErrorHelper.assert(
					cls.petype === "type",
					"cannot find class around this"
				);

				// create the "this" object
				ex.petype = "this";
				ex.step = function () {
					let frame = this.stack[this.stack.length - 1];
					frame.temporaries.push(frame.object);
					frame.pe.pop();
					frame.ip.pop();
					return false;
				};
				ex.sim = simfalse;
			} else if (
				fn.petype === "function" &&
				!fn.hasOwnProperty("name") &&
				fn.displayname === "(anonymous)"
			) {
				// create the "this" object
				ex.petype = "this";
				ex.step = function () {
					let frame = this.stack[this.stack.length - 1];
					let f: any = {
						type: this.program.types[Typeid.typeid_function],
						value: { b: { func: fn } },
					};
					if (frame.enclosed) f.value.b.enclosed = frame.enclosed;
					frame.temporaries.push(f);
					frame.pe.pop();
					frame.ip.pop();
					return false;
				};
				ex.sim = simfalse;
			} else state.error("/syntax/se-47");
		} else if (token.type === "keyword" && token.value === "function") {
			// create the anonymous function
			let func = {
				petype: "function",
				parent: parent,
				where: where,
				displayname: "(anonymous)",
				commands: new Array(),
				variables: new Array(),
				names: {},
				closureparams: new Array(),
				params: new Array(),
				step: scopestep,
				sim: simfalse,
			};

			// parse the closure parameters
			token = Lexer.get_token(state, options);
			if (token.type === "grouping" && token.value === "[") {
				while (true) {
					// parse ] or ,
					let where = state.get();
					let token = Lexer.get_token(state, options);
					if (token.type === "grouping" && token.value === "]") break;
					if (func.closureparams.length !== 0) {
						if (token.type !== "delimiter" || token.value !== ",")
							state.error("/syntax/se-31");
						where = state.get();
						token = Lexer.get_token(state, options);
					}

					// parse the parameter name
					if (token.type !== "identifier")
						state.error("/syntax/se-32");
					let name = token.value;
					if (func.names.hasOwnProperty(name))
						state.error("/name/ne-17", [name]);
					let id = func.variables.length;
					let variable = {
						petype: "variable",
						where: where,
						parent: ex,
						name: name,
						id: id,
						scope: "local",
					};

					// parse the initializer
					token = Lexer.get_token(state, options, true);
					if (token.type === "operator" && token.value === "=") {
						// explicit initializer, consume the "=" token
						Lexer.get_token(state, options);
					} else {
						if (token.type === "delimiter" && token.value === ",") {
						} else if (
							token.type === "grouping" &&
							token.value === "]"
						) {
						} else state.error("/syntax/se-31");

						// parse the identifier again, but this time as its own initializer
						state.set(where);
					}
					let initializer = parse_expression(state, parent, options);

					// register the closure parameter
					let param = { name: name, initializer: initializer };
					func.names[name] = variable;
					func.variables[id] = variable;
					func.closureparams.push(param);
				}

				// prepare the opening parenthesis
				token = Lexer.get_token(state, options);
			} else if (token.type !== "grouping" || token.value !== "(")
				state.error("/syntax/se-35");

			// parse the parameters
			if (token.type !== "grouping" || token.value !== "(")
				state.error("/syntax/se-36", ["anonymous function"]);
			while (true) {
				// parse ) or ,
				let token = Lexer.get_token(state, options, true);
				if (token.type === "grouping" && token.value === ")") {
					Lexer.get_token(state, options);
					break;
				}
				if (func.params.length !== 0) {
					if (token.type !== "delimiter" || token.value !== ",")
						state.error("/syntax/se-37");
					Lexer.get_token(state, options);
				}

				// parse the parameter name
				let where = state.get();
				token = Lexer.get_token(state, options);
				if (token.type !== "identifier") state.error("/syntax/se-33");
				let name = token.value;
				let id = func.variables.length;
				let variable = {
					petype: "variable",
					where: where,
					parent: func,
					name: name,
					id: id,
					scope: "local",
				};
				let param: any = { name: name };

				// check for a default value
				token = Lexer.get_token(state, options, true);
				if (token.type === "operator" && token.value === "=") {
					Lexer.get_token(state, options);
					let defaultvalue = parse_expression(state, parent, options);
					if (defaultvalue.petype !== "constant")
						state.error("/syntax/se-38");
					param.defaultvalue = defaultvalue.typedvalue;
				}

				// register the parameter
				if (func.names.hasOwnProperty(name))
					state.error("/name/ne-16", [name]);
				func.names[name] = variable;
				func.variables[id] = variable;
				func.params.push(param);
			}

			// parse the function body
			token = Lexer.get_token(state, options);
			if (token.type !== "grouping" || token.value !== "{")
				state.error("/syntax/se-40", ["anonymous function"]);
			state.indent.push(-1 - token.line);
			while (true) {
				token = Lexer.get_token(state, options, true);
				if (token.type === "grouping" && token.value === "}") {
					state.indent.pop();
					if (options.checkstyle && !state.builtin()) {
						let indent = state.indentation();
						let topmost = state.indent[state.indent.length - 1];
						if (topmost >= 0 && topmost > indent)
							state.error("/style/ste-2");
					}
					Lexer.get_token(state, options);
					break;
				}
				let cmd = parse_statement_or_declaration(state, func, options);
				func.commands.push(cmd);
			}

			// create the actual closure expression, which evaluates the closure parameters
			ex.petype = "closure";
			ex.func = func;
			ex.step = function () {
				let frame = this.stack[this.stack.length - 1];
				let pe: any = frame.pe[frame.pe.length - 1];
				let ip = frame.ip[frame.ip.length - 1];
				let n = pe.func.closureparams.length;
				if (ip < n) {
					// evaluate the closure parameters
					frame.pe.push(pe.func.closureparams[ip].initializer);
					frame.ip.push(-1);
					return false;
				} else {
					// create and return the closure function object
					let enc = frame.temporaries.slice(
						frame.temporaries.length - n
					);
					frame.temporaries.splice(frame.temporaries.length - n, n);
					frame.temporaries.push({
						type: this.program.types[Typeid.typeid_function],
						value: { b: { func: pe.func, enclosed: enc } },
					});
					frame.pe.pop();
					frame.ip.pop();
					return false;
				}
			};
			ex.sim = simfalse;
		} else if (token.type === "keyword")
			state.error("/syntax/se-41", [token.value]);
		else state.error("/syntax/se-42", [token.value]);

		// right-unary operators: dot, access, and call
		while (!state.eof()) {
			let where = state.get();
			token = Lexer.get_token(state, options, true);
			if (token.type === "delimiter" && token.value === ".") {
				// public member access operator
				Lexer.get_token(state, options);
				let token = Lexer.get_token(state, options);
				if (token.type !== "identifier") state.error("/syntax/se-43");
				let op = {
					petype: "access of member " + token.value,
					where: where,
					parent: parent,
					object: ex,
					member: token.value,
					step: function () {
						let frame = this.stack[this.stack.length - 1];
						let pe: any = frame.pe[frame.pe.length - 1];
						let ip = frame.ip[frame.ip.length - 1];
						if (ip === 0) {
							// evaluate the object
							frame.pe.push(pe.object);
							frame.ip.push(-1);
							return false;
						} else {
							// the actual access
							let object = frame.temporaries.pop();

							// find the public member in the super class chain
							let m: any = null;
							if (
								TScript.isDerivedFrom(
									object.type,
									Typeid.typeid_type
								)
							) {
								// static case
								let type = object.value.b;
								let sup = type;
								while (sup) {
									if (
										sup.staticmembers.hasOwnProperty(
											pe.member
										) &&
										sup.staticmembers[pe.member].access ===
											"public"
									) {
										m = sup.staticmembers[pe.member];
										break;
									}
									sup = sup.superclass;
								}
								if (m === null)
									state.error("/name/ne-12", [
										TScript.displayname(type),
										pe.member,
									]);
							} else {
								// non-static case
								let type = object.type;
								let sup = type;
								while (sup) {
									if (
										sup.members.hasOwnProperty(pe.member) &&
										sup.members[pe.member].access ===
											"public"
									) {
										m = sup.members[pe.member];
										break;
									} else if (
										sup.staticmembers.hasOwnProperty(
											pe.member
										) &&
										sup.staticmembers[pe.member].access ===
											"public"
									) {
										m = sup.staticmembers[pe.member];
										break;
									}
									sup = sup.superclass;
								}
								if (m === null)
									state.error("/name/ne-13", [
										TScript.displayname(type),
										pe.member,
									]);
							}

							// return the appropriate access object
							if (m.petype === "method") {
								// non-static method

								frame.temporaries.push({
									type: this.program.types[
										Typeid.typeid_function
									],
									value: { b: { func: m, object: object } },
								});
							} else if (m.petype === "attribute") {
								// non-static attribute
								frame.temporaries.push(object.value.a[m.id]);
							} else if (m.petype === "function") {
								// static function
								frame.temporaries.push({
									type: this.program.types[
										Typeid.typeid_function
									],
									value: { b: { func: m } },
								});
							} else if (m.petype === "variable") {
								// static variable
								frame.temporaries.push(
									this.stack[0].variables[m.id]
								);
							} else if (m.petype === "type") {
								// nested class
								frame.temporaries.push({
									type: this.program.types[
										Typeid.typeid_type
									],
									value: { b: m },
								});
							} else
								ErrorHelper.assert(
									false,
									"[member access] internal error; unknown member type " +
										m.petype
								);

							frame.pe.pop();
							frame.ip.pop();
							return true;
						}
					},
					sim: function () {
						let frame = this.stack[this.stack.length - 1];
						let ip = frame.ip[frame.ip.length - 1];
						return ip !== 0;
					},
				};
				ex.parent = op;
				ex = op;
			} else if (token.type === "grouping" && token.value === "(") {
				let op = parse_call(state, parent, ex, options);
				ex.parent = op;
				ex = op;
			} else if (token.type === "grouping" && token.value === "[") {
				// parse a single argument, no argument list
				Lexer.get_token(state, options);
				let arg = parse_expression(state, parent, options);
				let token = Lexer.get_token(state, options);
				if (token.type !== "grouping" || token.value !== "]")
					state.error("/syntax/se-44");
				let op = {
					petype: "item access",
					where: where,
					parent: parent,
					base: ex,
					argument: arg,
					step: function () {
						let frame = this.stack[this.stack.length - 1];
						let pe: any = frame.pe[frame.pe.length - 1];
						let ip = frame.ip[frame.ip.length - 1];
						if (ip === 0) {
							// evaluate base
							frame.pe.push(pe.base);
							frame.ip.push(-1);
							return false;
						} else if (ip === 1) {
							// evaluate the argument
							frame.pe.push(pe.argument);
							frame.ip.push(-1);
							return false;
						} else if (ip === 2) {
							// the actual access
							let index = frame.temporaries.pop();
							let container = frame.temporaries.pop();
							if (
								TScript.isDerivedFrom(
									container.type,
									Typeid.typeid_string
								)
							) {
								if (
									TScript.isDerivedFrom(
										index.type,
										Typeid.typeid_integer
									)
								) {
									if (index.value.b < 0)
										state.error(
											"/argument-mismatch/am-21",
											[TScript.toString.call(this, index)]
										);
									else if (
										index.value.b >=
										container.value.b.length
									)
										state.error(
											"/argument-mismatch/am-22",
											[
												TScript.toString.call(
													this,
													index
												),
												container.value.b.length,
											]
										);
									let code = container.value.b.charCodeAt(
										index.value.b
									);
									let ret = {
										type: this.program.types[
											Typeid.typeid_integer
										],
										value: { b: code },
									};
									frame.temporaries.push(ret);
								} else if (
									TScript.isDerivedFrom(
										index.type,
										Typeid.typeid_range
									)
								) {
									let a = index.value.b.begin;
									let b = index.value.b.end;
									if (a < 0) a = 0;
									if (b > container.value.b.length)
										b = container.value.b.length;
									let str = container.value.b.substring(a, b);
									let ret = {
										type: this.program.types[
											Typeid.typeid_string
										],
										value: { b: str },
									};
									frame.temporaries.push(ret);
								} else
									state.error("/argument-mismatch/am-20", [
										TScript.toString.call(this, index),
										TScript.displayname(index.type),
									]);
							} else if (
								TScript.isDerivedFrom(
									container.type,
									Typeid.typeid_array
								)
							) {
								if (
									TScript.isDerivedFrom(
										index.type,
										Typeid.typeid_integer
									)
								) {
									if (index.value.b < 0)
										state.error(
											"/argument-mismatch/am-23",
											[TScript.toString.call(this, index)]
										);
									else if (
										index.value.b >=
										container.value.b.length
									)
										state.error(
											"/argument-mismatch/am-24",
											[
												TScript.toString.call(
													this,
													index
												),
												container.value.b.length,
											]
										);
									else
										frame.temporaries.push(
											container.value.b[index.value.b]
										);
								} else if (
									TScript.isDerivedFrom(
										index.type,
										Typeid.typeid_range
									)
								) {
									let a = index.value.b.begin;
									let b = index.value.b.end;
									if (a < 0) a = 0;
									if (b > container.value.b.length)
										b = container.value.b.length;
									let arr = new Array();
									for (let i = a; i < b; i++)
										arr.push(container.value.b[i]);
									let ret = {
										type: this.program.types[
											Typeid.typeid_array
										],
										value: { b: arr },
									};
									frame.temporaries.push(ret);
								} else
									state.error("/argument-mismatch/am-26", [
										TScript.toString.call(this, index),
										TScript.displayname(index.type),
									]);
							} else if (
								TScript.isDerivedFrom(
									container.type,
									Typeid.typeid_dictionary
								)
							) {
								if (
									TScript.isDerivedFrom(
										index.type,
										Typeid.typeid_string
									)
								) {
									if (
										container.value.b.hasOwnProperty(
											"#" + index.value.b
										)
									)
										frame.temporaries.push(
											container.value.b[
												"#" + index.value.b
											]
										);
									else
										state.error(
											"/argument-mismatch/am-27",
											[index.value.b]
										);
								} else
									state.error("/argument-mismatch/am-28", [
										TScript.displayname(index.type),
									]);
							} else if (
								TScript.isDerivedFrom(
									container.type,
									Typeid.typeid_range
								)
							) {
								if (
									TScript.isDerivedFrom(
										index.type,
										Typeid.typeid_integer
									)
								) {
									let len = Math.max(
										0,
										container.value.b.end -
											container.value.b.begin
									);
									if (
										index.value.b < 0 ||
										index.value.b >= len
									)
										state.error(
											"/argument-mismatch/am-29",
											[
												TScript.toString.call(
													this,
													index
												),
												len,
											]
										);
									let ret = {
										type: this.program.types[
											Typeid.typeid_integer
										],
										value: {
											b:
												container.value.b.begin +
												index.value.b,
										},
									};
									frame.temporaries.push(ret);
								} else if (
									TScript.isDerivedFrom(
										index.type,
										Typeid.typeid_range
									)
								) {
									let len = Math.max(
										0,
										container.value.b.end -
											container.value.b.begin
									);
									let a = index.value.b.begin;
									let b = index.value.b.end;
									if (a < 0) a = 0;
									if (b > len) b = len;
									let ret = {
										type: this.program.types[
											Typeid.typeid_range
										],
										value: {
											b: {
												begin:
													container.value.b.begin + a,
												end:
													container.value.b.begin + b,
											},
										},
									};
									frame.temporaries.push(ret);
								} else
									state.error("/argument-mismatch/am-30", [
										TScript.toString.call(this, index),
										TScript.displayname(index.type),
									]);
							} else
								state.error("/argument-mismatch/am-31", [
									TScript.displayname(container.type),
								]);
							return true;
						} else {
							frame.pe.pop();
							frame.ip.pop();
							return false;
						}
					},
					sim: function () {
						let frame = this.stack[this.stack.length - 1];
						let ip = frame.ip[frame.ip.length - 1];
						return ip === 2;
					},
				};
				ex.parent = op;
				ex = op;
			} else break;
		}

		// push onto the stack
		stack.push(ex);

		// check for a binary operator
		token = Lexer.get_token(state, options, true);
		if (
			(token.type === "operator" || token.type === "keyword") &&
			binary_operator_impl.hasOwnProperty(token.value)
		) {
			if (lhs) state.error("/syntax/se-21");
			stack.push({
				operator: token.value,
				unary: false,
				precedence: binary_operator_precedence[token.value],
				where: where,
			});
			Lexer.get_token(state, options);
		} else break;
	}

	// process the unary operator at position j
	let processUnary = function (j) {
		// apply left-unary operator to encapsulate an expression
		ErrorHelper.assert(
			j >= 0 && j < stack.length,
			"[processUnary] index out of range"
		);
		ErrorHelper.assert(
			stack[j].hasOwnProperty("precedence") && stack[j].unary,
			"[processUnary] unary operator expected"
		);
		ErrorHelper.assert(
			left_unary_operator_impl.hasOwnProperty(stack[j].operator),
			"[processUnary] cannot find left-unary operator " +
				stack[j].operator
		);
		ErrorHelper.assert(
			stack.length > j + 1,
			"[processUnary] corrupted stack"
		);
		ErrorHelper.assert(
			!stack[j + 1].hasOwnProperty("precedence"),
			"[processUnary] corrupted stack"
		);
		let ex = {
			petype: "left-unary operator " + stack[j].operator,
			where: stack[j].where,
			parent: parent,
			operator: stack[j].operator,
			argument: stack[j + 1],
			step: function () {
				let frame = this.stack[this.stack.length - 1];
				let pe: any = frame.pe[frame.pe.length - 1];
				let ip = frame.ip[frame.ip.length - 1];
				if (ip === 0) {
					frame.pe.push(pe.argument);
					frame.ip.push(-1);
					return false;
				} else {
					// execute the actual operator logic
					let arg = frame.temporaries.pop();
					frame.temporaries.push(
						left_unary_operator_impl[pe.operator].call(this, arg)
					);

					frame.pe.pop();
					frame.ip.pop();
					return true;
				}
			},
			sim: function () {
				let frame = this.stack[this.stack.length - 1];
				let ip = frame.ip[frame.ip.length - 1];
				return ip !== 0;
			},
		};

		// turn into a constant if possible
		let c = asConstant(ex, state);
		if (c !== null) ex = c;

		// update the stack
		stack[j + 1].parent = ex;
		stack.splice(j, 2, ex);
	};

	// process the binary operator at position j
	let processBinary = function (j) {
		// apply the operator to merge two expression
		ErrorHelper.assert(
			j >= 0 && j < stack.length,
			"[processBinary] index out of range"
		);
		ErrorHelper.assert(
			stack[j].hasOwnProperty("precedence") && !stack[j].unary,
			"[processBinary] binary operator expected"
		);
		ErrorHelper.assert(
			binary_operator_impl.hasOwnProperty(stack[j].operator),
			"[processBinary] cannot find binary operator " + stack[j].operator
		);
		ErrorHelper.assert(
			j > 0 && stack.length > j + 1,
			"[processBinary] corrupted stack"
		);
		ErrorHelper.assert(
			!stack[j - 1].hasOwnProperty("precedence"),
			"[processBinary] corrupted stack"
		);
		ErrorHelper.assert(
			!stack[j + 1].hasOwnProperty("precedence"),
			"[processBinary] corrupted stack"
		);
		let ex: any = {
			petype: "binary operator " + stack[j].operator,
			where: stack[j].where,
			parent: parent,
			operator: stack[j].operator,
			lhs: stack[j - 1],
			rhs: stack[j + 1],
		};
		ex.step = function () {
			let frame = this.stack[this.stack.length - 1];
			let pe: any = frame.pe[frame.pe.length - 1];
			let ip = frame.ip[frame.ip.length - 1];
			if (ip === 0) {
				frame.pe.push(pe.lhs);
				frame.ip.push(-1);
				return false;
			} else if (ip === 1) {
				frame.pe.push(pe.rhs);
				frame.ip.push(-1);
				return false;
			} else {
				// execute the actual operator logic
				let rhs = frame.temporaries.pop();
				let lhs = frame.temporaries.pop();
				let result = binary_operator_impl[pe.operator].call(
					this,
					lhs,
					rhs
				);
				frame.temporaries.push(result);

				frame.pe.pop();
				frame.ip.pop();
				return true;
			}
		};
		ex.sim = function () {
			let frame = this.stack[this.stack.length - 1];
			let ip = frame.ip[frame.ip.length - 1];
			return ip > 1;
		};

		// turn into a constant if possible
		let c = asConstant(ex, state);
		if (c !== null) ex = c;

		// update the stack
		stack[j - 1].parent = ex;
		stack[j + 1].parent = ex;
		stack.splice(j - 1, 3, ex);
	};

	// reduce the stack at position #pos into an expression binding
	// with strength of at least #precedence
	let reduce = function (pos, precedence) {
		ErrorHelper.assert(pos < stack.length, "[reduce] invalid position");

		// handle leading unary operators
		if (stack[pos].hasOwnProperty("precedence")) {
			// the sequence starts with a unary operator
			ErrorHelper.assert(
				stack[pos].unary,
				"[reduce] unary operator expected"
			);
			reduce(pos + 1, stack[pos].precedence);
			ErrorHelper.assert(
				!stack[pos + 1].hasOwnProperty("precedence"),
				"[reduce] corrupted stack"
			);
			processUnary(pos);
			ErrorHelper.assert(
				!stack[pos].hasOwnProperty("precedence"),
				"[reduce] corrupted stack"
			);
		}

		// stop the recursion
		if (precedence <= 0) return;

		// handle binary operators and recurse
		while (true) {
			// recurse to handle stronger bindings
			reduce(pos, precedence - 1);

			// check for a binary operator
			if (pos + 1 >= stack.length) break;
			ErrorHelper.assert(
				stack[pos + 1].hasOwnProperty("precedence") &&
					!stack[pos + 1].unary &&
					stack[pos + 1].precedence >= precedence,
				"[reduce] operator mismatch"
			);
			if (stack[pos + 1].precedence > precedence) break;

			// recurse to handle stronger bindings on the RHS
			ErrorHelper.assert(
				pos + 2 < stack.length,
				"[reduce] invalid RHS position"
			);
			reduce(pos + 2, precedence - 1);

			// apply the binary operator
			processBinary(pos + 1);
			ErrorHelper.assert(
				!stack[pos].hasOwnProperty("precedence"),
				"[reduce] corrupted stack"
			);
		}
	};

	// reduce the whole stack
	reduce(0, 10);
	ErrorHelper.assert(
		stack.length === 1,
		"[parse_expression] stack was not reduced"
	);

	if (lhs) {
		if (stack[0].petype === "group")
			state.error("/argument-mismatch/am-32", [
				"expression in parentheses",
			]);
		if (stack[0].petype === "constant")
			state.error("/argument-mismatch/am-32", ["a constant"]);
		if (stack[0].petype === "function")
			state.error("/argument-mismatch/am-32", ["a function"]);
		if (stack[0].petype === "function call")
			state.error("/argument-mismatch/am-32", [
				"the result of a function call",
			]);
	}

	// return the resulting expression
	return stack[0];
}
