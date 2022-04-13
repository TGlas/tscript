export const tutorial_calculations = {
	id: "calculations",
	title: "Calculations",
	sections: [
		{
			content: `
			<p>
			We have used strings (text) and numbers for various purposes.
			Of course, numbers become far more useful if we can perform
			calculations with them. After all, we are aiming to program a
			computer, so let's make it compute something.
			</p>
			<h3>Operators</h3>
			<p>
			Performing calculations is simple and intuitive. We can simply
			write them out:
			<tscript>
			print(20 + 15);   # prints 35
			print(6 * 7);     # prints 42
			</tscript>
			TScript uses the following operators to express arithmetic
			operations:
			</p>
			<p>
			<table class="nicetable">
			<tr><th>operator</th><th>meaning</th></tr>
			<tr><td>+</td><td>addition</td></tr>
			<tr><td>-</td><td>subtraction</td></tr>
			<tr><td>*</td><td>multiplication</td></tr>
			<tr><td>/</td><td>division</td></tr>
			<tr><td>//</td><td>integer division</td></tr>
			<tr><td>%</td><td>modulo (remainder of the integer division)</td></tr>
			<tr><td>^</td><td>power</td></tr>
			</table>
			</p>
			<p>
			Let's look at further examples:
			<tscript>
			print(100 - 1);   # prints 99
			print(23 / 7);    # prints 3.2857142857142856
			print(23 // 5);   # prints 3
			print(23 % 5);    # prints 2 (remainder of 23 // 3)
			print(7^2);       # prints 49
			</tscript>
			</p>
			<h3>Notation</h3>
			<p>
			Of course, numbers don't need to be integers. We can use a sign, a
			decimal point, and even an exponent to denote numbers in scientific
			notation:
			<tscript>
			var my_pi = 3.14159;      # decimal point
			var minus_2 = -2;         # negative number
			var h = 6.62607015e-34;   # Planck's constant
			</tscript>
			</p>
			<h3>Adding strings</h3>
			<p>
			In contrast to numbers, dividing two strings does not make any sense
			and hence results in an error message. However, strings can be added,
			resulting in concatenation. Moreover, arbitrary values can be added
			to strings, as follows:
			<tscript>
			var side = 5;
			print("The side length of the square is " + side + ".");
			</tscript>
			</p>
			<h3>Calculations with Variables</h3>
			<p>
			Like most things in programming, calculations are much more powerful
			when involving variables. Consider the following program:
			<tscript>
			var side = 5;
			var circumfence = 4 * side;
			var area = side^2;
			print("The side length of the square is " + side + ".");
			print("The circumfence of the square is " + circumfence + ".");
			print("The area of the square is " + area + ".");
			</tscript>
			Why should we do that? What is wrong with the following?
			<tscript>
			print("The side length of the square is 5.");
			print("The circumfence of the square is 20.");
			print("The area of the square is 25.");
			</tscript>
			Well, what if we ever need to change the side length? Changing only a
			single variable, it is ensured that all three measures of size of a
			square are kept consistent. Also, pre-calculating values is often bad
			style. This is because round-off artifacts can accumulate, while the
			computer's internal calculations tend to be more precise than what
			programmers do manually (or with a calculator).
			</p>
			<h3>Mathematical Constants and Functions</h3>
			<p>
			Reconsider the problem of drawing a yellow sun on blue background onto
			the canvas. As a bonus requirement, we want the sun to be horizontally
			centered on the canvas. We start as follows:
			<tscript>
			var center = canvas.width() / 2;    # horizontal center
			canvas.setFillColor(0.5, 0.5, 1);   # light blue
			canvas.clear();                     # fill the entire canvas
			canvas.setFillColor(1, 1, 0);       # yellow
			canvas.fillCircle(center, 100, 40); # ball (the sun)
			</tscript>
			Let's add a few rays to our sun. How to do that? Well, just draw a few
			yellow lines, right? But to which coordinates? We will use the
			mathematical functions <i>sin</i> and <i>cos</i> to calculate
			coordinates. To this end, note that for mathematical functions, angles
			are always specified in <i>radians</i> (in contrast to degrees used by
			the turtle). Casting a ray in a given angle <code>alpha</code>
			hence works as follows:
			<tscript>
			var alpha = 10;                             # ray direction (angle in degrees)
			var length = 90;                            # ray length from the center
			var radians = alpha / 180 * math.pi();      # turn alpha into radians
			var x = length * math.cos(radians);         # position relative ...
			var y = length * math.sin(radians);         # ... to the center
			canvas.setLineColor(1, 1, 0);               # yellow
			canvas.setLineWidth(3);                     # a bit wider
			canvas.line(center, 100, center+x, 100+y);  # draw the ray!
			</tscript>
			That's quite some calculations.
			Give it a try, and play around with the angle. Combining variables
			and calculations is a powerful technique. For now, in order to obtain
			additional rays, we would need to copy and paste the program a number
			of times, paying attention not to declare variables multiple times.
			We will get to know a better solution soon.
			</p>
			<p>
			In the above code, we have used <code>math.pi();</code>
			to obtain a (rather) precise representation of the mathematical
			constant&nbsp;&#x3C0;. This is analogous to calling
			<code>canvas.width()</code>. Open the documentation and
			search for "math functions" in order to get an overview of the
			available functions. Besides trigonometric functions there are various
			roots and other powers, logarithms, absolute value, rounding, sign, and
			a few more.
			</p>
			<p>
			<div class="tutorial-exercise">
			It is time to do your own calculation. We will combine it with a bit
			of geometry using the turtle. Draw a right-angled triangle as follows:
			<tscript do-not-run>
			turtle.move(60);
			turtle.turn(90);
			turtle.move(60);
			turtle.turn(135);
			var len;
			turtle.move(len);
			</tscript>
			Of course, the variable needs to be initialized with an appropriate
			distance for the turtle to travel which is the length of the Hypotenuse.
			This amounts to applying Pythagoras. Hint: The function
			<code>math.sqrt(x);</code> computes the square root of
			its parameter.
			</div>
			</p>
			`,
			correct: `
			turtle.move(60);
			turtle.turn(90);
			turtle.move(60);
			turtle.turn(135);
			var len = math.sqrt(60^2 + 60^2);
			turtle.move(len);
			`,
		},
		{
			content: `
            <h2>Composite Assignment Operators</h2>
            <p>
            In many situation we do not really need complex calculations, but instead
            we wish to apply a single algebraic operation to modify an existing
            value. For example, given a variable <i>n</i>, we may wish to increment
            its variable. This can be achieved with an assignment of the pretty
            trivial calculation <i>n+1</i> on the right-hand side:
            <tscript do-not-run>
            n = n + 1;
            </tscript>
            This situation is so common that there is a special shorthand notation,
            known as composite assignment:
            <tscript do-not-run>
            n += 1;
            </tscript>
            The same works for other operators. For example, the value can be
            doubled:
            <tscript do-not-run>
            n *= 2;
            </tscript>
            This is really nothing but syntactic sugar for the longer form
            <code>n = n * 2;</code>. However, once you get used to it,
            it is not only shorter, but it actually improves readability of code.
            </p>

            <h2>Wrap-Up</h2>
            <p>
			You can now use TScript as an extended calculator. Calculations can
			involve numbers and variables. Beyond the elementary arithmetic
			operators, TScript offers a range of built-in mathematical functions.
            </p>
            `,
		},
	],
};
