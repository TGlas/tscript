import { ErrorHelper } from "../errors/ErrorHelper";
import { TScript } from "..";
import { Typeid } from "../helpers/typeIds";
import { tscript_turle } from "./lib-turtle.tscript";

export const lib_turtle = {
	source: tscript_turle,
	impl: {
		turtle: {
			reset: function (x, y, degrees, down) {
				if (!TScript.isNumeric(x.type))
					ErrorHelper.error(
						"/argument-mismatch/am-1",
						[
							"x",
							"turtle.reset",
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
							"turtle.reset",
							"numeric argument",
							TScript.displayname(y.type),
						],
						this.stack
					);
				if (!TScript.isNumeric(degrees.type))
					ErrorHelper.error(
						"/argument-mismatch/am-1",
						[
							"degrees",
							"turtle.reset",
							"numeric argument",
							TScript.displayname(degrees.type),
						],
						this.stack
					);
				if (!TScript.isDerivedFrom(down.type, Typeid.typeid_boolean))
					ErrorHelper.error(
						"/argument-mismatch/am-1",
						[
							"down",
							"turtle.reset",
							"boolean",
							TScript.displayname(down.type),
						],
						this.stack
					);
				if (this.service.turtle)
					this.service.turtle.reset.call(
						this.service,
						x.value.b,
						y.value.b,
						degrees.value.b,
						down.value.b
					);
				return {
					type: this.program.types[Typeid.typeid_null],
					value: { b: null },
				};
			},
			move: function (distance) {
				if (!TScript.isNumeric(distance.type))
					ErrorHelper.error(
						"/argument-mismatch/am-1",
						[
							"distance",
							"turtle.move",
							"numeric argument",
							TScript.displayname(distance.type),
						],
						this.stack
					);
				if (this.service.turtle)
					this.service.turtle.move.call(
						this.service,
						distance.value.b
					);
				return {
					type: this.program.types[Typeid.typeid_null],
					value: { b: null },
				};
			},
			turn: function (degrees) {
				if (!TScript.isNumeric(degrees.type))
					ErrorHelper.error(
						"/argument-mismatch/am-1",
						[
							"degrees",
							"turtle.turn",
							"numeric argument",
							TScript.displayname(degrees.type),
						],
						this.stack
					);
				if (this.service.turtle)
					this.service.turtle.turn.call(
						this.service,
						degrees.value.b
					);
				return {
					type: this.program.types[Typeid.typeid_null],
					value: { b: null },
				};
			},
			color: function (red, green, blue) {
				if (!TScript.isNumeric(red.type))
					ErrorHelper.error(
						"/argument-mismatch/am-1",
						[
							"red",
							"turtle.color",
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
							"turtle.color",
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
							"turtle.color",
							"numeric argument",
							TScript.displayname(blue.type),
						],
						this.stack
					);
				if (this.service.turtle)
					this.service.turtle.color.call(
						this.service,
						red.value.b,
						green.value.b,
						blue.value.b
					);
				return {
					type: this.program.types[Typeid.typeid_null],
					value: { b: null },
				};
			},
			pen: function (down) {
				if (!TScript.isDerivedFrom(down.type, Typeid.typeid_boolean))
					ErrorHelper.error(
						"/argument-mismatch/am-1",
						[
							"down",
							"turtle.pen",
							"boolean",
							TScript.displayname(down.type),
						],
						this.stack
					);
				if (this.service.turtle)
					this.service.turtle.pen.call(this.service, down.value.b);
				return {
					type: this.program.types[Typeid.typeid_null],
					value: { b: null },
				};
			},
		},
	},
};
