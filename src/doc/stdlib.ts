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
            <div class="example">
            <h3>Example</h3>
            <tscript>
var a = [1, 2, 3];
var b = a;
var c = deepcopy(a);
var d = [1, 2, 3];

print(same(a, b));      # prints true;
print(same(a, c));      # prints false;
print(same(a, d));      # prints false;
print(same(a, 1));      # prints false;
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

if confirmed then print("Hello World");         # if user confirms, the program prints "Hello World", else nothing
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

if not s == null then print(s);                                       # prints the input given by the user
else print("process was terminated by user");                         # if process is terminated without input given, it tells the user
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
				<li>It must not contain functions.</li>
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

print(b);               # prints [0, 1, 2, 3], since it's a reference to the same array also referenced by variable a
print(c);               # prints [0, 1, 2], since it's a copy
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
			It is an alternative to <a href="?doc=/language/expressions/binary-operators/power">operator ^</a> that always works with reals.
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
turtle.pen(true);           # lower the pen
turtle.move(50);            # black line upwards
turtle.color(1,0,0);        # turn color red
turtle.turn(90);            # turn 90 degrees clockwise
turtle.move(50);            # red line to the right
turtle.color(0,1,0);        # turn color green
turtle.turn(90);            # turn 90 degress clockwise
turtle.move(50);            # green line downwards
turtle.color(0,0,1);        # turn color blue
turtle.turn(90);            # turn 90 degrees clockwise
turtle.move(50);            # blue line to the left
        </tscript>
        <center>
        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAHXCAMAAAD9dRLCAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACKUExURe7u7vDPz/Kvr+/b29TU1NeXl+pqavd3d/J5dNSKZszSq9vv25iYmJZcXMhTU/aBgeaJeIa7RnjmZq/yr3tzc5+Oju/e3t/gz4LteHf0dHd3d97v3oH2gXf3d2Fhj2JivpiY9I6Z6lOer2rchsPDw4aGxmFh4Xd393N381x53JfNvs/wz8PD8dTU8ADkF9wAAAAJcEhZcwAADsMAAA7DAcdvqGQAAALKSURBVHhe7dM3UiQBEEXBQS6igUVrrdX9r4fTPhEzVvMyrXJ/xKsZAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADwq6XlaVsZdzCf1bX1fxO2sbm1PS5hLsPO7t6E/d8/OByXMJfh6Phkwk7PzgWwkOFiGK9Jury6FsBCBBAngDgBxAkgTgBxAogTQJwA4gQQJ4A4AcQJIE4AcQKIE0CcAOIEECeAOAHECSBOAHECiBNAnADiBBAngDgBxAkgTgBxAogTQJwA4gQQJ4A4AcQJIE4AcQKIE0CcAOIEECeAOAHECSBOAHECiBNAnADiBBAngDgBxAkgTgBxAogTQJwA4gQQJ4A4AcQJIE4AcQKIE0CcAOIEECeAOAHECSBOAHECiBNAnADiBBAngDgBxAkgTgBxAogTQJwA4gQQJ4A4AcQJIE4AcQKIE0CcAOIEECeAOAHECSBOAHECiBNAnADiBBAngDgBxAkgTgBxAogTQJwA4gQQJ4A4AcQJIE4AcQKIE0CcAOIEECeAOAHECSBOAHECiBNAnADiBBAngDgBxAkgTgBxAogTQJwA4gQQJ4A4AcQJIE4AcQKIE0CcAOIEECeAOAHECSBOAHECiBNAnADiBBAngDgBxAkgTgBxAogTQJwA4gQQJ4A4AcQJIE4AcQKIE0CcAOIEECeAOAHECSBOAHECiBNAnADiBBAngDgBxAkgTgBxAogTQJwA4gQQJ4A4AcQJIE4AcQKIE0CcAOIEECeAOAHEDTe3dxN2//AogIU8Pb+8Ttjb+8fnuIT5fI2/NFXf4w4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPjjZrMfL8fhleLB8v4AAAAASUVORK5CYII=">
        </center>
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
        <div class="example">
        <h3>Example</h3>
        <tscript>
