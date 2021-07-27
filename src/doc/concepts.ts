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
        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAxkAAADDCAYAAADurtwrAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsIAAA7CARUoSoAAAGN+SURBVHhe7Z0LvExV//9XiajoouiGCpF7hRRFIZcouUS5hMe1+KUiehBSIRXSE8+jQkQ9Ej2UdCNKRO4SQpL8JQmhSPu/Pt+z1jFnzJyZM7P3nplzPu/X63v23mvvs2fNzJ6913d9b6c5GkUIIYQQQgghLnG6WRJCCCGEEEKIK1DJIIQQQgghhLgKlQxCCCGEEEKIq1DJIIQQQgghhLgKlQxCCCGEEEKIq1DJIIQQQgghhLgKlQxCCCGEEEKIq1DJIIQQQgghhLgKlQxCCCGEEEKIq7DiNyGEkKTmNI1ZDQmfY4QQknzQkkEISTkw6IyEOTThmO6ExRyWlHzzzTdq6NChZuskf/31l3rqqafUiRMnTEvysW/fvpB9B+j7tm3bzBYhhBAvoJJBCDmFZcuWqeXLl5utNFavXi2Dy2DeeecdNXnyZLOVEM7SUkFLLS0XoCGQzZs3q4MHD5qtk6xfv169+OKLZutUvv32W/XLL7+YLVc4R0s1LaVlK0lYuXKl+uKLL8xWRv7973+rTZs2ma2TTJw4Uc2cOVPlypXLtPjKKd93KGXt1VdfVQsWLDBbJ3nvvffU2LFj1VVXXWVaToLv/I8//jBb7rFz5045NyGE5CSoZBBCTqFHjx7qsccek/UdO3aokiVLqrvuuktdcMEF6t1335V2sGvXLtWlSxdVtGhR0+I7j2jZp2WNlmlavtOSTp06ddSjjz6qzj33XPXss8+a1jS6du2q8uTJY7Yygn3XXHON6ty5s2mJm6e1HNIyT8tGLcu0FNaScPA94/sOxfTp01XLli3N1kmmTZsWst0HMv2+AwnXx3DtTZs2le/84YcfNi3u8K9//UuVKlVKde/e3bQQQkjOgEoGIeQUoEjMmjVL1jFIqlevnigbffv2Vf/973+lHfTs2VPk1ltvNS2+0ljL81q6acFM9qVaqmgRMJg8fvy4mjNnjpo9e3YGa8vjjz+uihUrprp1w79mZNGiReo///mPrOP/XaK3lkpaztdyrZZyWgZoSThvvfWW+vDDD83WSWCpyJ07t2rcGB/zSTAjv3DhwkQoGZl+34F8+eWXas2aNaf0ERatUIoT3qu93l38zlX9+vXVK6+8osqWLRvSCkgIIdkZKhmEpChTpkxRzzzzjNlKY/jw4er//u//zFbsYBD+yCOYNFZqz5496oorrpD1/fv3q71798r66NGj1YEDB9SgQYNkGwwZMkT6EMiIESNEUQkExwS7Y8XAA1pw4kBfra1mKf22Fpazzz47vd8ffPCBfHZwmQnFE088oTp16iTrLg44z9SC2XewWsv/tEDRSAf9gwtXKPB5wYUtEChC+A7iBYqj/a4DCTfjj0H67bffrq688ko1cODAU77vYcOGqXHjxpmtNHAM3O3iJOz3HRz4bRWJ8847z7SkgXYM+KtXr25a0sA1jDgN4KaS0bp1a7Vq1Sp14YUXUskghOQ4mF2KkBQFM7WVKlUSRQNKwaRJk2RwjBiEYH/z/v37h4xL+Pzzz2UQFAwsE3AxggUA5/7xxx9lYN6nTx/1888/q169eqnrrrtObdiwQZUpU8b8V5prFRQSzAzD/QSceeaZ0p+NG+EllDbIb9Cggfrpp5/UJZdcIm0WWEVCUaFChQyuS8YH/6gWaAOfaSmkBQPOA1oEPaB07OAWVgzEXyxevFhVrFhRFB/bv0Aw64zXwW0R/cZg9NNPPzV7T/L333+rhx56yGxl5I477pAZbEuoeAENNAYoHV3sPbhFixZiRYFyFEyjRo3UOeeco958803TotTVV18tLjjB7j233XabDKSDOf3009WYMWPM1knwOSBI+rPP8DGmge+4cOHCaunSpeqGG24wrWnAdQ7XRMeOHdXWrVtViRIlxPJ15513yn68Xby+VZjmzp0r1hCc86KLLpI2S7jv+9prr5XzWyJ938HPMQzqJ0yYoO6++27TkkbNmjVV3bp11YABJ41IUIqwjSB2vMy9994rClYwcA0MVqgs7dq1U1WqhDSqCA0bNhQl0gXFmhBCUgZaMghJUTBYhvLwz3/+Uwb7HTp0kNnYUAGtGKAWLFjwFGnevLk5IjxQKDBghF/5xx9/LNYKDA5ffvllUTDWrVtnjlTigoTB1owZM2Qbs+/Hjh0TFxsMSAHOgcFesIIBQvURgv4HgX/OqwVmm51a5mj5TUv61H6rVq3ksyhSpIi8BygW6DeUAAysofT8+eef5mg9gj16VGa0rTvYWWedFXZWGwP2UP2EhOhrMHW1VNXylmwZrr/+ehkAhwLvBW5NNih5yZIlasuWLSG/PwzoQ/ULEi2Y8YcCG6xg4LuDImktHMWLFxeFwH5mNoAc1yOOA/if2rVrn6JggFB9hMTyfVtw7eH7CVYw8H1DiQu0ziAgG985lE9LuO88b968IfsKyZ8/vzkqNGeccQYtGYSQnAdmgAghqcull17q6EGZc91115mW+KlVq5Zz1113ma009IBclo8//rijB72OHuQ6ehDvXH755Y5WGJxVq1bJfj1oc/QgT9aHDx8ux+JWM2bMGGkrXbq08/zzz8t6rOjzXY1zaoGPvgVxD2iTKXVzqHPixAlZTpo0ydEDYlm/9dZbnYYNG0q/3njjDWnr06dPhs/wsssuc/Qg22zFDvoSAGbgN2tJj0I3h2WKVtScfPnyOQMHDpTtRx55xNEKiazHix6MO7fccovZSqNq1arOsGHDzNZJOnbs6LRp08ZspaEVXSdPnjyyrpVc2Y+3pZVQaStRokT6dx8r+nyZft/mMAHvRyuTZuskAwYMcG677TazlUb79u0zXOc4X7NmzcyWe6BP5cqVM1uEEJIzoLsUISkO3EqQUhSuUnARCQVma3fv3m22TlKgQAH13HPPma2TBLpLBQJXp3/84x/iqoUaBJgxHjVqlGQoQrrX1157TX311VcyA45Z4/vuu09eGy5LqEsAdyQ9eBeXLrjdBINMVaG4+eabVdu2bc2WuM9gWh5ZhhpqQcYmyw9a8IZeDLy3ff/992L5QfpSWAC0YiEz7FOnTpX+wxUMLj74DAsVKiSpWeGadOTIEclOFSrjULi+op/or8W4+ljma/lVy72ypYn2HozvGQHacF3DKZFeNlQfRo4cKe8xGMzEh0rZG+wuBfc5uMLh+0LchQUWKVwTsBTAfcsCqwrcyuBaBZcpWIywDne4l156SaxbweeyhPsMtZIr144l0vetP0LxA4Or2cUXXyxugMFxF3DrwnVqXxPpbeFahngUfDb4zvFbQD9xHQR/54hHQvxKKHAOrTybrVO55557xOJnXQYJISQnQHcpQhIABp4uUQ8KhmYYBvB6++a05ow8+eSTo7QC8u9gef7558eaQzKwUPOuBuvSYQ3ciRBUjoEqfN4xoLPxA3YbVK1aVV1++eUSlIwBMVxlkJ1q/vz5at68eeIWFErBAFBaQsnvv/9ujkgHA3VoTcVlKw342CDjENxpMgA3KQwQa9SoIf20ChcUCmzjNe6//35xlYFbF5QiDJLxulCagoHrS3AfrYSKfTHM1FJAS7qCkRXgMoW4APN9h3V1Q59D9Stadx3EI9jA7kDQjhTGgQoGuOmmm2Rgj+8bcRfB3zcUzlAKBgjVT8jhw4fNEelE9X2jj6ECuz/66CP5XgNdpfA6+M6hYH333XeiXCGbFpTlFStWmKNOAoUzuJ9WMvnOBSgwdJcihOQ4MItGCPEX8/NzA0RtP5m2qj7WsihtNW5QxUzMGKbLzj/+8Q9HKxlmy3F69erl9OjRQ9bRbl15QJcuXcT1pEyZMrINdx89GHP0IN8ZMmSItMUD+qWZpAVBABho5tYyRMsuLVIhzhzqPPvss44e9JqtNLepmjVryrpWtJw778zgbZNOlSpVHD3YNluxg75opmqBpnS9FqSwtZKhn5Fer1ixYs55553nNGnSxLTET7C7FNzEXn31VbN1EvQNblqhgBsV3kqFChVkWw/IZVsrIM7TTz8tbfGAz0kT9vs2h8l3NnToULN1ErhFwW0vEkWLFpX34hbbt293tHIj3xdcC3fs2CFCCCE5ASoZhCQAPTByg35aAv0v4K+ByGCk+oyXDErG5MmTnUqVKknfLd9//70oEYgNKF++vLN+/Xqzx3Fmz54tg8xA33gbA2FjN+IB/dLAhQaKlZxXCz6L2loEHLd06VKJZdi8ebP8nwV9qV69unPaaac577zzjmnNCN5X48aNzVbs6K5cju6EkYrmMOef//ynxLZkRt++feX/pk6dalriJ1DJ+N///uecccYZzu+//y7bFgyU8brLli0zLRmZOXOm7H/44YdNS5pSgrZ169aZltjR5wFhv28cs2LFCmkP/q6PHj3qnHnmmc6sWbNMS3hwHUNBdgv0J1hwzRFCSE6AMRmEJIBAN6RkB/cI+N3DVSaU3zn87UNltPKSoM8PbjMntCDFaTro96ZNmyR1KNykgkH2I8QLhAM1QFBfA5mB4iHSd41+Ygk3MmTrQnxIOJ5//nmp4/Hbb7+Ja4/bIH0r3m9wH5C1DGmJQ6U79oNI3zc+w969e6uVK1eeknIY7mX9+vVLd+fLDLhKwfWPEEJI/FDJICQBRBp4JhPJeI+I5vNLln5H6iv6iVgCFNdDJe3MQLpYKCOIv3EbKC7nn3++VEgPjrtAnANqQYQLfPaaaD7DSy+9VA0ePPiUYHKkBb7mmmtCBr0TQgjxDioZhCSASIOmZIL3iPiIZoCMTEewBmVmWUGtkvLly6tPPvlEsiJ5AepbhCrkh9dGe6Iu22g+Q/SxXLkMRdQFvCckIkBmLEIIIf5BJYOQBBBp0JRM8B5BCCGEkKzCFLaEEEIIIYQQV6GSQXIsKFg2fvz4kIXLCCGEEEJI7CStkoEgxD/+QDZOQrzh3XfflUBRLAkhhBBCiHskbUzG448/rl566SU1atQo1alTJ9NKiHu8//776o477pDqwJ9//rlp9QfGZBA3wETM//t//89spYGK30jFGkioNje54oorzFpGEHBtUwCjKnjevHllnRBCSPYnaZWMkiVLqu+++07NmjVLNWnSxLQS4h4YeBUpUkQGaps3b5Z1v6CSkXOwA3xYZyF//fWX+vHHHzPsA6jLgf0AioO15H7//feyDKVQpCqoRXHOOSh3odR5550nAmUESgnWkQkKiovdZ9tZw4IQQlKHpFQyVq9eLfng8RBCIS3OfhGvuPvuu9Xs2bPVa6+9pjp06GBavYdKRmqBgb5VDoKXf/75Z7pSgKVVHLy2HgDcG2EhCCRUG+6lXg3QA5WmYKyCBOxnFi94b1A4oIRAkPbXrkOC3zshhJDEkJRKBvzkhwwZotq0aZNp9VtC4mXChAlSvAvKxjvvvGNavYdKhv9gkAtLAQb+gUoBlrt27QqpRAQOkmPFDvoDB/oYDAPsK1y4sKzbWXsQONNvXY7sTH92wH7uwCpk9vuAHD58WL4D7MN3Zr87a+nJDHymgUpH8eLFVaVKlURoCSGEEP9ISiUDVgxYM+gqRbxm586dqkSJEurss89W27ZtSx/keQ2VjPjBYBSDTjswtet79uyRwSkkULGIBzvQt8qBXWIW3Q7+7dIqFaEsCiR+oPjhO8USsmPHjvR1uy8c+H6gbKBoHyqnY1m6dGmzNyPJ8htN1t8fIYREIumUDMRhIB4j2V2lgh9AfBCkJidOnFA33nijWr58uZo7d64EgvtBsgxgosGvaxuDQzt4DJzB3rdvX/q6VR6gTGQV62aDpbUUYAkFM1ApCFxa5YGkDvYasrJp0ya1YsUK9e2334rFJBhcB1A8atSooWrWrKny5MmjypQpoy655BIqGYQQEgdJp2Q89dRTauDAgUnvKkUlI/swaNAg9eSTT6pu3bqpcePGmVZvySlKRqBSYJUHa2nAdqBikVWgMEBJgCKAJbYvu+wyWYdAUYBYxYIQKBrr169Xa9askSUs5qGuPSgax44du0avfpvWkjj4bCGEpCpJp2TcfPPNkk40Flep3bt3y2wnzOCnn35qCZBff/1VHjLYf+aZZ5rW2IhWyYjUJ7B27VpVoUIFs+UvmfXv+PHj8hDGjG758uVNq/9k1kf4za9cuVJmIzH7GAuwYlStWlVcX5BlCgMMr0l1JQMDs0DLAtYR12AVCgjashLoay0LUBoCFYiCBQvKNlyUsLTrhLgBlNylS5eqzz77TH344YdyPzHA7NFYy0LZShDhni2EEJL04AaWLOzcuRM3U0cPNpyjR4+a1sjs2bPHqV69uvyvFa2kmL2Oowc6zp133intxYsXl+WECRPM3tjQ58iAaU4nUp/Ahg0bnAYNGsi+ZcuWmVZ/iNS/ESNGOLly5XLy588v+0qVKuVohcPs9YdIfRw2bJiTO3dup2TJkrKvRIkSzvr1683e6Dly5IijFQx5v1rhMK3eovubrMA/sYSWWlraaOnXo0cPRyv8TrVq1Rw96M/wfUQS/JbxvdSqVctp1aqV06tXL2fo0KHOxIkTnXnz5jlffvmls337dkcrtOaTISSx7N6926lataq9ho9raa8lYZhuEUJIypFUN7BRo0bJjb1NmzamJTow+GncuLFz4sQJ2e7Xr5+TL1++9O1mzZrJQ+Pw4cOy/cILL8jrQKmJFbn7B2Ca04nUpxdffFH60LNnT1l+8cUX0u4XkfpXoECB9D7t2LFDlDMMNP0kUh8LFSrkfPvtt7L+/fffO6VLl3buv/9+2c4q+D98DyNHjjQt3oJrJgEgXRGiXOtowcBpsJYJWuZpWadlrxb5HCLJxRdf7FSuXNmpX7++0759e2fQoEHO2LFjnRkzZjgLFiwQxSErEwWEJBNQevV1Dt9Je83jt5IQTJcIISTlSKobGGY7cU8NnvHPjO+++07+59NPPzUtjrNv3z5pmzlzpgx0zjjjDGfKlClmbxqFCxeWgX6s4OYfiGkWIvUJjB8/XmbMfvzxR2lftGiRtPtBNP0Lpk+fPjIj7Rex9LFt27ZOzZo1zVbWwPWBc9etW9e0eIt+LbcJtEBAgRigBYOkOVpWadmvRd5jFLJdy2It07WMguI1ffr0dOWBVgeSE9DXPuinxf4uJmrxPQuA6Q4hhKQcoYMEEgB8uRGLAb/s+vXrm9bIIMYCwKfecsEFF0jueWSqQmYR+IUH7gfw9d6yZYvZcpdIfQJdu3ZNWDBqNP0LBu1XX3212fKerPYR187bb7+tGjVqZFqyhlZwVe7cudWyZcvU/v0YjycdSPBfWQsClXppGallhpblWnZrOaoFF/QCLRgMDdXSTQs+kEpakJsXARKIcoWP+VQtw7X01HK3lipaLtGCWJErtdys5V4tD/fu3Vu1atVKPiPEQjDbEslB4DfSQguKekB5h+LNHwAhhERB0igZSB8KZQCDxKykrUVQMIK4kYYykEKFCsk+CECwaCDYH0sazGiI1KdEk9X+ITB91qxZ6r777jMt3hNNHxGY3rx5cwRRq4YNG6q+ffsqDIhj4ZJLLlFly5ZVBw8eVF9//bVp9RVUWauhBXEQ1goBN6aNWg5pgSsTFIpZWkZpwRttrgWKh9VWoUB8ruVNLc9peVhLoAKRWwsUiFu1tNXyuJaXtMzWskKLNz8IQlKbt7XU1YJAcPzmqGgQQkgUJI2S8d5778myXr16sowWDDBPnDhhtk7y999/q1y5csl+ux0I/idctqd4idSnRJOV/jmOox544AHVrl071bp1a9PqPdH0EZaH2rVrq5deekl17NhRKsU/9thjsi+r4JyYqQcff/yxLN0EmZZgbZk6daqkadYgFuIjLbA+ILh0pxa4KCFvs7VCwKSHGArEUmCAs17LB1rGaxmoBYoCLA5QHIItEH20jNZCBYKQ+IHy3kCLVTTw+yWEEJIJSaFkwILxwQcYO+lRVRZcpQBcjvD/R44cMS1pYLYbOfOtSxJmqAOBFQP7vSBSnxJNVvrXtm1bsSxNnjzZtPhDtH3s3r27evDBB9Xo0aPVgAED1MiRI9XWrVvN3qxx++23yzIWJQNFvpB3f/bs2eq5555TPXv2VA0aNJDCklCGihQpIumZ8XmiDoymkxYEYCOOArOiKEkNZQCzpoFWiGu1XKQlvxbkEcZAp7sWaCpwecLgJ+tFJgghWSVQ0YDrVGxmU0IIySEkhZKBGV4M0qpVq5auFEQLBnEAtQ4syOGPmhio5FyiRAmZFQ/cDzebDRs2qOrVq5sWd4nUp0QTbf+6dOmivvzySzV9OrwD/CWWz7Bly5ayDLZaRcsNN9ygzj33XPXNN9+on376ybSeBPn0UTn4zTffFGsEFAYoDnC1yp8/v9QSufvuu1WfPn3EugLFGfEjUJZQ86Fy5cri3mVcuhALgRz8UBygQECRgFsT/L8DrRCrtUABIYQkHigaHdJW1TAtmCgghBASgqQoxodBGWZ/UXkZLi9ZBcHBBQoUUK+99poU7urRo4cUkVu1Ckl1lAz8tm/fLtWcr7vuOnGLwYDV+vbHglZcMi3GF6lPYNu2bernn3+WQfOMGTPkf4oWLWr2ekuk/vXq1UuNGTNGvf/++xkUv2uvxcS6P2TWx8OHD8t106FDBxm847OEq9S6deukoF6s3HLLLWrx4sXyWojjgZIAwfWC5AThQMICBEVDoNiisB+Wtg37Awm+fpKZZLhHEOI3EX6jUDCQeQoujLgpRl91Movw90cISVlwA0s0qG+ArqAwVyz88MMPTpUqVeQckAoVKkibBfUxkM/f7kdhuZUrV5q9saHPkwHTnE6kPvXv3z99X6BMmzbNHOEtkfoX2KdAmTt3rjnCeyL10RYytKKVNWf+/Plmb3gOHTokRfeQlhWF4VCXBTUftFKR4XzBcuGFF0rtDhyP/0PaW1yzWlk1Z44efb6UwXSZkByFufzDARdHxFPhOE+L9ZnuEEJIypFwSwZmieEaA3eSvXuRQCd2YBVAMDfOFQrEZegBpitxEcGzXOE+x0h9SjTJ3j+QWR9h0YAVA9aWiy6Cx9FJEHcDyweuMaQyRswEUuNmllUM7lIHDhyQZb9+/cQaYS0SwRnK4iHCLGlSkeh7BCGJIIrfKNJJI9sb8m1fgwYv4O+PEJKqJFzJgO86gmTbtGmjpkxBYp3UIPgBxAdB4oAbE2IloECsWbNGlAkoFoihCAXqPJQuXVqUByxLlSolSwiyTKGGyh9//CEuUoi38IIoBjBJA69tkhOJ8jeKrHBIPw2XKcRPuQ5/f4SQVCXhSkbdunUlmw+Ci1HwK1UIfgDxQeAPUCBgnUAtC7seLlYClgcoEuXKlZMaGFapgGTGTTfdJAHvSKuM+hteEOUAJingtU1yIlH+RlGzBsUxke1N0sYlG/z9EkISRUKVDGSUgosLsu/AVcpNdxSS+sAysXTpUlEosIRSAQtDMAiqhuKAAHBYJaBUQLKaqczy6KOPqhdeeEFS4g4dipIV7kMlg5DkJsrfKHKuo2gmsk6hRk3Swd8vISRRJFTJQJXvxo0bqxo1akhGH5JzgfIARWLhwoVq2bJlsh7K3claJq6//vp0ZQJtboJMX/fcc4+qU6eO+ugj1MtzHyoZhCQ3Uf5GkTYOFfkx+3G+WSYV/P0SQhJFQpWMzp07q1deeUVmizFrTHIWUCRQS+Kzzz6T9WArBZQH1E5B/YpKlSqJQuGHtWvHjh3qqquuUueff77auXOnypcvn9njHlQyCElusvAbRd7vSlpQwGcpGpIJ/n4JIYkioUrGlVdeKcG1qHuAQSRJbeD+FlwPIhAoEVAqZs6cKcvgWApcA7AeoEgirFuJyngF9z1kPMO1uXLlSk9qg1DJICR7gMQlSGAyatQoqS8UL27fG/j7JYQkioRV/MYADoKZaSoY2QM8aHPnzi3VsAPB94zCecjUhMKIU6dOFQUDcRQoejdr1iy1f/9+UTZHjhypmjRpktCUusg+VaUKim8rCQAnhJBwVKxYUZaIHSOEEHKShCkZ8L0HqL5NsgdIHwsrgFUQUI8CFblhFUBFd8RYQKHEjB8qsG/cuFGNHTtWlIpkC/pHFXZAJYMQkhlIOAGQ6Y4kH0ggsm7dOrPlHWvXrjVrp/Lrr7+qJUuWqD///NO0xE9mrwci7c8K4c51/PhxtXz5ck8+33CviTHGV199pb755hvT4j6RPjskKsJ1RaIAptRE0K1bN5hwHT3gNC0k1dEKhHynqIKtFQjn8ssvl+0zzjhDqmSvWrXKHJn84D2g71pBMi3uos+dMpguE0JCoAdaTt68eeV+cejQIdMaO2m/Ovcwp00K9MDQ0YNS5/fffzct3vHmm286l156qVO4cGH5bsqXL+/owaPZ6x5aeXBuuukmeY1du3aZ1jT0gNi58847ZV/x4sVlOWHCBLM3NjJ7PbBhwwanQYMGsn/ZsmWmNTYye60RI0Y4uXLlcvLnzy/7S5Uq5WhF2+yNncxec9iwYU7u3LnluYz9JUqUcNavX2/2xk+kzxbgOy1WrJgcM2XKFNNKwpFwSwZ870nqg9kFq9mjmF2LFi3Ujz/+KDEWsFjoH2NKucWVKVNGnXXWWRIEHq4OByEk9dCKgNybAuXIkSNmb9aBe6W1ZiCBRbTgNWH9xbNw3759ptVbgt+3Fa/59NNPJb047qtwRUVSjSFDhpi97nPgwAH14IMPqqpVq4pFXY910t1z3WTQoEFSV0krMLL9999/y9LSsmVLef3Dhw9LgVikRkfCm1g/80ivB88AWxMK4LkcK5Fe6+mnn1aLFi1SBw8elOckXmvw4MFmb2xEek14QcBqsnnzZnHDxm8PLtZuEOm1LU888YS8XwBLDsmchCgZGLRhQIogYcZjZA/wfSKwG7Up3nzzTalpge923rx5rqeY9YMCBQqIm9exY8c8NcsS4hcY6MD9b8uWLaYlscBlMhEuB+3bt1dFihTJIBhgxAOy4IFolQwMNgsWLCj3yNatW8u9xmvQt+D3bQVZHr2ka9euMuDHYB+CAWpw7J6bIA06FLdx48aZFiXFfjEotgNEN8BEFH5XoQoJ43n47rvvSmIAHAcefvhhVbhwYYlDjIXMXg/kyZNH7d69W/Xt21e2T5w4IctYiPRaUOQwKAdFixZVTZs2led+PER6zT179oiyCooVKyYKK5QNN4j02gATps8884z6/HOUxVEyPiCZkxAlw35BsGJAEyWpjx0s4KH5ySefyDqK2qXy92sV4A0bNsiSZC/c9FmOFsyiY7CHh5Wf9O7dWyZ1MIt69dVXq+uuu8632fNQ7Nq1S2aWr7nmmnSrtp80aNBAJrusxDsbiox4AIPbSMyZM0fujePHj5cBNz4L+LV7DRQhJNgIFMTKAS89CvAef/jhhwyvgSK8XibYw+8MBM5G2xnqbdu2ydINMJi3CkQwmzZtktl9KFeBwNIfq6Kf2esBKHOxFqENJtJrBQNLDe4t8ZCV18Q48u2331aNGjUyLfERzWvDinHXXXdFtHaQkyREyfjiiy9kaW/M2Z1Ig5lEDHYCCff6WQnqsuZf3FTxvWJm0K0fPwjXR7yeV0FgFSpUkGWiv5/sCmbccH35faPGbD6uUWQF+umnn0yr9/Tv318sZBjgwm0E9V8wM+cHCDjFDC5mGuGig9k/uB4kCjysCxUqJOuJcDnADC8sCVbixVoy7ARaZrz88sviynP//febFqWKFy9u1rwFCTYCZcSIEap58+ai8HkFlIl7771XPfvss2JJwIQUMhFmNmMcL1dccYUs8TqYbYbSMX/+fGnzC9zfQHBSE1z3cKHKTuAZCevMfffdZ1q8AfcKXK+4pho2bCiKASZQ/ABWKSg1s2fPNi0kGhKiZNgsHF64SmU2IPQiw0NmRBrMYGCMHwr2Y6DsN5n1Dw8EFKGrXbu2DLbxEMLgJBzID48bOc45cOBA8beFCwAqumMbNTRiIbM+Dh8+XGYe2rRpI36oeD03rQ60ZHjDzz//LLOal156qczy5cqVy7cbd7R+t16AWWPc+zCDjCWuKxQi9QP4asOlAeD3jNovbrkZZJUFCxao1157Tb366quyHY9LR6zgGYD7LzLeuQFmjzGwxfkiuYDBcoPsdZiYQR0euJ0kgrlz50qWnC5dupgW75g0aZKkL69Zs6ZYr3D9vf7662av+1x//fUSBzht2jR15plninL/1ltvmb3+YC01wfcYXO+nn56wcFjXgaXqgQceUO3atRPXPy9BinyMSaA8duzYUWJAHnvsMbPXWzAxMmbMGLNFoiUhV/qKFStkaWd/3CCzwSh+1DBxYcYKP4S8efN67oMaaTDjZoBWLETqX6xBXXDHwAASrhlwQ8CDDL63sbhNReqjl0FgAA9DDICt2Zu4A36LF1xwgfwu8YDq16+fzID5MeCHUhrJ79YrMLDF/QlgeeeddyZEgcXAC4G49erVMy3+goe1dd9KBBjgLV68WJ4XCECG61isPvKBWHegzNy/MLsNX/0XX3xRYiEwCYOZ7oceesgc4R/Dhg0TJb9u3bqmxTtgRZg8ebIMDPFbx/PXKplegcknPBcguH/j/QI/4l+AdVvCMzQQWDEuu+wys5X6tG3bVsZU+H79oHv37mIJHD16tBowYIA887du3Wr2egMmNPEaO3fulElTey3hukZwPwmP70oG/PYw2wO/RLcKrkUajLqd4SEaIg1m3AzQioVI/YslqAuDBgz88QCHVQMKwJQpU2S2FjehrBKpj14GgQEUD4RpGzPvEBI/uFEjJgEBkHY2D4Uajx496os1I6t+xl6Cz8KvAQ/80K2bQadOneQeiMGB3yAOAS5Fbk4GZJUZM2bI/RYWJUwgYPLJjUrdUFpAZnEZNlbg5ptvTo/HgIULSgfcMfwCFn9Y9f2wYuA6x7WHgRoUizfeeEMsG7gO8azwGjwbMFmEzxcWJIw93AbnDwYTiPi9BcbbwN0HEwv2WomVUK/nFZm9Fq4fTPBOnz7dtLhDtO/PDvDdnKAK9dp4VuEaxpgD8XTWYwYTnPEGu2d79I3OV/QNXvILN2nSxLTEj755OXow6ixYsEDOrbVNs8dx9OBF6jTowa5pSQO5s/WN3Wx5R6g+BaIVHdm/aNEi0+Ivkfpnufvuu52GDRuaLX+Jpo/6YeXky5fP0YMX0+IOtWrVktdGH9xEnzNlMF12hblz58rnGZwnH79H5F33i2ive6/48MMP5fU/+ugj0+I9L7/8sjNmzBinc+fO8tq4b/qJHmA7Wml39GBPtrWyKf2YN2+ebCeK9957T/qB2j7xgDpAOA9y94dj3759csz7779vWtIoWrSofDdA73cVOWkQ7dq1cy6++GKz5S16ACrv+aeffjItaZx33nnOs88+a7bcx/62Dhw44EycOFH6MG3aNGlziyNHjjhaiUof1+Ca3rFjh9nryDinYsWKUn/hjz/+cKpVqxbX5x7p9QD264G/7MdxwfujJdJrPfTQQ9KOa3nlypXpEg+ZvSaeGd27d3e++uorRysVznfffec0bdrUtVpW0Xy2FvQFx7z++uumhYTDdyWjd+/e8uUMHTrUtLhHqIEDisOgbdOmTaYljeuvv97p2bOn2fKOSIOZVFAy1qxZI8dMnTrVtPhLuD4eO3bMadasmexDQaDBgwebPe7RtWtXOf8rr7xiWtxBnzNlMF12BRSiOvPMM83WScqXL+/06tXLbHlPIpWMPXv2yIOxT58+psV/2rZtK+8fAx+/qFKlinPJJZfI+x44cGD6b6tjx44yCEwUKNqGfmCQES8YOONcu3fvNi2ngs9g7NixZittwJIrVy7nnXfekW39/64iJw1g//790scnnnjCtHjL119/La83ZMgQUTRx38azF21eKZiYdLzwwgvlNSC4v0DZcRsoa/Y1AgWTXgD9qF+/fno7CtbFMxCP9Hr9+/cPuT8W5SrSa4XaB8FEUqxEek1bZNDKjTfe6MyfP1/2xUuk1w6ESkb0+K5k1KlTR76cOXPmmBb3CDVwwE0MbXiwB4KLtUWLFmbLO1JdycCMQfXq1eUHmCgy6yNmZ1966aX0WRW3B24vvPCCJ+fV50wZTJddAcoaLIvBlC1b1nn00UfNlvckUsmoW7eu06pVK7OVGD744AN5/xgE+cUjjzzi3H///VL9HzOQdsCAJZQOP8B9FgMDDLTBihUr5Npr3bq1bMdLo0aN5D1hNjQc+AxuuukmufdjwI3BPipT//XXX7Jf/7+ryEkDwAQfmvH6fgGLha28DcG6l1YMC2aiM1P4/ALWFD8/7+wMBvhr1651fv75Z9OSGBL9+qmC70qGnV3Yu3evaXGPUAMH+zANvtHcfvvtTsuWLc2Wd6S6koGHb+3atc1WYoh2QDhgwAA5DmZUt4ApGOfE4MFN9DlTBtNlV7DuUsGD2wsuuEAUOr/A7w398FvJgNshXCb8BFZcKHAbNmyQ7eXLlzs1atQQSSTr16+X7wC/b7+AS1TlypXldc8++2wnd+7cTqdOndKVjngZNmyYnDszq9wvv/wi91QcByldurTz8ccfm73eKxnFihVz2rdvb7b8Be4o33//vdkihGR3fA38toWPEPDtVtB3JBKd4cHPAK1YSERQV1ZJZBCYLS6EAC8SPzbQOTAYEsH6SC+NoEyvQYA5gqBtfQoE3qJQmB8g282HH34o6RdXrVqVLl6DDEpff/21ZLNDCkgkSEDwO7KzJJJEpPFEKm5ce7gGEMCJGgoTJkw4pZZBrNSqVUuWmWWYQqC5ViokCPzIkSPSD6Tl9AvcyyZOnGi2/OWqq66SQGxCSA7BKBu+AN82vCSCab0g1OwkTGunnXZahngCmKjhAztz5kzT4j7RBBFhvxsBWrEQqX9eBHVllcz6iO/VyyAwCxIH5M2b19GDMufPP/80rfGj30/KYLrsGvDNx0wuvkt8j5hVrVSpktnrLVnxu3UT3JNCvS4EcWN+gBl0BCdrhc60JJ7s5nJg7xf4XmO1juj/dRVzWkII8R1fb0Djxo2Tm2+PHj1MiztEGjC7neEhGiINZtwM0IqFSP0LtQ8ST1BXVonURy+DwAIpXry4nN9N1xp9vpTBdNk1fvjhB1E0cGpIhQoVpI2Q7IDNSDdr1izTkjXwm3MTc1pCCPGd0/DH3Is8B7nxYaJHITqtaJjW+Ln//vtDVg/Vg1EpkASTdLNmzdQHH3wg7aitABcgVB0lqc3hw4fF9QFucRdddJFpdZc6deqoTz75RPL7x5vf3HKaLQebAnh1j0DtEbjM+OU6SYgfoGjpkCFDpPYG6gZlFbfvDX4+4wkhJBBfnWK//fZbWZYrV06WboFKk7iPBoutwAr/43nz5kmBuR9//FH6QQUje3D22WdLEUavFAxgfYjdLPRHlBQ6pIJBshvRxGUQQkhOwFclY/Xq1bJ0W8mIlgIFCmSrcv7EH6ySsWPHDlkSQkg4KleurPLmzSuVgH///XfTSgghOQ/flIw//vhDMjr5mVmKEDe44oorZEklgxASiXPOOUdVq1ZN/fXXX+JiSQghORXflAzranL55ZfLkpBUwVoy/Ep1SghJbWrWrCnLzz77TJaEEJIToZJBSATsNWtrKxBCSGYwLoMQQpTyLbvU+PHjVffu3VW3bt3UuHHjTCshyQ8SBqBYV+HChcXlzw1SPbtUCnWfEEIISTg+DbeTCt8sGdafnYHXJNU499xzJZATlow///zTtBJCCCGEkHD4pmQgdSywQbSEpBJFihSRpVuWjOwCZmYSJYMGDZI+YBlqv5eSiNdO5Pu1wj6clEj9uOGGG2Q/gsBD7Y9Hgl9bA9OiJxLuNf2SnPK6fD1vJFGvGyg5GcZkEBIFBQsWlCXjMggh0TBgwABZfvfdd5JpihBCchq+Kxk5zZKB9/3SSy+pxo0bq5IlS6r8+fOLYB1t2GetPCR5scX+aMkghERDo0aNZFLtl19+YQA4ISRH4ru7VE6xZGAw2rlzZ1EmevbsqebOnSszWijOBME62rDvyiuvVB06dOAANom5+OKLZfnTTz/JkhCSs9m3b58sM6v71Lx5c1m+9dZbsiSEkJyEL0rGb7/9JksEz55xxhmynp2B8gDl4pVXXpHtJk2aqClTpqjt27erQ4cOiWAdbdgHJk2aJP/z9ttvyzZJLuxAgoogIQTYat4ovheOZs2ayXL27NniMrVixQrVp08fde2114pFG1nasMQ22rGfEEKyC74qGXY2ODszevRocYPCA6h06dJq8eLFatasWapNmzbiKoYHEgTraMM+HINj8T8tWrSQc5Dk4qyzzpLlsWPHZEkIIZGoUaNGusvU9ddfr6pUqaKee+45tXr16nQlBUtsox37b731VrV+/XrZR5IXpCGPF3MqQrItvigZ1lUqM7NydgAWjIcfflisNb1791arVq2SzCKRwDE4Fv8DcA6ciyQPNibj559/liUhhEQDJpDA2rVrpd5Ov3791IIFC9T+/fsl8wyW2EY79iN+A8qGtYQTQkiq4ouS8ccff8gyM7NyvMAFaenSpWrjxo2m5VR+/fVXtWTJEk9qHcCN5t5775X1Xr16qZEjR6rjx49H7BPAwweuZPgfq2i0bdvWc9ecSJ8Z+r98+XK1bt060+I/kfoIF4SvvvpKffPNN6bFG6wlw17LhJCcjb0X4N4dDlilP/74Y1nv0aOHuMkOGzZMKoJDoQBYYhvt2I/jcG7E9NGqTQhJZXy1ZHiVWap///6qQIECqkGDBqpMmTKSnzww1eiJEyfUXXfdJWlI27VrJw8Ft2eJBg4cmO4iNXTo0Ih9AhgYN2zYUFWsWFEGygD/i3PAxQzn9IpI/Xv22WdVvnz5VO3atVWFChWkT2vWrDF7/SFSH4cPHy6Df7idlS1bVmJaNmzYYPa6ywUXXCDLvXv3ypIQkrOxk0Dh3IARh2Et22PHjhWxikU4sN8ei//D/+M8hBCSivgak+GVJcP6uMLsjCUGmhisW1q2bCkPhMOHD0tWpxdeeEFmidxKHYs0tQjcxkNh4sSJosRE6hMeIhgYlyhRQrZtHnX87/Tp0+VcOKdX6W0j9e/pp59WixYtUgcPHpRq7ejf4MGDzV5/iNTHUaNGiZVl8+bN8h3gM4M1yAug7IAjR47IkhBCwoEYjA4dOsg67lmwTmQFHG/vdTgPzkcIIamGr0qGLWjmNnB/gjUAYHnnnXemz2jD7Pzuu+9Kqljr8oLZocKFC0vQtRsgfgKDcORFtzEYmfUJ5MmTR+3evVv17dtXtmFtsVSqVEm1atVKzunVLFak/h04cEDddNNNsl60aFHVtGlT34MRI/URVo1SpUrJerFixcSP2dZjcRtryWBMBiEkEpikwXOvfv36EmthgWtsKEK5puL/8P84D86XKBigTAiJFV+UjF27dsnSr+xSW7duFdcZsGnTJhmsV61aVbYtyPixZcsWsxUf8+fPl6VNVxiKwD6Brl27Zvp53HHHHbK05/aa4P4FAwvQ1VdfbbYSQ2Z9/PzzzyX9LxQ9L0CaSXD06FFZEkJIKOA2O378eFm3ltUvv/xSVa9eXSZLgmvtZOaaav/fno+EJ5q4TBBO0SOEuI8vSkagK5DXfPTRRxLfcM8998g2rAUg2Be2UKFCrgVWf/vtt7JEusJQBPcpGqxFxJ7bSyL1DzdlWH3uu+8+0+I/ofqI2T8Uu8JEG2JbYBWygfNuc+6558rSFuAihORsrNU0uMDsm2++KRb0OnXqqHLlyqlBgwaJVbh8+fKy/++//5alJTPXVPw/zsOEE5kTawwkIcRbfFEy/AKuLA8++KAUNcKNGVhLb/CNHe5Jp5/uztu3ykqoFL2h+hQNfhV/i9Q/pFh84IEHJGC+devWptVfwvUxd+7cMvv30ksvqY4dO8qD+bHHHjN73QVKBq4lxGQEX0uEkJwLYsEC+eSTT2RpLdtw00U8IFxgQxHJNdWeh15L4Yk1BpIQ4i2+KBnhZnzcBlmGUPAI5meLdUnCLFEgGLxfdtllZss7QvUpmYjUP6TShQVq8uTJpsV/Mutj9+7dRQFBqscBAwaIewHcqrzAJi6wMUaEEBIMBrnAWrZhYbXxgNEQ7JoazkJOThJPDCQhxDt8tWQEz/i4CWZ/4JOJzEyBYOYCM0AIqrPAzQY3IPjIuoFVZIIzgITrUzTYc3kZxxKpf126dBFf4lj67xZZ+QyRRQx4ZWmw1iUqGYSQcNhJtVhStodyTfUq9Xt2JqsxkIQQb/A1JsMrJQMz3R9++KG4zaBythVw9tlnS40MzHBjwIwZj1tuuUUqOGMA6wa2oiuCjy2Z9cmybds2tXPnTlmH/+gPP/wg6wABbMCe220i9Q8FBSdMmCD7kUY3VP+9JrM+wv0AblxQHuHShYcKfJ/xYMksgD0erCUDgZ2EkJyNnQgKjvez8RNZTdkezjXVyyK22ZFYYiAJId7gi5Jhaz144S6Fc7/xxhsy6KxcubK67rrr0sVm6MD+Sy65RPxe4foDv833339f9rlBvXr1ZIlUuSCaPsG1p3jx4urGG2+U7RYtWkgaVjtjDx9SAEuM22lZo+nfmDFjZIlAucD97733nrR7TaQ+QnnE54KsYYitwecEczgUEq+wKZgZ/E0IsZMNwUqGnUzLarB2ONdUBn1HT6wxkIQQb/DVXcoLoLhgBiiUWB9N+MPOmzdPAuwweEXGpmuvvVb2uQHSpuLBgpoWsEBE06ennnoq5P57771XfHqXLFkixyHW4MorrxSXryJFiohSAoUEtT4Q7IZMJrCg4H1FSzT9C7UPYlPrek00fYSiiAc9XAzwcMFndvvtt8s+L0CaScA0toSQcNjgYsRWBJIrVy6zdiqZuaYGn4eEJ7P4PUKI//jqLpVokOLOi2Bv+Mzi5ob32aFDh7hmnvC/OAfAwwqzMXCZgskcigSUGNSDgPKB2RooJTfffLMoIFBEoJBgG+3Yj+NwPP4vK4pIqgCLBlJDwv3Na1DAEUChIYSQUFgX1xUrVsgSkxJwjbUpVVE3KtA1NpJrqj0PJlhIeOKJgSQkGUHlfzseDAVCAV5//XWzlRGM+5DS+dixY6YlI5jY6Ny5s9nKCBIjYPL8v//9r2mJHV+UDC8DvpMFpMuDIgArycCBA01r1sH/wpKBcy1evFj8S1FcCDfPvXv3ysNnzpw5aty4ceJy1b59e1WrVi1RSGBqhwsRLBuwcMDSAYsHLB+wgORURYQQQtzETiSFerZZa+/MmTNl2a1bN3GNxX0YoAYSXGNtDF8k11R7HhKeeGMgCUlGMJ60LuzB4Br+3//+d0o9GAsyqH7wwQcybgwFkh8FZmALBONA3H/CnTsrpLy7VLIA956JEyfKurUyZMWigWPxP1AMAM4VnA0D2Y0qVaokGiYeXFBscNyCBQukejlmzHBBIRgaGUoQ19GvXz+5AUMRgcUFD8VYFBHcvOEOhlk1r2t3EEJIMmPvgbjvB9OkSRO5z+IBD1cnxFgEu3xCbGraUPsgUFbw/zhPTpioixUMiOKNgSQkGfn444/VypUrzVZG4Flhx42hgBUEv4lw3jtffPFFult+MPht4H979uxpWmKHSoaLoPr0qFGjxG0Kg3fEfdic6ZmBY3DzswoGzoFzxQIUEdxo8aDDRTZs2DA1ZcoUUUS2b98u6XsRIA3/3xkzZshroUo2CkXhoWfTJQYrIrjY7r77blWlShUJokchPCgit956qwQsPv7441RECCE5HtyDYWHGcyDcACBa8P84D85HQhNvDCQhqcqZZ55p1kKTlfo8wcTzv4FQyXAZ+NfCncm6TmFQjkE4BusYuCNQGYJ1tMHfDgqGdZHCwB/n8BJYSGCyhyKD10J6X8zowD0LighuvjAr20BE7MdxOB7/h5s6Hnx4DwsXLlRTp05Vw4cPpyJCCCEapNPG/Rz3uvHjx5vWrIH/w//jPDgfIYSkGlQyPADuTHBf6tSpk2xjEI4ZEwy48+fPL4J1tE2aNCl9pgr/E6sFw22gSEChgIUDlg5YPKAAQfGAAgJFBAoJFBNYSmAxgeUEFhRYUqDIRKuIoK4FFBEoXIhJwcN17ty5ongFFzgkhJBkB/dPm4Yc9zzEvGUFHG9dFXCeUG5ZhBCS7FDJ8AgMspExBIoDHhJQPBCcjVkpCNbRhn0YrIeKwUh24FoFFyvEfCD2A+8FsSCICYFLFlyz8N7gqgVFBDEkiCXB+0ZsCdwKoIjA7xiKCBQumLW7d++uGjduLO5myBqF1LGhFBH4Kq9fv57F8QghvmITZGQ2+MfEESwQuMfZtOOR7lXYb2Pk8H/4/0S7SjmYUSKEkBigkuExGIhjhn/OnDmicCBLFATraMO+7DpLhWBFvH8EnUMRQfAdsmLhfSPzB4LUEayOzwKKCBQtPFRhAapfv74qV66cFLpCcFMoRQTp2ZC+Fpah888/X9ahnGAfjoH1BP8DawohhLgFFAAQKSB78ODBYgXGcbbmEdxGkcnPKhxYYhvt2I/jcDz+D/9PCCGpCpUMklCQdhdWHSgimLHDQxUWIBRPXLdunVRnh1KGNL5I54t9dnbP1hDBOX777TexasDNClYOWDsQBwLrBx7cgcUMQ2XMolsWIcQLEM8GN1O4n+I+A7dR3IcwOYL7EpbYRjv24zgc73VsHiGEeA2VDJL0wL0MygSUClg5oIjA6mFriNjUvbaGCNy2glP3Arg4YMYwVMasQLesunXrilsWXgeWE6SRQxC/rdibldTEhBCCODUoDohhg/Ua7qK4rwEssY127MdxOJ4QQlIdKhkkWxBYQwQP6+DUvYEZsxDAHpgxywaqW7csKBVQLoYMGSLKBpSOa665Rr366qvyWogtgXICJQXKCpQWKC/MlkVIzgCWUwB3zqyAGDZMgmBCBBZa3JewxDbabe0MQgjJDlDJIDkGmzELikVgxqxQgeqwlAQGqiM+xOak/umnn8TNCu5WcLuC+xXcHQKzZYWyhkCBsb7chJDUJVYlwysQnO0V5iVIEObjiQtzKkKyLdlGyUB1QsxSI4g4HL/++qtUOPzzzz9Ni7dE0yewdu1as+YvkfqHQTcG4IiNSBSR+ohB+1dffaW++eYb0xI7gYHqiPkIDFTHZwAXLPDggw9KzAjiQ3AMjrVuWehPOGsIlA8oIVBGNF9qQbnZkVp6aGmipZKW5Bi1EEIIIYTEQbZQMjArDb/Wzp07q6uvvlpdd911at++fWavUidOnFB33XWXKliwoGrXrp0ECr/yyitmrzdE6hPAwLhhw4ZSlRQDZT+J1L9nn31WYhRq166tKlSoIDERa9asMXv9IVIfESiJqpSIvShbtqwM4jds2GD2egdcs5D9CvEhsHbA6hHoloWlrR+C/TZblg1SN25V1bS00tJbCxLqz9KySst+LYe0QLObp2WcFmg3bbTAl4IJ8wkhhBCS9GQLJQOWiR07dkh2IQyEkbIUrjCWli1bysAOs+KYZX7hhRdk4GpznXtBpD7B/xYDY2RWAn670UTq39NPP60WLVqkDh48KMehf36nU4zUR6zDwrB582bZB0sEYi0SDSwatn4ILB02W5YNUodrlqaKlhZa+mgZrWW2ltVa4IeBiNByWupr6aZlmJYpWhZr2akFZvbtWhZoQftQLaj8iONLa8mrhRDiEfZ+HSmFLSGE5GjSPAO9RQ+6MChytm/fblq85bbbbnNat24t63pQ5+gHgTNlyhTZthQuXNh58cUXzZb3BPYJjB8/3tGDTUcrOvLZ6AG92ZMYgvsXTJ8+fRytEJmtxBCpj23btnVq1qxpttxHKwzyXT3zzDOmJXbw28sEq2Q00gJXKigZcK2Ci5VVMiIJNBnrkoX/h7ISkxJiupwBNFMoFAqFQolOciLZLvB72rRp6tNPP1X16tWT7U2bNsmsU9WqVWXbgiDgSLESbhHcJ9C1a9ekqfAdqn/BwAIEl6VEEamPn3/+uXr77bclSNsrjAVC0t16DKp0rdcyV8tLWh7Xcq+WG7UU0ZJbS0ktdbV00DJEyyQtC7XYyoO4uKxLFtyt4HYF96uNWo5qcU0JIYQQQgg5BaNseIrXloytW7c6zZo1k9fIly+f88ILL5g9jjNv3jxp37Nnj2lJo0GDBk6LFi3Mlvtk1qdAEmXJiLZ/YM2aNXLc1KlTTYs/ROrjsWPH0vfnz5/fGTx4sNnjDe3bt5fXmjhxommJHX0er0FxkFpa2muBn9tELXCvgpuVvI8Ikq6E9OvXzxk7dqwzZ84cZ926dc6hQ4fMuyDEfwYNGiTXKJaEBLN48WLn4osvlmskV65cznnnneeMGzfO7I0ffV7PMS9FSMpzGv6Y69ozUHEZPvMIiIW/uhcgCxCyIcF/Hz7wCAru27evmj9/vgTdYhY60HKAGfHzzz9fahx4Rbg+BbJr1y6xqiD+4eabbzat/hBN/3B5oF/FixdXkydPNq3+EamP2P/333+LVWrMmDGSUhZB614AK8l7770n19Ttt99uWmPjNJT6TSz4IQZKMbNEYDmWmTqbI/gdv2UrxYoVy7CNgH1CCPELeCwgmx+eETZmBslLEAcHkL4czxCkI48HP+7dfozLCPEFXMxeU6lSJZlVWLVqlWnxFvjm4/X++OMPZ/Xq1bK+adMmszeNChUqOI888ojZ8p7APgWSLDEZ4fqHGIjatWubrcQSro8WGzPx3XffmRZ3ufXWW+X8CxYsMC2xo8+T7EDZQDarNkOHDnU6derk1KlTR+JyEOOk2zMVzCTqh7rTpk0b+V70w10+t507d5pPgBBC3GHLli1yv8G9B/cn3LPs+owZM5zLL788fRuW2Xissfo8nmNeipCUx5eLuVatWvIDd2NwFg0ffPCBvN7hw4ed33//3TnttNMyuPrAzQZm1JkzZ5oW7wnsUyDJomSE6l/nzp2dq666yvn5559NS2IJ9xla4MqD/Zs3bzYt7nLjjTfK+deuXWtaYkefJ2UwXc4AlAW4JSChQlaVEOwvXbq0U79+fadbt27OyJEjZSCASYj9+/ebVyCEkMhgAuOcc86Re8sVV1zhfPnll9JuXaaQYAVKRa9evdLvTTgO7p+xoP/fc8xLEZLypLySAQvFo48+6mzYsEG2ly9f7tSoUUPE0qRJE6dixYrOkiVLZBYcMx64AXlFNH0CiDnADRGfDQZZO3bsMHu8JZr+PfTQQ9Kv999/31m5cmW6+EWkPkJ57N69u/PVV185f//9t1gvmjZt6pQsWVL2ewEG0PhM8L3Fiz5PymC6nCUQf/XRRx/JAACWjFatWsnv7sILL5TPMDPBMZUrV5b/wazjuHHj5FyYrSSEEIAJiebNm6ffNzDREWihwD0E7VbpAHiO2HYIxgZZta7q//Mc81KEpDy+XMz2RoCBtNtglt0qMXaW4vbbb3dWrFhhjnBk5rtevXqyD1KqVClPB8zR9Kl///7p/QmUadOmmSO8I5r+BfYpUObOnWuO8JZo+ojg/cC+wdIwf/58s9d9MPuF19m7d69piR19npTBdNk1MBCA1WLWrFnOqFGjnB49ejiNGjUS60bevHkzfKehBMoerCYYVAwbNsyZPn26DB7c+F4IIakBJjJgwUBgd6ixBRQI3C+C9x0/flwSWeD/8GzZuHGj2RMd+pyeY16KkJTHl8DvDh06qEmTJkll5PbtkezGfVAJeufOnRKAioDuUBw4cED9/vvv6rLLLjMt3hJNnxJJsvcPROqjViDVtm3bJKjf69SyZ599tjpy5IgEouuHk2mNjSQI/I4aP+4RgaBIJhJFIG0yllu3bk3fNtXSw6IHDhJ4rhURWSJhAdZRbR0JFggh2YfZs2erypUrh/xt9+zZU7300ktStLVXr16m9SS4zyxdulQ1b97ctEQHA78JiZ5so2QQ4jV4tuTJk0cqkccLlYzY+OOPP9KVj2AFBEtMIoQjb968onBYoQJCSPZl8ODBkm1q0KBBsu4WVDIIiR5flIzHH39c0soNHTpUDRgwwLQSkjocOnRIFShQQF166aWSdjheqGR4AywdVunYtGmTLK389ttv5qhToQJCSPbiqaeeUgMHDlT9+vVTw4ah3qg7UMkgJHp8UTK8mlEgxC/gslW0aFFxwUG9l3ihkuE/v/zyS7rCQQWEkOwNvCfgRQHvCXhRuAWVDEKixxclY/To0erhhx8Wv0j4RxKSasAtBwPLG264Qfx444VKRnJBBYSQ7AWVDEISjy9Khlc/dkL84ssvv1Q33XSTqlWrllqwYIFpjR0qGalDPAoIlA2rgJQtWzZ9GwHqhBDvWLhwobr11ltdu2dbqGQQEj2+KBlz585VjRs3VvXr11fz5s0zrYSkDrhuGzZsqO6++271zjvvmNbYoZKRPYhVAUE2NCgb5cqVE+uHVT6wJITED5UMQhKPL0qGVz92Qvzi1VdfVZ06dVIPPvigpEWMFyoZ2R+rgKxfv17c7b799lvZxvKvv/4yR2UEqZGtsoFlqVKlRBHB+oUXXmiOIoREAr+za665Rn5LGzduNK3xQyWDkOjxRcnAg7VkyZKuBc2S6PHyhuj2tZPMN+8nnnhCsqONGDFCPfbYY6Y1dvx4r27h9vdM0gZA1uIBCwi2IZnVAYGLFQZMECgfgcoIXLMIISdBlrkrr7zS9XFHMj+nCEk2fFEy7I8dgZDI0kP8AzdE3rDi5/7771evv/66evPNN1XLli1Na+z48aByC14//oE6H1YB2bBhQwZlJLMaIIEKh3W/ggUEblmE5ERWrFihqlSpoqpVqyYxdW7hx72b91ySXfBtAGp/l/zt+AtuiLxhxU/NmjXVokWLJLMUMkzFix8PKrfg9ZMcoEIxXK+s9QNLKCGYxAmHtX5UqlRJrB9Yh2B2l5DsDGMyCEk8vg1Ac+fOLX7IKGp2zjnnmNacAUy1qBKNh3so1q5dqypUqGC23AU3xEjfcbj+HT9+XK1evVpcMcqXL29aE0O4PuKaWrlypVxTZcqUMa3uU6xYMfXDDz+IO0vhwoVNa+z48aByC7/uESQ2UAXdWjywtO5X2A4XfI7fC35LsHbYrFdYp/JBsguzZ8+WRB1t2rRRU6ZMMa3x48e9m/dckm3AxewH+uGFH42zceNG0+I+27ZtC3v+ffv2OV988YWjH8imxR9+/PFHJ0+ePPLeFyxYYFrT2LBhg9OgQQPZt2zZMtPqLpG+43D9GzFihJMrVy4nf/78sq9UqVKOVjjMXn8J18dhw4Y5Wnl1SpYsKftKlCjhrF+/3ux1j6NHj8rr47M4duyYaY0P3d+UwXSZpCC7d+925s2b54waNcrp1q2bU61aNee8886T30so0cqHU7lyZad9+/by+5o1a5an92xCvGLixIlyTeNadhN9Ts8xL0VIynO6uaY9x86QZRbYGA+7du2S2Thkk4CZ1HLixAl11113qYIFC6p27drJrPwrr7xi9noPAoYLFSok67AMWMaOHSsziPChBuGyzXhNuP49/fTT4h508OBBtWPHDulfoqq1h+sjCjuuW7dObd68WVxGkJln5MiRZq976IGa0sqFuuyyy8QiR0iqgJgMpA5HIdRx48aJb/r+/fvlmkZaZvyGtPIhfuvIXoW4D/iyo7bR448/LjPBuKfmy5dPXXvtteree+9Vw4cPl1liWEsISVasFQ9WaEJIYvBNybDVbzPzH46HcANRBOlCsTl8+LC4D7zwwguqc+fO4t/sNfADfe211yT9KYDCY8mTJ4886Pv27Svbgfv8IrP+HThwQIrPgaJFi6qmTZuKP7jfZNbHPXv2iJ85wIMEQX5eXF/2nHQlIdmFUMrH3r17RfCbwyRIjx49xJ8dygdcsuA6icQHwcoHXClbtGghkxBvv/223CcSNWlCiMUqGZh8IoQkBt+UDJvlxIvBfbiBKB6M7777rurZs6c666yzpO3hhx8Wn/pZs2bJtpdA8endu3fIGJSuXbsmPPNLZv0LBgra1Vdfbbb8I9o+fv755zLAadSokWlxD1hyAGfESHYHCgUUCygYUDRwb42kfECpwG9vyJAhomxA6bDKR6Dlw6sJJkJCgYkyYCc4CSH+45uSAVcTgNlntwk3EEUAJGbUqlatalrSwE1ny5YtZssbxo8fLwNfL9x33CAr/UNgOpSy++67z7T4Q6Q+wmLVvHlzBOJJNW5YhXAduA2VDJLTCad8wPUKVhBYQ2AVgXUEkye470L5CLR8II15/vz5xeLYvXt3NXr0aHFtRdFCQtwGbn+ASgYhiSPlLRmZDUThjgSQxjEQuFV5FRsC4Nc8aNAgsaKAXLlyyTJZyEr/HMdRDzzwgMSztG7d2rR6TzR9RHxE7dq1pQJ3x44dxV3DjUJ5wdBdipDQ4N6KeA7EdSC+A3EeuO8GKx/W8mFjPnDfhlUZKUYvuugikQYNGkgbYuZwDI4lJFbg3gcqV64sS0KI//gek+GmkhFpIGozzf3999+ytMCd6vTTvXvrt912m/QFyg+sLBMnTpT2GTNmSEBloslK/9q2bSvB8pMnTzYt/hBtHzEj+uCDD8qs6IABA0TZ3Lp1q9nrDrRkEJI1gpWPzNyucCysGR988IH8jhEzB2sHrB4lS5YUKwisIYz3INGC6wTjAyRWCZ5kJIT4R0orGZEGotZ6ggxJgcCKYd23vODmm29Wt99+u8zooWov6isAbG/btk3WE0m0/evSpYvMRk6fPt20+Ecsn6GtxB2sVMaLfT1aMgiJj1BuV+GyXcH9FbFgiOdAXEdgvEdgpqu5c+cy3oNkANcMwHVECEkcvlaDdrsg36OPPqr27dsnlokjR46oo0ePyoMKZneYSOGjj9kwFOKxrj7w48dD6r///a9kTPIDDJJR6AoPVDxgLRi8/vzzz+rGG28UxQixI8jk5CYoHBTpOw7VP7g4jBkzRr3//vsZAtTxcE8EwX1EtrA+ffqoDh06yHeNzxKuUjalrVtg5rVIkSJizcF3haxgboDvxawmPX7eIwgJBMoDZqUha9askbS54awZeKbgHmGrm2OJbSg2JGeB5xTcpRBL2KRJE9PqDn7cu3nPJdkGXMx+gWJpeMlVq1aZFnfRDx85vx6ImhbH0TcYp2LFis6SJUukEF+1atUcPWg2e/3hm2++OaVf/fv3l7ZgmTZtmjnCHfQ5I37Hofpn+xMsc+fONUf4S6g+2kKGVrSy5syfP9/sdYeFCxfKuXHduIk+Z8pgukxIUnD8+HFn3bp1zowZM5x+/frJPd4+W0KJVjKc+vXrO7169ZICbcuXL3cOHTpkzkayG1u2bJHv/bzzzpNCqm6jz+055qUISXl8tWTAwgC/Wy9mF8DGjRtVmTJlMszIw8LRrFkzeV2AGS64//g9I48ZcQQ3+g1mXaL5jhPVv6wQqo+waMCKAWuLF/1HXRVYzBD3gQBzt/BjNswt/LxHEBIr8MGHpQMz2LB8wuKB9XDZq1C8FQJrR8WKFdO3WVchtUHyAMT2wO0OiQfcxo97N++5JLvgq5KBehUYqCE414tUoyDcYBlxGXDT8jIWg2Q/4GY3bdo09Z///EcCUt2CSgYh/gAlA8oGlA6kNUfmKigjobJXQcGA0gFlI1DxgJDkB/GWSJUMdzpMOiLw222oZBASPb4qGc8995z40Xs1w0CI26CqMQYkX331lWS8cQsqGYQkFgSVQ/HA7/vrr7+WJSRUvAdisqB8QMqWLStKB9aZDCK5sBOZ7du3T08E4zZUMgiJHl+VDGR8QDpCFGxCgDYhyQySCsDyhQxmyH5ToEABsyd+qGQQknyggjkUDSgfNtAcVpBwWRGRHhUKB4PNEw+yTKLuCvDKigGoZBASPb4qGbhZIxYCsz/bt283rYQkJ3hoIZUu0mai6rmbUMkgJHX47bff0mM8Al2u0B4KKBlW4YDygQx4UEbcyKpITgUucRhbQBkcNmyY6tevn9njPlQyCIkeX5UMmKGRUhazRciNziI5JJlBCl+k8kVBwtdff920ugOVDEJSH5tiFwqHDTbHerhq5Zhgg+IBhQNuV3adykfsYFzRuHFjSe5Sp04d9dFHH5k93kAlg5Do8VXJADZ/NYq8sVAOSWbatWsnNVaef/559cgjj5hWd6CSQUj2hcqHP+DzRK0kVINHhsHly5enF/71CioZhESP70oGbgioxo3AbwSAE5KswE0Kg4PAlMhuQSWDkJxHPMpH8eLFxQULsQaM+UhTMJAWH26tUDBwn8bn5DVUMgiJHt+VDOSvRh7rHj16qLFjx5pWQpILuPNdeumlUk1+586dqnDhwmaPO1DJIIRYrPKBjFeI+YC1H8pHZjEfGFBDAYHygXWIV8HOycbSpUtlwhKfkZsKRrLcl3nPJdkF35WMjz/+WNWtW1dmhnFjICQZgTvfTTfdJDnXUezPbahkEEIigboPVuGwygcUkXAFBpFq1yobWML1CuuQ7BADiXjOgQMHymQlYjFg2UFxXTcUDEAlgxB38V3JwM0RxfJww8NsMSHJCHKtI+d606ZN1cyZM02re1DJIITECp6jsHxAoHxA8YACAqUkHJjxh7JhrR9WEcEy2auc25omqLOFdfS3f//+asCAAa72nUoGIe7iu5IBbIGzVatWyUwEIcmGrfT97LPPyoPNbahkEELcBu5VeLZC4di6dasMyK3AChAOKBuI/4AUK1ZMFA+7ncj4D/T76aefVlOnThVlAu8B6YAnTJjgydiBSgYh7pIQJaNz587qlVdeUaNGjZIUoYQkE8ePH5eHLtykli1bpqpWrWr2uAeVDEKIn6CGBBQQDNyzooDA68AqHFA+oIRgHVmcIG4rIegn0tG+++67srQV2Js0aaIaNWqk/vGPf8i2F1DJIMRdEqJkILsUgrZatWol/pTxcOjQIXXgwAGzlcYFF1ygzjrrLLOVxq+//io32Ouvv16deeaZptVbou0bQLG3ChUqmC3viaZvGGxjRgx+vsi05DfR9BEPoJUrV0qqxzJlypjW+MBDFwW08HBF0Heo7yteqGQQQpIFDOytwgEFBIHodjtc8LkF916rcED5uOyyy9KVECyhhISKBwm4B5bTUkPLDWYZGL0O7WfSunXrusHNyyvwPvGsa9GiRZbvy7w/EpIJ+IH4zcaNG/GjdC6++GLTEjtNmzaVcwVK7969zV7H0YNQ584775T24sWLy3LChAlmr7dE6hvYsGGD06BBA9m3bNky0+o9kfo2YsQIJ1euXE7+/Pllnx50O/ombPb6Q6Q+Dhs2zMmdO7dTsmRJ2VeiRAln/fr1Zm/svPbaa3K++vXrmxb30edPGUyXCSE5kP379zvLly93ZsyYIffcTp06OXXq1HFKly7taAUj/d6cmZxxxhmOVjicatWqOfXq1XOuvfZatM/RgsDM4OP3apmipY2WlMnVaz4uQkgACbFkAAR/I3hNKxxxZYZo1qyZOnr0qBRNsxQsWNCsKdW8eXOZjUYmK8xIw0ULhdXQhpkWL4nUN6Tw/b//+z8JMMb6F198IRmN/CBS384991w1b9486c8PP/ygbrvtNrFmzJo1yxzhPZH6iLSyixYtEqvDjh07lFYK1A033CCWsniAlQ3n0A9U1a9fP9PqLrRkEEKyA7B0wPIBawhk165d6dtY4jkfrg6IAdHqS7Us0/KxlhVaUg7eJwk5ldPN0ncwIARz586VZTyglgEGn1Ys8DOFXycG8dblBTU6MDj1a7Acrm8gT548avfu3apv376yjWP9JLO+wU3JKjxFixaVLEvI7uE3mfVxz549omAA+AlXqVJFHmrxgNdbsmSJrNesWVOWhBBCQgNXKARhI14CBXaHDh0qE0OY2Nu+fbu4vWKyCOuLFy+WZy8m/zQttFyp5RItd2sZriUlFQxCSGgSpmTccccdsnzvvfdkGQ9//vmn+uabb07xHUVqP/jsBwfuwoKxZcsWs+Ut4foGunbtKmkFE0VmfQsGPqtXX3212fKPaPuIqq9vv/22POjiAUofHoZ4cPoZI0MIIdkVxPUhPqNGjRoSwD1jxgw0v60lvlmhGIDFwQvM6QkhASRMycBgEDceDA6jGeSG4/TTT5fZkerVq6vzzz9fXXfddelWCgwYQXDQWaFChTLNJ+4WmfUt0WSlbwhKx7777rvPtPhDpD4iMB0zYvA8atiwoViEevfubfbGBqwYOC+sImeffbZpJYQQQgghWSFhSgYyUmBWA5aGeFymMCMCFxcU9oPlAi41Ni2udXv/+++/ZWnB8RjAek1mfUs00fYNEzQPPPCAateundSO8JNIfcydO7eqXbu2FM7r2LGjGjx4sHrsscfM3tj47LPPZElXKUII8Y60+f/ImMMJISlIwpQM0LJlS1m6VVEZ7jyIuUCgMtLVWlekgwcPytICKwbS7PlJcN+Sicz61rZtW7E4TZ482bQkhnB97N69u3rwwQfV6NGjpfrryJEjJQVjLEChgWUNUMkghJDEY3QN1zCnJYT4QEKVDPhmooonCu5EyD4RNQgyA7ZqKawZy5cvlzYAV5gNGzaIC47fBPYt2QjVty5duqgvv/wy7lombhHp87NKa7DlKloQSI5sZwUKFGAlekIIIYSQOEiokoEiPcgyhSxQb775pmmNHvjrI4uFjen4+uuvJbMF3Hry5csnPvV33XWXzG5jsIwg4ltuuUXS5yJbkpdE6psFVaWRThdgkIuZeq+Jpm9wS5owYYK4IiEV4apVq0T8IlIfDx8+LG5cUCAxOQXrxaBBg1TJkiVFYgHXCJTQypUrizsfIYQQQgiJkTQDYuLQA0mYL6W4T1ZBUT89IJT/1wqFFGZDoSAUD7LowagUVcMxEBSVW7lypdnrHdH0rX///un9CpRp06aZI7whmr4F98nK3LlzzRHeEk0fbRFDKzfeeKMzf/58szfr9OjRQ87z5JNPmhbv0K+TMpguE0IIIYRETcKK8VlgxYBlAUu4qsDFKasg5SjcrooUKWJaTgVxGXC38TsWI5q+JYpk7pslUh9h0YA1CPE3uI5iBQkIrr32WkmXiwJ/XrvTsRgfIYQQQrIzCVcyAIrlwS0HLjqoyE2I38BN7corrxQXPhT0C3Rp8wIqGYSQrIAJFbgAe02ke5Pf9wMk5MiVK5fZ8g4378m8ZxKSRkJjMizIDgQmTZrkWgA4IVnh448/loBxWDC8VjAIId7w6aefJl32PjeAlT/BcWKeVSaFl0G47wwFVsuWLWu2TgVxgojXgyeED5TWUj5tlRASDUmhZJQuXVrVqVNHgnyhaBDiNx9++KEs69WrJ0tCSOrRokULSfSRXUAh1EsuuSS9fs/UqVN9mdUP4EYtX2hZo+VSNLgN6mVdc8014s1gQVr7ChUqqF9++UW2n3vuORkjWF577TVxj0WBViTqgDvt//73P7PXdZC2cJeWhVrWGqGyQUgUJIWSAaw1Y8yYMeIfT4hfYBYM9TFQ3O/WW281rYSQVAMV+8ePH2+2/AdKgZtgoD18+HD1z3/+U7aRYc/HibghWpZoWSdbUY4X1q9fb9YiM2LECLVuXdrpkdnPUrduXdWpUyepg7Rlyxb17rvvqkcffdTsTbNYIfsgvJKOHj0qnxPqJHnAuVr+peUrLSi8BZcqmF1OakSEkLAkjZKBmhmoTfDdd9/JbA0hfgFT/a5du9RVV10lRf8IIakJBqOzZ882W7Hzr3/9Sz399NNmKw0M9j/66COzdSqbNm1SFStWlFTp4UDR0KeeespspYHzLliwwGwptWbNGmkDOOe0adPSU3lv3rxZrVixQtZff/11NWzYMFkPBP+L2lMucEQLgkCylF++fPnyGWpThQP3XKQdt5/psWPHZAmWLVsmyhSsOBdccIFMAqHNgjEC0t8DFIu955570pUVl7lBS0Et3WUrDXwet2hJvoJXhCQZSaNkADtTEXxzJ8RLrKvU7bffLktCSGoCl5ulS5earYwgwUgoeeWVV8wRJ7niiitkZnzy5MmyjWfSuHHjVM2aNWU7VpAFb+DAgWrfvn2yvXLlSvX4449nmFhDHILdLlSokDr//POlDhCAkvHGG2/IeoMGDcTCEVgsFbV+cD64IAcT6r1DJk6caI44hRFaoGhkGQRrR+KJJ55Q119/fbobVKAHAxQLWJWff/55cYV6//33pV5TODA5Geo9A8RthHrfkCjqUuU3y8CxktVmrjJLQkgYkkrJaNWqlaSwxQ2DsRnED2Bu/+STT2Q90OeXEJK9KFiwYEjJn9+OI09yxx13qHbt2knBTwRdQ+F45plnVJ48ecwRJ0ERVYhVHBBHsHfvXpFgoBgAqygsXAg3f5XB8oCZ/caNG8s6FAwUqj1w4IC68cYbpdCojVOwRWURn2B555131G233SZKUjCh3jsk1PvPKniv9nMAsLyE+wwA3J3Q73CWISgfUDCQjAOKFT63UMog2L9/v3xG+L5CgYD5UO8bAitIBL43yx5a8OXjw2LgHiHRglRrycT06dOR+s3RN0nn6NGjppUQb9APb0c/ZJ18+fI5v/76q2n1nrRfX2pgukxI0lOkSBHnkUceMVvxsWvXLnkWnXXWWc6dd95pWjOCZxSOCSUoJhqKunXrOtWrV5f1m266yRk8eLAcv3btWrkHYX3JkiWyPxJvvfWWHG+LlGL95ZdflvVY0ecIppYWtF+ODXNYBq688kp57WDBZxeKGjVqOIMGDTJbaf1+6qmnzFbWuOeeexytWJmt2NF9CEcbLVA27PtabJZhA/jMKQnJ8SRFnYxgqlSpIn6nqJmB2hmEeAVm0uAmVatWrQx+0V7jZk52r0nGewQhoShatKhkmMIseDBdunQxaxmBC1Tr1q3NVkYQgIz01k8++aS4OYVi9+7dsoTFo3bt2lIcFEkkTj/9dHXppacmZEJcxsMPP4zfFe4DasOGDapNmzYSV1C8eHHVp08fqdUTLbB2tG3bVt73Lbfcon7++eeQhUnDvX9YPuBFYAlxb4KSgZsjKqL+GOp+YD8DgPcM9ybEZuBUwQVw4XYGVyU825EuHMcgoB2WZK3Myb5o6du3r2SVgkWocOHCpjUjCBwPl3EMbnD2swrxvoNBDAZ8tpBxC4qGfB5aToH3TELSSCp3KYu9IQwZMiQ94I0QL4C/Lvx/bRAhISR7gkF/KAlXm+nVV18VBQMZjhA/EG7gj+BkiB2sYlB9+eWXh1QwQMOGDWWJAS4KgJYpU0ZSZ7/33nsyYMZAOytAQfjPf/4jihDcrEIpGCDUe4dEUZsqYoCF/QwgAAN+fAbBCgbAa0KpgisVkm6gzgXYvn27Wr16taxHw+DBg0VhQ2B8OAUD4P0Fv2crKHCYBXZowWdxl5YvtYQPEiGEpAGNOxlp0qQJZgKcfv36mRZC3Gf58uXO8OHDHa1smBZ/SPv1pQamy4QkPW65Sx06dMi58MILnX//+9+yfc011zitW7eW9XCsX79enll//vmnaQlPuXLlnIIFCzqdOnWS7YULF8r/FihQwPnwww+lLVrs/0ImT55sWmNHn8eCqqQIbm6uBe3ItFTUHBYWHKsVB7MVHfifMWPGmK3IjBgxQv4HrmErV65Ml4MHD5ojso4+XzhssF4BLe214Nh70RAOc0pCcjxJ+2PYsmWLc8YZZzh58+Z1du/ebVoJyR6YZ1FKYLpMSNLjlpLRo0cPp06dOmbLcT755BMZ1M6ePdu0hCbayYrHHntMzocYRMu5554rikcslCxZUp6Xv//+u2mJHfnRp4HUWtLPQImkBGGwn1Vy5cqVJSWjePHip/QLMnr0aHNE1tH/H4qztCB63b4GCqGc9C0LgzklITmepIzJsMBMjSxTSLEX6DNKSKoThf9v0pDM9whCAsGlmkI/Lde44YYbJDOjzVoVD5HuTV7cD+A6Fc7Nyy8ivO+iWlDI4//JVgR4zyQkjaRWMpCqDzEZuHkSkp2I9CBPJvjAJCR5QYVtBFnPnTtXUu/GS6R7U3a9H7h5T+Y9k5A0klrJICS74uYDzWt4jyAkeUHWqzlz5mQpaJoQQvyASgYhCYBKBiGEEEKyM0mZwpYQQgghhBCSulDJIIQQQgghhLgKlQxCCCGEEEKIq1DJIIQQQgghhLgKlQxCCCGEEEKIq1DJIIQQQgghhLgKlQxCCCGEEEKIq1DJIIQQQgghhLgKlQxCCCGEEEKIq1DJIIQQQgghhLiIUv8f37HzerM/7MkAAAAASUVORK5CYII="/>
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
