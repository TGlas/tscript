// definition of most unit test

import { Version } from "../version";
import { test_lattice_craft } from "./test_lattice_craft";

export type TscriptExpectation = any;
export type TscriptEvents = any;

export interface _TscriptTest{
	name:string,
	description:string,
	code:string,
	expectation:Array<TscriptExpectation> | object,
}

export interface TscriptParseTest extends _TscriptTest{
	parseOnly:boolean;
}

export interface TscriptEventTest extends _TscriptTest{
	events: undefined | Array<TscriptEvents>;
}

export interface TscriptInputTest extends _TscriptTest{
	input: Array<any>,
}

export interface TscriptBrowserOnlyTest extends _TscriptTest{
	browserOnly: boolean,
}

export type TscriptTest = _TscriptTest | TscriptEventTest | TscriptInputTest | TscriptBrowserOnlyTest | TscriptParseTest;

export  const tests:Array<TscriptTest> = [
	// lexer
	{
		name: "lexer and token types",
		description: "test the types of constants - including errors that remained undetected for much too long",
		code: `
			print(Type(null));
			print(Type(false));
			print(Type(true));
			print(Type(0));
			print(Type(0.0));
			print(Type("null"));
			print(Type("false"));
			print(Type("true"));
			print(Type("0"));
			print(Type("0.0"));
		`,
		expectation: [
				{type: "print", message: "<Type Null>"},
				{type: "print", message: "<Type Boolean>"},
				{type: "print", message: "<Type Boolean>"},
				{type: "print", message: "<Type Integer>"},
				{type: "print", message: "<Type Real>"},
				{type: "print", message: "<Type String>"},
				{type: "print", message: "<Type String>"},
				{type: "print", message: "<Type String>"},
				{type: "print", message: "<Type String>"},
				{type: "print", message: "<Type String>"},
				"finished"],
	},
	{
		name: "incomplete real number format 1",
		description: "notation like .5 is disallowed",
		code: `
			print(.5);
		`,
		expectation: [
				{type: "error", href: "#/errors/syntax/se-42"},
				"parsing failed"],
	},
	{
		name: "incomplete real number format 2",
		description: "notation like 5. is disallowed",
		code: `
			print(5.);
		`,
		expectation: [
				{type: "error", href: "#/errors/syntax/se-1"},
				"parsing failed"],
	},
	{
		name: "incomplete real number format 3",
		description: "notation like 5e is disallowed",
		code: `
			print(5e);
		`,
		expectation: [
				{type: "error", href: "#/errors/syntax/se-1"},
				"parsing failed"],
	},

	{
		name: "event handling",
		description: "test of event handling",
		code: `
			setEventHandler("canvas.mousedown", function(event) { quitEventMode("down"); });
			setEventHandler("canvas.mouseup", null);
			print(enterEventMode());
			setEventHandler("canvas.mousedown", null);
			setEventHandler("canvas.mouseup", function(event) { quitEventMode("up"); });
			print(enterEventMode());
		`,
		events:
		[
			{
				name: "canvas.mousedown",
				type: "canvas.MouseButtonEvent",
				attr: {
					x: 50,
					y: 25,
					button: 0,
					buttons: [true, false, false],
					shift : false,
					control: true,
					alt: false,
					meta: false,
				},
			},
			{
				name: "canvas.mousedown",
				type: "canvas.MouseButtonEvent",
				attr: {
					x: 50,
					y: 25,
					button: 0,
					buttons: [true, false, false],
					shift : false,
					control: true,
					alt: false,
					meta: false,
				},
			},
			{
				name: "canvas.mouseup",
				type: "canvas.MouseButtonEvent",
				attr: {
					x: 50,
					y: 25,
					button: 0,
					buttons: [true, false, false],
					shift : false,
					control: true,
					alt: false,
					meta: false,
				},
			},
		],
		expectation: [
				{type: "print", message: "down"},
				{type: "print", message: "up"},
				"finished"],
	},

	// basic language constructs
	{
		name: "blocks, variables, scoping, and assignment",
		description: "test statements blocks and how they affect scoping of variables",
		code: `
			var a = 0, b = 1;
			{
				print(a);
				var a = 2;
				print(a);
				print(b);
				a = b;
				print(a);
			}
			print(a);
			print(b);
		`,
		expectation: [
				{type: "print", message: "0"},
				{type: "print", message: "2"},
				{type: "print", message: "1"},
				{type: "print", message: "1"},
				{type: "print", message: "0"},
				{type: "print", message: "1"},
				"finished"],
	},
	{
		name: "expressions and operator precedence",
		description: "test expressions and the binding strength of operators",
		code: `
			function f(x)
			{ return x*x; }
			var a = [5, 8, 13, 17];
			var r = 10:20;
			var d = {u: 3, v: 4};
			var e = canvas.MouseMoveEvent();
			e.x = 15;
			print(f(2) / a[1] - 1.5);
			print(-4 and e.x);
			print(r[5] and -4);
			print(-2^4);
			print(2^2 - 2^d["u"] * -2^4);
			print((2^2 - 2^3) * -2^d["v"]);
			print(false and not false or true and true);
		`,
		expectation: [
				{type: "print", message: "-1"},
				{type: "print", message: "12"},
				{type: "print", message: "12"},
				{type: "print", message: "-16"},
				{type: "print", message: "132"},
				{type: "print", message: "64"},
				{type: "print", message: "true"},
				"finished"],
	},

	// control structures
	{
		name: "if-then-else",
		description: "test if-then-else branching",
		code: `
			if true then print("then"); else print("else");
			if false then print("then"); else print("else");
		`,
		expectation: [
				{type: "print", message: "then"},
				{type: "print", message: "else"},
				"finished"],
	},
	{
		name: "for-loop",
		description: "test for-loop repetition",
		code: `
			for 5:8 do print(".");
			for var i in 5:8 do print(i);
			for var i in 8:5 do print(i);
			for var i in [true,null,"p"] do print(i);
			for var i in [] do print(i);
		`,
		expectation: [
				{type: "print", message: "."},
				{type: "print", message: "."},
				{type: "print", message: "."},
				{type: "print", message: "5"},
				{type: "print", message: "6"},
				{type: "print", message: "7"},
				{type: "print", message: "true"},
				{type: "print", message: "null"},
				{type: "print", message: "p"},
				"finished"],
	},
	{
		name: "do-while-loop",
		description: "test do-while-loop repetition",
		code: `
			do print("."); while false;
			var i = 0;
			do { print(i); i += 1; } while i < 3;
		`,
		expectation: [
				{type: "print", message: "."},
				{type: "print", message: "0"},
				{type: "print", message: "1"},
				{type: "print", message: "2"},
				"finished"],
	},
	{
		name: "while-do-loop",
		description: "test while-do-loop repetition",
		code: `
			while false do print(".");
			var i = 0;
			while i < 3 do { print(i); i += 1; }
		`,
		expectation: [
				{type: "print", message: "0"},
				{type: "print", message: "1"},
				{type: "print", message: "2"},
				"finished"],
	},
	{
		name: "break",
		description: "test break to abort a loop",
		code: `
			var i = 0;
			while true do
			{
				print(i);
				i += 1;
				if i == 3 then break;
			}
		`,
		expectation: [
				{type: "print", message: "0"},
				{type: "print", message: "1"},
				{type: "print", message: "2"},
				"finished"],
	},
	{
		name: "continue",
		description: "test continue to skip a loop iteration",
		code: `
			for var i in 0:5 do
			{
				if i == 2 then continue;
				print(i);
			}
		`,
		expectation: [
				{type: "print", message: "0"},
				{type: "print", message: "1"},
				{type: "print", message: "3"},
				{type: "print", message: "4"},
				"finished"],
	},
	{
		name: "return",
		description: "test the return statement",
		code: `
			function f(x)
			{ return x*x; }
			function g()
			{
				print("a");
				return;
				print("b");
			}
			print(f(2));
			print(f(-2));
			print(f(3));
			g();
		`,
		expectation: [
				{type: "print", message: "4"},
				{type: "print", message: "4"},
				{type: "print", message: "9"},
				{type: "print", message: "a"},
				"finished"],
	},
	{
		name: "exceptions",
		description: "test throwing and catching exceptions",
		code: `
			function f()
			{
				print("a");
				throw "foo";
				print("b");
			}
			try
			{
				f();
			}
			catch var ex do
			{
				print(ex);
			}
		`,
		expectation: [
				{type: "print", message: "a"},
				{type: "print", message: "foo"},
				"finished"],
	},

	// operators
	{
		name: "unary operator +",
		description: "test unary operator + on supported types",
		code: `
			print(+5);
			print(+5.25);
		`,
		expectation: [
				{type: "print", message: "5"},
				{type: "print", message: "5.25"},
				"finished"],
	},
	{
		name: "unary operator -",
		description: "test unary operator - on supported types",
		code: `
			print(-5);
			print(-5.25);
		`,
		expectation: [
				{type: "print", message: "-5"},
				{type: "print", message: "-5.25"},
				"finished"],
	},
	{
		name: "unary operator not",
		description: "test unary operator not on supported types",
		code: `
			print(not false);
			print(not true);
		`,
		expectation: [
				{type: "print", message: "true"},
				{type: "print", message: "false"},
				"finished"],
	},
	{
		name: "binary operator +",
		description: "test binary operator + on supported types and type mixtures",
		code: `
			print(3 + 4);
			print(3 + 4.25);
			print(3.25 + 4);
			print(3.25 + 4.25);
			print(3.25 + 4.25 + "a");
			print("a" + 3.25 + 4.25);
			print("a" + (2:5));
			print(2147483647 + 1);
			print(1e308 + 1e308);
		`,
		expectation: [
				{type: "print", message: "7"},
				{type: "print", message: "7.25"},
				{type: "print", message: "7.25"},
				{type: "print", message: "7.5"},
				{type: "print", message: "7.5a"},
				{type: "print", message: "a3.254.25"},
				{type: "print", message: "a2:5"},
				{type: "print", message: "-2147483648"},
				{type: "print", message: "Infinity"},
				"finished"],
	},
	{
		name: "binary operator -",
		description: "test binary operator - on supported types and type mixtures",
		code: `
			print(3 - 4);
			print(3 - 4.25);
			print(3.25 - 4);
			print(3.25 - 4.25);
			print(-2147483647 - 2);
			print(-1e308 - 1e308);
		`,
		expectation: [
				{type: "print", message: "-1"},
				{type: "print", message: "-1.25"},
				{type: "print", message: "-0.75"},
				{type: "print", message: "-1"},
				{type: "print", message: "2147483647"},
				{type: "print", message: "-Infinity"},
				"finished"],
	},
	{
		name: "binary operator *",
		description: "test binary operator * on supported types and type mixtures",
		code: `
			print(3 * 4);
			print(3 * 4.25);
			print(3.25 * 4);
			print(3.5 * 4.5);
			print(65535 * 65536);
			print(65535.0 * 65536);
		`,
		expectation: [
				{type: "print", message: "12"},
				{type: "print", message: "12.75"},
				{type: "print", message: "13"},
				{type: "print", message: "15.75"},
				{type: "print", message: "-65536"},
				{type: "print", message: "4294901760"},
				"finished"],
	},
	{
		name: "binary operator /",
		description: "test binary operator / on supported types and type mixtures",
		code: `
			print(3 / 4);
			print(3 / 4.0);
			print(3.0 / 4);
			print(3.0 / 4.0);
			print(1 / 0);
			print(-1 / 0);
			print(1e200 / 1e-200);
			print(1e-200 / 1e200);
		`,
		expectation: [
				{type: "print", message: "0.75"},
				{type: "print", message: "0.75"},
				{type: "print", message: "0.75"},
				{type: "print", message: "0.75"},
				{type: "print", message: "Infinity"},
				{type: "print", message: "-Infinity"},
				{type: "print", message: "Infinity"},
				{type: "print", message: "0"},
				"finished"],
	},
	{
		name: "binary operator //",
		description: "test binary operator // on supported types and type mixtures",
		code: `
			print(11 // 4);
			print(-11 // 4);
			print(11 // -4);
			print(-11 // -4);
			print(11 // 4.5);
			print(11.5 // 4);
			print(11.5 // 4.5);
			print(-11.5 // 4.5);
			print(11.5 // -4.5);
			print(-11.5 // -4.5);
			print(1.0 // 0.0);
			print(1.0 // -0.0);
		`,
		expectation: [
				{type: "print", message: "2"},
				{type: "print", message: "-3"},
				{type: "print", message: "-3"},
				{type: "print", message: "2"},
				{type: "print", message: "2"},
				{type: "print", message: "2"},
				{type: "print", message: "2"},
				{type: "print", message: "-3"},
				{type: "print", message: "-3"},
				{type: "print", message: "2"},
				{type: "print", message: "Infinity"},
				{type: "print", message: "-Infinity"},
				"finished"],
	},
	{
		name: "binary operator %",
		description: "test binary operator % on supported types and type mixtures",
		code: `
			print(11 % 4);
			print(-11 % 4);
			print(11 % -4);
			print(-11 % -4);
			print(11 % 4.5);
			print(11.5 % 4);
			print(11.5 % 4.5);
			print(-11.5 % 4.5);
			print(11.5 % -4.5);
			print(-11.5 % -4.5);
		`,
		expectation: [
				{type: "print", message: "3"},
				{type: "print", message: "1"},
				{type: "print", message: "1"},
				{type: "print", message: "3"},
				{type: "print", message: "2"},
				{type: "print", message: "3.5"},
				{type: "print", message: "2.5"},
				{type: "print", message: "2"},
				{type: "print", message: "2"},
				{type: "print", message: "2.5"},
				"finished"],
	},
	{
		name: "binary operator ^",
		description: "test binary operator * on supported types and type mixtures",
		code: `
			print(256 ^ 5);
			print(256.0 ^ 5.0);
			print(256.0 ^ 5);
			print(256.0 ^ 200);
			print(256 ^ 0.5);
			print(256 ^ -0.5);
			print(4 ^ -2);
			print(4 ^ -2.0);
		`,
		expectation: [
				{type: "print", message: "0"},
				{type: "print", message: "1099511627776"},
				{type: "print", message: "1099511627776"},
				{type: "print", message: "Infinity"},
				{type: "print", message: "16"},
				{type: "print", message: "0.0625"},
				{type: "print", message: "0.0625"},
				{type: "print", message: "0.0625"},
				"finished"],
	},
	{
		name: "binary operator ==",
		description: "test binary operator == on supported types and type mixtures",
		code: `
			print(null == null);
			print(true == false);
			print(true == true);
			print(false == false);
			print(null == false);
			print(0 == 0);
			print(0 == 0.0);
			print(0.0 == 0.0);
			print(1/0 == 2/0);
			print(1/0 == 0);
			print(0 == "0");
			print("a" == "a");
			print("a" == "A");
			print([] == []);
			print([7] == [7]);
			print([7] == []);
			print([] == null);
			print({} == {});
			print({a:3} == {a:3});
			print({a:3} == {a:4});
			print({a:3} == {A:3});
			print([] == {});
			print(0:3 == 0:3);
			print(3:0 == 3:0);
			print(0:0 == 3:0);
			print(0:0 == 0);
			print(0:0 == null);
			print(math.sqrt == math.sqrt);
			print(math.sin == math.cos);
			print(Integer == Integer);
			print(Integer == "Integer");
			print(Integer == Real);
			print(canvas.MouseMoveEvent() == canvas.MouseMoveEvent());
			var e = canvas.MouseMoveEvent();
			print(e == e);
		`,
		expectation: [
				{type: "print", message: "true"},
				{type: "print", message: "false"},
				{type: "print", message: "true"},
				{type: "print", message: "true"},
				{type: "print", message: "false"},
				{type: "print", message: "true"},
				{type: "print", message: "true"},
				{type: "print", message: "true"},
				{type: "print", message: "true"},
				{type: "print", message: "false"},
				{type: "print", message: "false"},
				{type: "print", message: "true"},
				{type: "print", message: "false"},
				{type: "print", message: "true"},
				{type: "print", message: "true"},
				{type: "print", message: "false"},
				{type: "print", message: "false"},
				{type: "print", message: "true"},
				{type: "print", message: "true"},
				{type: "print", message: "false"},
				{type: "print", message: "false"},
				{type: "print", message: "false"},
				{type: "print", message: "true"},
				{type: "print", message: "true"},
				{type: "print", message: "false"},
				{type: "print", message: "false"},
				{type: "print", message: "false"},
				{type: "print", message: "true"},
				{type: "print", message: "false"},
				{type: "print", message: "true"},
				{type: "print", message: "false"},
				{type: "print", message: "false"},
				{type: "print", message: "false"},
				{type: "print", message: "true"},
				"finished"],
	},
	{
		name: "binary operator !=",
		description: "test binary operator != on supported types and type mixtures",
		code: `
			print(null != null);
			print(true != false);
			print(true != true);
			print(false != false);
			print(null != false);
			print(0 != 0);
			print(0 != 0.0);
			print(0.0 != 0.0);
			print(1/0 != 2/0);
			print(1/0 != 0);
			print(0 != "0");
			print("a" != "a");
			print("a" != "A");
			print([] != []);
			print([7] != [7]);
			print([7] != []);
			print([] != null);
			print({} != {});
			print({a:3} != {a:3});
			print({a:3} != {a:4});
			print({a:3} != {A:3});
			print([] != {});
			print(0:3 != 0:3);
			print(3:0 != 3:0);
			print(0:0 != 3:0);
			print(0:0 != 0);
			print(0:0 != null);
			print(math.sqrt != math.sqrt);
			print(math.sin != math.cos);
			print(Integer != Integer);
			print(Integer != "Integer");
			print(Integer != Real);
			print(canvas.MouseMoveEvent() != canvas.MouseMoveEvent());
			var e = canvas.MouseMoveEvent();
			print(e != e);
		`,
		expectation: [
				{type: "print", message: "false"},
				{type: "print", message: "true"},
				{type: "print", message: "false"},
				{type: "print", message: "false"},
				{type: "print", message: "true"},
				{type: "print", message: "false"},
				{type: "print", message: "false"},
				{type: "print", message: "false"},
				{type: "print", message: "false"},
				{type: "print", message: "true"},
				{type: "print", message: "true"},
				{type: "print", message: "false"},
				{type: "print", message: "true"},
				{type: "print", message: "false"},
				{type: "print", message: "false"},
				{type: "print", message: "true"},
				{type: "print", message: "true"},
				{type: "print", message: "false"},
				{type: "print", message: "false"},
				{type: "print", message: "true"},
				{type: "print", message: "true"},
				{type: "print", message: "true"},
				{type: "print", message: "false"},
				{type: "print", message: "false"},
				{type: "print", message: "true"},
				{type: "print", message: "true"},
				{type: "print", message: "true"},
				{type: "print", message: "false"},
				{type: "print", message: "true"},
				{type: "print", message: "false"},
				{type: "print", message: "true"},
				{type: "print", message: "true"},
				{type: "print", message: "true"},
				{type: "print", message: "false"},
				"finished"],
	},
	{
		name: "binary operator <",
		description: "test binary operator < on supported types and type mixtures",
		code: `
			print(0 < 0);
			print(0 < 1);
			print(1 < 0);
			print(0 < 0.0);
			print(0 < 1.0);
			print(1 < 0.0);
			print(1/0 < 2/0);
			print(1/0 < 0);
			print(0 < 1/0);
			print(-1/0 < 1/0);
			print("a" < "a");
			print("a" < "A");
			print("A" < "a");
			print([3,"a"] < [3,"a",null]);
			print([3,4,"a"] < [3,4,"a"]);
		`,
		expectation: [
				{type: "print", message: "false"},
				{type: "print", message: "true"},
				{type: "print", message: "false"},
				{type: "print", message: "false"},
				{type: "print", message: "true"},
				{type: "print", message: "false"},
				{type: "print", message: "false"},
				{type: "print", message: "false"},
				{type: "print", message: "true"},
				{type: "print", message: "true"},
				{type: "print", message: "false"},
				{type: "print", message: "false"},
				{type: "print", message: "true"},
				{type: "print", message: "true"},
				{type: "print", message: "false"},
				"finished"],
	},
	{
		name: "binary operator <=",
		description: "test binary operator <= on supported types and type mixtures",
		code: `
			print(0 <= 0);
			print(0 <= 1);
			print(1 <= 0);
			print(0 <= 0.0);
			print(0 <= 1.0);
			print(1 <= 0.0);
			print(1/0 <= 2/0);
			print(1/0 <= 0);
			print(0 <= 1/0);
			print(-1/0 <= 1/0);
			print("a" <= "a");
			print("a" <= "A");
			print("A" <= "a");
			print([3,"a"] <= [3,"a",null]);
			print([3,4,"a"] <= [3,4,"a"]);
		`,
		expectation: [
				{type: "print", message: "true"},
				{type: "print", message: "true"},
				{type: "print", message: "false"},
				{type: "print", message: "true"},
				{type: "print", message: "true"},
				{type: "print", message: "false"},
				{type: "print", message: "true"},
				{type: "print", message: "false"},
				{type: "print", message: "true"},
				{type: "print", message: "true"},
				{type: "print", message: "true"},
				{type: "print", message: "false"},
				{type: "print", message: "true"},
				{type: "print", message: "true"},
				{type: "print", message: "true"},
				"finished"],
	},
	{
		name: "binary operator >",
		description: "test binary operator > on supported types and type mixtures",
		code: `
			print(0 > 0);
			print(0 > 1);
			print(1 > 0);
			print(0 > 0.0);
			print(0 > 1.0);
			print(1 > 0.0);
			print(1/0 > 2/0);
			print(1/0 > 0);
			print(0 > 1/0);
			print(-1/0 > 1/0);
			print("a" > "a");
			print("a" > "A");
			print("A" > "a");
			print([3,"a"] > [3,"a",null]);
			print([3,4,"a"] > [3,4,"a"]);
		`,
		expectation: [
				{type: "print", message: "false"},
				{type: "print", message: "false"},
				{type: "print", message: "true"},
				{type: "print", message: "false"},
				{type: "print", message: "false"},
				{type: "print", message: "true"},
				{type: "print", message: "false"},
				{type: "print", message: "true"},
				{type: "print", message: "false"},
				{type: "print", message: "false"},
				{type: "print", message: "false"},
				{type: "print", message: "true"},
				{type: "print", message: "false"},
				{type: "print", message: "false"},
				{type: "print", message: "false"},
				"finished"],
	},
	{
		name: "binary operator >=",
		description: "test binary operator >= on supported types and type mixtures",
		code: `
			print(0 >= 0);
			print(0 >= 1);
			print(1 >= 0);
			print(0 >= 0.0);
			print(0 >= 1.0);
			print(1 >= 0.0);
			print(1/0 >= 2/0);
			print(1/0 >= 0);
			print(0 >= 1/0);
			print(-1/0 >= 1/0);
			print("a" >= "a");
			print("a" >= "A");
			print("A" >= "a");
			print([3,"a"] >= [3,"a",null]);
			print([3,4,"a"] >= [3,4,"a"]);
		`,
		expectation: [
				{type: "print", message: "true"},
				{type: "print", message: "false"},
				{type: "print", message: "true"},
				{type: "print", message: "true"},
				{type: "print", message: "false"},
				{type: "print", message: "true"},
				{type: "print", message: "true"},
				{type: "print", message: "true"},
				{type: "print", message: "false"},
				{type: "print", message: "false"},
				{type: "print", message: "true"},
				{type: "print", message: "true"},
				{type: "print", message: "false"},
				{type: "print", message: "false"},
				{type: "print", message: "true"},
				"finished"],
	},
	{
		name: "binary operator and",
		description: "test binary operator and on supported types",
		code: `
			print(false and false);
			print(false and true);
			print(true and false);
			print(true and true);
			print(-77 and 38);
		`,
		expectation: [
				{type: "print", message: "false"},
				{type: "print", message: "false"},
				{type: "print", message: "false"},
				{type: "print", message: "true"},
				{type: "print", message: "34"},
				"finished"],
	},
	{
		name: "binary operator or",
		description: "test binary operator or on supported types",
		code: `
			print(false or false);
			print(false or true);
			print(true or false);
			print(true or true);
			print(-77 or 38);
		`,
		expectation: [
				{type: "print", message: "false"},
				{type: "print", message: "true"},
				{type: "print", message: "true"},
				{type: "print", message: "true"},
				{type: "print", message: "-73"},
				"finished"],
	},
	{
		name: "binary operator xor",
		description: "test binary operator xor on supported types",
		code: `
			print(false xor false);
			print(false xor true);
			print(true xor false);
			print(true xor true);
			print(-77 xor 38);
		`,
		expectation: [
				{type: "print", message: "false"},
				{type: "print", message: "true"},
				{type: "print", message: "true"},
				{type: "print", message: "false"},
				{type: "print", message: "-107"},
				"finished"],
	},

	// built-in types and their member functions
	{
		name: "type Null",
		description: "test the capabilities of type Null",
		code: `
			var n = Null();
			print(n == null);
		`,
		expectation: [
				{type: "print", message: "true"},
				"finished"],
	},
	{
		name: "type Boolean",
		description: "test the capabilities of type Boolean",
		code: `
			var t = Boolean(true);
			var f = Boolean(false);
			print(t == true and f == false);
		`,
		expectation: [
				{type: "print", message: "true"},
				"finished"],
	},
	{
		name: "type Integer",
		description: "test the capabilities of type Integer",
		code: `
			var i = Integer(7);
			var j = Integer(7.9);
			var k = Integer(-7.9);
			print(i == 7 and j == 7 and k == -8);
		`,
		expectation: [
				{type: "print", message: "true"},
				"finished"],
	},
	{
		name: "type Real",
		description: "test the capabilities of type Real",
		code: `
			var r = Real(7);
			var i = Real.inf();
			var n = Real.nan();
			print(r == 7.0     and     r.isFinite() and not r.isInfinite() and not r.isNan());
			print(i == 1.0/0.0 and not i.isFinite() and     i.isInfinite() and not i.isNan());
			print(n == 0.0/0.0 and not n.isFinite() and not n.isInfinite() and     n.isNan());
		`,
		expectation: [
				{type: "print", message: "true"},
				{type: "print", message: "true"},
				{type: "print", message: "true"},
				"finished"],
	},
	{
		name: "type String",
		description: "test the capabilities of type String",
		code: `
			var s = "Hello World";
			print(s.size());
			print(s.find("l"));
			print(s.find("l", 5));
			print(s.split(" "));
			print(String.fromUnicode([65, 66, 67]));
			var a = String(7);
			var b = String(7.5);
			var c = String(5:10);
			print(a + b + c);
		`,
		expectation: [
				{type: "print", message: "11"},
				{type: "print", message: "2"},
				{type: "print", message: "9"},
				{type: "print", message: "[Hello,World]"},
				{type: "print", message: "ABC"},
				{type: "print", message: "77.55:10"},
				"finished"],
	},
	{
		name: "type Array",
		description: "test the capabilities of type Array",
		code: `
			var a = [4, 6, 8, 10, 12];
			var b = [null, false, true, [], {}, 5:10];
			print(a);
			print(a.size());
			a.push(14);
			print(a.size());
			print(a[1]);
			print(a[5]);
			a[5] += 1;
			print(a[5]);
			print(a.pop());
			a.insert(3, 99);
			print(a);
			a.remove(1:3);
			print(a);
			a.sort();
			print(a);
			print(a.keys());
			print(a.values());
			print(Array.concat(a, b));
		`,
		expectation: [
				{type: "print", message: "[4,6,8,10,12]"},
				{type: "print", message: "5"},
				{type: "print", message: "6"},
				{type: "print", message: "6"},
				{type: "print", message: "14"},
				{type: "print", message: "15"},
				{type: "print", message: "15"},
				{type: "print", message: "[4,6,8,99,10,12]"},
				{type: "print", message: "[4,99,10,12]"},
				{type: "print", message: "[4,10,12,99]"},
				{type: "print", message: "0:4"},
				{type: "print", message: "[4,10,12,99]"},
				{type: "print", message: "[4,10,12,99,null,false,true,[],{},5:10]"},
				"finished"],
	},
	{
		name: "type Dictionary",
		description: "test the capabilities of type Dictionary",
		code: `
			var a = {a:4, b:6, c:8, x:10, y:12};
			var b = {x:null, y:false, z:true, foo:[], bar:{}, r:5:10};
			print(a);
			print(a.size());
			a["z"] = 14;
			print(a.size());
			print(a["x"]);
			print(a.has("y"));
			print(a.has("foo"));
			a.remove("z");
			print(a.size());
			print(a.has("z"));
			print(a.keys());
			print(a.values());
			print(Dictionary.merge(a, b));
		`,
		expectation: [
				{type: "print", message: "{a:4,b:6,c:8,x:10,y:12}"},
				{type: "print", message: "5"},
				{type: "print", message: "6"},
				{type: "print", message: "10"},
				{type: "print", message: "true"},
				{type: "print", message: "false"},
				{type: "print", message: "5"},
				{type: "print", message: "false"},
				{type: "print", message: "[a,b,c,x,y]"},
				{type: "print", message: "[4,6,8,10,12]"},
				{type: "print", message: "{a:4,b:6,c:8,x:null,y:false,z:true,foo:[],bar:{},r:5:10}"},
				"finished"],
	},
	{
		name: "type Function",
		description: "test the capabilities of type Function",
		code: `
			var f = math.sqrt;
			print(f(25));
			print(f == math.sqrt);
			print(f == math.cbrt);
			var g = function(z) { return z*z; };
			var h = function [g] (x) { return g(x); };
			print(g(3));
			print(h(3));
		`,
		expectation: [
				{type: "print", message: "5"},
				{type: "print", message: "true"},
				{type: "print", message: "false"},
				{type: "print", message: "9"},
				{type: "print", message: "9"},
				"finished"],
	},
	{
		name: "type Range",
		description: "test the capabilities of type Range",
		code: `
			var a = 5:15;
			var b = 15:5;
			print(a);
			print(a.size());
			print(a.begin());
			print(a.end());
			print(a[2]);
			print(a[2:6]);
			print(b);
			print(b.size());
			print(b.begin());
			print(b.end());
			print(a == Range(5, 15));
		`,
		expectation: [
				{type: "print", message: "5:15"},
				{type: "print", message: "10"},
				{type: "print", message: "5"},
				{type: "print", message: "15"},
				{type: "print", message: "7"},
				{type: "print", message: "7:11"},
				{type: "print", message: "15:5"},
				{type: "print", message: "0"},
				{type: "print", message: "15"},
				{type: "print", message: "5"},
				{type: "print", message: "true"},
				"finished"],
	},
	{
		name: "type Type",
		description: "test the capabilities of type Type",
		code: `
			var t = Type([]);
			print(t);
			print(t == Array);
			print(t == Real);
			print(Type(math.sqrt));
			print(Type(function[t](){}));
			print(Type(Boolean));
			var a = t(5:8);
			print(a);
			class A { }
			class B : A { }
			class C : B { }
			class Z : A { }
			var b = B();
			print(Type(b));
			print(Type.superclass(Z));
			print(Type.superclass(Type.superclass(C)));
			print(Type.isOfType(b, A));
			print(Type.isOfType(b, B));
			print(Type.isOfType(b, C));
			print(Type.isOfType(b, Z));
			print(Type.isOfType(b, Array));
			print(Type.isOfType(b, t));
			print(Type.isDerivedFrom(A, A));
			print(Type.isDerivedFrom(A, B));
			print(Type.isDerivedFrom(A, C));
			print(Type.isDerivedFrom(B, A));
			print(Type.isDerivedFrom(C, A));
		`,
		expectation: [
				{type: "print", message: "<Type Array>"},
				{type: "print", message: "true"},
				{type: "print", message: "false"},
				{type: "print", message: "<Type Function>"},
				{type: "print", message: "<Type Function>"},
				{type: "print", message: "<Type Type>"},
				{type: "print", message: "[5,6,7]"},
				{type: "print", message: "<Type B>"},
				{type: "print", message: "<Type A>"},
				{type: "print", message: "<Type A>"},
				{type: "print", message: "true"},
				{type: "print", message: "true"},
				{type: "print", message: "false"},
				{type: "print", message: "false"},
				{type: "print", message: "false"},
				{type: "print", message: "false"},
				{type: "print", message: "true"},
				{type: "print", message: "false"},
				{type: "print", message: "false"},
				{type: "print", message: "true"},
				{type: "print", message: "true"},
				"finished"],
	},

	// namespaces
	{
		name: "namespaces",
		description: "test namespace declaration and use",
		code: `
			{
				use namespace canvas;
				var w = width();
			}
			namespace A
			{
				var a = 1;
				namespace B
				{
					var b = 2;
				}
			}
			{
				use namespace A;
				print(a);
				print(A.a);
				print(B.b);
				print(A.B.b);
			}
			{
				use A.a, A.B;
				print(a);
				print(B.b);
			}
			{
				from A use a, B.b;
				print(a);
				print(b);
			}
			{
				from A.B use b;
				print(b);
			}
		`,
		expectation: [
				{type: "print", message: "1"},
				{type: "print", message: "1"},
				{type: "print", message: "2"},
				{type: "print", message: "2"},
				{type: "print", message: "1"},
				{type: "print", message: "2"},
				{type: "print", message: "1"},
				{type: "print", message: "2"},
				{type: "print", message: "2"},
				"finished"],
	},

	// functions, including lambdas
	{
		name: "functions and lambdas",
		description: "test functions and anonymous functions",
		code: `
			var f = math.sqrt;
			print(f(9));
			var g = function(b) { print(b*b); };
			g(3);
			var h = function [t=g] (c) { t(c); };
			h(3);
			var fac = function(x)
					{
						if x > 0 then return x * this(x-1);
						else return 1;
					};
			print(fac(5));
		`,
		expectation: [
				{type: "print", message: "3"},
				{type: "print", message: "9"},
				{type: "print", message: "9"},
				{type: "print", message: "120"},
				"finished"],
	},

	// classes
	{
		name: "classes",
		description: "test classes, inheritance, and visibility",
		code: `
			class A
			{
			private:
				var priv_a;
			protected:
				var prot_a = 6;
				function get_priv_a()
				{ return priv_a; }
			public:
				constructor(x)
				{ priv_a = x; }
			}

			class B : A
			{
			private:
				var priv_b;
			protected:
				var prot_b = 7;
				function get_priv_b()
				{ return priv_b; }
			public:
				constructor(x)
				: super(x)
				{ priv_b = x; }
			}

			class C : B
			{
			private:
				var priv_c;
			protected:
				var prot_c = 8;
				function get_priv_c()
				{ return priv_c; }
			public:
				constructor(x)
				: super(x)
				{ priv_c = x; }
				function get_prot_a()
				{ return prot_a; }
				function get_prot_b()
				{ return prot_b; }
				function get_prot_c()
				{ return prot_c; }
				function print_all_priv()
				{ print(get_priv_a() + " " + get_priv_b() + " " + get_priv_c()); }
				function me()
				{ return this; }
			}

			class Foo
			{
			private:
				var a;
				constructor(a_) { a = a_; }
			public:
				static function create(x) { return Foo(x); }
				function get() { return a; }
			}

			var c = C(3);
			print(c.get_prot_a());
			print(c.get_prot_b());
			print(c.get_prot_c());
			c.print_all_priv();
			var f = Foo.create(42);
			print(f.get());
			var cls = Foo;
			var g = cls.create(43);
			print(g.get());
		`,
		expectation: [
				{type: "print", message: "6"},
				{type: "print", message: "7"},
				{type: "print", message: "8"},
				{type: "print", message: "3 3 3"},
				{type: "print", message: "42"},
				{type: "print", message: "43"},
				"finished"],
	},

	// core functions
	{
		name: "terminate",
		description: "test function terminate",
		code: `
			function f()
			{
				print("a");
				terminate();
				print("b");
			}
			f();
			print("c");
		`,
		expectation: [
				{type: "print", message: "a"},
				"finished"],
	},
	{
		name: "assert",
		description: "test function assert",
		code: `
			function f()
			{
				print("a");
				assert(false, "foo");
				print("b");
			}
			f();
			print("c");
		`,
		expectation: [
				{type: "print", message: "a"},
				{type: "error", href: "#/errors/user/ue-1"},
				"error"],
	},
	{
		name: "error",
		description: "test function error",
		code: `
			function f()
			{
				print("a");
				error("foo");
				print("b");
			}
			f();
			print("c");
		`,
		expectation: [
				{type: "print", message: "a"},
				{type: "error", href: "#/errors/user/ue-2"},
				"error"],
	},
	{
		name: "same",
		description: "test function same",
		code: `
			var n = null;
			var m = n;
			print(same(n, m));
			print(same(n, null));
		`,
		expectation: [
				{type: "print", message: "true"},
				{type: "print", message: "false"},
				"finished"],
	},
	{
		name: "version",
		description: "test function version",
		code: `
			var v = version();
			print(v.keys());
			print(v["full"]);
		`,
		expectation: [
				{type: "print", message: "[type,major,minor,patch,day,month,year,full]"},
				{type: "print", message: Version.full()},
				"finished"],
	},
	{
		name: "print",
		description: "test function print",
		code: `
			print(42);
		`,
		expectation: [
				{type: "print", message: "42"},
				"finished"],
	},
	{
		name: "alert",
		description: "test function alert",
		code: `
			alert(42);
		`,
		expectation: [
				{type: "alert", message: "42"},
				"finished"],
	},
	{
		name: "confirm",
		description: "test function confirm",
		code: `
			print(confirm("foo"));
			print(confirm("bar"));
		`,
		input: [true, false],
		expectation: [
				{type: "confirm", message: "foo"},
				{type: "print", message: "true"},
				{type: "confirm", message: "bar"},
				{type: "print", message: "false"},
				"finished"],
	},
	{
		name: "prompt",
		description: "test function prompt",
		code: `
			print(prompt("foo"));
		`,
		input: ["bar"],
		expectation: [
				{type: "prompt", message: "foo"},
				{type: "print", message: "bar"},
				"finished"],
	},
	{
		name: "wait",
		description: "test function wait",
		code: `
			var t1 = time();
			wait(100);
			var t2 = time();
			var d = t2 - t1;
			if d < 50 or d > 200 then print("wrong");
		`,
		expectation: [
				"finished"],
	},
	{
		name: "time",
		description: "test function time",
		code: `
			var t = time();
			if t < 1555252000000.0 or t > 3000000000000.0 then print("implausible");
		`,
		expectation: [
				"finished"],
	},
	{
		name: "exists",
		description: "test function exists",
		code: `
			if exists("implausible-filename-19fe94e375c0b0a1749ad05f") then print("implausible");
		`,
		expectation: [
				"finished"],
	},
	{
		name: "load and save",
		description: "test functions load and save",
		code: `
			save("unittest-data", {a:3,b:3.5});
			var d = load("unittest-data");
			print(d);
		`,
		expectation: [
				{type: "print", message: "{a:3,b:3.5}"},
				"finished"],
	},
	{
		name: "deepcopy",
		description: "test function deepcopy",
		code: `
			var x = {a:3, b:[4, {c: true}]};
			var y = deepcopy(x);
			x["b"][1]["c"] = false;
			print(x);
			print(y);
		`,
		expectation: [
				{type: "print", message: "{a:3,b:[4,{c:false}]}"},
				{type: "print", message: "{a:3,b:[4,{c:true}]}"},
				"finished"],
	},
	{
		name: "event handling",
		description: "test event handling and timer events",
		code: `
			var n = 0;
			function onTick(event)
			{
			    print("tick");
			    n += 1;
			    if n == 3 then quitEventMode("bye");
			}
			setEventHandler("timer", onTick);
			print(enterEventMode());
		`,
		expectation: [
				{type: "print", message: "tick"},
				{type: "print", message: "tick"},
				{type: "print", message: "tick"},
				{type: "print", message: "bye"},
				"finished"],
	},

	// math functions
	{
		name: "math",
		description: "test math functions",
		code: `
			function close(a, b)
			{
				if a - b < -1e-10 or a - b > 1e-10 then print(a + " != " + b);
			}
			use namespace math;
			close(pi(), 3.141592653589793);
			close(e(), 2.718281828459045);
			close(abs(-2.5), 2.5);
			close(sqrt(4), 2);
			close(cbrt(-8), -2);
			close(floor(-1.5), -2);
			close(round(-1.5), -1);
			close(ceil(-1.5), -1);
			close(sin(pi()/2), 1);
			close(cos(pi()), -1);
			close(tan(pi()/4), 1);
			close(sinh(0.5), (exp(0.5)-exp(-0.5))/2);
			close(cosh(0.5), (exp(0.5)+exp(-0.5))/2);
			close(tanh(0.5), (exp(0.5)-exp(-0.5))/(exp(0.5)+exp(-0.5)));
			close(asin(1), pi()/2);
			close(acos(-1), pi());
			close(atan(1), pi()/4);
			close(atan2(0.5,sqrt(0.75)), pi()/6);
			close(exp(2), e()*e());
			close(log(2), 0.693147180559945);
			close(log2(16), 4);
			close(log10(10000), 4);
			close(pow(3,4), 81);
			close(pow(-3,3), -27);
			close(pow(27,1/3), 3);
			close(pow(27,-1/3), 1/3);
			close(sign(1.7), 1);
			close(sign(-1.7), -1);
			close(sign(0.0), 0);
			close(sign(-0.0), 0);
			close(sign(Real.inf()), 1);
			close(sign(-Real.inf()), -1);
			close(min(4.25, -2), -2);
			close(max(4.25, -2), 4.25);
			print(min("a", "A"));
			print(max("a", "A"));
			for 0:1000 do if random() < 0 then print("random < 0");
			for 0:1000 do if random() >= 1 then print("random >= 1");
		`,
		expectation: [
				{type: "print", message: "A"},
				{type: "print", message: "a"},
				"finished"],
	},

	// turtle functions
	{
		name: "turtle",
		description: "test of turtle drawing",
		code: `
			turtle.move(10);
			turtle.turn(90);
			turtle.pen(false);
			turtle.move(20);
			turtle.pen(true);
			turtle.turn(60);
			turtle.move(20);
			turtle.color(0,0,1);
			turtle.turn(60);
			turtle.move(20);
			turtle.reset(-20, 0, 45);
			turtle.move(20);
		`,
		expectation: {
			type: "turtle",
			js: `
				let x = 300, y = 300, alpha = 0;
				context.lineWidth = 1;
				context.strokeStyle = "#000";
				context.beginPath();
				context.moveTo(x, y);
				x += Math.sin(alpha * Math.PI / 180) * 30;
				y -= Math.cos(alpha * Math.PI / 180) * 30;
				context.lineTo(x, y);
				context.stroke();
				alpha += 90;
				x += Math.sin(alpha * Math.PI / 180) * 60;
				y -= Math.cos(alpha * Math.PI / 180) * 60;
				context.beginPath();
				context.moveTo(x, y);
				alpha += 60;
				x += Math.sin(alpha * Math.PI / 180) * 60;
				y -= Math.cos(alpha * Math.PI / 180) * 60;
				context.lineTo(x, y);
				context.stroke();
				context.beginPath();
				context.moveTo(x, y);
				alpha += 60;
				context.strokeStyle = "#00f";
				x += Math.sin(alpha * Math.PI / 180) * 60;
				y -= Math.cos(alpha * Math.PI / 180) * 60;
				context.lineTo(x, y);
				context.stroke();
				x = 240; y = 300; alpha = 45;
				context.strokeStyle = "#000";
				context.beginPath();
				context.moveTo(x, y);
				x += Math.sin(alpha * Math.PI / 180) * 60;
				y -= Math.cos(alpha * Math.PI / 180) * 60;
				context.lineTo(x, y);
				context.stroke();
			`,
		},
	},

	// canvas functions and events
	{
		name: "canvas drawing",
		description: "test of canvas drawing",
		code: `
			use namespace canvas;
			setFillColor(1,1,0);
			clear();
			setLineWidth(2);
			setLineColor(1,0,0);
			setFillColor(0,0,1);
			setFont("Helvetica", 24);
			setTextAlign("center");
			line(width()/4, height()/2, width()/2, height()/2);
			rect(10, 20, 30, 40);
			fillRect(110, 20, 30, 40);
			frameRect(210, 20, 30, 40);
			circle(10, 80, 10);
			fillCircle(110, 80, 10);
			frameCircle(210, 80, 10);
			curve([[10, 150], [30, 140], [40, 170]], false);
			curve([[110, 150], [130, 140], [140, 170]], true);
			fillArea([[210, 150], [230, 140], [240, 170]]);
			frameArea([[310, 150], [330, 140], [340, 170]]);
			text(400, 500, "hello world");
			shift(500, 10);
			line(0, 180, 10, 190);
			reset();
			line(0, 180, 10, 190);
			scale(1.5);
			line(0, 180, 10, 190);
			reset();
			rotate(-0.3);
			line(0, 180, 10, 190);
			reset();
			transform([[1,1],[0,1]],[30,30]);
			line(0, 180, 10, 190);
		`,
		expectation: {
			type: "canvas",
			js: `
				context.textBaseline = "top";
				context.fillStyle = "#ff0";
				context.fillRect(0, 0, 600, 600);
				context.lineWidth = 2;
				context.strokeStyle = "#f00";
				context.fillStyle = "#00f";
				context.font = "24px Helvetica";
				context.textAlign = "center";
				context.beginPath();
				context.moveTo(150, 300);
				context.lineTo(300, 300);
				context.stroke();
				context.beginPath();
				context.rect(10, 20, 30, 40);
				context.stroke();
				context.fillRect(110, 20, 30, 40);
				context.beginPath();
				context.rect(210, 20, 30, 40);
				context.fill();
				context.stroke();
				context.beginPath();
				context.arc(10, 80, 10, 0, 2 * Math.PI, false);
				context.stroke();
				context.beginPath();
				context.arc(110, 80, 10, 0, 2 * Math.PI, false);
				context.fill();
				context.beginPath();
				context.arc(210, 80, 10, 0, 2 * Math.PI, false);
				context.fill();
				context.stroke();
				context.fillText("hello world", 400, 500);
				context.beginPath();
				context.moveTo(10, 150);
				context.lineTo(30, 140);
				context.lineTo(40, 170);
				context.stroke();
				context.beginPath();
				context.moveTo(110, 150);
				context.lineTo(130, 140);
				context.lineTo(140, 170);
				context.closePath();
				context.stroke();
				context.beginPath();
				context.moveTo(210, 150);
				context.lineTo(230, 140);
				context.lineTo(240, 170);
				context.closePath();
				context.fill();
				context.beginPath();
				context.moveTo(310, 150);
				context.lineTo(330, 140);
				context.lineTo(340, 170);
				context.closePath();
				context.fill();
				context.stroke();
				context.translate(500, 10);
				context.beginPath();
				context.moveTo(0, 180);
				context.lineTo(10, 190);
				context.stroke();
				context.setTransform(1,0,0,1,0,0);
				context.beginPath();
				context.moveTo(0, 180);
				context.lineTo(10, 190);
				context.stroke();
				context.scale(1.5, 1.5);
				context.beginPath();
				context.moveTo(0, 180);
				context.lineTo(10, 190);
				context.stroke();
				context.setTransform(1,0,0,1,0,0);
				context.rotate(-0.3);
				context.beginPath();
				context.moveTo(0, 180);
				context.lineTo(10, 190);
				context.stroke();
				context.setTransform(1,0,0,1,0,0);
				context.transform(1,0,1,1,30,30);
				context.beginPath();
				context.moveTo(0, 180);
				context.lineTo(10, 190);
				context.stroke();
			`,
		},
	},
	{
		name: "keydown",
		description: "test of canvas event keydown",
		code: `
			function onKeyDown(event)
			{
			    print(event.key);
			    if event.shift then print("shift");
			    if event.control then print("control");
			    if event.alt then print("alt");
			    if event.meta then print("meta");
				quitEventMode();
			}
			setEventHandler("canvas.keydown", onKeyDown);
			enterEventMode();
		`,
		events:
		[
			{
				name: "canvas.keydown",
				type: "canvas.KeyboardEvent",
				attr: {
					key: "ArrowLeft",
					shift : false,
					control: true,
					alt: false,
					meta: false,
				},
			},
		],
		expectation: [
				{type: "print", message: "ArrowLeft"},
				{type: "print", message: "control"},
				"finished"],
	},
	{
		name: "keyup",
		description: "test of canvas event keyup",
		code: `
			function onKeyUp(event)
			{
			    print(event.key);
			    if event.shift then print("shift");
			    if event.control then print("control");
			    if event.alt then print("alt");
			    if event.meta then print("meta");
				quitEventMode();
			}
			setEventHandler("canvas.keyup", onKeyUp);
			enterEventMode();
		`,
		events:
		[
			{
				name: "canvas.keyup",
				type: "canvas.KeyboardEvent",
				attr: {
					key: "ArrowLeft",
					shift : false,
					control: true,
					alt: false,
					meta: false,
				},
			},
		],
		expectation: [
				{type: "print", message: "ArrowLeft"},
				{type: "print", message: "control"},
				"finished"],
	},
	{
		name: "mousedown",
		description: "test of canvas event mousedown",
		code: `
			function onMouseDown(event)
			{
			    print(event.x + "," + event.y);
			    print(event.button);
			    print(event.buttons);
			    if event.shift then print("shift");
			    if event.control then print("control");
			    if event.alt then print("alt");
			    if event.meta then print("meta");
				quitEventMode();
			}
			setEventHandler("canvas.mousedown", onMouseDown);
			enterEventMode();
		`,
		events:
		[
			{
				name: "canvas.mousedown",
				type: "canvas.MouseButtonEvent",
				attr: {
					x: 50,
					y: 25,
					button: 0,
					buttons: [true, false, false],
					shift : false,
					control: true,
					alt: false,
					meta: false,
				},
			},
		],
		expectation: [
				{type: "print", message: "50,25"},
				{type: "print", message: "0"},
				{type: "print", message: "[true,false,false]"},
				{type: "print", message: "control"},
				"finished"],
	},
	{
		name: "mouseup",
		description: "test of canvas event mouseup",
		code: `
			function onMouseUp(event)
			{
			    print(event.x + "," + event.y);
			    print(event.button);
			    print(event.buttons);
			    if event.shift then print("shift");
			    if event.control then print("control");
			    if event.alt then print("alt");
			    if event.meta then print("meta");
				quitEventMode();
			}
			setEventHandler("canvas.mouseup", onMouseUp);
			enterEventMode();
		`,
		events:
		[
			{
				name: "canvas.mouseup",
				type: "canvas.MouseButtonEvent",
				attr: {
					x: 50,
					y: 25,
					button: 0,
					buttons: [true, false, false],
					shift : false,
					control: true,
					alt: false,
					meta: false,
				},
			},
		],
		expectation: [
				{type: "print", message: "50,25"},
				{type: "print", message: "0"},
				{type: "print", message: "[true,false,false]"},
				{type: "print", message: "control"},
				"finished"],
	},
	{
		name: "mousemove",
		description: "test of canvas event mousemove",
		code: `
			function onMouseMove(event)
			{
			    print(event.x + "," + event.y);
			    print(event.buttons);
			    if event.shift then print("shift");
			    if event.control then print("control");
			    if event.alt then print("alt");
			    if event.meta then print("meta");
				quitEventMode();
			}
			setEventHandler("canvas.mousemove", onMouseMove);
			enterEventMode();
		`,
		events:
		[
			{
				name: "canvas.mousemove",
				type: "canvas.MouseMoveEvent",
				attr: {
					x: 50,
					y: 25,
					buttons: [true, false, false],
					shift : false,
					control: true,
					alt: false,
					meta: false,
				},
			},
		],
		expectation: [
				{type: "print", message: "50,25"},
				{type: "print", message: "[true,false,false]"},
				{type: "print", message: "control"},
				"finished"],
	},
	{
		name: "mouseout",
		description: "test of canvas event mouseout",
		code: `
			function onMouseOut(event)
			{
				print(event);
				quitEventMode();
			}
			setEventHandler("canvas.mouseout", onMouseOut);
			enterEventMode();
		`,
		events:
		[
			{
				name: "canvas.mouseout",
				type: "Null",
				attr: { },
			},
		],
		expectation: [
				{type: "print", message: "null"},
				"finished"],
	},
	{
		name: "resize",
		description: "test of canvas event resize",
		code: `
			function onResize(event)
			{
				print(event.width);
				print(event.height);
				quitEventMode();
			}
			setEventHandler("canvas.resize", onResize);
			enterEventMode();
		`,
		events:
		[
			{
				name: "canvas.resize",
				type: "canvas.ResizeEvent",
				attr: {
					width: 50,
					height: 25,
				},
			},
		],
		expectation: [
				{type: "print", message: "50"},
				{type: "print", message: "25"},
				"finished"],
	},
	{
		name: "audio",
		description: "checks if the audio object rejects invalid samples",
		code: `
			use namespace audio;
			var samples = [];
			samples.push("hello");
			var ma = MonoAudio(samples, 48000);
`,
		expectation: [{type: "error", href: "#/errors/argument-mismatch/am-44"}, "error"],
	},

	// syntax errors
	{
		name: "se-1",
		description: "test of syntax error 1",
		code: `
			var r = 1.23E*88;
		`,
		expectation: [
				{type: "error", href: "#/errors/syntax/se-1"},
				"parsing failed"],
	},
	{
		name: "se-2",
		description: "test of syntax error 2",
		code: `
			var s = "hello;
		`,
		expectation: [
				{type: "error", href: "#/errors/syntax/se-2"},
				"parsing failed"],
	},
	{
		name: "se-3",
		description: "test of syntax error 3",
		code: `
			var s = "hello\\u20world";
		`,
		expectation: [
				{type: "error", href: "#/errors/syntax/se-3"},
				"parsing failed"],
	},
	{
		name: "se-4",
		description: "test of syntax error 4",
		code: `
			var s = "hello\\yworld";
		`,
		expectation: [
				{type: "error", href: "#/errors/syntax/se-4"},
				"parsing failed"],
	},
	{
		name: "se-5",
		description: "test of syntax error 5",
		code: `
			@;
		`,
		expectation: [
				{type: "error", href: "#/errors/syntax/se-5"},
				"parsing failed"],
	},
	{
		name: "se-6",
		description: "test of syntax error 6",
		code: `
			var a = super.a;
		`,
		expectation: [
				{type: "error", href: "#/errors/syntax/se-6"},
				"parsing failed"],
	},
	{
		name: "se-7",
		description: "test of syntax error 7",
		code: `
			class A
			{
			private:
				var a;
			public:
				function f()
				{
					return super.a;
				}
			}
		`,
		expectation: [
				{type: "error", href: "#/errors/syntax/se-7"},
				"parsing failed"],
	},
	{
		name: "se-8",
		description: "test of syntax error 8",
		code: `
			class A
			{
			protected:
				var a = 33;
			}
			class B : A
			{
			public:
				constructor()
				{
					var x = super;
				}
			}
		`,
		expectation: [
				{type: "error", href: "#/errors/syntax/se-8"},
				"parsing failed"],
	},
	{
		name: "se-9",
		description: "test of syntax error 9",
		code: `
			class A
			{
			protected:
				var a = 33;
			}
			class B : A
			{
			public:
				constructor()
				{ print(super."a"); }
			}
		`,
		expectation: [
				{type: "error", href: "#/errors/syntax/se-9"},
				"parsing failed"],
	},
	{
		name: "se-10",
		description: "test of syntax error 10",
		code: `
			class A
			{
			protected:
				var a = 33;
			}
			class B : A
			{
			public:
				use "A";
			}
		`,
		expectation: [
				{type: "error", href: "#/errors/syntax/se-10"},
				"parsing failed"],
	},
	{
		name: "se-11",
		description: "test of syntax error 11",
		code: `
			namespace A
			{
				var a;
			}
			var b = A.7;
		`,
		expectation: [
				{type: "error", href: "#/errors/syntax/se-11"},
				"parsing failed"],
	},
	{
		name: "se-13",
		description: "test of syntax error 13",
		code: `
			class A
			{
			public:
				var a;
				function f() { print("f"); }
				static function g() { f(); }
			}
		`,
		expectation: [
				{type: "error", href: "#/errors/syntax/se-13"},
				"parsing failed"],
	},
	{
		name: "se-14",
		description: "test of syntax error 14",
		code: `
			function f(a, b)
			{ }
			f(b=2, 7);
		`,
		expectation: [
				{type: "error", href: "#/errors/syntax/se-14"},
				"parsing failed"],
	},
	{
		name: "se-15",
		description: "test of syntax error 15",
		code: `
			math.atan2(1, 2];
		`,
		expectation: [
				{type: "error", href: "#/errors/syntax/se-15"},
				"parsing failed"],
	},
	{
		name: "se-16",
		description: "test of syntax error 16",
		code: `
			13();
		`,
		expectation: [
				{type: "error", href: "#/errors/syntax/se-16"},
				"parsing failed"],
	},
	{
		name: "se-21",
		description: "test of syntax error 21",
		code: `
			var a;
			+a = 3;
		`,
		expectation: [
				{type: "error", href: "#/errors/syntax/se-21"},
				"parsing failed"],
	},
	{
		name: "se-22",
		description: "test of syntax error 22",
		code: `
			var a = (3 + 4;
		`,
		expectation: [
				{type: "error", href: "#/errors/syntax/se-22"},
				"parsing failed"],
	},
	{
		name: "se-23",
		description: "test of syntax error 23",
		code: `
			var a = 2147483648;
		`,
		expectation: [
				{type: "error", href: "#/errors/syntax/se-23"},
				"parsing failed"],
	},
	{
		name: "se-24",
		description: "test of syntax error 24",
		code: `
			var a = [1, 2, 3;
		`,
		expectation: [
				{type: "error", href: "#/errors/syntax/se-24"},
				"parsing failed"],
	},
	{
		name: "se-25",
		description: "test of syntax error 25",
		code: `
			var a = []
		`,
		expectation: [
				{type: "error", href: "#/errors/syntax/se-25"},
				"parsing failed"],
	},
	{
		name: "se-26",
		description: "test of syntax error 26",
		code: `
			var a = {x: 8, y: 9, y: 10};
		`,
		expectation: [
				{type: "error", href: "#/errors/syntax/se-26"},
				"parsing failed"],
	},
	{
		name: "se-27",
		description: "test of syntax error 27",
		code: `
			var a = {x: 8, y: 9;
		`,
		expectation: [
				{type: "error", href: "#/errors/syntax/se-27"},
				"parsing failed"],
	},
	{
		name: "se-28",
		description: "test of syntax error 28",
		code: `
			var a = {x: 8, y: 9,
		`,
		expectation: [
				{type: "error", href: "#/errors/syntax/se-28"},
				"parsing failed"],
	},
	{
		name: "se-29",
		description: "test of syntax error 29",
		code: `
			var a = {x: 8, y: 9, z
		`,
		expectation: [
				{type: "error", href: "#/errors/syntax/se-29"},
				"parsing failed"],
	},
	{
		name: "se-30",
		description: "test of syntax error 30",
		code: `
			var a = {x: 8, y: 9, z: 10}
		`,
		expectation: [
				{type: "error", href: "#/errors/syntax/se-30"},
				"parsing failed"],
	},
	{
		name: "se-31",
		description: "test of syntax error 31",
		code: `
			var a, b;
			var f = function[a, b (x){};
		`,
		expectation: [
				{type: "error", href: "#/errors/syntax/se-31"},
				"parsing failed"],
	},
	{
		name: "se-32",
		description: "test of syntax error 32",
		code: `
			var a;
			var f = function[for](x){};
		`,
		expectation: [
				{type: "error", href: "#/errors/syntax/se-32"},
				"parsing failed"],
	},
	{
		name: "se-33",
		description: "test of syntax error 33",
		code: `
			function f(for) {}
		`,
		expectation: [
				{type: "error", href: "#/errors/syntax/se-33"},
				"parsing failed"],
	},
	{
		name: "se-35",
		description: "test of syntax error 35",
		code: `
			var f = function {};
		`,
		expectation: [
				{type: "error", href: "#/errors/syntax/se-35"},
				"parsing failed"],
	},
	{
		name: "se-36",
		description: "test of syntax error 36",
		code: `
			function f;
		`,
		expectation: [
				{type: "error", href: "#/errors/syntax/se-36"},
				"parsing failed"],
	},
	{
		name: "se-37",
		description: "test of syntax error 37",
		code: `
			function f(a;
		`,
		expectation: [
				{type: "error", href: "#/errors/syntax/se-37"},
				"parsing failed"],
	},
	{
		name: "se-38",
		description: "test of syntax error 38",
		code: `
			function f(a = math.sqrt(2)) {};
		`,
		expectation: [
				{type: "error", href: "#/errors/syntax/se-38"},
				"parsing failed"],
	},
	{
		name: "se-40",
		description: "test of syntax error 40",
		code: `
			function f(a = 2*3+4);
		`,
		expectation: [
				{type: "error", href: "#/errors/syntax/se-40"},
				"parsing failed"],
	},
	{
		name: "se-41",
		description: "test of syntax error 41",
		code: `
			var a = 2 * do;
		`,
		expectation: [
				{type: "error", href: "#/errors/syntax/se-41"},
				"parsing failed"],
	},
	{
		name: "se-42",
		description: "test of syntax error 42",
		code: `
			var a = 2 * ;
		`,
		expectation: [
				{type: "error", href: "#/errors/syntax/se-42"},
				"parsing failed"],
	},
	{
		name: "se-43",
		description: "test of syntax error 43",
		code: `
			var a;
			var b = a.do;
		`,
		expectation: [
				{type: "error", href: "#/errors/syntax/se-43"},
				"parsing failed"],
	},
	{
		name: "se-44",
		description: "test of syntax error 44",
		code: `
			var a;
			var b = a[7;
		`,
		expectation: [
				{type: "error", href: "#/errors/syntax/se-44"},
				"parsing failed"],
	},
	{
		name: "se-47-1",
		description: "test of syntax error 47, case 1",
		code: `
			var a = this;
		`,
		expectation: [
				{type: "error", href: "#/errors/syntax/se-47"},
				"parsing failed"],
	},
	{
		name: "se-47-2",
		description: "test of syntax error 47, case 2",
		code: `
			class A
			{
			public:
				static function f()
				{ print(this); }
			}
		`,
		expectation: [
				{type: "error", href: "#/errors/syntax/se-47"},
				"parsing failed"],
	},
	{
		name: "se-48",
		description: "test of syntax error 48",
		code: `
			var a;
			a = 4
		`,
		expectation: [
				{type: "error", href: "#/errors/syntax/se-48"},
				"parsing failed"],
	},
	{
		name: "se-49",
		description: "test of syntax error 49",
		code: `
			print 4;
		`,
		expectation: [
				{type: "error", href: "#/errors/syntax/se-49"},
				"parsing failed"],
	},
	{
		name: "se-50",
		description: "test of syntax error 50",
		code: `
			var d, do;
		`,
		expectation: [
				{type: "error", href: "#/errors/syntax/se-50"},
				"parsing failed"],
	},
	{
		name: "se-51",
		description: "test of syntax error 51",
		code: `
			var d do
		`,
		expectation: [
				{type: "error", href: "#/errors/syntax/se-51"},
				"parsing failed"],
	},
	{
		name: "se-51b",
		description: "test of syntax error 51b",
		code: `
			var d = 5 do
		`,
		expectation: [
				{type: "error", href: "#/errors/syntax/se-51b"},
				"parsing failed"],
	},
	{
		name: "se-52",
		description: "test of syntax error 52",
		code: `
			function do() {}
		`,
		expectation: [
				{type: "error", href: "#/errors/syntax/se-52"},
				"parsing failed"],
	},
	{
		name: "se-53",
		description: "test of syntax error 53",
		code: `
			class A {}
			class B : A
			{
			public:
				constructor() : {}
			}
		`,
		expectation: [
				{type: "error", href: "#/errors/syntax/se-53"},
				"parsing failed"],
	},
	{
		name: "se-54",
		description: "test of syntax error 54",
		code: `
			class do {}
		`,
		expectation: [
				{type: "error", href: "#/errors/syntax/se-54"},
				"parsing failed"],
	},
	{
		name: "se-55",
		description: "test of syntax error 55",
		code: `
			class A
			{
			public
				var a;
			}
		`,
		expectation: [
				{type: "error", href: "#/errors/syntax/se-55"},
				"parsing failed"],
	},
	{
		name: "se-56",
		description: "test of syntax error 56",
		code: `
			class A
			{
				var a;
			}
		`,
		expectation: [
				{type: "error", href: "#/errors/syntax/se-56"},
				"parsing failed"],
	},
	{
		name: "se-57",
		description: "test of syntax error 57",
		code: `
			class A
			{
			public:
				var a = math.sqrt(2);
			}
		`,
		expectation: [
				{type: "error", href: "#/errors/syntax/se-57"},
				"parsing failed"],
	},
	{
		name: "se-58",
		description: "test of syntax error 58",
		code: `
			class A
			{
			private:
				constructor() {}
			}
			class B : A {}
		`,
		expectation: [
				{type: "error", href: "#/errors/syntax/se-58"},
				"parsing failed"],
	},
	{
		name: "se-59",
		description: "test of syntax error 59",
		code: `
			class A
			{
			public:
				static constructor() {}
			}
		`,
		expectation: [
				{type: "error", href: "#/errors/syntax/se-59"},
				"parsing failed"],
	},
	{
		name: "se-59b",
		description: "test of syntax error 59b",
		code: `
			class A
			{
			public:
				constructor() {}
				constructor(x) {}
			}
		`,
		expectation: [
				{type: "error", href: "#/errors/syntax/se-59b"},
				"parsing failed"],
	},
	{
		name: "se-60",
		description: "test of syntax error 60",
		code: `
			class A
			{
			public:
				static class B {}
			}
		`,
		expectation: [
				{type: "error", href: "#/errors/syntax/se-60"},
				"parsing failed"],
	},
	{
		name: "se-61",
		description: "test of syntax error 61",
		code: `
			class A
			{
			public:
				static use math;
			}
		`,
		expectation: [
				{type: "error", href: "#/errors/syntax/se-61"},
				"parsing failed"],
	},
	{
		name: "se-62-1",
		description: "test of syntax error 62, case 1",
		code: `
			class A
			{
			public:
				for 0:10 do print("hello");
			}
		`,
		expectation: [
				{type: "error", href: "#/errors/syntax/se-62"},
				"parsing failed"],
	},
	{
		name: "se-62-2",
		description: "test of syntax error 62, case 2",
		code: `
			class A
			{
			public:
				namespace B {}
			}
		`,
		expectation: [
				{type: "error", href: "#/errors/syntax/se-62"},
				"parsing failed"],
	},
	{
		name: "se-63",
		description: "test of syntax error 63",
		code: `
			for 0:10 do
			{
				namespace A {}
			}
		`,
		expectation: [
				{type: "error", href: "#/errors/syntax/se-63"},
				"parsing failed"],
	},
	{
		name: "se-64",
		description: "test of syntax error 64",
		code: `
			namespace do {}
		`,
		expectation: [
				{type: "error", href: "#/errors/syntax/se-64"},
				"parsing failed"],
	},
	{
		name: "se-65",
		description: "test of syntax error 65",
		code: `
			from math;
		`,
		expectation: [
				{type: "error", href: "#/errors/syntax/se-65"},
				"parsing failed"],
	},
	{
		name: "se-66",
		description: "test of syntax error 66",
		code: `
			use namespace math as mathematics;
		`,
		expectation: [
				{type: "error", href: "#/errors/syntax/se-66"},
				"parsing failed"],
	},
	{
		name: "se-67",
		description: "test of syntax error 67",
		code: `
			use math.sqrt as do;
		`,
		expectation: [
				{type: "error", href: "#/errors/syntax/se-67"},
				"parsing failed"],
	},
	{
		name: "se-68",
		description: "test of syntax error 68",
		code: `
			use namespace math
			for 0:10 do print("hello");
		`,
		expectation: [
				{type: "error", href: "#/errors/syntax/se-68"},
				"parsing failed"],
	},
	{
		name: "se-69",
		description: "test of syntax error 69",
		code: `
			if 3 < 4 print("smaller");
		`,
		expectation: [
				{type: "error", href: "#/errors/syntax/se-69"},
				"parsing failed"],
	},
	{
		name: "se-70",
		description: "test of syntax error 70",
		code: `
			for var "x" in 0:10 do print("x");
		`,
		expectation: [
				{type: "error", href: "#/errors/syntax/se-70"},
				"parsing failed"],
	},
	{
		name: "se-71",
		description: "test of syntax error 71",
		code: `
			for var x do print("x");
		`,
		expectation: [
				{type: "error", href: "#/errors/syntax/se-71"},
				"parsing failed"],
	},
	{
		name: "se-72",
		description: "test of syntax error 72",
		code: `
			for var x in 0:10 print("x");
		`,
		expectation: [
				{type: "error", href: "#/errors/syntax/se-72"},
				"parsing failed"],
	},
	{
		name: "se-73",
		description: "test of syntax error 73",
		code: `
			var a;
			for a print("x");
		`,
		expectation: [
				{type: "error", href: "#/errors/syntax/se-73"},
				"parsing failed"],
	},
	{
		name: "se-74",
		description: "test of syntax error 74",
		code: `
			do print("x"); until false;
			for 0:10 do print("y");
		`,
		expectation: [
				{type: "error", href: "#/errors/syntax/se-74"},
				"parsing failed"],
	},
	{
		name: "se-75",
		description: "test of syntax error 75",
		code: `
			do print("x"); while true
			for 0:10 do print("y");
		`,
		expectation: [
				{type: "error", href: "#/errors/syntax/se-75"},
				"parsing failed"],
	},
	{
		name: "se-76",
		description: "test of syntax error 76",
		code: `
			while true print("x");
		`,
		expectation: [
				{type: "error", href: "#/errors/syntax/se-76"},
				"parsing failed"],
	},
	{
		name: "se-77",
		description: "test of syntax error 77",
		code: `
			break;
		`,
		expectation: [
				{type: "error", href: "#/errors/syntax/se-77"},
				"parsing failed"],
	},
	{
		name: "se-78",
		description: "test of syntax error 78",
		code: `
			continue;
		`,
		expectation: [
				{type: "error", href: "#/errors/syntax/se-78"},
				"parsing failed"],
	},
	{
		name: "se-79",
		description: "test of syntax error 79",
		code: `
			class A
			{
			public:
				constructor()
				{ return 42; }
			}
		`,
		expectation: [
				{type: "error", href: "#/errors/syntax/se-79"},
				"parsing failed"],
	},
	{
		name: "se-80",
		description: "test of syntax error 80",
		code: `
			{ return 42; }
		`,
		expectation: [
				{type: "error", href: "#/errors/syntax/se-80"},
				"parsing failed"],
	},
	{
		name: "se-81",
		description: "test of syntax error 81",
		code: `
			function f()
			{ return 42 }
		`,
		expectation: [
				{type: "error", href: "#/errors/syntax/se-81"},
				"parsing failed"],
	},
	{
		name: "se-81b",
		description: "test of syntax error 81b",
		code: `
			for var i in 0:10 do break
			print("foo");
		`,
		expectation: [
				{type: "error", href: "#/errors/syntax/se-81b"},
				"parsing failed"],
	},
	{
		name: "se-81c",
		description: "test of syntax error 81c",
		code: `
			for var i in 0:10 do continue
			print("foo");
		`,
		expectation: [
				{type: "error", href: "#/errors/syntax/se-81c"},
				"parsing failed"],
	},
	{
		name: "se-82",
		description: "test of syntax error 82",
		code: `
			try
			{
				print("hello");
			}
			print("world");
		`,
		expectation: [
				{type: "error", href: "#/errors/syntax/se-82"},
				"parsing failed"],
	},
	{
		name: "se-84",
		description: "test of syntax error 84",
		code: `
			try
			{
				print("hello");
			}
			catch ex
			{
				print("world");
			}
		`,
		expectation: [
				{type: "error", href: "#/errors/syntax/se-84"},
				"parsing failed"],
	},
	{
		name: "se-85",
		description: "test of syntax error 85",
		code: `
			try
			{
				print("hello");
			}
			catch var do
			{
				print("world");
			}
		`,
		expectation: [
				{type: "error", href: "#/errors/syntax/se-85"},
				"parsing failed"],
	},
	{
		name: "se-86",
		description: "test of syntax error 86",
		code: `
			try
			{
				print("hello");
			}
			catch var ex
			{
				print("world");
			}
		`,
		expectation: [
				{type: "error", href: "#/errors/syntax/se-86"},
				"parsing failed"],
	},
	{
		name: "se-87",
		description: "test of syntax error 87",
		code: `
			throw "uargh"
			print("uargh");
		`,
		expectation: [
				{type: "error", href: "#/errors/syntax/se-87"},
				"parsing failed"],
	},
	{
		name: "se-88",
		description: "test of syntax error 88",
		code: `
			}
		`,
		expectation: [
				{type: "error", href: "#/errors/syntax/se-88"},
				"parsing failed"],
	},
	{
		name: "se-89",
		description: "test of syntax error 89",
		code: `
			for 0:10 do var a = 5;
		`,
		expectation: [
				{type: "error", href: "#/errors/syntax/se-89"},
				"parsing failed"],
	},
	{
		name: "se-90",
		description: "test of syntax error 90",
		code: `
			*5;
		`,
		expectation: [
				{type: "error", href: "#/errors/syntax/se-90"},
				"parsing failed"],
	},

	// argument mismatch errors
	{
		name: "am-1-1",
		description: "test of argument mismatch error am-1, case 1",
		code: `
			var x = Boolean(1);
		`,
		expectation: [
				{type: "error", href: "#/errors/argument-mismatch/am-1"},
				"error"],
	},
	{
		name: "am-1-2",
		description: "test of argument mismatch error am-1, case 2",
		code: `
			var x = Integer(4:10);
		`,
		expectation: [
				{type: "error", href: "#/errors/argument-mismatch/am-1"},
				"error"],
	},
	{
		name: "am-1-3",
		description: "test of argument mismatch error am-1, case 3",
		code: `
			var x = "hello".find(3);
		`,
		expectation: [
				{type: "error", href: "#/errors/argument-mismatch/am-1"},
				"error"],
	},
	{
		name: "am-2",
		description: "test of argument mismatch error am-2",
		code: `
			var x = not "hello";
		`,
		expectation: [
				{type: "error", href: "#/errors/argument-mismatch/am-2"},
				"parsing failed"],
	},
	{
		name: "am-3",
		description: "test of argument mismatch error am-3",
		code: `
			var x = +true;
		`,
		expectation: [
				{type: "error", href: "#/errors/argument-mismatch/am-3"},
				"parsing failed"],
	},
	{
		name: "am-4",
		description: "test of argument mismatch error am-4",
		code: `
			var x = -true;
		`,
		expectation: [
				{type: "error", href: "#/errors/argument-mismatch/am-4"},
				"parsing failed"],
	},
	{
		name: "am-5",
		description: "test of argument mismatch error am-5",
		code: `
			var x = 5 + math.sqrt;
		`,
		expectation: [
				{type: "error", href: "#/errors/argument-mismatch/am-5"},
				"parsing failed"],
	},
	{
		name: "am-6",
		description: "test of argument mismatch error am-6",
		code: `
			var x = 5 - math.sqrt;
		`,
		expectation: [
				{type: "error", href: "#/errors/argument-mismatch/am-6"},
				"parsing failed"],
	},
	{
		name: "am-7",
		description: "test of argument mismatch error am-7",
		code: `
			var x = 5 * math.sqrt;
		`,
		expectation: [
				{type: "error", href: "#/errors/argument-mismatch/am-7"},
				"parsing failed"],
	},
	{
		name: "am-8-1",
		description: "test of argument mismatch error am-8, case 1",
		code: `
			var x = 5 / math.sqrt;
		`,
		expectation: [
				{type: "error", href: "#/errors/argument-mismatch/am-8"},
				"parsing failed"],
	},
	{
		name: "am-8-2",
		description: "test of argument mismatch error am-8, case 2",
		code: `
			var x = 5 // math.sqrt;
		`,
		expectation: [
				{type: "error", href: "#/errors/argument-mismatch/am-8"},
				"parsing failed"],
	},
	{
		name: "am-9",
		description: "test of argument mismatch error am-9",
		code: `
			var x = 5 % math.sqrt;
		`,
		expectation: [
				{type: "error", href: "#/errors/argument-mismatch/am-9"},
				"parsing failed"],
	},
	{
		name: "am-10",
		description: "test of argument mismatch error am-10",
		code: `
			var x = 5 ^ math.sqrt;
		`,
		expectation: [
				{type: "error", href: "#/errors/argument-mismatch/am-10"},
				"parsing failed"],
	},
	{
		name: "am-11-1",
		description: "test of argument mismatch error am-11, case 1",
		code: `
			var x = 5 : 7.5;
		`,
		expectation: [
				{type: "error", href: "#/errors/argument-mismatch/am-11"},
				"parsing failed"],
	},
	{
		name: "am-11-2",
		description: "test of argument mismatch error am-11, case 2",
		code: `
			var x = 5.5 : 8;
		`,
		expectation: [
				{type: "error", href: "#/errors/argument-mismatch/am-11"},
				"parsing failed"],
	},
	{
		name: "am-12-1",
		description: "test of argument mismatch error am-12, case 1",
		code: `
			var x = true and 7;
		`,
		expectation: [
				{type: "error", href: "#/errors/argument-mismatch/am-12"},
				"parsing failed"],
	},
	{
		name: "am-12-2",
		description: "test of argument mismatch error am-12, case 2",
		code: `
			var x = 6 and 9.25;
		`,
		expectation: [
				{type: "error", href: "#/errors/argument-mismatch/am-12"},
				"parsing failed"],
	},
	{
		name: "am-12-3",
		description: "test of argument mismatch error am-12, case 3",
		code: `
			var x = 6.25 and 9;
		`,
		expectation: [
				{type: "error", href: "#/errors/argument-mismatch/am-12"},
				"parsing failed"],
	},
	{
		name: "am-12-4",
		description: "test of argument mismatch error am-12, case 4",
		code: `
			var x = 6.25 or 9;
		`,
		expectation: [
				{type: "error", href: "#/errors/argument-mismatch/am-12"},
				"parsing failed"],
	},
	{
		name: "am-12-5",
		description: "test of argument mismatch error am-12, case 5",
		code: `
			var x = 6.25 xor 9;
		`,
		expectation: [
				{type: "error", href: "#/errors/argument-mismatch/am-12"},
				"parsing failed"],
	},
	{
		name: "am-13-1",
		description: "test of argument mismatch error am-13, case 1",
		code: `
			var x = Integer(Real.inf());
		`,
		expectation: [
				{type: "error", href: "#/errors/argument-mismatch/am-13"},
				"error"],
	},
	{
		name: "am-13-2",
		description: "test of argument mismatch error am-13, case 2",
		code: `
			var x = Integer(-Real.inf());
		`,
		expectation: [
				{type: "error", href: "#/errors/argument-mismatch/am-13"},
				"error"],
	},
	{
		name: "am-13-3",
		description: "test of argument mismatch error am-13, case 3",
		code: `
			var x = Integer(Real.nan());
		`,
		expectation: [
				{type: "error", href: "#/errors/argument-mismatch/am-13"},
				"error"],
	},
	{
		name: "am-14-1",
		description: "test of argument mismatch error am-14, case 1",
		code: `
			var x = Integer("hello");
		`,
		expectation: [
				{type: "error", href: "#/errors/argument-mismatch/am-14"},
				"error"],
	},
	{
		name: "am-14-2",
		description: "test of argument mismatch error am-14, case 2",
		code: `
			var x = Integer("");
		`,
		expectation: [
				{type: "error", href: "#/errors/argument-mismatch/am-14"},
				"error"],
	},
	{
		name: "am-15-1",
		description: "test of argument mismatch error am-15, case 1",
		code: `
			var x = 1 // 0;
		`,
		expectation: [
				{type: "error", href: "#/errors/argument-mismatch/am-15"},
				"parsing failed"],
	},
	{
		name: "am-15-2",
		description: "test of argument mismatch error am-15, case 2",
		code: `
			var x = 1 % 0;
		`,
		expectation: [
				{type: "error", href: "#/errors/argument-mismatch/am-15"},
				"parsing failed"],
	},
	{
		name: "am-15-3",
		description: "test of argument mismatch error am-15, case 3",
		code: `
			var x = 0 // 0;
		`,
		expectation: [
				{type: "error", href: "#/errors/argument-mismatch/am-15"},
				"parsing failed"],
	},
	{
		name: "am-15-4",
		description: "test of argument mismatch error am-15, case 4",
		code: `
			var x = 0 % 0;
		`,
		expectation: [
				{type: "error", href: "#/errors/argument-mismatch/am-15"},
				"parsing failed"],
	},
	{
		name: "am-16-1",
		description: "test of argument mismatch error am-16, case 1",
		code: `
			var x = 0:3 < 1:4;
		`,
		expectation: [
				{type: "error", href: "#/errors/argument-mismatch/am-16"},
				"parsing failed"],
	},
	{
		name: "am-16-2",
		description: "test of argument mismatch error am-16, case 2",
		code: `
			var x = [1,2,3,{a:math.sqrt(2),b:"a",c:-99},4,5,6];
			x[3]["b"] = x;
			var y = [1,2,3,{a:math.sqrt(2),b:"a",c:-99},4,5,6];
			y[3]["b"] = y;
			print(x < y);
		`,
		expectation: [
				{type: "error", href: "#/errors/argument-mismatch/am-16"},
				"error"],
	},
	{
		name: "am-16b",
		description: "test of argument mismatch error am-16b",
		code: `
			var x = "a" < 100;
		`,
		expectation: [
				{type: "error", href: "#/errors/argument-mismatch/am-16b"},
				"parsing failed"],
	},
	{
		name: "am-17",
		description: "test of argument mismatch error am-17",
		code: `
			var x = Array(-2, null);
		`,
		expectation: [
				{type: "error", href: "#/errors/argument-mismatch/am-17"},
				"error"],
	},
	{
		name: "am-18",
		description: "test of argument mismatch error am-18",
		code: `
			var x = [1,2,3];
			x.insert(5, null);
		`,
		expectation: [
				{type: "error", href: "#/errors/argument-mismatch/am-18"},
				"error"],
	},
	{
		name: "am-18b",
		description: "test of argument mismatch error am-18b",
		code: `
			[].pop();
		`,
		expectation: [
				{type: "error", href: "#/errors/argument-mismatch/am-18b"},
				"error"],
	},
	{
		name: "am-19",
		description: "test of argument mismatch error am-19",
		code: `
			[1,2,3].sort(function(a, b) { return "a"; });
		`,
		expectation: [
				{type: "error", href: "#/errors/argument-mismatch/am-19"},
				"error"],
	},
	{
		name: "am-20",
		description: "test of argument mismatch error am-20",
		code: `
			var x = "hello"["s"];
		`,
		expectation: [
				{type: "error", href: "#/errors/argument-mismatch/am-20"},
				"error"],
	},
	{
		name: "am-21",
		description: "test of argument mismatch error am-21",
		code: `
			var x = "hello"[-2];
		`,
		expectation: [
				{type: "error", href: "#/errors/argument-mismatch/am-21"},
				"error"],
	},
	{
		name: "am-22",
		description: "test of argument mismatch error am-22",
		code: `
			var x = "hello"[7];
		`,
		expectation: [
				{type: "error", href: "#/errors/argument-mismatch/am-22"},
				"error"],
	},
	{
		name: "am-23",
		description: "test of argument mismatch error am-23",
		code: `
			var x = [1,2,3][-2];
		`,
		expectation: [
				{type: "error", href: "#/errors/argument-mismatch/am-23"},
				"error"],
	},
	{
		name: "am-24",
		description: "test of argument mismatch error am-24",
		code: `
			var x = [1,2,3][7];
		`,
		expectation: [
				{type: "error", href: "#/errors/argument-mismatch/am-24"},
				"error"],
	},
	{
		name: "am-25",
		description: "test of argument mismatch error am-25",
		code: `
			var x = [1,2,3];
			x[1:3] = [4,5];
		`,
		expectation: [
				{type: "error", href: "#/errors/argument-mismatch/am-25"},
				"error"],
	},
	{
		name: "am-26",
		description: "test of argument mismatch error am-26",
		code: `
			var x = [1,2,3]["a"];
		`,
		expectation: [
				{type: "error", href: "#/errors/argument-mismatch/am-26"},
				"error"],
	},
	{
		name: "am-27",
		description: "test of argument mismatch error am-27",
		code: `
			var x = {a:3,b:5}["c"];
		`,
		expectation: [
				{type: "error", href: "#/errors/argument-mismatch/am-27"},
				"error"],
	},
	{
		name: "am-28",
		description: "test of argument mismatch error am-28",
		code: `
			var x = {a:3,b:5}[33];
		`,
		expectation: [
				{type: "error", href: "#/errors/argument-mismatch/am-28"},
				"error"],
	},
	{
		name: "am-29-1",
		description: "test of argument mismatch error am-29, case 1",
		code: `
			var x = (5:15)[-2];
		`,
		expectation: [
				{type: "error", href: "#/errors/argument-mismatch/am-29"},
				"error"],
	},
	{
		name: "am-29-2",
		description: "test of argument mismatch error am-29, case 2",
		code: `
			var x = (5:15)[12];
		`,
		expectation: [
				{type: "error", href: "#/errors/argument-mismatch/am-29"},
				"error"],
	},
	{
		name: "am-30",
		description: "test of argument mismatch error am-30",
		code: `
			var x = (5:15)["c"];
		`,
		expectation: [
				{type: "error", href: "#/errors/argument-mismatch/am-30"},
				"error"],
	},
	{
		name: "am-31",
		description: "test of argument mismatch error am-31",
		code: `
			var y = 9.9;
			var x = y["c"];
		`,
		expectation: [
				{type: "error", href: "#/errors/argument-mismatch/am-31"},
				"error"],
	},
	{
		name: "am-31b",
		description: "test of argument mismatch error am-31b",
		code: `
			var y = 9:19;
			y[2] = 0;
		`,
		expectation: [
				{type: "error", href: "#/errors/argument-mismatch/am-31b"},
				"error"],
	},
	{
		name: "am-32-1",
		description: "test of argument mismatch error am-32, case 1",
		code: `
			var x;
			(x) = 0;
		`,
		expectation: [
				{type: "error", href: "#/errors/argument-mismatch/am-32"},
				"parsing failed"],
	},
	{
		name: "am-32-2",
		description: "test of argument mismatch error am-32, case 2",
		code: `
			42 = 0;
		`,
		expectation: [
				{type: "error", href: "#/errors/argument-mismatch/am-32"},
				"parsing failed"],
	},
	{
		name: "am-32-3",
		description: "test of argument mismatch error am-32, case 3",
		code: `
			math.sqrt = 0;
		`,
		expectation: [
				{type: "error", href: "#/errors/argument-mismatch/am-32"},
				"parsing failed"],
	},
	{
		name: "am-32-4",
		description: "test of argument mismatch error am-32, case 4",
		code: `
			var x;
			math.sqrt(x) = 0;
		`,
		expectation: [
				{type: "error", href: "#/errors/argument-mismatch/am-32"},
				"parsing failed"],
	},
	{
		name: "am-32-5",
		description: "test of argument mismatch error am-32, case 5",
		code: `
			Integer = 0;
		`,
		expectation: [
				{type: "error", href: "#/errors/argument-mismatch/am-32"},
				"parsing failed"],
	},
	{
		name: "am-32-6",
		description: "test of argument mismatch error am-32, case 6",
		code: `
			var x = "hello";
			x[2] = 0;
		`,
		expectation: [
				{type: "error", href: "#/errors/argument-mismatch/am-32"},
				"error"],
	},
	{
		name: "am-32-7",
		description: "test of argument mismatch error am-32, case 7",
		code: `
			class A
			{
			public:
				function f() {}
			}
			var x = A();
			x.f = 0;
		`,
		expectation: [
				{type: "error", href: "#/errors/argument-mismatch/am-32"},
				"error"],
	},
	{
		name: "am-32-8",
		description: "test of argument mismatch error am-32, case 8",
		code: `
			class A
			{
			public:
				static function f() {}
			}
			var x = A();
			x.f = 0;
		`,
		expectation: [
				{type: "error", href: "#/errors/argument-mismatch/am-32"},
				"error"],
	},
	{
		name: "am-33",
		description: "test of argument mismatch error am-33",
		code: `
			if 1 then print("hello");
		`,
		expectation: [
				{type: "error", href: "#/errors/argument-mismatch/am-33"},
				"error"],
	},
	{
		name: "am-34",
		description: "test of argument mismatch error am-34",
		code: `
			for 10 do print("hello");
		`,
		expectation: [
				{type: "error", href: "#/errors/argument-mismatch/am-34"},
				"error"],
	},
	{
		name: "am-35",
		description: "test of argument mismatch error am-35",
		code: `
			function f() {};
			for f in 0:10 do print("hello");
		`,
		expectation: [
				{type: "error", href: "#/errors/argument-mismatch/am-35"},
				"parsing failed"],
	},
	{
		name: "am-36",
		description: "test of argument mismatch error am-36",
		code: `
			var b = 1;
			do print("hello"); while b;
		`,
		expectation: [
				{type: "print", message: "hello"},
				{type: "error", href: "#/errors/argument-mismatch/am-36"},
				"error"],
	},
	{
		name: "am-37",
		description: "test of argument mismatch error am-37",
		code: `
			while 1 do print("hello");
		`,
		expectation: [
				{type: "error", href: "#/errors/argument-mismatch/am-37"},
				"error"],
	},
	{
		name: "am-38",
		description: "test of argument mismatch error am-38",
		code: `
			var x = load("unittest-data-9rhgmq9k2lmyxlcjl249vfnx92vmpis");
		`,
		expectation: [
				{type: "error", href: "#/errors/argument-mismatch/am-38"},
				"error"],
	},
	{
		name: "am-39-1",
		description: "test of argument mismatch error am-39, case 1",
		code: `
			var x = math.sqrt;
			save("unittest-data", x);
		`,
		expectation: [
				{type: "error", href: "#/errors/argument-mismatch/am-39"},
				"error"],
	},
	{
		name: "am-39-2",
		description: "test of argument mismatch error am-39, case 2",
		code: `
			var x = [1,2,3,{a:math.sqrt(2),b:null,c:-99},4,5,6];
			x[3]["b"] = x;
			save("unittest-data", x);
		`,
		expectation: [
				{type: "error", href: "#/errors/argument-mismatch/am-39"},
				"error"],
	},
	{
		name: "am-40",
		description: "test of argument mismatch error am-40",
		code: `
			setEventHandler("invalid-event-name", function(event) {});
		`,
		expectation: [
				{type: "error", href: "#/errors/argument-mismatch/am-40"},
				"error"],
	},
	{
		name: "am-41",
		description: "test of argument mismatch error am-41",
		code: `
			setEventHandler("timer", function() {});
		`,
		expectation: [
				{type: "error", href: "#/errors/argument-mismatch/am-41"},
				"error"],
	},
	{
		name: "am-42-1",
		description: "test of argument mismatch error am-42, case 1",
		code: `
			var x = math.sqrt;
			var y = deepcopy(x);
		`,
		expectation: [
				{type: "error", href: "#/errors/argument-mismatch/am-42"},
				"error"],
	},
	{
		name: "am-42-2",
		description: "test of argument mismatch error am-42, case 2",
		code: `
			var x = canvas.MouseMoveEvent();
			var y = deepcopy(x);
		`,
		expectation: [
				{type: "error", href: "#/errors/argument-mismatch/am-42"},
				"error"],
	},
	{
		name: "am-43-1",
		description: "test of argument mismatch error am-43, case 1",
		code: `
			var x = [1,2,3,{a:math.sqrt(2),b:null,c:-99},4,5,6];
			x[3]["b"] = x;
			print(x);
		`,
		expectation: [
				{type: "error", href: "#/errors/argument-mismatch/am-43"},
				"error"],
	},
	{
		name: "am-43-2",
		description: "test of argument mismatch error am-43, case 2",
		code: `
			var x = [1,2,3,{a:math.sqrt(2),b:null,c:-99},4,5,6];
			x[3]["b"] = x;
			var y = [1,2,3,{a:math.sqrt(2),b:null,c:-99},4,5,6];
			y[3]["b"] = y;
			print(x == y);
		`,
		expectation: [
				{type: "error", href: "#/errors/argument-mismatch/am-43"},
				"error"],
	},

	// name resolution errors
	{
		name: "ne-1-1",
		description: "test of name resolution error ne-1, case 1",
		code: `
			function f(x, y) {}
			f(1, x=2, y=3);
		`,
		expectation: [
				{type: "error", href: "#/errors/name/ne-1"},
				"parsing failed"],
	},
	{
		name: "ne-1-",
		description: "test of name resolution error ne-1, case 2",
		code: `
			function f(x, y) {}
			f(x=1, x=2, y=3);
		`,
		expectation: [
				{type: "error", href: "#/errors/name/ne-1"},
				"parsing failed"],
	},
	{
		name: "ne-2",
		description: "test of name resolution error ne-2",
		code: `
			function f(x, y) {}
			f(x=1, y=2, z=3);
		`,
		expectation: [
				{type: "error", href: "#/errors/name/ne-2"},
				"parsing failed"],
	},
	{
		name: "ne-3",
		description: "test of name resolution error ne-3",
		code: `
			function f(x, y) {}
			f(1, 2, 3);
		`,
		expectation: [
				{type: "error", href: "#/errors/name/ne-3"},
				"parsing failed"],
	},
	{
		name: "ne-4",
		description: "test of name resolution error ne-4",
		code: `
			function f(x, y, z) {}
			f(1, z=3);
		`,
		expectation: [
				{type: "error", href: "#/errors/name/ne-4"},
				"parsing failed"],
	},
	{
		name: "ne-5-1",
		description: "test of name resolution error ne-5, case 1",
		code: `
			var a = b;
		`,
		expectation: [
				{type: "error", href: "#/errors/name/ne-5"},
				"parsing failed"],
	},
	{
		name: "ne-5-2",
		description: "test of name resolution error ne-5, case 2",
		code: `
			var x = math.sqrt(x);
		`,
		expectation: [
				{type: "error", href: "#/errors/name/ne-5"},
				"parsing failed"],
	},
	{
		name: "ne-6",
		description: "test of name resolution error ne-6",
		code: `
			class A
			{
			public:
				var a;
				class B
				{
				public:
					function f()
					{ return a; }
				}
			}
		`,
		expectation: [
				{type: "error", href: "#/errors/name/ne-6"},
				"parsing failed"],
	},
	{
		name: "ne-7",
		description: "test of name resolution error ne-7",
		code: `
			function f()
			{
				var a;
				function g()
				{ return a; }
			}
		`,
		expectation: [
				{type: "error", href: "#/errors/name/ne-7"},
				"parsing failed"],
	},
	{
		name: "ne-8",
		description: "test of name resolution error ne-8",
		code: `
			class A
			{
			private:
				var a;
			}
			class B : A
			{
			public:
				function f()
				{ return a; }
			}
		`,
		expectation: [
				{type: "error", href: "#/errors/name/ne-8"},
				"parsing failed"],
	},
	{
		name: "ne-9",
		description: "test of name resolution error ne-9",
		code: `
			var x = math.foobar;
		`,
		expectation: [
				{type: "error", href: "#/errors/name/ne-9"},
				"parsing failed"],
	},
	{
		name: "ne-11",
		description: "test of name resolution error ne-11",
		code: `
			var x = math;
		`,
		expectation: [
				{type: "error", href: "#/errors/name/ne-11"},
				"parsing failed"],
	},
	{
		name: "ne-12",
		description: "test of name resolution error ne-12",
		code: `
			class A
			{
			}
			var x = A.a;
		`,
		expectation: [
				{type: "error", href: "#/errors/name/ne-12"},
				"error"],
	},
	{
		name: "ne-13",
		description: "test of name resolution error ne-13",
		code: `
			class A
			{
			}
			var x = A();
			var y = x.a;
		`,
		expectation: [
				{type: "error", href: "#/errors/name/ne-13"},
				"error"],
	},
	{
		name: "ne-14-1",
		description: "test of name resolution error ne-14, case 1",
		code: `
			var a;
			var a;
		`,
		expectation: [
				{type: "error", href: "#/errors/name/ne-14"},
				"parsing failed"],
	},
	{
		name: "ne-14-2",
		description: "test of name resolution error ne-14, case 2",
		code: `
			function f(a)
			{
				var a;
			}
		`,
		expectation: [
				{type: "error", href: "#/errors/name/ne-14"},
				"parsing failed"],
	},
	{
		name: "ne-14-3",
		description: "test of name resolution error ne-14, case 3",
		code: `
			var x;
			var f = function [a=x]()
			{
				var a;
			};
		`,
		expectation: [
				{type: "error", href: "#/errors/name/ne-14"},
				"parsing failed"],
	},
	{
		name: "ne-14-4",
		description: "test of name resolution error ne-14, case 4",
		code: `
			class A
			{
			public:
				var a;
				var a;
			}
		`,
		expectation: [
				{type: "error", href: "#/errors/name/ne-14"},
				"parsing failed"],
	},
	{
		name: "ne-14-5",
		description: "test of name resolution error ne-14, case 5",
		code: `
			namespace A
			{
				var a;
			}
			namespace A
			{
				var a;
			}
		`,
		expectation: [
				{type: "error", href: "#/errors/name/ne-14"},
				"parsing failed"],
	},
	{
		name: "ne-15-1",
		description: "test of name resolution error ne-15, case 1",
		code: `
			function f() {}
			function f(x) {}
		`,
		expectation: [
				{type: "error", href: "#/errors/name/ne-15"},
				"parsing failed"],
	},
	{
		name: "ne-15-2",
		description: "test of name resolution error ne-15, case 2",
		code: `
			class A
			{
			public:
				function f() {}
				function f(x) {}
			}
		`,
		expectation: [
				{type: "error", href: "#/errors/name/ne-15"},
				"parsing failed"],
	},
	{
		name: "ne-16-1",
		description: "test of name resolution error ne-16, case 1",
		code: `
			function f(x, x) {}
		`,
		expectation: [
				{type: "error", href: "#/errors/name/ne-16"},
				"parsing failed"],
	},
	{
		name: "ne-16-2",
		description: "test of name resolution error ne-16, case 2",
		code: `
			var a;
			var f = function[x=a](x) {};
		`,
		expectation: [
				{type: "error", href: "#/errors/name/ne-16"},
				"parsing failed"],
	},
	{
		name: "ne-17",
		description: "test of name resolution error ne-17",
		code: `
			var a, b;
			var f = function[x=a,x=b]() {};
		`,
		expectation: [
				{type: "error", href: "#/errors/name/ne-17"},
				"parsing failed"],
	},
	{
		name: "ne-18",
		description: "test of name resolution error ne-18",
		code: `
			namespace A {}
			class A {}
		`,
		expectation: [
				{type: "error", href: "#/errors/name/ne-18"},
				"parsing failed"],
	},
	{
		name: "ne-19",
		description: "test of name resolution error ne-19",
		code: `
			class A {}
			namespace A {}
		`,
		expectation: [
				{type: "error", href: "#/errors/name/ne-19"},
				"parsing failed"],
	},
	{
		name: "ne-21",
		description: "test of name resolution error ne-21",
		code: `
			class A
			{
			public:
				constructor(x) : super(x) {}
			}
		`,
		expectation: [
				{type: "error", href: "#/errors/name/ne-21"},
				"parsing failed"],
	},
	{
		name: "ne-22",
		description: "test of name resolution error ne-22",
		code: `
			var B = 42;
			class A : B {}
		`,
		expectation: [
				{type: "error", href: "#/errors/name/ne-22"},
				"parsing failed"],
	},
	{
		name: "ne-23",
		description: "test of name resolution error ne-23",
		code: `
			var a;
			use namespace a;
		`,
		expectation: [
				{type: "error", href: "#/errors/name/ne-23"},
				"parsing failed"],
	},
	{
		name: "ne-24",
		description: "test of name resolution error ne-24",
		code: `
			var sqrt;
			use namespace math;
		`,
		expectation: [
				{type: "error", href: "#/errors/name/ne-24"},
				"parsing failed"],
	},
	{
		name: "ne-25",
		description: "test of name resolution error ne-25",
		code: `
			class A
			{
			protected:
				constructor(x) {}
			}
			var a = A(0);
		`,
		expectation: [
				{type: "error", href: "#/errors/name/ne-25"},
				"parsing failed"],
	},
	{
		name: "ne-26",
		description: "test of name resolution error ne-26",
		code: `
			class A : A { }
		`,
		expectation: [
				{type: "error", href: "#/errors/name/ne-26"},
				"parsing failed"],
	},

	// logic errors
	{
		name: "le-1",
		description: "test of logic error le-1",
		code: `
			function f() { f(); }
			f();
		`,
		expectation: [
				{type: "error", href: "#/errors/logic/le-1"},
				"error"],
	},
	{
		name: "le-2",
		description: "test of logic error le-2",
		code: `
			function f() { enterEventMode(); }
			setEventHandler("canvas.keydown", function(event)
					{ f(); });
			enterEventMode();
		`,
		events:
		[
			{
				name: "canvas.keydown",
				type: "canvas.KeyboardEvent",
				attr: {
					key: "ArrowLeft",
					shift : false,
					control: true,
					alt: false,
					meta: false,
				},
			},
		],
		expectation: [
				{type: "error", href: "#/errors/logic/le-2"},
				"error"],
	},
	{
		name: "le-3",
		description: "test of logic error le-3",
		code: `
			quitEventMode();
		`,
		expectation: [
				{type: "error", href: "#/errors/logic/le-3"},
				"error"],
	},

	// user errors
	// do not test ue-1 and ue-2, they were tested already with the corresponding core functions
	{
		name: "ue-3",
		description: "test of user error ue-3",
		code: `
			throw "foo";
		`,
		expectation: [
				{type: "error", href: "#/errors/user/ue-3"},
				"error"],
	},

	test_lattice_craft,

	// Checking internal errors is inherently impossible, and quite meaningless.
	// Therefore we don't have unit tests for them.
];

