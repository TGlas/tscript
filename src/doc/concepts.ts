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
	<li><a href="?doc=/cheatsheet">Cheat Sheet</a></li>
	<li><a href="?doc=/concepts/overview">The Language at a Glance</a></li>
	<li><a href="?doc=/concepts/design">Design Decisions</a></li>
	<li><a href="?doc=/concepts/arithmetics">Arithmetics</a></li>
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
		<a href="?doc=/language/types/range">range</a>
		type, objects of which are created with the colon operator.
		Function calls and computations are denoted in the usual way.
		However, the <a href="?doc=/language/statements/for-loops">for-loop</a>
		is rather verbose, involving the keywords <keyword>for</keyword>,
		<keyword>in</keyword>, and <keyword>do</keyword>.
		</p>
		<p>
		<a href="?doc=/language/declarations/functions">Functions</a>
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
		<a href="?doc=/language/expressions/literals/anonymous-functions">anonymous (lambda) functions enclosing variables</a>.
		</p>
		<p>
		Like JSON, the TScript language knows the types
		<a href="?doc=/language/types/null">null</a>,
		<a href="?doc=/language/types/boolean">boolean</a>,
		<a href="?doc=/language/types/real">real</a> (number in JSON),
		<a href="?doc=/language/types/string">string</a>,
		<a href="?doc=/language/types/null">array</a>, and
		<a href="?doc=/language/types/dictionary">dictionary</a> (object in JSON),
		and JSON expressions are valid literals. In addition,
		TScript has a signed 32bit
		<a href="?doc=/language/types/integer">integer</a> type, a
		<a href="?doc=/language/types/range">range</a> type, a
		<a href="?doc=/language/types/function">function</a> type, and a
		<a href="?doc=/language/types/type">type</a> type. Arrays are
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
		<a href="?doc=/language/syntax/comments">comments</a>.
		</p>
		<p>
		The built-in types can be extended by declaring
		<a href="?doc=/language/declarations/classes">classes</a>:
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
		<a href="?doc=/language/declarations/namespaces">namespaces</a> and
		corresponding <a href="?doc=/language/directives/use">use directives</a>,
		as well as <a href="?doc=/language/statements/throw">exceptions</a>.
		For a more complete and more formal overview of the language please
		refer to the <a href="?doc=/language">reference documentation</a>.
		</p>
		<p>
		An important aspect of TScript as a teaching language is the closed
		and rather limited universe it lives in. The language is not designed
		as a general purpose tool, capable of interacting with arbitrary
		operating systems and libraries. Instead, its scope is limited to a
		very specific and highly standardized working environment. It comes
		with easily accessible <a href="?doc=/library/turtle">turtle graphics</a>
		and <a href="?doc=/library/canvas">canvas graphics</a> modules. While the
		former is ideal for visual demonstrations of programming concepts
		like loops and recursion, the latter allows for the creating of all
		kinds of (classic) games. Check the <a href="?doc=/examples">examples</a>
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
        <img style="display: block; margin: 1em auto;" src="data:image/png;base64,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"/>
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
		<a href="?doc=/library/math">math.pow</a> is provided as an alternative.
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
		<img style="display: block; margin: 1em auto;" src="data:image/png;base64,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"/>
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
		<b>Rules:</b> Each block (scope, function/class/namespace body)
		is indented uniformly. Its indentation exceeds the indentation
		of the surrounding block. Lines containing matching opening and
		closing braces must have the same indentation. Up to the last
		rule, these rules coincide with the Python programming language.
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
