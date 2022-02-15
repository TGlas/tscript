export const tutorial_helloworld = {
	id: "helloworld",
	title: "The First Program",
	sections: [
		{
			content: `
			<p>
			Programming means to give commands to the computer. These
			commands, taken together, are the program, or code. Running the
			program means to make the computer execute the commands. The
			nice thing about programming is that once the program is
			written, it can be executed any number of times without further
			(human) effort. Therefore, programming means task automation.
			</p>
			<p>
			Which tasks can be automated depends on the interface between
			the computer and the world. A screen allows the computer to
			output text, graphics, and videos. We'll start with the simplest
			of all outputs: a line of text.
			</p>

			<h2>Hello World</h2>
			<p>
			A good old tradition of computer science is that the first
			program a programmer writes in a new programming language simply
			outputs the greeting
			</p>
			<div style="font-size: 150%; text-align: center; padding: 1em; border: 1px solid #000;">
				Hello World!
			</div>
			<p>
			So, let's start writing our first program!
			</p>
			<p>
			The program will consist only of a single command. In TScript
			(and many other languages), a line of text can be produced with
			the <code class="code">print</code> command. In a programming
			language, all commands follow a very strict syntax. The syntax
			rules of a programming language are similar to the grammar rules
			of a spoken language. The syntax of the print-command is as
			follows:
			<tscript>
				print("Hello World!");
			</tscript>
			With the parentheses and double quotes, this may be a bit more
			than expected, so let's dissect the syntax:
			<ul>
			<li>The command outputs everything inside of the parentheses.</li>
			<li>The double quotes tell the computer to treat
				<code class="code">Hello World!</code> as text data, in
				contrast to further commands, numbers, calculations and the
				like. In programming, such values are called <i>strings</i>.
				</li>
			<li>The semicolon at the very end is a command delimiter. Each
				and every command ends with a semicolon.</li>
			</ul>
			</p>
			<div class="tutorial-exercise">
			<p>
			Now go ahead and type the above command into the editor. Refuse
			the temptation to copy&amp;paste. Rather type it carefully
			yourself, so you are forced to pay attention to the details like
			parentheses, double quotes, and the semicolon. Congratulations!
			You are just about to write your first program!
			</p>
			</div>
			<p>
			The program can be run (or executed) by pressing F7, or by
			pressing the "Run" button with the green triangle ("play"
			symbol) in the toolbar. Doing so should produce the greeting
			<code class="code">Hello World!</code> as a line in the message
			area.
			</p>
			<p>
			If you made a mistake, usually a typo, then running the program
			fails. In this case you get an error message. If you did not get
			an error message then try removing a parenthesis, a double quote
			or the semicolon. Now, running the program will result in an
			error message. That's what we meant before when stating that
			each command follows a strict syntax.
			</p>
			<p>
			For the purpose of this tutorial, use F7 or the "Run" button for
			code testing. Once you are done, press the "solve task" button
			below. It will give you feedback on your code. If a test fails,
			then the error message can be clicked for further details. If
			you have solved the task correctly and completely, then it moves
			on to the next section of the tutorial. You can also skip the
			programming task by clicking the "skip task" button, or you can
			cheat and take a glimpse at the reference solution.
			</p>
			`,
			correct: `print("Hello World!");`,
			tests: [
				{
					type: "code",
					code: "",
				},
			],
		},
		{
			content: `
			<h3>A Note on Reference Solutions</h3>
			<p>
			In programming, there is rarely only one solution leading to the
			goal. Therefore, in particular for more complex tasks, your
			solution may deviate quite widely from the given reference solution.
			That's not a problem at all! View the provided reference solution
			as <i>one</i> possible solution, not as the only way to go about
			a task. By reading reference solutions, you may however learn about
			battle-proven "standard" ways of solving certain problems.
			</p>

			<h3>Whitespace and Comments</h3>
			<p>
			In TScript and most other languages (with Python being a notable
			exception), we can insert whitespace like spaces, tabulators and
			even newlines everywhere in between the elements of the program.
			Furthermore, we can add comments. Comments are ignored by the
			computer. They are intended to be read by humans, like ourselves
			and by our colleagues. A (line) comment starts with a rhombus
			(aka hashtag) and extends to the end of the line. Taken together,
			this means that our first program could equally well look like this:
			<tscript>
				# Here comes a greeting:
				print(              # print command
					"Hello World!"  # the actual greeting text as a string
				) ;
			</tscript>
			</p>

			<h2>Variation</h2>
			<p>
			The print command is a bit boring. Who needs a computer for
			printing messages to a message area?
			</p>
			<div class="tutorial-exercise">
			<p>Let's do something visually more appealing: we output the
			greeting in a message box. That's done with the
			<code class="code">alert</code> command. It has the same syntax as
			the print command. Replace print with alert and see what happens.
			</p>
			</div>
			`,
			correct: `alert("Hello World!");`,
			tests: [
				{
					type: "code",
					code: "",
				},
			],
		},
		{
			content: `
			<h2>Wrap-up</h2>
			<p>
			You have just written your first program. Nothing
			fancy, just a short greeting. You could have achieved that
			easier by typing the greeting yourself instead of letting the
			program do the job, right? However, now the task is automated
			and you can run the program as often as you wish, at the press
			of a button!
			</p>
			`,
		},
	],
};
