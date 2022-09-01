export const tscipt_canvas = `
namespace canvas {
	function width() { }
	function height() { }
	function setLineWidth(width) { }
	function setLineColor(red, green, blue, alpha = 1.0) { }
	function setFillColor(red, green, blue, alpha = 1.0) { }
	function setFont(fontface, fontsize) { }
	function setTextAlign(alignment) { }
	function clear() { }
	function line(x1, y1, x2, y2) { }
	function rect(left, top, width, height) { }
	function fillRect(left, top, width, height) { }
	function frameRect(left, top, width, height) { }
	function circle(x, y, radius) { }
	function fillCircle(x, y, radius) { }
	function frameCircle(x, y, radius) { }
	function curve(points, close = false) { }
	function fillArea(points) { }
	function frameArea(points) { }
	function text(x, y, str) { }
	function reset() { }
	function shift(dx, dy) { }
	function scale(factor) { }
	function rotate(angle) { }
	function transform(A, b) { }
	function setDrawingTarget(bitmap = null) { }
	function setOpacity(alpha) { }
	function paintImage(x, y, source) { }
	function paintImageSection(dx, dy, dw, dh, source, sx, sy, sw, sh) { }
	function getPixel(x, y) { }
	function setPixel(x, y, data) { }
	class Bitmap
	{
	public:
		constructor(resourceOrWidth, height = null) { }
		function width() { }
		function height() { }
	}
	class ResizeEvent
	{
	public:
		var width;
		var height;
	}
	class MouseMoveEvent
	{
	public:
		var x;
		var y;
		var buttons;
		var shift;
		var control;
		var alt;
		var meta;
	}
	class MouseButtonEvent
	{
	public:
		var x;
		var y;
		var button;
		var buttons;
		var shift;
		var control;
		var alt;
		var meta;
	}
	class KeyboardEvent
	{
	public:
		var key;
		var shift;
		var control;
		var alt;
		var meta;
	}
}
`;
