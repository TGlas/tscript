import { ErrorHelper } from "../errors/ErrorHelper";
import { Lexer } from "./lexer";
import { get_type, copyconstant } from "../interpreter/interpreter_helper";
import { TScript } from "..";
import { simfalse } from "../helpers/sims";
import { Typeid } from "../helpers/typeIds";
import { parse_expression } from "./parse_expression";
import { Options } from "../helpers/options";

// Parse the argument list of a function call.
// The expression to the left of the parenthesis is provided as #base.
export function parse_call(state, parent, base, options: Options) {
	// parse the opening parenthesis, which is assumed to be already detected
	let where = state.get();
	let token = Lexer.get_token(state, options);
	ErrorHelper.assert(token.value === "(", "[parse_call] internal error");

	// parse comma-separated list of possibly named expressions
	let args = new Array();
	token = Lexer.get_token(state, options, true);
	if (token.type === "grouping" && token.value === ")")
		Lexer.get_token(state, options);
	else {
		let forcenamed = false;
		while (true) {
			// check for named parameters
			let where = state.get();
			let named = false;
			let name = Lexer.get_token(state, options);
			if (name.type === "identifier") {
				let token = Lexer.get_token(state, options);
				if (token.type === "operator" && token.value === "=")
					named = true;
				else state.set(where);
			} else state.set(where);
			if (forcenamed && !named) state.error("/syntax/se-14");
			if (named) forcenamed = true;

			// handle the actual argument
			let ex = parse_expression(state, parent, options);
			if (named) {
				let pe: any = {
					petype: "named argument",
					where: where,
					parent: parent,
					name: name.value,
					argument: ex,
					step: function () {
						let frame = this.stack[this.stack.length - 1];
						let pe: any = frame.pe[frame.pe.length - 1];
						let ip = frame.ip[frame.ip.length - 1];
						if (ip === 0) {
							frame.pe.push(pe.argument);
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
				args.push(pe);
			} else args.push(ex);

			// delimiter or end
			token = Lexer.get_token(state, options);
			if (token.type === "grouping" && token.value === ")") break;
			else if (token.value !== ",") state.error("/syntax/se-15");
		}
	}

	// check arguments at parse time if possible (which is the case most of the time)
	if (base.petype === "constant") {
		// check base type
		let f: any = null;
		if (TScript.isDerivedFrom(base.typedvalue.type, Typeid.typeid_function))
			f = base.typedvalue.value.b.func;
		else if (
			TScript.isDerivedFrom(base.typedvalue.type, Typeid.typeid_type)
		) {
			let cls = base.typedvalue.value.b;
			if (cls.class_constructor) {
				if (cls.class_constructor.access !== "public") {
					// check whether the constructor is accessible from the current context
					let sub_cl = get_type(parent);
					let error = false;
					if (cls.class_constructor.access === "private") {
						if (sub_cl === null || sub_cl.id !== cls.id)
							error = true;
					} else if (cls.class_constructor.access === "protected") {
						if (
							sub_cl === null ||
							!TScript.isDerivedFrom(sub_cl, cls.id)
						)
							error = true;
					} else error = true;
					if (error)
						state.error("/name/ne-25", [
							TScript.displayname(cls),
							cls.class_constructor.access,
						]);
				}
			} else state.error("/name/ne-27", [TScript.displayname(cls)]);
			f = base.typedvalue.value.b.class_constructor;
		} else state.error("/syntax/se-16", [base.typedvalue.type]);

		let n = args.length; // number of given arguments
		let m = f.params.length; // number of required parameters
		let params = new Array(); // which parameters are provided?
		for (let i = 0; i < m; i++) params.push(false);

		// handle positional and named arguments
		for (let i = 0; i < n; i++) {
			if (args[i].petype === "named argument") {
				// parameter name lookup
				let name = args[i].name;
				let found = false;
				for (let j = 0; j < m; j++) {
					if (
						f.params[j].hasOwnProperty("name") &&
						f.params[j].name === name
					) {
						if (params[j])
							state.error("/name/ne-1", [
								name,
								TScript.displayname(f),
							]);
						params[j] = true;
						found = true;
						break;
					}
				}
				if (!found)
					state.error("/name/ne-2", [name, TScript.displayname(f)]);
			} else {
				if (i < params.length) params[i] = args[i];
				else state.error("/name/ne-3", [TScript.displayname(f)]);
			}
		}

		// check whether all missing parameters are covered by default values
		for (let j = 0; j < m; j++) {
			if (!params[j] && !f.params[j].hasOwnProperty("defaultvalue"))
				state.error("/name/ne-4", [j + 1, TScript.displayname(f)]);
		}
	}

	// create the function call operator
	return {
		petype: "function call",
		where: where,
		parent: parent,
		base: base,
		arguments: args,
		step: callstep,
		sim: callsim,
	};
}

// step function of function calls
export function callstep(options: Options) {
	let frame = this.stack[this.stack.length - 1];
	let pe = frame.pe[frame.pe.length - 1];
	let ip = frame.ip[frame.ip.length - 1];
	let n = pe.arguments.length;
	if (ip === 0) {
		// evaluate base
		frame.pe.push(pe.base);
		frame.ip.push(-1);
		return false;
	} else if (ip <= n) {
		// evaluate arguments of the call
		frame.pe.push(pe.arguments[ip - 1]);
		frame.ip.push(-1);
		return false;
	} else if (ip === n + 1) {
		// load the accumulated temporaries
		let args = new Array(n);
		for (let i = 0; i < n; i++) args[n - 1 - i] = frame.temporaries.pop();
		let f = frame.temporaries.pop();

		// check for a callable object
		let f_obj: any = null;
		let f_pe: any = null;
		if (TScript.isDerivedFrom(f.type, Typeid.typeid_function)) {
			f_pe = f.value.b.func;
			if (f.value.b.hasOwnProperty("object")) f_obj = f.value.b.object;
		} else if (TScript.isDerivedFrom(f.type, Typeid.typeid_type)) {
			ErrorHelper.assert(
				f.value.b.hasOwnProperty("class_constructor"),
				"[callstep] internal error; type does not have a constructor"
			);
			f_pe = f.value.b.class_constructor;
			if (pe.petype === "super call") f_obj = frame.object;
			else {
				// prepare the object for the constructor chain
				let cls = f.value.b;
				ErrorHelper.assert(
					cls.petype === "type",
					"[callstep] cannot find class of constructor"
				);
				f_obj = { type: cls, value: {} };
				if (cls.objectsize > 0) {
					f_obj.value.a = [];
					let n = {
						type: this.program.types[Typeid.typeid_null],
						value: { b: null },
					};
					for (let i = 0; i < cls.objectsize; i++)
						f_obj.value.a.push(n);
				}
				// initialize attributes
				let c = cls;
				while (c && c.variables) {
					for (let i = 0; i < c.variables.length; i++) {
						if (c.variables[i].hasOwnProperty("initializer")) {
							f_obj.value.a[
								c.variables[i].id
							] = copyconstant.call(
								this,
								c.variables[i].initializer.typedvalue
							);
						}
					}
					c = c.superclass;
				}

				// return value of construction is the new object
				frame.temporaries.push(f_obj);
			}
		} else
			ErrorHelper.error("/syntax/se-16", [TScript.displayname(f.type)]);

		// argument list for the call
		let m = f_pe.params.length;
		let params = new Array(m);

		// handle positional and named arguments
		for (let i = 0; i < n; i++) {
			if (pe.arguments[i].petype === "named argument") {
				// parameter name lookup
				let name = pe.arguments[i].name;
				let found = false;
				for (let j = 0; j < m; j++) {
					if (
						f_pe.params[j].hasOwnProperty("name") &&
						f_pe.params[j].name === name
					) {
						if (typeof params[j] !== "undefined")
							ErrorHelper.error("/name/ne-1", [
								name,
								TScript.displayname(f_pe),
							]);
						params[j] = args[i];
						found = true;
						break;
					}
				}
				if (!found)
					ErrorHelper.error("/name/ne-2", [
						name,
						TScript.displayname(f_pe),
					]);
			} else {
				if (i < params.length) params[i] = args[i];
				else
					ErrorHelper.error("/name/ne-3", [
						TScript.displayname(f_pe),
					]);
			}
		}

		// handle default values
		for (let j = 0; j < m; j++) {
			if (typeof params[j] === "undefined") {
				if (f_pe.params[j].hasOwnProperty("defaultvalue"))
					params[j] = f_pe.params[j].defaultvalue;
				else
					ErrorHelper.error("/name/ne-4", [
						j + 1,
						TScript.displayname(f_pe),
					]);
			}
		}

		// handle closure parameters
		if (f.value.b.hasOwnProperty("enclosed"))
			params = f.value.b.enclosed.concat(params);

		// make the actual call
		{
			// create a new stack frame with the function arguments as local variables
			let frame = {
				pe: [f_pe],
				ip: [-1],
				temporaries: [],
				variables: params,
				object: null,
				enclosed: null,
			};

			if (f_obj) frame.object = f_obj;
			if (f.value.b.hasOwnProperty("enclosed"))
				frame.enclosed = f.value.b.enclosed;
			this.stack.push(frame);
			if (this.stack.length >= options.maxstacksize)
				ErrorHelper.error("/logic/le-1");
		}
		return true;
	} else {
		frame.pe.pop();
		frame.ip.pop();
		return false;
	}
}

export function callsim() {
	let frame = this.stack[this.stack.length - 1];
	let pe = frame.pe[frame.pe.length - 1];
	let ip = frame.ip[frame.ip.length - 1];
	let n = pe.arguments.length;
	return ip === n + 1;
}
