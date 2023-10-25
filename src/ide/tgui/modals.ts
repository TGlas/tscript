import { createButton, createElement, createIcon, separator } from "./index";
import { icons } from "../icons";

// See `createModal` for a detailed description of the objects
// that are stored here
export let modal = new Array();

// Create a modal dialog. Similar to createPanel
// The description object has the following fields:
// - title:             text in the title bar
// - scalesize:         [width, heigth] scaled size of the dialog
// - minsize:           [width, height] minimum size of the dialog,
//                      when the whole viewport is smaller, the viewport size is used
// - contentstyle:      object to add/override some styles to/of the content element
// - buttons?:          buttons of the buttonbar
//                      list of objects with the following fields:
//                      - text: string                  The text displayed on the button
//                      - onClick?: function()          The handler, that is called, when the button has
//                                                      been clicked, default: a no-op function
//                                                      return a true value to keep the dialog open
//                                                      return a false value/nothing to close the dialog
//                      - isDefault?: boolean           Flag if the button is the default button of the
//                                                      dialog, default: false
//                      If this list is not given, there will be no button bar.
//                      Example:    buttons: [{text: "Okay", onClick: dlg => executeTask()}, {text: "Cancel"}]
//                      When a button has been clicked and onClick has been executed completely, onClose is
//                      called and the dialog gets closed, unless a handler has returned true.
// - onClose?:          The handler, whenever the dialog gets closed, it gets called after one of the following happens:
//                      - [Escape] has been pressed
//                      - The [x] button on the titlebar has been clicked
//                      - A button on the button bar has been clicked and onClick of that button did not return true
//                      if the handler returns a false value the dialog closes
//                      default: a no-op function
//                      return a true value to keep the dialog open
//                      return a false value/nothing to close the dialog
// - onHelp?:           null or a function, that takes a bool argument, the boolean is true if it is initiated by a key.
//                      If this is not null, an additional help button is created in the titlebar.
//                      The function gets called, whenever one of the following happens:
//                      - [F1] has been pressed <--- TODO: currently not implemented
//                      - The [?] button on the titlebar has been clicked
//                      default: null
// - enterConfirms      Boolean flag, true if pressing [Enter] should behave like clicking on the default button
//
//
// those properties are carried over to the returned object
// and the following fields are contained in the returned object:
// - content:           a DOM element, that represents the content of the dialog
// - dom:               a DOM element, that represents the whole dialog
// - and others, mainly the titlebar components
// methods in the returned object:
//
// TODO: Support undecorated elements via a boolean property `decorated`, in this case
//   control.dom might be the same as control.content.
export function createModal(description) {
	// control -- description object returned from this function and stored in the tgui.modal array
	// dialog  -- the DOM object of the dialog contents
	let control: any = Object.assign({}, description);

	let handleButton = function (event, button) {
		if (event) {
			event.preventDefault();
			event.stopPropagation();
		}

		if (button && button.onClick) {
			let keepOpen = button.onClick();
			if (keepOpen) return false;
		}

		if (control.onClose) {
			let keepOpen = control.onClose();
			if (keepOpen) return false;
		}

		stopModal(control); // close current dialog
		return false;
	};

	if (control.onHelp) {
		control.handleHelp = function (event) {
			if (event) {
				event.preventDefault();
				event.stopPropagation();
			}
			control.onHelp(event instanceof KeyboardEvent);
			return false;
		};
	} else control.handleHelp = null;

	// create dialog
	let dialog = createElement({
		type: "div",
		className: "tgui tgui-modal",
		style: {
			background: "#eee",
			overflow: "hidden",
			display: "block",
			zIndex: 100,
			position: "absolute",
			left: "0",
			right: "0",
			top: "0",
			bottom: "0",
			margin: "auto",
			width:
				"calc(min(max(" +
				control.minsize[0] +
				"px, " +
				control.scalesize[0] * 100 +
				"%), 100%))",
			height:
				"calc(min(max(" +
				control.minsize[1] +
				"px, " +
				control.scalesize[1] * 100 +
				"%), 100%))",
		},
	});
	control.dom = dialog;

	dialog.addEventListener("keydown", function (event) {
		if (event.keyCode === 9) {
			// TAB characterSet
			let focus_query = "button, [href], input, select, textarea";
			// collect all focusable elements inside the dialog, except titlebar buttons
			var focusable = Array(...control.dom.querySelectorAll(focus_query));
			focusable = focusable.filter((element) => element.tabIndex !== -1);

			if (focusable.length === 0) {
				// Nothing inside the dialog focusable, so keep focus away from other elements
				// similar handling as when opening dialog
				control.focusControl.focus();
				event.preventDefault();
			} else {
				let focusIndex = focusable.indexOf(document.activeElement);
				let n = focusable.length;
				if (
					focusIndex == -1 ||
					(!event.shiftKey && focusIndex == n - 1)
				) {
					focusable[0].focus();
					event.preventDefault();
				} else if (event.shiftKey && focusIndex === 0) {
					focusable[n - 1].focus();
					event.preventDefault();
				}
			}
		}
	});

	control.handleClose = (event) => handleButton(event, null);
	// createTitleBar defined below
	control.titlebar = createTitleBar(
		dialog,
		control.title,
		control.handleClose,
		control.handleHelp
	);

	// create the content div
	let contentHeight = control.hasOwnProperty("buttons")
		? "calc(100% - 63px)"
		: "calc(100% - 24px)";
	let contentstyle = { height: contentHeight };
	if (control.hasOwnProperty("contentstyle"))
		Object.assign(contentstyle, control.contentstyle);
	control.content = createElement({
		type: "div",
		parent: dialog,
		classname: "tgui tgui-modal-content",
		style: contentstyle,
		tabindex: -1, // focusable by script, but not by tab
	});

	control.focusControl = control.content;

	if (control.hasOwnProperty("buttons")) {
		control.div_buttons = createElement({
			parent: control.dom,
			type: "div",
			classname: "tgui tgui-modal-buttonbar",
		});

		for (let button of control.buttons) {
			let eventHandler = (event) => handleButton(event, button);

			if (button.isDefault) control.handleDefault = eventHandler;

			let buttonDom = createElement({
				parent: control.div_buttons,
				type: "button",
				style: {
					width: "100px",
					height: "100%",
					"margin-right": "10px",
				},
				text: button.text,
				classname: button.isDefault
					? "tgui-modal-default-button"
					: "tgui-modal-button",
				click: eventHandler,
			});
			if (button.isDefault) control.focusControl = buttonDom;
		}
	}

	return control;

	// --- Local function definitions ---

	// dlg         -- parent dialog
	// title       -- titlebar text
	// handleClose -- "event" handler, that gets called with null, whenever the x-button is pressed
	function createTitleBar(dlg, title, handleClose, handleHelp) {
		let titlebar = createElement({
			parent: dlg,
			type: "div",
			style: {
				position: "absolute",
				width: "100%",
				left: "0",
				height: "24px",
				top: "0",
			},
			classname: "tgui-modal-titlebar",
		});

		let titlebar_title = createElement({
			// TODO similar to panel titlebars
			parent: titlebar,
			type: "span",
			text: title,
			classname: "tgui-modal-titlebar-title",
			style: { height: "20px", "line-height": "20px" },
		});

		if (handleHelp !== null) {
			// TODO Show help to the current dialog
			let help = createButton({
				parent: titlebar,
				click: function () {
					handleHelp(null);
				},
				width: 20,
				height: 20,
				icon: icons.help,
				classname: "tgui-panel-dockbutton",
				"tooltip-right": "Help",
			});
		}

		let close = createButton({
			parent: titlebar,
			click: function () {
				return handleClose(null);
			},
			width: 20,
			height: 20,
			icon: icons.close,
			classname: "tgui-panel-dockbutton",
			"tooltip-right": "Close",
		});

		return titlebar;
	}
}

