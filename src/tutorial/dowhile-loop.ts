export const tutorial_dowhile = {
	id: "dowhile",
	title: "Other Types of Loops",
	sections: [
		{
			content: `
			<p>
            The for-loop executes a piece of code again and again until
            the loop counter reaches a specific value. This is basically
            a condition that has to be met for the loop to still be executed.
            We now look at another kind of loop where we do not necessarily 
            have to use a loop counter. Instead the loop is executed until
            a certain condition is not met anymore. In the section about 
            conditions you have learnt about boolean values. Similar to 
            the boolean statements in <i>if</i>-statements we use 
            <i>while</i>-loops. 
            </p>
			`,
		},
		{
			content: `
            <h2>While-loops</h2>
            <p>
            There exist two different kinds of while-loops - the <i>do-while</i>-
            and the <i>while-do</i>-loop. The only difference between both is that
            in the <i>do-while</i>-loop the loop is executed at least once while
            it is possible that for <i>while-do</i>-loops the loop is never executed.
            The latter thing happens if the condition to execute the loop is never
            fulfilled. Here are two examples of both kinds of loops:
            <tscript>
            var i = 0;
            while (i < 10) do {
                print(i);
                i = i + 1;
            }                           

            var j = 0;
            do {
                print(j);
                j = j + 1;
            }
            while (j < 10);            
            </tscript>
            In this example both loops do the same. The latter one first executes the loop
            and then checks the condition, though. An example where this makes a difference
            is, if the condition is initially unfulfilled:
            <tscript>
            var i = 0;
            while (i > 0) do {
                print(i);
                i = i - 1;
            }

            do {
                print(i);
                i = i - 1;
            } while (i > 0);
            </tscript>
            In this case the latter one prints 0 once, while the first loop is never executed. 
            </p>
            <div class="tutorial-exercise">
			<p>
			Try to create a <i>while-do</i>-loop for yourself. Create a loop counter i and set it 
            to 10. Inside of the <i>while-do</i>-loop use an <i>if</i>-statement to check if the 
            current counter is divisible by 2 (use the modulo operator % for which: x % y = 0, 
            if y divides x without any remains). Only print the current status of the loop 
            counter if it is divisible by 2. Don't forget to count down your loop counter by 
            1. The loop shall terminate if the count variable is not greater than 0 anymore.
			</p>
			</div>
            `,
			correct: `
				var i = 10;
                while (i > 0) do {
                    if (i % 2 == 0) then {
                        print(i);
                    }
                    i = i - 1;
                }
				`,
			tests: [
				{
					type: "code",
					code: "print(i);",
				},
				{
					type: "js",
					code: `
                        let program = parse(code).program;
                        if (! program) return "Failed to parse the program code.";
                        if (hasStructure(program, "{ call(print); call(print); }")) return "Use only a single print command!";
                        if (! hasStructure(program, "loop;")) return "Use a loop to solve the problem!";
                        if (! hasStructure(program, "\"while-do-loop\";")) return "Use a do while-loop to solve the problem!";
                        if (! hasStructure(program, "loop { call(print); }")) return "Use a print statement inside of the loop body to solve the problem!";
                        if (isRecursive(program)) return "Please don't use recursion.";
                        `,
				},
			],
		},
		{
			content: `
            <h2>Break and continue</h2>
            <p>
            The examples we have seen so far have had similar conditions to end as the prior
            known <i>for</i>-loops. Since it is possible to use any kind of boolean statement
            as a loop condition, it is also possible to set the condition to be always true.
            If a loop is run infinitely we call it infinite loop. Algorithms that do not 
            terminate cannot be correct, though. However, in practice it is still sufficient 
            to use <i>while</i>-loops with a condition that always evaluates to true. We
            therefore need statements to end a loop "manually". If you call <code>break;</code>
            inside of a loop, the loop is terminated instantly. If you call <code>continue;</code>
            the loop instantly jumps to the next loop run.
            </p>
            <div class="tutorial-exercise">
			<p>
			Create a <i>while-do</i>-loop which's condition always evaluates to <i>true</i>. 
            Count the number of loop runs with a loop counter i and break the loop, once the
            loop has run 100 times.
			</p>
			</div>
            `,
			correct: `
				var i = 0;
                while (true) do {
                    if (i == 100) then {
                        break;
                    }
                    i = i + 1;
                }
            `,
			tests: [
				{
					type: "code",
					code: "print(i);",
				},
				{
					type: "js",
					code: `let program = parse(code).program;
                    if (! program) return "Failed to parse the program code.";
                    if (! hasStructure(program, "loop;")) return "Use a loop to solve the problem!";
                    if (! hasStructure(program, "\"while-do-loop\";")) return "Use a while-loop to solve the problem!";
                    if (!hasStructure(program, "loop { condition; }")) return "There needs to be a condition to break the loop at the right time!";
                    if (isRecursive(program)) return "Please don't use recursion.";`,
				},
			],
		},
		{
			content: `
            <h2>Equivalence of loops</h2>
            <p>
            In general it is possible to write every <i>for</i>-loop as a <i>while</i>-loop.
            Vice versa only <i>while</i>-loops where the count of loop runs is known prior to
            the loop can be written as a <i>for</i>-loop. Both <i>while-do</i>- and <i>do-while</i>-
            loops can be written as the other one. Imagine the following <i>for</i>-loop:
            <tscript>
                for var i in 5:15 do
                {
                    print(2*i);
                }
            </tscript> 
            </p>
            <div class="tutorial-exercise">
			<p>
			Try to write the <i>for</i>-loop as a <i>do-while</i>-loop. First declare and initialize
            a loop counter. Then write the <i>do</i>-body. Finally, think about what the 
            <i>while</i>-condition needs to be. Don't forget that the <i>do</i>-body is at least 
            executed once and the condition is checked <b>afterwards</b>.
			</p>
			</div>
            `,
			correct: `
				var i = 5;
                do {
                    print(2*i);
                    i = i + 1;
                } while (i < 15);
            `,
			tests: [
				{
					type: "code",
					code: "print(i);",
				},
				{
					type: "js",
					code: `let program = parse(code).program;
                    if (! program) return "Failed to parse the program code.";
                    if (! hasStructure(program, "loop;")) return "Use a loop to solve the problem!";
                    if (! hasStructure(program, "\"while-do-loop\";")) return "Use a loop to solve the problem!";
                    if (!hasStructure(program, "loop { call(print); }")) return "Use a print statement inside of the loop!";
                    if (isRecursive(program)) return "Please don't use recursion.";`,
				},
			],
		},
		{
			content: `
            <h2>Wrap-up</h2>
            <p>
            In this section you have learnt about different kind of loops which can have any kind of
            condition that evaluates to a boolean value. They are mostly used if the number of loop
            runs is not known prior to the execution or if one likes to create an infinite loop which
            is terminated with the <code>break;</code>-statement. In many cases you are free to choose
            if you'd like to use a <i>for</i>- or a <i>while-do</i>- or a <i>do-while</i>-loop but 
            often one kind of loop has advantages over the others, i.e. having a set count of runs 
            (<i>for</i>-loop for the sake of shortness), having the need to at least run the loop-body
            once (<i>do-while</i>-loop) or having a general boolean condition to determine if the 
            loop-body shall be executed or not (<i>while-do</i>-loop).
            </p>
            `,
		},
	],
};
