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
	turtle and canvas graphics, as well as sound output.
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
			<div class="example">
			<h3>Example</h3>
			<tscript>
var a = [1, 2, 3];
var b = a;
var c = deepcopy(a);
var d = [1, 2, 3];

print(same(a, b));	  # prints true;
print(same(a, c));	  # prints false;
print(same(a, d));	  # prints false;
print(same(a, 1));	  # prints false;
			</tscript>
		</div>
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
			<div class="example">
			<h3>Example</h3>
			<tscript>
var confirmed = confirm("Print Hello World?");

if confirmed then print("Hello World");		 # if user confirms, the program prints "Hello World", else nothing
			</tscript>
		</div>
		</td></tr>
		<tr><th>prompt</th><td>
			The <code class="code">function prompt(text)</code> opens a
			modal message box presenting the text to the user. For this
			purpose, the argument is converted to a string. The user can
			input a string in response, which is returned by the function.
			The program continues after the user has processed the message
			box.
			<div class="example">
			<h3>Example</h3>
			<tscript>
var s = prompt("Tell me what to print");

if not s == null then print(s);									   # prints the input given by the user
else print("process was terminated by user");						 # if process is terminated without input given, it tells the user
			</tscript>
		</div>
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
				<li>It must not contain lambda functions.</li>
				<li>It must not contain objects.</li>
				<li>It must not contain a loop, i.e., contain a value as its own sub-value.</li>
			</ul>
			</p>
			<div class="example">
			<h3>Example</h3>
			<tscript>
var a = [0, 1, 2];
var b = a;
var c = deepcopy(a);

a.push(3);

print(b);			   # prints [0, 1, 2, 3], since it's a reference to the same array also referenced by variable a
print(c);			   # prints [0, 1, 2], since it's a copy
			</tscript>
		</div>
		</td></tr>
		<tr><th>setEventHandler</th><td>
			The <code class="code">function setEventHandler(event, handler)</code>
			sets an event handler for a named event. The handler is a callback
			function that is called with an event parameter whenever the
			corresponding event is triggered. The event name is provided
			as a string. The most common use of this function is to handle
			GUI-related events emitted by the <a href="?doc=/library/canvas">canvas</a>.
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
		All trigonometric functions work with radians.
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
			rounded down, i.e., the closest integer not larger than <i>x</i>. Although
			the return value is an integer, it is of type <code class="code">Real</code>
			to avoid integer overflow.
		</td></tr>
		<tr><th>round</th><td>
			The <code class="code">function math.round(x)</code> returns the argument
			rounded to the nearest integer. Although the return value is an integer,
			it is of type <code class="code">Real</code> to avoid integer overflow.
		</td></tr>
		<tr><th>ceil</th><td>
			The <code class="code">function math.ceil(x)</code> returns the argument
			rounded up, i.e., the closest integer not smaller than <i>x</i>. Although
			the return value is an integer, it is of type <code class="code">Real</code>
			to avoid integer overflow.
		</td></tr>
		<tr><th>sin</th><td>
			The <code class="code">function math.sin(x)</code> returns the
			<a target="_blank" href="https://en.wikipedia.org/wiki/Trigonometric_functions">sine</a>
			of its argument in radians.
		</td></tr>
		<tr><th>cos</th><td>
			The <code class="code">function math.cos(x)</code> returns the
			<a target="_blank" href="https://en.wikipedia.org/wiki/Trigonometric_functions">cosine</a>
			of its argument in radians.
		</td></tr>
		<tr><th>tan</th><td>
			The <code class="code">function math.tan(x)</code> returns the
			<a target="_blank" href="https://en.wikipedia.org/wiki/Trigonometric_functions">tangent</a>
			of its argument in radians.
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
			of its argument. The return value is an angle in radians.
		</td></tr>
		<tr><th>acos</th><td>
			The <code class="code">function math.acos(x)</code> returns the inverse
			<a target="_blank" href="https://en.wikipedia.org/wiki/Trigonometric_functions">cosine</a>
			of its argument. The return value is an angle in radians.
		</td></tr>
		<tr><th>atan</th><td>
			The <code class="code">function math.atan(x)</code> returns the inverse
			<a target="_blank" href="https://en.wikipedia.org/wiki/Trigonometric_functions">tangent</a>
			of its argument. The return value is an angle in radians.
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
			It is an alternative to <a href="?doc=/language/expressions/binary-operators/power">operator ^</a>
			that always works with data type <code class="code">Real</code>.
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
		<div class="example">
		<h3>Example</h3>
		<tscript>
