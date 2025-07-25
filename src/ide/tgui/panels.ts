import { SVGIcon, icons } from "../icons";
import { createButton, createElement, createIcon } from "./index";
let interact = require("interactjs");

///////////////////////////////////////////////////////////
// Panels are window-like areas that can be arranged in
// various ways.
//

// lists of panels
export let panels: Panel[] = [];
let panels_left: Panel[] = [];
let panels_right: Panel[] = [];
let panels_float: Panel[] = [];
let panel_max: Panel | null = null;
let free_panel_id_back = 1;
let free_panel_id_front = -1;

// panel containers
let panelcontainer: any = null;
let iconcontainer: any = null;

// keep track of the current size
let currentW = 0;
let currentH = 0;

interface PanelDescription {
	/** a string that identifies the window, used to restore window positions */
	name: string;

	/** text in the title bar */
	title: string;

	/** [left, top] floating position */
	floatingpos?: [number, number];

	/** [width, height] size in floating state */
	floatingsize?: [number, number];

	/** height in left or right state */
	dockedheight?: any;

	/** current state */
	state: "left" | "right" | "max" | "float" | "icon" | "disabled";

	/** show close button */
	onClose?: () => any;

	/** SVGIcon for the icon representing the panel in "icon" mode, also drawn in the titlebar of the panel */
	icon: SVGIcon;

	/** callback function(width, height) on resize */
	onResize?: (width: number, height: number) => any;

	/** callback function on arranging (possible position/size change) */
	onArrange?: () => any;

	/** TODO: document */
	pos?: any;

	/** TODO: document */
	size?: any;

	/** stores the state of the panel before iconizing */
	fallbackState?: any;
}

export interface Panel extends PanelDescription {
	/** a DOM element, that represents the content of the dialog */
	content: HTMLElement;
	/** a DOM element, that represents the whole dialog */
	dom: HTMLElement;
	/** a DOM element, that represents the titlebar */
	titlebar: HTMLElement;

	/** TODO: document */
	panelID: any;
	/** TODO: document */
	titlebar_container: any;
	/** TODO: document */
	titlebar_icon: any;
	/** TODO: document */
	dock: any;
	/** TODO: document */
	button_left: any;
	/** TODO: document */
	button_right: any;
	/** TODO: document */
	button_max: any;
	/** TODO: document */
	button_float: any;
	/** TODO: document */
	button_close: any;
	/** TODO: document */
	button_icon: any;
	/** TODO: document */
	icon: any;
}

/**
 * create a panel
 */