var points = [[10, 10],[100, 10],[100, 100],[55, 150],[10, 100]];   # array with corners of the polygon

canvas.setLineColor(1,0,0);                                         # sets the line color to red
canvas.curve(points, true);                                         # draws a connection between the points of the array points

canvas.setFillColor(0,0,1);                                         # sets the fill color to blue
canvas.fillArea(points);                                            # fills the area surrounded by the points of the array points
        </tscript>
        <center>
        <img src="data:image/png;base64,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">
        </center>
    </div>
		<h3>Transformations</h3>
		<table class="methods">
		<tr><th>reset</th><td>
			The <code class="code">function reset()</code> resets the current
			transformation. Afterwards the origin of the coordinate system is
			the top left corner, with axes extending to the right and to the
			bottom.
            <center>
            <img src ="data:image/png;base64,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">
            </center>
		</td></tr>
		<tr><th>shift</th><td>
			The <code class="code">function shift(dx, dy)</code> translates
			the origin of the coordinate system by the vector (dx, dy).
            <center>
            <img src ="data:image/png;base64,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">
            </center>
		</td></tr>
		<tr><th>scale</th><td>
			The <code class="code">function scale(factor)</code> scales the
			coordinate system by the given factor.
            <center>
            <img src ="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAv4AAAOaBAMAAAASWUtyAAAAIVBMVEX///Lk4N3+ubCcnJvwQEKnLY1bW1ZELNcEM/8DKdYEBAXoIjUyAAAVJklEQVR42uyaPW/bRhiA3ysbGfBEgYBRaSqMDM1Ggw0Bc2oD9Q+k9ZDNAgEB5ZShQJpO+gk1tJiZIghQkfuVfb/U8zli2phVJEPvg4i8L94dHx6PRzpQGPsEWmOfmP8+LCCQdEfaHAKXUcT89+HP4R26I60bBkZRxPzv3f9M+bU1Ptt/sYGUZyES5aD/Qrn42P81COb/Af4rj9RFUZLyEgV7giKVV8h/VhfC1Pz/v/5x++5iODzjIY9GP1AC+2+Fd+wfizDb/L9BXpt/8//o+Az/nrnY6r8oCvU/h6S9BRgt4DWMblyL/3JMugG4bI1t/gHg9K7/JQCM2T8I4//g//lk8i35XwCKngO4BfDm7TzhpBTgSWv08f+hRd51+J9c/fKC/M9dm45SHPgLHP3wO1zmJ/PkFp6lI8wxduX/+U9XLyfsP2mRG0D/r3D007VobwH9w6g1evn/6w3yx3b/319dvXz6LfmnWWYuUw/NPidweQPoHzdftUYf/0vgkt3+f9DxfwsnNxv/zrVzh/NP2+bwtjV25P83Hv86/5/As7n6v8FRnz9ZwHe0IHrVGrvxD1+/OD9n/wvgyR7U/y08aeeUlAPY83d3/t3k/HyyWf/j7xv4mf23/PhN0tEt2AN4h/7h6WTyo73/frH3r6wQ/vHvnp7b94fd+i8Y8T/2gn3/7O8flY+nd/3jT/wPBfWvMfO/g+//M4SUl7jv+P4/U9j/mUbs71/2999HjfnvwvwfA4thIOuOtBfDwOXdiP3/nz0DhmEYhmEYhmEYhmEYhmEYhmEYhmEYhmEYhmEYhmF8QZJZDlspCthQ1vApilmdgvEwTv172ErjU1C8h09w5j3WYezLv0eW8GBcedS3T2//ifd1+XD/iUfWORwrvf0P/Aog7aGfWMGx0unfR/4fUAGS/KvYMcpv8He0N0Bv/2N/3ct/ncLZET/A9+1/Ckh1vBNQb/+Vz3v4T/QZsoYjZb/+leRA/Ye1cVbOCkkqUkq+4GCuSbmWUGMZ5Qey2SbqqBam4DT1H5oSMgze969HZoUa073LKj8dDrWCHKJ2stKvC+mkkwb1BLLZxWPw7xpaG6cYqDyykq6+5+Sc1K307l2iH89lpQhSR++nfsoZDdWiAS2i/hNpSg7gYOy/0iMbalj3cjijrWiituPC2tI1oRN+mWD9j8F/5YklBZhr8S8XI/R6jArPPLMUNwQIamEdMq4pwOTqPzQVDlhF/geb8pUUB84N/uN1fCXtBP+a4nPxT7FH4J+GyayhrmGgKHXokpkZnQuJ2szA+FvXJZaVw4qi4Sx9tmF0zSG/Lkmy0/qW4l+y6qIRqWPMxWDkn3qC7VPmMhI20Kt7KhWoYS3diH9JKWbhBO77Hxzk+mdME4KryH/N04La9VNwOozzzZtqtU45L0WjrKgCpaKSrt6s8lxDE8NUouI/ZFFRaChc3vO/4jHMV1OFRfXD6ToH6VVoh12HM6F7VDrpayghIFf18KAzE3UFIE66Ty60x1qAlGSpzsqUlW//jqCjEw+c6hgW/1pIrTop1sT+U8mg5kGOinuZ5OxRKtN2gv9GOsq7jyZ/zT88xECgUf+5qtLTTe6NxarDP/uO6xeTmqU7DQ8i/0utncK5BpUQ1FvPeR+tP2XkSFG+JpFszT/AL6Au8iXjSk+Jd3wRdPkT3kV5s2V9zqW3+w9V+HUo1gQnrCfcc9qVuH5tQgZ97F8nLV2wJZHsA3790s4HKvUfDdXgW4J8lvFRqzA4haCV/fNGU0KxyH+oAO85Senwr5twCnqgRrXTMdVBTv+Dbv96czjvYwFjnWDrqBqOsrkO/zSyhwSmULEO/wO957gT3f5PI/+hZVYvaTHuMD9/8skormw8EvvXaUBFZVRCJwe/Su+ena+Dhai+4F8Q/9fd/sWhdi32n808svybXXvXbeMKAjB81gxUuCKjwIWqJFB6EuxYJUGM9IaDpBRhQMXWEZIXMKTHsCBgCz5luIezO1qKAQG78Fz+rzAkLS/ykJwzF8kjnox/czr+b0xWn5N8of2Lxl/OvvpVLRi1RZNWVvvfJ81TQ2P9WfGXs/J1vc0k/toAXp2I/83wVqg/c1H9SPwlhCfiLzeZySGs8S+XulGSl0bOZY3Zcfy72+pDORP/+pmb5JyN9Fxn46/vfw+n7+RD3taE0k7jLxEZGqhurv/RmVbv8np0GpfxhND466Uz8ZfPnFzT+Pev4GrM/5/O5H8Xb/9n5++sBvc4/vJvjZccYRI7LbL187OUKOg77mT8NXyn418/c5PKeKMNwWecv/WXMVj8a7+kr8S0/hlCuNnN5bYa/2lE5a4SF72o8ddLZ+rPQ0w1hPLQ8ljn6s9p7SRak8WnxF9D8jL+8qPd7mWinUZULsirqDfT+Osl+VrbJB1cyOyz6aehn17Gv2j8u//pv67G9kxdmOx9n5fFawnmNP8Mb/jtMFSczgJqiKbxl9FNWUn8G41/f0noR+l4/qDjPnmak/HXV26lzeI4f7ipP3Px9h9+tVk3zhmm8Zd3liSFbsz66+knYTuGrl4tb55k3Hil8S9DBzQfhpizo/nnUt+pm/rtJP7yAE3/G+vz6ChI6uLxP6AubPZeezVA233t0h1+8aY9Ef9ZLS0laE1bv2k/1Egsh0/RVt6AfY207JudeuRJhLV86uO3eZRiq9kcxb/rfyTDZJ3ea/xbWRM9Dg92Kc3CtlnLT5pWP6qiXllXBl+F2W5YXbV1EXMi/s1uzM27eoubw401RP2updtpjyCLwf4mrcS/Xqr3l89Fr9s8i3+nzUW9rUZQ68/d7W39MOrzyMatk45QHmAa/3Z3YDILyR5PQtK9Po6/jOl1D/XmMH/ubYtoNXStbhH3njYaf7mTHLC95fP4P13stKeeabCO+6+tLkClIJ7sH7viK/5NK4Hs00G3PI6/fH61yV3OaupuJ+v3+u1Wv1zJA3fzq2H+LD8Z7nVR7zCJ/+HhJw3TifnDttk9Tp+yaXX/Lq/fcf7pmf0L9sv1/NkXi7K3KFUjFxZFLOot5MaLopp1f6Vq9g8jX6yGh1iMT7UabjZbD1f1ueSeWgcJ/YXkTvo81eVqfPjx9vgiZiv2HGz+sUgeNv9YJA+bfyySx8bovDgLwxODDPpZHb6i9aoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQErNj2n9UAy4/i2v78vX9+r3f7J6Xwx49fYhqY/vigXX/z7k9NFE/i/f/fmQ098G0n89AB5yejcvJiQ9AO5/LTb8lPMAuLOR/vcHwF8PGRlJ//sDIOUBfG+i+s/bAZhJ/0k7gLufixXXGQ+AP6yk/6QdgJXqf695my8BGUr/KQ8AI8Ofg2/yHQBmqv+cHcC9ofRfSpOuAzCV/hOOgAxV/yk7AFPpP18HYGf4k3MEZGT1m7YDMFX9J1wCG0v/6Q4AU9V/viWwseo/XQdgZvWbdAlsLv3nGgFZq/6zdQAG03+qDsDY8CfdCMjQ6jdlB2Cv+k+1BDaZ/hMdAOaGP8mWwAar/0wdgK3Vb74lsNH0n2YEZLL6T9QBGE3/WToAi8OfTCMgc6vfZB2A0eo/zRLYbPpPcgAYrf6zLIHNVv9JOgCDq99US2DD6T/DCMhu9Z+jAzCd/hN0AGaHP0lGQCZXv4k6AMvVf4IlsPH0H/4AMDz8SbEENl39x+8ArK5+syyBzaf/4CMg49V/+A7AfPqP3QHYHv7EHwEZXv2m6ADMV//Bl8AO0n/oA8B89R+7A3BQ/YfuAEyvfhMsgV2k/7gjIA/Vf+QOwEn6D9sBOBj+hB4BGV/9hu8AXFT/cZfAbtJ/0APAxfAncAfgpPqP2gHcv/eS/mOOgByl/5AjIDfVf9AOwFH6j9gBeBn+RB0BuVj9Bu4AHFX/IZfArtJ/wAPAzfAnZgfgqvoP2AHc/VJ8CTYCcpb+o42AfFX/8ToAd+k/WAfgavgTcATkZvUbtANwVv1HWwI7TP+hDgBnw59wHYC76j9WB+Bp9RtxBOQy/QcaATms/kN1AC7Tf5wOwN/wJ9YI6N7X6nfUBOkAXFb/gZbATtN/mAPA4fAnUgfgtPoP0wG4W/0GGwG5Tf8xRkBeq/8oHYDj9B9iB+B0+BNmBHTnN/2X8q3/DsBt9R9jCew6/Qc4ANwOf4J0AI6r/wgdgM/Vb5wRkPP0734E5Hj4E6IDcJ7+vR8Anoc/EUZAXle//7VzbzeOXFcUhsmCI2hMAhaqU3AAhgjOs2Gg2wlMBDZQCQwkBSDA4UrC6DpqHrLVrNmX8/0h1MPZ618LqC4jcPH0X34ELv/8Fx+BS5c/9Q2gfPovbgDl03/xCqjB81/ZAKqXP9UNoMXzX/gAlJ5+G1RApaffBiNwg/RfeQRu8vyXHYEblD+lDaBF+q9rAD3Sf90KqM3zX9QAWpQ/hQ2gzfNf8wDUn35rV0D1p9/aI3Cb9P8T7/7zbTWalD9lR+Am5U9VA2iU/ksaQKP0X7ICapT+KxpAn/KnpgE0e/7LHYAm02/ZCqhV+i84ArdK/58M4P/f1qFT+VOxAvr41aEbpQygWfqvZgDd0n+1Cqhd+i9mAM3Kn3IG0PD5r3QAOk2/FSugfum/lgG0mn4LjsDtyp9iFdC/en7/KgbQMv0XMoCW6b9QBdQy/dcxgI7lTyUDaPv8FzkA7abfYhVQ0/RfxgDaPv81DKBn+VOnAmo4/ZYygLbpv4YB9E3/NQ5A4/RfwgDalj9FDKD185//APScfutUQJ3TfwUD+Nj7+U9vAI3LnxIVUNPpt4oBNE//6Q2gefpPfwCap//sBtC7/MlvABM8/6kPQOPpt0QF1D79JzeACZ7/zAege/mTvQJqPf0WMIAJ0n9mA5gh/WeugKZI/4kNYILyJ7UBTPL8Zz0A3aff7AYwR/rPawDtp9/kB2CK8idxBdR++s1tANOk/6QGME36T1oBTZP+cxrALOVPVgOY6vlPeACmmH4TG8BE6T+lAUz1/Oc7APOUPzkroEmm37QGMFX6z2cAc6X/fBXQZOk/nQFMVf4kNIDpnv9cB2Ce6TenAcyW/rMZwETTb8oDMFn5k64Cmmj6zWgAE6b/VAbwvzm/f5oKaML0n8kA5it/chnApM9/mgMw2fSbzgCmTP+JDGDS5/9wWFJ8/xnLn0wV0HTTbzIDmDT9ZzGAb/498fe/agDSf3cDmHD6TWUAEz//Nx0A02/rAzBv+s9hAFNOv79x7fsrf5pXQFNOv3lG4KnT/w0GYPrtbQBTp/9bDMD029kApn/+rxwA02/vAzB5+r9qAKbfQ+cReO7y54YKyPR7ODQegadP/1cMwPR7ODQ2AOn/igGYfn+krwF4/scHwPT7I30PgPQ/NgDT7ye6jsDKnysVkOn3Ez1HYOl/bACm31/oaQDS/xUDMP3+TEsD8PyPD4Dp91daHgDpf2wApt/f0W8EVv5cqYBMv1+Sd3/8/tL/H2lnAKbfkQFI/5/TzQBMvwMD8Px/TrcDYPodHgDp/3OaGYDpdzgCK39eoFMFZPr9E8ffvr/0/2daGYDpd2QA0v+L9DEA0+/AADz/L9LpAJh+RwdA+n+ZPgbg+R+OwMqfCzSpgD46v4MRWPq/RBMDMP2ODED6v0wPAzD9DgzA83+ZHgfA9Ds6ANL/gBYGYPodsG7KnyH1KyDpfzgCS/8DGhiA6feKAUj/I6obgOn3mgF4/i9T/wCYfq8eAOl/QHUD8PxfHYGVP0NKV0Cm3xtGYOl/QGkDMP3eYgDS/4jKBmD6vckAPP+XqXwATL+3HQDpf0BhAzD93sS6KX+GVK2ApP8bR2Dpf0BZAzD93mwA0v+ImgZg+r3dADz/l6l6AEy/rzgA0v+Amgbg+b+Z5az8GVKwAjL9vmoElv4HFDQA0+/rDED6H1HPAEy/rzQAz/9l6h0A0+9rD4D0P6CcAZh+X8m6KX+G1KqApP9Xj8DS/4BiBvC977+vAUj/mQ3A9LuzAXj+Ux8A0+/OB0D6T20Anv+dR2DlT+YKyPT7F0dg6X9AGQP4TvmznwFI/+kNwPS7nwF4/tMfANPvjgdA+k9vAKbfHUdg5U/6Ckj6f8MILP0PKGEAyp83GYD0PyK/AZh+32YAnv/LVDgApt83HgDpf0B+A/D8v3EEVv4MSV4BSf9vHoGl/wHZDUD582YDkP5H5DYA0+8dDMDzf5ncB8D0e48DIP0PSG0Apt87sG7KnyF5KyDp/y4jsPQ/ILEBKH9iDeC/fz/gHgZg+h2Q1gA8/3c7AMqfy6Q9ANL/3QzA9Dsi5wis/LljBST9j0g5Auv+72gAyp8BKQ3gm386v3c0AOl/QEYD8Pzf9QAofy6T8QBI/3c2ANPvgHwjsPLnzhWQ9D8i2wis+7+7ASh/BmQzANPv3Q1A+h+QzAA8/zscAOXPZZIdAOl/BwMw/Y7INAIrf3apgKT/EYlGYN3/Lgag/BmQyABMvzsZgPQ/II8BeP53OgDKn8vkOQDS/24GYPodkGUEVv7sVgFJ/yNyjMC6/x0NQPkzIIcBmH53NADpf0AKA/D873oAlD+XSXEApP9dDcD0G8lyVv5Eclw36T+Sd5vuP5LlSfkTyXIy/YbyuEn/kazPnv8BwQfgO+l/9wMg/UdyXDfTbyTrpvyJ5OEs/UdyPOv+Q3nclD+RrM+m30iWJ9NvJMvJ8z8g8AB8L/1/CdZn6T+Sh/em30iWs/InkuO6Sf+RvNt0/5EsT8qfSJaT6TeUx830G8n67PmPZHky/UaynKT/SI6r9B/Kuil/Ink4S/+RLGfdfyiPm+c/kvXZ9BvJ8mT6jWQ5ef5DedxMv5Gsz9J/JA/vpf9IlrPyJ5Ljukn/kayb7j+S5cnzH8lyMv2G8riZfiNZnz3/kSxPpt9IlpP0H8lxlf5DWTflTyQPZ+k/kuWs+w/lcfP8R7I+m34j+duT6TeS5eT5D+Vx88+fSNZn6T+Sh/fSfyTLWfkTyXHdpP9I1k33H8ny5PmPZDmZfkM5mX5DWb/2/ESyfO35iWSRPkM5fnUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABfiA8I4x8fPvj+L/LFvv8PVcIUBAG6jDgAAAAASUVORK5CYII=">
            </center>
		</td></tr>
		<tr><th>rotate</th><td>
			The <code class="code">function rotate(angle)</code> rotates the
			coordinate system clockwise by the given angle. The angle is given
			in radians, i.e., a full rotation corresponds to the angle
			<code class="code">2 * math.pi()</code>.
            <center>
            <img src ="data:image/png;base64,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">
            </center>
		</td></tr>
		<tr><th>transform</th><td>
			The <code class="code">function transform(A, b)</code> transforms
			coordinates (x, y) into new coordinates A (x, y) + b, where A is
			the 2x2 matrix <code class="code">[[A11, A12], [A21, A22]]</code>
			and b is the vector <code class="code">[b1, b2]</code>.
            <center>
            <img src ="data:image/png;base64,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">
            </center>
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
        <div class="example">
        <h3>Example</h3>
        <tscript do-not-run>
