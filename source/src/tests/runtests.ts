import { ErrorHelper } from "../errors/ErrorHelper";
import { Typeid } from "../helpers/typeIds";
import { Interpreter } from "../interpreter/interpreter";
import { Parser } from "../parse/parser";
import { TScript } from "../tscript";
import { Version } from "../version";
import { tests } from "./tests";

export function runTests(outerContainer){
	let container = document.createElement('div');
	//append the expected doc
	outerContainer.style.overflow = "auto";
	outerContainer.style.display = "flex";
	outerContainer.style.flexDirection="column-reverse";
	outerContainer.append(container);
	container.innerHTML = `
	<style>
		table
		{
			margin: 5px auto 5px auto;
			border-collapse: collapse;
			display: table;
		}
		th
		{
			border: 2px solid #854;
			background: #aaf;
			font-weight: bold;
			padding: 1ex;
			text-align: center;
		}
		td
		{
			border: 2px solid #558;
			padding: 1ex;
			text-align: center;
		}
		.narrow
		{
			width: 180px;
			max-width: 180px;
			text-align: center;
		}
		.wide
		{
			width: calc(32vw - 120px);
			max-width: calc(32vw - 120px);
			text-align: left;
			overflow: hidden;
		}
		</style>
	<h1>TScript Unit Tests</h1>
	<p id="version"></p>
	<p id="status" style="background: #000; color: #fff; padding: 10px;">starting unit tests</p>
	<table id="results">
		<tr>
			<th class="narrow">status</th>
			<th class="narrow">name</th>
			<th class="wide">desciption</th>
			<th class="wide">result</th>
			<th class="wide">expectation</th>
		</tr>
	</table>
	`;

	let start = Date.now();
	(document.getElementById("version") as any).innerText = Version.full();

	// loop over an array of unit tests
	let testindex = 0;
	let passed = 0;
	let failed = 0;
	function runtest()
	{
		let status:any = document.getElementById("status");
		if (testindex >= tests.length)
		{
			//scroll to top is strange code because of css;
			outerContainer.scrollTo(0,-outerContainer.scrollHeight)

			let finish = Date.now();
			let testsPlural = function testsPlural(n) { return n + (n != 1 ? " tests" : " test"); }
			status.innerText = testsPlural(testindex) + " completed in "
					+ (finish - start) / 1000.0
					+ " seconds; " + testsPlural(passed) + " passed, " + testsPlural(failed) + " failed.";
			if(failed > 0){
				status.style.color = "#FF0000"
			}
			return;
		}
		status.innerText = "Running test " + (testindex + 1) + " out of " + tests.length + " ...";

		let test = tests[testindex];

		let timeout = test.hasOwnProperty("timeout") ? (test as any).timeout : 10.0;
		let input:any = test.hasOwnProperty("input") ? test.input : [];
		let events:any = test.hasOwnProperty("events") ? test.events : [];

		// record of events
		let result = new Array();
		let interpreter:any = null;

		// report the result and transition to the next test
		function reportFailed(status, result, expectation)
		{
			let r = "", e = "";
			if (typeof result == "string")
			{
				let div = document.createElement('div');
				div.appendChild(document.createTextNode(result));
				r = "<pre>" + div.innerHTML + "</pre>";
			}
			if (typeof expectation == "string")
			{
				let div = document.createElement('div');
				div.appendChild(document.createTextNode(expectation));
				e = "<pre>" + div.innerHTML + "</pre>";
			}
			let table:any = document.getElementById("results");
			let tr = document.createElement("tr");
			tr.style.background = "#faa";
			tr.innerHTML = "<td class=\"narrow\">" + status + "</td>"
			             + "<td class=\"narrow\">" + test.name + "</td>"
			             + "<td class=\"wide\">" + (test.hasOwnProperty("description") ? test.description : "") + "</td>"
			             + "<td class=\"wide\">" + r + "</td>"
			             + "<td class=\"wide\">" + e + "</td>";
			if (result instanceof HTMLElement)
			{
				result.style.width = "200px";
				result.style.height = "200px";
				tr.children[3].appendChild(result);
			}
			if (expectation instanceof HTMLElement)
			{
				expectation.style.width = "200px";
				expectation.style.height = "200px";
				tr.children[4].appendChild(expectation);
			}
			table.appendChild(tr);
			testindex++;
			failed++;
			window.setTimeout(runtest, 1);
		}
		function reportPassed()
		{
			if (input.length > 0)
			{
				reportFailed("excess input", input, []);
				return;
			}

			let table:any = document.getElementById("results");
			let tr = document.createElement("tr");
			tr.style.background = "#afa";
			tr.innerHTML = "<tr style=\"background: #afa;\">"
			             + "<td class=\"narrow\">passed</td>"
			             + "<td class=\"narrow\">" + test.name + "</td>"
			             + "<td class=\"wide\">" + (test.hasOwnProperty("description") ? test.description : "") + "</td>";
			table.appendChild(tr);
			testindex++;
			passed++;
			window.setTimeout(runtest, 1);
		}

		function trunc(s)
		{
			let lines = s.split('\n');
			let ret = "";
			for (let i=0; i<lines.length; i++)
			{
				if (i > 0) ret += '\n';
				ret += lines[i].trim();
			}
			return ret;
		}

		// check the result against the expectation
		function check(result, expectation)
		{
			if (expectation.hasOwnProperty("type"))
			{
				if (expectation.type == "turtle")
				{
					if (! interpreter) { reportFailed("failed", result, trunc(expectation.js)); return; }

					// test turtle graphics output
					let canvas = document.createElement("canvas");
					canvas.width = 600;
					canvas.height = 600;
					let context:any = canvas.getContext("2d");
					{
						let run = function run(code)
						{ eval(code); }
						run(expectation.js);
					}
					let pix1 = context.getImageData(0, 0, 600, 600).data;
					let pix2 = interpreter.service.turtle.dom.getContext("2d").getImageData(0, 0, 600, 600).data;
					if (pix1.length != pix2.length) reportFailed("incompatible canvas size", pix1.length, pix2.length);
					for (let i=0; i<pix1.length; i++)
					{
						if (Math.abs(pix1[i] - pix2[i]) > 10) { reportFailed("failed", interpreter.service.turtle.dom, canvas); return; }
					}
					reportPassed();
				}
				else if (expectation.type == "canvas")
				{
					if (! interpreter) { reportFailed("failed", result, trunc(expectation.js)); return; }

					// test canvas graphics output
					let canvas = document.createElement("canvas");
					canvas.width = 600;
					canvas.height = 600;
					let context:any = canvas.getContext("2d");
					{
						let run = function run(code)
						{ eval(code); }
						run(expectation.js);
					}
					let pix1 = context.getImageData(0, 0, 600, 600).data;
					let pix2 = interpreter.service.canvas.dom.getContext("2d").getImageData(0, 0, 600, 600).data;
					if (pix1.length != pix2.length) reportFailed("incompatible canvas size", pix1.length, pix2.length);
					for (let i=0; i<pix1.length; i++)
					{
						if (Math.abs(pix1[i] - pix2[i]) > 10) { reportFailed("failed", interpreter.service.canvas.dom, canvas); return; }
					}
					reportPassed();
				}
				else throw "internal error: unknown expectation type";
			}
			else
			{
				// test for a sequence of events
				let sr = JSON.stringify(result, null, 2);
				let se = JSON.stringify(expectation, null, 2);
				if (sr == se)
				{
					reportPassed();
				}
				else
				{
					reportFailed("failed", sr, se);
				}
			}
		}

		// run the parser
		let c:any = null;
		try
		{
			c = Parser.parse(test.code);
		}
		catch (ex)
		{
			reportFailed("exception in parser", ex, "");
			return;
		}
		if (c.errors !== null && c.errors.length > 0)
		{
			for (let i=0; i<c.errors.length; i++)
			{
				let err = c.errors[i];
				result.push({type: "error", href: err.href});
			}
			result.push("parsing failed");
			check(result, test.expectation);
			return;
		}

		// prepare the interpreter
		interpreter = new Interpreter(c.program);
		interpreter.service.documentation_mode = false;
		interpreter.service.print = (function(msg) { result.push({type: "print", message: msg}); });
		interpreter.service.alert = (function(msg) { result.push({type: "alert", message: msg}); });
		interpreter.service.confirm = (function(msg)
				{
					result.push({type: "confirm", message: msg});
					let b = input.shift();
					ErrorHelper.assert(b === true || b === false, "simulated user input is not a boolean");
					return b;
				});
		interpreter.service.prompt = (function(msg)
				{
					result.push({type: "prompt", message: msg});
					let s = input.shift();
					ErrorHelper.assert(typeof s == "string", "simulated user input is not a string");
					return s;
				});
		interpreter.service.message = (function(msg, line, ch, href) { result.push({type: "error", href: href}); });
		interpreter.service.turtle.dom = document.createElement("canvas");
		interpreter.service.turtle.dom.width = 600;
		interpreter.service.turtle.dom.height = 600;
		interpreter.service.canvas.dom = document.createElement("canvas");
		interpreter.service.canvas.dom.width = 600;
		interpreter.service.canvas.dom.height = 600;
		interpreter.eventnames["canvas.resize"] = true;
		interpreter.eventnames["canvas.mousedown"] = true;
		interpreter.eventnames["canvas.mouseup"] = true;
		interpreter.eventnames["canvas.mousemove"] = true;
		interpreter.eventnames["canvas.mouseout"] = true;
		interpreter.eventnames["canvas.keydown"] = true;
		interpreter.eventnames["canvas.keyup"] = true;
		interpreter.eventnames["timer"] = true;
		interpreter.reset();

		// setup a control loop
		let stoptime = Date.now() + 1000 * timeout;
		let controller = function()
		{
			if (Date.now() > stoptime)
			{
				// timeout!
				interpreter.stopthread();
				reportFailed("timeout", "exceeded the timeout of " + timeout + " seconds", "");
				return;
			}

			if (interpreter.status == "finished" || interpreter.status == "error")
			{
				// the program has finished
				result.push(interpreter.status);
				check(result, test.expectation);
				interpreter.stopthread();
				return;
			}
			else if (interpreter.status == "running" || interpreter.status == "waiting")
			{
				if (interpreter.eventmode && events.length > 0)
				{
					// construct an event object from a json description
					let desc:any = events.shift();
					let eventname = desc["name"];
					let typename = desc["type"];
					let type:any = null;
					for (let i=0; i<interpreter.program.types.length; i++)
					{
						if (TScript.displayname(interpreter.program.types[i]) == typename)
						{
							type = interpreter.program.types[i];
							break;
						}
					}
					if (type === null) { reportFailed("unknown event type", typename, ""); return; }
					let attr = new Array();
					let n = type.members.length;
					for (let i=0; i<n; i++) attr.push({"type": interpreter.program.types[Typeid.typeid_null], "value": {"b": null}});
					for (let key in desc.attr)
					{
						if (! desc.attr.hasOwnProperty(key)) continue;
						if (! type.members.hasOwnProperty(key)) { reportFailed("unknown event attribute", typename + "." + key, ""); return; }
						let m = type.members[key];
						if (m.petype != "attribute") { reportFailed("unknown event attribute", typename + "." + key, ""); return; }
						attr[m.id] = TScript.json2typed.call(interpreter, desc.attr[key]);
					}
					let event = { type: type, value: {a: attr, b: null} };

					// enqueue an event
					interpreter.enqueueEvent(eventname, event);
				}
			}

			// loop...
			window.setTimeout(controller, 10);
		};

		// run the program
		interpreter.run();
		// and the control loop
		window.setTimeout(controller, 0);
	};
	window.setTimeout(runtest, 1);
}