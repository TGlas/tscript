export const tutorial_variables = {
	id: "variables",
	title: "Variables",
	sections: [
		{
			content: `
			<p>
			</p>
			`,
		},
		{
			content: `
			<p>
			Variables make code much more generic. Instead of solving a single
			problem, they allow us to solve a whole class of problems. Doing so
			greatly increases efficiency.
			</p><p>
			A variable stores a value, like a string, a number, or more complicated
			data (to be discovered later). For example, if we write some code to
			compute the square root of a specific number, wouldn't we want to be
			able to reuse the code to calculate the square root of a different
			number? Using variables (and functions) we are able to do so. With
			<tscript>
			    var x;
			</tscript>
			we create a variable with the name "x". The name could equally well
			be more descriptive, like "points" or "animal". Using appropriate and
			descriptive names depending on the context is improves readability
			and maintainability of code, and is therefore considered good style.
			<tscript>
			    var points;
			    var animal;
			</tscript>
			Multiple variables can (but do not need to be) declared with a single
			declaration as follows:
			<tscript>
			    var points, animal;
			</tscript>
			We can think of a variable as a box. The box has a name tag, and it
			can contain exactly one value. Using a computer analogy, we can think
			of the operating system's clipboard as a variable. When we select and
			copy some text in the browser then this text is copied from the webpage
			into the clipboard. When we paste the content into a text editor then
			it is copied from the clipboard into the editor. The ability of the
			clipboard to store text or images, but only one entity at a time, is
			what makes it similar to a variable.
			</p><p>
			Notice that in the above examples, the word "var" is printed in dark
			blue. This is done to indicate that "var" is a so-called <i>keyword</i>.
			Structurally, keywords like "var" are no different from names like "x",
			"animal", and "print". However, they have a special meaning for the
			programming language, like declaring a variable, and are therefore not
			available as names. A complete list of keywords of the TScript language
			is found
			<a target="_blank" href="https://tglas.github.io/tscript/?doc=%2Flanguage%2Fsyntax%2Fkeywords">here</a>.
			</p><p>
			Let's return to our variable. In programming, a variable has two roles:
			<ul>
			<li>A variable stores a value. This way the program can remember
				information for later use.</li>
			<li>A variable can change. It is hence more flexible than other values.
				Think of the value <code>"Hello World"</code>. We had
				hard-coded it into the print command. A variable adds flexibility.
				Instead of always printing the same text, a variable allows the
				print command to print whatever is currently stored in the variable.
				</li>
			</ul>
			For working with variables, we need two mechanisms, namely for
			<i>storing</i> a value in a variable (write operation), and for
			<i>retrieving</i> it later on (read operation).
			</p>
			`,
		},
		{
			content: `
			<h2>Assignment</h2>
			<p>
			An assignment statement copies a value into a variable. This is the
			write operation mentioned above. The symbol (or operator) "=" marks an
			assignment. Beforehand we have already declared variable x. Storing
			values in x (and then overwriting them) works as follows:
			<tscript>
			x = 1;                  # now the number 1 is assigned to x
			x = "Hello World!";     # now the string "Hello World!" is assigned to x
			</tscript>
			</p>
			<p>
			It is common to assign an initial value to a variable already when it is
			declared. This works as follows:
			<tscript>
			var x = 1;              # declaration with initial assignment
			</tscript>
			Note that this syntax involves the "var" keyword, which declares the
			variable. Each variable can only be declared once, but there can be an
			arbitrary number of assignments to the variable. If a further assignment
			accidentally uses the "var" keyword again, then it is a declaration, and
			not (only) an assignment. The variable is now declared twice and we end
			up with an error message.
			</p>
			<p>
			<div class = "tutorial-exercise">
				Declare a variable called "points". Assign the number
				<code>100</code> to it. Then declare a second variable called "animal"
				and assign the string <code>"dog"</code> to it. We can either use
				separate assignments or assign initial values.
			</div>
			</p>
			`,
			correct: `
				var points = 100;   # variable declaration with initial value
				var animal;         # variable declaration
				animal = "dog";     # assignment
				`,
			tests: [
				{
					type: "code",
					code: "print(points); print(animal);",
				},
			],
		},
		{
			content: `
            <h2>Using Variables</h2>
            <p>
			We have stored value in variables. However, we did not observe the effect
			of the assignment, because we never used the stored values. Retrieving and
			using values stored in variables is as simple as it gets: we refer to the
			value stored in a variable by writing out the variable name.
			Example:
			<tscript>
			    var animal = "dog";   # variable declaration with initial value
			    print(animal);        # prints "dog", not "animal"
			</tscript>
			The above program prints "dog" to the message area. Let's break down the
			print command into its elementary steps. The following happened:
			<ol>
			<li>The name <code>animal</code> is encountered. It is looked up and
				found to be a variable.</li>
			<li>The value of the variable is found to be "dog". This value is
				passed on to the <code>print</code> command.</li>
			<li>The print command adds the line "dog" to the message area.</li>
			</ol>
			</p><p>
			Note the quite different effects of the following commands:
			<tscript>
			    print("animal");      # print the string "animal"
			    print(animal);        # print the string "dog" stored in the variable "animal"
			</tscript>
			Now we can understand the reason why the text "Hello World!" was
			enclosed in double quotes. Recall that the double quotes tell the
			computer to treat <code>Hello World</code> as a string, a
			piece of text, not as a piece of program code. The same happens in the
			first command. In the second command, <code>animal</code>
			is treated as program code, in this case as the name of a variable. The
			name is a piece of program code. Its meaning is: "look and the name of
			the variable and read out its value". That's what happens in the second
			command.
			</p><p>
			<div class = "tutorial-exercise">
				Extend the task from above, where we assigned values to the variables
				"points" and "animal". Print out the values of these variables with
				two <code>print</code> commands. Print out the value of
				"points" first and the value of "animal" last. Hence, our program
				should produce two messages containing the number 100 and the word
				"dog".
            </div>
            </p>
            `,
			correct: `
				var points = 100;   # variable declaration with initial value
				var animal;         # variable declaration
				animal = "dog";     # assignment
				print(points);      # print 100
				print(animal);      # print "dog"
				`,
		},
		{
			content: `
            <h2>Gaining Flexibility</h2>
            <p>
            Until now, variables may feel like an additional burden. Why write
            <tscript>
            	var message = "Hello World!";
            	print(message);
            </tscript>
            if we can equally well use the much simpler
            <tscript>
            	print("Hello World!");
            </tscript>
            to get the same effect? To see the benefit, let's look at a more
            interesting example. The following program draws a regular triangle
            with the turtle:
            <tscript>
            	turtle.move(40);
            	turtle.turn(120);
            	turtle.move(40);
            	turtle.turn(120);
            	turtle.move(40);
            </tscript>
            The side length of the triangle is fixed to 40. What if we want to draw
            a larger triangle? We surely don't want to write the same program over
            and over for different triangles. So, let's make the side length a variable:
            <tscript>
            	var side = 40;        # change this at need
            	turtle.move(side);
            	turtle.turn(120);
            	turtle.move(side);
            	turtle.turn(120);
            	turtle.move(side);
            </tscript>
            If we ever need to change the size of the triangle, then we do that in a
            single place. Changing it three times would be cumbersome, and actually
            error-prone. It is easy to imagine a more complex situation where a value
            would need to be changed 20 times, distributed over hundreds of lines of
            code. In contrast, changing the value of a variable is a much better
            solution. As we move on, we'll see that programming offers even better
            solutions to the problem of code reuse. All of them will involve using
            variables.
            </p>
            `,
		},
		{
			content: `
            <h2>Wrap-Up</h2>
            <p>
			We are now able to create variables to use in our program. We know about
			declarations and assignments. The process of both at the beginning of a
			program or algorithm is often referred to as initialization as we set
			the initial status of out program before anything is done.
            </p>
            `,
		},
	],
};
