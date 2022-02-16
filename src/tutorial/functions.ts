export const tutorial_functions = {
	id: "functions",
	title: "Functions",
	sections: [
		{
			content: `
			<p>
			In mathematics, a function can represent an arbitrary calculation. More
			concretely, it is the function rule that expresses the calculation, while
			the function also has a name. Giving it a name makes it easy to refer to
			the function rule, and hence it makes the calculation easily reusable.
			</p>
			<p>
			In programming, the concept of a function is similar, but more general.
			It represents a reuable piece of program code, or program, for short.
			The code may perform a mathematical calculation, and hence represent a
			mathematical function. It may equally well go beyond a calculation and
			instead perform a complex drawing operation on the canvas, involving
			loop and conditional statements. We have actually already encountered a
			few functions provided by TScript: <code>print</code> and
			<code>alert</code>, mathematical functions like <code>math.sin</code>
			and <code>math.sqrt</code>, as well as the various turtle and canvas
			commands. By writing functions ourselves, we can define our own commands,
			which are composed of elementary commands provided by the programming
			language.
			</p>

			<h2>Mathematical Functions</h2>
			<p>
			Let's start with a mathematical function like
			<i>f(x) = x<sup>2</sup> + 3x + 2</i>. This function has a name
			(it is called <i>f</i>) and a function rule or expression
			<i>x<sup>2</sup> + 3x + 2</i> representing a calculation. We already know
			how to perform the calculation programmatically:
			<code>x^2 + 3*x + 2</code>. Binding the calculation to the name <i>f</i>
			works as follows:
			<tscript>
			function f(x)
			{
				return x^2 + 3*x + 2;
			}
			</tscript>
			This is a bit more text than in the mathematical definition, but it is
			still rather close. We see two new keywords: <code>function</code> and
			<code>return</code>.
			</p>
			<p>
			Before we dive into the details, let's give it a try. Copy the above code
			over into the editor and print a few values, like <i>f(0)</i>,
			<i>f(5)</i>, <i>f(-1)</i> and <i>f(0.5)</i> using <code>print</code>:
			<tscript>
				print(f(5));
			</tscript>
			You should see the correct result, namely
			<i>f(5) = 5<sup>2</sup> + 3·5 + 2 = 42</i>.
			</p>
			<p>
			Let's have a closer look at what just happened:
			<ol>
			<li>First, we have <i>declared</i> a new function with the name
				<code>f</code>. This is conceptually similar to declaring a variable.
				No calculation is done at this point. We have only defined a function
				rule and made it known to TScript under a name.</li>
			<li>Inside of the <code>print</code> statement, the function is
				<i>called</i> or <i>invoked</i>. Similar to control structures like
				loops and conditional statements, this has the effect that the
				program continues at a different position, namely inside of the
				function body.</li>
			<li>Before the function body starts to execute, the function's parameters
				are initialized. Our function has a single parameter called <i>x</i>.
				Technically speaking, <code>x</code> is nothing but a variable. Since
				we have called the function as <code>f(5)</code>, the variable is
				initialized to the value <i>5</i>. The effect is the same as if we
				would write <code>var x = 5;</code> &mdash; with the decisive
				difference that we gain a lot of flexibility, since we can easily
				call the function multiple times with different parameter values.
				</li>
			<li>It is finally time for the program inside of the function to execute.
				The program consists of a single command, which is a
				<code>return</code> statement. It tells the computer two things: it
				shall return from the function, and it shall return a specific value
				to the caller. This return value can be a simple value like
				<code>42</code>, <code>"Hello World!"</code> or <code>true</code>, or
				it can be the result or a calculation, as it is the case here.</li>
			<li>The function is left and the control flow is returned to the point
				from where the function was invoked. The result of calling the
				function is the value returned by the function. We can think of this
				process as replacing the function call <code>f(5)</code> with the
				returned value, in this case <i>42</i>. This is no magic, but exactly
				what we would expect from a mathematical function, so that we can
				perform further calculations from there onwards, like in
				<i>f(5) + 7</i>, which would yield <i>49</i>.</li>
			<li>This value is then passed on to the <code>print</code> function as a
				parameter. The mechanisms is exactly the same as when calling our own
				function <code>f</code>. Of course, <code>print</code> is not a
				mathematical function which takes one or multiple arguments and
				returns the result of a calculation. It is a function as used in
				programming most of the time, namely an arbitrary piece of program.
				It outputs the value as a message in the message area and then
				returns to the caller.</li>
			</ol>
			In effect, the effect of calling a function is the same a copying the
			code inside of the function body to the location where the function was
			called. That may look like this:
			<tscript>
			var x = 5;
			print(x^2 + 3*x + 2);
			</tscript>
			Like in math, the benefit of using a function is that we no not need to
			write out the formula each time we want to perform the calculation. This
			makes the code inside of the function <i>reusable</i>. Importantly, we
			can turn this argument around: whenever we aim to reuse a piece of code,
			we can simply turn it into a function and invoke that function from
			multiple locations in our program.
			</p>
			<div class="tutorial-exercise">
			<p>
			Create a function <code>cube(x)</code>. The function shall implement the
			mathematical function rule <i>cube(x) = x<sup>3</sup></i>.
			</div>
			`,
			correct: `
				function cube(x)
				{
					return x^3;
				}
				`,
			tests: [
				{
					type: "call",
					code: "cube(0);",
				},
				{
					type: "call",
					code: "cube(1);",
				},
				{
					type: "call",
					code: "cube(5);",
				},
				{
					type: "call",
					code: "cube(-2.5);",
				},
			],
		},
		{
			content: `
			<h2>Functions as Sub-Programs</h2>
			<p>
			Most functions in programming go considerably beyond calculations.
			However, we will stay within the math domain for another moment. In the
			previous unit we had used a hypothetical test <code>isPrime(n)</code> for
			a number being prime or not. We are now in the position to implement such
			a test.
			</p>
			<p>
			First of all, a positive integer <i>n</i> is prime if it is divisible by
			exactly two numbers, namely by 1 and by itself. The outcome of the test
			is either that the number is prime or not. How do we return that
			information from a function? Recall that we would like to use the result
			in a condition: <code>if isPrime(n) then [...]</code>, and that a
			condition results in a boolean value. In other words, the answer to the
			question <code>isPrime(11)</code> should be <code>true</code>, while the
			answer to the question <code>isPrime(12)</code> must be <code>false</code>.
			</p>
			<p>
			Let's implement this into a function. A pretty naive implementation is to
			try out all numbers in the range <code>2:n</code> and check whether
			<i>n</i> is divisible by one of them. If that's the case then <i>n</i> is
			not prime. This translates into the following program code:
			<tscript>
			function isPrime(n)
			{
				for var k in 2:n do
				{
					if n % k == 0        # test whether n is a multiple of k
					then return false;   # if so, then n is not prime
				}
				return true;             # n passed all tests and it hence prime
			}
			</tscript>
			With this function in place we can finally see out loop from the previous
			section in action:
			<tscript>
			var counter = 0, n = 2;
			while counter < 100 do
			{
				if isPrime(n) then
				{
					print(n);
					counter += 1;
				}
				n += 1;
			}
			</tscript>
			Running this code prints the first 100 primes.
			</p>

			<h3>Drawing</h3>
			<p>
			In a sense, the <code>isPrime</code> function is still quite similar to
			our initial mathematical function example, in the sense that it takes a
			single argument and returns a value based on a calculation. The main
			difference is that the calculation is more complicated, involving
			multiple commands and a loop. Let's make the concept even more general
			and move on to function that do not perform calculations. Say, we want to
			implement a function that draws a regular polygon with the turtle. Such a
			polygon has two parameters: the number of edges, and the length of each
			edge. For example, we may draw a regular triangle, a square, or a
			hexagon, all with the same function. Its <i>signature</i> shall look like
			this: <code>function polygon(sides, length)</code>. It can then be called
			to draw a large triangle <code>polygon(3, 80);</code>, a tiny square
			<code>polygon(4, 6);</code> or a polygon with 100 edges, which is so
			round that it looks like a sphere: <code>polygon(100, 3);</code>
			</p>
			<p>
			What needs to be done to implement such a function? Inside of the
			function, we need to draw <code>sides</code> lines using the already
			familiar <code>turtle.move</code> function. Afterwards we need to turn.
			After <code>sides</code> turns we shall have performed a full rotation of
			3606deg;. In other words, we need a loop with with following commands
			inside:
			<tscript>
			function polygon(sides, length)
			{
				for 0:sides do
				{
					turtle.move(length);
					turtle.turn(360 / sides);
				}
			}
			</tscript>
			Calling this function results in triangles, squares, hexagons and even
			(approximate) circles being drawn. Give it a try!
			</p>
			<h3>Missing Return Values</h3>
			<p>
			The <code>polygon</code> function does not contain a <code>return</code>
			statement. The statement is not needed, for two reasons: First of all,
			the function does not need to return a value. Second, the function
			returns at the end of its function body. If we would like it to return
			early then we can use a <code>return</code> command <i>without</i> a
			value. It leaves the function body immediately, just like a
			<code>break</code> command aborts a loop. However, what happens if we
			maybe forgot that the <code>polygon</code> function does not return a
			value, and we try to use that value anyway? For example, we could output
			that non-existing value using <code>print</code>:
			<tscript>
				print(polygon(3, 80));
			</tscript>
			We should see the message <i>null</i>. That makes sense, since we
			introduced the special value <code>null</code> with the meaning
			"no defined value". A function that does not return anything or even
			lacks a return statement entirely implicitly returns <code>null</code>.
			In other words, we could always add the command
			<tscript>
				return null;
			</tscript>
			at the end of each function without changing its behavior.
			</p>
			<h3>Drawing Bugs</h3>
			<p>
			The same concept can be applied to the canvas. Consider the following
			code for drawing a little bug at position (x, y):
			<tscript>
				var x=100, y=100;
				canvas.setLineColor(0.3, 0.2, 0.1);
				canvas.line(x-15, y, x+15, y);
				canvas.line(x-14, y-8, x+14, y+8);
				canvas.line(x-14, y+8, x+14, y-8);
				canvas.setFillColor(0.5, 0.4, 0.3);
				canvas.fillCircle(x, y, 10);
				canvas.fillCircle(x, y-10, 7);
			</tscript>
			If we want to draw 10 bugs then we can simply add a loop around the code:
			<tscript>
				for var k in 0:10 do
				{
					var x=100+40*k, y=100;
					canvas.setLineColor(0.3, 0.2, 0.1);
					canvas.line(x-15, y, x+15, y);
					canvas.line(x-14, y-8, x+14, y+8);
					canvas.line(x-14, y+8, x+14, y-8);
					canvas.setFillColor(0.5, 0.4, 0.3);
					canvas.fillCircle(x, y, 10);
					canvas.fillCircle(x, y-10, 7);
				}
			</tscript>
			However, what if we want three bugs to be at arbitrary positions, say,
			(100, 100), (200, 30), and (240, 170)? At this point we should move
			the code for drawing the bug into a function, which can then be called
			three times with different parameter values. Moreover, when we need to
			draw a fourth bug later on in the same program then we can conveniently
			call the function again, without copying the actual drawing code. Hence,
			we gain a lot of flexibility over the loop approach.
			</p>
			<div class="tutorial-exercise">
			Implement the function <code>bug(x, y)</code>, which draws the bug at the
			given (arbitrary) position (x, y). You can copy the above drawing code
			into the function body.
			</div>
			`,
			correct: `
				function bug(x, y)
				{
					canvas.setLineColor(0.3, 0.2, 0.1);
					canvas.line(x-15, y, x+15, y);
					canvas.line(x-14, y-8, x+14, y+8);
					canvas.line(x-14, y+8, x+14, y-8);
					canvas.setFillColor(0.5, 0.4, 0.3);
					canvas.fillCircle(x, y, 10);
					canvas.fillCircle(x, y-10, 7);
				}
				`,
			tests: [
				{
					type: "call",
					code: "bug(0, 0);",
				},
				{
					type: "call",
					code: "bug(100, 100);",
				},
				{
					type: "call",
					code: "bug(120, 180);",
				},
			],
		},
		{
			content: `
			<p>
			The above <code>bug</code> function is a prototypical example of a
			function in programming. Its characterizing property is not that it
			performs a calculation, but rather that it performs a well-defined and
			reusable sub-task. When drawing a scene with multiple bugs, or when
			creating an animation with multiple stages, then we can reuse the same
			code over and over. At some point we may wish to add more flexibility,
			like the ability to define a heading direction or different colors. This
			can be achieved by adding more parameters to the function. Let's turn it
			into a super bug function!

			<h2>Optional Parameters and Default Values</h2>
			<p>
			The following extended bug-drawing function uses the canvas functions
			<code>canvas.shift</code> and <code>canvas.rotate</code> to draw a bug in
			an arbitrary position and orientation. It also allows us to specify the
			colors of body and legs in terms of RGB-values:
			<tscript>
				function bug(x, y, angle, body_r, body_g, body_b, leg_r, leg_g, leg_b)
				{
					canvas.shift(x, y);                            # translate canvas
					canvas.rotate(angle);                          # rotate canvas
					canvas.setLineColor(leg_r, leg_g, leg_b);      # leg color
					canvas.line(-15, 0, 15, 0);
					canvas.line(-14, -8, 14, 8);
					canvas.line(-14, 8, 14, -8);
					canvas.setFillColor(body_r, body_g, body_b);   # body color
					canvas.fillCircle(0, 0, 10);
					canvas.fillCircle(0, -10, 7);
					canvas.rotate(-angle);                         # transform coordinates
					canvas.shift(-x, -y);                          # back to original
				}
			</tscript>
			This function adds a lot of flexibility, however, at the price of being
			cumbersome to invoke. The following two calls draw our original bug at
			position (100, 100) and a ladybug-like red bug with black legs oriented
			towards the right at position (200, 0):
			<tscript>
				bug(100, 100, 0, 0.5,0.4,0.3, 0.3,0.2,0.1);
				bug(200, 100, math.pi()/2, 1,0,0, 0,0,0);
			</tscript>
			The apparent problem with this approach is that there are too many
			parameters to make sense of. When revisiting such code after half a year
			or even after a few days, we will have forgotten which numbers mean what.
			At which position do we find the angle? Which parameters belong together
			to form a single color? Looking only at the function calls, who is to say
			that these are specifying colors at all? There are two remedies to this:
			using data structures (e.g., for encoding a position or a color), and
			default parameters. We will look into data structures in the next unit.
			For now, we will make our lives easier by making rarely used parameters
			optional. This works by defining <i>default values</i> for parameter
			values, as follows:
			<tscript>
				function bug(x, y, angle=0, body_r=0.5, body_g=0.4, body_b=0.3, leg_r=0.3, leg_g=0.2, leg_b=0.1)
				{
					canvas.shift(x, y);                            # translate canvas
					canvas.rotate(angle);                          # rotate canvas
					canvas.setLineColor(leg_r, leg_g, leg_b);      # leg color
					canvas.line(-15, 0, 15, 0);
					canvas.line(-14, -8, 14, 8);
					canvas.line(-14, 8, 14, -8);
					canvas.setFillColor(body_r, body_g, body_b);   # body color
					canvas.fillCircle(0, 0, 10);
					canvas.fillCircle(0, -10, 7);
					canvas.rotate(-angle);                         # transform coordinates
					canvas.shift(-x, -y);                          # back to original
				}
			</tscript>
			Copy this code into the editor before you proceed.
			</p>
			<p>
			A parameter with a default value does not need to be specified when
			calling the function. Since the position (x, y) does not have default
			values, these parameters must always be specified. This allows us to
			invoke the function as follows:
			<tscript>
				bug(100, 100);                              # "default" bug
				bug(150, 100, math.pi()/2);                 # rotated bug
				bug(200, 100, math.pi()/2, 1,0,0);          # in red
				bug(250, 100, math.pi()/2, 1,0,0, 1,0,1);   # in red with pink legs
			</tscript>
			This is nice! If we don't want to then we don't need to override the
			defaults, but we do have the option to change then when we need to.
			</p>
			<p>
			What if we want the last bug, but in its default orientation? Can we
			simply drop the third parameters from the call, i.e., do the following?
			<tscript>
				bug(250, 100, 1,0,0, 1,0,1);
			</tscript>
			Yes sure, but the result may be a surprise: we have drawn a blue bug with
			green legs, and it does not point upwards! That's because the parameters
			are <i>interpreted</i> in order: our grouping with spaces is ignored, the
			first <i>1</i> becomes the angle (in radians), the numbers 0,0,1 specify
			the body color (blue), and the remaining value 0,1 are the red and green
			components of the leg color. Only the last parameter <code>leg_b</code>
			gets its default value of 0.1 assigned.
			</p>
			<p>
			To solve this problem, TScript allows to specify which values belong to
			which parameters. For example, we can draw a default bug any only change
			the leg color to pink, as follows:
			<tscript>
				bug(100, 100, leg_r=1, leg_g=0, leg_b=1);
			</tscript>
			In a function call, there are two types of parameters: values, and
			name=value pairs. The former are called <i>positional</i> parameters, the
			latter are <i>named</i> parameters. This way, we are able to specify
			exactly where we want to deviate from the defaults. Also, this greatly
			improves readability, since now it is clear that the numbers 1,0,1
			specify the leg color, and we will be able to understand this function
			call even after years.
			</p>
			<div class="tutorial-exercise">
			Call the bug function using named parameters to draw the following three
			bugs:
			<ul>
			<li>a bug with red body (color 1,0,0) at position (100, 100),</li>
			<li>a bug with red legs (color 1,0,0) at position (200, 100),</li>
			<li>a default bug facing downwards at position (300, 100).</li>
			</ul>
			</div>
			`,
			correct: `
			function bug(x, y, angle=0, body_r=0.5, body_g=0.4, body_b=0.3, leg_r=0.3, leg_g=0.2, leg_b=0.1)
			{
				canvas.shift(x, y);                            # translate canvas
				canvas.rotate(angle);                          # rotate canvas
				canvas.setLineColor(leg_r, leg_g, leg_b);      # leg color
				canvas.line(-15, 0, 15, 0);
				canvas.line(-14, -8, 14, 8);
				canvas.line(-14, 8, 14, -8);
				canvas.setFillColor(body_r, body_g, body_b);   # body color
				canvas.fillCircle(0, 0, 10);
				canvas.fillCircle(0, -10, 7);
				canvas.rotate(-angle);                         # transform coordinates
				canvas.shift(-x, -y);                          # back to original
			}

			bug(100, 100, body_r=1, body_g=0, body_b=0);
			bug(200, 100, leg_r=1, leg_g=0, leg_b=0);
			bug(300, 100, angle=math.pi());
			`,
			"ignore-color": false,
		},
		{
			content: `
			<h2>Wrap-up</h2>
			<p>
			You have learned about the concept of a function in programming. Some
			functions perform calculations, similar to their counterparts in
			mathematics. The general concepts of a function in programming entails
			the creation of user-defined commands. These are sub-programs. They
			structure the code into meaningful units, they avoid the need for code
			duplication, and instead allow for code reuse.
			</p>
			<p>
			You know the syntax of a function, and you know how to return a value
			from a function. You can also flexibly pass values into a function using
			parameters. Rarely used parameters can be skipped if a default value is
			specified, and such values can be specified by name in the function call.
			</p>
			`,
		},
	],
};