function onMouseMove(event) {
    var radius;
    if event.shift
        radius = 2;                                 # sets radius to 2 if shift is pressed
    else
        radius = 1;                                 # else to 1

    canvas.circle(event.x, event.y, radius);        # draws a circle with center at point where mouse has been moved to
}
setEventHandler("canvas.mousemove", onMouseMove);
enterEventMode();

function onMouseOut(event) {
    print("left canvas");                           # prints, once the mouse has left the canvas
}
setEventHandler("canvas.mouseout", onMouseOut);
enterEventMode();

function onMouseDown(event) {
    canvas.circle(event.x, event.y, 1);             # draws a circle with center at the point where the mouse has been pressed with radius 1
}
setEventHandler("canvas.mousedown", onMouseDown);
enterEventMode();

function onMouseUp(event) {
    canvas.circle(event.x, event.y, 1);             # draws a circle with center at the point where the mouse button has been released with radius 1
}
setEventHandler("canvas.mouseup", onMouseUp);
enterEventMode();

function onKeyDown(event) {
    print(event.key);                               # prints the key that has been pressed
}
setEventHandler("canvas.keydown", onKeyDown);
enterEventMode();

function onKeyUp(event) {
    print(event.key);                               # prints the key that has been released
}
setEventHandler("canvas.keyup", onKeyUp);
enterEventMode();

function onResize(event) {
    print(event.width + " " + event.height);        # prints the new size of the canvas
}
setEventHandler("canvas.resize", onResize);
enterEventMode();
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
