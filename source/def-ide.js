"use strict"

if (doc) doc.children.push({
"id": "ide",
"name": "The TScript IDE",
"title": "The TScript Integrated Development Environment (IDE)",
"content": `
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
"children": [
	{"id": "toolbar",
	"name": "Toolbar",
	"title": "Toolbar",
	"content": `
		<p>
		The IDE has a toolbar at the top. It features a number of central
		controls.
		</p>
		<p>
		The four leftmost buttons manage files. They create a new
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
		The next group of buttons controls program execution. They start
		or continue, interrupt, and abort the program. Three further
		buttons belong the the debugger. They step through the programs
		at different levels of granularity. The button with the little
		red dot toggles (sets/removes) the breakpoint in the current
		line, or the closest line below that is a legal breakpoint
		location.
		</p>
		<p>
		The button with the gear symbol opens the configuration dialog.
		Currently it allows to configure the hotkeys associated with the
		toolbar buttons.
		</p>
		<p>
		It follows a wide element with colored background, called the
		program state indicator. It indicates whether the program is just
		about to be written, whether it parsed successfully or whether
		an error occurred, and whether the program is running or
		interrupted.
		</p>
		<p>
		Right of the program indicator there is an area collecting icons of
		iconified panels. The icons can be clicked to restore the previous
		non-icon state of a panel.
		</p>
		<p>
		Finally, the button on the far right opens the documentation (i.e.,
		this very collection of documents) in a new window or browser tab.
		</p>
	`,
	"children": []},
	{"id": "editor",
	"name": "Source Code Editor",
	"title": "Source Code Editor",
	"content": `
		<p>
		The source code editor is the most important panel. It consists
		of a modern browser-based text editor with syntax highlighting
		for the TScript programming language. The program code is typed,
		pasted, or loaded into this panel. Breakpoints can be toggled
		(added/removed) by clicking the gutter on the left. The gutter
		also displays line numbers.
		</p>
		<p>
		Besides the hotkeys defined for the
		<a href="#/ide/toolbar">toolbar</a> buttons, the editor provides
		the following hotkeys:
		<table class="nicetable">
			<tr><th>key</th><th>effect</th></tr>
			<tr><td>control-A</td><td>select all</td></tr>
			<tr><td>control-Z</td><td>undo last change</td></tr>
			<tr><td>control-Y</td><td>redo last change</td></tr>
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
	"children": []},
	{"id": "messages",
	"name": "Message Area",
	"title": "Message Area",
	"content": `
		<p>
		The message area contains two types of entities: text printed by
		the program with the <a href="#/library/core">print</a> function,
		and error messages. Errors are clickable, highlighting the line
		of code in which the error occurred. Also, there is a clickable
		information symbol &#128712; that opens the documentation of the
		error.
		</p>
	`,
	"children": []},
	{"id": "debugging",
	"name": "Debugging Facilities",
	"title": "Debugging Facilities",
	"content": `
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
		all local variables of the program. The bottom-most stack frame
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
		</p>
		The panel allows to inspect the values of all variables at runtime.
		This information is invaluable for debugging. While running the
		program step by step the programmer can monitor the effect of all
		commands on the variables.
		<p>

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
	"children": []},
	{"id": "program",
	"name": "Program IO Panels",
	"title": "Program IO Panels",
	"content": `
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
	"children": []},
]
});
