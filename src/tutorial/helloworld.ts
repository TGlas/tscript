//import { Documentation } from ".";

export const tutorial_helloworld = {
	id: "helloworld",
	title: "The first program",
	sections: [
		{
			content:
			`
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
			<div style="font-size: 200%; margin: 1em; text-align: center;">
				<i>Hello World!</i>
			</div>
			<p>
			So, let's start writing our first program!
			</p>
			<p>
			The program will consist only of a single command. In TScript
			(and many other languages), a line of text can be produced with
			the <code class="code">print</code> command. In a programming
			language, all commands follow a very strict syntax. The syntax
			of the print-command is as follows:
			<tscript>
				print("Hello World!");
			</tscript>
			A brief explanation: The command outputs everything inside of
			the parentheses. The double quotes tell it to treat
			<code class="code">Hello World!</code> as text data, in contrast
			to further commands. The semicolon is a command delimiter. Each
			and every command ends with a semicolon.
			</p>
			<p>
			Now go ahead and type the above command into the editor. Don't
			use copy&amp;paste, but rather type it carefully, so you are
			forced to pay attention to the details, like parentheses, double
			quotes and the semicolon. Congratulations! You have just written
			your first program!
			</p>
			<p>
			The program can be run (or executed) by pressing F7, or by
			pressing the button with the green triangle ("play" symbol) in
			the toolbar. Doing so should produce the greeting
			<code class="code">Hello World!</code> as a line in the message
			area.
			</p>
			<p>
			If you made a mistake, usually a typo, then running the program
			fails. In this case you get an error message, which also appears
			in the message area. Try removing a parenthesis, a double quote
			or the semicolon. Now, running the program will result in an
			error message. That's what we meant before when stating that
			each command follows a strict syntax.
			</p>
			`,
			correct: `print("Hello World!");`,
		},
		{
			content:
			`
			<h2>Variation</h2>
			<p>
			The print command is a bit boring. Who really needs a computer
			for printing messages to a message area? Let's do something
			slightly visually more appealing: we output the greeting in a
			message box. That's done with the <code class="code">alert</code>
			command. It has the same syntax as the print command. Replace
			print with alert and see what happens.
			</p>
			`,
			correct: `alert("Hello World!");`,
		},
		{
			content:
			`
			<h2>Wrap-up</h2>
			<p>
			You have just written your first program. Nothing
			fancy, just a short greeting. You could have achieved that
			easier by typing the greeting yourself, right? However, now the
			task is automated and you can run the program as often as you
			wish!
			</p>
			`,
		},
	],
};