turtle.pen(true);		   # lower the pen
turtle.move(50);			# black line upwards
turtle.color(1,0,0);		# turn color red
turtle.turn(90);			# turn 90 degrees clockwise
turtle.move(50);			# red line to the right
turtle.color(0,1,0);		# turn color green
turtle.turn(90);			# turn 90 degress clockwise
turtle.move(50);			# green line downwards
turtle.color(0,0,1);		# turn color blue
turtle.turn(90);			# turn 90 degrees clockwise
turtle.move(50);			# blue line to the left
		</tscript>
		<div style="text-align: center; margin: 20px;">
		<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAHXCAMAAAD9dRLCAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACKUExURe7u7vDPz/Kvr+/b29TU1NeXl+pqavd3d/J5dNSKZszSq9vv25iYmJZcXMhTU/aBgeaJeIa7RnjmZq/yr3tzc5+Oju/e3t/gz4LteHf0dHd3d97v3oH2gXf3d2Fhj2JivpiY9I6Z6lOer2rchsPDw4aGxmFh4Xd393N381x53JfNvs/wz8PD8dTU8ADkF9wAAAAJcEhZcwAADsMAAA7DAcdvqGQAAALKSURBVHhe7dM3UiQBEEXBQS6igUVrrdX9r4fTPhEzVvMyrXJ/xKsZAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADwq6XlaVsZdzCf1bX1fxO2sbm1PS5hLsPO7t6E/d8/OByXMJfh6Phkwk7PzgWwkOFiGK9Jury6FsBCBBAngDgBxAkgTgBxAogTQJwA4gQQJ4A4AcQJIE4AcQKIE0CcAOIEECeAOAHECSBOAHECiBNAnADiBBAngDgBxAkgTgBxAogTQJwA4gQQJ4A4AcQJIE4AcQKIE0CcAOIEECeAOAHECSBOAHECiBNAnADiBBAngDgBxAkgTgBxAogTQJwA4gQQJ4A4AcQJIE4AcQKIE0CcAOIEECeAOAHECSBOAHECiBNAnADiBBAngDgBxAkgTgBxAogTQJwA4gQQJ4A4AcQJIE4AcQKIE0CcAOIEECeAOAHECSBOAHECiBNAnADiBBAngDgBxAkgTgBxAogTQJwA4gQQJ4A4AcQJIE4AcQKIE0CcAOIEECeAOAHECSBOAHECiBNAnADiBBAngDgBxAkgTgBxAogTQJwA4gQQJ4A4AcQJIE4AcQKIE0CcAOIEECeAOAHECSBOAHECiBNAnADiBBAngDgBxAkgTgBxAogTQJwA4gQQJ4A4AcQJIE4AcQKIE0CcAOIEECeAOAHECSBOAHECiBNAnADiBBAngDgBxAkgTgBxAogTQJwA4gQQJ4A4AcQJIE4AcQKIE0CcAOIEECeAOAHEDTe3dxN2//AogIU8Pb+8Ttjb+8fnuIT5fI2/NFXf4w4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPjjZrMfL8fhleLB8v4AAAAASUVORK5CYII=">
		</div>
	</div>
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
		All drawing functions can also be used for offline drawing onto a
		<code>Bitmap</code> object. The target object of all drawing
		operations can be set with <code>setDrawingTarget</code>. The
		drawing state is separate per target. This means that changing a
		property (like the line color) for one target does not affect the
		same property for any other target.
		</p>
		<p>
		The canvas namespace provides a large number of functions. They are
		split into the following categories: reading properties, setting
		properties, raw pixel access, transformations, drawing, and managing
		events.
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
		<tr><th>setOpacity</th><td>
			The <code class="code">function setOpacity(alpha)</code>
			sets a global opacity (alpha) value for all drawing operations.
			A value of 0 means that operations are fully transparent and hence
			have no effect, while a value of 1 means that drawing is fully
			opaque.
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

		<h3>Raw Pixel Access</h3>
		<p>
		Note that the pixel coordinates for raw pixel access are not
		affected by the current transformation.
		</p>
		<table class="methods">
		<tr><th>getPixel</th><td>
			The <code class="code">function getPixel(x, y)</code> returns the
			"raw" pixel value as an array of four numbers, encoding the RGBA
			color value. Each component (red, green, blue, and alpha) is an
			integer in the range 0 to 255. This is the format in which the
			color information is stored in the graphics hardware.
		</td></tr>
		<tr><th>setPixel</th><td>
			The <code class="code">function setPixel(x, y, data)</code> sets
			a raw pixel value. The data argument is an array of four integers
			with the same meaning as the return value of <code>getPixel</code>.
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
			entry of which is an array containing (x, y) coordinates. For example,
			the array <code class="code">[[100, 100], [200, 100], [100, 200]]</code>
			specifies a curve consisting of two lines (three lines forming a triangle
			if the curve is closed), connecting the points (100, 100), (200, 100),
			and (100, 200). If the optional argument <code class="code">closed</code>
			is set to <code class="code">true</code> then the first and the last point
			are connected, resulting in a closed polygon. The curve is drawn with the
			current line width and line color.
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
		<tr><th>paintImage</th><td>
			The <code class="code">function paintImage(x, y, source)</code> draws an
			image <code class="code">source</code> at position (x, y). The source can
			be a canvas.Bitmap object or <code>null</code>. In the latter case, the
			current canvas is drawn.
		</td></tr>
		<tr><th>paintImageSection</th><td>
			The <code class="code">function paintImage(dx, dy, dw, dh, source, sx, sy, sw, sh)</code>
			draws a section of the image <code class="code">source</code>
			specified by the rectangle (sx, sy, sw, sh) into the rectangle
			specified by (dx, dy, dw, dh) on the target canvas. The source can
			be a canvas.Bitmap object or <code>null</code>. In the latter case,
			a section from the current canvas is drawn.
		</td></tr>
		</table>
		<div class="example">
		<h3>Example</h3>
		<tscript>
