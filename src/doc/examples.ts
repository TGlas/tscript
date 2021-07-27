import { Documentation } from ".";

export const doc_examples: Documentation = {
	id: "examples",
	name: "Example Programs",
	title: "Example Programs",
	content: `
	<p>
	This section provides example programs demonstrating the use of
	turtle and canvas graphics. They can by copied by clicking the code.
	Simply paste the code into the editor and run the programs. You may
	need to activate the corresponding panels (turtle or canvas) in
	order to see the output.
	</p>
	<ul>
		<li><a href="?doc#/examples/koch-snowflake">Koch snowflake (turtle graphics)</a></li>
		<li><a href="?doc#/examples/game-of-life">Conway's Game of Life (canvas graphics)</a></li>
		<li><a href="?doc#/examples/cube-3D">Rotating 3D Cube (canvas graphics)</a></li>
	</ul>
`,
	children: [
		{
			id: "koch-snowflake",
			name: "Koch Snowflake",
			title: "Koch Snowflake",
			content: `
		<tscript do-not-run>
			#
			# Koch snowflake
			# https://en.wikipedia.org/wiki/Koch_snowflake
			#

			function segment(length, depth)
			{
				if depth <= 0 then
				{
					turtle.move(length);
				}
				else
				{
					segment(length/3, depth-1);
					turtle.turn(60);
					segment(length/3, depth-1);
					turtle.turn(-120);
					segment(length/3, depth-1);
					turtle.turn(60);
					segment(length/3, depth-1);
				}
			}

			var h0 = -80 / 3 * math.sqrt(3);
			for var depth in 1:7 do
			{
				turtle.reset(-80, h0, 90);
				turtle.color(0, 0, 0);
				for 0:3 do
				{
					segment(160, depth);
					turtle.turn(-120);
				}
				if depth == 6 then break;
				wait(1000);
				turtle.reset(-80, h0, 90);
				turtle.color(1, 1, 1);
				for 0:3 do
				{
					segment(160, depth);
					turtle.turn(-120);
				}
			}
		</tscript>
	`,
			children: [],
		},
		{
			id: "game-of-life",
			name: "Game of Life",
			title: "Game of Life",
			content: `
		<tscript do-not-run>
			#
			# Game of Life
			# https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life
			#

			# initialize the field
			var fieldsize = 25;
			var field = [];
			for var y in 0:fieldsize do
			{
				var row = [];
				for var x in 0:fieldsize do row.push(math.random() < 0.2);
				field.push(row);
			}

			# progress the dynamics by one time step
			function step()
			{
				var newfield = [];
				for var y in 0:fieldsize do
				{
					var row = [];
					for var x in 0:fieldsize do
					{
						var n = 0;
						for var b in -1:2 do
							for var a in -1:2 do
								if field[(y+b+fieldsize) % fieldsize][(x+a+fieldsize) % fieldsize] then n += 1;
						if field[y][x] then row.push(n == 3 or n == 4);
						else row.push(n == 3);
					}
					newfield.push(row);
				}
				field = newfield;
			}

			# redraw the whole field
			function draw()
			{
				# size of a cell in pixels
				var sz = math.min(canvas.width() // fieldsize, canvas.height() // fieldsize);
				if sz <= 0 then return;

				for var y in 0:fieldsize do
				{
					for var x in 0:fieldsize do
					{
						if field[y][x] then canvas.setFillColor(1, 1, 1);
						else canvas.setFillColor(0, 0, 1);
						canvas.fillRect(x*sz, y*sz, sz, sz);
					}
				}
			}

			# draw the initial state
			canvas.setFillColor(0, 0, 0);
			canvas.clear();
			draw();

			# infinite "game" loop
			while true do
			{
				step();
				draw();
			}
		</tscript>
	`,
			children: [],
		},
		{
			id: "cube-3D",
			name: "3D Cube",
			title: "3D Cube",
			content: `
		<tscript do-not-run>
			#
			# 3D cube
			#

			use namespace math;

			class Face
			{
			public:
				var color;
				var points;
				constructor(points_, color_)
				{
					points = points_;
					color = color_;
				}
			}

			var points3d = [
					[-1,-1,-1],
					[+1,-1,-1],
					[-1,+1,-1],
					[+1,+1,-1],
					[-1,-1,+1],
					[+1,-1,+1],
					[-1,+1,+1],
					[+1,+1,+1],
				];
			var faces = [
					Face([0,1,3,2], [1,0,0]),
					Face([1,0,4,5], [1,1,0]),
					Face([3,1,5,7], [0,1,0]),
					Face([2,3,7,6], [0,0,1]),
					Face([0,2,6,4], [1,0,1]),
					Face([6,7,5,4], [0,1,1]),
				];

			function matmat(m1, m2)
			{
				var ret = [[1,0,0], [0,1,0], [0,0,1]];
				for var i in 0:3 do
				{
					for var j in 0:3 do
					{
						var sum = 0.0;
						for var k in 0:3 do sum += m1[i][k] * m2[k][j];
						ret[i][j] = sum;
					}
				}
				return ret;
			}

			function matvec(m, v)
			{
				var ret = [0,0,0];
				for var j in 0:3 do
				{
					var sum = 0.0;
					for var k in 0:3 do sum += m[j][k] * v[k];
					ret[j] = sum;
				}
				return ret;
			}

			function projection(v)
			{
				use namespace canvas;
				var w = width() / 2;
				var h = height() / 2;
				var s = min(w, h);
				return [w + s * v[0] / (v[2] + 3), h + s * v[1] / (v[2] + 3)];
			}

			function draw(yaw, pitch)
			{
				var rot_yaw = [[cos(yaw),0,sin(yaw)], [0,1,0], [-sin(yaw),0,cos(yaw)]];
				var rot_pitch = [[1,0,0], [0,cos(pitch),sin(pitch)], [0,-sin(pitch),cos(pitch)]];
				var rot = matmat(rot_yaw, rot_pitch);
				var points2d = [];
				for var p in points3d do
				{
					var p3d = matvec(rot, p);
					var p2d = projection(p3d);
					points2d.push(p2d);
				}
				for var f in faces do
				{
					var list = [];
					for var i in f.points do list.push(points2d[i]);
					var v0 = [list[1][0] - list[0][0], list[1][1] - list[0][1]];
					var v1 = [list[2][0] - list[1][0], list[2][1] - list[1][1]];
					var det = v0[0] * v1[1] - v0[1] * v1[0];
					if det <= 0 then continue;
					use namespace canvas;
					setFillColor(f.color[0], f.color[1], f.color[2]);
					frameArea(list);
				}
			}

			draw(0, 0);

			function onMouseMove(event)
			{
				use namespace canvas;
				setFillColor(1, 1, 1);
				clear();
				draw(width() / 2 - event.x / 100, event.y / 100 - height() / 2);
			}

			alert("Move the mouse over the canvas!");
			setEventHandler("canvas.mousemove", onMouseMove);
			enterEventMode();
		</tscript>
	`,
			children: [],
		},
	],
};
