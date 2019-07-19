"use strict"

if (doc) doc.children.push({
"id": "errors",
"name": "Error Messages",
"title": "All Error Messages Explained",
"content": `
	<p>
	Sometimes error messages can be really confusing. Experienced
	programmers know how to read and interpret even seemingly obscure
	errors, and they have adapted to the oddities of their tools.
	However, beginners can get lost rather quickly when trying to
	understand the root cause of an error.
	One reason for difficult to understand error messages is that in
	some situations the parser or interpreter emitting the message would
	have to guess in order to determine the most probable cause of the
	error, while reporting only the symptoms down the road is easy.
	</p>
	<div class="example">
		<h3>Example</h3>
		Say, the programmer accidentally deleted a brace closing a
		scope. Then an error message may complain that a closing brace
		is missing at the end of the program. Or it may complain that a
		constructor is allowed only inside of a class, as in the example
		below.
		<tscript>
		class A
		{
		public:
			var x;
			function set(y)
			{
				if x == y then {
					x = y;
				}  # <-- what happens if this closing brace is removed?
				x = 3 / y;
			}
			constructor()
			{
				x = 0;
			}
		}
		</tscript>
		Assume that the marked brace was accidentally deleted.
		What the programmer perceives is that according his code layout
		the constructor is indeed part of the class, so the error does
		not seem to make any sense. In contrast, TScript sees the
		constructor as being declared within function
		<code class="code">set</code>, because it
		keeps interpreting closing braces differently than the programmer
		until it finally encounters an unresolvable situation and
		reports an error. By the time it encounters the constructor it
		knows nothing about the class being never closed by a brace,
		from which a really smart program may then be able to narrow down
		the error, or at least conclude that the error's root cause could
		possibly be found in many different places.
	</div>
	<p>
	Such situations are hard to avoid in entirety. Therefore, when
	encountering a strange error it is helpful to understand how error
	messages come about. For sure, the true cause of the error is found
	<i>before</i> the reported error position, and as the above example
	demonstrates, it may be far from the position where an error is
	finally reported. More often than not, the true error is in the
	statement <i>just preceding</i> the one where an error is reported.
	In addition to such general but somewhat limited insights, this
	section aims to help by explaining in detail what each error message
	means, how it typically occurs, and which pitfalls one should be
	aware of.
	</p>

	<h2>Placeholders</h2>
	<p>
	Many error messages in this documentation contain placeholders like
	'X' and 'Y'. In an actual error message, these placeholders are
	replaced with actual names. For example, the error message
	<b>cannot order type 'X'</b> in the documentation could appear in a
	real context as <b>cannot order type 'Dictionary'</b>.
	</p>
`,
"children": [
	{"id": "syntax",
	"name": "Syntax Errors",
	"title": "Syntax Errors",
	"content": `
		<p>
		A syntax error indicates failure to follow the
		<a href="#/language/syntax/EBNF-syntax">formal syntax</a>
		of the language.
		</p>
	`,
	"children": [
		{"id": "se-1",
		"content": `
			<p>
			This error occurs when a number is parsed as a floating point
			literal with exponent indicator <code class="code">E</code> or
			<code class="code">e</code>, but the indicator is not followed
			by a number, as it should.
			</p>
			<div class="example">
				<h3>Example</h3>
				<tscript>
					print(-6.2E+002);   # exponent is present
					# print(-6.2E+);    # error
				</tscript>
			</div>
		`,
		"children": []},
		{"id": "se-2",
		"content": `
			<p>
			Each <a href="#/language/expressions/literals/strings">string literal</a>
			must end within a single line. This error indicates that the
			closing double quotes character was not found before the end
			of the line.
			</p>
		`,
		"children": []},
		{"id": "se-3",
		"content": `
			<p>
			A Unicode escape sequence in a
			<a href="#/language/expressions/literals/strings">string literal</a>
			is of the form <code class="code">\\uXXXX</code>, where each
			X represents a hexadecimal digit, i.e., a digit or a lower
			or upper case letter in the range A to F. This error is
			reported if not all of the four characters following the \\u
			sequence are hex digits.
			</p>
			<div class="example">
				<h3>Example</h3>
				<tscript>
					print("\\u20AC");    # Euro sign
					# print("\\u20");    # error: too few characters
					# print("\\u20YZ");  # error: Y and Z are invalid
				</tscript>
			</div>
		`,
		"children": []},
		{"id": "se-4",
		"content": `
			<p>
			In a
			<a href="#/language/expressions/literals/strings">string literal</a>,
			the backslash character starts an escape sequence. Only specific codes
			are allowed in escape sequences, as specified
			<a href="#/language/syntax/tokens">here</a>. This error occurs if an
			invalid code is encountered.
			</p>
			<div class="example">
				<h3>Example</h3>
				<tscript>
					print("\\n");     # line feed
					# print("\\z");   # error: z is not a value escape code
				</tscript>
			</div>
		`,
		"children": []},
		{"id": "se-5",
		"content": `
			<p>
			This error is reported if an invalid character was encountered
			in the program. All characters are legal inside comments and
			string literals, but not in the rest of the program. The exact
			rules which character is legal in which context are determined
			by the
			<a href="#/language/syntax/EBNF-syntax">syntax rules</a>.
			For example, the character <code class="code">@</code> is not
			legal outside comments and string literals.
			</p>
		`,
		"children": []},
		{"id": "se-6",
		"content": `
			<p>
			The keyword <keyword>super</keyword> refers to the super class
			of the current class. Therefore, using this keyword outside of
			a class declaration results in this error.
			</p>
		`,
		"children": []},
		{"id": "se-7",
		"content": `
			<p>
			The keyword <keyword>super</keyword> refers to the super class
			of the current class. Therefore, using this keyword in a class
			that does not have a super class results in this error.
			</p>
		`,
		"children": []},
		{"id": "se-8",
		"content": `
			<p>
			The keyword <keyword>super</keyword> is used to refer to members
			of the super class. The reference is of the form
			<code class="code">super.name</code>. This error indicates that
			the dot is missing after super.
			</p>
		`,
		"children": []},
		{"id": "se-9",
		"content": `
			<p>
			The keyword <keyword>super</keyword> is used to refer to members
			of the super class. The reference is of the form
			<code class="code">super.name</code>. This error indicates that
			the identifier is missing after super.
			</p>
		`,
		"children": []},
		{"id": "se-10",
		"content": `
			<p>
			This error can occur in multiple contexts, namely when parsing the
			super class in a class declaration, in a use directive, and when
			parsing the loop variable of a for-loop. It indicates that a name
			referring to a type or variable is expected but not found.
			</p>
		`,
		"children": []},
		{"id": "se-11",
		"content": `
			<p>
			A name is a sequence of identifiers separated by dots. This error
			indicates that the name ends with a dot, while it should end with
			an identifier. In other words, there is either a trailing dot or
			an identifier is missing at the end.
			</p>
		`,
		"children": []},
//		{"id": "se-12",
//		"content": `
//			<p>
//			This error occurs if a name refers to a non-static member of an outer
//			class. It cannot be accessed because the <keyword>this</keyword> object
//			of the inner class is unrelated.
//			</p>
//		`,
//		"children": []},
		{"id": "se-13",
		"content": `
			<p>
			This error message indicates that a name refers to a non-static
			attribute or method, which requires <keyword>this</keyword> to be
			valid, but the lookup happens from a static context where no
			<keyword>this</keyword> object exists.
			</p>
			<div class="example">
				<h3>Example</h3>
				<tscript>
				class A
				{
				public:
					var x;
					static function f()
					{
						# print(x);   # error
					}
				}
				</tscript>
			</div>
			<p>
			A context where this error may be unintuitive at first is when
			using a function name as a
			<a href="#/language/expressions/constants">constant expression</a>,
			i.e., as the default value of a parameter or as the initializer
			of an attribute. A constant can refer to a function declaration
			only if it is not a member of a class or if it is static.
			</p>
			<div class="example">
				<h3>Example</h3>
				<tscript>
				class A
				{
				public:
					function f() { }
					static function s() { }
					# var y = f;      # error
					var z = s;        # okay
				}
				</tscript>
			</div>
		`,
		"children": []},
		{"id": "se-14",
		"content": `
			<p>
			When calling a function, all positional arguments must precede
			the named arguments. This error occurs when that rule is violated
			</p>
			<div class="example">
				<h3>Example</h3>
				<tscript>
				function f(a, b=0, c=0) { /*...*/ }
				f(7, c=2);      # okay
				# f(b=2, 6);    # error
				</tscript>
			</div>
		`,
		"children": []},
		{"id": "se-15",
		"content": `
			<p>
			This error indicates that a function call is broken. The argument list
			is a comma-separated list of expressions in parentheses. In other words,
			each expression is followed either by a comma or by a closing parenthesis.
			The error is reported if a different token is encountered.
			</p>
		`,
		"children": []},
		{"id": "se-16",
		"content": `
			<p>
			The formal syntax of a function call does not ensure that the object
			being called is indeed callable.
			</p>
			<div class="example">
				<h3>Example</h3>
				<tscript>
				function f(a) { }
				var a = f;
				a(3);      # okay
				a = 42;
				# a(3);    # error
				</tscript>
			</div>
		`,
		"children": []},
		{"id": "se-21",
		"content": `
			<p>
			The result of applying a left-unary of binary operator like
			<code class="code">+</code> is a temporary value. Assigning
			to this value does not make any sense, and therefore is a
			syntax error.
			</p>
			<div class="example">
				<h3>Example</h3>
				<tscript>
				var a;
				a = 1 + 2;      # okay
				# a + 1 = 2;    # error
				</tscript>
			</div>
		`,
		"children": []},
		{"id": "se-22",
		"content": `
			<p>
			Any expression can be enclosed in parentheses, usually for the
			purpose of overriding operator precedence rules. When nesting
			many parenthesis in a single expression, it is a common mistake
			to forget to close a parenthesis, which results in this error.
			</p>
		`,
		"children": []},
		{"id": "se-23",
		"content": `
			<p>
			A sequence of digits forms an integer <i>token</i>. However, an integer
			<i>literal</i> is limited to the range 0 to 2147483647=2<sup>31</sup>-1,
			since otherwise overflow would apply, which is undesirable for literals.
			This error indicates that the valid range was exceeded.
			</p>
			<p>
			This poses the difficulty of representing the smallest integer value,
			which is -2147483648. It cannot be denoted as such, because its
			positive counterpart exceeds the valid range, so an error occurs
			before negation is applied. Instead, the value can be denoted as
			follows:
			</p>
			<div class="example">
				<h3>Example</h3>
				<tscript>
				var a = -2147483647 - 1;          # usable as a constant
				var b = -2^31;                    # usable as a constant
				var c = Integer(-2147483648.0);   # not usable as a constant
				</tscript>
			</div>
		`,
		"children": []},
		{"id": "se-24",
		"content": `
			<p>
			An <a href="#/language/expressions/literals/arrays">array literal</a>
			starts with an opening bracket <code class="code">[</code> and stops with
			a closing bracket <code class="code">]</code>, enclosing a comma-separated
			list of expressions. This error indicates that neither a comma nor a
			closing bracket was found after an expression.
			</p>
		`,
		"children": []},
		{"id": "se-25",
		"content": `
			<p>
			An <a href="#/language/expressions/literals/arrays">array literal</a>
			starts with an opening bracket <code class="code">[</code> and stops with
			a closing bracket <code class="code">]</code>. This error indicates that
			the end of the program was reached without encountering the closing
			bracket.
			</p>
		`,
		"children": []},
		{"id": "se-26",
		"content": `
			<p>
			Keys in a dictionary must be unique. This error occurs if a
			<a href="#/language/expressions/literals/dictionaries">dictionary literal</a>
			specifies the given key more than once.
			</p>
			<div class="example">
				<h3>Example</h3>
				<tscript>
				var dict = {
						"name": "john",
						"age": 25,
						# "name": "smith",   # error: duplicate key 'name'
						"address": "..."
					};
				</tscript>
			</div>
		`,
		"children": []},
		{"id": "se-27",
		"content": `
			<p>
			A <a href="#/language/expressions/literals/dictionaries">dictionary literal</a>
			starts with an opening brace <code class="code">{</code> and stops with
			a closing brace <code class="code">}</code>, enclosing a comma-separated
			list of key-value pairs. This error indicates that neither a comma nor a
			closing brace was found after a value.
			</p>
		`,
		"children": []},
		{"id": "se-28",
		"content": `
			<p>
			Keys in a <a href="#/language/expressions/literals/dictionaries">dictionary literal</a>
			are identifiers or strings. This error is reported if neither of them
			was found where a key was expected.
			</p>
		`,
		"children": []},
		{"id": "se-29",
		"content": `
			<p>
			In a <a href="#/language/expressions/literals/dictionaries">dictionary literal</a>,
			keys and values are separated by colons. This error occurs is there is
			no colon found after the key.
			</p>
		`,
		"children": []},
		{"id": "se-30",
		"content": `
			<p>
			A <a href="#/language/expressions/literals/dictionaries">dictionary literal</a>
			starts with an opening brace <code class="code">{</code> and stops with
			a closing brace <code class="code">}</code>. This error indicates that
			the end of the program was reached without encountering the closing
			brace.
			</p>
		`,
		"children": []},
		{"id": "se-31",
		"content": `
			<p>
			An <a href="#/language/expressions/literals/anonymous-functions">anonymous function</a>
			expression encloses variables as a comma-separated list of named expressions
			enclosed in square brackets. In other words, a comma or a closing bracket
			must follow each variable or expression, otherwise this error is reported.
			</p>
		`,
		"children": []},
		{"id": "se-32",
		"content": `
			<p>
			An <a href="#/language/expressions/literals/anonymous-functions">anonymous function</a>
			expression encloses variables as a comma-separated list of named expressions
			in square brackets. It can enclose variables under their names in the
			surrounding scope, or it can enclose an expression under an explicitly
			given (variable) name. In the latter case, if the variable name is missing
			then this error is reported.
			</p>
		`,
		"children": []},
		{"id": "se-33",
		"content": `
			<p>
			The parameter list of a function is a comma separated list of identifiers,
			possibly with the definition of default values, enclosed in parentheses.
			Hence, each identifier (optionally with its default value) must be followed
			by a comma or closing parenthesis, otherwise this error is reported.
			</p>
		`,
		"children": []},
		{"id": "se-35",
		"content": `
			<p>
			When using the keyword <keyword>function</keyword> in an expression,
			an <a href="#/language/expressions/literals/anonymous-functions">anonymous function</a>
			is declared. The keyword is followed by an optional list of closure
			variables enclosed in square brackets or by a parameter list in
			enclosed parentheses, otherwise this error is emitted.
			</p>
		`,
		"children": []},
		{"id": "se-36",
		"content": `
			<p>
			When declaring a <a href="#/language/declarations/functions">function</a>,
			<a href="#/language/expressions/literals/anonymous-functions">anonymous function</a>,
			or a <a href="#/language/declarations/classes">constructor</a>,
			then a parameter list must be defined, even if it is empty. This
			error indicates that the opening parenthesis was not found.
			</p>
		`,
		"children": []},
		{"id": "se-37",
		"content": `
			<p>
			A <href="#/language/declarations/functions">function</a> declares
			parameters as a comma-separated list in parentheses. Hence, each
			parameter must be followed by a comma or a closing parenthesis,
			otherwise this error is reported.
			</p>
		`,
		"children": []},
		{"id": "se-38",
		"content": `
			<p>
			Default values of
			<href="#/language/declarations/functions">function</a> parameters
			must be <a href="#/language/expressions/constants">constants</a>.
			This error indicates that the default value expression is not
			considered a proper constant in TScript.
			</p>
		`,
		"children": []},
		{"id": "se-40",
		"content": `
			<p>
			This error indicates that a namespace, class, or function body is
			missing in a <a href="#/language/declarations">declaration</a> or
			<a href="#/language/expressions/literals/anonymous-functions">anonymous function</a>.
			</p>
		`,
		"children": []},
		{"id": "se-41",
		"content": `
			<p>
			A keyword that cannot initiate an expression was detected in a context
			where an expression is expected. Such contexts are manifold, i.e.,
			on the right-hand-side of an assignment operator, within a function
			call, in the condition of a do-while or while-do loop, etc.
			</p>
			<p>
			For example, the keyword <keyword>true</keyword> itself represents a
			valid expression. On the contrary, the keyword <keyword>while</keyword>
			cannot be part of an expression.
			</p>
		`,
		"children": []},
		{"id": "se-42",
		"content": `
			<p>
			A token that cannot initiate an expression was detected in a context
			where an expression is expected. Such contexts are manifold, i.e.,
			on the right-hand-side of an assignment operator, within a function
			call, in the condition of a do-while or while-do loop, etc.
			</p>
			<p>
			For example, integer, real and string tokens represents valid expressions.
			On the contrary, an expression cannot start with the token
			<code class="code">,</code> (a comma).
			</p>
		`,
		"children": []},
		{"id": "se-43",
		"content": `
			<p>
			A <a href="#/language/expressions/names">name</a> used to
			<a href="#/language/expressions/member-access">access a member</a>
			of an object or a namespace is a sequence of identifiers separated
			with dots. This error indicates that the sequence ends with a dot,
			and not with an identifier, as it should.
			</p>
		`,
		"children": []},
		{"id": "se-44",
		"content": `
			<p>
			Characters of strings and items of arrays and dictionaries are
			<a href="#/language/expressions/item-access">accessed with an index in square brackets</a>.
			This error indicates that the closing square bracket is missing
			after the index expression.
			</p>
		`,
		"children": []},
		{"id": "se-47",
		"content": `
			<p>
			Within a <a href="#/language/declarations/classes">class declaration</a>
			the keyword <keyword>this</keyword> refers to the object upon which
			a method acts. The keyword is only meaningful in contexts that do
			actually act on an object. The use of <keyword>this</keyword> in
			static functions and inner functions results in this error message.
			</p>
			<p>
			A second legal use of the <keyword>this</keyword> keyword is within an
			<a href="#/language/expressions/literals/anonymous-functions">anonymous function</a>.
			There it refers to the function itself, and hence allows the function
			to recursively call itself.
			</p>
			<div class="example">
				<h3>Example</h3>
				<tscript>
				class A
				{
				public:
					function f()
					{
						print(this);          # okay
						var a = function ()
						{
							# print(this);    # error
						};
					}
					static function s()
					{
						# print(this);        # error
					}
				}
				</tscript>
			</div>
		`,
		"children": []},
		{"id": "se-48",
		"content": `
			<p>
			An <a href="#/language/statements/assignments">assignment</a> ends with
			a semicolon. This error indicates that the semicolon was not found after
			the expression on the right-hand-side of the assignment operator.
			</p>
			<p>
			Common reasons for this error are that
			<ul>
			<li>the programmer either forgot to put the semicolon, <b>often in the preceding line</b>, or</li>
			<li>the right-hand-side expression ends earlier than anticipated by the
			programmer, usually due to a mistake.</li>
			</ul>
			</p>
		`,
		"children": []},
		{"id": "se-49",
		"content": `
			<p>
			This error indicates that an <a href="#/language/expressions">expression</a>
			ended in an unexpected way. When
			<a href="#/language/statements/expressions">using an expression as a statement</a>,
			the expression must be terminated with a semicolon. Alternatively, the expression
			can be continued by appending a binary operator and a further expression.
			If these expectations are not met then this error is reported.
			</p>
			<p>
			Common reasons for this error are that
			<ul>
			<li>the programmer either forgot to put the semicolon, or</li>
			<li>the expression ends earlier than anticipated by the programmer,
			usually due to a mistake.</li>
			</ul>
			</p>
		`,
		"children": []},
		{"id": "se-50",
		"content": `
			<p>
			In a <a href="#/language/declarations/variables">variable declaration</a>,
			the names of all variables must be identifiers. This error indicates that
			a different type of <a href="#/language/syntax/tokens">token</a> was
			encountered instead.
			</p>
		`,
		"children": []},
		{"id": "se-51",
		"content": `
			<p>
			This error indicates that the basic syntax of a
			<a href="#/language/declarations/variables">variable declaration</a>
			is violated. Variables are separated with commas, the list closes with a
			semicolon, and each variable can have an initializer starting with an
			equals sign. Therefore the identifier must be followed by an equals sign,
			a comma, or a semicolon. Otherwise this error is reported.
			</p>
		`,
		"children": []},
		{"id": "se-51b",
		"content": `
			<p>
			This error indicates that the basic syntax of a
			<a href="#/language/declarations/variables">variable declaration</a>
			is violated. Variables are separated with commas, the list closes with a
			semicolon. Therefore the initializer must be followed by a comma or a
			semicolon. Otherwise this error is reported.
			</p>
		`,
		"children": []},
		{"id": "se-52",
		"content": `
			<p>
			A <a href="#/language/declarations/functions">function declaration</a>
			must have a name, which is an identifier. This error indicates that the
			name was not found after the <keyword>function</keyword> keyword.
			</p>
			<p>
			One possible cause of this error is the attempt to denote an anonymous
			function in an expression forming a statement. This does not work directly,
			since the <keyword>function</keyword> keyword triggers a function
			declaration, which is different from an anonymous function expression.
			The anonymous function can be enclosed in parentheses in order to ensure
			proper parsing as an expression.
			</p>
		`,
		"children": []},
		{"id": "se-53",
		"content": `
			<p>
			The <a href="#/language/declarations/classes">constructor of a class</a>
			can invoke the constructor of the super class with a special syntax,
			</p>
		`,
		"children": []},
		{"id": "se-54",
		"content": `
			<p>
			A <a href="#/language/declarations/classes">class declaration</a>
			contains an identifier acting as the name of the class. This error
			indicates that no identifier was found after the keyword
			<keyword>class</keyword>.
			</p>
		`,
		"children": []},
		{"id": "se-55",
		"content": `
			<p>
			An <a href="#/language/declarations/classes">access modifier in a class declaration</a>
			consists of one of the keywords <keyword>public</keyword>, <keyword>protected</keyword>,
			or <keyword>private</keyword>, followed by a colon. This error indicates that the colon
			is missing.
			</p>
		`,
		"children": []},
		{"id": "se-56",
		"content": `
			<p>
			All <a href="#/language/declarations/classes">members of a class</a>
			are subject to a visibility modifier, consisting of one of the keywords
			<keyword>public</keyword>, <keyword>protected</keyword>, or
			<keyword>private</keyword>, followed by a colon. This error indicates
			that a member declaration precedes the first visibility modifier.
			</p>
		`,
		"children": []},
		{"id": "se-57",
		"content": `
			<p>
			<a href="#/language/declarations/classes">Attributes of a class</a>
			can be initialized in their declaration by providing an initializer.
			This works for static as well as for non-static attributes. However,
			in contrast to global and local variables, the initializer must be
			a <a href="#/language/expressions/constants">constant</a>.
			</p>
		`,
		"children": []},
		{"id": "se-58",
		"content": `
			<p>
			All <a href="#/language/declarations/classes">members of a class</a>
			are subject to visibility settings. The constructor of a class always
			calls the constructor of the super class. This even holds for the
			default constructor, which is generated if no constructor is
			explicitly declared.
			</p>
			<p>
			If the super class has declared its constructor private then the
			sub-class cannot properly initialize the super class. Therefore
			inheriting a class with private constructor is not possible.
			</p>
		`,
		"children": []},
		{"id": "se-59",
		"content": `
			<p>
			The <a href="#/language/declarations/classes">constructor of a class</a>
			needs a <keyword>this</keyword> reference to the object to be initialized,
			therefore it cannot be static. This error indicates that the constructor
			was marked as static.
			</p>
		`,
		"children": []},
		{"id": "se-59b",
		"content": `
			<p>
			The <a href="#/language/declarations/classes">constructor of a class</a>
			must be unique, it cannot be overloaded. Remove all but one constructor
			to fix this error.
			</p>
		`,
		"children": []},
		{"id": "se-60",
		"content": `
			<p>
			The only members of a <a href="#/language/declarations/classes">class</a>
			that can be declared are attributes and methods. This error indicates that
			a class declaration found inside the scope of another class is declared
			static.
			</p>
		`,
		"children": []},
		{"id": "se-61",
		"content": `
			<p>
			The only members of a <a href="#/language/declarations/classes">class</a>
			that can be declared are attributes and methods. This error indicates that
			a <a href="#/language/directives/use">use directive</a> found inside the
			scope of another class is declared static.
			</p>
		`,
		"children": []},
		{"id": "se-62",
		"content": `
			<p>
			This error indicates that an unexpected entity was found inside a
			<a href="#/language/declarations/classes">class</a>. The class syntax
			demands that only access modifiers, attribute and method declarations,
			declarations of nested classes, and use-directives are allowed.
			</p>
		`,
		"children": []},
		{"id": "se-63",
		"content": `
			<p>
			As the error message states, a
			<a href="#/language/declarations/namespaces">namespace</a> can be
			declared only at global scope or nested within another namespace.
			It must not be declared at function of class scope. The error
			message indicates that this rule was violated.
			</p>
		`,
		"children": []},
		{"id": "se-64",
		"content": `
			<p>
			A <a href="#/language/declarations/namespaces">namespace declaration</a>
			contains an identifier acting as the name of the class. This error
			indicates that no identifier was found after the keyword
			<keyword>namespace</keyword>.
			</p>
		`,
		"children": []},
		{"id": "se-65",
		"content": `
			<p>
			<a href="#/language/directives/use">Use directives</a> can have two forms.
			This error occurs if the form starting with <keyword>from</keyword> does
			not contain the keyword <keyword>use</keyword> after the from-clause.
			</p>
		`,
		"children": []},
		{"id": "se-66",
		"content": `
			<p>
			In a <a href="#/language/directives/use">use directive</a>, an imported name
			can be remapped to a different name with an <keyword>as</keyword> clause.
			However, the same mechanism does not work when importing all name from a
			namespace. This error indicates that the attempt was made nevertheless.
			</p>
		`,
		"children": []},
		{"id": "se-67",
		"content": `
			<p>
			This error indicates that the <ebnf>identifier</ebnf> is missing after
			<keyword>as</keyword> in a <a href="#/language/directives/use">use directive</a>.
			</p>
		`,
		"children": []},
		{"id": "se-68",
		"content": `
			<p>
			In a <a href="#/language/directives/use">use directive</a>, multiple names
			or whole namespaces can be imported. The individual imports are separated
			with commas, and the overall use directive closes with a semicolon. Therefore
			each import must be followed either by a comma or by a semicolon. This error
			indicates that the above rule is violated.
			</p>
		`,
		"children": []},
		{"id": "se-69",
		"content": `
			<p>
			The error indicates that in an
			<a href="#/language/statements/if-then-else">if-then-else</a> conditional
			statement the keyword <keyword>then</keyword> is missing. This mistake is
			commonly made by programmers coming from C-style languages which do not
			have this keyword.
			</p>
		`,
		"children": []},
		{"id": "se-70",
		"content": `
			<p>
			A <a href="#/language/statements/for-loops">for loop</a> uses a loop
			variable to indicate its current iteration. If this variable is declared
			within the loop with the <keyword>var</keyword> keyword, then the variable
			name must be a plain <ebnf>identifier</ebnf>. The error message indicates
			that a non-identifier token was encountered.
			</p>
		`,
		"children": []},
		{"id": "se-71",
		"content": `
			<p>
			In a <a href="#/language/statements/for-loops">for loop</a> declaring its
			own loop variable, the keyword <keyword>in</keyword> must follow the loop
			variable declaration. This error indicates that some other token was
			encountered.
			</p>
		`,
		"children": []},
		{"id": "se-72",
		"content": `
			<p>
			In a <a href="#/language/statements/for-loops">for loop</a> after the
			container to loop over must be followed by the keyword <keyword>do</keyword>.
			This error indicates that some other token was encountered.
			</p>
		`,
		"children": []},
		{"id": "se-73",
		"content": `
			<p>
			If a <a href="#/language/statements/for-loops">for loop</a> does not use
			loop variable declared within the loop, then the expression following
			the keyword <keyword>for</keyword> could either be an externally declared
			loop variable or the container to iterate over. In the former case, the
			expression must be followed by <keyword>in</keyword>, in the latter case
			by <keyword>do</keyword>. The error message indicates that neither one
			was found.
			</p>
		`,
		"children": []},
		{"id": "se-74",
		"content": `
			<p>
			The syntax of a <a href="#/language/statements/do-while-loops">do-while loop</a>
			demands that the loop body is followed by the keyword <keyword>while</keyword>.
			This error message indicates that an different token was encountered.
			</p>
		`,
		"children": []},
		{"id": "se-75",
		"content": `
			<p>
			The syntax of a <a href="#/language/statements/do-while-loops">do-while loop</a>
			demands that the condition is followed by a semicolon.
			This error message indicates that an different token was encountered.
			It may indicate that the expression representing the loop condition
			is broken.
			</p>
		`,
		"children": []},
		{"id": "se-76",
		"content": `
			<p>
			The syntax of a <a href="#/language/statements/while-do-loops">while-do loop</a>
			demands that the condition is followed by the keyword <keyword>do</keyword>.
			This error message indicates that an different token was encountered.
			</p>
		`,
		"children": []},
		{"id": "se-77",
		"content": `
			<p>
			A <a href="#/language/statements/break-continue">break</a> statement
			can only appear inside a loop. This error message indicates that there
			is no loop surrounding the statement.
			</p>
		`,
		"children": []},
		{"id": "se-78",
		"content": `
			<p>
			A <a href="#/language/statements/break-continue">continue</a> statement
			can only appear inside a loop. This error message indicates that there
			is no loop surrounding the statement.
			</p>
		`,
		"children": []},
		{"id": "se-79",
		"content": `
			<p>
			A <a href="#/language/statements/return">return</a> statement returns
			the control flow from the current function back to the calling context.
			When doing so, it can also return a value, which then becomes the value
			of the function call expression. However, a constructor does not evaluate
			to an arbitrary expression and therefore cannot return a value. A return
			statement inside a constructor must not contain a return value, otherwise
			this error is reported.
			</p>
		`,
		"children": []},
		{"id": "se-80",
		"content": `
			<p>
			A <a href="#/language/statements/return">return</a> statement returns
			the control flow from the current function back to the calling context.
			When doing so, it can also return a value, which then becomes the value
			of the function call expression. When applied at global or namespace
			scope, the return statement ends the program. Since a program does not
			have a value, a return statement at global or namespace scope must not
			contain a return value, otherwise this error is reported.
			</p>
		`,
		"children": []},
		{"id": "se-81",
		"content": `
			<p>
			A <a href="#/language/statements/return">return</a> statement ends with
			a semicolon. The error message indicates that this is not the case.
			The most probably reason is that the return expression is broken.
			</p>
		`,
		"children": []},
		{"id": "se-82",
		"content": `
			<p>
			<a href="#/language/statements/try-catch">try-catch</a>
			</p>
		`,
		"children": []},
		{"id": "se-84",
		"content": `
			<p>
			<a href="#/language/statements/try-catch">try-catch</a>
			</p>
		`,
		"children": []},
		{"id": "se-85",
		"content": `
			<p>
			<a href="#/language/statements/try-catch">try-catch</a>
			</p>
		`,
		"children": []},
		{"id": "se-86",
		"content": `
			<p>
			<a href="#/language/statements/try-catch">try-catch</a>
			</p>
		`,
		"children": []},
		{"id": "se-87",
		"content": `
			<p>
			A <a href="#/language/statements/throw">throw</a> statements ends with
			a semicolon. This error message indicates that the semicolon is missing.
			The most probably cause of this error is a bug in the expression preceding
			the semicolon.
			</p>
		`,
		"children": []},
		{"id": "se-88",
		"content": `
			<p>
			Curly braces can close
			<a href="#/language/statements/blocks">blocks of statements</a> and
			<a href="#/language/expressions/literals/dictionaries">dictionary literals</a>.
			This error indicates that a closing brace was found in a different
			context. The most common cause of this error is that the declaration
			or statement preceding the closing brace is broken.
			</p>
		`,
		"children": []},
		{"id": "se-89",
		"content": `
			<p>
			This error is reported if a keyword that cannot start a statement
			(like, e.g., <keyword>static</keyword>) was encountered where a
			statement was expected. This error has two common causes:
			<ul>
				<li>a keyword was used as an identifier, or</li>
				<li>the preceding statement is broken.</li>
			</ul>
			</p>
		`,
		"children": []},
		{"id": "se-90",
		"content": `
			<p>
			This error is reported if a token that cannot start a statement
			(like, e.g., <code class="code">+=</code>) was encountered where a
			statement was expected. This error usually indicates that the
			statement directly preceding the location where the error is
			reported is broken.
			</p>
		`,
		"children": []},
	]},
	{"id": "argument-mismatch",
	"name": "Argument Mismatch",
	"title": "Argument Mismatch",
	"content": `
		<p>
		Values passed into a function or operator can mismatch the needs
		and expectations of the function being called in several ways.
		Arguments can be of the wrong type, or their values can be in an
		invalid range. Errors in this category reflect such events.
		</p>
	`,
	"children": [
		{"id": "am-1",
		"content": `
			<p>
			A function specifies how many arguments it expects, but the formal
			function declaration does not specify which types can be processed.
			For example, the wait function expects the number of milliseconds
			to wait as an argument, which must be a number. If a value of
			unrelated type is passed, say, a dictionary, then the function
			reports this error.
			</p>
			<div class="example">
				<h3>Example</h3>
				<tscript>
					wait(10);         # okay
					# wait("foo");    # error
					# wait({a: 2});   # error
				</tscript>
			</div>
			<p>
			Such errors occur for two frequent reasons.
			<ol>
			<li>The programmer passes positional
			arguments in the wrong order. For example, the function
			String.find expects a search key (string), a start position
			(integer), and a flag (boolean). If the programmer passes
			the start position first, then the function tries to
			interpret it as the search key. Since the value is not a
			string, the attempt fails and an error is reported.</li>
			<li>A variable or expression
			passed to a function as a parameter is of a type that is
			not expected by the programmer.</li>
			</ol>
			</p>
		`,
		"children": []},
		{"id": "am-2",
		"content": `
			<p>
			The <a href="#/language/expressions/unary-operators/minus">unary operator not</a>
			is only defined for boolean arguments. Applying unary not
			to a value of any other type results in this error.
			</p>
		`,
		"children": []},
		{"id": "am-3",
		"content": `
			<p>
			The <a href="#/language/expressions/unary-operators/plus">unary operator +</a>
			is only defined for numerical arguments. Applying unary plus
			to a value of any other type results in this error.
			</p>
		`,
		"children": []},
		{"id": "am-4",
		"content": `
			<p>
			The <a href="#/language/expressions/unary-operators/minus">unary operator -</a>
			is only defined for numerical arguments. Applying unary minus
			to a value of any other type results in this error.
			</p>
		`,
		"children": []},
		{"id": "am-5",
		"content": `
			<p>
			This error occurs if the
			<a href="#/language/expressions/binary-operators/addition">binary operator +</a>
			is applied to two types that cannot be added. The operator supports
			numeric types as well as string concatenation. All other operand
			types result in this error.
			</p>
		`,
		"children": []},
		{"id": "am-6",
		"content": `
			<p>
			This error occurs if the
			<a href="#/language/expressions/binary-operators/subtraction">binary operator -</a>
			is applied to non-numeric arguments.
			</p>
		`,
		"children": []},
		{"id": "am-7",
		"content": `
			<p>
			This error occurs if the
			<a href="#/language/expressions/binary-operators/multiplication">binary operator +</a>
			is applied to non-numeric arguments.
			</p>
		`,
		"children": []},
		{"id": "am-8",
		"content": `
			<p>
			This error occurs if the
			<a href="#/language/expressions/binary-operators/real-division">binary operator /</a>
			or the
			<a href="#/language/expressions/binary-operators/integer-division">binary operator \/\/</a>
			is applied to non-numeric arguments.
			</p>
		`,
		"children": []},
		{"id": "am-9",
		"content": `
			<p>
			This error occurs if the
			<a href="#/language/expressions/binary-operators/modulo">binary operator %</a>
			is applied to non-numeric arguments.
			</p>
		`,
		"children": []},
		{"id": "am-10",
		"content": `
			<p>
			This error occurs if the
			<a href="#/language/expressions/binary-operators/power">binary operator ^</a>
			is applied to non-numeric arguments.
			</p>
		`,
		"children": []},
		{"id": "am-11",
		"content": `
			<p>
			This error occurs if the
			<a href="#/language/expressions/binary-operators/addition">binary operator :</a>
			is applied to non-integer arguments.
			</p>
		`,
		"children": []},
		{"id": "am-12",
		"content": `
			<p>
			This error occurs if one of the binary operators
			<a href="#/language/expressions/binary-operators/and">and</a>,
			<a href="#/language/expressions/binary-operators/or">or</a>, or
			<a href="#/language/expressions/binary-operators/xor">xor</a>
			is applied to non-boolean non-integer arguments.
			</p>
		`,
		"children": []},
		{"id": "am-13",
		"content": `
			<p>
			This error occurs when a value is converted to an integer. The
			value is often a real, but it can also be a string that is
			interpreted as a real. If the real is not a finite value or if
			the string representation overflows to an infinite value then
			the error occurs. It is an error because integers cannot
			represent infinity and not-a-number, and also the integer
			overflow rules are unsuitable to resolve this situation.
			</p>
			<div class="example">
				<h3>Example</h3>
				<tscript>
					var r = Real.inf();
					var s = "1e1000";
					# print(Integer(r));  # error: r is infinite
					# print(Integer(s));  # error: s parsed as Real
					                      # overflows to infinity
				</tscript>
			</div>
		`,
		"children": []},
		{"id": "am-14",
		"content": `
			<p>
			This error occurs when a string is converted to an integer
			and the string value does not represent a number.
			</p>
			<div class="example">
				<h3>Example</h3>
				<tscript>
					print(Integer("42"));        # prints 42
					# print(Integer(""));        # error
					# print(Integer("hello"));   # error
				</tscript>
			</div>
		`,
		"children": []},
		{"id": "am-15",
		"content": `
			<p>
			This error occurs when a value is divided by zero with the
			integer division operator <code class="code">\/\/</code> or
			with the modulo operator <code class="code">%</code>. In
			contrast to this behavior, the real division operator
			<code class="code">/</code> does not emit an error and instead
			produces an infinite result or not-a-number.
			</p>
			<div class="example">
				<h3>Example</h3>
				<tscript>
					print(3 / 0);      # prints Infinity
					# print(3 \/\/ 0);   # error
					# print(3 % 0);    # error
				</tscript>
			</div>
			<p>
			This error usually occurs when dividing by a variable or by
			the result of a complex expression the value of which was not
			foreseen by the programmer to be zero. Example:
			<tscript>
				var a = math.pi();
				var b = a - 2 * math.atan(1e100);  # numerically evaluates to zero
				# var c = math.e() % b;            # error
			</tscript>
			</p>
		`,
		"children": []},
		{"id": "am-16",
		"content": `
			<p>
			Values are said to be ordered if they can be compared with operators
			<code class="code">&lt;</code>, <code class="code">&lt;=</code>,
			<code class="code">&gt;</code>, and <code class="code">&gt;=</code>.
			The rules for ordering values are found
			<a href="#/language/expressions/binary-operators/order">here</a>.
			For example, arrays can be ordered, while dictionaries cannot.
			</p>
			<div class="example">
				<h3>Example</h3>
				<tscript>
					print(1 < 2);               # prints true
					print("hello" > "world");   # prints false
					print([] < [42]);           # prints true
					# print({} < {a: 7});       # error: dictionaries are not ordered
				</tscript>
			</div>
			<p>
			This error occurs frequently if one of the operands of the comparison
			is of a type the programmer did not expect. E.g., a function like
			<a href="#/language/types/string">String.find</a> usually returns a
			number, but in occasional error conditions it returns null. Therefore
			a statement like
			<tscript>
				var s = "hello";
				# ... code that modifies s ...
				if s.find("e") < 10 then print("found e close to the beginning");
			</tscript>
			raises an error, but only if the search key is not found.
			</p>
		`,
		"children": []},
		{"id": "am-16b",
		"content": `
			<p>
			Values are said to be ordered if they can be compared with operators
			<code class="code">&lt;</code>, <code class="code">&lt;=</code>,
			<code class="code">&gt;</code>, and <code class="code">&gt;=</code>.
			The rules for ordering values are found
			<a href="#/language/expressions/binary-operators/order">here</a>.
			For example, arrays can be ordered, while dictionaries cannot.
			In most cases, values of different types cannot be ordered. Integer
			and Real are exceptions:
			</p>
			<div class="example">
				<h3>Example</h3>
				<tscript>
					print(3 < 3.14159);        # prints true
					# print(3 < true);         # error: cannot order integer and boolean
				</tscript>
			</div>
			<p>
			This error occurs frequently if one of the operands of the comparison
			is of a type the programmer did not expect. E.g., a function like
			<a href="#/language/types/string">String.find</a> usually returns a
			number, but in occasional error conditions it returns null. Therefore
			a statement like
			<tscript>
				var s = "hello";
				# ... code that modifies s ...
				if s.find("e") < 10 then print("found e close to the beginning");
			</tscript>
			raises an error, but only if the search key is not found.
			</p>
		`,
		"children": []},
		{"id": "am-17",
		"content": `
			<p>
			When calling the Array constructor with an integer as the first
			argument, an array of the given size is created. If this size is
			negative then this error is reported.
			</p>
			<div class="example">
				<h3>Example</h3>
				<tscript>
					var a = Array(3, false);      # [false, false, false]
					# var b = Array(-5, false);   # error
				</tscript>
			</div>
			<p>
			This error occurs if the expression controlling the array size
			happens to become negative, which was usually not anticipated by
			the programmer.
			</p>
		`,
		"children": []},
		{"id": "am-18",
		"content": `
			<p>
			The <a href="#/language/types/array">Array.insert</a> function
			takes a position within the array as its argument. The position
			must neither be negative nor exceed the array length. If it does,
			then this error is reported.
			</p>
			<div class="example">
				<h3>Example</h3>
				<tscript>
					var a = [6, "foo", true];
					a.insert(3, null);       # works, inserts at the end
					# a.insert(-2, false);   # error, negative position
					# a.insert(10, "bar");   # error, position beyond the end
				</tscript>
			</div>
			<p>
			This error occurs if the expression controlling the array position
			happens to take values not anticipated by the programmer.
			</p>
		`,
		"children": []},
		{"id": "am-18b",
		"content": `
			<p>
			The <a href="#/language/types/array">Array.pop</a> function removes
			the last item of the array, which is returned. If the array is
			empty and hence there is no item to remove and return then this
			error is reported.
			</p>
		`,
		"children": []},
		{"id": "am-19",
		"content": `
			<p>
			The <a href="#/language/types/array">Array.sort</a> function can
			sort the array according to a user-specificed order relation,
			defined by the 'comparator' function passed as an argument to
			Array.sort. Given two items as arguments, this function must
			return a numeric value. If the value is non-numeric, then this
			error is reported.
			</p>
		`,
		"children": []},
		{"id": "am-20",
		"content": `
			<p>
			This error is reported if the items of a
			<a href="#/language/types/string">string</a> are
			<a href="#/language/expressions/item-access">accessed</a>
			with an invalid index of key type. Valid index types are
			integer and range.
			</p>
		`,
		"children": []},
		{"id": "am-21",
		"content": `
			<p>
			When <a href="#/language/expressions/item-access">accessing</a>
			a single character of a <a href="#/language/types/string">string</a>
			as an integer code, the index must be a valid position within the
			string. This error indicates that the index is negative.
			</p>
		`,
		"children": []},
		{"id": "am-22",
		"content": `
			<p>
			When <a href="#/language/expressions/item-access">accessing</a>
			a single character of a <a href="#/language/types/string">string</a>
			as an integer code, the index must be a valid position within the
			string. This error indicates that the index exceeds the valid range,
			which is upper bounded by the string size.
			</p>
		`,
		"children": []},
		{"id": "am-23",
		"content": `
			<p>
			When <a href="#/language/expressions/item-access">accessing</a> an item
			of an array, a valid (zero-based) index is neither negative, not does it
			exceed the size of the array. This error indicates that the index is
			negative. This error is usually caused by an expression evaluating to a
			negative number, which was not anticipated by the programmer.
			</p>
		`,
		"children": []},
		{"id": "am-24",
		"content": `
			<p>
			When <a href="#/language/expressions/item-access">accessing</a> an item
			of an <a href="#/language/types/array">array</a>, a valid (zero-based)
			index is neither negative, not does it exceed the size of the array.
			This error indicates that the index is at least at large as the array size.
			The error is usually caused by an expression evaluating to a too large
			number, which was not anticipated by the programmer.
			</p>
		`,
		"children": []},
		{"id": "am-25",
		"content": `
			<p>
			When <a href="#/language/expressions/item-access">accessing</a> an item
			of an <a href="#/language/types/array">array</a>, a valid index is of
			type integer or range. If the expression is on the left-hand-side of an
			assignment operator, then the only valid index type is an integer. This
			error indicates that the index expression evaluates to a different type.
			</p>
		`,
		"children": []},
		{"id": "am-26",
		"content": `
			<p>
			When <a href="#/language/expressions/item-access">accessing</a> an item
			of an <a href="#/language/types/array">array</a>, a valid index is of
			type integer or range. This error indicates that the index expression
			evaluates to a different type.
			</p>
		`,
		"children": []},
		{"id": "am-27",
		"content": `
			<p>
			When <a href="#/language/expressions/item-access">accessing</a> an item
			of a <a href="#/language/types/dictionary">dictionary</a>, the index
			must be a key of the dictionary. This error indicates that the index was
			not found as a key in the dictionary.
			</p>
		`,
		"children": []},
		{"id": "am-28",
		"content": `
			<p>
			When <a href="#/language/expressions/item-access">accessing</a> an item
			of a <a href="#/language/types/dictionary">dictionary</a>, a valid key
			is of type string. This error indicates that the index expression
			evaluates to a different type.
			</p>
		`,
		"children": []},
		{"id": "am-29",
		"content": `
			<p>
			When <a href="#/language/expressions/item-access">accessing</a> an item
			of a <a href="#/language/types/range">range</a>, the index must be a
			valid index of an array representing the elements of the range. This
			means that it must not be negative, and it must be less than the size of
			the range. This error indicates that the index is outside these bounds.
			</p>
		`,
		"children": []},
		{"id": "am-30",
		"content": `
			<p>
			When <a href="#/language/expressions/item-access">accessing</a> an item
			of a <a href="#/language/types/range">range</a>, the index must be a of
			type integer or range. This error indicates that the index expression
			evaluates to a different type.
			</p>
		`,
		"children": []},
		{"id": "am-31",
		"content": `
			<p>
			The <a href="#/language/expressions/item-access">access operator</a>
			provides access to the items of a container. The only types supporting
			this mechanism are string, array, dictionary, and range. This error
			indicates that it was attempted to access an item of a different type.
			</p>
		`,
		"children": []},
		{"id": "am-31b",
		"content": `
			<p>
			The <a href="#/language/expressions/item-access">access operator</a>
			provides access to the items of a container. The only types supporting
			this mechanism when used on the left-hand-side of an assignment are
			array and dictionary. This error indicates that it was attempted to
			set an item of a different type.
			</p>
		`,
		"children": []},
		{"id": "am-32",
		"content": `
			<p>
			The left-hand side of an
			<a href="#/language/statements/assignments">assignment operator</a>
			is an expression. However, not all expressions can be assigned to.
			This error indicates that it was attempted to assign to an expression
			that does not refer to a variable in which the result of the
			right-hand-side can be stored.
			</p>
		`,
		"children": []},
		{"id": "am-33",
		"content": `
			<p>
			The condition in an
			<a href="#/language/statements/if-then-else">if-then-else</a>
			statement decides whether the then-branch or the else-branch is
			executed. The expression must evaluate to a
			<a href="#/language/types/boolean">boolean</a> value, otherwise
			this error is triggered.
			</p>
		`,
		"children": []},
		{"id": "am-34",
		"content": `
			<p>
			A <a href="#/language/statements/for-loops">for-loop</a> iterates
			over the items of a range or array. If the expression defining the
			container evaluates to a different type then this error is emitted.
			</p>
		`,
		"children": []},
		{"id": "am-35",
		"content": `
			<p>
			A <a href="#/language/statements/for-loops">for-loop</a> stores
			the current item of the container it iterates over in a variable.
			It this variable is not declared inside the loop, then an arbitrary
			name can be provided. This name must refer to a variable, otherwise
			this error is triggered.
			</p>
		`,
		"children": []},
		{"id": "am-36",
		"content": `
			<p>
			The condition in a
			<a href="#/language/statements/do-while-loops">do-while loop</a>
			decides whether to stop or to continue the loop. The expression
			must evaluate to a <a href="#/language/types/boolean">boolean</a>
			value, otherwise this error is triggered.
			</p>
		`,
		"children": []},
		{"id": "am-37",
		"content": `
			<p>
			The condition in a
			<a href="#/language/statements/while-do-loops">while-do loop</a>
			decides whether to stop or to continue the loop. The expression
			must evaluate to a <a href="#/language/types/boolean">boolean</a>
			value, otherwise this error is triggered.
			</p>
		`,
		"children": []},
		{"id": "am-38",
		"content": `
			<p>
			Loading a value with the standard library's
			<code class="code">load</code> function failed because the key does
			not exist.
			</p>
			<p>
			This error occurs when trying to load a value from a key that was
			not saved before. Use the <code class="code">exists</code> function
			to check whether a key exists.
			</p>
		`,
		"children": []},
		{"id": "am-39",
		"content": `
			<p>
			Saving a value with the standard library's <code class="code">save</code>
			function failed because the value is not a
			<a target="_blank" href="http://json.org/">JSON</a> constant.
			Values of type Null, Boolean, Integer, Real, and String are legal,
			as well as Array and Dictionary, if all of the values stored
			therein are legal JSON values and the data structure is an
			acyclic graph (a tree).
			</p>
			<p>
			This error occurs if the value to be stored is or contains a value
			of a disallowed type, like a Range, Function, Type, or a user-defined
			class. This error is also reported if the data structure is recursive,
			i.e., if an array or dictionary contains itself as a value, possibly
			indirectly.
			</p>
		`,
		"children": []},
		{"id": "am-40",
		"content": `
			<p>
			The given event name is not known.
			</p>
			<p>
			The most probable reason for this error is a misspelled event name.
			</p>
		`,
		"children": []},
		{"id": "am-41",
		"content": `
			<p>
			The function registered as an event handler is expected to take exactly
			one argument, the event object. A common way to declare event handlers
			is as follows:
			<tscript>
				function onKey(event)
				{
					print(event.key);
				}
				setEventHandler("canvas.keydown", onKey);
				setEventHandler("canvas.keyup", function(event) { print(event.key); });
			</tscript>
			The event parameter must be present even for events emitting an empty
			event dictionary.
			</p>
			<p>
			This error is raised if the event handler takes no arguments or more
			than one argument.
			</p>
		`,
		"children": []},
		{"id": "am-42",
		"content": `
			<p>
			The function <i>deepcopy</i> creates a deep copy of a container.
			If the container holds other containers as values then they are
			deep copied, too. The copied data structure must fulfill the
			following requirements:
			<ul>
				<li>It must not contain functions.</li>
				<li>It must not contain objects.</li>
				<li>It must not contain a loop, i.e., contain a value as its own sub-value.</li>
			</ul>
			This error message indicates that the first or second property
			is not fulfilled.
			</p>
		`,
		"children": []},
		{"id": "am-43",
		"content": `
			<p>
			The error indicates that a recursive data structure was passed
			to a function that cannot handle this case since it would result
			in an infinite recursion, as illustrated by the following example:
			<tscript>
				var a = [];
				a.push(a);
				# print(a);          # error; would result in infinite recursion
			</tscript>
			</p>
		`,
		"children": []},
	]},
	{"id": "name",
	"name": "Name Lookup Errors",
	"title": "Name Lookup Errors",
	"content": `
		<p>
		A <a href="#/language/expressions/names">name</a> refers to a declaration
		according to the name lookup rules. The errors in this category indicate
		that something went wrong either when declaring or when resolving a name.
		</p>
	`,
	"children": [
		{"id": "ne-1",
		"content": `
			<p>
			When providing named arguments in a function call, each parameter
			can be specified only once. This error indicates that a parameter
			was specified multiple times. This includes the case that the
			parameter was specified as a positional and as a names argument.
			</p>
			<div class="example">
				<h3>Example</h3>
				<tscript>
					function f(a, b, c=0) { }
					f(3, 5);           # okay
					# f(3, 5, b=8);    # error
				</tscript>
			</div>
			<p>
		`,
		"children": []},
		{"id": "ne-2",
		"content": `
			<p>
			When calling a function with named parameters then the function to be
			called must have a parameter with the given name &ndash; otherwise
			this error is reported.
			</p>
			<div class="example">
				<h3>Example</h3>
				<tscript>
					function f(a, b = 0) { }
					f(a=3);      # okay
					# f(x=4);    # error
				</tscript>
			</div>
		`,
		"children": []},
		{"id": "ne-3",
		"content": `
			<p>
			A function cannot be called with more arguments than it has
			parameters. An attempt to do so results in this error.
			</p>
			<div class="example">
				<h3>Example</h3>
				<tscript>
				function f(a, b, c) { }
				f(3, 5, 8);         # okay
				# f(3, 5, 8, 2);    # error
				</tscript>
			</div>
		`,
		"children": []},
		{"id": "ne-4",
		"content": `
			<p>
			When calling a function, all (non-default) parameters must be
			specified by providing corresponding (positional or named)
			arguments. Failure to specify a parameter results in this error.
			</p>
			<div class="example">
				<h3>Example</h3>
				<tscript>
				function f(a, b, c) { }
				f(3, 5, 8);   # okay
				# f(3, 8);    # error: c not specified
				</tscript>
			</div>
		`,
		"children": []},
		{"id": "ne-5",
		"content": `
			<p>
			This error means that the given name cannot be resolved
			since no declaration of the given name exists. The three most
			common causes of this error are
			<ol>
				<li>the programmer forgot to declare the name,</li>
				<li>the name was mistyped, and</li>
				<li>the programmer forgot to make the name available with a use directive.</li>
			</ol>
			</p>
		`,
		"children": []},
		{"id": "ne-6",
		"content": `
			<p>
			In certain situations a name is resolved into a variable that cannot
			be accessed from the current context. This error refers to the case
			that the variable requires a <keyword>this</keyword> argument that
			is not present, i.e., when accessing a non-static attribute from
			within a nested function or class.
			</p>
			<div>
				<h3>Example</h3>
				<tscript>
				class A
				{
				public:
					var x;
					class B
					{
					public:
						static function f()
						{
							# print(x);   # error
						}
					}
				}
				</tscript>
			</div>
		`,
		"children": []},
		{"id": "ne-7",
		"content": `
			<p>
			In certain situations a name is resolved into a variable that cannot
			be accessed from the current context. This error refers to the case
			that the name refers to a local variable in an outer function.
			</p>
			<div>
				<h3>Example</h3>
				<tscript>
				function f()
				{
					var a = 7;
					function g()
					{
						# print(a);   # error
					}
					var h = function[a]()
					{
						print(a);     # okay
					};
				}
				</tscript>
			</div>
		`,
		"children": []},
		{"id": "ne-8",
		"content": `
			<p>
			In certain situations a name is resolved into a variable that cannot
			be accessed from the current context. This error refers to the case
			that the only candidate to which the name could resolve is a private
			member up a (direct or indirect) super class.
			</p>
			<div>
				<h3>Example</h3>
				<tscript>
				class A
				{
				private:
					var x;
				}
				class B : A
				{
				public:
					function f()
					{
						# print(x);   # error
					}
				}
				</tscript>
			</div>
		`,
		"children": []},
		{"id": "ne-9",
		"content": `
			<p>
			This error indicates that a name was not found inside a namespace.
			For a name of the form <code class="ebnf">identifier "." identifier</code>
			with the left identifier referring to a namespace, the right identifier
			is looked up inside that namespace. If the name is not found in there
			then this error is reported.
			</p>
		`,
		"children": []},
//		{"id": "ne-10",
//		"content": `
//			<p>
//			When parsing an expression, a name is expected to resolve to a
//			declaration that can be used as a value. This works for variables,
//			function and types, but not for namespaces and non-static members.
//			This error indicates that a name refers to a declaration that
//			cannot be used as a value.
//			</p>
//		`,
//		"children": []},
		{"id": "ne-11",
		"content": `
			<p>
			This error indicates that a name refers to a namespace, while a
			different entity was expected.
			</p>
			<div>
				<h3>Example</h3>
				<tscript>
				namespace A
				{ }
				class B # : A      # error; super class expected, namespace found
				{ }
				</tscript>
			</div>
		`,
		"children": []},
		{"id": "ne-12",
		"content": `
			<p>
			The <a href="#/language/expressions/member-access">member access operator .</a>
			references a public member of a type. If the left-hand-side evaluates
			to a type then access is restricted to public static members.
			This error is reported if neither the type nor any of its super
			classes has a public static member of the given name.
			</p>
		`,
		"children": []},
		{"id": "ne-13",
		"content": `
			<p>
			The <a href="#/language/expressions/member-access">member access operator .</a>
			references a public member of a type. This error is reported if neither
			the type nor any of its super classes has a public member of the given
			name.
			</p>
		`,
		"children": []},
		{"id": "ne-14",
		"content": `
			<p>
			Names declared within a scope must be unique. This error indicates
			that a variable name is already used by a different declaration.
			</p>
			<p>
			In some contexts it is not obvious which names belong to which scope.
			One typical pitfall is that function parameters, closure parameters,
			and the function body are all in the same scope.
			</p>
		`,
		"children": []},
		{"id": "ne-15",
		"content": `
			<p>
			Names declared within a scope must be unique. This error indicates
			that a function name is already used by a different declaration.
			</p>
			<p>
			In some contexts it is not obvious which names belong to which scope.
			One typical pitfall is that function parameters, closure parameters,
			and the function body are all in the same scope.
			</p>
		`,
		"children": []},
		{"id": "ne-16",
		"content": `
			<p>
			Names declared within a scope must be unique. This error indicates
			that a parameter name is already used by a different declaration.
			</p>
			<p>
			In some contexts it is not obvious which names belong to which scope.
			One typical pitfall is that function parameters, closure parameters,
			and the function body are all in the same scope. Therefore a function
			parameter can conflict with a
			<a href="#/language/expressions/literals/anonymous-functions">closure</a>
			parameter, which is declared first.
			</p>
		`,
		"children": []},
		{"id": "ne-17",
		"content": `
			<p>
			All <a href="#/language/expressions/literals/anonymous-functions">closure</a>
			parameters belong to the same scope, therefore they must be unique.
			If two closure parameters are declared with same name are declared
			then this error is reported.
			</p>
		`,
		"children": []},
		{"id": "ne-18",
		"content": `
			<p>
			Names declared within a scope must be unique. This error indicates
			that a class name is already used by a different declaration.
			</p>
			<p>
			In some contexts it is not obvious which names belong to which scope.
			One typical pitfall is that function parameters, closure parameters,
			and the function body are all in the same scope.
			</p>
		`,
		"children": []},
		{"id": "ne-19",
		"content": `
			<p>
			Names declared within a scope must be unique. This error indicates
			that a namespace name is already used by a different declaration.
			</p>
			<p>
			In some contexts it is not obvious which names belong to which scope.
			One typical pitfall is that function parameters, closure parameters,
			and the function body are all in the same scope.
			</p>
		`,
		"children": []},
		{"id": "ne-21",
		"content": `
			<p>
			The <a href="#/language/declarations/classes">constructor of a class</a>
			can invoke the constructor of the super class with a special syntax
			starting with a colon after the parameter list. Calling the super class
			constructor makes sense only if the class has a super class. This error
			indicates that the super class constructor is called although there does
			not exist a super class.
			</p>
		`,
		"children": []},
		{"id": "ne-22",
		"content": `
			<p>
			The <a href="#/language/declarations/classes">super class of a class</a>
			is provided as a name. The name must refer to a type, otherwise this
			error is reported.
			</p>
		`,
		"children": []},
		{"id": "ne-23",
		"content": `
			<p>
			When importing all name from a namespace with a
			<a href="#/language/directives/use">use directive</a> of the form
			<ebnf>"use" "namespace" use-name</ebnf>, then the namespace is
			provided as a name. This is done in the assumption that the name
			indeed refers to a namespace, otherwise this error is triggered.
			</p>
		`,
		"children": []},
		{"id": "ne-24",
		"content": `
			<p>
			When importing a name from a namespace with a
			<a href="#/language/directives/use">use directive</a>, then the
			names are made available in the current scope as if the declarations
			were members of the scope. Since names of declarations in a scope
			must be unique, this can trigger conflicts. This error indicates that
			the attempt to import a name creates such a conflict, since the name
			was already taken by a declaration or by another name import.
			</p>
			<p>
			The often easiest way to fix this problem is to remove the use directive
			and to access the declaration by its full name. When importing a single
			name, a better solution is to import the conflicting declaration under
			an alias name.
			</p>
		`,
		"children": []},
		{"id": "ne-25",
		"content": `
			<p>
			It was attempted to call a constructor of a type with a protected or
			private constructor from outside the scope of the class, and for a
			protected constructor, from outside the scope of its sub-classes.
			This violates the member access rules explained
			< href="#/language/declarations/classes">here</a>.
			</p>
			<p>
			An easy fix is to make the constructor public. However, this error
			usually indicates that objects of the given type should not ever be
			created directly from outside the class.
			</p>
		`,
		"children": []},
	]},
	{"id": "logic",
	"name": "Logic Errors",
	"title": "Logic Errors",
	"content": `
		The errors in this category indicate a severe bug in the logic of a
		TScript program.
	`,
	"children": [
		{"id": "le-1",
		"content": `
			<p>
			This error indicates that too many function calls were nested.
			It is often caused by an infinite recursion.
			</p>
		`,
		"children": []},
		{"id": "le-2",
		"content": `
			<p>
			The function <code class="code">enterEventMode</code> was called,
			directly or indirectly, from within an event handler. Event
			handling mode cannot be nested, hence this error is reported.
			</p>
		`,
		"children": []},
		{"id": "le-3",
		"content": `
			<p>
			This error indicates that the function
			<code class="code">quitEventMode</code> was called although the
			program was not in event handling mode.
			</p>
		`,
		"children": []},
	]},
	{"id": "user",
	"name": "User-Defined Errors",
	"title": "User-Defined Errors",
	"content": `
		This section collects errors reported by the program itself, not by
		the TScript programming language and its runtime environment.
	`,
	"children": [
		{"id": "ue-1",
		"content": `
			<p>
			The library function <a href="#/library/core">assert</a> can be
			called in order to report an error in case a condition is violated.
			The error is reported by user or library code, not by the core language.
			</p>
		`,
		"children": []},
		{"id": "ue-2",
		"content": `
			<p>
			The library function <a href="#/library/core">error</a> can be
			called in order to report an error. The error is reported by user
			or library code, not by the core language.
			</p>
		`,
		"children": []},
		{"id": "ue-3",
		"content": `
			<p>
			If an exception is <a href="#/language/statements/throw">thrown</a>
			and not <a href="#/language/statements/try-catch">caught</a> then
			the program stops and this error message is reported. This is often
			unintended by the programmer and hints at an internal error that
			should be fixed.
			</p>
		`,
		"children": []},
	]},
	{"id": "style",
	"name": "Style Errors",
	"title": "Style Errors",
	"content": `
		This section collects errors reported by the style checker. They are not
		programming errors in a strict sense. Yet, if configured to do so,
		TScript reports style errors to enforce good programming style. This
		behavior can be changed in the configuration dialog.
	`,
	"children": [
		{"id": "ste-1",
		"content": `
			<p>
			This error is reported if the indentation of a program is
			inconsistent. The indentation in each block must be larger
			than in its surrounding block, and it must be consistent
			within the block.
			<tscript>
			print("hello");
			{
			print("world");   # wrong; inner block indentation must
			                  # exceed outer block indentation
			}
			</tscript>
			</p>
		`,
		"children": []},
		{"id": "ste-2",
		"content": `
			<p>
			This error is reported if the indentation of program block
			markers is inconsistent, i.e., if the indentation of the line
			containing an opening brace differs from the indentation of
			the line with the corresponding closing brace:
			<tscript>
			if true then {
				print("true!");
				}   # This brace must not be indented
			</tscript>
			</p>
		`,
		"children": []},
		{"id": "ste-3",
		"content": `
			<p>
			This error can occur when a variable, function, or namespace name
			starts with a capital letter. By convention, these names start with
			a lowercase letter or an underscore.
			</p>
			<tscript>
			{
				var foo = 7;   # okay
				var Bar = 8;   # wrong; easily mistaken for a type
			}
			</tscript>
		`,
		"children": []},
		{"id": "ste-4",
		"content": `
			<p>
			This error can occur when a class name starts with a
			lowercase letter or an underscore. By convention, TScript
			class names start with a capital letter.
			</p>
			<tscript>
			{
				class Foo {}   # okay
				class bar {}   # wrong
			}
			</tscript>
		`,
		"children": []},
	]},
	{"id": "internal",
	"name": "Internal Errors",
	"title": "Internal Errors",
	"content": `
		This section collects errors reported by TScript about itself.
		Such errors <i>should of course never occur</i>, however, it is
		clear that bugs are unavoidable.
	`,
	"children": [
		{"id": "ie-1",
		"content": `
			<p>
			This error is reported if the TScript parser fails to
			operate as expected. This is not the fault of the program
			written by the user, but rather a bug on the side of
			TScript.
			</p>
		`,
		"children": []},
		{"id": "ie-2",
		"content": `
			<p>
			This error is reported if the TScript interpreter fails to
			operate as expected. This is not the fault of the program
			written by the user, but rather a bug on the side of
			TScript or its standard library.
			</p>
		`,
		"children": []},
	]},
]
});
