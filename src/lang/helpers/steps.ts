import { ErrorHelper } from "../errors/ErrorHelper";
import { TScript } from "..";
import { Typeid } from "./typeIds";
import { copyconstant } from "../interpreter/interpreter_helper";
import { StepFn } from "../interpreter/program-elements";

/** step function of all constants */
export const constantstep: StepFn = function () {
	let frame = this.stack[this.stack.length - 1];
	let pe = frame.pe[frame.pe.length - 1];
	frame.temporaries.push(copyconstant.call(this, pe.typedvalue));
	frame.pe.pop();
	frame.ip.pop();
	return false;
};

/** step function of most scopes, including global scope and functions */
export const scopestep: StepFn = function () {
	let frame = this.stack[this.stack.length - 1];
	let pe = frame.pe[frame.pe.length - 1];
	let ip = frame.ip[frame.ip.length - 1];
	if (ip < pe.commands.length) {
		if (!pe.commands[ip].declaration) {
			frame.pe.push(pe.commands[ip]);
			frame.ip.push(-1);
		}
		return false;
	} else {
		frame.pe.pop();
		frame.ip.pop();
		if (pe.petype === "function") {
			this.stack.pop();
			let frame = this.stack[this.stack.length - 1];
			frame.temporaries.push({
				type: this.program.types[Typeid.typeid_null],
				value: { b: null },
			});
			return false;
		} else if (pe.petype === "global scope") {
			// the program has finished
			this.stack.pop();
			return false;
		} else return false;
	}
};

/** step function of constructors */
export const constructorstep: StepFn = function () {
	let frame = this.stack[this.stack.length - 1];
	let pe = frame.pe[frame.pe.length - 1];
	let ip = frame.ip[frame.ip.length - 1];
	if (ip === 0) {
		// call the super class constructor
		if (pe.hasOwnProperty("supercall")) {
			frame.pe.push(pe.supercall);
			frame.ip.push(-1);
		}
		return false;
	} else if (ip < pe.commands.length + 1) {
		// run the constructor commands
		if (!pe.commands[ip - 1].declaration) {
			frame.pe.push(pe.commands[ip - 1]);
			frame.ip.push(-1);
		}
		return false;
	} else {
		// return without a value
		frame.pe.pop();
		frame.ip.pop();
		this.stack.pop();
		return false;
	}
};

/** step function of function calls */
export const callstep: StepFn = function () {
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
							f_obj.value.a[c.variables[i].id] =
								copyconstant.call(
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
			ErrorHelper.error(
				"/syntax/se-16",
				[TScript.displayname(f.type)],
				this.stack
			);

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
							ErrorHelper.error(
								"/name/ne-1",
								[name, TScript.displayname(f_pe)],
								this.stack
							);
						params[j] = args[i];
						found = true;
						break;
					}
				}
				if (!found)
					ErrorHelper.error(
						"/name/ne-2",
						[name, TScript.displayname(f_pe)],
						this.stack
					);
			} else {
				if (i < params.length) params[i] = args[i];
				else
					ErrorHelper.error(
						"/name/ne-3",
						[TScript.displayname(f_pe)],
						this.stack
					);
			}
		}

		// handle default values
		for (let j = 0; j < m; j++) {
			if (typeof params[j] === "undefined") {
				if (f_pe.params[j].hasOwnProperty("defaultvalue"))
					params[j] = copyconstant.call(
						this,
						f_pe.params[j].defaultvalue
					);
				else
					ErrorHelper.error(
						"/name/ne-4",
						[j + 1, TScript.displayname(f_pe)],
						this.stack
					);
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
			if (this.stack.length >= this.maxStackSize)
				ErrorHelper.error("/logic/le-1", [], this.stack);
		}
		return true;
	} else {
		frame.pe.pop();
		frame.ip.pop();
		return false;
	}
};
