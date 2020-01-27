"use strict";

let isStrict = (function() { return !this; })();
if (! isStrict) console.log("WARNING: NOT IN STRICT MODE!");

///////////////////////////////////////////////////////////
// The TScript Programming Language
//
// This file defines the complete TScript programming
// language. See the documentation for details.
//


let TScript = (function() {

let module = {
	// T-Script version
	version: {
			type: "beta",
			major: 0,
			minor: 5,
			patch: 23,
			day: 9,
			month: 1,
			year: 2020,
			full: function()
					{
						let s = "TScript version " + module.version.major
								+ "." + module.version.minor
								+ "." + module.version.patch;
						if (module.version.type) s += " " + module.version.type
						s += " - released " + module.version.day
								+ "." + module.version.month
								+ "." + module.version.year
								+ " - (C) Tobias Glasmachers 2018" + "-" + module.version.year;
						return s;
					},
		},

	// hard-coded IDs of the core types
	typeid_null: 0,
	typeid_boolean: 1,
	typeid_integer: 2,
	typeid_real: 3,
	typeid_string: 4,
	typeid_array: 5,
	typeid_dictionary: 6,
	typeid_function: 7,
	typeid_range: 8,
	typeid_type: 9,
	typeid_class: 10,   // class IDs start here

	// implementation limit
	maxstacksize: 1000,

	// options and configurations
	options: {
			checkstyle: false,   // must be false by default, so counter examples in the documentation work
		},
};


///////////////////////////////////////////////////////////
// small helper functions
//

module.ex2string = function(ex)
{
	if (ex === undefined) return "undefined";
	if (ex === null) return "null";
	if (typeof ex == "object")
	{
		if (ex.hasOwnProperty("message")) return ex.message;
		if (ex.hasOwnProperty("name")) return ex.name;
	}
	return String(ex);
}

// exception type
function AssertionError(msg) { this.message = msg; }
AssertionError.prototype = new Error();

module.assert = function(condition, message)
{
	if (message === undefined) message = "TScript internal assertion failed";
	else message = "TScript internal assertion failed; " + message;
	if (! condition) throw new AssertionError(message);
}

// obtain the "displayname", which is the "name" if no special displayname is defined
module.displayname = function(arg)
{
	if (arg.hasOwnProperty("displayname")) return arg.displayname;
	else if (arg.hasOwnProperty("name")) return arg.name;
	else return "";
}

// check whether type equals or is derived from super
module.isDerivedFrom = function(type, super_id)
{
	if (typeof super_id == "number")
	{
		while (type)
		{
			if (type.id == super_id) return true;
			type = type.superclass;
		}
	}
	else if (typeof super_id == "string")
	{
		while (type)
		{
			if (module.displayname(type) == super_id) return true;
			type = type.superclass;
		}
	}
	return false;
}

// check whether type is derived from integer or real
module.isNumeric = function(type)
{
	while (type)
	{
		if (module.isDerivedFrom(type, module.typeid_integer) || module.isDerivedFrom(type, module.typeid_real)) return true;
		type = type.superclass;
	}
	return false;
}

// Recursively apply an operation to a loop-free typed data structure.
// If a loop is detected then a "recursive data structure" exception is thrown.
// The function operation is invoked on each non-container value.
// The function compose(...) is invoked on a container holding return values
// of operation and container. Both functions return the processed result.
function recApply(value, operation, compose)
{
	function doit(v, k)
	{
		if (v.type.id == module.typeid_array)
		{
			if (k.has(v)) throw "recursive data structure";
			let known = new Set(k)
			known.add(v);
			let b = [];
			for (let i=0; i<v.value.b.length; i++)
			{
				let c = doit.call(this, v.value.b[i], known);
				b.push(c);
			}
			return compose.call(this, b);
		}
		else if (v.type.id == module.typeid_dictionary)
		{
			if (k.has(v)) throw "recursive data structure";
			let known = new Set(k)
			known.add(v);
			let b = {};
			for (let key in v.value.b)
			{
				if (! v.value.b.hasOwnProperty(key)) continue;
				let c = doit.call(this, v.value.b[key], known);
				b[key] = c;
			}
			return compose.call(this, b);
		}
		else
		{
			return operation.call(this, v);
		}
	}
	return doit.call(this, value, new Set());
}

// convert typed value to string
module.toString = function (arg)
{
	try
	{
		return recApply(arg,
				function(value)
				{
					if (module.isDerivedFrom(value.type, module.typeid_null)) return "null";
					else if (module.isDerivedFrom(value.type, module.typeid_boolean)) return value.value.b ? "true" : "false";
					else if (module.isDerivedFrom(value.type, module.typeid_integer)) return value.value.b.toString();
					else if (module.isDerivedFrom(value.type, module.typeid_real)) return value.value.b.toString();
					else if (module.isDerivedFrom(value.type, module.typeid_string)) return value.value.b;
					else if (module.isDerivedFrom(value.type, module.typeid_function))
					{
						let s = "<Function";
						if (value.value.b.func.displayname) s += " " + value.value.b.func.displayname;
						else if (value.value.b.func.name) s += " " + value.value.b.func.name;
						else if (value.value.b.func.where) s += " anonymous " + value.value.b.func.where.line + ":" + value.value.b.func.where.ch;
						s += ">";
						return s;
					}
					else if (module.isDerivedFrom(value.type, module.typeid_range)) return value.value.b.begin.toString() + ":" + value.value.b.end.toString();
					else if (module.isDerivedFrom(value.type, module.typeid_type)) return "<Type " + module.displayname(value.value.b) + ">";
					else return "<" + module.displayname(value.type) + ">";
				},
				function(value)
				{
					if (Array.isArray(value))
					{
						let s = "[";
						for (let i=0; i<value.length; i++)
						{
							if (i += 0) s += ",";
							s += value[i];
						}
						s += "]";
						return s;
					}
					else if (typeof value == "object" && value.constructor == Object)
					{
						let s = "{";
						let first = true;
						for (let key in value)
						{
							if (! value.hasOwnProperty(key)) continue;
							if (first) first = false;
							else s += ",";
							s += key.substring(1) + ":" + value[key];
						}
						s += "}";
						return s;
					}
					else module.assert(false, "[module.toString] internal error");
				});
	}
	catch (ex)
	{
		if (ex == "recursive data structure") this.error("/argument-mismatch/am-43");
		else throw ex;
	}
}

module.isInt32 = function(arg)
{
	return (Number.isInteger(arg) && arg >= -2147483648 && arg <= 2147483647);
}

module.mul32 = function(lhs, rhs)
{
	let a = lhs & 0xffff;
	let b = lhs - a;
	return ((b * rhs | 0) + (a * rhs)) | 0;
}

module.mod = function(lhs, rhs)
{
	if (rhs == 0) this.error("/argument-mismatch/am-15");
	else return (rhs > 0)
			? lhs - rhs * Math.floor(lhs / rhs)
			: rhs * Math.floor(lhs / rhs) - lhs;
}

// convert a JSON value to a typed data structure, call with interpreter as this argument
module.json2typed = function(arg)
{
	let t = typeof arg;
	if (arg === null)
	{
		return {"type": this.program.types[module.typeid_null], "value": {"b": arg}};
	}
	else if (t == "boolean")
	{
		return {"type": this.program.types[module.typeid_boolean], "value": {"b": arg}};
	}
	else if (t == "number")
	{
		if (module.isInt32(arg)) return {"type": this.program.types[module.typeid_integer], "value": {"b": arg}};
		else return {"type": this.program.types[module.typeid_real], "value": {"b": arg}};
	}
	else if (t == "string")
	{
		return {"type": this.program.types[module.typeid_string], "value": {"b": arg}};
	}
	else if (Array.isArray(arg))
	{
		let ret = [];
		for (let i=0; i<arg.length; i++) ret.push(module.json2typed.call(this, arg[i]));
		return {"type": this.program.types[module.typeid_array], "value": {"b": ret}};
	}
	else if (t == "object" && arg.constructor == Object)
	{
		let ret = {};
		for (let key in arg)
		{
			if (! arg.hasOwnProperty(key)) continue;
			ret['#' + key] = module.json2typed.call(this, arg[key]);
		}
		return {"type": this.program.types[module.typeid_dictionary], "value": {"b": ret}};
	}
	else
	{
		throw new Error("[json2typed] invalid argument");
	}
}

// convert typed data structure to a JSON value, call with interpreter as this argument
module.typed2json = function(arg)
{
	return recApply(arg,
			function(value)
			{
				module.assert(value.type.id === module.typeid_null
						|| value.type.id === module.typeid_boolean
						|| value.type.id === module.typeid_integer
						|| value.type.id === module.typeid_real
						|| value.type.id === module.typeid_string,
						"[typed2json] invalid argument");
				return value.value.b;
			},
			function(value)
			{
				if (Array.isArray(value))
				{
					return value;
				}
				else
				{
					let ret = {};
					for (let key in value)
					{
						if (! value.hasOwnProperty(key)) continue;
						ret[key.substring(1)] = value[key];
					}
					return ret;
				}
			});
}

// compare typed values for equality, return true or false
module.equal = function(lhs, rhs)
{
	let rec = function(lhs, rhs, k)
	{
		if (lhs === rhs) return true;
		else if (lhs.type === rhs.type && lhs.value == rhs.value) return true;
		else if (module.isDerivedFrom(lhs.type, module.typeid_null) && module.isDerivedFrom(rhs.type, module.typeid_null))
		{
			// null values are always equal
			return true;
		}
		else if (module.isDerivedFrom(lhs.type, module.typeid_boolean) && module.isDerivedFrom(rhs.type, module.typeid_boolean))
		{
			// compare booleans
			return (lhs.value.b == rhs.value.b);
		}
		else if (module.isNumeric(lhs.type) && module.isNumeric(rhs.type))
		{
			// compare numbers
			return ((isNaN(lhs.value.b) && isNaN(rhs.value.b)) || (lhs.value.b == rhs.value.b));
		}
		else if (module.isDerivedFrom(lhs.type, module.typeid_string) && module.isDerivedFrom(rhs.type, module.typeid_string))
		{
			// compare strings
			return (lhs.value.b == rhs.value.b);
		}
		else if (module.isDerivedFrom(lhs.type, module.typeid_array) && module.isDerivedFrom(rhs.type, module.typeid_array))
		{
			// compare arrays lexicographically by items
			if (lhs.value.b.length != rhs.value.b.length) return false;
			if (k.has(lhs)) throw "recursive data structure";
			if (k.has(rhs)) throw "recursive data structure";
			let known = new Set(k)
			known.add(lhs);
			known.add(rhs);
			for (let i=0; i<lhs.value.b.length; i++)
			{
				if (! rec.call(this, lhs.value.b[i], rhs.value.b[i], known)) return false;
			}
			return true;
		}
		else if (module.isDerivedFrom(lhs.type, module.typeid_dictionary) && module.isDerivedFrom(rhs.type, module.typeid_dictionary))
		{
			// compare dictionaries by keys and values
			if (k.has(lhs)) throw "recursive data structure";
			if (k.has(rhs)) throw "recursive data structure";
			let known = new Set(k)
			known.add(lhs);
			known.add(rhs);
			for (let key in lhs.value.b)
			{
				if (! lhs.value.b.hasOwnProperty(key)) continue;
				if (! rhs.value.b.hasOwnProperty(key)) return false;
			}
			for (let key in rhs.value.b)
			{
				if (! rhs.value.b.hasOwnProperty(key)) continue;
				if (! lhs.value.b.hasOwnProperty(key)) return false;
				if (! rec.call(this, lhs.value.b[key], rhs.value.b[key], known)) return false;
			}
			return true;
		}
		else if (module.isDerivedFrom(lhs.type, module.typeid_function) && module.isDerivedFrom(rhs.type, module.typeid_function))
		{
			// compare functions by function pointer
			if (lhs.value.b.func != rhs.value.b.func) return false;
			// now both sides are the same, either function or method or closure

			// check for methods
			if (lhs.value.b.hasOwnProperty("object"))
			{
				if (lhs.value.b.object != rhs.value.b.object) return false;
			}

			// check for closures
			if (lhs.value.b.hasOwnProperty("enclosed"))
			{
				// compare closure dictionaries by values (keys do automatically agree)
				if (k.has(lhs)) throw "recursive data structure";
				if (k.has(rhs)) throw "recursive data structure";
				let known = new Set(k)
				known.add(lhs);
				known.add(rhs);
				for (let key in rhs.value.b.enclosed)
				{
					if (! rhs.value.b.enclosed.hasOwnProperty(key)) continue;
					if (! rec.call(this, lhs.value.b.enclosed[key], rhs.value.b.enclosed[key], known)) return false;
				}
			}

			// the functions agree
			return true;
		}
		else if (module.isDerivedFrom(lhs.type, module.typeid_range) && module.isDerivedFrom(rhs.type, module.typeid_range))
		{
			// compare range by begin and end
			return (lhs.value.b.begin == rhs.value.b.begin && lhs.value.b.end == rhs.value.b.end);
		}
		else if (module.isDerivedFrom(lhs.type, module.typeid_type) && module.isDerivedFrom(rhs.type, module.typeid_type))
		{
			// compare types by ID
			return (lhs.value.b.id == rhs.value.b.id);
		}
		else
		{
			// compare all the rest by object identity
			return (lhs === rhs);
		}
	}

	try
	{
		return rec.call(this, lhs, rhs, new Set());
	}
	catch (ex)
	{
		if (ex == "recursive data structure") this.error("/argument-mismatch/am-43");
		else throw ex;
	}
}

// compare typed values for order, return -1, 0, or +1,
// or report an error if the types cannot be ordered
module.order = function(lhs, rhs)
{
	function rec(lhs, rhs, k)
	{
		if (lhs === rhs) return 0;
		else if (module.isDerivedFrom(lhs.type, module.typeid_null) && module.isDerivedFrom(rhs.type, module.typeid_null))
		{
			// null values are always equal
			return 0;
		}
		else if (module.isNumeric(lhs.type) && module.isNumeric(rhs.type))
		{
			// compare numbers
			return (lhs.value.b <= rhs.value.b) ? ((lhs.value.b < rhs.value.b) ? -1 : 0) : 1;
		}
		else if (module.isDerivedFrom(lhs.type, module.typeid_string) && module.isDerivedFrom(rhs.type, module.typeid_string))
		{
			// compare strings lexicographically
			return (lhs.value.b <= rhs.value.b) ? ((lhs.value.b < rhs.value.b) ? -1 : 0) : 1;
		}
		else if (module.isDerivedFrom(lhs.type, module.typeid_array) && module.isDerivedFrom(rhs.type, module.typeid_array))
		{
			// compare arrays lexicographically by items
			if (k.has(lhs)) throw "recursive data structure";
			if (k.has(rhs)) throw "recursive data structure";
			let known = new Set(k)
			known.add(lhs);
			known.add(rhs);
			let m = Math.min(lhs.value.b.length, rhs.value.b.length);
			for (let i=0; i<m; i++)
			{
				let tmp = rec.call(this, lhs.value.b[i], rhs.value.b[i], known);
				if (tmp != 0) return tmp;
			}
			if (lhs.value.b.length > m) return 1;
			else if (rhs.value.b.length > m) return -1;
			else return 0;
		}

		// report an error
		if (lhs.type.id == rhs.type.id) this.error("/argument-mismatch/am-16", [module.displayname(lhs.type)]);
		else this.error("/argument-mismatch/am-16b", [module.displayname(lhs.type), module.displayname(rhs.type)]);
	}

	try
	{
		return rec.call(this, lhs, rhs, new Set());
	}
	catch (ex)
	{
		if (ex == "recursive data structure") this.error("/argument-mismatch/am-43");
		else throw ex;
	}
}

// Convert typed value to string, as a "preview" for display.
// The preview does not attempt to represent the value completely,
// however, it makes an effort to make its type recognizable.
module.previewValue = function (arg, depth)
{
	if (depth === undefined) depth = 1;
	if (! arg.hasOwnProperty("type") || ! arg.hasOwnProperty("value")) throw "[module.previewValue] invalid argument";

	if (arg.type.id == module.typeid_null) return "null";
	else if (arg.type.id == module.typeid_boolean) return arg.value.b ? "true" : "false";
	else if (arg.type.id == module.typeid_integer) return arg.value.b.toString();
	else if (arg.type.id == module.typeid_real)
	{
		let ret = arg.value.b.toString();
		if (ret.indexOf('.') < 0 && ret.indexOf('e') < 0 && ret.indexOf('E') < 0) ret += ".0";
		return ret;
	}
	else if (arg.type.id == module.typeid_string) return '\"' + arg.value.b + '\"';
	else if (arg.type.id == module.typeid_array)
	{
		if (depth == 0) return "[\u2026]";
		let s = "[";
		let n = Math.min(arg.value.b.length, 3);
		for (let i=0; i<n; i++)
		{
			if (i += 0) s += ",";
			s += module.previewValue.call(this, arg.value.b[i], 0);
		}
		if (arg.value.b.length > n) s += ",\u2026";
		s += "]";
		return s;
	}
	else if (arg.type.id == module.typeid_dictionary)
	{
		if (depth == 0) return "{\u2026}";
		let s = "{";
		let n = 0;
		for (let key in arg.value.b)
		{
			if (! arg.value.b.hasOwnProperty(key)) continue;
			if (n == 3)
			{
				s += ",\u2026";
				break;
			}
			if (n > 0) s += ",";
			s += key.substring(1) + ":" + module.previewValue.call(this, arg.value.b[key], 0);
			n++;
		}
		s += "}";
		return s;
	}
	else if (arg.type.id == module.typeid_function)
	{
		let s = "<Function ";
		if (arg.value.b.hasOwnProperty("object")) s += module.displayname(arg.value.b.object.type) + ".";
		if (arg.value.b.func.displayname) s += arg.value.b.func.displayname;
		else if (arg.value.b.func.name) s += arg.value.b.func.name;
		else
		{
			s += "anonymous";
			if (arg.value.b.func.where) s += " " + arg.value.b.func.where.line + ":" + arg.value.b.func.where.ch;
		}
		s += ">";
		return s;
	}
	else if (arg.type.id == module.typeid_range) return arg.value.b.begin.toString() + ":" + arg.value.b.end.toString();
	else if (arg.type.id == module.typeid_type) return "<Type " + module.displayname(arg.value.b) + ">";
	else
	{
		let s = "<" + module.displayname(arg.type);
		if (depth == 0) return s + ">";
		let n = 0;
		let c = arg.type;
		while (c && c.variables)
		{
			for (let i=0; i<c.variables.length; i++)
			{
				if (n == 3)
				{
					s += " \u2026";
					break;
				}
				s += " " + module.displayname(c.variables[i]) + "=" + module.previewValue(arg.value.a[c.variables[i].id], 0);
				n++;
			}
			c = c.superclass;
		}
		s += ">";
		return s;
	}
}


///////////////////////////////////////////////////////////
// error messages
//
// Nested dictionary of all error messages. An error is
// identified by an ID, which is an absolute path into the
// data structure.
//

let errors = {
	"syntax": {
		"se-1": "syntax error in floating point literal",
		"se-2": "syntax error in string literal; closing double quotes '\"' expected before end-of-line",
		"se-3": "syntax error in string literal; invalid Unicode escape sequence",
		"se-4": "syntax error in string literal; invalid escape sequence '\\$$'",
		"se-5": "syntax error; invalid character '$$'",
		"se-6": "syntax error; 'super' cannot be used outside of a class declaration",
		"se-7": "syntax error; 'super' cannot be used in a class without super class",
		"se-8": "syntax error in super reference; dot '.' expected after 'super'",
		"se-9": "syntax error in super reference; identifier expected after dot '.'",
		"se-10": "syntax error in $$; name (identifier or super name) expected",
		"se-11": "syntax error in namespace reference; identifier expected after dot '.'",
		"se-13": "error in $$; $$ '$$' requires a 'this' object and hence cannot be accessed from a static context",
		"se-14": "syntax error in argument list; positional argument follows named argument",
		"se-15": "syntax error in argument list; expected comma ',' or closing parenthesis ')'",
		"se-16": "error in function call; attempt to call a value of type '$$'; 'function' or 'type' expected",
		"se-21": "operators are not allowed on the left-hand side of an assignment",
		"se-22": "syntax error in expression; missing closing parenthesis ')'",
		"se-23": "syntax error in integer literal: maximal value of 2147483647 exceeded",
		"se-24": "syntax error in array; comma ',' or closing bracket ']' expected",
		"se-25": "syntax error in array; unexpected end-of-file",
		"se-26": "syntax error in dictionary; duplicate key '$$'",
		"se-27": "syntax error in dictionary; comma ',' or closing brace '}' expected",
		"se-28": "syntax error in dictionary key; string constant or identifier expected",
		"se-29": "syntax error in dictionary; colon ':' expected",
		"se-30": "syntax error in dictionary; unexpected end-of-file",
		"se-31": "syntax error in closure parameter declaration; comma ',' or closing bracket ']' expected",
		"se-32": "syntax error in closure parameter declaration; identifier expected as the parameter name",
		"se-33": "syntax error in parameter declaration; identifier expected as the parameter name",
		"se-35": "syntax error in anonymous function; opening bracket '[' or opening parenthesis '(' expected",
		"se-36": "syntax error in $$; opening parenthesis '(' expected",
		"se-37": "syntax error in parameter declaration; comma ',' or closing parenthesis ')' expected",
		"se-38": "error in parameter declaration; default value must be a constant",
		"se-40": "syntax error in $$; opening brace '{' expected",
		"se-41": "syntax error in expression; unexpected keyword '$$', expression expected",
		"se-42": "syntax error in expression; unexpected token '$$', expression expected",
		"se-43": "syntax error in member access: identifier expected right of the dot '.'",
		"se-44": "syntax error in item access: closing bracket ']' expected",
		"se-47": "syntax error; 'this' cannot be used in this context",
		"se-48": "syntax error in assignment; semicolon ';' expected",
		"se-49": "syntax error in expression; operator or semicolon ';' expected",
		"se-50": "syntax error in variable declaration; identifier expected as the variable name",
		"se-51": "syntax error in variable declaration; expected initializer '=', comma ',' or semicolon ';'",
		"se-51b": "syntax error in variable declaration; expected comma ',' or semicolon ';'",
		"se-52": "syntax error in function declaration; identifier expected as the function name",
		"se-53": "syntax error in constructor declaration; 'super' expected after colon ':'",
		"se-54": "syntax error in class declaration; identifier expected as the class name",
		"se-55": "syntax error in access modifier: colon ':' expected after '$$'",
		"se-56": "syntax error in class declaration; member declaration without access modifier",
		"se-57": "syntax error in class declaration; attribute initializer must be a constant",
		"se-58": "error in class declaration; the super class has a private constructor, therefore it cannot be sub-classed",
		"se-59": "error in class declaration; constructor cannot be static",
		"se-59b": "error in class declaration; the constructor was already declared",
		"se-60": "error in class declaration; class declaration cannot be static",
		"se-61": "error in class declaration; use directive cannot be static",
		"se-62": "syntax error in class declaration; member declaration, use directive, or access modifier expected",
		"se-63": "syntax error in namespace declaration; a namespace may be declared only at global scope or within another namespace",
		"se-64": "syntax error in namespace declaration; identifier expected as the namespace name",
		"se-65": "syntax error in use directive: keyword 'use' expected",
		"se-66": "syntax error in use directive; 'namespace' and 'as' cannot be combined",
		"se-67": "syntax error in use directive; identifier expected after 'as'",
		"se-68": "syntax error in use directive; comma ',' or semicolon ';' expected",
		"se-69": "syntax error in conditional statement: 'then' expected",
		"se-70": "syntax error in for-loop: identifier expected as the loop variable",
		"se-71": "syntax error in for-loop: keyword 'in' expected",
		"se-72": "syntax error in for-loop: keyword 'do' expected",
		"se-73": "syntax error in for-loop; 'in' or 'do' expected",
		"se-74": "syntax error in do-while-loop: 'while' expected",
		"se-75": "syntax error in do-while-loop: semicolon ';' expected",
		"se-76": "syntax error in while-do-loop: 'do' expected",
		"se-77": "syntax error; 'break' statement must not appear outside a loop body",
		"se-78": "syntax error; 'continue' statement must not appear outside a loop body",
		"se-79": "syntax error in return; a constructor does not return a value",
		"se-80": "syntax error in return; the program does not return a value",
		"se-81": "syntax error in return; semicolon ';' expected",
		"se-81b": "syntax error in break; semicolon ';' expected",
		"se-81c": "syntax error in continue; semicolon ';' expected",
		"se-82": "syntax error in try-catch statement: 'catch' expected",
		"se-84": "syntax error in try-catch statement: 'var' expected after 'catch'",
		"se-85": "syntax error in try-catch statement: identifier expected after 'var'",
		"se-86": "syntax error in try-catch statement: 'do' expected after exception",
		"se-87": "syntax error in throw; semicolon ';' expected",
		"se-88": "syntax error; unexpected closing brace '}'",
		"se-89": "syntax error; unexpected keyword '$$', statement expected",
		"se-90": "syntax error; unexpected token '$$', statement expected",
	},
	"argument-mismatch": {
		"am-1": "argument type mismatch; parameter '$$' of '$$' must be a $$; found '$$'",
		"am-2": "cannot logically negate type '$$'",
		"am-3": "cannot apply unary plus to type '$$'",
		"am-4": "cannot arithmetically negate type '$$'",
		"am-5": "cannot add '$$' and '$$'",
		"am-6": "cannot subtract '$$' from '$$'",
		"am-7": "cannot multiply '$$' with '$$'",
		"am-8": "cannot divide '$$' by '$$'",
		"am-9": "cannot compute the remainder '$$' by '$$'",
		"am-10": "cannot compute power of '$$' by '$$'",
		"am-11": "arguments of operator : must be integers",
		"am-12": "cannot apply logic operator '$$' to '$$' and '$$'",
		"am-13": "cannot convert infinity or not-a-number to integer",
		"am-14": "failed to parse string into an integer",
		"am-15": "division by zero",
		"am-16": "cannot order type '$$'",
		"am-16b": "cannot order types '$$' and '$$'",
		"am-17": "cannot construct an array of negative size",
		"am-18": "parameter 'position' of 'Array.insert' is out of range; position is $$, array size is $$",
		"am-18b": "'Array.pop' cannot be applied to an empty array",
		"am-19": "the 'comparator' function passed to 'Array.sort' must return a numeric value, found '$$'",
		"am-20": "invalid string index '$$' of type '$$', 'Integer' or 'Range' expected",
		"am-21": "string index '$$' out of range; index must not be negative",
		"am-22": "string index '$$' out of range; must be less than the string size of $$",
		"am-23": "array index '$$' out of range; index must not be negative",
		"am-24": "array index '$$' out of range; must be and less than array size of $$",
		"am-25": "invalid array index '$$' of type '$$', 'integer' expected",
		"am-26": "invalid array index '$$' of type '$$', 'integer' or 'range' expected",
		"am-27": "dictionary index '$$' is not a key of the dictionary",
		"am-28": "invalid dictionary index of type '$$', 'string' expected",
		"am-29": "range index '$$' out of range; must be non-negative and less than the range size of $$",
		"am-30": "invalid range index '$$' of type '$$', 'Integer' or 'Range' expected",
		"am-31": "attempt to access an item of type '$$'; string, array, dictionary, or range expected",
		"am-31b": "attempt to access an item of type '$$'; string, array, or dictionary expected",
		"am-32": "cannot assign to $$",
		"am-33": "condition in conditional statement is not boolean but rather of type '$$'",
		"am-34": "attempt to loop over the non-iterable type '$$', 'Range' or 'Array' expected",
		"am-35": "error in for-loop; '$$' does not refer to a variable, but to a $$",
		"am-36": "condition in do-while-loop is not boolean but rather of type '$$'",
		"am-37": "condition in while-do-loop is not boolean but rather of type '$$'",
		"am-38": "loading the value failed, key '$$' does not exist",
		"am-39": "saving the value failed, JSON expected",
		"am-40": "invalid event name '$$'",
		"am-41": "argument handler passed to setEventHandler must be a function with exactly one parameter",
		"am-42": "deepcopy failed due to $$",
		"am-43": "infinite recursion due to recursive data structure",
	},
	"name": {
		"ne-1": "error in function call; named parameter '$$' is already specified in call to function '$$'",
		"ne-2": "error in function call; named parameter '$$' not found in function '$$'",
		"ne-3": "error in function call; too many arguments for call to function '$$'",
		"ne-4": "error in function call; parameter number $$ is missing when calling function '$$'",
		"ne-5": "error in $$; '$$' is not defined",
		"ne-6": "error in $$; cannot access variable '$$', which is declared in a different class",
		"ne-7": "error in $$; cannot access variable '$$', which is declared in a different function",
		"ne-8": "error in $$; '$$' cannot be accessed because it is a private member of type '$$'",
		"ne-9": "error in namespace lookup; name '$$' not found in namespace '$$'",
		"ne-11": "a name referring to a namespace is not allowed in this context",
		"ne-12": "type '$$' does not have a public static member '$$'",
		"ne-13": "type '$$' does not have a public member '$$'",
		"ne-14": "declaration of variable '$$' conflicts with previous declaration; double use of the same name",
		"ne-15": "declaration of function '$$' conflicts with previous declaration; double use of the same name",
		"ne-16": "declaration of parameter '$$' conflicts with previous declaration; double use of the same name",
		"ne-17": "declaration of closure parameter '$$' conflicts with previous declaration; double use of the same name",
		"ne-18": "declaration of class '$$' conflicts with previous declaration; double use of the same name",
		"ne-19": "declaration of namespace '$$' conflicts with previous declaration; double use of the same name",
		"ne-21": "error in constructor declaration; super constructor call without a super class",
		"ne-22": "error in super class declaration; '$$' does not refer to a type",
		"ne-23": "error in use directive; '$$' is not a namespace",
		"ne-24": "use of identifier '$$' conflicts with previous declaration; double use of the same name",
		"ne-25": "error in constructor call; the constructor of type '$$' is declared $$",
		"ne-26": "variable $$ is used in its own initializer",
	},
	"logic": {
		"le-1": "too much recursion",
		"le-2": "enterEventMode failed; the program is already in event mode",
		"le-3": "quitEventMode failed; the program is not in event mode",
	},
	"user": {
		"ue-1": "assertion failed; $$",
		"ue-2": "runtime error; $$",
		"ue-3": "uncaught exception; $$",
	},
	"style": {
		"ste-1": "coding style violation; invalid line indentation",
		"ste-2": "coding style violation; inconsistent block indentation",
		"ste-3": "coding style violation; the $$ name '$$' should start with a lowercase letter or with an underscore",
		"ste-4": "coding style violation; the class name '$$' should start with a capital letter",
	},
	"internal": {
		"ie-1": "internal parser error; $$",
		"ie-2": "internal interpreter error; $$",
	}
};

// given an error ID (path), return the error message template
module.errorTemplate = function(path)
{
	let tokens = path.split("/");
	module.assert(tokens[0] == "", "[getError] invalid path: " + path);
	let ret = errors;
	for (let i=1; i<tokens.length; i++)
	{
		module.assert(ret.hasOwnProperty(tokens[i]), "[getError] invalid path: " + path);
		ret = ret[tokens[i]];
	}
	return ret;
}

// given an error ID (path) and a list of arguments, compose the error message
module.composeError = function(path, args)
{
	let err = module.errorTemplate(path);
	let tokens = err.split("$$");
	module.assert(tokens.length == args.length + 1);
	let ret = tokens[0];
	for (let i=0; i<args.length; i++) ret += args[i] + tokens[i+1];
	return ret;
}


///////////////////////////////////////////////////////////
// built-in declarations
//
// Definition of the TScript core and a number of useful
// libraries.
//

// the core language
let core = {
	"source":
		`
			class Null
			{
			public:
				constructor() { }
			}

			class Boolean
			{
			public:
				constructor(value) { }
			}

			class Integer
			{
			public:
				constructor(value) { }
			}

			class Real
			{
			public:
				constructor(value) { }
				function isFinite() { }
				function isInfinite() { }
				function isNan() { }
				static function inf() { }
				static function nan() { }
			}

			class String
			{
			public:
				constructor(value) { }
				function size() { }
				function find(searchterm, start = 0, backward = false) { }
				function split(separator) { }
				static function fromUnicode(characters) { }
			}

			class Array
			{
			public:
				constructor(size_or_other, value = null) { }
				function size() { }
				function push(item) { }
				function pop() { }
				function insert(position, item) { }
				function remove(range) { }
				function sort(comparator = null) { }
				function keys() { }
				function values() { }
				static function concat(first, second) { }
			}

			class Dictionary
			{
			public:
				constructor(other) { }
				function size() { }
				function has(key) { }
				function remove(key) { }
				function keys() { }
				function values() { }
				static function merge(first, second) { }
			}

			class Function
			{
			public:
				constructor(value) { }
			}

			class Range
			{
			public:
				constructor(begin, end) { }
				function size() { }
				function begin() { }
				function end() { }
			}

			class Type
			{
			public:
				constructor(value) { }
				static function superclass(type) { }
				static function isOfType(value, type) { }
				static function isDerivedFrom(subclass, superclass) { }
			}

			function terminate() { }
			function assert(condition, message = "") { }
			function error(message) { }
			function same(first, second) { }
			function version() { }
			function print(text) { }
			function alert(text) { }
			function confirm(text) { }
			function prompt(text) { }
			function wait(milliseconds) { }
			function time() { }
			function setEventHandler(event, handler) { }
			function enterEventMode() { }
			function quitEventMode(result = null) { }
			function exists(key) { }
			function load(key) { }
			function save(key, value) { }
			function deepcopy(value) { }
		`,
	"impl": {
			"Null": {
					"constructor": function(object) {
						object.value.b = null;
					},
			},
			"Boolean": {
					"constructor": function(object, value) {
						if (! module.isDerivedFrom(value.type, module.typeid_boolean)) this.error("/argument-mismatch/am-1", ["value", "Boolean.constructor", "boolean", module.displayname(value.type)]);
						object.value.b = value.value.b;
					},
			},
			"Integer": {
					"constructor": function(object, arg) {
						if (module.isDerivedFrom(arg.type, module.typeid_boolean)) object.value.b = arg.value.b ? 1 : 0;
						else if (module.isDerivedFrom(arg.type, module.typeid_integer)) object.value.b = arg.value.b;
						else if (module.isDerivedFrom(arg.type, module.typeid_real))
						{
							if (! Number.isFinite(arg.value.b)) this.error("/argument-mismatch/am-13");
							object.value.b = (Math.floor(arg.value.b) | 0);
						}
						else if (module.isDerivedFrom(arg.type, module.typeid_string))
						{
							let s = arg.value.b.trim();
							let v = 1;
							if (s.length == 0) this.error("/argument-mismatch/am-14");
							if (s[0] == '-') { v = -1; s = s.substr(1); }
							else if (s[0] == '+') { s = s.substr(1); }
							if (s.length == 0 || "0123456789.".indexOf(s[0]) < 0) this.error("/argument-mismatch/am-14");
							v *= Number(s);
							if (! Number.isFinite(v)) this.error("/argument-mismatch/am-13");
							object.value.b = Math.floor(v) | 0;
						}
						else this.error("/argument-mismatch/am-1", ["value", "Integer.constructor", "boolean, integer, real, or string", module.displayname(arg.type)]);
					},
			},
			"Real": {
					"constructor": function(object, arg) {
						if (module.isDerivedFrom(arg.type, module.typeid_boolean)) object.value.b = arg.value.b ? 1 : 0;
						else if (module.isDerivedFrom(arg.type, module.typeid_integer) || module.isDerivedFrom(arg.type, module.typeid_real)) object.value.b = arg.value.b;
						else if (module.isDerivedFrom(arg.type, module.typeid_string)) object.value.b = Number(arg.value.b);
						else object.value.b = NaN;
					},
					"isFinite": function(object) {
						return {"type": this.program.types[module.typeid_boolean], "value": {"b": Number.isFinite(object.value.b)}};
					},
					"isInfinite": function(object) {
						return {"type": this.program.types[module.typeid_boolean], "value": {"b": object.value.b == Number.POSITIVE_INFINITY || object.value.b == Number.NEGATIVE_INFINITY}};
					},
					"isNan": function(object) {
						return {"type": this.program.types[module.typeid_boolean], "value": {"b": Number.isNaN(object.value.b)}};
					},
					"inf": function(first, second) {
						return {"type": this.program.types[module.typeid_real], "value": {"b": Infinity}};
					},
					"nan": function(first, second) {
						return {"type": this.program.types[module.typeid_real], "value": {"b": NaN}};
					},
			},
			"String": {
					"constructor": function(object, value) {
						object.value.b = module.toString.call(this, value);
					},
					"size": function(object) {
						return {"type": this.program.types[module.typeid_integer], "value": {"b": object.value.b.length}};
					},
					"find": function(object, searchterm, start, backward) {
						if (! module.isDerivedFrom(searchterm.type, module.typeid_string)) this.error("/argument-mismatch/am-1", ["searchterm", "String.find", "string", module.displayname(searchterm.type)]);
						if (! module.isDerivedFrom(start.type, module.typeid_integer)) this.error("/argument-mismatch/am-1", ["start", "String.find", "integer", module.displayname(start.type)]);
						if (! module.isDerivedFrom(backward.type, module.typeid_boolean)) this.error("/argument-mismatch/am-1", ["backward", "String.find", "boolean", module.displayname(backward.type)]);
						let pos;
						if (backward.value.b) pos = object.value.b.lastIndexOf(searchterm.value.b, start.value.b);
						else pos = object.value.b.indexOf(searchterm.value.b, start.value.b);
						if (pos == -1) return {"type": this.program.types[module.typeid_null], "value": {"b": null}};
						else return {"type": this.program.types[module.typeid_integer], "value": {"b": pos}};
					},
					"split": function(object, separator) {
						if (! module.isDerivedFrom(separator.type, module.typeid_string)) this.error("/argument-mismatch/am-1", ["separator", "String.split", "string", module.displayname(separator.type)]);
						let a = object.value.b.split(separator.value.b);
						let arr = [];
						for (let i=0; i<a.length; i++) arr.push({"type": this.program.types[module.typeid_string], "value": {"b": a[i]}});
						return {"type": this.program.types[module.typeid_array], "value": {"b": arr}};
					},
					"fromUnicode": function(characters) {
						let s = "";
						if (module.isDerivedFrom(characters.type, module.typeid_integer))
						{
							s += String.fromCharCode(characters.value.b);
						}
						else if (module.isDerivedFrom(characters.type, module.typeid_array))
						{
							for (let i=0; i<characters.value.b.length; i++)
							{
								let sub = characters.value.b[i];
								if (! module.isDerivedFrom(sub.type, module.typeid_integer)) this.error("/argument-mismatch/am-1", ["characters", "String.fromUnicode", "integer or an array of integers", "array containing '" + module.displayname(sub.type) + "'"]);
								s += String.fromCharCode(sub.value.b);
							}
						}
						else this.error("/argument-mismatch/am-1", ["characters", "String.fromUnicode", "integer or an array of integers", module.displayname(characters.type)]);
						return {"type": this.program.types[module.typeid_string], "value": {"b": s}};
					},
			},
			"Array": {
					"constructor": function(object, size_or_other, value) {
						if (module.isDerivedFrom(size_or_other.type, module.typeid_integer))
						{
							if (size_or_other.value.b < 0) this.error("/argument-mismatch/am-17");
							let ret = [];
							for (let i=0; i<size_or_other.value.b; i++) ret.push(value);
							object.value.b = ret;
						}
						else if (module.isDerivedFrom(size_or_other.type, module.typeid_array))
						{
							object.value.b = size_or_other.value.b.slice();
						}
						else if (module.isDerivedFrom(size_or_other.type, module.typeid_range))
						{
							object.value.b = [];
							for (let i=size_or_other.value.b.begin; i<size_or_other.value.b.end; i++)
							{
								object.value.b.push({"type": this.program.types[module.typeid_integer], "value": {"b": i}});
							}
						}
						else this.error("/argument-mismatch/am-1", ["size_or_other", "Array.constructor", "integer, an array, or a range", module.displayname(size_or_other.type)]);
					},
					"size": function(object) {
						return {"type": this.program.types[module.typeid_integer], "value": {"b": object.value.b.length}};
					},
					"push": function(object, item) {
						object.value.b.push(item);
						return {"type": this.program.types[module.typeid_null], "value": {"b": null}};
					},
					"pop": function(object) {
						if (object.value.b.length == 0) this.error("/argument-mismatch/am-18b");
						return object.value.b.pop();
					},
					"insert": function(object, position, item) {
						if (! module.isDerivedFrom(position.type, module.typeid_integer)) this.error("/argument-mismatch/am-1", ["position", "Array.insert", "integer", module.displayname(position.type)]);
						let index = position.value.b;
						if (index < 0 || index > object.value.b.length) this.error("/argument-mismatch/am-18", [index, object.value.b.length]);
						object.value.b.splice(position.value.b, 0, item);
						return {"type": this.program.types[module.typeid_null], "value": {"b": null}};
					},
					"remove": function(object, range) {
						let a, b;
						if (module.isDerivedFrom(range.type, module.typeid_range))
						{
							a = range.value.b.begin;
							b = range.value.b.end;
						}
						else if (module.isDerivedFrom(range.type, module.typeid_integer))
						{
							a = range.value.b;
							b = range.value.b + 1;
						}
						else this.error("/argument-mismatch/am-1", ["range", "Array.remove", "range or an integer", module.displayname(range.type)]);
						if (a < 0) a = 0;
						if (b > object.value.b.length) b = object.value.b.length;
						object.value.b.splice(a, b - a);
						return {"type": this.program.types[module.typeid_null], "value": {"b": null}};
					},
					"sort": {
						"step": function() {
							// iterative merge sort
							let frame = this.stack[this.stack.length - 1];
							let pe = frame.pe[frame.pe.length - 1];
							let ip = frame.ip[frame.ip.length - 1];
							if (ip == 0)
							{
								if (frame.object.value.b.length <= 1)
								{
									// trivial case
									this.stack.pop();
									this.stack[this.stack.length - 1].temporaries.push({"type": this.program.types[module.typeid_null], "value": {"b": null}});
									return false;
								}
								if (module.isDerivedFrom(frame.variables[0].type, module.typeid_null))
								{
									// one-step solution
									let interpreter = this;
									frame.object.value.b.sort(function(lhs, rhs)
											{
												return module.order.call(interpreter, lhs, rhs);
											});

									// return null
									this.stack.pop();
									this.stack[this.stack.length - 1].temporaries.push({"type": this.program.types[module.typeid_null], "value": {"b": null}});
									return false;
								}
								else if (module.isDerivedFrom(frame.variables[0].type, module.typeid_function) && frame.variables[0].value.b.func.params.length == 2)
								{
									// prepare the merge sort state data structure
									let state = {
											"src": frame.object.value.b,   // source array
											"dst": [],                     // destination array
											"chunksize": 1,                // size of chunks to merge
											"lb": 0, "le": 1,              // "left" chunk [lb, le[
											"rb": 1, "re": 2,              // "right" chunk [rb, re[
										};
									frame.temporaries.push(state);
									return false;
								}
								else this.error("/argument-mismatch/am-1", ["comparator", "Array.sort", "function of two arguments", module.displayname(frame.variables[0].type)]);
							}
							else if (ip == 1)
							{
								// push the next comparison onto the stack
								let state = frame.temporaries[frame.temporaries.length - 1];
								let comp = frame.variables[0].value.b;
								let params = [state.src[state.lb], state.src[state.rb]];
								if (comp.hasOwnProperty("enclosed")) params = comp.enclosed.concat(params);
								let newframe = {
										"pe": [comp.func],
										"ip": [-1],
										"temporaries": [],
										"variables": params,
									};
								if (comp.hasOwnProperty("object")) newframe.object = comp.object;
								if (comp.hasOwnProperty("enclosed")) newframe.enclosed = comp.enclosed;
								this.stack.push(newframe);
								if (this.stack.length >= module.maxstacksize) this.error("/logic/le-1");
								return false;
							}
							else if (ip == 2)
							{
								// evaluate the comparison
								let result = frame.temporaries.pop();
								if (! module.isNumeric(result.type)) this.error("/argument-mismatch/am-19", [module.displayname(result.type)]);

								let state = frame.temporaries[frame.temporaries.length - 1];

								// perform a merge step
								if (result.value.b <= 0)
								{
									state.dst.push(state.src[state.lb]);
									state.lb++;
									if (state.lb == state.le)
									{
										while (state.rb < state.re)
										{
											state.dst.push(state.src[state.rb]);
											state.rb++;
										}
									}
								}
								else
								{
									state.dst.push(state.src[state.rb]);
									state.rb++;
									if (state.rb == state.re)
									{
										while (state.lb < state.le)
										{
											state.dst.push(state.src[state.lb]);
											state.lb++;
										}
									}
								}

								if (state.lb == state.le)
								{
									// merging the current chunks is complete
									if (state.src.length - state.re <= state.chunksize)
									{
										// copy the last chunk
										while (state.re < state.src.length)
										{
											state.dst.push(state.src[state.re]);
											state.re++;
										}

										// move on to larger chunks
										state.chunksize *= 2;
										state.lb = 0;
										state.le = state.chunksize;
										state.rb = state.chunksize;
										state.re = Math.min(2 * state.chunksize, state.src.length);
										state.src = state.dst;
										state.dst = [];

										// check whether we are done
										if (state.chunksize >= state.src.length) return false;
									}
									else
									{
										// prepare the next chunk
										state.lb = state.dst.length;
										state.le = state.lb + state.chunksize;
										state.rb = state.le;
										state.re = Math.min(state.rb + state.chunksize, state.src.length);
									}
								}

								// move back to step 1
								frame.ip[frame.ip.length - 1] = 1 - 1;
								return false;
							}
							else
							{
								// clean up
								let state = frame.temporaries[frame.temporaries.length - 1];
								frame.object.value.b = state.src;
								frame.temporaries.pop();

								// return null
								module.assert(frame.temporaries.length == 0, "non-empty temporaries stack in return from Array.sort");
								this.stack.pop();
								this.stack[this.stack.length - 1].temporaries.push({"type": this.program.types[module.typeid_null], "value": {"b": null}});
								return false;
							}
						},
						"sim": simfalse,
					},
					"keys": function(object) {
						return {"type": this.program.types[module.typeid_range], "value": {"b": {"begin": 0, "end": object.value.b.length}}};
					},
					"values": function(object) {
						return object;
					},
					"concat": function(first, second) {
						if (! module.isDerivedFrom(first.type, module.typeid_array)) this.error("/argument-mismatch/am-1", ["first", "Array.concat", "array", module.displayname(first.type)]);
						if (! module.isDerivedFrom(second.type, module.typeid_array)) this.error("/argument-mismatch/am-1", ["second", "Array.concat", "array", module.displayname(second.type)]);
						let arr = [];
						for (let i=0; i<first.value.b.length; i++) arr.push(first.value.b[i]);
						for (let i=0; i<second.value.b.length; i++) arr.push(second.value.b[i]);
						return {"type": this.program.types[module.typeid_array], "value": {"b": arr}};
					},
			},
			"Dictionary": {
					"constructor": function(object, other) {
						if (module.isDerivedFrom(other.type, module.typeid_null))
						{
							object.value.b = {};
						}
						else if (module.isDerivedFrom(other.type, module.typeid_dictionary))
						{
							object.value.b = Object.assign({}, other.value.b);
						}
						else this.error("/argument-mismatch/am-1", ["other", "Dictionary.constructor", "null or a dictionary", module.displayname(other.type)]);
					},
					"size": function(object) {
						return {"type": this.program.types[module.typeid_integer], "value": {"b": Object.keys(object.value.b).length}};
					},
					"has": function(object, key) {
						if (! module.isDerivedFrom(key.type, module.typeid_string)) this.error("/argument-mismatch/am-1", ["key", "Dictionary.has", "string", module.displayname(key.type)]);
						let ret = object.value.b.hasOwnProperty('#' + key.value.b);
						return {"type": this.program.types[module.typeid_boolean], "value": {"b": ret}};
					},
					"remove": function(object, key) {
						if (! module.isDerivedFrom(key.type, module.typeid_string)) this.error("/argument-mismatch/am-1", ["key", "Dictionary.remove", "string", module.displayname(key.type)]);
						delete object.value.b['#' + key.value.b];
						return {"type": this.program.types[module.typeid_null], "value": {"b": null}};
					},
					"keys": function(object) {
						let arr = [];
						for (let key in object.value.b)
						{
							if (! object.value.b.hasOwnProperty(key)) continue;
							arr.push({"type": this.program.types[module.typeid_string], "value": {"b": key.substring(1)}});
						}
						return {"type": this.program.types[module.typeid_array], "value": {"b": arr}};
					},
					"values": function(object) {
						let arr = [];
						for (let key in object.value.b)
						{
							if (! object.value.b.hasOwnProperty(key)) continue;
							arr.push(object.value.b[key]);
						}
						return {"type": this.program.types[module.typeid_array], "value": {"b": arr}};
					},
					"merge": function(first, second) {
						if (! module.isDerivedFrom(first.type, module.typeid_dictionary)) this.error("/argument-mismatch/am-1", ["first", "Dictionary.merge", "dictionary", module.displayname(first.type)]);
						if (! module.isDerivedFrom(second.type, module.typeid_dictionary)) this.error("/argument-mismatch/am-1", ["second", "Dictionary.merge", "dictionary", module.displayname(second.type)]);
						let dict = {};
						for (let key in first.value.b)
						{
							if (! first.value.b.hasOwnProperty(key)) continue;
							dict[key] = first.value.b[key];
						}
						for (let key in second.value.b)
						{
							if (! second.value.b.hasOwnProperty(key)) continue;
							dict[key] = second.value.b[key];
						}
						return {"type": this.program.types[module.typeid_dictionary], "value": {"b": dict}};
					},
			},
			"Function": {
				"constructor": function(object, value) {
					if (! module.isDerivedFrom(value.type, module.typeid_function)) this.error("/argument-mismatch/am-1", ["value", "Function.constructor", "function", module.displayname(value.type)]);
					object.value.b = value.value.b;
				},
			},
			"Range": {
				"constructor": function(object, begin, end) {
					if (module.isDerivedFrom(begin.type, module.typeid_integer)) { }
					else if (module.isDerivedFrom(begin.type, module.typeid_real) && module.isInt32(begin.value.b)) { }
					else this.error("/argument-mismatch/am-1", ["begin", "Range.constructor", "integer", module.displayname(begin.type)]);
					if (module.isDerivedFrom(end.type, module.typeid_integer)) { }
					else if (module.isDerivedFrom(end.type, module.typeid_real) && module.isInt32(end.value.b)) { }
					else this.error("/argument-mismatch/am-1", ["end", "Range.constructor", "integer", module.displayname(end.type)]);
					object.value.b = {"begin": begin.value.b, "end": end.value.b};
				},
				"size": function(object) {
					return {"type": this.program.types[module.typeid_integer], "value": {"b": Math.max(0, object.value.b.end - object.value.b.begin)}};
				},
				"begin": function(object) {
					return {"type": this.program.types[module.typeid_integer], "value": {"b": object.value.b.begin}};
				},
				"end": function(object) {
					return {"type": this.program.types[module.typeid_integer], "value": {"b": object.value.b.end}};
				},
			},
			"Type": {
				"constructor": function(object, value) {
					object.value.b = value.type;
				},
				"superclass": function(type) {
					if (! module.isDerivedFrom(type.type, module.typeid_type)) this.error("/argument-mismatch/am-1", ["type", "Type.superclass", "type", module.displayname(type.type)]);
					if (type.value.b.hasOwnProperty("superclass")) return {"type": this.program.types[module.typeid_type], "value": {"b": type.value.b.superclass}};
					else return {"type": this.program.types[module.typeid_null], "value": {"b": null}};
				},
				"isOfType": function(value, type) {
					if (! module.isDerivedFrom(type.type, module.typeid_type)) this.error("/argument-mismatch/am-1", ["type", "Type.isOfType", "type", module.displayname(type.type)]);
					let ret = false;
					let sub = value.type;
					let sup = type.value.b;
					while (true)
					{
						if (sub == sup) { ret = true; break; }
						if (sub.hasOwnProperty("superclass")) sub = sub.superclass;
						else break;
					}
					return {"type": this.program.types[module.typeid_boolean], "value": {"b": ret}};
				},
				"isDerivedFrom": function(subclass, superclass) {
					if (! module.isDerivedFrom(subclass.type, module.typeid_type)) this.error("/argument-mismatch/am-1", ["subclass", "Type.isDerivedFrom", "type", module.displayname(subclass.type)]);
					if (! module.isDerivedFrom(superclass.type, module.typeid_type)) this.error("/argument-mismatch/am-1", ["superclass", "Type.isDerivedFrom", "type", module.displayname(superclass.type)]);
					let ret = false;
					let sub = subclass.value.b;
					let sup = superclass.value.b;
					while (true)
					{
						if (sub == sup) { ret = true; break; }
						if (sub.hasOwnProperty("superclass")) sub = sub.superclass;
						else break;
					}
					return {"type": this.program.types[module.typeid_boolean], "value": {"b": ret}};
				},
			},

			"terminate": function() {
				this.status = "finished";
				if (this.service.statechanged) this.service.statechanged(true);
			},
			"assert": function(condition, message) {
				if (! module.isDerivedFrom(condition.type, module.typeid_boolean)) this.error("/argument-mismatch/am-1", ["condition", "assert", "boolean", module.displayname(condition.type)]);
				if (! module.isDerivedFrom(message.type, module.typeid_string)) this.error("/argument-mismatch/am-1", ["message", "assert", "string", module.displayname(message.type)]);
				if (! condition.value.b) this.error("/user/ue-1", [message.value.b]);
			},
			"error": function(message) {
				if (! module.isDerivedFrom(message.type, module.typeid_string)) this.error("/argument-mismatch/am-1", ["message", "error", "string", module.displayname(message.type)]);
				this.error("/user/ue-2", [message.value.b]);
			},
			"same": function(first, second) {
				return {"type": this.program.types[module.typeid_boolean], "value": {"b": (first === second)}};
			},
			"version": function() {
				let ret = {
							"#type":  {"type": this.program.types[module.typeid_string],  "value": {"b": module.version.type}},
							"#major": {"type": this.program.types[module.typeid_integer], "value": {"b": module.version.major}},
							"#minor": {"type": this.program.types[module.typeid_integer], "value": {"b": module.version.minor}},
							"#patch": {"type": this.program.types[module.typeid_integer], "value": {"b": module.version.patch}},
							"#day":   {"type": this.program.types[module.typeid_integer], "value": {"b": module.version.day}},
							"#month": {"type": this.program.types[module.typeid_integer], "value": {"b": module.version.month}},
							"#year":  {"type": this.program.types[module.typeid_integer], "value": {"b": module.version.year}},
							"#full":  {"type": this.program.types[module.typeid_string],  "value": {"b": module.version.full()}},
						};
				return {"type": this.program.types[module.typeid_dictionary], "value": {"b": ret}};
			},
			"print": function(text) {
				let s = module.toString.call(this, text);
				if (this.service.print) this.service.print(s);
				return {"type": this.program.types[module.typeid_null], "value": {"b": null}};
			},
			"alert": function(text) {
				let s = module.toString.call(this, text);
				if (! this.service.documentation_mode && this.service.alert) this.service.alert(s);
				return {"type": this.program.types[module.typeid_null], "value": {"b": null}};
			},
			"confirm": function(text) {
				let s = module.toString.call(this, text);
				let ret = false;
				if (! this.service.documentation_mode && this.service.confirm) ret = this.service.confirm(s);
				return {"type": this.program.types[module.typeid_boolean], "value": {"b": ret}};
			},
			"prompt": function(text) {
				let s = module.toString.call(this, text);
				let ret = null;
				if (! this.service.documentation_mode && this.service.prompt)
				{
					ret = this.service.prompt(s);
					if (ret === null) return {"type": this.program.types[module.typeid_null], "value": {"b": null}};
					else return {"type": this.program.types[module.typeid_string], "value": {"b": ret}};
				}
				else return {"type": this.program.types[module.typeid_string], "value": {"b": ""}};
			},
			"wait": function(milliseconds) {
				if (! module.isNumeric(milliseconds.type)) this.error("/argument-mismatch/am-1", ["milliseconds", "wait", "numeric argument", module.displayname(arg.type)]);
				if (! this.service.documentation_mode) this.wait(milliseconds.value.b);
				return {"type": this.program.types[module.typeid_null], "value": {"b": null}};
			},
			"time": function() {
				return {"type": this.program.types[module.typeid_real], "value": {"b": (new Date()).getTime()}};
			},
			"exists": function(key) {
				if (! module.isDerivedFrom(key.type, module.typeid_string)) this.error("/argument-mismatch/am-1", ["key", "exists", "string", module.displayname(key.type)]);
				let ret = localStorage.getItem("tscript.data." + key.value.b) !== null;
				return {"type": this.program.types[module.typeid_boolean], "value": {"b": ret}};
			},
			"load": function(key) {
				if (! module.isDerivedFrom(key.type, module.typeid_string)) this.error("/argument-mismatch/am-1", ["key", "load", "string", module.displayname(key.type)]);
				let s = localStorage.getItem("tscript.data." + key.value.b);
				if (s === null) this.error("/argument-mismatch/am-38", [key.value.b]);
				let j = JSON.parse(s);
				return module.json2typed.call(this, j);
			},
			"save": function(key, value) {
				if (! module.isDerivedFrom(key.type, module.typeid_string)) this.error("/argument-mismatch/am-1", ["key", "save", "string", module.displayname(key.type)]);
				try
				{
					let j = module.typed2json.call(this, value);
					let s = JSON.stringify(j);
					localStorage.setItem("tscript.data." + key.value.b, s);
					return {"type": this.program.types[module.typeid_null], "value": {"b": null}};
				}
				catch (ex)
				{
					this.error("/argument-mismatch/am-39");
				}
			},
			"deepcopy": function(value) {
				try
				{
					function copy(v, k)
					{
						if (v.type.id < module.typeid_array) return v;
						else if (v.type.id == module.typeid_array)
						{
							if (k.has(v)) throw "recursive data structure";
							let known = new Set(k)
							known.add(v);
							let b = [];
							for (let i=0; i<v.value.b.length; i++)
							{
								let c = copy.call(this, v.value.b[i], known);
								b.push(c);
							}
							return {"type": this.program.types[module.typeid_array], "value": {"b": b}};
						}
						else if (v.type.id == module.typeid_dictionary)
						{
							if (k.has(v)) throw "recursive data structure";
							let known = new Set(k)
							known.add(v);
							let b = {};
							for (let key in v.value.b)
							{
								if (! v.value.b.hasOwnProperty(key)) continue;
								let c = copy.call(this, v.value.b[key], known);
								b[key] = c;
							}
							return {"type": this.program.types[module.typeid_dictionary], "value": {"b": b}};
						}
						else if (v.type.id == module.typeid_function) throw "a function in the data structure";
						else if (v.type.id == module.typeid_range) return v;
						else if (v.type.id == module.typeid_type) return v;
						else throw "an object in the data structure";
					}

					return copy.call(this, value, new Set());
				}
				catch (ex)
				{
					this.error("/argument-mismatch/am-42", [ex]);
				}
			},
			"setEventHandler": function(event, handler) {
				if (! module.isDerivedFrom(event.type, module.typeid_string)) this.error("/argument-mismatch/am-1", ["event", "setEventHandler", "string", module.displayname(event.type)]);
				let name = event.value.b;
				if (! this.service.documentation_mode && ! this.eventnames.hasOwnProperty(name)) this.error("/argument-mismatch/am-40", [name]);
				if (handler.type.id != module.typeid_null && ! module.isDerivedFrom(handler.type, module.typeid_function)) this.error("/argument-mismatch/am-1", ["handler", "setEventHandler", "Null or Function", module.displayname(handler.type)]);
				if (handler.value.b && handler.value.b.func.params.length != 1) this.error("/argument-mismatch/am-41");
				this.setEventHandler(name, handler);
				return {"type": this.program.types[module.typeid_null], "value": {"b": null}};
			},
			"enterEventMode": {
					"step": function()
					{
						if (this.service.documentation_mode)
						{
							this.status = "finished";
							return false;
						}

						if (this.eventmode) this.error("/logic/le-2");
						this.eventmode = true;
						this.stack[this.stack.length - 1].pe.push({
							// this cumbersome inner command is necessary since function.step is expected to always return false
							"step": function()
							{
								let frame = this.stack[this.stack.length - 1];
								if (! this.eventmode)
								{
									// return from event mode
									this.stack.pop();
									this.stack[this.stack.length - 1].temporaries.push(this.eventmodeReturnValue);
									return true;
								}

								// infinite loop
								frame.ip[frame.ip.length - 1]--;   // infinite loop
								frame.temporaries = [];            // discard return values (hack...)

								if (this.eventqueue.length == 0)
								{
									if (! this.service.documentation_mode) this.wait(10);
								}
								else
								{
									// handle the next event
									let t = this.eventqueue[0].type;
									let e = this.eventqueue[0].event;
									this.eventqueue.splice(0, 1);
									// this allows another timer event to be enqueued,
									// while the timer event is executed
									if (t == "timer") this.timerEventEnqueued = false;
									if (this.eventhandler.hasOwnProperty(t))
									{
										let handler = this.eventhandler[t];

										// argument list for the call
										let params = new Array(1);
										params[0] = e;

										// handle closure parameters
										if (handler.hasOwnProperty("enclosed")) params = handler.enclosed.concat(params);

										// create a new stack frame with the function arguments as local variables
										let frame = {
												"pe": [handler.func],
												"ip": [-1],
												"temporaries": [],
												"variables": params,
											};
										if (handler.hasOwnProperty("object")) frame.object = handler.object;
										if (handler.hasOwnProperty("enclosed")) frame.enclosed = handler.enclosed;
										this.stack.push(frame);
										if (this.stack.length >= module.maxstacksize) this.error("/logic/le-1");
									}
								}

								return true;
							},
							"sim": simtrue,
						});
						return false;
					},
					"sim": simfalse,
			},
			"quitEventMode": function(result) {
				if (! this.eventmode) this.error("/logic/le-3");
				this.eventmode = false;
				this.eventmodeReturnValue = result;
				return {"type": this.program.types[module.typeid_null], "value": {"b": null}};
			},
		},
	};

let lib_math = {
	"source":
		`
			namespace math
			{
				function pi() { }
				function e() { }
				function abs(x) { }
				function sqrt(x) { }
				function cbrt(x) { }
				function floor(x) { }
				function round(x) { }
				function ceil(x) { }
				function sin(x) { }
				function cos(x) { }
				function tan(x) { }
				function sinh(x) { }
				function cosh(x) { }
				function tanh(x) { }
				function asin(x) { }
				function acos(x) { }
				function atan(x) { }
				function atan2(y, x) { }
				function asinh(x) { }
				function acosh(x) { }
				function atanh(x) { }
				function exp(x) { }
				function log(x) { }
				function log2(x) { }
				function log10(x) { }
				function pow(base, exponent) { }
				function sign(x) { }
				function min(a, b) { }
				function max(a, b) { }
				function random() { }
			}
		`,
		"impl": {
			"math": {
					"pi": function(arg) {
						return {"type": this.program.types[module.typeid_real], "value": {"b": 3.141592653589793}};
					},
					"e": function(arg) {
						return {"type": this.program.types[module.typeid_real], "value": {"b": 2.718281828459045}};
					},
					"abs": function(arg) {
						if (module.isDerivedFrom(arg.type, module.typeid_integer)) return {"type": this.program.types[module.typeid_integer], "value": {"b": Math.abs(arg.value.b) | 0 }};
						else if (module.isDerivedFrom(arg.type, module.typeid_real)) return {"type": this.program.types[module.typeid_real], "value": {"b": Math.abs(arg.value.b) }};
						else this.error("/argument-mismatch/am-1", ["x", "math.abs", "numeric argument", module.displayname(arg.type)]);
					},
					"sqrt": function(arg) {
						if (module.isNumeric(arg.type)) return {"type": this.program.types[module.typeid_real], "value": {"b": Math.sqrt(arg.value.b) }};
						else this.error("/argument-mismatch/am-1", ["x", "math.sqrt", "numeric argument", module.displayname(arg.type)]);
					},
					"cbrt": function(arg) {
						if (module.isNumeric(arg.type)) return {"type": this.program.types[module.typeid_real], "value": {"b": Math.cbrt(arg.value.b) }};
						else this.error("/argument-mismatch/am-1", ["x", "math.cbrt", "numeric argument", module.displayname(arg.type)]);
					},
					"floor": function(arg) {
						if (module.isNumeric(arg.type)) return {"type": this.program.types[module.typeid_real], "value": {"b": Math.floor(arg.value.b) }};
						else this.error("/argument-mismatch/am-1", ["x", "math.floor", "numeric argument", module.displayname(arg.type)]);
					},
					"round": function(arg) {
						if (module.isNumeric(arg.type)) return {"type": this.program.types[module.typeid_real], "value": {"b": Math.round(arg.value.b) }};
						else this.error("/argument-mismatch/am-1", ["x", "math.round", "numeric argument", module.displayname(arg.type)]);
					},
					"ceil": function(arg) {
						if (module.isNumeric(arg.type)) return {"type": this.program.types[module.typeid_real], "value": {"b": Math.ceil(arg.value.b) }};
						else this.error("/argument-mismatch/am-1", ["x", "math.ceil", "numeric argument", module.displayname(arg.type)]);
					},
					"sin": function(arg) {
						if (module.isNumeric(arg.type)) return {"type": this.program.types[module.typeid_real], "value": {"b": Math.sin(arg.value.b) }};
						else this.error("/argument-mismatch/am-1", ["x", "math.sin", "numeric argument", module.displayname(arg.type)]);
					},
					"cos": function(arg) {
						if (module.isNumeric(arg.type)) return {"type": this.program.types[module.typeid_real], "value": {"b": Math.cos(arg.value.b) }};
						else this.error("/argument-mismatch/am-1", ["x", "math.cos", "numeric argument", module.displayname(arg.type)]);
					},
					"tan": function(arg) {
						if (module.isNumeric(arg.type)) return {"type": this.program.types[module.typeid_real], "value": {"b": Math.tan(arg.value.b) }};
						else this.error("/argument-mismatch/am-1", ["x", "math.tan", "numeric argument", module.displayname(arg.type)]);
					},
					"sinh": function(arg) {
						if (module.isNumeric(arg.type)) return {"type": this.program.types[module.typeid_real], "value": {"b": Math.sinh(arg.value.b) }};
						else this.error("/argument-mismatch/am-1", ["x", "math.sinh", "numeric argument", module.displayname(arg.type)]);
					},
					"cosh": function(arg) {
						if (module.isNumeric(arg.type)) return {"type": this.program.types[module.typeid_real], "value": {"b": Math.cosh(arg.value.b) }};
						else this.error("/argument-mismatch/am-1", ["x", "math.cosh", "numeric argument", module.displayname(arg.type)]);
					},
					"tanh": function(arg) {
						if (module.isNumeric(arg.type)) return {"type": this.program.types[module.typeid_real], "value": {"b": Math.tanh(arg.value.b) }};
						else this.error("/argument-mismatch/am-1", ["x", "math.tanh", "numeric argument", module.displayname(arg.type)]);
					},
					"asin": function(arg) {
						if (module.isNumeric(arg.type)) return {"type": this.program.types[module.typeid_real], "value": {"b": Math.asin(arg.value.b) }};
						else this.error("/argument-mismatch/am-1", ["x", "math.asin", "numeric argument", module.displayname(arg.type)]);
					},
					"acos": function(arg) {
						if (module.isNumeric(arg.type)) return {"type": this.program.types[module.typeid_real], "value": {"b": Math.acos(arg.value.b) }};
						else this.error("/argument-mismatch/am-1", ["x", "math.acos", "numeric argument", module.displayname(arg.type)]);
					},
					"atan": function(arg) {
						if (module.isNumeric(arg.type)) return {"type": this.program.types[module.typeid_real], "value": {"b": Math.atan(arg.value.b) }};
						else this.error("/argument-mismatch/am-1", ["x", "math.atan", "numeric argument", module.displayname(arg.type)]);
					},
					"atan2": function(y, x) {
						if (! module.isNumeric(y.type)) this.error("/argument-mismatch/am-1", ["x", "math.atan2", "numeric argument", module.displayname(x.type)]);
						if (! module.isNumeric(x.type)) this.error("/argument-mismatch/am-1", ["x", "math.atan2", "numeric argument", module.displayname(y.type)]);
						return {"type": this.program.types[module.typeid_real], "value": {"b": Math.atan2(y.value.b, x.value.b) }};
					},
					"asinh": function(arg) {
						if (module.isNumeric(arg.type)) return {"type": this.program.types[module.typeid_real], "value": {"b": Math.asinh(arg.value.b) }};
						else this.error("/argument-mismatch/am-1", ["x", "math.asinh", "numeric argument", module.displayname(arg.type)]);
					},
					"acosh": function(arg) {
						if (module.isNumeric(arg.type)) return {"type": this.program.types[module.typeid_real], "value": {"b": Math.acosh(arg.value.b) }};
						else this.error("/argument-mismatch/am-1", ["x", "math.acosh", "numeric argument", module.displayname(arg.type)]);
					},
					"atanh": function(arg) {
						if (module.isNumeric(arg.type)) return {"type": this.program.types[module.typeid_real], "value": {"b": Math.atanh(arg.value.b) }};
						else this.error("/argument-mismatch/am-1", ["x", "math.atanh", "numeric argument", module.displayname(arg.type)]);
					},
					"exp": function(arg) {
						if (module.isNumeric(arg.type)) return {"type": this.program.types[module.typeid_real], "value": {"b": Math.exp(arg.value.b) }};
						else this.error("/argument-mismatch/am-1", ["x", "math.exp", "numeric argument", module.displayname(arg.type)]);
					},
					"log": function(arg) {
						if (module.isNumeric(arg.type)) return {"type": this.program.types[module.typeid_real], "value": {"b": Math.log(arg.value.b) }};
						else this.error("/argument-mismatch/am-1", ["x", "math.log", "numeric argument", module.displayname(arg.type)]);
					},
					"log2": function(arg) {
						if (module.isNumeric(arg.type)) return {"type": this.program.types[module.typeid_real], "value": {"b": Math.log2(arg.value.b) }};
						else this.error("/argument-mismatch/am-1", ["x", "math.log2", "numeric argument", module.displayname(arg.type)]);
					},
					"log10": function(arg) {
						if (module.isNumeric(arg.type)) return {"type": this.program.types[module.typeid_real], "value": {"b": Math.log10(arg.value.b) }};
						else this.error("/argument-mismatch/am-1", ["x", "math.log10", "numeric argument", module.displayname(arg.type)]);
					},
					"pow": function(base, exponent) {
						if (! module.isNumeric(base.type)) this.error("/argument-mismatch/am-1", ["base", "math.pow", "numeric argument", module.displayname(base.type)]);
						if (! module.isNumeric(exponent.type))this.error("/argument-mismatch/am-1", ["exponent", "math.pow", "numeric argument", module.displayname(exponent.type)]);
						return {"type": this.program.types[module.typeid_real], "value": {"b": Math.pow(base.value.b, exponent.value.b) }};
					},
					"sign": function(arg) {
						if (module.isNumeric(arg.type)) return {"type": this.program.types[module.isDerivedFrom(arg.type, module.typeid_integer) ? module.typeid_integer : module.typeid_real], "value": {"b": Math.sign(arg.value.b) }};
						else this.error("/argument-mismatch/am-1", ["x", "math.sign", "numeric argument", module.displayname(arg.type)]);
					},
					"min": function(a, b) {
						if (module.order.call(this, a, b) <= 0) return a; else return b;
					},
					"max": function(a, b) {
						if (module.order.call(this, a, b) >= 0) return a; else return b;
					},
					"random": function() {
						return {"type": this.program.types[module.typeid_real], "value": {"b": Math.random() }};
					},
			},
		},
	};

let lib_turtle = {
	"source":
		`
			namespace turtle {
				function reset(x = 0, y = 0, degrees = 0, down = true) { }
				function move(distance) { }
				function turn(degrees) { }
				function color(red, green, blue) { }
				function pen(down) { }
			}
		`,
	"impl": {
			"turtle": {
					"reset": function(x, y, degrees, down) {
						if (! module.isNumeric(x.type)) this.error("/argument-mismatch/am-1", ["x", "turtle.reset", "numeric argument", module.displayname(x.type)]);
						if (! module.isNumeric(y.type)) this.error("/argument-mismatch/am-1", ["y", "turtle.reset", "numeric argument", module.displayname(y.type)]);
						if (! module.isNumeric(degrees.type)) this.error("/argument-mismatch/am-1", ["degrees", "turtle.reset", "numeric argument", module.displayname(degrees.type)]);
						if (! module.isDerivedFrom(down.type, module.typeid_boolean)) this.error("/argument-mismatch/am-1", ["down", "turtle.reset", "boolean", module.displayname(down.type)]);
						if (this.service.turtle) this.service.turtle.reset.call(this, x.value.b, y.value.b, degrees.value.b, down.value.b);
						return {"type": this.program.types[module.typeid_null], "value": {"b": null}};
					},
					"move": function(distance) {
						if (! module.isNumeric(distance.type)) this.error("/argument-mismatch/am-1", ["distance", "turtle.move", "numeric argument", module.displayname(distance.type)]);
						if (this.service.turtle) this.service.turtle.move.call(this, distance.value.b);
						return {"type": this.program.types[module.typeid_null], "value": {"b": null}};
					},
					"turn": function(degrees) {
						if (! module.isNumeric(degrees.type)) this.error("/argument-mismatch/am-1", ["degrees", "turtle.turn", "numeric argument", module.displayname(degrees.type)]);
						if (this.service.turtle) this.service.turtle.turn.call(this, degrees.value.b);
						return {"type": this.program.types[module.typeid_null], "value": {"b": null}};
					},
					"color": function(red, green, blue) {
						if (! module.isNumeric(  red.type)) this.error("/argument-mismatch/am-1", [  "red", "turtle.color", "numeric argument", module.displayname(  red.type)]);
						if (! module.isNumeric(green.type)) this.error("/argument-mismatch/am-1", ["green", "turtle.color", "numeric argument", module.displayname(green.type)]);
						if (! module.isNumeric( blue.type)) this.error("/argument-mismatch/am-1", [ "blue", "turtle.color", "numeric argument", module.displayname( blue.type)]);
						if (this.service.turtle) this.service.turtle.color.call(this, red.value.b, green.value.b, blue.value.b);
						return {"type": this.program.types[module.typeid_null], "value": {"b": null}};
					},
					"pen": function(down) {
						if (! module.isDerivedFrom(down.type, module.typeid_boolean)) this.error("/argument-mismatch/am-1", ["down", "turtle.pen", "boolean", module.displayname(down.type)]);
						if (this.service.turtle) this.service.turtle.pen.call(this, down.value.b);
						return {"type": this.program.types[module.typeid_null], "value": {"b": null}};
					},
			},
		},
	};
let lib_canvas = {
	"source":
		`
			namespace canvas {
				function width() { }
				function height() { }
				function setLineWidth(width) { }
				function setLineColor(red, green, blue, alpha = 1.0) { }
				function setFillColor(red, green, blue, alpha = 1.0) { }
				function setFont(fontface, fontsize) { }
				function setTextAlign(alignment) { }
				function clear() { }
				function line(x1, y1, x2, y2) { }
				function rect(left, top, width, height) { }
				function fillRect(left, top, width, height) { }
				function frameRect(left, top, width, height) { }
				function circle(x, y, radius) { }
				function fillCircle(x, y, radius) { }
				function frameCircle(x, y, radius) { }
				function curve(points, close = false) { }
				function fillArea(points) { }
				function frameArea(points) { }
				function text(x, y, str) { }
				function reset() { }
				function shift(dx, dy) { }
				function scale(factor) { }
				function rotate(angle) { }
				function transform(A, b) { }
				class ResizeEvent
				{
				public:
					var width;
					var height;
				}
				class MouseMoveEvent
				{
				public:
					var x;
					var y;
					var buttons;
					var shift;
					var control;
					var alt;
					var meta;
				}
				class MouseButtonEvent
				{
				public:
					var x;
					var y;
					var button;
					var buttons;
					var shift;
					var control;
					var alt;
					var meta;
				}
				class KeyboardEvent
				{
				public:
					var key;
					var shift;
					var control;
					var alt;
					var meta;
				}
			}
		`,
	"impl": {
			"canvas": {
					"width": function() {
						let ret = this.service.canvas.width.call(this);
						return {"type": this.program.types[module.typeid_integer], "value": {"b": ret}};
					},
					"height": function() {
						let ret = this.service.canvas.height.call(this);
						return {"type": this.program.types[module.typeid_integer], "value": {"b": ret}};
					},
					"setLineWidth": function(width) {
						if (! module.isNumeric(width.type)) this.error("/argument-mismatch/am-1", ["width", "canvas.setLineWidth", "numeric argument", module.displayname(width.type)]);
						if (width.value.b <= 0) this.error("/user/ue-2", ["error in canvas.setLineWidth; width must be positive"]);
						this.service.canvas.setLineWidth.call(this, width.value.b);
						return {"type": this.program.types[module.typeid_null], "value": {"b": null}};
					},
					"setLineColor": function(red, green, blue, alpha) {
						if (! module.isNumeric(red.type))   this.error("/argument-mismatch/am-1", ["red",   "canvas.setLineColor", "numeric argument", module.displayname(red.type)]);
						if (! module.isNumeric(green.type)) this.error("/argument-mismatch/am-1", ["green", "canvas.setLineColor", "numeric argument", module.displayname(green.type)]);
						if (! module.isNumeric(blue.type))  this.error("/argument-mismatch/am-1", ["blue",  "canvas.setLineColor", "numeric argument", module.displayname(blue.type)]);
						if (! module.isNumeric(alpha.type)) this.error("/argument-mismatch/am-1", ["alpha", "canvas.setLineColor", "numeric argument", module.displayname(alpha.type)]);
						this.service.canvas.setLineColor.call(this, red.value.b, green.value.b, blue.value.b, alpha.value.b);
						return {"type": this.program.types[module.typeid_null], "value": {"b": null}};
					},
					"setFillColor": function(red, green, blue, alpha) {
						if (! module.isNumeric(red.type))   this.error("/argument-mismatch/am-1", ["red",   "canvas.setFillColor", "numeric argument", module.displayname(red.type)]);
						if (! module.isNumeric(green.type)) this.error("/argument-mismatch/am-1", ["green", "canvas.setFillColor", "numeric argument", module.displayname(green.type)]);
						if (! module.isNumeric(blue.type))  this.error("/argument-mismatch/am-1", ["blue",  "canvas.setFillColor", "numeric argument", module.displayname(blue.type)]);
						if (! module.isNumeric(alpha.type)) this.error("/argument-mismatch/am-1", ["alpha", "canvas.setFillColor", "numeric argument", module.displayname(alpha.type)]);
						this.service.canvas.setFillColor.call(this, red.value.b, green.value.b, blue.value.b, alpha.value.b);
						return {"type": this.program.types[module.typeid_null], "value": {"b": null}};
					},
					"setFont": function(fontface, fontsize) {
						if (! module.isDerivedFrom(fontface.type, module.typeid_string)) this.error("/argument-mismatch/am-1", ["fontface", "canvas.setFont", "string", module.displayname(fontface.type)]);
						if (! module.isNumeric(fontsize.type)) this.error("/argument-mismatch/am-1", ["fontsize", "canvas.setFont", "numeric argument", module.displayname(fontsize.type)]);
						if (fontsize.value.b <= 0) this.error("/user/ue-2", ["error in canvas.setFont; fontsize must be positive"]);
						this.service.canvas.setFont.call(this, fontface.value.b, fontsize.value.b);
						return {"type": this.program.types[module.typeid_null], "value": {"b": null}};
					},
					"setTextAlign": function(alignment) {
						if (! module.isDerivedFrom(alignment.type, module.typeid_string)) this.error("/argument-mismatch/am-1", ["alignment", "canvas.setTextAlign", "string", module.displayname(alignment.type)]);
						let a = alignment.value.b;
						if (a != "left" && a != "center" && a != "right") this.error("/user/ue-2", ["error in canvas.setTextAlign; invalid alignment value"]);
						this.service.canvas.setTextAlign.call(this, alignment.value.b);
						return {"type": this.program.types[module.typeid_null], "value": {"b": null}};
					},
					"clear": function() {
						this.service.canvas.clear.call(this);
						return {"type": this.program.types[module.typeid_null], "value": {"b": null}};
					},
					"line": function(x1, y1, x2, y2) {
						if (! module.isNumeric(x1.type)) this.error("/argument-mismatch/am-1", ["x1", "canvas.line", "numeric argument", module.displayname(x1.type)]);
						if (! module.isNumeric(y1.type)) this.error("/argument-mismatch/am-1", ["y1", "canvas.line", "numeric argument", module.displayname(y1.type)]);
						if (! module.isNumeric(x2.type)) this.error("/argument-mismatch/am-1", ["x2", "canvas.line", "numeric argument", module.displayname(x2.type)]);
						if (! module.isNumeric(y2.type)) this.error("/argument-mismatch/am-1", ["y2", "canvas.line", "numeric argument", module.displayname(y2.type)]);
						this.service.canvas.line.call(this, x1.value.b, y1.value.b, x2.value.b, y2.value.b);
						return {"type": this.program.types[module.typeid_null], "value": {"b": null}};
					},
					"rect": function(left, top, width, height) {
						if (! module.isNumeric(left.type))   this.error("/argument-mismatch/am-1", ["left",   "canvas.rect", "numeric argument", module.displayname(left.type)]);
						if (! module.isNumeric(top.type))    this.error("/argument-mismatch/am-1", ["top",    "canvas.rect", "numeric argument", module.displayname(top.type)]);
						if (! module.isNumeric(width.type))  this.error("/argument-mismatch/am-1", ["width",  "canvas.rect", "numeric argument", module.displayname(width.type)]);
						if (! module.isNumeric(height.type)) this.error("/argument-mismatch/am-1", ["height", "canvas.rect", "numeric argument", module.displayname(height.type)]);
						this.service.canvas.rect.call(this, left.value.b, top.value.b, width.value.b, height.value.b);
						return {"type": this.program.types[module.typeid_null], "value": {"b": null}};
					},
					"fillRect": function(left, top, width, height) {
						if (! module.isNumeric(left.type))   this.error("/argument-mismatch/am-1", ["left",   "canvas.fillRect", "numeric argument", module.displayname(left.type)]);
						if (! module.isNumeric(top.type))    this.error("/argument-mismatch/am-1", ["top",    "canvas.fillRect", "numeric argument", module.displayname(top.type)]);
						if (! module.isNumeric(width.type))  this.error("/argument-mismatch/am-1", ["width",  "canvas.fillRect", "numeric argument", module.displayname(width.type)]);
						if (! module.isNumeric(height.type)) this.error("/argument-mismatch/am-1", ["height", "canvas.fillRect", "numeric argument", module.displayname(height.type)]);
						this.service.canvas.fillRect.call(this, left.value.b, top.value.b, width.value.b, height.value.b);
						return {"type": this.program.types[module.typeid_null], "value": {"b": null}};
					},
					"frameRect": function(left, top, width, height) {
						if (! module.isNumeric(left.type))   this.error("/argument-mismatch/am-1", ["left",   "canvas.frameRect", "numeric argument", module.displayname(left.type)]);
						if (! module.isNumeric(top.type))    this.error("/argument-mismatch/am-1", ["top",    "canvas.frameRect", "numeric argument", module.displayname(top.type)]);
						if (! module.isNumeric(width.type))  this.error("/argument-mismatch/am-1", ["width",  "canvas.frameRect", "numeric argument", module.displayname(width.type)]);
						if (! module.isNumeric(height.type)) this.error("/argument-mismatch/am-1", ["height", "canvas.frameRect", "numeric argument", module.displayname(height.type)]);
						this.service.canvas.frameRect.call(this, left.value.b, top.value.b, width.value.b, height.value.b);
						return {"type": this.program.types[module.typeid_null], "value": {"b": null}};
					},
					"circle": function(x, y, radius) {
						if (! module.isNumeric(x.type))      this.error("/argument-mismatch/am-1", ["x",      "canvas.circle", "numeric argument", module.displayname(x.type)]);
						if (! module.isNumeric(y.type))      this.error("/argument-mismatch/am-1", ["y",      "canvas.circle", "numeric argument", module.displayname(y.type)]);
						if (! module.isNumeric(radius.type)) this.error("/argument-mismatch/am-1", ["radius", "canvas.circle", "numeric argument", module.displayname(radius.type)]);
						this.service.canvas.circle.call(this, x.value.b, y.value.b, radius.value.b);
						return {"type": this.program.types[module.typeid_null], "value": {"b": null}};
					},
					"fillCircle": function(x, y, radius) {
						if (! module.isNumeric(x.type))      this.error("/argument-mismatch/am-1", ["x",      "canvas.fillCircle", "numeric argument", module.displayname(x.type)]);
						if (! module.isNumeric(y.type))      this.error("/argument-mismatch/am-1", ["y",      "canvas.fillCircle", "numeric argument", module.displayname(y.type)]);
						if (! module.isNumeric(radius.type)) this.error("/argument-mismatch/am-1", ["radius", "canvas.fillCircle", "numeric argument", module.displayname(radius.type)]);
						this.service.canvas.fillCircle.call(this, x.value.b, y.value.b, radius.value.b);
						return {"type": this.program.types[module.typeid_null], "value": {"b": null}};
					},
					"frameCircle": function(x, y, radius) {
						if (! module.isNumeric(x.type))      this.error("/argument-mismatch/am-1", ["x",      "canvas.frameCircle", "numeric argument", module.displayname(x.type)]);
						if (! module.isNumeric(y.type))      this.error("/argument-mismatch/am-1", ["y",      "canvas.frameCircle", "numeric argument", module.displayname(y.type)]);
						if (! module.isNumeric(radius.type)) this.error("/argument-mismatch/am-1", ["radius", "canvas.frameCircle", "numeric argument", module.displayname(radius.type)]);
						this.service.canvas.frameCircle.call(this, x.value.b, y.value.b, radius.value.b);
						return {"type": this.program.types[module.typeid_null], "value": {"b": null}};
					},
					"curve": function(points, closed) {
						if (! module.isDerivedFrom(points.type, module.typeid_array)) this.error("/argument-mismatch/am-1", ["points", "canvas.curve", "array", module.displayname(points.type)]);
						if (! module.isDerivedFrom(closed.type, module.typeid_boolean)) this.error("/argument-mismatch/am-1", ["closed", "canvas.curve", "boolean", module.displayname(closed.type)]);
						let list = [];
						for (let i=0; i<points.value.b.length; i++)
						{
							let p = points.value.b[i];
							if (! module.isDerivedFrom(points.type, module.typeid_array)) this.error("/argument-mismatch/am-1", ["points[" + i + "]", "canvas.curve", "array", module.displayname(p.type)]);
							if (p.value.b.length != 2) this.error("/user/ue-2", ["error in canvas.curve; point[" + i + "] must be an array of size two."]);
							let x = p.value.b[0];
							let y = p.value.b[1];
							if (! module.isNumeric(x.type)) this.error("/argument-mismatch/am-1", ["points[" + i + "][0]", "canvas.curve", "numeric argument", module.displayname(x.type)]);
							if (! module.isNumeric(y.type)) this.error("/argument-mismatch/am-1", ["points[" + i + "][1]", "canvas.curve", "numeric argument", module.displayname(y.type)]);
							list.push([x.value.b, y.value.b]);
						}
						this.service.canvas.curve.call(this, list, closed.value.b);
						return {"type": this.program.types[module.typeid_null], "value": {"b": null}};
					},
					"fillArea": function(points) {
						if (! module.isDerivedFrom(points.type, module.typeid_array)) this.error("/argument-mismatch/am-1", ["points", "canvas.fillArea", "array", module.displayname(points.type)]);
						let list = [];
						for (let i=0; i<points.value.b.length; i++)
						{
							let p = points.value.b[i];
							if (! module.isDerivedFrom(points.type, module.typeid_array)) this.error("/argument-mismatch/am-1", ["points[" + i + "]", "canvas.fillArea", "array", module.displayname(p.type)]);
							if (p.value.b.length != 2) this.error("/user/ue-2", ["error in canvas.fillArea; point[" + i + "] must be an array of size two."]);
							let x = p.value.b[0];
							let y = p.value.b[1];
							if (! module.isNumeric(x.type)) this.error("/argument-mismatch/am-1", ["points[" + i + "][0]", "canvas.fillArea", "numeric argument", module.displayname(x.type)]);
							if (! module.isNumeric(y.type)) this.error("/argument-mismatch/am-1", ["points[" + i + "][1]", "canvas.fillArea", "numeric argument", module.displayname(y.type)]);
							list.push([x.value.b, y.value.b]);
						}
						this.service.canvas.fillArea.call(this, list);
						return {"type": this.program.types[module.typeid_null], "value": {"b": null}};
					},
					"frameArea": function(points) {
						if (! module.isDerivedFrom(points.type, module.typeid_array)) this.error("/argument-mismatch/am-1", ["points", "canvas.frameArea", "array", module.displayname(points.type)]);
						let list = [];
						for (let i=0; i<points.value.b.length; i++)
						{
							let p = points.value.b[i];
							if (! module.isDerivedFrom(points.type, module.typeid_array)) this.error("/argument-mismatch/am-1", ["points[" + i + "]", "canvas.frameArea", "array", module.displayname(p.type)]);
							if (p.value.b.length != 2) this.error("/user/ue-2", ["error in canvas.frameArea; point[" + i + "] must be an array of size two."]);
							let x = p.value.b[0];
							let y = p.value.b[1];
							if (! module.isNumeric(x.type)) this.error("/argument-mismatch/am-1", ["points[" + i + "][0]", "canvas.frameArea", "numeric argument", module.displayname(x.type)]);
							if (! module.isNumeric(y.type)) this.error("/argument-mismatch/am-1", ["points[" + i + "][1]", "canvas.frameArea", "numeric argument", module.displayname(y.type)]);
							list.push([x.value.b, y.value.b]);
						}
						this.service.canvas.frameArea.call(this, list);
						return {"type": this.program.types[module.typeid_null], "value": {"b": null}};
					},
					"text": function(x, y, str) {
						if (! module.isNumeric(x.type)) this.error("/argument-mismatch/am-1", ["x", "canvas.text", "numeric argument", module.displayname(x.type)]);
						if (! module.isNumeric(y.type)) this.error("/argument-mismatch/am-1", ["y", "canvas.text", "numeric argument", module.displayname(y.type)]);
						this.service.canvas.text.call(this, x.value.b, y.value.b, module.toString(str));
						return {"type": this.program.types[module.typeid_null], "value": {"b": null}};
					},
					"reset": function() {
						this.service.canvas.reset.call(this);
						return {"type": this.program.types[module.typeid_null], "value": {"b": null}};
					},
					"shift": function(dx, dy) {
						if (! module.isNumeric(dx.type)) this.error("/argument-mismatch/am-1", ["dx", "canvas.shift", "numeric argument", module.displayname(dx.type)]);
						if (! module.isNumeric(dy.type)) this.error("/argument-mismatch/am-1", ["dy", "canvas.shift", "numeric argument", module.displayname(dy.type)]);
						this.service.canvas.shift.call(this, dx.value.b, dy.value.b);
						return {"type": this.program.types[module.typeid_null], "value": {"b": null}};
					},
					"scale": function(factor) {
						if (! module.isNumeric(factor.type)) this.error("/argument-mismatch/am-1", ["factor", "canvas.scale", "numeric argument", module.displayname(factor.type)]);
						this.service.canvas.scale.call(this, factor.value.b);
						return {"type": this.program.types[module.typeid_null], "value": {"b": null}};
					},
					"rotate": function(angle) {
						if (! module.isNumeric(angle.type)) this.error("/argument-mismatch/am-1", ["angle", "canvas.rotate", "numeric argument", module.displayname(angle.type)]);
						this.service.canvas.rotate.call(this, angle.value.b);
						return {"type": this.program.types[module.typeid_null], "value": {"b": null}};
					},
					"transform": function(A, b) {
						if (! module.isDerivedFrom(A.type, module.typeid_array)) this.error("/argument-mismatch/am-1", ["A", "canvas.transform", "array", module.displayname(A.type)]);
						if (! module.isDerivedFrom(b.type, module.typeid_array)) this.error("/argument-mismatch/am-1", ["b", "canvas.transform", "array", module.displayname(b.type)]);
						if (A.value.b.length != 2) this.error("/user/ue-2", ["error in canvas.transform; A must be an array of size two."]);
						if (A.value.b[0].value.b.length != 2) this.error("/user/ue-2", ["error in canvas.transform; A[0] must be an array of size two."]);
						if (A.value.b[1].value.b.length != 2) this.error("/user/ue-2", ["error in canvas.transform; A[1] must be an array of size two."]);
						if (! module.isNumeric(A.value.b[0].value.b[0].type)) this.error("/argument-mismatch/am-1", ["A[0][0]", "canvas.transform", "numeric argument", module.displayname(A.value.b[0].value.b[0].type)]);
						if (! module.isNumeric(A.value.b[0].value.b[1].type)) this.error("/argument-mismatch/am-1", ["A[0][1]", "canvas.transform", "numeric argument", module.displayname(A.value.b[0].value.b[1].type)]);
						if (! module.isNumeric(A.value.b[1].value.b[0].type)) this.error("/argument-mismatch/am-1", ["A[1][0]", "canvas.transform", "numeric argument", module.displayname(A.value.b[1].value.b[0].type)]);
						if (! module.isNumeric(A.value.b[1].value.b[1].type)) this.error("/argument-mismatch/am-1", ["A[1][1]", "canvas.transform", "numeric argument", module.displayname(A.value.b[1].value.b[1].type)]);
						if (b.value.b.length != 2) this.error("/user/ue-2", ["error in canvas.transform; b must be an array of size two."]);
						if (! module.isNumeric(b.value.b[0].type)) this.error("/argument-mismatch/am-1", ["b[0]", "canvas.transform", "numeric argument", module.displayname(b.value.b[0].type)]);
						if (! module.isNumeric(b.value.b[1].type)) this.error("/argument-mismatch/am-1", ["b[1]", "canvas.transform", "numeric argument", module.displayname(b.value.b[1].type)]);
						this.service.canvas.transform.call(this,
								[[A.value.b[0].value.b[0].value.b, A.value.b[0].value.b[1].value.b],
								 [A.value.b[1].value.b[0].value.b, A.value.b[1].value.b[1].value.b]],
								[b.value.b[0].value.b, b.value.b[1].value.b]);
						return {"type": this.program.types[module.typeid_null], "value": {"b": null}};
					},
			},
		},
	};


///////////////////////////////////////////////////////////
// lexer
//
// The task of the lexer is to return the next token in the
// input stream. It handles composite operators properly.
//


module.keywords = {
		"var": true,
		"function": true,
		"if": true,
		"then": true,
		"else": true,
		"for": true,
		"do": true,
		"while": true,
		"break": true,
		"continue": true,
		"return": true,
		"not": true,
		"and": true,
		"or": true,
		"xor": true,
		"null": true,
		"true": true,
		"false": true,
		"try": true,
		"catch": true,
		"throw": true,
		"class": true,
		"public": true,
		"protected": true,
		"private": true,
		"static": true,
		"constructor": true,
		"this": true,
		"super": true,
		"namespace": true,
		"use": true,
		"from": true,
		"module": true,
		"include": true,
		"import": true,
		"export": true,
		"const": true,
		"switch": true,
		"case": true,
		"default": true,
		"enum": true,
		"operator": true,
	};
module.operators = "=<>!^+-*/%:";
module.groupings = "()[]{}";
module.delimiters = ",;.";

// This is the central interface function of the lexer. It returns an
// object with the fields value and type:
//  * type is one of: "keyword", "identifier", "integer", "real", "string", "operator", "grouping", "delimiter", "end-of-file"
//  * value is a substring of the source code
//  * code is the sequence of characters that was parsed into the token
// If peek is set then the state will not be modified, unless an error
// occurs. In case of an error the function throws an exception.
// Note that one cannot rely on the token value alone to infer its type,
// since string tokens can take on any value. Therefore a token must
// always be tested for its type first, and then for a certain value.
module.get_token = function (state, peek)
{
	peek = (peek !== undefined) ? peek : false;
	let where = (peek) ? state.get() : false;
	state.skip();
	let line = state.line;
	if (state.eof()) return {"type": "end-of-file", "value": "", "code": "", "line": line};

	let indent = state.indentation();
	let tok = null;

	let c = state.current();
	if ((c >= 'A' && c <= 'Z') || (c >= 'a' && c <= 'z') || c == '_')
	{
		// parse an identifier or a keyword
		let start = state.pos;
		state.advance();
		while (state.good())
		{
			let c = state.current();
			if ((c >= 'A' && c <= 'Z') || (c >= 'a' && c <= 'z') || (c >= '0' && c <= '9') || c == '_') state.advance();
			else break;
		}
		let value = state.source.substring(start, state.pos);
		if (where) state.set(where); else state.skip();
		tok = {"type": (module.keywords.hasOwnProperty(value)) ? "keyword" : "identifier", "value": value, "code": value, "line": line};
	}
	else if (c >= '0' && c <= '9')
	{
		// parse a number, integer or float
		let start = state.pos;
		let digits = "0123456789";
		let type = "integer";
		while (! state.eof() && digits.indexOf(state.current()) >= 0) state.advance();
		if (! state.eof())
		{
			if (state.current() == '.')
			{
				// parse fractional part
				type = "real";
				state.advance();
				if (state.eof() || (state.current() < '0' || state.current() > '9')) state.error("/syntax/se-1");
				while (! state.eof() && (state.current() >= '0' && state.current() <= '9')) state.advance();
			}
			if (state.current() == 'e' || state.current() == 'E')
			{
				// parse exponent
				type = "real";
				state.advance();
				if (state.current() == '+' || state.current() == '-') state.advance();
				if (state.current() < '0' || state.current() > '9') state.error("/syntax/se-1");
				while (! state.eof() && (state.current() >= '0' && state.current() <= '9')) state.advance();
			}
		}
		let value = state.source.substring(start, state.pos);
		let n = parseFloat(value);
		if (where) state.set(where); else state.skip();
		tok = {"type": type, "value": n, "code": value, "line": line};
	}
	else if (c == '\"')
	{
		// parse string token
		let start = state.pos;
		let code = "";
		let value = "";
		state.advance();
		while (true)
		{
			if (! state.good()) state.error("/syntax/se-2");
			let c = state.current();
			if (c == '\\')
			{
				state.advance();
				let c = state.current();
				state.advance();
				if (c == '\\') c = '\\';
				else if (c == '\"') c = '\"';
				else if (c == 'r') c = '\r';
				else if (c == 'n') c = '\n';
				else if (c == 't') c = '\t';
				else if (c == 'f') c = '\f';
				else if (c == 'b') c = '\b';
				else if (c == '/') c = '/';
				else if (c == 'u')
				{
					const digits = "0123456789abcdefABCDEF";
					let code = "";
					for (let i=0; i<4; i++)
					{
						if (digits.indexOf(state.current()) < 0) state.error("/syntax/se-3");
						code += state.current();
						state.advance();
					}
					c = String.fromCharCode(parseInt(code, 16));
				}
				else state.error("/syntax/se-4", [c]);
				value += c;
			}
			else if (c == '\r' || c == '\n') state.error("/syntax/se-2");
			else if (c == '\"')
			{
				state.advance();
				code = state.source.substring(start, state.pos);
				break;
			}
			else
			{
				value += c;
				state.advance();
			}
		}
		if (where) state.set(where); else state.skip();
		tok = {"type": "string", "value": value, "code": code, "line": line};
	}
	else
	{
		// all the rest, including operators
		state.advance();
		if (module.operators.indexOf(c) >= 0)
		{
			let op = c;
			if (state.current() == '/' && c == '/') { state.advance(); op += '/'; }
			if (state.current() == '=' && c != ':') { state.advance(); op += '='; }
			if (op != "!")
			{
				if (where) state.set(where); else state.skip();
				tok = {"type": "operator", "value": op, "code": op, "line": line};
			}
		}
		if (tok === null)
		{
			let type = null;
			if (module.groupings.indexOf(c) >= 0) type = "grouping";
			else if (module.delimiters.indexOf(c) >= 0) type = "delimiter";
			else state.error("/syntax/se-5", [c]);
			if (where) state.set(where); else state.skip();
			tok = {"type": type, "value": c, "code": c, "line": line};
		}
	}

	if (module.options.checkstyle && ! state.builtin())
	{
		// check for indentation problems
		if (tok.type == "keyword" && (tok.value == "public" || tok.value == "protected" || tok.value == "private"))
		{ }
		else if (tok.type == "operator" && tok.value == ":")
		{ }
		else
		{
			let topmost = state.indent[state.indent.length - 1];
			if (topmost < 0 && line != -1-topmost)
			{
				if (indent <= state.indent[state.indent.length - 2]) state.error("/style/ste-1");
				state.indent[state.indent.length - 1] = indent;
			}
			else if (indent < topmost && state.current() != '}') state.error("/style/ste-1");
		}
	}

	return tok;
}


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
//  * where: object with fields pos, line and ch describing
//           the location in the source code where the
//           program element is defined (missing for a few
//           implicit elements, as well as for built-ins).
//

const assignments = {
		"=": true,
		"+=": true,
		"-=": true,
		"*=": true,
		"/=": true,
		"//=": true,
		"%=": true,
		"^=": true
	};

const left_unary_operator_precedence = {
		'+': 2,
		'-': 2,
		"not": 7,
	};

const binary_operator_precedence = {
		'+': 4,
		'-': 4,
		'*': 3,
		'/': 3,
		'//': 3,
		'%': 3,
		'^': 1,
		':': 5,
		'==': 6,
		'!=': 6,
		'<': 6,
		'<=': 6,
		'>': 6,
		'>=': 6,
		"and": 8,
		"or": 9,
		"xor": 9,
	};

const left_unary_operator_impl = {
		"not": function(arg)
				{
						if (module.isDerivedFrom(arg.type, module.typeid_boolean)) return {"type": this.program.types[module.typeid_boolean], "value": {"b": !arg.value.b} };
						else if (module.isDerivedFrom(arg.type, module.typeid_integer)) return {"type": this.program.types[module.typeid_integer], "value": {"b": ~arg.value.b} };
						else this.error("/argument-mismatch/am-2", [module.displayname(arg.type)]);
				},
		'+': function(arg)
				{
					if (module.isDerivedFrom(arg.type, module.typeid_integer)) return {"type": this.program.types[module.typeid_integer], "value": {"b": arg.value.b} };
					else if (module.isDerivedFrom(arg.type, module.typeid_real)) return {"type": this.program.types[module.typeid_real], "value": {"b": arg.value.b} };
					else this.error("/argument-mismatch/am-3", [module.displayname(arg.type)]);
				},
		'-': function(arg)
				{
					if (module.isDerivedFrom(arg.type, module.typeid_integer)) return {"type": this.program.types[module.typeid_integer], "value": {"b": (-arg.value.b) | 0} };
					else if (module.isDerivedFrom(arg.type, module.typeid_real)) return {"type": this.program.types[module.typeid_real], "value": {"b": -arg.value.b} };
					else this.error("/argument-mismatch/am-4", [module.displayname(arg.type)]);
				},
	};

const binary_operator_impl = {
		'+': function(lhs, rhs)
				{
					if (module.isDerivedFrom(lhs.type, module.typeid_integer) && module.isDerivedFrom(rhs.type, module.typeid_integer))
					{
						return {"type": this.program.types[module.typeid_integer], "value": {"b": (lhs.value.b + rhs.value.b) | 0} };
					}
					else if (module.isNumeric(lhs.type) && module.isNumeric(rhs.type))
					{
						return {"type": this.program.types[module.typeid_real], "value": {"b": lhs.value.b + rhs.value.b} };
					}
					else if (module.isDerivedFrom(lhs.type, module.typeid_string) || module.isDerivedFrom(rhs.type, module.typeid_string))
					{
						return {"type": this.program.types[module.typeid_string], "value": {"b": module.toString.call(this, lhs) + module.toString.call(this, rhs)} };
					}
					else this.error("/argument-mismatch/am-5", [module.displayname(lhs.type), module.displayname(rhs.type)]);
				},
		'-': function(lhs, rhs)
				{
					if (module.isDerivedFrom(lhs.type, module.typeid_integer) && module.isDerivedFrom(rhs.type, module.typeid_integer)) return {"type": this.program.types[module.typeid_integer], "value": {"b": (lhs.value.b - rhs.value.b) | 0} };
					else if (module.isNumeric(lhs.type) && module.isNumeric(rhs.type)) return {"type": this.program.types[module.typeid_real], "value": {"b": lhs.value.b - rhs.value.b} };
					else this.error("/argument-mismatch/am-6", [module.displayname(rhs.type), module.displayname(lhs.type)]);
				},
		'*': function(lhs, rhs)
				{
					if (module.isDerivedFrom(lhs.type, module.typeid_integer) && module.isDerivedFrom(rhs.type, module.typeid_integer)) return {"type": this.program.types[module.typeid_integer], "value": {"b": (lhs.value.b * rhs.value.b) | 0} };
					else if (module.isNumeric(lhs.type) && module.isNumeric(rhs.type)) return {"type": this.program.types[module.typeid_real], "value": {"b": lhs.value.b * rhs.value.b} };
					else this.error("/argument-mismatch/am-7", [module.displayname(lhs.type), module.displayname(rhs.type)]);
				},
		'/': function(lhs, rhs)
				{
					if (module.isNumeric(lhs.type) && module.isNumeric(rhs.type))
					{
						return {"type": this.program.types[module.typeid_real], "value": {"b": lhs.value.b / rhs.value.b} };
					}
					else this.error("/argument-mismatch/am-8", [module.displayname(lhs.type), module.displayname(rhs.type)]);
				},
		'//': function(lhs, rhs)
				{
					if (module.isNumeric(lhs.type) && module.isNumeric(rhs.type))
					{
						if (module.isDerivedFrom(lhs.type, module.typeid_integer) && module.isDerivedFrom(rhs.type, module.typeid_integer))
						{
							if (rhs.value.b == 0) this.error("/argument-mismatch/am-15");
							return {"type": this.program.types[module.typeid_integer], "value": {"b": Math.floor(lhs.value.b / rhs.value.b) | 0} };
						}
						else
						{
							return {"type": this.program.types[module.typeid_real], "value": {"b": Math.floor(lhs.value.b / rhs.value.b)} };
						}
					}
					else this.error("/argument-mismatch/am-8", [module.displayname(lhs.type), module.displayname(rhs.type)]);
				},
		'%': function(lhs, rhs)
				{
					if (module.isNumeric(lhs.type) && module.isNumeric(rhs.type))
					{
						if (module.isDerivedFrom(lhs.type, module.typeid_integer) && module.isDerivedFrom(rhs.type, module.typeid_integer)) return {"type": this.program.types[module.typeid_integer], "value": {"b": Math.round(module.mod.call(this, lhs.value.b, rhs.value.b)) | 0} };
						else return {"type": this.program.types[module.typeid_real], "value": {"b": module.mod.call(this, lhs.value.b, rhs.value.b)} };
					}
					else this.error("/argument-mismatch/am-9", [module.displayname(lhs.type), module.displayname(rhs.type)]);
				},
		'^': function(lhs, rhs)
				{
					if (module.isNumeric(lhs.type) && module.isNumeric(rhs.type))
					{
						if (module.isDerivedFrom(lhs.type, module.typeid_integer) && module.isDerivedFrom(rhs.type, module.typeid_integer) && rhs.value.b >= 0)
						{
							let ret = 1;
							let factor = lhs.value.b;
							for (let i=0; i<32; i++)
							{
								if ((1 << i) & rhs.value.b) ret = module.mul32(ret, factor);
								factor = module.mul32(factor, factor);
							}
							return {"type": this.program.types[module.typeid_integer], "value": {"b": ret} };
						}
						else return {"type": this.program.types[module.typeid_real], "value": {"b": Math.pow(lhs.value.b, rhs.value.b)} };
					}
					else this.error("/argument-mismatch/am-10", [module.displayname(lhs.type), module.displayname(rhs.type)]);
				},
		':': function(lhs, rhs)
				{
					if (module.isDerivedFrom(lhs.type, module.typeid_integer)) { }
					else if (module.isDerivedFrom(lhs.type, module.typeid_real) && module.isInt32(lhs.value.b)) { }
					else this.error("/argument-mismatch/am-11");
					if (module.isDerivedFrom(rhs.type, module.typeid_integer)) { }
					else if (module.isDerivedFrom(rhs.type, module.typeid_real) && module.isInt32(rhs.value.b)) { }
					else this.error("/argument-mismatch/am-11");
					return {"type": this.program.types[module.typeid_range], "value": {"b": { "begin": lhs.value.b | 0, "end": rhs.value.b | 0 } } }
				},
		'==': function(lhs, rhs)
				{
					return {"type": this.program.types[module.typeid_boolean], "value": {"b": module.equal.call(this, lhs, rhs)} };
				},
		'!=': function(lhs, rhs)
				{
					return {"type": this.program.types[module.typeid_boolean], "value": {"b": ! module.equal.call(this, lhs, rhs)} };
				},
		'<': function(lhs, rhs)
				{
					return {"type": this.program.types[module.typeid_boolean], "value": {"b": module.order.call(this, lhs, rhs) < 0} };
				},
		'<=': function(lhs, rhs)
				{
					return {"type": this.program.types[module.typeid_boolean], "value": {"b": module.order.call(this, lhs, rhs) <= 0} };
				},
		'>': function(lhs, rhs)
				{
					return {"type": this.program.types[module.typeid_boolean], "value": {"b": module.order.call(this, lhs, rhs) > 0} };
				},
		'>=': function(lhs, rhs)
				{
					return {"type": this.program.types[module.typeid_boolean], "value": {"b": module.order.call(this, lhs, rhs) >= 0} };
				},
		"and": function(lhs, rhs)
				{
					if (module.isDerivedFrom(lhs.type, module.typeid_boolean) && module.isDerivedFrom(rhs.type, module.typeid_boolean))
					{
						return {"type": this.program.types[module.typeid_boolean], "value": {"b": lhs.value.b && rhs.value.b} };
					}
					else if (module.isDerivedFrom(lhs.type, module.typeid_integer) && module.isDerivedFrom(rhs.type, module.typeid_integer))
					{
						return {"type": this.program.types[module.typeid_integer], "value": {"b": lhs.value.b & rhs.value.b} };
					}
					else this.error("/argument-mismatch/am-12", ["and", module.displayname(lhs.type), module.displayname(rhs.type)]);
				},
		"or": function(lhs, rhs)
				{
					if (module.isDerivedFrom(lhs.type, module.typeid_boolean) && module.isDerivedFrom(rhs.type, module.typeid_boolean))
					{
						return {"type": this.program.types[module.typeid_boolean], "value": {"b": lhs.value.b || rhs.value.b} };
					}
					else if (module.isDerivedFrom(lhs.type, module.typeid_integer) && module.isDerivedFrom(rhs.type, module.typeid_integer))
					{
						return {"type": this.program.types[module.typeid_integer], "value": {"b": lhs.value.b | rhs.value.b} };
					}
					else this.error("/argument-mismatch/am-12", ["or", module.displayname(lhs.type), module.displayname(rhs.type)]);
				},
		"xor": function(lhs, rhs)
				{
					if (module.isDerivedFrom(lhs.type, module.typeid_boolean) && module.isDerivedFrom(rhs.type, module.typeid_boolean))
					{
						return {"type": this.program.types[module.typeid_boolean], "value": {"b": lhs.value.b != rhs.value.b} };
					}
					else if (module.isDerivedFrom(lhs.type, module.typeid_integer) && module.isDerivedFrom(rhs.type, module.typeid_integer))
					{
						return {"type": this.program.types[module.typeid_integer], "value": {"b": lhs.value.b ^ rhs.value.b} };
					}
					else this.error("/argument-mismatch/am-12", ["xor", module.displayname(lhs.type), module.displayname(rhs.type)]);
				},
	};

// This function checks whether the next token is a keyword. If so then
// the keyword is returned without altering the state, otherwise the
// function returns the empty string.
function peek_keyword(state)
{
	let where = state.get();
	state.skip();
	if (state.eof()) return "";

	let c = state.current();
	if ((c >= 'A' && c <= 'Z') || (c >= 'a' && c <= 'z') || c == '_')
	{
		// parse an identifier or a keyword
		let start = state.pos;
		state.advance();
		while (state.good())
		{
			let c = state.current();
			if ((c >= 'A' && c <= 'Z') || (c >= 'a' && c <= 'z') || (c >= '0' && c <= '9') || c == '_') state.advance();
			else break;
		}
		let value = state.source.substring(start, state.pos);
		state.set(where);
		if (module.keywords.hasOwnProperty(value)) return value;
		else return "";
	}
	else
	{
		state.set(where);
		return "";
	}
}


///////////////////////////////////////////////////////////
// parser
//
// The parser consists of a number of free functions.
// Functions starting with "parse_" alter the parser state.
// These functions return the program element they created.
// They throw an exception on error. The only purpose of
// the exception is to interrupt the control flow; the
// actual error message is stored in the state object.
//

// deep copy of a JSON-like data structure
function deepcopy(value, excludekeys)
{
	if (excludekeys === undefined) excludekeys = {};

	if (Array.isArray(value))
	{
		let ret = [];
		for (let i=0; i<value.length; i++) ret.push(deepcopy(value[i], excludekeys));
		return ret;
	}
	else if ((typeof value === "object") && (value !== null))
	{
		let ret = {};
		for (let key in value)
		{
			if (! value.hasOwnProperty(key)) continue;
			if (excludekeys.hasOwnProperty(key)) continue;
			ret[key] = deepcopy(value[key], excludekeys);
		}
		return ret;
	}
	else return value;
}

// deep copy of a boxed constant
function copyconstant(constant)
{
	if (constant.type.id == module.typeid_array)
	{
		let value = [];
		for (let i=0; i<constant.value.b.length; i++) value.push(copyconstant.call(this, constant.value.b[i]));
		return {"type": this.program.types[module.typeid_array], "value": {"b": value}};
	}
	else if (constant.type.id == module.typeid_dictionary)
	{
		let value = {};
		for (let key in constant.value.b)
		{
			if (constant.value.b.hasOwnProperty(key)) value[key] = copyconstant.call(this, constant.value.b[key]);
		}
		return {"type": this.program.types[module.typeid_dictionary], "value": {"b": value}};
	}
	else return constant;
}

function simfalse()
{ return false; }

function simtrue()
{ return true; }

// step function of all constants
function constantstep()
{
	let frame = this.stack[this.stack.length - 1];
	let pe = frame.pe[frame.pe.length - 1];
	frame.temporaries.push(copyconstant.call(this, pe.typedvalue));
	frame.pe.pop();
	frame.ip.pop();
	return false;
};

// step function of most scopes, including global scope and functions
function scopestep()
{
	let frame = this.stack[this.stack.length - 1];
	let pe = frame.pe[frame.pe.length - 1];
	let ip = frame.ip[frame.ip.length - 1];
	if (ip < pe.commands.length)
	{
		if (! pe.commands[ip].declaration)
		{
			frame.pe.push(pe.commands[ip]);
			frame.ip.push(-1);
		}
		return false;
	}
	else
	{
		frame.pe.pop();
		frame.ip.pop();
		if (pe.petype == "function")
		{
			this.stack.pop();
			let frame = this.stack[this.stack.length - 1];
			frame.temporaries.push({"type": this.program.types[module.typeid_null], "value": {"b": null}});
			return false;
		}
		else if (pe.petype == "global scope")
		{
			// the program has finished
			this.stack.pop();
			return false;
		}
		else return false;
	}
}

// step function of constructors
function constructorstep()
{
	let frame = this.stack[this.stack.length - 1];
	let pe = frame.pe[frame.pe.length - 1];
	let ip = frame.ip[frame.ip.length - 1];
	if (ip == 0)
	{
		// call the super class constructor
		if (pe.hasOwnProperty("supercall"))
		{
			frame.pe.push(pe.supercall);
			frame.ip.push(-1);
		}
		return false;
	}
	else if (ip < pe.commands.length + 1)
	{
		// run the constructor commands
		if (! pe.commands[ip - 1].declaration)
		{
			frame.pe.push(pe.commands[ip - 1]);
			frame.ip.push(-1);
		}
		return false;
	}
	else
	{
		// return without a value
		frame.pe.pop();
		frame.ip.pop();
		this.stack.pop();
		return false;
	}
}

// step function of function calls
function callstep()
{
	let frame = this.stack[this.stack.length - 1];
	let pe = frame.pe[frame.pe.length - 1];
	let ip = frame.ip[frame.ip.length - 1];
	let n = pe.arguments.length;
	if (ip == 0)
	{
		// evaluate base
		frame.pe.push(pe.base);
		frame.ip.push(-1);
		return false;
	}
	else if (ip <= n)
	{
		// evaluate arguments of the call
		frame.pe.push(pe.arguments[ip - 1]);
		frame.ip.push(-1);
		return false;
	}
	else if (ip == n+1)
	{
		// load the accumulated temporaries
		let args = new Array(n);
		for (let i=0; i<n; i++) args[n-1-i] = frame.temporaries.pop();
		let f = frame.temporaries.pop();

		// check for a callable object
		let f_obj = null;
		let f_pe = null;
		if (module.isDerivedFrom(f.type, module.typeid_function))
		{
			f_pe = f.value.b.func;
			if (f.value.b.hasOwnProperty("object")) f_obj = f.value.b.object;
		}
		else if (module.isDerivedFrom(f.type, module.typeid_type))
		{
			module.assert(f.value.b.hasOwnProperty("class_constructor"), "[callstep] internal error; type does not have a constructor");
			f_pe = f.value.b.class_constructor;
			if (pe.petype == "super call") f_obj = frame.object;
			else
			{
				// prepare the object for the constructor chain
				let cls = f.value.b;
				module.assert(cls.petype == "type", "[callstep] cannot find class of constructor");
				f_obj = { "type": cls, "value": { } };
				if (cls.objectsize > 0)
				{
					f_obj.value.a = [];
					let n = {"type": this.program.types[module.typeid_null], "value": {"b": null}};
					for (let i=0; i<cls.objectsize; i++) f_obj.value.a.push(n);
				}
				// initialize attributes
				let c = cls;
				while (c && c.variables)
				{
					for (let i=0; i<c.variables.length; i++)
					{
						if (c.variables[i].hasOwnProperty("initializer"))
						{
							f_obj.value.a[c.variables[i].id] = c.variables[i].initializer.typedvalue;
						}
					}
					c = c.superclass;
				}

				// return value of construction is the new object
				frame.temporaries.push(f_obj);
			}
		}
		else this.error("/syntax/se-16", [module.displayname(f.type)]);

		// argument list for the call
		let m = f_pe.params.length;
		let params = new Array(m);

		// handle positional and named arguments
		for (let i=0; i<n; i++)
		{
			if (pe.arguments[i].petype == "named argument")
			{
				// parameter name lookup
				let name = pe.arguments[i].name;
				let found = false;
				for (let j=0; j<m; j++)
				{
					if (f_pe.params[j].hasOwnProperty("name") && f_pe.params[j].name == name)
					{
						if (params[j] !== undefined) this.error("/name/ne-1", [name, module.displayname(f_pe)]);
						params[j] = args[i];
						found = true;
						break;
					}
				}
				if (! found) this.error("/name/ne-2", [name, module.displayname(f_pe)]);
			}
			else
			{
				if (i < params.length) params[i] = args[i];
				else this.error("/name/ne-3", [module.displayname(f_pe)]);
			}
		}

		// handle default values
		for (let j=0; j<m; j++)
		{
			if (params[j] === undefined)
			{
				if (f_pe.params[j].hasOwnProperty("defaultvalue")) params[j] = f_pe.params[j].defaultvalue;
				else this.error("/name/ne-4", [(j+1), module.displayname(f_pe)]);
			}
		}

		// handle closure parameters
		if (f.value.b.hasOwnProperty("enclosed")) params = f.value.b.enclosed.concat(params);

		// make the actual call
		{
			// create a new stack frame with the function arguments as local variables
			let frame = {
					"pe": [f_pe],
					"ip": [-1],
					"temporaries": [],
					"variables": params,
				};
			if (f_obj) frame.object = f_obj;
			if (f.value.b.hasOwnProperty("enclosed")) frame.enclosed = f.value.b.enclosed;
			this.stack.push(frame);
			if (this.stack.length >= module.maxstacksize) this.error("/logic/le-1");
		}
		return true;
	}
	else
	{
		frame.pe.pop();
		frame.ip.pop();
		return false;
	}
}

function callsim()
{
	let frame = this.stack[this.stack.length - 1];
	let pe = frame.pe[frame.pe.length - 1];
	let ip = frame.ip[frame.ip.length - 1];
	let n = pe.arguments.length;
	return (ip == n + 1);
}

// Create a program element of type breakpoint.
// The breakpoint is initially inactive.
function create_breakpoint(parent, state)
{
	let active = false;
	return {
			"petype": "breakpoint",
			"parent": parent,
			"line": state.line,
			"where": state.get(),
			"active": function()
					{ return active; },
			"set": function()
					{ active = true; },
			"clear": function()
					{ active = false; },
			"toggle": function()
					{ active = !active; },
			"step": function()
					{
						let frame = this.stack[this.stack.length - 1];
						if (active && frame.ip[frame.ip.length-1] == 0)
						{
							frame.ip[frame.ip.length-1]++;
							this.interrupt();
							if (this.service.breakpoint) this.service.breakpoint();
							return true;
						}
						frame.pe.pop();
						frame.ip.pop();
						return false;
					},
			"sim": function()
					{
						let frame = this.stack[this.stack.length - 1];
						return active && frame.ip[frame.ip.length-1] == 0;
					},
			};
}

function get_program(pe)
{
	while (pe.parent) pe = pe.parent;
	return pe;
}

function get_function(pe)
{
	while (true)
	{
		if (pe.petype == "function" || pe.petype == "method") return pe;
		if (pe.petype == "type") return null;
		if (! pe.parent) return pe;
		pe = pe.parent;
	}
}

function get_type(pe)
{
	while (pe)
	{
		if (pe.petype == "type") return pe;
		pe = pe.parent;
	}
	return null;
}

function get_context(pe)
{
	while (true)
	{
		if (pe.petype == "function" || pe.petype == "method" || pe.petype == "type" || ! pe.parent) return pe;
		pe = pe.parent;
	}
}

// Return an alternative pe, which is a constant, if possible.
// Otherwise return null.
function asConstant(pe, state)
{
	if (pe.petype == "constant")
	{
		return pe;
	}
	else if (pe.petype == "array")
	{
		let value = [];
		for (let i=0; i<pe.elements.length; i++)
		{
			let sub = asConstant(pe.elements[i], state);
			if (sub === null) return null;
			value.push(sub.typedvalue);
		}
		return { "petype": "constant", "where": pe.where, "typedvalue": {"type": get_program(pe).types[module.typeid_array], "value": {"b": value}}, "step": constantstep, "sim": simfalse };
	}
	else if (pe.petype == "dictionary")
	{
		let value = {};
		for (let i=0; i<pe.keys.length; i++)
		{
			let sub = asConstant(pe.values[i], state);
			if (sub === null) return null;
			value['#' + pe.keys[i]] = sub.typedvalue;
		}
		return { "petype": "constant", "where": pe.where, "typedvalue": {"type": get_program(pe).types[module.typeid_dictionary], "value": {"b": value}}, "step": constantstep, "sim": simfalse };
	}
	else if (pe.petype.substring(0, 20) == "left-unary operator ")
	{
		let sub = asConstant(pe.argument, state);
		if (sub === null) return null;
		let symbol = pe.petype.substring(20);
		return { "petype": "constant", "where": pe.where, "typedvalue": left_unary_operator_impl[symbol].call(state, sub.typedvalue), "step": constantstep, "sim": simfalse };
	}
	else if (pe.petype.substring(0, 16) == "binary operator ")
	{
		let lhs = asConstant(pe.lhs, state);
		if (lhs === null) return null;
		let rhs = asConstant(pe.rhs, state);
		if (rhs === null) return null;
		let symbol = pe.petype.substring(16);
		return { "petype": "constant", "where": pe.where, "typedvalue": binary_operator_impl[symbol].call(state, lhs.typedvalue, rhs.typedvalue), "step": constantstep, "sim": simfalse };
	}
	else return null;
}

// Locate the parent of the program element to which a given name
// refers. Report an error if the name cannot be resolved.
// The actual program element is returnvalue.names[name].
function resolve_name(state, name, parent, errorname)
{
	// prepare a generic "not defined" error
	let error = "/name/ne-5";
	let arg = [errorname, name];
	let lookup = null;
	let pe = parent;
	while (pe)
	{
		// check name inside pe
		if (pe.hasOwnProperty("names") && pe.names.hasOwnProperty(name))
		{
			let n = pe.names[name];

			// check whether a variable or function is accessible
			if (n.petype == "variable" || n.petype == "function" || n.petype == "attribute" || n.petype == "method")
			{
				// find the context
				let context = get_context(pe);
				if (context.petype == "global scope")
				{
					// global scope is always okay
					module.assert(n.petype == "variable" || n.petype == "function");
				}
				else if (context.petype == "type")
				{
					// non-static members must live in the same class
					if (n.petype == "attribute" || n.petype == "method")
					{
						let cl = get_type(parent);
						if (cl != context) state.error("/name/ne-6", [errorname, name]);
					}
				}
				else
				{
					// local variables must live in the same function
					module.assert(n.petype == "variable" || n.petype == "function");
					if (n.petype == "variable")
					{
						let fn = get_function(parent);
						if (fn != context) state.error("/name/ne-7", [errorname, name]);
					}
				}
			}
			return pe;
		}

		// check the superclass chain
		if (pe.petype == "type")
		{
			let sup = pe.superclass;
			while (sup)
			{
				if (sup.names.hasOwnProperty(name))
				{
					if (sup.names[name].access == "private")
					{
						// prepare the error, don't raise it yet!
						error = "/name/ne-8";
						arg = [errorname, name, module.displayname(sup)];
					}
					else return sup;
				}
				sup = sup.superclass;
			}
		}

		// move upwards in the scope hierarchy
		if (! pe.hasOwnProperty("parent")) break;
		pe = pe.parent;
	}
	state.error(error, arg);
}

// Parse a name. This can be a simple identifier, or it can be
// super.name, or it can be a name inside a namespace of the form
// namespace1.namespace2. [...] .name . The function looks up the name.
// It returns the full name, the program element holding the entity as
// a name, and the result of the lookup.
// In addition, the function reports and error if the name refers to a
// non-static member for which "this" is not available.
function parse_name(state, parent, errorname, allow_namespace)
{
	if (allow_namespace === undefined) allow_namespace = false;

	let ref = parent;
	let token = module.get_token(state);

	// handle "super"
	if (token.type == "keyword" && token.value == "super")
	{
		// check for a super class
		let cls = get_type(parent);
		if (cls === null) state.error("/syntax/se-6");
		if (! cls.hasOwnProperty("superclass")) state.error("/syntax/se-7");
		ref = cls.superclass;

		// parser super.identifier
		token = module.get_token(state);
		if (token.type != "delimiter" || token.value != '.') state.error("/syntax/se-8");
		token = module.get_token(state);
		if (token.type != "identifier") state.error("/syntax/se-9");
	}
	else if (token.type != "identifier") state.error("/syntax/se-10", [errorname]);

	// look up the name
	let name = token.value;
	let pe = resolve_name(state, token.value, ref, errorname);
	let lookup = pe.names[token.value];

	// handle namespace names
	while (lookup.petype == "namespace")
	{
		token = module.get_token(state, true);
		if (token.type != "delimiter" || token.value != '.')
		{
			if (allow_namespace) break;
			else state.error("/name/ne-11");
		}
		module.get_token(state);
		token = module.get_token(state);
		if (token.type != "identifier") state.error("/syntax/se-11");

		if (! lookup.names.hasOwnProperty(token.value)) state.error("/name/ne-9", [token.value, name]);
		name += "." + token.value;
		pe = lookup;
		lookup = lookup.names[token.value];
	}

	// check whether "this" is available
	if (lookup.petype == "attribute" || lookup.petype == "method")
	{
		// check for the enclosing type
		let sub_cl = get_type(parent);
		let super_cl = get_type(lookup);
		module.assert(sub_cl && module.isDerivedFrom(sub_cl, super_cl.id));   // this used to raise se-12, however, that case should now be covered in resolve_name

		// check for an enclosing non-static method
		let fn = get_function(parent);
		if (fn.petype != "method") state.error("/syntax/se-13", [errorname, lookup.petype, name]);
	}

	return { "name": name, "pe": pe, "lookup": lookup };
}

// Parse the argument list of a function call.
// The expression to the left of the parenthesis is provided as #base.
function parse_call(state, parent, base)
{
	// parse the opening parenthesis, which is assumed to be already detected
	let where = state.get();
	let token = module.get_token(state);
	module.assert(token.value == '(', "[parse_call] internal error");

	// parse comma-separated list of possibly named expressions
	let args = [];
	token = module.get_token(state, true);
	if (token.type == "grouping" && token.value == ')') module.get_token(state);
	else
	{
		let forcenamed = false;
		while (true)
		{
			// check for named parameters
			let where = state.get();
			let named = false;
			let name = module.get_token(state);
			if (name.type == "identifier")
			{
				let token = module.get_token(state);
				if (token.type == "operator" && token.value == '=') named = true;
				else state.set(where);
			}
			else state.set(where);
			if (forcenamed && ! named) state.error("/syntax/se-14");
			if (named) forcenamed = true;

			// handle the actual argument
			let ex = parse_expression(state, parent);
			if (named)
			{
				let pe = {"petype": "named argument", "where": where, "parent": parent, "name": name.value, "argument": ex,
						"step": function()
								{
									let frame = this.stack[this.stack.length - 1];
									let pe = frame.pe[frame.pe.length - 1];
									let ip = frame.ip[frame.ip.length - 1];
									if (ip == 0)
									{
										frame.pe.push(pe.argument);
										frame.ip.push(-1);
										return false;
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
				args.push(pe);
			}
			else args.push(ex);

			// delimiter or end
			token = module.get_token(state);
			if (token.type == "grouping" && token.value == ')') break;
			else if (token.value != ',') state.error("/syntax/se-15");
		}
	}

	// check arguments at parse time if possible (which is the case most of the time)
	if (base.petype == "constant")
	{
		// check base type
		let f = null;
		if (module.isDerivedFrom(base.typedvalue.type, module.typeid_function)) f = base.typedvalue.value.b.func;
		else if (module.isDerivedFrom(base.typedvalue.type, module.typeid_type))
		{
			let cls = base.typedvalue.value.b;
			if (cls.class_constructor.access != "public")
			{
				// check whether the constructor is accessible from the current context
				let sub_cl = get_type(parent);
				let error = false;
				if (cls.class_constructor.access == "private")
				{
					if (sub_cl === null || sub_cl != cls.id) error = true;
				}
				else if (cls.class_constructor.access == "protected")
				{
					if (sub_cl === null || ! module.isDerivedFrom(sub_cl, cls.id)) error = true;
				}
				else error = true;
				if (error) state.error("/name/ne-25", [module.displayname(cls), cls.class_constructor.access]);
			}
			f = base.typedvalue.value.b.class_constructor;
		}
		else state.error("/syntax/se-16", [base.typedvalue.type]);

		let n = args.length;       // number of given arguments
		let m = f.params.length;   // number of required parameters
		let params = [];           // which parameters are provided?
		for (let i=0; i<m; i++) params.push(false);

		// handle positional and named arguments
		for (let i=0; i<n; i++)
		{
			if (args[i].petype == "named argument")
			{
				// parameter name lookup
				let name = args[i].name;
				let found = false;
				for (let j=0; j<m; j++)
				{
					if (f.params[j].hasOwnProperty("name") && f.params[j].name == name)
					{
						if (params[j]) state.error("/name/ne-1", [name, module.displayname(f)]);
						params[j] = true;
						found = true;
						break;
					}
				}
				if (! found) state.error("/name/ne-2", [name, module.displayname(f)]);
			}
			else
			{
				if (i < params.length) params[i] = args[i];
				else state.error("/name/ne-3", [module.displayname(f)]);
			}
		}

		// check whether all missing parameters are covered by default values
		for (let j=0; j<m; j++)
		{
			if (! params[j] && ! f.params[j].hasOwnProperty("defaultvalue")) state.error("/name/ne-4", [(j+1), module.displayname(f)]);
		}
	}

	// create the function call operator
	return { "petype": "function call", "where": where, "parent": parent, "base": base, "arguments": args, "step": callstep, "sim": callsim };
}

function parse_expression(state, parent, lhs)
{
	if (lhs === undefined) lhs = false;

	// stack of expressions and operators
	let stack = [];

	while (true)
	{
		// obtain the next token
		let where = state.get();
		let token = module.get_token(state);

		// left-unary operators, parse now but handle later
		while ((token.type == "operator" || token.type == "keyword") && left_unary_operator_impl.hasOwnProperty(token.value))
		{
			if (lhs) state.error("/syntax/se-21");
			stack.push({"operator": token.value, "unary": true, "precedence": left_unary_operator_precedence[token.value], "where": where});
			where = state.get();
			token = module.get_token(state);
		}

		// actual core expression
		let ex = { "parent": parent, "where": where };
		if (token.type == "grouping" && token.value == '(')
		{
			ex.petype = "group";
			ex.sub = parse_expression(state, parent);
			let token = module.get_token(state);
			if (token.type != "grouping" || token.value != ')') state.error("/syntax/se-22");
			ex.step = function()
					{
						let frame = this.stack[this.stack.length - 1];
						let ip = frame.ip[frame.ip.length - 1];
						let pe = frame.pe[frame.pe.length - 1];
						if (ip == 0)
						{
							frame.pe.push(pe.sub);
							frame.ip.push(-1);
							return false;
						}
						else
						{
							frame.pe.pop();
							frame.ip.pop();
							return false;
						}
					};
			ex.sim = simfalse;
		}
		else if (token.type == "keyword" && token.value == "null")
		{
			// constant
			ex.petype = "constant";
			ex.typedvalue = {"type": get_program(parent).types[module.typeid_null], "value": {"b": null}};
			ex.step = constantstep;
			ex.sim = simfalse;
		}
		else if (token.type == "keyword" && (token.value == "true" || token.value == "false"))
		{
			// constant
			ex.petype = "constant";
			ex.typedvalue = {"type": get_program(parent).types[module.typeid_boolean], "value": {"b": (token.value == "true")}};
			ex.step = constantstep;
			ex.sim = simfalse;
		}
		else if (token.type == "integer")
		{
			// constant
			let v = parseFloat(token.value);
			if (v > 2147483647) state.error("/syntax/se-23");
			v = v | 0;
			ex.petype = "constant";
			ex.typedvalue = {"type": get_program(parent).types[module.typeid_integer], "value": {"b": v}};
			ex.step = constantstep;
			ex.sim = simfalse;
		}
		else if (token.type == "real")
		{
			// constant
			let v = parseFloat(token.value);
			ex.petype = "constant";
			ex.typedvalue = {"type": get_program(parent).types[module.typeid_real], "value": {"b": v}};
			ex.step = constantstep;
			ex.sim = simfalse;
		}
		else if (token.type == "string")
		{
			// constant
			let v = token.value;
			while (true)
			{
				token = module.get_token(state, true);
				if (token.type != "string") break;
				token = module.get_token(state);
				v += token.value;
			}
			ex.petype = "constant";
			ex.typedvalue = {"type": get_program(parent).types[module.typeid_string], "value": {"b": v}};
			ex.step = constantstep;
			ex.sim = simfalse;
		}
		else if (token.value == '[')
		{
			// create an array
			ex.petype = "array";
			ex.elements = [];
			ex.step = function()
					{
						let frame = this.stack[this.stack.length - 1];
						let pe = frame.pe[frame.pe.length - 1];
						let ip = frame.ip[frame.ip.length - 1];
						if (ip < pe.elements.length)
						{
							// get element number ip
							frame.pe.push(pe.elements[ip]);
							frame.ip.push(-1);
							return false;
						}
						else
						{
							// compose all elements to an array
							let a = new Array(pe.elements.length);
							for (let i=0; i<pe.elements.length; i++)
							{
								a[pe.elements.length - 1 - i] = frame.temporaries.pop();
							}
							frame.temporaries.push({ "type": this.program.types[module.typeid_array], "value": {"b": a }});
							frame.pe.pop();
							frame.ip.pop();
							return true;
						}
					};
			ex.sim = function()
					{
						let frame = this.stack[this.stack.length - 1];
						let pe = frame.pe[frame.pe.length - 1];
						let ip = frame.ip[frame.ip.length - 1];
						return (ip >= pe.elements.length);
					};

			// parse the array elements
			let first = true;
			while (! state.eof())
			{
				let token = module.get_token(state, true);
				if (token.type == "grouping" && token.value == ']') { module.get_token(state); break; }
				if (first) first = false;
				else
				{
					if (token.type != "delimiter" || token.value != ',') state.error("/syntax/se-24");
					module.get_token(state);
					token = module.get_token(state, true);
					if (token.type == "grouping" && token.value == ']') { module.get_token(state); break; }
				}
				ex.elements.push(parse_expression(state, parent));
			}
			if (state.eof()) state.error("/syntax/se-25");

			// turn into a constant if possible
			let c = asConstant(ex, state);
			if (c !== null) ex = c;
		}
		else if (token.value == '{')
		{
			// create a dictionary
			ex.petype = "dictionary";
			ex.keys = [];
			ex.values = [];
			ex.step = function()
					{
						let frame = this.stack[this.stack.length - 1];
						let pe = frame.pe[frame.pe.length - 1];
						let ip = frame.ip[frame.ip.length - 1];
						let n = pe.keys.length;
						if (ip < n)
						{
							// get a value
							frame.pe.push(pe.values[ip]);
							frame.ip.push(-1);
							return false;
						}
						else
						{
							// compose all elements to a dictionary
							let d = { };
							for (let i=0; i<n; i++)
							{
								let k = pe.keys[i];
								let v = frame.temporaries[frame.temporaries.length-n+i];
								module.assert(! d.hasOwnProperty('#' + k), "internal error; duplicate key in dictionary");
								d['#' + k] = v;
							}
							frame.temporaries = frame.temporaries.slice(0, frame.temporaries.length - n);
							frame.temporaries.push({"type": this.program.types[module.typeid_dictionary], "value": {"b": d}});
							frame.pe.pop();
							frame.ip.pop();
							return true;
						}
					};
			ex.sim = function()
					{
						let frame = this.stack[this.stack.length - 1];
						let pe = frame.pe[frame.pe.length - 1];
						let ip = frame.ip[frame.ip.length - 1];
						let n = pe.keys.length;
						return (ip >= n);
					};

			// parse the dictionary elements
			let first = true;
			let keys = {};
			while (! state.eof())
			{
				let token = module.get_token(state, true);
				if (token.type == "grouping" && token.value == '}') { module.get_token(state); break; }
				if (first) first = false;
				else
				{
					if (token.type == "delimiter" && token.value != ',') state.error("/syntax/se-27");
					module.get_token(state);
					token = module.get_token(state, true);
					if (token.type == "grouping" && token.value == '}') { module.get_token(state); break; }
				}
				token = module.get_token(state);
				if (token.type != "string" && token.type != "identifier") state.error("/syntax/se-28");
				if (keys.hasOwnProperty('#' + token.value)) state.error("/syntax/se-26", [token.value]);
				keys['#' + token.value] = true;
				ex.keys.push(token.value);
				token = module.get_token(state);
				if (token.type != "operator" || token.value != ':') state.error("/syntax/se-29");
				ex.values.push(parse_expression(state, parent));
			}
			if (state.eof()) state.error("/syntax/se-30");

			// turn into a constant if possible
			let c = asConstant(ex, state);
			if (c !== null) ex = c;
		}
		else if (token.type == "identifier" || (token.type == "keyword" && token.value == "super"))
		{
			state.set(where);
			let result = parse_name(state, parent, "expression");
			let name = result.name;
			let lookup = result.lookup;

			// create the "name" object
			ex.petype = "name";
			ex.name = name;
			ex.reference = lookup;
			if (lookup.petype == "variable" || lookup.petype == "attribute")
			{
				ex.scope = lookup.scope;
				ex.id = lookup.id;
				ex.step = function()
						{
							let frame = this.stack[this.stack.length - 1];
							let pe = frame.pe[frame.pe.length - 1];
							let ip = frame.ip[frame.ip.length - 1];
							if (pe.scope == "global")
								frame.temporaries.push(this.stack[0].variables[pe.id]);
							else if (pe.scope == "local")
								frame.temporaries.push(frame.variables[pe.id]);
							else if (pe.scope == "object")
								frame.temporaries.push(frame.object.value.a[pe.id]);
							else module.assert(false, "unknown scope: " + pe.scope);
							frame.pe.pop();
							frame.ip.pop();
							return false;
						};
				ex.sim = simfalse;
			}
			else if (lookup.petype == "function")
			{
				ex.petype = "constant";
				ex.typedvalue = {"type": get_program(parent).types[module.typeid_function], "value": {"b": {"func": lookup}}};
				ex.step = constantstep;
				ex.sim = simfalse;
			}
			else if (lookup.petype == "method")
			{
				ex.scope = lookup.scope;
				ex.id = lookup.id;
				ex.step = function()
						{
							let frame = this.stack[this.stack.length - 1];
							let pe = frame.pe[frame.pe.length - 1];
							let ip = frame.ip[frame.ip.length - 1];
							let result = {
									"type": this.program.types[module.typeid_function],
									"value": {"b": {"func": pe.reference, "object": frame.object}}
								};
							frame.temporaries.push(result);
							frame.pe.pop();
							frame.ip.pop();
							return false;
						};
				ex.sim = simfalse;
			}
			else if (lookup.petype == "type")
			{
				ex.petype = "constant";
				ex.typedvalue = {"type": get_program(parent).types[module.typeid_type], "value": {"b": lookup}};
				ex.step = constantstep;
				ex.sim = simfalse;
			}
			else module.assert(false, "If this assertion fails then error ne-10 must be re-activated.");
		}
		else if (token.type == "keyword" && token.value == "this")
		{
			// check for a method or an anonymous function
			let fn = get_function(parent);
			if (fn.petype == "method")
			{
				let cls = fn.parent;
				module.assert(cls.petype == "type", "cannot find class around this");

				// create the "this" object
				ex.petype = "this";
				ex.step = function()
						{
							let frame = this.stack[this.stack.length - 1];
							frame.temporaries.push(frame.object);
							frame.pe.pop();
							frame.ip.pop();
							return false;
						};
				ex.sim = simfalse;
			}
			else if (fn.petype == "function" && ! fn.hasOwnProperty("name") && fn.displayname == "(anonymous)")
			{
				// create the "this" object
				ex.petype = "this";
				ex.step = function()
						{
							let frame = this.stack[this.stack.length - 1];
							let f = {"type": this.program.types[module.typeid_function], "value": {"b": {"func": fn}}};
							if (frame.enclosed) f.value.b.enclosed = frame.enclosed;
							frame.temporaries.push(f);
							frame.pe.pop();
							frame.ip.pop();
							return false;
						};
				ex.sim = simfalse;
			}
			else state.error("/syntax/se-47");
		}
		else if (token.type == "keyword" && token.value == "function")
		{
			// create the anonymous function
			let func = {"petype": "function", "parent": parent, "where": where, "displayname": "(anonymous)", "commands": [], "variables": [], "names": {}, "closureparams": [], "params": [], "step": scopestep, "sim": simfalse};

			// parse the closure parameters
			token = module.get_token(state);
			if (token.type == "grouping" && token.value == '[')
			{
				while (true)
				{
					// parse ] or ,
					let where = state.get();
					let token = module.get_token(state);
					if (token.type == "grouping" && token.value == ']') break;
					if (func.closureparams.length != 0)
					{
						if (token.type != "delimiter" || token.value != ',') state.error("/syntax/se-31");
						where = state.get();
						token = module.get_token(state);
					}

					// parse the parameter name
					if (token.type != "identifier") state.error("/syntax/se-32");
					let name = token.value; 
					if (func.names.hasOwnProperty(name)) state.error("/name/ne-17", [name]);
					let id = func.variables.length;
					let variable = { "petype": "variable", "where": where, "parent": ex, "name": name, "id": id, "scope": "local" };

					// parse the initializer
					token = module.get_token(state, true);
					if (token.type == "operator" && token.value == '=')
					{
						// explicit initializer, consume the "=" token
						module.get_token(state);
					}
					else
					{
						if (token.type == "delimiter" && token.value == ",") { }
						else if (token.type == "grouping" && token.value == "]") { }
						else state.error("/syntax/se-31");

						// parse the identifier again, but this time as its own initializer
						state.set(where);
					}
					let initializer = parse_expression(state, parent);

					// register the closure parameter
					let param = { "name": name, "initializer": initializer };
					func.names[name] = variable;
					func.variables[id] = variable;
					func.closureparams.push(param);
				}

				// prepare the opening parenthesis
				token = module.get_token(state);
			}
			else if (token.type != "grouping" || token.value != '(') state.error("/syntax/se-35");

			// parse the parameters
			if (token.type != "grouping" || token.value != '(') state.error("/syntax/se-36", ["anonymous function"]);
			while (true)
			{
				// parse ) or ,
				let token = module.get_token(state, true);
				if (token.type == "grouping" && token.value == ')')
				{
					module.get_token(state);
					break;
				}
				if (func.params.length != 0)
				{
					if (token.type != "delimiter" || token.value != ',') state.error("/syntax/se-37");
					module.get_token(state);
				}

				// parse the parameter name
				let where = state.get();
				token = module.get_token(state);
				if (token.type != "identifier") state.error("/syntax/se-33");
				let name = token.value; 
				let id = func.variables.length;
				let variable = { "petype": "variable", "where": where, "parent": func, "name": name, "id": id, "scope": "local" };
				let param = { "name": name };

				// check for a default value
				token = module.get_token(state, true);
				if (token.type == "operator" && token.value == '=')
				{
					module.get_token(state);
					let defaultvalue = parse_expression(state, parent);
					if (defaultvalue.petype != "constant") state.error("/syntax/se-38");
					param.defaultvalue = defaultvalue.typedvalue;
				}

				// register the parameter
				if (func.names.hasOwnProperty(name)) state.error("/name/ne-16", [name]);
				func.names[name] = variable;
				func.variables[id] = variable;
				func.params.push(param);
			}

			// parse the function body
			token = module.get_token(state);
			if (token.type != "grouping" || token.value != '{') state.error("/syntax/se-40", ["anonymous function"]);
			state.indent.push(-1 - token.line);
			while (true)
			{
				token = module.get_token(state, true);
				if (token.type == "grouping" && token.value == '}')
				{
					state.indent.pop();
					if (module.options.checkstyle && ! state.builtin())
					{
						let indent = state.indentation();
						let topmost = state.indent[state.indent.length - 1];
						if (topmost >= 0 && topmost != indent) state.error("/style/ste-2");
					}
					module.get_token(state);
					break;
				}
				let cmd = parse_statement_or_declaration(state, func);
				func.commands.push(cmd);
			}

			// create the actual closure expression, which evaluates the closure parameters
			ex.petype = "closure";
			ex.func = func;
			ex.step = function()
					{
						let frame = this.stack[this.stack.length - 1];
						let pe = frame.pe[frame.pe.length - 1];
						let ip = frame.ip[frame.ip.length - 1];
						let n = pe.func.closureparams.length;
						if (ip < n)
						{
							// evaluate the closure parameters
							frame.pe.push(pe.func.closureparams[ip].initializer);
							frame.ip.push(-1);
							return false;
						}
						else
						{
							// create and return the closure function object
							let enc = frame.temporaries.slice(frame.temporaries.length - n);
							frame.temporaries.splice(frame.temporaries.length - n, n);
							frame.temporaries.push({"type": this.program.types[module.typeid_function], "value": {"b": {"func": pe.func, "enclosed": enc}}});
							frame.pe.pop();
							frame.ip.pop();
							return false;
						}
					};
			ex.sim = simfalse;
		}
		else if (token.type == "keyword") state.error("/syntax/se-41", [token.value]);
		else state.error("/syntax/se-42", [token.value]);

		// right-unary operators: dot, access, and call
		while (! state.eof())
		{
			let where = state.get();
			token = module.get_token(state, true);
			if (token.type == "delimiter" && token.value == '.')
			{
				// public member access operator
				module.get_token(state);
				let token = module.get_token(state);
				if (token.type != "identifier") state.error("/syntax/se-43");
				let op = { "petype": "access of member " + token.value, "where": where, "parent": parent, "object": ex, "member": token.value,
						"step": function()
								{
									let frame = this.stack[this.stack.length - 1];
									let pe = frame.pe[frame.pe.length - 1];
									let ip = frame.ip[frame.ip.length - 1];
									if (ip == 0)
									{
										// evaluate the object
										frame.pe.push(pe.object);
										frame.ip.push(-1);
										return false;
									}
									else
									{
										// the actual access
										let object = frame.temporaries.pop();

										// find the public member in the super class chain
										let m = null;
										if (module.isDerivedFrom(object.type, module.typeid_type))
										{
											// static case
											let type = object.value.b;
											let sup = type;
											while (sup)
											{
												if (sup.staticmembers.hasOwnProperty(pe.member) && sup.staticmembers[pe.member].access == "public")
												{
													m = sup.staticmembers[pe.member];
													break;
												}
												sup = sup.superclass;
											}
											if (m === null) this.error("/name/ne-12", [module.displayname(type), pe.member]);
										}
										else
										{
											// non-static case
											let type = object.type;
											let sup = type;
											while (sup)
											{
												if (sup.members.hasOwnProperty(pe.member) && sup.members[pe.member].access == "public")
												{
													m = sup.members[pe.member];
													break;
												}
												else if (sup.staticmembers.hasOwnProperty(pe.member) && sup.staticmembers[pe.member].access == "public")
												{
													m = sup.staticmembers[pe.member];
													break;
												}
												sup = sup.superclass;
											}
											if (m === null) this.error("/name/ne-13", [module.displayname(type), pe.member]);
										}

										// return the appropriate access object
										if (m.petype == "method")
										{
											// non-static method
											frame.temporaries.push({"type": this.program.types[module.typeid_function], "value": {"b": {"func": m, "object": object}}});
										}
										else if (m.petype == "attribute")
										{
											// non-static attribute
											frame.temporaries.push(object.value.a[m.id]);
										}
										else if (m.petype == "function")
										{
											// static function
											frame.temporaries.push({"type": this.program.types[module.typeid_function], "value": {"b": {"func": m}}});
										}
										else if (m.petype == "variable")
										{
											// static variable
											frame.temporaries.push(this.stack[0].variables[m.id]);
										}
										else module.assert(false, "[member access] internal error; unknown member type " + m.petype);
										frame.pe.pop();
										frame.ip.pop();
										return true;
									}
								},
						"sim": function()
								{
									let frame = this.stack[this.stack.length - 1];
									let ip = frame.ip[frame.ip.length - 1];
									return (ip != 0);
								},
					};
				ex.parent = op;
				ex = op;
			}
			else if (token.type == "grouping" && token.value == '(')
			{
				let op = parse_call(state, parent, ex);
				ex.parent = op;
				ex = op;
			}
			else if (token.type == "grouping" && token.value == '[')
			{
				// parse a single argument, no argument list
				module.get_token(state);
				let arg = parse_expression(state, parent);
				let token = module.get_token(state);
				if (token.type != "grouping" || token.value != ']') state.error("/syntax/se-44");
				let op = { "petype": "item access", "where": where, "parent": parent, "base": ex, "argument": arg,
						"step": function()
								{
									let frame = this.stack[this.stack.length - 1];
									let pe = frame.pe[frame.pe.length - 1];
									let ip = frame.ip[frame.ip.length - 1];
									if (ip == 0)
									{
										// evaluate base
										frame.pe.push(pe.base);
										frame.ip.push(-1);
										return false;
									}
									else if (ip == 1)
									{
										// evaluate the argument
										frame.pe.push(pe.argument);
										frame.ip.push(-1);
										return false;
									}
									else if (ip == 2)
									{
										// the actual access
										let index = frame.temporaries.pop();
										let container = frame.temporaries.pop();
										if (module.isDerivedFrom(container.type, module.typeid_string))
										{
											if (module.isDerivedFrom(index.type, module.typeid_integer))
											{
												if (index.value.b < 0) this.error("/argument-mismatch/am-21", [module.toString.call(this, index)]);
												else if (index.value.b >= container.value.b.length) this.error("/argument-mismatch/am-22", [module.toString.call(this, index), container.value.b.length]);
												let code = container.value.b.charCodeAt(index.value.b);
												let ret = {"type": this.program.types[module.typeid_integer], "value": {"b": code}};
												frame.temporaries.push(ret);
											}
											else if (module.isDerivedFrom(index.type, module.typeid_range))
											{
												let a = index.value.b.begin;
												let b = index.value.b.end;
												if (a < 0) a = 0;
												if (b > container.value.b.length) b = container.value.b.length;
												let str = container.value.b.substring(a, b);
												let ret = {"type": this.program.types[module.typeid_string], "value": {"b": str}};
												frame.temporaries.push(ret);
											}
											else this.error("/argument-mismatch/am-20", [module.toString.call(this, index), module.displayname(index.type)]);
										}
										else if (module.isDerivedFrom(container.type, module.typeid_array))
										{
											if (module.isDerivedFrom(index.type, module.typeid_integer))
											{
												if (index.value.b < 0) this.error("/argument-mismatch/am-23", [module.toString.call(this, index)]);
												else if (index.value.b >= container.value.b.length) this.error("/argument-mismatch/am-24", [module.toString.call(this, index), container.value.b.length]);
												else frame.temporaries.push(container.value.b[index.value.b]);
											}
											else if (module.isDerivedFrom(index.type, module.typeid_range))
											{
												let a = index.value.b.begin;
												let b = index.value.b.end;
												if (a < 0) a = 0;
												if (b > container.value.b.length) b = container.value.b.length;
												let arr = [];
												for (let i=a; i<b; i++) arr.push(container.value.b[i]);
												let ret = {"type": this.program.types[module.typeid_array], "value": {"b": arr}};
												frame.temporaries.push(ret);
											}
											else this.error("/argument-mismatch/am-26", [module.toString.call(this, index), module.displayname(index.type)]);
										}
										else if (module.isDerivedFrom(container.type, module.typeid_dictionary))
										{
											if (module.isDerivedFrom(index.type, module.typeid_string))
											{
												if (container.value.b.hasOwnProperty('#' + index.value.b)) frame.temporaries.push(container.value.b['#' + index.value.b]);
												else this.error("/argument-mismatch/am-27", [index.value.b]);
											}
											else this.error("/argument-mismatch/am-28", [module.displayname(index.type)]);
										}
										else if (module.isDerivedFrom(container.type, module.typeid_range))
										{
											if (module.isDerivedFrom(index.type, module.typeid_integer))
											{
												let len = Math.max(0, container.value.b.end - container.value.b.begin);
												if (index.value.b < 0 || index.value.b >= len) this.error("/argument-mismatch/am-29", [module.toString.call(this, index), len]);
												let ret = {"type": this.program.types[module.typeid_integer], "value": {"b": container.value.b.begin + index.value.b}};
												frame.temporaries.push(ret);
											}
											else if (module.isDerivedFrom(index.type, module.typeid_range))
											{
												let len = Math.max(0, container.value.b.end - container.value.b.begin);
												let a = index.value.b.begin;
												let b = index.value.b.end;
												if (a < 0) a = 0;
												if (b > len) b = len;
												let ret = {"type": this.program.types[module.typeid_range], "value": {"b": {"begin": container.value.b.begin + a, "end": container.value.b.begin + b}}};
												frame.temporaries.push(ret);
											}
											else this.error("/argument-mismatch/am-30", [module.toString.call(this, index), module.displayname(index.type)]);
										}
										else this.error("/argument-mismatch/am-31", [module.displayname(container.type)]);
										return true;
									}
									else
									{
										frame.pe.pop();
										frame.ip.pop();
										return false;
									}
								},
						"sim": function()
								{
									let frame = this.stack[this.stack.length - 1];
									let ip = frame.ip[frame.ip.length - 1];
									return (ip == 2);
								},
					};
				ex.parent = op;
				ex = op;
			}
			else break;
		}

		// push onto the stack
		stack.push(ex);

		// check for a binary operator
		token = module.get_token(state, true);
		if ((token.type == "operator" || token.type == "keyword") && binary_operator_impl.hasOwnProperty(token.value))
		{
			if (lhs) state.error("/syntax/se-21");
			stack.push({"operator": token.value, "unary": false, "precedence": binary_operator_precedence[token.value], "where": where});
			module.get_token(state);
		}
		else break;
	}

	// process the unary operator at position j
	let processUnary = function(j)
			{
				// apply left-unary operator to encapsulate an expression
				module.assert(j >= 0 && j < stack.length, "[processUnary] index out of range");
				module.assert(stack[j].hasOwnProperty("precedence") && stack[j].unary, "[processUnary] unary operator expected");
				module.assert(left_unary_operator_impl.hasOwnProperty(stack[j].operator), "[processUnary] cannot find left-unary operator " + stack[j].operator);
				module.assert(stack.length > j+1, "[processUnary] corrupted stack");
				module.assert(! stack[j+1].hasOwnProperty("precedence"), "[processUnary] corrupted stack");
				let ex = { "petype": "left-unary operator " + stack[j].operator, "where": stack[j].where, "parent": parent, "operator": stack[j].operator, "argument": stack[j+1],
						"step": function()
								{
									let frame = this.stack[this.stack.length - 1];
									let pe = frame.pe[frame.pe.length - 1];
									let ip = frame.ip[frame.ip.length - 1];
									if (ip == 0)
									{
										frame.pe.push(pe.argument);
										frame.ip.push(-1);
										return false;
									}
									else
									{
										// execute the actual operator logic
										let arg = frame.temporaries.pop();
										frame.temporaries.push(left_unary_operator_impl[pe.operator].call(this, arg));

										frame.pe.pop();
										frame.ip.pop();
										return true;
									}
								},
						"sim": function()
								{
									let frame = this.stack[this.stack.length - 1];
									let ip = frame.ip[frame.ip.length - 1];
									return (ip != 0);
								},
					};

				// turn into a constant if possible
				let c = asConstant(ex, state);
				if (c !== null) ex = c;

				// update the stack
				stack[j+1].parent = ex;
				stack.splice(j, 2, ex);
			};

	// process the binary operator at position j
	let processBinary = function(j)
			{
				// apply the operator to merge two expression
				module.assert(j >= 0 && j < stack.length, "[processBinary] index out of range");
				module.assert(stack[j].hasOwnProperty("precedence") && ! stack[j].unary, "[processBinary] binary operator expected");
				module.assert(binary_operator_impl.hasOwnProperty(stack[j].operator), "[processBinary] cannot find binary operator " + stack[j].operator);
				module.assert(j > 0 && stack.length > j+1, "[processBinary] corrupted stack");
				module.assert(! stack[j-1].hasOwnProperty("precedence"), "[processBinary] corrupted stack");
				module.assert(! stack[j+1].hasOwnProperty("precedence"), "[processBinary] corrupted stack");
				let ex = { "petype": "binary operator " + stack[j].operator, "where": stack[j].where, "parent": parent, "operator": stack[j].operator, "lhs": stack[j-1], "rhs": stack[j+1] };
				ex.step = function()
						{
							let frame = this.stack[this.stack.length - 1];
							let pe = frame.pe[frame.pe.length - 1];
							let ip = frame.ip[frame.ip.length - 1];
							if (ip == 0)
							{
								frame.pe.push(pe.lhs);
								frame.ip.push(-1);
								return false;
							}
							else if (ip == 1)
							{
								frame.pe.push(pe.rhs);
								frame.ip.push(-1);
								return false;
							}
							else
							{
								// execute the actual operator logic
								let rhs = frame.temporaries.pop();
								let lhs = frame.temporaries.pop();
								let result = binary_operator_impl[pe.operator].call(this, lhs, rhs);
								frame.temporaries.push(result);

								frame.pe.pop();
								frame.ip.pop();
								return true;
							}
						};
				ex.sim = function()
						{
							let frame = this.stack[this.stack.length - 1];
							let ip = frame.ip[frame.ip.length - 1];
							return (ip > 1);
						};

				// turn into a constant if possible
				let c = asConstant(ex, state);
				if (c !== null) ex = c;

				// update the stack
				stack[j-1].parent = ex;
				stack[j+1].parent = ex;
				stack.splice(j-1, 3, ex);
			};

	// reduce the stack at position #pos into an expression binding
	// with strength of at least #precedence
	let reduce = function(pos, precedence)
	{
		module.assert(pos < stack.length, "[reduce] invalid position");

		// handle leading unary operators
		if (stack[pos].hasOwnProperty("precedence"))
		{
			// the sequence starts with a unary operator
			module.assert(stack[pos].unary, "[reduce] unary operator expected");
			reduce(pos + 1, stack[pos].precedence);
			module.assert(! stack[pos+1].hasOwnProperty("precedence"), "[reduce] corrupted stack");
			processUnary(pos);
			module.assert(! stack[pos].hasOwnProperty("precedence"), "[reduce] corrupted stack");
		}

		// stop the recursion
		if (precedence <= 0) return;

		// handle binary operators and recurse
		while (true)
		{
			// recurse to handle stronger bindings
			reduce(pos, precedence - 1);

			// check for a binary operator
			if (pos+1 >= stack.length) break;
			module.assert(stack[pos+1].hasOwnProperty("precedence") && ! stack[pos+1].unary && stack[pos+1].precedence >= precedence, "[reduce] operator mismatch");
			if (stack[pos+1].precedence > precedence) break;

			// recurse to handle stronger bindings on the RHS
			module.assert(pos+2 < stack.length, "[reduce] invalid RHS position");
			reduce(pos+2, precedence - 1);

			// apply the binary operator
			processBinary(pos+1);
			module.assert(! stack[pos].hasOwnProperty("precedence"), "[reduce] corrupted stack");
		}
	}

	// reduce the whole stack
	reduce(0, 10);
	module.assert(stack.length == 1, "[parse_expression] stack was not reduced");

	if (lhs)
	{
		if (stack[0].petype == "group") state.error("/argument-mismatch/am-32", ["expression in parentheses"]);
		if (stack[0].petype == "constant") state.error("/argument-mismatch/am-32", ["a constant"]);
		if (stack[0].petype == "function") state.error("/argument-mismatch/am-32", ["a function"]);
		if (stack[0].petype == "function call") state.error("/argument-mismatch/am-32", ["the result of a function call"]);
	}

	// return the resulting expression
	return stack[0];
}

function parse_lhs(state, parent)
{
	// parse the LHS as an expression
	let ex = parse_expression(state, parent, true);

	// replace the topmost step function
	if (ex.petype == "name")
	{
		if (ex.reference.petype != "variable" && ex.reference.petype != "attribute") state.error("/argument-mismatch/am-32", ["name of type '" + ex.reference.petype + "'"]);
		ex.step = function()
				{
					let frame = this.stack[this.stack.length - 1];
					let pe = frame.pe[frame.pe.length - 1];
					let ip = frame.ip[frame.ip.length - 1];

					let op = frame.temporaries.pop();
					let rhs = frame.temporaries.pop();
					let base = null;
					if (pe.scope == "global") base = this.stack[0].variables;
					else if (pe.scope == "local") base = frame.variables;
					else if (pe.scope == "object") base = frame.object.value.a;
					else module.assert(false, "unknown scope type " + pe.scope);
					let index = pe.id;

					if (op != '=')
					{
						// binary operator corresponding to compound assignment
						let binop = op.substring(0, op.length - 1);
						rhs = binary_operator_impl[binop].call(this, base[index], rhs);
					}

					// actual assignment as a copy of the typed value
					base[index] = { "type": rhs.type, "value": rhs.value };

					frame.pe.pop();
					frame.ip.pop();
					return true;
				};
		ex.sim = simtrue;
	}
	else if (ex.petype == "item access")
	{
		ex.step = function()
				{
					let frame = this.stack[this.stack.length - 1];
					let pe = frame.pe[frame.pe.length - 1];
					let ip = frame.ip[frame.ip.length - 1];

					if (ip == 0)
					{
						// evaluate the container
						frame.pe.push(pe.base);
						frame.ip.push(-1);
						return false;
					}
					else if (ip == 1)
					{
						// evaluate the index
						frame.pe.push(pe.argument);
						frame.ip.push(-1);
						return false;
					}
					else
					{
						// obtain all relevant values
						let index = frame.temporaries.pop();
						let container = frame.temporaries.pop();
						let op = frame.temporaries.pop();
						let rhs = frame.temporaries.pop();

						// check validity
						let key;
						if (module.isDerivedFrom(container.type, module.typeid_string))
						{
							this.error("/argument-mismatch/am-32", ["a substring"]);
						}
						else if (module.isDerivedFrom(container.type, module.typeid_array))
						{
							if (module.isDerivedFrom(index.type, module.typeid_integer))
							{
								if (index.value.b < 0) this.error("/argument-mismatch/am-23", [module.toString.call(this, index)]);
								else if (index.value.b >= container.value.b.length) this.error("/argument-mismatch/am-24", [module.toString.call(this, index), container.value.b.length]);
								key = index.value.b;
							}
							else this.error("/argument-mismatch/am-25", [module.toString.call(this, index), module.displayname(index.type)]);
						}
						else if (module.isDerivedFrom(container.type, module.typeid_dictionary))
						{
							if (! module.isDerivedFrom(index.type, module.typeid_string)) this.error("/argument-mismatch/am-28", [module.displayname(index.type)]);
							key = '#' + index.value.b;
						}
						else this.error("/argument-mismatch/am-31b", [container.type]);

						if (op != '=')
						{
							// binary operator corresponding to compound assignment
							let binop = op.substring(0, op.length - 1);
							rhs = binary_operator_impl[binop].call(this, container.value.b[key], rhs);
						}

						// actual assignment as a deep copy of the typed value
						container.value.b[key] = { "type": rhs.type, "value": rhs.value };

						frame.pe.pop();
						frame.ip.pop();
						return true;
					}
				};
		ex.sim = function()
				{
					let frame = this.stack[this.stack.length - 1];
					let ip = frame.ip[frame.ip.length - 1];
					return (ip > 1);
				};
	}
	else if (ex.petype.substring(0, 17) == "access of member ")
	{
		ex.step = function()
				{
					let frame = this.stack[this.stack.length - 1];
					let pe = frame.pe[frame.pe.length - 1];
					let ip = frame.ip[frame.ip.length - 1];
					if (ip == 0)
					{
						// evaluate the object
						frame.pe.push(pe.object);
						frame.ip.push(-1);
						return false;
					}
					else
					{
						// obtain all relevant values
						let object = frame.temporaries.pop();
						let op = frame.temporaries.pop();
						let rhs = frame.temporaries.pop();

						// find the public member in the super class chain
						let m = null;
						if (module.isDerivedFrom(object.type, module.typeid_type))
						{
							// static case
							let type = object.value.b;
							let sup = type;
							while (sup)
							{
								if (sup.staticmembers.hasOwnProperty(pe.member) && sup.staticmembers[pe.member].access == "public")
								{
									m = sup.staticmembers[pe.member];
									break;
								}
								sup = sup.superclass;
							}
							if (m === null) this.error("/name/ne-12", [module.displayname(type), pe.member]);
						}
						else
						{
							// non-static case
							let type = object.type;
							let sup = type;
							while (sup)
							{
								if (sup.members.hasOwnProperty(pe.member) && sup.members[pe.member].access == "public")
								{
									m = sup.members[pe.member];
									break;
								}
								else if (sup.staticmembers.hasOwnProperty(pe.member) && sup.staticmembers[pe.member].access == "public")
								{
									m = sup.staticmembers[pe.member];
									break;
								}
								sup = sup.superclass;
							}
							if (m === null) this.error("/name/ne-13", [module.displayname(type), pe.member]);
						}

						// obtain container and index
						let container = null;
						let index = null;
						if (m.petype == "method")
						{
							// non-static method
							this.error("/argument-mismatch/am-32", ["a method"]);
						}
						else if (m.petype == "attribute")
						{
							// non-static attribute
							container = object.value.a;
							index = m.id;
						}
						else if (m.petype == "function")
						{
							// static function
							this.error("/argument-mismatch/am-32", ["a static method"]);
						}
						else if (m.petype == "variable")
						{
							// static variable
							container = this.stack[0].variables;
							index = m.id;
						}
						else module.assert(false, "[member access] internal error; unknown member type " + m.petype);

						if (op != '=')
						{
							// binary operator corresponding to compound assignment
							let binop = op.substring(0, op.length - 1);
							rhs = binary_operator_impl[binop].call(this, container[index], rhs);
						}

						// actual assignment as a deep copy of the typed value
						container[index] = { "type": rhs.type, "value": rhs.value };

						frame.pe.pop();
						frame.ip.pop();
						return true;
					}
				};
		ex.sim = function()
				{
					let frame = this.stack[this.stack.length - 1];
					let ip = frame.ip[frame.ip.length - 1];
					return (ip != 0);
				};
	}
	else state.error("/argument-mismatch/am-32", [ex.petype]);

	return ex;
}

function parse_assignment_or_expression(state, parent)
{
	// try to parse an expression
	let where = state.get();
	let ex = parse_expression(state, parent);
	let token = module.get_token(state);
	if (token.type == "operator" && assignments.hasOwnProperty(token.value))
	{
		// retry as an assignment
		state.set(where);
		let lhs = parse_lhs(state, parent);
		where = state.get();
		let op = module.get_token(state);
		let rhs = parse_expression(state, parent);
		token = module.get_token(state);
		if (token.type != "delimiter" || token.value != ';') state.error("/syntax/se-48");

		return { "petype": "assignment " + op.value, "where": where, "parent": parent, "operator": op.value, "lhs": lhs, "rhs": rhs,
				"step": function()
						{
							let frame = this.stack[this.stack.length - 1];
							let pe = frame.pe[frame.pe.length - 1];
							let ip = frame.ip[frame.ip.length - 1];
							if (ip == 0)
							{
								// evaluate the rhs
								frame.pe.push(pe.rhs);
								frame.ip.push(-1);
								return false;
							}
							else if (ip == 1)
							{
								// push the operator
								frame.temporaries.push(pe.operator);

								// assign to the lhs
								frame.pe.push(pe.lhs);
								frame.ip.push(-1);
								return false;
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
	}
	else if (token.type == "delimiter" && token.value == ';')
	{
		return { "petype": "expression", "where": where, "parent": parent, "sub": ex,
				"step": function()
						{
							let frame = this.stack[this.stack.length - 1];
							let pe = frame.pe[frame.pe.length - 1];
							let ip = frame.ip[frame.ip.length - 1];
							if (ip == 0)
							{
								// run the expression as a statement
								frame.pe.push(pe.sub);
								frame.ip.push(-1);
								return false;
							}
							else
							{
								// ignore the return value
								frame.temporaries.pop();

								frame.pe.pop();
								frame.ip.pop();
								return false;
							}
						},
				"sim": simfalse,
			};
	}
	else
	{
		state.error("/syntax/se-49");
	}
}

// Parse a "var" statement. Even for multiple variables it is treated as
// a single statement. The variables are placed into the container,
// which defaults to the enclosing function or global scope.
function parse_var(state, parent, container)
{
	container = (container !== undefined) ? container : get_function(parent);

	// handle "var" keyword
	let where = state.get();
	let token = module.get_token(state);
	module.assert(token.type == "keyword" && token.value == "var", "[parse_var] internal error");

	// prepare "group of variable declarations" object
	let ret = { "petype": "variable declaration", "where": where, "parent": parent, "vars": [],
			"step": function()
					{
						let frame = this.stack[this.stack.length - 1];
						let pe = frame.pe[frame.pe.length - 1];
						let ip = frame.ip[frame.ip.length - 1];
						if (ip < pe.vars.length)
						{
							// push the var onto the stack
							frame.pe.push(pe.vars[ip]);
							frame.ip.push(-1);
							return false;
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

	// parse individual variables
	while (true)
	{
		// obtain variable name
		let where = state.get();
		token = module.get_token(state);
		if (token.type != "identifier") state.error("/syntax/se-50");
		if (parent.names.hasOwnProperty(token.value)) state.error("/name/ne-14", [token.value]);

		// check variable name
		if (module.options.checkstyle && ! state.builtin() && token.value[0] >= 'A' && token.value[0] <= 'Z')
		{
			state.error("/style/ste-3", ["variable", token.value]);
		}

		// create the variable
		let id = (container.petype == "type") ? container.objectsize : container.variables.length;
		let pe = { "petype": "variable", "where": where, "parent": parent, "name": token.value, "id": id,
				"step": function()
						{
							let frame = this.stack[this.stack.length - 1];
							let pe = frame.pe[frame.pe.length - 1];
							let ip = frame.ip[frame.ip.length - 1];
							if (ip == 0)
							{
								// push the value onto the stack
								if (pe.hasOwnProperty("initializer"))
								{
									frame.pe.push(pe.initializer);
									frame.ip.push(-1);
									return false;
								}
								else
								{
									frame.temporaries.push({"type": this.program.types[module.typeid_null], "value": {"b": null}});
									return true;
								}
							}
							else if (ip == 1)
							{
								// assign the value to the variable
								frame.variables[pe.id] = frame.temporaries.pop();
								return false;
							}
							else
							{
								frame.pe.pop();
								frame.ip.pop();
								return false;
							}
						},
				"sim": function()
						{
							let frame = this.stack[this.stack.length - 1];
							let ip = frame.ip[frame.ip.length - 1];
							if (ip == 0)
							{
								let pe = frame.pe[frame.pe.length - 1];
								return (! pe.hasOwnProperty("initializer"));
							}
							else return false;
						},
			};

		// remember the scope to which the variable's id refers
		if (container.petype == "global scope") pe.scope = "global";
		else if (container.petype == "function" || container.petype == "method") pe.scope = "local";
		else if (container.petype == "type") pe.scope = "object";
		else module.assert(false, "unknown variable scope");

		// parse the initializer
		token = module.get_token(state);
		if (token.type == "operator" && token.value == '=')
		{
			pe.initializer = parse_expression(state, parent);
			token = module.get_token(state);
		}

		// register the variable
		container.variables.push(pe);
		parent.names[pe.name] = pe;
		ret.vars.push(pe);
		if (container.petype == "type") parent.objectsize++;

		// parse the delimiter
		if (token.type == "delimiter" && token.value == ';') break;
		else if (token.type != "delimiter" || token.value != ',') state.error(pe.initializer ? "/syntax/se-51b" : "/syntax/se-51");
	}
	return ret;
}

// Parse a function declaration.
function parse_function(state, parent, petype)
{
	if (petype === undefined) petype = "function";

	// handle "function" keyword
	let where = state.get();
	let token = module.get_token(state);
	module.assert(token.type == "keyword" && token.value == "function", "[parse_function] internal error");

	// obtain function name
	token = module.get_token(state);
	if (token.type != "identifier") state.error("/syntax/se-52");
	let fname = token.value;
	if (parent.names.hasOwnProperty(fname)) state.error("/name/ne-15", [fname]);

	// check function name
	if (module.options.checkstyle && ! state.builtin() && fname[0] >= 'A' && fname[0] <= 'Z')
	{
		state.error("/style/ste-3", ["function", fname]);
	}

	// create the function
	let func = { "petype": petype, "where": where, "declaration": true, "parent": parent, "commands": [], "variables": [], "name": fname, "names": {}, "params": [], "step": scopestep, "sim": simfalse };
	parent.names[fname] = func;

	// parse the parameters
	token = module.get_token(state);
	if (token.type != "grouping" || token.value != '(') state.error("/syntax/se-36", ["function declaration"]);
	while (true)
	{
		// parse ) or ,
		let token = module.get_token(state, true);
		if (token.type == "grouping" && token.value == ')')
		{
			module.get_token(state);
			break;
		}
		if (func.params.length != 0)
		{
			if (token.type != "delimiter" || token.value != ',') state.error("/syntax/se-37");
			module.get_token(state);
		}

		// parse the parameter name
		let where = state.get();
		token = module.get_token(state);
		if (token.type != "identifier") state.error("/syntax/se-33");
		let name = token.value; 
		let id = func.variables.length;
		let variable = { "petype": "variable", "where": where, "parent": func, "name": name, "id": id, "scope": "local" };
		let param = { "name": name };

		// check for a default value
		token = module.get_token(state, true);
		if (token.type == "operator" && token.value == '=')
		{
			module.get_token(state);
			let defaultvalue = parse_expression(state, parent);
			if (defaultvalue.petype != "constant") state.error("/syntax/se-38");
			param.defaultvalue = defaultvalue.typedvalue;
		}

		// register the parameter
		if (func.names.hasOwnProperty(name)) state.error("/name/ne-16", [name]);
		func.names[name] = variable;
		func.variables[id] = variable;
		func.params.push(param);
	}

	// parse the function body
	token = module.get_token(state);
	if (token.type != "grouping" || token.value != '{') state.error("/syntax/se-40", ["function declaration"]);
	state.indent.push(-1 - token.line);
	while (true)
	{
		token = module.get_token(state, true);
		if (token.type == "grouping" && token.value == '}')
		{
			state.indent.pop();
			if (module.options.checkstyle && ! state.builtin())
			{
				let indent = state.indentation();
				let topmost = state.indent[state.indent.length - 1];
				if (topmost >= 0 && topmost != indent) state.error("/style/ste-2");
			}
			module.get_token(state);
			break;
		}
		let cmd = parse_statement_or_declaration(state, func);
		func.commands.push(cmd);
	}

	// replace the function body with built-in functionality
	if (func.commands.length == 0)
	{
		let fullname = [];
		let p = func;
		while (p.parent)
		{
			fullname.unshift(p.name);
			p = p.parent;
		}
		let d = state.impl;
		for (let i=0; i<fullname.length; i++)
		{
			if (d.hasOwnProperty(fullname[i])) d = d[fullname[i]];
			else { d = null; break; }
		}
		if (d)
		{
			if (typeof d == "function")
			{
				func.step = function()
						{
							let frame = this.stack[this.stack.length - 1];
							let pe = frame.pe[frame.pe.length - 1];
							let params = frame.variables;
							if (frame.object) params.unshift(frame.object);
							let ret = pe.body.apply(this, params);
							if (this.stack.length == 0) return false;
							this.stack.pop();
							frame = this.stack[this.stack.length - 1];
							frame.temporaries.push(ret);
							return false;
						};
				func.sim = simfalse;
				func.body = d;
			}
			else if (d.hasOwnProperty("step"))
			{
				func.step = d.step;
				func.sim = d.hasOwnProperty("sim") ? d.sim : simfalse;
			}
			else throw "[parse_function] invalid built-in function";
		}
	}

	return func;
}

// Parse a constructor declaration.
function parse_constructor(state, parent)
{
	// check that the parent is indeed a type
	module.assert(parent.petype == "type", "[parse_constructor] internal error; parent is expected to be a type");

	// handle "constructor" keyword
	let where = state.get();
	let token = module.get_token(state);
	module.assert(token.type == "keyword" && token.value == "constructor", "[parse_constructor] internal error");

	// create the function
	let func = { "petype": "method", "where": where, "declaration": true, "parent": parent, "commands": [], "variables": [], "name": "constructor", "names": {}, "params": [], "step": constructorstep, "sim": simfalse };

	// parse the parameters
	token = module.get_token(state);
	if (token.type != "grouping" || token.value != '(') state.error("/syntax/se-36", ["constructor declaration"]);
	while (true)
	{
		// parse ) or ,
		let token = module.get_token(state, true);
		if (token.type == "grouping" && token.value == ')')
		{
			module.get_token(state);
			break;
		}
		if (func.params.length != 0)
		{
			if (token.type != "delimiter" || token.value != ',') state.error("/syntax/se-37");
			module.get_token(state);
		}

		// parse the parameter name
		let where = state.get();
		token = module.get_token(state);
		if (token.type != "identifier") state.error("/syntax/se-33");
		let name = token.value;
		let id = func.variables.length;
		let variable = { "petype": "variable", "where": where, "parent": func, "name": name, "id": id, "scope": "local" };
		let param = { "name": name };

		// check for a default value
		token = module.get_token(state, true);
		if (token.type == "operator" && token.value == '=')
		{
			module.get_token(state);
			let defaultvalue = parse_expression(state, parent);
			if (defaultvalue.petype != "constant") state.error("/syntax/se-38");
			param.defaultvalue = defaultvalue.typedvalue;
		}

		// register the parameter
		if (func.names.hasOwnProperty(name)) state.error("/name/ne-16", [name]);
		func.names[name] = variable;
		func.variables[id] = variable;
		func.params.push(param);
	}

	token = module.get_token(state);
	if (parent.hasOwnProperty("superclass"))
	{
		// implicit expression to the left of the super call
		let base = {"petype": "constant",
		            "where": state.get(),
		            "typedvalue": {"type": get_program(parent).types[module.typeid_type], "value": {"b": parent.superclass}},
		            "step": constantstep, "sim": simfalse};

		if (token.type == "operator" && token.value == ':')
		{
			// parse explicit super class constructor call
			token = module.get_token(state);
			if (token.type != "keyword" || token.value != "super") state.error("/syntax/se-53");
			func.supercall = parse_call(state, func, base);
			func.supercall.petype = "super call";

			// prepare parsing of '{'
			token = module.get_token(state);
		}
		else 
		{
			// create the implicit default super class constructor call
			func.supercall = { "petype": "super call", "where": where, "parent": func, "base": base, "arguments": [], "step": callstep, "sim": callsim };
		}
	}
	else if (token.type == "operator" && token.value == ':') state.error("/name/ne-21");

	// parse the constructor body
	if (token.type != "grouping" || token.value != '{') state.error("/syntax/se-40", ["constructor declaration"]);
	state.indent.push(-1 - token.line);
	while (true)
	{
		token = module.get_token(state, true);
		if (token.type == "grouping" && token.value == '}')
		{
			state.indent.pop();
			if (module.options.checkstyle && ! state.builtin())
			{
				let indent = state.indentation();
				let topmost = state.indent[state.indent.length - 1];
				if (topmost >= 0 && topmost != indent) state.error("/style/ste-2");
			}
			module.get_token(state);
			break;
		}
		let cmd = parse_statement_or_declaration(state, func, true);
		func.commands.push(cmd);
	}

	// replace the function body with built-in functionality
	if (func.commands.length == 0)
	{
		let fullname = [];
		let p = func;
		while (p.parent)
		{
			fullname.unshift(p.name);
			p = p.parent;
		}
		let d = state.impl;
		for (let i=0; i<fullname.length; i++)
		{
			if (d.hasOwnProperty(fullname[i])) d = d[fullname[i]];
			else { d = null; break; }
		}
		if (d)
		{
			if (typeof d == "function")
			{
				func.step = function()
						{
							let frame = this.stack[this.stack.length - 1];
							let pe = frame.pe[frame.pe.length - 1];
							let params = frame.variables;
							if (frame.object) params.unshift(frame.object);
							let ret = pe.body.apply(this, params);
							this.stack.pop();
							return false;
						};
				func.sim = simfalse;
				func.body = d;
			}
			else if (d.hasOwnProperty("step"))
			{
				func.step = d.step;
				func.sim = d.hasOwnProperty("sim") ? d.sim : simfalse;
			}
			else throw "[parse_constructor] invalid built-in function";
		}
	}

	return func;
}

// Parse a class declaration.
function parse_class(state, parent)
{
	// handle the "class" keyword
	let where = state.get();
	let token = module.get_token(state);
	module.assert(token.type == "keyword" && token.value == "class", "[parse_class] internal error");

	// obtain the class name
	token = module.get_token(state);
	if (token.type != "identifier") state.error("/syntax/se-54");
	let cname = token.value;
	if (parent.names.hasOwnProperty(cname)) state.error("/name/ne-18", [cname]);

	// check class name
	if (module.options.checkstyle && ! state.builtin() && (cname[0] < 'A' || cname[0] > 'Z'))
	{
		state.error("/style/ste-4", [cname]);
	}

	// create the class
	let cls = { "petype": "type", "where": where, "parent": parent, "objectsize": 0, "variables": [], "staticvariables": [], "members": {}, "staticmembers": {}, "name": cname, "names": {},
			"step": function()
					{
						let frame = this.stack[this.stack.length - 1];
						let pe = frame.pe[frame.pe.length - 1];
						let ip = frame.ip[frame.ip.length - 1];

						// initialize static variables
						if (ip < pe.staticvariables.length)
						{
							frame.pe.push(pe.staticvariables[ip]);
							frame.ip.push(-1);
							return false;
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
	token = module.get_token(state);
	if (token.type == "operator" && token.value == ':')
	{
		let result = parse_name(state, parent, "super class declaration");
		cls.superclass = result.lookup;

		if (cls.superclass.petype != "type") state.error("/name/ne-22", [result.name]);
		cls.objectsize = cls.superclass.objectsize;

		if (cls.superclass.class_constructor.access == "private") state.error("/syntax/se-58");

		// parse the next token to check for '{'
		token = module.get_token(state);
	}
	if (token.type != "grouping" || token.value != '{') state.error("/syntax/se-40", ["class declaration"]);
	state.indent.push(-1 - token.line);

	// parse the class body
	let access = null;
	while (true)
	{
		// check for end-of-class-body
		token = module.get_token(state, true);
		if (token.type == "grouping" && token.value == '}')
		{
			state.indent.pop();
			if (module.options.checkstyle && ! state.builtin())
			{
				let indent = state.indentation();
				let topmost = state.indent[state.indent.length - 1];
				if (topmost >= 0 && topmost != indent) state.error("/style/ste-2");
			}
			module.get_token(state);
			break;
		}

		// parse access modifiers
		if (token.type == "keyword" && (token.value == "public" || token.value == "protected" || token.value == "private"))
		{
			access = token.value;
			module.get_token(state);
			token = module.get_token(state);
			if (token.type != "operator" || token.value != ':') state.error("/syntax/se-55", [access]);
			continue;
		}

		// parse static modifier
		let stat = false;
		if (token.type == "keyword" && token.value == "static")
		{
			stat = true;
			module.get_token(state);
			token = module.get_token(state, true);
		}

		// parse the actual member
		if (token.type == "keyword" && token.value == "var")
		{
			if (access === null) state.error("/syntax/se-56");

			let group = parse_var(state, cls, stat ? get_program(parent) : cls);
			for (let i=0; i<group.vars.length; i++)
			{
				let pe = group.vars[i];
				if (pe.hasOwnProperty("initializer") && pe.initializer.petype != "constant") state.error("/syntax/se-57");

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
		else if (token.type == "keyword" && token.value == "function")
		{
			if (access === null) state.error("/syntax/se-56");

			let pe = parse_function(state, cls, (stat ? "function" : "method"));
			if (stat) pe.displayname = cname + "." + pe.name;
			pe.access = access;
			if (stat) cls.staticmembers[pe.name] = pe;
			else cls.members[pe.name] = pe;
		}
		else if (token.type == "keyword" && token.value == "constructor")
		{
			if (cls.hasOwnProperty("class_constructor")) state.error("/syntax/se-59b");
			if (access === null) state.error("/syntax/se-56");
			if (stat) state.error("/syntax/se-59");

			let pe = parse_constructor(state, cls);
			pe.access = access;
			cls.class_constructor = pe;
		}
		else if (token.type == "keyword" && token.value == "class")
		{
			if (access === null) state.error("/syntax/se-56");
			if (stat) state.error("/syntax/se-60");

			let pe = parse_class(state, cls);
			pe.displayname = cname + "." + pe.name;
			pe.access = access;
			cls.staticmembers[pe.name] = pe;
		}
		else if (token.type == "keyword" && (token.value == "use" || token.value == "from"))
		{
			if (stat) state.error("/syntax/se-61");
			parse_use(state, cls);
		}
		else state.error("/syntax/se-62");
	}
	// no semicolon required after the class body (in contrast to C++)

	// create a public default constructor if necessary
	if (! cls.hasOwnProperty("class_constructor"))
	{
		cls.class_constructor = { "petype": "method", "where": cls.where, "access": "public", "declaration": true, "parent": cls, "commands": [], "variables": [], "name": "constructor", "names": {}, "params": [], "step": constructorstep, "sim": simfalse };
		if (cls.hasOwnProperty("superclass"))
		{
			let base = {"petype": "constant",
			            "where": state.get(),
			            "typedvalue": {"type": get_program(parent).types[module.typeid_type], "value": {"b": cls.superclass}},
			            "step": constantstep, "sim": simfalse};
			cls.class_constructor.supercall = { "petype": "super call", "parent": cls.class_constructor, "base": base, "arguments": [], "step": callstep, "sim": callsim };
		}
	}

	return cls;
}

// Parse a namespace declaration.
function parse_namespace(state, parent)
{
	// handle "namespace" keyword
	let where = state.get();
	let token = module.get_token(state);
	module.assert(token.type == "keyword" && token.value == "namespace", "[parse_namespace] internal error");

	// check the parent
	if (parent.petype != "global scope" && parent.petype != "namespace") state.error("/syntax/se-63");

	// display name prefix
	let prefix = "";
	{
		let p = parent;
		while (p.petype == "namespace")
		{
			prefix = p.name + "." + prefix;
			p = p.parent;
		}
	}

	// obtain namespace name
	token = module.get_token(state);
	if (token.type != "identifier") state.error("/syntax/se-64");
	let nname = token.value;

	// check namespace name
	if (module.options.checkstyle && ! state.builtin() && nname[0] >= 'A' && nname[0] <= 'Z')
	{
		state.error("/style/ste-3", ["namespace", nname]);
	}

	// obtain the named object corresponding to the namespace globally across instances
	let global_nspace = null;
	if (parent.names.hasOwnProperty(nname))
	{
		// extend the existing namespace
		global_nspace = parent.names[nname];
		if (global_nspace.petype != "namespace") state.error("/name/ne-19", [nname]);
	}
	else
	{
		// create the namespace
		global_nspace = { "petype": "namespace", "parent": parent, "name": nname, "displayname": prefix + nname, "names": {}, "declaration": true };
		parent.names[nname] = global_nspace;
	}

	// create the local namespace PE instance containing the commands
	let local_nspace = { "petype": "namespace", "where": where, "parent": parent, "names": global_nspace.names, "commands": [], "name": nname, "displayname": prefix + nname, "step": scopestep, "sim": simfalse };

	// parse the namespace body
	token = module.get_token(state);
	if (token.type != "grouping" || token.value != '{') state.error("/syntax/se-40", ["namespace declaration"]);
	state.indent.push(-1 - token.line);
	while (true)
	{
		// check for end-of-body
		token = module.get_token(state, true);
		if (token.type == "grouping" && token.value == '}')
		{
			state.indent.pop();
			if (module.options.checkstyle && ! state.builtin())
			{
				let indent = state.indentation();
				let topmost = state.indent[state.indent.length - 1];
				if (topmost >= 0 && topmost != indent) state.error("/style/ste-2");
			}
			module.get_token(state);
			break;
		}

		// parse sub-declarations
		let sub = parse_statement_or_declaration(state, local_nspace);
		if (sub.hasOwnProperty("name")) sub.displayname = prefix + nname + "." + sub.name;
		local_nspace.commands.push(sub);
	}

	return local_nspace;
}

// Parse a "use" declaration.
function parse_use(state, parent)
{
	// handle "use" keyword
	let where = state.get();
	let token = module.get_token(state);
	module.assert(token.type == "keyword" && (token.value == "use" || token.value == "from"), "[parse_use] internal error");

	// create the use directive
	let use = { "petype": "use", "where": where, "parent": parent, "declaration": true };

	// handle the optional "from" part
	let from = parent;
	if (token.value == "from")
	{
		let result = parse_name(state, parent, "use directive", true);
		from = result.lookup;
		use.from = from;
		if (from.petype != "namespace") state.error("/name/ne-23", [result.name]);

		token = module.get_token(state);
		if (token.type != "keyword" || token.value != "use") state.error("/syntax/se-65");
	}

	// parse names with optional identifiers
	while (true)
	{
		// check for namespace keyword
		let kw = peek_keyword(state);
		if (kw == "namespace") module.get_token(state);

		// parse a name
		let result = parse_name(state, from, "use directive", true);
		let identifier = result.name.split(".").pop();

		// parse optional "as" part
		token = module.get_token(state);
		if (token.type == "identifier" && token.value == "as")
		{
			if (kw == "namespace") state.error("/syntax/se-66");
			token = module.get_token(state);
			if (token.type != "identifier") state.error("/syntax/se-67");
			identifier = token.value;
			token = module.get_token(state);
		}

		// actual name import
		if (kw == "namespace")
		{
			// import all names from the namespace
			if (result.lookup.petype != "namespace") state.error("/name/ne-23", [result.name]);
			for (let key in result.lookup.names)
			{
				if (! result.lookup.names.hasOwnProperty(key)) continue;
				if (parent.names.hasOwnProperty(key))
				{
					// tolerate double import of the same entity, otherwise report an error
					if (parent.names[key] != result.lookup.names[key]) state.error("/name/ne-24", [key]);
				}
				else
				{
					// import the name
					parent.names[key] = result.lookup.names[key];
				}
			}
		}
		else
		{
			// import a single name
			if (parent.names.hasOwnProperty(identifier))
			{
				// tolerate double import of the same entity, otherwise report an error
				if (parent.names[identifier] != result.lookup) state.error("/name/ne-24", [identifier]);
			}
			else
			{
				// import the name
				parent.names[identifier] = result.lookup;
			}
		}

		// check for delimiter
		if (token.type == "delimiter" && token.value == ';') break;
		else if (token.type == "delimiter" && token.value == ',') { }
		else state.error("/syntax/se-68");
	}

	return use;
}

function parse_ifthenelse(state, parent)
{
	// handle "if" keyword
	let where = state.get();
	let token = module.get_token(state);
	module.assert(token.type == "keyword" && token.value == "if", "[parse_ifthenelse] internal error");

	// create the conditional object
	let ifthenelse = {
			"petype": "conditional statement",
			"where": where,
			"parent": parent,
			"step": function()
					{
						let frame = this.stack[this.stack.length - 1];
						let pe = frame.pe[frame.pe.length - 1];
						let ip = frame.ip[frame.ip.length - 1];
						if (ip == 0)
						{
							// push the condition onto the stack
							frame.pe.push(pe.condition);
							frame.ip.push(-1);
							return false;
						}
						else if (ip == 1)
						{
							// evaluate the condition
							let cond = frame.temporaries.pop();
							if (! module.isDerivedFrom(cond.type, module.typeid_boolean)) this.error("/argument-mismatch/am-33", [module.displayname(cond.type)]);
							if (cond.value.b)
							{
								// push the "then" part onto the stack
								frame.pe.push(pe.then_part);
								frame.ip.push(-1);
							}
							else
							{
								// push the "else" part onto the stack, or skip it if there is none
								if (pe.hasOwnProperty("else_part"))
								{
									frame.pe.push(pe.else_part);
									frame.ip.push(-1);
								}
								else
								{
									frame.pe.pop();
									frame.ip.pop();
								}
							}
							return false;
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

	// parse the condition
	ifthenelse.condition = parse_expression(state, parent);

	// parse the then-part
	token = module.get_token(state);
	if (token.type != "keyword" || token.value != "then") state.error("/syntax/se-69");
	ifthenelse.then_part = parse_statement(state, parent);

	// parse the else-part
	let kw = peek_keyword(state);
	if (kw == "else")
	{
		token = module.get_token(state);
		module.assert(token.type == "keyword" && token.value == "else", "[parse_ifthenelse] internal error");
		ifthenelse.else_part = parse_statement(state, parent);
	}

	return ifthenelse;
}

function parse_for(state, parent)
{
	// handle "for" keyword
	let where = state.get();
	let token = module.get_token(state);
	module.assert(token.type == "keyword" && token.value == "for", "[parse_for] internal error");

	// create the loop object
	let forloop = {
			"petype": "for-loop",
			"where": where,
			"parent": parent,
			"names": {},
			"step": function()
					{
						let frame = this.stack[this.stack.length - 1];
						let pe = frame.pe[frame.pe.length - 1];
						let ip = frame.ip[frame.ip.length - 1];
						if (ip == -2)
						{
							// handle "break" statement
							frame.temporaries.pop();
							frame.temporaries.pop();
							frame.pe.pop();
							frame.ip.pop();
							return false;
						}
						else if (ip == -1)
						{
							// recover from "continue", jump to ip = 4
							frame.ip[frame.ip.length - 1] = 4 - 1;
							return false;
						}
						else if (ip == 0)
						{
							// preparation phase: evaluate the iterable container
							frame.pe.push(pe.iterable);
							frame.ip.push(-1);
							return false;
						}
						else if (ip == 1)
						{
							// preparation phase: push a copy of the container and the first index onto the temporaries stack
							let iterable = frame.temporaries.pop();
							let container = module.isDerivedFrom(iterable.type, module.typeid_range) ? { "rangemarker": null, "begin": iterable.value.b.begin, "end": iterable.value.b.end, "length": Math.max(0, iterable.value.b.end - iterable.value.b.begin) } : [];
							if (module.isDerivedFrom(iterable.type, module.typeid_array))
							{
								for (let i=0; i<iterable.value.b.length; i++) container.push(iterable.value.b[i]);
							}
							else if (! module.isDerivedFrom(iterable.type, module.typeid_range)) this.error("/argument-mismatch/am-34", [module.displayname(iterable.type)]);
							frame.temporaries.push(container);
							frame.temporaries.push(0);
							return false;
						}
						else if (ip == 2)
						{
							// check the end-of-loop condition and set the loop variable
							let container = frame.temporaries[frame.temporaries.length - 2];
							let index = frame.temporaries[frame.temporaries.length - 1];
							if (index >= container.length)
							{
								frame.temporaries.pop();
								frame.temporaries.pop();
								frame.pe.pop();
								frame.ip.pop();
							}
							else if (pe.hasOwnProperty("var_id"))
							{
								let typedvalue = container.hasOwnProperty("rangemarker")
										? {"type": this.program.types[module.typeid_integer], "value": {"b": (container.begin + index) | 0}}
										: container[index];
								if (pe.var_scope == "global")
									this.stack[0].variables[pe.var_id] = typedvalue;
								else if (pe.var_scope == "local")
									frame.variables[pe.var_id] = typedvalue;
								else if (pe.var_scope == "object")
									frame.object.value.a[pe.var_id] = typedvalue;
								else module.assert(false, "unknown scope: " + pe.var_scope);
							}
							return true;
						}
						else if (ip == 3)
						{
							// push the body onto the stack
							frame.pe.push(pe.body);
							frame.ip.push(-1);
							return false;
						}
						else if (ip == 4)
						{
							// increment the loop counter and jump to ip = 2
							frame.temporaries[frame.temporaries.length - 1]++;
							frame.ip[frame.ip.length - 1] = 2 - 1;
							return false;
						}
					},
			"sim": function()
					{
						let frame = this.stack[this.stack.length - 1];
						let ip = frame.ip[frame.ip.length - 1];
						return (ip == 2);
					},
		};

	// parse the variable
	let vardecl = false;
	where = state.get();
	token = module.get_token(state, true);
	if (token.type == "keyword" && token.value == "var")
	{
		// create and register a new variable
		// Note: the program element does *not* need a step function, it is only there to define the variable's id
		module.get_token(state);
		token = module.get_token(state);
		if (token.type != "identifier") state.error("/syntax/se-70");
		let fn = get_function(parent);
		let id = fn.variables.length;
		let pe = { "petype": "variable", "where": where, "parent": forloop, "name": token.value, "id": id, "scope": "local" };
		fn.variables.push(pe);
		forloop.names[token.value] = pe;
		forloop.var_id = id;
		forloop.var_scope = "local";

		// parse "in"
		token = module.get_token(state);
		if (token.type != "identifier" || token.value != "in") state.error("/syntax/se-71");

		// parse the iterable object
		forloop.iterable = parse_expression(state, parent);

		// parse the "do" keyword
		token = module.get_token(state);
		if (token.type != "keyword" || token.value != "do") state.error("/syntax/se-72");
	}
	else
	{
		let w = state.get();
		let ex = parse_expression(state, forloop);

		token = module.get_token(state);
		if (token.type == "identifier" && token.value == "in")
		{
			state.set(w);
			let result = parse_name(state, parent, "for-loop");
			let v = result.lookup;
			if (v.petype != "variable" && v.petype != "attribute") state.error("/argument-mismatch/am-35", [result.name, result.lookup.petype]);
			forloop.var_id = v.id;
			forloop.var_scope = v.scope;

			// parse "in"
			token = module.get_token(state);
			module.assert(token.type == "identifier" && token.value == "in", "[parse_for] internal error");

			// parse the iterable object
			forloop.iterable = parse_expression(state, parent);

			// parse the "do" keyword
			token = module.get_token(state);
			if (token.type != "keyword" || token.value != "do") state.error("/syntax/se-72");
		}
		else if (token.type == "keyword" && token.value == "do")
		{
			forloop.iterable = ex;
		}
		else state.error("/syntax/se-73");
	}

	// parse the loop body
	forloop.body = parse_statement(state, forloop);

	return forloop;
}

function parse_dowhile(state, parent)
{
	// handle "do" keyword
	let where = state.get();
	let token = module.get_token(state);
	module.assert(token.type == "keyword" && token.value == "do", "[parse_dowhile] internal error");

	// create the loop object
	let dowhile = {
			"petype": "do-while-loop",
			"where": where,
			"parent": parent,
			"step": function()
					{
						let frame = this.stack[this.stack.length - 1];
						let pe = frame.pe[frame.pe.length - 1];
						let ip = frame.ip[frame.ip.length - 1];
						if (ip == -2)
						{
							// handle "break" statement
							frame.pe.pop();
							frame.ip.pop();
							return false;
						}
						else if (ip == -1)
						{
							// recover from "continue" statement
							return false;
						}
						else if (ip == 0)
						{
							// push the body onto the stack
							frame.pe.push(pe.body);
							frame.ip.push(-1);
							return false;
						}
						else if (ip == 1)
						{
							// push the condition onto the stack
							frame.pe.push(pe.condition);
							frame.ip.push(-1);
							return false;
						}
						else if (ip == 2)
						{
							// evaluate the condition
							let cond = frame.temporaries.pop();
							if (! module.isDerivedFrom(cond.type, module.typeid_boolean)) this.error("/argument-mismatch/am-36", [module.displayname(cond.type)]);
							if (cond.value.b)
							{
								// start over
								frame.ip.pop();
								frame.ip.push(-1);
							}
							else
							{
								// leave the loop
								frame.pe.pop();
								frame.ip.pop();
							}
							return true;
						}
					},
			"sim": function()
					{
						let frame = this.stack[this.stack.length - 1];
						let ip = frame.ip[frame.ip.length - 1];
						return (ip == 2);
					},
		};

	// parse the loop body
	dowhile.body = parse_statement(state, dowhile);

	// parse the "while" keyword
	token = module.get_token(state);
	if (token.type != "keyword" || token.value != "while") state.error("/syntax/se-74");

	// parse the condition
	dowhile.condition = parse_expression(state, parent);

	// parse the final semicolon
	token = module.get_token(state);
	if (token.type != "delimiter" || token.value != ";") state.error("/syntax/se-75");

	return dowhile;
}

function parse_whiledo(state, parent)
{
	// handle "while" keyword
	let where = state.get();
	let token = module.get_token(state);
	module.assert(token.type == "keyword" && token.value == "while", "[parse_whiledo] internal error");

	// create the loop object
	let whiledo = {
			"petype": "while-do-loop",
			"where": where,
			"parent": parent,
			"step": function()
					{
						let frame = this.stack[this.stack.length - 1];
						let pe = frame.pe[frame.pe.length - 1];
						let ip = frame.ip[frame.ip.length - 1];
						if (ip == -2)
						{
							// handle "break" statement
							frame.pe.pop();
							frame.ip.pop();
							return false;
						}
						else if (ip == -1)
						{
							// recover from "continue" statement
							return false;
						}
						else if (ip == 0)
						{
							// push the condition onto the stack
							frame.pe.push(pe.condition);
							frame.ip.push(-1);
							return false;
						}
						else if (ip == 1)
						{
							// evaluate the condition
							let cond = frame.temporaries.pop();
							if (! module.isDerivedFrom(cond.type, module.typeid_boolean)) this.error("/argument-mismatch/am-37", [module.displayname(cond.type)]);
							if (cond.value.b)
							{
								// push the body onto the stack
								frame.pe.push(pe.body);
								frame.ip.push(-1);
							}
							else
							{
								// leave the loop
								frame.pe.pop();
								frame.ip.pop();
							}
							return true;
						}
						else if (ip == 2)
						{
							// return to the condition
							frame.ip.pop();
							frame.ip.push(-1);
							return false;
						}
					},
			"sim": function()
					{
						let frame = this.stack[this.stack.length - 1];
						let ip = frame.ip[frame.ip.length - 1];
						return (ip == 1);
					},
		};

	// parse the condition
	whiledo.condition = parse_expression(state, parent);

	// parse the "do" keyword
	token = module.get_token(state);
	if (token.type != "keyword" || token.value != "do") state.error("/syntax/se-76");

	// parse the loop body
	whiledo.body = parse_statement(state, whiledo);

	return whiledo;
}

function parse_break(state, parent)
{
	// handle "break" keyword
	let where = state.get();
	let token = module.get_token(state);
	module.assert(token.type == "keyword" && token.value == "break", "[parse_break] internal error");

	// ensure that we are inside a loop
	let p = parent;
	while (p)
	{
		if (p.petype == "function" || p.petype == "method" || p.petype == "global scope") state.error("/syntax/se-77");
		if (p.petype.indexOf("loop") >= 0) break;
		p = p.parent;
	}

	// parse the closing semicolon
	token = module.get_token(state);
	if (token.type != "delimiter" || token.value != ';') state.error("/syntax/se-81b");

	// create the break object
	return {
			"petype": "continue",
			"where": where,
			"parent": parent,
			"step": function()
					{
						let frame = this.stack[this.stack.length - 1];

						// leave scopes until we hit a loop
						while (frame.pe.length > 0)
						{
							frame.ip.pop();
							let pe = frame.pe.pop();
							if (pe.petype.indexOf("loop") >= 0)
							{
								frame.pe.push(pe);
								frame.ip.push(-3);   // special "break" marker handled by loops
								return true;
							}
						}
						module.assert(false, "internal error in break: no enclosing loop context found");
					},
			"sim": simtrue,
		};
}

function parse_continue(state, parent)
{
	// handle "continue" keyword
	let where = state.get();
	let token = module.get_token(state);
	module.assert(token.type == "keyword" && token.value == "continue", "[parse_continue] internal error");

	// ensure that we are inside a loop
	let p = parent;
	while (p)
	{
		if (p.petype == "function" || p.petype == "method" || p.petype == "global scope") state.error("/syntax/se-78");
		if (p.petype.indexOf("loop") >= 0) break;
		p = p.parent;
	}

	// parse the closing semicolon
	token = module.get_token(state);
	if (token.type != "delimiter" || token.value != ';') state.error("/syntax/se-81c");

	// create the continue object
	return {
			"petype": "continue",
			"where": where,
			"parent": parent,
			"step": function()
					{
						let frame = this.stack[this.stack.length - 1];

						// leave scopes until we hit a loop
						while (frame.pe.length > 0)
						{
							frame.ip.pop();
							let pe = frame.pe.pop();
							if (pe.petype.indexOf("loop") >= 0)
							{
								frame.pe.push(pe);
								frame.ip.push(-2);   // special "continue" marker handled by loops
								return true;
							}
						}
						module.assert(false, "internal error in continue: no enclosing loop context found");
					},
			"sim": simtrue,
		};
}

function parse_return(state, parent)
{
	// handle "return" keyword
	let where = state.get();
	let token = module.get_token(state);
	module.assert(token.type == "keyword" && token.value == "return", "[parse_return] internal error");

	// create the return object
	let ret = {
			"petype": "return",
			"where": where,
			"parent": parent,
			"step": function()
					{
						let frame = this.stack[this.stack.length - 1];
						let pe = frame.pe[frame.pe.length - 1];
						let ip = frame.ip[frame.ip.length - 1];

						if (ip == 0)
						{
							// evaluate the argument
							if (pe.hasOwnProperty("argument"))
							{
								frame.pe.push(pe.argument);
								frame.ip.push(-1);
							}
							else frame.temporaries.push({"type": this.program.types[module.typeid_null], "value": {"b": null}});
							return false;
						}
						else
						{
							// actual function return, move the argument to the then-current temporaries stack
							let arg = frame.temporaries.pop();
							this.stack.pop();
							if (this.stack.length > 0) this.stack[this.stack.length - 1].temporaries.push(arg);
							return true;
						}
					},
			"sim": function()
					{
						let frame = this.stack[this.stack.length - 1];
						let ip = frame.ip[frame.ip.length - 1];
						return (ip != 0);
					},
		};

	// parse the optional argument
	token = module.get_token(state, true);
	if (token.type != "delimiter" || token.value != ';')
	{
		ret.argument = parse_expression(state, parent);
		let fn = get_function(parent);
		if (fn.name == "constructor") state.error("/syntax/se-79");
		if (fn.petype == "global scope" || fn.petype == "namespace") state.error("/syntax/se-80");
	}

	// parse the closing semicolon
	token = module.get_token(state);
	if (token.type != "delimiter" || token.value != ';') state.error("/syntax/se-81");

	return ret;
}

function parse_trycatch(state, parent)
{
	// handle "try" keyword
	let where = state.get();
	let token = module.get_token(state);
	module.assert(token.type == "keyword" && token.value == "try", "[parse_trycatch] internal error");

	// create the try-catch object
	let trycatch = {
			"petype": "try-catch",
			"where": where,
			"parent": parent,
			"step": function()
					{
						let frame = this.stack[this.stack.length - 1];
						let pe = frame.pe[frame.pe.length - 1];
						let ip = frame.ip[frame.ip.length - 1];
						if (ip == 0)
						{
							// run the try part
							frame.pe.push(pe.try_part);
							frame.ip.push(-1);
							return false;
						}
						else if (ip == 2)
						{
							// catch landing point, an exception is on the temporary stack
							frame.pe.push(pe.catch_part);
							frame.ip.push(-1);
							return false;
						}
						else
						{
							// done, either with try or with catch
							frame.pe.pop();
							frame.ip.pop();
							return false;
						}
					},
			"sim": simfalse,
		};

	// create the try part
	trycatch.try_part = {
			"petype": "try",
			"parent": parent,
			"where": where,
			"step": function()
					{
						let frame = this.stack[this.stack.length - 1];
						let pe = frame.pe[frame.pe.length - 1];
						let ip = frame.ip[frame.ip.length - 1];
						if (ip == 0)
						{
							// run the try part
							frame.pe.push(pe.command);
							frame.ip.push(-1);
							return false;							
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

	// parse the try part
	trycatch.try_part.command = parse_statement(state, parent);

	// parse the catch statement
	let where_catch = state.get();
	token = module.get_token(state);
	if (token.type != "keyword" || token.value != "catch") state.error("/syntax/se-82");

	// handle the "var" keyword
	token = module.get_token(state);
	if (token.type != "keyword" || token.value != "var") state.error("/syntax/se-84");

	// parse the variable name
	let where_var = state.get();
	token = module.get_token(state);
	if (token.type != "identifier") state.error("/syntax/se-85");
	let name = token.value;

	// handle the "do" keyword
	token = module.get_token(state);
	if (token.type != "keyword" || token.value != "do") state.error("/syntax/se-86");

	// create the catch part, which declares the exception variable
	trycatch.catch_part = {
			"petype": "catch",
			"parent": parent,
			"where": where_catch,
			"names": { },
			"step": function()
					{
						let frame = this.stack[this.stack.length - 1];
						let pe = frame.pe[frame.pe.length - 1];
						let ip = frame.ip[frame.ip.length - 1];
						if (ip == 0)
						{
							// initialize the variable
							frame.variables[pe.var_id] = frame.temporaries.pop();

							// run the catch part
							frame.pe.push(pe.command);
							frame.ip.push(-1);
							return false;							
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

	// create and register a new variable
	// Note: the program element does *not* need a step function, it is only there to define the variable's id
	let fn = get_function(parent);
	let id = fn.variables.length;
	let pe = { "petype": "variable", "where": where_var, "parent": trycatch.catch_part, "name": name, "id": id, "scope": "local" };
	fn.variables.push(pe);
	trycatch.catch_part.names[name] = pe;
	trycatch.catch_part.var_id = id;

	// parse the catch part
	trycatch.catch_part.command = parse_statement(state, trycatch.catch_part);

	return trycatch;
}

function parse_throw(state, parent)
{
	// handle "throw" keyword
	let where = state.get();
	let token = module.get_token(state);
	module.assert(token.type == "keyword" && token.value == "throw", "[parse_throw] internal error");

	// create the throw object
	let ret = {
			"petype": "throw",
			"where": where,
			"parent": parent,
			"step": function()
					{
						let frame = this.stack[this.stack.length - 1];
						let pe = frame.pe[frame.pe.length - 1];
						let ip = frame.ip[frame.ip.length - 1];

						if (ip == 0)
						{
							// evaluate the exception
							frame.pe.push(pe.argument);
							frame.ip.push(-1);
							return false;
						}
						else
						{
							// save the exception
							let ex = frame.temporaries.pop();

							// search for a try block
							let remove_frame = 0;
							let remove_pe = 0;
							while (true)
							{
								let f = this.stack[this.stack.length - remove_frame - 1];
								if (f.pe[f.pe.length - 1 - remove_pe].petype == "try") break;
								remove_pe++;
								if (remove_pe >= f.pe.length)
								{
									remove_pe = 0;
									remove_frame++;
									if (remove_frame >= this.stack.length) this.error("/user/ue-3", [module.toString(ex)]);
								}
							}

							// modify the stack so that we jump to the catch statement
							this.stack.splice(this.stack.length - remove_frame, remove_frame);
							let f = this.stack[this.stack.length - 1];
							module.assert(remove_pe <= f.pe.length - 2, "[throw] corrupted stack");
							f.pe.splice(f.pe.length - remove_pe - 1, remove_pe + 1);
							f.ip.splice(f.ip.length - remove_pe - 2, remove_pe + 2, 1);

							// pass the exception into the catch block
							f.temporaries.push(ex);

							return true;
						}
					},
			"sim": function()
					{
						let frame = this.stack[this.stack.length - 1];
						let ip = frame.ip[frame.ip.length - 1];
						return (ip != 0);
					},
		};

	// parse the exception argument
	ret.argument = parse_expression(state, parent);

	// parse the closing semicolon
	token = module.get_token(state);
	if (token.type != "delimiter" || token.value != ';') state.error("/syntax/se-87");

	return ret;
}

// Parse var, function, class, or namespace
// The function return null if no declaration is found.
function parse_declaration(state, parent)
{
	let kw = peek_keyword(state);

	if (kw == "var") return parse_var(state, parent);
	else if (kw == "function") return parse_function(state, parent);
	else if (kw == "class") return parse_class(state, parent);
	else if (kw == "namespace") return parse_namespace(state, parent);
	else if (kw == "use" || kw == "from") return parse_use(state, parent);
	else return null;
}

// Parse a single statement, or a group of statements.
function parse_statement(state, parent, var_allowed)
{
	if (var_allowed === undefined) var_allowed = false;

	let kw = peek_keyword(state);

	if (kw == "if") return parse_ifthenelse(state, parent);
	else if (kw == "for") return parse_for(state, parent);
	else if (kw == "do") return parse_dowhile(state, parent);
	else if (kw == "while") return parse_whiledo(state, parent);
	else if (kw == "break") return parse_break(state, parent);
	else if (kw == "continue") return parse_continue(state, parent);
	else if (kw == "return") return parse_return(state, parent);
	else if (kw == "try") return parse_trycatch(state, parent);
	else if (kw == "throw") return parse_throw(state, parent);
	else
	{
		let where = state.get();
		let token = module.get_token(state, true);
		if (token.type == "identifier")
		{
			return parse_assignment_or_expression(state, parent);
		}
		else if ((token.type == "keyword" && (token.value == "null" || token.value == "true" || token.value == "false" || token.value == "not" || token.value == "this" || token.value == "super"))
				|| (token.type == "grouping" && (token.value == '(' || token.value == '['))
				|| (token.type == "operator" && (token.value == '+' || token.value == '-'))
				|| token.type == "integer"
				|| token.type == "real"
				|| token.type == "string")
		{
			// rather stupid cases, forbid them??
			return parse_assignment_or_expression(state, parent);
		}
		else if (token.type == "delimiter" && token.value == ';')
		{
			// ignore solitude semicolon
			module.get_token(state);
			return {
					"petype": "no-operation",
					"where": where,
					"step": function()
							{
								let frame = this.stack[this.stack.length - 1];
								frame.pe.pop();
								frame.ip.pop();
								return false;
							},
					"sim": simfalse,
				};
		}
		else if (token.type == "grouping" && token.value == '{')
		{
			// parse a scope
			module.get_token(state);
			state.indent.push(-1 - token.line);
			let scope = { "petype": "scope", "where": where, "parent": parent, "commands": [], "names": {}, "step": scopestep, "sim": simfalse };
			while (true)
			{
				token = module.get_token(state, true);
				if (token.type == "grouping" && token.value == '}')
				{
					state.indent.pop();
					if (module.options.checkstyle && ! state.builtin())
					{
						let indent = state.indentation();
						let topmost = state.indent[state.indent.length - 1];
						if (topmost >= 0 && topmost != indent) state.error("/style/ste-2");
					}
					module.get_token(state);
					break;
				}
				let cmd = parse_statement_or_declaration(state, scope);
				scope.commands.push(cmd);
			}
			return scope;
		}
		else if (token.type == "grouping" && token.value == '}') state.error("/syntax/se-88");
		else if (token.type == "keyword") state.error("/syntax/se-89", [token.value]);
		else state.error("/syntax/se-90", [token.value]);
	}
}

function parse_statement_or_declaration(state, parent)
{
	function markAsBuiltin(value)
			{
				if (Array.isArray(value))
				{
					for (let i=0; i<value.length; i++) markAsBuiltin(value[i]);
				}
				else if (value !== null && typeof value == "object" && value.constructor == Object)
				{
					if (value.hasOwnProperty("builtin") && value.builtin) return;
					if (value.hasOwnProperty("petype"))
					{
						if (value.hasOwnProperty("where")) delete value.where;
						value.builtin = true;
					}
					for (let key in value)
					{
						if (! value.hasOwnProperty(key)) continue;
						if (key == "parent") continue;
						markAsBuiltin(value[key]);
					}
				}
			};

	if (! state.builtin())
	{
		state.skip();

		if (! state.program.breakpoints.hasOwnProperty(state.line))
		{
			// create and register a new breakpoint
			let b = create_breakpoint(parent, state);
			state.program.breakpoints[state.line] = b;
			parent.commands.push(b);
		}
	}

	let ret = parse_declaration(state, parent);
	if (ret !== null)
	{
		if (state.builtin()) markAsBuiltin(ret);
		return ret;
	}
	ret = parse_statement(state, parent);
	if (state.builtin()) markAsBuiltin(ret);
	return ret;
}

// The parse function parses source code and translates it into an
// abstract syntax tree. It actually performs far more than that, in
// particular (static) name resolution. This allows the parser to catch
// a wide range of errors, as it would otherwise be done by a compiler.
// The function returns an object with the fields
//   program - the "parsed" program as an AST object, or null in case of failure
//   errors  - an array of with array error objects with fields type, line, message
// If module.option.checkstyle is set to true then the parser reports
// coding style warnings in the errors return value.
module.parse = function(sourcecode)
{
	function ParseError(msg) { this.message = msg; }
	ParseError.prototype = new Error();

	// create the initial program structure
	let program = {
		"petype": "global scope",   // like a main function, but with more stuff
		"parent": null,             // top of the hierarchy
		"commands": [],             // sequence of commands
		"types": [],                // array of all types
		"names": {},                // names of all global things
		"variables": [],            // mapping of index to name
		"breakpoints": {},          // mapping of line numbers (preceded by '#') to breakpoints (some lines do not have breakpoints)
		"lines": 0,                 // total number of lines in the program = maximal line number
		"step": scopestep,          // execute all commands within the scope
		"sim": simfalse,            // simulate commands
	};

	// create the parser state
	let state = {
			"program": program,     // program tree to be built during parsing
			"source": "",           // complete source code
			"pos": 0,               // zero-based position in the source code string
			"line": 1,              // one-based line number
			"ch": 0,                // zero-based character number within the line
			"indent": [0],          // stack of nested indentation widths
			"errors": [],           // list of errors, currently at most one
			"impl": {},             // implementations of built-in functions
			"builtin": function()
					{ return Object.keys(this.impl).length > 0; },
			"setSource": function(source, impl)
					{
						this.impl = (impl === undefined) ? {} : impl;
						this.source = source;
						this.pos = 0;
						this.line = 1;
						this.ch = 0;
						this.skip();
					},
			"good": function()
					{ return (this.pos < this.source.length) && (this.errors.length == 0); },
			"bad": function()
					{ return (! this.good()); },
			"eof": function()
					{ return this.pos >= this.source.length; },
			"error": function(path, args)
					{
						if (args === undefined) args = [];
						let msg = module.composeError(path, args);
						this.errors.push({"type": "error", "line": this.line, "ch": this.ch, "message": msg, "href": "#/errors" + path});
						throw new ParseError("error");
					},
			"warning": function(msg)
					{ this.errors.push({"type": "warning", "line": this.line, "message": msg}); },
			"current": function()
					{ return (this.pos >= this.source.length) ? "" : this.source[this.pos]; },
			"lookahead": function(num)
					{ return (this.pos + num >= this.source.length) ? "" : this.source[this.pos + num]; },
			"next": function()
					{ return this.lookahead(1); },
			"get": function()
					{ return { "pos": this.pos, "line": this.line, "ch": this.ch }; },
			"set": function(where)
					{ this.pos = where.pos; this.line = where.line, this.ch = where.ch },
			"indentation": function()
					{
						let w = 0;
						for (let i=this.pos - this.ch; i<this.pos; i++)
						{
							let c = this.source[i];
							if (c == ' ') w++;
							else if (c == '\t') { w += 4; w -= (w % 4); }
							else break;
						}
						return w;
					},
			"advance": function(n)
					{
						if (n === undefined) n = 1;

						if (this.pos + n > this.source.length) n = this.source.length - this.pos;
						for (let i=0; i<n; i++)
						{
							let c = this.current();
							if (c == '\n') { this.line++; this.ch = 0; }
							this.pos++; this.ch++;
						}
					},
			"skip": function()
					{
						let lines = [];
						while (this.good())
						{
							let c = this.current();
							if (c == '#')
							{
								this.pos++; this.ch++;
								if (this.current() == '*')
								{
									this.pos++; this.ch++;
									let star = false;
									while (this.good())
									{
										if (this.current() == '\n')
										{
											this.pos++;
											this.line++; this.ch = 0;
											star = false;
											continue;
										}
										if (star && this.current() == '#')
										{
											this.pos++; this.ch++;
											break;
										}
										star = (this.current() == '*');
										this.pos++; this.ch++;
									}
								}
								else
								{
									while (this.good() && this.current() != '\n') { this.pos++; this.ch++; }
								}
								continue;
							}
							if (c != ' ' && c != '\t' && c != '\r' && c != '\n') break;
							if (c == '\n') { this.line++; this.ch = 0; lines.push(this.line); }
							else this.ch++;
							this.pos++;
						}
						return lines;
					},
		};

	// parse one library or program
	let parse1 = function(source, impl)
			{
				state.setSource(source, impl);
				if (impl === undefined) program.where = state.get();
				while (state.good()) program.commands.push(parse_statement_or_declaration(state, program));
				if (impl === undefined) program.lines = state.line;
			};

	try
	{
		// parse the language core
		parse1(core.source, core.impl);

		// parse the built-in libraries
		parse1(lib_math.source, lib_math.impl);
		parse1(lib_turtle.source, lib_turtle.impl);
		parse1(lib_canvas.source, lib_canvas.impl);

		// parse the user's source code
		parse1(sourcecode);

		// append an "end" breakpoint
		state.skip();
		if (! program.breakpoints.hasOwnProperty(state.line))
		{
			// create and register a new breakpoint
			let b = create_breakpoint(program, state);
			program.breakpoints[state.line] = b;
			program.commands.push(b);
		}
	}
	catch (ex)
	{
		// ignore the actual exception and rely on state.errors instead
		if (ex instanceof ParseError)
		{
			if (state.errors.length > 0) return { "program": null, "errors": state.errors };
		}
		else
		{
			// report an internal parser error
			let err = {
						type: "error",
						href: "#/errors/internal/ie-1",
						message: module.composeError("/internal/ie-1", [module.ex2string(ex)]),
					};
			return { "program": null, "errors": [err] };
		}
	}

	if (state.errors.length > 0) return { "program": null, "errors": state.errors };
	else return { "program": program, "errors": [] };
};


///////////////////////////////////////////////////////////
//
// The "interpreter" class executes a parsed program.
//
// The interpreter is built around a call stack. This stack
// contains one frame per function, which holds the state
// consisting of instruction pointer (ip) and the values of
// all local variables. The bottom-most frame is the global
// scope, holding the global variables.
//
// Each frame holds stacks for pe (program element), ip
// (instruction pointer), temporaries, and an array of
// variables. The pe and ip stacks are always in sync, the
// ip index refers to a position within the corresponding
// pe. The temporary stack stores all temporary values. For
// calls to non-static methods, the frame contains a field
// for the object in addition.
//


// Interpreter constructor.
// An interpreter instance holds the state of a (parsed) program at any
// given point in time during execution, and it holds the "program
// pointer". It runs the program in a background thread, which should be
// stopped before the interpreter is discarded. If the program is not
// running in the background, then it can also be triggered step-by-step
// in the foreground thread.
module.Interpreter = function(program)
{
	///////////////////////////////////////////////////////////
	// constructor
	//

	// create attributes
	this.program = program;   // the program to execute
	this.thread = false;      // state of the thread
	this.stop = false;        // request to stop the thread
	this.background = false;  // is the thread responsible for running the program?
	this.halt = null;         // function testing whether the thread should be halted
	this.status = "";         // program status: "running", "waiting", "error", "finished"
	this.stack = [];          // full state of the program
	this.breakpoints = {};    // breakpoints for debugging, keys are lines
	this.stepcounter = 0;     // number of program steps already executed
	this.waittime = 0;        // time to wait before execution can continue
	this.eventqueue = [];     // queue of events, with entries of the form {type, event}.
	this.eventhandler = {};   // event handler by event type
	this.service = { };       // external services, mostly for communication with the IDE
	this.eventnames = { };    // registry of event types
	this.eventmode = false;   // is the program in event handling mode?

	this.service.turtle = {
		"x": 0.0,
		"y": 0.0,
		"angle": 0.0,
		"down": true,
		"rgb": "rgb(0,0,0)",
		"reset": function(x, y, degrees, down) {
			this.service.turtle.x = x;
			this.service.turtle.y = y;
			this.service.turtle.angle = degrees;
			this.service.turtle.down = down;
			this.service.turtle.rgb = "rgb(0,0,0)";
		},
		"move": function(distance) {
			let a = Math.PI / 180 * this.service.turtle.angle;
			let s = Math.sin(a);
			let c = Math.cos(a);
			let x = this.service.turtle.x + distance * s;
			let y = this.service.turtle.y + distance * c;
			if (this.service.turtle.down && this.service.turtle.dom)
			{
				let ctx = this.service.turtle.dom.getContext("2d");
				ctx.lineWidth = 1;
				ctx.strokeStyle = this.service.turtle.rgb;
				ctx.beginPath();
				ctx.moveTo(300+3*this.service.turtle.x, 300-3*this.service.turtle.y);
				ctx.lineTo(300+3*x, 300-3*y);
				ctx.stroke();
			}
			this.service.turtle.x = x;
			this.service.turtle.y = y;
		},
		"turn": function(degrees) {
			this.service.turtle.angle = (this.service.turtle.angle + degrees) % 360.0;
		},
		"color": function(red, green, blue) {
			if (red < 0) red = 0;
			else if (red > 1) red = 1;
			if (green < 0) green = 0;
			else if (green > 1) green = 1;
			if (blue < 0) blue = 0;
			else if (blue > 1) blue = 1;
			this.service.turtle.rgb = "rgb(" + Math.round(255*red) + "," + Math.round(255*green) + "," + Math.round(255*blue) + ")";
		},
		"pen": function(down) {
			this.service.turtle.down = down;
		}
	};

	this.service.canvas = {
		"font_size": 16,
		"width": function() {
			if (! this.service.canvas.dom) return 0;
			return this.service.canvas.dom.width;
		},
		"height": function() {
			if (! this.service.canvas.dom) return 0;
			return this.service.canvas.dom.height;
		},
		"setLineWidth": function(width) {
			if (! this.service.canvas.dom || ! this.service.canvas.dom.getContext) return;
			let ctx = this.service.canvas.dom.getContext("2d");
			ctx.lineWidth = width;
		},
		"setLineColor": function(red, green, blue, alpha) {
			if (! this.service.canvas.dom || ! this.service.canvas.dom.getContext) return;
			let ctx = this.service.canvas.dom.getContext("2d");
			let r = Math.min(1, Math.max(0, red));
			let g = Math.min(1, Math.max(0, green));
			let b = Math.min(1, Math.max(0, blue));
			let a = Math.min(1, Math.max(0, alpha));
			ctx.strokeStyle = "rgba(" + Math.round(255 * r) + "," + Math.round(255 * g) + "," + Math.round(255 * b) + "," + a + ")";
		},
		"setFillColor": function(red, green, blue, alpha) {
			if (! this.service.canvas.dom || ! this.service.canvas.dom.getContext) return;
			let ctx = this.service.canvas.dom.getContext("2d");
			let r = Math.min(1, Math.max(0, red));
			let g = Math.min(1, Math.max(0, green));
			let b = Math.min(1, Math.max(0, blue));
			let a = Math.min(1, Math.max(0, alpha));
			ctx.fillStyle = "rgba(" + Math.round(255 * r) + "," + Math.round(255 * g) + "," + Math.round(255 * b) + "," + a + ")";
		},
		"setFont": function(fontface, fontsize) {
			if (! this.service.canvas.dom || ! this.service.canvas.dom.getContext) return;
			let ctx = this.service.canvas.dom.getContext("2d");
			ctx.font = fontsize + "px " + fontface;
			this.service.canvas.font_size = fontsize;
		},
		"setTextAlign": function(alignment) {
			if (! this.service.canvas.dom || ! this.service.canvas.dom.getContext) return;
			let ctx = this.service.canvas.dom.getContext("2d");
			ctx.textAlign = alignment;
		},
		"clear": function() {
			if (! this.service.canvas.dom || ! this.service.canvas.dom.getContext) return;
			let ctx = this.service.canvas.dom.getContext("2d");
			ctx.setTransform(1, 0, 0, 1, 0, 0);
			ctx.fillRect(0, 0, this.service.canvas.dom.width, this.service.canvas.dom.height);
		},
		"line": function(x1, y1, x2, y2) {
			if (! this.service.canvas.dom || ! this.service.canvas.dom.getContext) return;
			let ctx = this.service.canvas.dom.getContext("2d");
			ctx.beginPath();
			ctx.moveTo(x1, y1);
			ctx.lineTo(x2, y2);
			ctx.stroke();
		},
		"rect": function(left, top, width, height) {
			if (! this.service.canvas.dom || ! this.service.canvas.dom.getContext) return;
			let ctx = this.service.canvas.dom.getContext("2d");
			ctx.beginPath();
			ctx.rect(left, top, width, height);
			ctx.stroke();
		},
		"fillRect": function(left, top, width, height) {
			if (! this.service.canvas.dom || ! this.service.canvas.dom.getContext) return;
			let ctx = this.service.canvas.dom.getContext("2d");
			ctx.fillRect(left, top, width, height);
		},
		"frameRect": function(left, top, width, height) {
			if (! this.service.canvas.dom || ! this.service.canvas.dom.getContext) return;
			let ctx = this.service.canvas.dom.getContext("2d");
			ctx.beginPath();
			ctx.rect(left, top, width, height);
			ctx.fill();
			ctx.stroke();
		},
		"circle": function(x, y, radius) {
			if (! this.service.canvas.dom || ! this.service.canvas.dom.getContext) return;
			let ctx = this.service.canvas.dom.getContext("2d");
			ctx.beginPath();
			ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
			ctx.stroke();
		},
		"fillCircle": function(x, y, radius) {
			if (! this.service.canvas.dom || ! this.service.canvas.dom.getContext) return;
			let ctx = this.service.canvas.dom.getContext("2d");
			ctx.beginPath();
			ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
			ctx.fill();
		},
		"frameCircle": function(x, y, radius) {
			if (! this.service.canvas.dom || ! this.service.canvas.dom.getContext) return;
			let ctx = this.service.canvas.dom.getContext("2d");
			ctx.beginPath();
			ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
			ctx.fill();
			ctx.stroke();
		},
		"curve": function(points, closed) {
			if (! this.service.canvas.dom || ! this.service.canvas.dom.getContext) return;
			let ctx = this.service.canvas.dom.getContext("2d");
			ctx.beginPath();
			let n = points.length;
			if (n > 0)
			{
				let p = points[0];
				ctx.moveTo(p[0], p[1]);
				for (let i=1; i<n; i++)
				{
					let p = points[i];
					ctx.lineTo(p[0], p[1]);
				}
			}
			if (closed) ctx.closePath();
			ctx.stroke();
		},
		"fillArea": function(points) {
			if (! this.service.canvas.dom || ! this.service.canvas.dom.getContext) return;
			let ctx = this.service.canvas.dom.getContext("2d");
			ctx.beginPath();
			let n = points.length;
			if (n > 0)
			{
				let p = points[0];
				ctx.moveTo(p[0], p[1]);
				for (let i=1; i<n; i++)
				{
					let p = points[i];
					ctx.lineTo(p[0], p[1]);
				}
			}
			ctx.closePath();
			ctx.fill();
		},
		"frameArea": function(points) {
			if (! this.service.canvas.dom || ! this.service.canvas.dom.getContext) return;
			let ctx = this.service.canvas.dom.getContext("2d");
			ctx.beginPath();
			let n = points.length;
			if (n > 0)
			{
				let p = points[0];
				ctx.moveTo(p[0], p[1]);
				for (let i=1; i<n; i++)
				{
					let p = points[i];
					ctx.lineTo(p[0], p[1]);
				}
			}
			ctx.closePath();
			ctx.fill();
			ctx.stroke();
		},
		"text": function(x, y, str) {
			if (! this.service.canvas.dom || ! this.service.canvas.dom.getContext) return;
			let ctx = this.service.canvas.dom.getContext("2d");
			ctx.textBaseline = "top";
			let lines = str.split('\n');
			for (let i=0; i<lines.length; i++)
			{
				ctx.fillText(lines[i], x, y);
				y += this.service.canvas.font_size;
			}
		},
		"reset": function() {
			if (! this.service.canvas.dom || ! this.service.canvas.dom.getContext) return;
			let ctx = this.service.canvas.dom.getContext("2d");
			ctx.setTransform(1, 0, 0, 1, 0, 0);
		},
		"shift": function(dx, dy) {
			if (! this.service.canvas.dom || ! this.service.canvas.dom.getContext) return;
			let ctx = this.service.canvas.dom.getContext("2d");
			ctx.translate(dx, dy);
		},
		"scale": function(factor) {
			if (! this.service.canvas.dom || ! this.service.canvas.dom.getContext) return;
			let ctx = this.service.canvas.dom.getContext("2d");
			ctx.scale(factor, factor);
		},
		"rotate": function(angle) {
			if (! this.service.canvas.dom || ! this.service.canvas.dom.getContext) return;
			let ctx = this.service.canvas.dom.getContext("2d");
			ctx.rotate(angle);
		},
		"transform": function(A, b) {
			if (! this.service.canvas.dom || ! this.service.canvas.dom.getContext) return;
			let ctx = this.service.canvas.dom.getContext("2d");
			ctx.transform(A[0][0], A[1][0], A[0][1], A[1][1], b[0], b[1]);
		}
	};

	// exception type
	function RuntimeError(msg, line, ch, href)
	{
		if (line === undefined) line = null;
		if (ch === undefined) ch = null;
		if (href === undefined) href = "";
		this.message = msg;
		this.line = line;
		this.ch = ch;
		this.href = href;
	}
	RuntimeError.prototype = new Error();


	///////////////////////////////////////////////////////////
	// members
	//

	// background "thread": run a chunk of code for about
	// 15 milliseconds, then trigger the next chunk
	this.chunk = function()
	{
		if (this.stop)
		{
			this.thread = false;
			this.stop = false;
			return;
		}

		if (this.status == "waiting")
		{
			let t = (new Date()).getTime();
			if (t >= this.waittime)
			{
				this.status = "running";
				if (this.service.statechanged) this.service.statechanged(false);
			}
		}

		if (this.status == "running")
		{
			let start = (new Date()).getTime();
			while (this.background && (new Date()).getTime() - start < 14 && this.status == "running")
			{
				this.exec_step();

				if (this.halt)
				{
					if (this.halt.call(this))
					{
						this.halt = null;
						this.background = false;
						if (this.service.statechanged) this.service.statechanged(true);
					}
				}
			}
			if (this.background && !this.timerEventEnqueued)
			{
				this.timerEventEnqueued = this.enqueueEvent("timer", {"type": this.program.types[module.typeid_null], "value": {"b": null}});
			}
		}

		let context = this;
		setTimeout(function() { context.chunk(); }, 1);
	};

	// reset the program state, set the instruction pointer to its start
	this.reset = function()
	{
		this.halt = null;
		this.background = false;
		this.stack = [{
				"pe": [this.program],       // array(n), program elements
				"ip": [0],                  // array(n), indices used by step functions
				"temporaries": [],          // stack of intermediate "return values"
				"variables": []             // array, global variables
			}];
		this.status = "running";
		if (this.service.statechanged) this.service.statechanged(false);
	};

	// start or continue running the program in the background
	this.run = function()
	{
		if (this.status == "running" || this.status == "waiting")
		{
			this.background = true;
			if (this.service.statechanged) this.service.statechanged(false);
		}
	};

	// interrupt the program in the background, keep the state
	this.interrupt = function()
	{
		this.halt = null;
		this.background = false;
		if (this.service.statechanged) this.service.statechanged(true);
	};

	// raise a fatal runtime error, preserve the interpreter state for debugging
	this.error = function(path, args)
	{
		if (args === undefined) args = [];

		let message = module.composeError(path, args);
		let href = "#/errors" + path;
		let line = null, ch = null;
		for (let j=this.stack.length-1; j>=0; j--)
		{
			let frame = this.stack[j];
			for (let i=frame.pe.length-1; i>=0; i--)
			{
				let pe = frame.pe[i];
				if (pe && pe.where)
				{
					line = pe.where.line;
					ch = pe.where.ch;
					break;
				}
			}
			if (line !== null) break;
		}
		throw new RuntimeError(message, line, ch, href);
	};

	// make the interpreter wait (at least) for the given number of milliseconds
	this.wait = function(milliseconds)
	{
		if (this.status != "running") return false;
		this.waittime = (new Date()).getTime() + milliseconds;
		this.status = "waiting";
		if (this.service.statechanged) this.service.statechanged(false);
		return true;
	};

	// Progress the instruction pointer to the next executable function.
	// This must happen after every call to pe.step(). The process
	// advances the instruction pointer. Furthermore, it may involve
	// returning from one or more functions. The number of functions
	// left in this way is returned.
	function progress()
	{
		let start = this.stack.length;

		// progress the instruction pointer
		while (this.stack.length > 0)
		{
			let frame = this.stack[this.stack.length - 1];
			if (frame.ip.length == 0)
			{
				// implicit return from a function
				module.assert(frame.temporaries.length == 0, "[Interpreter.progress] temporaries stack is not empty at the end of the function scope");
				this.stack.pop();
				if (this.stack.length == 0)
				{
					// end of the program
					break;
				}
				else
				{
					// implicit return null
					let frame = this.stack[this.stack.length - 1];
					frame.temporaries.push({"type": this.program.types[module.typeid_null], "value": {"b": null}});
				}
			}
			else
			{
				frame.ip[frame.ip.length - 1]++;
				break;
			}
		}

		return start - this.stack.length;
	}

	// Run the next command. Steps are considered atomic from the
	// perspective of the debugger, although under the hood they are of
	// course not.
	// The first step moves the instruction pointer to the first
	// non-trivial command. All further steps execute one command and
	// then move the instruction pointer to the next non-trivial
	// command.
	this.exec_step = function()
	{
		if (this.status == "waiting")
		{
			let t = (new Date()).getTime();
			if (t >= this.waittime)
			{
				this.status = "running";
				if (this.service.statechanged) this.service.statechanged(false);
			}
		}

		if (this.status != "running") return;

		if (this.stack.length == 0)
		{
			this.status = "finished";
			if (this.service.statechanged) this.service.statechanged(true);
			return;
		}

		try
		{
			// execute a step that returns true
			let frame = this.stack[this.stack.length - 1];
			let pe = frame.pe[frame.pe.length - 1];
			if (frame.ip.length != 1 || frame.ip[0] != 0)
			{
				// execute the current program element, and demand that it "did something"
				let done = pe.step.call(this);
				module.assert(done, "[Interpreter.exec_step] 'done' expected");

				// progress the instruction pointer
				this.stepcounter++;
				progress.call(this);
			}

			// execute trivial steps
			while (this.stack.length > 0 && (this.status == "running" || this.status == "waiting"))
			{
				let frame = this.stack[this.stack.length - 1];
				let pe = frame.pe[frame.pe.length - 1];

				// check whether we are done
				let done = pe.sim.call(this);
				if (done) break;

				// execute the current program element
				done = pe.step.call(this);
				module.assert(! done, "[Interpreter.exec_step] 'not done' expected");

				// progress the instruction pointer
				progress.call(this);
			}
		}
		catch (ex)
		{
			if (ex instanceof RuntimeError)
			{
				this.halt = null;
				this.background = false;
				if (this.service.message)
				{
					this.service.message("runtime error in line " + ex.line + ": " + ex.message, ex.line, ex.ch, ex.href);
				}
				this.status = "error";
				if (this.service.statechanged) this.service.statechanged(true);
			}
			else
			{
				// report an internal interpreter error
				console.log("internal runtime error!");
				console.log(ex);
				let msg = module.composeError("/internal/ie-2", [module.ex2string(ex)]);
				if (this.service.message) this.service.message(msg, null, null, "#/errors/internal/ie-2");

				this.halt = null;
				this.background = false;
				this.status = "error";
				if (this.service.statechanged) this.service.statechanged(true);
			}
		}
	};

	this.step_into = function()
	{
		if (this.background || this.status != "running") return;
		this.halt = function() { return true; };
		this.background = true;
	};

	// move to a different line in the same function
	this.step_over = function()
	{
		if (this.background || this.status != "running") return;
		let len = this.stack.length;
		if (len == 0)
		{
			this.halt = function() { return true; };
			this.background = true;
			return;
		}
		let frame = this.stack[len - 1];
		let pe = frame.pe[frame.pe.length - 1];
		let line = pe.where ? pe.where.line : -1;
		this.halt = (function(len, line) { return function()
				{
					if (this.stack.length < len) return true;
					else if (this.stack.length == len)
					{
						let pe = frame.pe[frame.pe.length - 1];
						let ln = pe.where ? pe.where.line : -1;
						if (ln != line) return true;
					}
					return false;
				}; })(len, line);
		this.background = true;
	};

	// move out of the current function
	this.step_out = function()
	{
		if (this.background || this.status != "running") return;
		let len = this.stack.length;
		if (len == 0) this.halt = function() { return true; };
		else this.halt = (function(len) { return function()
				{
					return (this.stack.length < len);
				}; })(len);
		this.background = true;
	};

	// request to stop the background thread
	this.stopthread = function()
	{
		this.stop = true;
	};
	
	// event limits
	this.timerEventEnqueued = false;

	// queue an event
	// returns true when event got enqueued, false otherwise
	this.enqueueEvent = function(type, event)
	{
		if (this.eventmode) this.eventqueue.push({"type": type, "event": event});
		return this.eventmode;
	};

	// define an event handler - there can only be one :)
	this.setEventHandler = function(type, handler)
	{
		if (handler.type.id == module.typeid_null) delete this.eventhandler[type];
		else if (module.isDerivedFrom(handler.type, module.typeid_function))
		{
			if (handler.value.b.func.params.length != 1) throw new RuntimeError("[Interpreter.setEventHandler] handler must be a function with exactly one parameter");
			this.eventhandler[type] = handler.value.b;
		}
		else throw new RuntimeError("[Interpreter.setEventHandler] invalid argument");
	};

	// Request to define a number of breakpoints. This function should
	// be called right after construction of the interpreter. It returns
	// the line numbers where actual breakpoints are set as the keys of
	// a dictionary. Some breakpoints may get merged this way. If all
	// provided breakpoints are in legal positions then the function
	// returns null.
	this.defineBreakpoints = function(lines)
	{
		let pos = {};
		let changed = false;

		// loop over all positions
		for (let i=0; i<lines.length; i++)
		{
			let line = lines[i];
			if (this.program.breakpoints.hasOwnProperty(line))
			{
				// position is valid
				pos[line] = true;
			}
			else
			{
				// find a valid position if possible
				changed = true;
				while (line <= this.program.lines)
				{
					if (this.program.breakpoints.hasOwnProperty(line))
					{
						pos[line] = true;
						break;
					}
					else line++;
				}
			}
		}

		// enable/disable break points
		for (let key in this.program.breakpoints)
		{
			if (pos.hasOwnProperty(key)) this.program.breakpoints[key].set();
			else this.program.breakpoints[key].clear();
		}

		// return the result
		if (changed) return pos;
		else return null;
	}

	// Request to toggle a breakpoint. Not every line is a valid break
	// point position, therefore the function returns the following:
	// {
	//   line: number,       // position of the toggle
	//   active: boolean,    // is the breakpoint active after the action?
	// }
	// It no valid position can be found then the function returns null.
	this.toggleBreakpoint = function(line)
	{
		while (line <= this.program.lines)
		{
			if (this.program.breakpoints.hasOwnProperty(line))
			{
				this.program.breakpoints[line].toggle();
				return { "line": line, "active": this.program.breakpoints[line].active() };
			}
			else line++;
		}
		return null;
	}

	// start the background thread
	this.thread = true;
	let context = this;
	setTimeout(function() { context.chunk(); }, 1);
};


return module;
}());
