import { FileID, fileIDToContextDependentFilename } from "../parser/file_id";
import { AssertionError } from "./AssertionError";
import { RuntimeError } from "./RuntimeError";

export class ErrorHelper {
	// given an error ID (path), return the error message template
	public static errorTemplate(path): String {
		let tokens = path.split("/");
		ErrorHelper.assert(
			tokens[0] === "",
			"[errorTemplate] invalid path: " + path
		);
		let ret = errors;
		for (let i = 1; i < tokens.length; i++) {
			ErrorHelper.assert(
				ret.hasOwnProperty(tokens[i]),
				"[errorTemplate] invalid path: " + path
			);
			ret = ret[tokens[i]];
		}
		return new String(ret);
	}

	// given an error ID (path) and a list of arguments, compose the error message
	public static composeError(path: string, args: Array<any>) {
		let err = ErrorHelper.errorTemplate(path);
		let tokens = err.split("$$");
		ErrorHelper.assert(tokens.length === args.length + 1);
		let ret = tokens[0];
		for (let i = 0; i < args.length; i++) ret += args[i] + tokens[i + 1];
		return ret;
	}

	public static getLocatedErrorMsg(
		errorType: string,
		fileID: FileID | undefined,
		line: number | undefined,
		msg: string
	): string {
		const humanReadable =
			fileID !== undefined && fileIDToContextDependentFilename(fileID);
		return (
			errorType +
			(humanReadable ? ` in file '${humanReadable}'` : "") +
			(line ? ` in line ${line}` : "") +
			`: ${msg}`
		);
	}

	public static getError(
		path,
		args: Array<any> | undefined = undefined,
		stack: any = undefined,
		_filename: FileID | undefined = undefined,
		_line: number | undefined = undefined,
		_ch: number | undefined = undefined
	) {
		if (typeof stack === "undefined") {
			stack = new Array();
		}

		if (args === undefined) args = [];

		let message = ErrorHelper.composeError(path, args);
		let href = "#/errors" + path;
		let filename: FileID | null = null,
			line: any = null,
			ch: any = null;

		if (typeof _filename === "string") {
			filename = _filename;
		}
		if (typeof _line === "number") {
			line = _line;
		}
		if (typeof _ch === "number") {
			ch = _ch;
		}

		for (let j = stack.length - 1; j >= 0; j--) {
			let frame = stack[j];
			for (let i = frame.pe.length - 1; i >= 0; i--) {
				let pe = frame.pe[i];
				if (pe && pe.where) {
					filename = pe.where.filename;
					line = pe.where.line;
					ch = pe.where.ch;
					break;
				}
			}
			if (line !== null) break;
		}
		return new RuntimeError(message, filename ?? undefined, line, ch, href);
	}
	// raise a fatal runtime error, preserve the interpreter state for debugging
	public static error(
		path,
		args: Array<any> | undefined = undefined,
		stack: any = undefined
	) {
		throw ErrorHelper.getError(path, args, stack);
	}

	public static ex2string(ex: string | Error | undefined): string {
		if (typeof ex === "undefined") return "undefined";
		if (ex === null) return "null";
		if (typeof ex === "object") {
			if (ex.hasOwnProperty("message")) return ex.message;
			if (ex.hasOwnProperty("name")) return ex.name;
		}
		return String(ex);
	}

	public static assert(
		condition: any,
		message: string | undefined = undefined
	): void {
		if (typeof message === "undefined")
			message = "TScript internal assertion failed";
		else message = "TScript internal assertion failed; " + message;
		if (!condition) throw new AssertionError(message);
	}
}