export function createPanel(description: PanelDescription): Panel {
	// load state from local storage if possible
	let stored = loadPanelData(description.name);
	if (stored) {
		// load position and size
		description.pos = stored.pos;
		description.size = stored.size;
		description.floatingpos = stored.floatingpos;
		description.floatingsize = stored.floatingsize;
		description.dockedheight = stored.dockedheight;
		description.state = stored.state;
		description.fallbackState = stored.fallbackState;
	} else {
		// define position and size
		if (!description.hasOwnProperty("floatingpos"))
			description.floatingpos = [
				100 + 20 * panels.length,
				100 + 10 * panels.length,
			];
		if (!description.hasOwnProperty("floatingsize"))
			description.floatingsize = [400, 250];
		if (!description.hasOwnProperty("dockedheight"))
			description.dockedheight = 200;
		if (!description.hasOwnProperty("state")) description.state = "float";
		if (!description.hasOwnProperty("fallbackState"))
			description.fallbackState = "float";
		description.pos = description.floatingpos;
		description.size = description.floatingsize;
		if (
			description.hasOwnProperty("dockedheight") &&
			(description.state == "left" || description.state == "right")
		)
			description.size[1] = description.dockedheight;
	}

	// create the main objects
	let control = Object.assign({}, description) as Panel;
	control.state = "disabled"; // Later overwritten by a call to control.dock
	let panel = createElement({
		type: "div",
		classname: "tgui-panel-container",
	});
	control.dom = panel;
	if (control.onClose) {
		control.panelID = free_panel_id_front;
		free_panel_id_front--;
	} else {
		control.panelID = free_panel_id_back;
		free_panel_id_back++;
	}

	if (!control.hasOwnProperty("icon")) control.icon = icons.window;

	// register the panel
	panels.push(control);

	// create the title bar with buttons
	control.titlebar_container = createElement({
		type: "div",
		parent: panel,
		classname: "tgui tgui-panel-titlebar",
	});
	control.titlebar_icon = createIcon({
		parent: control.titlebar_container,
		icon: control.icon,
		width: 20,
		height: 20,
		classname: "tgui-panel-titlebar-icon",
		style: { left: "1px", top: "1px", cursor: "pointer" },
	});
	control.titlebar_icon.addEventListener("dblclick", function (event) {
		control.dock("icon");
		return false;
	});

	// title bar text only
	control.titlebar = createElement({
		type: "label",
		dblclick: function (event) {
			control.dock(
				control.state == "max" ? control.fallbackState : "max"
			);
			return false;
		},
		parent: control.titlebar_container,
		text: control.title,
		classname: "tgui-panel-titlebar-title",
		style: { height: "20px", "line-height": "20px" },
	});

	if (control.onClose)
		control.button_close = createButton({
			click: function (event) {
				control.onClose!();
				return false;
			},
			width: 20,
			height: 20,
			icon: icons.close,
			parent: control.titlebar_container,
			classname: "tgui-panel-dockbutton",
			"tooltip-right": "Close",
		});

	control.button_left = createButton({
		click: function () {
			control.dock("left");
			return false;
		},
		width: 20,
		height: 20,
		icon: icons.dockLeft,
		parent: control.titlebar_container,
		classname: "tgui-panel-dockbutton",
		"tooltip-right": "Dock left",
	});
	control.button_right = createButton({
		click: function () {
			control.dock("right");
			return false;
		},
		width: 20,
		height: 20,
		icon: icons.dockRight,
		parent: control.titlebar_container,
		classname: "tgui-panel-dockbutton",
		"tooltip-right": "Dock right",
	});
	control.button_max = createButton({
		click: function () {
			control.dock("max");
			return false;
		},
		width: 20,
		height: 20,
		icon: icons.maximize,
		parent: control.titlebar_container,
		classname: "tgui-panel-dockbutton",
		"tooltip-right": "Maximize",
	});
	control.button_float = createButton({
		click: function () {
			control.dock("float");
			return false;
		},
		width: 20,
		height: 20,
		icon: icons.float,
		parent: control.titlebar_container,
		classname: "tgui-panel-dockbutton",
		"tooltip-right": "Floating",
	});
	control.button_icon = createButton({
		click: function (event) {
			control.dock("icon");
			return false;
		},
		width: 20,
		height: 20,
		icon: icons.minimize,
		parent: control.titlebar_container,
		classname: "tgui-panel-dockbutton",
		"tooltip-right": "Minimize",
	});

	// create the content div
	control.content = createElement({
		type: "div",
		parent: panel,
		classname: "tgui tgui-panel-content",
	});

	// create the icon
	control.icon = createButton({
		click: function () {
			control.dock(control.fallbackState);
			return false;
		},
		width: 20,
		height: 20,
		icon: control.icon,
		tooltip: control.title,
		style: {
			margin: "0 0 0 1px", // 1 px as a separator between multiple icons
			padding: "0",
			width: "22px",
			height: "22px",
		},
	});
	let icon = control.icon.dom;

	if (!control.hasOwnProperty("onResize"))
		control.onResize = function (w, h) {};
	if (!control.hasOwnProperty("onArrange"))
		control.onArrange = function () {};

	// when a floating panel is clicked on, then the panel should move to the top of the panel stack
	var mousedown_focus = function (e) {
		if (control.state == "float" && panelcontainer.lastChild !== panel) {
			// bring panel to the front
			// appendChild moves controls to their new position,
			// by also removing them from their old position
			panelcontainer.appendChild(panel);
		}
	};
	panel.addEventListener("focusin", mousedown_focus);
	panel.addEventListener("mousedown", mousedown_focus);

	// dock function for changing docking state
	control.dock = function (state, create = false) {
		if (!create) {
			if (state == this.state) return;

			// disable
			interact(panel).unset(); // remove all event listeners set by interact
			panel.style.zIndex = "0";
			if (icon.parentNode) icon.parentNode.removeChild(icon);
			if (panel.parentNode) panel.parentNode.removeChild(panel);
			if (this.state == "left")
				panels_left.splice(panels_left.indexOf(this), 1);
			if (this.state == "right")
				panels_right.splice(panels_right.indexOf(this), 1);
			if (this.state == "float")
				panels_float.splice(panels_float.indexOf(this), 1);
			if (panel_max == this) panel_max = null;

			panel.classList.remove("tgui-panel-float");
		}

		// enable again
		if (state == "left") {
			panelcontainer.appendChild(panel);
			panel.style.position = "absolute";
			panel.style.left = "0";
			panel.style.top = "0";
			panel.style.width = "60%";
			panel.style.height = "100%";
			panel.style.zIndex = "0";
			this.fallbackState = state;
			panels_left.push(this);
			panels_left.sort(function (lhs, rhs) {
				return lhs.panelID - rhs.panelID;
			});
			let self = this;
			interact(panel).resizable({
				edges: { bottom: true },
				restrictEdges: { outer: "parent", endOnly: false },
				restrictSize: { min: { height: 100 } },
				inertia: false,
				onmove: function (event) {
					if (panels_left[panels_left.length - 1] == self) return;
					control.dockedheight = event.rect.height;
					let w = panelcontainer.clientWidth;
					let h = panelcontainer.clientHeight;
					let w60 = Math.round(0.6 * w);
					arrangeDocked(panels_left, 0, w60, h);
					savePanelData();
				},
			});
		} else if (state == "right") {
			panelcontainer.appendChild(panel);
			panel.style.position = "absolute";
			panel.style.left = "60%";
			panel.style.top = "0";
			panel.style.width = "40%";
			panel.style.height = "100%";
			panel.style.zIndex = "0";
			this.fallbackState = state;
			panels_right.push(this);
			panels_right.sort(function (lhs, rhs) {
				return lhs.panelID - rhs.panelID;
			});
			let self = this;
			interact(panel).resizable({
				edges: { bottom: true },
				restrictEdges: { outer: "parent", endOnly: false },
				restrictSize: { min: { height: 100 } },
				inertia: false,
				onmove: function (event) {
					if (panels_right[panels_right.length - 1] == self) return;
					control.dockedheight = event.rect.height;
					let w = panelcontainer.clientWidth;
					let h = panelcontainer.clientHeight;
					let w60 = Math.round(0.6 * w);
					let w40 = w - w60;
					arrangeDocked(panels_right, w60, w40, h);
					savePanelData();
				},
			});
		} else if (state == "max") {
			if (panel_max) panel_max.dock(panel_max.fallbackState);
			panelcontainer.appendChild(panel);
			panel.style.position = "absolute";
			panel.style.left = "0";
			panel.style.top = "0";
			panel.style.width = "100%";
			panel.style.height = "100%";
			panel.style.zIndex = "2";
			panel_max = this;
		} else if (state == "float") {
			panelcontainer.appendChild(panel);
			panel.style.position = "absolute";
			panel.style.left = this.pos[0] + "px";
			panel.style.top = this.pos[1] + "px";
			panel.style.width = this.size[0] + "px";
			panel.style.height = this.size[1] + "px";
			panel.style.zIndex = "1";
			this.fallbackState = state;
			panels_float.push(this);

			panel.classList.add("tgui-panel-float");

			var onmove = function (event) {
				if (control.state == "float") {
					let x = control.pos[0] + event.dx;
					let y = control.pos[1] + event.dy;
					panel.style.left = x + "px";
					panel.style.top = y + "px";
					control.pos = [x, y];
					control.floatingpos = [x, y];
				}
			};

			interact(panel)
				.draggable({
					inertia: false,
					allowFrom: ".tgui-panel-titlebar-title",
					restrict: {
						restriction: "parent",
						endOnly: false,
						elementRect: {
							top: 0,
							left: 0,
							bottom: 1,
							right: 1,
						},
					},
					autoScroll: false,
					onmove: onmove,
					onend: onmove,
				})
				.resizable({
					edges: { right: true, bottom: true },
					restrictEdges: { outer: "parent", endOnly: false },
					restrictSize: { min: { width: 250, height: 100 } },
					inertia: false,
					onmove: function (event) {
						let w = event.rect.width;
						let h = event.rect.height;
						panel.style.width = w + "px";
						panel.style.height = h + "px";
						control.size = [w, h];
						if (control.state == "float")
							control.floatingsize = [w, h];
						else if (
							control.state == "left" ||
							control.state == "right"
						)
							control.dockedheight = h;
						control.onResize!(w, Math.max(0, h - 22));
					},
				});
		} else if (state == "icon") {
			if (control.state != "disabled")
				control.fallbackState = control.state;
			iconcontainer.appendChild(control.icon.dom);
		} else if (state == "disabled") {
		} else throw "[createPanel] invalid state: " + state;
		control.state = state;

		arrangePanels();

		if (create)
			control.onResize!(
				control.size[0],
				Math.max(0, control.size[1] - 22)
			);
	};

	if (description.state != "disabled") control.dock(description.state, true);

	return control;
}

