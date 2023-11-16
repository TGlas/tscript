import { Documentation } from ".";

export const doc_language: Documentation = {
	id: "language",
	name: "The TScript Language",
	title: "Reference Documentation for the TScript Programming Language",
	content: `
	<p>
	This is the reference documentation of the TScript programming
	language. It covers all language features in great detail and with
	precision.
	</p>
`,
	children: [
		{
			id: "syntax",
			name: "Syntax",
			title: "Syntax",
			content: `
		<p>
		The syntax of the TScript language specifies whether a text is
		a well-formed (valid) or ill-formed (invalid) program. A
		well-formed program can be executed, while trying to run
		an ill-formed (or malformed) program results in an error
		message already before the program starts. The syntax is
		specified in terms of an
		<a target="_blank" href="https://en.wikipedia.org/wiki/Extended_Backus%E2%80%93Naur_form">Extended Backus-Naur Form (EBNF)</a>.
		</p>
		<p>
		The documents within this section define various general aspects
		of the TScript syntax. For completeness sake, we also provide a
		<a href="?doc=/language/syntax/EBNF-syntax">complete formal EBNF definition of the TScript syntax</a>.
		</p>
	`,
			children: [
				{
					id: "character-set",
					name: "Character Set",
					title: "Character Set",
					content: `
			<p>
			TScript source code consists of unicode characters from the
			<a target="_blank" href="https://en.wikipedia.org/wiki/Plane_(Unicode)#Basic_Multilingual_Plane">Basic Multilingual Plane</a> (BMP).
			These characters have codes in the range U+0000 to U+FFFF.
			In other words, each character (or "code point") can be
			represented as an unsigned 16-bit integer.
			</p>
			<p>
			However, this document does not specify the <i>character
			encoding</i>, but only the <i>character set</i>. So for
			example UTF-8 encoded text is fine, as long as it does not
			contain code points above U+FFFF.
			</p>
			<p>
			Outside of
			<a href="?doc=/language/syntax/comments">comments</a> and
			<a href="?doc=/language/expressions/literals/strings">string literals</a>,
			only the printable ASCII range U+0020 to U+007E and the
			ASCII control characters U+0009 (horizontal tabulator),
			U+000A (line feed), and U+000D (carriage return) are valid.
			</p>
			<p>
			Inside comments and string literals, the full range U+0000
			to U+FFFF is legal. Every character can be denoted in plain
			ASCII by means of an escaping mechanism.
			</p>
			<p>
			<b>Note:</b>
			The TScript implementation is based directly on Javascript
			(ECMAScript&nbsp;6). Javascript allows its implementations
			to support the complete unicode range by composing
			characters outside the BMP with the UTF16 encoding, but this
			feature is not mandatory. In practice, Javascript engines do
			support the mechanism, which amounts to representing the
			unicode characters outside the BMP with two characters in
			the range U+0000 to U+FFFF. This solution is error-prone.
			For example, it is somewhat surprising if a string that
			prints as a single character consists of two characters, as
			revealed by the size method and when accessing the
			characters, slicing the string, etc. It is therefore
			recommended to restrict string contents to the BMP.
			</p>
		`,
					children: [],
				},
				{
					id: "tokens",
					name: "Tokens",
					title: "Tokens",
					content: `
			<p>
			A TScript program consists of a sequence of tokens. Each
			token is a meaningful and often short string of characters
			with clear semantics. Tokens can be separated by whitespace,
			comments, other terminals, or they can be self-delimiting.
			A sequence of input characters that does not match any of
			the token types results in a syntax error. In this documentation
            the red-written expressions need to be replaced by the corresponding
            tokens. The "|" denote the logical or, "()" enclose connected tokens.
            "[]" express that the inner expressions are optional and therefore can
            be chosen zero or one times, "{}" express that the inner expressions can
            be chosen zero or n times.
			</p>

			<h2>Whitespace and Comments</h2>
			<p>
			Whitespace and
			<a href="?doc=/language/syntax/comments">comments</a> are not
			by themselves considered tokens, but they separate tokens
			and therefore they must be defined:
			<ebnf>
				whitespace = " " | tabulator | carriage-return | line-feed ;
				tabulator = $ U+0009 $ ;
				carriage-return = $ U+000A $ ;
				line-feed = $ U+000D $ ;
				comment = line-comment | block-comment ;
				line-comment = "#", (unicode-char - "*" - line-feed),
				                   { unicode-char - line-feed } ;                           # example: # this is a comment
				block-comment = "#*", { (unicode-char - "*")                                # example: #* this is a
				                        | ("*", { "*" }, (unicode-char - "#"))              #             multiline comment *#
				                      }, "*#" ;
				unicode-char = $ any Unicode character U+0000 to U+FFFF $ ;
			</ebnf>
			</p>

			<h2>Identifiers and Keywords</h2>
			<p>
			An identifier is defined as follows:
			<ebnf>
				identifier = id_or_key - keyword ;                                          # example: _x, x, X, x2 are correct identifiers
				id_or_key = (letter | "_"), { letter | digit | "_" } ;                      # example: 2X, 3x, var  are incorrect identifiers
				letter = "A" | "B" | "C" | "D" | "E" | "F" | "G"
				       | "H" | "I" | "J" | "K" | "L" | "M" | "N"
				       | "O" | "P" | "Q" | "R" | "S" | "T" | "U"
				       | "V" | "W" | "X" | "Y" | "Z" | "a" | "b"
				       | "c" | "d" | "e" | "f" | "g" | "h" | "i"
				       | "j" | "k" | "l" | "m" | "n" | "o" | "p"
				       | "q" | "r" | "s" | "t" | "u" | "v" | "w"
				       | "x" | "y" | "z" ;
				digit = "0" | "1" | "2" | "3" | "4" | "5" | "6"
				      | "7" | "8" | "9" ;
				keyword = $ list of TScript keywords $ ;
			</ebnf>
			It is essentially a non-empty name consisting of letters,
			digits and underscores that does not start with a digit.
			For the definition of <ebnf>keyword</ebnf> see the
			<a href="?doc=/language/syntax/keywords">list of keywords</a>.
			</p>

			<h2>Integers</h2>
			<p>
			An integer is simply defined as a non-empty sequence of
			digits:
			<ebnf>
				integer = digit, { digit } ;
			</ebnf>
			Too large tokens exceeding the
			<a href="?doc=/language/types/integer">integer</a> range result
			in an error message when parsing the literal formed from the
			token.
			</p>

			<h2>Reals</h2>
			<p>
			A real must contain a fractional part, or an exponent, or both:
			<ebnf>
				real = integer, ".", integer                                                # example: 2.523
					 | integer, ("e" | "E"), [ "+" | "-" ], integer                         # example: 1e2, 1e-5
				     | integer, ".", integer, ("e" | "E"), [ "+" | "-" ], integer ;         # example: 1.5e3
			</ebnf>
			</p>

			<h2>Strings</h2>
			<p>
			Simple strings are character sequences enclosed in double
			quotes. A string token can contain escape sequences. It is
			defined as follows:
			<ebnf>
				string = '"', { (unicode-char - "\\" - line-feed) | escape }, '"' ;
				escape = "\\", "\\"
				       | "\\", '"'
				       | "\\", "r"
				       | "\\", "n"
				       | "\\", "t"
				       | "\\", "f"
				       | "\\", "b"
				       | "\\", "/"
				       | "\\", "u", hex, hex, hex, hex ;
				hex = digit | "A" | "B" | "C" | "D" | "E" | "F"
				            | "a" | "b" | "c" | "d" | "e" | "f" ;
			</ebnf>
			A <a href="?doc=/language/expressions/literals/strings">string literal</a>
			can consist of multiple such tokens.
			</p>

			<h2>Operators, Groupings, and Separators</h2>
			<p>
			For these simple token types, we let the definition speak
			for itself. Note that some operators start with a shorter
			sequence that also forms an operator. The token is always
			the longest possible sequence.
			</p>
			<ebnf>
				operator = arithmetic_op | compare_op | assign-op ;
				binary-op = "+" | "-" | "*" | "/" | "//" | "%" | "^" ;
				compare_op = "==" | "!=" | "<" | "<=" | ">" | ">=" ;
				assign-op = "=" | "+=" | "-=" | "*=" | "/=" | "%=" | "^=" ;
				grouping = "(" | ")" | "[" | "]" | "{" | "}" ;
				separator = "," | "." | ";" ;
			</ebnf>
		`,
					children: [],
				},
				{
					id: "keywords",
					name: "Keywords",
					title: "List of Keywords",
					content: `
			<p>
			Certain identifier names are disallowed, namely the
			so-called keywords. Here is a complete list of all TScript
			keywords in alphabetical order:
			</p>
			<ul>
				<li><keyword>and</keyword></li>
				<li><keyword>break</keyword></li>
				<li><keyword>case</keyword></li>
				<li><keyword>catch</keyword></li>
				<li><keyword>class</keyword></li>
				<li><keyword>const</keyword></li>
				<li><keyword>constructor</keyword></li>
				<li><keyword>continue</keyword></li>
				<li><keyword>default</keyword></li>
				<li><keyword>do</keyword></li>
				<li><keyword>else</keyword></li>
				<li><keyword>enum</keyword></li>
				<li><keyword>export</keyword></li>
				<li><keyword>false</keyword></li>
				<li><keyword>for</keyword></li>
				<li><keyword>from</keyword></li>
				<li><keyword>function</keyword></li>
				<li><keyword>if</keyword></li>
				<li><keyword>import</keyword></li>
				<li><keyword>include</keyword></li>
				<li><keyword>module</keyword></li>
				<li><keyword>namespace</keyword></li>
				<li><keyword>not</keyword></li>
				<li><keyword>null</keyword></li>
				<li><keyword>operator</keyword></li>
				<li><keyword>or</keyword></li>
				<li><keyword>private</keyword></li>
				<li><keyword>protected</keyword></li>
				<li><keyword>public</keyword></li>
				<li><keyword>return</keyword></li>
				<li><keyword>static</keyword></li>
				<li><keyword>super</keyword></li>
				<li><keyword>switch</keyword></li>
				<li><keyword>then</keyword></li>
				<li><keyword>this</keyword></li>
				<li><keyword>throw</keyword></li>
				<li><keyword>true</keyword></li>
				<li><keyword>try</keyword></li>
				<li><keyword>use</keyword></li>
				<li><keyword>var</keyword></li>
				<li><keyword>while</keyword></li>
				<li><keyword>xor</keyword></li>
			</ul>
			<p>
			Not all keywords are used in the current version of the language,
			some are reserved for future extensions.
			</p>
		`,
					children: [],
				},
				{
					id: "comments",
					name: "Comments",
					title: "Line and Block Comments",
					content: `
			<p>
			Comments are pieces of program code without any semantic
			meaning. In other words, comments are ignored when running
			the program. While being ignored by the machine, they are
			intended to be read by humans, usually for the purpose of
			documentation. In TScript there are two types of comments:
			line comments and block comments.
			</p>
			<h2>Line Comments</h2>
			<p>
			Line comments start with the token
			<code class="code">#</code> not immediately followed by
			<code class="code">*</code> and extend to the end of the
			line. One beneficial property of line comments is that they
			can be nested, i.e.,
			<tscript>
				# # a nested line comment
			</tscript>
			is still a valid comment, since the fact that a comment is
			inside another comment is ignored.
			</p>
			<h2>Block Comments</h2>
			<p>
			Block comments start with <code class="code">#*</code> and end with
			<code class="code">*#</code>. In contrast to line comments, block
			comments are entirely free in their extent. They may span
			only a small part of a line or even multiple lines. The price to pay is that
			block comments cannot be nested, since in
			<div class="code"><pre class="code"><code class="code"><span class="code-comment">#* a broken #* block *#</span> comment *#</code></pre></div>
			the comment ends with the <i>first</i> occurrence of
			<code class="code">*#</code>, so that <code class="code">comment *</code> is
			interpreted as program code (which is most probably malformed),
			and the final <code class="code">#</code> as the start of a
			line comment.
			</p>
		`,
					children: [],
				},
				{
					id: "lexical-blocks",
					name: "Lexical Blocks and Separators",
					title: "Lexical Blocks and Separators",
					content: `
			<p>
			In TScript, whitespace is useful for separating tokens, but
			it is insignificant for separating language constructs like
			definitions, statements, and directives. In particular,
			indentation is optional, and statements can extend beyond
			the end of the current line. Instead, declarations and
			statements are delimited by keywords and, in most cases,
			with a semicolon&nbsp;<tscript>;</tscript>. This means that
			in many cases the tokens in between semicolons form a single
			statement.
			</p>
			<p>
			Another useful structural property of the TScript language that
			becomes apparent already at the lexical level are parentheses
			<code class="code">( )</code>, square brackets <code class="code">[ ]</code>,
			and curly braces <code class="code">{ }</code>. The TScript syntax
			is designed so that opening and closing tokens must always match.
			For example, when encountering the sequence of tokens
			<code class="code">{(</code> then <code class="code">)</code> is fine, while
			encountering <code class="code">}</code> first indicates a syntax error.
			<tscript do-not-run>
{
	()
}           # this is okay

{
	(
} )         # this is not
			</tscript>
			</p>
		`,
					children: [],
				},
				{
					id: "EBNF-syntax",
					name: "Complete EBNF Syntax",
					title: "Complete Formal EBNF Definition of the TScript Syntax",
					content: `
			<p>
			This section collects all syntax rules for reference.
			</p>

			<ebnf>
			whitespace = " " | tabulator | carriage-return | line-feed ;
			tabulator = $ U+0009 $ ;
			carriage-return = $ U+000A $ ;
			line-feed = $ U+000D $ ;
			comment = line-comment | block-comment ;
			line-comment = "#", (unicode-char - "*" - line-feed),
			                   { unicode-char - line-feed } ;
			block-comment = "#*", { (unicode-char - "*")
			                       | ("*", { "*" }, (unicode-char - "#"))
			                     }, "*#" ;
			unicode-char = $ any Unicode character U+0000 to U+FFFF $ ;
			identifier = id_or_key - keyword ;
			id_or_key = (letter | "_"), { letter | digit | "_" } ;
			letter = "A" | "B" | "C" | "D" | "E" | "F" | "G"
			       | "H" | "I" | "J" | "K" | "L" | "M" | "N"
			       | "O" | "P" | "Q" | "R" | "S" | "T" | "U"
			       | "V" | "W" | "X" | "Y" | "Z" | "a" | "b"
			       | "c" | "d" | "e" | "f" | "g" | "h" | "i"
			       | "j" | "k" | "l" | "m" | "n" | "o" | "p"
			       | "q" | "r" | "s" | "t" | "u" | "v" | "w"
			       | "x" | "y" | "z" ;
			digit = "0" | "1" | "2" | "3" | "4" | "5" | "6"
			      | "7" | "8" | "9" ;
			keyword = "and" | "break" | "catch" | "class" | "constructor"
			        | "continue" | "do" | "else" | "false" | "for" | "from"
			        | "function" | "if" | "namespace" | "not" | "null"
			        | "or" | "private" | "protected" | "public" | "return"
			        | "static" | "super" | "then" | "this" | "throw"
			        | "true" | "try" | "use" | "var" | "while" | "xor" ;

			integer = digit, { digit } ;
			real = integer, ".", integer
				 | integer, ("e" | "E"), [ "+" | "-" ], integer
			     | integer, ".", integer, ("e" | "E"), [ "+" | "-" ], integer ;
			string = '"', { (unicode-char - "\\" - line-feed) | escape }, '"' ;
			escape = "\\", "\\"
			       | "\\", '"'
			       | "\\", "r"
			       | "\\", "n"
			       | "\\", "t"
			       | "\\", "f"
			       | "\\", "b"
			       | "\\", "/"
			       | "\\", "u", hex, hex, hex, hex ;
			hex = digit | "A" | "B" | "C" | "D" | "E" | "F"
			            | "a" | "b" | "c" | "d" | "e" | "f" ;

			operator = arithmetic_op | compare_op | assign-op ;
			binary-op = "+" | "-" | "*" | "/" | "//" | "%" | "^" ;
			compare_op = "==" | "!=" | "<" | "<=" | ">" | ">=" ;
			assign-op = "=" | "+=" | "-=" | "*=" | "/=" | "%=" | "^=" ;
			grouping = "(" | ")" | "[" | "]" | "{" | "}" ;
			separator = "," | "." | ";" ;

			declaration = var-decl
			            | func-decl
			            | class-decl
			            | namespace-decl ;

			var-decl = "var", single-var, { ",", single-var }, ";" ;
			single-var = identifier, [ "=", expression ] ;
			func-decl = "function", identifier, "(", param-list, ")", func-body ;
			param-list = [ param-decl, { ",", param-decl } ] ;
			param-decl = identifier, [ "=", constant-ex ] ;
			constant-ex = $ expression that evaluates to a constant $ ;
			func-body = "{", { declaration | statement | directive }, "}" ;
			class-decl = "class", identifier, [ ":", name ], class-body ;
			class-body = "{", "}" | "{", visibility, { visibility
			                                           | constructor
			                                           | [ "static" ], declaration
			                                           | directive },
			                        "}" ;
			visibility = ("public" | "procected" | "private"), ":" ;
			constructor = "constructor", "(", param-list, ")",
			         [ ":", "super", "(", [ expression, { ",", expression } ], ")", ],
			         func-body ;
			namespace-decl = "namespace", identifier, namespace-body ;
			namespace-body = "{", { declaration | statement | directive }, "}" ;

			directive = use ;
			use-directive = [ "from", name ], "use", name-import,
			                                     { ",", name-import }, ";" ;
			name-import = ("namespace", use-name)
			            | (use-name, [ "as", identifier ]) ;
			use-name = identifier, { ".", identifier } ;

			expression = literal
			           | group
			           | unary-operator
			           | binary-operator
			           | function-call
			           | item-access
			           | member-access
			           | name ;
			literal = null
			        | boolean
			        | integer
			        | real
			        | string, { string }
			        | array
			        | dictionary
			        | lambda ;
			null = "null" ;
			boolean = "true" | "false" ;
			array = empty-array | nonempty-array ;
			empty-array = "[", "]" ;
			nonempty-array = "[", expression, { ",", expression }, [ "," ], "]" ;
			dictionary = empty-dictionary | nonempty-dictionary ;
			empty-dictionary = "{", "}" ;
			nonempty-dictionary = "{", key-value, { ",", key-value }, [ "," ], "}" ;
			key-value = (string | identifier), ":", expression ;
			lambda = "function", [ closure ], "(", param-list, ")", func-body ;
			closure = "[", [ closure-param, { ",", closure-param, } ], "]" ;
			closure-param = [ identifier, "=" ], expression ;
			param-list = [ param-decl, { ",", param-decl } ] ;
			param-decl = identifier, [ "=", constant-ex ] ;
			constant-ex = $ expression that evaluates to a constant $ ;
			func-body = "{", { declaration | statement | directive }, "}" ;
			name = ("super", ".", identifier) | (identifier, {".", identifier}) ;

			block = "{", { declaration | statement | directive }, "}" ;
			assignment = lhs, assign-op, expression, ";" ;
			lhs = name
			        | expression, "[", expression, "]"
			        | expression, ".", identifier ;
			assign-op = "=" | "+=" | "-=" | "*=" | "/=" | "%=" | "^=" ;
			condition = "if", expression, "then", statement,
			                          [ "else", statement ] ;
			for-loop = "for", [ loop-var, "in" ], expression, "do", statement ;
			loop-var = ("var", identifier) | name ;
			while-do-loop = "while", expression, "do", statement ;
			do-while-loop = "do", statement, "while", expression, ";" ;
			break = "break", ";" ;
			continue = "continue", ";" ;
			return = "return", [ expression ], ";" ;
			throw = "throw", expression, ";" ;
			try-catch = "try", statement,
			            "catch", "var", identifier, "do", statement ;

			program = { declaration | statement | directive } ;
			</ebnf>
		`,
					children: [],
				},
			],
		},
		{
			id: "declarations",
			name: "Declarations",
			title: "Declarations",
			content: `
		<p>
		A declaration defines a named entity. Possible entities are variables,
		functions, classes, and namespaces. Hence, a declaration is defined
		formally as follows:
		<ebnf>
			declaration = var-decl
			            | func-decl
			            | class-decl
			            | namespace-decl ;
		</ebnf>
		The terms on the right hand side are defined in the following
		sub-sections.
		</p>
	`,
			children: [
				{
					id: "variables",
					name: "Variables",
					title: "Variables",
					content: `
			<p>
			A variable is a named entity referencing a value.
			</p>

			<h2>Syntax</h2>
			<p>
			Variables are declared with following syntax:
			<ebnf>
				var-decl = "var", single-var, { ",", single-var }, ";" ;    # var ex, am, ple;
				  single-var = identifier, [ "=", expression ] ;            # ex = 1, am, ple
			</ebnf>
			They are referenced by their name.
			</p>
			<div class="example">
				<h3>Example</h3>
				<tscript>
					var a, b=5, c=b+1;
					print(a);
					print(b + c);
				</tscript>
			</div>
			<p>
			At each time, a variable references exactly one value. Variables
			are untyped; they can refer to a values of any type, and the type
			can change during runtime.
            <tscript>
                var a = "this is a string";
                a = 45;                         # a is now an integer
            </tscript>
			If a variable is not initialized (like <code class="code">a</code>
			in the above example), then it is implicitly set to
			<keyword>null</keyword>. Therefore the following two statements
			are equivalent:
			<tscript>
				var x;
			</tscript>
			<tscript>
				var x = null;
			</tscript>
			The variable name must not appear anywhere in its initializer,
			i.e., in the expression on the right hand side of the equals sign.
			</p>
			<p>
			Multiple variables can refer to the same value.
			<a href="?doc=/language/statements/assignments">Assigning</a> a value
			to a variable only references the value, it does not copy the value.
			It is different from initialization, and the variable itself may
			appear on the right hand side, referring to the old value before
			the actual assignment takes place:
			<tscript>
var x = 3;              # initialization
x = 2 * x + 1;          # assignment

var a = [0, 1, 2];
var b = a;

print(b);               # prints [0, 1, 2]
a.push(3);
print(b);               # prints [0, 1, 2, 3] ==> b is a reference to a, not a copy

var c = [0, 1, 2];
var d = deepcopy(c);

print(d);               # prints [0, 1, 2]
c.push(3);
print(d);               # prints [0, 1, 2] ==> d only copied the value of c
			</tscript>
			</p>
			<p>
			Parameters of functions are also variables, although they are
			declared without <keyword>var</keyword>
			(see <a href="?doc=/language/declarations/functions">functions</a>).
			They are initialized to a value provided by the function
			call or to their default value, if present. Default values
			are limited to constant expressions.
            <tscript>
            function example(a = 2) {       # 2 is the default value for a
                return a;
            }

            print(example());               # prints 2

            print(example(3));              # prints 3
            </tscript>
			</p>
			<p>
			Variables inside classes are called attributes. These variables
			can be initialized, but the initializer must evaluate to a
			constant. Variable that should be initialized to a value
			computed at runtime can be set in the constructor.
            <tscript>
            class example {
                private:
                    var x = 2;              # has to be a constant
                    var y;
                public:
                    constructor(a) {
                        y = a;              # if you want to enable dynamic initialisation of y
                    }
            }
            </tscript>
			</p>
			<p>
			Closure parameters are somewhere in between the above two cases.
			They are stored inside the function closure like attributes in
			an object. Whenever the closure is called they are copied, and
			the copies become parameters of the function.
			</p>

			<h2>Lifetime of Variables</h2>
			<p>
			TScript distinguishes three types of variables:
			<ul>
				<li>Global variables are declared at global scope, in a namespace, or as static attributes of global classes. They are available for the whole runtime of the program.</li>
				<li>Local variables are declared in a non-global non-class scope, or as parameters of a function or closure. They are available inside their defining scope, or for closure parameters, inside the function body. After the scope is left they "go out of scope" and cannot be accessed any more.</li>
				<li>Attributes are declared in a class scope. Non-static attributes are part of an object, and hence their lifetime is bound to the lifetime of the object.</li>
			</ul>
            <tscript do-not-run>
            var x = 1;                      # global declaration
            {
                print(x);                   # works
                var y = 2;                  # local declaration
            }
            print(y);                       # does not work
            </tscript>
			It may seem at first glance that binding a variable to a closure extends its lifetime to the lifetime of the closure. This is not the case. Instead, values are <i>copied</i> into closure parameters, which are independent variables, as demonstrated here:
			<tscript>
				function f()
				{
					var x = 42;
					var ret = function [x] () { return x; };
					x *= 2;
					return ret;
				}
				print(f()());   # prints 42, not 84
			</tscript>
			</p>
		`,
					children: [],
				},
				{
					id: "functions",
					name: "Functions",
					title: "Functions",
					content: `
			<p>
			A function is a named block of code that can be invoked arbitrarily
			often, possibly with different parameter values.
			</p>

			<h2>Syntax</h2>
			<p>
			Functions are declared with the following syntax:
			<ebnf>
				func-decl = "function", identifier, "(", param-list, ")", func-body ;   # function example() {}
				  param-list = [ param-decl, { ",", param-decl } ] ;                    # (ex, am, ple)
				  param-decl = identifier, [ "=", constant-ex ] ;                       # ex or ex = 1
				  constant-ex = $ expression that evaluates to a constant $ ;
				  func-body = "{", { declaration | statement | directive }, "}" ;       # { . . . }
			</ebnf>
			It is referenced by its name, and invoked by
			<a href="?doc=/language/expressions/function-calls">providing
			values for the parameters in parentheses</a>. The effect of invoking a
			function is that the control flow is transferred to the function body.
			After the function body is left with a <keyword>return</keyword>
			statement or by reaching the end of the function body, the control flow
			is returned to the calling context.
			</p>
			<div class="example">
				<h3>Example</h3>
				<tscript>
					function circleArea(radius)
					{
						return math.pi() * radius * radius;
					}
					var func = circleArea;
					print(circleArea(3));   # prints 9*pi = 28.2743...
					print(func(3));         # prints 9*pi = 28.2743...
				</tscript>
			</div>
			<p>
			Parameters of functions are always named, with an optional default value.
			As can be seen in the above example, function names are valid expressions
			(of type <a href="?doc=/language/types/function">Function</a>).
			</p>
			<p>
			An alternative way to define functions are
			<a href="?doc=/language/expressions/literals/anonymous-functions">anonymous
			functions</a>.
			</p>
		`,
					children: [],
				},
				{
					id: "classes",
					name: "Classes",
					title: "Classes",
					content: `
			<p>
			A class declaration adds a new type to the program. Values or objects
			of this type can be instantiated by calling the type like a function.
			</p>

			<h2>Syntax</h2>
			<p>
			A class is declared with the following syntax:
			<ebnf>
				class-decl = "class", identifier, [ ":", name ], class-body ;
				  class-body = "{", [ directive ], "}"
				             | "{", [ directive ], visibility,
				                  { visibility
         				            | constructor
		         		            | [ "static" ], declaration
				                    | directive },
         				      "}" ;
				  visibility = ("public" | "procected" | "private"), ":" ;
				  constructor = "constructor", "(", param-list, ")",
				         [ ":", "super", "(", [ expression, { ",", expression } ], ")" ],
				         func-body ;
			</ebnf>
			Refer to <a href="?doc=/language/declarations/functions">functions</a>
			for a definition of <ebnf>param-list</ebnf> and <ebnf>func-body</ebnf>.
			</p>
			<div class="example">
				<h3>Example</h3>
				<tscript>
class Circle
{
    use namespace math;

	private:
		var m_radius = 0;

    public:
		constructor(radius=1)                         # constructor, gets called by "var c = Circle(5)" and sets m_radius to handed value; if no value is given, sets radius to 1 by default
		{
            m_radius = radius;
        }
		function radius()
		{ return m_radius; }
		function area()
    	{ return math.pi() * m_radius * m_radius; }
}

var c = Circle(3);
print("The circle has radius " + c.radius() + " and area " + c.area() + ".");       # prints "The circle has radius 3 and area 28.274333882308138."
var c2 = Circle();
print("The circle has radius " + c2.radius() + " and area " + c2.area() + ".");     # prints "The circle has radius 1 and area 3.141592653589793."
    			</tscript>
			</div>

			<h2>The Constructor</h2>
			<p>
			The constructor of a class is called whenever the class is instantiated,
			i.e., when a new object of that very class is created. Its role is to
			initialize the object's state, comprised by its attributes. Attributes
			can equally well be declared with a constant initializer. Non-constant
			(parameter-dependent) initialization is done in the constructor.
			Of course, the constructor can perform further tasks. Uninitialized
			members hold the value <keyword>null</keyword>.
			</p>
			<p>
			Classes with a public constructor can be instantiated from everywhere,
			and the same holds for classes without constructor (which implies the
			generation of a public default constructor). Constructors can also be
			protected or private. A class with private constructor can be
			instantiated only from within a method of the class, and the class
			cannot have sub-classes. A class with protected constructor can have
			sub-classes, since the constructor can be called from a sub-class
			constructor.
			</p>

			<h2>Static and Non-Static Members</h2>
			<p>
			Declarations inside the function body as known as members of the class.
			Members can be declared <keyword>static</keyword>. Static members belong
			to the class, not to its objects. For a static variable (also called a
			class variable) this means that a single instance of the variable with
			global lifetime exists, independent of the number of objects of the
			class. In contrast, the liftime of attributes (non-static variables) is
			bound to the object. A non-static function member is called a method.
			</p>
			<p>
			A public member of a class is referenced with the dot-operator, as seen
			in the example above. Inside the class, its members can be accessed by
			their names. The object itself, i.e., the left-hand-side of the
			<a href="?doc=/language/expressions/member-access">dot operator</a>,
			is available under the name <keyword>this</keyword>. A static function
			can be invoked without referring to an instance of the class, and hence
			<keyword>this</keyword> is undefined in a static function. The following
			example demonstrates static members:
			<tscript>
				class Counted
				{
				private:
					static var m_counter = 0;

				public:
					constructor() { m_counter += 1; }
					function doSomething() { #* dummy *# }
					static function numberOfInstances()
					{
						# doSomething();   # error; this is not defined
						# return this;     # error; this is not defined
						return m_counter;
					}
				}
				var a = Counted(), b = Counted(), c = Counted();
				print(Counted.numberOfInstances());
				print(a.numberOfInstances());
			</tscript>
			</p>

			<h2>Dynamic Dispatching</h2>
			<p>
			Member name lookup of the form <code class="code">a.numberOfInstances</code>
			in the above code happens dynamically at runtime. The result of the
			<a href="?doc=/language/expressions/member-access">member access</a> (and
			therefore, in this context, the invoked function) depends on the type
			of the left-hand-side, provided that multiple classes declare a member
			of the same name. This is an elegant mechanism for creating implicit
			switches in code based on the type of data it encounters. Referencing
			a member name that does not exist in the type (more precisely, in its
			public interface) results in an error message.
			</p>

			<h2>Visibility of Members</h2>
			<p>
			TScript classes allow for proper information hiding, i.e., they can
			hide implementation details behind a public or protected interface. From
			outside the class, only members declared <keyword>public</keyword> are
			visible, i.e., members following a <keyword>public</keyword> declaration.
			In addition, <keyword>protected</keyword> members are visible within
			sub-classes (see below), while <keyword>private</keyword> members are
			only visible within the class itself. It is common practice to declare
			most attributes as private to the class, and to provide access
			facilities in terms of protected and public methods.
			</p>
			<p>
			Also inside classes, the general principle that declarations can be
			used only after they were declared is applied. Therefore it is common
			practice to declare attributes towards the beginning of the class, so
			that they can be accessed by methods declared below them.
			</p>
			<p>
			Hiding information is not always necessary, and sometimes
			over-complicates matters. In some cases simple classes consisting
			only of public attributes are a meaningful choice. For example, the
			following class may represent a point in a two-dimensional coordinate
			system:
			<tscript>
				class Point
				{
				public:
					var x, y;

					constructor(x_, y_)
					{ x = x_; y = y_; }
				}

			</tscript>
			The same data can of course be held in an array
			<code class="code">[x,y]</code> or a dictionary
			<code class="code">{"x":x,"y":y}</code>, but the class has the
			advantages of making the role of the type and of its members explicit.
			This makes code more readable and more maintainable. Furthermore it
			adds the ability of code to test for its the data type to clarify the
			role of a value, which is not possible with generic containers since
			they are used for many purposes.
			</p>

			<h2>Inheritance</h2>
			<p>
			A class can be based on any other type, including all the
			<a href="?doc=/language/types">built-in types</a> (however, note that
			aggregation is often preferable over inheriting an immutable type).
			This means that the type, also known as the sub-class in this context,
			inherits all properties and members from its super-class.
			</p>
			<p>
			Subclassing is a common mechanism for extending the functionality of
			a type, and for creating a set of types with a uniform interface.
			The mechanism allows to override (generic) functionality of the base
			or super class with (specialized) functionality of the sub-class,
			simply by declaring a method of the same name as in the super class.
			This does not create a name conflict. When invoking such a method on
			an object of the sub-class then the dispatching rules dictate that the
			method declared in the sub-class is invoked, and the method in the
			super class is ignored.
			</p>
			<p>
			When implementing sub-classes, there regularly is the demand to access
			a super-class member of the same name or the super class constructor.
			This can be achieved with a special syntax for the constructor and for
			names based on the <keyword>super</keyword> keyword, as follows:
			<tscript>
class Person
{
	private:
		var m_name;
		var m_address;                                                      # m_name and m_address can only be accessed in Person

    protected:
        var m_example = 1;                                                  # m_example can be accessed in Person and in Person's heirs

	public:
		constructor(name, address)
		{
			m_name = name;
			m_address = address;
		}

		function description()
		{ return "name: " + m_name + "\\naddress: " + m_address + "\\n"; }  # the constructor and the function description can be accessed from anywhere
}

class Customer : Person
{
	private:
		var m_customerID;

    public:
		constructor(id, name, address):super(name, address)
		{ m_customerID = id; }

		function description()
		{
            # print(super.m_name);                                            # this does not work, since m_name is not visible in this slope

            print(super.m_example);                                           # this does work, since m_example is protected and therefore visible for Customer

            return "id: " + m_customerID + "\\n" + super.description();
        }
}

var c = Customer("1357", "Joe", "city center");
print(c.description());
            </tscript>
			</p>
		`,
					children: [],
				},
				{
					id: "namespaces",
					name: "Namespaces",
					title: "Namespaces",
					content: `
			<p>
			A namespace is a named scope designed to organize declarations.
			</p>

			<h2>Syntax</h2>
			Namespaces are declared with the following syntax:
			<p>
			<ebnf>
				namespace-decl = "namespace", identifier, namespace-body ;                 # namespace example {}
				  namespace-body = "{", { declaration | statement | directive }, "}" ;     # { . . . }
			</ebnf>
			Namespaces can only be declared at global scope or within other
			namespaces. However, the same namespace can be declared multiple
			times. The different declarations are treated as parts of the same
			namespace.
			</p>

			<div class="example">
				<h3>Example</h3>
				<tscript>
					namespace distributions
					{
						namespace detail
						{
							function gaussian()
							{
								var g = math.sin(2 * math.pi() * math.random());
								g *= math.sqrt(-2 * math.log(math.random()));
								return g;
							}
						}

						function uniform(lower, upper)
						{
							return lower + (upper - lower) * math.random();
						}

						function exponential(lambda)
						{
							return -math.log(math.random()) / lambda;
						}

						function gaussian(mu, sigma)
						{
							return mu + sigma * detail.gaussian();
						}
					}

					for var i in 0:20 do print(distributions.gaussian(1.5, 0.1));
				</tscript>
			</div>
			<p>
			Namespaces allow to keep globally accessible names out of the global
			scope. For large collections of declarations this greatly reduces the
			chance of name collisions. This is particularly important when working
			with large software libraries.
			</p>
			<p>
			As a price, the full names of declarations get longer, since the
			namespace name is prepended to the declared name, separated with a dot.
			This is not necessarily an issue since individual names and even whole
			namespaces can be <a href="?doc=/language/directives/use">imported</a> into
			the scopes where they are used. Since import is usually selective, name
			collisions are still rate.
			</p>
		`,
					children: [],
				},
			],
		},
		{
			id: "directives",
			name: "Directives",
			title: "Directives",
			content: `
		<p>
		A directive is an instruction to the TScript language that is
		not directly related to the program flow itself. It is neither a
		declaration nor a statement.
		<ebnf>
			directive = use ;
		</ebnf>
		Currently, the only directive is the
		<a href="?doc=/language/directives/use">use</a> directive. There exist
		plans to add directives for including external files and libraries
		in the future.
		</p>
	`,
			children: [
				{
					id: "use",
					name: "Using Names from Namespaces with Use Directives",
					title: "Using Names from Namespaces with Use Directives",
					content: `
			<p>
			A <keyword>use</keyword> directive imports names declared in a
			namespace directly into the current scope. This allows for
			easier access to names that are otherwise lengthy to write
			out. The syntax is as follows:
			<ebnf>
				use-directive = [ "from", name ], "use", name-import,
				                                     { ",", name-import }, ";" ;
				name-import = ("namespace", use-name)
				            | (use-name, [ "as", identifier ]) ;
				use-name = identifier, { ".", identifier } ;
			</ebnf>
			</p>
			<p>
			A <ebnf>name</ebnf> refers to a declaration inside
			a namespace, possibly to a namespace itself. The first form
			<ebnf do-not-check>namespace name</ebnf> imports all names <i>inside</i>
			the the referenced namespace into the current scope. The
			second form <ebnf do-not-check>name ["as" identifier]</ebnf> imports a
			single name. In the latter case the optional identifier is
			a new alias name under which the original declaration is
			made available. If it is not provided, then the last identifier
			of the fully qualified name is used, e.g., <code class="code">c</code>
			is used when importing the name <code class="code">a.b.c</code>.
			If <ebnf do-not-check>"from" name</ebnf> is provided,
			then all subsequent names are looked up in the context of
			the given namespace, not in the context of the current
			scope.
			</p>
			<div class="example">
				<h3>Example</h3>
				<tscript>
					namespace a {
					    namespace b {
					        var y = "hello";
					    }
					}
					# all of the print statements output "hello":
					print(a.b.y);
					{
					    use namespace a;
					    print(b.y);
					}
					{
					    use namespace a.b;
					    print(y);
					}
					{
					    use a.b.y;
					    print(y);
					}
					{
					    from a use namespace b;
					    print(y);
					}
					{
					    from a use b.y;
					    print(y);
					}
					{
					    from a.b use y;
					    print(y);
					}
					{
					    from a.b use y as z;
					    print(z);
					}
				</tscript>
			</div>
		`,
					children: [],
				},
			],
		},
		{
			id: "expressions",
			name: "Expressions",
			title: "Expressions",
			content: `
		<p>
		An expression is a computation that produces a value. The simplest atomic
		expressions are constants and names referring to declarations. Expressions
		can be combined by means of operators into more complex expressions.
		</p>

		<h2>Syntax</h2>
		<p>
		Here we list groups of expression types, which are further differentiated
		in a number of sub-sections.
		<ebnf>
			expression = literal
			           | group
			           | unary-operator
			           | binary-operator
			           | function-call
			           | item-access
			           | member-access
			           | name ;
		</ebnf>
		</p>

		<h2>Side Effects</h2>
		<p>
		Some expressions have side effects. A side effect is defined as an effect
		that is unrelated to the computation of the expression result. In many
		cases, the only purpose of evaluating such expressions is to invoke the
		side effects. A simple example is the
		<a href="?doc=/library/core">print</a> function:
		it prints its argument as a side effect and return <keyword>null</keyword>.
		In order to facilitate the invocation of such functions,
		<a href="?doc=/language/statements/expressions">expressions can be used as
		statements</a>.
		</p>
	`,
			children: [
				{
					id: "literals",
					name: "Literals",
					title: "Literals",
					content: `
		<p>
		TScript knows five types of atomic literals. From these,
		container-valued composite literals can be created. In addition,
		lambda functions are considered a special type of literal:
		<ebnf>
			literal = null
			        | boolean
			        | integer
			        | real
			        | string, { string }
			        | array
			        | dictionary
			        | lambda ;
		</ebnf>
		</p>
		`,
					children: [
						{
							id: "null",
							name: "The Null Literal",
							title: "The Null Literal",
							content: `
				<p>
				There is only one value of type
				<a href="?doc=/language/types/null">Null</a>,
				denoted by the keyword <keyword>null</keyword>:
				<ebnf>
					null = "null" ;
				</ebnf>
				It is commonly used to represent a "meaningless" value,
				or a yet uninitialized value.
				</p>
				<div class="example">
					<h3>Example</h3>
					<tscript>
						var a;             # a is implicitly set to null
						var b = null;      # b is explicitly set to null
						if b == null then print("b is null.");
					</tscript>
				</div>
			`,
							children: [],
						},
						{
							id: "booleans",
							name: "Boolean Literals",
							title: "Boolean Literals",
							content: `
				<p>
				The <a href="?doc=/language/types/boolean">Boolean</a> type represent the
				logical values <keyword>true</keyword> and <keyword>false</keyword>,
				both of which are keywords. They result from comparisons, and act as
				input to if-conditions and loop-statements:
				<ebnf>
					boolean = "true" | "false" ;
				</ebnf>
				</p>
				<div class="example">
					<h3>Example</h3>
					<tscript>
						var a = true;
						var b = false;
						var c = 3 == 5;     # assignment of false
						if c then
						    print("3 equals 5");
						else
						    print("3 differs from 5");
					</tscript>
				</div>
			`,
							children: [],
						},
						{
							id: "integers",
							name: "Integer Literals",
							title: "Integer Literals",
							content: `
				<p>
				An Integer literal represents a constant of type
				<a href="?doc=/language/types/integer">Integer</a>. It is denoted by
				an integer <a href="?doc=/language/syntax/tokens">token</a>.
				The value must lie in the integer range, i.e., it must not exceed
				2<sup>31</sup> - 1 = 2147483647.
				</p>
				<div class="example">
					<h3>Example</h3>
					<tscript>
						var a = 0;
						var b = 42;
						var c = -99;             # negated literal 99
						# var d = -2147483648;   # error, range exceeded
						var e = -2147483647-1;
					</tscript>
				</div>
			`,
							children: [],
						},
						{
							id: "reals",
							name: "Real Literals",
							title: "Real Literals",
							content: `
				<p>
				A Real literal represents a constant of type
				<a href="?doc=/language/types/real">Real</a>. It is denoted by a
				real <a href="?doc=/language/syntax/tokens">token</a>.
				</p>
				<p>
				There is no syntax for denoting the special IEEE floating point
				values INF (infinity) and NaN (not a number) as literals. Instead
				the functions <a href="?doc=/language/types/real">Real.inf()</a> and
				<a href="?doc=/language/types/real">Real.nan()</a> can be used to create such
				literals. The methods <a href="?doc=/language/types/real">Real.isFinite()</a>,
				<a href="?doc=/language/types/real">Real.isInfinite()</a>, and
				<a href="?doc=/language/types/real">Real.isNan()</a> test for degenerate values.
				Real numbers that exceed the range specified in the
				<a href="https://de.wikipedia.org/wiki/IEEE_754" target="_blank">IEEE 754 standard</a>
				overflow to positive or negative infinity, or underflow to zero.
				</p>
				<div class="example">
					<h3>Example</h3>
					<tscript>
var a = 4;                      # not a real, but an integer
var b = 4.0;                    # real literal representing 4
var c = 4e0;                    # real literal representing 4
var d = 400e-2;                 # real literal representing 4
var e = 0.04e2;                 # real literal representing 4
var f = -123.456e+78;           # negated literal 123.456e+78
var g = 1E1000;                 # overflow to infinity
var h = 1E-1000;                # underflow to zero
var pi = 3.1415926535897931;    # full precision literal

var inf = Real.inf();           # sets inf to mathematical infinity
var nan = Real.nan();           # sets nan to the special constant NaN (not-a-number)

print(inf.isInfinite());        # prints true
print(nan.isNan());             # prints true

					</tscript>
				</div>
			`,
							children: [],
						},
						{
							id: "strings",
							name: "String Literals",
							title: "String Literals",
							content: `
				<p>A <a href="?doc=/language/types/string">String</a>
				literal consists of a sequence of
				<a href="?doc=/language/syntax/tokens">string tokens</a>,
				each of which is text enclosed in double quotes within a
				single line of code. String tokens must be separated only
				by whitespace including newlines, and comments.
				</p>
				<p>
				Every
				<a href="?doc=/language/syntax/character-set">character</a>
				in between the double quotes is a part of the text
				belonging to the string literal, with one exception: the
				backslash '\\' acts as a so-called escape character. This
				character introduces an escape sequence with a special
				meaning, as follows:
				</p>
				<ul>
					<li><code class="code">\\\\</code> represents a single backslash (ASCII 92)</li>
					<li><code class="code">\\"</code> represents double quotes (ASCII 34)</li>
					<li><code class="code">\\t</code> represents a horizontal tabulator (ASCII 9)</li>
					<li><code class="code">\\r</code> represents a carriage return (ASCII 13)</li>
					<li><code class="code">\\n</code> represents a line feed (ASCII 10)</li>
					<li><code class="code">\\f</code> represents a form feed (ASCII 12)</li>
					<li><code class="code">\\b</code> represents a backspace (ASCII 8)</li>
					<li><code class="code">\\/</code> represents a slash (ASCII 47)</li>
					<li><code class="code">\\uXXXX</code> represents any Unicode character, where XXXX is the 4-digit hexadecimal code of the character (or code point)</li>
				</ul>
				<div class="example">
					<h3>Example</h3>
					<tscript>
print("hello world");                                       # prints: hello world
print("this string prints "                                 # prints: this string prints on a single line
        "on a single line");
print("this string prints\\non two lines");                 # prints: this string prints
                                                            #         on two lines
print("a quote \\"Alea iacta est!\\" inside a string");     # prints: a quote "Alea iacta est!" inside a string
print("escaped Euro sign: \\u20AC");                        # prints: escaped Euro sign: \u20AC
print("multi "                                              # prints: multi line string literal
      "line "
      "string "
      "literal");
					</tscript>
				</div>
			`,
							children: [],
						},
						{
							id: "arrays",
							name: "Array Literals",
							title: "Array Literals",
							content: `
				<p><a href="?doc=/language/types/array">Array</a>
				literals are comma-separated sequences of expressions enclosed
				in square brackets. The results of evaluating the expressions
				become the items of the array literal:
				<ebnf>
					array = empty-array | nonempty-array ;
					  empty-array = "[", "]" ;
					  nonempty-array = "[", expression, { ",", expression }, [ "," ], "]" ;
				</ebnf>
				</p>
				<div class="example">
					<h3>Example</h3>
					<tscript>
						var a = [];                     # empty array
						var b = [16, true, "hello"];
						var c = [["nested", "array"], "literal"];
						var d = [c, 7*b[0], 2^10];
					</tscript>
				</div>
                <p>
                <center>
                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAoQAAAEvCAAAAAGO6L+1AAAR4klEQVR42u2c25aqSBBE5zE+Nn4xfi3XLCoPXcqtubaFRMx0i1CmyXaLSHP4L87Of5dWRNSM53Fq6r4VxQjyzIrAyT0q0D7HIxUfaTgmK2K5Iv4twaDOYkX8e2D5wbjH/L27on5G5YKcwKaKWMNxS8XMRRXPSCOGf4AjcGGPKFtL1sGpJDZWFNvneHbFu+2lTIS71pp16zrKnoqlD/LMiq894mcYah0qkFMh9YvA+Yo6e60zF1WMcfj1ht+oIGNr8DNxh4JABMlTC3ZpuGD7L4rF7sLxSGzQprsBBgVZZwGhTR2OC6JUIWt9bigojBcfZHhZQZyQa8XGaCKweZWvKIiTC2K6Q6E3UoHQ0YIlaIXhYsFGN7BXfh2oC9evslYxxMY9B00XPNwhxODwG4HGRiqXLW1gT+wwLiy4EHyl2G3mth0iRuFambh/HsZz3OF5HaLpDql/i9ilxQ4jdINX+X4dNpSZDjkOuHLm2nFYNeuTrzJWv8r4gw5xsENgZigRodcnFkJUqJ8N5giWx0gBXNHhwhYb9WsZ83eZhTqu3kCXMeSqzxR87FXOuMOpeV++xcbKfI4hsOpJ3GF2WOeTpHIS4Ntosowixh0SdaZ0bYcAwPrUeHkY+7ugyhT6YfmbLM3rqlcZUNuvcvse3nJr01DmGB7IJQzFcYdrnmSqm0d2iOUOmTdEma7Rv270+ijWDhXQ+Knzb2fc0eHoMwXlt0iFUDfgLJPMe7UbSLmozpPE0PtTS/lFYhvDpND0qxxxyw7ZSG68xW4o7tAdLqe1DnlgHPfW0yc7VFMdyh26w986BIlyjySb7HDlSSv6YIdA4x3i9Q+PjXaoxhl2N413GO7QHc6nsf3DubTzF/DP5Ls8PLvD+KYOcX2H8dEOUW8u65Dg/LPjrUMqNOgDipDKOF7GMNsgAIzH6K3DnBJq5zmZVXBZh+LCGEx2GOMOeWWHmGWI0NA6UAG+dgjkgitf5XNyVYdA4x12cYdP7BCt5MZ7sA1lrkOsit8p7vBJHQJQ4x1GzB8/5MzzEu+FMrykQ84BBKRgd8vBHuIQulDX4sIOR1s49Hvf1PuDiEEfUA6/8FVm2x7Ke7DusNEOv3nfxnuw7WXWw935Mw+xJvqzdwpiX9zhbToEUf8C3mKHmGZIvN3jsCP8u89QYKJDIZSjxtdH1Ckd5kwyb/neAl87FhEhDRliAmg+jPsYjl9l5POK5SfDpEbGoMOQNOxQgsa74hK4rUMhgNgY/qGHedP2eznCHT6zQ7aSO+8fthN3+IQOm48RGuFSGkTIVQG4MjhQ8Ppx4IpsRYiVoM+tF+S548SzuhO+DKGM0AiN0AiPIUQXGuF+hBpcvQQ/2YNQT0Q4fwEYI1yJEKAtPISQkC08amEXGmEzOzVGaIRG2DRCZxgfcvVR6ybibaE/TozwEwgD5yMEvgJh4JkIlwcr9NUIlfcJzCEkf6mHwLBszqgj7oIQIFFRiH0WiyKrzFooQl11RblVN5gY1QPEJEX2CEEB93sjE9xWFOWxJLRgYY5KhOiiEcL8QZecygfeEGEAOxAqK00iFP6NIkJQhTGBMCuVqfxfN0RIcMMbubeGgAajHvmJDJTfe4sa4c91aoywjW8nRmiERtg0QseHXM+P/3ZyNDu2hThzi/TEbaERGqERto6QlBHuRVhPMOTwo5cTR5k5XzGI+tRTI+vsipBZd6oa74OQ0Fpv2P2IZc3KD6gyKYoh5VP3aESGhADLczAPvI4szMpk+QEIIUK3shADhOyjybceyiTAgial7W45emoBPVYi+WcmEEqBn+q8G0Jhbvw8QgESmF6lZWOEhHqEKGO/d1tIlPDqjxN9L0Lv1BihERqhEfpgl08Unkt7h1yds08UPp4Hbgv3QDx+wu63IcR5K/J9CAUaoRF+DiEAyAj3IyRQ7oKx4qg1F2ozWBdDM+TUT7AfpuD8ywVyvG5dEUILK51L0a8oeCVCYOsbGSCDyqPSoEQqQHDw1CJZBgMkxVw4tlBBgoGsmI+atTAXafBU03ezX5b/8YcIly3MiepIdpeNjhCqG5eLFEwVphGWYfkQMbAKIRdWeoDscoRMbtdvC8cIa3TjbWEQXcIfJ961NsLHIDwtT0X4gXwVQseHXI2wzRihES7FCG8SIzTCpRjhTWKERrgUI7xJtiDkuoArAxwqeHzc8e62Izz3zBvy2gMw119nHzJCIzRCIzRCIzRCIzRCIzRCI2wMIdHlzxHqexASIF8Zso+McB1CDa8ugD40wi3bQkJ+Ix9DKNAID36cGOGhj5OZ09X9cbISIRCJ0J/IxxDSb+QDCLtJelt4AGGgSxjhoZ0aKcJf8O53mMEIjdAIjdAIjdAI9yCEM4h8fqFP0WwiRmiES2kPobgqIFs+AXj9uDucKPzAnRojNEIjNEIjNMJ5hIKM0Ag/jpAfQriCoYxwIRS6msLg0VBtUfhqhHlfAOc6xK8ItYiQCt4G4fYThRNdAaCZDgUpFFQ3In+oAUJ1FXKuVBHmLMZ9EAKbTxRWgLWfeYSAEOjhCHprIJ9eUC7sEQoSbvVxUmAQ2HSicI9Q8x2ifxrkyHIzGJges2hHJsKyiLgTQuYMbCuaCCFgEWGdIABMI0SgyyvCuBVC7UJIVkqrEKpMzyHMJipCGeEAIZDTmkEoVISlNHRnhOjD3xFqUq6MgMDrBIBJhPkD9AiDgG71cVIRrv9EJgAklVGHLX9xuwhhb8rOokYoACoEjXA3wkAXGeFOhPVMYSO821FrIzRCIzRCIzRCI/SJwj5RuJ0YoREuxQhvEn+c/OnHCYlT88SdGuLMNTFCIzRCIzRCIzRCIzTCFhGKNMIjCIUSI9yPEG/nRBJ9hggXK7P8F1jugVJOALUPBccrisB9EAKa/ofHEwg12xCCgTqDmnvaDFDHKQsNEfJOCOP3VITqyqv7gQh2N2XpwEJlHyQhBMtCltmjJ1WQYEAIkSIZuNcbeTXCKojKTTbEFAZTHSKSu7rfyoWTCLOQJJWFN0e48EauKwwg8hR9dZOYRMhcwvIcTPJLCLtJhXh7hESfeYSskhVvJhGyt7CXFbGAUF2tRKi7I6yZR5hWQUEU1wKYsBA/FgpkaAZhRnfeqWGuzuX7hdI37xeWXI7wi3etgwDoL3g+zGCERngXhJQRGqERGqERnofwsefUUD5RuJ34RGGfotlGjNAIl2KEN8nGf/10aY7vrLS/U0N8Il+G8AN2fR1CnJfHIjxLrvhGhIARtoFQNEIjNEIjvCVCAYARHryWKwGgUuhjhOsQJjsAK06OQ0CLa4seIadXnYE6OO9PUlKQ0wjZ7zmBC2hyKfoHELoQoYAN28LfTrbmLwg1hTAXDMZpGiGSSHkA5xHmUiJ/qMCFCAluQdhPBVicI1gmBWLwRu7PnQ4wqPJgvSr7Okmy/ACE6sAlC5cQ5lKmreV/XopQWxGqPzE9O5SyWYy3hSz30bNAzCGUAlXNdQgRSwiR/38GIdFnGWECq2cKjy0Mdgt7OOJvCHPoSoSMJYR16fUIhRy84RNZaRdDQn+ONKkJhHhFGNAswgDFXmYsIBSVV/AlpVmEdWkZKwrXfyLzD/YL8b07NYggjHA/wkAX+dvJAYQhlapG2MZRayM0QiM0wr9ASP8R9N4Iv+JP8fQJITdGCDpv8YnCPr+wkRihES7FCG8SIzTCpRjhTWKERujcP5bQWYgldB4SS+gsxBI6D4kldBZiCZ2H5CoJCfC0oC/WbEkALbdHtPhyALpaQjZaLEOw4XKn11ODL4csoSW0hJZwMWq5niVss6QltISW0BJaQktoCS2hJbSEltASWkJLaAkt4XkSSuyiZhq9UEJZwvYkFF7DNhq1hA3Wu1BCAqqTQAyDcWQJLeFV+4ScEkwcZbHRZo2xhE2s7G8SCgDbeVUsYVP1LpZQJEosoSX8iITEW+iPY0v4xxIKABY/jjEOLaElPFFCApD3CS3hpyVkP+19Qkv45xJW80j6i4kl/Ny3Y6KEiqAltIQ+gcESNlvPErZZ0hJaQktoCS2hJbSEltASWkJLaAktoSWciM4MQZ0coO0OgXbrnbeyvj6h00osobMQS+g8JJbQWci9JSQcZzk+RONDNN9/iMYStiONJWzQmEdKiOZW1hI+TMKwhI0ZYwmbWNmxhCKpVl8VS/gQCQFYwjZWN6Vpt96lErLVV8USNlXPEp5XUkDfp4BfXj5AE0sUAizhgyUUeawkECFL2KCE7KKLGyUAvt0hsFVC4hQJtVtColtAS3iqhELNZY3msiohoD1bQiKTFQCwlkLeCiWaK0lGiMqROZivxTmWUEBdwu6GlvBECUtYZnPyteOZV+UCOBy4e0v40+z7LaH5JwAGPFi70o9+GkjIusRfTC6SsNaeslAcRcclBIgSHZAwYiyhAJUAWiHhyy1AdSH4LqHAn/GW8PLjhALAKxslOBSHZ0tIKRNbJawPfJOQlvCvJcSfSijgsIQE69rl78w2CQmORr6XJGgJL5cwAODKj2OC7xPcuCXMHoly+zrnZ4dW5R4JbpQwCJDEYJ+wlgTkg9Uf+Dg+84sJiRLy9RXnDoLSeNbg7t4XRZpd4L+Y/M3BagDQ3zWqFQTbfVEs4XkSVg3V2JVaLWFT9S6VkECNmmjUEjZY71IJX68Y3EijlrDBes88s9oSNlXPErZZ0hJaQktoCS2hJbSEltASWkJLaAktoSWciM4MQEktl/TlghfiywU77ccSOguxhM5DYgmdhdxbQoLRcvzt+AHfjgkG2o0lfI6EDRLsYgktoSW0hJbQElpCS2gJLaEltISW0BJaQktoCS2hJVySUAQytISW8BMSKvUjpzQUR9GXSAjWq67+HpFlKGkJz5eQr+aJPHA9pCohEcIOaEw3MCK4tWaO1pKEZNaDynROzCWXwhKeK+EVF/CvEvI3YYgZCckgJyXkFgmVyq6VEEGCzN7L84tldcS8m8NkCa+QkAB02RcTEMzuCbFbJFBkECAVAkmo9EYC/JVgFgDLBLJSUYgi9M9taPU+YQ7Oeso3R06qDma66n3CqyQEgLhMwv517eVgCKwvrH6Wg7l8JUGmzoNNKlh/9kqIjMrd/kubJfzolpAYhfslzAh8kTCzXkJBvYSqErKqRCK2S5gTtYW3DaMlvFzCperiKNojoUCFqCg3qZD+uSOUR0pYIyHBEIYSAvqHiYD2SUikxQBYywOwhFdKOL48q3T744SgjxPeTcJ6tVYJAO8uIeGD1beTsJtfQ//FxBL+vYQZdfHfji2hT2CwhO3Ws4SW0BJawntKSKi1lbWEltASWkJLaAkt4WMkbDaW8CkSthxA6/MVV2playtLQL40nNNILKGzEEvoPCSW0FmIJXQekqskJBxnOU8/TnhygmC7x/UefZwQiFajM6WxhI1LiCZjCR8mYXt/w7KEt5BQpCyhJfykhALAdiQUaAkbqmcJLaEltISW0BJawu+WUCQpS2gJPyUh8RNaQkv4CQnRRdVG8JxLwwH1yrrbwrx2Lzg0ZlvBUoAaS3j0gtWW8GwJU8G6FOA5l4YDjl4wGCMJyc2XrI6xhEcuWL1NQgHICSKLkxShXdIQP48VwJzXT4ASoFtKKAC85otJlZASyR+h8xZUQUjlPfWLVSRUiLMSillGVD6diAhmFbI3kMsSHr9gdUq44l2mN8PBXRLWgoIEZV2wliRuKSEB6Opvx0D++mcQVCYqNTCX512Ca/YJsx4qZ2WpUr/aNyHh0QtW75Dw7eGCdkuYj4X6qcdIuPfjeHytVmRYnoj1Fc9UoL9JKAKjC7UGs3Y+k+YlPHTB6uMSgvv24caPfZKExCjcI+EAkjB91Wr9JmE+ikMJwf5XNjgr4YELVh+XkNj8RWJ5EVDL3nifEHUxr/k41ttGj0rZcy5Ut2Fl4ncJc9hAwqxJ5lQsSLj9gtU7JRS6lPKZnwltl3DysfyZpXJ702/HRG2ewFccJxTk44R3kjAI1HzHwWrJB6vvJWG/65328Rsk9F9M7idhu2dWW8K26llCS2gJLaEltISW0BL6n3zeVUK2Vsv/+N0SPkbCp8QSNivhg2IJm5TQcX6Nr0/otBJL6CzEEjoPiSV0FmIJnYfEEjoLsYTOQ2IJnY/nf+g5tbIQYRRoAAAAAElFTkSuQmCC">
                </center>
                </p>
				<p>
				If all items are constants, then the whole array is a constant.
				</p>
			`,
							children: [],
						},
						{
							id: "dictionaries",
							name: "Dictionary Literals",
							title: "Dictionary Literals",
							content: `
				<p><a href="?doc=/language/types/dictionary">Dictionary</a>
				literals are comma-separated sequences of key-value pairs enclosed
				in curly braces. A key-value pair consists of a key, which is either
				a string or an identifier, and a value, which is the result of an
				arbitrary expression:
				<ebnf>
					dictionary = empty-dictionary | nonempty-dictionary ;
					  empty-dictionary = "{", "}" ;
					  nonempty-dictionary = "{", key-value, { ",", key-value }, [ "," ], "}" ;
					  key-value = (string | identifier), ":", expression ;
				</ebnf>
				The key-value pairs become the items of the
				dictionary literal. Importantly, the identifier is not looked up as
				a name, but it represents the string that would arise if it were
				enclosed in double quotes, so using identifiers instead of strings
				for keys is merely syntactic sugar that saves typing the double
				quotes. Keys are string tokens, not string literals, and hence cannot
				span multiple lines.
				</p>
				<p>
				Note that not all keys can be represented with the identifier
				short-notation, simply because they are not valid identifiers. Also
				note that this means that string variables cannot act as keys in
				string literals; this can be achieved with the
				<a href="?doc=/language/expressions/item-access">item access operator</a>.
				</p>
				<div class="example">
					<h3>Example</h3>
					<tscript>
						var a = {};             # empty dictionary
						# identifier keys:
						var b = {name: "Sam", phone: "911", age: 35};
						# non-identifier keys:
						var c = {"name": "Sam", "phone": "911", "age": 35};
						var d = {"---": math.sin(2), "true": math.cos(2)};

						# item access:
						print(b["name"]);
						print(c["name"]);
						print(d["---"]);
					</tscript>
				</div>
				<p>
				If all values are constants, then the whole dictionary is a constant.
				</p>
			`,
							children: [],
						},
						{
							id: "anonymous-functions",
							name: "Anonymous Functions",
							title: "Anonymous Functions",
							content: `
				<p>
				An anonymous function or lambda function follows the syntax:
				<ebnf>
					lambda = "function", [ closure ], "(", param-list, ")", func-body ;
					  closure = "[", [ closure-param, { ",", closure-param } ], "]" ;
					  closure-param = [ identifier, "=" ], expression ;
					  param-list = [ param-decl, { ",", param-decl } ] ;
					  param-decl = identifier, [ "=", constant-ex ] ;
					  constant-ex = $ expression that evaluates to a constant $ ;
					  func-body = "{", { declaration | statement | directive }, "}" ;
				</ebnf>
				In contrast to a <a href="?doc=/language/declarations/functions">function
				declaration</a> it does not have a name by which is could be referenced.
				However, being an expression it can be stored in a variable or returned
				from a function. An anonymous function is of type
				<a href="?doc=/language/types/function">Function</a>.
				</p>
				<p>
				Anonymous functions can enclose variables from their surrounding scopes,
				which are stored in the function object. In fact, the result of arbitrary
				expressions can be stored. These expressions are evaluated when the
				anonymous function is created. They are available from inside the
				function body when the function is invoked, which can be at a later time
				and, importantly, from a different scope. In the following (somewhat
				contrived) example, the variable <code class="code">square</code> is not
				accessible from the global scope where <code class="code">lambda</code>
				is defined, yet the variable is available inside the anonymous function
				because its value is enclosed in the function as a closure parameter.
				</p>
				<div class="example">
					<h3>Example</h3>
					<tscript>
function createAreaCalculator(radius)
{
	var square = radius * radius;
	return function [square] ()                 # this is the anonymous function
		{
			return math.pi() * square;
		};  # the semicolon terminates the first return statement
}
var lambda = createAreaCalculator(3);
print(lambda());   # prints 9*pi = 28.2743...

# function doesNotWork()
# {
#    return function [square] ()                # square is unknown
#       {
#           return math.pi() * square;
#       };
# }
					</tscript>
				</div>
				<p>
				The abilities of anonymous functions to be declared in-place as an
				expression and to enclose values from a surrounding scope are
				particularly well-suited for callbacks.
				</p>
				<p>
				Lambda functions do not have a name, therefore they cannot be referred
				to by name. This is a problem when writing recursive algorithms, since
				the function must be able to call itself. To allow for recursion, the
				<keyword>this</keyword> keyword refers to the function itself. Hence,
				the following code computes the factorial of a number:
				</p>
				<div class="example">
					<h3>Example</h3>
					<tscript>
						var fac = function(n)
							{
								if n == 0
								then return 1;
								else return n * this(n-1);
							};
						print(fac(7));   # 5040
					</tscript>
				</div>
				<p>
				Note that writing the else-case as
				<code class="code">else return n * fac(n-1);</code> does not work
				because <code class="code">fac</code> is a variable that cannot be
				used until it is fully initialized, and the else-statement is part
				of the initializer.
				</p>
				<p>
				When invoking a lambda function, all closure variables are
				<i>copied</i> into the local frame. Hence, any modification of a
				closure variable is limited to the duration of the function
				execution.
				</p>
			`,
							children: [],
						},
					],
				},
				{
					id: "unary-operators",
					name: "Unary Operators",
					title: "Unary Operators",
					content: `
			<p>
			There are three unary operators, all of which are left-unary operators
			binding to an argument on their right-hand side.
			</p>
		`,
					children: [
						{
							id: "not",
							name: "Logical or Bitwise Negation",
							title: "Logical or Bitwise Negation",
							content: `
				<p>
				<code class="code">operator not</code> performs a logical or bitwise
				negation of its argument. For <keyword>true</keyword> it returns
				<keyword>false</keyword> and for <keyword>false</keyword> it returns
				<keyword>true</keyword>, and it flips all 32 bits of an integer.
				When applied to a value that is not a
				<a href="?doc=/language/types/boolean">Boolean</a> or an
				<a href="?doc=/language/types/integer">Integer</a> then the operator
				reports an error.
				</p>
				<p>
				Note: For an integer x, <code class="code">(not x)</code> is
				equivalent to <code class="code">(-1 - x)</code>.
				</p>
                <div class="example">
					<h3>Example</h3>
					<tscript do-not-run>
20 in binary:       00000000 00000000 00000000 00010100
not 20 in binary:   11111111 11111111 11111111 11101011
                    </tscript>
				</div>
			`,
							children: [],
						},
						{
							id: "plus",
							name: "Arithmetic Positive",
							title: "Arithmetic Positive",
							content: `
				<p>
				The unary <code class="code">operator +</code> represents "no sign
				change". In other words, it returns its argument unaltered.
				When applied to a non-numeric argument, i.e., a value that is neither
				an integer <a href="?doc=/language/types/integer">Integer</a> nor a
				<a href="?doc=/language/types/real">Real</a>, the operator reports an
				error.
				</p>
                <div class="example">
                <h3>Example</h3>
                <tscript>
var example = 5;
print(+example);    # prints 5

example = 2.5;
print(+example);    # prints 2.5
                </tscript>
            </div>
			`,
							children: [],
						},
						{
							id: "minus",
							name: "Arithmetic Negation",
							title: "Arithmetic Negation",
							content: `
				<p>
				The unary <code class="code">operator -</code> represents algebraic
				negation, which is a change of sign; it returns "minus" its argument.
				When applied to a non-numeric argument, i.e., a value that is neither
				an integer <a href="?doc=/language/types/integer">Integer</a> nor a
				<a href="?doc=/language/types/real">Real</a>, the operator reports an
				error.
				</p>
				<p>
				When applied to an <a href="?doc=/language/types/integer">Integer</a>,
				then the operator is subject to integer overflow. Overflow happens
				only in a single case:
				<tscript>
var example = 5;
print(-example);    # prints -5;

example = -2.5;
print(-example);    # prints 2.5;

example = -2^31;
print(example);        # -2147483648
print(-example);       # -2147483648 due to overflow
				</tscript>
				</p>
			`,
							children: [],
						},
					],
				},
				{
					id: "binary-operators",
					name: "Binary Operators",
					title: "Binary Operators",
					content: `
			<p>
			TScript defines a total of 17 binary operators. There are seven
			arithmetic operators, six comparison operators, three logical
			operators, and the range operator.
			</p>
		`,
					children: [
						{
							id: "addition",
							name: "Addition",
							title: "Addition",
							content: `
				<p>
				The binary <code class="code">operator +</code> returns the sum of
				its arguments. If at least one argument is a string, then the
				concatenation of the arguments converted to strings.
				If one of its arguments is non-numeric, i.e., a value that is neither
				an integer <a href="?doc=/language/types/integer">Integer</a> nor a
				<a href="?doc=/language/types/real">Real</a>, and if not at least one of
				the arguments is a <a href="?doc=/language/types/string">String</a>,
				then the operator reports an error.
				</p>
				<p>
				Two integers are added as integers, and two reals are added as
				reals. Mixed cases are always treated as reals. This means that
				only in the first case the result is an integer. The corresponding
				overflow rules apply.
				</p>
				<p>
				For string concatenation, a non-string arguments is first converted
				to a string with the <a href="?doc=/language/types/string">String</a>
				constructor. For core types like booleans, numeric types, array
				and dictionary containers and ranges this usually gives the desired
				result.
				</p>
                <div class="example">
                <h3>Example</h3>
                <tscript do-not-run>
print("ex" + "ample");          # prints "example"
print("ex" + 4 + "mple");       # prints "ex4mple"
print("this is " + true);       # prints "this is true"
print(3 + 4);                   # prints 7
print(3.5 + 2.5);               # prints 6
print(3.5 + 4);                 # prints 7.5
print(5.5 + true);              # error
                </tscript>
            </div>
			`,
							children: [],
						},
						{
							id: "subtraction",
							name: "Subtraction",
							title: "Subtraction",
							content: `
				<p>
				The binary <code class="code">operator -</code> returns the
				difference between its arguments.
				If one of its arguments is non-numeric, i.e., a value that is neither
				an integer <a href="?doc=/language/types/integer">Integer</a> nor a
				<a href="?doc=/language/types/real">Real</a>, then the operator reports
				an error.
				</p>
				<p>
				Two integers are subtracted as integers, and two reals are subtracted
				as reals. Mixed cases are always treated as reals. This means that
				only in the first case the result is an integer. The corresponding
				overflow rules apply.
				</p>
                <div class="example">
                <h3>Example</h3>
                <tscript do-not-run>
print(4 - 3);                   # prints 1
print(3.5 - 2.5);               # prints 1
print(4.5 - 4);                 # prints 0.5
print(5.5 - true);              # error
                </tscript>
            </div>
			`,
							children: [],
						},
						{
							id: "multiplication",
							name: "Multiplication",
							title: "Multiplication",
							content: `
				<p>
				The binary <code class="code">operator *</code> returns the
				product of its arguments.
				If one of its arguments is non-numeric, i.e., a value that is neither
				an integer <a href="?doc=/language/types/integer">Integer</a> nor a
				<a href="?doc=/language/types/real">Real</a>, then the operator reports
				an error.
				</p>
				<p>
				Two integers are multiplied as integers, and two reals are multiplied
				as reals. Mixed cases are always treated as reals. This means that
				only in the first case the result is an integer. The corresponding
				overflow rules apply.
				</p>
                <div class="example">
                <h3>Example</h3>
                <tscript do-not-run>
print(4 * 3);                   # prints 12
print(3.5 * 2.5);               # prints 8.75
print(4.5 * 4);                 # prints 20
print(5.5 * true);              # error
                </tscript>
            </div>
			`,
							children: [],
						},
						{
							id: "real-division",
							name: "Real Division",
							title: "Real Division",
							content: `
				<p>
				The binary <code class="code">operator /</code> returns the
				quotient of its arguments.
				If one of its arguments is non-numeric, i.e., a value that is neither
				an integer <a href="?doc=/language/types/integer">Integer</a> nor a
				<a href="?doc=/language/types/real">Real</a>, then the operator reports
				an error.
				</p>
				<p>
				The arguments are always treated as reals. This means that the result
				is always a real, which can have a fractional part.
				</p>
                <div class="example">
                <h3>Example</h3>
                <tscript do-not-run>
print(4 / 2);                   # prints 2
print(6.5 / 3.25);              # prints 2
print(5.2 / 4);                 # prints 1.3
print(5.5 / true);              # error
                </tscript>
            </div>
			`,
							children: [],
						},
						{
							id: "integer-division",
							name: "Integer Division",
							title: "Integer Division",
							content: `
				<p>
				The binary <code class="code">operator //</code> returns the
				quotient of its arguments, rounded down to the nearest integer.
				If one of its arguments is non-numeric, i.e., a value that is neither
				an integer <a href="?doc=/language/types/integer">Integer</a> nor a
				<a href="?doc=/language/types/real">Real</a>, then the operator reports
				an error.
				</p>
				<p>
				If both arguments are integers then the result of the division is an
				integer. Integer division overflows only in a single case:
				<tscript do-not-run>
print(4 // 3);                  # prints 1
print(6.5 // 3.1);              # prints 2.0
print(5.2 // 4);                # prints 1.0
print(5.5 // true);             # error

var a = -2^31;
print(a);                       # -2147483648
print(a / -1);                  # 2147483648 (real)
print(a // -1);                 # -2147483648 due to overflow
				</tscript>
				If at least one argument is a real then the arguments are treated
				as reals, and the result is real.
				</p>
			`,
							children: [],
						},
						{
							id: "modulo",
							name: "Modulo",
							title: "Modulo",
							content: `
				<p>
				The binary <code class="code">operator %</code> returns the
				remainder of the
				<a href="?doc=/language/expressions/binary-operators/integer-division">integer division</a>
				of its arguments:</br>
				&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<code class="code">a % b = a - (a // b) * b</code></br>
				If one of the arguments is non-numeric, i.e., a value that is neither
				an integer <a href="?doc=/language/types/integer">Integer</a> nor a
				<a href="?doc=/language/types/real">Real</a>, then the operator reports
				an error.
				</p>
				<p>
				If both arguments are integers then the result is an integer,
				otherwise the operation is carried out in floating point
				arithmetics and the result is real. The result of the modulo
				operation is always in the range<br>
				&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<code class="code">0 <= a % b < math.abs(b)</code></br>
				</p>
                <div class="example">
                <h3>Example</h3>
                <tscript do-not-run>
print(5 % 2);                   # prints 1
print(6.5 % 3.15);              # prints 0.2
print(5.2 % 4);                 # prints 1.2
print(5.5 % true);              # error
                </tscript>
            </div>
			`,
							children: [],
						},
						{
							id: "power",
							name: "Power",
							title: "Power",
							content: `
				<p>
				The binary <code class="code">operator ^</code> returns its
				left argument to the power of its right arguments.
				If one of its arguments is non-numeric, i.e., a value that is neither
				an integer <a href="?doc=/language/types/integer">Integer</a> nor a
				<a href="?doc=/language/types/real">Real</a>, then the operator reports
				an error.
				</p>
				<p>
				If both arguments are integers and the right-hand-side is non-negative,
				then the operation is performed with integer arithmetics. All other
				cases are treated as reals. This means that only in the first case the
				result is an integer. The corresponding overflow rules apply.
				</p>
				<p>
				This behavior may not always be desired. The function
				<a href="?doc=/library/math">math.pow</a> performs the same operation, but it always
				applies floating point arithmetics.
				</p>
                <div class="example">
                <h3>Example</h3>
                <tscript do-not-run>
print(2^3);                 # prints 8
print(2^(-3));              # prints 0.125
print(2.5^2);               # prints 6.25
print(4^0.5);               # prints 2
print(1.5^2.5);             # prints 2.75567596..
print(5.5 / true);          # error
                </tscript>
            </div>
			`,
							children: [],
						},
						{
							id: "equality",
							name: "Comparison for Equality",
							title: "Comparison for Equality",
							content: `
				<p>
				Two values can be compared for equality with
				<code class="code">operator ==</code>. Given two arbitrary values, the
				operator returns a <a href="?doc=/language/types/boolean">Boolean</a>.
				Equivalently, <code class="code">operator !=</code> checks for inequality.
				<code class="code">a != b</code> is equivalent to
				<code class="code">not a == b</code>.
				</p>

				<h2>Definition of Value Equality</h2>
				<p>
				The definition of value equality depends on the type. For built-in atomic
				types like boolean, integers, reals and strings, two values are equal if
				they are of the same type and they hold the same boolean, number or string.
				In particular the integer <code class="code">2</code> and the real number
				<code class="code">2.0</code> compare equal, but they differ from the
				string <code class="code">"2"</code>.
				</p>
				<p>
				Containers are considered equal if they are of the same type and all of
				their keys and items are equal. Care must be taken to avoid recursive
				references, see below.
				</p>
				<p>
				Ranges are equal if begin and end are equal numbers. Types compare equal
				only if they represent the same built-in type or class. Functions compare
				equal if calling them invokes the same TScript code. For methods, the
				object must agree in addition, and for closures, all enclosed parameters
				must compare equal.
				</p>
				<p>
				There is currently no meaningful way to compare objects, even within the
				same class. Therefore all objects are considered different, and the check
				for equality coincides with the check for identity performed by the
				standard library function <a href="">same</a>. Classes that inherit the
				built-in types are compares like these, while their attributes are
				ignored.
				</p>
                <div class="example">
                <h3>Example</h3>
                <tscript>
print(2 == 2.0);                        # prints true
print(2 == "2");                        # prints false

var r = [1, 2, 3];
var s = [1.0, 2, 3];
var t = [3, 2, 1];

print(r == s);                          # prints true
print(r == t);                          # prints false
print(s == t);                          # prints false

function a() {var a = 1; return a;}
function b() {var b = 1; return b;}

print(a == b);                          # prints false
print(a() == b());                      # prints true
                </tscript>
            </div>

				<h2>A Note on Infinite Recursion</h2>
				<p>
				Warning: Comparing recursively defined containers results in an infinite
				recursion of the comparison! See the following example:
				<tscript>
					var a = [];
					var b = [a];
					a.push(b);         # now a refers to b and b refers to a
					# print(a == b);   # error due to infinite recursion
				</tscript>
				</p>
			`,
							children: [],
						},
						{
							id: "order",
							name: "Comparison for Order",
							title: "Comparison for Order",
							content: `
				<p>
				Two values can be compared for order with
				<code class="code">operator &lt;</code>. Given two arbitrary values, the
				operator returns a <a href="?doc=/language/types/boolean">Boolean</a> if the
				values can be ordered. Otherwise it reports an error.
				Equivalently, <code class="code">operator &lt;=</code>,
				<code class="code">operator &gt;</code>, and
				<code class="code">operator &gt;=</code> can be used to compare for order,
				with the following identity:
				<code class="code">a &lt; b</code> is equivalent to
				<code class="code">not b &lt;= a</code>,
				<code class="code">b &gt; a</code>, and
				<code class="code">not a &gt;= b</code>.
				</p>
                <div class="example">
                <h3>Example</h3>
                <tscript>
print(2 > 1.0);                         # prints true
# print(2 > "1");                       # error

var r = [1, 2, 3];
var s = [0, 3, 4, 5, 6, 7, 8];

print(r > s);                           # prints true, as the first comparison that isn't equal is >
                </tscript>
            </div>
				<h2>Definition of Order and Applicability</h2>
				<p>
				The definition of value order depends on the type. Booleans cannot be
				ordered. Numbers (integers and reals) are ordered in the usual way.
				Strings and arrays are ordered
				<a target="_blank" href="https://en.wikipedia.org/wiki/Lexicographical_order">lexicographically</a>.
				Dictionaries, functions, ranges, types, and classes cannot be ordered.
				</p>

				<h2>A Note on Infinite Recursion</h2>
				<p>
				Warning: Comparing recursively defined arrays results in an infinite
				recursion of the comparison! See the following example:
				<tscript>
					var a = [];
					var b = [a];
					a.push(b);          # now a refers to b and b refers to a
					# print(a &lt; b);  # error due to infinite recursion
				</tscript>
				</p>
			`,
							children: [],
						},
						{
							id: "and",
							name: "Conjunction",
							title: "Conjunction",
							content: `
				<p>
				The binary <code class="code">operator and</code> returns the
				logical or bitwise conjunction of its arguments. Both arguments
				must be <a href="?doc=/language/types/boolean">Boolean</a>s or
				<a href="?doc=/language/types/integer">Integer</a>s, otherwise
				the operator reports an error. The result is defined as follows:
				<table class="nicetable">
					<tr><th>or</th><th>false</th><th>true</th></tr>
					<tr><th>false</th><td>false</td><td>false</td></tr>
					<tr><th>true</th><td>false</td><td>true</td></tr>
				</table>
				It applies to all 32 bits of an integer accordingly.
				</p><p>
				Note: The operator does not implement so-called short-circuit
				behavior! I.e., in the code
				<tscript>
				function test(x)
				{
					print(x);
					return x >= 0;
				}
				if false and test(7) then print("hello");
				</tscript>
				the function <code>test</code> is called, although it can be
				decided based on the left operand of <code>and</code> that the
				expression evaluates to false. Hence, the print statement inside
				of the function is executed. That may be surprising for
				experienced programmers who got used to short-circuit behavior.
				</p>
			`,
							children: [],
						},
						{
							id: "or",
							name: "Disjunction",
							title: "Disjunction",
							content: `
				<p>
				The binary <code class="code">operator or</code> returns the
				(non-exclusive) logical or bitwise disjunction of its arguments.
				Both arguments must be
				<a href="?doc=/language/types/boolean">Boolean</a>s or
				<a href="?doc=/language/types/integer">Integer</a>s, otherwise
				the operator reports an error. The result is defined as follows:
				<table class="nicetable">
					<tr><th>or</th><th>false</th><th>true</th></tr>
					<tr><th>false</th><td>false</td><td>true</td></tr>
					<tr><th>true</th><td>true</td><td>true</td></tr>
				</table>
				It applies to all 32 bits of an integer accordingly.
				</p><p>
				Note: The operator does not implement so-called short-circuit
				behavior! I.e., in the code
				<tscript>
				function test(x)
				{
					print(x);
					return x >= 0;
				}
				if true or test(-7) then print("hello");
				</tscript>
				the function <code>test</code> is called, although it can be
				decided based on the left operand of <code>or</code> that the
				expression evaluates to true. Hence, the print statement inside
				of the function is executed. That may be surprising for
				experienced programmers who got used to short-circuit behavior.
				</p>
			`,
							children: [],
						},
						{
							id: "xor",
							name: "Exclusive Disjunction",
							title: "Exclusive Disjunction",
							content: `
				<p>
				The binary <code class="code">operator xor</code> returns the
				exclusive logical or bitwise disjunction of its arguments. Both
				arguments must be <a href="?doc=/language/types/boolean">Boolean</a>s
				or <a href="?doc=/language/types/integer">Integer</a>s, otherwise
				the operator reports an error. The result is defined as follows:
				<table class="nicetable">
					<tr><th>xor</th><th>false</th><th>true</th></tr>
					<tr><th>false</th><td>false</td><td>true</td></tr>
					<tr><th>true</th><td>true</td><td>false</td></tr>
				</table>
				It applies to all 32 bits of an integer accordingly.
				</p>
				<p>
				Note: For booleans, the operator is equivalent to
				<code class="code">operator !=</code>.
				</p>
			`,
							children: [],
						},
						{
							id: "range",
							name: "Range Operator",
							title: "Range Operator",
							content: `
				<p>
				The binary <code class="code">operator :</code> constructs a
				<a href="?doc=/language/types/range">Range</a> from its arguments.
				Both arguments must be integers, or reals with equivalent values,
				otherwise the operator reports an error. The left-hand-side becomes
				the begin of the range, the right-hand-side becomes the end.
				Applying the operator is equivalent to passing the arguments to
				the <a href="?doc=/language/types/range">Range</a> constructor.
				</p>
			`,
							children: [],
						},
					],
				},
				{
					id: "function-calls",
					name: "Function Calls",
					title: "Function Calls",
					content: `
			<h2>Syntax</h2>
			<p>
			A function call is an expression with the following syntax:
			<ebnf>
				function-call = expression, "(", argument, { ",", argument }, ")", ";" ;   # example("example");
				argument = [ identifier, "=" ], expression ;
			</ebnf>
			The first expression must resolve to a callable object, hereafter
			referred to as the function for short, which is a
			<a href="?doc=/language/declarations/functions">function</a> or
			<a href="?doc=/language/declarations/classes">method</a> declaration,
			a <a href="?doc=/language/types">type</a>, or an
			<a href="?doc=/language/expressions/literals/anonymous-functions">anonymous function</a>.
			The arguments must match the function's parameters.
			</p>

			<h2>Control Flow</h2>
			<p>
			The effect of the call is that a new stack frame is created with
			one local variable per parameter. These parameter variables are
			initialized to the values of the arguments. Then the control flow
			continues at the beginning of the function body. After the function
			returns, either by means of an explicit
			<a href="?doc=/language/statements/return">return</a> statement or when
			reaching the end of its body, the return value becomes the value
			of the function call expression, the stack frame is removed, and
			the program continues in the original frame.
			</p>

			<h2>Positional and Named Arguments</h2>
			<p>
			In simple cases there is exactly one argument for each parameter
			of the function. The matting between arguments are parameters is
			determined by their order. Such arguments are called <i>positional</i>
			arguments.
			</p>
			<p>
			If a parameter of a function specifies a default value then the
			corresponding argument can be dropped. A neat way of providing
			values only for some parameters is to use <i>named</i> arguments,
			i.e., arguments with <ebnf do-not-check>identifier "="</ebnf>
			present. Named arguments must not be followed by positional arguments,
			since that would be extremely confusing and error-prone. Also
			arguments without default values can be specified by name, although
			this is not required.
			</p>
			<div class="example">
				<h3>Example</h3>
				<tscript>
					function f(a, b=0, c=0) { print(a+b+c); }
					f(3, 4, 5);        # a=3, b=4, c=5
					f(3);              # a=3, b=0, c=0
					f(3, c=5);         # a=3, b=0, c=5
					f(a=3, c=5);       # a=3, b=0, c=5
					f(a=3, b=4, c=5);  # a=3, b=4, c=5
					# f(3, b=4, 5);    # error
				</tscript>
			</div>
		`,
					children: [],
				},
				{
					id: "item-access",
					name: "Item Access",
					title: "Item Access",
					content: `
			<p>
			An item access is an expression with the following syntax:
			<ebnf>
				item-access = expression, "[", expression, "]", ";" ;
			</ebnf>
			The first (base) expression must resolve to a
			<a href="?doc=/language/types/string">string</a>,
			<a href="?doc=/language/types/array">array</a>,
			<a href="?doc=/language/types/dictionary">dictionary</a>, or
			<a href="?doc=/language/types/range">range</a>.
			The second (index) expression must resolve to a valid
			index or key, the type of which depends on the former one.
			</p>
			<p>
			The result of an item access depends on the base type and
			on the key type as follows:
			<ul>
			<li>A string indexed with an integer returns the Unicode
			code point of the character at the given (zero-based)
			position.</li>
			<li>A string indexed with a range returns the corresponding
			substring.</li>
			<li>An array indexed with an integer returns the item at
			the given (zero-based) position.</li>
			<li>An array indexed with a range returns the sub-array
			of items indexed by the range.</li>
			<li>A dictionary indexed with a string returns the value
			associated with the corresponding key.</li>
			<li>A range behaves exactly like an array holding the
			values represented by the range as consecutive values,
			however, when indexed with a range it returns another
			range.</li>
			</ul>
			</p>
            <div class="example">
            <h3>Example</h3>
            <tscript>
var s = "hello";
print(s[2]);                    # prints 108
print(s[1:3]);                  # prints "el"

var a = [1, 2, 3, 4];
print(a[1]);                    # prints 2
print(a[0:3]);                  # prints [1,2,3]

var d = {"example": [1,2,3]};
print(d["example"]);            # prints [1,2,3]

var r = 1:4;
print(r[2]);                    # prints 3
print(r[1:2]);                  # prints 2:3

            </tscript>
        </div>
		`,
					children: [],
				},
				{
					id: "member-access",
					name: "Member Access",
					title: "Member Access",
					content: `
			<p>
			A member access is an expression with the following syntax:
			<ebnf>
				member-access = expression, ".", identifier ;
			</ebnf>
			The expression evaluates to a public member of the object to
			which the <ebnf>expression</ebnf> evaluates. If the expression
			does not have a member with the name given by the
			<ebnf>identifier</ebnf> then an error is reported. If the
			expression evaluates to a type, then this syntax accesses its
			static public members.
			</p>
			<p>
			The member access operator cannot be used to access private
			and protected members. This does not even work inside of a
			class. These members can be accessed by name (with the
			<ebnf>identifier</ebnf> alone), or with
			<a href="?doc=/language/declarations/classes">super</a>.
			</p>
            <div class="example">
            <h3>Example</h3>
            <tscript>
class example {
    private:
        var ample = "ample";

    public:
        var ex = "ex";
        function example() {
            print(this.ex);         # ex is public - works fine
            print(this.ample);      # ample is private - error
        }
}

var e = example();
print(e.ex);                        # works fine
# print(e.ample);                   # error
            </tscript>
        </div>
		`,
					children: [],
				},
				{
					id: "names",
					name: "Names and Name Lookup",
					title: "Names and Name Lookup",
					content: `
			<p>
			A name has the syntax
			<ebnf>
				name = ("super", ".", identifier) | (identifier, {".", identifier}) ;
			</ebnf>
			where all but the last <ebnf>identifier</ebnf> must refer to
			a <a href="?doc=/language/declarations/namespaces">namespace</a>.
			The keyword <keyword>super</keyword> refers to the super class
			of the enclosing
			<a href="?doc=/language/declarations/classes">class</a>, hence
			it can be used only inside of a class declaration.
			The declaration a name refers to is determined by the name
			lookup rules found below.
			</p>

			<h2>Scopes and Visibility of Names</h2>
			<p>
			TScript imposes strict rules on the visibility of declarations
			based on scopes.
			In TScript, every block enclosed in curly braces is a scope.
			Scopes can apparently be nested, as in the following example,
			which contains five scopes: the global scope, a class, a
			function, and two blocks.
			</p><p>
			<tscript>
				var a;
				{
					var x;
					class Cl
					{
					public:
						function m()
						{
							a = 99;
							# y = 99;  # error: y is not yet defined
						}
					}
					var y;
					{
						# z = 1;   # error: z is not yet defined
						var z;
						z = 2;
					}
					a = 42;
					x = 42;
					y = 42;
					# z = 42;      # error: cannot access z from here
				}
			</tscript>
			</p><p>
			Names of variables, functions, classes and namespaces declared
			within a scope are only visible from within that scope, and from
			within sub-scopes. They are neither visible before they are declared,
			nor after their enclosing scope ends. This makes it possible to have
			multiple declarations of the same name, as along as they are found in
			different scopes. The name always refers to the declaration in the
			innermost scope:
			</p><p>
			<tscript>
				var a = 1;
				{
					print(a);           # prints 1
					var a = 2;
					{
						print(a);       # prints 2
						var a = 3;
						print(a);       # prints 3
						# var a = 4;    # error; the name 'a' is already
						                # defined in this scope
					}
					print(a);           # prints 2
				}
				print(a);               # prints 1
			</tscript>
			</p><p>
			This means that declarations of the same name mask each other, but
			they do not result in errors.
			</p>

			<h2>Visibility within a Scope</h2>
			<p>
			All names defined within a scope are visible within that scope, with the
			exception of variables: they are visible only from the point of their
			definition onwards, but not before. This is implicit in the previous
			example, where the first <code class="code">print</code>-statement
			outputs 1, not 2. This is because the variable declared in the next line
			is not yet visible. That makes sense, because at the time the statement
			is executed, the variable does not exist yet. In contrast, the second
			to last <code class="code">print</code>-statement in the same scope
			outputs 2, which means that it refers to the variable within that scope.
			</p>
			<p>
			For other names (functions, classes, namespaces), the behavior is
			different. All names within a scope are visible within the whole scope,
			irrespective of the order of declarations:
			</p><p>
			<tscript>
				function f()
				{ print(1); }
				{
					f();            # prints 2
					function f()
					{ print(2); }
					f();            # prints 2
				}
			</tscript>
			</p><p>
			Both calls of <code class="code">f</code> output the value 2,
			indicating that the "inner" function is visible within the whole scope,
			even before it is defined. Hence, its definition masks the name
			<code class="code">f</code> within the whole scope.
			</p>

			<h2>Namespaces</h2>
			<p>
			Declarations defined inside a namespace are accessed with the dot
			operator:
			</p><p>
			<tscript>
			namespace N
			{
				var a;
				function say() { print("a = " + a); }
			}
			# a = 7;     # the enclosing scope of 'a' is not visible
			# say();     # the enclosing scope of 'say' is not visible
			N.a = 7;     # works as desired
			N.say();     # works as desired
			</tscript>
			</p><p>
			This works because the <code class="code">namespace N</code> is visible
			from the perspective of the statement. Its members
			<code class="code">a</code> and <code class="code">say</code> are not directly visible,
			however, they can be accessed as members of <code class="code">N</code>.
			</p>
			<p>
			When accessing members of a namespace many times it can be
			convenient to make names from a namespace directly available in the
			current scope:
			</p><p>
			<tscript>
			namespace N
			{
				var a;
				function say() { print("a = " + a); }
			}
			use namespace N;   # make all names from N visible
			a = 7;       # now this works!
			say();       # now this works!
			N.a = 7;     # this also still works
			N.say();     # this also still works
			</tscript>
			</p><p>
			Names can even be imported into classes. Then variables and functions
			defined in the namespace can be accessed like static members of the
			class.
			</p>

			<h2>Names in Classes and Super Classes</h2>
			<p>
			Members of a class can be declared in any order. In This includes
			variables, or in other words, attributes:
			</p><p>
			<tscript>
			class A
			{
			public:
				function f()
				{
					print(x);   # works, although x is declared below
				}
			private:
				var x;
			}
			</tscript>
			</p><p>
			Inside a class it is possible to access the public and protected
			members of all super classes, although they are declared in unrelated
			scopes:
			</p><p>
			<tscript>
			class A
			{
			protected:
				var m, n;
			}
			class B : A   # B inherits A, and therefore its members m and n
			{
			public:
				var n;
				function set(value)
				{
					m = value;         # access to m works
					n = value;         # sets B.n
					super.n = value;   # sets A.n
				}
			}
			</tscript>
			</p>

			<h2>Name Lookup</h2>
			<p>
			When TScript encounters a name, then it proceeds as follows.
			It checks all scopes for a declaration with the given name,
			starting from the innermost scope and moving towards enclosing
			scopes until the global scope is processed. For each scope, it
			does the following:
			<ul>
				<li>If the name is defined inside of the scope and before
					its use, then the lookup is successful.</li>
				<li>If the name is defined inside of the scope and before
					after its use, and if it does not refer to a variable,
					then the lookup is successful.</li>
				<li>If the name is imported from a namespace into the scope
					before its use, then the lookup is successful.</li>
				<li>If the scope is a class, then loop through the chain of
					super classes, starting at the current class. If the
					name is defined in a class, or if it is imported from a
					namespace, then the name lookup is successful.</li>
			</ul>
			</p>
			<p>
			These rules imply that some names refer to objects that are not
			accessible, like in the following example:
			</p><p>
			<tscript>
			function f()
			{
				var x = 7;
				function g()
				{
					# return x + 1;   # error!
				}
				return g;
			}
			var h = f();
			print(h);     # prints &lt;Function g&gt;
			print(h());
			</tscript>
			</p><p>
			The problem is that when g is called under the name h in the last
			line, then x has already gone out of scope. This can be avoided
			by turning g into a closure:
			</p><p>
			<tscript>
			function f()
			{
				var x = 7;
				return function [x] ()
				{
					return x + 1;   # works
				};
			}
			var h = f();
			print(h);     # prints &lt;Function anonymous 4:11&gt;
			print(h());   # prints 8
			</tscript>
			</p>
		`,
					children: [],
				},
				{
					id: "precedence",
					name: "Precedence of Operations",
					title: "Precedence of Operations",
					content: `
			<h2>Order of Evaluation of Expressions and Operators</h2>
			<p>
			Different operators have different precedence, i.e., binding
			strength. In the following example, the order of operations
			depends on the binding strength of the operators:
			</p>
			<tscript>
				var x = [2, 3, 5, 7];
				var i = 4 - 1 * 2;
				var a = -2^x[i];
			</tscript>
			<p>
			In the second line the usual mathematical convention that multiplication
			is computed before addition is expected. This is realized in TScript by
			giving <code class="code">operator&nbsp;*</code> a higher precedence
			(binding strength) than <code class="code">operator&nbsp;+</code>.
			Though, a higher precedence is traditionally expressed by a lower number,
			see the table below.
			</p>
			<p>
			Similarly, the minus sign in the last statement is applied to the
			power, not only to its base, since the exponentiation
			<code class="code">operator&nbsp;^</code> binds stronger than the arithmetic negation
			<code class="code">operator&nbsp;-</code>.
			</p>
			<p>
			Also for operators of the equal precedence the evaluation order can matter
			for the result, as in <code class="code">7 - 4 - 3</code>. Furthermore,
			expressions can have side-effects, the order of which depends on the
			evaluation order. In TScript, the evaluation order is always well-defined.
			Operators of the same precedence and the expressions in between are
			evaluated either left-to-right or right-to-left.
			</p>

			<h2>Precedence and Evaluation Order Rules</h2>
			<p>
			The precedence rules are summarized in the following table.
			</p>
			<table class="nicetable">
				<tr><th>precedence</th><th>operator type</th><th>operators</th><th>evaluation order</th></tr>
				<tr><td>0</td><td>right&nbsp;unary</td><td><code class="code">[]</code> <code class="code">.</code></td><td>left-to-right</td></tr>
				<tr><td>0</td><td>right&nbsp;n-ary</td><td><code class="code">()</code></td><td>left-to-right</td></tr>
				<tr><td>1</td><td>binary</td><td><code class="code">^</code></td><td>left-to-right</td></tr>
				<tr><td>2</td><td>left&nbsp;unary</td><td><code class="code">+</code> <code class="code">-</code></td><td>right-to-left</td></tr>
				<tr><td>3</td><td>binary</td><td><code class="code">*</code> <code class="code">/</code> <code class="code">\/\/</code> <code class="code">%</code></td><td>left-to-right</td></tr>
				<tr><td>4</td><td>binary</td><td><code class="code">+</code> <code class="code">-</code></td><td>left-to-right</td></tr>
				<tr><td>5</td><td>binary</td><td><code class="code">:</code></td><td>left-to-right</td></tr>
				<tr><td>6</td><td>binary</td><td><code class="code">==</code> <code class="code">!=</code> <code class="code">&lt;</code> <code class="code">&lt;=</code> <code class="code">&gt;</code> <code class="code">&gt;=</code></td><td>left-to-right</td></tr>
				<tr><td>7</td><td>left&nbsp;unary</td><td><code class="code">not</code></td><td>right-to-left</td></tr>
				<tr><td>8</td><td>binary</td><td><code class="code">and</code></td><td>left-to-right</td></tr>
				<tr><td>9</td><td>binary</td><td><code class="code">or</code> <code class="code">xor</code></td><td>left-to-right</td></tr>
				<tr><td>10</td><td>assignment</td><td><code class="code">=</code> <code class="code">+=</code> <code class="code">-=</code> <code class="code">*=</code> <code class="code">/=</code> <code class="code">\/\/=</code> <code class="code">%=</code> <code class="code">^=</code></td><td>right-to-left</td></tr>
			</table>

			<h2>Parentheses</h2>
			<p>
			Every part of an expression can be enclosed in parentheses, which
			bind stronger than all operators. The most common reason is to
			override operator precedence, as in the following example:
			<tscript>
				var a = 2;
				var b = (3 + a) * 6;
			</tscript>
			</p>
		`,
					children: [],
				},
				{
					id: "constants",
					name: "Constants",
					title: "Constants",
					content: `
			<p>
			Constants are expressions that do not depend on the values
			of variables. Their main uses are as immediate values within
			expressions and as initializers of attributes. A further use
			is as default values of function parameters.
			</p>
			<p>
			All <a href="?doc=/language/expressions/literals">literals</a> of
			non-container types are constants. This includes all
			<a href="?doc=/concepts/design">JSON</a> types, but also
			functions (excluding non-static methods). Array and dictionary
			literals are constants if all of their items are constants:
			<tscript>
				var c1 = null;                  # constant
				var c2 = true;                  # constant
				var c3 = 42;                    # constant
				var c4 = 8.57e-7;               # constant
				var c5 = "hello";               # constant
				var c6 = print;                 # constant
				var c7 = [true, 42];            # constant
				var c8 = {"a": true, "b": 42};  # constant
				var n = [c2, c3];               # not a constant
			</tscript>
			The last expression is not a constant since c2 and c3 are
			variables.
			</p>
			<p>
			Other expressions are de-facto constants, in particular the
			return values of functions without side-effects with constant
			parameters, e.g.,
			<tscript>
				var n = math.sqrt(2);           # not a constant
			</tscript>
			The above expression is not considered a constant in TScript,
			since it is evaluated at runtime. The core language does not
			have any knowledge about which functions have side effects
			and which ones do not.
			</p>
		`,
					children: [],
				},
			],
		},
		{
			id: "statements",
			name: "Statements",
			title: "Statements",
			content: `
		<p>
		Statements are instructions that change the state of the
		program. For example, they can modify a variable or change the
		program flow. Besides assignments and constructs like
		conditionals and loops, also simple expressions are considered
		statements since they can have side effects, e.g., by calling
		<code class="code">print</code> or <code class="code">wait</code>.
		Statements are formally defined as follows:
		<ebnf>
			statement = block
			          | assignment
			          | expression, ";"
			          | condition
			          | for-loop
			          | while-do-loop
			          | do-while-loop
			          | break
			          | continue
			          | return
			          | throw
			          | try-catch ;
		</ebnf>
		</p>
        <div class="example">
        <h3>Example</h3>
        <tscript>
var a = 1;      # statement

for 0:3 do      # statement
{
    print(a);   # statement
    break;      # statement
}

        </tscript>
    </div>
	`,
			children: [
				{
					id: "blocks",
					name: "Blocks of Statements",
					title: "Blocks of Statements",
					content: `
			<p>
			A block of statements has the following syntax:
			<ebnf>
				block = "{", { declaration | statement | directive }, "}" ;
			</ebnf>
			The whole block can take the role of a single statement,
			allowing to execute multiple statements where a single one
			is specified by the formal syntax, i.e., in conditions,
			loops, and try/catch-blocks. Furthermore, beyond multiple
			statements, a block can contain declarations and directives.
			</p>
			<p>
			At the same time, the block acts as a scope, so the usual
			<a href="?doc=/language/expressions/names">name lookup</a> rules
			apply. This means that declarations made inside the block
			become invalid as soon as the block is left. Of course,
			functions declared inside the block can be returned or
			assigned to variables declared outside the block, and the
			same holds for objects of locally declared classes.
			</p>
            <div class="example">
            <h3>Example</h3>
            <tscript>
var example;
if true then {
    function ex() {
        print("Hello World");
    }

    example = ex;
}

example();                      # works fine
# ex();                         # does not work, since ex() is only known inside of the if then block
            </tscript>
        </div>
		`,
					children: [],
				},
				{
					id: "assignments",
					name: "Assignments",
					title: "Assignments",
					content: `
			<p>
			Assignments have the following form:
			<ebnf>
				assignment = lhs, assign-op, expression, ";" ;                  # example: var example = 28;
				  lhs = name
				        | expression, "[", expression, "]"
				        | expression, ".", identifier ;
				  assign-op = "=" | "+=" | "-=" | "*=" | "/=" | "%=" | "^=" ;
			</ebnf>
			The expression <ebnf>lhs</ebnf> on the left-hand-side (lhs) of the
			assignment must refer to a variable. It must not refer to a function
			or to a constant.
			</p>
			<p>
			Assignments are evaluated from right to left: the <ebnf>expression</ebnf>
			on the right-hand-side (rhs) is evaluated before the <ebnf>lhs</ebnf>. The
			effect of an assignment with <code class="code">operator =</code> is
			that the variable referenced by the <ebnf>lhs</ebnf> is overwritten
			with the result of the <ebnf>expression</ebnf>. In other words, after
			the assignment the variable references the value to which the rhs
			evaluates. Note that an assignment does not copy the value represented by
			the rhs, it only makes the lhs reference the same value, as can be seen in
			the following example:
			<tscript>
				var a = [2, 3, 5, 7];
				var b = a;
				a[2] = 97;
				print(b);   # prints [2,3,97,7]
			</tscript>
			</p>
			<p>
			The assignment operators <code class="code">+= -= *= /= %= ^=</code> are
			called compound assignment operators. The statement
			<code class="code">a += 3;</code> is equivalent to
			<code class="code">a = a + 3;</code>, and the same applies to the other
			binary arithmetic <a href="?doc=/language/expressions/binary-operators">operators</a>.
			However, this equivalence is not exact in general, since with compound
			assignment the lhs expression is evaluated only once. This difference
			is demonstrated in the following example:
			<tscript>
				var counter = 0;
				var a = [0, 0];
				function get()
				{
					counter += 1;
					return a;
				}
				get()[0] += 7;
				print(a);                # prints [7, 0]
				print(counter);          # prints 1
				get()[1] = get()[1] + 7;
				print(a);                # prints [7, 7]
				print(counter);          # prints 3
			</tscript>
			</p>
		`,
					children: [],
				},
				{
					id: "expressions",
					name: "Expressions",
					title: "Expressions",
					content: `
			<p>
			An expression followed by a semicolon is a valid statement.
			For many expressions this is rather pointless:
			<tscript>
				"hello world";
				math.sqrt(81) == 9;
			</tscript>
			An expression makes sense as a standalone statement if it has
			side-effects. Primary examples are calls to standard library
			functions:
			<tscript>
				print("hello world");
				assert(math.sqrt(81) == 9);
			</tscript>
			Of course, a function call can result in an arbitrary sequence
			of commands being executed inside the function body and further
			functions called from there, and therefore the side effects can
			become arbitrarily complex.
			</p>
		`,
					children: [],
				},
				{
					id: "if-then-else",
					name: "Conditions with if then else",
					title: "Conditions with if then else",
					content: `
			<p>
			A conditional control structure is denoted as follows:
			<ebnf>
			condition = "if", expression, "then", statement,
			                            [ "else", statement ] ;
			</ebnf>
			The <ebnf>expression</ebnf> must evaluate to a
			<a href="?doc=/language/types/boolean">Boolean</a>, otherwise an error
			is reported.
			If the <ebnf>expression</ebnf> evaluates to <keyword>true</keyword>
			then the <ebnf>statement</ebnf> following <keyword>then</keyword>
			is executed, otherwise the <ebnf>statement</ebnf> following
			<keyword>else</keyword> is executed, if present. It is common that
			the statements are <a href="?doc=/language/statements/blocks">blocks</a>.
			</p>
            <div class="example">
            <h3>Example</h3>
            <tscript>
if true then {}              # works
if 3 < 5 then {}             # works
# if 1 then {}                 # does not work
# if "true" then {}            # does not work
            </tscript>
        </div>

		`,
					children: [],
				},
				{
					id: "for-loops",
					name: "For-Loops",
					title: "For-Loops",
					content: `
			<p>
			A for-loop has the following syntax:
			<ebnf>
			for-loop = "for", [ loop-var, "in" ], expression, "do", statement ;
			  loop-var = ("var", identifier) | name ;
			</ebnf>
			The <ebnf>expression</ebnf> must evaluate to a
			<a href="?doc=/language/types/range">Range</a> or an
			<a href="?doc=/language/types/array">Array</a>, otherwise an error is
			reported.
			</p>
			<div class="example">
				<h3>Example</h3>
				<tscript>
					# print 9, 16, 25, 36, 49 in five lines
					for var i in 3:8 do print(i*i);

					# print "hello" and "world" in two lines
					for var i in ["hello", "world"] do print(i);
				</tscript>
			</div>
			<p>
			The for-loop executes the <ebnf>statement</ebnf> exactly once for
			each value in the range or array. This value is assigned to the loop
			variable. An already declared variable can be used as the loop
			variable, which is referenced by the given <ebnf>name</ebnf>, so it
			can even be declared in another namespace.
			Alternatively, a new variable can declared with the
			<ebnf do-not-check>"var" identifier</ebnf> syntax. This variable belongs to the
			loop, which acts as its scope, hence its name does not collide with
			other declarations outside the loop, and the variable goes out of
			scope after the last loop iteration. It is common to execute
			multiple statements in each loop iteration by using a
			<a href="?doc=/language/statements/blocks">block</a>.
			</p>

			<h2>Repeated Execution</h2>
			<p>
			Looping over a range is the idiomatic way to execute code a number
			of times in a row. The loop counter provides an easy way to
			parameterize the repeated code:
			<tscript>
				for var i in 0:10 do print(10-i + "...");
				print("now!");
			</tscript>
			In simple contexts the loop variable is not needed. Consequently,
			it can be dropped:
			<tscript>
				for 0:10 do print("wait...");
				print("now!");
			</tscript>
			</p>

			<h2>Looping over Containers</h2>
			<p>
			Looping over an array works directly with a for-loop. For a
			dictionary it is not clear whether the loop variable shall hold
			keys, values, or both. Therefore an explicit decision must be
			made by the programmer, using the Dictionary methods
			<a href="?doc=/language/types/dictionary">keys</a> or
			<a href="?doc=/language/types/dictionary">values</a>, as shown in
			the following example:
			<tscript>
				var dict = {a: 3, b: 10, c: null};
				for var i in dict.keys() do print(i + ": " + dict[i]);
				for var i in dict.values() do print(i);
			</tscript>
			Since arrays also have keys and values() methods, this technique can
			loop over containers (arrays and dictionaries) in a generic fashion:
			<tscript>
				var arr = [3, 10, null];
				var dict = {a: 3, b: 10, c: null};

				function printContainer(container)
				{
					print(Type(container));
					for var i in container.keys() do
					{
						print(i + ": " + container[i]);
					}
				}

				printContainer(arr);
				printContainer(dict);
			</tscript>
			</p>

			<h2>Modifying the Container in the Loop</h2>
			<p>
			It is safe to modify the object iterated over during execution of the loop.
			The loop is entirely unaffected by such modification because it iterates
			over a copy of the object. For example, the following is not an infinite loop:
			</p>
			<tscript>
				var arr = ["foo"];
				for var i in arr do arr.push(i);
				print(arr);   # prints [foo,foo]
			</tscript>

			<h2>Changing the Control Flow</h2>
			<p>
			Equally well, modifying the loop variable does not have an effect on the
			control flow, because in the next iteration the variable is assigned the
			next value from the container:
			<tscript>
				for var i in 0:10 do
				{
					if i == 3 then i = 7;   # attempt to skip 3,4,5,6 fails
					print(i);   # prints 0, 1, 2, <span style="color:red">7</span>, 4, 5, 6, 7, 8, 9
				}
			</tscript>
			</p>
			<p>
			Sometimes it is necessary to change the control flow during execution
			of the loop. We have seen that modifying the loop variable and the
			loop object does not achieve this effect. Instead, the following two
			operations work.
			The loop a a whole can be aborted with <a href="?doc=/language/statements/break-continue">break</a>.
			The current iteration can be aborted with <a href="?doc=/language/statements/break-continue">continue</a>.
			It is not possible to extend a for loop during execution. If this is
			a requirement then a
			<a href="?doc=/language/statements/while-do-loops">while-do-loop</a>
			can be used.
			</p>
		`,
					children: [],
				},
				{
					id: "while-do-loops",
					name: "While-Do-Loops",
					title: "While-Do-Loops",
					content: `
			<p>
			The while-do-loop syntax is as follows:
			<ebnf>
				while-do-loop = "while", expression, "do", statement ;
			</ebnf>
			The loop evaluates the <ebnf>expression</ebnf>. If it does not result in
			a <a href="?doc=/language/types/boolean">Boolean</a>, then an error is emitted.
			If the expression evaluates to <keyword>false</keyword> then the loop is
			finished. However, if it evaluates to <keyword>true</keyword> then the
			<ebnf>statement</ebnf> is executed and the loop starts over by re-evaluating
			the expression. This scheme corresponds to a pre-checked loop, i.e., a loop
			that checks the condition <i>before</i> executing the statement.
			</p>
			<div class="example">
				<h3>Example</h3>
				<tscript>
					# find a zero of a function with Newton's method
					function f(x)
					{ return x^5 - 7 * x^3 + 2 * x^2 + x + 4.2; }
					function df(x)
					{ return 5 * x^4 - 21 * x^2 + 4 * x + 1; }

					var x = 0.0;
					while math.abs(f(x)) > 1e-5 do
					{
						var step = f(x) / df(x);
						x -= step;
					}
					print("The zero of f is close to x=" + x);
					print("The function value at x is f(x)=" + f(x));
				</tscript>
			</div>
			<p>
			It is easy to create an infinite while-do loop:
			<pre class="code"><code class="code">while true do { }</code></pre>
			The construction can actually be useful if the loop is aborted with a
			<keyword>break</keyword> statement.
			</p>
		`,
					children: [],
				},
				{
					id: "do-while-loops",
					name: "Do-While-Loops",
					title: "Do-While-Loops",
					content: `
			<p>
			The do-while-loop syntax is as follows:
			<ebnf>
				do-while-loop = "do", statement, "while", expression, ";" ;
			</ebnf>
			The loop executes the <ebnf>statement</ebnf>. Then it evaluates the
			<ebnf>expression</ebnf>. If it does not result in a
			<a href="?doc=/language/types/boolean">Boolean</a>, then an error is emitted.
			If the expression evaluates to <keyword>false</keyword> then the loop is
			finished. However, if it evaluates to <keyword>true</keyword> then the
			loop starts over. This scheme corresponds to a post-checked loop, i.e., a
			loop that checks the condition <i>after</i> executing the statement.
			</p>
			<div class="example">
				<h3>Example</h3>
				<tscript>
					# find a zero of a function with Newton's method
					function f(x)
					{ return x^5 - 7 * x^3 + 2 * x^2 + x + 4.2; }
					function df(x)
					{ return 5 * x^4 - 21 * x^2 + 4 * x + 1; }

					var x = 0.0;
					do
					{
						var step = f(x) / df(x);
						x -= step;
					}
					while math.abs(f(x)) > 1e-5;
					print("The zero of f is close to x=" + x);
					print("The function value at x is f(x)=" + f(x));
				</tscript>
			</div>
			<p>
			It is easy to create an infinite while loop:
			<pre class="code"><code class="code">do { } while true;</code></pre>
			The construction can actually be useful if the loop is aborted with a
			<keyword>break</keyword> statement.
			</p>
		`,
					children: [],
				},
				{
					id: "break-continue",
					name: "Break and Continue",
					title: "Break and Continue",
					content: `
			<p>
			The <keyword>break</keyword> and <keyword>continue</keyword> statements
			change the control flow of the current innermost loop within the current
			function. The break statement exits the loop. The continue statement
			skips the remainder of a loop iteration. Their syntax is trivial:
			<ebnf>
				break = "break", ";" ;
				continue = "continue", ";" ;
			</ebnf>
			After a continue statement, the loop jumps to its check of the stopping
			criterion. If it does not stop then it continues with the next loop
			iteration, otherwise with the next statement following the loop body.
			Break and continue statements outside of a loop body result in an error
			message.
			</p>
			<div class="example">
				<h3>Example</h3>
				<tscript>
					# find all primes below some number
					var N = 100;                  # look for primes up to this point
					var primes = [];
					for var i in 2:N do
					{
						# check whether i is prime by finding a factor
						var factor = null;
						for var p in primes do
						{
							if p * p > i then break;  # don't check too large primes
							if i % p == 0 then
							{
								# found a factor
								factor = p;
								break;                # don't check further factors
							}
						}
						if factor != null then continue;  # skip non-primes
						print(i + " is prime");
						primes.push(i);
					}
				</tscript>
			</div>
		`,
					children: [],
				},
				{
					id: "return",
					name: "Return",
					title: "Return",
					content: `
			<p>
			The return statement immediately returns from a function.
			Its syntax is as follows:
			<ebnf>
				return = "return", [ expression ], ";" ;
			</ebnf>
			If the optional <ebnf>expression</ebnf> is not present, then
			<keyword>null</keyword> is used as the default value.
			</p>
			<p>
			The return statement first evaluates the expression, known as the
			return value, then leaves the current function, and returns the
			value to the caller. In other words, the function call expression
			in the calling context evaluates to the return value.
			</p>
			<p>
			When executed at global scope, the return statement terminates the
			program. A constructor as well as the global scope do not return a
			value. Therefore, in these contexts, a return statement must not
			contain a return value.
			</p>
            <div class="example">
            <h3>Example</h3>
            <tscript>
function example() {
    var e = 1;
    return e+1;
}

print(example());               # prints 2, since the e+1 gets first evaluated and then returned

# return 1;                     # error, since one tries to return an integer from the global scope

return;                         # terminates the program

print("example");               # will not be executed
            </tscript>
        </div>
		`,
					children: [],
				},
				{
					id: "throw",
					name: "Throw",
					title: "Throw",
					content: `
			<h2>Syntax and Effect</h2>
			<p>
			An exception is thrown with the following syntax:
			<ebnf>
				throw = "throw", expression, ";" ;
			</ebnf>
			The result of evaluating the <ebnf>expression</ebnf> is called
			an exception.
			The effect of throwing an exception is that execution continues
			in the <keyword>catch</keyword>-part of the closest enclosing
			<keyword>try</keyword>-<keyword>catch</keyword> block.
			The search for the closest enclosing <keyword>try</keyword> block
			works as follows. The current scope is left until a
			<keyword>try</keyword> block, global scope, or a function scope
			is found. In case of a <keyword>try</keyword> block the search
			is successful, and the exception is assigned to the variable
			declared in the <keyword>catch</keyword> block. Otherwise the
			runtime system leaves the current function and continues the
			search in the calling function. If no <keyword>try</keyword>-block
			is found before global scope is encountered, then the program
			terminates with an error message, which contains a string
			representation of the exception.
			</p>

			<h2>Error Handling</h2>
			<p>
			Exceptions are regularly used for error reporting across possibly
			deeply nested function calls. The role of the exception is to
			provide a useful description of the error, which can be either
			handled programmatically by the catch block, or reported to the
			user.
			</p>
			<p>
			Sometimes only certain types of errors should be handled in a
			specific <keyword>catch</keyword> block. In this case the
			exception can be caught, examined, and possibly re-thrown.
			</p>
		`,
					children: [],
				},
				{
					id: "try-catch",
					name: "Try and Catch",
					title: "Try and Catch",
					content: `
			<h2>Syntax</h2>
			<p>
			The syntax of a <keyword>try</keyword>-<keyword>catch</keyword>
			statement is as follows:
			<ebnf>
				try-catch = "try", statement,
				            "catch", "var", identifier, "do", statement ;
			</ebnf>
			Under normal conditions, the try-catch-block executes only
			the statement following <keyword>try</keyword>. This is nearly
			always a block of statements, also referred to as the try-block.
			</p>
			<p>
			However, if an exception is thrown in the try-block or in any
			function called from this block, then execution continues in
			the statement following <keyword>do</keyword>. This is again
			usually a block of statements, called the catch-block. The value
			passed to the <keyword>throw</keyword> instruction, known as the
			<i>exception</i>, is assigned to the variable declared after
			<keyword>catch</keyword>. Catch blocks are used to react to
			error conditions, which are reported by throwing an
			exception.
			</p>
			<div class="example">
				<h3>Example</h3>
				<tscript>
				var sum = 0;
				try
				{
					# this sum is doomed to fail
					var numbers = [3.2, 5.6, 0.0, 8.0, 2.4];
					for var i in numbers do
					{
						for var j in numbers do
						{
							if i == 0 then throw "division by zero";
							else sum += j / i;
						}
					}
					print(sum);
				}
				catch var ex do
				{
					# and here we "handle" the error
					if ex == "division by zero" then
						print("division by zero, partial sum: " + sum);
					else throw ex;
				}
				</tscript>
			</div>
			<div class="example">
				<h3>Example</h3>
				<tscript>
				function doStuff(n)
				{
					if n == 0 then return 1;
					else if n < 0 then throw "oh no!";
					else return 3 * doStuff(n - 2);
				}

				try
				{
					print(doStuff(4));
					print(doStuff(8));
					print(doStuff(11));   # exception thrown in here
					print(doStuff(14));
				}
				catch var ex do
				{
					# and here we "handle" the error
					print("exception: " + ex);
				}
				</tscript>
			</div>
		`,
					children: [],
				},
			],
		},
		{
			id: "types",
			name: "The Type System",
			title: "The Type System",
			content: `
		<p>
		A type defines a set of values, which are of similar nature.
		They are associated with operations acting on the value, i.e.,
		evaluating or manipulating values. The available data types
		therefore define how information can be represented natively,
		which units of information can be processed atomically, and
		how information can be aggregated.
		</p>
		<p>
		TScript's core type system is rather minimal. It does not aim
		for completeness, but it is extensible. For example, there is
		no built-in type representing a date, but it is easy enough to
		add a class taking that role.
		</p>
		<p>
		Not all types represent typical units of information, like bits,
		numbers, and strings. Two such types are Function and Type. The
		ability to use functions as types enables powerful programming
		techniques. Types as values are used to check for the types of
		variables referenced by variables at runtime.
		</p>
		<p>
		Programmers can extend the type system to new kinds of information
		by writing their own classes. Simple classes like a date class can
		behave similar to atomic types. More complex classes can for
		example act as containers, or represent resources (like files).
		Classes support proper information hiding, which allows the
		programmer to separate implementation details from a public
		interface.
		</p>
		<p>
		TScript does not distinguish between built-in types and classes,
		in the sense that all types are equally capable of taking each role.
		For example, it is perfectly legal to use a built-in type like
		Integer as a super class, which might make sense for a date class.
		However, it is not possible to overload operators. For classes, the
		capabilities of operators must therefore be emulated with functions.
		</p>
	`,
			children: [
				{
					id: "null",
					name: "Null",
					title: "The Type <i>Null</i>",
					content: `
			<p>
			The Null type has only a single value, the
			<a href="?doc=/language/expressions/literals/null">null literal</a>.
			This value is immutable. It does not offer any operations.
			While it is clear that <keyword>null</keyword> cannot represent
			much useful information, is has a twofold role: first of all, it
			acts as a <i>default initializer</i> for all variables, and second,
			it is a canonical <i>marker</i> for an exceptional state, like an
			error condition or marking a process as incomplete. For example, a
			function that is expected to return an integer may use a return
			value of <keyword>null</keyword> to indicate that it was not
			able to complete its task (for whatever reason).
			</p>
            <div class="example">
            <h3>Example</h3>
            <tscript>
var example;

if example == null then print("example");     # prints "example"
# if test == null then print("test");         # error, since test is not defined - non defined variables are therefore not the same as null
            </tscript>
        </div>

			<h2>Methods</h2>
			<table class="methods">
			<tr><th>constructor</th><td>
				The <code class="code">constructor()</code> creates a null
				value.
			</td></tr>
			</table>
		`,
					children: [],
				},
				{
					id: "boolean",
					name: "Boolean",
					title: "The Type <i>Boolean</i>",
					content: `
			<p>
			The type Boolean represents the two logical values, denoted by the
			<a href="?doc=/language/expressions/literals/booleans">literals</a>
			<keyword>true</keyword> and <keyword>false</keyword>. They are
			immutable.
			</p>

			<h2>Operations</h2>
			Booleans offer a number of operations, namely the operators
			<a href="?doc=/language/expressions/unary-operators/not">not</a>,
			<a href="?doc=/language/expressions/binary-operators/and">and</a>,
			<a href="?doc=/language/expressions/binary-operators/or">or</a>, and
			<a href="?doc=/language/expressions/binary-operators/xor">xor</a>.
			They can be compared for equality with the operators
			<code class="code">==</code> and <code class="code">!=</code>
			(and in fact, for Boolean, the operators
			<code class="code">xor</code> and <code class="code">!=</code>
			are equivalent), but they cannot be ordered. Booleans are
			demanded by the language as conditions in
			<a href="?doc=/language/statements/if-then-else">conditionals</a>
			and <a href="?doc=/language/statements/while-do-loops">pre-</a> and
			<a href="?doc=/language/statements/do-while-loops">post-</a>checked
			loops. Furthermore, they are frequently used as flags, and they
			can be used to represent single bits.
			</p>
            <div class="example">
            <h3>Example</h3>
            <tscript>
var a = true;
var b = false;

print(not a);           # prints false;

print(a and a);         # prints true;
print(a and b);         # prints false;
print(b and b); 	    # prints true;

print(a or b);          # prints true;
print(a or a);          # prints true;
print(b or b);          # prints false;

print(a xor b);         # prints true;
print(a xor a);         # prints false;
print(b xor b);         # prints false;



var FLAG_FOUNDITEM = false;                                     # this flag indicates if an item is already found in a search

var example_array = Array(10);
example_array[4] = 1;

for var i in 0:10 do {
    if example_array[i] == 1 then FLAG_FOUNDITEM = true;      # the flag is set to true, once a specific condition - in this case finding a specific item - is met

    if FLAG_FOUNDITEM then break;                             # the flag can be checked at any location (in this example a flag isn't needed, though)
}

            </tscript>
        </div>

			<h2>Methods</h2>
			<table class="methods">
			<tr><th>constructor</th><td>
				The <code class="code">constructor(value)</code> creates a copy
				of a boolean value.
			</td></tr>
			</table>
		`,
					children: [],
				},
				{
					id: "integer",
					name: "Integer",
					title: "The Type <i>Integer</i>",
					content: `
			<p>
			There exist <i>2<sup>32</sup></i> values of type Integer, namely
			the whole numbers in the range <i>-2147483648 = -2<sup>31</sup></i>
			to <i>2147483647 = 2<sup>31</sup>-1</i>. Non-negative integers can be
			represented directly as
			<a href="?doc=/language/expressions/literals/integers">integer literals</a>.
			The values are immutable.
			</p>

			<h2>Operations</h2>
			<p>
			Integers can be combined with a number of unary and binary operators.
			When the result of such an operator is outside the integer range then
			the result <i>underflows</i> or <i>overflows</i>, i.e., wraps around
			the range, which can be understood as representatives of the integers
			modulo <i>2<sup>32</sup></i>. Being aware of this behavior is important
			when dealing with large numbers, in particular since the operations are
			not fully consistent from an algebraic perspective.
			</p>
			<table class="methods">
			<tr><th>unary&nbsp;+</th><td>
				The operator is a no-operation, or more correctly, the identity
				mapping. It returns its argument unmodified. It merely exists for
				symmetry with unary&nbsp;-, e.g., in the following situation:
				<tscript>
					var a = [-1, +1];
				</tscript>
			</td></tr>
			<tr><th>unary&nbsp;-</th><td>
				The operator negates its argument. This operation overflows only
				for the value <i>-2<sup>31</sup> = -2147483648</i>, resulting in
				the exact same value.
			</td></tr>
			<tr><th>unary&nbsp;not</th><td>
				The operator flips all 32 bits of its argument.
			</td></tr>
			<tr><th>binary&nbsp;+</th><td>
				Add the arguments. The result is subject to under- and overflow.
			</td></tr>
			<tr><th>binary&nbsp;-</th><td>
				Subtract the arguments. The result is subject to under- and overflow.
			</td></tr>
			<tr><th>binary&nbsp;*</th><td>
				Multiply the arguments. The result is subject to under- and overflow,
				which is particularly common for this operation. Example:
				<tscript>
					print(65535 * 65537);   # overflows to -1
				</tscript>
			</td></tr>
			<tr><th>binary&nbsp;/</th><td>
				Divide the arguments as reals. The arguments are first converted
				to reals, then they are divided as reals, and the result is of
				type Real, even if the remainder of the integer division is zero.
				<tscript>
					print(6 / 3);     # 2
					print(5 / 3);     # 1.6666...
					print(4 / 3);     # 1.3333...
					print(1 / 3);     # 0.3333...
					print(-1 / 3);    # -0.3333...
					print(1 / -3);    # -0.3333...
				</tscript>
			</td></tr>
			<tr><th>binary&nbsp;\/\/</th><td>
				Divide the arguments as integers, defined as</br>
				&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<code class="code">a // b = math.floor(a / b)</code></br>
				Note that <code class="code">a * b = c</code> implies
				<code class="code">c // a = b</code> only if the multiplication
				does not overflow. Division is not well-defined in the modulo
				arithmetic implied by overflow!
				Instead "normal" integer division (without modulo) is assumed.
				The result is rounded down to the closest integer. For example:
				<tscript>
					print(6 // 3);     # 2
					print(5 // 3);     # 1
					print(4 // 3);     # 1
					print(1 // 3);     # 0
					print(-1 // 3);    # -1, since we round down
					print(1 // -3);    # -1 again
					print(-(1 // 3));  # 0
				</tscript>
			</td></tr>
			<tr><th>binary&nbsp;%</th><td>
				Remainder of the integer division. The result is defined by
				the following identity:</br>
				&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<code class="code">a % b = a - (a // b) * b</code></br>
				This ensures that the result is always in the range</br>
				&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<code class="code">0 <= a % b < math.abs(b)</code></br>
				For example:
				<tscript>
					print(6 % 3);     # 0
					print(5 % 3);     # 2
					print(4 % 3);     # 1
					print(1 % 3);     # 1
					print(-1 % 3);    # 2, not -1
					print(1 % -3);    # 2 again, since 1//-3 = -1//3
					print(-(1 % 3));  # -1
				</tscript>
			</td></tr>
			<tr><th>binary&nbsp;^</th><td>
				The operation <i>n ^ m</i> computes the <i>m</i>-th power of
				<i>n</i>. If <i>m</i> is non-negative then the result is an
				integer, which is subject to the usual under- and overflow rules.
				For negative exponent both arguments are converted to reals
				before applying the same operator for reals. Examples:
				<tscript>
					print(2 ^ 4);       # 16
					print(-2 ^ 4);      # -16
					print((-2) ^ 4);    # 16
					print(2 ^ -2);      # 0.25
				</tscript>
			</td></tr>
			<tr><th>binary&nbsp;and</th><td>
				The operator returns the bitwise conjunction applied independently
				to all 32 bits of its arguments.
				</tscript>
			</td></tr>
			<tr><th>binary&nbsp;or</th><td>
				The operator returns the bitwise non-exclusive disjunction applied
				independently to all 32 bits of its arguments.
				</tscript>
			</td></tr>
			<tr><th>binary&nbsp;xor</th><td>
				The operator returns the bitwise exclusive disjunction applied
				independently to all 32 bits of its arguments.
				</tscript>
			</td></tr>
			</table>
			<p>
			Integers can be
			<a href="?doc=/language/expressions/binary-operators/equality">compared for equality</a>
			and they are <a href="?doc=/language/expressions/binary-operators/order">ordered</a>.
			</p>
			<p>
			Note: bitwise operators have a very low precedence, i.e., a low binding
			strength. Therefore, in a condition like <code class="code">x and 64 == 0</code>
			the comparison operator <code class="code">==</code> is executed
			<i>before</i> the bitwise operator <code class="code">and</code>. This
			is usually intended for logical operators, but not for bitwise operators.
			Therefore bitwise operators should always be used with parentheses:
			<code class="code">(x and 64) == 0</code>.
			</p>

			<h2>Methods</h2>
			<table class="methods">
			<tr><th>constructor</th><td>
				<code class="code">constructor(value)</code> converts the
				value to an integer. For integers this amounts to copying, reals
				are rounded down, and strings are parsed as decimal numbers.
				The result is subject to integer overflow. Other types as well as
				the special Real values infinity and not-a-number raise an error.
			</td></tr>
			</table>
		`,
					children: [],
				},
				{
					id: "real",
					name: "Real",
					title: "The Type <i>Real</i>",
					content: `
			<p>
			The type Real represents floating point numbers according to the
			<a target="_blank" href="https://de.wikipedia.org/wiki/IEEE_754">IEEE 754 standard</a>.
			This number format offers an excessive range and a precision of
			about 15-16 decimal digits. Although the precision is more than
			sufficient for most tasks, one should be aware of its limitations
			like rounding errors, which can result in catastrophic cancellation.
			These aspects have been discussed in detail in
			<a target="_blank" href="https://docs.oracle.com/cd/E19957-01/806-3568/ncg_goldberg.html">this classic article</a>.
			Positive reals can be represented directly as
			<a href="?doc=/language/expressions/literals/reals">real literals</a>.
			The values are immutable.
			</p>

			<h2>Operations</h2>
			<p>
			Reals can be combined with a number of unary and binary operators.
			When the result of such an operator is outside the floating point range
			then the result <i>underflows</i> (to zero) or <i>overflows</i> (to
			positive or negative infinity). Being aware of this behavior is important
			when dealing with large numbers, in particular since the operations are
			not fully consistent from an algebraic perspective. Computations with
			infinite values easily result in undefined results, which are encoded by
			the special value NaN (not-a-number).
			</p>
			<table class="methods">
			<tr><th>unary&nbsp;+</th><td>
				The unary <code class="code">operator +</code> is a no-operation,
				or more correctly, the identity mapping. It returns its argument
				unmodified. It merely exists for symmetry with unary&nbsp;-, i.e.,
				in the following situation:
				<tscript>
					var a = [-1.0, +1.0];
				</tscript>
			</td></tr>
			<tr><th>unary&nbsp;-</th><td>
				The unary <code class="code">operator -</code> negates its argument.
			</td></tr>
			<tr><th>binary&nbsp;+</th><td>
				Add the arguments. The result is subject to under- and overflow.
			</td></tr>
			<tr><th>binary&nbsp;-</th><td>
				Subtract the arguments. The result is subject to under- and overflow.
			</td></tr>
			<tr><th>binary&nbsp;*</th><td>
				Multiply the arguments. The result is subject to under- and overflow.
			</td></tr>
			<tr><th>binary&nbsp;/</th><td>
				Divide the arguments. The result is subject to under- and overflow.
			</td></tr>
			<tr><th>binary&nbsp;//</th><td>
				Divide the arguments and round the result down to the closest integer.
				Yet, the result is of type Real. This operator is compatible with
				integer division and with the modulo operation defined below.
				For example:
				<tscript>
					print(3.5 // 1.5);      # 2
					print(-3.5 // 1.5);     # -3
					print(-(3.5 // 1.5));   # -2
				</tscript>
			</td></tr>
			<tr><th>binary&nbsp;%</th><td>
				Remainder of the division, pretending that the quotient had been
				rounded down to the nearest integer. The result is defined as</br>
				&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<code class="code">a % b = a - b * (a // b)</code></br>
				(for positive denominator, otherwise the result is negated).
				For example:
				<tscript>
					print(3.5 % 1.5);      # 0.5
					print(-3.5 % 1.5);     # 1
					print(-(3.5 % 1.5));   # -0.5
				</tscript>
			</td></tr>
			<tr><th>binary&nbsp;^</th><td>
				The operation <i>n&nbsp;^&nbsp;m</i> computes the <i>m</i>-th power of
				<i>n</i>. Note that raising a negative number to a non-integer power is
				not a well-defined operation, yielding the result NaN.
			</td></tr>
			</table>
			<p>
			Reals can be
			<a href="?doc=/language/expressions/binary-operators/equality">compared for equality</a>
			and they are <a href="?doc=/language/expressions/binary-operators/order">ordered</a>.
			All operations on reals can mix integers and reals. The integer is then
			converted to a real, and the operation is executed with floating-point
			logic, even if the numbers represented by the reals could be converted
			to integers without loss of precision.
			</p>

			<h2>Methods</h2>
			<table class="methods">
			<tr><th>constructor</th><td>
				<code class="code">constructor(value)</code> converts the
				value to a real. For reals this amounts to copying, integers
				are converted, and strings are parsed as decimal numbers.
				The result is subject to roundoff errors. All other types
				and all error conditions result in not-a-number.
			</td></tr>
			<tr><th>isFinite</th><td>
				<code class="code">isFinite()</code> test whether the value
				is finite. This is the case if it is neither infinite nor
				NaN.
			</td></tr>
			<tr><th>isInfinite</th><td>
				<code class="code">isInfinite()</code> test whether the value
				is infinite. This is the case if it equals positive or
				negative infinity.
			</td></tr>
			<tr><th>isNan</th><td>
				<code class="code">isNan()</code> test whether the value
				is not-a-number.
			</td></tr>
			<tr><th>inf</th><td>
				<code class="code">static inf()</code> returns positive
				infinity.
			</td></tr>
			<tr><th>nan</th><td>
				<code class="code">static nan()</code> returns not-a-number.
			</td></tr>
			</table>

            <div class="example">
            <h3>Example</h3>
            <tscript>
var infiniteR = Real.inf();

print(infiniteR.isInfinite());      # prints true
print(infiniteR.isFinite());        # prints false

            </tscript>
        </div>
		`,
					children: [],
				},
				{
					id: "string",
					name: "String",
					title: "The Type <i>String</i>",
					content: `
			<p>
			The type String represents text. A string is a sequence of
			<a href="?doc=/language/syntax/character-set">characters</a> of
			arbitrary length, also known as the <i>size</i> of the string.
			Although strings can contain any Unicode code point in the
			range U+0000 to U+FFFF,
			<a href="?doc=/language/expressions/literals/strings">string
			literals</a> allow to encode all characters with plain ASCII.
			Despite their sequence nature, strings are immutable. Hence
			when the need for modifying a string arises then a new string
			must be constructed.
			</p>

			<h2>Operations</h2>
			<table class="methods">
			<tr><th>binary&nbsp;+</th><td>
				Concatenate two strings as sequences of characters. Only one of the
				operands needs to be a string in order to trigger the application of
				this operator; the other operand is converted to a string as if it
				had been passed to the String constructor. The following two
				statements are equivalent:
				<tscript>
					print("pi = " + math.pi());
					print("pi = " + String(math.pi()));
				</tscript>
			</td></tr>
			<tr><th>item&nbsp;access&nbsp;[]</th><td>
				If the index is of type Integer then the single character at the
				specified (zero-based) position is returned. The position must be
				valid, i.e., it must neither be negative nor exceed the size of
				the string. The character is returned as an integer in the range
				0 to 65535 representing the unicode code point.
				<tscript>
					print("hello world"[5]); # prints 32, the code of " "
				</tscript>
				If the index is of type Range then the substring described by the
				range is extracted. Parts of the range that lie outside the valid
				index range are ignored.
				<tscript>
					print("hello world"[6:100]); # prints "world"
				</tscript>
			</td></tr>
			</table>
			<p>
			Strings can be
			<a href="?doc=/language/expressions/binary-operators/equality">compared for equality</a>
			and they are <a href="?doc=/language/expressions/binary-operators/order">ordered</a>.
			Strings are equal if they have the same length and all characters
			coincide. They are ordered lexicographically.
			</p>

			<h2>Methods</h2>
			<table class="methods">
			<tr><th>constructor</th><td>
				<code class="code">constructor(value)</code> converts the
				value to a string.
			</td></tr>
			<tr><th>size</th><td>
				The <code class="code">function size()</code> returns the size of
				the string, which is the number of characters in the sequence.
			</td></tr>
			<tr><th>find</th><td>
				The <code class="code">function find(searchterm, start=0, backward=false)</code>
				searches for the string <i>searchterm</i> inside the string.
				If <i>backward</i> is <keyword>false</keyword> then it returns
				the first position not smaller than <i>start</i> where it encounters
				<i>searchterm</i> inside the string, or <keyword>null</keyword>
				if it is not found. If <i>backward</i> is <keyword>true</keyword>
				then the last position no larger than <i>start</i> where
				<i>searchterm</i> is found inside the string is returned.
			</td></tr>
			<tr><th>split</th><td>
				The <code class="code">function split(separator)</code> splits
				the string into substrings, separated by the separator string.
				It returns the substrings as an array. In case of two consecutive
				separators or a separator at the beginning or end of the string
				the resulting substring is empty. Example:
				<tscript>
					var s = "hello,A,,B,";
					var a = s.split(",");
					# a = ["hello", "A", "", "B", ""]
				</tscript>
			</td></tr>
			<tr><th>toLowerCase</th><td>
				The <code class="code">function toLowerCase()</code> returns the string in only lower case characters.
			</td></tr>
			<tr><th>toUpperCase</th><td>
				The <code class="code">function toUpperCase()</code> returns the string in only upper case characters.
			</td></tr>
			<tr><th>fromUnicode</th><td>
				The <code class="code">static function fromUnicode(characters)</code>
				converts a single integer or an array of integers into a string
				the character codes of which coincide with the integers.
				<tscript>
					print(String.fromUnicode([50, 8364])); # prints "2\u20ac"
				</tscript>
			</td></tr>
			<tr><th>join</th><td>
				The <code class="code">static function join(array, separator = "")</code>
				creates a string from an array of strings, separated by the (optional)
				separator. To this end, the entries of the array and the separator
				are converted to strings at need. A typical example is to compose a
				sentence from words (with a single space as a separator):
				<tscript>
					print(String.join(["Hello", "World"], " ")); # prints "Hello World"
				</tscript>
				Another example is the composition of a path from components:
				<tscript>
					print(String.join(["documents", "computer", "bill.pdf"], "/")); # prints "documents/computer/bill.pdf"
				</tscript>
			</td></tr>
			</table>
		`,
					children: [],
				},
				{
					id: "array",
					name: "Array",
					title: "The Type <i>Array</i>",
					content: `
			<p>
			The type Array is a container capable of holding multiple values,
			called items of the array. Items are arranged in a sequence. They
			are accessed by integer-valued indices. Arrays are mutable: items
			can be inserted, deleted, and overwritten. Arrays can be created
			as <a href="?doc=/language/expressions/literals/arrays">literals</a>.
			These literals can contain arbitrary expressions (not necessarily
			literals), which evaluate to the items.
			</p>

			<h2>Indexing</h2>
			<p>
			An array with <i>n</i> items has size <i>n</i>. The items are accessed with
			<a target="_blank" href="https://en.wikipedia.org/wiki/Zero-based_numbering#Computer_programming">zero-based indices</a>
			in the range 0 to <i>n-1</i>.
			</p>

			<h2>Operations</h2>
			<table class="methods">
			<tr><th>item&nbsp;access&nbsp;[]</th><td>
				If the index is of type Integer then the single item at the
				specified (zero-based) position is returned. The position must be
				valid, i.e., it must neither be negative nor exceed the size of
				the array.
				If the index is of type Range then the sub-array described by the
				range is extracted. Parts of the range that lie outside the valid
				index range are ignored.
			</td></tr>
			</table>
			<p>
			Arrays can be
			<a href="?doc=/language/expressions/binary-operators/equality">compared for equality</a>
			and they are <a href="?doc=/language/expressions/binary-operators/order">ordered</a>,
			if all of their items are ordered.
			Arrays are equal if they have the same length and all items compare
			equal. They are ordered lexicographically. Ordering two array with
			items that are not ordered results in an error message.
			</p>

			<h2>Methods</h2>
			<table class="methods">
			<tr><th>constructor</th><td>
				<code class="code">constructor(size_or_other=0, value=null)</code>
				creates a new array. If <i>size_or_other</i> is an integer then the
				array contains <i>size_or_other</i> copies of <i>value</i>.
				If <i>size_or_other</i> is an array then the array is copied.
				if <i>size_or_other</i> is a range then an array is created
				that contains the elements are the range as items.
			</td></tr>
			<tr><th>size</th><td>
				The <code class="code">function size()</code> returns the size of
				the array, which is the number of items.
			</td></tr>
			<tr><th>push</th><td>
				The <code class="code">function push(item)</code> appends the
				given item to the array.
			</td></tr>
			<tr><th>pop</th><td>
				The <code class="code">function pop()</code> removes and returns
				the last item from the array. When applied to the empty array it
				raises an error.
			</td></tr>
			<tr><th>insert</th><td>
				The <code class="code">function insert(position, item)</code>
				inserts a new item at a given position. The index must be
				non-negative and it must not exceed the array size.
			</td></tr>
			<tr><th>remove</th><td>
				The <code class="code">function remove(range)</code> removes
				the indicated range of items from the array. If range is an
				integer, then it is interpreted as range:range+1.
			</td></tr>
			<tr><th>sort</th><td>
				The <code class="code">function sort(comparator=null)</code>
				sorts the array in-place. Sorting is stable, i.e., the order of
				equivalent items is preserved. If <i>comparator</i> equals
				<keyword>null</keyword> then the built-in
				<a href="?doc=/language/expressions/binary-operators/order">order
				relation</a> is used for sorting, which means that all items
				in the array must be ordered. Otherwise <i>comparator</i> is
				assumed to be a function of two arguments (denoted lhs and rhs)
				that returns a numeric value. A negative return value means that
				<i>lhs</i> should appear before <i>rhs</i>, a positive return
				value means <i>lhs</i> should appear after <i>rhs</i>, and zero
				indicates that the order does not matter, i.e., <i>lhs</i> and
				<i>rhs</i> are equivalent with respect to the order relation.
				The <i>compare</i> function is assumed to induce a
				<a target="_blank" href="https://en.wikipedia.org/wiki/Weak_ordering#Strict_weak_orderings">strict weak order relation</a>.
				If this assumption is not fulfilled then there is no guarantee
				that the function will manage to sort the array.
			</td></tr>
			<tr><th>keys</th><td>
				The <code class="code">function keys()</code> returns the
				range <code class="code">0:size()</code>. Its main purpose is
				compatibility with
				<a href="?doc=/language/types/dictionary">Dictionary.keys</a>.
			</td></tr>
			<tr><th>values</th><td>
				The <code class="code">function values()</code> returns the
				array itself. Its main purpose is compatibility with
				<a href="?doc=/language/types/dictionary">Dictionary.values</a>.
			</td></tr>
			<tr><th>concat</th><td>
				<code class="code">static function concat(first, second)</code>
				concatenates two arrays. It returns the concatenated array.
			</td></tr>
			</table>

            <div class="example">
            <h3>Example</h3>
            <tscript>
var arr = [2, 3, 1, 4, 5, 7, 6, 8, 9];

function ascending(a, b) {
    if a<=b then return -1; else return 1;
}

function descending(a, b) {
    if a<=b then return 1; else return -1;
}

arr.sort();
print(arr);                                     # prints [1, 2, 3, 4, 5, 6, 7, 8, 9]

arr.sort(descending);
print(arr);                                     # prints [9, 8, 7, 6, 5, 4, 3, 2, 1]

arr.sort(ascending);
print(arr);                                     # prints [1, 2, 3, 4, 5, 6, 7, 8, 9]
            </tscript>
        </div>
		`,
					children: [],
				},
				{
					id: "dictionary",
					name: "Dictionary",
					title: "The Type <i>Dictionary</i>",
					content: `
			<p>
			The type Dictionary is a container capable of holding multiple
			values, called items of the dictionary. Items are accessed with
			string-valued keys. Dictionaries are mutable: items can be inserted,
			deleted, and overwritten. Dictionaries can be created as
			<a href="?doc=/language/expressions/literals/dictionaries">literals</a>.
			These literals can contain arbitrary expressions (not necessarily
			literals), which evaluate to the items.
			</p>

			<h2>Indexing</h2>
			<p>
			A dictionary with <i>n</i> items has size <i>n</i>. The items are
			accessed with keys. Any two different strings form two different
			keys, which can refer to different items. The empty string is a
			legal key. Of course, not every possible string refers to an item,
			but only keys that were explicitly defined.
			</p>
			<p>
			Conceptually, keys in a dictionary are not ordered. In particular,
			the lexicographical order of strings does not apply. Instead, the
			<code class="code">keys()</code> and <code class="code">values()</code>
			methods report items chronologically, i.e., in the order they were
			inserted. This order also applies when converting a dictionary to
			a string.
			</p>

			<h2>Operations</h2>
			<table class="methods">
			<tr><th>item&nbsp;access&nbsp;[]</th><td>
				The index is expected to be of type string. The string must be
				a valid key, i.e., an item with that key must have been defined
				before. The operator returns the value stored with the key.
			</td></tr>
			</table>
			<p>
			Dictionaries can be
			<a href="?doc=/language/expressions/binary-operators/equality">compared for equality</a>,
			but they are not <a href="?doc=/language/expressions/binary-operators/order">ordered</a>.
			Two dictionaries compare equal if they contain the same keys, and if
			the items associated with these keys compare equal.
			</p>

			<h2>Methods</h2>
			<table class="methods">
			<tr><th>constructor</th><td>
				<code class="code">constructor(other=null)</code>
				creates a new dictionary. If <i>other</i> is null then the
				dictionary is empty. If <i>other</i> is a dictionary then it
				is copied.
			</td></tr>
			<tr><th>size</th><td>
				The <code class="code">function size()</code> returns the size of
				the dictionary, which is the number of items.
			</td></tr>
			<tr><th>has</th><td>
				The <code class="code">function has(key)</code> tests whether
				<i>key</i> is the key of an item.
			</td></tr>
			<tr><th>remove</th><td>
				The <code class="code">function remove(key)</code> removes the
				item with the given key.
			</td></tr>
			<tr><th>keys</th><td>
				The <code class="code">function keys()</code> returns an array
				of strings holding all keys of the dictionary. This method
				provides an easy way of iterating over all items of a dictionary:
				<tscript>
					var d = {a: 6, b: "foo", c: true};
					for var key in d.keys() do
						print(key + ": " + d[key]);
				</tscript>
			</td></tr>
			<tr><th>values</th><td>
				The <code class="code">function values()</code> returns an array
				holding all values of the dictionary. The order of the values
				is the same as the order of keys returned by
				<code class="code">function keys()</code>.
			</td></tr>
			<tr><th>merge</th><td>
				<code class="code">static function merge(first, second)</code>
				merges two dictionaries, i.e., it joins the key/value pairs from
				both dictionaries into a single dictionary. If a key appears in
				both dictionaries then the value from the second one prevails.
				The function returns the merged dictionary.
			</td></tr>
			</table>
			</table>

            <div class="example">
            <h3>Example</h3>
            <tscript>
var dict1 = {a: 1, b: 1};
var dict2 = {b: 2, c: 2};

print(Dictionary.merge(dict1, dict2));      # prints {a:1,b:2,c:2}
            </tscript>
        </div>
		`,
					children: [],
				},
				{
					id: "function",
					name: "Function",
					title: "The Type <i>Function</i>",
					content: `
			<p>
			The Function type represents
			<a href="?doc=/language/declarations/functions">function declarations</a>,
			<a href="?doc=/language/declarations/classes">member function
			declarations</a> applied to an object, and
			<a href="?doc=/language/expressions/literals/anonymous-functions">anonymous
			functions</a>, possibly with enclosed parameters. This summarizes
			all blocks of code that can be
			<a href="?doc=/language/expressions/function-calls">called or invoked</a>
			by providing parameters in parentheses.
			Functions are immutable. The only operation they provide is the call
			operator.
			</p>

			<h2>Operations</h2>
			<table class="methods">
			<tr><th>function&nbsp;call&nbsp;()</th><td>
				Calls the function. See
				<a href="?doc=/language/expressions/function-calls">function calls</a>
				for details.
			</td></tr>
			</table>
			<p>
			Functions can be
			<a href="?doc=/language/expressions/binary-operators/equality">compared for equality</a>,
			but they are not <a href="?doc=/language/expressions/binary-operators/order">ordered</a>.
			</p>

			<h2>Methods</h2>
			<table class="methods">
			<tr><th>constructor</th><td>
				The <code class="code">constructor(value)</code> creates a copy
				of a function value.
			</td></tr>
			</table>
		`,
					children: [],
				},
				{
					id: "range",
					name: "Range",
					title: "The Type <i>Range</i>",
					content: `
			<p>
			The Range type represents a range of integers. It is defined by
			two integers, <i>begin</i> and <i>end</i>. They define the half-open
			range
			</p>
			<div style="width: 100%; text-align: center; font-style: italic;">
				{n&nbsp;&isin;&nbsp;&#x2124;&nbsp;|&nbsp;begin&nbsp;&le;&nbsp;x&nbsp;&lt;&nbsp;end}.
			</div>
			<p>
			Consequently, in case
			of <i>begin&nbsp;&ge;&nbsp;end</i> the range is empty. Begin and end
			can be any values in the valid <a href="?doc=/language/types/integer">integer</a>
			range; in particular, they can be negative.
			</p>
			<p>
			A range can be
			constructed with the range constructor or with the
			<a href="?doc=/language/expressions/binary-operators/range">range operator&nbsp;:</a>.
			The two options are equivalent:
			<tscript>
				var r1 = Range(10, 15);
				var r2 = 10:15;
				print(r1 == r2);   # prints true
			</tscript>
			Once constructed, a range is immutable.
			</p>

			<h2>Operations</h2>
			<p>
			Ranges offer two rather trivial operations, both by means of the
			<a href="?doc=/language/expressions/item-access">item access operator</a>,
			namely access to items by index, and slicing. The behavior is designed
			to mimic that of an array holding the elements of the range as items:
			<tscript>
				var range = 10:15;   # pretend: var range = [10,11,12,13,14];
				print(range[3]);     # prints 13
				print(range[-2:2]);  # prints 10:12
			</tscript>
			Item access with an integer index requires that the index is valid,
			i.e., it is non-negative and less than the size of the range, which
			is defined as max(<i>end-begin</i>,&nbsp;0). Slicing access with another
			range does not require all indices to be valid, and the resulting range
			is clipped to the valid range.
			</p>
			<p>
			Two ranges compare equal if and
			only if begin and end coincide. This means that two empty ranges with
			different begin and end do not compare equal, although they represent the
			same (empty) set of integers. Ranges are not ordered.
			</p>

			<h2>Methods</h2>
			<table class="methods">
			<tr><th>constructor</th><td>
				The <code class="code">constructor(begin, end)</code> creates a
				new range from begin to end. Both arguments must be integers, or
				reals representing integer values.
			</td></tr>
			<tr><th>size</th><td>
				<code class="code">function size()</code> returns the size of
				the range.
			</td></tr>
			<tr><th>begin</th><td>
				<code class="code">function begin()</code> returns the begin of
				the range.
			</td></tr>
			<tr><th>end</th><td>
				<code class="code">function end()</code> returns the end of
				the range.
			</td></tr>
			</table>
		`,
					children: [],
				},
				{
					id: "type",
					name: "Type",
					title: "The Type <i>Type</i>",
					content: `
			<p>
			The values of type Type represent types, i.e., built-in types and
			classes. They are immutable. A type value can be constructed from
			any value.
			</p>
			<div class="example">
				<h3>Example</h3>
				<tscript>
					var a = [];
					var t = Type(a);
					print(t);       # &lt;Type Array&gt;
					print(Array);   # &lt;Type Array&gt;
					if t == Array then print("a is an array");

					var tt = Type(t);
					print(tt);      # &lt;Type Type&gt;
					var ttt = Type(tt);
					print(ttt);     # &lt;Type Type&gt;

					var b = t(3:8); # construct a new Array from a range using "t"
					print(b);       # [3,4,5,6,7]
				</tscript>
			</div>
			<p>
			Type values are useful for three purposes:
			<ol>
			<li>
				Testing at runtime whether a value is of a specific type.
				For example, this allows to test whether a number is an
				integer or a real, and hence for determining whether
				<a href="?doc=/language/types/integer">integer</a> or
				<a href="?doc=/language/types/real">floating point</a> arithmetic
				is used when applying an operator.
			</li>
			<li>
				Constructing new objects of a type determined at runtime,
				e.g., in a factory pattern.
			</li>
			<li>
				Type values can access static members of classes:
				<tscript>
					class A
					{
					public:
						static var s = 18;
					}

					var a = A();
					var t = Type(a);
					print(a.s);   # prints 18
					print(t.s);   # prints 18
				</tscript>
			</li>
			</ol>
			</p>

			<h2>Operations</h2>
			<p>
			Type values do not offer any operations other than the function call
			operator, which invokes the constructor of the type, and the member
			access operator, which accesses static members of the class.
			Two type values compare equal if they refer to the same type. Types
			are not ordered.
			</p>

			<h2>Methods</h2>
			<table class="methods">
			<tr><th>constructor</th><td>
				The <code class="code">constructor(value)</code> creates a new
				type object. It describes the type of <i>value</i>.
			</td></tr>
			<tr><th>superclass</th><td>
				<code class="code">static function superclass(type)</code>
				returns a type object representing the direct super class of
				the given <i>type</i>, or null if the it does not have a super
				class.
			</td></tr>
			<tr><th>isOfType</th><td>
				<code class="code">static function isOfType(value, type)</code>
				tests whether <i>value</i> is of type <i>type</i> or a derived
				class. This test is equivalent to
				<code class="code">Type.isDerivedFrom(Type(value), type)</code>.
			</td></tr>
			<tr><th>isDerivedFrom</th><td>
				<code class="code">static function isDerivedFrom(subclass, superclass)</code>
				tests whether <i>subclass</i> inherits <i>superclass</i> as a direct
				or indirect base (including the case that the types coincide).
			</td></tr>
			</table>
		`,
					children: [],
				},
				{
					id: "class",
					name: "Classes",
					title: "Classes",
					content: `
			<p>
			A Class is a user-defined type. It is created through a
			<a href="?doc=/language/declarations/classes">class declaration</a>;
			the technical aspects of class declarations are discussed right
			there.
			</p>
			<p>
			Classes allow the programmer to extend the
			<a href="?doc=/language/types">system of built-in types</a>. They open
			up the whole world of
			<a target="_blank" href="https://en.wikipedia.org/wiki/Object-oriented_programming">object-oriented programming</a>,
			a programming paradigm in which data and functionality is organized
			into objects, which are instances of classes. Objects organize data
			into semantically meaningful units. Classes bind functions operating
			on these chunks to the corresponding object. Classes define a public
			(possibly a protected) interface, defining the functionality. The
			implementation of the functionality is opaque to the user of a class
			or object, and hence allows the implementer to modify implementation
			details without affecting the outside world. This principle is known
			as "encapsulation" or "information hiding". Furthermore, classes can
			extend existing types through (single) inheritance.
			</p>

			<h2>Demonstration of Class Features</h2>
			<p>
			The following is a non-trivial example of a (rather minimal) class
			representing a date.
			</p>
			<tscript>
				# The Date class represents a date as the number of days since
				# 01.01.1970. The range is limited to years 1970 to 2099, for
				# ease of leap year handling. Objects store this value in an
				# integer, not in a member variable, but by inheriting type
				# Integer. In an object oriented view this means that a Date
				# *is* an integer. This design makes the integer operators
				# for arithmetics and comparison available for dates. The
				# class is based on the Gregorian calendar, and the date
				# format is European: "day.month.year", not "year, month day".
				class Date : Integer
				{
				private:
					static var month_start = [0, 31, 59, 90, 120, 151,
					        181, 212, 243, 273, 304, 334, 365];
					static var weekdays = ["Monday", "Tuesday", "Wednesday",
							"Thursday", "Friday", "Saturday", "Sunday"];

				public:
					# construct a date from the number of days since 1.1.1970
					constructor(daysSince1970) : super(daysSince1970)
					{ assert(daysSince1970 >= 0, "invalid date"); }

					# construct a date from day, month, and year
					static function fromDMY(day, month, year)
					{
						assert(Type(year) == Integer, "invalid date");
						assert(Type(month) == Integer, "invalid date");
						assert(Type(day) == Integer, "invalid date");
						assert(year >= 1970 and year < 2100, "invalid date");
						assert(month >= 1 and month <= 12, "invalid date");
						var leapyears = (year - 1 - 1968) // 4;
						var leapyear = year % 4 == 0;
						var mlen = month_start[month] - month_start[month - 1];
						if month == 2 and leapyear then mlen += 1;
						assert(day >= 1 and day <= mlen, "invalid date");

						var x = 365 * (year - 1970) + leapyears
						          + month_start[month - 1] + (day - 1);
						if leapyear and month > 2 then x += 1;
						return Date(x);
					}

					# return the date x days later
					function advance(x)
					{
						return Date(this + x);
					}

					# return the year component of the date
					function year()
					{
						return Integer((this + 0.5) / 365.25) + 1970;
					}

					# return the month component of the date
					function month()
					{
						var y = year();
						var r;
						if this < 2*365 then r = (this % 365);
						else
						{
							r = Integer((this - 2*365) % 365.25);
							if y % 4 == 0 and r >= 31 + 28 then r -= 1;
						}
						for var i in 0:12 do
						{
							var m = 11 - i;
							if r >= month_start[m] then return m + 1;
						}
					}

					# return the day component of the date
					function day()
					{
						var y = year();
						var r, feb29 = 0;
						if this < 2*365 then r = (this % 365);
						else
						{
							r = Integer((this - 2*365) % 365.25);
							if y % 4 == 0 then
							{
								if r == 59 then feb29 = 1;
								if r >= 59 then r -= 1;
							}
						}
						for var i in 0:12 do
						{
							var m = 11 - i;
							if r >= month_start[m] then
								return r - month_start[m] + 1 + feb29;
						}
					}

					# return the day-of-week as a string
					function dayOfWeek()
					{
						return weekdays[(this + 3) % 7];
					}

					# return a nice string representation of the date
					function prettyString()
					{
						return dayOfWeek() + ", " + day()
						                    + "." + month()
						                    + "." + year();
					}
				}

				# construct various dates
				var daysSince1970 = Integer(time() // 86400000);
				var today = Date(daysSince1970);
				var release = Date.fromDMY(version()["day"],
				                           version()["month"],
				                           version()["year"]);
				var ch = Date.fromDMY(24, 12, 1990);
				var ny = ch.advance(8);

				# operations on dates
				print("Days since TScript release: " + (today - release));
				if release > ny then print("TScript was released after 1990.");

				# date methods
				print("Christmas day 1990 was " + ch.dayOfWeek() + ", "
						+ ch.day() + "."
						+ ch.month() + "."
						+ ch.year());
				print("Newyear's day 1991 was " + ny.prettyString());
			</tscript>
		`,
					children: [],
				},
			],
		},
	],
};