// error messages
//
// Nested dictionary of all error messages. An error is
// identified by an ID, which is an absolute path into the
// data structure.
//
export let errors = {
	syntax: {
		"se-1": "syntax error in floating point literal",
		"se-2": "syntax error in string literal; closing double quotes '\"' expected before end-of-line",
		"se-3": "syntax error in string literal; invalid Unicode escape sequence",
		"se-4": "syntax error in string literal; invalid escape sequence '\\$$'",
		"se-5": "syntax error; invalid character '$$'",
		"se-6": "syntax error; 'super' cannot be used outside of a class declaration",
		"se-7": "syntax error; 'super' cannot be used in a class without super class",
		"se-8": "syntax error in super reference; dot '.' expected after 'super'",
		"se-9": "syntax error in super reference; identifier expected after dot '.'",
		"se-10": "syntax error in $$; name expected",
		"se-13":
			"error in $$; $$ '$$' requires a 'this' object and hence cannot be accessed from a static context",
		"se-14":
			"syntax error in argument list; positional argument follows named argument",
		"se-15":
			"syntax error in argument list; expected comma ',' or closing parenthesis ')'",
		"se-16":
			"error in function call; attempt to call a value of type '$$'; 'function' or 'type' expected",
		"se-21":
			"operators are not allowed on the left-hand side of an assignment",
		"se-22": "syntax error in expression; missing closing parenthesis ')'",
		"se-23":
			"syntax error in integer literal: maximal value of 2147483647 exceeded",
		"se-24":
			"syntax error in array; comma ',' or closing bracket ']' expected",
		"se-25": "syntax error in array; unexpected end-of-file",
		"se-26": "syntax error in dictionary; duplicate key '$$'",
		"se-27":
			"syntax error in dictionary; comma ',' or closing brace '}' expected",
		"se-28":
			"syntax error in dictionary key; string constant or identifier expected",
		"se-29": "syntax error in dictionary; colon ':' expected",
		"se-30": "syntax error in dictionary; unexpected end-of-file",
		"se-31":
			"syntax error in closure parameter declaration; comma ',' or closing bracket ']' expected",
		"se-32":
			"syntax error in closure parameter declaration; identifier expected as the parameter name",
		"se-33":
			"syntax error in parameter declaration; identifier expected as the parameter name",
		"se-35":
			"syntax error in anonymous function; opening bracket '[' or opening parenthesis '(' expected",
		"se-36": "syntax error in $$; opening parenthesis '(' expected",
		"se-37":
			"syntax error in parameter declaration; comma ',' or closing parenthesis ')' expected",
		"se-38":
			"error in parameter declaration; default value must be a constant",
		"se-40": "syntax error in $$; opening brace '{' expected",
		"se-41":
			"syntax error in expression; unexpected keyword '$$', expression expected",
		"se-42":
			"syntax error in expression; unexpected token '$$', expression expected",
		"se-43":
			"syntax error in member access: identifier expected after the dot '.'",
		"se-44": "syntax error in item access: closing bracket ']' expected",
		"se-47": "syntax error; 'this' cannot be used in this context",
		"se-48": "syntax error in assignment; semicolon ';' expected",
		"se-49":
			"syntax error in expression; operator or semicolon ';' expected",
		"se-50":
			"syntax error in variable declaration; identifier expected as the variable name",
		"se-51":
			"syntax error in variable declaration; expected initializer '=', comma ',' or semicolon ';'",
		"se-51b":
			"syntax error in variable declaration; expected comma ',' or semicolon ';'",
		"se-52":
			"syntax error in function declaration; identifier expected as the function name",
		"se-53":
			"syntax error in constructor declaration; 'super' expected after colon ':'",
		"se-54":
			"syntax error in class declaration; identifier expected as the class name",
		"se-55":
			"syntax error in access modifier: colon ':' expected after '$$'",
		"se-56":
			"syntax error in class declaration; member declaration without access modifier",
		"se-57":
			"syntax error in class declaration; attribute initializer must be a constant",
		"se-58":
			"error in class declaration; the super class has a private constructor, therefore it cannot be sub-classed",
		"se-59": "error in class declaration; constructor cannot be static",
		"se-59b":
			"error in class declaration; the constructor was already declared",
		"se-60":
			"error in class declaration; class declaration cannot be static",
		"se-61": "error in class declaration; use directive cannot be static",
		"se-62":
			"syntax error in class declaration; member declaration, use directive, or access modifier expected",
		"se-63":
			"syntax error in namespace declaration; a namespace may be declared only at global scope or within another namespace",
		"se-64":
			"syntax error in namespace declaration; identifier expected as the namespace name",
		"se-65": "syntax error in use directive: keyword 'use' expected",
		"se-66":
			"syntax error in use directive; 'namespace' and 'as' cannot be combined",
		"se-67":
			"syntax error in use directive; identifier expected after 'as'",
		"se-68":
			"syntax error in use directive; comma ',' or semicolon ';' expected",
		"se-69": "syntax error in conditional statement: 'then' expected",
		"se-70":
			"syntax error in for-loop: identifier expected as the loop variable",
		"se-71": "syntax error in for-loop: 'in' expected",
		"se-72": "syntax error in for-loop: keyword 'do' expected",
		"se-73": "syntax error in for-loop; 'in' or 'do' expected",
		"se-74": "syntax error in do-while-loop: 'while' expected",
		"se-75": "syntax error in do-while-loop: semicolon ';' expected",
		"se-76": "syntax error in while-do-loop: 'do' expected",
		"se-77":
			"syntax error; 'break' statement must not appear outside a loop body",
		"se-78":
			"syntax error; 'continue' statement must not appear outside a loop body",
		"se-79":
			"syntax error in return; a constructor does not return a value",
		"se-80": "syntax error in return; the program does not return a value",
		"se-81": "syntax error in return; semicolon ';' expected",
		"se-81b": "syntax error in break; semicolon ';' expected",
		"se-81c": "syntax error in continue; semicolon ';' expected",
		"se-82": "syntax error in try-catch statement: 'catch' expected",
		"se-84":
			"syntax error in try-catch statement: 'var' expected after 'catch'",
		"se-85":
			"syntax error in try-catch statement: identifier expected after 'var'",
		"se-86":
			"syntax error in try-catch statement: 'do' expected after exception",
		"se-87": "syntax error in throw; semicolon ';' expected",
		"se-88": "syntax error; unexpected closing brace '}'",
		"se-89": "syntax error; unexpected keyword '$$', statement expected",
		"se-90": "syntax error; unexpected token '$$', statement expected",
		"se-91": "syntax error in include; string literal expected",
		"se-92": "syntax error in include; semicolon ';' expected",
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
		"am-18":
			"parameter 'position' of 'Array.insert' is out of range; position is $$, array size is $$",
		"am-18b": "'Array.pop' cannot be applied to an empty array",
		"am-19":
			"the 'comparator' function passed to 'Array.sort' must return a numeric value, found '$$'",
		"am-20":
			"invalid string index '$$' of type '$$', 'Integer' or 'Range' expected",
		"am-21": "string index '$$' out of range; index must not be negative",
		"am-22":
			"string index '$$' out of range; must be less than the string size of $$",
		"am-23": "array index '$$' out of range; index must not be negative",
		"am-24":
			"array index '$$' out of range; must be less than array size of $$",
		"am-25": "invalid array index '$$' of type '$$', 'integer' expected",
		"am-26":
			"invalid array index '$$' of type '$$', 'integer' or 'range' expected",
		"am-27": "dictionary index '$$' is not a key of the dictionary",
		"am-28": "invalid dictionary index of type '$$', 'string' expected",
		"am-29":
			"range index '$$' out of range; must be non-negative and less than the range size of $$",
		"am-30":
			"invalid range index '$$' of type '$$', 'Integer' or 'Range' expected",
		"am-31":
			"attempt to access an item of type '$$'; string, array, dictionary, or range expected",
		"am-31b":
			"attempt to access an item of type '$$'; string, array, or dictionary expected",
		"am-32": "cannot assign to $$",
		"am-33":
			"condition in conditional statement is not boolean but rather of type '$$'",
		"am-34":
			"attempt to loop over the non-iterable type '$$', 'Range' or 'Array' expected",
		"am-35":
			"error in for-loop; '$$' does not refer to a variable, but to a $$",
		"am-36":
			"condition in do-while-loop is not boolean but rather of type '$$'",
		"am-37":
			"condition in while-do-loop is not boolean but rather of type '$$'",
		"am-38": "loading the value failed, key '$$' does not exist",
		"am-39": "saving the value failed",
		"am-40": "invalid event name '$$'",
		"am-41":
			"argument handler passed to setEventHandler must be a function with exactly one parameter",
		"am-42": "deepcopy failed due to $$",
		"am-43": "infinite recursion due to recursive data structure",
		"am-44": "channel arrays have different sizes",
		"am-44b": "sample frequency out of range",
		"am-44c": "number of sound channels out of range",
		"am-45": "$$ exceeded allowed range $$",
		"am-46": "invalid resource string",
		"am-47": "wrong array size",
		"am-48": "file '$$' not found",
		"am-49": "radius cannot be negative",
		"am-50": "failed to initialize value from uninitialized counterpart",
	},
	name: {
		"ne-1": "error in function call; named parameter '$$' is already specified in call to function '$$'",
		"ne-2": "error in function call; named parameter '$$' not found in function '$$'",
		"ne-3": "error in function call; too many arguments for call to function '$$'",
		"ne-4": "error in function call; parameter number $$ is missing when calling function '$$'",
		"ne-5": "error in $$; '$$' is not defined",
		"ne-6": "error in $$; cannot access variable '$$', which is declared in a different class",
		"ne-7": "error in $$; cannot access variable '$$', which is declared in a scope with different lifetime",
		"ne-8": "error in $$; '$$' cannot be accessed because it is a private member of type '$$'",
		// "ne-9": "error in namespace lookup; name '$$' not found in namespace '$$'",
		"ne-10": "name '$$' does not refer to a variable, function, or type",
		"ne-11":
			"a name referring to a namespace is not allowed in this context",
		"ne-12": "type '$$' does not have a public static member '$$'",
		"ne-13": "type '$$' does not have a public member '$$'",
		"ne-14":
			"declaration of variable '$$' conflicts with previous declaration; double use of the same name",
		"ne-15":
			"declaration of function '$$' conflicts with previous declaration; double use of the same name",
		"ne-16":
			"declaration of parameter '$$' conflicts with previous declaration; double use of the same name",
		"ne-17":
			"declaration of closure parameter '$$' conflicts with previous declaration; double use of the same name",
		"ne-18":
			"declaration of class '$$' conflicts with previous declaration; double use of the same name",
		"ne-19":
			"declaration of namespace '$$' conflicts with previous declaration; double use of the same name",
		"ne-21":
			"error in constructor declaration; super constructor call without a super class",
		"ne-22":
			"error in super class declaration; '$$' does not refer to a type",
		"ne-23": "error in use directive; '$$' is not a namespace",
		"ne-24":
			"use of identifier '$$' conflicts with previous declaration; double use of the same name",
		"ne-25":
			"error in constructor call; the constructor of type '$$' is declared $$",
		"ne-26": "error in super class declaration; class '$$' inherits itself",
		"ne-28": "failed to statically resolve loop variable name",
		"ne-29": "variable '$$' was used before it was initialized",
		"ne-30": "cannot access non-static member '$$' without an object",
	},
	logic: {
		"le-1": "too much recursion",
		"le-2": "enterEventMode failed; the program is already in event mode",
		"le-3": "quitEventMode failed; the program is not in event mode",
	},
	user: {
		"ue-1": "assertion failed; $$",
		"ue-2": "runtime error; $$",
		"ue-3": "uncaught exception; $$",
	},
	style: {
		"ste-1": "coding style violation; invalid line indentation",
		"ste-2": "coding style violation; inconsistent block indentation",
		"ste-3":
			"coding style violation; the $$ name '$$' should start with a lowercase letter or with an underscore",
		"ste-4":
			"coding style violation; the class name '$$' should start with a capital letter",
	},
	internal: {
		"ie-1": "internal parser error; $$",
		"ie-2": "internal interpreter error; $$",
	},
};
