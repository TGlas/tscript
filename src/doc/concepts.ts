import { Documentation } from ".";

export const doc_concepts: Documentation = {
	id: "concepts",
	name: "Core Concepts",
	title: "Core Concepts of the TScript Programming Language",
	content: `
	<p>
	The TScript language is carefully designed with the goal to create
	an ideal programming language for programming beginners. This
	overarching goal encompasses a number of sub-goals and design
	principles.
	<ul>
	<li>
		<b>Visual Tasks.</b>
		Programming beginners are new to programming, but they are
		usually not new to computers. Their expectation is to program
		things they experienced before, in particular graphical user
		interfaces. They may quickly lose interest when being confronted
		with writing console programs they can hardly relate to.
		Therefore TScript comes with easy-to-use graphics programming
		libraries: an extremely simple one for turtle graphics, and a
		little more advanced one featuring a canvas for drawing and for
		receiving user input.
	</li>
	<li>
		<b>Avoid error-prone constructions.</b>
		Surprisingly many programming languages carry a legacy of
		constructions around that are known to be problematic in one way
		or another, going far beyond the infamous
		<code class="code">goto</code> statement.
		Examples are macros in C++, the division operator of Python 2,
		Javascript's default behavior of turning assignments to mistyped
		variables into globals, obscure scoping rules, and improper
		information hiding in classes. TScript aims to be strict about
		such issues, in the conviction that this is the best way to
		avoid many small but hard to find errors that will frustrate
		beginners.
	</li>
	<li>
		<b>Clean syntax.</b>
		The C-family of programming languages is known for its rather
		verbose syntax and for its extensive use of special characters
		in expressions. For example, the statement
			<div>
				<code class="code">for (i=0; a[i]; i++) *a[i] = *(b++) = -(c++);</code>
			</div>
		makes perfect sense in C, but it is hard to parse, not only for
		beginners.
		While TScript builds on the expressiveness of operators, it
		tries to avoid some of the complications of C. First of all,
		there are no pointers, and hence no pointer arithmetics. Second,
		assignments cannot be chained because they do not return a
		value, which enforces a clean separation of tests and side
		effects. Third, core language constructs like conditions and
		loops use a rather keyword-rich and verbose syntax without
		parentheses.
	</li>
	<li>
		<b>Better fail than do the wrong thing.</b>
		Sometimes it is convenient to handle inputs gracefully. For
		example, when expecting an integer, one may accept a string
		representing an integer as a decimal number. Another example is
		the implicit conversion of integers and even strings to
		booleans, which allows such types to appear in conditions.
		TScript largely disallows such code. The only implicit
		conversions are between integers and reals holding actual
		integer values, and conversions to string when printing. The
		reason is that implicit conversions can be really irritating, in
		particular for beginners, in case that things go wrong and the
		conversion is unintended. Then the better solution is to demand
		an explicit cast and to fail otherwise with a clear error
		message that points the programmer to the problem.
	</li>
	<li>
		<b>Implementation of all standard concepts.</b> TScript is a
		pretty complete imperative and object oriented programming
		language, in the sense that it covers all the standard
		constructions like conditionals, loops, functions, classes,
		namespaces, and the like. This is important since its aim is to
		prepare the programmer for work with other languages designed
		for more serious use. There are some exception to the above
		rule, i.e., TScript does not come with a switch-case construct,
		it does not have a ternary operator, and it does not allow for
		operator overloading.
	</li>
	</ul>
	</p>
	<p>
	The following documents should be helpful for readers with some
	programming experience to get an quick overview of tscript:
	<ul>
	<li><a href="?doc#/cheatsheet">Cheat Sheet</a></li>
	<li><a href="?doc#/concepts/overview">The Language at a Glance</a></li>
	<li><a href="?doc#/concepts/design">Design Decisions</a></li>
	<li><a href="?doc#/concepts/arithmetics">Arithmetics</a></li>
	</ul>
	</p>
`,
	children: [
		{
			id: "overview",
			name: "The Language at a Glance",
			title: "The Language at a Glance",
			content: `
		<p>
		TScript is an imperative and object oriented language. In many
		aspects it has similarities to "scripting" languages like Python
		and Javascript: code is executed as it is encountered, so there
		is no explicit entry point, variables are untyped, they
		reference values instead of containing them, and memory is fully
		managed.
		</p>
		<p>
		For a closer look, let's start with an example:
		<tscript>
			for var i in 0:10 do print(93 - 8 * i);
		</tscript>
		This line reveals a lot about the syntax of the language. First
		of all, it is semicolon delimited. Variables are declared with
		the <keyword>var</keyword> keyword. There is a special
		<a href="?doc#/language/types/range">range</a>
		type, objects of which are created with the colon operator.
		Function calls and computations are denoted in the usual way.
		However, the <a href="?doc#/language/statements/for-loops">for-loop</a>
		is rather verbose, involving the keywords <keyword>for</keyword>,
		<keyword>in</keyword>, and <keyword>do</keyword>.
		</p>
		<p>
		<a href="?doc#/language/declarations/functions">Functions</a>
		are declared with the <keyword>function</keyword>
		keyword:
		<tscript>
			function factorial(n)
			{
				if n == 0 then return 1;
				else return n * factorial(n - 1);
			}
			print(factorial(10));   # 3628800
		</tscript>
		The maybe only surprise here is the keyword
		<keyword>then</keyword>, which is another example of the verbose
		syntax when it comes to control structures. It is also possible
		to assign functions to variables and to define
		<a href="?doc#/language/expressions/literals/anonymous-functions">anonymous (lambda) functions enclosing variables</a>.
		</p>
		<p>
		Like JSON, the TScript language knows the types
		<a href="?doc#/language/types/null">null</a>,
		<a href="?doc#/language/types/boolean">boolean</a>,
		<a href="?doc#/language/types/real">real</a> (number in JSON),
		<a href="?doc#/language/types/string">string</a>,
		<a href="?doc#/language/types/null">array</a>, and
		<a href="?doc#/language/types/dictionary">dictionary</a> (object in JSON),
		and JSON expressions are valid literals. In addition,
		TScript has a signed 32bit
		<a href="?doc#/language/types/integer">integer</a> type, a
		<a href="?doc#/language/types/range">range</a> type, a
		<a href="?doc#/language/types/function">function</a> type, and a
		<a href="?doc#/language/types/type">type</a> type. Arrays are
		denoted with square brackets and dictionaries with curly braces.
		Dictionary keys can be identifiers or strings:
		<tscript>
            var n = null;                                       # null
            var i = 25;                                         # an integer
            var r = 2.0;                                        # a real
            var b = false;                                      # a boolean
            var s = "string";                                   # a string
            var g = 1:10;                                       # a range
            function add(a, b) { return a+b; }; var f = add;    # a function
			var a = [2, 3, 5, 7, 11];                           # an array
			var d = {name: "John", age: 25};                    #* a dictionary *#
		</tscript>
		The above example also demonstrates line and block
		<a href="?doc#/language/syntax/comments">comments</a>.
		</p>
		<p>
		The built-in types can be extended by declaring
		<a href="?doc#/language/declarations/classes">classes</a>:
		<tscript>
			class Person
			{
			private:
				static var m_free_id = 0;
				var m_id;
				var m_name;
				var m_age;

			public:
				constructor(name, age)
				{
					m_name = name;
					m_age = age;
					m_id = m_free_id;
					m_free_id += 1;
				}

				function name()
				{ return m_name; }

				function age()
				{ return m_age; }

				function id()
				{ return m_id; }
			}


			var name = "Dennis";
			var age = 85;
			var p = Person(name, age);  # p is now an instance of the data type Person
		</tscript>
		In contrast to many other scripting languages, TScript
		constructors are easily recognizable as such, and classes
		support proper information hiding.
		</p>
		<p>
		Further features of interest are
		<a href="?doc#/language/declarations/namespaces">namespaces</a> and
		corresponding <a href="?doc#/language/directives/use">use directives</a>,
		as well as <a href="?doc#/language/statements/throw">exceptions</a>.
		For a more complete and more formal overview of the language please
		refer to the <a href="?doc#/language">reference documentation</a>.
		</p>
		<p>
		An important aspect of TScript as a teaching language is the closed
		and rather limited universe it lives in. The language is not designed
		as a general purpose tool, capable of interacting with arbitrary
		operating systems and libraries. Instead, its scope is limited to a
		very specific and highly standardized working environment. It comes
		with easily accessible <a href="?doc#/library/turtle">turtle graphics</a>
		and <a href="?doc#/library/canvas">canvas graphics</a> modules. While the
		former is ideal for visual demonstrations of programming concepts
		like loops and recursion, the latter allows for the creating of all
		kinds of (classic) games. Check the <a href="?doc#/examples">examples</a>
		for demonstrations.
		</p>
	`,
			children: [],
		},
		{
			id: "design",
			name: "Design Decisions",
			title: "Design Decisions",
			content: `
		<p>
		Most programming languages in common use exist for an extended
		period of time and underwent significant changes. Such changes
		regularly aim to fix design bugs introduced early on. This naturally
		creates a tension between designing a proper solution and avoiding
		to break existing code. Therefore many such fixes are rather newly
		designed workarounds. The main claim to fame of TScript is that its
		initial design is already very well crafted, which will hopefully
		avoid the need for larger changes in the future. The most important
		factor making this possible is that the language is very limited in
		scope, which greatly reduces the need for future changes.
		</p>
		<p>
		Starting with a clean design is only possible by building on prior
		(positive and negative) experience. TScript combines well-designed
		concepts from a range of existing programming languages &mdash; and
		sure, the decision which concepts are well-designed or not is a
		somewhat subjective one. This affects its basic syntax, the level
		of abstraction of many concepts, as well as a number of specific
		but important design decisions, some of which are listed in the
		following.
		</p>
		<ul>
			<li>
				The family of C-style languages has contributed
				insignificance of whitespace, the semicolon as a delimiter,
				braces as block markers, and scoping rules for variables,
				block comments, and many minor details like the use of
				square brackets for variables enclosed by lambda functions.
				Most class-related features like proper information hiding,
				a fixed class layout and static members are inspired by C++
				and Java.
			</li>
			<li>
				Automatic memory management, runtime typing, variables being
				references to values, and the absence of an explicit entry
				point are very common concepts in high-level scripting
				languages.
			</li>
			<li>
				TScript is fully compatible with
				<a target="_blank" href="http://json.org/">JSON</a>, in the
				sense that every JSON expression is a legal TScript constant.
				JSON lays the foundation for the system of TScript core types.
			</li>
			<li>
				Python has contributed named parameters and separate operators
				for integer and floating point division, and Matlab and NumPy
				have inspired array slicing and hence the Range type.
				TScript's keyword-rich syntax for expressing conditionals and
				loops without the need to enclose conditions into parentheses
				is not taken directly from a specific language, but it is
				inspired by the simplicity of Python syntax.
			</li>
			<li>
				Anonymous functions and closures are inspired by Javascript's
				powerful event handling abilities, although the mechanism of
				enclosing values instead of variables is a bit different.
			</li>
		</ul>
		<p>
		It is understood that many of these features are also present in other
		languages and that it is near impossible to give proper credit to every
		programming language out there.
		</p>
	`,
			children: [],
		},
		{
			id: "arithmetics",
			name: "Arithmetics",
			title: "Arithmetics",
			content: `
		<p>
		TScript has two fundamental arithmetic types: Integer and Real.
		At first glance, they seem to be rather similar, to the extent
		that one may conclude that Integers are superfluous, since their
		entire range is covered by Reals. Indeed, most functions and
		operators that are designed for one type accept both types, and
		also mixed types in case of multiple arguments.
		</p>
		<p>
		However, merging the two types would clearly violate the
		<a target="_blank" href="https://en.wikipedia.org/wiki/Single_responsibility_principle">single responsibility principle</a>.
		This is because integers and reals have very different (primary)
		roles in the core language: integers act as array indices, while
		reals are numeric values.
		</p>
		<p>
		It turns out that array indexing requires its own arithmetics,
		e.g, for implementing a two-dimensional grid with an array.
		Think of a matrix stored in
		<a target="_blank" href="https://en.wikipedia.org/wiki/Matrix_representation">row-major format</a>
		as an example. For a matrix of width <i>w</i> and height <i>h</i>
		and for zero-based column and row indices <i>(x,y)</i>, the index
		of the corresponding array item is
		<code class="code">i=x+w*y</code>. The operation is inverted by
		<code class="code">x=i%w</code> and
		<code class="code">y=i//w</code>, which justifies the way
		integer division and modulo are defined. By induction, this
		argument extends to <i>n</i>-dimensional grids.
        <br>
        <center>
        <img src="data:image/png;base64,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"/>
        </center>
		</p>
		<p>
		The differences between integer and floating point arithmetics
		can be broken down to three points:
		<ul>
			<li>division,</li>
			<li>overflow (and underflow), and</li>
			<li>rounding errors.</li>
		</ul>
		Overflow is often considered a minor issue, at least if it is
		clear a-priori that the program will not have to handle very
		large values. Rounding errors can cause
		<a target="_blank" href="https://docs.oracle.com/cd/E19957-01/806-3568/ncg_goldberg.html">problems</a>
		in floating point arithmetics, but it tends to occur in contexts
		where it is clear that we deal with reals, and experienced
		programmers of numerically sensitive algorithms are usually
		aware of it. Division is problematic as follows:
		<tscript>
			function compute(a, b)
			{ return a / b; }

			print(compute(1, 3));       # prints 0.3333...
			print(compute(1.0, 3.0));   # prints 0.3333...
		</tscript>
		</p>
		<p>
		Assume for a second that the division operator would use the
		arithmetics induced by its types, then the first case would
		trigger integer division and the statement would print zero!
		</p>
		<p>
		The problem is that in a runtime-typed language like TScript
		the compute function cannot know which types its arguments
		will take. However, most probably the zero result is not
		intended by the programmer. Runtime type checking and forced
		conversion can fix the problem,
		<tscript>
			function compute1(a, b)
			{
				assert(Type(a) == Real and Type(b) == Real);
				return a / b;
			}
			function compute2(a, b)
			{ return Real(a) / Real(b); }
		</tscript>
		but demanding this solution from the programmer is a far too
		error prone approach.
		</p>
		<p>
		This dilemma is resolved by introducing two distinct division
		operators, <code class="code">/</code> for reals and
		<code class="code">//</code> for integers. This design is not
		elegant, but it solves an important problem by avoiding
		frequent and hard-to-find division bugs. This solution is of
		course inspired by Python3.
		</p>
        <tscript>
			print(1 / 3);       # prints 0.3333...
			print(1 // 3);      # prints 0
		</tscript>
		<p>
		The power operator <code class="code">^</code> is particularly
		prone to integer overflow. However, it is rarely applied with
		large exponents. Instead of providing a second operator that
		is more safe with respect to integer overflow, the function
		<a href="?doc#/library/math">math.pow</a> is provided as an alternative.
		</p>
	`,
			children: [],
		},
		{
			id: "style",
			name: "Style",
			title: "Coding Style",
			content: `
		<p>
		Also beyond its basic syntax, the TScript language aims to teach
		good coding style. Therefore there exists an official style
		guide. It aims to be not too restrictive, while emphasizing a
		few points that can make code much easier to read. These two
		points are:
		<ul>
			<li>indentation, and</li>
			<li>capitalization of identifiers.</li>
		</ul>
		</p>
		<h3>Style Checking Mode</h3>
		<p>
		Although the core language does not enforce any particular
		coding style, it can be helpful for beginners to get used to a
		style that fosters readable code early on. Therefore the TScript
		IDE offers the option to enable a special <i>style checking
		mode</i>. In this mode, violations of this style guide are
		reported as errors. The mode can be enabled/disables in the
		configuration dialog accessible through the toolbar.
		</p>
        <p>
        <center>
        <img src="data:image/png;base64,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">
        </center>
        </p>
        <p>
        <center>
        <img src="data:image/png;base64,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">
        </center>
        </p>
		<h3>Indentation</h3>
		<p>
		The language syntax does not enforce indentation. Quite the
		contrary is the case: whitespace is entirely insignificant.
		However, it is clear that cleanly indented code is significantly
		easier to read. Therefore, clean indentation of blocks is
		enforced by this style guide.
		</p>
		<p>
		RULES: Each block (scope, function/class/namespace body) is
		indented uniformly. Its indentation exceeds the indentation of
		the surrounding block. Lines containing matching opening and
		closing braces must have the same indentation.
		</p>
		<p>
		</p>
		<tscript>
			function foo()
			{ print("foo"); }   # okay

			function bar() {
					print("bar");
				} # wrong; indentation of braces does not match

			function foo2()
			{
					print("foo");
				print("foo2");	# wrong; block is not indented consistently
			}

			function bar2()
			{
			print("bar2");   # wrong; indentation does not increase
			}
		</tscript>
		</p>
		<h3>Capitalization of Identifiers</h3>
		<p>
		TScript uses the convention that identifiers starting with a
		capital letter denote types, while all other identifiers denote
		variables, functions, and namespaces.
		</p>
		<tscript>
			var N = 1000;         # should be "n"
			function Display(x)   # should be "display"
			{ print(x); }
			namespace Stuff {     # should be "stuff"
				class set { }     # should be "Set"
			}
			var T = Integer;      # this is borderline, but should be "t"
		</tscript>
	`,
			children: [],
		},
	],
};
