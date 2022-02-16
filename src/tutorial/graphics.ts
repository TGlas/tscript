export const tutorial_graphics = {
	id: "graphics",
	title: "Simple Graphics",
	sections: [
		{
			content: `
			<p>
			Our first two commands, <code>print</code> and <code
			class="code">alert</code>, output text. However, modern computers
			interact with users primarily through graphical interfaces, not through
			consoles and message areas. TScript offers the possibility to render
			simple graphical output. There are two different ways to do so - Turtle
			and Canvas Graphics. The output is drawn to specific panels called
			"Turtle" and "Canvas". They can be toggled with the corresponding
			buttons in the toolbar of the IDE.
			</p>
			`,
		},
		{
			content: `
			<h2>Turtle Graphics</h2>
			<p>
			A simple way to create graphical output is with the so called Turtle
			Graphics. Imagine a little artificial turtle, which you can steer
			programmatically, running over its panel while drawing with an
			attached pencil. In essence, the turtle is controlled with only two
			commands: <code>turtle.move</code> and
			<code>turtle.turn</code>. The move command makes the
			turtle move straight for a given distance, while the turn command
			makes it rotate in place by an angle specified in degrees
			(in contrast to radians). Let's try it out:
			<tscript>
			turtle.move(50);
			turtle.turn(45);
			turtle.move(30);
			</tscript>
			Copy the commands over into the editor and run the program. You
			should see a line with a kink on the turtle panel. If you cannot see
			the figure then you need to activate the turtle panel by pressing the
			corresponding toolbar button. The following just happened:
			<ul>
			<li>The imagined turtle robot started in the middle of the gray area,
				heading upwards.</li>
			<li>It was instructed to move 50 units straight ahead. While doing so,
				it was drawing a black line onto the gray background with its
				attached pen.</li>
			<li>After stopping, it turned 45 degrees to the right. Afterwards,
				it was heading diagonally towards the top right. Since it turned
				in place, this operation did not draw anything new.</li>
			<li>The turtle moved diagonally into its current direction for 30
				units, drawing a second line. Naturally, the second line started
				where the first one ended.</li>
			</ul>
			Since the turtle can move quite fast, we only see the end result, as
			if it had been created in a single step. However, that is not the case.
			</p><p>
			The move and turn commands can be combined freely, and with arbitrary
			numbers. In particular, negative numbers are fine. Since the turn
			command makes the turtle rotate by a number of degrees to the right,
			<code>turtle.turn(-90)</code> makes it turn by 90 degrees
			<i>to the left</i>, due to the negative sign of the parameter.
			Likewise, <code>turtle.move(-20)</code> makes the
			turtle move backward.
			</p><p>
			To make things a bit more interesting, the turtle can move its pen up
			and down, and it can change its color. Lifting the pen works with the
			command
			<tscript>
			turtle.pen(false);
			</tscript>
			while
			<tscript>
			turtle.pen(true);
			</tscript>
			lowers the pen. We will encounter the keywords
			<code>true</code> and <code>false</code>
			again in later units. Moving around with lifted pen changes the position
			of the turtle robot without drawing lines. The color is changed as
			follows:
			<tscript>
			turtle.color(1, 0, 0);    # red
			turtle.move(20);
			turtle.color(0, 1, 0);    # green
			turtle.move(20);
			turtle.color(0, 0, 1);    # blue
			turtle.move(20);
			turtle.color(1, 0.5, 0);  # orange
			turtle.move(20);
			turtle.color(0, 0, 0);    # black
			turtle.move(20);
			</tscript>
			Again, copy the program over to the editor and see the effect. In a
			computer, colors are frequently encoded with the
			<a target="_blank" href="https://en.wikipedia.org/wiki/RGB_color_model">red-green-blue (RGB) color model</a>.
			Each color is additively composed of the three base colors red, green,
			and blue, which can be fully on (value 1) or fully off (value 0), or
			take any gradual value in between. Turning everything off yields black,
			white is all-on, and setting the three color channels to the same value
			results in shades of gray. Combining red with blue gives violet, and so
			on. The only counter-intuitive combination it that adding red and green
			gives yellow, and the same is required for mixing orange and brown.
			</p>
			<p>
			<div class="tutorial-exercise">
			Try out the turtle graphics by yourself. Draw a square using the
			move and turn commands. Use a side length of 50 and an angle of
			90&deg;.
			</div>
			</p>
			`,
			correct: `
				turtle.move(50);
				turtle.turn(90);
				turtle.move(50);
				turtle.turn(90);
				turtle.move(50);
				turtle.turn(90);
				turtle.move(50);
				`,
			"ignore-order": true,
			tests: [
				{
					type: "code",
					code: "",
				},
			],
		},
		{
			content: `
			<h2>Canvas Graphics</h2>
			<p>
			Turtle graphics is extremely restricted. It is apparently unsuitable for
			creating complex user interfaces, or actually anything beyond simple
			line drawings. Its main use is in teaching programming concepts. More
			serious drawing capabilities are offered by canvas graphics.
			</p>
			<p>
			The canvas is a two-dimensional area, on which we can draw arbitrary
			shapes, curves, and text. This is sufficient, in principle, for
			displaying all kinds of controls, like buttons, sliders, check boxes,
			and so on. It is also what allows us to create simple games. It could
			in principle be used even for displaying complex three-dimensional
			graphics, however, TScript is not the right programming language for
			that purpose.
			</p>
			<h3>Drawing Shapes</h3>
			<p>
			On the canvas we can draw <i>lines</i> (and curves), <i>shapes</i>
			(filled areas), and a combination of both (filled areas with a
			frame-like boundary). Finally, it has special means to draw text.
			Everything that is drawn is specified in terms of coordinates. The
			top left corner of the canvas has coordinates (0, 0). The first
			coordinate is the number of pixels we move to the right, the second
			coordinate is the number of pixels we move down. Hence, coordinates
			(x, y) specify a point nearly as we are used to from mathematical
			conventions, with the twist that the vertical axis points downwards.
			This is a common convention in computer graphics.
			</p>
			<p>
			Let's look at an example. The following program draws a line, a
			rectangle, a circle, and a text:
			<tscript>
			canvas.line(50, 50, 150, 150);         # x1, y1, x2, y2
			canvas.fillRect(100, 30, 100, 50);     # left, top, width, height
			canvas.circle(50, 100, 25);            # x, y, radius
			canvas.text(50, 150, "Hello World");   # x, y, text
			</tscript>
			Copy the program into the editor and run it! If you cannot see the
			canvas output then most probably the canvas panel is hidden. Bring
			it to the front with the corresponding toolbar button and run the
			program again.
			</p><p>
			Notice that the rectangle is filled, while the circle is not.
			Make sure that you understand the effect of each number. Simply mess
			around with the numbers, run the program again, and observe the
			changes.
			</p>
			<h3>Styling</h3>
			<p>
			Until now, everything was drawn with default styles, which amounts
			to drawing in black with a line width of one. The following drawing
			styles can be customized:
			<ul>
			<li>The canvas maintains two colors, one for lines and one for filling
				in areas. Somewhat counter-intuitively, the fill color is also used
				for drawing text. The colors can be changed with
				<code>canvas.setLineColor(red, green, blue);</code>
				and <code>canvas.setFillColor(red, green, blue);</code>.</li>
			<li>All lines are drawn with a specified width (in pixels), which can
				be set with <code>canvas.setLineWidth(width);</code>.</li>
			<li>The function <code>canvas.setFont(font, size);</code>
				sets the font name and the font size for subsequent text output.
				Example: <code>canvas.setFont("Helvetica", 36);</code></li>
			<li>By default, text is left-aligned. This can be changed with
				<code>canvas.setTextAlign(alignment);</code>. Possible
				alignments are "left", "center", and "right".</li>
			</ul>
			Of course, in all functions above, the placeholders (like "red",
			"green", "blue", "width" and "alignment") must be replaced with actual
			values.
			</p>
			<h3>Shapes with Frames</h3>
			<p>
			The following program draws three styled rectangles:
			<tscript>
			canvas.setLineColor(1, 0, 0);         # red
			canvas.setFillColor(0.7, 0.7, 0.7);   # light gray
			canvas.setLineWidth(10);              # quite bold
			canvas.rect(50, 50, 70, 100);         # outline only
			canvas.fillRect(150, 50, 70, 100);    # area only
			canvas.frameRect(250, 50, 70, 100);   # area with outline
			</tscript>
			Several further canvas drawing commands are available in three
			variants, namely for drawing curves or outlines, filled shapes, and
			framed shapes.
			</p>
			<h3>Canvas Size</h3>
			<p>
			Since devices and screen resolutions differ, and more so window sizes,
			also the size of the canvas is subject to change. Therefore, at any
			time, the current width and height of the canvas can be determined
			with the functions <code>canvas.width()</code> and
			<code>canvas.height()</code>. They are similar to the
			<code>print</code> command, however, they do not take an
			argument but instead <i>return</i> (i.e., represent) a value. This
			value can be used to fill, say, the top 100 pixels of the canvas over
			the full width with a light green background:
			<tscript>
			canvas.setFillColor(0.7, 1, 0.7);
			canvas.fillRect(0, 0, canvas.width(), 100);
			</tscript>
			More flexible options become available in a future unit of this
			tutorial when we will have a detailed look at performing calculations.
			</p>
			<h3>Further Reading</h3>
			<p>
			The canvas offers a wide variety of functions. For some of these we need
			advanced concepts covered in later units of this tutorial. Anyway, this
			is a good opportunity for exploring the TScript documentation. Simply
			hit the button "Documentation" in the very right of the toolbar. Then
			search for "canvas", or for any other topic.
			</p>
			<h3>Experimentation!</h3>
			<p>
			The best way to explore the power of canvas graphics is to give it a
			try! You may experiment with the following tasks:
			<ul>
			<li>Create a "child drawing", with a meadow, a blue sky, a yellow sun,
				a house, and a tree. If you feel keen about it, try to add a
				rainbow. To that end, draw a 360&deg; rainbow from full circles
				and then paint over the parts you don't need.</li>
			<li>Draw a window or dialog with border, title bar, some text, and an
				okay button. It is understood that for now the button will not be
				functional.</li>
			</ul>
			</p>

			<h2>Wrap-Up</h2>
			<p>
			You have now learned about basic types of graphical output. Turtle
			graphics is extremely limited, but also very restricted in scope. In
			contrast, canvas graphics offers sufficiently powerful capabilities to
			create little animations and games. The best way to learn how to use
			TScript graphics is to just play around with everything and see what
			happens. You might want to try out various commands you can find in the
			documentation.
			</p>
			`,
		},
	],
};
