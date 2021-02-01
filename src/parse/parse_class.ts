import { ErrorHelper } from "../errors/ErrorHelper";
import { Lexer } from "./lexer";
import { constantstep, get_program } from "../interpreter/interpreter_helper";
import { simfalse } from "../helpers/sims";
import { Typeid } from "../helpers/typeIds";
import { callsim, callstep } from "./parse_call";
import { constructorstep, parse_constructor } from "./parse_constructor";
import { parse_function } from "./parse_function";
import { parse_name } from "./parse_name";
import { parse_use } from "./parse_use";
import { parse_var } from "./parse_var";
import { Options } from "../helpers/options";

// Parse a class declaration.
export function parse_class(state, parent, options: Options)
{
	// handle the "class" keyword
	let where = state.get();
	let token = Lexer.get_token(state, options);
	ErrorHelper.assert(token.type === "keyword" && token.value === "class", "[parse_class] internal error");

	// obtain the class name
	token = Lexer.get_token(state, options);
	if (token.type !== "identifier") state.error("/syntax/se-54");
	let cname = token.value;
	if (parent.names.hasOwnProperty(cname)) state.error("/name/ne-18", [cname]);

	// check class name
	if (options.checkstyle && ! state.builtin() && (cname[0] < 'A' || cname[0] > 'Z'))
	{
		state.error("/style/ste-4", [cname]);
	}

	// create the class
	let cls:any = { "petype": "type", "where": where, "parent": parent, "objectsize": 0, "variables": new Array(), "staticvariables": new Array(), "members": {}, "staticmembers": {}, "name": cname, "names": {},
			"step": function()
					{
						let frame = this.stack[this.stack.length - 1];
						let pe:any = frame.pe[frame.pe.length - 1];
						let ip = frame.ip[frame.ip.length - 1];

						// initialize static variables and nested classes
						let keys = Object.keys(pe.staticmembers);
						if (ip < keys.length)
						{
							let sub = pe.staticmembers[keys[ip]];
							if (sub.petype === "type" || sub.petype === "variable")
							{
								frame.pe.push(sub);
								frame.ip.push(-1);
								return false;
							}
						}
						else
						{
							frame.pe.pop();
							frame.ip.pop();
							return false;
						}
					},
			"sim": simfalse,
		};
	parent.names[cname] = cls;

	// register the class as a new type
	let prog = get_program(parent);
	let id = prog.types.length;
	cls.id = id;
	prog.types.push(cls);

	// parse the optional super class
	token = Lexer.get_token(state, options);
	if (token.type === "operator" && token.value === ':')
	{
		let result = parse_name(state, parent, options, "super class declaration");
		cls.superclass = result.lookup;

		if (cls.superclass.petype !== "type") state.error("/name/ne-22", [result.name]);
		if (cls === cls.superclass) state.error("/name/ne-26", [result.name]);
		cls.objectsize = cls.superclass.objectsize;

		if (cls.superclass.class_constructor && cls.superclass.class_constructor.access === "private") state.error("/syntax/se-58");

		// parse the next token to check for '{'
		token = Lexer.get_token(state, options);
	}
	if (token.type !== "grouping" || token.value !== '{') state.error("/syntax/se-40", ["class declaration"]);
	state.indent.push(-1 - token.line);

	// parse the class body
	let access = null;
	while (true)
	{
		// check for end-of-class-body
		token = Lexer.get_token(state, options, true);
		if (token.type === "grouping" && token.value === '}')
		{
			state.indent.pop();
			if (options.checkstyle && ! state.builtin())
			{
				let indent = state.indentation();
				let topmost = state.indent[state.indent.length - 1];
				if (topmost >= 0 && topmost !== indent) state.error("/style/ste-2");
			}
			Lexer.get_token(state, options);
			break;
		}

		// parse access modifiers
		if (token.type === "keyword" && (token.value === "public" || token.value === "protected" || token.value === "private"))
		{
			access = token.value;
			Lexer.get_token(state, options);
			token = Lexer.get_token(state, options);
			if (token.type !== "operator" || token.value !== ':') state.error("/syntax/se-55", [access]);
			continue;
		}

		// parse static modifier
		let stat = false;
		if (token.type === "keyword" && token.value === "static")
		{
			stat = true;
			Lexer.get_token(state, options);
			token = Lexer.get_token(state, options, true);
		}

		// parse the actual member
		if (token.type === "keyword" && token.value === "var")
		{
			if (access === null) state.error("/syntax/se-56");

			let group = parse_var(state, cls, options, stat ? get_program(parent) : cls);
			for (let i=0; i<group.vars.length; i++)
			{
				let pe:any = group.vars[i];
				if (pe.hasOwnProperty("initializer") && pe.initializer.petype !== "constant") state.error("/syntax/se-57");

				pe.access = access;
				if (! stat)
				{
					pe.petype = "attribute";
					cls.members[pe.name] = pe;
				}
				else
				{
					pe.displayname = cname + "." + pe.name;
					cls.staticmembers[pe.name] = pe;
					cls.staticvariables.push(pe);
				}
			}
		}
		else if (token.type === "keyword" && token.value === "function")
		{
			if (access === null) state.error("/syntax/se-56");

			let pe:any = parse_function(state, cls, options, (stat ? "function" : "method"));
			if (stat) pe.displayname = cname + "." + pe.name;
			pe.access = access;
			if (stat) cls.staticmembers[pe.name] = pe;
			else cls.members[pe.name] = pe;
		}
		else if (token.type === "keyword" && token.value === "constructor")
		{
			if (cls.hasOwnProperty("class_constructor")) state.error("/syntax/se-59b");
			if (access === null) state.error("/syntax/se-56");
			if (stat) state.error("/syntax/se-59");

			let pe:any = parse_constructor(state, cls, options);
			pe.access = access;
			cls.class_constructor = pe;
		}
		else if (token.type === "keyword" && token.value === "class")
		{
			if (access === null) state.error("/syntax/se-56");
			if (stat) state.error("/syntax/se-60");

			let pe:any = parse_class(state, cls, options);
			pe.displayname = cname + "." + pe.name;
			pe.access = access;
			cls.staticmembers[pe.name] = pe;
		}
		else if (token.type === "keyword" && (token.value === "use" || token.value === "from"))
		{
			if (stat) state.error("/syntax/se-61");
			parse_use(state, cls, options);
		}
		else state.error("/syntax/se-62");
	}
	// no semicolon required after the class body (in contrast to C++)

	// create a public default constructor if necessary
	if (! cls.hasOwnProperty("class_constructor"))
	{
		cls.class_constructor = { "petype": "method", "where": cls.where, "access": "public", "declaration": true, "parent": cls, "commands": new Array(), "variables": new Array(), "name": "constructor", "names": {}, "params": new Array(), "step": constructorstep, "sim": simfalse };
		if (cls.hasOwnProperty("superclass"))
		{
			let base = {"petype": "constant",
			            "where": state.get(),
			            "typedvalue": {"type": get_program(parent).types[Typeid.typeid_type], "value": {"b": cls.superclass}},
			            "step": constantstep, "sim": simfalse};
			cls.class_constructor.supercall = { "petype": "super call", "parent": cls.class_constructor, "base": base, "arguments": new Array(), "step": callstep, "sim": callsim };
		}
	}

	return cls;
}