///////////////////////////////////////////////////////////
// lexer
//
// The task of the lexer is to return the next token in the
// input stream. It handles composite operators properly.
//

import { Options } from "../helpers/options";
import { TScript } from "../tscript";

export class Lexer{
    public static keywords = {
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
    public static operators = "=<>!^+-*/%:";
    public static groupings = "()[]{}";
    public static delimiters = ",;.";

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
    public static get_token(state, options: Options, peek: any | undefined = undefined)
    {
        peek = (typeof peek !== 'undefined') ? peek : false;
        let where = (peek) ? state.get() : false;
        state.skip();
        let line = state.line;
        if (state.eof()) return {"type": "end-of-file", "value": "", "code": "", "line": line};

        let indent = state.indentation();
        let tok:any = null;

        let c = state.current();
        if ((c >= 'A' && c <= 'Z') || (c >= 'a' && c <= 'z') || c === '_')
        {
            // parse an identifier or a keyword
            let start = state.pos;
            state.advance();
            while (state.good())
            {
                let c = state.current();
                if ((c >= 'A' && c <= 'Z') || (c >= 'a' && c <= 'z') || (c >= '0' && c <= '9') || c === '_') state.advance();
                else break;
            }
            let value = state.source.substring(start, state.pos);
            if (where) state.set(where); else state.skip();
            tok = {"type": (Lexer.keywords.hasOwnProperty(value)) ? "keyword" : "identifier", "value": value, "code": value, "line": line};
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
                if (state.current() === '.')
                {
                    // parse fractional part
                    type = "real";
                    state.advance();
                    if (state.eof() || (state.current() < '0' || state.current() > '9')) state.error("/syntax/se-1");
                    while (! state.eof() && (state.current() >= '0' && state.current() <= '9')) state.advance();
                }
                if (state.current() === 'e' || state.current() === 'E')
                {
                    // parse exponent
                    type = "real";
                    state.advance();
                    if (state.current() === '+' || state.current() === '-') state.advance();
                    if (state.current() < '0' || state.current() > '9') state.error("/syntax/se-1");
                    while (! state.eof() && (state.current() >= '0' && state.current() <= '9')) state.advance();
                }
            }
            let value = state.source.substring(start, state.pos);
            let n = parseFloat(value);
            if (where) state.set(where); else state.skip();
            tok = {"type": type, "value": n, "code": value, "line": line};
        }
        else if (c === '\"')
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
                if (c === '\\')
                {
                    state.advance();
                    let c = state.current();
                    state.advance();
                    if (c === '\\') c = '\\';
                    else if (c === '\"') c = '\"';
                    else if (c === 'r') c = '\r';
                    else if (c === 'n') c = '\n';
                    else if (c === 't') c = '\t';
                    else if (c === 'f') c = '\f';
                    else if (c === 'b') c = '\b';
                    else if (c === '/') c = '/';
                    else if (c === 'u')
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
                else if (c === '\r' || c === '\n') state.error("/syntax/se-2");
                else if (c === '\"')
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
            if (Lexer.operators.indexOf(c) >= 0)
            {
                let op = c;
                if (state.current() === '/' && c === '/') { state.advance(); op += '/'; }
                if (state.current() === '=' && c !== ':') { state.advance(); op += '='; }
                if (op !== "!")
                {
                    if (where) state.set(where); else state.skip();
                    tok = {"type": "operator", "value": op, "code": op, "line": line};
                }
            }
            if (tok === null)
            {
                let type:any = null;
                if (Lexer.groupings.indexOf(c) >= 0) type = "grouping";
                else if (Lexer.delimiters.indexOf(c) >= 0) type = "delimiter";
                else state.error("/syntax/se-5", [c]);
                if (where) state.set(where); else state.skip();
                tok = {"type": type, "value": c, "code": c, "line": line};
            }
        }

        if (options.checkstyle && ! state.builtin())
        {
            // check for indentation problems
            if (tok.type === "keyword" && (tok.value === "public" || tok.value === "protected" || tok.value === "private"))
            { }
            else if (tok.type === "operator" && tok.value === ":")
            { }
            else
            {
                let topmost = state.indent[state.indent.length - 1];
                if (topmost < 0 && line !== -1-topmost)
                {
                    if (indent <= state.indent[state.indent.length - 2]) state.error("/style/ste-1");
                    state.indent[state.indent.length - 1] = indent;
                }
                else if (indent < topmost && state.current() !== '}') state.error("/style/ste-1");
            }
        }

        return tok;
    }

    // This function checks whether the next token is a keyword. If so then
    // the keyword is returned without altering the state, otherwise the
    // function returns the empty string.
    public static peek_keyword(state)
    {
        let where = state.get();
        state.skip();
        if (state.eof()) return "";

        let c = state.current();
        if ((c >= 'A' && c <= 'Z') || (c >= 'a' && c <= 'z') || c === '_')
        {
            // parse an identifier or a keyword
            let start = state.pos;
            state.advance();
            while (state.good())
            {
                let c = state.current();
                if ((c >= 'A' && c <= 'Z') || (c >= 'a' && c <= 'z') || (c >= '0' && c <= '9') || c === '_') state.advance();
                else break;
            }
            let value = state.source.substring(start, state.pos);
            state.set(where);
            if (Lexer.keywords.hasOwnProperty(value)) return value;
            else return "";
        }
        else
        {
            state.set(where);
            return "";
        }
    }
}