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
			var a = [2, 3, 5, 7, 11];         # an array
			var d = {name: "John", age: 25};  #* a dictionary *#
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
		in floating point arithmetics, but it tends to occur is contexts
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
