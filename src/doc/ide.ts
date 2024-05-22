"use strict";

import { Documentation } from ".";

export const doc_ide: Documentation = {
	id: "ide",
	name: "The TScript IDE",
	title: "The TScript Integrated Development Environment (IDE)",
	content: `
	<p>
	TScript is not only a programming language, it also comes with a
	fully fledged integrated development environment (IDE). The IDE
	includes a code editor and powerful debugging facilities.
	</p>
	<p>
	In principle, the IDE can be decoupled from the programming language,
	and a single IDE can be used for a multitude of languages. However,
	providing a default IDE for the language has advantages for
	beginners. No choices need to be made. More importantly, there is no
	friction in setup and configuration processes.
	</p>
	<p>
	The TScript IDE main window consists of a toolbar at the top and an
	area holding several panels. The panels can be docked to a wide area
	on the left or to a more narrow area on the right. They can also
	float around freely on top of docked panels, one panel can be
	maximizied on top of all others, and panels can be reduced to icons.
	All of this is controlled with the buttons in the title bar of each
	panel. Panels can be resized by dragging the lower and right edges.
	</p>
`,
	children: [
		{
			id: "toolbar",
			name: "Toolbar",
			title: "Toolbar",
			content: `
		<p>
		The IDE has a toolbar at the top. It features a number of central
		controls.
		</p>
        <p>
        <center>
        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABEEAAAAiCAMAAAHwlweXAAAAUVBMVEX09PTv7aTx7pjk5OT+8wDi3o7V1tbKy8rAvb2VypWdp/SpqanRoCQn+QCIiIPiPf8SyzphlnKnZwg4a9L/JgEFmAoBdnXPIAgESP9DPysEBhJkqNPzAAAOr0lEQVR42uyci5qiuhKFS9KpgGEY0YmQev8HPalKlLtIt3YzZ8//TUNIKhjK5SIG9wZ8inYMvhxA5RWqAF4uiOpyMRhQSioBuIBcTwAX4kqK0YgfyoWdRWNJYnT2FBiA4zG+TFUpRQpUrXgk4FBl2WgkTqFqGoCmiSNpKY6qbYkbZCROORmJJ4k5ZIEyu8q/jMd1DjvK6qYpM9K6PxKL8WXqWikiKE5KcuLiVRoZyXU+J4oAWlJ4OS7lJI2E/63nBHCQE1fwSPYC4DO071csQBIsKwTM5cJ5/qUChit5z/m/kLxBJvzF6AAoI3tFVjKdPYXGgGHBWkQFCgiUcuo3ADiFOivTQD7iQJxThlWpmjiQVqWBtEoqMXBXEPnJQGqWbOFFskWsIC2FgwzEQhxIrkCRUiceiHe2n5E/sxlRnJGWB/LFjKSBQDeQipRy9e/dqBUQlICohgVAowSDwq97gLkFQBdgEWfq1eTcwseNrqPhP0zol4KR8WhRRWCw+y0ZsQAyaq29l8IF4IickUsFl35GXMpIE+Ar58IoI3RLMt0yQjEjTS8j4JyrWWGpoyUlSkscskWu2SJlP6IYiFIA470H08uIBcupqIh451ztUkbAA3hEdQ79fcrIJWbkkn98KiPHlJH2axmRqyTZXnXY1mHXyPUWZy+udCb2hlDZSJSv9ZUo0/MZARhmxOeeU0EEvCtOJ9bIz3xqIFoULnxqDi9l86fmZbRPgLsH/owFMdHMHxSW3/hfKLRd/ZKWWkQ7MFami0/k+pXkOP8qv5VgOoUwkhDr/SAheAmImzAbEhKCiWLHiigmhAgnCUElhgT3hBB6JIUJm70Siwl1ZPoJyXNOCBHFhJxSQiyA5YRUfKORhBwBYkLgAP2EOEwJaVQjCWFb7RLSmSi7Kqmez3JkPyEu0EsIWmVxc0Kuw2m6zjrKuYSA9wC9hFQAFSuEqFJ8ca6ICfFQuZoTws6NQ4X4cpAQ5x4npD2OEhJsYzYhjOsS4hUpP5eQomwyvrfwtiCpyc7XePEUE0J8BwpQ0XhOS8PF+YRY5fsJsbmVhAARK+R0creEnOAkCgnd00cGUkKOvtygEPVChUwTolNCfKYHCamjHrxuvLQvJwSg7ickz61NH5lhQrwDNzDVm0K44O0mU00e0kYPCYWveYiOW3qJhwDT95CqUt1HBpWrY0IC5nvvMpjqF+4y9vBK7NpdZsBL5yG4yt8wD8E/rwB7/PoU2PGSxP0d6f8Rfm9AFAKqB8h3iz4GEddChgoZxSszjgechCSFWBTaafz2U2LbP+VHanYmxX9grzmdzpIiGzuPsHq/WBwBCs0NvF9LDOvcM1eCGb65ECsLJXQKsTkA2PvbX2mt/UAheDlC4HjBFMKrbMzlsqAQHL+dTdPIX/d2NsKCQtrbLeEef0wVOFAIBrYoxDmzoBBLRJ6I7JxCsv0yoxAD/IYiAJhZhXiI+KgQZADuCkGek2GnEOkwUohPVI8UkpflskJcwHxJIS0ODeL4jIc0zIJCnBJqZ2YUYohIWbKKiMxUIYdsSllSkTX+mhFlWUMllzWR1HviiCu3eJ5M0zUc6iLsOPpMReguW47QobrUISwQ+9ddwzVrCjkoqSyyKYdZhXhvwfolhVhjbF1Za5OHQIQLkqATS2SkEOMcOGdvCikzwXcechHH6CmEJVJ/lO9SiFpXSPvTCuH3vJGVXGr4sGE5ZNdSZ8QrntyiC031OWPhcHR25qYmNHA8yyLAG+7UhEoOk6I0FFEychBq9fMKYXBRIZUxeW2traJCYKgQd5pTiD8BwMknhXgdsX2FXMYKCb5y8R/le+4yanqXaVuFTKeQ9vjuu8y6h2RZ5yEZuwMNFZJRqDh3CpFoX4uH6L6HcHc+lmLfQ8p6u4cA1L5avsvkxrCF+KSQlMWeh7iBQoTaOVd/YqZq82+bqbbH8Snbb5upHrK9cnjDTLVOjb93+23X5H34Gic16yEt9viYgIJCZtp5RH7YLzn2Wb+W3xvAHf1OpE+7zv/HY7H9s1MLwS/zb8Fsge3rZZtXx6YhSSA2CgQ/sdo1Esg0fvspV+4x/SHfTofyTzqPmnO9W/LhYCeJmAgEBs3D6OHRf0ogqdml+FmBECLNC0TvmBmBmDsbBZIrocCxQDzzQCCXG91X3wS+SSD8WhUFbvHy6hTA/iklZItA3JJALClJAtk5gWS7ZU4g+TGRLwjEVLwgkgQCxPQE4k5uJBDvAaATiNf6HEMny+vjFfglgdQTgTQNYtMM1kaEWYFMl9enK/ACMpsE4pYchBLq/0AgkJgXCFYgVBgFggz0BXIaCsTDRCD67AOPBVI9EIhz9dcFIm9aJxCh7yCjECZvmnxBIIVjlHOzAvHoSU4XCq8SyDlboMwe/eCWJqEJel4gPlAtCUTlHgLeRgdJFgJRIOhy5xy6uicQYAYC8YlHAkH9US0LJFB/SSDtZbK4vn7XwiaASwK5mcisQIiM8l4ZomcFQkRZVlHWyIOV65XLnmquj09XzmVo0UQcKh0aWRO9xsMrb+8PZchLiJbWGCYNZdjeojYJBMCbBYGY3JjaW2tNEkgiOYg8jynUSCDeOY83gZQpIf7xHKT8uC4KRMg/L5A2sOIgLTN0ENsE7GOBoKvnbzF8ctk9KxB2AfmF23lU1nEV/swx19By7jroIrSWt6OyyEodQn1cn+c/rbmo6/ish8pwKFG0yUGstWDqRQeprLFVHR2EIWYgkHwkEO8AnL8JxGcR2xMIAAwFAsoGhbzLQdS6gxx/2EGu/JbVLIVSswxCWVM9FohnjXgqOklkdXnrfiaiggIZSYW+hxFRTVl0khjFMto0B7HVgkBya0xVWVvlIhB4xkEc8AaHAinV4OncWCAXCAqp3zMHEVYc5Hj82TkIRVGUOjlIFIufOIi+SnBykHrgIDo6SJMEknHr3Wj4bGUIKPVmBwnkHpYcxNhKHvqPvsWMHWRZIKUW/JpAVLjLVG/5FsOsPb49tu2PfoshiveFhrTMQbhMVOqBQOQRb6jWN0WVFEQwnYNIm8xBpPjVOQiA97AkEMuP/K21lU0Oggz0BOKGDuK9J7nFLC+Ujecgysjh9do0b1soG6+DtO1xsA4SKtqfXAehQbkssll2+DWX10FyWxk19y1GuaJmo+0EIqBMUrevpKL9vpXUdvoLgO9aST3s9oH/4fCGlVQ3t9SO+F9Yak+Yjc9iDjvmlc9ikkDwr/tByPZfiDz3sE5hwgw7D9j3D0L+k78H2dFZ/uPsUyC7pN0V+I9/7AFA/LMbsI/FO7++kYUhiIOggkUUCt8U0rZLo/xYB3tYiyPU6uA6Jp1Nbv+xndysZHZFEWudf7+Ju4OAWgIMCuYbQh45SOy88gIvCHnsIBvO/86QFQcZ9nZm1HnFQbrOnnzaJmBF5zv/L5n3jF3J7Ioi1h0EHvQ2jxpBLTLvIHjjk/aAY54I+VsdZO4avxDyJgdxzmx3EGuVQiKjDBHy4fMOsuPf3u2Upx3E5FPMVgdB62tvceIggHega8xB3cldAB87iPUeBOun9lD5SP7AQVAe+t44hiN8IuTvcpC2TU8tK0r0rvHZkI4u5D0OwpiNDmKJqPIU8TxC+6SD/POPz/C0g8AdBGGTg2BeVQYipqpyHDgI3Zl3EHSngHvkINbn8NBBtHD2VeIrDmLVJx3Eudqs2EPDoELZL4Z0bHSQo+qomKmDrIQIz4ZgbnPc6iB5kXDO1ewhWxwk+VrFnYyUlNqhg5yv2UZ0nQrl5q4l6cWm60KP4g0O4i3YyteV/YSDVNIroWxddQ7CQF7dyGHoIHVtFDoXDKRWqnDFvIN4Zt1BOvxXHMQcdFl9ykGE2vykg3QOQcyigyyHJNZD8iaSb3OQwnUoFA951kGQiLy4RqKSY8KnHOSQMTt1kPK6Swc5bHGQgDWmCtvNDqKMyW1VIWAV/x9TIwep6EY1chBRUJyDBGpccBBIGO+JvJ1zEF/qPt5O7GEMqoUQX358lP7yOQcRavwxBwlEk/ArDrIYIqyH5M2NfKuDqD7iIc/OQdB4ojQsLwbnDSr1UgcpiXSm+UPW8Eb7K9cVt8L1Xs8bKqSq6yScqeYq3Q/SnbFoCZYYeZlr30Ho2lVzVzmSvl0bk4L+187ZLTcIAlHY1hFsyDBZpyRd3/9BS4/WDamCP2NSE89NFI6Q6ejXXVyCEmEYpUW68GWLq7EqzLwWQQAPZdhOJUjJttReBiIuA4L0pTKSxWh3aoSlkChBbO0cjDX9IUhVhf8EKJ9LEGHI5gjitZQgsLw6QYr2+bwQ4om2EQc4vVBHgvoMPx5P6YAVTWLCGYQemHCAy4QgMl1rbU0VZpJJACf5vkBJO5p0nSu0dWM13mINgnRSmnlGDKJLy9ZYJuOVTyAICUE+4gRh5+U/nRffEOTIRZC98QAesiaVwXHEUhoCQzaWxXgtzWJgee0sZiRB2tMoQcQEXWCaQBBxB6yQ5qAVB2HXGaGOZFXrEeTQSTObqQTRlhCElMbLEunESuosguTsTlmjk2MdEiQMQYrK5osIkuVlE4fYTa2kQsmVVAQpScvzraSOJojkEfTen8WAIMhL4jGImNACpxBE0g109WYxTDiDISBIl9x0rdIiXRjiLGPBXPBqMYhhLzvjXQxSGEtYifVSAUFspz6CfLhfgDg1Pwa5VU89iAYevIQgCQsfj58Xs6G3ua0Sb3O/fnQYYXmyt7lTYpBhVfT+QppKEM+CfObbXDJtDGLJlmrsSipiWnJe+NADBFGNSNZBZhWcqlBJizFc05bqQcbVgmGlJG15uoqyxQSpaq/XKit5e3xFGY6u7sVbgmhCSRkSGFL9BBEZ/pG5V1W70tuqKBs3/mGE5Qmr2t92zdG/rWovr/oU0VBVu8qGpLSC9OqWNEFUlphgsSVJkPT4d7CkCJL4MycIErt4J8hDCJK+Ix61s+5/781Vj96bGwpPrY5IQXexCEGgyXtzo0rMHGrfm7vO3txQ6TtiyeXRzsS8+++DjNb++yC7dvXpG6XtxpRz/1tgAAAAAElFTkSuQmCC"/>
        </center>
        </p>
		<p>
		The four leftmost buttons manage files (red). They create a new
		document, open a document from a file, save to file, and save
		under a different name. Currently, documents can only be stored
		in the local storage of the browser.
		<div class="warning">
			Local storage is not a safe place to store data! It can be
			cleared at any time by the browser, and it is actively
			cleared by some plug-ins when removing cookies. Do not rely
			on your source code being safely stored when using this
			technology!
		</div>
		Furthermore, when opening TScript from multiple locations on the
		web or in the file system, the browser treats the websites as
		different, and files stored in one instance are not available in
		the others.
		</p>
		<p>
		The next group of buttons controls program execution (green). They start
		or continue, interrupt, and abort the program. Three further
		buttons belong to the debugger. They step through the programs
		at different levels of granularity. The button with the little
		red dot toggles (sets/removes) the breakpoint in the current
		line, or the closest line below that is a legal breakpoint
		location.
		</p>
		<p>
		The green arrow opens the export dialog (yellow). It allows to export
		programs using turtle graphics or canvas graphics as standalone
		applications (web pages). These files can be ran in a browser,
		i.e., independent of the TScript IDE.
		</p>
		<p>
		The button with the gear symbol opens the configuration dialog.
		Currently it allows to configure the hotkeys associated with the
		toolbar buttons. Furthermore, there is a checkbox that enables
		<a href="?doc=/concepts/style">style checking mode</a>.
		</p>
		<p>
		It follows a wide element with colored background, called the
		program state indicator. It indicates whether the program is just
		about to be written, whether it was parsed successfully or whether
		an error occurred, and whether the program is running, waiting, or
		interrupted.
		</p>
		<p>
		Right of the program indicator there is an area collecting icons of
		iconified panels (purple). The icons can be clicked to restore the previous
		non-icon state of a panel.
		</p>
		<p>
		Finally, the button on the far right opens the documentation (i.e.,
		this very collection of documents) in a new window or browser tab.
		</p>
	`,
			children: [],
		},
		{
			id: "editor",
			name: "Source Code Editor",
			title: "Source Code Editor",
			content: `
		<p>
		The source code editor is the most important panel. It consists
		of a modern browser-based text editor with syntax highlighting
		for the TScript programming language. The program code is typed,
		pasted, or loaded into this panel. Breakpoints can be toggled
		(added/removed) by clicking the gutter on the left. The gutter
		also displays line numbers.
		</p>
		<p>
		Since longer programs usually consist of multiple files, the IDE
		supports any number of editors. Creating or opening a new file
		spawns a new editor panel.
		</p>
		<p>
		Besides the hotkeys defined for the
		<a href="?doc=/ide/toolbar">toolbar</a> buttons, the editor provides
		the following hotkeys:
		<table class="nicetable">
			<tr><th>key</th><th>effect</th></tr>
			<tr><td>control-A</td><td>select all</td></tr>
			<tr><td>control-Z</td><td>undo last change</td></tr>
			<tr><td>shift-control-Z</td><td>redo last change</td></tr>
			<tr><td>control-Y</td><td>redo last change</td></tr>
			<tr><td>control-Home</td><td>jump to start of the document</td></tr>
			<tr><td>control-End</td><td>jump to end of the document</td></tr>
			<tr><td>shift-Tabulator</td><td>auto-indent the current line</td></tr>
			<tr><td>control-D</td><td>comment/uncomment selected lines</td></tr>
			<tr><td>control-F</td><td>open the <i>find</i> dialog</td></tr>
			<tr><td>shift-control-F</td><td>open the <i>find+replace</i> dialog</td></tr>
			<tr><td>control-G</td><td>next search result</td></tr>
			<tr><td>shift-control-G</td><td>previous search result</td></tr>
			<tr><td>alt-G</td><td>open the <i>goto line</i> dialog</td></tr>
		</table>
		On MacOS, use the command key instead of the control key.
		</p>
	`,
			children: [],
		},
		{
			id: "messages",
			name: "Message Area",
			title: "Message Area",
			content: `
		<p>
		The message area contains two types of entities: text printed by
		the program with the <a href="?doc=/library/core">print</a> function,
		and error messages. Errors are clickable, highlighting the line
		of code in which the error occurred. Also, there is a clickable
		information symbol &#128712; that opens the documentation of the
		error.
		</p>
	`,
			children: [],
		},
		{
			id: "debugging",
			name: "Debugging Facilities",
			title: "Debugging Facilities",
			content: `
		<p>
		The debugger is firmly integrated into the IDE. It consists of
		several elements. The most prominent ones are stack and program
		view. Furthermore, stepwise program execution is controlled with
		the toolbar buttons, the message area collects error messages,
		which are often a starting point for debugging, and breakpoints
		are defined in the source code error.
		</p>

		<h2>The Stack View</h2>
		<p>
		This panel contains information only while the program is running.
		It displays the program state as a tree. At the topmost level, the
		tree contains one node per stack frame, which is the entity holding
		all local variables of a function. The bottom-most stack frame
		(with index [0]) holds the global variables.
		</p>
		<p>
		Each stack frame holds one sub-node per variable. If the variable
		refers to a container or an object, then the node can be opened and
		the items or attributes are found in the next layer. For example,
		an array holding 10 items is represented by 10 sub-nodes, one for
		each item.
		</p>
		<p>
		Furthermore, each stack frame holds a list of temporary values. A
		temporary value exists only during the evaluation of an expression,
		before it is consumed by another expression.
		</p>
		<p>
		The panel allows to inspect the values of all variables at runtime.
		This information is invaluable for debugging. While running the
		program step by step the programmer can monitor the effect of all
		commands on the variables.
		</p>
        <p>
        <center>
        <img src="data:image/png;base64,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">
        </center>
        </p>

		<h2>The Program View</h2>
		<p>
		This panel contains information only after the program is parsed.
		It displays the program structure as a tree. The root node
		represents the global scope. Nodes below this one represent
		declarations and statements, which again have sub-nodes, all the
		way down to atomic units like literals, names, operators, etc.
		Clicking a node of the tree navigates the cursor in the source code
		editor to the corresponding element. The position of the element is
		furthermore provided in parentheses, in the form (line:character).
		</p>
		<p>
		During runtime, the tree displays the current instruction by
		highlighting it with an orange background. It provides an
		instructive illustration of the program flow, which can be a
		valuable debugging aid.
		</p>
	`,
			children: [],
		},
		{
			id: "program",
			name: "Program IO Panels",
			title: "Program IO Panels",
			content: `
		<p>
		There are two panels dedicated to input and output of the program:
		one for turtle graphics, and one for a proper graphical user interface.
		It is uncommon to include these facilities directly into an IDE. This
		is because programs are supposed to run independent of the IDE. For
		TScript this is a minor concern, since the language is not designed
		for production use.
		</p>

		<h2>Turtle Graphics</h2>
		<p>
		The turtle graphics panel represents the area in which the fictitious
		turtle robot moves around. The panel contains the lines drawn by the
		robot while moving. It does not display the turtle.
		</p>
		<p>
		The panel is automatically cleared at program start. The drawing
		remains even after the program has finished.
		</p>
		<p>
		The drawing area is a square. However, for display, the area is
		stretched along one axis to match the aspect ratio of the panel.
		Therefore it is best practice to keep the panel roughly square shaped.
		</p>

		<h2>Canvas Graphics</h2>
		<p>
		The canvas panel contains a canvas for drawing geometric shapes and
		text. With these tools it is rather easy to display images, for
		example for simple video games. The panel allows for rich user
		interaction. Mouse clicks and mouse pointer movement as well as key
		presses generate events that can be processed by the program to
		create interactive applications.
		</p>
	`,
			children: [],
		},
		{
			id: "exportdialog",
			name: "Export dialog",
			title: "Export dialog",
			content: `
		<p>
		The export dialog allows to create a standalone webpage from the current TScript code.
		It is either a turtle application or a canvas application, that means that only one of these is shown
		in the final webpage.
		</p>
	`,
			children: [],
		},
	],
};
