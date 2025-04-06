import { ErrorHelper } from "../errors/ErrorHelper";
import { Keyword, Lexer } from "./lexer";
import { get_program } from "../helpers/getParents";
import { constantstep } from "../helpers/steps";
import { Typeid } from "../helpers/typeIds";
import { constructorstep, callstep } from "../helpers/steps";
import { simfalse, callsim } from "../helpers/sims";
import { parse_function } from "./parse_function";
import { parse_use } from "./parse_use";
import { parse_var } from "./parse_var";
import { parse_expression, is_name } from "./parse_expression";
import { parse_constructor } from "./parse_constructor";
import { ParseOptions, ParserState } from ".";

// Parse a class declaration.
export function parse_class(state: ParserState, parent, options: ParseOptions) {
	// handle the "class" keyword
	let where = state.get();
	let token = Lexer.get_token(state, options);
	ErrorHelper.assert(
		token.type === "keyword" && token.value === "class",
		"[parse_class] internal error"
	);

	// obtain the class name
	token = Lexer.get_token(state, options);
	if (token.type !== "identifier") state.error("/syntax/se-54");
	let cname = token.value;
	if (parent.names.hasOwnProperty(cname)) {
		state.set(Lexer.before_token);
		state.error("/name/ne-18", [cname]);
	}

	// check class name
	if (
		options.checkstyle &&
		!state.builtin() &&
		(cname[0] < "A" || cname[0] > "Z")
	) {
		state.set(Lexer.before_token);
		state.error("/style/ste-4", [cname]);
	}

	// create the class
	let cls: any = {
		petype: "type",
		children: new Array(),
		where: where,
		parent: parent,
		objectsize: 0,
		variables: new Array(),
		staticvariables: new Array(),
		members: {},
		staticmembers: {},
		name: cname,
		names: {},
		step: function () {
			let frame = this.stack[this.stack.length - 1];
			let pe: any = frame.pe[frame.pe.length - 1];
			let ip = frame.ip[frame.ip.length - 1];

			// initialize static variables and nested classes
			let keys = Object.keys(pe.staticmembers);
			if (ip < keys.length) {
				let sub = pe.staticmembers[keys[ip]];
				if (sub.petype === "type" || sub.petype === "variable") {
					frame.pe.push(sub);
					frame.ip.push(-1);
					return false;
				}
			} else {
				frame.pe.pop();
				frame.ip.pop();
				return false;
			}
		},
		sim: simfalse,
		passResolveBack: function (state) {
			for (let name in cls.members) {
				let pe = cls.members[name];
				if (pe.petype != "attribute") continue;
				if (pe.hasOwnProperty("initializer")) {
					if (
						pe.initializer.petype === "name" &&
						pe.initializer.reference
					)
						pe.initializer = pe.initializer.reference;
					if (pe.initializer.petype !== "constant") {
						state.set(pe.where);
						state.error("/syntax/se-57");
					}
				}
			}
			for (let name in cls.staticmembers) {
				let pe = cls.staticmembers[name];
				if (pe.petype != "variable") continue;
				if (pe.hasOwnProperty("initializer")) {
					if (
						pe.initializer.petype === "name" &&
						pe.initializer.reference
					)
						pe.initializer = pe.initializer.reference;
					if (pe.initializer.petype !== "constant") {
						state.set(pe.where);
						state.error("/syntax/se-57");
					}
				}
			}
		},
	};
	parent.names[cname] = cls;

	// register the class as a new type
	let prog = get_program(parent);
	let id = prog.types.length;
	cls.id = id;
	prog.types.push(cls);

	// parse the optional super class
	token = Lexer.get_token(state, options);
	if (token.type === "operator" && token.value === ":") {
		// parse the superclass name
		let ex = parse_expression(state, parent, options);
		if (!is_name(ex) || ex["super"])
			state.error("/syntax/se-10", ["super class definition"]);
		let where = ex.where;
		cls.children.unshift(ex);

		// resolve the name of the super class
		let back = ex?.passResolveBack;
		ex.passResolveBack = function (state) {
			if (back) back(state);
			cls.children.shift();

			if (
				(ex.petype === "name" || ex.petype === "constant") &&
				ex.reference
			)
				ex = ex.reference;
			if (ex.petype !== "type") state.error("/name/ne-22", [ex.name]);
			cls.superclass = ex;
			cls.children.unshift(cls.superclass);

			let sup = cls.superclass;
			while (sup) {
				if (sup === cls) state.error("/name/ne-26", [ex.name]);
				sup = sup?.superclass;
			}

			if (
				cls.superclass.class_constructor &&
				cls.superclass.class_constructor.access === "private"
			)
				state.error("/syntax/se-58");

			// shift all attribute indices
			let n = cls.superclass.objectsize;
			cls.objectsize += n;
			for (let name in cls.members) {
				let pe = cls.members[name];
				if (pe.petype == "attribute") pe.id += n;
			}

			// add a "super call" to the default constructor
			if (cls.class_constructor.hasOwnProperty("defaultconstructor")) {
				let base = {
					petype: "constant",
					where: where,
					typedvalue: {
						type: get_program(parent).types[Typeid.typeid_type],
						value: { b: cls.superclass },
					},
					step: constantstep,
					sim: simfalse,
				};
				cls.class_constructor.supercall = {
					petype: "super call",
					parent: cls.class_constructor,
					base: base,
					arguments: new Array(),
					step: callstep,
					sim: callsim,
				};
			}
		};

		// parse the next token to check for '{'
		token = Lexer.get_token(state, options);
	}
	if (token.type !== "grouping" || token.value !== "{") {
		state.set(Lexer.before_token);
		state.error("/syntax/se-40", ["class declaration"]);
	}
	state.indent.push(-1 - token.line);

	// parse the class body
	let access: Keyword | null = null;
	while (true) {
		// check for end-of-class-body
		token = Lexer.get_token(state, options, true);
		if (token.type === "grouping" && token.value === "}") {
			state.indent.pop();
			if (options.checkstyle && !state.builtin()) {
				let indent = state.indentation();
				let topmost = state.indent[state.indent.length - 1];
				if (topmost >= 0 && topmost !== indent)
					state.error("/style/ste-2");
			}
			Lexer.get_token(state, options);
			break;
		}

		// parse access modifiers
		if (
			token.type === "keyword" &&
			(token.value === "public" ||
				token.value === "protected" ||
				token.value === "private")
		) {
			access = token.value;
			Lexer.get_token(state, options);
			token = Lexer.get_token(state, options);
			if (token.type !== "operator" || token.value !== ":") {
				state.set(Lexer.before_token);
				state.error("/syntax/se-55", [access]);
			}
			continue;
		}

		// parse static modifier
		let stat = false;
		if (token.type === "keyword" && token.value === "static") {
			stat = true;
			Lexer.get_token(state, options);
			token = Lexer.get_token(state, options, true);
		}

		// parse the actual member
		if (token.type === "keyword" && token.value === "var") {
			if (access === null) state.error("/syntax/se-56");

			let group = parse_var(
				state,
				cls,
				options,
				stat ? get_program(parent) : cls
			);
			for (let i = 0; i < group.vars.length; i++) {
				let pe: any = group.vars[i];
				cls.children.push(pe);
				pe.access = access;
				if (!stat) {
					pe.petype = "attribute";
					cls.members[pe.name] = pe;
				} else {
					pe.displayname = cname + "." + pe.name;
					cls.staticmembers[pe.name] = pe;
					cls.staticvariables.push(pe);
				}
			}
		} else if (token.type === "keyword" && token.value === "function") {
			if (access === null) state.error("/syntax/se-56");

			let pe: any = parse_function(
				state,
				cls,
				options,
				stat ? "function" : "method"
			);
			cls.children.push(pe);
			if (stat) pe.displayname = cname + "." + pe.name;
			pe.access = access;
			if (stat) cls.staticmembers[pe.name] = pe;
			else cls.members[pe.name] = pe;
		} else if (token.type === "keyword" && token.value === "constructor") {
			if (cls.hasOwnProperty("class_constructor"))
				state.error("/syntax/se-59b");
			if (access === null) state.error("/syntax/se-56");
			if (stat) state.error("/syntax/se-59");

			let pe: any = parse_constructor(state, cls, options);
			cls.children.push(pe);
			pe.access = access;
			cls.class_constructor = pe;
		} else if (token.type === "keyword" && token.value === "class") {
			if (access === null) state.error("/syntax/se-56");
			if (stat) state.error("/syntax/se-60");

			let pe: any = parse_class(state, cls, options);
			cls.children.push(pe);
			pe.displayname = cname + "." + pe.name;
			pe.access = access;
			cls.staticmembers[pe.name] = pe;
		} else if (
			token.type === "keyword" &&
			(token.value === "use" || token.value === "from")
		) {
			if (stat) state.error("/syntax/se-61");
			parse_use(state, cls, options);
		} else state.error("/syntax/se-62");
	}
	// no semicolon required after the class body (in contrast to C++)

	// create a public default constructor if necessary
	if (!cls.hasOwnProperty("class_constructor")) {
		cls.class_constructor = {
			defaultconstructor: true,
			petype: "method",
			where: cls.where,
			access: "public",
			declaration: true,
			parent: cls,
			commands: new Array(),
			variables: new Array(),
			name: "constructor",
			names: {},
			params: new Array(),
			step: constructorstep,
			sim: simfalse,
		};
		cls.children.push(cls.class_constructor);
	}

	return cls;
}
