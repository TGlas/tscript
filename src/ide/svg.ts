export function createSvg(width: string, height: string): SVGSVGElement {
	let svg: SVGSVGElement = document.createElementNS(
		"http://www.w3.org/2000/svg",
		"svg"
	);
	svg.setAttribute("width", width);
	svg.setAttribute("height", height);
	return svg;
}

function createSvgElement(type, properties) {
	let el = document.createElementNS("http://www.w3.org/2000/svg", type);
	for (let p in properties) {
		if (properties.hasOwnProperty(p)) el.setAttribute(p, properties[p]);
	}
	return el;
}

export class SVGDrawingContext {
	public readonly svg: SVGSVGElement;
	#classname: string;
	#style: string;
	#path?: string;

	constructor(svg: SVGSVGElement) {
		this.svg = svg;
		this.#classname = "";
		this.#style = "";
	}

	setClass(classname: string): SVGDrawingContext {
		this.#classname = classname;
		this.#style = "";
		return this;
	}

	setStyle(style: string): SVGDrawingContext {
		this.#classname = "";
		this.#style = style;
		return this;
	}

	setClassAndStyle(classname: string, style: string): SVGDrawingContext {
		this.#style = style;
		this.#classname = classname;
		return this;
	}

	#addElement(el: SVGElement) {
		if (this.#classname) el.setAttribute("class", this.#classname);
		if (this.#style) el.setAttribute("style", this.#style);
		this.svg.appendChild(el);
		return this;
	}

	rect(
		x: number,
		y: number,
		width: number,
		height: number
	): SVGDrawingContext {
		let el = createSvgElement("rect", { x, y, width, height });

		this.#addElement(el);
		return this;
	}

	circle(cx: number, cy: number, r: number): SVGDrawingContext {
		let el = createSvgElement("circle", { cx, cy, r });

		this.#addElement(el);
		return this;
	}

	line(x1: number, y1: number, x2: number, y2: number): SVGDrawingContext {
		let el = createSvgElement("line", { x1, y1, x2, y2 });

		this.#addElement(el);
		return this;
	}

	_accumulatePoints(points: Array<[number, number]>): string {
		let p = "";
		for (let i = 0; i < points.length; ++i) {
			if (p) p += " ";
			p += points[i][0] + "," + points[i][1];
		}
		return p;
	}

	polygon(...points_args: Array<[number, number]>): SVGDrawingContext {
		let points = this._accumulatePoints(points_args);
		let el = createSvgElement("polygon", { points });

		this.#addElement(el);
		return this;
	}
	polyline(...points_args: Array<[number, number]>): SVGDrawingContext {
		let points = this._accumulatePoints(points_args);
		let el = createSvgElement("polyline", { points });

		this.#addElement(el);
		return this;
	}

	beginPath(): SVGDrawingContext {
		this.#path = "";
		return this;
	}
	#appendPath(s: string) {
		if (this.#path) this.#path += " ";
		this.#path += s;
	}
	// the following methods should be called between beginPath and endPath

	moveTo(x: number, y: number): SVGDrawingContext {
		this.#appendPath(`M ${x} ${y}`);
		return this;
	}
	lineTo(x: number, y: number): SVGDrawingContext {
		this.#appendPath(`L ${x} ${y}`);
		return this;
	}
	ellipse(
		x: number,
		y: number,
		rx: number,
		ry: number,
		rotation: number,
		startAngle: number,
		endAngle: number
	): SVGDrawingContext {
		//[startAngle, endAngle] = [endAngle, startAngle+Math.PI*2];

		let x0 = x + Math.cos(startAngle) * rx;
		let y0 = y + Math.sin(startAngle) * ry;

		let x1 = x + Math.cos(endAngle) * rx;
		let y1 = y + Math.sin(endAngle) * ry;

		/*let longArc = endAngle-startAngle > Math.PI ? 1 : 0;
		this._appendPath(`M ${x0},${y0}`);
		this._appendPath(`A ${rx},${ry} 0 ${longArc} 1 ${x1},${y1}`);*/

		let xm = x + Math.cos((startAngle + endAngle) / 2) * rx;
		let ym = y + Math.sin((startAngle + endAngle) / 2) * ry;
		let r = (rotation * 180) / Math.PI;

		this.#appendPath(`M ${x0},${y0}`);
		this.#appendPath(`A ${rx},${ry} ${r} 0 1 ${xm},${ym}`);
		this.#appendPath(`A ${rx},${ry} ${r} 0 1 ${x1},${y1}`);

		//this._appendPath(`L ${x1},${y1}`);
		return this;
	}
	arc(
		x: number,
		y: number,
		radius: number,
		startAngle: number,
		endAngle: number
	): SVGDrawingContext {
		this.ellipse(x, y, radius, radius, 0, startAngle, endAngle);
		return this;
	}

	closePath(): SVGDrawingContext {
		this.#appendPath("Z");
		return this;
	}
	endPath(): SVGDrawingContext {
		let d = this.#path;
		this.#path = undefined;
		let el = createSvgElement("path", { d });

		this.#addElement(el);
		return this;
	}
}
