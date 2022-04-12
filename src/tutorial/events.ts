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
			function, acting as sub-programs. However, this paradigm assumes that
			the whole program runs immediately when started all the way to the end.
			</p>
			<p>
			That is often what we want, but not always. When our goal is to
			implement a graphical application interacting with the user, we would
			like to be able to react to user input, like a key press of a mouse
			click. Our programs (sub-programs) shall run <i>in response to such
			events</i>. The ability to do that would put us into the position to
			implement a proper Graphical User Interface (GUI).
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
					return from the call to <code>enterEventMode</code>. The
					optional parameter of <code>quitEventMode</code> becomes the
					return value of <code>enterEventMode</code>.</li>
			</ul>
			To illustrate this better, let us look at an example:
			<tscript>
				function onClick(event)
				{
					print("Mouse click at canvas position " + event.x + "/" + event.y);
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
			</p>

			<h2>Event Names</h2>
			<p>
			We did not discuss where the event names like
			<code>"canvas.mousedown"</code> come from. They are rather arbitrary,
			and in order to use events, we need to know these names. There is a
			timer event, which is evoked up to 60 times per second. Its name is
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
			documentation. Trial and error is a good way of getting to know events
			better. Also, the keyboard handers are well suited for teaching you the
			names of the keys of your keyboard.
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
