export const tutorial_events = {
	id: "events",
	title: "Event Handling",
	sections: [
		{
			content: `
			<p>
			Until now, our programs consist of a number of commands executed in
			sequence. We know how alter the program flow using control structures
			like loops and conditional statements, and how to redirect it into
			functions, acting as sub-programs. However, this paradigm assumes that
			the whole program runs immediately when started all the way to the end.
			</p>
			<p>
			That is often what we want, but not always. When our goal is to
			implement a graphical application interacting with the user, we would
			like to be able to react to user input, like a key press of a mouse
			click. Our programs (sub-programs) shall run <i>in response to such
			events</i>. The ability to do that would put us into the position to
			implement a proper Graphical User Interface (GUI). In a more general
			setting, when not restricted by the sandboxed TScript (browser)
			environment, we may also wish to react to other events, like incoming
			network traffic or the completion of an asynchronous disk or memory
			transfer process.
			</p>
			<p>
			Every TScript program is always in one out of two modes: either in its
			normal mode, where commands are executed one after the other until the
			program halts, or in <i>event mode</i>. Being in event mode means that
			the program waits for events (like mouse clicks) and then processes
			these events. Processing simply means that a function is called. In
			other words, we can put a TScript program into a waiting mode in which
			it waits for events to occur, and when an event happens then TScript
			notifies our program of the event by calling a function, which allows us
			to execute arbitrary code in response to the event.
			</p>
			<p>
			The following three functions are relevant for event handling:
			<ul>
				<li>The function <code>setEventHandler(name, handler)</code> tells
					TScript that we are interested in handling a specific event.
					Events have names (strings), like <code>timer</code> and
					<code>canvas.mousedown</code>. The second argument is a function
					that will be called each time an event of the given type occurs.
					</li>
				<li>The function <code>enterEventMode()</code> puts the program into
					event handling mode. It does not return immediately, but instead
					it blocks the program flow. From then on, the program reacts to
					events and calls the handler functions defined by means of
					<code>setEventHandler</code>.</li>
				<li>The function <code>quitEventMode(value = null)</code> stops the
					event mode. Since the only code that runs in event mode are
					event handlers (and functions called from there), this function
					must be called in response to an event. For example, one may
					decide to quit event mode when the user presses the escape key
					on the keyboard. Calling this function makes the main program
					return from the call to <code>enterEventMode</code>, and
					continue from there. The optional parameter of
					<code>quitEventMode</code> becomes the return value of
					<code>enterEventMode</code>.</li>
			</ul>
			To illustrate the process better, let us look at an example:
			<tscript>
				function onClick(event)
				{
					print("Mouse click at canvas position " + event.x + "," + event.y);
				}
				function onKey(event)
				{
					if event.key == "Escape" then quitEventMode();
				}
				setEventHandler("canvas.mousedown", onClick);
				setEventHandler("canvas.keydown", onKey);
				enterEventMode();
			</tscript>
			Give it a try! Click the canvas at a few times at different positions
			and then press the Escape key to stop the program.
			</p>
			<p>
			Notice how the control flow of the program works:
			<ul>
				<li>In the main program, two functions are defined (but not called).
					Then we tell TScript that we want to use them as event handlers
					for the events <code>"canvas.mousedown"</code> and
					<code>"canvas.keydown"</code>. These events are "mouse button is
					pressed down" and "keyboard key is pressed down".</li>
				<li>Next, the call to <code>enterEventMode()</code> takes place. It
					is the last command in the program, but the program does not
					stop yet. In a sense, the contrary is the case: it has just
					stared. This is because the function does not return, but
					instead puts the program into event mode. That mode lasts
					potentially indefinitely.</li>
				<li>Whenever a mouse click is registered on the canvas, the function
					<code>onClick</code> is executed. This can happen any number of
					times, depending on the actions of the user.</li>
				<li>Whenever a keyboard button is pressed (while the canvas holds
					the keyboard focus, which can be enabled by clicking the canvas),
					the function <code>onKey</code> is executed. Also this can
					happen any number of times, depending on the actions of the
					user.</li>
				<li>In the last case, if the key is the escape key then the function
					<code>quitEventMode</code> is called. This stops event handling
					(after the handler returns) and hence makes the call to
					<code>enterEventMode()</code> above return.</li>
			</ul>
			Note that the function names <code>onClick</code> and <code>onKey</code>
			are not relevant. In principle, we could rename them as we wish.
			However, naming them according to the event they process is usually a
			helpful convention.
			</p>

			<h2>Event Names</h2>
			<p>
			We did not discuss where the event names like
			<code>"canvas.mousedown"</code> come from. They are defined by TScript.
			In order to use events, we need to know these names. There is a timer
			event, which is evoked up to 60 times per second. Its name is
			simply <code>"timer"</code>. All other available events belong to the
			canvas. A list of these events can be found in the
			<a target="_blank" href="?doc=/library/canvas">canvas documentation</a>.
			In the documentation, scroll down all the way till the section
			"Managing Events". There is a table that lists all event names.
			</p>

			<h2>The Event Parameter</h2>
			<p>
			The same table also lists the event types. Each event is described by a
			parameter. Therefore, in TScript, each and every event handler function
			takes exactly one parameter, which is conventionally called
			<code>event</code>. In most cases, this event is an object. Below the
			table, the documentation provides further details on the classes
			describing the various mouse and keyboard events.
			</p>
			<p>
			You may also wish to try a few of the example programs from the
			documentation. That's a good way of getting to know events better. Also,
			the keyboard handers are well suited for teaching you the names of the
			keys of your keyboard.
			</p>

			<div class="tutorial-exercise">
			<p>
			Set an event handler for the <code>"canvas.keydown"</code> event. In the
			event handler, print <code>Hello World!</code> if the user presses the
			space bar, and stop the event loop if the user presses the escape key.
			To this end, evaluate <code>event.key</code> to obtain the name of the
			pressed key.
			</p>
			<p>
			<b>Note:</b> When testing your program, first click the canvas with the
			mouse. This way you ensure that it holds the keyboard focus and is hence
			receiving keyboard events.
			</div>
			`,
			correct: `
			function onKey(event)
			{
				if event.key == " " then print("Hello World!");
				if event.key == "Escape" then quitEventMode();
			}
			setEventHandler("canvas.keydown", onKey);
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
						{
							type: "canvas.keydown",
							classname: "canvas.KeyboardEvent",
							event: {
								key: " ",
								shift: false,
								control: false,
								alt: false,
								meta: false,
							},
						},
						{
							type: "canvas.keydown",
							classname: "canvas.KeyboardEvent",
							event: {
								key: " ",
								shift: false,
								control: false,
								alt: false,
								meta: false,
							},
						},
						{
							type: "canvas.keydown",
							classname: "canvas.KeyboardEvent",
							event: {
								key: "z",
								shift: false,
								control: false,
								alt: false,
								meta: false,
							},
						},
						{
							type: "canvas.keydown",
							classname: "canvas.KeyboardEvent",
							event: {
								key: " ",
								shift: false,
								control: false,
								alt: false,
								meta: false,
							},
						},
						{
							type: "canvas.keydown",
							classname: "canvas.KeyboardEvent",
							event: {
								key: "Escape",
								shift: false,
								control: false,
								alt: false,
								meta: false,
							},
						},
						{
							type: "canvas.keydown",
							classname: "canvas.KeyboardEvent",
							event: {
								key: " ",
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
			<h2>Timer Events</h2>
			<p>
			The timer event was mentioned before. For example, it can be used to
			run animations. The following program uses a timer event to move a red
			call across the canvas:
			<tscript>
			var position = -20;
			function onTick(event)
			{
				canvas.setFillColor(1, 1, 1);
				canvas.clear();
				canvas.setFillColor(1, 0, 0);
				canvas.fillCircle(position, position, 20);
				position += 1;   # speed: 1 unit per 1/60 second
				if position > canvas.width()+20 or position > canvas.height()+20
				then quitEventMode();
			}
			setEventHandler("timer", onTick);
			enterEventMode();
			</tscript>
			The ball should slowly move down diagonally. We can make it move faster
			by changing the speed in the program.
			</p>
			<p>
			The handler <code>onTick</code> does not make any use of its parameter
			<code>event</code>. Indeed, for timer events, the parameter is simply
			the value <code>null</code>, and hence pretty much useless.
			</p>

			<h2>Keyboard Events</h2>
			<p>
			We have already seen that key presses cause the event
			<code>"canvas.keydown"</code>. Using these events to do something
			non-trivial like entering a text into a text editor is a lot of work.
			Also, not all keyboards (in all countries) have the same keys, and it
			is questionable whether one should rely on the existence of specific
			keys. Finally, TScript does not provide a translation from keys to
			characters, which can be a complicated process (think of so-called
			<a target="_blank" href="https://en.wikipedia.org/wiki/Dead_key">"dead" keys</a>).
			</p>
			<p>
			In this sense, TScript keyboard events are quite limited. They are not
			intended for complex text operations, but rather for simple uses, as
			commonly encountered in games.
			</p>

			<h3>Advanced Use</h3>
			<p>
			Next to <code>"canvas.keydown"</code>, there is a corresponding event
			<code>"canvas.keyup"</code>. With both events in place, we can track
			the state of the keyboard. For example, in game, we may wish to control
			a character or object with the keys w, a, s, and d. To this end, we need
			to keep track of which of these keys are currently pressed, and which
			ones are not.
			</p>
			<p>
			We should <i>not</i> be tempted to perform the movement in the key
			handler! That would only move the character on each key press, which
			forces the user to press the key repeatedly. Instead, the correct
			technique is to maintain the state of each key in a variable, and to
			perform the corresponding movement with fixed speed. We have seen a
			fixed-speed movement before, namely using a handler for the
			<code>"timer"</code> event. The following example demonstrates how to
			elegantly combine timer and keyboard handlers for controlling a simple
			agent (the already familiar red ball).
			<tscript>
			var x = 100, y = 100;
			var key = {w: false, a: false, s: false, d: false};
			function onTick(event)
			{
				canvas.setFillColor(1, 1, 1);
				canvas.clear();
				canvas.setFillColor(1, 0, 0);
				canvas.fillCircle(position, position, 20);
				if key["w"] then y -= 1;
				if key["a"] then x -= 1;
				if key["s"] then y += 1;
				if key["d"] then x += 1;
			}
			function onKeyDown(event)
			{
				if event.key == "Escape" then quitEventMode();
				if key.has(event.key) then key[event.key] = true;
			}
			function onKeyUp(event)
			{
				if key.has(event.key) then key[event.key] = false;
			}
			setEventHandler("canvas.keydown", onKeyDown);
			setEventHandler("canvas.keyup",   onKeyUp);
			setEventHandler("timer", onTick);
			enterEventMode();
			</tscript>
			You should see a red ball, standing still. If you press w, a, s or d
			then the ball starts moving. Try pressing multiple keys at once.
			</p>
			<p>
			This pattern generally works well for games. Most of the work is done in
			the timer event, namely moving all thing that move (character, monsters,
			balls, whatever), taking the keyboard state into account.
			</p>

			<h2>Mouse Events</h2>
			<p>
			The world of mouse events is more rich that that of keyboard events, for
			the simple reason that the mouse has a position. Similar to a keydown
			event, the mousedown event knows which button caused the event. However,
			that button is not a keyboard key, but a mouse button. In addition to
			that information, it also knows at which coordinates the button was
			pressed. Like with the keyboard, there is a corresponding event called
			<code>"canvas.mouseup"</code> which signals that the mouse button was
			released.
			</p>
			<p>
			A second reason why mouse input differs from keyboard input is that mouse
			movement can be of interest of its own, independent of mouse button
			presses. Therefore, <code>"canvas.mousemove"</code> events occur in fast
			succession while the mouse is moved across the canvas. Finally, the
			<code>"canvas.mousemove"</code> event is fired when the mouse leaves the
			canvas. As soon as the mouse enters the canvas again, further
			<code>"canvas.mousemove"</code> events are triggered.
			The event object of mouseout is simply <code>null</code>, like for the
			timer. All other mouse events carry the current mouse position, which is
			available as <code>event.x</code> and <code>event.y</code>.
			</p>

			<h3>Advanced Use</h3>
			<p>
			We can use mouse events to display and handle proper controls, like
			buttons. A good button should indicate that the mouse is hovering over
			the control, and it should also indicate visually that the button is
			currently pressed. This is typically achieved with a combination of
			background and border colors. The following program demonstrates the
			working principle. Note the color changes when hovering the mouse over
			the button and when actually pressing the button.
			<tscript>
			function onButton()
			{
				print("The button was pressed!");
			}

			var pressed = false;
			function drawButton(hover)
			{
				canvas.setLineWidth(2);
				if pressed then
				{
					canvas.setLineColor(0, 0, 0);
					canvas.setFillColor(1, 0.5, 0);
				}
				else if hover then
				{
					canvas.setLineColor(0.6, 0.6, 0.6);
					canvas.setFillColor(0, 0, 0.5);
				}
				else
				{
					canvas.setLineColor(0.8, 0.8, 0.8);
					canvas.setFillColor(0.2, 0.2, 1);
				}
				canvas.frameRect(100, 100, 100, 30);
				canvas.setFont("Helvetica", 14);
				canvas.setTextAlign("center");
				canvas.setFillColor(1, 1, 1);
				canvas.text(150, 110, "Do it!");
			}
			function inside(event)
			{
				return event.x > 100 and event.x < 200
				   and event.y > 100 and event.y < 130;
			}
			function onMouseDown(event)
			{
				pressed = true;
				if inside(event) then
				{
					drawButton(true);
					onButton();
				}
			}
			function onMouseUp(event)
			{
				pressed = false;
				drawButton(inside(event));
			}
			function onMouseMove(event)
			{
				drawButton(inside(event));
			}
			function onMouseOut(event)
			{
				pressed = false;
			}
			setEventHandler("canvas.mousedown", onMouseDown);
			setEventHandler("canvas.mouseup",   onMouseUp);
			setEventHandler("canvas.mousemove", onMouseMove);
			setEventHandler("canvas.mouseout",  onMouseOut);
			drawButton(false);
			enterEventMode();
			</tscript>
			Putting everything together, in principle, it is possible to implement a
			whole graphical user interface (GUI) framework with different types of
			controls, like checkboxes, sliders, scroll bars, and more. On the other
			hand, we could rightfully ask whether that job has not been done yet by
			others. Since we are working in the browser, and browsers apparently
			provide such controls, the need to re-invent the wheel feels wrong.
			Again, here we see that the TScript canvas is not designed for complex
			GUIs, but rather for learning the basics of programming. It is well
			suited for simple games and drawing applications, which get along with
			"raw" events like mouse movements and clicks.
			</p>

			<div class="tutorial-exercise">
			<p>
			Write a program that draws a trace of the mouse on the canvas.
			Whenever the mouse enters the canvas, a trace begins. The program
			shall simply connect consecutive mouse positions by drawing a line.
			For the first mouse move event or if the mouse just entered the
			canvas, no line in drawn. Pressing a mouse button shall stop the
			program.
			</p>
			</div>
			`,
			correct: `
			var x = null, y = null;
			function onMove(event)
			{
				if x != null then canvas.line(x, y, event.x, event.y);
				x = event.x;
				y = event.y;
			}
			function onOut(event)
			{
				x = null;
				y = null;
			}
			setEventHandler("canvas.mousemove", onMove);
			setEventHandler("canvas.mouseout", onOut);
			setEventHandler("canvas.mousedown", quitEventMode);
			enterEventMode();
			`,
			tests: [
				{
					type: "code",
					code: "",
					input: [
						{
							type: "canvas.mousemove",
							classname: "canvas.MouseMoveEvent",
							event: {
								x: 100,
								y: 100,
								buttons: [],
								shift: false,
								control: false,
								alt: false,
								meta: false,
							},
						},
						{
							type: "canvas.mousemove",
							classname: "canvas.MouseMoveEvent",
							event: {
								x: 120,
								y: 100,
								buttons: [],
								shift: false,
								control: false,
								alt: false,
								meta: false,
							},
						},
						{
							type: "canvas.mousemove",
							classname: "canvas.MouseMoveEvent",
							event: {
								x: 130,
								y: 110,
								buttons: [],
								shift: false,
								control: false,
								alt: false,
								meta: false,
							},
						},
						{
							type: "canvas.mouseout",
							classname: "Null",
						},
						{
							type: "canvas.mousemove",
							classname: "canvas.MouseMoveEvent",
							event: {
								x: 100,
								y: 200,
								buttons: [],
								shift: false,
								control: false,
								alt: false,
								meta: false,
							},
						},
						{
							type: "canvas.mousemove",
							classname: "canvas.MouseMoveEvent",
							event: {
								x: 120,
								y: 200,
								buttons: [],
								shift: false,
								control: false,
								alt: false,
								meta: false,
							},
						},
						{
							type: "canvas.mousemove",
							classname: "canvas.MouseMoveEvent",
							event: {
								x: 130,
								y: 210,
								buttons: [],
								shift: false,
								control: false,
								alt: false,
								meta: false,
							},
						},
						{
							type: "canvas.mousedown",
							classname: "canvas.MouseButtonEvent",
							event: {
								x: 10,
								y: 10,
								button: "left",
								buttons: ["left"],
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
			<h2>Resizing</h2>
			<p>
			There is one further event provided by the canvas, namely the resize
			event. It is invoked whenever the canvas changes size, i.e., when the
			canvas panel is put into full size mode, when the browser size changes,
			and so on. The usual way to handle this event is to redraw the whole
			application.
			</p>

			<h2>Wrap-up</h2>
			<p>
			We have learned the basics of event-based programming. We know how to
			put TScript into event-handling mode, and how to return to normal code
			execution. We have worked with mouse, keyboard, and timer events.
			Combined with canvas drawing, this gives us all essential tools for
			building simple games with TScript.
			</p>
			`,
		},
	],
};
