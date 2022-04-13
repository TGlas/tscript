export const tutorial_game = {
	id: "game",
	title: "Create a Game",
	sections: [
		{
			content: `
				<p>
				We conclude the tutorial creating a proper game, step by step.
				We will split the overall task into a sequence of sub-tasks of
				manageable complexity. For each step, we will discuss how it should be
				solved, and then you can try by yourself. If you're stuck, you can
				always look up the reference solution and see how it works. The game we
				have chosen is a simple Minesweeper clone. You can find everything game
				related
				<a target="blank" href="https://en.wikipedia.org/wiki/Minesweeper_(video_game)">here</a>.
				</p>

				<h2>Task Decomposition</h2>
				<p>
				Writing a whole game is a big, big task. Splitting the task into
				manageable chunks is key to success. A good general guideline is to
				start with sub-tasks that do not depend on anything else. For example,
				starting with the mouse click handler is not a good idea, since it will
				depend on other more elementary tasks like checking for mines and
				drawing tiles. We will be stuck with the handler until the elementary
				tasks are completed. Instead, we should aim for the most elementary
				task.
				</p>
				<p>
				When writing a program, an important step that needs to be done early on
				is to create variables defining the state of the application. The logic
				is similar to how we argued in object oriented programming: the game has
				a state (attributes of a class), and we define operations thereon
				(public methods of a class). This does not mean that we need to design
				the game within a class, but we apparently could. In any case, splitting
				the problem into state (data) and operations on that state is a useful
				concept.
				</p>
				<p>
				In case of Minesweeper, we need to keep track of which tiles are mines,
				which ones were already uncovered, and which ones where marked with a
				flag. That information needs to be accessible to the machine and to the
				user. For the user, we will visualize the field on the canvas. For the
				machine, we need a representation in terms of variables.
				</p>
				<p>
				The machine representation of the field will be a two-dimensional array,
				with each item representing one tile. Each tile has a number of
				properties: Is it a mine? Is it uncovered? Is it marked with a flag? In
				other words, tiles are represented by heterogeneous data with a fixed
				data layout. This calls for objects.
				</p>

				<h2>Tiles</h2>
				<p>
				A good first task is to create a data structure <code>class Tile</code>
				for a single tile. We need it nearly everywhere down the road, even for
				defining the state of the game. Also, the task does not have any
				dependencies. So let's start with this one.
				</p>

				<div class="tutorial-exercise">
				<p>
				Create a class called Tile with three public attributes called
				<code>mine</code>, <code>uncovered</code>, and <code>flag</code>.
				Default them to <code>false</code>.
				</p>
				</div>
			`,
			correct: `
				class Tile {
				public:
					var mine = false;        # is there a mine in this tile?
					var uncovered = false;   # was this tile uncovered by the player?
					var flag = false;        # did the player place a flag here?
				}
				`,
			tests: [
				{
					type: "code",
					code: `
						var t = Tile();
						print(t.mine);
					`,
				},
				{
					type: "code",
					code: `
						var t = Tile();
						print(t.uncovered);
					`,
				},
				{
					type: "code",
					code: `
						var t = Tile();
						print(t.flag);
					`,
				},
				{
					type: "code",
					code: `
						var t = Tile();
						t.mine = true;
						print(t.mine);
					`,
				},
			],
		},
		{
			content: `
				<p>
				Before we move on, save the program. Don't forget to save again after
				each step. Otherwise, if something goes wrong (accidentally closing
				the browser, zombie invasion, whatever) you need to start over. Of
				course, you can always continue from the last reference solution, but it
				is much nicer to complete the game yourself.
				</p>

				<h2>Create the Field</h2>
				<p>
				The next task is to create the two-dimensional array defining the field.
				Besides the array, we will afford a few redundant variables for quick
				access to important properties. The dimensions of the grid of tiles and
				the number of mines placed therein define the difficulty of the game.
				Furthermore, we will keep track of the number of remaining non-mine
				fields to uncover. As soon as this number drops to zero, we know that
				the game is won.
				</p>
				<p>
				For simplicity, we abstain from encapsulating the whole game in a class.
				Instead, we use global variables for the game state and function for
				operations thereon.
				</p>

				<div class="tutorial-exercise">
				<p>
				Add the variables <code>sizeX</code>, <code>sizeY</code>,
				<code>mines</code>, and <code>todo</code> to your program. They will
				represent the dimensions, the number of mines, and the number of
				remaining non-mine tiles to uncover before winning the game. Also create
				a variable called <code>field</code>.
				</p>
				<p>
				Now define a <code>function create(sx, sy, m)</code>, which creates a
				field of size sx × sy with m mines. Its job is to initialize the
				above variables, just like a constructor initializes the attributes of
				an object. It shall set the dimensions and the number of mines to the
				values of its parameters, compute the value of <code>todo</code> (the
				total number of tiles minus the number of mines), and create the
				two-dimensional array of tiles of size <code>sizeX</code> times
				<code>sizeY</code>.
				</p>
				<p>To initialize <code>field</code>, start with an empty array. Run a
				for-loop from 0 to sizeY. In every iteration, create a
				variable <code>row</code> as an empty array. Run through a for loop from
				0 to sizeX and push a newly created Tile into <code>row</code>.
				Afterwards push the <code>row</code> into the field array.
				</p>
				<p>
				For now, we leave the field in an inconsistent state, since we do not
				(yet) place any mines therein. Don't worry, that's an independent
				sub-task that can be taken care of later.
				</p>
				<p>
				Finally, call the function to create a field of size 16x16 with 40
				mines. This setup is the default for a "medium size" game.
				</p>
				</div>
			`,
			correct: `
				class Tile {
				public:
					var mine = false;        # is there a mine in this tile?
					var uncovered = false;   # was this tile uncovered by the player?
					var flag = false;        # did the player place a flag here?
				}

				var sizeX, sizeY, mines, todo;
				var field;

				function create(sx, sy, m)
				{
					sizeX = sx;
					sizeY = sy;
					mines = m;
					todo = sx * sy - mines;
					field = [];
					for var y in 0:sizeY do
					{	
						var row = [];
						for var x in 0:sizeX do row.push(Tile());
						field.push(row);
					}
				}

				create(16, 16, 40);
				`,
			tests: [
				{
					type: "code",
					code: `
						print(sizeX);
					`,
				},
				{
					type: "code",
					code: `
						print(sizeY);
					`,
				},
				{
					type: "code",
					code: `
						print(mines);
					`,
				},
				{
					type: "code",
					code: `
						print(todo);
					`,
				},
				{
					type: "code",
					code: `
						print(field);
					`,
				},
				{
					type: "code",
					code: `
						create(9, 9, 10);
						print(sizeX);
						print(sizeY);
						print(mines);
						print(todo);
						print(field);
					`,
				},
			],
		},
		{
			content: `
				<p>
				The next step is to distribute the mines. We want them to be distributed
				uniformly at random. To this end, we need a loop. For each mine, we
				create random tile coordinates as follows:
				<tscript>
					var x = Integer(math.random() * sizeX);
					var y = Integer(math.random() * sizeY);
				</tscript>
				Explanation: <code>math.random()</code> returns a random number between
				0 (included) and 1 (excluded). Multiplying by the size and rounding down
				by converting it to an integer yields a uniform distribution on the
				ranges <code>0:sizeX</code> and <code>0:sizeY</code>.
				</p>
				<p>
				However, what if there is already a mine on that tile? Then the simplest
				strategy is to retry until we find an empty field. This means that we
				need to be prepared for running the loop for more iterations than there
				are mines.
				</p>
				<p>
				A good strategy is to use a while-loop. In each iteration, we draw
				random tile coordinates. If the tile does not contain a mine then we
				place the mine and decrease the mine counter <code>m</code> by one.
				The loop stops as soon as the counter reaches zero.
				</p>

				<div class="tutorial-exercise">
				<p>
				Extend the create function so that it places the mines randomly into the
				field.
				</p>
				</div>
			`,
			correct: `
				class Tile {
				public:
					var mine = false;        # is there a mine in this tile?
					var uncovered = false;   # was this tile uncovered by the player?
					var flag = false;        # did the player place a flag here?
				}

				var sizeX, sizeY, mines, todo;
				var field;

				function create(sx, sy, m)
				{
					sizeX = sx;
					sizeY = sy;
					mines = m;
					todo = sx * sy - mines;
					field = [];
					for var y in 0:sizeY do
					{	
						var row = [];
						for var x in 0:sizeX do row.push(Tile());
						field.push(row);
					}
					while m > 0 do
					{
						var x = Integer(math.random() * sizeX);
						var y = Integer(math.random() * sizeY);
						if not field[y][x].mine then
						{
							field[y][x].mine = true;
							m -= 1;
						}
					}
				}

				create(16, 16, 40);
				`,
			tests: [
				{
					type: "code",
					code: `
						var total = 0;
						for var y in 0:sizeY do
							for var x in 0:sizeX do
								if field[y][x].mine then total += 1;
						print(total);
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
				There are two possible drawing strategies: draw the whole field each
				time something changes, or redraw only the tiles that changed. Both
				strategies are feasible. The first one is simpler, while the second one
				is obviously more efficient. We will opt for the second, since in this
				case, it is simple enough to do.
				</p>

				<h3>Draw a Single Tile</h3>
				<p>
				The primitive operation of interest is drawing a single tile. Once we
				have that, drawing the whole field simply amounts to calling that
				operation in a loop over all tiles. It also enables us to redraw parts
				of the field as we see fit. This task will be accomplished by
				<code>function drawTile(x, y)</code>.
				</p>
				<p>
				We would like to draw the field so as to use as much of the canvas as
				possible. On the other hand, each tile should cover a square area, and
				the side length of that area should be an integer. With these
				prerequisites in place, the maximal side length of a tile is computed as
				follows:
				<tscript>
				var tilesize = math.min(canvas.width() // sizeX, canvas.height() // sizeY);
				</tscript>
				We will use this variable in our drawing function.
				</p>

				<div class="tutorial-exercise">
				<p>
				Implement the <code>function drawTile(x, y)</code>. Its job is to draw
				the tile <code>field[y][x]</code>. The top-left corner of the tile shall
				be the canvas pixel with coordinates
				<code>tilesize * x, sizesize * y</code>.
				</p>
				<p>
				In this exercise we only draw the tile outline. Depending on whether the
				tile is covered or not, we draw it with a different color. Covered tiles
				shall have a dark gray background with RGB color (0.5, 0.5, 0.5), while
				uncovered tiles shall be filled with a lighter gray background with RGB
				color (0.7, 0.7, 0.7). All tiles shall have a mid-gray (0.6, 0.6, 0.6)
				border, taking up 10% of the tile size. Set the line width to
				<code>tilesize / 10</code>, set the colors appropriately depending on
				whether the tiles is uncovered or not, and draw the tile with the
				function <code>canvas.frameRect</code>.
				</p>
				<p>
				Test your function as follows: set the state of a single tile to true or
				false and then call <code>drawTile</code> for that particular tile.
				</p>
				<p>
				Note that we are not done yet, since we also need to draw mines, flags,
				and colored numbers. We'll add that functionality later.
				</p>
				</div>
			`,
			correct: `
				class Tile {
				public:
					var mine = false;        # is there a mine in this tile?
					var uncovered = false;   # was this tile uncovered by the player?
					var flag = false;        # did the player place a flag here?
				}

				var sizeX, sizeY, mines, todo;
				var field;

				function create(sx, sy, m)
				{
					sizeX = sx;
					sizeY = sy;
					mines = m;
					todo = sx * sy - mines;
					field = [];
					for var y in 0:sizeY do
					{	
						var row = [];
						for var x in 0:sizeX do row.push(Tile());
						field.push(row);
					}
					while m > 0 do
					{
						var x = Integer(math.random() * sizeX);
						var y = Integer(math.random() * sizeY);
						if not field[y][x].mine then
						{
							field[y][x].mine = true;
							m -= 1;
						}
					}
				}

				create(16, 16, 40);

				var tilesize = math.min(canvas.width() // sizeX, canvas.height() // sizeY);

				function drawTile(x, y)
				{
					var f = field[y][x];
					if f.uncovered then canvas.setFillColor(0.7, 0.7, 0.7); else canvas.setFillColor(0.5, 0.5, 0.5);
					canvas.setLineColor(0.6, 0.6, 0.6);
					canvas.setLineWidth(tilesize / 10);
					canvas.frameRect(x*tilesize, y*tilesize, tilesize, tilesize);
				}
				`,
			tests: [
				{
					type: "code",
					code: `drawTile(10, 5);`,
				},
				{
					type: "code",
					code: `field[5][10].uncovered = true; drawTile(10, 5);`,
				},
				{
					type: "code",
					code: `drawTile(3, 11);`,
				},
				{
					type: "code",
					code: `field[11][3].uncovered = true; drawTile(3, 11);`,
				},
			],
		},
		{
			content: `
				<p>
				It is relatively easy to extend this function so that it also draws
				uncovered mines (you see one only when you loose) and flags:
				<tscript>
				# draw a single tile
				function drawTile(x, y)
				{
					var f = field[y][x];

					# draw background and frame
					if f.uncovered then canvas.setFillColor(0.7, 0.7, 0.7); else canvas.setFillColor(0.5, 0.5, 0.5);
					canvas.setLineColor(0.6, 0.6, 0.6);
					canvas.setLineWidth(tilesize / 10);
					canvas.frameRect(x*tilesize, y*tilesize, tilesize, tilesize);

					if f.uncovered then
					{
						if f.mine then
						{
							# draw mine
							canvas.setFillColor(0, 0, 0);
							canvas.fillCircle((x+0.5)*tilesize, (y+0.5)*tilesize, 0.3*tilesize);
						}
						else
						{
							# TODO: draw colored number
						}
					}
					else if f.flag then
					{
						# draw flag
						canvas.setFillColor(1, 0, 0);
						canvas.fillArea([[(x+0.7)*tilesize, (y+0.2)*tilesize], [(x+0.2)*tilesize, (y+0.3)*tilesize], [(x+0.7)*tilesize, (y+0.4)*tilesize]]);
						canvas.fillRect((x+0.7)*tilesize, (y+0.2)*tilesize, 0.05*tilesize, 0.6*tilesize);
					}
				}
				</tscript>
				To realize proper drawing at all scales we use make extensive use of the
				variable <code>tilesize</code> in all coordinate calculations.
				Incorporate this function into your program. Test the function by
				setting various attributes of the field (uncover, mine, and flag).
				</p>

				<h3>Drawing the whole field</h3>
				<p>
				With that functionality in place, it is easy to implement the
				<code>function draw()</code>, which draws the whole field. It simply
				loops over all rows, within each row over each tile, and calls
				<code>drawTile</code> with the appropriate parameters.
				</p>

				<div class="tutorial-exercise">
				<p>
				Implement <code>function draw()</code> as described above. Call it to
				draw the initial state of the field. You should see a 16×16 field of
				covered tiles.
				</p>
				</div>
			`,
			correct: `
				class Tile {
				public:
					var mine = false;        # is there a mine in this tile?
					var uncovered = false;   # was this tile uncovered by the player?
					var flag = false;        # did the player place a flag here?
				}

				var sizeX, sizeY, mines, todo;
				var field;

				function create(sx, sy, m)
				{
					sizeX = sx;
					sizeY = sy;
					mines = m;
					todo = sx * sy - mines;
					field = [];
					for var y in 0:sizeY do
					{	
						var row = [];
						for var x in 0:sizeX do row.push(Tile());
						field.push(row);
					}
					while m > 0 do
					{
						var x = Integer(math.random() * sizeX);
						var y = Integer(math.random() * sizeY);
						if not field[y][x].mine then
						{
							field[y][x].mine = true;
							m -= 1;
						}
					}
				}

				create(16, 16, 40);

				var tilesize = math.min(canvas.width() // sizeX, canvas.height() // sizeY);

				# draw a single tile
				function drawTile(x, y)
				{
					var f = field[y][x];

					# draw background and frame
					if f.uncovered then canvas.setFillColor(0.7, 0.7, 0.7); else canvas.setFillColor(0.5, 0.5, 0.5);
					canvas.setLineColor(0.6, 0.6, 0.6);
					canvas.setLineWidth(tilesize / 10);
					canvas.frameRect(x*tilesize, y*tilesize, tilesize, tilesize);

					if f.uncovered then
					{
						if f.mine then
						{
							# draw mine
							canvas.setFillColor(0, 0, 0);
							canvas.fillCircle((x+0.5)*tilesize, (y+0.5)*tilesize, 0.3*tilesize);
						}
						else
						{
							# TODO: draw colored number
						}
					}
					else if f.flag then
					{
						# draw flag
						canvas.setFillColor(1, 0, 0);
						canvas.fillArea([[(x+0.7)*tilesize, (y+0.2)*tilesize], [(x+0.2)*tilesize, (y+0.3)*tilesize], [(x+0.7)*tilesize, (y+0.4)*tilesize]]);
						canvas.fillRect((x+0.7)*tilesize, (y+0.2)*tilesize, 0.05*tilesize, 0.6*tilesize);
					}
				}

				function draw()
				{
					for var y in 0:sizeY do
						for var x in 0:sizeX do
							drawTile(x, y);
				}
				draw();
				`,
		},
		{
			content: `
				<h3>Counting</h3>
				<p>
				A central functionality is still missing: for a covered field, we need
				to know the number of mines in the 3×3 neighborhood. Counting the mines
				in the neighborhood is another small sub-task that deserves its own
				function.
				</p>

				<div class="tutorial-exercise">
				<p>
				Implement the <code>function neighbors(x, y)</code>. It returns the
				number of mines in the 3×3 neighborhood of the tile. Of course, it
				needs to gracefully handle tiles at the boundary of the field.
				</p>
				</div>
			`,
			correct: `
				class Tile {
				public:
					var mine = false;        # is there a mine in this tile?
					var uncovered = false;   # was this tile uncovered by the player?
					var flag = false;        # did the player place a flag here?
				}

				var sizeX, sizeY, mines, todo;
				var field;

				function create(sx, sy, m)
				{
					sizeX = sx;
					sizeY = sy;
					mines = m;
					todo = sx * sy - mines;
					field = [];
					for var y in 0:sizeY do
					{	
						var row = [];
						for var x in 0:sizeX do row.push(Tile());
						field.push(row);
					}
					while m > 0 do
					{
						var x = Integer(math.random() * sizeX);
						var y = Integer(math.random() * sizeY);
						if not field[y][x].mine then
						{
							field[y][x].mine = true;
							m -= 1;
						}
					}
				}

				create(16, 16, 40);

				var tilesize = math.min(canvas.width() // sizeX, canvas.height() // sizeY);

				# draw a single tile
				function drawTile(x, y)
				{
					var f = field[y][x];

					# draw background and frame
					if f.uncovered then canvas.setFillColor(0.7, 0.7, 0.7); else canvas.setFillColor(0.5, 0.5, 0.5);
					canvas.setLineColor(0.6, 0.6, 0.6);
					canvas.setLineWidth(tilesize / 10);
					canvas.frameRect(x*tilesize, y*tilesize, tilesize, tilesize);

					if f.uncovered then
					{
						if f.mine then
						{
							# draw mine
							canvas.setFillColor(0, 0, 0);
							canvas.fillCircle((x+0.5)*tilesize, (y+0.5)*tilesize, 0.3*tilesize);
						}
						else
						{
							# TODO: draw colored number
						}
					}
					else if f.flag then
					{
						# draw flag
						canvas.setFillColor(1, 0, 0);
						canvas.fillArea([[(x+0.7)*tilesize, (y+0.2)*tilesize], [(x+0.2)*tilesize, (y+0.3)*tilesize], [(x+0.7)*tilesize, (y+0.4)*tilesize]]);
						canvas.fillRect((x+0.7)*tilesize, (y+0.2)*tilesize, 0.05*tilesize, 0.6*tilesize);
					}
				}

				function draw()
				{
					for var y in 0:sizeY do
						for var x in 0:sizeX do
							drawTile(x, y);
				}
				draw();

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
			tests: [
				{
					type: "code",
					code: `
						field[4][2].mine = false;
						field[4][3].mine = true;
						field[4][4].mine = false;
						field[5][2].mine = false;
						field[5][3].mine = false;
						field[5][4].mine = false;
						field[6][2].mine = false;
						field[6][3].mine = false;
						field[6][4].mine = false;
						print(neighbors(3, 5));
						`,
				},
				{
					type: "code",
					code: `
						field[4][2].mine = false;
						field[4][3].mine = false;
						field[4][4].mine = true;
						field[5][2].mine = false;
						field[5][3].mine = false;
						field[5][4].mine = false;
						field[6][2].mine = false;
						field[6][3].mine = false;
						field[6][4].mine = false;
						print(neighbors(3, 5));
						`,
				},
				{
					type: "code",
					code: `
						field[4][2].mine = false;
						field[4][3].mine = false;
						field[4][4].mine = false;
						field[5][2].mine = false;
						field[5][3].mine = false;
						field[5][4].mine = true;
						field[6][2].mine = false;
						field[6][3].mine = false;
						field[6][4].mine = true;
						print(neighbors(3, 5));
						`,
				},
				{
					type: "code",
					code: `
						field[4][2].mine = false;
						field[4][3].mine = true;
						field[4][4].mine = false;
						field[5][2].mine = true;
						field[5][3].mine = false;
						field[5][4].mine = true;
						field[6][2].mine = true;
						field[6][3].mine = false;
						field[6][4].mine = false;
						print(neighbors(3, 5));
						`,
				},
				{
					type: "code",
					code: `
						field[4][2].mine = true;
						field[4][3].mine = true;
						field[4][4].mine = true;
						field[5][2].mine = true;
						field[5][3].mine = false;
						field[5][4].mine = true;
						field[6][2].mine = true;
						field[6][3].mine = true;
						field[6][4].mine = true;
						print(neighbors(3, 5));
						`,
				},
				{
					type: "code",
					code: `
						field[4][2].mine = true;
						field[4][3].mine = true;
						field[4][4].mine = false;
						field[5][2].mine = true;
						field[5][3].mine = false;
						field[5][4].mine = true;
						field[6][2].mine = true;
						field[6][3].mine = false;
						field[6][4].mine = true;
						print(neighbors(3, 5));
						`,
				},
			],
		},
		{
			content: `
				<p>
				With the ability to count mines in the neighborhood, it is time to
				complete the <code>drawTile</code> function. In case of no neighboring
				mines there is nothing to do. Otherwise a colored digit is to be
				centered into the tile. Instead of going through nine different cases
				(0 to 8 mines), we define RGB colors as follows:
				<tscript>
				var rgb = [
						null,
						[0,0,1],
						[0,0.5,0],
						[1,0,0],
						[0,0,0.5],
						[0.5,0,0],
						[0,0.5,0.5],
						[0,0,0],
						[0.4,0.4,0.4]
					];
				</tscript>
				Each RGB color is an array of three numbers. For 1 to 8 mines, it can be
				accessed as <code>rgb[num]</code>, where <code>num</code> is the number
				of mines in the neighborhood. Add this variable to the program. Then
				replace the line
				<tscript>
				# TODO: draw colored number
				</tscript>
				with the following code snippet:
				</p>
				<tscript>
				var num = neighbors(x, y);
				if num > 0 then
				{
					# draw colored number
					canvas.setFillColor(rgb[num][0], rgb[num][1], rgb[num][2]);
					canvas.setTextAlign("center");
					canvas.setFont("Helvetica", 0.6*tilesize);
					canvas.text((x+0.5)*tilesize, (y+0.25)*tilesize, num);
				}
				</tscript>
				When manually uncovering a few tiles and then calling <code>draw();</code>
				you should see colored numbers appearing.

				<h2>Handling Events</h2>
				<p>
				Usually in games, we'd redraw the canvas every frame. With our
				minesweeper game it is sufficient to just redraw the tiles that change.
				Change happens in response to clicks: the left mouse button uncovers a
				tile, while the right mouse button toggles the flag.
				</p>
				<p>
				We start by creating the <code>function uncover(x, y)</code>. It shall
				be called when the user clicks a covered tile without a flag. If the
				tile is already uncovered or if it contains a flag then the function
				returns immediately. Otherwise it sets the flag <code>uncovered</code>
				to <code>true</code> and calls <code>drawTile(x, y)</code> to update the
				display.
				</p>
				<p>
				If the tile is a mine then the player looses the game. The function
				shall quit event mode and output the message
				<code>"Baaaam! Better luck next time!"</code> as an alert.
				Otherwise we decrement the variable <code>todo</code>. If it reaches
				zero then the player wins the game. This is signaled with the alert
				<code>"Congratulations! You cleared the field."</code> and stopping
				event mode.
				</p>
				<p>
				In the main program, add the following lines to handle events:
				<tscript>
				setEventHandler("canvas.keydown", function(event)
				{
					if event.key == "Escape" then quitEventMode();
				});
				setEventHandler("canvas.mousedown", function(event)
				{
					if event.x >= sizeX * tilesize or event.y >= sizeY * tilesize then return;
					if event.button == "left" then uncover(event.x // tilesize, event.y // tilesize);
				});
				enterEventMode();
				</tscript>
				The key handler allows us to stop the program at any time.
				The click handler calls our function if the mouse is over a tile.
				Recall that the variable <code>win</code> will contain the parameter
				passed to <code>quitEventMode</code>. We handle the result by raising a
				corresponding alert.
				</p>
				<p>
				We will eventually have to check whether the uncovered tile has any
				mines as neighbors. If not, all neighboring tiles shall be uncovered.
				We will leave that for the next step.
				</p>
				<div class="tutorial-exercise">
				<p>
				Implement the <code>function uncover(x, y)</code> as described above.
				</p>
				</div>
			`,
			correct: `
				class Tile {
				public:
					var mine = false;        # is there a mine in this tile?
					var uncovered = false;   # was this tile uncovered by the player?
					var flag = false;        # did the player place a flag here?
				}

				var sizeX, sizeY, mines, todo;
				var field;

				var rgb = [
						null,
						[0,0,1],
						[0,0.5,0],
						[1,0,0],
						[0,0,0.5],
						[0.5,0,0],
						[0,0.5,0.5],
						[0,0,0],
						[0.4,0.4,0.4]
					];

				function create(sx, sy, m)
				{
					sizeX = sx;
					sizeY = sy;
					mines = m;
					todo = sx * sy - mines;
					field = [];
					for var y in 0:sizeY do
					{	
						var row = [];
						for var x in 0:sizeX do row.push(Tile());
						field.push(row);
					}
					while m > 0 do
					{
						var x = Integer(math.random() * sizeX);
						var y = Integer(math.random() * sizeY);
						if not field[y][x].mine then
						{
							field[y][x].mine = true;
							m -= 1;
						}
					}
				}

				create(16, 16, 40);

				var tilesize = math.min(canvas.width() // sizeX, canvas.height() // sizeY);

				# draw a single tile
				function drawTile(x, y)
				{
					var f = field[y][x];

					# draw background and frame
					if f.uncovered then canvas.setFillColor(0.7, 0.7, 0.7); else canvas.setFillColor(0.5, 0.5, 0.5);
					canvas.setLineColor(0.6, 0.6, 0.6);
					canvas.setLineWidth(tilesize / 10);
					canvas.frameRect(x*tilesize, y*tilesize, tilesize, tilesize);

					if f.uncovered then
					{
						if f.mine then
						{
							# draw mine
							canvas.setFillColor(0, 0, 0);
							canvas.fillCircle((x+0.5)*tilesize, (y+0.5)*tilesize, 0.3*tilesize);
						}
						else
						{
							var num = neighbors(x, y);
							if num > 0 then
							{
								# draw colored number
								canvas.setFillColor(rgb[num][0], rgb[num][1], rgb[num][2]);
								canvas.setTextAlign("center");
								canvas.setFont("Helvetica", 0.6*tilesize);
								canvas.text((x+0.5)*tilesize, (y+0.25)*tilesize, num);
							}
						}
					}
					else if f.flag then
					{
						# draw flag
						canvas.setFillColor(1, 0, 0);
						canvas.fillArea([[(x+0.7)*tilesize, (y+0.2)*tilesize], [(x+0.2)*tilesize, (y+0.3)*tilesize], [(x+0.7)*tilesize, (y+0.4)*tilesize]]);
						canvas.fillRect((x+0.7)*tilesize, (y+0.2)*tilesize, 0.05*tilesize, 0.6*tilesize);
					}
				}

				function draw()
				{
					for var y in 0:sizeY do
						for var x in 0:sizeX do
							drawTile(x, y);
				}
				draw();

				function neighbors(x, y)
				{
					var counter = 0;
					for var a in -1:2 do
					{
						if y+a < 0 or y+a >= sizeY then continue;
						for var b in -1:2 do
						{
							if x+b < 0 or x+b >= sizeX then continue;
							if field[y+a][x+b].mine then counter += 1;
						}
					}
					return counter;
				}

				function uncover(x, y)
				{
					if field[y][x].uncovered or field[y][x].flag then return;
					field[y][x].uncovered = true;
					drawTile(x, y);
					if field[y][x].mine then
					{
						quitEventMode();
						alert("Baaaam! Better luck next time!");
					}
					else
					{
						todo -= 1;
						if todo == 0 then
						{
							quitEventMode();
							alert("Congratulations! You cleared the field.");
						}
					}
				}

				setEventHandler("canvas.keydown", function(event)
				{
					if event.key == "Escape" then quitEventMode();
				});
				setEventHandler("canvas.mousedown", function(event)
				{
					if event.x >= sizeX * tilesize or event.y >= sizeY * tilesize then return;
					if event.button == "left" then uncover(event.x // tilesize, event.y // tilesize);
				});
				enterEventMode();
			`,
			tests: [
				{
					type: "code",
					input: [
						{
							type: "canvas.keydown",
							classname: "canvas.KeyboardEvent",
							event: {
								key: "Escape",
								shift: false,
								control: false,
								alt: false,
								meta: false,
							},
						},
					],
					code: `
						field[0][0].mine = false;
						field[0][1].mine = true;
						field[1][0].mine = false;
						field[1][1].mine = true;
						uncover(0, 0);
						uncover(1, 1);
					`,
				},
				{
					type: "code",
					input: [
						{
							type: "canvas.keydown",
							classname: "canvas.KeyboardEvent",
							event: {
								key: "Escape",
								shift: false,
								control: false,
								alt: false,
								meta: false,
							},
						},
					],
					code: `
						field[0][0].mine = false;
						field[0][0].flag = true;
						field[1][1].mine = true;
						uncover(0, 0);
						uncover(1, 1);
					`,
				},
			],
		},
		{
			content: `
				<p>
				The game is already playable, although it is quite tough. As a first
				improvement, we should allow the user to toggle flags. To this end,
				we extend the click handler as follows:
				<tscript>
				setEventHandler("canvas.mousedown", function(event)
				{
					if event.x >= sizeX * tilesize or event.y >= sizeY * tilesize then return;
					if event.button == "left" then uncover(event.x // tilesize, event.y // tilesize);
					else if event.button == "right" then toggle(event.x // tilesize, event.y // tilesize);
				});
				</tscript>

				<div class="tutorial-exercise">
				<p>
				Implement the <code>function toggle(x, y)</code>. When called on a
				uncovered field it does nothing. Otherwise it toggles the flag, i.e.,
				it adds the flag if there was none, and it removes the flag otherwise.
				Of course, it calls <code>drawTile(x, y);</code> when it is done.
				</p>
				</div>
			`,
			correct: `
				class Tile {
				public:
					var mine = false;        # is there a mine in this tile?
					var uncovered = false;   # was this tile uncovered by the player?
					var flag = false;        # did the player place a flag here?
				}

				var sizeX, sizeY, mines, todo;
				var field;

				var rgb = [
						null,
						[0,0,1],
						[0,0.5,0],
						[1,0,0],
						[0,0,0.5],
						[0.5,0,0],
						[0,0.5,0.5],
						[0,0,0],
						[0.4,0.4,0.4]
					];

				function create(sx, sy, m)
				{
					sizeX = sx;
					sizeY = sy;
					mines = m;
					todo = sx * sy - mines;
					field = [];
					for var y in 0:sizeY do
					{	
						var row = [];
						for var x in 0:sizeX do row.push(Tile());
						field.push(row);
					}
					while m > 0 do
					{
						var x = Integer(math.random() * sizeX);
						var y = Integer(math.random() * sizeY);
						if not field[y][x].mine then
						{
							field[y][x].mine = true;
							m -= 1;
						}
					}
				}

				create(16, 16, 40);

				var tilesize = math.min(canvas.width() // sizeX, canvas.height() // sizeY);

				# draw a single tile
				function drawTile(x, y)
				{
					var f = field[y][x];

					# draw background and frame
					if f.uncovered then canvas.setFillColor(0.7, 0.7, 0.7); else canvas.setFillColor(0.5, 0.5, 0.5);
					canvas.setLineColor(0.6, 0.6, 0.6);
					canvas.setLineWidth(tilesize / 10);
					canvas.frameRect(x*tilesize, y*tilesize, tilesize, tilesize);

					if f.uncovered then
					{
						if f.mine then
						{
							# draw mine
							canvas.setFillColor(0, 0, 0);
							canvas.fillCircle((x+0.5)*tilesize, (y+0.5)*tilesize, 0.3*tilesize);
						}
						else
						{
							var num = neighbors(x, y);
							if num > 0 then
							{
								# draw colored number
								canvas.setFillColor(rgb[num][0], rgb[num][1], rgb[num][2]);
								canvas.setTextAlign("center");
								canvas.setFont("Helvetica", 0.6*tilesize);
								canvas.text((x+0.5)*tilesize, (y+0.25)*tilesize, num);
							}
						}
					}
					else if f.flag then
					{
						# draw flag
						canvas.setFillColor(1, 0, 0);
						canvas.fillArea([[(x+0.7)*tilesize, (y+0.2)*tilesize], [(x+0.2)*tilesize, (y+0.3)*tilesize], [(x+0.7)*tilesize, (y+0.4)*tilesize]]);
						canvas.fillRect((x+0.7)*tilesize, (y+0.2)*tilesize, 0.05*tilesize, 0.6*tilesize);
					}
				}

				function draw()
				{
					for var y in 0:sizeY do
						for var x in 0:sizeX do
							drawTile(x, y);
				}
				draw();

				function neighbors(x, y)
				{
					var counter = 0;
					for var a in -1:2 do
					{
						if y+a < 0 or y+a >= sizeY then continue;
						for var b in -1:2 do
						{
							if x+b < 0 or x+b >= sizeX then continue;
							if field[y+a][x+b].mine then counter += 1;
						}
					}
					return counter;
				}

				function uncover(x, y)
				{
					if field[y][x].uncovered or field[y][x].flag then return;
					field[y][x].uncovered = true;
					drawTile(x, y);
					if field[y][x].mine then
					{
						quitEventMode();
						alert("Baaaam! Better luck next time!");
					}
					else
					{
						todo -= 1;
						if todo == 0 then
						{
							quitEventMode();
							alert("Congratulations! You cleared the field.");
						}
					}
				}

				function toggle(x, y)
				{
					if field[y][x].uncovered then return;
					field[y][x].flag = not field[y][x].flag;
					drawTile(x, y);
				}

				setEventHandler("canvas.keydown", function(event)
				{
					if event.key == "Escape" then quitEventMode();
				});
				setEventHandler("canvas.mousedown", function(event)
				{
					if event.x >= sizeX * tilesize or event.y >= sizeY * tilesize then return;
					if event.button == "left" then uncover(event.x // tilesize, event.y // tilesize);
					else if event.button == "right" then toggle(event.x // tilesize, event.y // tilesize);
				});
				enterEventMode();
			`,
			tests: [
				{
					type: "code",
					input: [
						{
							type: "canvas.keydown",
							classname: "canvas.KeyboardEvent",
							event: {
								key: "Escape",
								shift: false,
								control: false,
								alt: false,
								meta: false,
							},
						},
					],
					code: `
						field[0][0].mine = false;
						field[0][1].mine = true;
						field[1][0].mine = false;
						field[1][1].mine = true;
						uncover(0, 0);
						uncover(1, 1);
					`,
				},
				{
					type: "code",
					input: [
						{
							type: "canvas.keydown",
							classname: "canvas.KeyboardEvent",
							event: {
								key: "Escape",
								shift: false,
								control: false,
								alt: false,
								meta: false,
							},
						},
					],
					code: `
						toggle(6, 4);
						toggle(6, 4);
						toggle(6, 4);
					`,
				},
			],
		},
		{
			content: `
				<h2>Uncovering Areas</h2>
				<p>
				One annoyance with the current implementation is that areas around tiles
				without neighboring mines are not uncovered automatically, which results
				in excessive trivial clicking. Let's automate that task!
				</p>
				<p>
				How to achieve that? The solution is surprisingly simple. Whenever we
				encounter a field without neighboring mines, we can automatically
				uncover all neighboring tiles. This amounts to <i>recursively</i>
				calling <code>uncover</code> from within that function.
				</p>

				<div class="tutorial-exercise">
				<p>
				Extend the function <code>uncover</code> to recursively uncover whole
				ares. Don't forget to take care of the boundaries of the field.
				</p>
				</div>
			`,
			correct: `
				class Tile {
				public:
					var mine = false;        # is there a mine in this tile?
					var uncovered = false;   # was this tile uncovered by the player?
					var flag = false;        # did the player place a flag here?
				}

				var sizeX, sizeY, mines, todo;
				var field;

				var rgb = [
						null,
						[0,0,1],
						[0,0.5,0],
						[1,0,0],
						[0,0,0.5],
						[0.5,0,0],
						[0,0.5,0.5],
						[0,0,0],
						[0.4,0.4,0.4]
					];

				function create(sx, sy, m)
				{
					sizeX = sx;
					sizeY = sy;
					mines = m;
					todo = sx * sy - mines;
					field = [];
					for var y in 0:sizeY do
					{	
						var row = [];
						for var x in 0:sizeX do row.push(Tile());
						field.push(row);
					}
					while m > 0 do
					{
						var x = Integer(math.random() * sizeX);
						var y = Integer(math.random() * sizeY);
						if not field[y][x].mine then
						{
							field[y][x].mine = true;
							m -= 1;
						}
					}
				}

				create(16, 16, 40);

				var tilesize = math.min(canvas.width() // sizeX, canvas.height() // sizeY);

				# draw a single tile
				function drawTile(x, y)
				{
					var f = field[y][x];

					# draw background and frame
					if f.uncovered then canvas.setFillColor(0.7, 0.7, 0.7); else canvas.setFillColor(0.5, 0.5, 0.5);
					canvas.setLineColor(0.6, 0.6, 0.6);
					canvas.setLineWidth(tilesize / 10);
					canvas.frameRect(x*tilesize, y*tilesize, tilesize, tilesize);

					if f.uncovered then
					{
						if f.mine then
						{
							# draw mine
							canvas.setFillColor(0, 0, 0);
							canvas.fillCircle((x+0.5)*tilesize, (y+0.5)*tilesize, 0.3*tilesize);
						}
						else
						{
							var num = neighbors(x, y);
							if num > 0 then
							{
								# draw colored number
								canvas.setFillColor(rgb[num][0], rgb[num][1], rgb[num][2]);
								canvas.setTextAlign("center");
								canvas.setFont("Helvetica", 0.6*tilesize);
								canvas.text((x+0.5)*tilesize, (y+0.25)*tilesize, num);
							}
						}
					}
					else if f.flag then
					{
						# draw flag
						canvas.setFillColor(1, 0, 0);
						canvas.fillArea([[(x+0.7)*tilesize, (y+0.2)*tilesize], [(x+0.2)*tilesize, (y+0.3)*tilesize], [(x+0.7)*tilesize, (y+0.4)*tilesize]]);
						canvas.fillRect((x+0.7)*tilesize, (y+0.2)*tilesize, 0.05*tilesize, 0.6*tilesize);
					}
				}

				function draw()
				{
					for var y in 0:sizeY do
						for var x in 0:sizeX do
							drawTile(x, y);
				}
				draw();

				function neighbors(x, y)
				{
					var counter = 0;
					for var a in -1:2 do
					{
						if y+a < 0 or y+a >= sizeY then continue;
						for var b in -1:2 do
						{
							if x+b < 0 or x+b >= sizeX then continue;
							if field[y+a][x+b].mine then counter += 1;
						}
					}
					return counter;
				}

				function uncover(x, y)
				{
					if field[y][x].uncovered or field[y][x].flag then return;
					field[y][x].uncovered = true;
					drawTile(x, y);
					if field[y][x].mine then
					{
						quitEventMode();
						alert("Baaaam! Better luck next time!");
					}
					else
					{
						todo -= 1;
						if todo == 0 then
						{
							quitEventMode();
							alert("Congratulations! You cleared the field.");
						}
						if neighbors(x, y) == 0 then
						{
							for var a in -1:2 do
							{
								if y+a < 0 or y+a >= sizeY then continue;
								for var b in -1:2 do
								{
									if x+b < 0 or x+b >= sizeX then continue;
									uncover(x+b, y+a);
								}
							}
						}
					}
				}

				function toggle(x, y)
				{
					if field[y][x].uncovered then return;
					field[y][x].flag = not field[y][x].flag;
					drawTile(x, y);
				}

				setEventHandler("canvas.keydown", function(event)
				{
					if event.key == "Escape" then quitEventMode();
				});
				setEventHandler("canvas.mousedown", function(event)
				{
					if event.x >= sizeX * tilesize or event.y >= sizeY * tilesize then return;
					if event.button == "left" then uncover(event.x // tilesize, event.y // tilesize);
					else if event.button == "right" then toggle(event.x // tilesize, event.y // tilesize);
				});
				enterEventMode();
			`,
			tests: [
				{
					type: "code",
					input: [
						{
							type: "canvas.keydown",
							classname: "canvas.KeyboardEvent",
							event: {
								key: "Escape",
								shift: false,
								control: false,
								alt: false,
								meta: false,
							},
						},
					],
					code: `
						field[0][0].mine = false;
						field[0][1].mine = false;
						field[0][2].mine = false;
						field[0][3].mine = true;
						field[1][0].mine = false;
						field[1][1].mine = false;
						field[1][2].mine = false;
						field[1][3].mine = true;
						field[2][0].mine = false;
						field[2][1].mine = false;
						field[2][2].mine = true;
						field[2][3].mine = false;
						field[3][0].mine = true;
						field[3][1].mine = false;
						field[3][2].mine = false;
						field[3][3].mine = false;
						uncover(0, 0);
					`,
				},
			],
		},
		{
			content: `
				<h2>Final Steps</h2>
				<p>
				We are only two small steps away from completing the project.
				</p>

				<h3>Initialization</h3>
				<p>
				Currently, the player can only guess in the initial move. We should
				break the symmetry by uncovering a tile without neighbors, which results
				in a whole area being uncovered. All we need to do is to search for a
				free tile. The process should be as follows: Add a while-loop, draw
				random coordinates, check the number of neighbors, and if the number is
				zero then uncover the field and stop the loop.
				</p>

				<h3>Resizing</h3>
				<p>
				Finally, let's make the game resilient to resizing of the canvas. That's
				easy: handle the <code>"canvas.resize"</code> event. In the event
				handler, first re-compute the variable <code>tilesize</code> and then
				call <code>draw()</code>.
				</p>

				<h2>Wrap-Up</h2>
				<p>
				When that's done, we should have arrived at a fully functional
				minesweeper game! :) Here is the full code:
				</p>
				<pre>
class Tile {
public:
	var mine = false;        # is there a mine in this tile?
	var uncovered = false;   # was this tile uncovered by the player?
	var flag = false;        # did the player place a flag here?
}

var sizeX, sizeY, mines, todo;
var field;

var rgb = [
		null,
		[0,0,1],
		[0,0.5,0],
		[1,0,0],
		[0,0,0.5],
		[0.5,0,0],
		[0,0.5,0.5],
		[0,0,0],
		[0.4,0.4,0.4]
	];

function create(sx, sy, m)
{
	sizeX = sx;
	sizeY = sy;
	mines = m;
	todo = sx * sy - mines;
	field = [];
	for var y in 0:sizeY do
	{	
		var row = [];
		for var x in 0:sizeX do row.push(Tile());
		field.push(row);
	}
	while m > 0 do
	{
		var x = Integer(math.random() * sizeX);
		var y = Integer(math.random() * sizeY);
		if not field[y][x].mine then
		{
			field[y][x].mine = true;
			m -= 1;
		}
	}
}

create(16, 16, 40);

var tilesize = math.min(canvas.width() // sizeX, canvas.height() // sizeY);

# draw a single tile
function drawTile(x, y)
{
	var f = field[y][x];

	# draw background and frame
	if f.uncovered then canvas.setFillColor(0.7, 0.7, 0.7); else canvas.setFillColor(0.5, 0.5, 0.5);
	canvas.setLineColor(0.6, 0.6, 0.6);
	canvas.setLineWidth(tilesize / 10);
	canvas.frameRect(x*tilesize, y*tilesize, tilesize, tilesize);

	if f.uncovered then
	{
		if f.mine then
		{
			# draw mine
			canvas.setFillColor(0, 0, 0);
			canvas.fillCircle((x+0.5)*tilesize, (y+0.5)*tilesize, 0.3*tilesize);
		}
		else
		{
			var num = neighbors(x, y);
			if num > 0 then
			{
				# draw colored number
				canvas.setFillColor(rgb[num][0], rgb[num][1], rgb[num][2]);
				canvas.setTextAlign("center");
				canvas.setFont("Helvetica", 0.6*tilesize);
				canvas.text((x+0.5)*tilesize, (y+0.25)*tilesize, num);
			}
		}
	}
	else if f.flag then
	{
		# draw flag
		canvas.setFillColor(1, 0, 0);
		canvas.fillArea([[(x+0.7)*tilesize, (y+0.2)*tilesize], [(x+0.2)*tilesize, (y+0.3)*tilesize], [(x+0.7)*tilesize, (y+0.4)*tilesize]]);
		canvas.fillRect((x+0.7)*tilesize, (y+0.2)*tilesize, 0.05*tilesize, 0.6*tilesize);
	}
}

function draw()
{
	for var y in 0:sizeY do
		for var x in 0:sizeX do
			drawTile(x, y);
}
draw();

function neighbors(x, y)
{
	var counter = 0;
	for var a in -1:2 do
	{
		if y+a < 0 or y+a >= sizeY then continue;
		for var b in -1:2 do
		{
			if x+b < 0 or x+b >= sizeX then continue;
			if field[y+a][x+b].mine then counter += 1;
		}
	}
	return counter;
}

function uncover(x, y)
{
	if field[y][x].uncovered or field[y][x].flag then return;
	field[y][x].uncovered = true;
	drawTile(x, y);
	if field[y][x].mine then
	{
		quitEventMode();
		alert("Baaaam! Better luck next time!");
	}
	else
	{
		todo -= 1;
		if todo == 0 then
		{
			quitEventMode();
			alert("Congratulations! You cleared the field.");
		}
		if neighbors(x, y) == 0 then
		{
			for var a in -1:2 do
			{
				if y+a < 0 or y+a >= sizeY then continue;
				for var b in -1:2 do
				{
					if x+b < 0 or x+b >= sizeX then continue;
					uncover(x+b, y+a);
				}
			}
		}
	}
}

function toggle(x, y)
{
	if field[y][x].uncovered then return;
	field[y][x].flag = not field[y][x].flag;
	drawTile(x, y);
}

while true do
{
	var x = Integer(math.random() * sizeX);
	var y = Integer(math.random() * sizeY);
	if neighbors(x, y) == 0 then
	{
		uncover(x, y);
		break;
	}
}

setEventHandler("canvas.keydown", function(event)
{
	if event.key == "Escape" then quitEventMode();
});
setEventHandler("canvas.mousedown", function(event)
{
	if event.x >= sizeX * tilesize or event.y >= sizeY * tilesize then return;
	if event.button == "left" then uncover(event.x // tilesize, event.y // tilesize);
	else if event.button == "right" then toggle(event.x // tilesize, event.y // tilesize);
});
setEventHandler("canvas.resize", function(event)
{
	tilesize = math.min(canvas.width() // sizeX, canvas.height() // sizeY);
	draw();
});
enterEventMode();
				</pre>
				<p>
				Enjoy!
				</p>
			`,
		},
	],
};