export function removePanel(panelId: number) {
	const panel = panels.find((p) => p.panelID == panelId);
	if (!panel) return;

	interact(panel).unset(); // remove all event listeners set by interact
	panelcontainer.removeChild(panel.dom);

	panels = panels.filter((p) => p.panelID != panelId);
	panels_left = panels_left.filter((p) => p.panelID != panelId);
	panels_right = panels_right.filter((p) => p.panelID != panelId);
	panels_float = panels_float.filter((p) => p.panelID != panelId);
	if (panel_max?.panelID == panelId) panel_max = null;

	arrange();
}

export function getPanel(panelId) {
	return panels.find((c) => c.panelID == panelId);
}

/**
 * load panel arrangement data from local storage
 * @param {string} panel_name name of the panel to load
 */
function loadPanelData(panel_name): Panel | null {
	let str = localStorage.getItem("tgui.panels");
	if (str) {
		let paneldata = JSON.parse(str);
		if (paneldata.hasOwnProperty(panel_name)) return paneldata[panel_name];
	}
	return null;
}

/**
 * save panel arrangement data to local storage
 */
export function savePanelData() {
	let paneldata = {};
	for (let i = 0; i < panels.length; i++) {
		let p = panels[i];
		let d: any = {};
		d.state = p.state;
		d.fallbackState = p.fallbackState;
		d.pos = p.pos;
		d.size = p.size;
		d.floatingpos = p.floatingpos;
		d.floatingsize = p.floatingsize;
		d.dockedheight = p.dockedheight;
		paneldata[p.name] = d;
	}
	localStorage.setItem("tgui.panels", JSON.stringify(paneldata));
}

