import { Documentation } from ".";

export const doc_stdlib: Documentation = {
	id: "library",
	name: "The TScript Standard Library",
	title: "Reference Documentation for the TScript Standard Library",
	content: `
	<p>
	This is the reference documentation of the TScript standard library.
	Its core consists of a hand full of general utility functions and a set
	of standard mathematical functions. Further parts of the library cover
	turtle and canvas graphics.
	</p>
`,
	children: [
		{
			id: "core",
			name: "Core Functions",
			title: "Core Functions",
			content: `
		<p>
		The functions described in this section perform essential core tasks.
		Instead of being library functions, they could equally well be
		implemented as language features.
		</p>
		<table class="methods">
		<tr><th>terminate</th><td>
			The <code class="code">function terminate()</code> immediately
			terminates the program. This is considered &quot;normal&quot;
			termination, in contrast to termination due to an error.
		</td></tr>
		<tr><th>assert</th><td>
			The <code class="code">function assert(condition, message)</code>
			tests whether <i>condition</i> evaluates to false. In that case it
			stops the program and emits <i>message</i> as an error message.
			This function should be used to verify that invariants of the
			program are fulfilled. Ideally, an assertion should never fail,
			and if it does then it indicates a bug. Assertions should not be
			used to check user input or other error conditions. An exception
			should be thrown in that case.
		</td></tr>
		<tr><th>error</th><td>
			The <code class="code">function error(message)</code>
			stops the program and emits <i>message</i> as an error message.
			This function should be used to report unrecoverable errors. As
			such, errors have a different role than exceptions, which should
			indicate recoverable errors.
		</td></tr>
		<tr><th>same</th><td>
			The <code class="code">function same(first, second)</code> tests
			whether its arguments refer to the same object.
		</td></tr>
		<tr><th>version</th><td>
			The <code class="code">function version()</code> returns a
			dictionary describing the current TScript version. The
			returned dictionary holds the following fields:
			<ul>
			<li>type: release type (string)</li>
			<li>major: first and most significant part of the version number</li>
			<li>minor: middle part of the version number</li>
			<li>patch: last and least significant part of the version number</li>
			<li>day: day of the release date</li>
			<li>month: month of the release date</li>
			<li>year: year of the release date</li>
			<li>full: human-readable version string</li>
			</ul>
		</td></tr>
		<tr><th>print</th><td>
			The <code class="code">function print(text)</code> outputs its
			argument as a new line into the message area. For this purpose,
			the argument is converted to a string.
		</td></tr>
		<tr><th>alert</th><td>
			The <code class="code">function alert(text)</code> opens a modal
			message box presenting the text to the user. For this purpose,
			the argument is converted to a string. The program continues
			after the user has closed the message box.
		</td></tr>
		<tr><th>confirm</th><td>
			The <code class="code">function confirm(text)</code> opens a
			modal message box presenting the text to the user. For this
			purpose, the argument is converted to a string. The user can
			either confirm or cancel the dialog, resulting in a return
			value of <code class="code">true</code> or
			<code class="code">false</code>, respectively. The program
			continues after the user has processed the message box.
		</td></tr>
		<tr><th>prompt</th><td>
			The <code class="code">function prompt(text)</code> opens a
			modal message box presenting the text to the user. For this
			purpose, the argument is converted to a string. The user can
			input a string in response, which is returned by the function.
			The program continues after the user has processed the message
			box.
		</td></tr>
		<tr><th>wait</th><td>
			The <code class="code">function wait(ms)</code> delays program
			execution for <i>ms</i> milliseconds.
		</td></tr>
		<tr><th>time</th><td>
			The <code class="code">function time()</code> returns the number
			of milliseconds since midnight 01.01.1970
			<a target="_blank" href="https://en.wikipedia.org/wiki/Coordinated_Universal_Time">UTC</a>
			as a real.
		</td></tr>
		<tr><th>localtime</th><td>
			The <code class="code">function localtime()</code> returns the number
			of milliseconds since midnight 01.01.1970
			as a real. The value refers to local time, i.e., taking the
			local time zone and daylight saving time into account.
		</td></tr>
		<tr><th>exists</th><td>
			The <code class="code">function exists(key)</code> returns
			<keyword>true</keyword> if a value was stored with the given
			key, and <keyword>false</keyword> otherwise. This is analogous
			to checking whether a file exists in the file system.
		</td></tr>
		<tr><th>load</th><td>
			The <code class="code">function load(key)</code> returns the
			value that was stored with the given key. If the key does
			not exist then the function reports an error. This is
			analogous to loading data from a file into memory.
		</td></tr>
		<tr><th>save</th><td>
			The <code class="code">function save(key, value)</code> stores
			the value with the given key to a persistent storage. The
			stored value remains stored even after the program terminates.
			It can be loaded at any later time, even by a different program.
			This is analogous to storing data in a file. The stored data is
			restricted to JSON format. This means that the value must be of
			type Null, Boolean, Integer, Real, or String, or it must be an
			Array or Dictionary holding JSON values. JSON values must not
			form cycles: an Array or Dictionary value may not be nested,
			i.e., be contained as an item inside itself or one of its
			sub-items.
		</td></tr>
		<tr><th>listKeys</th><td>
			The <code class="code">function listKeys()</code> returns an array containing the keys to all stored values.
		</td></tr>
		<tr><th>deepcopy</th><td>
			<p>
			The <code class="code">function deepcopy(value)</code> creates
			a deep copy of a container. If the container holds other
			containers as values then they are deep copied, too. The copied
			data structure must fulfill the following requirements:
			<ul>
				<li>It must not contain functions.</li>
				<li>It must not contain objects.</li>
				<li>It must not contain a loop, i.e., contain a value as its own sub-value.</li>
			</ul>
			</p>
		</td></tr>
		<tr><th>setEventHandler</th><td>
			The <code class="code">function setEventHandler(event, handler)</code>
			sets an event handler for a named event. The handler is a callback
			function that is called with an event parameter whenever the
			corresponding event is triggered. The event name is provided
			as a string. The most common use of this function is to handle
			GUI-related events emitted by the <a href="?doc#/library/canvas">canvas</a>.
			The standard library provides a &quot;timer&quot; event,
			which is fired roughly every 20 milliseonds.
			<tscript>
				function onTick(event)
				{
					print("tick...");
				}
				setEventHandler("timer", onTick);
				enterEventMode();
			</tscript>
			Events are triggered and handled only after calling
			<code class="code">enterEventMode</code>. The event handler is
			called with an event parameter, the type of which depends on the
			event type. For the timer event, the event is simply a
			<keyword>null</keyword> value. Calling
			<code class="code">setEventHandler</code> with
			<code class="code">handler = null</code> removes the handler for
			the given event type.
			
			When events take more than 20 milliseconds to complete,
			the &quot;timer&quot; event only gets called once for this timespan.
		</td></tr>
		<tr><th>enterEventMode</th><td>
			The <code class="code">function enterEventMode()</code> puts the
			program into event handling mode. The function returns only after
			calling <code class="code">quitEventMode</code> from within an
			event handler. The program still continues to run, handling all
			events received from external sources, like mouse and keyboard
			events for the canvas. Of course, at least one event handler
			should be registered before calling this function.
		</td></tr>
		<tr><th>quitEventMode</th><td>
			The <code class="code">function quitEventMode(result = null)</code>
			puts the program back into normal processing mode. It is usually
			called from within an event handler. The program handles all
			queued events, then it continues with the next statement
			following <code class="code">enterEventMode</code>. The parameter
			<code class="code">result</code> becomes the return value of
			<code class="code">function enterEventMode()</code>.
		</td></tr>
		</table>
	`,
			children: [],
		},
		{
			id: "math",
			name: "Math Functions",
			title: "Math Functions",
			content: `
		<p>
		The <code class="code">namespace math</code> contains a number
		of functions computing powers, logarithms, trigonometric and
		hyperbolic functions. Unless stated differently, all functions
		operate on real numbers, and integers are converted to reals.
		</p>
		<table class="methods">
		<tr><th>pi</th><td>
			The <code class="code">function math.pi()</code> returns the constant
			<a target="_blank" href="https://en.wikipedia.org/wiki/Pi">pi</a>.
		</td></tr>
		<tr><th>e</th><td>
			The <code class="code">function math.e()</code> returns Euler's constant
			<a target="_blank" href="https://en.wikipedia.org/wiki/E_(mathematical_constant)">e</a>.
		</td></tr>
		<tr><th>abs</th><td>
			The <code class="code">function math.abs(x)</code> returns the absolute
			value of its argument. For an integer argument the result is of type
			integer. The function overflows only for the value <code class="code">-2147483648</a>.
		</td></tr>
		<tr><th>sqrt</th><td>
			The <code class="code">function math.sqrt(x)</code> returns the square
			root of its argument.
		</td></tr>
		<tr><th>cbrt</th><td>
			The <code class="code">function math.cbrt(x)</code> returns the cubic
			root of its argument.
		</td></tr>
		<tr><th>floor</th><td>
			The <code class="code">function math.floor(x)</code> returns the argument
			rounded down, i.e., the closest integer not larger than <i>x/<i>.
		</td></tr>
		<tr><th>round</th><td>
			The <code class="code">function math.round(x)</code> returns the argument
			rounded to the nearest integer.
		</td></tr>
		<tr><th>ceil</th><td>
			The <code class="code">function math.ceil(x)</code> returns the argument
			rounded up, i.e., the closest integer not smaller than <i>x/<i>.
		</td></tr>
		<tr><th>sin</th><td>
			The <code class="code">function math.sin(x)</code> returns the
			<a target="_blank" href="https://en.wikipedia.org/wiki/Trigonometric_functions">sine</a>
			of its argument.
		</td></tr>
		<tr><th>cos</th><td>
			The <code class="code">function math.cos(x)</code> returns the
			<a target="_blank" href="https://en.wikipedia.org/wiki/Trigonometric_functions">cosine</a>
			of its argument.
		</td></tr>
		<tr><th>tan</th><td>
			The <code class="code">function math.tan(x)</code> returns the
			<a target="_blank" href="https://en.wikipedia.org/wiki/Trigonometric_functions">tangent</a>
			of its argument.
		</td></tr>
		<tr><th>sinh</th><td>
			The <code class="code">function math.sinh(x)</code> returns the
			<a target="_blank" href="https://en.wikipedia.org/wiki/Hyperbolic_function">hyperbolic sine</a>
			of its argument.
		</td></tr>
		<tr><th>cosh</th><td>
			The <code class="code">function math.cosh(x)</code> returns the
			<a target="_blank" href="https://en.wikipedia.org/wiki/Hyperbolic_function">hyperbolic cosine</a>
			of its argument.
		</td></tr>
		<tr><th>tanh</th><td>
			The <code class="code">function math.tanh(x)</code> returns the
			<a target="_blank" href="https://en.wikipedia.org/wiki/Hyperbolic_function">hyperbolic tangent</a>
			of its argument.
		</td></tr>
		<tr><th>asin</th><td>
			The <code class="code">function math.asin(x)</code> returns the inverse
			<a target="_blank" href="https://en.wikipedia.org/wiki/Trigonometric_functions">sine</a>
			of its argument.
		</td></tr>
		<tr><th>acos</th><td>
			The <code class="code">function math.acos(x)</code> returns the inverse
			<a target="_blank" href="https://en.wikipedia.org/wiki/Trigonometric_functions">cosine</a>
			of its argument.
		</td></tr>
		<tr><th>atan</th><td>
			The <code class="code">function math.atan(x)</code> returns the inverse
			<a target="_blank" href="https://en.wikipedia.org/wiki/Trigonometric_functions">tangent</a>
			of its argument.
		</td></tr>
		<tr><th>atan2</th><td>
			The <code class="code">function math.atan2(y, x)</code> returns the inverse
			<a target="_blank" href="https://en.wikipedia.org/wiki/Trigonometric_functions">tangent</a>
			of <i>y/x</i>. This is the angle between the vectors (x, y) and (1, 0) in radians.
		</td></tr>
		<tr><th>asinh</th><td>
			The <code class="code">function math.asinh(x)</code> returns the inverse
			<a target="_blank" href="https://en.wikipedia.org/wiki/Hyperbolic_function">hyperbolic sine</a>
			of its argument.
		</td></tr>
		<tr><th>acosh</th><td>
			The <code class="code">function math.acosh(x)</code> returns the inverse
			<a target="_blank" href="https://en.wikipedia.org/wiki/Hyperbolic_function">hyperbolic cosine</a>
			of its argument.
		</td></tr>
		<tr><th>atanh</th><td>
			The <code class="code">function math.atanh(x)</code> returns the inverse
			<a target="_blank" href="https://en.wikipedia.org/wiki/Hyperbolic_function">hyperbolic tangent</a>
			of its argument.
		</td></tr>
		<tr><th>exp</th><td>
			The <code class="code">function math.exp(x)</code> returns the
			<a target="_blank" href="https://en.wikipedia.org/wiki/Exponential_function">exponential function</a>
			of its argument.
		</td></tr>
		<tr><th>log</th><td>
			The <code class="code">function math.log(x)</code> returns the
			<a target="_blank" href="https://en.wikipedia.org/wiki/https://en.wikipedia.org/wiki/Natural_logarithm">natural logarithm</a>
			of its argument.
		</td></tr>
		<tr><th>log2</th><td>
			The <code class="code">function math.log2(x)</code> returns the
			<a target="_blank" href="https://en.wikipedia.org/wiki/https://en.wikipedia.org/wiki/https://en.wikipedia.org/wiki/Logarithm">logarithm with base 2</a>
			of its argument.
		</td></tr>
		<tr><th>log10</th><td>
			The <code class="code">function math.log10(x)</code> returns the
			<a target="_blank" href="https://en.wikipedia.org/wiki/https://en.wikipedia.org/wiki/https://en.wikipedia.org/wiki/Logarithm">logarithm with base 10</a>
			of its argument.
		</td></tr>
		<tr><th>pow</th><td>
			The <code class="code">function math.pow(b, e)</code> returns the <i>e</i>-th power of <i>b</i>.
			It is an alternative to <a href="?doc#/language/expressions/binary-operators/power">operator ^</a> that always works with reals.
		</td></tr>
		<tr><th>sign</th><td>
			The <code class="code">function math.sign(x)</code> returns the
			sign of its argument, encoded as <i>-1</i>, <i>0</i>, or <i>+1</i>.
			The return type is an integer if the argument is, otherwise it is real.
		</td></tr>
		<tr><th>min</th><td>
			The <code class="code">function math.min(a, b)</code> returns the smaller
			of its two arguments. The function is applicable to non-numeric arguments
			as long as they are ordered. It is equivalent to<br/>
			<code class="code">if a <= b then return a; else return b;</code>
		</td></tr>
		<tr><th>max</th><td>
			The <code class="code">function math.max(a, b)</code> returns the larger
			of its two arguments. The function is applicable to non-numeric arguments
			as long as they are ordered. It is equivalent to<br/>
			<code class="code">if a >= b then return a; else return b;</code>
		</td></tr>
		<tr><th>random</th><td>
			The <code class="code">function math.random()</code> returns a real number
			drawn from the uniform distribution on the half-open unit interval [0,&nbsp;1[.
		</td></tr>
		</table>
	`,
			children: [],
		},
		{
			id: "turtle",
			name: "Turtle Graphics",
			title: "Turtle Graphics",
			content: `
		<p>
		The functions in this section control the "turtle", an imaginary robot
		equipped with a pen that can move around and draw lines. The turtle
		moves in a two-dimensional area. It is described by a Cartesian
		coordinate system with horizontal (x) and vertical (y) axes. The origin
		is at the center of the area, and the visible area extends from -100 to
		+100 in each direction. The turtle can leave the visible area.
		</p>
		<p>
		At program start, the turtle is located at the origin of its coordinate
		system, it is equipped with a black pen, it and faces upwards, or in
		other words, along the positive y-axis. The turtle can move and turn.
		While doing so it can lower and raise a pen. While lowered, the pen
		draws the path taken by the turtle. The result of such drawing is known
		as "turtle graphics". The color of the pen can be changed.
		</p>
		<table class="methods">
		<tr><th>reset</th><td>
			The <code class="code">function reset(x=0, y=0, degrees=0, down=true)</code>
			places the turtle at position <i>(x, y)</i> on its drawing area.
			Its orientation is given by <i>degrees</i>, the color is set to
			black, and the pen is active if <i>down</i> is true. Using this
			function for actual drawing is considered improper use, or "cheating",
			since this operation is not available to an actual robot. The
			intended use is to initialize the turtle in a different position
			than the center.
		</td></tr>
		<tr><th>move</th><td>
			The <code class="code">function move(distance)</code> moves the
			turtle forward by the given distance, or backward if the distance
			is negative. If the pen is down in this state then a line is drawn.
		</td></tr>
		<tr><th>turn</th><td>
			The <code class="code">function turn(degrees)</code> rotates the
			turtle clockwise, where 360 <i>degrees</i> are one full rotation.
		</td></tr>
		<tr><th>color</th><td>
			The <code class="code">function color(red, green, blue)</code>
			sets the color of the pen, defined by red, green and blue components.
			All values are clipped to the range [0,&nbsp;1].
		</td></tr>
		<tr><th>pen</th><td>
			The <code class="code">function pen(down)</code> lifts the pen if
			<i>down</i> is false and lowers the pen if <i>down</i> is true.
		</td></tr>
		</table>
	`,
			children: [],
		},
		{
			id: "canvas",
			name: "Canvas Graphics",
			title: "Canvas Graphics",
			content: `
		<p>
		The functions in this section control the "canvas", a rectangular
		surface for drawing geometric shapes and text. Canvas graphics is
		significantly more flexible than turtle graphics. The canvas
		provides user-triggered mouse and keyboard events.
		</p>
		<p>
		The canvas is a two-dimensional grid of pixels. Each pixel covers
		an area of size 1x1. The origin of the coordinate system is the
		top/left corner of the top/left pixel. The x-coordinate grows
		towards the right, while the y-coordinate grows towards the bottom.
		The latter is in contrast to a standard mathematical coordinate
		system, however, the convention is common for computer screens.
		The size of the canvas depends on the size of the window containing
		the canvas. Drawing outside the canvas has no effect.
		</p>
		<p>
		Note that the above convention means that integer coordinates refer
		to the corners of pixels. Hence, the coordinates of the center of
		the top/left pixel are (0.5, 0.5). All drawing operations are
		defined in continuous coordinates. Conceptually, drawing a red line
		of width 1 from point (10, 10) to point (20, 10) spills red ink
		over the rectangle with corners (10, 9.5), (10, 10.5), (20, 10.5),
		(20, 9.5). Therefore the pixels in rows y=9 and y=10 are covered
		by 50% red ink. When drawing on top of white background, then the
		drawing command results in two consecutive horizontal pixel rows
		of light red color. However, the intended is most probably to fill
		a single pixel row with fully red color. This is achieved by
		drawing a line of width 1 from (10, 10.5) to (20, 10.5). This shift
		of 0.5 is a bit unintuitive at first, and it is caused by integer
		coordinates referring to the corners of pixels, not to their centers.
		</p>
		<p>
		Canvas drawing is stateful. This means that properties of drawing
		operations like line and fill color and line width are set before
		the actual drawing commands are issued. This makes it easy to draw,
		e.g., many lines of the same width and color in sequence.
		</p>
		<p>
		The canvas namespace provides a large number of functions. They are
		split into five categories: reading properties, setting properties,
		transformations, drawing, and managing events.
		</p>

		<h3>Reading Properties</h3>
		<table class="methods">
		<tr><th>width</th><td>
			The <code class="code">function width()</code> returns the current
			width of the canvas in pixels.
		</td></tr>
		<tr><th>height</th><td>
			The <code class="code">function height()</code> returns the current
			height of the canvas in pixels.
		</td></tr>
		</table>

		<h3>Setting Properties</h3>
		<table class="methods">
		<tr><th>setLineWidth</th><td>
			The <code class="code">function setLineWidth(width)</code> sets
			the line width. The parameter <code class="code">width</code>
			must be a positive number.
		</td></tr>
		<tr><th>setLineColor</th><td>
			The <code class="code">function setLineColor(red, green, blue, alpha)</code>
			sets the line color. All arguments are in the range 0 to 1. The
			alpha (opacity) argument is optional, it defaults to 1.
		</td></tr>
		<tr><th>setFillColor</th><td>
			The <code class="code">function setFillColor(red, green, blue, alpha)</code>
			sets the fill color. All arguments are in the range 0 to 1. The
			alpha (opacity) argument is optional, it defaults to 1.
		</td></tr>
		<tr><th>setFont</th><td>
			The <code class="code">function setFont(fontface, fontsize)</code>
			sets the current font. The fontface is a string, it must correspond
			to a font existing on the system. The fontsize is defined in pixels,
			it must be a positive number. The default font is a 16px Helvetica
			font.
		</td></tr>
		<tr><th>setTextAlign</th><td>
			The <code class="code">function setTextAlign(alignment)</code>
			sets the text alignment. Possible values are
			<code class="code">&quot;left&quot;</code> (the default),
			<code class="code">&quot;center&quot;</code>, and
			<code class="code">&quot;right&quot;</code>.
			The position given in text drawing commands is relative to the
			alignment.
		</td></tr>
		</table>

		<h3>Drawing</h3>
		<table class="methods">
		<tr><th>clear</th><td>
			The <code class="code">function clear()</code> erases all drawn
			content by filling the entire canvas with the current fill color.
			It also resets the transformation (see function reset() below).
		</td></tr>
		<tr><th>line</th><td>
			The <code class="code">function line(x1, y1, x2, y2)</code> draws
			a line from (x1, y1) to (x2, y2) using the current line width and
			line color.
		</td></tr>
		<tr><th>rect</th><td>
			The <code class="code">function rect(left, top, width, height)</code>
			draws the outline of a rectangle with the current line width and
			line color.
		</td></tr>
		<tr><th>fillRect</th><td>
			The <code class="code">function fillRect(left, top, width, height)</code>
			fills a rectangle with the current fill color.
		</td></tr>
		<tr><th>frameRect</th><td>
			The <code class="code">function frameRect(left, top, width, height)</code>
			fills a rectangle with the current fill color and draws the outline with
			the current line color and line width.
		</td></tr>
		<tr><th>circle</th><td>
			The <code class="code">function circle(x, y, radius)</code>
			draws the outline of a circle with the current line width and
			line color.
		</td></tr>
		<tr><th>fillCircle</th><td>
			The <code class="code">function fillCircle(x, y, radius)</code>
			fills a circle with the current fill color.
		</td></tr>
		<tr><th>frameCircle</th><td>
			The <code class="code">function frameCircle(x, y, radius)</code>
			fills a circle with the current fill color and draws the outline with
			the current line color and line width.
		</td></tr>
		<tr><th>curve</th><td>
			The <code class="code">function curve(points, closed)</code> draws
			a polygon given by the array <code class="code">points</code>, each
			entry of which is an array containing (x, y) coordinates. If the
			optional argument <code class="code">closed</code> is set to true then
			the first and the last point are connected, resulting in a closed
			polygon. The curve is drawn with the current line width and line color.
		</td></tr>
		<tr><th>fillArea</th><td>
			The <code class="code">function fillArea(points)</code> fills the
			closed polygon given by <code class="code">points</code> (see function
			curve) with the current fill color.
		</td></tr>
		<tr><th>frameArea</th><td>
			The <code class="code">function frameArea(points)</code> fills the
			closed polygon given by <code class="code">points</code> (see function
			curve) with the current fill color, and then draws the polygon outline
			with the given line color and line width.
		</td></tr>
		<tr><th>text</th><td>
			The <code class="code">function text(x, y, str)</code> draws the string
			<code class="code">str</code> at position (x, y), relative to the
			current text alignment, using the current font and fill color.
		</td></tr>
		</table>

		<h3>Transformations</h3>
		<table class="methods">
		<tr><th>reset</th><td>
			The <code class="code">function reset()</code> resets the current
			transformation. Afterwards the origin of the coordinate system is
			the top left corner, with axes extending to the right and to the
			bottom.
		</td></tr>
		<tr><th>shift</th><td>
			The <code class="code">function shift(dx, dy)</code> translates
			the origin of the coordinate system by the vector (dx, dy).
		</td></tr>
		<tr><th>scale</th><td>
			The <code class="code">function scale(factor)</code> scales the
			coordinate system by the given factor.
		</td></tr>
		<tr><th>rotate</th><td>
			The <code class="code">function rotate(angle)</code> rotates the
			coordinate system clockwise by the given angle. The angle is given
			in radians, i.e., a full rotation corresponds to the angle
			<code class="code">2 * math.pi()</code>.
		</td></tr>
		<tr><th>transform</th><td>
			The <code class="code">function transform(A, b)</code> transforms
			coordinates (x, y) into new coordinates A (x, y) + b, where A is
			the 2x2 matrix <code class="code">[[A11, A12], [A21, A22]]</code>
			and b is the vector <code class="code">[b1, b2]</code>.
		</td></tr>
		</table>

		<h3>Managing Events</h3>
		<p>
		The canvas emits the following events:
			<table class="nicetable">
			<tr><th>event name</th><th>event type</th><th>meaning</th></tr>
			<tr><td>&quot;canvas.mousemove&quot;</td><td>MouseMoveEvent</td><td>mouse pointer moved to new position within the canvas</td></tr>
			<tr><td>&quot;canvas.mouseout&quot;</td><td>Null</td><td>mouse pointer left the canvas</td></tr>
			<tr><td>&quot;canvas.mousedown&quot;</td><td>MouseButtonEvent</td><td>mouse button pressed</td></tr>
			<tr><td>&quot;canvas.mouseup&quot;</td><td>MouseButtonEvent</td><td>mouse button released</td></tr>
			<tr><td>&quot;canvas.keydown&quot;</td><td>KeyboardEvent</td><td>keyboard key pressed</td></tr>
			<tr><td>&quot;canvas.keyup&quot;</td><td>KeyboardEvent</td><td>keyboard key released</td></tr>
			<tr><td>&quot;canvas.resize&quot;</td><td>ResizeEvent</td><td>canvas resized</td></tr>
			</table>
		They can be received by setting corresponding event handlers with the
		standard library function <code class="code">setEventHandler</code>.
		</p>
		<p>
		The different event types are lightweight classes providing
		public attributes. They are defined as follows:
		</p><p>
		<tscript>
			class MouseMoveEvent
			{
			public:
				var x;         # horizontal pointer position
				var y;         # vertical pointer position
				var buttons;   # array of pressed buttons
				var shift;     # shift key pressed?
				var control;   # control key pressed?
				var alt;       # alt key pressed?
				var meta;      # meta key pressed?
			}

			class MouseButtonEvent
			{
			public:
				var x;         # horizontal pointer position
				var y;         # vertical pointer position
				var button;    # button that caused the event
				var buttons;   # array of pressed buttons
				var shift;     # shift key pressed?
				var control;   # control key pressed?
				var alt;       # alt key pressed?
				var meta;      # meta key pressed?
			}

			class KeyboardEvent
			{
			public:
				var key;       # name of the key that caused the event
				var shift;     # shift key pressed?
				var control;   # control key pressed?
				var alt;       # alt key pressed?
				var meta;      # meta key pressed?
			}

			class ResizeEvent
			{
			public:
				var width;     # new width of the canvas
				var height;    # new height of the canvas
			}
		</tscript>
		</p><p>
		Buttons are named <code class="code">"left"</code>,
		<code class="code">"middle"</code>, and <code class="code">"right"</code>.
		Keys are named according to the
		<a target="_blank" href="https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values">JavaScript rules</a>.
		</p><p>
		Mouse pointer coordinates always refer to <i>untransformed</i> canvas pixels:
		if a transformation has been performed before the event occurs (like
		<code class="code">shift(100, 100);</code>) then drawing actions inside the
		event handler are affected by the transformation. However, the coordinates
		reported in the event object are unaffected; they always refer to the
		original canvas coordinates.
		</p>
	`,
			children: [],
		},

		{
			id: "audio",
			name: "Audio playback",
			title: "Audio playback",
			content: `
			<p>TScript supports playback of audio. The classes <code class="code">MonoAudio</code> and <code class="code">StereoAudio</code> allow the playback of arbitrary buffers consisting of reals with values from -1 to 1.
			The playback is performed asynchronously, meaning that a call to <code class="code">play()</code> will return immediately regardless of sound duration.
			</p>
			<h3>Constructors</h3>
			<table class="methods">
			<tr><th>MonoAudio</th><td>
				<code class="code">MonoAudio(buffer, sampleRate)</code> where <code class="code">buffer</code> is an array containing the samples to be played, <code class="code">sampleRate</code> specifies the rate they are to be played at in Hz.
			</td></tr>
			<tr><th>StereoAudio</th><td>
				<code class="code">StereoAudio(leftBuffer, rightBuffer, sampleRate)</code> provides the same functionality as above, but allows playback of stereo audio.
			</td></tr>
			</table>
					
			<h3>Functions</h3>
			<tscript>
			function play(){}
			function pause(){}
			function setPlaybackRate(speed){}
			</tscript>
			Are available on <code class="code">MonoAudio</code> and <code class="code">StereoAudio</code>, they behave as expected.
			<h3> Example</h3>
			<p> The following code plays two different tones on the left and right channel. <code class="code">l_freq</code> and <code class="code"> r_freq</code> 
			and the <code class="code"> sampleRate</code> can be modified to alter the tones.
			<tscript>
				use namespace math;
				use namespace audio;

				var durationInSeconds = 0.2;
				var l_freq = 440; # frequency in Hz 
				var r_freq = 554;
				var sampleRate = 48000; # sampleRate in Hz


				var l_samples = [];
				var r_samples = [];

				for var i in 0:(sampleRate * durationInSeconds) do
				{
					l_samples.push(sin( i * (l_freq / sampleRate) * 2 * pi()));
				}

				for var i in 0:(sampleRate * durationInSeconds) do
				{
					r_samples.push(sin( i * (r_freq / sampleRate) * 2 * pi()));
				}
				
				var a = StereoAudio(l_samples, r_samples, sampleRate);
				# only play 0.1 of the 0.2 seconds
				a.play();
				wait(100);
				a.pause();
				
			</tscript>
		`,
			children: [],
		},
	],
};