var points = [[10, 10],[100, 10],[100, 100],[55, 150],[10, 100]];   # array with corners of the polygon

canvas.setLineColor(1,0,0);                                         # set the line color to red
canvas.curve(points, true);                                         # connect the points in the array

canvas.setFillColor(0,0,1);                                         # set the fill color to blue
canvas.fillArea(points);                                            # fills the area surrounded by the points
		</tscript>
		<img style="display: block; margin: 1em auto;" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALAAAADwCAMAAACXMR4AAAAC61BMVEUEMv8RMflhQNj71c1kQdf+8uX+8ub///H+8+b2tbX1tbW6eLvwoacgMfN2TdG9eru9eroIMfz+/vD+9un83NMIMf3+/e/+9en959wTMfj+/O4KMfz+9+omMvH+6t/XmLoXMfcWMff+7eH++etHOeMkMvHam7r+/O8gMvMpMu8oMvD+9OdvR9L72dEOMfodMvSubb2rar4VMffAfbu7erwQMfn2x8XBf7o3Ner72tFpRNUiMvJXPN1rRdQqMu/829N9TMzSkro0NOuaX8OcYcOCTsv+8eT949nrtL/VlbqWW8RrQ9R0SdGhZMFJOeJsRdQ+NudAN+b6zsg4NelnQtX+++3Uk7rOiLVCOOX719DIg7f95Nroo7J/TMxSO99gQNgxNOz+7+P95txUO94cMvSpaL7+8+ejZcE8NuiYW8P41tH+8eVeP9mYXsT4zMhySNK3dbywbr2aXcI7Nej++eyfYsL96d7gnrb4z8saMvVkQdZbPtvEgbr5083tusT+7uKNVseRWMXnscHpsr/FgbdQOuAMMfuATcunZ7/61M1OOuD84Nasa73knbOPVsb6z8k8NejLhbakZ8H72NBVPN0HMf383dTqsr7nrr73vrv83tX62dL+69+UWsQvNO341dDpsL69e7udYcOTXMaWXsX2yMfJibxcP9rmrb7st8D4zsnbl7WQV8a5eLxuRtPemrb30s/84tiCTsrnr77Njryzcb3wuL13SdClZ8CLU8floLT3xMHhn7f0ubvanbz97OH3ysfyoqdiQdflq77519HqtsL0uLlpRdXlsMGkZsD1vr5LOuH3vLvDg7x7S835y8W+e7rLjLzenbfvt77jqb27wsJIOuO7eLv3wsChZcJoQ9XCfrj20M4sM+72urjoqrnotcPRjbbvv8XRkbpFOeT1tbTqnav2zcqJUsjyqa4VM/fmobL+++7gqsFkQ9fmprjPkLzXlbfcn7zVk7eET8rho7rkpLj0wcLGg7l0iYtwAAAGw0lEQVR42u3d91dTZxgHcLTCa6fNTUhICAQNMmKEAMrGSEBEhqDIVhCQVYaIW4GKIlOxqNCKcdW9Fbd11VEH1n0qVq1a29o97fixb6rnaFnJTe7inOf5A+75nOd8773vzck5XzPUw8YM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"/>
	</div>
		<h3>Transformations</h3>
		<table class="methods">
		<tr><th>reset</th><td>
			The <code class="code">function reset()</code> resets the current
			transformation. Afterwards the origin of the coordinate system is
			the top left corner, with axes extending to the right and to the
			bottom.
			<img style="display: block; margin: 1em auto;" src ="data:image/png;base64,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"/>
		</td></tr>
		<tr><th>shift</th><td>
			The <code class="code">function shift(dx, dy)</code> translates
			the origin of the coordinate system by the vector (dx, dy).
			<img style="display: block; margin: 1em auto;" src ="data:image/png;base64,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"/>
		</td></tr>
		<tr><th>scale</th><td>
			The <code class="code">function scale(factor)</code> scales the
			coordinate system by the given factor.
			<img style="display: block; margin: 1em auto;" src ="data:image/png;base64,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"/>
		</td></tr>
		<tr><th>rotate</th><td>
			The <code class="code">function rotate(angle)</code> rotates the
			coordinate system clockwise by the given angle. The angle is given
			in radians, i.e., a full rotation corresponds to the angle
			<code class="code">2 * math.pi()</code>.
			<img style="display: block; margin: 1em auto;" src ="data:image/png;base64,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"/>
		</td></tr>
		<tr><th>transform</th><td>
			The <code class="code">function transform(A, b)</code> transforms
			coordinates (x, y) into new coordinates A (x, y) + b, where A is
			the 2x2 matrix <code class="code">[[A11, A12], [A21, A22]]</code>
			and b is the vector <code class="code">[b1, b2]</code>.
			<img style="display: block; margin: 1em auto;" src ="data:image/png;base64,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"/>
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
				var x;		 # horizontal pointer position
				var y;		 # vertical pointer position
				var buttons;   # array of pressed buttons
				var shift;	 # shift key pressed?
				var control;   # control key pressed?
				var alt;	   # alt key pressed?
				var meta;	  # meta key pressed?
			}

			class MouseButtonEvent
			{
			public:
				var x;		 # horizontal pointer position
				var y;		 # vertical pointer position
				var button;	# button that caused the event
				var buttons;   # array of pressed buttons
				var shift;	 # shift key pressed?
				var control;   # control key pressed?
				var alt;	   # alt key pressed?
				var meta;	  # meta key pressed?
			}

			class KeyboardEvent
			{
			public:
				var key;	   # name of the key that caused the event
				var shift;	 # shift key pressed?
				var control;   # control key pressed?
				var alt;	   # alt key pressed?
				var meta;	  # meta key pressed?
			}

			class ResizeEvent
			{
			public:
				var width;	 # new width of the canvas
				var height;	# new height of the canvas
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
		<div class="examples">
		<h3>Examples</h3>
		<tscript do-not-run>
			function onMouseMove(event) {
				var radius;
				if event.shift then
					radius = 2;                                # set radius to 2 if shift is pressed
				else
					radius = 1;                                # else set radius to 1

				canvas.circle(event.x, event.y, radius);       # draws a circle centered at point where mouse moved to
			}
			setEventHandler("canvas.mousemove", onMouseMove);
			enterEventMode();
		</tscript>
		<tscript do-not-run>
			function onMouseOut(event) {
				print("left canvas");                          # prints when the mouse leaves the canvas
			}
			setEventHandler("canvas.mouseout", onMouseOut);
			enterEventMode();
		</tscript>
		<tscript do-not-run>
			function onMouseDown(event) {
				canvas.circle(event.x, event.y, 1);            # draws a small circle centered at the point where the mouse button was pressed
			}
			setEventHandler("canvas.mousedown", onMouseDown);
			enterEventMode();
		</tscript>
		<tscript do-not-run>
			function onMouseUp(event) {
				canvas.circle(event.x, event.y, 1);            # draws a small circle centered at the point where the mouse button was released
			}
			setEventHandler("canvas.mouseup", onMouseUp);
			enterEventMode();
		</tscript>
		<tscript do-not-run>
			function onKeyDown(event) {
				print(event.key);                              # prints the key that was pressed
			}
			setEventHandler("canvas.keydown", onKeyDown);
			enterEventMode();
		</tscript>
		<tscript do-not-run>
			function onKeyUp(event) {
				print(event.key);                              # prints the key that was released
			}
			setEventHandler("canvas.keyup", onKeyUp);
			enterEventMode();
		</tscript>
		<tscript do-not-run>
			function onResize(event) {
				print(event.width + " " + event.height);       # prints the new size of the canvas
			}
			setEventHandler("canvas.resize", onResize);
			enterEventMode();
		</tscript>

		<h3>The Bitmap Class</h3>
		<p>
		The class <code>Bitmap</code> fulfills two purposes: it allows for
		offline drawing, and it offers a convenient way to use image resources
		in programs.
		</p>
		<table class="methods">
		<tr><th>Bitmap</th><td>
			<code class="code">Bitmap(resourceOrWidth, height = null)</code>
			constructs a bitmap (image) object. The parameter
			<code class="code">resourceOrWidth</code> is either a resource string
			containing a <a href="?doc=/dataURI">data URI</a>, or an integer
			specifying the width. The height parameter is relevant only in the
			latter case. The constructor creates a bitmap image with the given
			content, or of the given dimensions. A bitmap created from dimensions
			is initially transparent black.
		</td></tr>
		</table>

		<h3>Methods</h3>
		<table class="methods">
		<tr><th>Bitmap.width()</th><td>
			The method returns the width of the bitmap in pixels. An alternative
			way of querying the width of a bitmap is to set it as the current
			drawing target, then call <code>canvas.width()</code>, and finally
			reset the old drawing target. This method avoids the complication of
			that procedure.
		</td></tr>
		<tr><th>Bitmap.height()</th><td>
			The method returns the width of the bitmap in pixels. An alternative
			way of querying the width of a bitmap is to set it as the current
			drawing target, then call <code>canvas.height()</code>, and finally
			reset the old drawing target. This method avoids the complication of
			that procedure.
		</td></tr>
		</table>

		<h3>Examples</h3>
		<tscript>
			var jpg_data = "data:image/jpeg;base64,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";
			var image = canvas.Bitmap(jpg_data);
			canvas.paintImage(100, 100, image);
		</tscript>
		<tscript do-not-run>
		canvas.setFillColor(1, 1, 1);
		canvas.clear();
		var h = canvas.height();
		canvas.setOpacity(1);
		while true do
		{
			var a = math.random() * 0.9 * h;
			var b = math.random() * 0.1 * h;
			canvas.setFillColor(1, 1, 1);
			canvas.fillRect(0, 0, 1, h);
			canvas.setFillColor(1, 0, 0);
			canvas.fillRect(0, a, 1, b);
			canvas.paintImage(1, 0, null);
			wait(0.01);
		}
		</tscript>
	</div>
	`,
			children: [],
		},

		{
			id: "audio",
			name: "Audio playback",
			title: "Audio playback",
			content: `
			<p>TScript supports playback of audio. The class <code class="code">Sound</code>
			represent sound samples. A sound sample consists of channels, where each channel
			is represented by a buffer: an array of numbers, with values ranging from -1 to 1.
			As an alternative to providing explicit buffers, sound objects can be constructed
			from media resources encoded as a data URI in a string.
			</p><p>
			Each sound sample can be played an arbitrary number of times, and even
			repeatedly in a loop. Re-using a sound sample object is much faster than
			creating a new sound sample object from an array each time the sound
			shall be played.
			</p>
			<h3>Classes and Constructors</h3>
			<table class="methods">
			<tr><th>Sound</th><td>
				<code class="code">Sound(buffers, sampleRate = null)</code>
				constructs a sound sample object. The parameter
				<code class="code">buffers</code> is an array of arrays containing the
				samples to be played, or a string containing a <a href="?doc=/dataURI">data URI</a>.
				The second parameter <code class="code">sampleRate</code> specifies the
				rate at which the array samples are to be played in Hz. The sample rate
				should be in the range 8000&nbsp;Hz to 96000&nbsp;Hz. If the first parameter
				is a data URI, then the sample rate is ignored.
				Typical channel numbers are one (mono) and two (stereo).
			</td></tr>
			</table>

			<h3>Methods</h3>
			<table class="methods">
			<tr><th>play</th><td>
				The <code class="code">function play</code> starts playing the sound.
				The playback is asynchronous, meaning that the call returns immediately
				regardless of sound duration. Further instances of the sound can be
				played by calling the function again, even while the sound is still
				playing.
			</td></tr>
			<tr><th>startLoop</th><td>
				The <code class="code">function startLoop()</code> starts looping the
				sound, i.e., playing the sound repeatedly. The function returns
				immediately. In contrast to <code>play</code>, for each sound sample
				object, only a single loop can exist at a time.
			</td></tr>
			<tr><th>stopLoop</th><td>
				The <code class="code">function stopLoop()</code> stops a sound loop
				that was previously started with <code>startLoop</code>.
			</td></tr>
			<tr><th>looping</th><td>
				The <code class="code">function looping()</code> returns
				<code>true</code> if the sound loop is currently running, and
				otherwise <code>false</code>.
			</td></tr>
			</table>

			<div class="example">
			<h3>Example</h3>
			<p> The following code plays two different tones on the left and right channels
			of a stereo device. <code class="code">l_freq</code>, <code class="code">r_freq</code>
			and <code class="code">sampleRate</code> can be modified to alter the tones.
			<tscript>
				use namespace math;
				use namespace audio;

				var durationInSeconds = 2;
				var l_freq = 440; # frequency in Hz
				var r_freq = 554;
				var sampleRate = 8000; # sampleRate in Hz

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

				var sound = Sound([l_samples, r_samples], sampleRate);
				# only play 0.5 of 2 seconds
				sound.play();
				wait(500);
				# all sounds are stopped at the end of the program
			</tscript>
			</div>

			<div class="example">
			<h3>Example</h3>
			<p> The following code constructs a sound object from a data URI, representing
			mp3 encoded data. The sound is played three times.
			<tscript>
			var mp3 = "data:audio/mpeg;base64,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AQAAAaQAAAAgAAA0gAAABKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqv/7FGThj/AAAGkAAAAIAAANIAAAAQAAAaQAAAAgAAA0gAAABKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqv/7FGThj/AAAGkAAAAIAAANIAAAAQAAAaQAAAAgAAA0gAAABKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqv/7FGThj/AAAGkAAAAIAAANIAAAAQAAAaQAAAAgAAA0gAAABKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqv/7FGThj/AAAGkAAAAIAAANIAAAAQAAAaQAAAAgAAA0gAAABKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqv/7FGThj/AAAGkAAAAIAAANIAAAAQAAAaQAAAAgAAA0gAAABKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqv/7FGThj/AAAGkAAAAIAAANIAAAAQAAAaQAAAAgAAA0gAAABKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqv/7FGThj/AAAGkAAAAIAAANIAAAAQAAAaQAAAAgAAA0gAAABKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqg==";
			var sound = audio.Sound(mp3);
			for 0:3 do
			{
				sound.play();
				wait(1000);
			}
			</tscript>
			</div>
		`,
			children: [],
		},
	],
};
