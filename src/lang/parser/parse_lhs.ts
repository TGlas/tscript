import { ErrorHelper } from "../errors/ErrorHelper";
import { binary_operator_impl } from "./parser_helper";
import { TScript } from "..";
import { simtrue } from "../helpers/sims";
import { Typeid } from "../helpers/typeIds";
import { parse_expression } from "./parse_expression";
import { ParserState } from ".";

export function parse_lhs(state: ParserState, parent, options) {
	// parse the LHS as an expression
	let ex = parse_expression(state, parent, options, true);
	let back = ex.passResolveBack;

	ex.passResolveBack = function (state) {
		if (back) back(state);

		// replace the topmost step function
		if (ex.petype === "name") {
			if (
				ex.reference.petype !== "variable" &&
				ex.reference.petype !== "attribute"
			)
				state.error("/argument-mismatch/am-32", [
					"name of type '" + ex.reference.petype + "'",
				]);
			ex.step = function () {
				let frame = this.stack[this.stack.length - 1];
				let pe: any = frame.pe[frame.pe.length - 1];
				let ip = frame.ip[frame.ip.length - 1];

				let op = frame.temporaries.pop();
				let rhs = frame.temporaries.pop();
				let base: any = null;
				if (pe.scope === "global") base = this.stack[0].variables;
				else if (pe.scope === "local") base = frame.variables;
				else if (pe.scope === "object") base = frame.object.value.a;
				else
					ErrorHelper.assert(false, "unknown scope type " + pe.scope);
				let index = pe.id;

				let tv = base[index];
				if (!tv || !tv?.type || !tv?.value)
					this.error("/name/ne-29", [TScript.displayname(pe)]);

				if (op !== "=") {
					// binary operator corresponding to compound assignment
					let binop = op.substring(0, op.length - 1);
					rhs = binary_operator_impl[binop].call(
						this,
						base[index],
						rhs
					);
				}

				// actual assignment as a copy of the typed value
				base[index] = { type: rhs.type, value: rhs.value };

				frame.pe.pop();
				frame.ip.pop();
				return true;
			};
			ex.sim = simtrue;
		} else if (ex.petype === "item access") {
			ex.step = function () {
				let frame = this.stack[this.stack.length - 1];
				let pe: any = frame.pe[frame.pe.length - 1];
				let ip = frame.ip[frame.ip.length - 1];

				if (ip === 0) {
					// evaluate the container
					frame.pe.push(pe.base);
					frame.ip.push(-1);
					return false;
				} else if (ip === 1) {
					// evaluate the index
					frame.pe.push(pe.argument);
					frame.ip.push(-1);
					return false;
				} else {
					// obtain all relevant values
					let index = frame.temporaries.pop();
					let container = frame.temporaries.pop();
					let op = frame.temporaries.pop();
					let rhs = frame.temporaries.pop();

					// check validity
					let key;
					if (
						TScript.isDerivedFrom(
							container.type,
							Typeid.typeid_string
						)
					) {
						state.error("/argument-mismatch/am-32", [
							"a substring",
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
								state.error("/argument-mismatch/am-23", [
									TScript.toString.call(this, index),
								]);
							else if (index.value.b >= container.value.b.length)
								state.error("/argument-mismatch/am-24", [
									TScript.toString.call(this, index),
									container.value.b.length,
								]);
							key = index.value.b;
						} else
							state.error("/argument-mismatch/am-25", [
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
							!TScript.isDerivedFrom(
								index.type,
								Typeid.typeid_string
							)
						)
							state.error("/argument-mismatch/am-28", [
								TScript.displayname(index.type),
							]);
						key = "#" + index.value.b;
					} else
						state.error("/argument-mismatch/am-31b", [
							container.type,
						]);

					if (op !== "=") {
						// binary operator corresponding to compound assignment
						let binop = op.substring(0, op.length - 1);

						// in this specific case the key must exist
						if (
							TScript.isDerivedFrom(
								container.type,
								Typeid.typeid_dictionary
							)
						) {
							if (!container.value.b.hasOwnProperty(key))
								state.error("/argument-mismatch/am-27", [
									index.value.b,
								]);
						}

						rhs = binary_operator_impl[binop].call(
							this,
							container.value.b[key],
							rhs
						);
					}

					// actual assignment as a deep copy of the typed value
					container.value.b[key] = {
						type: rhs.type,
						value: rhs.value,
					};

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
		} else if (ex.petype.substring(0, 17) === "access of member ") {
			ex.step = function () {
				let frame = this.stack[this.stack.length - 1];
				let pe: any = frame.pe[frame.pe.length - 1];
				let ip = frame.ip[frame.ip.length - 1];
				if (ip === 0) {
					// evaluate the object
					frame.pe.push(pe.object);
					frame.ip.push(-1);
					return false;
				} else {
					// obtain all relevant values
					let object = frame.temporaries.pop();
					let op = frame.temporaries.pop();
					let rhs = frame.temporaries.pop();

					// find the public member in the super class chain
					let m: any = null;
					if (
						TScript.isDerivedFrom(object.type, Typeid.typeid_type)
					) {
						// static case
						let type = object.value.b;
						let sup = type;
						while (sup) {
							if (
								sup.staticmembers.hasOwnProperty(pe.member) &&
								sup.staticmembers[pe.member].access === "public"
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
								sup.members[pe.member].access === "public"
							) {
								m = sup.members[pe.member];
								break;
							} else if (
								sup.staticmembers.hasOwnProperty(pe.member) &&
								sup.staticmembers[pe.member].access === "public"
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

					// obtain container and index
					let container: any = null;
					let index: any = null;
					if (m.petype === "method") {
						// non-static method
						state.error("/argument-mismatch/am-32", ["a method"]);
					} else if (m.petype === "attribute") {
						// non-static attribute
						container = object.value.a;
						index = m.id;
					} else if (m.petype === "function") {
						// static function
						state.error("/argument-mismatch/am-32", [
							"a static method",
						]);
					} else if (m.petype === "variable") {
						// static variable
						container = this.stack[0].variables;
						index = m.id;
					} else if (m.petype === "type") {
						// nested class
						state.error("/argument-mismatch/am-32", ["a class"]);
					} else
						ErrorHelper.assert(
							false,
							"[member access] internal error; unknown member type " +
								m.petype
						);

					let tv = container[index];
					if (!tv || !tv?.type || !tv?.value)
						this.error("/name/ne-29", [TScript.displayname(m)]);

					if (op !== "=") {
						// binary operator corresponding to compound assignment
						let binop = op.substring(0, op.length - 1);
						rhs = binary_operator_impl[binop].call(
							this,
							container[index],
							rhs
						);
					}

					// actual assignment as a deep copy of the typed value
					container[index] = { type: rhs.type, value: rhs.value };

					frame.pe.pop();
					frame.ip.pop();
					return true;
				}
			};
			ex.sim = function () {
				let frame = this.stack[this.stack.length - 1];
				let ip = frame.ip[frame.ip.length - 1];
				return ip !== 0;
			};
		} else state.error("/argument-mismatch/am-32", [ex.petype]);
	};

	return ex;
}