/**
 * initializer for panels
 */
export function preparePanels(_panelcontainer, _iconcontainer) {
	panelcontainer = _panelcontainer;
	iconcontainer = _iconcontainer;
}

/**
 * arrange a set of docked panels so that they fit
 */
function arrangeDocked(list, left, width, height) {
	if (list.length == 0) return;

	// compute desired vertical space
	const min_h = 100;
	let desired = 0;
	for (let i = 0; i < list.length; i++) {
		let p = list[i];
		desired += Math.max(min_h, p.dockedheight);
	}

	// assign vertical space
	let totalSlack = desired - min_h * list.length;
	let targetSlack = height - min_h * list.length;
	let y = 0;
	for (let i = 0; i < list.length; i++) {
		let p = list[i];
		let oldslack = p.dockedheight - min_h;
		let newslack =
			totalSlack == 0
				? Math.round(targetSlack / list.length)
				: Math.round((targetSlack * oldslack) / totalSlack);
		if (newslack < 0) newslack = 0;
		let new_h = min_h + newslack;

		p.dom.style.left = left + "px";
		p.dom.style.top = y + "px";
		p.dom.style.width = width + "px";
		p.dom.style.height = new_h + "px";
		p.pos = [left, y];
		if (p.size[0] != width || p.size[1] != new_h) {
			p.size = [width, new_h];
			p.dockedheight = new_h;
			p.onResize(width, Math.max(0, new_h - 22));
		}
		p.onArrange();
		y += new_h;
	}
}

