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
			It is time to try this our yourself. Write a program printing out
			the already familiar greeting <code class="code">Hello World!</code>
			10 times, but using only a single <code class="code">print</code>
			command inside of a for-loop.
			</p>
			</div>
			`,
			correct: `for 0:10 do
{
	print("Hello World!");
}`,
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
			<p>TODO</p>
			`,
		},
		{
			content: `
			<h2>Ranges</h2>
			<p>TODO</p>
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
