export const tutorial_functions = {
	id: "functions",
	title: "Functions",
	sections: [
		{
			content: `
			<p>
            The concept of functions is already known from mathematics and in
            informatics it is pretty similar, though more general. If you recall
            the syntax-section, we talked about reusability of code and using 
            variables to solve a problem with different input values. If you
            want to use some code more than once at different locations, it might 
            be a good idea to "store" the code, like you can store values in variables, 
            to just call it by name instead of rewriting the whole code block. Functions 
            are not only able to just execute the same code as often as you want,
            you are able to input different values to get different results; i.e.
            a function to compute the square of any given input x returns a different 
            number, depending on the input. What kind of code you store in a function
            is not bound to compute something - you can store any kind of code. Another
            benefit of using functions is to make the code more readable. If you need a
            slope executing task A, B and C, it might be more understandable, if you call
            <tscript>
            a();
            b();
            c();
            </tscript>
            and outsource the code, instead of just writing everything below each other.
            </p>
			`,
		},
		{
			content: `
            <h2>Syntax</h2>
            <p>
            To create a function you use the <i>function</i>-keyword, an identifier,
            a parameter list (the possible input values) and the function-body with
            the <i>return</i>-keyword. The parameter list consists of two wrapping 
            brackets containing any number of input parameters (none are also possible).
            The function body is enclosed by curly brackets. A function is finalized by 
            the <i>return</i> statement, where either nothing or one value is returned - 
            if you do not return anything, the null type is returned. Functions are 
            called by their identifier, followed by two brackets containing the 
            input parameter list - note that you have to hand over the exact number 
            of parameters as declared in the definition of the function. Here is an 
            example of a function computing the square of any input parameter:
            <tscript>
            function square(x) {
                return x*x;
            }

            print(square(5));           # prints 25;
            </tscript>
            When we call the function the program execution continues inside of the
            function body with the parameters. You can imagine the program 
            copy-pasting the function body to the location where it is called.
            This example doesn't really represent the benefit of using functions, though,
            since we have even more work than simply writing <code>print(x*x);</code>.
            A better example is the following, where we call the function code more than
            once:
            <tscript>
            function f(x) {
                var y = x + 1;
                print(y);
                return;                 # this is not mandatory
            }
            
            for var i in 0:10 do {
                if (i % 2 == 0) then {
                    f(i/2);
                }
                else {
                    f(i);
                }
            }
            </tscript>
            In this case we want to call the function with a different parameter depending on
            if the loop counter is even or uneven. Instead of writing the same code twice we can
            now just call the function twice. In real applications the number of lines of code 
            that can be spared are much bigger.
            </p>
            <div class="tutorial-exercise">
			<p>
			Create a function <i>countdown</i> for your own. It should take one input parameter x and 
            count it down to 0 using a <i>while-do</i>-loop. Every step print the current state 
            of the parameter.</p>
			</div>
            <p>
            In this exercise you can see, that it is important to know which data type the function
            expects. If you call your function with a real number or a string, it won't work.
            </p>
            `,
			correct: `
				function countdown(x) {
                    while (x > -1) do {
                        print(x);
                        x = x - 1;
                    }
                }
				`,
			tests: [
				{
					type: "js",
					code: `let program = parse(code).program;
                    if (! program) return "Failed to parse the program code.";
                    if (hasStructure(program, "{ call(print); call(print); }")) return "Use only a single print command!";
                    if (! hasStructure(program, "loop;")) return "Use a loop to solve the problem!";
                    if (! hasStructure(program, "\"while-do-loop\";")) return "Use a while-loop to solve the problem!";
                    if (! hasStructure(program, "loop { call(print); }")) return "Use a print statement inside of the loop body to solve the problem!";
                    if (isRecursive(program)) return "Please don't use recursion.";`,
				},
				{
					type: "code",
					code: "countdown(5);",
				},
				{
					type: "code",
					code: "countdown(10);",
				},
				{
					type: "code",
					code: "countdown(-5);",
				},
				{
					type: "code",
					code: "countdown(0);",
				},
			],
		},
		{
			content: `
            <h2>Optional Parameters</h2>
            <p>
            There might be applications where some input parameters are mostly
            the same but might differ in some cases. If you want the function to
            work with specific values unless it is stated otherwise, you can use 
            so called <i>default values</i>. While declaring the function you are
            able to set some input parameters to a default value with the =-operator.
            For example, if you want to write a function that always prints a given
            string 5 times, unless it is specified otherwise, it'd look like this:
            <tscript>
            function printString(s, count = 5) {
                for var i in 0:count do {
                    print(s);
                }
            }

            printString("Hello World!");                # prints "Hello World!" 5 times
            printString("MoreHelloWorld!", 10);         # prints "MoreHelloWorld!" 10 times
            </tscript>
            As you can see, it is optional to hand over parameters with default values.
            If you omit them, they are set to their default values in the function body.
            It is important, that you set the optional parameters at the end of the parameter
            list, since you aren't able to hand over any parameters after them without 
            handing over the optional ones as well. This also means, that if you need more 
            than one optional parameter, you can only omit the last ones in the function
            call. For example:
            <tscript>
            function example(a, b, c, d = 10, e = 15) {
                # function body
            }

            example(1, 2, 3, 4, 5);                 # sets d = 4, e = 5
            example(1, 2, 3, 4);                    # sets d = 4, e = default = 15
            example(1, 2, 3, 5);                    # sets d = 5, e = default = 15
            </tscript>
            It is therefore impossible to hand over a value for e without handing over a 
            value for d. 
            </p>
            <div class="tutorial-exercise">
			<p>
			Create a function <i>add</i> which takes a parameter i and an optional parameter
            x and returns i + x. If no value of x is handed over, the function shall return 
            i + 1.
			</p>
			</div>
            <p>
            It is possible to hand over the same value as a parameter's default value. 
            </p>
            `,
			correct: `
				function add(i, x = 1) {
                    return i + x;
                }
				`,
			tests: [
				{
					type: "code",
					code: "print(add(2));",
				},
				{
					type: "code",
					code: "print(add(20));",
				},
				{
					type: "code",
					code: "print(add(2, 5));",
				},
				{
					type: "code",
					code: "print(add(-3, -5));",
				},
			],
		},
		{
			content: `
            <h2>Wrap-up</h2>
            <p>
            You have learnt to use functions as a way to store code and execute it by calling
            the function's identifier. You can use parameters to use the function with different
            values, similarly to mathematical functions. A function can only return one value
            or nothing. In the latter case it is not necessary to use the <i>return</i>-statement. 
            Keep in mind, that you are able to stop the function's execution immediately with
            calling the <i>return</i>-keyword - kind of like the <i>break</i>-keyword works for
            loops. For optional parameters you can use default values. You will find functions
            in all kind of applications, they structure the code and are helpful for repetitive
            code blocks. There even exist code libraries which collect different functions
            for you to use. 
            </p>
            `,
		},
	],
};
