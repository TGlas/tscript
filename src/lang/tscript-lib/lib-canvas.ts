import { ErrorHelper } from "../errors/ErrorHelper";
import { TScript } from "..";
import { Typeid } from "../helpers/typeIds";
import { checkURI } from "../helpers/dataURI";
import { tscipt_canvas } from "./lib-canvas.tscript";

export const lib_canvas = {
	source: tscipt_canvas,
	impl: {
		canvas: {
			setDrawingTarget: function (bitmap) {
				if (bitmap.type.id === Typeid.typeid_null) {
					this.service.canvas.setDrawingTarget.call(
						this.service,
						null
					);
				} else if (
					TScript.isDerivedFrom(
						bitmap.type,
						this.program.names.canvas.names.Bitmap.id
					)
				) {
					this.service.canvas.setDrawingTarget.call(
						this.service,
						bitmap.value.b
					);
				} else
					ErrorHelper.error(
						"/argument-mismatch/am-1",
						[
							"bitmap",
							"canvas.setDrawingTarget",
							"Bitmap or null",
							TScript.displayname(bitmap.type),
						],
						this.stack
					);

				return {
					type: this.program.types[Typeid.typeid_null],
					value: { b: null },
				};
			},
			width: function () {
				let ret = this.service.canvas.width.call(this.service);
				return {
					type: this.program.types[Typeid.typeid_integer],
					value: { b: ret },
				};
			},
			height: function () {
				let ret = this.service.canvas.height.call(this.service);
				return {
					type: this.program.types[Typeid.typeid_integer],
					value: { b: ret },
				};
			},
			setLineWidth: function (width) {
				if (!TScript.isNumeric(width.type))
					ErrorHelper.error(
						"/argument-mismatch/am-1",
						[
							"width",
							"canvas.setLineWidth",
							"numeric argument",
							TScript.displayname(width.type),
						],
						this.stack
					);
				if (width.value.b <= 0)
					ErrorHelper.error(
						"/user/ue-2",
						[
							"error in canvas.setLineWidth; width must be positive",
						],
						this.stack
					);
				this.service.canvas.setLineWidth.call(
					this.service,
					width.value.b
				);
				return {
					type: this.program.types[Typeid.typeid_null],
					value: { b: null },
				};
			},
			setLineColor: function (red, green, blue, alpha) {
				if (!TScript.isNumeric(red.type))
					ErrorHelper.error(
						"/argument-mismatch/am-1",
						[
							"red",
							"canvas.setLineColor",
							"numeric argument",
							TScript.displayname(red.type),
						],
						this.stack
					);
				if (!TScript.isNumeric(green.type))
					ErrorHelper.error(
						"/argument-mismatch/am-1",
						[
							"green",
							"canvas.setLineColor",
							"numeric argument",
							TScript.displayname(green.type),
						],
						this.stack
					);
				if (!TScript.isNumeric(blue.type))
					ErrorHelper.error(
						"/argument-mismatch/am-1",
						[
							"blue",
							"canvas.setLineColor",
							"numeric argument",
							TScript.displayname(blue.type),
						],
						this.stack
					);
				if (!TScript.isNumeric(alpha.type))
					ErrorHelper.error(
						"/argument-mismatch/am-1",
						[
							"alpha",
							"canvas.setLineColor",
							"numeric argument",
							TScript.displayname(alpha.type),
						],
						this.stack
					);
				this.service.canvas.setLineColor.call(
					this.service,
					red.value.b,
					green.value.b,
					blue.value.b,
					alpha.value.b
				);
				return {
					type: this.program.types[Typeid.typeid_null],
					value: { b: null },
				};
			},
			setFillColor: function (red, green, blue, alpha) {
				if (!TScript.isNumeric(red.type))
					ErrorHelper.error(
						"/argument-mismatch/am-1",
						[
							"red",
							"canvas.setFillColor",
							"numeric argument",
							TScript.displayname(red.type),
						],
						this.stack
					);
				if (!TScript.isNumeric(green.type))
					ErrorHelper.error(
						"/argument-mismatch/am-1",
						[
							"green",
							"canvas.setFillColor",
							"numeric argument",
							TScript.displayname(green.type),
						],
						this.stack
					);
				if (!TScript.isNumeric(blue.type))
					ErrorHelper.error(
						"/argument-mismatch/am-1",
						[
							"blue",
							"canvas.setFillColor",
							"numeric argument",
							TScript.displayname(blue.type),
						],
						this.stack
					);
				if (!TScript.isNumeric(alpha.type))
					ErrorHelper.error(
						"/argument-mismatch/am-1",
						[
							"alpha",
							"canvas.setFillColor",
							"numeric argument",
							TScript.displayname(alpha.type),
						],
						this.stack
					);
				this.service.canvas.setFillColor.call(
					this.service,
					red.value.b,
					green.value.b,
					blue.value.b,
					alpha.value.b
				);
				return {
					type: this.program.types[Typeid.typeid_null],
					value: { b: null },
				};
			},
			setOpacity: function (alpha) {
				if (!TScript.isNumeric(alpha.type))
					ErrorHelper.error(
						"/argument-mismatch/am-1",
						[
							"alpha",
							"canvas.setOpacity",
							"numeric argument",
							TScript.displayname(alpha.type),
						],
						this.stack
					);
				if (alpha.value.b < 0 || alpha.value.b > 1)
					ErrorHelper.error(
						"/user/ue-2",
						[
							"error in canvas.setOpacity; alpha must be from the interval [0, 1]",
						],
						this.stack
					);
				this.service.canvas.setOpacity.call(
					this.service,
					alpha.value.b
				);
				return {
					type: this.program.types[Typeid.typeid_null],
					value: { b: null },
				};
			},
			setFont: function (fontface, fontsize) {
				if (!TScript.isDerivedFrom(fontface.type, Typeid.typeid_string))
					ErrorHelper.error(
						"/argument-mismatch/am-1",
						[
							"fontface",
							"canvas.setFont",
							"string",
							TScript.displayname(fontface.type),
						],
						this.stack
					);
				if (!TScript.isNumeric(fontsize.type))
					ErrorHelper.error(
						"/argument-mismatch/am-1",
						[
							"fontsize",
							"canvas.setFont",
							"numeric argument",
							TScript.displayname(fontsize.type),
						],
						this.stack
					);
				if (fontsize.value.b <= 0)
					ErrorHelper.error(
						"/user/ue-2",
						["error in canvas.setFont; fontsize must be positive"],
						this.stack
					);
				this.service.canvas.setFont.call(
					this.service,
					fontface.value.b,
					fontsize.value.b
				);
				return {
					type: this.program.types[Typeid.typeid_null],
					value: { b: null },
				};
			},
			setTextAlign: function (alignment) {
				if (
					!TScript.isDerivedFrom(alignment.type, Typeid.typeid_string)
				)
					ErrorHelper.error(
						"/argument-mismatch/am-1",
						[
							"alignment",
							"canvas.setTextAlign",
							"string",
							TScript.displayname(alignment.type),
						],
						this.stack
					);
				let a = alignment.value.b;
				if (a !== "left" && a !== "center" && a !== "right")
					ErrorHelper.error(
						"/user/ue-2",
						[
							"error in canvas.setTextAlign; invalid alignment value",
						],
						this.stack
					);
				this.service.canvas.setTextAlign.call(
					this.service,
					alignment.value.b
				);
				return {
					type: this.program.types[Typeid.typeid_null],
					value: { b: null },
				};
			},
			clear: function () {
				this.service.canvas.clear.call(this.service);
				return {
					type: this.program.types[Typeid.typeid_null],
					value: { b: null },
				};
			},
			line: function (x1, y1, x2, y2) {
				if (!TScript.isNumeric(x1.type))
					ErrorHelper.error(
						"/argument-mismatch/am-1",
						[
							"x1",
							"canvas.line",
							"numeric argument",
							TScript.displayname(x1.type),
						],
						this.stack
					);
				if (!TScript.isNumeric(y1.type))
					ErrorHelper.error(
						"/argument-mismatch/am-1",
						[
							"y1",
							"canvas.line",
							"numeric argument",
							TScript.displayname(y1.type),
						],
						this.stack
					);
				if (!TScript.isNumeric(x2.type))
					ErrorHelper.error(
						"/argument-mismatch/am-1",
						[
							"x2",
							"canvas.line",
							"numeric argument",
							TScript.displayname(x2.type),
						],
						this.stack
					);
				if (!TScript.isNumeric(y2.type))
					ErrorHelper.error(
						"/argument-mismatch/am-1",
						[
							"y2",
							"canvas.line",
							"numeric argument",
							TScript.displayname(y2.type),
						],
						this.stack
					);
				this.service.canvas.line.call(
					this.service,
					x1.value.b,
					y1.value.b,
					x2.value.b,
					y2.value.b
				);
				return {
					type: this.program.types[Typeid.typeid_null],
					value: { b: null },
				};
			},
			rect: function (left, top, width, height) {
				if (!TScript.isNumeric(left.type))
					ErrorHelper.error(
						"/argument-mismatch/am-1",
						[
							"left",
							"canvas.rect",
							"numeric argument",
							TScript.displayname(left.type),
						],
						this.stack
					);
				if (!TScript.isNumeric(top.type))
					ErrorHelper.error(
						"/argument-mismatch/am-1",
						[
							"top",
							"canvas.rect",
							"numeric argument",
							TScript.displayname(top.type),
						],
						this.stack
					);
				if (!TScript.isNumeric(width.type))
					ErrorHelper.error(
						"/argument-mismatch/am-1",
						[
							"width",
							"canvas.rect",
							"numeric argument",
							TScript.displayname(width.type),
						],
						this.stack
					);
				if (!TScript.isNumeric(height.type))
					ErrorHelper.error(
						"/argument-mismatch/am-1",
						[
							"height",
							"canvas.rect",
							"numeric argument",
							TScript.displayname(height.type),
						],
						this.stack
					);
				this.service.canvas.rect.call(
					this.service,
					left.value.b,
					top.value.b,
					width.value.b,
					height.value.b
				);
				return {
					type: this.program.types[Typeid.typeid_null],
					value: { b: null },
				};
			},
			fillRect: function (left, top, width, height) {
				if (!TScript.isNumeric(left.type))
					ErrorHelper.error(
						"/argument-mismatch/am-1",
						[
							"left",
							"canvas.fillRect",
							"numeric argument",
							TScript.displayname(left.type),
						],
						this.stack
					);
				if (!TScript.isNumeric(top.type))
					ErrorHelper.error(
						"/argument-mismatch/am-1",
						[
							"top",
							"canvas.fillRect",
							"numeric argument",
							TScript.displayname(top.type),
						],
						this.stack
					);
				if (!TScript.isNumeric(width.type))
					ErrorHelper.error(
						"/argument-mismatch/am-1",
						[
							"width",
							"canvas.fillRect",
							"numeric argument",
							TScript.displayname(width.type),
						],
						this.stack
					);
				if (!TScript.isNumeric(height.type))
					ErrorHelper.error(
						"/argument-mismatch/am-1",
						[
							"height",
							"canvas.fillRect",
							"numeric argument",
							TScript.displayname(height.type),
						],
						this.stack
					);
				this.service.canvas.fillRect.call(
					this.service,
					left.value.b,
					top.value.b,
					width.value.b,
					height.value.b
				);
				return {
					type: this.program.types[Typeid.typeid_null],
					value: { b: null },
				};
			},
			frameRect: function (left, top, width, height) {
				if (!TScript.isNumeric(left.type))
					ErrorHelper.error(
						"/argument-mismatch/am-1",
						[
							"left",
							"canvas.frameRect",
							"numeric argument",
							TScript.displayname(left.type),
						],
						this.stack
					);
				if (!TScript.isNumeric(top.type))
					ErrorHelper.error(
						"/argument-mismatch/am-1",
						[
							"top",
							"canvas.frameRect",
							"numeric argument",
							TScript.displayname(top.type),
						],
						this.stack
					);
				if (!TScript.isNumeric(width.type))
					ErrorHelper.error(
						"/argument-mismatch/am-1",
						[
							"width",
							"canvas.frameRect",
							"numeric argument",
							TScript.displayname(width.type),
						],
						this.stack
					);
				if (!TScript.isNumeric(height.type))
					ErrorHelper.error(
						"/argument-mismatch/am-1",
						[
							"height",
							"canvas.frameRect",
							"numeric argument",
							TScript.displayname(height.type),
						],
						this.stack
					);
				this.service.canvas.frameRect.call(
					this.service,
					left.value.b,
					top.value.b,
					width.value.b,
					height.value.b
				);
				return {
					type: this.program.types[Typeid.typeid_null],
					value: { b: null },
				};
			},
			circle: function (x, y, radius) {
				if (!TScript.isNumeric(x.type))
					ErrorHelper.error(
						"/argument-mismatch/am-1",
						[
							"x",
							"canvas.circle",
							"numeric argument",
							TScript.displayname(x.type),
						],
						this.stack
					);
				if (!TScript.isNumeric(y.type))
					ErrorHelper.error(
						"/argument-mismatch/am-1",
						[
							"y",
							"canvas.circle",
							"numeric argument",
							TScript.displayname(y.type),
						],
						this.stack
					);
				if (!TScript.isNumeric(radius.type))
					ErrorHelper.error(
						"/argument-mismatch/am-1",
						[
							"radius",
							"canvas.circle",
							"numeric argument",
							TScript.displayname(radius.type),
						],
						this.stack
					);
				if (radius.value.b < 0)
					ErrorHelper.error(
						"/argument-mismatch/am-49",
						[],
						this.stack
					);
				this.service.canvas.circle.call(
					this.service,
					x.value.b,
					y.value.b,
					radius.value.b
				);
				return {
					type: this.program.types[Typeid.typeid_null],
					value: { b: null },
				};
			},
			fillCircle: function (x, y, radius) {
				if (!TScript.isNumeric(x.type))
					ErrorHelper.error(
						"/argument-mismatch/am-1",
						[
							"x",
							"canvas.fillCircle",
							"numeric argument",
							TScript.displayname(x.type),
						],
						this.stack
					);
				if (!TScript.isNumeric(y.type))
					ErrorHelper.error(
						"/argument-mismatch/am-1",
						[
							"y",
							"canvas.fillCircle",
							"numeric argument",
							TScript.displayname(y.type),
						],
						this.stack
					);
				if (!TScript.isNumeric(radius.type))
					ErrorHelper.error(
						"/argument-mismatch/am-1",
						[
							"radius",
							"canvas.fillCircle",
							"numeric argument",
							TScript.displayname(radius.type),
						],
						this.stack
					);
				if (radius.value.b < 0)
					ErrorHelper.error(
						"/argument-mismatch/am-49",
						[],
						this.stack
					);
				this.service.canvas.fillCircle.call(
					this.service,
					x.value.b,
					y.value.b,
					radius.value.b
				);
				return {
					type: this.program.types[Typeid.typeid_null],
					value: { b: null },
				};
			},
			frameCircle: function (x, y, radius) {
				if (!TScript.isNumeric(x.type))
					ErrorHelper.error(
						"/argument-mismatch/am-1",
						[
							"x",
							"canvas.frameCircle",
							"numeric argument",
							TScript.displayname(x.type),
						],
						this.stack
					);
				if (!TScript.isNumeric(y.type))
					ErrorHelper.error(
						"/argument-mismatch/am-1",
						[
							"y",
							"canvas.frameCircle",
							"numeric argument",
							TScript.displayname(y.type),
						],
						this.stack
					);
				if (!TScript.isNumeric(radius.type))
					ErrorHelper.error(
						"/argument-mismatch/am-1",
						[
							"radius",
							"canvas.frameCircle",
							"numeric argument",
							TScript.displayname(radius.type),
						],
						this.stack
					);
				if (radius.value.b < 0)
					ErrorHelper.error(
						"/argument-mismatch/am-49",
						[],
						this.stack
					);
				this.service.canvas.frameCircle.call(
					this.service,
					x.value.b,
					y.value.b,
					radius.value.b
				);
				return {
					type: this.program.types[Typeid.typeid_null],
					value: { b: null },
				};
			},
			curve: function (points, closed) {
				if (!TScript.isDerivedFrom(points.type, Typeid.typeid_array))
					ErrorHelper.error(
						"/argument-mismatch/am-1",
						[
							"points",
							"canvas.curve",
							"array",
							TScript.displayname(points.type),
						],
						this.stack
					);
				if (!TScript.isDerivedFrom(closed.type, Typeid.typeid_boolean))
					ErrorHelper.error(
						"/argument-mismatch/am-1",
						[
							"closed",
							"canvas.curve",
							"boolean",
							TScript.displayname(closed.type),
						],
						this.stack
					);
				let list = new Array();
				for (let i = 0; i < points.value.b.length; i++) {
					let p = points.value.b[i];
					if (!TScript.isDerivedFrom(p.type, Typeid.typeid_array))
						ErrorHelper.error(
							"/argument-mismatch/am-1",
							[
								"points[" + i + "]",
								"canvas.curve",
								"array",
								TScript.displayname(p.type),
							],
							this.stack
						);
					if (p.value.b.length !== 2)
						ErrorHelper.error(
							"/user/ue-2",
							[
								"error in canvas.curve; point[" +
									i +
									"] must be an array of size two.",
							],
							this.stack
						);
					let x = p.value.b[0];
					let y = p.value.b[1];
					if (!TScript.isNumeric(x.type))
						ErrorHelper.error(
							"/argument-mismatch/am-1",
							[
								"points[" + i + "][0]",
								"canvas.curve",
								"numeric argument",
								TScript.displayname(x.type),
							],
							this.stack
						);
					if (!TScript.isNumeric(y.type))
						ErrorHelper.error(
							"/argument-mismatch/am-1",
							[
								"points[" + i + "][1]",
								"canvas.curve",
								"numeric argument",
								TScript.displayname(y.type),
							],
							this.stack
						);
					list.push([x.value.b, y.value.b]);
				}
				this.service.canvas.curve.call(
					this.service,
					list,
					closed.value.b
				);
				return {
					type: this.program.types[Typeid.typeid_null],
					value: { b: null },
				};
			},
			fillArea: function (points) {
				if (!TScript.isDerivedFrom(points.type, Typeid.typeid_array))
					ErrorHelper.error(
						"/argument-mismatch/am-1",
						[
							"points",
							"canvas.fillArea",
							"array",
							TScript.displayname(points.type),
						],
						this.stack
					);
				let list = new Array();
				for (let i = 0; i < points.value.b.length; i++) {
					let p = points.value.b[i];
					if (!TScript.isDerivedFrom(p.type, Typeid.typeid_array))
						ErrorHelper.error(
							"/argument-mismatch/am-1",
							[
								"points[" + i + "]",
								"canvas.fillArea",
								"array",
								TScript.displayname(p.type),
							],
							this.stack
						);
					if (p.value.b.length !== 2)
						ErrorHelper.error(
							"/user/ue-2",
							[
								"error in canvas.fillArea; point[" +
									i +
									"] must be an array of size two.",
							],
							this.stack
						);
					let x = p.value.b[0];
					let y = p.value.b[1];
					if (!TScript.isNumeric(x.type))
						ErrorHelper.error(
							"/argument-mismatch/am-1",
							[
								"points[" + i + "][0]",
								"canvas.fillArea",
								"numeric argument",
								TScript.displayname(x.type),
							],
							this.stack
						);
					if (!TScript.isNumeric(y.type))
						ErrorHelper.error(
							"/argument-mismatch/am-1",
							[
								"points[" + i + "][1]",
								"canvas.fillArea",
								"numeric argument",
								TScript.displayname(y.type),
							],
							this.stack
						);
					list.push([x.value.b, y.value.b]);
				}
				this.service.canvas.fillArea.call(this.service, list);
				return {
					type: this.program.types[Typeid.typeid_null],
					value: { b: null },
				};
			},
			frameArea: function (points) {
				if (!TScript.isDerivedFrom(points.type, Typeid.typeid_array))
					ErrorHelper.error(
						"/argument-mismatch/am-1",
						[
							"points",
							"canvas.frameArea",
							"array",
							TScript.displayname(points.type),
						],
						this.stack
					);
				let list = new Array();
				for (let i = 0; i < points.value.b.length; i++) {
					let p = points.value.b[i];
					if (!TScript.isDerivedFrom(p.type, Typeid.typeid_array))
						ErrorHelper.error(
							"/argument-mismatch/am-1",
							[
								"points[" + i + "]",
								"canvas.frameArea",
								"array",
								TScript.displayname(p.type),
							],
							this.stack
						);
					if (p.value.b.length !== 2)
						ErrorHelper.error(
							"/user/ue-2",
							[
								"error in canvas.frameArea; point[" +
									i +
									"] must be an array of size two.",
							],
							this.stack
						);
					let x = p.value.b[0];
					let y = p.value.b[1];
					if (!TScript.isNumeric(x.type))
						ErrorHelper.error(
							"/argument-mismatch/am-1",
							[
								"points[" + i + "][0]",
								"canvas.frameArea",
								"numeric argument",
								TScript.displayname(x.type),
							],
							this.stack
						);
					if (!TScript.isNumeric(y.type))
						ErrorHelper.error(
							"/argument-mismatch/am-1",
							[
								"points[" + i + "][1]",
								"canvas.frameArea",
								"numeric argument",
								TScript.displayname(y.type),
							],
							this.stack
						);
					list.push([x.value.b, y.value.b]);
				}
				this.service.canvas.frameArea.call(this.service, list);
				return {
					type: this.program.types[Typeid.typeid_null],
					value: { b: null },
				};
			},
			text: function (x, y, str) {
				if (!TScript.isNumeric(x.type))
					ErrorHelper.error(
						"/argument-mismatch/am-1",
						[
							"x",
							"canvas.text",
							"numeric argument",
							TScript.displayname(x.type),
						],
						this.stack
					);
				if (!TScript.isNumeric(y.type))
					ErrorHelper.error(
						"/argument-mismatch/am-1",
						[
							"y",
							"canvas.text",
							"numeric argument",
							TScript.displayname(y.type),
						],
						this.stack
					);
				this.service.canvas.text.call(
					this.service,
					x.value.b,
					y.value.b,
					TScript.toString(str)
				);
				return {
					type: this.program.types[Typeid.typeid_null],
					value: { b: null },
				};
			},
			reset: function () {
				this.service.canvas.reset.call(this.service);
				return {
					type: this.program.types[Typeid.typeid_null],
					value: { b: null },
				};
			},
			shift: function (dx, dy) {
				if (!TScript.isNumeric(dx.type))
					ErrorHelper.error(
						"/argument-mismatch/am-1",
						[
							"dx",
							"canvas.shift",
							"numeric argument",
							TScript.displayname(dx.type),
						],
						this.stack
					);
				if (!TScript.isNumeric(dy.type))
					ErrorHelper.error(
						"/argument-mismatch/am-1",
						[
							"dy",
							"canvas.shift",
							"numeric argument",
							TScript.displayname(dy.type),
						],
						this.stack
					);
				this.service.canvas.shift.call(
					this.service,
					dx.value.b,
					dy.value.b
				);
				return {
					type: this.program.types[Typeid.typeid_null],
					value: { b: null },
				};
			},
			scale: function (factor) {
				if (!TScript.isNumeric(factor.type))
					ErrorHelper.error(
						"/argument-mismatch/am-1",
						[
							"factor",
							"canvas.scale",
							"numeric argument",
							TScript.displayname(factor.type),
						],
						this.stack
					);
				this.service.canvas.scale.call(this.service, factor.value.b);
				return {
					type: this.program.types[Typeid.typeid_null],
					value: { b: null },
				};
			},
			rotate: function (angle) {
				if (!TScript.isNumeric(angle.type))
					ErrorHelper.error(
						"/argument-mismatch/am-1",
						[
							"angle",
							"canvas.rotate",
							"numeric argument",
							TScript.displayname(angle.type),
						],
						this.stack
					);
				this.service.canvas.rotate.call(this.service, angle.value.b);
				return {
					type: this.program.types[Typeid.typeid_null],
					value: { b: null },
				};
			},
			transform: function (A, b) {
				if (!TScript.isDerivedFrom(A.type, Typeid.typeid_array))
					ErrorHelper.error(
						"/argument-mismatch/am-1",
						[
							"A",
							"canvas.transform",
							"array",
							TScript.displayname(A.type),
						],
						this.stack
					);
				if (!TScript.isDerivedFrom(b.type, Typeid.typeid_array))
					ErrorHelper.error(
						"/argument-mismatch/am-1",
						[
							"b",
							"canvas.transform",
							"array",
							TScript.displayname(b.type),
						],
						this.stack
					);
				if (A.value.b.length !== 2)
					ErrorHelper.error(
						"/user/ue-2",
						[
							"error in canvas.transform; A must be an array of size two.",
						],
						this.stack
					);
				if (
					!TScript.isDerivedFrom(
						A.value.b[0].type,
						Typeid.typeid_array
					)
				)
					ErrorHelper.error(
						"/argument-mismatch/am-1",
						[
							"A[0]",
							"canvas.transform",
							"array",
							TScript.displayname(A.value.b[0].type),
						],
						this.stack
					);
				if (
					!TScript.isDerivedFrom(
						A.value.b[1].type,
						Typeid.typeid_array
					)
				)
					ErrorHelper.error(
						"/argument-mismatch/am-1",
						[
							"A[0]",
							"canvas.transform",
							"array",
							TScript.displayname(A.value.b[1].type),
						],
						this.stack
					);
				if (A.value.b[0].value.b.length !== 2)
					ErrorHelper.error(
						"/user/ue-2",
						[
							"error in canvas.transform; A[0] must be an array of size two.",
						],
						this.stack
					);
				if (A.value.b[1].value.b.length !== 2)
					ErrorHelper.error(
						"/user/ue-2",
						[
							"error in canvas.transform; A[1] must be an array of size two.",
						],
						this.stack
					);
				if (!TScript.isNumeric(A.value.b[0].value.b[0].type))
					ErrorHelper.error(
						"/argument-mismatch/am-1",
						[
							"A[0][0]",
							"canvas.transform",
							"numeric argument",
							TScript.displayname(A.value.b[0].value.b[0].type),
						],
						this.stack
					);
				if (!TScript.isNumeric(A.value.b[0].value.b[1].type))
					ErrorHelper.error(
						"/argument-mismatch/am-1",
						[
							"A[0][1]",
							"canvas.transform",
							"numeric argument",
							TScript.displayname(A.value.b[0].value.b[1].type),
						],
						this.stack
					);
				if (!TScript.isNumeric(A.value.b[1].value.b[0].type))
					ErrorHelper.error(
						"/argument-mismatch/am-1",
						[
							"A[1][0]",
							"canvas.transform",
							"numeric argument",
							TScript.displayname(A.value.b[1].value.b[0].type),
						],
						this.stack
					);
				if (!TScript.isNumeric(A.value.b[1].value.b[1].type))
					ErrorHelper.error(
						"/argument-mismatch/am-1",
						[
							"A[1][1]",
							"canvas.transform",
							"numeric argument",
							TScript.displayname(A.value.b[1].value.b[1].type),
						],
						this.stack
					);
				if (b.value.b.length !== 2)
					ErrorHelper.error(
						"/user/ue-2",
						[
							"error in canvas.transform; b must be an array of size two.",
						],
						this.stack
					);
				if (!TScript.isNumeric(b.value.b[0].type))
					ErrorHelper.error(
						"/argument-mismatch/am-1",
						[
							"b[0]",
							"canvas.transform",
							"numeric argument",
							TScript.displayname(b.value.b[0].type),
						],
						this.stack
					);
				if (!TScript.isNumeric(b.value.b[1].type))
					ErrorHelper.error(
						"/argument-mismatch/am-1",
						[
							"b[1]",
							"canvas.transform",
							"numeric argument",
							TScript.displayname(b.value.b[1].type),
						],
						this.stack
					);
				this.service.canvas.transform.call(
					this.service,
					[
						[
							A.value.b[0].value.b[0].value.b,
							A.value.b[0].value.b[1].value.b,
						],
						[
							A.value.b[1].value.b[0].value.b,
							A.value.b[1].value.b[1].value.b,
						],
					],
					[b.value.b[0].value.b, b.value.b[1].value.b]
				);
				return {
					type: this.program.types[Typeid.typeid_null],
					value: { b: null },
				};
			},
			paintImage: function (x, y, source) {
				if (!TScript.isNumeric(x.type))
					ErrorHelper.error(
						"/argument-mismatch/am-1",
						[
							"x",
							"canvas.paintImage",
							"numeric argument",
							TScript.displayname(x.type),
						],
						this.stack
					);
				if (!TScript.isNumeric(y.type))
					ErrorHelper.error(
						"/argument-mismatch/am-1",
						[
							"y",
							"canvas.paintImage",
							"numeric argument",
							TScript.displayname(y.type),
						],
						this.stack
					);
				if (
					source.type.id !== Typeid.typeid_null &&
					!TScript.isDerivedFrom(
						source.type,
						this.program.names.canvas.names.Bitmap.id
					)
				)
					ErrorHelper.error(
						"/argument-mismatch/am-1",
						[
							"source",
							"canvas.paintImage",
							"canvas.Bitmap or null",
							TScript.displayname(y.type),
						],
						this.stack
					);

				this.service.canvas.paintImage.call(
					this.service,
					x.value.b,
					y.value.b,
					source.value.b
				);

				return {
					type: this.program.types[Typeid.typeid_null],
					value: { b: null },
				};
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
				if (!TScript.isNumeric(dx.type))
					ErrorHelper.error(
						"/argument-mismatch/am-1",
						[
							"dx",
							"canvas.paintImageSection",
							"numeric argument",
							TScript.displayname(dx.type),
						],
						this.stack
					);
				if (!TScript.isNumeric(dy.type))
					ErrorHelper.error(
						"/argument-mismatch/am-1",
						[
							"dy",
							"canvas.paintImageSection",
							"numeric argument",
							TScript.displayname(dy.type),
						],
						this.stack
					);
				if (!TScript.isNumeric(dw.type))
					ErrorHelper.error(
						"/argument-mismatch/am-1",
						[
							"dw",
							"canvas.paintImageSection",
							"numeric argument",
							TScript.displayname(dw.type),
						],
						this.stack
					);
				if (!TScript.isNumeric(dh.type))
					ErrorHelper.error(
						"/argument-mismatch/am-1",
						[
							"dh",
							"canvas.paintImageSection",
							"numeric argument",
							TScript.displayname(dh.type),
						],
						this.stack
					);
				if (
					source.type.id !== Typeid.typeid_null &&
					!TScript.isDerivedFrom(
						source.type,
						this.program.names.canvas.names.Bitmap.id
					)
				)
					ErrorHelper.error(
						"/argument-mismatch/am-1",
						[
							"source",
							"canvas.paintImageSection",
							"canvas.Bitmap or null",
							TScript.displayname(source.type),
						],
						this.stack
					);
				if (!TScript.isNumeric(sx.type))
					ErrorHelper.error(
						"/argument-mismatch/am-1",
						[
							"sx",
							"canvas.paintImageSection",
							"numeric argument",
							TScript.displayname(sx.type),
						],
						this.stack
					);
				if (!TScript.isNumeric(sy.type))
					ErrorHelper.error(
						"/argument-mismatch/am-1",
						[
							"sy",
							"canvas.paintImageSection",
							"numeric argument",
							TScript.displayname(sy.type),
						],
						this.stack
					);
				if (!TScript.isNumeric(sw.type))
					ErrorHelper.error(
						"/argument-mismatch/am-1",
						[
							"sw",
							"canvas.paintImageSection",
							"numeric argument",
							TScript.displayname(sw.type),
						],
						this.stack
					);
				if (!TScript.isNumeric(sh.type))
					ErrorHelper.error(
						"/argument-mismatch/am-1",
						[
							"sh",
							"canvas.paintImageSection",
							"numeric argument",
							TScript.displayname(sh.type),
						],
						this.stack
					);

				this.service.canvas.paintImageSection.call(
					this.service,
					dx.value.b,
					dy.value.b,
					dw.value.b,
					dh.value.b,
					source.value.b,
					sx.value.b,
					sy.value.b,
					sw.value.b,
					sh.value.b
				);

				return {
					type: this.program.types[Typeid.typeid_null],
					value: { b: null },
				};
			},
			getPixel: function (x, y) {
				if (!TScript.isNumeric(x.type))
					ErrorHelper.error(
						"/argument-mismatch/am-1",
						[
							"x",
							"canvas.getPixel",
							"numeric argument",
							TScript.displayname(x.type),
						],
						this.stack
					);
				if (!TScript.isNumeric(y.type))
					ErrorHelper.error(
						"/argument-mismatch/am-1",
						[
							"y",
							"canvas.getPixel",
							"numeric argument",
							TScript.displayname(y.type),
						],
						this.stack
					);
				let data = this.service.canvas.getPixel.call(
					this.service,
					x.value.b,
					y.value.b
				);
				let arr = new Array();
				for (let i = 0; i < 4; i++)
					arr.push({
						type: this.program.types[Typeid.typeid_integer],
						value: { b: data[i] },
					});
				return {
					type: this.program.types[Typeid.typeid_array],
					value: { b: arr },
				};
			},
			setPixel: function (x, y, data) {
				if (!TScript.isNumeric(x.type))
					ErrorHelper.error(
						"/argument-mismatch/am-1",
						[
							"x",
							"canvas.setPixel",
							"numeric argument",
							TScript.displayname(x.type),
						],
						this.stack
					);
				if (!TScript.isNumeric(y.type))
					ErrorHelper.error(
						"/argument-mismatch/am-1",
						[
							"y",
							"canvas.setPixel",
							"numeric argument",
							TScript.displayname(y.type),
						],
						this.stack
					);
				if (!TScript.isDerivedFrom(data.type, Typeid.typeid_array))
					ErrorHelper.error(
						"/argument-mismatch/am-1",
						[
							"data",
							"canvas.setPixel",
							"array",
							TScript.displayname(data.type),
						],
						this.stack
					);

				let d = new Array();
				if (data.value.b.length != 4)
					ErrorHelper.error(
						"/argument-mismatch/am-47",
						[],
						this.stack
					);
				for (let i = 0; i < 4; i++) {
					if (
						!TScript.isDerivedFrom(
							data.value.b[i].type,
							Typeid.typeid_integer
						)
					)
						ErrorHelper.error(
							"/argument-mismatch/am-1",
							[
								"data[" + i + "]",
								"canvas.setPixel",
								"integer",
								TScript.displayname(data.value.b[i].type),
							],
							this.stack
						);
					d.push(data.value.b[i].value.b);
				}
				this.service.canvas.setPixel.call(
					this.service,
					x.value.b,
					y.value.b,
					d
				);

				return {
					type: this.program.types[Typeid.typeid_null],
					value: { b: null },
				};
			},
			Bitmap: {
				constructor: function (object, resourceOrWidth, height) {
					if (TScript.isNumeric(resourceOrWidth.type)) {
						// create canvas of given dimensions
						if (!TScript.isNumeric(height.type))
							ErrorHelper.error(
								"/argument-mismatch/am-1",
								[
									"height",
									"canvas.Bitmap.constructor",
									"numeric argument",
									TScript.displayname(height.type),
								],
								this.stack
							);
						if (resourceOrWidth.value.b < 0 || height.value.b < 0)
							ErrorHelper.error(
								"/user/ue-2",
								[
									"error in canvas.Bitmap.constructor; width and height must not be negative",
								],
								this.stack
							);
						let canvas = document.createElement("canvas");
						canvas.width = resourceOrWidth.value.b | 0;
						canvas.height = height.value.b | 0;
						object.value.b = canvas;
					} else if (
						TScript.isDerivedFrom(
							resourceOrWidth.type,
							Typeid.typeid_string
						)
					) {
						// create canvas from resource
						let mime = checkURI(resourceOrWidth.value.b);
						if (mime === null || mime.substring(0, 6) != "image/")
							ErrorHelper.error("/user/am-46", [], this.stack);

						let canvas = document.createElement("canvas");
						let context = canvas.getContext("2d");
						let img = new Image();
						img.onload = function () {
							canvas.width = img.width;
							canvas.height = img.height;
							context?.drawImage(img, 0, 0);
						};
						img.src = resourceOrWidth.value.b;
						object.value.b = canvas;

						// give the interpreter time to load the image
						this.status = "waiting";
						this.waittime = new Date().getTime();
					} else
						ErrorHelper.error(
							"/argument-mismatch/am-1",
							[
								"resourceOrWidth",
								"canvas.Bitmap.constructor",
								"numeric argument or string",
								TScript.displayname(resourceOrWidth.type),
							],
							this.stack
						);
				},
				width: function (object) {
					let ret = object.value.b.width;
					return {
						type: this.program.types[Typeid.typeid_integer],
						value: { b: ret },
					};
				},
				height: function (object) {
					let ret = object.value.b.height;
					return {
						type: this.program.types[Typeid.typeid_integer],
						value: { b: ret },
					};
				},
			},
		},
	},
};
