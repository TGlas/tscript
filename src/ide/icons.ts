"use strict";

export const icons = (function() {
	let icons: any = {};


    function iconColorBorder(dark) { return dark ? "#fff" : "#000"; }
    function iconColorBack(dark)   { return dark ? "#444" : "#fff"; }
    function iconColorTitle(dark)  { return dark ? "#36f" : "#00c"; }


    // Gui icons

    icons.window = function (canvas, dark) {
        let ctx = canvas.getContext("2d");
        ctx.lineWidth = 1;
        ctx.fillStyle = iconColorBack(dark);
        ctx.fillRect(2.5, 2.5, 15, 15);
        ctx.strokeStyle = iconColorBorder(dark);
        ctx.beginPath();
        ctx.rect(2.5, 2.5, 15, 15);
        ctx.fillStyle = iconColorTitle(dark);
        ctx.fillRect(2.5, 2.5, 15, 3);
        ctx.stroke();
    };

    icons.dockLeft = function (canvas, dark) {
        let ctx = canvas.getContext("2d");
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#666";
        ctx.beginPath();
        ctx.rect(2.5, 2.5, 13, 13);
        ctx.stroke();
        ctx.fillStyle = iconColorBack(dark);
        ctx.fillRect(2.5, 2.5, 7, 13);
        ctx.strokeStyle = iconColorBorder(dark);
        ctx.beginPath();
        ctx.rect(2.5, 2.5, 7, 13);
        ctx.fillStyle = iconColorTitle(dark);
        ctx.fillRect(2.5, 2.5, 7, 3);
        ctx.stroke();
    };

    icons.dockRight = function (canvas, dark) {
        let ctx = canvas.getContext("2d");
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#666";
        ctx.beginPath();
        ctx.rect(2.5, 2.5, 13, 13);
        ctx.stroke();
        ctx.fillStyle = iconColorBack(dark);
        ctx.fillRect(8.5, 2.5, 7, 13);
        ctx.strokeStyle = iconColorBorder(dark);
        ctx.beginPath();
        ctx.rect(8.5, 2.5, 7, 13);
        ctx.fillStyle = iconColorTitle(dark);
        ctx.fillRect(8.5, 2.5, 7, 3);
        ctx.stroke();
    }

    icons.maximize = function (canvas, dark) {
        let ctx = canvas.getContext("2d");
        ctx.lineWidth = 1;
        ctx.fillStyle = iconColorBack(dark);
        ctx.fillRect(2.5, 2.5, 13, 13);
        ctx.strokeStyle = iconColorBorder(dark);
        ctx.beginPath();
        ctx.rect(2.5, 2.5, 13, 13);
        ctx.fillStyle = iconColorTitle(dark);
        ctx.fillRect(2.5, 2.5, 13, 3);
        ctx.stroke();
    };

    icons.float = function (canvas, dark) {
        let ctx = canvas.getContext("2d");
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#666";
        ctx.beginPath();
        ctx.rect(2.5, 2.5, 13, 13);
        ctx.stroke();
        ctx.fillStyle = iconColorBack(dark);
        ctx.fillRect(4.5, 5.5, 9, 8);
        ctx.strokeStyle = iconColorBorder(dark);
        ctx.beginPath();
        ctx.rect(4.5, 5.5, 9, 8);
        ctx.fillStyle = iconColorTitle(dark);
        ctx.fillRect(4.5, 5.5, 9, 3);
        ctx.stroke();
    };

    icons.minimize = function (canvas, dark) {
        let ctx = canvas.getContext("2d");
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = iconColorBorder(dark);
        ctx.beginPath();
        ctx.moveTo(3, 14.5);
        ctx.lineTo(15, 14.5);
        ctx.stroke();
    };

    icons.help = function (canvas, dark) {
        let ctx = canvas.getContext("2d");
        ctx.lineWidth = 2;
        ctx.strokeStyle = iconColorBorder(dark);
        ctx.beginPath();
        ctx.arc(9, 6, 4, 1 * Math.PI, 2.25 * Math.PI, false);
        ctx.lineTo(9, 11.5);
        ctx.lineTo(9, 13);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(9, 15);
        ctx.lineTo(9, 17);
        ctx.stroke();
    };

    icons.close = function (canvas, dark) {
        let ctx = canvas.getContext("2d");
        ctx.lineWidth = 2;
        ctx.strokeStyle = dark ? "#fff" : "#000";
        ctx.beginPath();
        ctx.moveTo(4, 4);
        ctx.lineTo(14, 14);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(4, 14);
        ctx.lineTo(14, 4);
        ctx.stroke();
    };







    
    // Message box icons, larger in size

    icons.msgBoxQuestion = function (canvas, dark) {
		let ctx = canvas.getContext("2d");
		ctx.lineWidth = 2;
		ctx.strokeStyle = "#04d";
		ctx.fillStyle = "#16f";
		ctx.beginPath();
		ctx.arc(20, 20, 18.5, 0, 2 * Math.PI);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();

		ctx.strokeStyle = "#fff";
		ctx.beginPath();
		ctx.arc(20, 15, 7, 1 * Math.PI, 2.25 * Math.PI, false);
		ctx.lineTo(20, 25);

		ctx.lineTo(20, 28);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(20, 31);
		ctx.lineTo(20, 34);
		ctx.stroke();
	};

    icons.msgBoxExclamation = function (canvas, dark) {
		let ctx = canvas.getContext("2d");
		ctx.lineWidth = 2;
		ctx.strokeStyle = "#a91";
		ctx.fillStyle = "#ec2";
		ctx.beginPath();
		//ctx.arc(20, 20, 18.5, 0, 2*Math.PI);
		ctx.lineTo(19, 2);
		ctx.lineTo(21, 2);
		ctx.lineTo(38, 36);
		ctx.lineTo(37, 38);
		ctx.lineTo(3, 38);
		ctx.lineTo(2, 36);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();

		ctx.strokeStyle = "#000";
		ctx.beginPath();
		ctx.moveTo(20, 10);
		ctx.lineTo(20, 28);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(20, 31);
		ctx.lineTo(20, 34);
		ctx.stroke();
	};








    // Ide specific icons

	// Toolbar icons
	// icon parts used several times are written as a function,
	// the 2d context of the canvas is passed as a parameter,
	// resulting in less code

	function draw_icon_paper(ctx) {
		ctx.strokeStyle = "#333";
		ctx.fillStyle = "#fff";
		ctx.lineWidth = 1;
		ctx.beginPath();
		ctx.moveTo(4.5, 7.5);
		ctx.lineTo(8.5, 3.5);
		ctx.lineTo(14.5, 3.5);
		ctx.lineTo(14.5, 16.5);
		ctx.lineTo(4.5, 16.5);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();

		ctx.beginPath();
		ctx.moveTo(4.5, 7.5);
		ctx.lineTo(8.5, 7.5);
		ctx.lineTo(8.5, 3.5);
		ctx.stroke();
	}

	function draw_icon_floppy_disk(ctx) {
		ctx.fillStyle = "#36d";
		ctx.strokeStyle = "#139";
		ctx.beginPath();
		ctx.moveTo(3.5, 3.5);
		ctx.lineTo(16.5, 3.5);
		ctx.lineTo(16.5, 16.5);
		ctx.lineTo(5.5, 16.5);
		ctx.lineTo(3.5, 14.5);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();

		ctx.fillStyle = "#eef";
		ctx.fillRect(7, 11, 6, 5);
		ctx.fillStyle = "#36d";
		ctx.fillRect(8, 12, 2, 3);

		ctx.fillStyle = "#fff";
		ctx.fillRect(6, 4, 8, 5);
	}

	function draw_icon_pencil_overlay(ctx) {
		// draw pencil
		// shadow
		ctx.strokeStyle = "#0005";
		ctx.lineWidth = 3;
		ctx.beginPath();
		ctx.moveTo(8, 8);
		ctx.lineTo(8 + 10, 8 + 10);
		ctx.stroke();

		ctx.fillStyle = "#fc9";
		ctx.beginPath();
		ctx.moveTo(8, 6);
		ctx.lineTo(11, 7);
		ctx.lineTo(9, 9);
		ctx.fill();

		ctx.fillStyle = "#000";
		ctx.beginPath();
		ctx.moveTo(8, 6);
		ctx.lineTo(9.5, 6.5);
		ctx.lineTo(8.5, 7.5);
		ctx.fill();

		ctx.strokeStyle = "#000";
		ctx.lineWidth = 3;
		ctx.beginPath();
		ctx.moveTo(10, 8);
		ctx.lineTo(18, 16);
		ctx.stroke();

		ctx.strokeStyle = "#dd0";
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(10, 8);
		ctx.lineTo(18, 16);
		ctx.stroke();

		ctx.fillStyle = "#000";
		ctx.beginPath();
		ctx.arc(18, 16, 1.5, 1.75 * Math.PI, 2.75 * Math.PI, false);
		ctx.fill();

		ctx.fillStyle = "#f33";
		ctx.beginPath();
		ctx.arc(18, 16, 1, 0, 2 * Math.PI, false);
		ctx.fill();
	}

	function iconColorHighlight(dark) { return dark ? "#49f" : "#00f"; }
	function iconColorLine(dark) { return dark ? "#ccc" : "#000"; }

    icons.newDocument = function (canvas, dark) {
        let ctx = canvas.getContext("2d");

        draw_icon_paper(ctx);

        ctx.strokeStyle = "#030";
        ctx.fillStyle = "#0a0";
        ctx.beginPath();
        ctx.arc(14, 14, 4.75, 0, 2 * Math.PI, false);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(14, 17);
        ctx.lineTo(14, 11);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(11, 14);
        ctx.lineTo(17, 14);
        ctx.stroke();
    };

    icons.openDocument = function (canvas, dark) {
        let ctx = canvas.getContext("2d");

        ctx.fillStyle = "#ec5";
        ctx.strokeStyle = "#330";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(2.5, 4.5);
        ctx.lineTo(7.5, 4.5);
        ctx.lineTo(9.5, 6.5);
        ctx.lineTo(15.5, 6.5);
        ctx.lineTo(15.5, 15.5);
        ctx.lineTo(2.5, 15.5);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#fd6";
        ctx.strokeStyle = "#330";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(5.5, 8.5);
        ctx.lineTo(17.5, 8.5);
        ctx.lineTo(15.5, 15.5);
        ctx.lineTo(3.5, 15.5);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    };

    icons.saveDocument = function (canvas, dark) {
        let ctx = canvas.getContext("2d");

        draw_icon_floppy_disk(ctx);
    }

    icons.saveDocumentAs = function (canvas, dark) {
        let ctx = canvas.getContext("2d");

        draw_icon_floppy_disk(ctx);
        draw_icon_pencil_overlay(ctx);
    };

    icons.run = function (canvas, dark) {
        let ctx = canvas.getContext("2d");
        ctx.fillStyle = "#080";
        ctx.beginPath();
        ctx.moveTo(5, 5);
        ctx.lineTo(15, 10);
        ctx.lineTo(5, 15);
        ctx.fill();
    };

    icons.interrupt = function (canvas, dark) {
        let ctx = canvas.getContext("2d");
        ctx.fillStyle = "#c00";
        ctx.fillRect(5, 5, 4, 10);
        ctx.fillRect(11, 5, 4, 10);
    };

    icons.reset = function (canvas, dark) {
        let ctx = canvas.getContext("2d");
        ctx.fillStyle = "#c00";
        ctx.fillRect(5, 5, 10, 10);
    };

    icons.stepInto = function (canvas, dark) {
        let ctx = canvas.getContext("2d");
        ctx.fillStyle = iconColorLine(dark);
        ctx.fillRect(10, 3, 7, 2);
        ctx.fillRect(13, 6, 4, 2);
        ctx.fillRect(13, 9, 4, 2);
        ctx.fillRect(13, 12, 4, 2);
        ctx.fillRect(10, 15, 7, 2);
        ctx.lineWidth = 1;
        ctx.strokeStyle = iconColorHighlight(dark);
        ctx.beginPath();
        ctx.moveTo(8, 4);
        ctx.lineTo(3, 4);
        ctx.lineTo(3, 10);
        ctx.lineTo(6, 10);
        ctx.stroke();
        ctx.fillStyle = iconColorHighlight(dark);
        ctx.beginPath();
        ctx.moveTo(5, 7);
        ctx.lineTo(5, 13);
        ctx.lineTo(9.5, 10);
        ctx.fill();
    };

    icons.stepOver = function (canvas, dark) {
        let ctx = canvas.getContext("2d");
        ctx.fillStyle = iconColorLine(dark);
        ctx.fillRect(10, 3, 7, 2);
        ctx.fillRect(13, 6, 4, 2);
        ctx.fillRect(13, 9, 4, 2);
        ctx.fillRect(13, 12, 4, 2);
        ctx.fillRect(10, 15, 7, 2);
        ctx.lineWidth = 1;
        ctx.strokeStyle = iconColorHighlight(dark);
        ctx.beginPath();
        ctx.moveTo(8, 4);
        ctx.lineTo(3, 4);
        ctx.lineTo(3, 16);
        ctx.lineTo(6, 16);
        ctx.stroke();
        ctx.fillStyle = iconColorHighlight(dark);
        ctx.beginPath();
        ctx.moveTo(5, 13);
        ctx.lineTo(5, 19);
        ctx.lineTo(9.5, 16);
        ctx.fill();
    };

    icons.stepOut = function (canvas, dark) {
        let ctx = canvas.getContext("2d");
        ctx.fillStyle = iconColorLine(dark);
        ctx.fillRect(10, 3, 7, 2);
        ctx.fillRect(13, 6, 4, 2);
        ctx.fillRect(13, 9, 4, 2);
        ctx.fillRect(13, 12, 4, 2);
        ctx.fillRect(10, 15, 7, 2);
        ctx.lineWidth = 1;
        ctx.strokeStyle = iconColorHighlight(dark);
        ctx.beginPath();
        ctx.moveTo(11, 10);
        ctx.lineTo(3, 10);
        ctx.lineTo(3, 16);
        ctx.lineTo(6, 16);
        ctx.stroke();
        ctx.fillStyle = iconColorHighlight(dark);
        ctx.beginPath();
        ctx.moveTo(5, 13);
        ctx.lineTo(5, 19);
        ctx.lineTo(9.5, 16);
        ctx.fill();
    };

    icons.breakPoint = function (canvas, dark) {
        let ctx = canvas.getContext("2d");
        ctx.fillStyle = "#c00";
        ctx.arc(10, 10, 3.9, 0, 2 * Math.PI, false);
        ctx.fill();
    };

    /*icons.search = function(canvas) {
        let ctx = canvas.getContext("2d");
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 1.5;
        ctx.arc(8, 8, 5, 0.25*Math.PI, 2.25*Math.PI, false); // starting/ending point at 45 degrees south-east
        ctx.lineTo(17, 17);
        ctx.stroke();
    };*/

    icons.export = function (canvas, dark) {
        let ctx = canvas.getContext("2d");
        ctx.strokeStyle = "#080";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(3, 7);
        ctx.lineTo(10, 7);
        ctx.lineTo(10, 3);
        ctx.lineTo(17, 10);
        ctx.lineTo(10, 17);
        ctx.lineTo(10, 13);
        ctx.lineTo(3, 13);
        ctx.closePath();
        ctx.stroke();
    };

    icons.config = function (canvas, dark) {
        let ctx = canvas.getContext("2d");
        let col = iconColorLine(dark);
        ctx.fillStyle = col;
        ctx.strokeStyle = col;
        ctx.arc(10, 10, 2.0, 0, 2 * Math.PI, false);
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = col;
        ctx.beginPath();
        ctx.arc(10, 10, 5.7, 0, 2 * Math.PI, false);
        ctx.closePath();
        ctx.stroke();
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i < 12; i++) {
            let a = ((i + 0.5) * Math.PI) / 6;
            ctx.moveTo(10 + 6.0 * Math.cos(a), 10 + 6.0 * Math.sin(a));
            ctx.lineTo(10 + 9.4 * Math.cos(a), 10 + 9.4 * Math.sin(a));
        }
        ctx.stroke();
    };

    icons.restorePanels = function (canvas, dark) {
        let ctx = canvas.getContext("2d");
        ctx.lineWidth = 1;
        ctx.fillStyle = "#fff";
        ctx.strokeStyle = "#aaa";

        ctx.beginPath();
        ctx.rect(2.5, 2.5, 15, 15);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#ccc";
        ctx.fillRect(11, 3, 1, 14);

        ctx.fillStyle = "#77f";
        ctx.fillRect(3, 3, 14, 1);
        ctx.fillRect(3, 12, 8, 1);

        ctx.strokeStyle = "#222";
        ctx.lineWidth = 1.7;
        ctx.beginPath();
        ctx.arc(9.5, 10.5, 4, 1.25 * Math.PI, 2.6 * Math.PI);
        ctx.stroke();

        ctx.fillStyle = "#222";
        ctx.beginPath();
        ctx.moveTo(5, 5);
        ctx.lineTo(5, 10);
        ctx.lineTo(10, 10);
        ctx.fill();
    };







    // Panel icons
    icons.editor = function (canvas, dark) {
        let ctx = canvas.getContext("2d");
        draw_icon_paper(ctx);

        ctx.fillStyle = "#777";
        ctx.fillRect(10, 5, 3, 1);
        ctx.fillRect(10, 7, 2, 1);
        ctx.fillRect(7, 9, 4, 1);
        ctx.fillRect(6, 11, 7, 1);
        ctx.fillRect(9, 13, 4, 1);
    };

    icons.messages = function (canvas, dark) {
        let ctx = canvas.getContext("2d");

        ctx.fillStyle = "#fff";
        ctx.strokeStyle = "#222";
        ctx.beginPath();
        ctx.ellipse(
            9.5,
            8.5,
            7,
            6,
            0,
            0.73 * Math.PI,
            2.57 * Math.PI,
            false
        );
        ctx.lineTo(4.5, 17);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#777";
        ctx.fillRect(8, 6, 3, 1);
        ctx.fillRect(6, 8, 2, 1);
        ctx.fillRect(9, 8, 5, 1);
        ctx.fillRect(7, 10, 4, 1);
    };

    icons.stackView = function (canvas, dark) {
        let ctx = canvas.getContext("2d");

        ctx.strokeStyle = "#222";
        ctx.lineWidth = 0.6;

        // white top
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.moveTo(4, 5.5);
        ctx.lineTo(10, 8.5);
        ctx.lineTo(16, 5.5);
        ctx.lineTo(10, 2.5);
        ctx.fill();

        // shaded lower pages
        ctx.fillStyle = "#bbb";
        ctx.beginPath();
        ctx.moveTo(4, 5.5);
        ctx.lineTo(4, 14.5);
        ctx.lineTo(10, 17.5);
        ctx.lineTo(10, 8.5);
        ctx.fill();

        ctx.fillStyle = "#999";
        ctx.beginPath();
        ctx.moveTo(10, 17.5);
        ctx.lineTo(16, 14.5);
        ctx.lineTo(16, 5.5);
        ctx.lineTo(10, 8.5);
        ctx.fill();

        for (let i = 8; i < 17; i += 3) {
            ctx.beginPath();
            ctx.moveTo(3, i + 0.5);
            ctx.lineTo(10, i + 3.5);
            ctx.lineTo(17, i + 0.5);
            ctx.stroke();
        }

        // top frame
        ctx.beginPath();
        ctx.moveTo(3.5, 5.3);
        ctx.lineTo(3.5, 5.7);
        ctx.lineTo(10, 8.5);
        ctx.lineTo(16.5, 5.7);
        ctx.lineTo(16.5, 5.3);
        ctx.lineTo(10, 2.5);
        ctx.closePath();
        ctx.stroke();
    };

    icons.programView = function (canvas, dark) {
        let ctx = canvas.getContext("2d");

        // Outline
        ctx.fillStyle = "#eeeeeec0";
        ctx.moveTo(3, 2);
        ctx.lineTo(13, 2);
        ctx.lineTo(13, 5);
        ctx.lineTo(15, 5);
        ctx.lineTo(15, 8);
        ctx.lineTo(17, 8);
        ctx.lineTo(17, 12);
        ctx.lineTo(13, 12);
        ctx.lineTo(13, 14);
        ctx.lineTo(15, 14);
        ctx.lineTo(15, 18);
        ctx.lineTo(5, 18);
        ctx.lineTo(5, 15);
        ctx.lineTo(3, 15);
        ctx.lineTo(3, 11);
        ctx.lineTo(7, 11);
        ctx.lineTo(7, 9);
        ctx.lineTo(5, 9);
        ctx.lineTo(5, 6);
        ctx.lineTo(3, 6);
        ctx.fill();

        // Black boxes
        ctx.fillStyle = "#000";
        ctx.fillRect(4, 3, 8, 2);
        ctx.fillRect(6, 6, 8, 2);
        ctx.fillRect(8, 9, 8, 2);
        ctx.fillRect(4, 12, 8, 2);
        ctx.fillRect(6, 15, 8, 2);
    };

    icons.turtle = function (canvas, dark) {
        // draws literally a turtle
        let ctx = canvas.getContext("2d");

        ctx.fillStyle = "#2c3";
        ctx.strokeStyle = "#070";

        // head
        ctx.beginPath();
        ctx.ellipse(9.5, 5, 2, 2.5, 0, 0 * Math.PI, 2 * Math.PI, false);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // legs
        ctx.lineWidth = 1.6;

        ctx.beginPath();
        ctx.moveTo(3.5, 6);
        ctx.lineTo(9.5, 11);
        ctx.lineTo(15.5, 6);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(4.5, 17);
        ctx.lineTo(9.5, 10);
        ctx.lineTo(14.5, 17);
        ctx.stroke();

        // tail
        ctx.lineWidth = 1.3;

        ctx.beginPath();
        ctx.moveTo(9.5, 17);
        ctx.lineTo(8.5, 19);
        ctx.stroke();

        // main body
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(
            9.5,
            11.5,
            4,
            5,
            0,
            0 * Math.PI,
            2 * Math.PI,
            false
        );
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.strokeStyle = "#0709";
        ctx.beginPath();
        ctx.ellipse(
            8.7,
            10.7,
            4,
            5,
            0,
            -0.3 * Math.PI,
            0.8 * Math.PI,
            false
        );
        ctx.stroke();
    };

    icons.canvas = function (canvas, dark) {
        let ctx = canvas.getContext("2d");

        ctx.fillStyle = "#333";
        ctx.fillRect(3, 2, 14, 16);
        ctx.fillStyle = "#fff";
        ctx.fillRect(4, 3, 12, 14);
        ctx.fillStyle = "#00c8";
        ctx.strokeStyle = "#00cc";
        ctx.beginPath();
        ctx.rect(5.5, 5.5, 6, 6);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "#c008";
        ctx.strokeStyle = "#c00c";
        ctx.beginPath();
        ctx.arc(11, 11, 3.5, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    };

    /*icons.tutorial = function (canvas, dark) {
        let ctx = canvas.getContext("2d");

        ctx.strokeStyle = "#666";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(5.0, 20);
        ctx.lineTo(9.0, 2);
        ctx.lineTo(11.0, 2);
        ctx.lineTo(15.0, 20);
        ctx.stroke();

        ctx.strokeStyle = "#db7";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(5, 20);
        ctx.lineTo(9, 2);
        ctx.lineTo(11, 2);
        ctx.lineTo(15, 20);
        ctx.stroke();

        ctx.fillStyle = "#666";
        ctx.fillRect(1.5, 2.5, 17, 12);
        ctx.fillStyle = "#db7";
        ctx.fillRect(2, 3, 16, 11);
        ctx.fillStyle = "#000";
        ctx.fillRect(3, 4, 14, 9);

        ctx.lineWidth = 1;
        ctx.strokeStyle = "#fff";
        ctx.beginPath();
        ctx.moveTo(5, 6);
        ctx.lineTo(7, 8);
        ctx.lineTo(5, 10);
        ctx.stroke();
    };*/

    return icons;
})();