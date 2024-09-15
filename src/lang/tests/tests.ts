import { Version } from "../version";
import { test_lattice_craft } from "./test_lattice_craft";

export type TscriptExpectation = object;
export interface TscriptEvent {
	name: string;
	type: string;
	attr: object;
}

export interface TscriptTest {
	name: string;
	description: string;
	code: string;

	expectation: Array<TscriptExpectation> | object;
	events?: Array<TscriptEvent>;
	parseOnly?: boolean;
	input?: Array<any>;
	browserOnly?: boolean;
	timeout?: number;
}

// definition of most unit test

export const tests: Array<TscriptTest> = [
	// lexer
	{
		name: "lexer and token types",
		description:
			"test the types of constants - including errors that remained undetected for much too long",
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
			{ type: "print", message: "<Type Null>" },
			{ type: "print", message: "<Type Boolean>" },
			{ type: "print", message: "<Type Boolean>" },
			{ type: "print", message: "<Type Integer>" },
			{ type: "print", message: "<Type Real>" },
			{ type: "print", message: "<Type String>" },
			{ type: "print", message: "<Type String>" },
			{ type: "print", message: "<Type String>" },
			{ type: "print", message: "<Type String>" },
			{ type: "print", message: "<Type String>" },
			"finished",
		],
	},
	{
		name: "incomplete real number format 1",
		description: "notation like .5 is disallowed",
		code: `
			print(.5);
		`,
		expectation: [
			{ type: "error", href: "#/errors/syntax/se-42" },
			"parsing failed",
		],
	},
	{
		name: "incomplete real number format 2",
		description: "notation like 5. is disallowed",
		code: `
			print(5.);
		`,
		expectation: [
			{ type: "error", href: "#/errors/syntax/se-1" },
			"parsing failed",
		],
	},
	{
		name: "incomplete real number format 3",
		description: "notation like 5e is disallowed",
		code: `
			print(5e);
		`,
		expectation: [
			{ type: "error", href: "#/errors/syntax/se-1" },
			"parsing failed",
		],
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
		events: [
			{
				name: "canvas.mousedown",
				type: "canvas.MouseButtonEvent",
				attr: {
					x: 50,
					y: 25,
					button: 0,
					buttons: [true, false, false],
					shift: false,
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
					shift: false,
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
					shift: false,
					control: true,
					alt: false,
					meta: false,
				},
			},
		],
		expectation: [
			{ type: "print", message: "down" },
			{ type: "print", message: "up" },
			"finished",
		],
	},

	// basic language constructs
	{
		name: "blocks, variables, scoping, and assignment",
		description:
			"test statements blocks and how they affect scoping of variables",
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
			{ type: "print", message: "0" },
			{ type: "print", message: "2" },
			{ type: "print", message: "1" },
			{ type: "print", message: "1" },
			{ type: "print", message: "0" },
			{ type: "print", message: "1" },
			"finished",
		],
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
			print("abcde"[2]);
			print("abcde"[2:7]);
			print("abcde"[-7:7]);
			print("abcde"[2:-7]);
		`,
		expectation: [
			{ type: "print", message: "-1" },
			{ type: "print", message: "12" },
			{ type: "print", message: "12" },
			{ type: "print", message: "-16" },
			{ type: "print", message: "132" },
			{ type: "print", message: "64" },
			{ type: "print", message: "true" },
			{ type: "print", message: "99" },
			{ type: "print", message: "cde" },
			{ type: "print", message: "abcde" },
			{ type: "print", message: "" },
			"finished",
		],
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
			{ type: "print", message: "then" },
			{ type: "print", message: "else" },
			"finished",
		],
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
			{ type: "print", message: "." },
			{ type: "print", message: "." },
			{ type: "print", message: "." },
			{ type: "print", message: "5" },
			{ type: "print", message: "6" },
			{ type: "print", message: "7" },
			{ type: "print", message: "true" },
			{ type: "print", message: "null" },
			{ type: "print", message: "p" },
			"finished",
		],
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
			{ type: "print", message: "." },
			{ type: "print", message: "0" },
			{ type: "print", message: "1" },
			{ type: "print", message: "2" },
			"finished",
		],
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
			{ type: "print", message: "0" },
			{ type: "print", message: "1" },
			{ type: "print", message: "2" },
			"finished",
		],
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
			{ type: "print", message: "0" },
			{ type: "print", message: "1" },
			{ type: "print", message: "2" },
			"finished",
		],
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
			{ type: "print", message: "0" },
			{ type: "print", message: "1" },
			{ type: "print", message: "3" },
			{ type: "print", message: "4" },
			"finished",
		],
	},
	{
		name: "function calls and default parameters",
		description: "test function call features",
		code: `
			function f(x)
			{ return x*x; }
			function g(x = 7)
			{ return 2*x; }
			var z = 7;
			print(f(3));
			print(f(z));
			print(f(x=z));
			print(g(3));
			print(g(z));
			print(g(x=z));
		`,
		expectation: [
			{ type: "print", message: "9" },
			{ type: "print", message: "49" },
			{ type: "print", message: "49" },
			{ type: "print", message: "6" },
			{ type: "print", message: "14" },
			{ type: "print", message: "14" },
			"finished",
		],
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
			{ type: "print", message: "4" },
			{ type: "print", message: "4" },
			{ type: "print", message: "9" },
			{ type: "print", message: "a" },
			"finished",
		],
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
			{ type: "print", message: "a" },
			{ type: "print", message: "foo" },
			"finished",
		],
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
			{ type: "print", message: "5" },
			{ type: "print", message: "5.25" },
			"finished",
		],
	},
	{
		name: "unary operator -",
		description: "test unary operator - on supported types",
		code: `
			print(-5);
			print(-5.25);
		`,
		expectation: [
			{ type: "print", message: "-5" },
			{ type: "print", message: "-5.25" },
			"finished",
		],
	},
	{
		name: "unary operator not",
		description: "test unary operator not on supported types",
		code: `
			print(not false);
			print(not true);
		`,
		expectation: [
			{ type: "print", message: "true" },
			{ type: "print", message: "false" },
			"finished",
		],
	},
	{
		name: "binary operator +",
		description:
			"test binary operator + on supported types and type mixtures",
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
			{ type: "print", message: "7" },
			{ type: "print", message: "7.25" },
			{ type: "print", message: "7.25" },
			{ type: "print", message: "7.5" },
			{ type: "print", message: "7.5a" },
			{ type: "print", message: "a3.254.25" },
			{ type: "print", message: "a2:5" },
			{ type: "print", message: "-2147483648" },
			{ type: "print", message: "Infinity" },
			"finished",
		],
	},
	{
		name: "binary operator -",
		description:
			"test binary operator - on supported types and type mixtures",
		code: `
			print(3 - 4);
			print(3 - 4.25);
			print(3.25 - 4);
			print(3.25 - 4.25);
			print(-2147483647 - 2);
			print(-1e308 - 1e308);
		`,
		expectation: [
			{ type: "print", message: "-1" },
			{ type: "print", message: "-1.25" },
			{ type: "print", message: "-0.75" },
			{ type: "print", message: "-1" },
			{ type: "print", message: "2147483647" },
			{ type: "print", message: "-Infinity" },
			"finished",
		],
	},
	{
		name: "binary operator *",
		description:
			"test binary operator * on supported types and type mixtures",
		code: `
			print(3 * 4);
			print(3 * 4.25);
			print(3.25 * 4);
			print(3.5 * 4.5);
			print(65535 * 65536);
			print(65535.0 * 65536);
		`,
		expectation: [
			{ type: "print", message: "12" },
			{ type: "print", message: "12.75" },
			{ type: "print", message: "13" },
			{ type: "print", message: "15.75" },
			{ type: "print", message: "-65536" },
			{ type: "print", message: "4294901760" },
			"finished",
		],
	},
	{
		name: "binary operator /",
		description:
			"test binary operator / on supported types and type mixtures",
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
			{ type: "print", message: "0.75" },
			{ type: "print", message: "0.75" },
			{ type: "print", message: "0.75" },
			{ type: "print", message: "0.75" },
			{ type: "print", message: "Infinity" },
			{ type: "print", message: "-Infinity" },
			{ type: "print", message: "Infinity" },
			{ type: "print", message: "0" },
			"finished",
		],
	},
	{
		name: "binary operator //",
		description:
			"test binary operator // on supported types and type mixtures",
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
			print(0.0 // 0.0);
		`,
		expectation: [
			{ type: "print", message: "2" },
			{ type: "print", message: "-3" },
			{ type: "print", message: "-2" },
			{ type: "print", message: "3" },
			{ type: "print", message: "2" },
			{ type: "print", message: "2" },
			{ type: "print", message: "2" },
			{ type: "print", message: "-3" },
			{ type: "print", message: "-2" },
			{ type: "print", message: "3" },
			{ type: "print", message: "Infinity" },
			{ type: "print", message: "-Infinity" },
			{ type: "print", message: "NaN" },
			"finished",
		],
	},
	{
		name: "binary operator %",
		description:
			"test binary operator % on supported types and type mixtures",
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
			{ type: "print", message: "3" },
			{ type: "print", message: "1" },
			{ type: "print", message: "3" },
			{ type: "print", message: "1" },
			{ type: "print", message: "2" },
			{ type: "print", message: "3.5" },
			{ type: "print", message: "2.5" },
			{ type: "print", message: "2" },
			{ type: "print", message: "2.5" },
			{ type: "print", message: "2" },
			"finished",
		],
	},
	{
		name: "binary operator ^",
		description:
			"test binary operator * on supported types and type mixtures",
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
			{ type: "print", message: "0" },
			{ type: "print", message: "1099511627776" },
			{ type: "print", message: "1099511627776" },
			{ type: "print", message: "Infinity" },
			{ type: "print", message: "16" },
			{ type: "print", message: "0.0625" },
			{ type: "print", message: "0.0625" },
			{ type: "print", message: "0.0625" },
			"finished",
		],
	},
	{
		name: "binary operator ==",
		description:
			"test binary operator == on supported types and type mixtures",
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
			{ type: "print", message: "true" },
			{ type: "print", message: "false" },
			{ type: "print", message: "true" },
			{ type: "print", message: "true" },
			{ type: "print", message: "false" },
			{ type: "print", message: "true" },
			{ type: "print", message: "true" },
			{ type: "print", message: "true" },
			{ type: "print", message: "true" },
			{ type: "print", message: "false" },
			{ type: "print", message: "false" },
			{ type: "print", message: "true" },
			{ type: "print", message: "false" },
			{ type: "print", message: "true" },
			{ type: "print", message: "true" },
			{ type: "print", message: "false" },
			{ type: "print", message: "false" },
			{ type: "print", message: "true" },
			{ type: "print", message: "true" },
			{ type: "print", message: "false" },
			{ type: "print", message: "false" },
			{ type: "print", message: "false" },
			{ type: "print", message: "true" },
			{ type: "print", message: "true" },
			{ type: "print", message: "false" },
			{ type: "print", message: "false" },
			{ type: "print", message: "false" },
			{ type: "print", message: "true" },
			{ type: "print", message: "false" },
			{ type: "print", message: "true" },
			{ type: "print", message: "false" },
			{ type: "print", message: "false" },
			{ type: "print", message: "false" },
			{ type: "print", message: "true" },
			"finished",
		],
	},
	{
		name: "binary operator !=",
		description:
			"test binary operator != on supported types and type mixtures",
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
			{ type: "print", message: "false" },
			{ type: "print", message: "true" },
			{ type: "print", message: "false" },
			{ type: "print", message: "false" },
			{ type: "print", message: "true" },
			{ type: "print", message: "false" },
			{ type: "print", message: "false" },
			{ type: "print", message: "false" },
			{ type: "print", message: "false" },
			{ type: "print", message: "true" },
			{ type: "print", message: "true" },
			{ type: "print", message: "false" },
			{ type: "print", message: "true" },
			{ type: "print", message: "false" },
			{ type: "print", message: "false" },
			{ type: "print", message: "true" },
			{ type: "print", message: "true" },
			{ type: "print", message: "false" },
			{ type: "print", message: "false" },
			{ type: "print", message: "true" },
			{ type: "print", message: "true" },
			{ type: "print", message: "true" },
			{ type: "print", message: "false" },
			{ type: "print", message: "false" },
			{ type: "print", message: "true" },
			{ type: "print", message: "true" },
			{ type: "print", message: "true" },
			{ type: "print", message: "false" },
			{ type: "print", message: "true" },
			{ type: "print", message: "false" },
			{ type: "print", message: "true" },
			{ type: "print", message: "true" },
			{ type: "print", message: "true" },
			{ type: "print", message: "false" },
			"finished",
		],
	},
	{
		name: "binary operator <",
		description:
			"test binary operator < on supported types and type mixtures",
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
			{ type: "print", message: "false" },
			{ type: "print", message: "true" },
			{ type: "print", message: "false" },
			{ type: "print", message: "false" },
			{ type: "print", message: "true" },
			{ type: "print", message: "false" },
			{ type: "print", message: "false" },
			{ type: "print", message: "false" },
			{ type: "print", message: "true" },
			{ type: "print", message: "true" },
			{ type: "print", message: "false" },
			{ type: "print", message: "false" },
			{ type: "print", message: "true" },
			{ type: "print", message: "true" },
			{ type: "print", message: "false" },
			"finished",
		],
	},
	{
		name: "binary operator <=",
		description:
			"test binary operator <= on supported types and type mixtures",
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
			{ type: "print", message: "true" },
			{ type: "print", message: "true" },
			{ type: "print", message: "false" },
			{ type: "print", message: "true" },
			{ type: "print", message: "true" },
			{ type: "print", message: "false" },
			{ type: "print", message: "true" },
			{ type: "print", message: "false" },
			{ type: "print", message: "true" },
			{ type: "print", message: "true" },
			{ type: "print", message: "true" },
			{ type: "print", message: "false" },
			{ type: "print", message: "true" },
			{ type: "print", message: "true" },
			{ type: "print", message: "true" },
			"finished",
		],
	},
	{
		name: "binary operator >",
		description:
			"test binary operator > on supported types and type mixtures",
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
			{ type: "print", message: "false" },
			{ type: "print", message: "false" },
			{ type: "print", message: "true" },
			{ type: "print", message: "false" },
			{ type: "print", message: "false" },
			{ type: "print", message: "true" },
			{ type: "print", message: "false" },
			{ type: "print", message: "true" },
			{ type: "print", message: "false" },
			{ type: "print", message: "false" },
			{ type: "print", message: "false" },
			{ type: "print", message: "true" },
			{ type: "print", message: "false" },
			{ type: "print", message: "false" },
			{ type: "print", message: "false" },
			"finished",
		],
	},
	{
		name: "binary operator >=",
		description:
			"test binary operator >= on supported types and type mixtures",
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
			{ type: "print", message: "true" },
			{ type: "print", message: "false" },
			{ type: "print", message: "true" },
			{ type: "print", message: "true" },
			{ type: "print", message: "false" },
			{ type: "print", message: "true" },
			{ type: "print", message: "true" },
			{ type: "print", message: "true" },
			{ type: "print", message: "false" },
			{ type: "print", message: "false" },
			{ type: "print", message: "true" },
			{ type: "print", message: "true" },
			{ type: "print", message: "false" },
			{ type: "print", message: "false" },
			{ type: "print", message: "true" },
			"finished",
		],
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
			{ type: "print", message: "false" },
			{ type: "print", message: "false" },
			{ type: "print", message: "false" },
			{ type: "print", message: "true" },
			{ type: "print", message: "34" },
			"finished",
		],
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
			{ type: "print", message: "false" },
			{ type: "print", message: "true" },
			{ type: "print", message: "true" },
			{ type: "print", message: "true" },
			{ type: "print", message: "-73" },
			"finished",
		],
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
			{ type: "print", message: "false" },
			{ type: "print", message: "true" },
			{ type: "print", message: "true" },
			{ type: "print", message: "false" },
			{ type: "print", message: "-107" },
			"finished",
		],
	},

	// built-in types and their member functions
	{
		name: "type Null",
		description: "test the capabilities of type Null",
		code: `
			var n = Null();
			print(n == null);
		`,
		expectation: [{ type: "print", message: "true" }, "finished"],
	},
	{
		name: "type Boolean",
		description: "test the capabilities of type Boolean",
		code: `
			var t = Boolean(true);
			var f = Boolean(false);
			print(t == true and f == false);
		`,
		expectation: [{ type: "print", message: "true" }, "finished"],
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
		expectation: [{ type: "print", message: "true" }, "finished"],
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
			{ type: "print", message: "true" },
			{ type: "print", message: "true" },
			{ type: "print", message: "true" },
			"finished",
		],
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
			print(String.join([1,"a",true], "/"));
			var a = String(7);
			var b = String(7.5);
			var c = String(5:10);
			print(a + b + c);
		`,
		expectation: [
			{ type: "print", message: "11" },
			{ type: "print", message: "2" },
			{ type: "print", message: "9" },
			{ type: "print", message: "[Hello,World]" },
			{ type: "print", message: "ABC" },
			{ type: "print", message: "1/a/true" },
			{ type: "print", message: "77.55:10" },
			"finished",
		],
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
			{ type: "print", message: "[4,6,8,10,12]" },
			{ type: "print", message: "5" },
			{ type: "print", message: "6" },
			{ type: "print", message: "6" },
			{ type: "print", message: "14" },
			{ type: "print", message: "15" },
			{ type: "print", message: "15" },
			{ type: "print", message: "[4,6,8,99,10,12]" },
			{ type: "print", message: "[4,99,10,12]" },
			{ type: "print", message: "[4,10,12,99]" },
			{ type: "print", message: "0:4" },
			{ type: "print", message: "[4,10,12,99]" },
			{
				type: "print",
				message: "[4,10,12,99,null,false,true,[],{},5:10]",
			},
			"finished",
		],
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
			{ type: "print", message: "{a:4,b:6,c:8,x:10,y:12}" },
			{ type: "print", message: "5" },
			{ type: "print", message: "6" },
			{ type: "print", message: "10" },
			{ type: "print", message: "true" },
			{ type: "print", message: "false" },
			{ type: "print", message: "5" },
			{ type: "print", message: "false" },
			{ type: "print", message: "[a,b,c,x,y]" },
			{ type: "print", message: "[4,6,8,10,12]" },
			{
				type: "print",
				message:
					"{a:4,b:6,c:8,x:null,y:false,z:true,foo:[],bar:{},r:5:10}",
			},
			"finished",
		],
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
			{ type: "print", message: "5" },
			{ type: "print", message: "true" },
			{ type: "print", message: "false" },
			{ type: "print", message: "9" },
			{ type: "print", message: "9" },
			"finished",
		],
	},
	{
		name: "type Range",
		description: "test the capabilities of type Range",
		code: `
			var a = 5:15;
			var b = 15:5;
			var c = -2^31:2147483647;
			print(a);
			print(a.size());
			print(a.begin());
			print(a.end());
			print(Type(a.size()) == Real);
			print(Type(a.begin()) == Integer);
			print(Type(a.end()) == Integer);
			print(a[2]);
			print(a[2:6]);
			print(b);
			print(b.size());
			print(b.begin());
			print(b.end());
			print(a == Range(5, 15));
			print(c.size());
			print(Type(c.size()) == Real);
		`,
		expectation: [
			{ type: "print", message: "5:15" },
			{ type: "print", message: "10" },
			{ type: "print", message: "5" },
			{ type: "print", message: "15" },
			{ type: "print", message: "true" },
			{ type: "print", message: "true" },
			{ type: "print", message: "true" },
			{ type: "print", message: "7" },
			{ type: "print", message: "7:11" },
			{ type: "print", message: "15:5" },
			{ type: "print", message: "0" },
			{ type: "print", message: "15" },
			{ type: "print", message: "5" },
			{ type: "print", message: "true" },
			{ type: "print", message: "4294967295" },
			{ type: "print", message: "true" },
			"finished",
		],
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
			{ type: "print", message: "<Type Array>" },
			{ type: "print", message: "true" },
			{ type: "print", message: "false" },
			{ type: "print", message: "<Type Function>" },
			{ type: "print", message: "<Type Function>" },
			{ type: "print", message: "<Type Type>" },
			{ type: "print", message: "[5,6,7]" },
			{ type: "print", message: "<Type B>" },
			{ type: "print", message: "<Type A>" },
			{ type: "print", message: "<Type A>" },
			{ type: "print", message: "true" },
			{ type: "print", message: "true" },
			{ type: "print", message: "false" },
			{ type: "print", message: "false" },
			{ type: "print", message: "false" },
			{ type: "print", message: "false" },
			{ type: "print", message: "true" },
			{ type: "print", message: "false" },
			{ type: "print", message: "false" },
			{ type: "print", message: "true" },
			{ type: "print", message: "true" },
			"finished",
		],
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
			{ type: "print", message: "1" },
			{ type: "print", message: "1" },
			{ type: "print", message: "2" },
			{ type: "print", message: "2" },
			{ type: "print", message: "1" },
			{ type: "print", message: "2" },
			{ type: "print", message: "1" },
			{ type: "print", message: "2" },
			{ type: "print", message: "2" },
			"finished",
		],
	},
	{
		name: "namespaces",
		description: "test multiple declarations of the same namespace",
		code: `
			namespace N { var a = 1; }
			namespace N { var b = 2; }
			print(N.a);
			print(N.b);
		`,
		expectation: [
			{ type: "print", message: "1" },
			{ type: "print", message: "2" },
			"finished",
		],
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
			{ type: "print", message: "3" },
			{ type: "print", message: "9" },
			{ type: "print", message: "9" },
			{ type: "print", message: "120" },
			"finished",
		],
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
			{ type: "print", message: "6" },
			{ type: "print", message: "7" },
			{ type: "print", message: "8" },
			{ type: "print", message: "3 3 3" },
			{ type: "print", message: "42" },
			{ type: "print", message: "43" },
			"finished",
		],
	},
	{
		name: "access modifiers 1",
		description: "test access to private members",
		code: `
			class A
			{
			private:
				var a = 1;
				static var b = 2;
			protected:
				var c = 3;
				static var d = 4;
			public:
				var e = 5;
				static var f = 6;
			}

			print(A.a);
		`,
		expectation: [
			{ type: "error", href: "#/errors/name/ne-12" },
			"parsing failed",
		],
	},
	{
		name: "access modifiers 2",
		description: "test access to static private members",
		code: `
			class A
			{
			private:
				var a = 1;
				static var b = 2;
			protected:
				var c = 3;
				static var d = 4;
			public:
				var e = 5;
				static var f = 6;
			}

			print(A.b);
		`,
		expectation: [
			{ type: "error", href: "#/errors/name/ne-12" },
			"parsing failed",
		],
	},
	{
		name: "access modifiers 3",
		description: "test access to protected members",
		code: `
			class A
			{
			private:
				var a = 1;
				static var b = 2;
			protected:
				var c = 3;
				static var d = 4;
			public:
				var e = 5;
				static var f = 6;
			}

			print(A.c);
		`,
		expectation: [
			{ type: "error", href: "#/errors/name/ne-12" },
			"parsing failed",
		],
	},
	{
		name: "access modifiers 4",
		description: "test access to static protected members",
		code: `
			class A
			{
			private:
				var a = 1;
				static var b = 2;
			protected:
				var c = 3;
				static var d = 4;
			public:
				var e = 5;
				static var f = 6;
			}

			print(A.d);
		`,
		expectation: [
			{ type: "error", href: "#/errors/name/ne-12" },
			"parsing failed",
		],
	},
	{
		name: "access modifiers 5",
		description: "test access to public members",
		code: `
			class A
			{
			private:
				var a = 1;
				static var b = 2;
			protected:
				var c = 3;
				static var d = 4;
			public:
				var e = 5;
				static var f = 6;
			}

			var a = A();
			print(a.e);
			print(a.f);
			print(A.f);
		`,
		expectation: [
			{ type: "print", message: "5" },
			{ type: "print", message: "6" },
			{ type: "print", message: "6" },
			"finished",
		],
	},

	// constants
	{
		name: "constants",
		description: "test constants",
		code: `
			function func(a=2, b=3+3, c=4*4, d=5//5, e=6/7, f=7%5, g=2^8) { }
			class A
			{
			public:
				constructor(x=1/7) { }
				var a = func;
				var b = 0:10;
				var c = 1+2*3^4;
				var d = null;
				var e = false;
				var f = true;
				var g = 3.14159;
				var h = -3.14159;
				var i = "foo";
				var j = "foo" + "bar";
				var k = "foo" + 7;
				var l = math.sqrt;
				var m = Boolean;
				var n = A;
			}
		`,
		expectation: ["finished"],
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
		expectation: [{ type: "print", message: "a" }, "finished"],
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
			{ type: "print", message: "a" },
			{ type: "error", href: "#/errors/user/ue-1" },
			"error",
		],
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
			{ type: "print", message: "a" },
			{ type: "error", href: "#/errors/user/ue-2" },
			"error",
		],
	},
	{
		name: "same",
		description: "test function same",
		code: `
			var n = null;
			var m = n;
			var i = 10;
			var j = i;
			var a = [];
			var b = a;
			class C { public: var x; }
			var c1 = C(), c2 = C();
			c1.x = []; c2.x = c1.x;
			print(same(n, m));
			print(same(n, null));
			print(same(i, j));
			print(same(i, 10));
			print(same(a, b));
			print(same(a, []));
			print(same(c1, c1));
			print(same(c1, c2));
			print(same(c1.x, c2.x));
		`,
		expectation: [
			{ type: "print", message: "true" },
			{ type: "print", message: "false" },
			{ type: "print", message: "true" },
			{ type: "print", message: "false" },
			{ type: "print", message: "true" },
			{ type: "print", message: "false" },
			{ type: "print", message: "true" },
			{ type: "print", message: "false" },
			{ type: "print", message: "true" },
			"finished",
		],
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
			{
				type: "print",
				message: "[type,major,minor,patch,day,month,year,full]",
			},
			{ type: "print", message: Version.full() },
			"finished",
		],
	},
	{
		name: "print",
		description: "test function print",
		code: `
			print(42);
		`,
		expectation: [{ type: "print", message: "42" }, "finished"],
	},
	{
		name: "alert",
		description: "test function alert",
		code: `
			alert(42);
		`,
		expectation: [{ type: "alert", message: "42" }, "finished"],
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
			{ type: "confirm", message: "foo" },
			{ type: "print", message: "true" },
			{ type: "confirm", message: "bar" },
			{ type: "print", message: "false" },
			"finished",
		],
	},
	{
		name: "prompt",
		description: "test function prompt",
		code: `
			print(prompt("foo"));
		`,
		input: ["bar"],
		expectation: [
			{ type: "prompt", message: "foo" },
			{ type: "print", message: "bar" },
			"finished",
		],
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
		expectation: ["finished"],
	},
	{
		name: "time",
		description: "test function time",
		code: `
			var t = time();
			if t < 1555252000000.0 or t > 3000000000000.0 then print("implausible");
		`,
		expectation: ["finished"],
	},
	{
		name: "exists",
		description: "test function exists",
		code: `
			if exists("implausible-filename-19fe94e375c0b0a1749ad05f") then print("implausible");
		`,
		expectation: ["finished"],
	},
	{
		name: "load and save",
		description: "test functions load and save",
		code: `
			save("unittest-data", {a:3,b:3.5});
			var d = load("unittest-data");
			print(d);
		`,
		expectation: [{ type: "print", message: "{a:3,b:3.5}" }, "finished"],
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
			print(deepcopy([math.sin, 3:7]));
		`,
		expectation: [
			{ type: "print", message: "{a:3,b:[4,{c:false}]}" },
			{ type: "print", message: "{a:3,b:[4,{c:true}]}" },
			{ type: "print", message: "[<Function math.sin>,3:7]" },
			"finished",
		],
	},
	{
		name: "listKeys",
		description: "test function listKeys",
		code: `
			print(Type(listKeys()));
		`,
		expectation: [{ type: "print", message: "<Type Array>" }, "finished"],
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
			{ type: "print", message: "tick" },
			{ type: "print", message: "tick" },
			{ type: "print", message: "tick" },
			{ type: "print", message: "bye" },
			"finished",
		],
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
			{ type: "print", message: "A" },
			{ type: "print", message: "a" },
			"finished",
		],
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
		name: "canvas error handling, case 1",
		description: "test of canvas argument validity checks",
		code: `
			class A {}
			var a = A();
			canvas.transform([a, a], [a, a]);
		`,
		expectation: [
			{ type: "error", href: "#/errors/argument-mismatch/am-1" },
			"error",
		],
	},
	{
		name: "canvas error handling, case 2",
		description: "test of canvas argument validity checks",
		code: `
			class A {}
			var a = A();
			canvas.curve([a], false);
		`,
		expectation: [
			{ type: "error", href: "#/errors/argument-mismatch/am-1" },
			"error",
		],
	},
	{
		name: "canvas error handling, case 3",
		description: "test of canvas argument validity checks",
		code: `
			class A {}
			var a = A();
			canvas.fillArea([a]);
		`,
		expectation: [
			{ type: "error", href: "#/errors/argument-mismatch/am-1" },
			"error",
		],
	},
	{
		name: "canvas error handling, case 4",
		description: "test of canvas argument validity checks",
		code: `
			class A {}
			var a = A();
			canvas.frameArea([a]);
		`,
		expectation: [
			{ type: "error", href: "#/errors/argument-mismatch/am-1" },
			"error",
		],
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
		events: [
			{
				name: "canvas.keydown",
				type: "canvas.KeyboardEvent",
				attr: {
					key: "ArrowLeft",
					shift: false,
					control: true,
					alt: false,
					meta: false,
				},
			},
		],
		expectation: [
			{ type: "print", message: "ArrowLeft" },
			{ type: "print", message: "control" },
			"finished",
		],
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
		events: [
			{
				name: "canvas.keyup",
				type: "canvas.KeyboardEvent",
				attr: {
					key: "ArrowLeft",
					shift: false,
					control: true,
					alt: false,
					meta: false,
				},
			},
		],
		expectation: [
			{ type: "print", message: "ArrowLeft" },
			{ type: "print", message: "control" },
			"finished",
		],
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
		events: [
			{
				name: "canvas.mousedown",
				type: "canvas.MouseButtonEvent",
				attr: {
					x: 50,
					y: 25,
					button: 0,
					buttons: [true, false, false],
					shift: false,
					control: true,
					alt: false,
					meta: false,
				},
			},
		],
		expectation: [
			{ type: "print", message: "50,25" },
			{ type: "print", message: "0" },
			{ type: "print", message: "[true,false,false]" },
			{ type: "print", message: "control" },
			"finished",
		],
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
		events: [
			{
				name: "canvas.mouseup",
				type: "canvas.MouseButtonEvent",
				attr: {
					x: 50,
					y: 25,
					button: 0,
					buttons: [true, false, false],
					shift: false,
					control: true,
					alt: false,
					meta: false,
				},
			},
		],
		expectation: [
			{ type: "print", message: "50,25" },
			{ type: "print", message: "0" },
			{ type: "print", message: "[true,false,false]" },
			{ type: "print", message: "control" },
			"finished",
		],
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
		events: [
			{
				name: "canvas.mousemove",
				type: "canvas.MouseMoveEvent",
				attr: {
					x: 50,
					y: 25,
					buttons: [true, false, false],
					shift: false,
					control: true,
					alt: false,
					meta: false,
				},
			},
		],
		expectation: [
			{ type: "print", message: "50,25" },
			{ type: "print", message: "[true,false,false]" },
			{ type: "print", message: "control" },
			"finished",
		],
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
		events: [
			{
				name: "canvas.mouseout",
				type: "Null",
				attr: {},
			},
		],
		expectation: [{ type: "print", message: "null" }, "finished"],
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
		events: [
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
			{ type: "print", message: "50" },
			{ type: "print", message: "25" },
			"finished",
		],
	},
	{
		name: "audio 1",
		description: "checks if the audio object rejects invalid samples",
		code: `
			audio.Sound([[1,0,-1,0,1,"hello",-1,0,1]], 48000);
		`,
		expectation: [
			{ type: "error", href: "#/errors/argument-mismatch/am-1" },
			"error",
		],
	},
	{
		name: "audio 2",
		description:
			"checks if the stereo audio object insists on equal buffer sizes",
		code: `
			audio.Sound([[0.1, 0.2, 0.3], [-0.1, -0.2]], 48000);
		`,
		expectation: [
			{ type: "error", href: "#/errors/argument-mismatch/am-44" },
			"error",
		],
	},
	{
		name: "audio 3",
		description:
			"checks if the sound complains about an empty array of channels",
		code: `
			audio.Sound([], 48000);
		`,
		expectation: [
			{ type: "error", href: "#/errors/argument-mismatch/am-44c" },
			"error",
		],
	},
	{
		name: "audio 4",
		description:
			"checks if sound can be constructed from a resource string",
		code: `
			var mp3 = "data:audio/mpeg;base64,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AQAAAaQAAAAgAAA0gAAABKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqv/7FGThj/AAAGkAAAAIAAANIAAAAQAAAaQAAAAgAAA0gAAABKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqv/7FGThj/AAAGkAAAAIAAANIAAAAQAAAaQAAAAgAAA0gAAABKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqv/7FGThj/AAAGkAAAAIAAANIAAAAQAAAaQAAAAgAAA0gAAABKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqv/7FGThj/AAAGkAAAAIAAANIAAAAQAAAaQAAAAgAAA0gAAABKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqv/7FGThj/AAAGkAAAAIAAANIAAAAQAAAaQAAAAgAAA0gAAABKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqv/7FGThj/AAAGkAAAAIAAANIAAAAQAAAaQAAAAgAAA0gAAABKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqv/7FGThj/AAAGkAAAAIAAANIAAAAQAAAaQAAAAgAAA0gAAABKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqg==";
			var sound = audio.Sound(mp3);
			sound.play();
		`,
		expectation: ["finished"],
	},
	//	{
	//		name: "audio 5",
	//		description: "checks if the audio object rejects invalid sample rates",
	//		code: `
	//			audio.Sound([[1,0,-1,0,1,0,-1,0,1]], 7999);
	//		`,
	//		expectation: [
	//			{ type: "error", href: "#/errors/argument-mismatch/am-44b" },
	//			"error",
	//		],
	//	},
	{
		name: "range size limits",
		description:
			"checks that ranges may only have a size representable by an integer",
		code: `
		Range(-2, 2147483646);
		`,
		expectation: [
			{ type: "error", href: "#/errors/argument-mismatch/am-45" },
			"error",
		],
	},

	// hoisting
	{
		name: "hoisting of variables",
		description:
			"checks that variables cannot be accessed before they are declared",
		code: `
		print(a);
		var a = 0;
		`,
		expectation: [
			{ type: "error", href: "#/errors/name/ne-5" },
			"parsing failed",
		],
	},
	{
		name: "hoisting of functions",
		description:
			"checks that functions can be accessed before they are declared",
		code: `
		f("foo");
		function f(s) { print(s); }
		f("bar");
		`,
		expectation: [
			{ type: "print", message: "foo" },
			{ type: "print", message: "bar" },
			"finished",
		],
	},
	{
		name: "hoisting of classes",
		description:
			"checks that classes can be accessed before they are declared",
		code: `
		var obj = C();
		print(obj.v);
		class C {
		public:
			var v = 13;
		}
		`,
		expectation: [{ type: "print", message: "13" }, "finished"],
	},
	{
		name: "hoisting of names inside of classes",
		description:
			"checks that names inside of classes can be accessed before they are declared",
		code: `
		class C {
		public:
			function p() { print(v); }
		private:
			var v = 13;
		}
		var obj = C();
		obj.p();
		`,
		expectation: [{ type: "print", message: "13" }, "finished"],
	},
	{
		name: "hoisting of namespaces",
		description:
			"checks that namespaces can be accessed before they are declared",
		code: `
		N.p();
		from N use p as q;
		q();
		namespace N {
			function p() { print(13); }
		}
		`,
		expectation: [
			{ type: "print", message: "13" },
			{ type: "print", message: "13" },
			"finished",
		],
	},
	{
		name: "hoisting of variables declared in namespaces (case 1)",
		description:
			"checks that variables cannot be accessed before they are declared, even when declared inside of a (hoisted) namespace",
		code: `
		print(N.v);
		namespace N {
			var v = 13;
		}
		`,
		expectation: [
			{ type: "error", href: "#/errors/name/ne-5" },
			"parsing failed",
		],
	},
	{
		name: "hoisting of variables declared in namespaces (case 2)",
		description:
			"checks that variables cannot be accessed before they are declared, even when declared inside of a (hoisted) namespace",
		code: `
		use namespace N;
		print(v);
		namespace N {
			var v = 13;
		}
		`,
		expectation: [
			{ type: "error", href: "#/errors/name/ne-5" },
			"parsing failed",
		],
	},
	{
		name: "hoisting of variables declared in namespaces (case 3)",
		description:
			"checks that variables cannot be accessed before they are declared, even when declared inside of a (hoisted) namespace",
		code: `
		from N use v;
		print(v);
		namespace N {
			var v = 13;
		}
		`,
		expectation: [
			{ type: "error", href: "#/errors/name/ne-5" },
			"parsing failed",
		],
	},
	{
		name: "hoisting of variables declared in namespaces (case 4)",
		description:
			"checks that variables cannot be accessed before they are declared, even when declared inside of a (hoisted) namespace",
		code: `
		use N.v;
		print(v);
		namespace N {
			var v = 13;
		}
		`,
		expectation: [
			{ type: "error", href: "#/errors/name/ne-5" },
			"parsing failed",
		],
	},
	{
		name: "invalid variable access through function hoisting, case 1",
		description:
			"runtime check that values are valid, which can be violated through function hoisting",
		code: `
		f();
		var v = 7;
		function f() { print(v); }
		`,
		expectation: [{ type: "error", href: "#/errors/name/ne-29" }, "error"],
	},
	{
		name: "invalid variable access through function hoisting, case 2",
		description:
			"runtime check that values are valid, which can be violated through class hoisting",
		code: `
		f();
		var v = 7;
		function f() { v = 8; }
		`,
		expectation: [{ type: "error", href: "#/errors/name/ne-29" }, "error"],
	},
	{
		name: "invalid variable access through class hoisting, case 1",
		description:
			"runtime check that values are valid, which can be violated through class hoisting",
		code: `
		var obj = C();
		print(obj.s);

		class C
		{
		public:
			static var s = 42;
		};
		`,
		expectation: [{ type: "error", href: "#/errors/name/ne-29" }, "error"],
	},
	{
		name: "invalid variable access through class hoisting, case 2",
		description:
			"runtime check that values are valid, which can be violated through class hoisting",
		code: `
		var obj = C();
		obj.s = 42;

		class C
		{
		public:
			static var s = 42;
		};
		`,
		expectation: [{ type: "error", href: "#/errors/name/ne-29" }, "error"],
	},

	// syntax errors
	{
		name: "se-1",
		description: "test of syntax error 1",
		code: `
			var r = 1.23E*88;
		`,
		expectation: [
			{ type: "error", href: "#/errors/syntax/se-1" },
			"parsing failed",
		],
	},
	{
		name: "se-2",
		description: "test of syntax error 2",
		code: `
			var s = "hello;
		`,
		expectation: [
			{ type: "error", href: "#/errors/syntax/se-2" },
			"parsing failed",
		],
	},
	{
		name: "se-3",
		description: "test of syntax error 3",
		code: `
			var s = "hello\\u20world";
		`,
		expectation: [
			{ type: "error", href: "#/errors/syntax/se-3" },
			"parsing failed",
		],
	},
	{
		name: "se-4",
		description: "test of syntax error 4",
		code: `
			var s = "hello\\yworld";
		`,
		expectation: [
			{ type: "error", href: "#/errors/syntax/se-4" },
			"parsing failed",
		],
	},
	{
		name: "se-5",
		description: "test of syntax error 5",
		code: `
			@;
		`,
		expectation: [
			{ type: "error", href: "#/errors/syntax/se-5" },
			"parsing failed",
		],
	},
	{
		name: "se-6",
		description: "test of syntax error 6",
		code: `
			var a = super.a;
		`,
		expectation: [
			{ type: "error", href: "#/errors/syntax/se-6" },
			"parsing failed",
		],
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
			{ type: "error", href: "#/errors/syntax/se-7" },
			"parsing failed",
		],
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
			{ type: "error", href: "#/errors/syntax/se-8" },
			"parsing failed",
		],
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
			{ type: "error", href: "#/errors/syntax/se-9" },
			"parsing failed",
		],
	},
	{
		name: "se-10-1",
		description: "test of syntax error 10, case 1",
		code: `
			var i;
			for "i" in 0:10 do { }
		`,
		expectation: [
			{ type: "error", href: "#/errors/syntax/se-10" },
			"parsing failed",
		],
	},
	{
		name: "se-10-2",
		description: "test of syntax error 10, case 2",
		code: `
			class A { }
			class B : "A" { }
		`,
		expectation: [
			{ type: "error", href: "#/errors/syntax/se-10" },
			"parsing failed",
		],
	},
	{
		name: "se-10-3",
		description: "test of syntax error 10, case 3",
		code: `
			use "print" as p;
		`,
		expectation: [
			{ type: "error", href: "#/errors/syntax/se-10" },
			"parsing failed",
		],
	},
	{
		name: "se-10-4",
		description: "test of syntax error 10, case 4",
		code: `
			from canvas use "width";
		`,
		expectation: [
			{ type: "error", href: "#/errors/syntax/se-10" },
			"parsing failed",
		],
	},
	{
		name: "se-10-5",
		description: "test of syntax error 10, case 5",
		code: `
			namespace A { namespace B { var x; } }
			from A use namespace "B";
		`,
		expectation: [
			{ type: "error", href: "#/errors/syntax/se-10" },
			"parsing failed",
		],
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
			{ type: "error", href: "#/errors/syntax/se-13" },
			"parsing failed",
		],
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
			{ type: "error", href: "#/errors/syntax/se-14" },
			"parsing failed",
		],
	},
	{
		name: "se-15",
		description: "test of syntax error 15",
		code: `
			math.atan2(1, 2];
		`,
		expectation: [
			{ type: "error", href: "#/errors/syntax/se-15" },
			"parsing failed",
		],
	},
	{
		name: "se-16",
		description: "test of syntax error 16",
		code: `
			13();
		`,
		expectation: [
			{ type: "error", href: "#/errors/syntax/se-16" },
			"parsing failed",
		],
	},
	{
		name: "se-21",
		description: "test of syntax error 21",
		code: `
			var a;
			+a = 3;
		`,
		expectation: [
			{ type: "error", href: "#/errors/syntax/se-21" },
			"parsing failed",
		],
	},
	{
		name: "se-22",
		description: "test of syntax error 22",
		code: `
			var a = (3 + 4;
		`,
		expectation: [
			{ type: "error", href: "#/errors/syntax/se-22" },
			"parsing failed",
		],
	},
	{
		name: "se-23",
		description: "test of syntax error 23",
		code: `
			var a = 2147483648;
		`,
		expectation: [
			{ type: "error", href: "#/errors/syntax/se-23" },
			"parsing failed",
		],
	},
	{
		name: "se-24",
		description: "test of syntax error 24",
		code: `
			var a = [1, 2, 3;
		`,
		expectation: [
			{ type: "error", href: "#/errors/syntax/se-24" },
			"parsing failed",
		],
	},
	{
		name: "se-25",
		description: "test of syntax error 25",
		code: `
			var a = []
		`,
		expectation: [
			{ type: "error", href: "#/errors/syntax/se-25" },
			"parsing failed",
		],
	},
	{
		name: "se-26",
		description: "test of syntax error 26",
		code: `
			var a = {x: 8, y: 9, y: 10};
		`,
		expectation: [
			{ type: "error", href: "#/errors/syntax/se-26" },
			"parsing failed",
		],
	},
	{
		name: "se-27",
		description: "test of syntax error 27",
		code: `
			var a = {x: 8, y: 9;
		`,
		expectation: [
			{ type: "error", href: "#/errors/syntax/se-27" },
			"parsing failed",
		],
	},
	{
		name: "se-28",
		description: "test of syntax error 28",
		code: `
			var a = {x: 8, y: 9,
		`,
		expectation: [
			{ type: "error", href: "#/errors/syntax/se-28" },
			"parsing failed",
		],
	},
	{
		name: "se-29",
		description: "test of syntax error 29",
		code: `
			var a = {x: 8, y: 9, z
		`,
		expectation: [
			{ type: "error", href: "#/errors/syntax/se-29" },
			"parsing failed",
		],
	},
	{
		name: "se-30",
		description: "test of syntax error 30",
		code: `
			var a = {x: 8, y: 9, z: 10}
		`,
		expectation: [
			{ type: "error", href: "#/errors/syntax/se-30" },
			"parsing failed",
		],
	},
	{
		name: "se-31",
		description: "test of syntax error 31",
		code: `
			var a, b;
			var f = function[a, b (x){};
		`,
		expectation: [
			{ type: "error", href: "#/errors/syntax/se-31" },
			"parsing failed",
		],
	},
	{
		name: "se-32",
		description: "test of syntax error 32",
		code: `
			var a;
			var f = function[for](x){};
		`,
		expectation: [
			{ type: "error", href: "#/errors/syntax/se-32" },
			"parsing failed",
		],
	},
	{
		name: "se-33",
		description: "test of syntax error 33",
		code: `
			function f(for) {}
		`,
		expectation: [
			{ type: "error", href: "#/errors/syntax/se-33" },
			"parsing failed",
		],
	},
	{
		name: "se-35",
		description: "test of syntax error 35",
		code: `
			var f = function {};
		`,
		expectation: [
			{ type: "error", href: "#/errors/syntax/se-35" },
			"parsing failed",
		],
	},
	{
		name: "se-36",
		description: "test of syntax error 36",
		code: `
			function f;
		`,
		expectation: [
			{ type: "error", href: "#/errors/syntax/se-36" },
			"parsing failed",
		],
	},
	{
		name: "se-37",
		description: "test of syntax error 37",
		code: `
			function f(a;
		`,
		expectation: [
			{ type: "error", href: "#/errors/syntax/se-37" },
			"parsing failed",
		],
	},
	{
		name: "se-38",
		description: "test of syntax error 38",
		code: `
			function f(a = math.sqrt(2)) {};
		`,
		expectation: [
			{ type: "error", href: "#/errors/syntax/se-38" },
			"parsing failed",
		],
	},
	{
		name: "se-40",
		description: "test of syntax error 40",
		code: `
			function f();
		`,
		expectation: [
			{ type: "error", href: "#/errors/syntax/se-40" },
			"parsing failed",
		],
	},
	{
		name: "se-41",
		description: "test of syntax error 41",
		code: `
			var a = 2 * do;
		`,
		expectation: [
			{ type: "error", href: "#/errors/syntax/se-41" },
			"parsing failed",
		],
	},
	{
		name: "se-42",
		description: "test of syntax error 42",
		code: `
			var a = 2 * ;
		`,
		expectation: [
			{ type: "error", href: "#/errors/syntax/se-42" },
			"parsing failed",
		],
	},
	{
		name: "se-43a",
		description: "test of syntax error 43 (case 1)",
		code: `
			var a;
			var b = a.do;
		`,
		expectation: [
			{ type: "error", href: "#/errors/syntax/se-43" },
			"parsing failed",
		],
	},
	{
		name: "se-43b",
		description: "test of syntax error 43 (case 1)",
		code: `
			namespace A
			{
				var a;
			}
			var b = A.7;
		`,
		expectation: [
			{ type: "error", href: "#/errors/syntax/se-43" },
			"parsing failed",
		],
	},
	{
		name: "se-44",
		description: "test of syntax error 44",
		code: `
			var a;
			var b = a[7;
		`,
		expectation: [
			{ type: "error", href: "#/errors/syntax/se-44" },
			"parsing failed",
		],
	},
	{
		name: "se-47-1",
		description: "test of syntax error 47, case 1",
		code: `
			var a = this;
		`,
		expectation: [
			{ type: "error", href: "#/errors/syntax/se-47" },
			"parsing failed",
		],
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
			{ type: "error", href: "#/errors/syntax/se-47" },
			"parsing failed",
		],
	},
	{
		name: "se-48",
		description: "test of syntax error 48",
		code: `
			var a;
			a = 4
		`,
		expectation: [
			{ type: "error", href: "#/errors/syntax/se-48" },
			"parsing failed",
		],
	},
	{
		name: "se-49",
		description: "test of syntax error 49",
		code: `
			print 4;
		`,
		expectation: [
			{ type: "error", href: "#/errors/syntax/se-49" },
			"parsing failed",
		],
	},
	{
		name: "se-50",
		description: "test of syntax error 50",
		code: `
			var d, do;
		`,
		expectation: [
			{ type: "error", href: "#/errors/syntax/se-50" },
			"parsing failed",
		],
	},
	{
		name: "se-51",
		description: "test of syntax error 51",
		code: `
			var d do
		`,
		expectation: [
			{ type: "error", href: "#/errors/syntax/se-51" },
			"parsing failed",
		],
	},
	{
		name: "se-51b",
		description: "test of syntax error 51b",
		code: `
			var d = 5 do
		`,
		expectation: [
			{ type: "error", href: "#/errors/syntax/se-51b" },
			"parsing failed",
		],
	},
	{
		name: "se-52",
		description: "test of syntax error 52",
		code: `
			function do() {}
		`,
		expectation: [
			{ type: "error", href: "#/errors/syntax/se-52" },
			"parsing failed",
		],
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
			{ type: "error", href: "#/errors/syntax/se-53" },
			"parsing failed",
		],
	},
	{
		name: "se-54",
		description: "test of syntax error 54",
		code: `
			class do {}
		`,
		expectation: [
			{ type: "error", href: "#/errors/syntax/se-54" },
			"parsing failed",
		],
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
			{ type: "error", href: "#/errors/syntax/se-55" },
			"parsing failed",
		],
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
			{ type: "error", href: "#/errors/syntax/se-56" },
			"parsing failed",
		],
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
			{ type: "error", href: "#/errors/syntax/se-57" },
			"parsing failed",
		],
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
			{ type: "error", href: "#/errors/syntax/se-58" },
			"parsing failed",
		],
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
			{ type: "error", href: "#/errors/syntax/se-59" },
			"parsing failed",
		],
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
			{ type: "error", href: "#/errors/syntax/se-59b" },
			"parsing failed",
		],
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
			{ type: "error", href: "#/errors/syntax/se-60" },
			"parsing failed",
		],
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
			{ type: "error", href: "#/errors/syntax/se-61" },
			"parsing failed",
		],
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
			{ type: "error", href: "#/errors/syntax/se-62" },
			"parsing failed",
		],
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
			{ type: "error", href: "#/errors/syntax/se-62" },
			"parsing failed",
		],
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
			{ type: "error", href: "#/errors/syntax/se-63" },
			"parsing failed",
		],
	},
	{
		name: "se-64",
		description: "test of syntax error 64",
		code: `
			namespace do {}
		`,
		expectation: [
			{ type: "error", href: "#/errors/syntax/se-64" },
			"parsing failed",
		],
	},
	{
		name: "se-65",
		description: "test of syntax error 65",
		code: `
			from math;
		`,
		expectation: [
			{ type: "error", href: "#/errors/syntax/se-65" },
			"parsing failed",
		],
	},
	{
		name: "se-66",
		description: "test of syntax error 66",
		code: `
			use namespace math as mathematics;
		`,
		expectation: [
			{ type: "error", href: "#/errors/syntax/se-66" },
			"parsing failed",
		],
	},
	{
		name: "se-67",
		description: "test of syntax error 67",
		code: `
			use math.sqrt as do;
		`,
		expectation: [
			{ type: "error", href: "#/errors/syntax/se-67" },
			"parsing failed",
		],
	},
	{
		name: "se-68",
		description: "test of syntax error 68",
		code: `
			use namespace math
			for 0:10 do print("hello");
		`,
		expectation: [
			{ type: "error", href: "#/errors/syntax/se-68" },
			"parsing failed",
		],
	},
	{
		name: "se-69",
		description: "test of syntax error 69",
		code: `
			if 3 < 4 print("smaller");
		`,
		expectation: [
			{ type: "error", href: "#/errors/syntax/se-69" },
			"parsing failed",
		],
	},
	{
		name: "se-70",
		description: "test of syntax error 70",
		code: `
			for var "x" in 0:10 do print("x");
		`,
		expectation: [
			{ type: "error", href: "#/errors/syntax/se-70" },
			"parsing failed",
		],
	},
	{
		name: "se-71",
		description: "test of syntax error 71",
		code: `
			for var x do print("x");
		`,
		expectation: [
			{ type: "error", href: "#/errors/syntax/se-71" },
			"parsing failed",
		],
	},
	{
		name: "se-72",
		description: "test of syntax error 72",
		code: `
			for var x in 0:10 print("x");
		`,
		expectation: [
			{ type: "error", href: "#/errors/syntax/se-72" },
			"parsing failed",
		],
	},
	{
		name: "se-73",
		description: "test of syntax error 73",
		code: `
			var a;
			for a print("x");
		`,
		expectation: [
			{ type: "error", href: "#/errors/syntax/se-73" },
			"parsing failed",
		],
	},
	{
		name: "se-74",
		description: "test of syntax error 74",
		code: `
			do print("x"); until false;
			for 0:10 do print("y");
		`,
		expectation: [
			{ type: "error", href: "#/errors/syntax/se-74" },
			"parsing failed",
		],
	},
	{
		name: "se-75",
		description: "test of syntax error 75",
		code: `
			do print("x"); while true
			for 0:10 do print("y");
		`,
		expectation: [
			{ type: "error", href: "#/errors/syntax/se-75" },
			"parsing failed",
		],
	},
	{
		name: "se-76",
		description: "test of syntax error 76",
		code: `
			while true print("x");
		`,
		expectation: [
			{ type: "error", href: "#/errors/syntax/se-76" },
			"parsing failed",
		],
	},
	{
		name: "se-77",
		description: "test of syntax error 77",
		code: `
			break;
		`,
		expectation: [
			{ type: "error", href: "#/errors/syntax/se-77" },
			"parsing failed",
		],
	},
	{
		name: "se-78",
		description: "test of syntax error 78",
		code: `
			continue;
		`,
		expectation: [
			{ type: "error", href: "#/errors/syntax/se-78" },
			"parsing failed",
		],
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
			{ type: "error", href: "#/errors/syntax/se-79" },
			"parsing failed",
		],
	},
	{
		name: "se-80",
		description: "test of syntax error 80",
		code: `
			{ return 42; }
		`,
		expectation: [
			{ type: "error", href: "#/errors/syntax/se-80" },
			"parsing failed",
		],
	},
	{
		name: "se-81",
		description: "test of syntax error 81",
		code: `
			function f()
			{ return 42 }
		`,
		expectation: [
			{ type: "error", href: "#/errors/syntax/se-81" },
			"parsing failed",
		],
	},
	{
		name: "se-81b",
		description: "test of syntax error 81b",
		code: `
			for var i in 0:10 do break
			print("foo");
		`,
		expectation: [
			{ type: "error", href: "#/errors/syntax/se-81b" },
			"parsing failed",
		],
	},
	{
		name: "se-81c",
		description: "test of syntax error 81c",
		code: `
			for var i in 0:10 do continue
			print("foo");
		`,
		expectation: [
			{ type: "error", href: "#/errors/syntax/se-81c" },
			"parsing failed",
		],
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
			{ type: "error", href: "#/errors/syntax/se-82" },
			"parsing failed",
		],
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
			{ type: "error", href: "#/errors/syntax/se-84" },
			"parsing failed",
		],
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
			{ type: "error", href: "#/errors/syntax/se-85" },
			"parsing failed",
		],
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
			{ type: "error", href: "#/errors/syntax/se-86" },
			"parsing failed",
		],
	},
	{
		name: "se-87",
		description: "test of syntax error 87",
		code: `
			throw "uargh"
			print("uargh");
		`,
		expectation: [
			{ type: "error", href: "#/errors/syntax/se-87" },
			"parsing failed",
		],
	},
	{
		name: "se-88",
		description: "test of syntax error 88",
		code: `
			}
		`,
		expectation: [
			{ type: "error", href: "#/errors/syntax/se-88" },
			"parsing failed",
		],
	},
	{
		name: "se-89",
		description: "test of syntax error 89",
		code: `
			for 0:10 do var a = 5;
		`,
		expectation: [
			{ type: "error", href: "#/errors/syntax/se-89" },
			"parsing failed",
		],
	},
	{
		name: "se-90",
		description: "test of syntax error 90",
		code: `
			*5;
		`,
		expectation: [
			{ type: "error", href: "#/errors/syntax/se-90" },
			"parsing failed",
		],
	},

	{
		name: "se-91",
		description: "test of syntax error 91",
		code: `
			include 42;
		`,
		expectation: [
			{ type: "error", href: "#/errors/syntax/se-91" },
			"parsing failed",
		],
	},
	{
		name: "se-92",
		description: "test of syntax error 92",
		code: `
			include "bla"
			var a = 42;
		`,
		expectation: [
			{ type: "error", href: "#/errors/syntax/se-92" },
			"parsing failed",
		],
	},

	// argument mismatch errors
	{
		name: "am-1-1",
		description: "test of argument mismatch error am-1, case 1",
		code: `
			var x = Boolean(1);
		`,
		expectation: [
			{ type: "error", href: "#/errors/argument-mismatch/am-1" },
			"error",
		],
	},
	{
		name: "am-1-2",
		description: "test of argument mismatch error am-1, case 2",
		code: `
			var x = Integer(4:10);
		`,
		expectation: [
			{ type: "error", href: "#/errors/argument-mismatch/am-1" },
			"error",
		],
	},
	{
		name: "am-1-3",
		description: "test of argument mismatch error am-1, case 3",
		code: `
			var x = "hello".find(3);
		`,
		expectation: [
			{ type: "error", href: "#/errors/argument-mismatch/am-1" },
			"error",
		],
	},
	{
		name: "am-2",
		description: "test of argument mismatch error am-2",
		code: `
			var x = not "hello";
		`,
		expectation: [
			{ type: "error", href: "#/errors/argument-mismatch/am-2" },
			"parsing failed",
		],
	},
	{
		name: "am-3",
		description: "test of argument mismatch error am-3",
		code: `
			var x = +true;
		`,
		expectation: [
			{ type: "error", href: "#/errors/argument-mismatch/am-3" },
			"parsing failed",
		],
	},
	{
		name: "am-4",
		description: "test of argument mismatch error am-4",
		code: `
			var x = -true;
		`,
		expectation: [
			{ type: "error", href: "#/errors/argument-mismatch/am-4" },
			"parsing failed",
		],
	},
	{
		name: "am-5",
		description: "test of argument mismatch error am-5",
		code: `
			var x = 5 + math.sqrt;
		`,
		expectation: [
			{ type: "error", href: "#/errors/argument-mismatch/am-5" },
			"parsing failed",
		],
	},
	{
		name: "am-6",
		description: "test of argument mismatch error am-6",
		code: `
			var x = 5 - math.sqrt;
		`,
		expectation: [
			{ type: "error", href: "#/errors/argument-mismatch/am-6" },
			"parsing failed",
		],
	},
	{
		name: "am-7",
		description: "test of argument mismatch error am-7",
		code: `
			var x = 5 * math.sqrt;
		`,
		expectation: [
			{ type: "error", href: "#/errors/argument-mismatch/am-7" },
			"parsing failed",
		],
	},
	{
		name: "am-8-1",
		description: "test of argument mismatch error am-8, case 1",
		code: `
			var x = 5 / math.sqrt;
		`,
		expectation: [
			{ type: "error", href: "#/errors/argument-mismatch/am-8" },
			"parsing failed",
		],
	},
	{
		name: "am-8-2",
		description: "test of argument mismatch error am-8, case 2",
		code: `
			var x = 5 // math.sqrt;
		`,
		expectation: [
			{ type: "error", href: "#/errors/argument-mismatch/am-8" },
			"parsing failed",
		],
	},
	{
		name: "am-9",
		description: "test of argument mismatch error am-9",
		code: `
			var x = 5 % math.sqrt;
		`,
		expectation: [
			{ type: "error", href: "#/errors/argument-mismatch/am-9" },
			"parsing failed",
		],
	},
	{
		name: "am-10",
		description: "test of argument mismatch error am-10",
		code: `
			var x = 5 ^ math.sqrt;
		`,
		expectation: [
			{ type: "error", href: "#/errors/argument-mismatch/am-10" },
			"parsing failed",
		],
	},
	{
		name: "am-11-1",
		description: "test of argument mismatch error am-11, case 1",
		code: `
			var x = 5 : 7.5;
		`,
		expectation: [
			{ type: "error", href: "#/errors/argument-mismatch/am-11" },
			"parsing failed",
		],
	},
	{
		name: "am-11-2",
		description: "test of argument mismatch error am-11, case 2",
		code: `
			var x = 5.5 : 8;
		`,
		expectation: [
			{ type: "error", href: "#/errors/argument-mismatch/am-11" },
			"parsing failed",
		],
	},
	{
		name: "am-12-1",
		description: "test of argument mismatch error am-12, case 1",
		code: `
			var x = true and 7;
		`,
		expectation: [
			{ type: "error", href: "#/errors/argument-mismatch/am-12" },
			"parsing failed",
		],
	},
	{
		name: "am-12-2",
		description: "test of argument mismatch error am-12, case 2",
		code: `
			var x = 6 and 9.25;
		`,
		expectation: [
			{ type: "error", href: "#/errors/argument-mismatch/am-12" },
			"parsing failed",
		],
	},
	{
		name: "am-12-3",
		description: "test of argument mismatch error am-12, case 3",
		code: `
			var x = 6.25 and 9;
		`,
		expectation: [
			{ type: "error", href: "#/errors/argument-mismatch/am-12" },
			"parsing failed",
		],
	},
	{
		name: "am-12-4",
		description: "test of argument mismatch error am-12, case 4",
		code: `
			var x = 6.25 or 9;
		`,
		expectation: [
			{ type: "error", href: "#/errors/argument-mismatch/am-12" },
			"parsing failed",
		],
	},
	{
		name: "am-12-5",
		description: "test of argument mismatch error am-12, case 5",
		code: `
			var x = 6.25 xor 9;
		`,
		expectation: [
			{ type: "error", href: "#/errors/argument-mismatch/am-12" },
			"parsing failed",
		],
	},
	{
		name: "am-13-1",
		description: "test of argument mismatch error am-13, case 1",
		code: `
			var x = Integer(Real.inf());
		`,
		expectation: [
			{ type: "error", href: "#/errors/argument-mismatch/am-13" },
			"error",
		],
	},
	{
		name: "am-13-2",
		description: "test of argument mismatch error am-13, case 2",
		code: `
			var x = Integer(-Real.inf());
		`,
		expectation: [
			{ type: "error", href: "#/errors/argument-mismatch/am-13" },
			"error",
		],
	},
	{
		name: "am-13-3",
		description: "test of argument mismatch error am-13, case 3",
		code: `
			var x = Integer(Real.nan());
		`,
		expectation: [
			{ type: "error", href: "#/errors/argument-mismatch/am-13" },
			"error",
		],
	},
	{
		name: "am-14-1",
		description: "test of argument mismatch error am-14, case 1",
		code: `
			var x = Integer("hello");
		`,
		expectation: [
			{ type: "error", href: "#/errors/argument-mismatch/am-14" },
			"error",
		],
	},
	{
		name: "am-14-2",
		description: "test of argument mismatch error am-14, case 2",
		code: `
			var x = Integer("");
		`,
		expectation: [
			{ type: "error", href: "#/errors/argument-mismatch/am-14" },
			"error",
		],
	},
	{
		name: "am-15-1",
		description: "test of argument mismatch error am-15, case 1",
		code: `
			var x = 1 // 0;
		`,
		expectation: [
			{ type: "error", href: "#/errors/argument-mismatch/am-15" },
			"parsing failed",
		],
	},
	{
		name: "am-15-2",
		description: "test of argument mismatch error am-15, case 2",
		code: `
			var x = 1 % 0;
		`,
		expectation: [
			{ type: "error", href: "#/errors/argument-mismatch/am-15" },
			"parsing failed",
		],
	},
	{
		name: "am-15-3",
		description: "test of argument mismatch error am-15, case 3",
		code: `
			var x = 0 // 0;
		`,
		expectation: [
			{ type: "error", href: "#/errors/argument-mismatch/am-15" },
			"parsing failed",
		],
	},
	{
		name: "am-15-4",
		description: "test of argument mismatch error am-15, case 4",
		code: `
			var x = 0 % 0;
		`,
		expectation: [
			{ type: "error", href: "#/errors/argument-mismatch/am-15" },
			"parsing failed",
		],
	},
	{
		name: "am-16-1",
		description: "test of argument mismatch error am-16, case 1",
		code: `
			var x = 0:3 < 1:4;
		`,
		expectation: [
			{ type: "error", href: "#/errors/argument-mismatch/am-16" },
			"parsing failed",
		],
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
			{ type: "error", href: "#/errors/argument-mismatch/am-16" },
			"error",
		],
	},
	{
		name: "am-16b",
		description: "test of argument mismatch error am-16b",
		code: `
			var x = "a" < 100;
		`,
		expectation: [
			{ type: "error", href: "#/errors/argument-mismatch/am-16b" },
			"parsing failed",
		],
	},
	{
		name: "am-17",
		description: "test of argument mismatch error am-17",
		code: `
			var x = Array(-2, null);
		`,
		expectation: [
			{ type: "error", href: "#/errors/argument-mismatch/am-17" },
			"error",
		],
	},
	{
		name: "am-18",
		description: "test of argument mismatch error am-18",
		code: `
			var x = [1,2,3];
			x.insert(5, null);
		`,
		expectation: [
			{ type: "error", href: "#/errors/argument-mismatch/am-18" },
			"error",
		],
	},
	{
		name: "am-18b",
		description: "test of argument mismatch error am-18b",
		code: `
			[].pop();
		`,
		expectation: [
			{ type: "error", href: "#/errors/argument-mismatch/am-18b" },
			"error",
		],
	},
	{
		name: "am-19",
		description: "test of argument mismatch error am-19",
		code: `
			[1,2,3].sort(function(a, b) { return "a"; });
		`,
		expectation: [
			{ type: "error", href: "#/errors/argument-mismatch/am-19" },
			"error",
		],
	},
	{
		name: "am-20",
		description: "test of argument mismatch error am-20",
		code: `
			var x = "hello"["s"];
		`,
		expectation: [
			{ type: "error", href: "#/errors/argument-mismatch/am-20" },
			"error",
		],
	},
	{
		name: "am-21",
		description: "test of argument mismatch error am-21",
		code: `
			var x = "hello"[-2];
		`,
		expectation: [
			{ type: "error", href: "#/errors/argument-mismatch/am-21" },
			"error",
		],
	},
	{
		name: "am-22",
		description: "test of argument mismatch error am-22",
		code: `
			var x = "hello"[7];
		`,
		expectation: [
			{ type: "error", href: "#/errors/argument-mismatch/am-22" },
			"error",
		],
	},
	{
		name: "am-23",
		description: "test of argument mismatch error am-23",
		code: `
			var x = [1,2,3][-2];
		`,
		expectation: [
			{ type: "error", href: "#/errors/argument-mismatch/am-23" },
			"error",
		],
	},
	{
		name: "am-24",
		description: "test of argument mismatch error am-24",
		code: `
			var x = [1,2,3][7];
		`,
		expectation: [
			{ type: "error", href: "#/errors/argument-mismatch/am-24" },
			"error",
		],
	},
	{
		name: "am-25",
		description: "test of argument mismatch error am-25",
		code: `
			var x = [1,2,3];
			x[1:3] = [4,5];
		`,
		expectation: [
			{ type: "error", href: "#/errors/argument-mismatch/am-25" },
			"error",
		],
	},
	{
		name: "am-26",
		description: "test of argument mismatch error am-26",
		code: `
			var x = [1,2,3]["a"];
		`,
		expectation: [
			{ type: "error", href: "#/errors/argument-mismatch/am-26" },
			"error",
		],
	},
	{
		name: "am-27",
		description: "test of argument mismatch error am-27",
		code: `
			var x = {a:3,b:5}["c"];
		`,
		expectation: [
			{ type: "error", href: "#/errors/argument-mismatch/am-27" },
			"error",
		],
	},
	{
		name: "am-28",
		description: "test of argument mismatch error am-28",
		code: `
			var x = {a:3,b:5}[33];
		`,
		expectation: [
			{ type: "error", href: "#/errors/argument-mismatch/am-28" },
			"error",
		],
	},
	{
		name: "am-29-1",
		description: "test of argument mismatch error am-29, case 1",
		code: `
			var x = (5:15)[-2];
		`,
		expectation: [
			{ type: "error", href: "#/errors/argument-mismatch/am-29" },
			"error",
		],
	},
	{
		name: "am-29-2",
		description: "test of argument mismatch error am-29, case 2",
		code: `
			var x = (5:15)[12];
		`,
		expectation: [
			{ type: "error", href: "#/errors/argument-mismatch/am-29" },
			"error",
		],
	},
	{
		name: "am-30",
		description: "test of argument mismatch error am-30",
		code: `
			var x = (5:15)["c"];
		`,
		expectation: [
			{ type: "error", href: "#/errors/argument-mismatch/am-30" },
			"error",
		],
	},
	{
		name: "am-31",
		description: "test of argument mismatch error am-31",
		code: `
			var y = 9.9;
			var x = y["c"];
		`,
		expectation: [
			{ type: "error", href: "#/errors/argument-mismatch/am-31" },
			"error",
		],
	},
	{
		name: "am-31b",
		description: "test of argument mismatch error am-31b",
		code: `
			var y = 9:19;
			y[2] = 0;
		`,
		expectation: [
			{ type: "error", href: "#/errors/argument-mismatch/am-31b" },
			"error",
		],
	},
	{
		name: "am-32-1",
		description: "test of argument mismatch error am-32, case 1",
		code: `
			var x;
			(x) = 0;
		`,
		expectation: [
			{ type: "error", href: "#/errors/argument-mismatch/am-32" },
			"parsing failed",
		],
	},
	{
		name: "am-32-2",
		description: "test of argument mismatch error am-32, case 2",
		code: `
			42 = 0;
		`,
		expectation: [
			{ type: "error", href: "#/errors/argument-mismatch/am-32" },
			"parsing failed",
		],
	},
	{
		name: "am-32-3",
		description: "test of argument mismatch error am-32, case 3",
		code: `
			math.sqrt = 0;
		`,
		expectation: [
			{ type: "error", href: "#/errors/argument-mismatch/am-32" },
			"parsing failed",
		],
	},
	{
		name: "am-32-4",
		description: "test of argument mismatch error am-32, case 4",
		code: `
			var x;
			math.sqrt(x) = 0;
		`,
		expectation: [
			{ type: "error", href: "#/errors/argument-mismatch/am-32" },
			"parsing failed",
		],
	},
	{
		name: "am-32-5",
		description: "test of argument mismatch error am-32, case 5",
		code: `
			Integer = 0;
		`,
		expectation: [
			{ type: "error", href: "#/errors/argument-mismatch/am-32" },
			"parsing failed",
		],
	},
	{
		name: "am-32-6",
		description: "test of argument mismatch error am-32, case 6",
		code: `
			var x = "hello";
			x[2] = 0;
		`,
		expectation: [
			{ type: "error", href: "#/errors/argument-mismatch/am-32" },
			"error",
		],
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
			{ type: "error", href: "#/errors/argument-mismatch/am-32" },
			"error",
		],
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
			{ type: "error", href: "#/errors/argument-mismatch/am-32" },
			"error",
		],
	},
	{
		name: "am-33",
		description: "test of argument mismatch error am-33",
		code: `
			if 1 then print("hello");
		`,
		expectation: [
			{ type: "error", href: "#/errors/argument-mismatch/am-33" },
			"error",
		],
	},
	{
		name: "am-34",
		description: "test of argument mismatch error am-34",
		code: `
			for 10 do print("hello");
		`,
		expectation: [
			{ type: "error", href: "#/errors/argument-mismatch/am-34" },
			"error",
		],
	},
	{
		name: "am-35",
		description: "test of argument mismatch error am-35",
		code: `
			function f() {};
			for f in 0:10 do print("hello");
		`,
		expectation: [
			{ type: "error", href: "#/errors/argument-mismatch/am-35" },
			"parsing failed",
		],
	},
	{
		name: "am-36",
		description: "test of argument mismatch error am-36",
		code: `
			var b = 1;
			do print("hello"); while b;
		`,
		expectation: [
			{ type: "print", message: "hello" },
			{ type: "error", href: "#/errors/argument-mismatch/am-36" },
			"error",
		],
	},
	{
		name: "am-37",
		description: "test of argument mismatch error am-37",
		code: `
			while 1 do print("hello");
		`,
		expectation: [
			{ type: "error", href: "#/errors/argument-mismatch/am-37" },
			"error",
		],
	},
	{
		name: "am-38",
		description: "test of argument mismatch error am-38",
		code: `
			var x = load("unittest-data-9rhgmq9k2lmyxlcjl249vfnx92vmpis");
		`,
		expectation: [
			{ type: "error", href: "#/errors/argument-mismatch/am-38" },
			"error",
		],
	},
	{
		name: "am-39-1",
		description: "test of argument mismatch error am-39, case 1",
		code: `
			var x = math.sqrt;
			save("unittest-data", x);
		`,
		expectation: [
			{ type: "error", href: "#/errors/argument-mismatch/am-39" },
			"error",
		],
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
			{ type: "error", href: "#/errors/argument-mismatch/am-39" },
			"error",
		],
	},
	{
		name: "am-40",
		description: "test of argument mismatch error am-40",
		code: `
			setEventHandler("invalid-event-name", function(event) {});
		`,
		expectation: [
			{ type: "error", href: "#/errors/argument-mismatch/am-40" },
			"error",
		],
	},
	{
		name: "am-41",
		description: "test of argument mismatch error am-41",
		code: `
			setEventHandler("timer", function() {});
		`,
		expectation: [
			{ type: "error", href: "#/errors/argument-mismatch/am-41" },
			"error",
		],
	},
	{
		name: "am-42-1",
		description: "test of argument mismatch error am-42, case 1",
		code: `
			var x = function[](){};
			var y = deepcopy(x);
		`,
		expectation: [
			{ type: "error", href: "#/errors/argument-mismatch/am-42" },
			"error",
		],
	},
	{
		name: "am-42-2",
		description: "test of argument mismatch error am-42, case 2",
		code: `
			var x = canvas.MouseMoveEvent();
			var y = deepcopy(x);
		`,
		expectation: [
			{ type: "error", href: "#/errors/argument-mismatch/am-42" },
			"error",
		],
	},
	{
		name: "am-42-3",
		description: "test of argument mismatch error am-42, case 3",
		code: `
			var x = [];
			x.push(x);
			var y = deepcopy(x);
		`,
		expectation: [
			{ type: "error", href: "#/errors/argument-mismatch/am-42" },
			"error",
		],
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
			{ type: "error", href: "#/errors/argument-mismatch/am-43" },
			"error",
		],
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
			{ type: "error", href: "#/errors/argument-mismatch/am-43" },
			"error",
		],
	},
	{
		name: "am-49-1",
		description: "test of argument mismatch error am-49, case 1",
		code: `
			canvas.circle(100, 100, -10);
		`,
		expectation: [
			{ type: "error", href: "#/errors/argument-mismatch/am-49" },
			"error",
		],
	},
	{
		name: "am-49-2",
		description: "test of argument mismatch error am-49, case 2",
		code: `
			canvas.fillCircle(100, 100, -10);
		`,
		expectation: [
			{ type: "error", href: "#/errors/argument-mismatch/am-49" },
			"error",
		],
	},
	{
		name: "am-49-3",
		description: "test of argument mismatch error am-49, case 3",
		code: `
			canvas.frameCircle(100, 100, -10);
		`,
		expectation: [
			{ type: "error", href: "#/errors/argument-mismatch/am-49" },
			"error",
		],
	},
	{
		name: "am-50-1",
		description: "test of argument mismatch error am-50, case 1",
		code: `
			class Bad : Boolean {
			public:
				constructor()
				: super(this)   # should raise the error
				{}
			}
			var x = Bad();
		`,
		expectation: [
			{ type: "error", href: "#/errors/argument-mismatch/am-50" },
			"error",
		],
	},
	{
		name: "am-50-2",
		description: "test of argument mismatch error am-50, case 2",
		code: `
			class Bad : Integer {
			public:
				constructor()
				: super(this)   # should raise the error
				{}
			}
			var x = Bad();
		`,
		expectation: [
			{ type: "error", href: "#/errors/argument-mismatch/am-50" },
			"error",
		],
	},
	{
		name: "am-50-3",
		description: "test of argument mismatch error am-50, case 3",
		code: `
			class Bad : Real {
			public:
				constructor()
				: super(this)   # should raise the error
				{}
			}
			var x = Bad();
		`,
		expectation: [
			{ type: "error", href: "#/errors/argument-mismatch/am-50" },
			"error",
		],
	},
	{
		name: "am-50-4",
		description: "test of argument mismatch error am-50, case 4",
		code: `
			class Bad : String {
			public:
				constructor()
				: super(this)   # should raise the error
				{}
			}
			var x = Bad();
		`,
		expectation: [
			{ type: "error", href: "#/errors/argument-mismatch/am-50" },
			"error",
		],
	},
	{
		name: "am-50-5",
		description: "test of argument mismatch error am-50, case 5",
		code: `
			class Bad : Array {
			public:
				constructor()
				: super(this)   # should raise the error
				{}
			}
			var x = Bad();
		`,
		expectation: [
			{ type: "error", href: "#/errors/argument-mismatch/am-50" },
			"error",
		],
	},
	{
		name: "am-50-6",
		description: "test of argument mismatch error am-50, case 6",
		code: `
			class Bad : Dictionary {
			public:
				constructor()
				: super(this)   # should raise the error
				{}
			}
			var x = Bad();
		`,
		expectation: [
			{ type: "error", href: "#/errors/argument-mismatch/am-50" },
			"error",
		],
	},
	{
		name: "am-50-7",
		description: "test of argument mismatch error am-50, case 7",
		code: `
			class Bad : Function {
			public:
				constructor()
				: super(this)   # should raise the error
				{}
			}
			var x = Bad();
		`,
		expectation: [
			{ type: "error", href: "#/errors/argument-mismatch/am-50" },
			"error",
		],
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
			{ type: "error", href: "#/errors/name/ne-1" },
			"parsing failed",
		],
	},
	{
		name: "ne-1-2",
		description: "test of name resolution error ne-1, case 2",
		code: `
			function f(x, y) {}
			f(x=1, x=2, y=3);
		`,
		expectation: [
			{ type: "error", href: "#/errors/name/ne-1" },
			"parsing failed",
		],
	},
	{
		name: "ne-2",
		description: "test of name resolution error ne-2",
		code: `
			function f(x, y) {}
			f(x=1, y=2, z=3);
		`,
		expectation: [
			{ type: "error", href: "#/errors/name/ne-2" },
			"parsing failed",
		],
	},
	{
		name: "ne-3",
		description: "test of name resolution error ne-3",
		code: `
			function f(x, y) {}
			f(1, 2, 3);
		`,
		expectation: [
			{ type: "error", href: "#/errors/name/ne-3" },
			"parsing failed",
		],
	},
	{
		name: "ne-4",
		description: "test of name resolution error ne-4",
		code: `
			function f(x, y, z) {}
			f(1, z=3);
		`,
		expectation: [
			{ type: "error", href: "#/errors/name/ne-4" },
			"parsing failed",
		],
	},
	{
		name: "ne-5-1",
		description: "test of name resolution error ne-5, case 1",
		code: `
			var a = b;
		`,
		expectation: [
			{ type: "error", href: "#/errors/name/ne-5" },
			"parsing failed",
		],
	},
	{
		name: "ne-5-2",
		description: "test of name resolution error ne-5, case 2",
		code: `
			var x = math.foobar;
		`,
		expectation: [
			{ type: "error", href: "#/errors/name/ne-5" },
			"parsing failed",
		],
	},
	{
		name: "ne-5-3",
		description: "test of name resolution error ne-5, case 3",
		code: `
			class A
			{
			}
			var x = A.a;
		`,
		expectation: [
			{ type: "error", href: "#/errors/name/ne-5" },
			"parsing failed",
		],
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
			{ type: "error", href: "#/errors/name/ne-6" },
			"parsing failed",
		],
	},
	{
		name: "ne-7-1",
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
			{ type: "error", href: "#/errors/name/ne-7" },
			"parsing failed",
		],
	},
	{
		name: "ne-7-2",
		description: "test of name resolution error ne-7",
		code: `
			for var a in ["a","a"] do
			{
				function foo()
				{
					print(a);
				}
				foo();
			}
		`,
		expectation: [
			{ type: "error", href: "#/errors/name/ne-7" },
			"parsing failed",
		],
	},
	{
		name: "ne-7-3",
		description: "test of name resolution error ne-7",
		code: `
			var f;
			{
			    var a = 42;
			    f = function() { print(a); };
			}
			f();
		`,
		expectation: [
			{ type: "error", href: "#/errors/name/ne-7" },
			"parsing failed",
		],
	},
	{
		name: "ne-7-4",
		description: "test of name resolution error ne-7",
		code: `
			namespace N {
				var a = "a";
				for var i in 0:2 do {
					function foo(){
						print(a);
					}
					foo();
				}
			}
		`,
		expectation: [
			{ type: "print", message: "a" },
			{ type: "print", message: "a" },
			"finished",
		],
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
			{ type: "error", href: "#/errors/name/ne-8" },
			"parsing failed",
		],
	},
	{
		name: "ne-11",
		description: "test of name resolution error ne-11",
		code: `
			var x = math;
		`,
		expectation: [
			{ type: "error", href: "#/errors/name/ne-11" },
			"parsing failed",
		],
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
		expectation: [{ type: "error", href: "#/errors/name/ne-13" }, "error"],
	},
	{
		name: "ne-14-1",
		description: "test of name resolution error ne-14, case 1",
		code: `
			var a;
			var a;
		`,
		expectation: [
			{ type: "error", href: "#/errors/name/ne-14" },
			"parsing failed",
		],
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
			{ type: "error", href: "#/errors/name/ne-14" },
			"parsing failed",
		],
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
			{ type: "error", href: "#/errors/name/ne-14" },
			"parsing failed",
		],
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
			{ type: "error", href: "#/errors/name/ne-14" },
			"parsing failed",
		],
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
			{ type: "error", href: "#/errors/name/ne-14" },
			"parsing failed",
		],
	},
	{
		name: "ne-15-1",
		description: "test of name resolution error ne-15, case 1",
		code: `
			function f() {}
			function f(x) {}
		`,
		expectation: [
			{ type: "error", href: "#/errors/name/ne-15" },
			"parsing failed",
		],
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
			{ type: "error", href: "#/errors/name/ne-15" },
			"parsing failed",
		],
	},
	{
		name: "ne-16-1",
		description: "test of name resolution error ne-16, case 1",
		code: `
			function f(x, x) {}
		`,
		expectation: [
			{ type: "error", href: "#/errors/name/ne-16" },
			"parsing failed",
		],
	},
	{
		name: "ne-16-2",
		description: "test of name resolution error ne-16, case 2",
		code: `
			var a;
			var f = function[x=a](x) {};
		`,
		expectation: [
			{ type: "error", href: "#/errors/name/ne-16" },
			"parsing failed",
		],
	},
	{
		name: "ne-17",
		description: "test of name resolution error ne-17",
		code: `
			var a, b;
			var f = function[x=a,x=b]() {};
		`,
		expectation: [
			{ type: "error", href: "#/errors/name/ne-17" },
			"parsing failed",
		],
	},
	{
		name: "ne-18",
		description: "test of name resolution error ne-18",
		code: `
			namespace A {}
			class A {}
		`,
		expectation: [
			{ type: "error", href: "#/errors/name/ne-18" },
			"parsing failed",
		],
	},
	{
		name: "ne-19",
		description: "test of name resolution error ne-19",
		code: `
			class A {}
			namespace A {}
		`,
		expectation: [
			{ type: "error", href: "#/errors/name/ne-19" },
			"parsing failed",
		],
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
			{ type: "error", href: "#/errors/name/ne-21" },
			"parsing failed",
		],
	},
	{
		name: "ne-22",
		description: "test of name resolution error ne-22",
		code: `
			var B = 42;
			class A : B {}
		`,
		expectation: [
			{ type: "error", href: "#/errors/name/ne-22" },
			"parsing failed",
		],
	},
	{
		name: "ne-23",
		description: "test of name resolution error ne-23",
		code: `
			var a;
			use namespace a;
		`,
		expectation: [
			{ type: "error", href: "#/errors/name/ne-23" },
			"parsing failed",
		],
	},
	{
		name: "ne-24",
		description: "test of name resolution error ne-24",
		code: `
			var sqrt;
			use namespace math;
		`,
		expectation: [
			{ type: "error", href: "#/errors/name/ne-24" },
			"parsing failed",
		],
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
			{ type: "error", href: "#/errors/name/ne-25" },
			"parsing failed",
		],
	},
	{
		name: "ne-26",
		description: "test of name resolution error ne-26",
		code: `
			class A : A { }
		`,
		expectation: [
			{ type: "error", href: "#/errors/name/ne-26" },
			"parsing failed",
		],
	},
	{
		name: "ne-28",
		description: "test of name resolution error ne-28",
		code: `
			class A { public: var k; }
			var a = A();
			for a.k in 0:5 do print("Hello World");
		`,
		expectation: [
			{ type: "error", href: "#/errors/name/ne-28" },
			"parsing failed",
		],
	},
	{
		name: "ne-29",
		description: "test of name resolution error ne-29",
		code: `
			var x = math.sqrt(x);
		`,
		expectation: [{ type: "error", href: "#/errors/name/ne-29" }, "error"],
	},
	{
		name: "ne-30",
		description: "test of name resolution error ne-30",
		code: `
			class A
			{
			public:
				function f()
				{ print("Hello"); }
			}
			A.f();
		`,
		expectation: [
			{ type: "error", href: "#/errors/name/ne-30" },
			"parsing failed",
		],
	},

	// logic errors
	{
		name: "le-1",
		description: "test of logic error le-1",
		code: `
			function f() { f(); }
			f();
		`,
		expectation: [{ type: "error", href: "#/errors/logic/le-1" }, "error"],
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
		events: [
			{
				name: "canvas.keydown",
				type: "canvas.KeyboardEvent",
				attr: {
					key: "ArrowLeft",
					shift: false,
					control: true,
					alt: false,
					meta: false,
				},
			},
		],
		expectation: [{ type: "error", href: "#/errors/logic/le-2" }, "error"],
	},
	{
		name: "le-3",
		description: "test of logic error le-3",
		code: `
			quitEventMode();
		`,
		expectation: [{ type: "error", href: "#/errors/logic/le-3" }, "error"],
	},

	// user errors
	// do not test ue-1 and ue-2, they were tested already with the corresponding core functions
	{
		name: "ue-3",
		description: "test of user error ue-3",
		code: `
			throw "foo";
		`,
		expectation: [{ type: "error", href: "#/errors/user/ue-3" }, "error"],
	},

	test_lattice_craft,

	// Checking internal errors is inherently impossible, and quite meaningless.
	// Therefore we don't have unit tests for them.
];