// Properties of description: prompt, [icon], [buttons], title, [onClose]...
// prompt -- the displayed text message
// icon   -- an optional SVGIcon to display the appropriate icon to the message
// See `createModal` for more information about these properties
export function msgBox(description) {
	let default_description = {
		buttons: [{ text: "Okay", isDefault: true }],
	};
	description = Object.assign(default_description, description);

	let dlg = createModal(
		Object.assign(
			{
				scalesize: [0.2, 0.15],
				minsize: [300, 150],
			},
			description
		)
	);

	let icon = description.icon;
	if (icon) {
		createIcon({
			parent: dlg.content,
			icon: icon,
			width: 40,
			height: 40,
			classname: "tgui-panel-titlebar-icon",
			//style: 		{"left": "10px", "top": "10px"},
			style: {
				margin: "13px",
				float: "left",
				//"clear": "left"
				"background-clip": "content-box",
			},
		});
	}

	createElement({
		parent: dlg.content,
		type: "div",
		style: {
			"margin-top": "13px",
			"white-space": "pre-wrap", // do linebreaks
			//"margin-left": icon ? "60px" : "10px",
			//"float": "left"
			//"display": "inline-block"
		},
		text: description.prompt,
	});

	startModal(dlg);
}

export let msgBoxQuestion = icons.msgBoxQuestion;
export let msgBoxExclamation = icons.msgBoxExclamation;

