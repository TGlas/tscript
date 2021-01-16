// CodeMirror mode "text/tscript"

(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("../../lib/codemirror"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
"use strict";

CodeMirror.defineMode("text/tscript", function(config, parserConfig)
{
	const keywords = {
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
	const builtins = {
			"Null": true,
			"Boolean": true,
			"Integer": true,
			"Real": true,
			"String": true,
			"Array": true,
			"Dictionary": true,
			"Function": true,
			"Range": true,
			"Type": true,
		};
	const digits = "0123456789";
	const operators = "=<>!^+-*/%:";
	const groupings = "()[]{}";
	const delimiters = ",;.";

	// Interface
	return {
		startState: function()
		{
			return {
				"prev": null,
				"blockcomment": false,
				"indent": 0,
			};
		},

	    token: function(stream, state)
	    {
			state.indent = stream.indentation();
			state.prev = null;

			stream.eatSpace();

			if (state.blockcomment)
			{
				let star = false;
				while (! stream.eol())
				{
					let c = stream.next();
					if (c == '#')
					{
						if (star)
						{
							state.blockcomment = false;
							break;
						}
					}
					star = (c == '*');
				}
				return "comment";
			}

			var s = "";
			var type = null;
			var err = false;
			let c = stream.next();
			if ((c >= 'A' && c <= 'Z') || (c >= 'a' && c <= 'z') || c == '_')
			{
				// parse an identifier or a keyword
				type = "variable";
				s += c;
				while (! stream.eol())
				{
					let c = stream.next();
					if ((c >= 'A' && c <= 'Z') || (c >= 'a' && c <= 'z') || (c >= '0' && c <= '9') || c == '_') s += c;
					else { stream.backUp(1); break; }
				}
				if (keywords.hasOwnProperty(s)) type = "keyword";
				else if (builtins.hasOwnProperty(s)) type = "builtin";
			}
			else if (c >= '0' && c <= '9')
			{
				// parse a number, integer or float
				type = "atom";
				s += c;
				while (! stream.eol())
				{
					c = stream.next();
					if (digits.indexOf(c) >= 0) s += c;
					else { stream.backUp(1); break; }
				}
				if (! stream.eol())
				{
					if (! stream.eol())
					{
						c = stream.next();
						if (c == '.')
						{
							// parse fractional part
							s += c;
							type = "number";
							if (stream.eol()) err = true;
							else
							{
								c = stream.next();
								if (digits.indexOf(c) >= 0) s += c;
								else err = true;
								while (! stream.eol())
								{
									c = stream.next();
									if (digits.indexOf(c) >= 0) s += c;
									else { stream.backUp(1); break; }
								}
							}
						}
						else stream.backUp(1);
					}

					if (! stream.eol())
					{
						c = stream.next();
						if (c == 'e' || c == 'E')
						{
							// parse exponent
							s += c;
							type = "number";
							c = stream.next();
							if (c == '+' || c == '-') { s += c; c = stream.next(); }
							if (digits.indexOf(c) < 0) err = true;
							else if (c !== null) s += c;
							while (! stream.eol())
							{
								c = stream.next();
								if (digits.indexOf(c) >= 0) s += c;
								else { stream.backUp(1); break; }
							}
						}
						else stream.backUp(1);
					}
				}
				try
				{
					let n = parseFloat(s);
					if (type == "atom" && (n > 2147483647)) type = "number";
				}
				catch (ex)
				{
					err = true;
				}
			}
			else if (c == '\"')
			{
				// parse string token
				type = "string";
				while (true)
				{
					if (stream.eol()) { err = true; break; }
					c = stream.next();
					if (c == '\\')
					{
						c = stream.next();
						if (c == 'r') c = '\r';
						else if (c == 'n') c = '\n';
						else if (c == 't') c = '\t';
						else if (c == '\\') c = '\\';
						else err = true;
					}
					else if (c == '\"') break;
				}
			}
			else if (operators.indexOf(c) >= 0)
			{
				type = "operator";
				s += c;
				while (! stream.eol())
				{
					c = stream.next();
					if (operators.indexOf(c) >= 0) s += c;
					else { stream.backUp(1); break; }
				}
			}
			else if (c == "#")
			{
				type = "comment";
				if (! stream.eol() && stream.next() == "*")
				{
					let star = false;
					while (! stream.eol())
					{
						c = stream.next();
						if (c == '#')
						{
							if (star) return type;
						}
						star = (c == '*');
					}
					state.blockcomment = true;
				}
				else
				{
					stream.skipToEnd();
				}
			}
			else if (groupings.indexOf(c) >= 0)
			{
				state.prev = c;
				type = "bracket";
			}
			else if (delimiters.indexOf(c) >= 0) type = "punctuation";
			stream.eatSpace();

			if (err) return (type) ? (type + " error") : "error";
			else return type;
	    },

		indent: function(state, textAfter)
		{
			if (textAfter && textAfter[0] == '}') return (state.prev == '{') ? state.indent : state.indent - 4;
			else if (state.prev == '{') return state.indent + 4;
			else return CodeMirror.Pass;
		},

		electricInput: /^\s*[{}]$/,
		blockCommentStart: "#*",
		blockCommentEnd: "*#",
		lineComment: "#",
		fold: "brace"
	};
});

});
