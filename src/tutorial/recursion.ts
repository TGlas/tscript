export const tutorial_recursion = {
	id: "recursion",
	title: "Recursion",
	sections: [
		{
			content: `
			<p>
            You might already know the concept of recursion from mathematics. Sequences are
            examples where the following value depends on its predecessor. In informatics
            recursion usually indicates that a function calls itself in its function body.
            Think of a simple example - a function that shall add a given (positive) value 
            y to an also given value x. If you ever faced this problem, you'd most likely simply
            use the +-operator to get the result. But what if the +-operator isn't already
            defined? In an environment where we are only able to add up or subtract 1 at a
            time, we can solve the problem with recursion. We simply create a function that
            takes two given values and calls itself with one value being in- and one being
            decremented:
            <tscript>
            function add(x, y) {
                return (add(x+1, y-1));         # imagine us only being able to add oder subtract 1
            }
            </tscript>
            The problem with our created function is that right now the function calls would 
            never end and the algorithm would not terminate. Every function call simply calls
            itself again with slightly other values. This can actually be compared to an 
            infinite loop. We therefore need to force a stop at some point which we call the 
            recursion anchor. If a certain condition is met, we return a final value which
            will be passed back through the prior function calls. In our example, we add up
            one onto the first variable and subtract one from the second. Our stopping criterion
            here has to be the second variable reaching zero, since then we have added a one
            to the first variable for the amount of times the second value started with. We implement
            out anchor as follows:
            <tscript>
            function add(x, y) {
                if (y <= 0) then return x;
                return (add(x+1, y-1));         # imagine us only being able to add oder subtract 1
            }
            </tscript>
            To better understand the order the functions are run through in recursion, let's 
            take an example of adding 5 to 1:<br>
            <code>
            add(1, 5)<br/>
            {                                           # function add(1, 5) starts<br/>
            &nbsp;5 > 0 ==> add(2, 4)<br/>
            &nbsp;{                                      # function add(2, 4) starts<br/>
            &nbsp;&nbsp;4 > 0 ==> add(3, 3)<br/>
            &nbsp;&nbsp;{                                 # function add(3, 3) starts<br/>
            &nbsp;&nbsp;&nbsp;3 > 0 ==> add(4, 2)<br/>
            &nbsp;&nbsp;&nbsp;{                            # function add(4, 2) starts<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;2 > 0 ==> add(5, 1)<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;{                       # function add(5, 1) starts<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 > 0 ==> add(6, 0)<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{                  # function add(6, 0) starts<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 <= 0 ==> return 6;<br>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}                  # function add(6, 0) returns 6 to add(5, 1)<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;}                       # function add(5, 1) returns 6 to add(4, 2)<br/>
            &nbsp;&nbsp;&nbsp;}                            # function add(4, 2) returns 6 to add(3, 3)<br/>
            &nbsp;&nbsp;}                                 # function add(3, 3) returns 6 to add(2, 4)<br/>
            &nbsp;}                                      # function add(2, 4) returns 6 to add(1, 5)<br/>
            }                                           # function add(1, 5) returns 6 to the function call<br/>
            </code>
            What you have now seen is splitting up the full problem into smaller partial
            problems. We split up the process of adding y to x into y parts of incrementing
            x by one. 
            </p>
            <p>
            <div class = "tutorial-exercise">
            Write a recursive function <i>sumRange(n)</i> that returns the summed up range from 0 to parameter
            n. Think about the recursion anchor and how you can achieve that it is actually reached.
            </div>
            </p>
			`,
			correct: `
            function sumRange(n) {
                if (n <= 0) then { return n; }
                return n + sumRange(n - 1);
            }
            `,
			tests: [
				{
					type: "js",
					code: `let program = parse(code).program;
                    if (! program) return "Failed to parse the program code.";
                    if (!isRecursive(program)) return "Please use recursion to solve the problem.";`,
				},
				{
					type: "code",
					code: "print(sumRange(0));",
				},
				{
					type: "code",
					code: "print(sumRange(1));",
				},
				{
					type: "code",
					code: "print(sumRange(2));",
				},
				{
					type: "code",
					code: "print(sumRange(-1));",
				},
				{
					type: "code",
					code: "print(sumRange(10));",
				},
			],
		},
		{
			content: `
            <h2>Recursion vs. Iteration</h2>
            <p>
            Prior we have mentioned that a recursion without an anchor is similar to an infinite loop.
            Beyond that every recursion can be rewritten as a loop and vice versa, similar to for-loops
            being able to be rewritten as while-loops. This means, that recursion and loops are answers
            to the same problems - we don't "need" both. We simply choose which approach gives us the
            easier way to solve a problem. 
            </p>
            <p>
            Take the prior example of adding up y to x via recursion. We can simply solve this problem
            iteratively:
            <tscript>
            function add(x, y) {
                while (y > 0) do {
                    x = x + 1;
                    y = y - 1;
                }
                return x;
            }
            </tscript>
            </p>
            <p>
            <div class = "tutorial-exercise">
            Rewrite the function <i>sumRange(n)</i> iteratively. You might need a variable to cache the 
            intermediate result.
            </div>
            </p>
            `,
			correct: `
            function sumRange(n) {
                var res = 0;
                while (n > 0) do {
                    res = res + n;
                    n = n - 1;
                }
                return res;
            }`,
			tests: [
				{
					type: "js",
					code: `let program = parse(code).program;
                    if (! program) return "Failed to parse the program code.";
                    if (isRecursive(program)) return "Please don't use recursion to solve the problem.";
                    if (!hasStructure(program, "loop;")) return "Please use a loop to solve the problem."`,
				},
				{
					type: "code",
					code: "print(sumRange(0));",
				},
				{
					type: "code",
					code: "print(sumRange(1));",
				},
				{
					type: "code",
					code: "print(sumRange(2));",
				},
				{
					type: "code",
					code: "print(sumRange(-1));",
				},
				{
					type: "code",
					code: "print(sumRange(10));",
				},
			],
		},
		{
			content: `
            <h2>Trees</h2>
            <p>
            Trees are fractal structures which start with a root node. From there on every node can have
            any number of child nodes. The branches end with a final leaf node which has no more children.
            Drawing a tree can be achieved recursively. We start with the root node and a parameter <i>d</i>
            which indicates the depth of the remaining tree. Now we can draw our tree calling the 
            <i>drawTree</i>-function for every child of the current node. Once our depth parameter has
            reached 0, we have reached our recursion anchor. To draw a tree with 2 children per node, we
            could use the following code:
            <tscript>
            function drawTree(d) {
                if (d < 1) then return;
                turtle.move(50);
                turtle.turn(25);
                drawTree(d - 1);
                turtle.turn(-50);
                drawTree(d - 1);
                turtle.turn(25);
                turtle.move(-50);
            }
            </tscript>
            Drawing the tree recursively basically means iterating through its nodes node after node 
            beginning by the root and ending at the leaves. This way we can not only draw trees but
            iterate through tree-like structures - like dictionaries. Every node basically calls 
            the sub-tree, its children form. If we have a tree datastructure and want to iterate 
            through it to access the content of every node (i.e. to print it), we might use a 
            function looking like this:
            <tscript>
            function printTree(t) {
                if (Type(t) == Array) then {
                    for var i in 0:t.size() do {
                        printTree(t[i]);
                    }
                }
                else if (Type(t) == Dictionary) then {
                    for var k in t.keys() do {
                        printTree(t[k]);
                    }
                }
                else {
                    print(t);
                }
            }
            </tscript>
            If the handed over value is a tree-like structure, we call the sub-tree, else we print the given
            value. Since we access these two structures differently (index/key), we have to define different 
            cases. 
            </p>
            <p>
            <div class = "tutorial-exercise">
            Write a function <i>powerTree(t)</i> which expects a tree-like data structure containing numbers.
            Iterate recursively through the handed over structure t. If the handed over data is a number, print
            its value by the power of two. You can expect t to only be either an array, a dictionary or a number.
            </div>
            </p>
            `,
			correct: `
            function powerTree(t) {
                if (Type(t) == Array) then {
                    for var i in 0:t.size() do {
                        powerTree(t[i]);
                    }
                }
                else if (Type(t) == Dictionary) then {
                    for var k in t.keys() do {
                        powerTree(t[k]);
                    }
                }
                else {
                    print(t*t);
                }
            }
            `,
			tests: [
				{
					type: "js",
					code: `let program = parse(code).program;
                    if (! program) return "Failed to parse the program code.";
                    if (!isRecursive(program)) return "Please use recursion to solve the problem.";`,
				},
				{
					type: "code",
					code: "powerTree(10);",
				},
				{
					type: "code",
					code: "powerTree(-5);",
				},
				{
					type: "code",
					code: "powerTree(0);",
				},
				{
					type: "code",
					code: "powerTree([1, 2, 3]);",
				},
				{
					type: "code",
					code: 'powerTree({"a": 1, "b": 2});',
				},
				{
					type: "code",
					code: 'powerTree([1, {"a": 2}]);',
				},
				{
					type: "code",
					code: 'powerTree({"a": [1, 2, 3]});',
				},
				{
					type: "code",
					code: 'powerTree({"a": []});',
				},
			],
		},
		{
			content: `
            <h2>Wrap-up</h2>
            <p>
            The concept of recursion is nothing new and does not solve problems we otherwise
            couldn't solve but it helps us to solve some problems more efficient. In practice,
            you'll mostly see recursion used in work with tree-like data structures. Otherwise
            it is up to you to solve a problem recursively or iteratively. 
            </p>
            `,
		},
	],
};
