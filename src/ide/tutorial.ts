"use strict";

//import { ErrorHelper } from "../lang/errors/ErrorHelper";
import { tgui } from "./tgui";
import { doc } from "./doc";
import { evaluation } from "../eval";
import { tutorialData } from "../tutorial";

import CodeMirror from "codemirror";

// CodeMirror Addons
import "codemirror/addon/selection/active-line";
import "codemirror/addon/comment/comment";
import "codemirror/addon/dialog/dialog";
import "codemirror/addon/dialog/dialog.css";
import "codemirror/addon/search/jump-to-line";
import "codemirror/addon/search/search";
import "codemirror/addon/search/searchcursor";
import "codemirror/addon/edit/matchbrackets";
import "codemirror/addon/edit/closebrackets";
import "./codemirror-tscriptmode";

///////////////////////////////////////////////////////////
// TScript tutorial
//

export const tutorial = (function () {
	let module: any = {};
	module.data = tutorialData;
	module.state = {
		unit: 0,
		section: 0,
		completed: {},
	};
	module.dom = null;
	module.getCode = null;
	module.clearErrorMessage = null;
	module.showErrorMessage = null;

	// store the current state in localStorage
	function storeState() {
		let s = JSON.stringify(module.state);
		localStorage.setItem("tutorial", s);
	}

	// get the last processed section of the unit plus 1
	function findCanonicalSection(unit) {
		let ret = 0;
		for (let j = 0; j < module.data[unit].sections.length; j++) {
			ret = j;
			if (
				(module.data[unit].sections[j].correct ||
					module.data[unit].sections[j].tests) &&
				!module.state.completed[unit + ":" + j]
			)
				break;
		}
		return ret;
	}

	//	// Check whether the code fulfills the task specification.
	//	// Return null on success, and an error description otherwise.
	//	function check(task, code) : any
	//	{
	//		// TODO: more complete check with unit tests, marker, etc
	//		let events1 = evaluation.run_tscript(code);
	//		let events2 = evaluation.run_tscript(task.correct);
	//		let result = evaluation.compare_runs(events1, events2);
	//		if (result[0] == "" && result[1] == "") return null;
	//		else return {
	//				message: result[0],
	//				html: result[1],
	//			};
	//	}

	// Display the current tutorial unit. This is where most of the
	// logic is, including testing and error reporting for programming
	// tasks.
	function display() {
		if (module.state.unit < 0) {
			// overview page
			module.dom.innerHTML = "";
			tgui.createElement({
				type: "h1",
				parent: module.dom,
				text: "Table of Contents",
			});
			let list = tgui.createElement({ type: "ol", parent: module.dom });
			for (let i = 0; i < module.data.length; i++) {
				let status = "";
				let missing = 0,
					completed = 0;
				for (let j = 0; j < module.data[i].sections.length; j++) {
					if (module.state.completed[i + ":" + j]) completed++;
					else if (
						module.data[i].sections[j].correct ||
						module.data[i].sections[j].tests
					)
						missing++;
				}
				if (completed > 0)
					status = missing > 0 ? " (started)" : " (completed)";

				let title = module.data[i].title;
				tgui.createElement({
					type: "li",
					parent: list,
					classname: "tutorial-toc",
					text: title + status,
					click: function (event) {
						module.state.unit = i;
						module.state.section = findCanonicalSection(i);
						storeState();
						display();
					},
				});
			}

			// reset button, useful at least for software testing
			if (Object.keys(module.state.completed).length > 0) {
				tgui.createElement({
					type: "button",
					classname:
						"tgui-modal-default-button tutorial-reset-button",
					parent: module.dom,
					text: "reset progress",
					click: function (event) {
						tgui.msgBox({
							title: "Reset Progress",
							prompt: "Resetting marks all programming tasks in the tutorial as unsolved.\nAre you sure?",
							buttons: [
								{
									text: "Yes",
									onClick: (event) => {
										module.state.completed = {};
										storeState();
										display();
									},
								},
								{ text: "No" },
							],
						});
					},
				});
			}
		} else {
			// content page
			module.dom.innerHTML = "";

			// "table of contents" button
			tgui.createElement({
				type: "button",
				classname: "tgui-modal-default-button tutorial-home-button",
				parent: module.dom,
				text: "table of contents",
				click: function (event) {
					module.state.unit = -1;
					module.state.section = null;
					storeState();
					display();
				},
			});

			// heading
			tgui.createElement({
				type: "h1",
				parent: module.dom,
				text: module.data[module.state.unit].title,
			});

			// add the "reference solution" button
			function addReferenceButton(correct, parent) {
				if (!correct) return;
				tgui.createElement({
					type: "button",
					classname: "tgui-modal-default-button tutorial-nav-button",
					parent: parent,
					text: "reference solution",
					style: { width: "160px" },
					click: (function (correct) {
						return function (event) {
							let dlg = tgui.createModal({
								title: "reference solution",
								scalesize: [0.6, 0.6],
								minsize: [400, 250],
								buttons: [{ text: "Close" }],
							});

							let textarea = tgui.createElement({
								type: "textarea",
								parent: dlg.content,
								properties: {
									rows: "20",
									cols: "50",
									value: correct,
								},
							});
							let cm = CodeMirror.fromTextArea(textarea, {
								gutters: [
									"CodeMirror-linenumbers",
									"breakpoints",
								],
								lineNumbers: true,
								matchBrackets: true,
								styleActiveLine: true,
								mode: "text/tscript",
								indentUnit: 4,
								tabSize: 4,
								indentWithTabs: true,
								extraKeys: {
									"Ctrl-Up": "scrollUp",
									"Ctrl-Down": "scrollDown",
								},
							});
							cm.setOption("readOnly", true);

							window.setTimeout(function () {
								cm.refresh();
							}, 20);
							tgui.startModal(dlg);
						};
					})(correct),
				});
			}

			// content sections
			for (let i = 0; i <= module.state.section; i++) {
				let content =
					module.data[module.state.unit].sections[i].content;
				content = doc.prepare(content, true);
				tgui.createElement({
					type: "div",
					parent: module.dom,
					html: content,
				});
				if (i < module.state.section) {
					addReferenceButton(
						module.data[module.state.unit].sections[i].correct,
						module.dom
					);
				}
			}

			// navigation elements
			let error = tgui.createElement({
				type: "div",
				parent: module.dom,
			});
			let nav = tgui.createElement({
				type: "div",
				classname: "tutorial-nav",
				parent: module.dom,
			});
			let d =
				module.data[module.state.unit].sections[module.state.section];
			if (d.correct || d.test) {
				tgui.createElement({
					type: "button",
					classname: "tgui-modal-default-button tutorial-nav-button",
					parent: nav,
					text: "solve task",
					click: function (event) {
						module.clearErrorMessage();
						evaluation.evaluate(
							d,
							module.getCode(),
							function (result) {
								if (result.error) {
									// evaluation failed; report the problem
									error.innerHTML = "";
									tgui.createElement({
										type: "div",
										parent: error,
										classname: "tutorial-error",
										text: result.error,
										click: function (event) {
											let dlg = tgui.createModal({
												title: "error details",
												scalesize: [0.6, 0.6],
												minsize: [300, 300],
												buttons: [{ text: "Close" }],
											});
											if (result.details) {
												dlg.content.innerHTML =
													"<h1>" +
													result.error +
													"</h1>" +
													"<p>The following table lists events generated  by your " +
													"code and by the reference solution, up to the first " +
													"(essential) difference. That difference highlights the " +
													"problem with your solution.</p>" +
													result.details;
											} else {
												dlg.content.innerHTML =
													"<h1>" +
													result.error +
													"</h1>" +
													"<p>Sorry, there are no further details available for " +
													"this error.</p>";
											}
											tgui.startModal(dlg);
										},
									});
								} else {
									// evaluation succeeded; move on to the next section
									tgui.msgBox({
										title: "Success",
										prompt: "Congrats!\nYou have solved the task.",
										enterConfirms: true,
									});
									module.state.completed[
										module.state.unit +
											":" +
											module.state.section
									] = true;
									if (
										module.state.section + 1 ==
										module.data[module.state.unit].sections
											.length
									) {
										module.state.unit++;
										module.state.section =
											findCanonicalSection(
												module.state.unit
											);
									} else module.state.section++;
									storeState();
									display();
								}
							}
						);
					},
				});
				tgui.createElement({
					type: "button",
					classname: "tgui-modal-default-button tutorial-nav-button",
					parent: nav,
					text: "skip task",
					click: function (event) {
						if (
							module.state.section + 1 ==
							module.data[module.state.unit].sections.length
						) {
							module.state.unit++;
							module.state.section = findCanonicalSection(
								module.state.unit
							);
						} else module.state.section++;
						storeState();
						display();
					},
				});
				addReferenceButton(d.correct, nav);
			} else if (
				module.state.unit + 1 < module.data.length ||
				module.state.section + 1 <
					module.data[module.state.unit].sections.length
			) {
				tgui.createElement({
					type: "button",
					classname: "tgui-modal-default-button tutorial-nav-button",
					parent: nav,
					text: "continue",
					click: function (event) {
						if (
							module.state.section + 1 ==
							module.data[module.state.unit].sections.length
						) {
							module.state.unit++;
							module.state.section = findCanonicalSection(
								module.state.unit
							);
						} else module.state.section++;
						storeState();
						display();
					},
				});
			}
		}
	}

	// define the interface to the IDE
	module.init = function (dom, getCode, clearErrorMessage, showErrorMessage) {
		module.dom = dom;
		module.getCode = getCode;
		module.clearErrorMessage = clearErrorMessage;
		module.showErrorMessage = showErrorMessage;

		let s = localStorage.getItem("tutorial");
		if (s) module.state = JSON.parse(s);
		else storeState();

		display();
	};

	return module;
})();