// Show a (newly created) modal dialog, that was created by createModal.
// Modal dialogs can be stacked. The dialog should not have been shown yet.
// The window appears at the center of the screen
// THE FOLLOWING BEHAVIOR IS DEPRECATED/NOT SUPPORTED ANYMORE:
// Show a (newly created) element as a modal dialog. Modal dialogs can
// be stacked. The element should not have been added to a parent yet.
// It has "fixed" positioning and hence is expected to have been styled
// with top, left, width, and height.
export function startModal(element: any) {
	// TODO: disable elements behind the separator.
	//       - if some elements are focused, it might lead to issues
	if (modal.length == 0) {
		// activate the separator
		document.body.appendChild(separator);
	} else {
		// move the old topmost dialog below the separator
		modal[modal.length - 1].dom.style.zIndex = 0;
	}

	// save previous active element to be restored later
	element.prevActiveElement = document.activeElement;
	(document.activeElement as any)?.blur?.();
	// ^^ if element.focusControl is not focusable,
	//    such that element.focusControl.focus() has no effect,
	//    the old control should not keep the focus

	// add the new modal dialog
	// TODO: remove following 3 lines
	element.dom.style.display = "block";
	element.dom.style.zIndex = 100;
	element.dom.className += " tgui tgui-modal";
	document.body.appendChild(element.dom);
	modal.push(element);

	element.focusControl.focus();
}

// Discard a modal dialog.
// dialog -- Optional parameter of the dialog to close.
//           The default is the topmost dialog.
export function stopModal(dialog?) {
	if (modal.length == 0) throw "[tgui.stopModal] no modal dialog to close";

	if (dialog === undefined || dialog === modal[modal.length - 1]) {
		// remove the topmost modal element
		let element = modal.pop();
		document.body.removeChild(element.dom);

		// restore previous active element
		if (element.prevActiveElement !== null)
			element.prevActiveElement.focus();
	} else {
		let index = modal.findIndex((e) => e === dialog);
		if (index == -1) throw "[tgui.stopModal] not a modal dialog";

		// The previous active element of the dialog above the current one
		// is usually pointing to an element in this dialog to be removed.
		// The next dialog inherits the previous active element. Such that,
		// if all the dialogs would have been closed normally, the same active
		// element gets focused, when the dialogs are closed out of order.
		modal[index + 1].prevActiveElement = modal[index].prevActiveElement;

		// remove the modal element
		modal.splice(index, 1);
		document.body.removeChild(dialog.dom);
	}

	// remove the separator after the last modal dialog was closed
	if (modal.length == 0) document.body.removeChild(separator);
	else modal[modal.length - 1].dom.style.zIndex = 100;
}
