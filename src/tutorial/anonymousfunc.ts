export const tutorial_anonymousfunc = {
	id: "anonymousfunc",
	title: "Anonymous Functions",
	sections: [
		{
			content: `
            <p>
            An anonymous function is a function without a name, basically being
            a value of type Function. We have already seen that it is possible
            to assign functions to variables, which is what we mostly do with 
            anonymous functions. We can also use anonymous functions as a return
            value from a function. This way we are able to dynamically create
            new functions. You can compare it to functions set known from 
            mathematics:
            <tscript>
            function f(m, b) {
                return function[m, b] (x) {
                    return m*x + b;
                };
            }
            </tscript>
            The square brackets are enclosed in the anonymous function. They are
            necessary, since every dynamically created function needs to save its
            own parameters <i>m</i> and </i>b</i>. This way we tell the programm to
            do so. Otherwise it'd try to access <i>m</i> and <i>b</i> from the original
            function from other scopes. This example allows us to create different 
            linear functions and store them in different variables. We are then able 
            to access these anonymous functions, just as we'd access normal functions:
            <tscript>
            var f1 = f(1, 0);
            for var i in -5:6 do {
                print(f1(i));           # prints -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5
            }
            </tscript>
            Another possible application is to hand over an anonymous function to 
            another function. For example, you can hand over a specific function
            to the <i>Array.sort()</i>-function to sort an array with any definition
            what is larger and smaller that you want:
            <tscript>
            var a = [5, 0, -10, 10, -5];
            a.sort();
            print(a);                       # prints -10, -5, 0, 5, 10

            var f = function(x, y) {
                if (x < y) then return 1;
                else if (x > y) then return -1;
                else return 0;
            };
            a.sort(f);
            print(a);                       # prints 10, 5, 0, -5, -10
            </tscript>
            </p>
            <p>
            In the first example, you have already seen closure variables. We not only
            need them if we create a function via another function, but everytime we 
            want to set any parameters inside of an anonymous function. The closure
            variables are independent on the variables they have gotten their value
            from:
            <tscript>
            var a = 1;
            var f = function[x = a] () {
                print(x);
            };
            f();                            # prints 1;
            a = 5;
            f();                            # prints 1;
            </tscript>
            If we hand over a container, the content of it can change, though. We can 
            assign any kind of value to our closure variables. In the first
            example of this chapter, we already used an abbreviation:
            <tscript>
            var a = 1;
            var f = function[a] () {
                print(a);
            };

            var g = function[a = a] () {
                print(a);
            }
            </tscript>
            Function f uses the abbreviation for the assignment, we explicitely do
            in function g.
            </p>
            <div class="tutorial-exercise">
			<p>
            Create an empty array <i>functions</i>. Run through a <i>for-loop</i> ten
            times and add an anonymous function to the array every run. The anonymous 
            function shall take <i>a</i> as a closure variable and assign the current
            loop counter to the power of two to it. It shall also take <i>x</i> as a
            parameter and return <i>a*x^2</i>.
			</p>
			</div>
            `,
			correct: `
            var functions = [];
            for var i in 0:10 do {
                functions.push(function[a = i*i](x) {
                    return a*x*x;
                });
            }`,
			tests: [
				{
					type: "js",
					code: `let program = parse(code).program;
                    if (! program) return "Failed to parse the program code.";
                    if (! hasStructure(program, "loop;")) return "Use a loop to solve the problem!";
                    if (isRecursive(program)) return "Please don't use recursion.";`,
				},
				{
					type: "code",
					code: "print(functions[0](2));",
				},
				{
					type: "code",
					code: "print(functions[1](5));",
				},
				{
					type: "code",
					code: "print(functions[9](10));",
				},
				{
					type: "code",
					code: "print(functions[5](0));",
				},
				{
					type: "code",
					code: "print(functions[5](1));",
				},
				{
					type: "code",
					code: "print(functions[5](-5));",
				},
				{
					type: "code",
					code: "print(functions[5](5));",
				},
				/*{
                    "type": "code",
                    "code": "print(functions[10](0);",
                }*/
			],
		},
		{
			content: `
            <h2>Event management</h2>
            <p>
            A final application for anonymous functions is handling events. Imagine 
            using a phone application where something happens when you touch a certain
            screen area. This touch can be seen as an event happening. In the background
            of the application an event listener runs and tells the application if a
            specific event has taken place. Then a specific function is called to react
            to the occured event. In Tscript we encounter event handling working with
            the canvas. There exist different types of events which you can find 
            <a href="https://info1.ini.rub.de/TScriptIDE.html?doc=/library/canvas">here</a>.
            We set an event handler that listens to a specified event and hand over
            an anonymous function that will be executed everytime the event occurs:
            <tscript>
            setEventHandler("canvas.mousedown", function(event) {
                print("mouse down!");
            });
            enterEventMode();
            </tscript>
            Everytime the user presses his left mouse button, the program will print
            a message. The <i>enterEventMode()</i> is necessary to tell the program
            to start listening for events. A function that shall be executed by an
            EventHandler always has to take one parameter. This parameter contains 
            possible information each event carries. <i>canvas.mousedown</i>, i.e.,
            hands over the position (x, y) of the mouse click, which can be accessed
            via <i>event.x</i> or <i>event.y</i>. Note that the program is halted once 
            the event mode is entered. You'll have to explicitely finish listening for 
            events. This can look like this:
            <tscript>
            setEventHandler("canvas.mousedown", function(event) {
                print("mouse down!");
            });
            enterEventMode();
            wait(60000);
            quitEventMode();
            </tscript>
            In this example the program listens for 1 minute and afterwards quits the
            event mode.
            </p>
            <div class="tutorial-exercise">
			<p>
            Set an EventHandler for the "canvas.keydown" event. Hand over an anonymous 
            function which prints the key, the user has pressed down. The keydown-event
            carries the <i>key</i>-attribute. Quit the event mode after the event has been
            called.
			</p>
			</div>
            `,
			correct: `
            setEventHandler("canvas.keydown", function(event) {
                print(event.key);
                quitEventMode();
            });
            enterEventMode();
            `,
			tests: [
				{
					type: "code",
					code: "",
					input: [
						{
							type: "canvas.keydown",
							classname: "canvas.KeyboardEvent",
							event: {
								key: "h",
								shift: false,
								control: false,
								alt: false,
								meta: false,
							},
						},
					],
				},
				{
					type: "code",
					code: "",
					input: [
						{
							type: "canvas.keydown",
							classname: "canvas.KeyboardEvent",
							event: {
								key: "x",
								shift: false,
								control: false,
								alt: false,
								meta: false,
							},
						},
					],
				},
			],
		},
		{
			content: `
            <h2>Wrap-up</h2>
            <p>
            You have learned about anonymous functions and their applications. They can be
            used to create similar functions with different set parameters using closure
            variables. Furthermore you have learned to deal with events, handling them
            via event listeners and calling anonymous functions. Note that you do not have
            to use anonymous functions. You can also simply create a function and hand it
            over instead of an anonymous one. Anonymous functions give you the possibility
            to create cleaner code, though. If you do not need to use the code multiple
            times, you do not need to create a new function for every event you want to 
            handle. It might be cleaner to simply hand over anonymous functions.
            </p>
            `,
		},
	],
};