/**
 * arrange panels
 */
function arrange() {
	if (!panelcontainer) return;
	let w = panelcontainer.clientWidth;
	let h = panelcontainer.clientHeight;
	currentW = w;
	currentH = h;
	let w60 = Math.round(0.6 * w);
	let w40 = w - w60;

	if (panel_max) {
		let p = panel_max;
		let size = [w, h];
		let sc = size[0] != p.size[0] || size[1] != p.size[1];
		p.pos = [0, 0];
		if (sc) {
			p.size = size;
			p.dom.style.width = size[0] + "px";
			p.dom.style.height = size[1] + "px";
			p.onResize!(p.size[0], Math.max(0, p.size[1] - 22));
		}
		p.onArrange!();
	}

	for (let i = 0; i < panels_float.length; i++) {
		let p = panels_float[i];
		let px = p.floatingpos![0];
		let py = p.floatingpos![1];
		let pw = p.floatingsize![0];
		let ph = p.floatingsize![1];
		if (pw >= w) {
			px = 0;
			pw = w;
		} else if (px + pw >= w) {
			px = w - pw;
		}
		if (ph >= h) {
			py = 0;
			ph = h;
		} else if (py + ph >= h) {
			py = h - ph;
		}
		if (px != p.pos[0] || py != p.pos[1]) {
			p.dom.style.left = px + "px";
			p.dom.style.top = py + "px";
			p.pos = [px, py];
			p.floatingpos = p.pos;
		}
		if (pw != p.size[0] || ph != p.size[1]) {
			p.size = [pw, ph];
			p.floatingsize = p.size;
			p.dom.style.width = pw + "px";
			p.dom.style.height = ph + "px";
			p.onResize!(pw, Math.max(0, ph - 22));
		}
		p.onArrange!();
	}

	arrangeDocked(panels_left, 0, panels_right.length > 0 ? w60 : w, h);
	arrangeDocked(
		panels_right,
		panels_left.length > 0 ? w60 : 0,
		panels_left.length > 0 ? w40 : w,
		h
	);

	savePanelData();
}

let arrangerequest = new Date().getTime();
export function arrangePanels() {
	let now = new Date().getTime();
	if (now < arrangerequest) return;
	let delta = 200; // limit arrange frequency to 5Hz
	arrangerequest = new Date().getTime() + delta;
	window.setTimeout(function () {
		arrangerequest -= delta;
		arrange();
	}, delta);
}

// Monitor size changes and propagate them to the panels.
// We use two mechanisms: window size changes and container
// size changes. The latter are polled in a 5Hz loop.
window.addEventListener("resize", arrangePanels);
function poll() {
	if (panelcontainer) {
		let w = panelcontainer.clientWidth;
		let h = panelcontainer.clientHeight;
		if (w != 0 && h != 0) {
			if (w != currentW || h != currentH) {
				arrangePanels();
			}
		}
	}
	window.setTimeout(poll, 200);
}
window.setTimeout(poll, 1000); // start with a short delay

// Force a complete recalculation of panel positions and sizes.
export function forceArrange() {
	currentW = 0;
	currentH = 0;
}
