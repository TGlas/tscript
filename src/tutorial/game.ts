export const tutorial_game = {
	id: "game",
	title: "Create a Game",
	sections: [
		{
			content: `
			<p>
			We want to conclude the tutorial creating a proper game, step by step.
			We will first discuss how the next step has to be done and you can
			then try by yourself. If you're stuck, you can look up the reference
			solution and try to understand how it works. The game we have chosen
			is a simple Minesweeper clone. You can find everything game related
			<a href="https://en.wikipedia.org/wiki/Minesweeper">here</a>.
			</p>

			<h2>Tiles</h2>
			<p>
			The most important piece of the game are the clickable tiles. There are
			two different tiles - bomb and safe tiles. Two other pieces of
			information needed are whether the tile is hidden or not and whether the
			player has placed a flag on it or not.
			</p>

			<div class="tutorial-exercise">
			<p>
			Let's start slow. Create a class called Tile and create three public
			flags (boolean variables) called mine, open, and flag. Default them to
			<code>false</code>.
			</p>
			</div>
			`,
			correct: `
				class Tile {
				public:
					var mine = false;   # is there a mine in this tile?
					var open = false;   # was this tile uncovered by the player?
					var flag = false;   # did the player place a flag here?
				}
				`,
			tests: [
				{
					"type": "code",
					"code": `
						var t = Tile();
						print(t.mine);
					`,
				},
				{
					"type": "code",
					"code": `
						var t = Tile();
						print(t.open);
					`,
				},
				{
					"type": "code",
					"code": `
						var t = Tile();
						print(t.flag);
					`,
				},
				{
					"type": "code",
					"code": `
						var t = Tile();
						t.mine = true;
						print(t.mine);
					`,
				},
			],
		},
		{
			content: `
			<h2>Create the Field</h2>
			<p>
			When writing a program, an important step that needs to be done early on
			is to create variables defining the state of the application. In case of
			Minesweeper, we need to keep track of which tiles are mines, which ones
			were already uncovered, which ones where marked with a flag. That
			information will be stored in a two-dimensional array, representing the
			grid of tiles. For convenience, we will also store some redundant
			information: the dimensions of the grid, the number of mines in the
			field, and the remaining number of tiles to uncover for winning the
			game. The grid dimensions and the number of mines determine the
			difficulty of the game.
			</p>

			<div class="tutorial-exercise">
			<p>
			First add the variables <code>sizeX</code>, <code>sizeY</code>, and
			<code>mines</code> at the beginning of your program. Set them to 16, 16,
			and 40, respectively.
			</p>
			<p>
			Now create a new variable <code>field</code> as an empty array below
			your <code>Tile</code> class. This variable will be a two-dimensional
			array of size <code>sizeX</code> times <code>sizeY</code>. To initialize
			it, run a for-loop from 0 to sizeY. In every iteration, create a
			variable <code>row</code> as an empty array. Run through a for loop from
			0 to sizeX and push a newly created Tile into <code>row</code>.
			Afterwards push the <code>row</code> into the field array.
			</p>
			<p>
			Finally, create a variable <code>todo</code> which stores how many tiles
			are left to uncover by the player. Set it to the number of tiles minus
			the number of mines.
			</p>
			</div>
			`,
			correct: `
				var sizeX = 16, sizeY = 16, mines = 40;

				class Tile {
				public:
					var mine = false;   # is there a mine in this tile?
					var open = false;   # was this tile uncovered by the player?
					var flag = false;   # did the player place a flag here?
				}

				var field = [];			 # 2D array; size: sizeX times sizeY
				for var y in 0:sizeY do
				{	
					var row = [];
					for var x in 0:sizeX do row.push(Tile());
					field.push(row);
				}
				var todo = sizeX * sizeY - mines;   # number of non-mine tiles to uncover
				`,
			tests: [
				{
					"type": "code",
					"code": `
						print(sizeX);
					`,
				},
				{
					"type": "code",
					"code": `
						print(sizeY);
					`,
				},
				{
					"type": "code",
					"code": `
						print(mines);
					`,
				},
				{
					"type": "code",
					"code": `
						print(todo);
					`,
				},
				{
					"type": "code",
					"code": `
						print(field);
					`,
				},
			],
		},
		{
			content: `
			<h2>Draw the Field</h2>
			<p>
			Now that we have a state, we can proceed by defining operations on that
			state. A good candidate for a first operation is drawing the field. Once
			we are able to do that, the data structures and also the remaining
			operations will become much easier to grasp, and also easier to debug.
			</p>

			<p>
			Let us now look at the drawing of the game for the first time. The idea
			is to draw the pitch once in the beginning and only update tiles that
			have been clicked by the player. We iterate through our 2-dimensional
			field array and call a drawTile()-function we still have to define.
			</p>
			<div class="tutorial-exercise">
			<p>
			Define a parameter unit. Add a function draw() at the bottom of your code. 
			First calculate the tile size taking the minimum (via 
			<a href="https://info1.ini.rub.de/TScriptIDE.html?doc=/library/math">math.min()</a>) 
			of canvas.width() divided by sizeX and rounded down and canvas.height()
			divided by sizeY and rounded down and assign the result to the unit 
			parameter. Set the fill color to be gray and clear the canvas. Then 
			iterate through every Tile of the field array (remember it being 
			2-dimensional) and call a function called drawTile, handing over
			the loop counter of the outer for-loop first and of the inner
			for-loop second. Finally, create an empty placeholder function drawTile(x, y)
			at the top of your code to avoid errors.
			</p>
			</div>
			`,
			correct: `
				# placeholder
				function drawTile(x, y) {

				}

				var sizeX = 16, sizeY = 16, mines = 40;

				class Tile {
					public:
						var mine = false;   # is there a mine in this tile?
						var open = false;   # was this tile uncovered by the player?
						var flag = false;   # did the player place a flag here?
				}

				var field = [];			 # 2D array; size: sizeX times sizeY
				for var y in 0:sizeY do
				{	
					var row = [];
					for var x in 0:sizeX do row.push(Tile());
					field.push(row);
				}
				var todo = sizeX * sizeY - mines;   # number of non-mine tiles to uncover

				var unit;   # size of a tile on the canvas
				# draw the whole field
				function draw()
				{
					unit = math.min(canvas.width() // sizeX, canvas.height() // sizeY);
					canvas.setFillColor(0.6, 0.6, 0.6);
					canvas.clear();
					for var y in 0:sizeY do
						for var x in 0:sizeX do
							drawTile(x, y);
				}
				`,
		},
		{
			content: `
			<p>
			We now want to implement a function that counts the number of mines surrounding
			a specific tile. We therefore write a function <i>neighbor()</i> which takes 
			the position x and y of a tile and searches for mines surrounding it. To do so,
			we use two nested for-loops running from -1 to 1 and count up a count variable
			if the mine flag is set to true.
			</p>
			<div class="tutorial-exercise">
			<p>
			Add a function neighbor() to your code that takes x and y as parameters. Initialize
			a count variable num and set it to 0. Now set up a for loop with a loop counter to
			iterate through the tiles vertically and set up a for loop with a loop counter to
			iterate through the tiles horizontally. Use the continue keyword to step over positions
			that do not belong to the field (x < 0 or x > sizeX or y < 0 or y > sizeY). Inside the
			second loop count up num if the tile's flag mine is set to true. Finally return num.
			</p>
			</div>
			`,
			correct: `
				# placeholder
				function drawTile(x, y) {

				}   
				var sizeX = 16, sizeY = 16, mines = 40;

				class Tile {
					public:
						var mine = false;   # is there a mine in this tile?
						var open = false;   # was this tile uncovered by the player?
						var flag = false;   # did the player place a flag here?
				}

				var field = [];			 # 2D array; size: sizeX times sizeY
				for var y in 0:sizeY do
				{	
					var row = [];
					for var x in 0:sizeX do row.push(Tile());
					field.push(row);
				}
				var todo = sizeX * sizeY - mines;   # number of non-mine tiles to uncover

				var unit;   # size of a tile on the canvas
				# draw the whole field
				function draw()
				{
					unit = math.min(canvas.width() // sizeX, canvas.height() // sizeY);
					canvas.setFillColor(0.6, 0.6, 0.6);
					canvas.clear();
					for var y in 0:sizeY do
						for var x in 0:sizeX do
							drawTile(x, y);
				}

				# number of mines in the 3x3 neighborhood of a tile
				function neighbors(x, y)
				{
					var num = 0;
					for var v in -1:2 do
					{
						if y+v < 0 or y+v >= sizeY then continue;
						for var u in -1:2 do
						{
							if x+u < 0 or x+u >= sizeX then continue;
							if field[y+v][x+u].mine then num += 1;
						}
					}
					return num;
				}
				`,
		},
		{
			content: `
			<p>
			We have now already implemented some functionality to set up the field and find 
			mines - but we haven't even placed any yet! Let's make up for that now. We have set 
			a parameter mines as the number of mines in the whole field. We can simply run 
			through a for loop for every mine that has to be planted and use the math.random()
			function to randomly select tiles where we want to place mines.
			</p>
			<div class="tutorial-exercise">
			<p>
			Run a for loop from 0 to the number of mines. Inside of the for loop create a 
			while loop without a stopping criterion. Create variables x and y and assign
			a random number between 0 and sizeX, respectively sizeY. Remember that math.random()
			only generates numbers between 0 and 1 and that you'll have to manually cast the
			numbers to be Integers. If the tile you have randomly chose is already occupied
			then continue. Else set it to be a mine and break the while loop.
			</p>
			</div>
			`,
			correct: `
				# placeholder
				function drawTile(x, y) {

				}
				var sizeX = 16, sizeY = 16, mines = 40;

				class Tile {
					public:
						var mine = false;   # is there a mine in this tile?
						var open = false;   # was this tile uncovered by the player?
						var flag = false;   # did the player place a flag here?
				}

				var field = [];			 # 2D array; size: sizeX times sizeY
				for var y in 0:sizeY do
				{	
					var row = [];
					for var x in 0:sizeX do row.push(Tile());
					field.push(row);
				}
				var todo = sizeX * sizeY - mines;   # number of non-mine tiles to uncover

				var unit;   # size of a tile on the canvas
				# draw the whole field
				function draw()
				{
					unit = math.min(canvas.width() // sizeX, canvas.height() // sizeY);
					canvas.setFillColor(0.6, 0.6, 0.6);
					canvas.clear();
					for var y in 0:sizeY do
						for var x in 0:sizeX do
							drawTile(x, y);
				}

				# number of mines in the 3x3 neighborhood of a tile
				function neighbors(x, y)
				{
					var num = 0;
					for var v in -1:2 do
					{
						if y+v < 0 or y+v >= sizeY then continue;
						for var u in -1:2 do
						{
							if x+u < 0 or x+u >= sizeX then continue;
							if field[y+v][x+u].mine then num += 1;
						}
					}
					return num;
				}

				# place mines
				for var m in 0:mines do
				{
					while true do
					{
						var x = Integer(sizeX * math.random());
						var y = Integer(sizeY * math.random());
						if field[y][x].mine then continue;
						field[y][x].mine = true;
						break;
					}
				}
				`,
		},
		{
			content: `
			<p>
			Now that we have set up the mines, we can finalize our draw() function
			by implementing the drawTile(x,y) function we left empty as a placeholder.
			The function is a bit bigger but we will go through it together in small steps.
			We will first check if the tile is open or not. If it is covered we choose a 
			specific color to draw a rectangle. If it is open though, we choose another
			color. We now have to decide between different cases with what we have to 
			draw onto the tile. If it is closed and unflagged we are done. If it is flagged,
			we have to draw a little flag onto it. If it is open, we have to call the
			neighbor()-function to determine which number has to be written onto it. 
			</p>
			<div class="tutorial-exercise">
			<p>
			Remove the placeholder drawTile(x,y) function from the beginning of your code.
			Also move the draw() function down to the bottom of your code. Now create the
			function drawTile(x,y) between the neighbor() function and the mine placing loop.
			First set the line width to 0.1 * unit. Get the tile from the field and save it in 
			a variable f. Now set the fill color to be (0.7, 0.7, 0.7) if the tile is open
			and to (0.5, 0.5, 0.5) else. Set the line color to be (0.6, 0.6, 0.6) and use 
			frameRect() to draw the tile with unit being the length of its sides. You'll get
			the position of the rectangle with the handed over parameters x and y and every
			tile needing a length of unit. 
			</p>
			<p>
			Now we'll have to make some case decisions:<br>
			<br>
			If the tile is opened, then we have to decide if it is a mine or not. If it is a 
			mine, then we set the fill color to be black and draw a filled circle at
			position ((x + 0.5)*unit, (y + 0.5)*unit) with radius 0.3*unit. If it is no mine, 
			we call the neighbors(x,y) function and save its return value to a variable num. 
			Copy the following as the next line to save some different colors:<br>
			<tscript>
			var rgb = [null, [0,0,1], [0,0.5,0], [1,0,0], [0,0,0.5], [0.5,0,0], [0,0.5,0.5], [0,0,0], [0.4,0.4,0.4]];
			</tscript>
			<br>
			Set the fill color to be the to num corresponding value from the rgb array. Set
			the text alignment to be centered, the font to helvetica with a size of 0.6*unit
			and use canvas.text(x, y, s) to print the value of num at position ((x+0.5)*unit, 
			(y+0.25)*unit).<br>
			<br>
			Use else to handle the case that the tile is covered. If the flag boolean is set 
			to be true, draw the flag. You can use the following code:
			<tscript>
			# draw flag
						canvas.setFillColor(1, 0, 0);
						canvas.fillArea([[(x+0.7)*unit, (y+0.2)*unit], [(x+0.2)*unit, (y+0.3)*unit], [(x+0.7)*unit, (y+0.4)*unit]]);
						canvas.fillRect((x+0.7)*unit, (y+0.2)*unit, 0.05*unit, 0.6*unit);
			</tscript> 
			</p>
			</div>
			`,
			correct: `
				var sizeX = 16, sizeY = 16, mines = 40;

				class Tile {
					public:
						var mine = false;   # is there a mine in this tile?
						var open = false;   # was this tile uncovered by the player?
						var flag = false;   # did the player place a flag here?
				}

				var field = [];			 # 2D array; size: sizeX times sizeY
				for var y in 0:sizeY do
				{	
					var row = [];
					for var x in 0:sizeX do row.push(Tile());
					field.push(row);
				}
				var todo = sizeX * sizeY - mines;   # number of non-mine tiles to uncover

				var unit;   # size of a tile on the canvas

				# number of mines in the 3x3 neighborhood of a tile
				function neighbors(x, y)
				{
					var num = 0;
					for var v in -1:2 do
					{
						if y+v < 0 or y+v >= sizeY then continue;
						for var u in -1:2 do
						{
							if x+u < 0 or x+u >= sizeX then continue;
							if field[y+v][x+u].mine then num += 1;
						}
					}
					return num;
				}

				# draw a single tile
				function drawTile(x, y)
				{
					canvas.setLineWidth(0.1 * unit);
					var f = field[y][x];
					if f.open then canvas.setFillColor(0.7, 0.7, 0.7); else canvas.setFillColor(0.5, 0.5, 0.5);
					canvas.setLineColor(0.6, 0.6, 0.6);
					canvas.frameRect(x*unit, y*unit, unit, unit);
					if f.open then
					{
						if f.mine then
						{
							# draw mine
							canvas.setFillColor(0, 0, 0);
							canvas.fillCircle((x+0.5)*unit, (y+0.5)*unit, 0.3*unit);
						}
						else
						{
							var num = neighbors(x, y);
							if num > 0 then
							{
								# draw number
								var rgb = [null, [0,0,1], [0,0.5,0], [1,0,0], [0,0,0.5], [0.5,0,0], [0,0.5,0.5], [0,0,0], [0.4,0.4,0.4]];
								canvas.setFillColor(rgb[num][0], rgb[num][1], rgb[num][2]);
								canvas.setTextAlign("center");
								canvas.setFont("Helvetica", 0.6*unit);
								canvas.text((x+0.5)*unit, (y+0.25)*unit, num);
							}
						}
					}
					else if f.flag then
					{
						# draw flag
						canvas.setFillColor(1, 0, 0);
						canvas.fillArea([[(x+0.7)*unit, (y+0.2)*unit], [(x+0.2)*unit, (y+0.3)*unit], [(x+0.7)*unit, (y+0.4)*unit]]);
						canvas.fillRect((x+0.7)*unit, (y+0.2)*unit, 0.05*unit, 0.6*unit);
					}
				}

				# place mines
				for var m in 0:mines do
				{
					while true do
					{
						var x = Integer(sizeX * math.random());
						var y = Integer(sizeY * math.random());
						if field[y][x].mine then continue;
						field[y][x].mine = true;
						break;
					}
				}
				# draw the whole field
				function draw()
				{
					unit = math.min(canvas.width() // sizeX, canvas.height() // sizeY);
					canvas.setFillColor(0.6, 0.6, 0.6);
					canvas.clear();
					for var y in 0:sizeY do
						for var x in 0:sizeX do
							drawTile(x, y);
				}
				`,
		},
		{
			content: `
			<p>
			Usually in games, we'd redraw the canvas every frame. With our minesweeper
			game it is sufficient to just redraw the tiles that get uncovered. Therefore,
			we will now create a function uncover(x, y). The function shall be called, 
			whenever the user clicks on any closed tile. We then set the flag open to be
			true and call drawTile(x, y) for the corresponding tile. If the tile is no
			mine, then we count down the todo parameter. We finally have to check if
			the uncovered tile has any mines as neighbors. If not, we call the uncover 
			function for every surrounding tile again.
			</p>
			<div class="tutorial-exercise">
			<p>
			Create a function uncover(x, y) at the end of your code. Set the open flag as 
			true for the corresponding tile and call the drawTile(x,y) function. If the 
			uncovered tile has been a mine, quit the event mode and hand over false as the 
			parameter. Else, count down todo and check, if todo equals 0. If the latter 
			one applies, you can quit the event mode with true as the handed over parameter. 
			Now we have to check the neighbors of the uncovered tile. Call its neighbor() 
			function and if it equals 0, run through every neighboring tile as you do in 
			the neighbor() function itself. If any tile isn't open, call the uncover(x, y) 
			function to open it.
			</p>
			</div>
			`,
			correct: `
				var sizeX = 16, sizeY = 16, mines = 40;

				class Tile {
					public:
						var mine = false;   # is there a mine in this tile?
						var open = false;   # was this tile uncovered by the player?
						var flag = false;   # did the player place a flag here?
				}

				var field = [];			 # 2D array; size: sizeX times sizeY
				for var y in 0:sizeY do
				{	
					var row = [];
					for var x in 0:sizeX do row.push(Tile());
					field.push(row);
				}
				var todo = sizeX * sizeY - mines;   # number of non-mine tiles to uncover

				var unit;   # size of a tile on the canvas

				# number of mines in the 3x3 neighborhood of a tile
				function neighbors(x, y)
				{
					var num = 0;
					for var v in -1:2 do
					{
						if y+v < 0 or y+v >= sizeY then continue;
						for var u in -1:2 do
						{
							if x+u < 0 or x+u >= sizeX then continue;
							if field[y+v][x+u].mine then num += 1;
						}
					}
					return num;
				}

				# draw a single tile
				function drawTile(x, y)
				{
					canvas.setLineWidth(0.1 * unit);
					var f = field[y][x];
					if f.open then canvas.setFillColor(0.7, 0.7, 0.7); else canvas.setFillColor(0.5, 0.5, 0.5);
					canvas.setLineColor(0.6, 0.6, 0.6);
					canvas.frameRect(x*unit, y*unit, unit, unit);
					if f.open then
					{
						if f.mine then
						{
							# draw mine
							canvas.setFillColor(0, 0, 0);
							canvas.fillCircle((x+0.5)*unit, (y+0.5)*unit, 0.3*unit);
						}
						else
						{
							var num = neighbors(x, y);
							if num > 0 then
							{
								# draw number
								var rgb = [null, [0,0,1], [0,0.5,0], [1,0,0], [0,0,0.5], [0.5,0,0], [0,0.5,0.5], [0,0,0], [0.4,0.4,0.4]];
								canvas.setFillColor(rgb[num][0], rgb[num][1], rgb[num][2]);
								canvas.setTextAlign("center");
								canvas.setFont("Helvetica", 0.6*unit);
								canvas.text((x+0.5)*unit, (y+0.25)*unit, num);
							}
						}
					}
					else if f.flag then
					{
						# draw flag
						canvas.setFillColor(1, 0, 0);
						canvas.fillArea([[(x+0.7)*unit, (y+0.2)*unit], [(x+0.2)*unit, (y+0.3)*unit], [(x+0.7)*unit, (y+0.4)*unit]]);
						canvas.fillRect((x+0.7)*unit, (y+0.2)*unit, 0.05*unit, 0.6*unit);
					}
				}

				# place mines
				for var m in 0:mines do
				{
					while true do
					{
						var x = Integer(sizeX * math.random());
						var y = Integer(sizeY * math.random());
						if field[y][x].mine then continue;
						field[y][x].mine = true;
						break;
					}
				}
				# draw the whole field
				function draw()
				{
					unit = math.min(canvas.width() // sizeX, canvas.height() // sizeY);
					canvas.setFillColor(0.6, 0.6, 0.6);
					canvas.clear();
					for var y in 0:sizeY do
						for var x in 0:sizeX do
							drawTile(x, y);
				}
				# uncover a field
				function uncover(x, y)
				{
					assert(not field[y][x].open);
					field[y][x].open = true;
					drawTile(x, y);
					if field[y][x].mine then quitEventMode(false);
					else
					{
						todo -= 1;
						if todo == 0 then quitEventMode(true);
						if neighbors(x, y) == 0 then
						{
							for var v in -1:2 do
							{
								if y+v < 0 or y+v >= sizeY then continue;
								for var u in -1:2 do
								{
									if x+u < 0 or x+u >= sizeX then continue;
									if not field[y+v][x+u].open then uncover(x+u, y+v);
								}
							}
						}
					}
				}
				`,
		},
		{
			content: `
			<p>
			We are now almost done with preparations for our game to work. In this
			short section we will set up the start of the game. Therefore, we will
			draw the complete field with the draw() function and afterwards randomly
			search through the whole field until we find an empty tile with no mines
			surrounding it to uncover it for the start of the game.
			</p>
			<div class="tutorial-exercise">
			<p>
			At the end of your code call the draw function. Create a while loop with
			its condition being always true and do the following: Find a random tile
			with the parameters x and y being randomized. If the number of neighbors
			isn't 0, continue. Else uncover the tile and break the loop.
			</p>
			</div>
			`,
			correct: `
				var sizeX = 16, sizeY = 16, mines = 40;

				class Tile {
					public:
						var mine = false;   # is there a mine in this tile?
						var open = false;   # was this tile uncovered by the player?
						var flag = false;   # did the player place a flag here?
				}

				var field = [];			 # 2D array; size: sizeX times sizeY
				for var y in 0:sizeY do
				{	
					var row = [];
					for var x in 0:sizeX do row.push(Tile());
					field.push(row);
				}
				var todo = sizeX * sizeY - mines;   # number of non-mine tiles to uncover

				var unit;   # size of a tile on the canvas

				# number of mines in the 3x3 neighborhood of a tile
				function neighbors(x, y)
				{
					var num = 0;
					for var v in -1:2 do
					{
						if y+v < 0 or y+v >= sizeY then continue;
						for var u in -1:2 do
						{
							if x+u < 0 or x+u >= sizeX then continue;
							if field[y+v][x+u].mine then num += 1;
						}
					}
					return num;
				}

				# draw a single tile
				function drawTile(x, y)
				{
					canvas.setLineWidth(0.1 * unit);
					var f = field[y][x];
					if f.open then canvas.setFillColor(0.7, 0.7, 0.7); else canvas.setFillColor(0.5, 0.5, 0.5);
					canvas.setLineColor(0.6, 0.6, 0.6);
					canvas.frameRect(x*unit, y*unit, unit, unit);
					if f.open then
					{
						if f.mine then
						{
							# draw mine
							canvas.setFillColor(0, 0, 0);
							canvas.fillCircle((x+0.5)*unit, (y+0.5)*unit, 0.3*unit);
						}
						else
						{
							var num = neighbors(x, y);
							if num > 0 then
							{
								# draw number
								var rgb = [null, [0,0,1], [0,0.5,0], [1,0,0], [0,0,0.5], [0.5,0,0], [0,0.5,0.5], [0,0,0], [0.4,0.4,0.4]];
								canvas.setFillColor(rgb[num][0], rgb[num][1], rgb[num][2]);
								canvas.setTextAlign("center");
								canvas.setFont("Helvetica", 0.6*unit);
								canvas.text((x+0.5)*unit, (y+0.25)*unit, num);
							}
						}
					}
					else if f.flag then
					{
						# draw flag
						canvas.setFillColor(1, 0, 0);
						canvas.fillArea([[(x+0.7)*unit, (y+0.2)*unit], [(x+0.2)*unit, (y+0.3)*unit], [(x+0.7)*unit, (y+0.4)*unit]]);
						canvas.fillRect((x+0.7)*unit, (y+0.2)*unit, 0.05*unit, 0.6*unit);
					}
				}

				# place mines
				for var m in 0:mines do
				{
					while true do
					{
						var x = Integer(sizeX * math.random());
						var y = Integer(sizeY * math.random());
						if field[y][x].mine then continue;
						field[y][x].mine = true;
						break;
					}
				}
				# draw the whole field
				function draw()
				{
					unit = math.min(canvas.width() // sizeX, canvas.height() // sizeY);
					canvas.setFillColor(0.6, 0.6, 0.6);
					canvas.clear();
					for var y in 0:sizeY do
						for var x in 0:sizeX do
							drawTile(x, y);
				}
				# uncover a field
				function uncover(x, y)
				{
					assert(not field[y][x].open);
					field[y][x].open = true;
					drawTile(x, y);
					if field[y][x].mine then quitEventMode(false);
					else
					{
						todo -= 1;
						if todo == 0 then quitEventMode(true);
						if neighbors(x, y) == 0 then
						{
							for var v in -1:2 do
							{
								if y+v < 0 or y+v >= sizeY then continue;
								for var u in -1:2 do
								{
									if x+u < 0 or x+u >= sizeX then continue;
									if not field[y+v][x+u].open then uncover(x+u, y+v);
								}
							}
						}
					}
				}
				# uncover an empty tile
				draw();
				while true do
				{
					var x = Integer(sizeX * math.random());
					var y = Integer(sizeY * math.random());
					if neighbors(x, y) > 0 then continue;
					uncover(x, y);
					break;
				}
				`,
		},
		{
			content: `
			<p>
			In this final section we need to create a function that shall be called
			if the user clicks somewhere on the canvas. If the click was a left click
			and the tile is covered, we simply uncover it. If it was a right click,
			we put a flag upon the tile. Finally, we start the game setting up the
			event handlers. Now you are able to play your own fully functional
			mine sweeper game! :)
			</p>
			<div class="tutorial-exercise">
			<p>
			Create a function click(event) at the end of your code. Using the unit size,
			compute the tile the user clicked on and save it in a x and y variable. If 
			the values are outside of our bounds, return. If event.button equals "left"
			and the tile is covered and no flag is set, then call the uncover(x, y)
			function. Else if the right button has been clicked and the field is uncovered,
			set the flag flag to its opposite and redraw the tile by calling drawTile(x, y).
			Outside of this function, set an event handler for the resize event and call
			the draw() function inside of the anonymous function you'll have to hand over.
			Set up an event handler for the click event and hand over the click function.
			Create a variable win and assign the return value of the enterEventMode() function.
			Finally, check if win is true or false. If it is true, the player has won the game.
			Create alerts to let him know!
			</p>
			</div>
			`,
			correct: `
				var sizeX = 16, sizeY = 16, mines = 40;

				class Tile {
					public:
						var mine = false;   # is there a mine in this tile?
						var open = false;   # was this tile uncovered by the player?
						var flag = false;   # did the player place a flag here?
				}

				var field = [];			 # 2D array; size: sizeX times sizeY
				for var y in 0:sizeY do
				{	
					var row = [];
					for var x in 0:sizeX do row.push(Tile());
					field.push(row);
				}
				var todo = sizeX * sizeY - mines;   # number of non-mine tiles to uncover

				var unit;   # size of a tile on the canvas

				# number of mines in the 3x3 neighborhood of a tile
				function neighbors(x, y)
				{
					var num = 0;
					for var v in -1:2 do
					{
						if y+v < 0 or y+v >= sizeY then continue;
						for var u in -1:2 do
						{
							if x+u < 0 or x+u >= sizeX then continue;
							if field[y+v][x+u].mine then num += 1;
						}
					}
					return num;
				}

				# draw a single tile
				function drawTile(x, y)
				{
					canvas.setLineWidth(0.1 * unit);
					var f = field[y][x];
					if f.open then canvas.setFillColor(0.7, 0.7, 0.7); else canvas.setFillColor(0.5, 0.5, 0.5);
					canvas.setLineColor(0.6, 0.6, 0.6);
					canvas.frameRect(x*unit, y*unit, unit, unit);
					if f.open then
					{
						if f.mine then
						{
							# draw mine
							canvas.setFillColor(0, 0, 0);
							canvas.fillCircle((x+0.5)*unit, (y+0.5)*unit, 0.3*unit);
						}
						else
						{
							var num = neighbors(x, y);
							if num > 0 then
							{
								# draw number
								var rgb = [null, [0,0,1], [0,0.5,0], [1,0,0], [0,0,0.5], [0.5,0,0], [0,0.5,0.5], [0,0,0], [0.4,0.4,0.4]];
								canvas.setFillColor(rgb[num][0], rgb[num][1], rgb[num][2]);
								canvas.setTextAlign("center");
								canvas.setFont("Helvetica", 0.6*unit);
								canvas.text((x+0.5)*unit, (y+0.25)*unit, num);
							}
						}
					}
					else if f.flag then
					{
						# draw flag
						canvas.setFillColor(1, 0, 0);
						canvas.fillArea([[(x+0.7)*unit, (y+0.2)*unit], [(x+0.2)*unit, (y+0.3)*unit], [(x+0.7)*unit, (y+0.4)*unit]]);
						canvas.fillRect((x+0.7)*unit, (y+0.2)*unit, 0.05*unit, 0.6*unit);
					}
				}

				# place mines
				for var m in 0:mines do
				{
					while true do
					{
						var x = Integer(sizeX * math.random());
						var y = Integer(sizeY * math.random());
						if field[y][x].mine then continue;
						field[y][x].mine = true;
						break;
					}
				}
				# draw the whole field
				function draw()
				{
					unit = math.min(canvas.width() // sizeX, canvas.height() // sizeY);
					canvas.setFillColor(0.6, 0.6, 0.6);
					canvas.clear();
					for var y in 0:sizeY do
						for var x in 0:sizeX do
							drawTile(x, y);
				}
				# uncover a field
				function uncover(x, y)
				{
					assert(not field[y][x].open);
					field[y][x].open = true;
					drawTile(x, y);
					if field[y][x].mine then quitEventMode(false);
					else
					{
						todo -= 1;
						if todo == 0 then quitEventMode(true);
						if neighbors(x, y) == 0 then
						{
							for var v in -1:2 do
							{
								if y+v < 0 or y+v >= sizeY then continue;
								for var u in -1:2 do
								{
									if x+u < 0 or x+u >= sizeX then continue;
									if not field[y+v][x+u].open then uncover(x+u, y+v);
								}
							}
						}
					}
				}
				# uncover an empty tile
				draw();
				while true do
				{
					var x = Integer(sizeX * math.random());
					var y = Integer(sizeY * math.random());
					if neighbors(x, y) > 0 then continue;
					uncover(x, y);
					break;
				}
				# mouse click handler, left and right button
				function click(event)
				{
					var x = event.x // unit;
					var y = event.y // unit;
					if x >= sizeX or y >= sizeY then return;
					if event.button == "left" and not field[y][x].open and not field[y][x].flag then uncover(x, y);
					else if event.button == "right" and not field[y][x].open then
					{
						field[y][x].flag = not field[y][x].flag;
						drawTile(x, y);
					}
				}

				# start the game
				setEventHandler("canvas.resize", function(event) { draw(); });
				setEventHandler("canvas.mousedown", click);
				var win = enterEventMode();
				if win then alert("Congratulations! You cleared the field."); else alert("Baaaam! Better luck next time!");
				`,
		},
	],
};
