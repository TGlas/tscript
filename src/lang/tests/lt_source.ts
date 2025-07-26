/* Lattice Craft License:
MIT License

Copyright (c) 2020 Manuel Fischer

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

export const lt_source = String.raw`
#[file] main.tscript
###
##
##  latticecraft, written by Manuel Fischer
##
##  note that lines introduced with #[file] refer to a section in a file
##  this allows the whole file to be split into separate files, these
##  files are not nessecarily independent
##
 ###

# functions prefixed with ref return an array of two elements - these are used as references,
# the first is a container(array, dictionary),
# the second is an index/key into the container
#
# TODO empty chunks (only consisting of air) should be stored as >null< and rendered by simply filling the chunk with the air color
# TODO settings
#     - if to store unchanged chunks (those chunks might be different in future versions
#     - if to use RLE compression, (worlds loaded are always loaded with RLE, uncompressed files are by design loadable with RLE)
# TODO tags for blocks like: solid, replaceableByTree, minableByHand, etc...

namespace settings
{
	var storeChangedChunksOnly = true;
}

namespace forceSettings
{
	var dispScale = null; # set to integer
}

var showChunkBorders = false;
var debug = true;
var debugRender = false;
var debugTick = false;
var debChunkGen = false;
var randomTickSpeed = 2; #8
var randomTickRadius = 20; #12

var dynUpdateTime = 1e1000*1000;
# var dynUpdateTime = 0;
var dynScroll = false; # non integral block scrolling

var noBevels = false;

function printHelp()
{
	print(
		"\n"
		"Press short to place blocks, press half a second to destroy blocks\n"
		"You can drag the mouse to destroy/place multiple blocks\n"
		"Press [+] to zoom in, press [-] to zoom out\n"
		"Use [W] [A] [S] [D] to move the player, use arrows to move the camera\n"
		"[E] inventory, [O] settings, [Esc] game menu (load/save worlds)\n"
		"\n"
		"Note that the canvas window needs to be focused"
	);
}

function renderCredits()
{
	var cx = canvas.width() // 2;
	var s = canvas.height() // 10;
	var l = canvas.width() // 8;
	canvas.setFillColor(0.1, 0.4, 0.8);
	canvas.clear();
	
	canvas.setFillColor(1, 1, 1);
	
	canvas.setTextAlign("left");
	# the windows font used in the recent BSOD, otherwise helvetica
	canvas.setFont("Segoe UI,helvetica", s*3.5);
	canvas.text(l-0.25*s, 2*s, ":)");
	
	canvas.setFont("Segoe UI Light,helvetica", s);
	canvas.text(l-0.05*s, 6*s, "LatticeCraft");

	canvas.setFont("Segoe UI,helvetica", s/2);
	canvas.text(l, 7.25*s, "by Manuel Fischer");
}



#[file] util.tscript

namespace util
{
	function arrayConcat(a)
	{
		var r = [];
		for var e in a do r = Array.concat(r, e);
		return r;
	}
	
	function find(a, element)
	{
		for var i in a.keys() do if a[i] == element then return i;
		return null;
	}
	
	function toLowerChar(char)
	{
		#           A              Z
		if char >= 65 and char <= 90 then return char or 32;
		return char;
	}

	function quotedString(string)
	{
		var str = "\"";
		for var c in string.split("") do
		{
			if c == "\"" or c == "\\" then str += "\\";
			str += c;
		}
		return str + "\"";
	}

	function jsonToString(json)
	{
		if (Type(json) == Array) then
		{
			var s = "[";
			for var value in json do s += jsonToString(value) + ",";
			if json.size() != 0 then s = s[0:s.size()-1];
			s += "]";
			return s;
		}
		else if (Type(json) == Dictionary) then
		{
			var s = "{";
			for var key in json.keys() do 
				s += quotedString(key) + ":" + jsonToString(json[key]) + ",";
			if json.size() != 0 then s = s[0:s.size()-1];
			s += "}";
			return s;
		}
		else if (Type(json) == String) then
		{
			return quotedString(json);	
		}
		else return String(json);
	}

	function parseInteger(str)
	{
		if str[0] == "-"[0] then
			return -Integer(str[1:str.size()]);
		else
			return Integer(str);
	}

	function splitPos(str)
	{
		var comma = find(str.split(""), ",");
		return [parseInteger(str[0:comma]), parseInteger(str[comma+1:str.size()])];
	}
}
# namespace util







#[file] canvasUtil.tscript

namespace canvasUtil
{
	function setFillColor(vec)
	{
		if vec.size() == 3
		then canvas.setFillColor(vec[0], vec[1], vec[2]);
		else canvas.setFillColor(vec[0], vec[1], vec[2], vec[3]);
	}
	
	var highlightColor = [1, 1, 1, 1];
	var shadowColor	   = [0, 0, 0, 0.25];
	

	function bevel0(x, y, w, h)
	{		
		var ww = w-0.0625;
		var hh = h-0.125;
		var yy = y+0.0625;
		canvas.setFillColor(1, 1, 1, 0.40);
		canvas.fillRect(x, y, ww, 0.0625);
		canvas.fillRect(x, yy, 0.0625, hh);

		canvas.setFillColor(0, 0, 0, 0.15);
		canvas.fillRect(x+0.0625, y+h-0.0625, ww, 0.0625);
		canvas.fillRect(x+ww, yy, 0.0625, hh);
	}
	
	function bevel0011_0()
	{		
		canvas.setFillColor(1, 1, 1, 0.40);
		canvas.fillRect(0,    0, 15/16,  1/16);
		canvas.fillRect(0, 1/16,  1/16, 14/16);

		canvas.setFillColor(0, 0, 0, 0.15);
		canvas.fillRect( 1/16, 15/16, 15/16,  1/16);
		canvas.fillRect(15/16,  1/16,  1/16, 14/16);
	}
	
	function compBevel(compLight, compDark, x, y, w, h)
	{		
		if noBevels then return;
		var ww = w-0.0625;
		var hh = h-0.125;
		var xx = x+0.0625;
		var yy = y+0.0625;
		var rr = x+ww;
		var bb = y+h-0.0625;
		
		compLight.push(function[x, y, ww, hh, yy]() {
			canvas.fillRect(x, y, ww, 0.0625);
			canvas.fillRect(x, yy, 0.0625, hh);
		});

		compDark.push(function[x, y, ww, hh, xx, yy, rr, bb]() {
			canvas.fillRect(xx, bb, ww, 0.0625);
			canvas.fillRect(rr, yy, 0.0625, hh);
		});
	}

	function bevel1(x, y, w, h, r=0, lt=0, rb=0) {}
	
	var bevel = bevel0, bevel0011 = bevel0011_0;
	if noBevels then {
		bevel = bevel1;
		bevel0011 = function() {};
	}
	
}
# namespace canvasUtil

	
	
	
	
	
	
	
#[file] texture.tscript
#*
 *  Used to compile textures into an array like form
 *  All functions work similar to the canvas namespace
 *  When a texture is created with this, the resulting
 *  object is a function that behaves like the original
 *  texture function, except it might be faster
 *#
class TextureCanvas {}
class TextureCompileCanvas : TextureCanvas
{
public:
	# clear background/draw background tile
	# should be done if the texture has transparent regions
	# that is when the texture does not fill up the whole block
	function clear()
	{
	}
	
	function scale()
	{
	}
	
	function setFillColor(r, g, b, a=1)
	{
	}
	function setFillColorV(arr)
	{
	}
	
	function fillRect(x, y, w, h)
	{
	}
}



namespace textureState
{
	var renderSky = true;	
}

function divideElements(arr, val)
{
	var ret = [];
	for	var e in arr do
	{
		if Type(e) == Array then ret.push(divideElements(e, val));
		else ret.push(e/val);
	}
	return ret;
}

namespace texture
{
	
	function sky()
	{
		if textureState.renderSky then {
			canvas.setFillColor(0.5, 0.75, 1);
			canvas.fillRect(0, 0, 1, 1);
		}
	}
	
	function solid(color)
	{
		return function[color]()
		{
			canvasUtil.setFillColor(color);
			canvas.fillRect(0, 0, 1, 1);
		};
	}
	
	function solidBevel(color)
	{
		return function[color]()
		{
			canvasUtil.setFillColor(color);
			canvas.fillRect(0, 0, 1, 1);
			canvasUtil.bevel0011();
		};
	}
	
	function bevel(background)
	{
		return function[background]()
		{
			background();
			canvasUtil.bevel0011();
		};
	}
	
	
	#*function solidBevelGrown(color, grownColor)
	{		
		return function[color, grownColor]()
		{
			canvasUtil.setFillColor(color);
			canvas.fillRect(0, 0, 1, 1);
			
			canvasUtil.setFillColor(grownColor);
			canvas.fillRect(0, 0, 1, 0.25);
			canvas.setFillColor(0, 0, 0, 0.25);
			canvas.fillRect(1/16, 3/16, 14/16, 1/16);
			
			canvasUtil.bevel0011();
		};
	}*#
	
	function bevelBlocks(blocks, background, lighten=0.40, darken=0.15)
	{		
		var bevelLightComp = [];
		var bevelDarkComp = [];
		for var b in blocks do
		{
			var x0 = b[0]/16, y0 = b[1]/16, x1 = b[2]/16, y1 = b[3]/16;
			canvasUtil.compBevel(bevelLightComp, bevelDarkComp, x0, y0, x1, y1);
		}
		var comp = util.arrayConcat([
			[background],
			[function[lighten]() { canvas.setFillColor(1, 1, 1, lighten); }],
			bevelLightComp,
			[function[darken]() { canvas.setFillColor(0, 0, 0, darken); }],
			bevelDarkComp,
		]);
		
		return function[comp]()
		{
			for var i in comp do i();
		};
	}
	
	function fillBlocks(color, blocks, background)
	{
		var fillComp = [];
		for var b in blocks do
		{
			var x0 = b[0]/16, y0 = b[1]/16, x1 = b[2]/16, y1 = b[3]/16;
			fillComp.push(function[x0, y0, x1, y1]() { canvas.fillRect(x0, y0, x1, y1); });
		}
		
		return function[color, fillComp, background]()
		{
			background();
			
			canvasUtil.setFillColor(color);
			for var i in fillComp do i();
		};
	}
	
	function blocks(color, blocks, background)
	{
		var fillComp = [];
		var bevelLightComp = [];
		var bevelDarkComp = [];
		for var b in blocks do
		{
			var x0 = b[0]/16, y0 = b[1]/16, x1 = b[2]/16, y1 = b[3]/16;
			fillComp.push(function[x0, y0, x1, y1]() { canvas.fillRect(x0, y0, x1, y1); });
			canvasUtil.compBevel(bevelLightComp, bevelDarkComp, x0, y0, x1, y1);
		}
		var comp = util.arrayConcat([
			fillComp,
			[function() { canvas.setFillColor(1, 1, 1, 0.40); }],
			bevelLightComp,
			[function() { canvas.setFillColor(0, 0, 0, 0.15); }],
			bevelDarkComp,
		]);
		
		return function[color, comp, background]()
		{
			background();
			
			canvasUtil.setFillColor(color);
			for var i in comp do i();
		};
	}
	
	
	function planks(color)
	{
		var blocks = [
			[ 0,  0, 16,  4],
			[ 0,  4,  8,  4], [ 8,  4,  8,  4],
			[ 0,  8, 16,  4],
			[ 0, 12,  8,  4], [ 8, 12,  8,  4],
		];
		
		return bevelBlocks(blocks, solid(color));
	}
	
	function log(color)
	{
		var l = [
			[ 0,  0,  1, 16],
			
			[ 5,  4,  1,  7],
			[ 9,  2,  1,  9],
			[13, 12,  1,  4],
			
			[14,  0,  1, 16],
		];
		
		var d = [
			[ 2,  1,  1,  6],
			[ 6,  7,  1,  8],
			[11,  3,  1,  7],
			
			[15,  0,  1, 16],
		];
		
		return fillBlocks([0, 0, 0, 0.4], d, fillBlocks([0, 0, 0, 0.2], l, solid(color)));
	}
	
	
	function leaves(color, background)
	{
		var leaveBlocks = [
			[ 0,  0,  3,  5], [ 3,  2,  3,  4], [ 9,  0,  4,  5],
			[ 2,  6,  3,  5], [ 5,  8,  5,  4], [11,  7,  5,  3],
			[ 1, 11,  5,  4], [ 7, 13,  5,  3], [13, 11,  3,  5]
		];
		
		return blocks(color, leaveBlocks, background);
	}
	
	function sapling(stem, leaves, background)
	{
		var leaveBlocks = [
			                  [ 3,  2,  3,  4], [ 9,  0,  4,  5],
							  [ 6,  5,  6,  3],
			[ 2,  6,  3,  5], [ 5,  8,  5,  4], [11,  7,  5,  3],
		];
		
		var stemBlocks = [
			[7, 10, 3, 6],
		];
		
		var stemTex = blocks(stem, stemBlocks, background);
		
		return blocks(leaves, leaveBlocks, stemTex);
	}
	
	
	function glass(background)
	{
		var blocks = [
			[ 0,  0, 16, 16],
			[ 2,  2, 12, 12],
		];
		return bevelBlocks(blocks, background);
	}
	
	
	function bricks(groutColor, brickColor)
	{
		
		var blocks = [
			        [0, 0, 7, 3], [8, 0, 7, 3],
			[0, 4, 3, 3], [4, 4, 7, 3], [12, 4, 4, 3],
			        [0, 8, 7, 3], [8, 8, 7, 3],
			[0, 12, 3, 3], [4, 12, 7, 3], [12, 12, 4, 3],
		];
		
		var bb = divideElements(blocks, 16);
		#for var b in blocks do bb.push(b[0]/32, b[1]/32, b[2]/32, b[3]/32);
		
		return function[groutColor, brickColor, bb]()
		{
			canvasUtil.setFillColor(groutColor);
			canvas.fillRect(0, 0, 1, 1);
			
			canvasUtil.setFillColor(brickColor);
			for var b in bb do
			{
				canvas.fillRect(b[0], b[1], b[2], b[3]);
			}
		};
		
	}
	
	function ore(color, background)
	{
		var oreBlocks = [
			[ 8,  2,  4,  5], 
			[ 2,  7,  4,  4],
		    [ 9, 10,  5,  4]
		];

		return blocks(color, oreBlocks, background);
	}
	
	function craftingTable(color, background)
	{
		var tableBlocks = [
			        [0, 0, 16, 4],
			[0, 4, 4, 12], [12, 4, 4, 12]
		];
		
		return blocks(color, tableBlocks, background);
	}
	
	function chest(color)
	{
		var woodenBlocks = [
			               [0, 0, 16, 4],
			[0, 4, 2, 12], [2, 4, 12, 12], [14, 4, 2, 12]
		];
		
		var knob = [
			[7, 2, 2, 5]	
		];
		
		var wooden = bevelBlocks(woodenBlocks, solid(color));
		return blocks([0.3, 0.3, 0.3], knob, wooden);
	}
	
	function cobblestone(color)
	{
		var blocks = [
			[1, 1, 5, 4],
			
			[7, 2, 5, 5],
			
			[12, 0, 4, 5],
			
			
			[2, 6, 5, 4],
			
			#[7, 8, 3, 3],
			
			[7, 8, 4, 4],
			
			
			[11, 8, 5, 4],
			
			
			[3, 11, 5, 4],
			
			[9, 13, 5, 3],
			
			
			
			[0, 10, 3, 5]
		];
		
		var d = [
			[3, 15, 5, 1],
			
			[1, 5, 5, 1],
			
			[12, 5, 4, 1],
			
			[2, 10, 5, 1],
			
			[11, 12, 5, 1],
			
			[7, 7, 5, 1],
			
			
			
			#[7, 1, 3, 1],
			
			
			#[1, 8, 4, 6],
			#[7, 7, 2, 7],
			#[11, 10, 2, 4],
		];
		var col = [0, 0, 0, 0.2];
		return fillBlocks(col, d, bevelBlocks(blocks, solid(color), darken = 0.1));
		
		#*
		# light blocks
		var l = [
			[1, 1, 4, 1],
			[1, 1, 1, 3],
			
			[7, 2, 5, 1],
			[7, 2, 1, 5],
			
			[13, 0, 3, 1],
			[13, 0, 1, 5],
			
			
			[2, 6, 3, 1],
			[2, 6, 1, 5],
			
			[11, 8, 5, 1],
			[11, 8, 1, 4],
			
			
			[3, 12, 5, 1],
			[3, 12, 1, 4],
			
			[9, 13, 5, 1],
			[9, 13, 1, 3],
		];
		
		# dark blocks
		var d = [
			[3, 3, 2, 1],
			
			[7, 2, 5, 1],
			[7, 2, 1, 5],
			
			[13, 0, 3, 1],
			[13, 0, 1, 5],
			
			
			[2, 6, 3, 1],
			[2, 6, 1, 5],
			
			[11, 8, 5, 1],
			[11, 8, 1, 4],
			
			
			[3, 12, 5, 1],
			[3, 12, 1, 4],
			
			[9, 13, 5, 1],
			[9, 13, 1, 3],
		];
		return fillBlocks([0, 0, 0, 0.1], d, fillBlocks([1, 1, 1, 0.2], l, solid(color)));*#
	}
	
	function stone(color)
	{
		#return cobblestone(color);
		# light blocks
		var l = [
			[2, 1, 9, 1],
			[5, 7, 11, 1],
			[0, 11, 7, 1], [13, 11, 3, 1],
			[7, 15, 5, 1],
			
			#[2, 2, 9, 1],
		];
		
		# dark blocks
		var d = [
			[9, 0, 4, 1],
			[5, 3, 9, 1],
			[0, 5, 3, 1], [12, 5, 4, 1],
			[2, 9, 10, 1],
			[1, 13, 13, 1],
			
			#[0, 6, 10, 2],
		];
		return fillBlocks([0, 0, 0, 0.1], d, fillBlocks([1, 1, 1, 0.2], l, solid(color)));
	}
	
	function dirt(color)
	{
		# light blocks
		var l = [
			[2, 1, 3, 1],
			[5, 7, 2, 1],
			[13, 10, 3, 1],
			[13, 11, 1, 2],
			[9, 15, 2, 1]
			
			#[2, 2, 9, 1],
		];
		
		# dark blocks
		var d = [
			[11, 0, 1, 2],
			[5, 3, 3, 1],
			[0, 5, 2, 1],
			[7, 8, 1, 2],
			[2, 13, 3, 1],
			
			#[0, 6, 10, 2],
		];
		return fillBlocks([0, 0, 0, 0.1], d, fillBlocks([1, 1, 1, 0.2], l, solid(color)));
	}
	
	function grown(color, background)
	{
		return function[color, background]()
		{
			background();
			
			canvasUtil.setFillColor(color);
			canvas.fillRect(0, 0, 1, 4/16);
			
			canvas.setFillColor(0, 0, 0, 0.2);
			canvas.fillRect(0, 3/16, 1, 1/16);
			
			canvas.setFillColor(0, 0, 0, 0.1);
			canvas.fillRect(3/16, 2/16, 1/16, 2/16);
			canvas.fillRect(7/16, 1/16, 1/16, 3/16);
			canvas.fillRect(9/16, 2/16, 1/16, 2/16);
			
			canvas.setFillColor(1, 1, 1, 0.2);
			canvas.fillRect(13/16, 0/16, 1/16, 2/16);
		};
	}
	
	
	function furnace(background)
	{
		# TODO
		;
	}
}
# namespace texture


#[file] mod.tscript#textures
namespace mod
{
	# add your texture functions here
}

#[file] generation.tscript
namespace generation
{
	class Placer
	{
	protected:
		var off_x, off_y;
	public:
		constructor(off_x, off_y)
		{
			this.off_x = off_x;
			this.off_y = off_y;
		}
		
		function copy() {}
		
		function shift(x, y) {
			off_x += x;
			off_y += y;
			return this;
		}
		
		function setBlock(x, y, block) {}
	}

	class ChunkPlacer : Placer
	{
	private:
		var chunk;
	public:
		constructor(chunk, off_x, off_y): super(off_x, off_y)
		{
			this.chunk = chunk;
		}
		
		function copy() {
			return ChunkPlacer(chunk, off_x, off_y);
		}
		
		function setBlock(x, y, block)
		{
			var xx = x+off_x;
			var yy = y+off_y;
			if xx and not 15 then return; #if xx < 0 or xx >= 16
			if yy and not 15 then return; #if yy < 0 or yy >= 16
			
			chunk.blocks[xx + 16*yy] = block;
		}
	}
	
	class WorldPlacer : Placer
	{
	private:
		var world;
	public:
		constructor(world, off_x, off_y): super(off_x, off_y)
		{
			this.world = world;
		}
		
		function copy() {
			return WorldPlacer(world, off_x, off_y);
		}
		
		function setBlock(x, y, block)
		{
			var xx = x+off_x;
			var yy = y+off_y;
			world.setBlock(xx, yy, block);
		}
	}


	function addStructure(structureFunc)
	{
		# TODO
	}
}
#[file] world.tscript#fwd

namespace theWorldCB
{
	var isDirtyCB; # world coords
	var markDirtyCB;
	var unmarkEntityDirtyCB;
}
var theWorld;
var thePlayer;

#[file] entities.tscript#behavior
namespace entityBehavior
{
	var collisionBehavior = {};
	
	function registerCollision(a, b, f)
	{
		assert(Type(a) == Type);
		assert(Type(b) == Type);
		assert(Type(f) == Function);
		collisionBehavior[a+","+b] = f;
	}
	
	function onEntityCollision(a, b)
	{
		var eventsignature = Type(a)+","+Type(b);
		if collisionBehavior.has(eventsignature) then
			collisionBehavior[eventsignature](a, b);
	}
}





#[file] block.tscript
class Block
{
public:
	static var registry = {};
	static var allTags = {};
	
	
	var char; # set by register

	var texture; # function()
	var render; # function()
	var drop;
	var dropChance;
	var tags; # block tags, that are boolean properties -> resulting in sets of blocks
			  # only true tags are kept, so that it results in a Dictionary that maps strings to true
			  # commonly used tags:
			  # - "solid": blocks where entities cannot walk/fall through
			  
	# these properties can be changed after the Block-object has been created
	# until the game has started up
	var tick; # function(x, y)
	var place; # function(x, y) -> Boolean
	var update; # function(x, y) or null
	var onClick; # function(x, y)
	var blockDataHandler; # like inventories for chests
	
	function renderItem()
	{ 
		textureState.renderSky = false;
		render();
		textureState.renderSky = true;
	}
	
	constructor(
		char_id,
		texture, 
		drop = true,
		dropChance = 1.0,
		tags = {solid: true}, # should be a Dictionary that maps to boolean values, or an array of strings
		tick=null,
		place=null,
		update=null,
		onClick=null,
		blockDataHandler=null
	) {
		this.register(char_id);
		
		this.render = texture;
		this.texture = texture;
		
		if drop == false then		this.drop = null;
		else if drop == true then	this.drop = this;
		else						this.drop = drop;
		
		this.dropChance = dropChance;
		
		this.registerTags(tags);
		
		if tick == null then
			this.tick = function(x, y) {};
		else
			this.tick = tick;
			
		if place == null then
			this.place = function[thisBlock = this](x, y) {
				theWorld.setBlockUpdate(x, y, thisBlock);
				return true;
			};
		else
			this.place = place;
			
		this.update=update;
		
		if onClick == null then
			this.onClick = function(x, y) {};
		else
			this.onClick = onClick;
			
		this.blockDataHandler = blockDataHandler;
	}

	function register(char_id)
	{
		if registry.has(char_id) then error("Character '" + char_id + "' already used");
		if this.char != null then error("Block already mapped to character");
		if char_id.size() != 1 then error("Block character should be of size 1");
		if "0" <= char_id and char_id <= "9" then error("Characters 0-9 reserved for numeric data"); # RLE and slot size in the inventory
		
		this.char = char_id;
		registry[char_id] = this;
		return this;
	}
	
	function addTag(tag)
	{
		this.tags[tag] = true;
		if allTags.has(tag) then
		{
			allTags[tag].push(this);
		}
		else
		{
			allTags[tag] = [this];
		}	
	}
	
	function registerTags(tags)
	{
		this.tags = {};
		if Type(tags) == Dictionary then
		{
			for var tag in tags.keys() do
			{
				if tags[tag] then addTag(tag);
			}
		}
		else if Type(tags) == Array then
		{
			for var tag in tags do
			{
				addTag(tag);
			}
		}
		else error("The tags parameter should be a Dictionary to Booleans or an Array of Strings");
	}
}
# class Block







#[file] vanilla.tscript#blocks
# TODO cleanup and move texture section into this file
namespace vanilla
{
	namespace colors
	{
		var logColor =     [0.5, 0.2, 0.1]; #[0.6, 0.3, 0.2]; #[0.7, 0.5, 0.1];
		var dryDirtColor = [0.7, 0.5, 0.3];
		var nrmDirtColor = [0.6, 0.4, 0.25];
		var wetDirtColor = [0.5, 0.3, 0.2];
	}
	use namespace colors;
	
	var AIR = Block(" ", texture.sky, drop=false, tags={solid:false});
	
	var COBBLE_STONE = Block("p", texture.cobblestone([0.6, 0.6, 0.6]));
	var STONE = Block("s", texture.stone([0.6, 0.6, 0.6]), drop=COBBLE_STONE);
	
	var DIRT  = Block("d", texture.dirt(dryDirtColor));
	var GRASS = Block("g", texture.grown([0.2, 0.7, 0.3], DIRT.texture), drop=DIRT);
	
	var PLANKS     = Block("w", texture.planks([0.8, 0.7, 0.5]));
	var LOG        = Block("W", texture.log(logColor), tags={solid:false});
	var SAPLING    = Block("t", texture.sapling(logColor, [0.2, 0.7, 0.3], AIR.texture), tags={solid:false});
	var LEAVES     = Block("l", texture.leaves([0.2, 0.7, 0.3], AIR.texture), SAPLING, 0.25, tags={solid:false});
	var LOG_LEAVES = Block("L", texture.leaves([0.2, 0.7, 0.3], LOG.texture), LOG, tags={solid:false});
	
	var CRAFTING_TABLE = Block("T", 
		texture=texture.craftingTable([0.8, 0.7, 0.5], AIR.texture),
		tags={solid:false}
	);
	var CHEST = Block("C", 
		texture=texture.chest([0.8, 0.7, 0.5]),
		tags={solid:false}
	);
	
	
	var GLASS = Block("_", texture.glass(AIR.texture));
	
	var BRICKS = Block("#", texture.bricks([1.0, 0.9, 0.8], [0.8, 0.1, 0.2]));
	
	
	var COAL_ORE = Block("c", texture.ore([0.1, 0.1, 0.1], STONE.texture));
	
	var SAND = Block("S", texture.solid([0.9, 0.8, 0.5]));
	var WATER = Block("~", texture.solid([0.1, 0.2, 0.9]), tags={solid:false});
	
	
	function isSoil(b) {
		return b == DIRT or b == GRASS;
	}
}
# namespace blocks









#[file] mod.tscript#blocks
namespace mod
{
	# add your block definitions here
}


#[file] random.tscript

namespace random
{
	class XorShift	
	{
		# SEE https://en.wikipedia.org/wiki/Xorshift
	public:
		var a;
		
		constructor(a)
		{
			if Type(a) != Integer then error("Expected integral seed");
			this.a = a;
		}
		
		function random32()
		{
			# Algorithm "xor" from p. 4 of Marsaglia, "Xorshift RNGs"
			a = a xor a  * 2^13;
			a = a xor a // 2^17;
			a = a xor a  * 2^5;
			return a;
		}
		
		function random()
		{
			return random32() / 2.0^32 + 0.5;
		}
	}
}
# namespace random








#[file] control.tscript#fwd

var mouseX, mouseY, mouseInside = false;
var selX, selY;

var pressedKeys = {
	"w": false,
	"a": false, "d": false,
};





#[file] geometry.tscrip
namespace geometry
{
	function boxesIntersecting(a, b)
	{
		return a[0] < b[2] and a[2] > b[0]
						   and
			   a[1] < b[3] and a[3] > b[1];
	}
}





#[file] world.tscript#main
namespace world
# TODO remove world namespace, move everything into world class
{
	namespace chunkUtil
	{
		function forEachBlock(chunk, x0, y0, x1, y1, xOff, yOff, func, shift)
		{
			shift(x0, y0);
			var stride = 16 + x0 - x1;
			var xback = -16+stride;
			var i = x0 + 16*y0;
			var rx = x0+xOff:x1+xOff, ry = y0+yOff:y1+yOff;
			for var y in ry do
			{
				for var x in rx	do
				{
					func(chunk[i], x, y);
					i += 1;
					shift(1, 0);
				}
				i += stride;
				shift(xback, 1);
			}
			shift(-x0, -y1);
		}
		
		
		function hasChanged(world, x, y, chunk)
		{
			# more like a hack, regenerate chunk and check if different
			var c = world.chunkGenerator.generateChunk(x, y);
			return c.blocks != chunk.blocks;
		}
	}
	
	# TODO make world specific
	#*namespace worldUtil
	{
		function hasSolidBlock(rx, ry)
		{
			for var y in ry do
			for var x in rx do
				if theWorld.getBlock(x, y).solid then return true;
				
			return false;
		}
	}*#
}


# TODO move to chunks

namespace world
{

	class Chunk
	{
	public:
		var blocks;
		var data;
		
		constructor(block_or_blocks)
		{
			if Type(block_or_blocks) == Array then blocks = block_or_blocks;
			else blocks = Array(16*16, block_or_blocks);
			
			data = {};
		}
	}

	namespace generators
	{
		# simple chunk generator, that generates air above y=0 (for y<0)
		# otherwise stone
		class BaseChunkGenerator
		{
		public:
			var seed;
			
			constructor(seed) { this.seed = seed; }
			
			function chunkRandom(cx, cy, param=0)
			{	
				var r = seed + 10111*cx + 10427*cy + 574893*param;
				r = r xor 123456789;
				if r == 0 then r = seed*123;
				return random.XorShift(r);
			}

			function generateChunk(x, y) {					
				var block = vanilla.AIR;
				if y >= 0 then block = vanilla.STONE;
				return Chunk(block);
			}
		}
		
		class Landscape : BaseChunkGenerator
		{
		public:
			constructor(seed) : super(seed) {}
			
			function generateChunk(x, y)
			{
				var chunk = super.generateChunk(x, y);
				var chunkData = chunk.blocks;
				# change chunk contents
				
				#if debChunkGen then print("generateChunk("+x+", "+y+") x="+x*16+", y="+y*16);
				
				var rng  = chunkRandom(x,   y, 0);
				var rngR = chunkRandom(x+1, y, 0); 
				
				# generate terrain
				
				if y == -1 then # TODO trees
				{	
					var r0 = rng.random();
					var r1 = rngR.random();
					
					var rr = Array(17, 0);
					rr[0] = r0; rr[16] = r1;
					
					# Populates array recursively
					var populate = function[rr, rng](a, b, mul)
					{
						var h = (a+b) // 2;
						if b - a == 2 then
						{
							rr[h] = (rr[a] + rr[b]) /2;
						}
						else
						{
							var h = (a+b) // 2;
							var m = (h/16)*(1-mul) + (rng.random())*mul;
							rr[h] = math.min(rr[a]*(1-m) + rr[b]*m + rng.random()*mul*0.2, 1);

							this(a, h, mul*0.85); this(h, b, mul*0.85);
						}
					};
					populate(0, 16, 0.75);
					
					for x in 0:16 do
					{
						var yy = Integer(rr[x]*15);
						var b = vanilla.GRASS;
						for y in yy:16 do
						{
							chunkData[x + y*16] = b;
							b = vanilla.DIRT;
							if rng.random() < (2*y-yy)/(16+8) then
								b = vanilla.STONE;
						}
					}
				}
				
				return chunk;
			}
		}
	
		# adds plants and ores to the landscape
		class PopulatedLandscape : Landscape
		{
		public:
			constructor(seed) : super(seed) {}
			function generateChunk(x, y)
			{
				var chunk = super.generateChunk(x, y);
				var chunkData = chunk.blocks;
				
				# change chunk contents
				var rng  = chunkRandom(x,   y, 1);
				if y >= 0 then
				{
					if y % 5 == 1 then
						for y in  1: 3 do
						for x in  0:16 do
							chunkData[x + y*16] = vanilla.COAL_ORE;

					var yy = y % 3 + 3;
					for y in  0:16 do
					for x in  0:16 do
					{
						var chance = (y % yy) * (0.7/4) + 0.01;
						if rng.random() < chance then chunkData[x + y*16] = vanilla.COAL_ORE;
					}
				}
				else if y == -1 then
				{
					for var i in 0:Integer(rng.random()*12) do
					{
						var x = Integer(rng.random() * 16);
						for var y in 0:15 do
						{
							var curblock = chunkData[x + y*16];
							if curblock == vanilla.GRASS then if y >= 1 then
							{
								var yi = y-1;
								
								chunkData[x + yi*16] = vanilla.SAPLING;

								if rng.random() < 0.9 then do
								{
									yi -= 1; if yi < 0 then break;
									chunkData[x + yi*16] = vanilla.LEAVES;
								}
								while rng.random() < 0.3;
								break;
							}
							
							if curblock != vanilla.AIR then break;
						}
					}
				}
				return chunk;
			}
		}
	}

	# BaseWorld, only implements the base data structure
	class BaseWorld
	{
	public:
		var chunkGenerator;
		var chunks;
		var lastChunkX, lastChunkY, lastChunk;
		var entities; # move to chunks, also contains players
		var players; # do not move to chunks
		#var onBlockChanged;# callback function(x, y)
		
		constructor(chunkGenerator, chunks) {
			this.chunkGenerator = chunkGenerator; this.chunks = chunks;
			#this.onBlockChanged = function(x, y) {};
			this.entities = [];
			this.players = [];
		}
		
		function getChunk(cx, cy)
		{	
			if lastChunkX == cx and lastChunkY == cy then return lastChunk;
		
			lastChunkX = cx; lastChunkY = cy;
			
			var chunkid = cx + "," + cy;
			if chunks.has(chunkid) then
				lastChunk = chunks[chunkid];
			else
			{
				lastChunk = chunkGenerator.generateChunk(cx, cy);
				chunks[chunkid] = lastChunk;
			}
			return lastChunk;
		}
		
		function setBlock(x, y, block)
		{
			var chunk = getChunk(x // 16, y // 16);
			var index = (x%16)+16*(y%16);
			var sIndex = String(index);
			if chunk.data.has(sIndex) then
			{
				# cleanup / drop contained inventory etc...
				chunk.data.remove(sIndex);
			}
			chunk.blocks[index] = block;
			if block.blockDataHandler != null then
			{
				chunk.data[sIndex] = block.blockDataHandler.createBlockData();
			}
			theWorldCB.markDirtyCB(x, y);
		}
		
		function getBlock(x, y)
		{
			return getChunk(x // 16, y // 16).blocks[(x%16)+16*(y%16)];
		}
		
		function getBlockData(x, y)
		{
			return getChunk(x // 16, y // 16).data[String((x%16)+16*(y%16))];
		}
		
	}
	# class BaseWorld
	
	
	# class that implements behavior ontop of the BaseWorld class
	class World : BaseWorld
	{
	public:
		var blockUpdates = {};

		constructor(chunkGenerator, chunks): super(chunkGenerator, chunks) {}
	
		function update(x, y)
		{
			var blockUpdate = getBlock(x, y).update;
			if blockUpdate != null then
				blockUpdates[x+","+y] = function[blockUpdate, x, y]() { blockUpdate(x, y); };
			else
				blockUpdates.remove(x+","+y);
		}
		function updateNeighbors(x, y)
		{
			#*           *# update(x, y-1);
			update(x-1, y);	update(x, y+0); update(x+1, y);
			#*           *# update(x, y+1);	
		}
		
		function setBlockUpdate(x, y, block)
		{
			setBlock(x, y, block);
			updateNeighbors(x, y);	
		}
		
		function hasTaggedBlocks(rx, ry, tagName)
		{
			for var y in ry do
			for var x in rx do
				if getBlock(x, y).tags.has(tagName) then return true;
				
			return false;
		}
		
		function tick()
		{
			# random block ticks
			#var tickRadius = 20;
			# Update blocks around each player
			for var player in players do
			for var i in 0:randomTickSpeed do
			{
				var rx = Integer(math.random()*(2*randomTickRadius+1) - randomTickRadius);
				var ry = Integer(math.random()*(2*randomTickRadius+1) - randomTickRadius);
				var x = Integer(player.x) + rx;
				var y = Integer(player.y) + ry;
				getBlock(x, y).tick(x, y);
				if debugRender and debugTick then
					theWorldCB.markDirtyCB(x, y); # just for visualizing
			}

			var bu = blockUpdates.values();
			blockUpdates = {};
			for var update in bu do update();

			for var e in entities do e.tick();

			var toKill = [];

			var sz = entities.size();
			for var i in 0:sz do
			for var j in i+1:sz do
			{
				var d = entities[i];
				var e = entities[j];

				if geometry.boxesIntersecting(d.getAbsBox(), e.getAbsBox()) then
				{
					entityBehavior.onEntityCollision(d, e);
					entityBehavior.onEntityCollision(e, d);
				}
			}


			# remove entities
			var toDelete = [];
			for var i in entities.keys() do 
			{
				var e = entities[i];
				if e.dead then
				{			
					e.markBackgroundDirty();
					theWorldCB.unmarkEntityDirtyCB(e);
					#entityDisp.unmarkDirty(e); # do not rerender this entity

					toDelete.push(i-toDelete.size());
				}
			}

			for var i in toDelete do
				entities.remove(i);
			# end remove entities
		}
	}
	# class World
	
	function randomWorld()
	{
		var seed = Integer(time()*123456789); # shouldn't be zero
		var chunkGenerator = world.generators.PopulatedLandscape(seed);
		return World(chunkGenerator, {});
	}
}







#[file] disp.tscript#fwd
namespace disp
{
	var dispScale;
	var dispX=0, dispY=0; # in blocks
	var dispCols=0, dispRows=0;
	var offX=0, offY=0;
	var offXD=0, offYD=0; # dynamic offset, fractional part of offset: [0, 1)

	# count of rows to init screen with
	var hh = 18; # 20;
}
# namespace disp


#[file] entities.tscript#disp

namespace entityDisp
{
	var dirty = {};
	
	function markDirty(e)
	{
		dirty[String(e.id)] = e;
	}
	
	function unmarkDirty(e)
	{
		dirty.remove(String(e.id));
	}
	theWorldCB.unmarkEntityDirtyCB = unmarkDirty;
	
	function markCompletelyDirty() {
		for var e in theWorld.entities do markDirty(e);
	}
	var markCompletelyDirtyScreen = markCompletelyDirty;
}
# namespace entityDisp






#[file] inventory.tscript#base
namespace inventory
{	
	var hotbarSize = 10;
	var backpackSize = 10*5;
	var inventorySize = hotbarSize + backpackSize;

	function makePlayerInventory()
	{
		return Array(inventorySize, null);
	}
	
	class ItemStack
	{
	public:
		var amount;
		var item;
		
		constructor(amount, item)
		{
			this.amount = amount;
			this.item   = item;
		}
		function copy()
		{
			return ItemStack(amount, item);	
		}
		
		function increase(amount=1)
		{	
			this.amount += amount;
			return false;
		}
		
		function decrease(amount=1)
		{
			assert(this.amount >= amount);
			this.amount -= amount;
			if this.amount > 0 then return false;
			return true;
		}
		
		# renders item but not amount
		function renderItem()
		{
			item.renderItem();
		}
		
	}
	
	namespace util {
		
		# returns [li, ti, ri, bi] -- the boundaries of occupied slots,
		# [li, ri)
		# [ti, bi)
		function occupiedRect(slots, xd, yd)
		{
			#assert(slots.size() == xd*yd, "slots should be array of length xd*yd");
		
			# 1. find out left most, top most, right most, bottom most filled slot
			var li = xd, ti = yd, ri = 0, bi = 0;
			var hasNonNull = false;

			var i = 0;
			for var y in 0:yd do
			for var x in 0:xd do
			{
				var slot = slots[i];

				if slot != null then
				{
					li = math.min(li, x);
					ti = math.min(ti, y);
					ri = math.max(ri, x);
					bi = math.max(bi, y);
					hasNonNull = true;
				}

				i += 1;
			}
			if hasNonNull then return [li, ti, ri+1, bi+1];
			return null;
		}
		
	}
	
}

#[file] recipes.tscript

namespace recipes
{
	# key: dimensions of recipe,  value: all recipes with that dimension
	var registeredRecipes = {};
	
	
	class Recipe
	{
	public:
		var result, predicates, consume;
	
		constructor(result, predicates, consume)
		{
			this.result = result; this.predicates = predicates;
			this.consume = consume;
		}
		
		function checkAt(slots, xd, yd, li, ti, ri, bi)
		{
			var ii = li + ti*xd;
			var stride = xd-ri+li;
			var pi = 0;
			for var y in ti:bi do
			{
				for var x in li:ri do
				{
					if not predicates[pi](slots[ii]) then return false;
					
					ii += 1;
					pi += 1;
				}
				ii += stride;
			}
			return true;
		}
		
		function consumeAt(slots, xd, yd, li, ti, ri, bi, onConsume)
		{
			var ii = li + ti*xd;
			var stride = xd-ri+li;
			var pi = 0;
			for var y in ti:bi do
			{
				for var x in li:ri do
				{
					if consume[pi] != 0 then
					{
						if slots[ii].decrease(consume[pi]) then
							slots[ii] = null;
							
						onConsume(ii);
					}
					
					ii += 1;
					pi += 1;
				}
				ii += stride;
			}
		}
	}
	
	# arrayPredicates is an one dimensional array of length x*y
	function registerImpl(itemStack, xd, yd, arrayPredicates, arrayConsume)
	{
		var dimensions = xd+"*"+yd;
		var arr = [];
		if registeredRecipes.has(dimensions) then
			arr = registeredRecipes[dimensions];
		else
			registeredRecipes[dimensions] = arr;
			
		arr.push(Recipe(itemStack, arrayPredicates, arrayConsume));
	}
	
	# pattern: array of strings, each string represents a line in the crafting table
	function registerRecipe(amount, item, pattern, map)
	{
		var yd = pattern.size();
		assert(yd > 0, "Recipe pattern should not be empty");
		var xd = pattern[0].size();
		assert(xd > 0, "Recipe pattern should not be empty");
		for var l in pattern do
			assert(l.size() == xd, "Lines in recipe pattern should be of equal length");
		
		var arrayPredicates = [];
		var arrayConsume = [];
		for var l in pattern do
		for var c in l.split("") do
		{
			var pred = function(stack) { return stack == null; };
			var consume = 0;
			if map.has(c) then
			{
				pred = function[item=map[c]](stack) {
					if stack != null then return stack.item == item;
					return false;
				};
				consume = 1;
			}
				
			arrayPredicates.push(pred);
			arrayConsume.push(consume);
		}	
		
		var itemStack = inventory.ItemStack(amount, item);
		
		
		registerImpl(itemStack, xd, yd, arrayPredicates, arrayConsume);
	}
	
	
	function getRecipe(slots, xd, yd)
	{
		use namespace inventory.util;
		
		var o = occupiedRect(slots, xd, yd);
		if o == null then return null;
		var li = o[0], ti = o[1], ri = o[2], bi = o[3];
		var rxd = ri-li, ryd = bi-ti;
		
		var dimensions = rxd+"*"+ryd;
		if not registeredRecipes.has(dimensions) then return null;
		
		var recipes = registeredRecipes[dimensions];
		
		for var r in recipes do
		{
			if r.checkAt(slots, xd, yd, li, ti, ri, bi) then
				return r;
		}
		return null;
	}
	
	# consumes items in the item slots of the crafting slots
	function consumeRecipe(slots, xd, yd, recipe, onConsume)
	{
		use namespace inventory.util;
		
		assert(recipe != null);
		var o = occupiedRect(slots, xd, yd);
		assert(o != null);
		
		recipe.consumeAt(slots, xd, yd, o[0], o[1], o[2], o[3], onConsume);
	}
	
	registerRecipe(4, vanilla.PLANKS,
		["X"],
		{X: vanilla.LOG}
	);
	
	registerRecipe(1, vanilla.CRAFTING_TABLE,
		["XX",
		 "XX"],
		{X: vanilla.PLANKS}
	);
	
	registerRecipe(1, vanilla.CHEST,
		["XXX",
		 "X X",
		 "XXX"],
		{X: vanilla.PLANKS}
	);
}




#[file] entities.tscript#main

namespace entities
{
	
	function markRegionDirty(x0, y0, x1, y1)
	{
		# TODO do screenspace rather than world space
		x0 = math.max(disp.offX, Integer( x0)); # round down
		y0 = math.max(disp.offY, Integer( y0)); # round down
		x1 = math.min(-Integer(-x1), disp.dispCols+disp.offX); # round up
		y1 = math.min(-Integer(-y1), disp.dispRows+disp.offY); # round up

		for var xx in x0:x1 do
		for var yy in y0:y1 do
		{
			theWorldCB.markDirtyCB(xx, yy);
		}
	}
	
	function isRegionDirty(x0, y0, x1, y1)
	{		
		# TODO do screenspace rather than world space
		x0 = math.max(disp.offX, Integer( x0)); # round down
		y0 = math.max(disp.offY, Integer( y0)); # round down
		x1 = math.min(-Integer(-x1), disp.dispCols+disp.offX); # round up
		y1 = math.min(-Integer(-y1), disp.dispRows+disp.offY); # round up

		for var xx in x0:x1 do
		for var yy in y0:y1 do
		{
			if theWorldCB.isDirtyCB(xx, yy) then return true;
		}
		return false;
	}
	
	class Entity
	{
	private:
		static var counter = 0;
	public:
		var id;
		var x, y; # Real, absolute position 
				  # TODO: relative position to chunk corner?
		var velY=0;
		
		var isOnGround = false; # set by tickPhysics
				  
		var bbox; # bounding box relative to x, y
		
		var dead = false; # set to true if entity should be removed
				  
		constructor(p_x, p_y, p_bbox) {
			counter += 1;
			id = counter;
			x = p_x;
			y = p_y;
			bbox = p_bbox;
		}
		
		# when the world is scrolled/the background is moved,
		# this function gets called
		# and call the function from tick to request rendering in the next frame,
		# this should happen, when the entity is animated, has changed, or has transcluent parts
		function markBackgroundDirty() {
			markRegionDirty(x+bbox[0], y+bbox[1], x+bbox[2], y+bbox[3]);
		}
		
		function isBackgroundDirty()
		{
			return isRegionDirty(x+bbox[0], y+bbox[1], x+bbox[2], y+bbox[3]);
		}
		
		function getAbsBox() { return [x+bbox[0], y+bbox[1], x+bbox[2], y+bbox[3]]; }
		
		# todo when the background has changed
		function render() {}
		
		function tickPhysics(dx=0, dy=0) 
		{
			var ox = x, oy = y;
			var smashed=false; # currently unused
			
			{
				x+=dx;
				y+=dy;
			}
			{
				var l = bbox[0], t = bbox[1], r = bbox[2], b = bbox[3];

				var lx = x+l, rx = x+r;
				var ilx = Integer(lx), irx = Integer(rx);

				var ix = Integer(x), iy = Integer(y);
				var iy0 = Integer(y-0.1);
				var ity = Integer(y+t);

				var ilx0 = Integer(lx+0.01), irx0 = Integer(rx-0.01);

				var collidesLeft  = theWorld.hasTaggedBlocks([ilx], ity:iy0+1, "solid");
				var collidesRight = theWorld.hasTaggedBlocks([irx], ity:iy0+1, "solid");

				if collidesLeft and collidesRight then
				{
					smashed = true;
				}
				else if collidesLeft then
				{
					x = ilx+1 - l;
				}
				else if collidesRight then
				{
					x = irx - r - 0.01; # sub a bit, so that it does not keep touching
				}
				
				# recalculating
				ix = Integer(x);
				lx = x+l; rx = x+r;
				ilx = Integer(lx); irx = Integer(rx);
				ilx0 = Integer(lx+0.01); irx0 = Integer(rx-0.01);


				#if not world.getBlock(ix, iy).solid then
				{
					velY+=0.01;
					y += velY;
					
					# recalculating
					iy = Integer(y);
					#iy0 = Integer(y-0.1);
					ity = Integer(y+t);
				}
				
				var collidesBottom = theWorld.hasTaggedBlocks(ilx0:irx0+1, [iy], "solid");
				var collidesTop    = theWorld.hasTaggedBlocks(ilx0:irx0+1, [ity], "solid");
				isOnGround = collidesBottom;
				
				if collidesBottom and collidesTop then
				{
					smashed = true;
				}
				else if collidesBottom then
				{
					y = iy;
					velY = 0;
				}
				else if collidesTop then
				{
					y = ity+1-t;
					#velY = -velY;
					velY = 0;
				}
				
				if smashed then y-=1;
			}
			var dirty = ox != x or oy != y;
			if dirty then
				markRegionDirty(ox+bbox[0], oy+bbox[1], ox+bbox[2], oy+bbox[3]);
			
			return dirty;
		}
		# function tickPhysics
		
		function tick() {}
	}
	# class Entity
	
	

	
	
	class EntityItem : Entity
	{
	public:
		var dirty = true;
		var content;
		var period; # for rendering
		
		constructor(p_x, p_y, p_content) : super(p_x, p_y, [-0.25, -0.5, 0.25, 0])
		{
			content = p_content;
			period = math.random() * math.pi() * 2;
		}
		
		function render()
		{
			use namespace disp;
			canvas.reset();
			canvas.scale(dispScale);
			canvas.shift(x-offX-0.25, y-offY-0.5);
			canvas.scale(0.5);
			content.renderItem();
		}
		
		function tick()
		{
			if super.tickPhysics() then
				entityDisp.markDirty(this);
		}
	}
	# class EntityItem
	
	
	class EntityWithInventory : Entity
	{
	public:
		var inventorySlots;
		var onInventorySlotChanged; # function(slot)
		constructor(p_x, p_y, p_bbox, inventorySlots=null) : super(p_x, p_y, p_bbox) 
		{
			this.inventorySlots = inventorySlots;
			onInventorySlotChanged = function(i, item) {};
		}
		
		function collectItem(item, amount=1)
		{
			# look for existing stacks with that same item
			for var i in inventorySlots.keys() do
			{
				if inventorySlots[i] != null then
				if inventorySlots[i].item == item then
				{
					inventorySlots[i].increase(amount);
					onInventorySlotChanged(i, inventorySlots[i]);
					return;
				}
			}
		
			# look for empty slots
			for var i in inventorySlots.keys() do
			{
				if inventorySlots[i] == null then
				{ 
					inventorySlots[i] = inventory.ItemStack(amount, item);
					onInventorySlotChanged(i, inventorySlots[i]);
					return;
				}
			}
			print("inventory full");
		}
	}
	
	class EntityPlayer : EntityWithInventory
	{
	public:
		var movX = 0, movY = 0;
		var lastMovX = 0;
		
		static var speed = 0.05;
	
		constructor(p_x, p_y) : super(p_x, p_y, [-0.3, -1.5, 0.3, 0])
		{
			this.inventorySlots = inventory.makePlayerInventory();
		}
		
		function render()
		{
			use namespace disp;
			canvas.reset();
			canvas.scale(dispScale);
			canvas.shift(x-offX, y-offY);

			if movX != 0 then
			{
				# legs
				var rot = math.sin(time()*speed*math.pi()*0.09)*0.3;
				var d = math.abs(rot)*0.05;
				canvas.shift(0, -0.6);
				canvas.rotate(rot);
				canvas.setFillColor(0, 0, 0.5);
				canvas.fillRect(-0.075, 0, 0.15, 0.6-d);
				canvas.rotate(-2*rot);
				canvas.setFillColor(0, 0, 0.7);
				canvas.fillRect(-0.075, 0, 0.15, 0.6-d);
				canvas.rotate(rot);
				canvas.shift(0, +0.6);


				# back arm
				canvas.shift(0, -1.2);
				canvas.rotate(2*rot);
				canvas.setFillColor(0.4, 0.2, 0.05);
				canvas.fillRect(-0.05, 0, 0.1, 0.5-d);
				canvas.rotate(-2*rot);

				# chest
				canvas.setFillColor(0.8, 0.4, 0.1);
				canvas.fillRect(-0.1, -0.05, 0.2, 0.7);

				# front arm
				canvas.rotate(-2*rot);
				canvas.setFillColor(0.6, 0.3, 0.15);
				canvas.fillRect(-0.05, 0, 0.1, 0.5-d);
				canvas.rotate(2*rot);
				canvas.shift(0, +1.2);

				# head
				canvas.setFillColor(0.5, 0.4, 0.3);
				canvas.fillRect(-0.1, -1.5, 0.2, 0.25);
			}
			else
			{
				#legs
				canvas.shift(-0.1, -0.6);
				canvas.setFillColor(0, 0, 0.7);
				canvas.fillRect(-0.075, 0, 0.15, 0.6);
				canvas.shift(+0.2, 0);
				canvas.fillRect(-0.075, 0, 0.15, 0.6);
				canvas.shift(-0.1, +0.6);

				# chest
				canvas.shift(0, -1.2);
				canvas.setFillColor(0.8, 0.4, 0.1);
				canvas.fillRect(-0.2, -0.05, 0.4, 0.7);
				canvas.shift(0, +1.2);

				# arms
				canvas.shift(-0.25, -1.2);
				canvas.setFillColor(0.6, 0.3, 0.15);
				canvas.fillRect(-0.05, 0, 0.1, 0.5);
				canvas.shift(+0.5, 0);
				canvas.fillRect(-0.05, 0, 0.1, 0.5);
				canvas.shift(-0.25, +1.2);

				# head
				canvas.setFillColor(0.5, 0.4, 0.3);
				canvas.fillRect(-0.1, -1.5, 0.2, 0.25);	
			}
		}
		# function render
		
		
		
		function tick()
		{
			
			var dy = 0;
			if movY == -1 and isOnGround then # ontop of a block
			{
				velY = -0.25; #-0.2;
				dy = -0.1;
			}
			
			if super.tickPhysics(dx = movX*speed, dy = dy) then
				entityDisp.markDirty(this);
			else if movX != 0 or lastMovX != movX then
			{
				markBackgroundDirty();
				entityDisp.markDirty(this);
			}
				
			lastMovX = movX;
		}
		
	}
	# class Player
}
# namespace entities









#[file] world.tscript#disp

namespace dispWorld
{
	use namespace disp;
		
	var allDirty = true;
	var screenChanged = true;
	var dirtyBlocks = {};
	var visBlocks; # blocks visible on the screen
	
	var mul = 2^13;
	var mulMsk = mul-1;
	
	var markDirtyGuiCB;
	
	var ttX, ttY;
	function resetRender()
	{
		ttX = 0; ttY = 0;		
	}
	
	# render block and place block into the array
	function renderBlockPlace(x, y) # screen coords
	{
		var b = theWorld.getBlock(x+offX, y+offY);
		
		canvas.shift(x-ttX, y-ttY);
		ttX = x; ttY = y;
		b.render();
		
		visBlocks[x+y*dispCols] = b;
	}
	
	# similar to renderBlockPlace but do not rerender if there is the same block
	function renderBlockPlaceUpdate(x, y)
	{
		var b = theWorld.getBlock(x+offX, y+offY);
		if visBlocks[x+y*dispCols] != b then
		{
			canvas.shift(x-ttX, y-ttY);
			ttX = x; ttY = y;
			b.render();
			
			visBlocks[x+y*dispCols] = b;	
			markDirtyGuiCB(x, y);
		}
	}
	
	
	function markDirty(x, y) # screen coords
	{
		if not allDirty then
		if x >= 0 then if x < dispCols then
		if y >= 0 then if y < dispRows then
		{
			# schneller, direkt auszuführende Aktion in Anonyme funktion packen
			dirtyBlocks[String(x+y*mul)] = function[x, y](){ renderBlockPlace(x, y); };
			markDirtyGuiCB(x, y);
		}	
	}
	
	function markDirtyAt(x, y) # world coords
	{
		markDirty(x-offX, y-offY);		
	}
		
	function isDirty(x, y) # screen coords
	{
		return dirtyBlocks.has(String(x+y*mul));
	}
	
	function isDirtyAt(x, y) # world coords
	{
		#return isDirty(x-offX, y-offY);		
		return dirtyBlocks.has(String((x-offX)+(y-offY)*mul));
	}
	
	# force blocks to be rerendered if nessecary
	function markCompletelyDirty()
	{
		allDirty = true;
	}
	
	# force everything to be rerendered
	function markCompletelyDirtyScreen()
	{
		markCompletelyDirty();
		dirtyBlocks = {}; # everything rendered anyway
		dispWorld.screenChanged = true;
		visBlocks = Array(dispCols*dispRows, null);
	}
	
	theWorldCB.markDirtyCB = markDirtyAt;
	theWorldCB.isDirtyCB   = isDirtyAt;
	
	namespace chunkVars
	{
		var rcx, rcy; # range of visible chunks by chunk pos (x//16, y//16)
		var dispChunks; # visible chunks
		var chunkOffX, chunkOffY; # offset of the first chunk to the lefttop corner (always <= 0)
		var chunkStride; # Distance to shift back to the left, always <= 0
		
		var chunkRW, chunkBH; # the width/height of the rightmost/bottommost chunk
	}
	
	function updateChunkVars()
	{
		use namespace chunkVars;
		rcx = offX//16:(offX+dispCols+15)//16;
		rcy = offY//16:(offY+dispRows+15)//16;
		dispChunks = [];
		
		chunkOffX = rcx.begin() * 16 - offX;
		chunkOffY = rcy.begin() * 16 - offY;
		chunkRW = 16-(rcx.end() * 16 - offX - dispCols);
		chunkBH = 16-(rcy.end() * 16 - offY - dispRows);
		
		chunkStride = rcx.size() * -16;
		
		for var cy in rcy do
		for var cx in rcx do
		{
			dispChunks.push(theWorld.getChunk(cx, cy).blocks);
		}
	}
	
	
	function renderWorld()
	{
		canvas.reset();
		canvas.scale(dispScale);
		
		if dynScroll then 
		{
			canvas.shift(-offXD, -offYD); # dynrender
			allDirty = true;
			screenChanged = true;
		}
		
		if(allDirty) then
		{
			updateChunkVars();
			
			var t = time();
			
			var blockFunc, blockFunc2;
			if screenChanged then
			{
				blockFunc = function(b, x, y)
				{
					b.render();
					visBlocks[x+(y)*dispCols] = b;
				};
				
				screenChanged = false;
				# no need for gui update, always gets updated
				
				blockFunc2 = blockFunc;
			}
			else
			{
				blockFunc = function(b, x, y)
				{
					var indx = x+(y)*dispCols;
					if visBlocks[indx] != b then 
					{
						b.render();
						visBlocks[indx] = b;
					}
				};
				blockFunc2 = function(b, x, y)
				{
					var indx = x+(y)*dispCols;
					if visBlocks[indx] != b then 
					{
						b.render();
						visBlocks[indx] = b;	
						markDirtyGuiCB(x, y);
					}
				};
				
				blockFunc = blockFunc2; # move assignment-statement to last row of chunks
			}
			
			
			var i = 0;
			use namespace chunkVars;
			canvas.shift(chunkOffX, chunkOffY);

			var ex = rcx.end()-1, ey = rcy.end()-1;

			var lly = -chunkOffY;
			var rry = 16;

			var cyy = chunkOffY;

			for var cy in rcy do
			{
				if cy == ey then rry = chunkBH;

				var llx = -chunkOffX;
				var rrx = 16;

				var cxx = chunkOffX;

				for var cx in rcx do
				{
					if cx == ex then rrx = chunkRW;

					# It seems that the inlined version, renderChunk, is slower than
					# the generalized version
#  					renderChunk(dispChunks[i], llx, lly, rrx, rry, cxx, cyy);
					
					world.chunkUtil.forEachBlock(
						dispChunks[i], llx, lly, rrx, rry, cxx, cyy,
						blockFunc,
						canvas.shift
					);

					# doChunk shifts 16 down
					llx = 0;
					cxx += 16;
					canvas.shift(16, 0);
					i+=1;
				}

				lly = 0;
				cyy += 16;
				canvas.shift(chunkStride, 16);
			}
			canvas.reset();
			canvas.scale(dispScale);


			allDirty = false;
			
			#print("Rendering screen took " + (time()-t) + " ms");
		}
		
		resetRender();
		for var db in dirtyBlocks.values() do db();

		dirtyBlocks = {};
		
		
		
		if showChunkBorders then
		{	
			canvas.reset();
		
			for var cy in chunkVars.rcy do
			for var cx in chunkVars.rcx do
			{
				canvas.rect((cx*16-offX)*dispScale, (cy*16-offY)*dispScale, 16*dispScale, 16*dispScale);
			}
		}
	}
	# function renderWorld
	
}
# namespace worldDisp








#[file] gui.tscript#fwd
namespace gui
{
	var guiScale = 32;
}

#[file] inventory.tscript#main
namespace inventory
{
	use namespace disp;	
	
	var hotbarDirty = true;
	
	var hotbarIndex = 0;
	var slots;
	
	
	var hotbL, hotbT, hotbR, hotbB, hotbOff;
	var guiRegionY;
	
	# constant, do not change
	var hotbAllDirty = { "0": 0, "1": 1, "2": 2, "3": 3, "4": 4,
	                     "5": 5, "6": 6, "7": 7, "8": 8, "9": 9 };
	
	var hotbDirty = {};
	
	
	function bindEntityInventory(entityWithInventory)
	{
		slots = entityWithInventory.inventorySlots;
			
		entityWithInventory.onInventorySlotChanged = function(i, itemstack)
		{
			if i < hotbarSize then hotbDirty[String(i)] = i;
		};
	}
}


namespace inventory {
	
	function markCompletelyDirtyScreen()
	{
		hotbarDirty = true;
	}
	
	
	function selectSlot(index) {
		if hotbarIndex == index then return;
		
		hotbDirty[String(index)] = index;
		hotbDirty[String(hotbarIndex)] = hotbarIndex;
		
		hotbarIndex = index;
	}
	
	namespace dispHotbar
	{
		var scl;
		
		var hotOff;
		var hx, hy, w;
	}
	
	namespace dispItem
	{
		function renderAmount(item)
		{
			use namespace dispHotbar;
			
			if item.amount > 1 then
			{
				var amountStr = String(item.amount);

				if item.amount > 99 then
				{
					canvas.setFont("helvetica", gui.guiScale*1/2);
					# bold font, by multiple rendering
					canvas.text(0, 0.0625*scl, amountStr);
					canvas.text(0.25*0.0625*scl, 1.25*0.0625*scl, amountStr);
					canvas.setFont("helvetica", gui.guiScale*2/3);
				}
				else
					canvas.text(0, 0, amountStr);
			}
		}	
	}
	
	function initHotbar()
	{
		use namespace dispHotbar;
		dispHotbar.scl = gui.guiScale * 1; #1.125;
		
		var px = 0.0625; #0.1; #0.0625;
		var dd = px*scl;
		
		dispHotbar.hotOff = 1+2*px; # 2*1/16 on each side
		
		dispHotbar.hy = canvas.height() - gui.guiScale*1.75;
		dispHotbar.w = hotbarSize*hotOff - hotOff + 1;
		dispHotbar.hx = (canvas.width() - scl*w) / 2;
		
		#updating static values, TODO: this is shitty code
		hotbOff = hotOff*scl;
		hotbL = hx-dd;
		hotbT = hy-dd;
		hotbR = hotbL + hotbOff*hotbarSize;
		hotbB = hy+scl+dd;
		
		guiRegionY = canvas.height() - gui.guiScale*2.75;
	}
	
	function renderHotbar()
	{
		use namespace dispHotbar;
		if hotbarDirty then hotbDirty = hotbAllDirty;
		else if hotbDirty.size() == 0 then return;
		
		initHotbar();
		
		canvas.reset();
		canvas.shift(hx, hy);
		canvas.scale(scl);
		
		var ttX = 0;
		for var i in hotbDirty.values() do
		{
			var x = hotOff*i;
			canvas.shift(x-ttX, 0); ttX = x;
			if i == hotbarIndex then
				canvas.setFillColor(1, 1, 1, 1);
			else
				canvas.setFillColor(0.4, 0.4, 0.4, 1);
				
			canvas.fillRect(-0.0625, -0.0625, 1.125, 1.125);
			canvas.setFillColor(0.3, 0.3, 0.3, 1);
			canvas.fillRect(0, 0, 1, 1);
			var b = slots[i];
			if b != null then b.renderItem();
			
		}
		
		# draw amount
		canvas.shift(-ttX, 0);
		canvas.scale(1/scl);
		
		canvas.setTextAlign("right");
		canvas.setFont("helvetica", gui.guiScale*2/3);
		var px = scl*0.0625;
		canvas.shift(px*15, px*7);
		for var k in 0:2 do
		{
			var lastX = 0;
			canvas.setFillColor(k, k, 0.5);
			for var i in hotbDirty.values() do
			{
				canvas.shift((i-lastX)*hotOff*scl, 0);
				lastX = i;
				if slots[i] == null then continue;
				dispItem.renderAmount(slots[i]);
			}
			canvas.shift(-px-lastX*hotOff*scl, -px);
		}
		# end draw amount
		
		hotbDirty = {};
		hotbarDirty = false;
	}
	
	dispWorld.markDirtyGuiCB = function(x, y)
	{
		if y*dispScale+dispScale >= hotbT and y*dispScale <= hotbB then
		{
			var xx  = x*dispScale-hotbL;
			var xxl = xx+dispScale;
			var xxr = xx-hotbOff;
			for var i in 0:hotbarSize do
			{
				if xxl > i*hotbOff and xxr < i*hotbOff then
					hotbDirty[String(i)] = i;
			}
		}
	};
	
	function isOnGui(x, y)
	{
		return y >= guiRegionY;	
	}
	
	function onMouseDown(x, y)
	{
		if y >= hotbT then if y < hotbB then
		if x >= hotbL then if x < hotbR then
		{
			selectSlot(Integer((x-hotbL) // hotbOff));
		}
		
	}
	
	
	function useCurrent()
	{
		if slots[hotbarIndex] != null then
		{
			if slots[hotbarIndex].decrease() then
			{
				slots[hotbarIndex] = null;
			}
			
			hotbDirty[String(hotbarIndex)] = hotbarIndex;
		}
	}
	
}
# namespace inventory










#[file] disp.tscript#main
function markCompletelyDirtyScreen()
{
	dispWorld.markCompletelyDirtyScreen();
	entityDisp.markCompletelyDirtyScreen();	
	inventory.markCompletelyDirtyScreen();
	inventory.initHotbar();
}

var canvasVisible = false;
function initScale()
{
	use namespace disp;
	
	var lastDispCols = dispCols, lastDispRows = dispRows;
	
	if dispScale == null then
	{
		if canvas.height() == 0 then {
			canvasVisible = false;
			return; # canvas not visible
		}
		if forceSettings.dispScale != null then
			dispScale = forceSettings.dispScale;
		else
			dispScale = math.max(canvas.height()//(2*hh)*2, 16);
	}
	dispRows = canvas.height()//dispScale + 1;
	dispCols = canvas.width()//dispScale + 1;
	
	# keep center position
	offX = offX + lastDispCols//2 - dispCols//2;
	offY = offY + lastDispRows//2 - dispRows//2;
	
	selX = null; selY = null;
	
	canvasVisible = true;
}
# function initScale







function renderWorld()
{	
	for var e in theWorld.entities do
		if e.isBackgroundDirty() then entityDisp.markDirty(e);
	
	dispWorld.renderWorld();
	for var e in entityDisp.dirty.values() do e.render();
	entityDisp.dirty = {};
}

function renderSelection()
{
	use namespace disp;
	
	canvas.reset();
	if mouseInside and selX != null then
	{
		var l = math.sin(time()/300)*0.3+0.5;
		canvas.setFillColor(1, 1, 1, l);
		canvas.fillRect((selX-offX)*dispScale, (selY-offY)*dispScale, dispScale, dispScale);
		theWorldCB.markDirtyCB(selX, selY); # TODO move to better place
	}	
}

function renderHUD()
{
	inventory.renderHotbar();
}
	
function renderDebugDiff()
{
	if debugRender then
	{
		canvas.reset();
		canvas.setFillColor(0, 0, 0, 1/256);
		canvas.fillRect(0, 0, canvas.width(), canvas.height());
	}
}
	
function render()
{
	if not canvasVisible then return;
	renderDebugDiff();
	
	renderWorld();
	
	renderSelection();
	renderHUD();
}



function scroll(dx, dy)
{
	use namespace disp;
	use namespace math; # for min, max
	dx = Integer(dx);
	dy = Integer(dy);
	
	if not canvasVisible then return;


	var l = 1, r = 1;
	var t = 1+2, b = 3*gui.guiScale/disp.dispScale;
	
	
	var px = thePlayer.x;
	var py = thePlayer.y;

	var nOffX = Integer(min(max(px-disp.dispCols+r+1, disp.offX+dx), px-l));
	var nOffY = Integer(min(max(py-disp.dispRows+b+1, disp.offY+dy), py-t));

	if disp.offX == nOffX and disp.offY == nOffY then return;
	
	for var e in theWorld.entities do e.markBackgroundDirty();
	dx = nOffX - disp.offX; dy = nOffY - disp.offY;
	disp.offX = nOffX; disp.offY = nOffY;
	if selX != null then { selX += dx; selY += dy; }
	dispWorld.markCompletelyDirty();
	entityDisp.markCompletelyDirty();
}

function scrollTo(x, y)
{
	scroll(x-disp.dispCols//2-disp.offX, y-disp.dispRows//2-disp.offY);
	
}


var lastUpdateTime = time();


function updatePlayerScroll()
{
	use namespace disp;
	
	
	var px = thePlayer.x;
	var py = thePlayer.y;
	
	#var r = 1;#math.min((dispCols+3) // 4, (dispRowsX+3) // 4);
	#var d = 1;#math.min((dispCols+2) // 3, (dispRowsX+2) // 3);
	var l = 1, r = 1;
	var t = 1+2, b = 3*gui.guiScale/disp.dispScale;

	var doScroll = false;

	if px < offX + l              then doScroll = true;
	else if px > offX+dispCols-r  then doScroll = true;
	
	if py < offY + t              then doScroll = true;
	else if py > offY+dispRows-b  then doScroll = true;
	
	if doScroll then
		scrollTo(px, py);
}


#[file] control.tscript#main

namespace mouseModes
{
	var place = 0,
		destroy = 1,
		hotbar = 2;
}

var mouseTime;
var mouseMode;

function userAction(x, y)
{
	var b = theWorld.getBlock(x, y);
	if mouseMode == mouseModes.destroy then
	{
		var drop = b.drop;
		if drop != null then
		{
			if b.dropChance == 1.0 or math.random() < b.dropChance then
			{
				thePlayer.collectItem(drop);
				# TODO what happens when the inventory is full
			}
		}
		theWorld.setBlockUpdate(x, y, vanilla.AIR);
	}
	else if mouseMode == mouseModes.place then
	{
		var selectedSlot = inventory.slots[inventory.hotbarIndex];
		if selectedSlot != null then
		{
			if b == vanilla.AIR then
			{
				if selectedSlot.item.place(x, y) then
					inventory.useCurrent();
				
				return;
			}
		}
		
		if b.onClick != null then b.onClick(x, y);
	}
}
# function userAction




var destroyTime = 250; # ms
function mouseTick()
{
	if mouseTime != null and mouseMode == null then
	{
		if time() - mouseTime > destroyTime then
		{
			mouseMode = mouseModes.destroy;
			userAction(selX, selY);
		}
	}
}


function mouseTrig()
{
	if mouseTime != null and mouseMode == null then
	{
		if time() - mouseTime > destroyTime then
			mouseMode = mouseModes.destroy;
		else
			mouseMode = mouseModes.place;

		userAction(selX, selY);
	}
}

function keyboardTick()
{
	use namespace math; # min, max

	#var stepAcc = 0.07, stepDec = 0.15;
	var stepAcc = 0.1, stepDec = 0.3;
	if not thePlayer.isOnGround then stepDec = 0.07;
	var velXMax = 2;
	var movX = thePlayer.movX;
	thePlayer.movY = 0;
	
	
	var movXSgn = 0;
	
	if pressedKeys["a"] then movXSgn -= 1;
	if pressedKeys["d"] then movXSgn += 1;
	if pressedKeys["w"] then thePlayer.movY -= 1;
	
	if movXSgn == 0 then
	{
		if      movX < 0 then movX = min(movX+stepDec, 0);
		else if movX > 0 then movX = max(movX-stepDec, 0);
	}
	else
	{
		movX = min(max(-velXMax, movX+stepAcc*movXSgn), velXMax);
	}
	
	thePlayer.movX = movX;
	
}


function controlTick()
{
	mouseTick();
	keyboardTick();
}


function updateXY(event)
{
	use namespace disp;
	
	mouseInside = true;
	
 	mouseX = event.x; mouseY = event.y;
	var nX, nY;
	
	if mouseMode == mouseModes.destroy or
	   mouseMode == mouseModes.place or
	   not inventory.isOnGui(mouseX, mouseY) then
	{
		nX = mouseX//dispScale+offX;
		nY = mouseY//dispScale+offY;
	} else {
		# keep nX and nY null
		#mouseMode = mouseModes.hotbar;	
		;
	}
	
	if nX != selX or nY != selY then
	{
		mouseTrig();
		if selX != null then theWorldCB.markDirtyCB(selX, selY);
		selX = nX; selY = nY;	
	}
}


#[file] world.tscript#tick
namespace entityBehavior
{
	use namespace entities;
	
	registerCollision(EntityPlayer, EntityItem, function(p, i)
		{
			i.dead = true;
		}
	);
}

#[file] gui.tscript#main
namespace gui
{
	
	# modal gui element
	var current = null;
	var backDirty = false;
	var modalDirty = false;
	
	function markModalDirty() { modalDirty = true; }
	function markBackDirty() { backDirty = true; }
	
	function markScreenDirty()
	{
		backDirty = true;
		modalDirty = true;
		if current != null then current.onScreenChange();
	}
	
	function drawModalDisable()
	{
		canvas.reset();
		canvas.setFillColor(0, 0, 0, 0.3);
		canvas.fillRect(0, 0, canvas.width(), canvas.height());
	}
	function setModal(gui) # should there be a function pushModal
	{
		if current == null then
		{
			current = gui;
			current.onGotFocus();
			drawModalDisable();
			markModalDirty();
		}
		else
		{
			current.onLostFocus();
			current.onClose();
			current = gui;
			current.onGotFocus();
			markScreenDirty();
		}
	}
	
	function closeModal()
	{
		current.onLostFocus();
		current.onClose();
		initScale();
		markCompletelyDirtyScreen();
		current = null;

		gui.backDirty = false;
		gui.modalDirty = false;
	}
	
	
	# when an event returns true, the control is marked to be rerendered
	class Control
	{
	private:
		static var counter = 0;
	public:
		var id;
		var x, y;
		var width, height;
		var hasFocus = false;
		
		constructor(x=0, y=0, width=1, height=1)
		{
			counter += 1;
			this.id = String(counter); # string to be used in Dictionaries
			this.x = x; this.y = y;
			this.width = width;
			this.height = height;
		}
		
		function isInside(x, y)
		{
			# translate position
			x = x/guiScale-this.x; y = y/guiScale-this.y;
			
			if x >= 0 then if x < width then
			if y >= 0 then if y < height then return true;
			
			return false;
		}
		
		function onMouseDown(event) {}
		function onMouseMove(event) {}
		function onMouseUp(event) {}
		function onMouseOut(event) {}
		function onKeyDown(event) {}
		function onKeyUp(event) {}
		function onResize(event) {}
		function onTimer(event) {}
		
		function onGotFocus() { this.hasFocus=true; return true; }
		function onLostFocus() { this.hasFocus=false; return true; }
		
	protected:
		function drawFocusRect()
		{
			if hasFocus then
			{
				var d = guiScale/32; # /26
				var dd = d*2;
				
				canvas.setLineColor(1, 1, 1);
				canvas.setLineWidth(dd);
				canvas.rect(x*guiScale+d, y*guiScale+d, width*guiScale-dd, height*guiScale-dd);	
			}	
		}
		
		function drawShadow()
		{
			# shadow
			var px = guiScale/64;
			canvas.setFillColor(0.18, 0.18, 0.18);
			canvas.fillRect(x*guiScale-2*px, y*guiScale-2*px, width*guiScale+6*px, height*guiScale+6*px);	
			canvas.setFillColor(0.17, 0.17, 0.17);
			canvas.fillRect(x*guiScale-px, y*guiScale-px, width*guiScale+3*px, height*guiScale+3*px);	
		}
		
		# used to cleanly render ontop of old image
		# this enshures, that the rectangular border of the control looks nice
		function clearFrameBackground(parentDirty)
		{
			if parentDirty then return;
			
			canvas.setLineColor(0.2, 0.2, 0.2, 1);
			canvas.setLineWidth(2);
			canvas.frameRect(x*guiScale, y*guiScale, width*guiScale, height*guiScale);
		}
		
		function doCanvasShift()
		{
			canvas.shift(x*guiScale, y*guiScale);
		}
		
		function undoCanvasShift()
		{
			canvas.shift(-x*guiScale, -y*guiScale);
		}
	public:
	
		function render(parentDirty) {}
	}
	#class Control
	
	class ControlSlider : Control
	{
	public:
		var min, max, step;
		var value, lastValue;
		var buttonWidth;
		
		var onScroll, onChange;
		
		constructor(x=0, y=0, width=10, height=1,
					min=0, max=100, value=null, step=1,
					buttonWidth=0.35,
					onScroll=null, onChange=null)
			: super(x=x, y=y, width=width, height=height)
		{
			this.min = min; this.max = max; this.step = step;
			this.buttonWidth = buttonWidth;
			if value == null then this.value = min; else this.value = value;
			
			if onScroll == null then 
				this.onScroll = function(value){};
			else
				this.onScroll = onScroll;
				
				
			if onChange == null then 
				this.onChange = function(value){};
			else
				this.onChange = onChange;
		}
		
		function render(parentDirty)
		{
			clearFrameBackground(parentDirty);
			
			canvas.setFillColor(0.1, 0.1, 0.1);
			canvas.fillRect(x*guiScale, y*guiScale, width*guiScale, height*guiScale);
			
			drawFocusRect();
			
			doCanvasShift();
			canvas.setFillColor(1, 1, 1, 0.75);
			canvas.setFont("helvetica", 0.7*guiScale);
			if value > (min+max)/2 then
			{
				canvas.setTextAlign("left");
				canvas.text(0.15*guiScale, 0.15*guiScale, String(value));
			}
			else
			{
				canvas.setTextAlign("right");
				canvas.text(width*guiScale-0.15*guiScale, 0.15*guiScale, String(value));
			}
			undoCanvasShift();
			
			var ww = width-buttonWidth;
			var ll = (value-min)/(max-min)*ww;
			
			canvas.setFillColor(1, 1, 1);
			if hasFocus then
				canvas.fillRect((x+ll)*guiScale, (y+1/26)*guiScale, buttonWidth*guiScale, (height-2/26)*guiScale);
			else
				canvas.fillRect((x+ll)*guiScale, y*guiScale, buttonWidth*guiScale, height*guiScale);
		}
	
	protected:
		function scrollTo(event)
		{
			var ww = width-buttonWidth;
			
			var v = math.min(math.max(min, (event.x/guiScale-buttonWidth/2-x)/ww*(max-min)+min), max);
			if step != 0 then
				v = Integer((v+step/2)//step)*step;
			if value != v then
			{
				value = v;
				onScroll(value);
				return true;
			}
		}
		
		function changeFinish()
		{
			if lastValue != null then
			if lastValue != value then
			{
				onChange(value);
				lastValue = null;	
			}
		}
		
	public:
		function onMouseDown(event)
		{
			if lastValue == null then lastValue = value;
			return scrollTo(event);
		}
		
		function onMouseMove(event)
		{
			if event.buttons.size() >= 1 then
				return scrollTo(event);
		}
		
		function onMouseUp(event)
		{
			var dirty = scrollTo(event);
			changeFinish();
			return dirty;
		}
		
		function onMouseOut(event)
		{
			changeFinish();
		}
		
		function onKeyDown(event)
		{
			if lastValue == null then lastValue = value;
			
			var s = math.max(step, 1);
			var v = value;
			if event.key == "ArrowLeft" then v = math.max(min, v-s);
			else if event.key == "ArrowRight" then v = math.min(max, v+s);
			if v != value then
			{
				value = v;
				onScroll(value);
				return true;
			}
		}
		
		function onKeyUp(event)
		{
			changeFinish();
		}
	}
	# class ControlSlider
	
	
	
	class ControlButton : Control
	{
	public:
		var caption;
		var onClick;
		var pressed, leftDown;
		
		constructor(caption, onClick,
					x=0, y=0, width=10, height=1)
			: super(x=x, y=y, width=width, height=height)
		{
			this.caption = caption;
			this.onClick = onClick;
			this.pressed = false;
			this.leftDown = false;
		}
		
		function render(parentDirty)
		{
			clearFrameBackground(parentDirty);
			
			#drawShadow();
			
			if pressed then canvas.setFillColor(1, 1, 1);
			else            canvas.setFillColor(0.3, 0.3, 0.3);
			canvas.fillRect(x*guiScale, y*guiScale, width*guiScale, height*guiScale);
			
			drawFocusRect();
			
			doCanvasShift();
			if pressed then canvas.setFillColor(0, 0, 0);
			else            canvas.setFillColor(1, 1, 1);
			canvas.setFont("helvetica", 0.7*guiScale);
			canvas.setTextAlign("center");
			canvas.text(width/2*guiScale, 0.15*guiScale, caption);
			undoCanvasShift();
		}
		
		function onMouseDown(event)
		{
			if event.button == "left" then
			{
				pressed = true;
				leftDown = true;
				return true;
			}
		}
		
		function onMouseMove(event)
		{
			if leftDown then
			{
				var xx = event.x/guiScale - x, yy = event.y/guiScale - y;
				var nPressed = xx >= 0 and yy >= 0 and xx < width and yy < height;
				if nPressed != pressed then
				{
					pressed = nPressed;
					return true;
				}
			}
		}
		
		function onMouseUp(event)
		{
			if event.button == "left" then
			{
				if pressed then
				{
					onClick();
					pressed = false;
					leftDown = false;
					return true;
				}
				else
					leftDown = false;
			}
		}
		
		function onKeyUp(event)
		{
			if event.key == "Enter" then onClick();
		}
	}
	# class ControlButton
	
	class ControlList : Control
	{
	public:
		var entries;
		var currentIndex;
		
		var onSelect;
		
		var emptyText;
		var scrollPos=0;
		
		static var entryHeight = 7/8;#0.9;
		
		constructor(entries = [], onSelect = null, emptyText = "",
					x=0, y=0, width=10, height=1)
			: super(x=x, y=y, width=width, height=height)
		{
			this.entries = entries;
			this.currentIndex = null;
			if onSelect == null then
				this.onSelect = function(i, value) {};
			else
				this.onSelect = onSelect;
			this.emptyText = emptyText;
		}
		
		function render(parentDirty)
		{
			clearFrameBackground(parentDirty);
			
			canvas.setFillColor(0.1, 0.1, 0.1);
			canvas.fillRect(x*guiScale, y*guiScale, width*guiScale, height*guiScale);
			
			doCanvasShift();
			canvas.setFont("helvetica", 2/3*guiScale);
			canvas.setTextAlign("left");
			
			if entries.size() == 0 then
			{
				canvas.setFillColor(0.5, 0.5, 0.5);
				canvas.text(0.15*guiScale, 0.15*guiScale, emptyText);
			}
			else
			{
				canvas.setFillColor(1, 1, 1);
				
				var maxEntries = Integer(height//entryHeight);
				for var y in 0:maxEntries do
				{
					var i = y+scrollPos;
					if i >= entries.size() then break;
					if i < 0 then continue;
					
					if i == currentIndex then
					{
						#canvas.setFillColor(1, 1, 1);
						canvas.fillRect(0, y*entryHeight*guiScale, width*guiScale, entryHeight*guiScale);
						canvas.setFillColor(0, 0, 0);
						canvas.text(0.125*guiScale, (0.125+y*entryHeight)*guiScale, entries[i]);
						canvas.setFillColor(1, 1, 1);
					}
					else
					{
						canvas.text(0.125*guiScale, (0.125+y*entryHeight)*guiScale, entries[i]);
					}
				}
			}
			undoCanvasShift();
		}
		
	protected:
		function adjustScroll(keepRelative=false)
		{
			var maxEntries = Integer(height//entryHeight);
				
			if currentIndex-maxEntries+1 >= scrollPos then
			{
				scrollPos = currentIndex-maxEntries+2;
				if currentIndex == entries.size()-1 then scrollPos-=1;
				if keepRelative then currentIndex = scrollPos+maxEntries-1;
				return true;
			}

			if currentIndex <= scrollPos then
			{
				if currentIndex == 0 and scrollPos == 0 then return;
				scrollPos = math.max(0, currentIndex-1);
				if keepRelative then currentIndex = scrollPos;
				return true;
			}
		}
	
	public:
		function onMouseMove(event)
		{
			var indx = Integer((event.y/guiScale-y)//entryHeight)+scrollPos;	
			if indx < 0 or indx >= entries.size() then
			{
				if currentIndex != null then
				{
					currentIndex = null;
					return true;
				}
			}
			else
			{
				if currentIndex != indx then
				{
					currentIndex = indx;
					return true;
				}
			}
		}
		
		function onMouseOut(event)
		{
			if currentIndex != null then
			{
				currentIndex = null;
				return true;
			}
		}
		
		function onMouseUp(event)
		{	
			if currentIndex != null then
				onSelect(currentIndex, entries[currentIndex]);
		}
		
		function onKeyDown(event)
		{
			if currentIndex == null then currentIndex = 0;
			if event.key == "Enter" then
				onSelect(currentIndex, entries[currentIndex]);
			else if event.key == "ArrowUp" then
			{
				if currentIndex > 0 then
				{
					currentIndex -= 1;
					adjustScroll();
					return true;
				}
			}
			else if event.key == "ArrowDown" then
			{
				if currentIndex < entries.size()-1 then
				{
					currentIndex += 1;
					adjustScroll();
					return true;
				}
			}
		}
		
		var lt = 0;
		function onTimer(event)
		{
			if currentIndex == null then return;
			
			var t = time();
			if t-lt > 200 then
			{
				lt = t;
				return adjustScroll(keepRelative=true);
			}
		}
	}
	# class ControlList
	
	class ControlTextInput : Control
	{
	
	public:
		var text;
		var promptText;
		var maxChars;
		var onEnter;
		
		constructor(text="", promptText="", maxChars=20, onEnter=null,
					x=0, y=0, width=10, height=1)
			: super(x=x, y=y, width=width, height=height)
		{
			this.text = text;
			this.promptText = promptText;
			this.maxChars = maxChars;
			if onEnter == null then
				this.onEnter = function(text) {};
			else
				this.onEnter = onEnter;
		}
		
		function render(parentDirty)
		{
			clearFrameBackground(parentDirty);
			
			canvas.setFillColor(0.1, 0.1, 0.1);
			canvas.fillRect(x*guiScale, y*guiScale, width*guiScale, height*guiScale);
			
			drawFocusRect();
			
			doCanvasShift();
			var renderedText;
			if text.size() == 0 then
			{
				renderedText = promptText;
				canvas.setFillColor(0.5, 0.5, 0.5);
			}
			else
			{
				renderedText = text;
				canvas.setFillColor(1, 1, 1);
			}
			canvas.setFont("helvetica", 2/3*guiScale);
			canvas.setTextAlign("left");
			canvas.text(0.15*guiScale, 0.15*guiScale, renderedText);
			undoCanvasShift();
		}
		
		function onMouseDown(event)
		{
			if event.button == "left" then
			{
				var newText = prompt(promptText);
				if newText != null then
				{
					newText = newText[0:maxChars];
					if newText != text then
					{
						text = newText;
						onEnter(text);
						return true;
					}
					onEnter(text);
				}
			}
		}
		
		function onKeyDown(event)
		{
			if event.key.size() == 1 then
			{
				if text.size() < maxChars then
				{
					text += event.key;
					return true;
				}
			}
			else if event.key == "Backspace" or event.key == "ArrowLeft" then
			{
				if text.size() > 0 then
				{
					text = text[0:text.size()-1];
					return true;
				}
			}
			else if event.key == "Delete" then
			{
				if text.size() > 0 then
				{
					text = "";
					return true;
				}
			}
			else if event.key == "Enter" then
			{
				onEnter(text);
			}
		}
	}
	
	
	
	class ControlContainer : Control
	{
	public:
		var controls;
		var dirtyControls;
		var currentIndex=null;
	
		constructor(x=0, y=0, width=1, height=1, controls=null)
			: super(x=x, y=y, width=width, height=height)
		{
			if controls == null then
				this.controls = [];
			else
				this.controls = controls;
				
			this.dirtyControls = {};
		}
		
		function markDirty(index)
		{
			var c = controls[index];
			#assert(Type.isDerivedFrom(Type(c), Control));
			dirtyControls[c.id] = c;
			return true;
		}
		
		function markDirtyCtrl(c)
		{
			dirtyControls[c.id] = c;	
		}
		
		function updateCurrentControl(event, isMouseMove=false)
		{
			var dirty;
			
			var index=null;
			for var i in controls.keys() do
				if controls[i].isInside(event.x, event.y) then
					index = i;
			
			if currentIndex != index then
			{
				if currentIndex != null then
				{
					if isMouseMove then
					{
						if controls[currentIndex].onMouseOut(null)==true then
							dirty=markDirty(currentIndex);
					}
					
					if controls[currentIndex].onLostFocus()==true then
						dirty=markDirty(currentIndex);
				}
					
				currentIndex = index;
				
				if currentIndex != null then
					if controls[currentIndex].onGotFocus()==true then
						dirty=markDirty(currentIndex);
				
				return dirty;
			}
		}
		
		function onMouseDown(event)
		{
			event.x -= this.x*guiScale; event.y -= this.y*guiScale;
			if event.buttons.size() == 1 then
				updateCurrentControl(event);
					
			if currentIndex != null then
			{
				if controls[currentIndex].onMouseDown(event)==true then
					return markDirty(currentIndex);
			}
			else return this.onMouseDownBack(event);
		}
		
		function onMouseMove(event)
		{
			event.x -= this.x*guiScale; event.y -= this.y*guiScale;
			if event.buttons.size() == 0 then
				updateCurrentControl(event, isMouseMove=true);
			
			if currentIndex != null then
				if controls[currentIndex].onMouseMove(event)==true then
					return markDirty(currentIndex);
		}
		
		function onMouseUp(event)
		{	
			event.x -= this.x*guiScale; event.y -= this.y*guiScale;
			
			if currentIndex != null then
				if controls[currentIndex].onMouseUp(event)==true then
					return markDirty(currentIndex);
		
		}
		function onMouseOut(event)
		{
			if currentIndex != null then
			{
				if controls[currentIndex].onMouseOut(null)==true then
					return markDirty(currentIndex);
					
				currentIndex = null;
			}
		}
		function onKeyDown(event)
		{
			if currentIndex != null then
				if controls[currentIndex].onKeyDown(event)==true then
					return markDirty(currentIndex);
		}
		function onKeyUp(event)
		{
			if currentIndex != null then
				if controls[currentIndex].onKeyUp(event)==true then
					return markDirty(currentIndex);
		}
		function onResize(event) {}
		function onTimer(event)
		{
			for var c in controls.values() do
				if c.onTimer(event)==true then
					return markDirtyCtrl(c);
					#return markDirty(currentIndex);
		}
		function render(parentDirty)
		{
			doCanvasShift();
			if parentDirty then
			{
				for var c in controls.values() do
					c.render(true);
			}
			else
			{
				for var c in dirtyControls.values() do
					c.render(false);
				dirtyControls = {};
			}
			undoCanvasShift();
		}
		
		function onMouseDownBack(event) {}
	}
	# class ControlContainer
	
	
	class ModalGui : ControlContainer
	{
	public:
	
		function updateXY()
		{
			x = ((canvas.width()  -  width*guiScale) // 2) / guiScale;
			y = ((canvas.height() - height*guiScale) // 2) / guiScale;
			#x = (canvas.width()/guiScale - width) / 2;
			#y = (canvas.height()/guiScale - height) / 2;
		}
	
		constructor(width, height, controls=[])
			: super(width=width, height=height, controls=controls)
		{
			updateXY();
		}
		
		
		function onMouseDown(event)
		{
			if event.buttons.size() == 1 then
			if not this.isInside(event.x, event.y) then
				gui.closeModal();
				
			super.onMouseDown(event);
		}
	
		# specific ModalGui function
		# called when parent is resized
		function onScreenChange()
		{
			updateXY();
		}
		
		# specific ModalGui function
		# called when gui is closed
		function onClose() {}
	}
	
	class ModalDlg : ModalGui
	{
	public:
		var caption;
	
		constructor(caption, width, height, controls=[])
			: super(width=width, height=height, controls=controls)
		{
			this.caption = caption;
			updateXY();
		}
		
		function render(parentDirty)
		{
			if parentDirty then
			{
				doCanvasShift();
				
				var gs = guiScale;
			
				#draw background
			
				canvas.setFillColor(0.2, 0.2, 0.2, 1);
				canvas.fillRect(0, 0, width*gs, height*gs);
				
				canvas.setFillColor(0.3, 0.3, 0.3, 1);
				canvas.fillRect(0, 0, width*gs, 1.75*gs);
				
				canvas.setFillColor(1, 1, 1, 1);
				canvas.setFont("helvetica", guiScale*0.8);
				canvas.setTextAlign("center");
				canvas.text(width/2*gs, 0.5*gs, caption);
				
				undoCanvasShift();
			}
			
			super.render(parentDirty);
		}
	}
}
# namespace gui
	
	
	
	
#[file] gui.tscript#GuiSettings
namespace gui
{
	class GuiSettings : ModalDlg
	{
	public:
		
		constructor()
			: super(
				caption="Settings",
				width=10, height=7.25,
				controls={
					sclBlockSize: ControlSlider(
						x=0.5, y=3.25, width=9, 
						min=8, max=100, step=1,
						value=disp.dispScale,
						onChange=function(value)
						{
							disp.dispScale = value;
							initScale();
							markCompletelyDirtyScreen();
							gui.markBackDirty();
							#gui.markCompletelyDirty();
						}
					),
					sclGuiScale: ControlSlider(
						x=0.5, y=5.75, width=9, 
						min=16, max=80, step=1,
						value=guiScale,
						onChange=function(value)
						{
							guiScale = value;
							gui.markScreenDirty();
						}
					)
				}
			)
		{}
	
		function render(parentDirty)
		{
			super.render(parentDirty);
			
			if parentDirty then
			{
				doCanvasShift();
			
				var s = guiScale;
				
				#draw captions				
				canvas.setFillColor(1, 1, 1, 1);
				
				canvas.setFont("helvetica", guiScale*0.7);
				canvas.setTextAlign("left");
				canvas.text(0.5*s, 2.3*s, "Block Scale");
				
				canvas.text(0.5*s, 4.8*s, "Gui Scale");
			
				undoCanvasShift();
			}
		}
	}
	
}
# namespace gui





#[file] inventory.tscript#gui.GuiInventory
namespace gui
{
	
	class ItemPanel : Control
	{
	public:
		var slots;
		var cols, rows;
		var focusedSlot = null; # currently hovered slot
		var selectedSlot = null; # currently selected slot
		var onItemSelect; # return true to select slot,
		                  # return false to keep previous selected
						  # return null to remove selection
		var onItemDeselect;
		var slotHighlightFunc;
		
		var slotsDirty;
		
		constructor(slots, cols, rows, x=0, y=0,
					onItemSelect=null, onItemDeselect=null, slotHighlightFunc=null)
			: super(x=x, y=y, width=cols*1.125, height=rows*1.125)
		{
			this.slots = slots;
			
			this.cols = cols;
			this.rows = rows;
			
			if onItemSelect == null then
				this.onItemSelect = function(self, index, stack, button) { return true; };
			else
				this.onItemSelect = onItemSelect;
				
			if onItemDeselect == null then
				this.onItemDeselect = function(self, button) {};
			else
				this.onItemDeselect = onItemDeselect;
			
			if slotHighlightFunc == null then
				this.slotHighlightFunc = function(i) { return false; };
			else
				this.slotHighlightFunc = slotHighlightFunc;
				
			slotsDirty = {};
		}
		
		function markSlotDirty(i)
		{
			if i != null then slotsDirty[String(i)] = i;
		}
		
		
		
		function handleItemSelect(slotIndex, button)
		{
			return onItemSelect(this, slots, slotIndex, button);
		}
		
		function handleItemDeselect(button)
		{
			return onItemDeselect(this, button);	
		}
		
		
		function onMouseMove(event)
		{
			# cell size;
			var sc = 1.125*guiScale;
			var xx = (event.x-this.x*guiScale) // sc;
			var yy = (event.y-this.y*guiScale) // sc;
			var newSlot = null;
			if 0 <= xx then if xx < cols then
			if 0 <= yy then if yy < rows then
			{
				newSlot = Integer(xx + yy*cols);
				
				if newSlot >= slots.size() then newSlot = null;
			}
			
			if newSlot != focusedSlot then
			{
				markSlotDirty(focusedSlot);
				markSlotDirty(newSlot);
				focusedSlot = newSlot;
				return true;
			}
		}
		
		function onLostFocus()
		{
			if focusedSlot != null then
			{
				markSlotDirty(focusedSlot);
				focusedSlot = null;
				return true;
			}
		}
		
		function onMouseDown(event)
		{
			# cell size;
			var sc = 1.125*guiScale;
			var xx = (event.x-this.x*guiScale) // sc;
			var yy = (event.y-this.y*guiScale) // sc;
			var newSlot = null;
			if 0 <= xx then if xx < cols then
			if 0 <= yy then if yy < rows then
			{
				newSlot = Integer(xx + yy*cols);
				
				if newSlot >= slots.size() then newSlot = null;
			}
				
			if newSlot != selectedSlot and newSlot != null then
			{
				markSlotDirty(selectedSlot);
				markSlotDirty(newSlot);
				var chgx = handleItemSelect(newSlot, event.button);
				if chgx == null then
					selectedSlot = null;
				else if chgx == true then
					selectedSlot = newSlot;
				return true;
			}
			else
			{
				markSlotDirty(selectedSlot);
				handleItemDeselect(event.button);
				selectedSlot = null;
				return true;
			}	
		}
		
		function onKeyDown(event)
		{
			var isEnter = event.key == "Enter";
			var isSpace = event.key == " ";
			if isEnter or isSpace then
			{
				var simButton = "left";
				if isSpace then simButton = "right";
				
				if selectedSlot != focusedSlot then
				{
					markSlotDirty(selectedSlot);
					markSlotDirty(focusedSlot);

					var chgx = handleItemSelect(focusedSlot, simButton);
					if chgx == null then
						selectedSlot = null;
					else if chgx == true then
						selectedSlot = focusedSlot;
					return true;
				}
				else
				{
					markSlotDirty(selectedSlot);
					handleItemDeselect(simButton);
					selectedSlot = null;
					return true;
				}
			}	
			
			var newSlot = focusedSlot;
			if newSlot == null then newSlot = 0;
			
			if event.key == "ArrowLeft" then
				newSlot = math.max(0, newSlot-1);
			else if event.key == "ArrowRight" then
				newSlot = math.min(newSlot+1, slots.size()-1);
			else if event.key == "ArrowUp" then
				newSlot = math.max(0, newSlot-cols);
			else if event.key == "ArrowDown" then
				newSlot = math.min(newSlot+cols, slots.size()-1);
			
			if newSlot != focusedSlot then
			{
				markSlotDirty(focusedSlot);
				markSlotDirty(newSlot);
				focusedSlot = newSlot;
				return true;
			}
		}
		
		
		function render(parentDirty)
		{
			if not parentDirty and slotsDirty.size() == 0 then return;
			
			var gs = guiScale;
			var sc = 1.125*gs;

			doCanvasShift();
			#draw boxes
			var scl = guiScale;
			var px = scl*0.0625;
			canvas.shift(px, px);
			
			var renderBackground = function[scl, focusedSlot, slotHighlightFunc](i)
			{			
				if i == focusedSlot then
					canvas.setFillColor(1, 1, 1, 1);
				else if slotHighlightFunc(i) then
					canvas.setFillColor(0.3, 0.3, 0.3, 1);
				else
					canvas.setFillColor(0.15, 0.15, 0.15, 1);
				
				canvas.fillRect(-0.0625*scl, -0.0625*scl, 1.125*scl, 1.125*scl);
				canvas.setFillColor(0.1, 0.1, 0.1, 1);
				canvas.fillRect(0, 0, scl, scl);
			};
			
			if parentDirty then
			{
				var x = 0, y = 0;
				for var i in slots.keys() do
				{
					renderBackground(i);

					x += 1;
					canvas.shift(sc, 0);
					if x >= cols then {
						x = 0; y += 1;
						canvas.shift(-sc*cols, sc);
					}
				}
				canvas.shift(-sc*x, -sc*y);

				#draw items
				x = 0; y = 0;
				for var i in slots.keys() do
				{
					var b = slots[i];

					if b != null then
					{
						canvas.scale(scl);
						b.renderItem();
						canvas.scale(1/scl);
					}


					x += 1;
					canvas.shift(sc, 0);
					if x >= cols then {
						x = 0; y += 1;
						canvas.shift(-sc*cols, sc);
					}
				}
				canvas.shift(-sc*x, -sc*y);

				# draw amount

				canvas.setTextAlign("right");
				canvas.setFont("helvetica", gui.guiScale*2/3);
				canvas.shift(px*15, px*7);
				for var k in 0:2 do
				{
					canvas.shift(-k*px, -k*px);
					x = 0; y = 0;
					canvas.setFillColor(k, k, 0.5);

					for var i in slots.keys() do
					{
						var b = slots[i];

						if b != null then inventory.dispItem.renderAmount(b);

						x += 1;
						canvas.shift(sc, 0);
						if x >= cols then {
							x = 0; y += 1;
							canvas.shift(-sc*cols, sc);
						}
					}
					canvas.shift(-sc*x, -sc*y);
					canvas.shift(k*px, k*px);
				}
				canvas.shift(-px*15, -px*7);
				# end draw amount

			}
			else
			{
				var lastX=0, lastY=0;
				for var i in slotsDirty.values() do
				{
					var x = i % cols, y = i // cols;
					canvas.shift(sc*(x-lastX), sc*(y-lastY));
					lastX = x; lastY = y;
					
					var b = slots[i];

					renderBackground(i);
					if b != null then
					{
						canvas.scale(scl);
						b.renderItem();
						canvas.scale(1/scl);	
						if b.amount > 1 then
						{
						
							canvas.setTextAlign("right");
							canvas.setFont("helvetica", gui.guiScale*2/3);
							canvas.shift(px*15, px*7);
							for var k in 0:2 do
							{
								canvas.setFillColor(k, k, 0.5);
								canvas.shift(-k*px, -k*px);
								inventory.dispItem.renderAmount(b);
								canvas.shift(k*px, k*px);
							}
							canvas.shift(-px*15, -px*7);
						}
					}
					
				}
				canvas.shift(-sc*lastX, -sc*lastY);
			}
			canvas.shift(-px, -px);
			
			slotsDirty = {};
			
			if selectedSlot != null then
			{
				var sX = selectedSlot %  cols;
				var sY = selectedSlot // cols;
				var l = math.sin(time()/300)*0.3+0.5;
				canvas.setFillColor(1, 1, 1, l);
				canvas.fillRect(sc*sX, sc*sY, sc, sc);
				markSlotDirty(selectedSlot);
			}
			
			undoCanvasShift();
		}
		
		function onTimer(event)
		{
			if selectedSlot != null then return true;
		}
	}
	# class ItemPanel
	
	
	class GuiInventory : ModalDlg
	{
	public:
		var entity;
		var slots;
		var selectedPanel, selectedSlotIndex;
		var panCrafting, panCrafted;
		
		constructor(caption, entity, width, height, controls, panCrafting, panCrafted)
			: super(
				caption=caption,
				width=width, height=height,
				controls=controls
			)
		{
			this.entity = entity;
			
			if panCrafting != null then
			{
				this.panCrafting = controls[panCrafting];
				this.panCrafted = controls[panCrafted];
			}
		}
		
		
		# only called, when panCrafting is given
		function updateRecipe() {}
		function onCraft(panCtrl, slots, slotIndex, button) {}
			
		# Selection of the crafted slot
		function panelOnItemSelectX(panCtrl, slots, slotIndex, button)
		{
			if selectedPanel != null then
			{
				selectedPanel.markSlotDirty(selectedSlotIndex);
				selectedPanel.selectedSlot = null;
				markDirtyCtrl(selectedPanel);
			}
			
			selectedPanel = panCtrl;
			selectedSlotIndex = slotIndex;
			return true;
		}
		
		function panelOnItemSelect(panCtrl, slots, slotIndex, button)
		{
			if selectedPanel == null then
			{
				# Select new slot
				selectedPanel = panCtrl;
				selectedSlotIndex = slotIndex;
				return true;
			}
			else if selectedPanel.slots[selectedSlotIndex] == null then
			{	
				# Select new slot, old selected slot was empty
				selectedPanel.markSlotDirty(selectedSlotIndex);
				selectedPanel.selectedSlot = null;
				markDirtyCtrl(selectedPanel);
				
				selectedPanel = panCtrl;
				selectedSlotIndex = slotIndex;
				return true;
			}
			else
			{
				# Move slot contents
				
				var a = panCtrl.slots[slotIndex];
				var b = selectedPanel.slots[selectedSlotIndex];
				#assert(b != null);
				
				if panCrafted != null then
				if selectedPanel == panCrafted then
				{
					# subclass call
					this.onCraft(panCtrl, slots, slotIndex, button);
					return;
				}
				
				{
					assert(b != null);
					# Move slot contents to new slot
					var keepSelection = false;

					var a = panCtrl.slots[slotIndex];
					var b = selectedPanel.slots[selectedSlotIndex];
					var addItemAmount = false;
					if a != null and b != null and a != b then addItemAmount = a.item == b.item;

					if addItemAmount then
					{
						if button == "right" then
						{
							if selectedPanel.slots[selectedSlotIndex].decrease() then
								selectedPanel.slots[selectedSlotIndex] = null;
							panCtrl.slots[slotIndex].increase(1);
							keepSelection = true;
						}
						else
						{
							selectedPanel.slots[selectedSlotIndex] = null;
							panCtrl.slots[slotIndex].increase(b.amount);	
						}
					}
					else
					{
						if button == "right" and a == null then
						{
							if selectedPanel.slots[selectedSlotIndex].decrease() then
								selectedPanel.slots[selectedSlotIndex] = null;
							panCtrl.slots[slotIndex] = inventory.ItemStack(1, b.item);
							keepSelection = true;
						}
						else
						{
							selectedPanel.slots[selectedSlotIndex] = a;
							panCtrl.slots[slotIndex] = b;
						}
					}

					selectedPanel.markSlotDirty(selectedSlotIndex);
					if not keepSelection then selectedPanel.selectedSlot = null;
					markDirtyCtrl(selectedPanel);

					panCtrl.markSlotDirty(slotIndex);
					markDirtyCtrl(panCtrl);

					this.updateRecipe();

					if not keepSelection then selectedPanel = null;
					return false; #null; # do not select slot
				}
			}
		}
		
		function panelOnItemDeselect(panCtrl, button)
		{
			selectedPanel = null;
		}
		
		function onMouseDownBack(event)
		{
			if selectedPanel != null then
			{
				selectedPanel.markSlotDirty(selectedPanel.selectedSlot);
				selectedPanel.selectedSlot = null;
				markDirtyCtrl(selectedPanel);
				selectedPanel = null;

				return true;
			}
		}
	}
	
	
	class GuiCraftingInventory : GuiInventory
	{
	public:
		var currentRecipe = null;
		var craftingCols, craftingRows;
		
		
		#nonsuper slots, hotbarSize, backpackSize, craftingCols, craftingRows
		constructor(caption, entity, slots, hotbarSize, backpackSize, craftingCols, craftingRows)
			: super(
				caption=caption,
				entity=entity,
				panCrafting="panCrafting",
				panCrafted="panCrafted",
				width=0.5 + 10*1.125 + 0.5, height=2.25+craftingRows*1.125+0.5+6*1.125+0.5,
				controls={
					panCrafting: ItemPanel(
						x=0.5 + 1.125*(10-2-craftingCols)/2, y=2.25,
						cols=craftingCols, rows=craftingRows,
						slots=Array(craftingCols*craftingRows),
						onItemSelect=this.panelOnItemSelect,
						onItemDeselect=this.panelOnItemDeselect
					),
					panCrafted: ItemPanel(
						x=0.5 + 1.125*((10-2-craftingCols)/2+craftingCols+1), y=2.25+1.125*(craftingRows-1)/2,
						cols=1, rows=1,
						slots=[null],
						onItemSelect=this.panelOnItemSelectX,
						onItemDeselect=this.panelOnItemDeselect
					),
					panInventory: ItemPanel(
						x=0.5, y=2.25+craftingRows*1.125+0.5,
						cols=10, rows=6,
						slots=slots,
						slotHighlightFunc=function[hotbarSize](index)
						{
							return index < hotbarSize;	
						},
						onItemSelect=this.panelOnItemSelect,
						onItemDeselect=this.panelOnItemDeselect
					),
				}
			)
		{
			this.entity = entity;
			this.slots = slots;
			this.craftingCols = craftingCols; this.craftingRows = craftingRows;
		}
		
		
		function updateRecipe()
		{
			if panCrafting == null then return;
			
			currentRecipe = recipes.getRecipe(panCrafting.slots, craftingCols, craftingRows);
			if currentRecipe == null then
				panCrafted.slots[0] = null;
			else
				panCrafted.slots[0] = currentRecipe.result.copy();
				
			panCrafted.markSlotDirty(0);
			markDirtyCtrl(panCrafted);
		}
		
		
		function onCraft(panCtrl, slots, slotIndex, button)
		{
			var a = panCtrl.slots[slotIndex];
			var b = selectedPanel.slots[selectedSlotIndex];
				
			# Selected slot is the crafted slot, move contents when possible
			#assert(currentRecipe != null); # slot should be nonempty only when recipe exists

			if a != null then if a.item != b.item then return; # different items

			# consume crafting ingredients
			#var panCrafting = controls["panCrafting"];
			recipes.consumeRecipe(panCrafting.slots, craftingCols, craftingRows, currentRecipe,
								  panCrafting.markSlotDirty);
			markDirtyCtrl(panCrafting);


			# move contents to new slot
			if a == null then
				panCtrl.slots[slotIndex] = b;
			else
				a.increase(b.amount);
			panCtrl.markSlotDirty(slotIndex);
			markDirtyCtrl(panCtrl);


			# update recipe
			this.updateRecipe();

			if button != "right" then 
			{
				selectedPanel.selectedSlot = null;
				selectedPanel = null;
			}
		}
		
		
		function onClose()
		{
			var panCrafting = controls["panCrafting"];
			for var s in panCrafting.slots do
			{
				if s != null then
				{
					entity.collectItem(s.item, s.amount);
				}
			}
		}
		
		
		function render(parentDirty)
		{
			super.render(parentDirty);
			
			if parentDirty then
			{
				# Draw Arrow
				doCanvasShift();
				var gs = guiScale*1.125;
				var xx = (0.5  + 1.125*((10-2-craftingCols)/2 + craftingCols))*guiScale;
				var yy = (2.25 + 1.125*(craftingRows-1)/2)*guiScale;
				canvas.shift(xx, yy);
				canvas.setFillColor(1, 1, 1);
				canvas.fillArea([[0.3*gs, 0.3*gs], [0.3*gs, 0.7*gs], [0.7*gs, 0.5*gs]]);
				canvas.shift(-xx, -yy);
				undoCanvasShift();
			}
		}
	}
	
	class GuiContainerInventory : GuiInventory
	{
	public:
	
		#nonsuper slots, hotbarSize, backpackSize, craftingCols, craftingRows
		constructor(caption, entity, slots, hotbarSize, backpackSize, containerSlots, containerCols, containerRows)
			: super(
				caption=caption,
				entity=entity,
				panCrafting=null,
				panCrafted=null,
				width=0.5 + 10*1.125 + 0.5, height=2.25+containerRows*1.125+0.5+6*1.125+0.5,
				controls={
					panContainer: ItemPanel(
						x=0.5 + 1.125*(10-containerCols)/2, y=2.25,
						cols=containerCols, rows=containerRows,
						slots=containerSlots,
						onItemSelect=this.panelOnItemSelect,
						onItemDeselect=this.panelOnItemDeselect
					),
					panInventory: ItemPanel(
						x=0.5, y=2.25+containerRows*1.125+0.5,
						cols=10, rows=6,
						slots=slots,
						slotHighlightFunc=function[hotbarSize](index)
						{
							return index < hotbarSize;	
						},
						onItemSelect=this.panelOnItemSelect,
						onItemDeselect=this.panelOnItemDeselect
					),
				}
			)
		{
			this.entity = entity;
			this.slots = slots;
		}
	}
}
# namespace gui



#[file] world.tscript#serialization
namespace world
{
	function serializeChunkBlocks(chunk)
	{
		var chunkData = chunk.blocks;
		
		# RLE encoding
		var str = "";
		var lastChar = ""; var lastCharCount = 0;
		for var b in chunkData do
		{
			var thisChar = b.char;
			if thisChar != lastChar then
			{
				if lastCharCount > 1 then str += String(lastCharCount);
				str += lastChar;
				
				lastChar = thisChar;
				lastCharCount = 1;
			}
			else
				lastCharCount += 1;
		}
		if lastCharCount > 1 then str += String(lastCharCount);
		str += lastChar;
		
		return str;
	}
	function deserializeChunkBlocks(sChunkData)
	{
		var data = [];
		var count = 0;
		for var c in sChunkData.split("") do
		{
			if "0" <= c and c <= "9" then
			{
				count = count*10 + (c[0] and 15);
			}
			else
			{
				count = math.max(1, count);
				if not Block.registry.has(c) then
					error("World might be from a newer version, there is no block '" + c + "'"); # TODO handle?
					
				var block = Block.registry[c];
				data = Array.concat(data, Array(count, block));
				count = 0;
			}
		}
		
		if data.size() != 256 then error("World data has been corrupted"); # TODO handle?
		return world.Chunk(data);
	}
	function serializeChunkData(chunk)
	{
		var dictData = {};
		for var key in chunk.data.keys() do
		{
			var index = Integer(key);
			dictData[key] = chunk.blocks[index].blockDataHandler.serializeBlockData(chunk.data[key]);
		}
		return dictData;
	}
	function deserializeChunkData(chunk, dictData)
	{
		for var key in dictData.keys() do
		{
			var index = Integer(key);
			chunk.data[key] = chunk.blocks[index].blockDataHandler.deserializeBlockData(dictData[key]);
		}
		return chunk;
	}
	
	function serializeChunk(chunk)
	{
		if chunk.data.size() == 0 then
			return serializeChunkBlocks(chunk);
		else
		{
			return {"blocks": serializeChunkBlocks(chunk),
					"data":   serializeChunkData(chunk)};
		}
	}
	function deserializeChunk(sChunkData)
	{
		if Type(sChunkData) == String then
		{
			return deserializeChunkBlocks(sChunkData);
		}
		else
		{
			var chunk = deserializeChunkBlocks(sChunkData["blocks"]);
			if(sChunkData.has("data")) then deserializeChunkData(chunk, sChunkData["data"]);
			return chunk;
		}
	}
	
	function serializeInventory(slots)
	{
		var str = "";
		var emptyCount = 0;
		for var s in slots do
		{
			if s == null then
			{
				emptyCount += 1;
			}
			else
			{
				if emptyCount != 0 then
				{
					if emptyCount != 1 then str += emptyCount;
					str += " ";	
					emptyCount = 0;
				}
				if s.amount != 1 then str += s.amount;
				str += s.item.char;
			}
		}
		if emptyCount != 0 then
		{
			str += emptyCount + " ";	
		}
		
		return str;
	}
	
	function deserializeInventory(jsonString)
	{
		var slots = [];
		var count = 0;
		for var c in jsonString.split("") do
		{
			if "0" <= c and c <= "9" then
			{
				count = count*10 + (c[0] and 15);
			}
			else
			{
				count = math.max(1, count);
				if c == " " then
				{
					slots = Array.concat(slots, Array(count, null));
				}
				else
				{
					if not Block.registry.has(c) then
						error("World might be from a newer version, there is no block '" + c + "'"); # TODO handle?
					
					var stack = inventory.ItemStack(count, Block.registry[c]);
					slots.push(stack);
				}
				count = 0;	
			}
		}
		return slots;
	}
	
	function serializePlayer(player)
	{
		return {
			"x": player.x, "y": player.y,
			"inventory": serializeInventory(player.inventorySlots)
		};
	}
	
	function deserializePlayer(json)
	{
		var p;
		if Type(json) == Array then
			# old, deprecated, to be removed
			p = entities.EntityPlayer(json[0], json[0]);
		else
		{
			p = entities.EntityPlayer(json["x"], json["y"]);
			p.inventorySlots = deserializeInventory(json["inventory"]);
		}
			
		# velocity?
		return p;
	}
	
	function serializeWorld(w)
	{
		print("serializing world...");
		var sChunks = {};
		if settings.storeChangedChunksOnly then
		{	
			for var k in w.chunks.keys() do
			{
				var pos = util.splitPos(k);
				if chunkUtil.hasChanged(w, pos[0], pos[1], w.chunks[k]) then
					sChunks[k] = serializeChunk(w.chunks[k]);
			}
		}
		else
			for var k in w.chunks.keys() do	sChunks[k] = serializeChunk(w.chunks[k]);
		
		var serialized = {
			"version": 0,
			"seed": w.chunkGenerator.seed,
			"chunks": sChunks,
			"player": serializePlayer(w.players[0]) # save velocity?
		};
		print("serialization finished");
		print(util.jsonToString(serialized));
		return serialized;
	}
	
	# changes global state
	function deserializeWorld(worldData)
	{
		print("deserializing world...");
		
		if worldData["version"] != 0 then error("World version not supported");
		
		#var gen = {
		#	flat: world.generators.BaseGenerator,#
		#	#...
		#}[worldData["generator"]];
		var worldSeed = Integer(worldData["seed"]);
		var generator = world.generators.PopulatedLandscape(worldSeed);
		
		var sChunks = worldData["chunks"];
		var chunks = {};
		for var k in sChunks.keys() do
		{
			chunks[k] = deserializeChunk(sChunks[k]);
		}
		
		# TODO move player to entity array
		var player = deserializePlayer(worldData["player"]);
		
		var w = world.World(generator, chunks);
		w.entities.push(player);
		w.players.push(player);
		print("deserialization finished");
		return w;
	}
	
	
	# TODO move elsewhere
	function bindPlayer(p)
	{
		thePlayer = p;
		theWorld.entities.push(thePlayer);
		theWorld.players.push(thePlayer);
		inventory.bindEntityInventory(thePlayer);
		scrollTo(p.x, p.y);
	}
	
	# binds world and the first player
	function bindWorldWithPlayer(w)
	{
		theWorld = w;	
		bindPlayer(w.players[0]);
	}
	
	function bindNewWorld()
	{
		var p = entities.EntityPlayer(0, -16);
		{
			p.collectItem(vanilla.BRICKS, 999);
		}

		theWorld = world.randomWorld();
		world.bindPlayer(p);	
	}
}







#[file] blockdata.tscript
namespace blockdata
{
	class Handler
	{
	public:
		# function that creates empty data
		function createBlockData() { return null; }
		
		# function that returns a json object, that represents the given data
		function serializeBlockData(data) { return null; }
		# function that returns the data, that is represented by the given json object
		function deserializeBlockData(json) { return null; }
	}
	class InventoryHandler : Handler
	{
	public:
		var inventorySize;
		
		constructor(inventorySize)
		{
			this.inventorySize = inventorySize;
		}
		
		function createBlockData()
		{
			return Array(inventorySize, null);
		}
		
		function serializeBlockData(data)
		{
			return world.serializeInventory(data);
		}
		
		function deserializeBlockData(json)
		{
			return world.deserializeInventory(json);
		}
	}
}






#[file] gamemenu.tscript
namespace gamemenu
{
	
	function registerWorld(worldName)
	{
		var worldlist = [];
		if exists("latticecraft.worldlist") then
			worldlist = load("latticecraft.worldlist");

		var indx = util.find(worldlist, worldName);
		if indx == 0 then return; # already at the top
		if indx != null then
			worldlist = Array.concat(worldlist[0:indx], worldlist[indx+1:worldlist.size()]);
			
		worldlist = Array.concat([worldName], worldlist);
		save("latticecraft.worldlist", worldlist);
	}
	
	class GuiWorldSelection : gui.ModalDlg
	{
	public:
		constructor(caption, onSelect, enableNonexisting)
			: super(
				caption=caption,
				width=10, height=2.25+7+0.5+1+0.5,
				controls={
					lstWorlds: gui.ControlList(
						x=0.5, y=2.25,
						width=9, height=7,
						emptyText="There are no world saves yet",
						onSelect=function[onSelect](i, value)
						{
							if onSelect(value) == true then gui.closeModal();
						}
					),
					txtWorld: gui.ControlTextInput(
						x = 0.5, y=9.75,
						width=9,
						promptText="Enter world name",
						onEnter=function[onSelect](value)
						{
							if onSelect(value) == true then gui.closeModal();
						}
					)
				}
			)
		{
			var lstWorlds = controls["lstWorlds"];
		
			var worldlist = [];
			if exists("latticecraft.worldlist") then
				worldlist = load("latticecraft.worldlist");
				
			lstWorlds.entries = worldlist;
		}
		
		function render(parentDirty)
		{
			super.render(parentDirty);
			
			
		}
	}
	
	class GuiGameMenu : gui.ModalDlg
	{
	public:
		
		constructor()
			: super(
				caption="Game Menu",
				width=10, height=9.75,
				controls={
					cmdSave: gui.ControlButton(
						x=0.5, y=2.25, width=9,
						caption="Save World",
						onClick=function()
						{
							
							
							gui.setModal(GuiWorldSelection(
								caption="Save World",
								onSelect=function(worldName)
								{
									print("Saving...");
									if exists(worldName) then
									if not confirm("Do you want to overwrite the world") then return;

									save(worldName, world.serializeWorld(theWorld));
									registerWorld(worldName);
									return true;
								},
								enableNonexisting=true
							));
							
							
						}
					),
					cmdLoad: gui.ControlButton(
						x=0.5, y=3.75, width=9, 
						caption="Load World",
						onClick=function()
						{
							gui.setModal(GuiWorldSelection(
								caption="Load World",
								onSelect=function(worldName)
								{
									print("Loading...");
									# "latticecraft.world"
									if exists(worldName) then
									{
										world.bindWorldWithPlayer(
											world.deserializeWorld(load(worldName))
										);
										registerWorld(worldName);
										return true;
									}
									else
										alert("'" + worldName + "' does not exist");
								},
								enableNonexisting=false
							));
						}
					),
					cmdNewWorld: gui.ControlButton(
						x=0.5, y=5.25, width=9,
						caption="New World",
						onClick=function()
						{
							world.bindNewWorld();
							gui.closeModal();
						}
					),
					cmdSettings: gui.ControlButton(
						x=0.5, y=6.75, width=9,
						caption="Settings",
						onClick=function()
						{
							#gui.closeModal();
							gui.setModal(gui.GuiSettings());
						}
					),
					cmdQuit: gui.ControlButton(
						x=0.5, y=8.25, width=9,
						caption="Quit",
						onClick=function()
						{
							quitEventMode();
						}
					),
				}
			)
		{}
	}
}


#[file] vanilla.tscript#blockBehavior
namespace vanilla
{

	function growTree(x, y)
	{
		if theWorld.getBlock(x, y-1) != vanilla.AIR then return;
		theWorld.setBlock(x, y, vanilla.LOG);
		
		
		var tree = [" ### ",
					"#####",
					"##%##",
					"##%##",
					" #%# ",
					"  |  ",
					"  |  ",
					"  |  "];

		var mapTree = {"#": vanilla.LEAVES,
					   "|": vanilla.LOG,
					   "%": vanilla.LOG_LEAVES};

		var xx, yy;

		yy=y-8;
		for var r in tree do
		{
			xx=x-2;
			for var b in r.split("") do
			{
				if mapTree.has(b) then
				{
					
					var blk = mapTree[b];
					var wblk = theWorld.getBlock(xx, yy);
				
					if wblk == vanilla.AIR then
						theWorld.setBlock(xx, yy, blk);
					else if blk == vanilla.LEAVES and wblk == vanilla.LOG then
						theWorld.setBlock(xx, yy, vanilla.LOG_LEAVES);
					else if blk == vanilla.LOG and wblk == vanilla.LEAVES then
						theWorld.setBlock(xx, yy, vanilla.LOG_LEAVES);
					else if blk == vanilla.LOG_LEAVES and wblk == vanilla.LOG then
						theWorld.setBlock(xx, yy, vanilla.LOG_LEAVES);
					else if blk == vanilla.LOG_LEAVES and wblk == vanilla.LEAVES then
						theWorld.setBlock(xx, yy, vanilla.LOG_LEAVES);
						
						
				}
				xx+=1;
			}
			yy+=1;
		}	
	}
	
	vanilla.SAPLING.tick = function(x, y)
	{
		growTree(x, y);
	};
	
	
	vanilla.DIRT.tick = function(x, y)
	{
		if not theWorld.getBlock(x, y-1).tags.has("solid") then
		{
			for var xx in [x-1, x+1] do
			for var yy in  y-1: y+2  do
			{
				if theWorld.getBlock(xx, yy) == vanilla.GRASS then
				{
					theWorld.setBlock(x, y, vanilla.GRASS);
					return;
				}
			}
		}
	};
	
	vanilla.GRASS.tick = function(x, y)
	{
		if theWorld.getBlock(x, y-1).tags.has("solid") then
			theWorld.setBlock(x, y, vanilla.DIRT);
	};
	
	
	vanilla.SAPLING.place = function(x, y)
	{
		var placeable = vanilla.isSoil(theWorld.getBlock(x, y+1));
		if placeable then
			theWorld.setBlockUpdate(x, y, vanilla.SAPLING);
			
		return placeable;
	};
	
	vanilla.WATER.update = function(x, y)
	{
		if theWorld.getBlock(x, y+1) == vanilla.AIR then
		{
			theWorld.setBlock(x, y, vanilla.AIR);
			theWorld.setBlock(x, y+1, vanilla.WATER);
			theWorld.updateNeighbors(x, y);
			#world.updateNeighbors(x, y+1);
			return;
		}
		
		var pm = 1; if math.random() < 0.5 then pm=-1;
		for var i in 0:2 do
		{
			if theWorld.getBlock(x+pm, y) == vanilla.AIR then
			{
				if theWorld.getBlock(x+pm, y+1) == vanilla.AIR then
				{
					theWorld.setBlockUpdate(x, y, vanilla.AIR);
					theWorld.setBlockUpdate(x+pm, y+1, vanilla.WATER);
					return;
				}
				
				theWorld.setBlock(x, y, vanilla.AIR);
				theWorld.setBlock(x+pm, y, vanilla.WATER);
				theWorld.update(x, y-1);
				theWorld.update(x, y);
				theWorld.update(x+pm, y);
				theWorld.update(x-pm, y);
# 				theWorld.update(x, y-1);
# 				if math.random() < 0.99 then
# 				{
# 					theWorld.updateNeighbors(x, y);
# 					theWorld.updateNeighbors(x+pm, y);
# 				}
				return;
			}
			pm = -pm;
		}
	};
	vanilla.WATER.tick=vanilla.WATER.update;
	
	
	vanilla.SAND.update = function(x, y)
	{
		if theWorld.getBlock(x, y+1) == vanilla.AIR then
		{
			theWorld.setBlockUpdate(x, y, vanilla.AIR);
			theWorld.setBlockUpdate(x, y+1, vanilla.SAND);
			return;
		}
		
		var pm = 1; if math.random() < 0.5 then pm=-1;
		for var i in 0:Integer(math.random()*2)+1 do
		{
			if theWorld.getBlock(x+pm, y) == vanilla.AIR then
			{
				if theWorld.getBlock(x+pm, y+1) == vanilla.AIR then
				{
					theWorld.setBlockUpdate(x, y, vanilla.AIR);
					theWorld.setBlockUpdate(x+pm, y+1, vanilla.SAND);
					return;
				}
	# 			else
	# 			{
	# 				theWorld.setBlock(x, y, vanilla.AIR);
	# 				theWorld.setBlock(x+pm, y, vanilla.SAND);
	# 				theWorld.update(x, y-1);
	# 				if math.random() < 0.5 then
	# 				{
	# 					theWorld.updateNeighbors(x, y);
	# 					theWorld.updateNeighbors(x+pm, y);
	# 				}
	# 			}
			}
			pm = -pm;
		}
	};
	vanilla.SAND.tick = vanilla.SAND.update;
	
	
	vanilla.CRAFTING_TABLE.onClick=function(x, y)
	{
		# TODO Open crafting gui here	
		gui.setModal(gui.GuiCraftingInventory(
			"Crafting Table",
			thePlayer,
			inventory.slots,
			inventory.hotbarSize, 
			inventory.backpackSize,
			3, 3
		));
	};
	
	vanilla.CHEST.blockDataHandler=blockdata.InventoryHandler(10*3);
	
	vanilla.CHEST.onClick=function(x, y)
	{
		# TODO Open crafting gui here	
		gui.setModal(gui.GuiContainerInventory(
			"Chest",
			thePlayer,
			inventory.slots,
			inventory.hotbarSize, 
			inventory.backpackSize,
			theWorld.getBlockData(x, y),
			10, 3
		));
	};
}
#[file] mod.tscript#blockBehavior
namespace mod
{
	# add block behavior here
}
#[file] eventHandlers.tscript

namespace eventHandlers
{
	# helper functions
	function adjustKey(k)
	{
		if k.size() == 1 then return String.fromUnicode(util.toLowerChar(k[0]));
		return k;
	}
	# end helper functions
	
	
	
	setEventHandler("canvas.mousedown", function(event)
	{
		if gui.current == null then
		{
			updateXY(event);
			if event.button == "left" then 
			{
				if inventory.isOnGui(mouseX, mouseY) then
				{
					inventory.onMouseDown(mouseX, mouseY);
					mouseMode = mouseModes.hotbar;	
				} else {
					mouseTime = time();
					mouseMode = null;
				}
			}
		}
		else
		{
			# BUG There is a bug when the inventory is opened and
			# the mouse is not moved and then clicked, maybe a bug
			# TSCRIPT
			gui.current.onMouseDown(event);	
		}
	});


	setEventHandler("canvas.mousemove", function(event)
	{
		if gui.current == null then
		{
			updateXY(event);
			if mouseTime != null then
			{
				userAction(selX, selY);
			}
		}
		else
		{
			gui.current.onMouseMove(event);
		}
	});


	setEventHandler("canvas.mouseup", function(event)
	{
		if gui.current == null then
		{
			updateXY(event);
			if event.button == "left" then 
			{
				mouseTrig();
				mouseTime = null;
				mouseMode = null;
				#selX = null; selY = null;
			}
		}
		else
		{
			gui.current.onMouseUp(event);
		}
	});


	setEventHandler("canvas.mouseout", function(event)
	{
		if gui.current == null then
		{
			if selX != null then theWorldCB.markDirtyCB(selX, selY);
		}
		else
		{
			gui.current.onMouseOut(event);	
		}
		mouseInside = false;
	});





	setEventHandler("canvas.keydown", function(event)
	{
		if gui.current == null then
		{
			use namespace disp;

			var k = adjustKey(event.key);

			var d = 1;#math.min(dispCols // 5, dispRows // 5);

			var slots = {"1": 0, "2": 1, "3": 2, "4": 3, "5": 4, "6": 5, "7": 6, "8": 7, "9": 8, "0": 9 };

			var offs = {ArrowLeft:  [-d,  0],
						ArrowUp:    [ 0, -d],
						ArrowRight: [ d,  0], 
						ArrowDown:  [ 0,  d]};

			if slots.has(k) then
				inventory.selectSlot(slots[k]);
			else if offs.has(k) then
			{
				var off = offs[k];
				scroll(off[0], off[1]);
			}
			else if k == "+" then
			{
				dispScale *= 2;
				#gui.guiScale *= 2;
				initScale();
				markCompletelyDirtyScreen();
			}		
			else if k == "-" then
			{
				dispScale = math.max(dispScale//2, 8);
				#gui.guiScale = math.max(gui.guiScale//2, 16);
				initScale();
				markCompletelyDirtyScreen();
			}		
			else if debug and k == "r" then # debug
			{
				markCompletelyDirtyScreen();

				#inventory.hotbarDirty = true;
			}
			else if debug and k == "p" then # debug
				debugRender = not debugRender;
			else if debug and k == "c" then # debug
			{
				canvas.setFillColor(0, 0, 0);
				canvas.clear();
			}
			else if pressedKeys.has(k) then
			{
				pressedKeys[k] = true;
			}
			#else
			#	print(k);
		}
		else
		{
			gui.current.onKeyDown(event);
		}
		
	});


	setEventHandler("canvas.keyup", function(event)
	{
		var k = adjustKey(event.key);
		
		if pressedKeys.has(k) then
		{
			pressedKeys[k] = false;
		}
		
		if gui.current != null then
		{
			gui.current.onKeyUp(event);	
		}
		
		if k == "F1" then printHelp();
		else if k == "o" then
		{
			if gui.current == null then
				gui.setModal(gui.GuiSettings());
		}
		else if k == "e" then
		{
			if gui.current == null then
				gui.setModal(gui.GuiCraftingInventory(
					"Inventory",
					thePlayer,
					inventory.slots,
					inventory.hotbarSize, 
					inventory.backpackSize,
					2, 2
				));
			else if Type.isOfType(gui.current, gui.GuiInventory) then
				gui.closeModal();
		}
		else if k == "Escape" then
		{
			if gui.current == null then
				gui.setModal(gamemenu.GuiGameMenu());
			else
				gui.closeModal();
		}
	});




	setEventHandler("canvas.resize", function(event)
	{
		initScale();
		markCompletelyDirtyScreen();
		if gui.current != null then
			gui.markScreenDirty();
	});


	
	
	setEventHandler("timer", function(event)
	{
		if gui.current != null then
		{
			gui.current.onTimer(event);
		}
		else
		{
			theWorld.tick();	
			updatePlayerScroll();
			controlTick();
		}
		
		# render
		if gui.current != null then
		{
			
			renderDebugDiff();
			if gui.backDirty then
			{
				markCompletelyDirtyScreen();
				render();
				gui.drawModalDisable();
			}
				
			gui.current.render(gui.backDirty or gui.modalDirty);
			gui.backDirty = false;
			gui.modalDirty = false;
		}
		else
		{	
			render();
		}
	});
}
# namespace eventHandlers






#[file] main.tscript#main

namespace main
{
	initScale();
	
	world.bindNewWorld();

	markCompletelyDirtyScreen();

	printHelp();
	enterEventMode();
	renderCredits();
}
`;
