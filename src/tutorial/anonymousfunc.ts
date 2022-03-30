export const tutorial_anonymousfunc = {
	id: "anonymousfunc",
	title: "Anonymous Functions",
	sections: [
		{
			content: `
			<p>
			An anonymous function, also called a lambda function, is a function
			without a name. It is a value of type Function. We have already seen
			that it is possible to assign functions to variables. That's what we
			mostly do with anonymous functions. We can also use anonymous functions
			as a return value from a function, or pass them as a parameter into
			another function. An anonymous function is created as follows:
			<tscript>
				var square = function(x)
				{
					return x^2;
				};
			</tscript>
			The variable <code>square</code> now contains a function with a single
			parameter, which returns the square of its parameter value. Note that we
			could have achieved a very similar effect by declaring a named function:
			<tscript>
				function square(x)
				{
					return x^2;
				}
			</tscript>
			However, we will see that anonymous function can have advantages over
			named functions, and that they are capable of doing things regular
			functions cannot do.
			</p>

			<h2>Event Handling</h2>
			<p>
			Anonymous function are well suited for being passed into other
			functions, mostly because of improved code locality. This means that
			the function appears in the code exactly where it is used. Event
			handling is one prominent example. Consider the following click handler:
			<tscript>
				function drawDot(event)
				{
					canvas.setFillColor(0, 0, 0);
					canvas.fillCircle(event.x, event.y, 5);
				}

				# ...lots of other code...

				setEventHandler("canvas.mousedown", drawDot);
				enterEventMode();
			</tscript>
			If the comment is replaced with hundreds of lines of code then it
			becomes hard to judge the effect of the call to
			<code>setEventHandler</code>, simply because we first need to locate the
			function <code>drawDot</code>. Of course, we could (manually) try to
			make sure that the function is close, but code may evolve in
			unpredictable ways, so that's not always realistic, in particular with
			many programmers in a team. When passing an anonymous function directly
			as a parameter, the problem disappears automatically:
			<tscript>
				setEventHandler("canvas.mousedown", function(event)
				{
					canvas.setFillColor(0, 0, 0);
					canvas.fillCircle(event.x, event.y, 5);
				});
				enterEventMode();
			</tscript>
			There are of course applications other than event handling where it can
			make sense to pass a function as a parameter into another function. All
			of these cases profit the same way from the ability to pass the function
			directly as a value, instead of referencing it by name.
			</p>

			<h2>Enclosing Variables</h2>
			<p>
			A very important property of anonymous functions is that they can be
			parameterized. We are able to dynamically create new functions, which
			are parameterized by variables. This is analogous to parametric families
			of functions in mathematics. Think of the family of (affine) linear
			functions of the form f(x) = m·x + b. They have a variable, <i>x</i>,
			and two parameters <i>m</i> and <i>b</i>. An attempt to resemble the
			same concept in code could look like this:
			<tscript>
				var m, b;
				var linear_func = function(x)
				{
					return m * x + b;
				};
			</tscript>
			That works to some extent, but it has two drawbacks:
			<ul>
				<li>If we return <code>linear_func</code> from a function then the
					variables <code>m</code> and <code>b</code> are out of scope.
					Therefore, the construction only works if <code>m</code> and
					<code>b</code> are global variables.</li>
				<li>We cannot really create multiple instances of the function,
					since there is only one instance of the variables holding the
					parameters.</li>
			</ul>
			Both problems can be solved by turning the function into a class, with
			objects holding the parameters, like this:
			<tscript>
				class LinearFunction
				{
				public:
					constructor(slope, offset)
					{
						m = slope;
						b = offset;
					}
					function eval(x)
					{
						return m * x + b;
					}
				private:
					var m, b;
				}
			</tscript>
			It is used as follows:
			<tscript>
			var linear_func = LinearFunction(7, 2);   # function f(x) = 7·x+2
			print(linear_func.eval(5));     # computes 7*5+2, hence prints 37
			</tscript>
			Importantly, we can now create multiple instances of linear functions
			with different (and actually independent) parameters, simply by creating
			multiple objects.
			</p>
			<p>
			The solution is fine as long as calling the <code>eval</code> method
			works in the corresponding context. However, think of sorting an array
			according to a custom criterion, passed as an argument to
			<code>Array.sort(compare)</code>. Then <code>compare</code> needs to be
			a proper function, not an object with an <code>eval</code> method. If
			such a comparison function shall depend on parameters, how to resolve
			the situation?
			</p>
			<p>
			An anonymous function can do exactly that. Besides not having a name, an
			anonymous function can hold parameter values, just like an object holds
			attributes. These attributes are declared in square brackets:
			<tscript>
				var m=7, b=2;
				var linear_func = function[m, b](x)
				{
					return m*x + b;
				};
			</tscript>
			We say that the variables <code>m</code> and <code>b</code> are
			<i>enclosed</i> in the function. What really happens is that the
			variables are <i>copied</i> into the function. The best way to think
			about it is that there are attributes of the same names inside of the
			function, so the names <code>m</code> and <code>b</code> inside of the
			function refer to the attributes, not to the variables outside of the
			function (as it may seem). This also means that if the values of the
			variables change to <code>m=3</code> and <code>b=1</code> later on then
			<code>linear_func</code> still represents the function f(x) = 7·x + 2,
			not f(x) = 3·x + 1.
			One more difference to the class approach is that the values of the
			attributes enclosed in an anonymous function cannot be modified after
			initialization.
			</p>
			<p>
			The notation of enclosing variables is really only syntactic sugar for
			an actual attribute declaration with initialization. In fact, the
			following works:
			<tscript>
				var a=4;
				var linear_func = function[m=a+1, b=a^2](x)
				{
					return m*x + b;
				};
			</tscript>
			Here it is apparent that it is not the variable <code>a</code> which is
			enclosed, but that two attributes <code>m</code> and <code>b</code> are
			created and initialized to arbitrary values. In that sense,
			<code>function[m, b](x)</code> is short syntax for
			<code>function[m=m, b=b](x)</code>, which means that <code>m</code> and
			<code>b</code> are attributes, which happen to get initialized to the
			values of the variables of the same names from the outside scope.
			</p>
			<p>
			As indicated before, <code>linear_func</code> can be called like a
			normal function:
			<tscript>
				var linear_func = function[m=7, b=2](x)
				{
					return m*x + b;
				};
				print(linear_func(5));   # prints 37   (= 7*5+2)
			</tscript>
			</p>

			<div class="tutorial-exercise">
			<p>
			Create an empty array <code>var functions = [];</code>. Run through a
			for-loop over the range <code>0:10</code> and inside of the loop body,
			add an anonymous function to the array representing the mathematical
			function f(x) = m·x + 10, where <i>m</i> is the loop counter. In other
			words, the array shall contain 10 functions, representing the
			mathematical function 0·x + 10, 1·x + 10, 2·x + 10, ..., 9·x + 10.
			</p>
			</div>
			`,
			correct: `
			var functions = [];
			for var m in 0:10 do
			{
				functions.push(function[m](x)
				{
					return m*x + 10;
				});
			}`,
			tests: [
				{
					type: "js",
					code: `let program = parse(code).program;
					if (! program) return "Failed to parse the program code.";
					if (! hasStructure(program, "loop;")) return "Use a loop to solve the problem!";
					if (isRecursive(program)) return "Please don't use recursion.";`,
				},
				{
					type: "call",
					code: "functions[0](2);",
				},
				{
					type: "call",
					code: "functions[1](5);",
				},
				{
					type: "code",
					code: "for var f in functions do for var x in 3:5 do print(f(x));",
				},
			],
		},
		{
			content: `
			<p>
			What we have effectively done in the exercise is to create 10 different
			functions, although the keyword <code>function</code> appears only once
			in the code. In that sense, the ability to create parameterized
			functions greatly extends the scope of the data type <code>Type</code>,
			since with anonymous functions, there is a potentially indefinite number
			of function values in a program. More and more values of type function
			can come into existence, for example in a loop, or when reacting to an
			event at the discretion of the user.
			</p>

			<h2>Wrap-up</h2>
			<p>
			We have seen anonymous functions and their applications. One application
			is avoiding indirection or removing the need to refer to a function by
			name, since it can be passed into or returned from a function directly
			as a value. This generally improves code locality.
			</p>
			<p>
			The other capability of anonymous functions is that they can be
			parameterized. This means that an anonymous function can have
			attributes that work pretty much like private attributes of an object.
			This way, an arbitrary number of function instances can be created.
			</p>
			`,
		},
	],
};
