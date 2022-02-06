import { Version } from "../version";
import { TestRunner } from "./testRunner";
import { tests } from "./tests";

export function runTests(outerContainer) {
	let container = document.createElement("div");
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
		<tr id="th">
			<th class="narrow">status</th>
			<th class="narrow">name</th>
			<th class="wide">desciption</th>
			<th class="wide">result</th>
			<th class="wide">expectation</th>
		</tr>
	</table>
	`;

	(document.getElementById("version") as any).innerText = Version.full();
	let th: any = document.getElementById("th");

	let passed = 0;
	let failed = 0;

	let status: any = document.getElementById("status");

	function setStatus() {
		let testsPlural = function testsPlural(n) {
			return n + (n != 1 ? " tests" : " test");
		};
		status.innerText =
			testsPlural(passed) +
			" passed, " +
			testsPlural(failed) +
			" failed.";
		if (failed > 0) {
			status.style.color = "#FF0000";
		}
		if (passed == tests.length) {
			status.style.color = "#00FF00";
		}
	}

	function reportPassed(test) {
		let table: any = document.getElementById("results");
		let tr = document.createElement("tr");
		tr.style.background = "#afa";
		tr.innerHTML =
			'<tr style="background: #afa;">' +
			'<td class="narrow">passed</td>' +
			'<td class="narrow">' +
			test.name +
			"</td>" +
			'<td class="wide">' +
			(test.hasOwnProperty("description") ? test.description : "") +
			"</td>";
		table.appendChild(tr);
		passed++;
		setStatus();
	}

	function reportFailed(test, ex) {
		let result, expectation;
		if (typeof ex === "string") {
			result = ex;
			expectation = "";
		} else {
			[result, expectation] = ex;
		}

		let r = "",
			e = "";
		if (typeof result == "string") {
			let div = document.createElement("div");
			div.appendChild(document.createTextNode(result));
			r = "<pre>" + div.innerHTML + "</pre>";
		}
		if (typeof expectation == "string") {
			let div = document.createElement("div");
			div.appendChild(document.createTextNode(expectation));
			e = "<pre>" + div.innerHTML + "</pre>";
		}
		let table: any = document.getElementById("results");
		let tr = document.createElement("tr");
		tr.style.background = "#faa";
		tr.innerHTML =
			'<td class="narrow">failed</td>' +
			'<td class="narrow">' +
			test.name +
			"</td>" +
			'<td class="wide">' +
			(test.hasOwnProperty("description") ? test.description : "") +
			"</td>" +
			'<td class="wide">' +
			r +
			"</td>" +
			'<td class="wide">' +
			e +
			"</td>";
		if (result instanceof HTMLElement) {
			result.style.width = "200px";
			result.style.height = "200px";
			tr.children[3].appendChild(result);
		}
		if (expectation instanceof HTMLElement) {
			expectation.style.width = "200px";
			expectation.style.height = "200px";
			tr.children[4].appendChild(expectation);
		}
		//table.prepend(tr);
		th.parentNode.insertBefore(tr, th.nextSibling);
		failed++;
		setStatus();
	}

	let cb = {
		fail: reportFailed,
		suc: reportPassed,
	};

	tests.forEach((test) => {
		TestRunner.runTest(test, cb, true);
	});
}
