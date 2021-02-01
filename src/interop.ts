import { ErrorHelper } from "./errors/ErrorHelper";
import { defaultOptions } from "./helpers/options";
import { Typeid } from "./helpers/typeIds";
import { defaultService } from "./interpreter/defaultService";
import { Interpreter as _Interpreter } from "./interpreter/interpreter"
import { Lexer } from "./parse/lexer";
import { Parser } from "./parse/parser"
import { TScript } from "./tscript"
import { Version } from "./version";

class InteropInterpreter extends _Interpreter{
    constructor(program){
        super(program, defaultService) 
    }
}

export const Interpreter = InteropInterpreter;
export const assert = ErrorHelper.assert;
export const composeError = ErrorHelper.composeError;
export const displayname = TScript.displayname;
export const equal = TScript.equal;
export const errorTempate = ErrorHelper.errorTemplate;
export const ex2string = ErrorHelper.ex2string;
export const get_token = Lexer.get_token;
export const isDerivedFrom = TScript.isDerivedFrom;
export const isInt32 = TScript.isInt32;
export const isNumeric = TScript.isNumeric;
export const jsObject2typed = TScript.jsObject2typed;
export const json2typed = TScript.json2typed;
export const mul32 = TScript.mul32;
export const mod = TScript.mod;
export const order = TScript.order;
export const parse = function (code){return Parser.parse(code, defaultOptions)};
export const previewValue = TScript.previewValue;
export const typed2json = TScript.typed2json;

export const typeid_null = Typeid.typeid_null;
export const typeid_boolean = Typeid.typeid_boolean;
export const typeid_integer = Typeid.typeid_integer;
export const typeid_real = Typeid.typeid_real;
export const typeid_string = Typeid.typeid_string;
export const typeid_array = Typeid.typeid_array;
export const typeid_dictionary = Typeid.typeid_dictionary;
export const typeid_function = Typeid.typeid_function;
export const typeid_range = Typeid.typeid_range;
export const typeid_type = Typeid.typeid_type;
export const typeid_class = Typeid.typeid_class;

export const version = Version;

export const keywords = Lexer.keywords;
export const delimiters = Lexer.delimiters;
export const groupings = Lexer.groupings;
export const operators = Lexer.operators;