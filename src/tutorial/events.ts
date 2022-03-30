export const tutorial_events = {
	id: "events",
	title: "Event Handling",
	sections: [
		{
			content: `
			<p>
			TODO...
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
