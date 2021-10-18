export const tutorial_helloworld = {
	id: "helloworld",
	title: "The first program",
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
			A brief explanation: The command outputs everything inside of
			the parentheses. The double quotes tell it to treat
			<code class="code">Hello World!</code> as text data, in contrast
			to further commands. The semicolon is a command delimiter. Each
			and every command ends with a semicolon.
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
			fails. In this case you get an error message. Try removing a
			parenthesis, a double quote or the semicolon. Now, running the
			program will result in an error message. That's what we meant
			before when stating that each command follows a strict syntax.
			</p>
			<p>
			For the purpose of this tutorial, use F7 or the "Run" button for
			code testing. Once you are done, press the "solve task" button
			below. It will give you feedback on your code. If a test fails,
			then the error message can be clicked for further details. If
			you have solved the task correctly and completely, then it moves
			on to the next section of the tutorial. You can also skip the
			programming task by clicking the "continue" button, or you can
			view a reference solution.
			</p>
			`,
			correct: `print("Hello World!");`,
		},
		{
			content: `
			<h2>Variation</h2>
			<p>
			The print command is a bit boring. Who needs a computer for
			printing messages to a message area?
			</p>
			<div class="tutorial-exercise">
			<p>Let's do something slightly
			visually more appealing: we output the greeting in a message
			box. That's done with the <code class="code">alert</code>
			command. It has the same syntax as the print command. Replace
			print with alert and see what happens.
			</p>
			</div>
			`,
			correct: `alert("Hello World!");`,
		},
		{
			content: `
			<h2>Wrap-up</h2>
			<p>
			You have just written your first program. Nothing
			fancy, just a short greeting. You could have achieved that
			easier by typing the greeting yourself instead of letting the
			program do the job, right? However, now the task is automated
			and you can run the program as often as you wish!
			</p>
			`,
		},
	],
};
