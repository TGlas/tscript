export const tutorial_forloop = {
	id: "forloop",
	title: "For-Loops",
	sections: [
		{
			content: `
			<p>
			The ability to execute any number of commands on the press of a
			button is already of great help when automating tasks. However, in
			programming, many high-level tasks are solved by <i>repeated</i>
			execution of the same command, or of the same (or a similar)
			sequence of commands. In these cases, we don't want to press the
			"run"-button many times, but just once.
			</p>
			<p>
			As a concrete example, think of the task of drawing a square
			with the turtle. We need to move some distance, turn by 90
			degrees, move the same distance, turn by 90 degrees again, move,
			turn, and finally move. Adding one more turn command does not
			hurt though, and therefore we can solve the problem of drawing a
			square of side length <i>20</i> by repeating the following two
			commands four times:
			<tscript>
				turtle.move(20);
				turtle.turn(90);
			</tscript>
			Obviously, we don't want to trigger the execution of these two
			lines four times (aside from the problem that the turtle is
			reset each time the program starts).
			</p>
			<p>
			To solve that problem, all we need to do is to copy the above
			code four times. That works, but it is considered a poor
			solution. To see why that is, consider the problem of drawing a
			regular polygon with 10 instead of 4 sides. Then the following
			code needs to be repeated 10 times:
			<tscript>
				turtle.move(20);
				turtle.turn(36);
			</tscript>
			That's where copy&amp;paste starts to be cumbersome, and also
			error prone. Wouldn't it be nicer if we could repeat the
			<i>same</i> commands multiple times instead?
			</p>
			<p>
			That's exactly what a loop does: it executes code multiple
			times. The simplest type of loop is the so-called "for"-loop.
			In most programming languages it starts with the keyword
			<code>for</code>. It allows us to solve the problem
			of drawing a square as follows:
			<tscript>
				for 0:4 do
				{
					turtle.move(20);
					turtle.turn(90);
				}
			</tscript>
			</p>
			<p>
			A loop can run for multiple <i>iterations</i>. The number of
			loop iterations is defined in terms of the <i>range</i>
			<code>0:4</code>. It tells TScript to count from 0
			to 4 by starting from 0 and stopping at 4. Each time it did not
			arrive at 4, the <i>loop body</i> inside of the curly braces is
			executed. That's one iteration. There are four iterations in
			total, namely for the loop counter values 0, 1, 2 and 3.
			Counters starting from zero instead of one are very common in
			programming, so let's get used to them.
			</p>
			<div class="tutorial-exercise">
			Write a program printing out the already familiar greeting
			<code>Hello&nbsp;World!</code> 10 times, but using
			only a single <code>print</code> command inside of
			a for-loop.
			</div>
			`,
			correct: `
			for 0:10 do
			{
				print("Hello World!");
			}
			`,
			tests: [
				{
					type: "code",
					code: "",
				},
				{
					type: "js",
					code: `
						let program = parse(code).program;
						if (! program) return "Failed to parse the program code.";
						if (hasStructure(program, "{ call(print); call(print); }")) return "Use only a single print command!";
						if (! hasStructure(program, "loop;")) return "Use a loop to solve the problem!";
						if (! hasStructure(program, "'for-loop';")) return "Use a for-loop to solve the problem!";
						if (! hasStructure(program, "loop { call(print); }")) return "Use a print statement inside of the loop body to solve the problem!";
						if (isRecursive(program)) return "Please don't use recursion.";
					`,
				},
			],
		},
		{
			content: `
			<h2>Loop Counters</h2>
			<p>
			In many cases we do not want to execute the same code multiple times,
			but rather slightly vary what we do in each iteration, based on the
			iteration count. To do so we need to keep track of how many times we
			ran the code already. Say, we want to output the digits 0 to 9. This is
			a perfect situation for a variable, which simply counts the number of
			iterations. In each iteration we output its value:
			<tscript>
			var counter = 0;
			for 0:10 do
			{
				print(counter);
				counter = counter + 1;
			}
			</tscript>
			Importantly, the last line of the loop body is not an equation! It is
			an assignment. The effect of the assignment is that the number stored
			in the variable <code>counter</code> is incremented.
			</p>
			<p>
			This situation is so frequent that the for-loop brings built-in support
			for it. Instead of just telling the for-loop its range we extend the
			syntax with a variable in which the loop count will be saved. If we
			use the variable inside of the for-loop it tells us the current status:
			<tscript>
			var counter;
			for counter in 0:10 do
			{
				print(counter);
			}
			</tscript>
			Note that we do no longer need to initialize the variable, and we also
			do not need to increment it. This is because in each iteration, the
			for-loop assigns the current element of the range to the variable
			counter. The for-loop allows for an even more compact syntax:
			<tscript>
			for var counter in 0:10 do
			{
				print(counter);
			}
			</tscript>
			Now even the variable declaration is part of the loop. This has the side
			effect that the variable is only available inside of the loop. However,
			in most cases that's exactly what we need.
			</p>
			<div class="tutorial-exercise">
			Use TScript's ability to perform calculations together with a for-loop
			to output the square numbers 1, 4, 9, 16, 25, 36, 49, 64, 81, 100. The
			program shall use a for-loop and only a single print command inside of
			the loop body.
			</div>
			`,
			correct: `
			for var k in 0:10 do
			{
				var n = k + 1;
				var square = n * n;   # n^2 also works fine
				print(square);
			}
			`,
			tests: [
				{
					type: "code",
					code: "",
				},
				{
					type: "js",
					code: `
						let program = parse(code).program;
						if (! program) return "Failed to parse the program code.";
						if (hasStructure(program, "{ call(print); call(print); }")) return "Use only a single print command!";
						if (! hasStructure(program, "loop;")) return "Use a loop to solve the problem!";
						if (! hasStructure(program, "'for-loop';")) return "Use a for-loop to solve the problem!";
						if (! hasStructure(program, "loop { call(print); }")) return "Use a print statement inside of the loop body to solve the problem!";
						if (isRecursive(program)) return "Please don't use recursion.";
					`,
				},
			],
		},
		{
			content: `
			Another example application is to print a multiplication table for a specific number.
			<tscript>
			for var i in 1:10 do
			{
				print(3*i);
			}
			</tscript>
			This will output the multiplication table of the number 3. We can see
			that the range the loop runs through is not bound to start at 0. It is
			perfectly possible to start and end at any number you want, as long as
			it is an integer. Recall the rule of thumb that integers are used for
			counting &mdash; and that's what a for-loop counter does.
			</p>
			<div class="tutorial-exercise">
			To try this for yourself write a for-loop which prints a multiplication
			table for the number 5, starting at 2 and ending at 8. Notice that our
			multiplication table for 3 starts at 1 and ends with 9.
			</div>
			`,
			correct: `
				for var i in 2:9 do
				{
					print(5*i);
				}
				`,
			tests: [
				{
					type: "code",
					code: "",
				},
				{
					type: "js",
					code: `let program = parse(code).program;
					if (! program) return "Failed to parse the program code.";
					if (hasStructure(program, "{ call(print); call(print); }")) return "Use only a single print command!";
					if (! hasStructure(program, "loop;")) return "Use a loop to solve the problem!";
					if (! hasStructure(program, "'for-loop';")) return "Use a for-loop to solve the problem!";
					if (! hasStructure(program, "loop { call(print); }")) return "Use a print statement inside of the loop body to solve the problem!";
					if (isRecursive(program)) return "Please don't use recursion.";`,
				},
			],
		},
		{
			content: `
			<h2>Ranges</h2>
			<p>
			To specify how many iterations a for-loop should perform, we used a new
			data type called <code>Range</code>. The syntax to create a
			range is <code>a:b</code>, where a and b are integers. The
			first integer has to be smaller than the second one, otherwise the
			constructed range is empty. Examples:
			<tscript>
				var r1 = 0:10;          # range including 0,1,2,3,4,5,6,7,8,9
				var r2 = 20:10;         # empty range
				var a = 5, b = 7;
				var r3 = a:b;           # range including 5 and 6
			</tscript>
			As we can see, ranges can be stored in variables, and they can even be
			printed. They are values, just like numbers and strings. In other words,
			we have just extended our collection of data types by a new member, the
			range.
			</p>

			<h2>Loops for Graphics</h2>
			<p>
			We have started this section with the example of drawing a square and a
			10-sided regular shape with the turtle. This works as follows:
			<tscript>
				for 0:10 do
				{
					turtle.move(20);
					turtle.turn(36);
				}
			</tscript>
			With a slight variation, we can make the lines cross, resulting in a
			star:
			<tscript>
				for 0:10 do
				{
					turtle.move(70);
					turtle.turn(180 - 36);
				}
			</tscript>
			Generally speaking, graphics often consists of many similar
			elements, e.g., many parallel lines forming a grid. Let's try this out!
			</p>
			<div class="tutorial-exercise">
			Draw a grid of 10x10 cells on the canvas. Draw only the lines separating
			the cells. That's 11 horizontal lines and 11 vertical lines. The grid
			shall cover the coordinate range from 100 to 200 in horizontal and
			vertical direction. Use one or two loops, and exactly two
			<code>canvas.line</code> commands for drawing.
			</div>
			`,
			correct: `
				for var i in 0:11 do
				{
					var c = 100 + 10*i;
					canvas.line(c, 100, c, 200);
					canvas.line(100, c, 200, c);
				}
				`,
			tests: [
				{
					type: "code",
					code: "",
				},
				{
					type: "js",
					code: `let program = parse(code).program;
					if (! program) return "Failed to parse the program code.";
					if (hasStructure(program, "{ call(line); call(line); call(line); }")) return "Use only two line commands!";
					if (! hasStructure(program, "loop;")) return "Use a loop to solve the problem!";
					if (! hasStructure(program, "'for-loop';")) return "Use a for-loop to solve the problem!";
					if (isRecursive(program)) return "Please don't use recursion.";`,
				},
			],
		},
		{
			content: `
			<h3>Sunlight Rays</h3>
			<p>
			We are now in the position to finish our earlier example of drawing a
			yellow sun onto a blue sky background.
			<tscript>
			var center = canvas.width() / 2;    # horizontal center
			canvas.setFillColor(0.5, 0.5, 1);   # light blue
			canvas.clear();                     # fill the entire canvas
			canvas.setFillColor(1, 1, 0);       # yellow
			canvas.setLineColor(1, 1, 0);       # yellow
			canvas.setLineWidth(3);             # a bit wider
			canvas.fillCircle(center, 100, 40); # ball (the sun)
			var length = 90;                    # ray length from the center
			for var i in 0:18 do
			{
				var alpha = 20*i+15;                        # ray direction (angle in degrees)
				var radians = alpha / 180 * math.pi();      # turn alpha into radians
				var x = length * math.cos(radians);         # position relative ...
				var y = length * math.sin(radians);         # ... to the center
				canvas.line(center, 100, center+x, 100+y);  # draw the ray
			}
			</tscript>
			Try it out and enjoy the sunshine!
			</p>

			<h3>Simple Animations</h3>
			<p>
			Loops put us into the position not only to do many (similar) things
			very quickly, but also to do them in a timed fashion. To this end, we
			will use the <code>wait</code> command, which delays program execution
			for a given number of milliseconds. Now think of a loop body that draws
			an image, then waits for a brief moment. The next iteration draws a new
			slightly different image, waits again, and so on. What we get is an
			animation, maybe a full-blown movie. Of course, we will use a loop for
			drawing the images. In our example, the image will be quite simple,
			consisting of two colored balls:
			<tscript>
			for var t in 0:500 do
			{
				canvas.setFillColor(1, 1, 1);
				canvas.clear();
				canvas.setFillColor(0, 0, 1);
				canvas.fillCircle(200, t, 40);
				canvas.setFillColor(1, 0, 1);
				canvas.fillCircle(t, 0.5*t+90, 25);
				wait(10);
			}
			</tscript>
			You should see a big blue and a smaller pink ball moving across the
			canvas. Feel free to play around with the animation! Can you apply a
			different calculation to make the pink ball move around in circles?
			</p>

			<h2>Wrap-up</h2>
			<p>
			You have learned how to repeat commands multiple times in a for-loop.
			This is a powerful technique. It is used in programming all the time for
			solving repetitive problems. Such problems are ubiquitous, not only in
			canvas drawing: think of performing some operation for an entity in a
			data base, like sending a bill to a customer. Sending <i>all</i> pending
			bills to the corresponding customers is a composite operation which can
			be solved using a loop over bills.
			</p>
			`,
		},
	],
};
