let atx =
	typeof window === "undefined"
		? undefined
		: window.AudioContext || (window as any).webkitAudioContext;

export const fakeLocalStorage = {
	map: new Map(),
	keys: function () {
		let ar = new Array();
		let key;
		let iter = this.map.keys();

		while (!(key = iter.next()).done) {
			ar.push(key.value);
		}
		return ar;
	},
	setItem: function (key, value) {
		this.map.set(key, value);
	},
	getItem: function (key) {
		let r = this.map.get(key);
		return typeof r === "undefined" ? null : r;
	},
};

// Create an instance of default services. Services hold an internal
// state, therefore a new instance should be created for each
// interpreter instance.
export function createDefaultServices() {
	return {
		turtle: {
			x: 0.0,
			y: 0.0,
			angle: 0.0,
			down: true,
			rgb: "rgb(0,0,0)",
			reset: function (x, y, degrees, down) {
				this.turtle.x = x;
				this.turtle.y = y;
				this.turtle.angle = degrees;
				this.turtle.down = down;
				this.turtle.rgb = "rgb(0,0,0)";
			},
			move: function (distance) {
				let a = (Math.PI / 180) * this.turtle.angle;
				let s = Math.sin(a);
				let c = Math.cos(a);
				let x = this.turtle.x + distance * s;
				let y = this.turtle.y + distance * c;
				if (this.turtle.down && this.turtle.dom) {
					let ctx = this.turtle.dom.getContext("2d");
					ctx.lineWidth = 1;
					ctx.strokeStyle = this.turtle.rgb;
					ctx.beginPath();
					ctx.moveTo(
						300 + 3 * this.turtle.x,
						300 - 3 * this.turtle.y
					);
					ctx.lineTo(300 + 3 * x, 300 - 3 * y);
					ctx.stroke();
				}
				this.turtle.x = x;
				this.turtle.y = y;
			},
			turn: function (degrees) {
				this.turtle.angle = (this.turtle.angle + degrees) % 360.0;
			},
			color: function (red, green, blue) {
				if (red < 0) red = 0;
				else if (red > 1) red = 1;
				if (green < 0) green = 0;
				else if (green > 1) green = 1;
				if (blue < 0) blue = 0;
				else if (blue > 1) blue = 1;
				this.turtle.rgb =
					"rgb(" +
					Math.round(255 * red) +
					"," +
					Math.round(255 * green) +
					"," +
					Math.round(255 * blue) +
					")";
			},
			pen: function (down) {
				this.turtle.down = down;
			},
		},

		canvas: {
			target: null,
			font_size: 16,
			setDrawingTarget: function (bitmap) {
				this.canvas.target = bitmap;
			},
			width: function () {
				if (
					!(this.canvas.target ? this.canvas.target : this.canvas.dom)
				)
					return 0;
				return (
					this.canvas.target ? this.canvas.target : this.canvas.dom
				).width;
			},
			height: function () {
				if (
					!(this.canvas.target ? this.canvas.target : this.canvas.dom)
				)
					return 0;
				return (
					this.canvas.target ? this.canvas.target : this.canvas.dom
				).height;
			},
			setLineWidth: function (width) {
				let bmp = this.canvas.target
					? this.canvas.target
					: this.canvas.dom;
				if (!bmp || !bmp.getContext) return;
				let ctx = bmp.getContext("2d");
				ctx.lineWidth = width;
			},
			setLineColor: function (red, green, blue, alpha) {
				let bmp = this.canvas.target
					? this.canvas.target
					: this.canvas.dom;
				if (!bmp || !bmp.getContext) return;
				let ctx = bmp.getContext("2d");
				let r = Math.min(1, Math.max(0, red));
				let g = Math.min(1, Math.max(0, green));
				let b = Math.min(1, Math.max(0, blue));
				let a = Math.min(1, Math.max(0, alpha));
				ctx.strokeStyle =
					"rgba(" +
					Math.round(255 * r) +
					"," +
					Math.round(255 * g) +
					"," +
					Math.round(255 * b) +
					"," +
					a +
					")";
			},
			setFillColor: function (red, green, blue, alpha) {
				let bmp = this.canvas.target
					? this.canvas.target
					: this.canvas.dom;
				if (!bmp || !bmp.getContext) return;
				let ctx = bmp.getContext("2d");
				let r = Math.min(1, Math.max(0, red));
				let g = Math.min(1, Math.max(0, green));
				let b = Math.min(1, Math.max(0, blue));
				let a = Math.min(1, Math.max(0, alpha));
				ctx.fillStyle =
					"rgba(" +
					Math.round(255 * r) +
					"," +
					Math.round(255 * g) +
					"," +
					Math.round(255 * b) +
					"," +
					a +
					")";
			},
			setOpacity: function (alpha) {
				let bmp = this.canvas.target
					? this.canvas.target
					: this.canvas.dom;
				if (!bmp || !bmp.getContext) return;
				let ctx = bmp.getContext("2d");
				ctx.globalAlpha = alpha;
			},
			setFont: function (fontface, fontsize) {
				let bmp = this.canvas.target
					? this.canvas.target
					: this.canvas.dom;
				if (!bmp || !bmp.getContext) return;
				let ctx = bmp.getContext("2d");
				ctx.font = fontsize + "px " + fontface;
				this.canvas.font_size = fontsize;
			},
			setTextAlign: function (alignment) {
				let bmp = this.canvas.target
					? this.canvas.target
					: this.canvas.dom;
				if (!bmp || !bmp.getContext) return;
				let ctx = bmp.getContext("2d");
				ctx.textAlign = alignment;
			},
			clear: function () {
				let bmp = this.canvas.target
					? this.canvas.target
					: this.canvas.dom;
				if (!bmp || !bmp.getContext) return;
				let ctx = bmp.getContext("2d");
				ctx.setTransform(1, 0, 0, 1, 0, 0);
				ctx.fillRect(
					0,
					0,
					(this.canvas.target ? this.canvas.target : this.canvas.dom)
						.width,
					(this.canvas.target ? this.canvas.target : this.canvas.dom)
						.height
				);
			},
			line: function (x1, y1, x2, y2) {
				let bmp = this.canvas.target
					? this.canvas.target
					: this.canvas.dom;
				if (!bmp || !bmp.getContext) return;
				let ctx = bmp.getContext("2d");
				ctx.beginPath();
				ctx.moveTo(x1, y1);
				ctx.lineTo(x2, y2);
				ctx.stroke();
			},
			rect: function (left, top, width, height) {
				let bmp = this.canvas.target
					? this.canvas.target
					: this.canvas.dom;
				if (!bmp || !bmp.getContext) return;
				let ctx = bmp.getContext("2d");
				ctx.beginPath();
				ctx.rect(left, top, width, height);
				ctx.stroke();
			},
			fillRect: function (left, top, width, height) {
				let bmp = this.canvas.target
					? this.canvas.target
					: this.canvas.dom;
				if (!bmp || !bmp.getContext) return;
				let ctx = bmp.getContext("2d");
				ctx.fillRect(left, top, width, height);
			},
			frameRect: function (left, top, width, height) {
				let bmp = this.canvas.target
					? this.canvas.target
					: this.canvas.dom;
				if (!bmp || !bmp.getContext) return;
				let ctx = bmp.getContext("2d");
				ctx.beginPath();
				ctx.rect(left, top, width, height);
				ctx.fill();
				ctx.stroke();
			},
			circle: function (x, y, radius) {
				let bmp = this.canvas.target
					? this.canvas.target
					: this.canvas.dom;
				if (!bmp || !bmp.getContext) return;
				let ctx = bmp.getContext("2d");
				ctx.beginPath();
				ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
				ctx.stroke();
			},
			fillCircle: function (x, y, radius) {
				let bmp = this.canvas.target
					? this.canvas.target
					: this.canvas.dom;
				if (!bmp || !bmp.getContext) return;
				let ctx = bmp.getContext("2d");
				ctx.beginPath();
				ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
				ctx.fill();
			},
			frameCircle: function (x, y, radius) {
				let bmp = this.canvas.target
					? this.canvas.target
					: this.canvas.dom;
				if (!bmp || !bmp.getContext) return;
				let ctx = bmp.getContext("2d");
				ctx.beginPath();
				ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
				ctx.fill();
				ctx.stroke();
			},
			curve: function (points, closed) {
				let bmp = this.canvas.target
					? this.canvas.target
					: this.canvas.dom;
				if (!bmp || !bmp.getContext) return;
				let ctx = bmp.getContext("2d");
				ctx.beginPath();
				let n = points.length;
				if (n > 0) {
					let p = points[0];
					ctx.moveTo(p[0], p[1]);
					for (let i = 1; i < n; i++) {
						let p = points[i];
						ctx.lineTo(p[0], p[1]);
					}
				}
				if (closed) ctx.closePath();
				ctx.stroke();
			},
			fillArea: function (points) {
				let bmp = this.canvas.target
					? this.canvas.target
					: this.canvas.dom;
				if (!bmp || !bmp.getContext) return;
				let ctx = bmp.getContext("2d");
				ctx.beginPath();
				let n = points.length;
				if (n > 0) {
					let p = points[0];
					ctx.moveTo(p[0], p[1]);
					for (let i = 1; i < n; i++) {
						let p = points[i];
						ctx.lineTo(p[0], p[1]);
					}
				}
				ctx.closePath();
				ctx.fill();
			},
			frameArea: function (points) {
				let bmp = this.canvas.target
					? this.canvas.target
					: this.canvas.dom;
				if (!bmp || !bmp.getContext) return;
				let ctx = bmp.getContext("2d");
				ctx.beginPath();
				let n = points.length;
				if (n > 0) {
					let p = points[0];
					ctx.moveTo(p[0], p[1]);
					for (let i = 1; i < n; i++) {
						let p = points[i];
						ctx.lineTo(p[0], p[1]);
					}
				}
				ctx.closePath();
				ctx.fill();
				ctx.stroke();
			},
			text: function (x, y, str) {
				let bmp = this.canvas.target
					? this.canvas.target
					: this.canvas.dom;
				if (!bmp || !bmp.getContext) return;
				let ctx = bmp.getContext("2d");
				ctx.textBaseline = "top";
				let lines = str.split("\n");
				for (let i = 0; i < lines.length; i++) {
					ctx.fillText(lines[i], x, y);
					y += this.canvas.font_size;
				}
			},
			getPixel: function (x, y) {
				let bmp = this.canvas.target
					? this.canvas.target
					: this.canvas.dom;
				if (!bmp || !bmp.getContext) return [0, 0, 0, 0];
				let ctx = bmp.getContext("2d");
				let array = ctx.getImageData(x | 0, y | 0, 1, 1).data;
				return array;
			},
			setPixel: function (x, y, data) {
				let bmp = this.canvas.target
					? this.canvas.target
					: this.canvas.dom;
				if (!bmp || !bmp.getContext) return;
				let ctx = bmp.getContext("2d");
				let img = ctx.getImageData(x | 0, y | 0, 1, 1);
				let array = img.data;
				array[0] = data[0];
				array[1] = data[1];
				array[2] = data[2];
				array[3] = data[3];
				ctx.putImageData(img, x | 0, y | 0);
			},
			paintImage: function (x, y, source) {
				let bmp = this.canvas.target
					? this.canvas.target
					: this.canvas.dom;
				if (!bmp || !bmp.getContext) return;
				let ctx = bmp.getContext("2d");
				if (!source) source = this.canvas.dom;
				if (!source) return;
				if (source.width === 0 || source.height === 0) return;
				ctx.drawImage(source, x, y);
			},
			paintImageSection: function (
				dx,
				dy,
				dw,
				dh,
				source,
				sx,
				sy,
				sw,
				sh
			) {
				let bmp = this.canvas.target
					? this.canvas.target
					: this.canvas.dom;
				if (!bmp || !bmp.getContext) return;
				let ctx = bmp.getContext("2d");
				if (!source) source = this.canvas.dom;
				if (!source) return;
				if (source.width === 0 || source.height === 0) return;
				ctx.drawImage(source, sx, sy, sw, sh, dx, dy, dw, dh);
			},
			reset: function () {
				let bmp = this.canvas.target
					? this.canvas.target
					: this.canvas.dom;
				if (!bmp || !bmp.getContext) return;
				let ctx = bmp.getContext("2d");
				ctx.setTransform(1, 0, 0, 1, 0, 0);
			},
			shift: function (dx, dy) {
				let bmp = this.canvas.target
					? this.canvas.target
					: this.canvas.dom;
				if (!bmp || !bmp.getContext) return;
				let ctx = bmp.getContext("2d");
				ctx.translate(dx, dy);
			},
			scale: function (factor) {
				let bmp = this.canvas.target
					? this.canvas.target
					: this.canvas.dom;
				if (!bmp || !bmp.getContext) return;
				let ctx = bmp.getContext("2d");
				ctx.scale(factor, factor);
			},
			rotate: function (angle) {
				let bmp = this.canvas.target
					? this.canvas.target
					: this.canvas.dom;
				if (!bmp || !bmp.getContext) return;
				let ctx = bmp.getContext("2d");
				ctx.rotate(angle);
			},
			transform: function (A, b) {
				let bmp = this.canvas.target
					? this.canvas.target
					: this.canvas.dom;
				if (!bmp || !bmp.getContext) return;
				let ctx = bmp.getContext("2d");
				ctx.transform(A[0][0], A[1][0], A[0][1], A[1][1], b[0], b[1]);
			},
		},

		audioContext: typeof atx === "undefined" ? undefined : new atx(),

		localStorage:
			typeof window === "undefined"
				? fakeLocalStorage
				: typeof window.localStorage === "undefined"
				? fakeLocalStorage
				: window.localStorage,

		startup: function () {
			//			this.turtle.reset.call(
			//				this.turtle,
			//				0,
			//				0,
			//				0,
			//				true
			//			);

			if (this.canvas.dom && this.canvas.dom.getContext)
				this.canvas.dom.getContext("2d").globalAlpha = 1;

			if (typeof atx !== "undefined") this.audioContext = new atx();
		},
		shutdown: function () {
			if (this.audioContext) {
				this.audioContext.close();
				this.audioContext = null;
			}
		},
	};
}
