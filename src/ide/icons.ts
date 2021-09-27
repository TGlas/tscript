"use strict";

import { SVGDrawingContext } from "./svg";

export const icons = (function () {
	let icons: any = {};

	// Gui icons

	icons.window = function (draw: SVGDrawingContext) {
		draw.setClass("icon-panel-back");
		draw.rect(2.5, 2.5, 15, 15);

		draw.setClass("icon-panel-title");
		draw.rect(2.5, 2.5, 15, 3);

		draw.setClass("icon-border");
		draw.rect(2.5, 2.5, 15, 15);
	};

	icons.dockLeft = function (draw: SVGDrawingContext) {
		draw.setStyle("stroke: #666; fill: none");
		draw.rect(2.5, 2.5, 13, 13);

		draw.setClass("icon-panel-back");
		draw.rect(2.5, 2.5, 7, 13);

		draw.setClass("icon-panel-title");
		draw.rect(2.5, 2.5, 7, 3);

		draw.setClass("icon-border");
		draw.rect(2.5, 2.5, 7, 13);
	};

	icons.dockRight = function (draw: SVGDrawingContext) {
		draw.setStyle("stroke: #666; fill: none");
		draw.rect(2.5, 2.5, 13, 13);

		draw.setClass("icon-panel-back");
		draw.rect(8.5, 2.5, 7, 13);

		draw.setClass("icon-panel-title");
		draw.rect(8.5, 2.5, 7, 3);

		draw.setClass("icon-border");
		draw.rect(8.5, 2.5, 7, 13);
	};

	icons.maximize = function (draw: SVGDrawingContext) {
		draw.setClass("icon-panel-back");
		draw.rect(2.5, 2.5, 13, 13);

		draw.setClass("icon-panel-title");
		draw.rect(2.5, 2.5, 13, 3);

		draw.setClass("icon-border");
		draw.rect(2.5, 2.5, 13, 13);
	};

	icons.float = function (draw: SVGDrawingContext) {
		draw.setStyle("stroke: #666; fill: none");
		draw.rect(2.5, 2.5, 13, 13);

		draw.setClass("icon-panel-back");
		draw.rect(4.5, 5.5, 9, 8);

		draw.setClass("icon-panel-title");
		draw.rect(4.5, 5.5, 9, 3);

		draw.setClass("icon-border");
		draw.rect(4.5, 5.5, 9, 8);
	};

	icons.minimize = function (draw: SVGDrawingContext) {
		draw.setClassAndStyle("icon-border", "stroke-width: 2.5");
		draw.line(3, 14.5, 15, 14.5);
	};

	icons.help = function (draw: SVGDrawingContext) {
		draw.setClassAndStyle("icon-border", "stroke-width: 2");

		draw.beginPath();
		draw.arc(9, 6, 4, 1 * Math.PI, 2.25 * Math.PI);
		draw.lineTo(9, 11.5);
		draw.lineTo(9, 13);
		draw.endPath();

		draw.line(9, 15, 9, 17);
	};

	icons.close = function (draw: SVGDrawingContext) {
		draw.setClassAndStyle("icon-border", "stroke-width: 2");
		draw.line(4, 4, 14, 14);
		draw.line(4, 14, 14, 4);
	};

	// Message box icons, larger in size

	icons.msgBoxQuestion = function (draw: SVGDrawingContext) {
		draw.setStyle("stroke-width: 2; stroke: #04d; fill: #16f");
		draw.circle(20, 20, 18.5);

		draw.setStyle("stroke-width: 2; stroke: #fff; fill: none");
		draw.beginPath();
		draw.arc(20, 15, 7, 1 * Math.PI, 2.25 * Math.PI);
		draw.lineTo(20, 25);
		draw.lineTo(20, 28);
		draw.endPath();

		draw.line(20, 31, 20, 34);
	};

	icons.msgBoxExclamation = function (draw: SVGDrawingContext) {
		draw.setStyle("stroke-width: 2; stroke: #a91; fill: #ec2");
		draw.polygon([19, 2], [21, 2], [38, 36], [37, 38], [3, 38], [2, 36]);

		draw.setStyle("stroke-width: 2; stroke: #000; fill: none");
		draw.line(20, 10, 20, 28);
		draw.line(20, 31, 20, 34);
	};

	// Ide specific icons

	// Toolbar icons
	// icon parts used several times are written as a function,

	function draw_icon_paper(draw: SVGDrawingContext) {
		draw.setStyle("stroke: #333; fill: #fff");
		draw.polygon(
			[4.5, 7.5],
			[8.5, 3.5],
			[14.5, 3.5],
			[14.5, 16.5],
			[4.5, 16.5]
		);

		draw.setStyle("stroke: #333; fill: none");
		draw.polyline([4.5, 7.5], [8.5, 7.5], [8.5, 3.5]);
	}

	function draw_icon_floppy_disk(draw: SVGDrawingContext) {
		draw.setStyle("stroke: #139; fill: #36d");
		draw.polygon(
			[3.5, 3.5],
			[16.5, 3.5],
			[16.5, 16.5],
			[5.5, 16.5],
			[3.5, 14.5]
		);

		draw.setStyle("stroke: none; fill: #eef");
		draw.rect(7, 11, 6, 5);

		draw.setStyle("stroke: none; fill: #36d");
		draw.rect(8, 12, 2, 3);

		draw.setStyle("stroke: none; fill: #fff");
		draw.rect(6, 4, 8, 5);
	}

	function draw_icon_pencil_overlay(draw: SVGDrawingContext) {
		// draw pencil
		// shadow
		draw.setStyle("stroke-width: 3; stroke: #0005; fill: none");
		draw.line(8, 8, 8 + 10, 8 + 10);

		draw.setStyle("stroke: none; fill: #fc9");
		draw.polygon([8, 6], [11, 7], [9, 9]);

		draw.setStyle("stroke: none; fill: #000");
		draw.polygon([8, 6], [9.5, 6.5], [8.5, 7.5]);

		draw.setStyle("stroke-width: 3; stroke: #000; fill: none");
		draw.line(10, 8, 18, 16);

		draw.setStyle("stroke-width: 2; stroke: #dd0; fill: none");
		draw.line(10, 8, 18, 16);

		draw.setStyle("stroke: none; fill: #000");
		draw.polygon([8, 6], [9.5, 6.5], [8.5, 7.5]);
		draw.beginPath();
		draw.arc(18, 16, 1.5, 1.75 * Math.PI, 2.75 * Math.PI);
		draw.endPath();

		draw.setStyle("stroke: none; fill: #f33");
		draw.circle(18, 16, 1);
	}

	icons.newDocument = function (draw: SVGDrawingContext) {
		draw_icon_paper(draw);

		draw.setStyle("stroke: #030; fill: #0a0");
		draw.circle(14, 14, 4.75);

		draw.setStyle("stroke-width: 2; stroke: #fff; fill: none");
		draw.line(14, 17, 14, 11);
		draw.line(11, 14, 17, 14);
	};

	icons.openDocument = function (draw: SVGDrawingContext) {
		draw.setStyle("fill: #ec5; stroke: #330");
		draw.polygon(
			[2.5, 4.5],
			[7.5, 4.5],
			[9.5, 6.5],
			[15.5, 6.5],
			[15.5, 15.5],
			[2.5, 15.5]
		);

		draw.setStyle("fill: #fd6; stroke: #330");

		draw.polygon([5.5, 8.5], [17.5, 8.5], [15.5, 15.5], [3.5, 15.5]);
	};

	icons.saveDocument = function (draw: SVGDrawingContext) {
		draw_icon_floppy_disk(draw);
	};

	icons.saveDocumentAs = function (draw: SVGDrawingContext) {
		draw_icon_floppy_disk(draw);
		draw_icon_pencil_overlay(draw);
	};

	icons.run = function (draw: SVGDrawingContext) {
		draw.setClass("icon-green-fill");
		draw.polygon([5, 5], [15, 10], [5, 15]);
	};

	icons.interrupt = function (draw: SVGDrawingContext) {
		draw.setClass("icon-red-fill");
		draw.rect(5, 5, 4, 10);
		draw.rect(11, 5, 4, 10);
	};

	icons.reset = function (draw: SVGDrawingContext) {
		draw.setClass("icon-red-fill");
		draw.rect(5, 5, 10, 10);
	};

	icons.stepInto = function (draw: SVGDrawingContext) {
		draw.setClass("icon-neutral-fill");
		draw.rect(10, 3, 7, 2);
		draw.rect(13, 6, 4, 2);
		draw.rect(13, 9, 4, 2);
		draw.rect(13, 12, 4, 2);
		draw.rect(10, 15, 7, 2);

		draw.setClass("icon-blue-line");
		draw.polyline([8, 4], [3, 4], [3, 10], [6, 10]);

		draw.setClass("icon-blue-fill");
		draw.polygon([5, 7], [5, 13], [9.5, 10]);
	};

	icons.stepOver = function (draw: SVGDrawingContext) {
		draw.setClass("icon-neutral-fill");
		draw.rect(10, 3, 7, 2);
		draw.rect(13, 6, 4, 2);
		draw.rect(13, 9, 4, 2);
		draw.rect(13, 12, 4, 2);
		draw.rect(10, 15, 7, 2);

		draw.setClass("icon-blue-line");
		draw.polyline([8, 4], [3, 4], [3, 16], [6, 16]);

		draw.setClass("icon-blue-fill");
		draw.polygon([5, 13], [5, 19], [9.5, 16]);
	};

	icons.stepOut = function (draw: SVGDrawingContext) {
		draw.setClass("icon-neutral-fill");
		draw.rect(10, 3, 7, 2);
		draw.rect(13, 6, 4, 2);
		draw.rect(13, 9, 4, 2);
		draw.rect(13, 12, 4, 2);
		draw.rect(10, 15, 7, 2);

		draw.setClass("icon-blue-line");
		draw.polyline([11, 10], [3, 10], [3, 16], [6, 16]);

		draw.setClass("icon-blue-fill");
		draw.polygon([5, 13], [5, 19], [9.5, 16]);
	};

	icons.breakPoint = function (draw: SVGDrawingContext) {
		draw.setClass("icon-red-fill");
		draw.circle(10, 10, 3.9);
	};

	/*icons.search = function(draw: SVGDrawingContext) {
		draw.setClassAndStyle("icon-neutral-line", "stroke-width: 1.5");
		draw.beginPath();
		draw.arc(8, 8, 5, 0.25*Math.PI, 2.25*Math.PI, false); // starting/ending point at 45 degrees south-east
		draw.lineTo(17, 17);
		draw.endPath();
	};*/

	icons.export = function (draw: SVGDrawingContext) {
		draw.setClass("icon-green-frame");
		draw.polygon(
			[3, 7],
			[10, 7],
			[10, 3],
			[17, 10],
			[10, 17],
			[10, 13],
			[3, 13]
		);
	};

	icons.config = function (draw: SVGDrawingContext) {
		draw.setClass("icon-neutral-fill");
		draw.circle(10, 10, 2.0);

		draw.setClassAndStyle("icon-neutral-line", "stroke-width: 2");
		draw.circle(10, 10, 5.7);

		for (let i = 0; i < 12; i++) {
			let a = ((i + 0.5) * Math.PI) / 6;
			draw.line(
				10 + 6.0 * Math.cos(a),
				10 + 6.0 * Math.sin(a),
				10 + 9.4 * Math.cos(a),
				10 + 9.4 * Math.sin(a)
			);
		}
	};

	icons.restorePanels = function (draw: SVGDrawingContext) {
		draw.setStyle("stroke: #aaa; fill: #fff");
		draw.rect(2.5, 2.5, 15, 15);

		draw.setStyle("stroke: none; fill: #ccc");
		draw.rect(11, 3, 1, 14);

		draw.setStyle("stroke: none; fill: #77f");
		draw.rect(3, 3, 14, 1);
		draw.rect(3, 12, 8, 1);

		draw.setStyle("stroke: #222; stroke-width: 1.7; fill: none");
		draw.beginPath();
		draw.arc(9.5, 10.5, 4, 1.25 * Math.PI, 2.6 * Math.PI);
		draw.endPath();

		draw.setStyle("stroke: none; fill: #222");
		draw.polygon([5, 5], [5, 10], [10, 10]);
	};

	// Panel icons
	icons.editor = function (draw: SVGDrawingContext) {
		draw_icon_paper(draw);

		draw.setStyle("stroke: none; fill: #777");
		draw.rect(10, 5, 3, 1);
		draw.rect(10, 7, 2, 1);
		draw.rect(7, 9, 4, 1);
		draw.rect(6, 11, 7, 1);
		draw.rect(9, 13, 4, 1);
	};

	icons.messages = function (draw: SVGDrawingContext) {
		draw.setStyle("stroke: #222; fill: #fff");
		draw.beginPath();
		draw.ellipse(9.5, 8.5, 7, 6, 0, 0.73 * Math.PI, 2.57 * Math.PI);
		draw.lineTo(4.5, 17);
		draw.closePath();
		draw.endPath();

		draw.setStyle("stroke: none; fill: #777");
		draw.rect(8, 6, 3, 1);
		draw.rect(6, 8, 2, 1);
		draw.rect(9, 8, 5, 1);
		draw.rect(7, 10, 4, 1);
	};

	icons.stackView = function (draw: SVGDrawingContext) {
		// white top
		draw.setStyle("stroke: none; fill: #fff");
		draw.polygon([4, 5.5], [10, 8.5], [16, 5.5], [10, 2.5]);

		// shaded lower pages
		draw.setStyle("stroke: none; fill: #bbb");
		draw.polygon([4, 5.5], [4, 14.5], [10, 17.5], [10, 8.5]);

		draw.setStyle("stroke: none; fill: #999");
		draw.polygon([10, 17.5], [16, 14.5], [16, 5.5], [10, 8.5]);

		draw.setStyle("stroke-width: 0.6; stroke: #222; fill: none");
		for (let i = 8; i < 17; i += 3) {
			draw.polyline([3, i + 0.5], [10, i + 3.5], [17, i + 0.5]);
		}

		// top frame
		draw.polygon(
			[3.5, 5.3],
			[3.5, 5.7],
			[10, 8.5],
			[16.5, 5.7],
			[16.5, 5.3],
			[10, 2.5]
		);
	};

	icons.programView = function (draw: SVGDrawingContext) {
		// Outline
		draw.setStyle("stroke:none; fill: #eeeeeec0");
		draw.polygon(
			[3, 2],
			[13, 2],
			[13, 5],
			[15, 5],
			[15, 8],
			[17, 8],
			[17, 12],
			[13, 12],
			[13, 14],
			[15, 14],
			[15, 18],
			[5, 18],
			[5, 15],
			[3, 15],
			[3, 11],
			[7, 11],
			[7, 9],
			[5, 9],
			[5, 6],
			[3, 6]
		);

		// Black boxes
		draw.setStyle("stroke:none; fill: #000");
		draw.rect(4, 3, 8, 2);
		draw.rect(6, 6, 8, 2);
		draw.rect(8, 9, 8, 2);
		draw.rect(4, 12, 8, 2);
		draw.rect(6, 15, 8, 2);
	};

	icons.turtle = function (draw: SVGDrawingContext) {
		// draws literally a turtle

		draw.setStyle("stroke: #070; fill: #2c3");

		// head
		draw.beginPath();
		draw.ellipse(9.5, 5, 2, 2.5, 0, 0 * Math.PI, 2 * Math.PI);
		draw.closePath();
		draw.endPath();

		// legs
		draw.setStyle("stroke-width: 1.6; stroke: #070; fill: none");

		draw.polyline([3.5, 6], [9.5, 11], [15.5, 6]);

		draw.polyline([4.5, 17], [9.5, 10], [14.5, 17]);

		// tail
		draw.setStyle("stroke-width: 1.3; stroke: #070; fill: none");
		draw.line(9.5, 17, 8.5, 19);

		// main body
		draw.setStyle("stroke: #070; fill: #2c3");
		draw.beginPath();
		draw.ellipse(9.5, 11.5, 4, 5, 0, 0 * Math.PI, 2 * Math.PI);
		draw.closePath();
		draw.endPath();

		draw.setStyle("stroke: #0709; fill: none");
		draw.beginPath();
		draw.ellipse(8.8, 10.8, 4, 5, 0, -0.3 * Math.PI, 0.7 * Math.PI);
		draw.endPath();
	};

	icons.canvas = function (draw: SVGDrawingContext) {
		draw.setStyle("stroke: none; fill: #333");
		draw.rect(3, 2, 14, 16);

		draw.setStyle("stroke: none; fill: #fff");
		draw.rect(4, 3, 12, 14);

		draw.setStyle("stroke: #00cc; fill: #00c8");
		draw.rect(5.5, 5.5, 6, 6);

		draw.setStyle("stroke: #c00c; fill: #c008");
		draw.circle(11, 11, 3.5);
	};

	/*icons.tutorial = function (draw: SVGDrawingContext) {
		draw.setStyle("stroke-width: 3; stroke: #666; fill: none");

		draw.beginPath();
		draw.moveTo(5.0, 20);
		draw.lineTo(9.0, 2);
		draw.lineTo(11.0, 2);
		draw.lineTo(15.0, 20);
		draw.endPath();

		draw.setStyle("stroke-width: 2; stroke: #db7; fill: none");
		draw.polyline([5, 20], [9, 2], [11, 2], [15, 20]);

		draw.setStyle("stroke: none; fill: #666");
		draw.rect(1.5, 2.5, 17, 12);

		draw.setStyle("stroke: none; fill: #db7");
		draw.rect(2, 3, 16, 11);

		draw.setStyle("stroke: none; fill: #000");
		draw.rect(3, 4, 14, 9);

		draw.setStyle("stroke: #fff; fill: none");
		draw.polyline([5, 6], [7, 8], [5, 10]);
	};*/

	return icons;
})();
