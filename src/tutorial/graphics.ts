export const tutorial_graphics = {
	id: "graphics",
	title: "Simple Graphics",
	sections: [
		{
			content: `
			<p>
			TScript offers the possibility to do simple graphical output. There 
            are two different ways to do so - Turtle and Canvas Graphics. You can
            find the Turtle and Canvas Graphics in the tool bar of the IDE right 
            next to the stack and program buttons.
            </p>
			`,
		},
		{
			content: `
            <h2>Turtle Graphics</h2>
			<p>
			A simple way to create graphical output is with the so called Turtle
            Graphics. You can imagine a little turtle, which you can steer 
            programmatically, running over the output console drawing with an
            attached pencil. There exist only 5 commands:<br><br>
            <code>
            turtle.reset(x, y, degrees, down);<br>
            turtle.move(distance);<br>
            turtle.turn(angle);<br>
            turtle.color(red, green, blue);<br>
            turtle.pen(down);<br>
            </code><br>
            The first command resets the turtle to position (x,y) on the output
            console with angle <i>degrees</i> and with the pen set onto the canvas, if 
            <i>down</i> is true. If you call turtle.move(distance), the turtle walks 
            for a number of <i>distance</i> pixels. The color command sets the color
            (rgb) of the drawing. If you choose a value below 0 or above 1, it will be
            capped at those bounds. With turtle.turn(angle) you can turn the turtle 
            clockwise. The pen-command either puts the pen down to drawing or up to
            not draw while the turtle is moving.
            </p>
            <p>
            <div class="tutorial-exercise">
            Try the turtle graphics out for yourself. Set the color to a grey value
            with red = blue = green = 0.5 and draw a square using the move- and
            turn-commands. Use a distance of 200 and an angle of 90&deg;. Start 
            drawing the square with the move-command.
            </div>
            </p>
			`,
			correct: `
                turtle.color(0.5,0.5,0.5);
				turtle.move(200);
                turtle.turn(90);
                turtle.move(200);
                turtle.turn(90);
                turtle.move(200);
                turtle.turn(90);
                turtle.move(200);
				`,
			tests: [
				{
					type: "code",
					code: "",
					"ignore-order": "true",
				},
			],
		},
		{
			content: `
            <h2>Canvas Graphics</h2>
            <p>
            The other way to create graphics is with canvas graphics. We are able to create
            a bit more complicated graphics and figures with them. Instead of moving a turtle
            we now have commands to create 2-dimensional figures and texts at different positions
            and sizes. Again, we are able to change the color of the drawings. To clear the
            canvas, you can call the <i>clear()</i>-function. To get the current size of the 
            canvas, you can call the functions <i>width()</i> and <i>height</i>. It is possible
            to create a rectangle, a circle or an area, either only framed, completely filled or 
            framed <i>and</i> filled.<br>
            Here is a small example of a program, that clears the canvas, sets the width and 
            color of the lines to draw and finally draws different figures:
            <tscript>
                canvas.clear();
                canvas.setLineWidth(5);
                canvas.setLineColor(1,0,0);
                canvas.setFillColor(0,1,0);
                canvas.line(0, 0, 100, 100);
                canvas.rect(100,100,50,50);
                canvas.fillCircle(150,150,20);
                canvas.frameRect(250,250,50,50);
            </tscript>
            Copy this example and see what happens for yourself. To find all possible commands 
            for the canvas, refer to <a href="https://info1.ini.rub.de/TScriptIDE.html?doc#/library/canvas">this</a>.
            </p>
        `,
		},
		{
			content: `
                <h2>Wrap-Up</h2>
                <p>
                You have now learned basic types of graphical output. Even if the uses of Turtle and
                Canvas Graphics are limited, it would easily be possible to create little animations
                or games with them. The best way to learn how to use TScript graphics is to just play
                around with everything and see what happens. You might want to try out every possible
                command you can find in the documentation. 
                </p>
            `,
		},
	],
};
