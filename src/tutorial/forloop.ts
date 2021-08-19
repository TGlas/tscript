export const tutorial_forloop = {
	id: "forloop",
	title: "For-Loops",
	sections: [
		{
			content: `
			<p>
			The ability to execute any number of commands on the press of a
			button is already of great help when automating tasks. However,
			in computing, many high-level tasks are solved by <i>repeated</i>
			execution of the same command, or of the same (or a similar)
			sub-sequence of commands. In these cases, we don't want to press
			the "run"-button many times, but just once.
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
			reset each time the program start to run).
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
			<code class="code">for</code>. It allows us to solve the problem
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
			<code class="code">0:4</code>. It tells TScript to count from 0
			to 4 by starting from 0 and stopping at 4. Each time it did not
			arrive at 4, the <i>loop body</i> inside of the curly braces is
			executed. That's one iteration. There are four iterations in
			total, namely for the loop counter values 0, 1, 2 and 3.
			Counters starting from zero instead of one are very common in
			programming, so let's get used to them.
			</p>
			<div class="tutorial-exercise">
			<p>
<<<<<<< HEAD
			It is time to try this our yourself. Write a program printing out
			the already familiar greeting <code class="code">Hello World!</code>
=======
			It is time to try this out yourself. Write a program printing
			out already familiar greeting <code class="code">Hello World!</code>
>>>>>>> finished for-loop section in tutorial
			10 times, but using only a single <code class="code">print</code>
			command inside of a for-loop.
			</p>
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
						if (! hasStructure(program, "loop { call(print); }")) return "Use a print statement inside of the loop body to solve the problem!";
						if (isRecursive(program)) return "Please don't use recursion.";
					`,
				},
			],
		},
		{
			content: `
			<h2>Loop Counters</h2>
			<p>In many instances we not only want to execute the same code multiple times 
            but slightly differ what we do in each iteration based on the iteration count. 
            To do so we need to keep track of how many times we have already run the code. 
            Instead of just telling the for-loop its range we extend the syntax with a 
            variable in which the loop count will be saved. If we call the variable 
            inside of the for-loop it tells us the current status. 
            <tscript>
            for var i in 0:4 do
            {
                turtle.move(20);
                turtle.turn(90);
                print(i);
            }
            </tscript>
            This code will print <code class="code">0 1 2 3</code>. A small example application 
            might be printing a small multiplication table for a specific number.
            <tscript>
            for var i in 1:10 do
            {
                print(3*i);
            }
            </tscript>
            This will output the multiplication table of the number 3. We can see that the range 
            the loop runs through is not bound to start at 0. It is totally possible to start and 
            end at any number you want as long as it is an integer.</p>
            <p>
            To try this for yourself write a for-loop which prints a multiplication table for the 
            number 5, starting at 2 and ending at 8. Be aware that our multiplication table for 3 
            starts at 1 and ends with 9.
            </p>
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
                    if (! hasStructure(program, "loop { call(print); }")) return "Use a print statement inside of the loop body to solve the problem!";
                    if (isRecursive(program)) return "Please don't use recursion.";`,
				},
			],
		},
		{
			content: `
			<h2>Ranges</h2>
			<p>To specify how many iterations a for-loop should perform, we 
            used a new data type called <i>ranges</i>. The syntax to create
            a range is <code class="code">range = integer, ":", integer</code>.
            We can also call the constructor of the data type via 
            <code class = "code">range = Range(integer, ":", integer);</code>.
            The first integer has to be smaller than the second one, otherwise
            the constructed range is gonna be empty. Here are a few examples
            how to create a range:
            <tscript>
				var r1 = 0:10;          # range from 0 to 9
                var r2 = 20:10;         # empty range
                var r3 = Range(5,7);    # range from 5 to 6
			</tscript>
            </p>
			`,
		},
		{
			content: `
			<h2>Wrap-up</h2>
			<p>
			You have learned how to repeat commands multiple times in a
			for-loop. This is a powerful technique. It is used in
			programming all the time for solving scalable problems, i.e.,
			problems that can <i>grow</i> in some sense. Consider the task
			of printing, sorting or summing 10 numbers. That's a fixed sized
			problem. It can be solved without loops, but solving it with a
			loop is far more convenient. In contrast, consider the problem
			of printing, sorting or summing <i>n</i> numbers, where <i>n</i>
			can be as large as we wish. That's a scalable problem. For
			solving such problems, loops are not only convenient; they are
			necessary.
			</p>
			`,
		},
	],
};
