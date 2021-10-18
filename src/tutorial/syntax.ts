export const tutorial_syntax = {
	id: "syntax",
	title: "Syntax",
	sections: [
		{
			content: `
			<p>
            Let's take a closer look at the program you created. You've 
            already learned the syntax of the print command. Every command 
            is seperated by a semicolon, whitespaces don't make any 
            difference. After the print command you can see the string
            we want to print in brackets which tell the program it 
            belongs to the print command. The basic types of
            commands we use in a program are declarations, assignments, 
            function calls (like the <i>print</i>-function) and control
            structure elements. How exactly commands look like depends on 
            the chosen programming language. If you use a rhombus, you can
            comment on your program with pieces of program code that will
            not be executed.
            <tscript>
                print("Hello World!");          # this prints "Hello World!"
            </tscript>
            </p>
			`,
		},
        {
            content: `
            <h2>Declarations</h2>
            <p>To work efficiently and solve tasks as general as possible, 
            we use variables which save specific values, strings or even functions. 
            If you i.e. write some code to compute the square root of a specific 
            number, why wouldn't you want to be able to reuse the code to calculate 
            the square root of a different number? Using variables (and functions)
            you'd be able to do so. With
            <tscript>
                var x;
            </tscript>
            you create a variable with the name x. There exists a list of keywords, which
            cannot be used in declarations, though, as you can see <a href="https://tglas.github.io/tscript/distribution/index.html?doc#/language/syntax/keywords">here</a>.
            If you call x, it returns the value that is stored. Right now after declaring
            x as a variable nothing is stored inside of x, though. If you'd call x and 
            print it with
            <tscript>
                print(x);
            </tscript>
            "null" will be printed. To make any use of variables we first have to assign
            a specific value to them. 
            </p>
            <p>
            Not only variables can be declared, though, functions, classes and namespaces
            also need declarations. We will discuss these constructs later on in this 
            tutorial.
            </p>
            `,
        },
        {
            content: `
            <h2>Assignments</h2>
            <p>
            An assignment statement copies a specific value into the storage location of
            a variable. The key symbol "=" declares an assignment. Beforehand we have already
            declared variable x. TScript is able to recognize which kind of data you'd like 
            to store in x, other programming languages might require you to declare a variable of 
            a specific data type. In our case we are able to store any data in x which looks
            like this:
            <tscript>
                x = 1;                  # now the value 1 is assigned to x
                x = "Hello World!";     # now the string "Hello World!" is assigned to x
                x = print;              # now the print function is assigned to x
            </tscript>
            </p>
            <p>
            <div class = "tutorial-exercise"> Try declaring, initializing and calling 
            variables for yourself. First, create a variable called i. Assign the string 
            "Hello World!" and print it. Afterwards assign the integer value 10. Now create 
            a second variable j and assign the tenfold of i without using the number 100. Finally
            print j.</div>
            </p>
            <p>
            Declaration and Assignment can be done in a single instruction. 
            <tscript>
                var x = i;
            </tscript>
            </p>
            `,
            correct: `
				var i;
                i = "Hello World!";
                print(i);
                i = 10;
                var j;
                j = 10*i;
                print(j);
				`
        },
        {
            content: `
            <h2>Wrap-Up</h2>
            <p>
            You are now able to create variables to use in your program and differentiate
            between declarations and assignments. The process of both at the beginning of
            a program or algorithm is often referred to as initialization as you set the 
            initial status of your program before anything is done.
            </p>
            `
        }
	],
};
