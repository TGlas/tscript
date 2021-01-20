"use strict";
var interact = require('interactjs');

///////////////////////////////////////////////////////////
// simplistic GUI framework
//


export let tgui = (function() {
let module:any = {};


// global mapping of hotkeys to handlers
let hotkeys = {};
let hotkeyElement = null;

// normalize the hotkey to lowercase
module.normalizeHotkey = function(hotkey)
{
	let pos = hotkey.lastIndexOf('-') + 1;
	let key = hotkey.substr(pos);
	if (key.length == 1) return hotkey.substr(0, pos) + key.toLowerCase();
	else return hotkey;
}

// return true if the hotkey is in use
module.hotkey = function(hotkey)
{ return (hotkeys.hasOwnProperty(module.normalizeHotkey(hotkey))); }

// register a new hotkey, check for conflicts
// * hotkey: key name, possibly preceded by a dash-separated list of the modifiers "shift", "control", and "alt", in this order; example: "shift-alt-a"
// * handler: event handler function with an "event" parameter
module.setHotkey = function(hotkey, handler)
{
	if (! hotkey) return;
	hotkey = module.normalizeHotkey(hotkey);
	if (hotkeys.hasOwnProperty(hotkey)) throw "[tgui.setHotkey] hotkey conflict; key '" + hotkey + "' is already taken";
	hotkeys[hotkey] = handler;
}

// remove a hotkey
module.releaseHotkey = function(hotkey)
{
	if (! hotkey) return;
	delete hotkeys[module.normalizeHotkey(hotkey)];
}

// remove all hotkeys
module.releaseAllHotkeys = function()
{ hotkeys = {}; }

// enable hotkeys only if the given element is visible
module.setHotkeyElement = function(element)
{ hotkeyElement = element; }

module.setTooltip = function(element, tooltip = "", direction="left")
{
	let tt = element.getElementsByClassName("tgui-tooltip");
	for (let i=0; i<tt.length; i++) element.removeChild(tt[i]);
	createControl("div", {"parent": element, "text": tooltip}, "tgui tgui-tooltip tgui-tooltip-" + direction);
}

// Create a new DOM element, acting as the control's main DOM element.
// Several standard properties of the description are honored.
function createControl(type, description, classname)
{
	let element = document.createElement(type);

	// set classes
	if (classname) element.className = classname;

	// set ID
	if (description.hasOwnProperty("id")) element.id = description.id;

	// add properties to the element
	if (description.hasOwnProperty("properties"))
	{
		for (let key in description.properties)
		{
			if (! description.properties.hasOwnProperty(key)) continue;
			element[key] = description.properties[key];
		}
	}

	// apply styles
	if (description.hasOwnProperty("style"))
	{
		for (let key in description.style)
		{
			if (! description.style.hasOwnProperty(key)) continue;
			element.style[key] = description.style[key];
		}
	}

	// add inner text
	if (description.hasOwnProperty("text")) element.appendChild(document.createTextNode(description.text));

	// add inner html
	if (description.hasOwnProperty("html")) element.innerHTML += description.html;

	// add a tooltip
	if (description.hasOwnProperty("tooltip")) module.setTooltip(element, description.tooltip);
	else if (description.hasOwnProperty("tooltip-right")) module.setTooltip(element, description["tooltip-right"], "right");

	// add a click handler
	if (description.hasOwnProperty("click"))
	{
		element.addEventListener("click", description.click);
		element.style.cursor = "pointer";
	}

	// add arbitrary event handlers
	if (description.hasOwnProperty("event"))
	{
		for (let key in description.event)
		{
			if (! description.event.hasOwnProperty(key)) continue;
			element.addEventListener(key, description.event[key]);
		}
	}

	// add to a parent
	if (description.parent) description.parent.appendChild(element);

	return element;
}

// Remove all children from an element.
module.clearElement = function(element)
{
	element.innerHTML = "";
}

// Simplistic convenience function for creating an HTML text node.
// Fields of the description object:
// * parent - optionl DOM object containing the element
// * text - optional text to be added to the element as a text node
module.createText = function(text, parent:any = null)
{
	let element = document.createTextNode(text);
	if (parent) parent.appendChild(element);
	return element;
}

// Convenience function for creating an HTML element.
// Fields of the description object:
// * type - HTML element type name, e.g., "div"
// * classname - optional CSS class
// * properties - dictionary of properties of the HTML document (should not be used for id, className, and innerHTML)
// * style - dictionary of CSS styles
// * parent - optionl DOM object containing the element
// * id - optional ID of the element
// * tooltip - optional tooltip
// * text - optional text to be added to the element as a text node
// * html - optional innerHTML to be added after the text
// * click - optional click handler
module.createElement = function(description)
{
	return createControl(description.type, description, description.classname);
}

// Create a new label. A label is a control with easily configurable
// read-only content.
// Fields of the #description object:
// * text - for text buttons, default: ""
// * style - dictionary of CSS styles
// * parent - optionl DOM object containing the control
// * id - optional ID of the control
// * tooltip - optional tooltip
module.createLabel = function(description)
{
	// main DOM element with styling
	let element = createControl("span", description, "tgui tgui-control tgui-label");

	// return the control
	return {
			"dom": element,
			"setText": function(text)
					{
						module.clearElement(this.dom);
						module.createText(text, this.dom);
						return this;
					},
			"setBackground": function(color)
					{
						this.dom.style.background = color;
						return this;
					},
		};
};

// Create a new button.
// Fields of the #description object:
// * click - event handler, taking an "event" argument
// * text - for text buttons, default: ""
// * draw - for canvas buttons, function with a "canvas" argument that draws the button face
// * width - for canvas buttons, canvas width
// * height - for canvas buttons, canvas height
// * classname - optional CSS class
// * style - optional dictionary of CSS styles
// * parent - optionl DOM object containing the control
// * id - optional ID of the control
// * tooltip - optional tooltip
// * hotkey - optional hotkey, see setHotkey
module.createButton = function(description)
{
	// main DOM element with styling
	let element = createControl("button", description, "tgui tgui-control tgui-button" + (description.text ? "-text" : "-canvas") + (description.classname ? (" " + description.classname) : ""));

	// create the actual content
	if (description.draw)
	{
		// fancy canvas button
		let canvas = module.createElement({"type": "canvas", "parent": element, "classname": "tgui", "style": {"display": "block"}});
		canvas.width = description.width;
		canvas.height = description.height;
		description.draw(canvas);
	}
	else if (! description.text) throw "[tgui.createButton] either .text or .draw are required";

	// add a hotkey
	module.setHotkey(description.hotkey, description.click);

	// return the control
	return { "dom": element };
};

// Create a new tree control.
// The tree content is determined by the function description.info.
// On calling
//   control.update(info)
// the tree is rebuilt from scratch. The function
//   control.value(element)
// returns the value identifying a given tree element.
//
// fields of the #description object:
// * style - dictionary of CSS styles
// * parent - optionl DOM object containing the control
// * id - optional ID of the control
// * tooltip - optional tooltip
// * info - function describing the tree content, see below
// * nodeclick - click handler for tree nodes, signature function(event, value, id)
//
// The parameter info is a function taking a value and the ID of the
// node. It is expected to return an object with three properties:
// * element: DOM element representing the value
// * opened: boolean indicating whether the tree node should be opened or closed by default
// * children: array of child values
// * ids: array of unique string IDs of the child nodes
// * visible: optional boolean, if true then scroll to make this element visible
module.createTreeControl = function(description)
{
	// control with styling
	let element = createControl("div", description, "tgui tgui-control tgui-tree");

	// create the root state, serving as a dummy holding the tree's top-level nodes
	// state object layout:
	// .value: JS value represented by the tree node, or null for the root node
	// .id: unique string ID of the node
	// .open: boolean indicating whether the node is "opened" or "closed", relevant only if .children.length > 0
	// .expanded: boolean indicating whether the node's children have already been created
	// .main: main DOM element, a table, can be null for the root node
	// .childrows: array of table rows of the child elements
	// .toggle: DOM element for toggling open/close
	// .element: DOM element for the value
	// .children: array of sub-states
	let state = {
		"value": null,
		"id": "",
		"open": true,
		"expanded": false,
		"main": element,
		"childrows": [],
		"toggle": null,
		"element": null,
		"children": [],
	};

	// create the control object
	let control:any = {
			"dom": element,
			"info": description.info ? description.info : null,
			"update": null,
			"value": null,
			"state": state,
			"visible": null,
			"numberOfNodes": 0,
			"nodeclick": description.nodeclick ? description.nodeclick : null,
			"element2state": {},
			"id2state": {},
			"id2open": {},             // preserved across updates
		};

	// recursively add elements to the reverse lookup
	function updateLookup(state)
	{
		if (state.element) this.element2state[state.element.id] = state;
		if (state.id) this.id2state[state.id] = state;
		for (let i=0; i<state.children.length; i++) updateLookup.call(this, state.children[i]);
	}

	// As part of createInternalTree, this function creates the actual
	// child nodes. It is called when the node is opened for the first
	// time, or if the node is created in the opened state.
	function createChildNodes(state, result)
	{
		for (let i=0; i<result.children.length; i++)
		{
			let child = result.children[i];
			let child_id = result.ids[i];
			let substate = createInternalTree.call(this, child, child_id);
			state.children.push(substate);
			if (state.value === null)
			{
				state.main.appendChild(substate.main);
			}
			else
			{
				let tr = module.createElement({"type": "tr", "parent": state.main, "classname": "tgui"});
				let td1 = module.createElement({"type": "td", "parent": tr, "classname": "tgui tgui-tree-cell-toggle"});
				let td2 = module.createElement({"type": "td", "parent": tr, "classname": "tgui tgui-tree-cell-content"});
				td2.appendChild(substate.main);
				state.childrows.push(tr);
			}
		}
		state.expanded = true;
	}

	// Recursively create a new state and DOM tree.
	// The function assumes that #this is the control.
	function createInternalTree(value, id)
	{
		let result = this.info(value, id);

		// create a new state
		let state = {
			"value": value,
			"id": id,
			"open": (value === null) ? true : (this.id2open.hasOwnProperty(id) ? this.id2open[id] : result.opened),
			"expanded": false,
			"main": (value === null) ? this.dom : module.createElement({ "type": "table", "classname": "tgui tgui-tree-main" }),
			"childrows": [],
			"toggle": (value === null) ? null : module.createElement({ "type": "div", "classname": "tgui tgui-tree-toggle" }),
			"element": (value === null) ? null : result.element,
			"children": [],
		};

		if (value !== null)
		{
			// create a table cell for the element
			let tr = module.createElement({"type": "tr", "parent": state.main, "classname": "tgui"});
			let td1 = module.createElement({"type": "td", "parent": tr, "classname": "tgui tgui-tree-cell-toggle"});
			let td2 = module.createElement({"type": "td", "parent": tr, "classname": "tgui tgui-tree-cell-content"});
			td1.appendChild(state.toggle);
			td2.appendChild(state.element);

			state.element.id = "tgui.id." + (Math.random() + 1);
			state.element.className = "tgui tgui-tree-element";

			// initialize the toggle button
			let s = ((result.children.length > 0) ? (state.open ? "\u25be" : "\u25b8") : "\u25ab");
			state.toggle.innerHTML = s;

			// make the toggle button clickable
			if (result.children.length > 0)
			{
				td1.style.cursor = "pointer";
				td1.addEventListener("click", function(event)
						{
							let element = this.parentNode.childNodes[1].childNodes[0];
							let state = control.element2state[element.id];
							if (state.open)
							{
								// close the node, i.e., add the tgui-hidden class to all child rows
								for (let i=0; i<state.childrows.length; i++) state.childrows[i].className = "tgui tgui-hidden";
							}
							else
							{
								// expand the tree
								if (! state.expanded)
								{
									let result = control.info(state.value, state.id);
									createChildNodes.call(control, state, result);
									updateLookup.call(control, state);
								}

								// open the node, i.e., remove the tgui-hidden class from all child rows
								for (let i=0; i<state.childrows.length; i++) state.childrows[i].className = "tgui";
							}
							state.open = ! state.open;
							control.id2open[state.id] = state.open;
							let s = (state.open ? "\u25be" : "\u25b8");
							state.toggle.innerHTML = s;
						});
			}

			// make the element clickable
			if (this.nodeclick)
			{
				td2.style.cursor = "pointer";
				td2.addEventListener("click", function(event)
						{
							let element = this.childNodes[0];
							let state = control.element2state[element.id];
							control.nodeclick(event, state.value, state.id);
						});
			}
		}

		// honor the "visible" property
		if (result.visible) this.visible = this.numberOfNodes;

		// count this node
		this.numberOfNodes++;

		// process the children and recurse
		if (state.open)
		{
			createChildNodes.call(this, state, result);
			state.expanded = true;
		}

		return state;
	};

	// Update the tree to represent new data, i.e., replace the stored
	// info function and apply the new function to obtain the tree.
	control.update = function(info)
	{
		// store the new info object for later use
		this.info = info;
		this.visible = null;
		this.numberOfNodes = 0;

		// clear the root DOM element
		module.clearElement(this.dom);

		// update the state and the DOM based on info
		this.state = createInternalTree.call(this, null, "");

		// prepare reverse lookup
		this.element2state = {};
		this.id2state = {};
		updateLookup.call(this, this.state);

		// scroll a specific element into view
		if (this.visible !== null)
		{
			window.setTimeout(function()
					{
						let h = control.dom.clientHeight;
						let y = control.dom.scrollHeight * control.visible / control.numberOfNodes;
						if (y < control.dom.scrollTop + 0.1 * h || y >= control.dom.scrollTop + 0.9 * h)
						{
							y -= 0.666 * h;
							if (y < 0) y = 0;
							control.dom.scrollTop = y;
						}
					}, 0);
		}
	};

	// obtain the value corresponding to a DOM element
	control.value = function(element)
	{
		if (! this.element2state.hasOwnProperty(element.id)) throw "[tgui TreeControl.get] unknown element";
		return this.element2state[element.id].value;
	}

	// initialize the control
	if (control.info) control.update.call(control, control.info);

	return control;
};


///////////////////////////////////////////////////////////
// Panels are window-like areas that can be arranged in
// various ways.
//

// lists of panels
module.panels = [];
module.panels_left = [];
module.panels_right = [];
module.panels_float = [];
module.panel_max = null;

// panel containers
module.panelcontainer = null;
module.iconcontainer = null;

// load panel arrangement data from local storage
function loadPanelData(title)
{
	let str = window.localStorage.getItem("tgui.panels");
	if (str)
	{
		let paneldata = JSON.parse(str);
		if (paneldata.hasOwnProperty(title)) return paneldata[title];
	}
	return null;
};

// save panel arrangement data to local storage
function savePanelData()
{
	let paneldata = {};
	for (let i=0; i<module.panels.length; i++)
	{
		let p = module.panels[i];
		let d:any = {};
		d.state = p.state;
		d.fallbackState = p.fallbackState;
		d.pos = p.pos;
		d.size = p.size;
		d.floatingpos = p.floatingpos;
		d.floatingsize = p.floatingsize;
		d.dockedheight = p.dockedheight;
		paneldata[p.title] = d;
	}
	window.localStorage.setItem("tgui.panels", JSON.stringify(paneldata));
}

module.preparePanels = function(panelcontainer, iconcontainer)
{
	module.panelcontainer = panelcontainer;
	module.iconcontainer = iconcontainer;
}

// arrange a set of docked panels so that they fit
function arrangeDocked(list, left, width, height)
{
	if (list.length == 0) return;

	// compute desired vertical space
	const min_h = 100;
	let desired = 0;
	for (let i=0; i<list.length; i++)
	{
		let p = list[i];
		desired += Math.max(min_h, p.dockedheight);
	}

	// assign vertical space
	let totalSlack = desired - min_h * list.length;
	let targetSlack = height - min_h * list.length;
	let y = 0;
	for (let i=0; i<list.length; i++)
	{
		let p = list[i];
		let oldslack = p.dockedheight - min_h;
		let newslack = (totalSlack == 0)
				? Math.round(targetSlack / list.length)
				: Math.round(targetSlack * oldslack / totalSlack);
		if (newslack < 0) newslack = 0;
		let new_h = min_h + newslack;

		p.dom.style.left = left + "px";
		p.dom.style.top = y + "px";
		p.dom.style.width = width + "px";
		p.dom.style.height = new_h + "px";
		p.pos = [left, y];					
		if (p.size[0] != width || p.size[1] != new_h)
		{
			p.size = [width, new_h];
			p.dockedheight = new_h;
			p.onResize(width, Math.max(0, new_h - 22));
		}
		p.onArrange();
		y += new_h;
	}
};

// keep track of the current size
let currentW = 0, currentH = 0;

// arrange all panels so that they fit
function arrange()
{
	if (! module.panelcontainer) return;
	let w = module.panelcontainer.clientWidth;
	let h = module.panelcontainer.clientHeight;
	currentW = w;
	currentH = h;
	let w60 = Math.round(0.6 * w);
	let w40 = w - w60;

	if (module.panel_max)
	{
		let p = module.panel_max;
		let size = [w, h];
		let sc = (size[0] != p.size[0] || size[1] != p.size[1]);
		p.pos = [0, 0];
		if (sc)
		{
			p.size = size;
			p.dom.style.width = size[0] + "px";
			p.dom.style.height = size[1] + "px";
			p.onResize(p.size[0], Math.max(0, p.size[1] - 22));
		}
		p.onArrange();
	}

	for (let i=0; i<module.panels_float.length; i++)
	{
		let p = module.panels_float[i];
		let px = p.floatingpos[0];
		let py = p.floatingpos[1];
		let pw = p.floatingsize[0];
		let ph = p.floatingsize[1];
		if (pw >= w) { px = 0; pw = w; }
		else if (px + pw >= w) { px = w - pw; }
		if (ph >= h) { py = 0; ph = h; }
		else if (py + ph >= h) { py = h - ph; }
		if (px != p.pos[0] || py != p.pos[1])
		{
			p.dom.style.left = px + "px";
			p.dom.style.top = py + "px";
			p.pos = [px, py];
			p.floatingpos = p.pos;
		}
		if (pw != p.size[0] || ph != p.size[1])
		{
			p.size = [pw, ph];
			p.floatingsize = p.size;
			p.dom.style.width = pw + "px";
			p.dom.style.height = ph + "px";
			p.onResize(pw, Math.max(0, ph - 22));
		}
		p.onArrange();
	}

	arrangeDocked(module.panels_left, 0, (module.panels_right.length > 0) ? w60 : w, h);
	arrangeDocked(module.panels_right, (module.panels_left.length > 0) ? w60 : 0, (module.panels_left.length > 0) ? w40 : w, h);

	savePanelData();
}

let arrangerequest = (new Date()).getTime();
module.arrangePanels = function()
{
	let now = (new Date()).getTime();
	if (now < arrangerequest) return;
	let delta = 200;   // limit arrange frequency to 5Hz
	arrangerequest = (new Date()).getTime() + delta;
	window.setTimeout(function()
			{
				arrangerequest -= delta;
				arrange();
			}, delta);
}

// Monitor size changes and propagate them to the panels.
// We use two mechanisms: window size changes and container
// size changes. The latter are polled in a 5Hz loop.
window.addEventListener("resize", module.arrangePanels);
function poll()
{
	if (module.panelcontainer)
	{
		let w = module.panelcontainer.clientWidth;
		let h = module.panelcontainer.clientHeight;
		if (w != 0 && h != 0)
		{
			if (w != currentW || h != currentH)
			{
				module.arrangePanels();
			}
		}
	}
	window.setTimeout(poll, 200);
}
window.setTimeout(poll, 1000);   // start with a short delay


// Create a panel.
// The description object has the following fields:
// title: text in the title bar
// floatingpos: [left, top] floating position
// floatingsize: [width, height] size in floating state
// dockedheight: height in left or right state
// state: current state, i.e., "left", "right", "max", "float", "icon", "disabled"
// icondraw: draw function for the icon representing the panel in "icon" mode
// onResize: callback function(width, height) on resize
// onArrange: callback function() on arranging (possible position/size change)
let free_panel_id = 1;
module.createPanel = function(description)
{
	// load state from local storage if possible
	let stored = loadPanelData(description.title);
	if (stored)
	{
		// load position and size
		description.pos = stored.pos;
		description.size = stored.size;
		description.floatingpos = stored.floatingpos;
		description.floatingsize = stored.floatingsize;
		description.dockedheight = stored.dockedheight;
		description.state = stored.state;
		description.fallbackState = stored.fallbackState;
	}
	else
	{
		// define position and size
		if (! description.hasOwnProperty("floatingpos")) description.floatingpos = [100 + 20*module.panels.length, 100 + 10*module.panels.length];
		if (! description.hasOwnProperty("floatingsize")) description.floatingsize = [400, 250];
		if (! description.hasOwnProperty("dockedheight")) description.dockedheight = 200;
		if (! description.hasOwnProperty("state")) description.state = "float";
		if (! description.hasOwnProperty("fallbackState")) description.fallbackState = "float";
		description.pos = description.floatingpos;
		description.size = description.floatingsize;
		if (description.hasOwnProperty("dockedheight") && (description.state == "left" || description.state == "right")) description.size[1] = description.dockedheight;
	}

	// create the main objects
	let control = Object.assign({}, description);
	control.state = "disabled";
	let panel = tgui.createElement({"type": "div", "classname": "tgui-panel-container"});
	control.dom = panel;
	control.panelID = free_panel_id;
	free_panel_id++;

	// register the panel
	module.panels.push(control);

	// create the title bar with buttons
	control.titlebar_container = tgui.createElement({
				"type": "div",
				"parent": panel,
				"classname": "tgui tgui-panel-titlebar",
		});
	control.titlebar = tgui.createElement({
				"type": "span",
				"parent": control.titlebar_container,
				"text": control.title,
		});

	control.button_icon = tgui.createButton({
				"click": function (event) { control.dock("icon"); return false; },
				"width": 20,
				"height": 20,
				"draw": function(canvas)
				{
					let ctx = canvas.getContext("2d");
					ctx.lineWidth = 2.5;
					ctx.strokeStyle = "#000";
					ctx.beginPath();
					ctx.moveTo( 3, 15);
					ctx.lineTo(15, 15);
					ctx.stroke();
				},
				"parent": control.titlebar_container,
				"classname": "tgui-panel-dockbutton",
				"tooltip-right": "minimize",
			});
	control.button_float = tgui.createButton({
				"click": function () { control.dock("float"); return false; },
				"width": 20,
				"height": 20,
				"draw": function(canvas)
				{
					let ctx = canvas.getContext("2d");
					ctx.lineWidth = 1;
					ctx.strokeStyle = "#666";
					ctx.beginPath();
					ctx.rect(2.5, 2.5, 13, 13);
					ctx.stroke();
					ctx.fillStyle = "#fff";
					ctx.fillRect(4.5, 5.5, 9, 8);
					ctx.strokeStyle = "#000";
					ctx.beginPath();
					ctx.rect(4.5, 5.5, 9, 8);
					ctx.fillStyle = "#00c";
					ctx.fillRect(4.5, 5.5, 9, 3);
					ctx.stroke();
				},
				"parent": control.titlebar_container,
				"classname": "tgui-panel-dockbutton",
				"tooltip-right": "floating",
			});
	control.button_max = tgui.createButton({
				"click": function () { control.dock("max"); return false; },
				"width": 20,
				"height": 20,
				"draw": function(canvas)
				{
					let ctx = canvas.getContext("2d");
					ctx.lineWidth = 1;
					ctx.fillStyle = "#fff";
					ctx.fillRect(2.5, 2.5, 13, 13);
					ctx.strokeStyle = "#000";
					ctx.beginPath();
					ctx.rect(2.5, 2.5, 13, 13);
					ctx.fillStyle = "#00c";
					ctx.fillRect(2.5, 2.5, 13, 3);
					ctx.stroke();
				},
				"parent": control.titlebar_container,
				"classname": "tgui-panel-dockbutton",
				"tooltip-right": "maximize",
			});
	control.button_right = tgui.createButton({
				"click": function () { control.dock("right"); return false; },
				"width": 20,
				"height": 20,
				"draw": function(canvas)
				{
					let ctx = canvas.getContext("2d");
					ctx.lineWidth = 1;
					ctx.strokeStyle = "#666";
					ctx.beginPath();
					ctx.rect(2.5, 2.5, 13, 13);
					ctx.stroke();
					ctx.fillStyle = "#fff";
					ctx.fillRect(8.5, 2.5, 7, 13);
					ctx.strokeStyle = "#000";
					ctx.beginPath();
					ctx.rect(8.5, 2.5, 7, 13);
					ctx.fillStyle = "#00c";
					ctx.fillRect(8.5, 2.5, 7, 3);
					ctx.stroke();
				},
				"parent": control.titlebar_container,
				"classname": "tgui-panel-dockbutton",
				"tooltip-right": "dock right",
			});
	control.button_left = tgui.createButton({
				"click": function () { control.dock("left"); return false; },
				"width": 20,
				"height": 20,
				"draw": function(canvas)
				{
					let ctx = canvas.getContext("2d");
					ctx.lineWidth = 1;
					ctx.strokeStyle = "#666";
					ctx.beginPath();
					ctx.rect(2.5, 2.5, 13, 13);
					ctx.stroke();
					ctx.fillStyle = "#fff";
					ctx.fillRect(2.5, 2.5, 7, 13);
					ctx.strokeStyle = "#000";
					ctx.beginPath();
					ctx.rect(2.5, 2.5, 7, 13);
					ctx.fillStyle = "#00c";
					ctx.fillRect(2.5, 2.5, 7, 3);
					ctx.stroke();
				},
				"parent": control.titlebar_container,
				"classname": "tgui-panel-dockbutton",
				"tooltip-right": "dock left",
			});

	// create the content div
	control.content = tgui.createElement({"type": "div", parent: panel, "classname": "tgui tgui-panel-content"});

	if (! control.hasOwnProperty("icondraw")) control.icondraw = function(canvas)
			{
					let ctx = canvas.getContext("2d");
					ctx.lineWidth = 1;
					ctx.fillStyle = "#fff";
					ctx.fillRect(2.5, 2.5, 15, 15);
					ctx.strokeStyle = "#000";
					ctx.beginPath();
					ctx.rect(2.5, 2.5, 15, 15);
					ctx.fillStyle = "#00c";
					ctx.fillRect(2.5, 2.5, 15, 3);
					ctx.stroke();
			};

	// create the icon
	control.icon = tgui.createButton({
				"click": function() { control.dock(control.fallbackState); return false; },
				"width": 20,
				"height": 20,
				"draw": control.icondraw,
				"tooltip": control.title,
				"style": {
						"margin": 0,
						"padding": 0,
						"width": "22px",
						"height": "22px",
					},
			});
	let icon = control.icon.dom;

	if (! control.hasOwnProperty("onResize")) control.onResize = function(w, h) { };
	if (! control.hasOwnProperty("onArrange")) control.onArrange = function() { };

	// dock function for changing docking state
	control.dock = function(state, create = false)
			{
				if (! create)
				{
					if (state == this.state) return;

					// disable
					interact(panel).draggable(false).resizable(false);
					panel.style.zIndex = 0;
					if (icon.parentNode) icon.parentNode.removeChild(icon);
					if (panel.parentNode) panel.parentNode.removeChild(panel);
					if (this.state == "left") module.panels_left.splice(module.panels_left.indexOf(this), 1);
					if (this.state == "right") module.panels_right.splice(module.panels_right.indexOf(this), 1);
					if (this.state == "float") module.panels_float.splice(module.panels_float.indexOf(this), 1);
					if (module.panel_max == this) module.panel_max = null;
				}

				// enable again
				if (state == "left")
				{
					module.panelcontainer.appendChild(panel);
					panel.style.position = "absolute";
					panel.style.left = 0;
					panel.style.top = 0;
					panel.style.width = "60%";
					panel.style.height = "100%";
					panel.style.zIndex = 0;
					this.fallbackState = state;
					module.panels_left.push(this);
					module.panels_left.sort(function(lhs, rhs){return lhs.panelID - rhs.panelID;});
					let self = this;
					interact(panel).resizable({
							"edges": { bottom: true },
							"restrictEdges": { "outer": "parent", "endOnly": false },
							"restrictSize": { "min": { "height": 100 }, },
							"inertia": false,
							"onmove": function (event)
									{
										if (module.panels_left[module.panels_left.length - 1] == self) return;
										control.dockedheight = event.rect.height;
										let w = module.panelcontainer.clientWidth;
										let h = module.panelcontainer.clientHeight;
										let w60 = Math.round(0.6 * w);
										arrangeDocked(module.panels_left, 0, w60, h);
										savePanelData();
									},
						});
				}
				else if (state == "right")
				{
					module.panelcontainer.appendChild(panel);
					panel.style.position = "absolute";
					panel.style.left = "60%";
					panel.style.top = 0;
					panel.style.width = "40%";
					panel.style.height = "100%";
					panel.style.zIndex = 0;
					this.fallbackState = state;
					module.panels_right.push(this);
					module.panels_right.sort(function(lhs, rhs){return lhs.panelID - rhs.panelID;});
					let self = this;
					interact(panel).resizable({
							"edges": { bottom: true },
							"restrictEdges": { "outer": "parent", "endOnly": false },
							"restrictSize": { "min": { "height": 100 }, },
							"inertia": false,
							"onmove": function (event)
									{
										if (module.panels_right[module.panels_right.length - 1] == self) return;
										control.dockedheight = event.rect.height;
										let w = module.panelcontainer.clientWidth;
										let h = module.panelcontainer.clientHeight;
										let w60 = Math.round(0.6 * w);
										let w40 = w - w60;
										arrangeDocked(module.panels_right, w60, w40, h);
										savePanelData();
									},
						});
				}
				else if (state == "max")
				{
					if (module.panel_max) module.panel_max.dock(module.panel_max.fallbackState);
					module.panelcontainer.appendChild(panel);
					panel.style.position = "absolute";
					panel.style.left = 0;
					panel.style.top = 0;
					panel.style.width = "100%";
					panel.style.height = "100%";
					panel.style.zIndex = 2;
					module.panel_max = this;
				}
				else if (state == "float")
				{
					module.panelcontainer.appendChild(panel);
					panel.style.position = "absolute";
					panel.style.left = this.pos[0] + "px";
					panel.style.top = this.pos[1] + "px";
					panel.style.width = this.size[0] + "px";
					panel.style.height = this.size[1] + "px";
					panel.style.zIndex = 1;
					this.fallbackState = state;
					module.panels_float.push(this);
					interact(panel).draggable({
							"inertia": true,
							"allowFrom": ".tgui-panel-titlebar",
							"restrict": {
									"restriction": "parent",
									"endOnly": false,
									"elementRect": { top: 0, left: 0, bottom: 1, right: 1 }
								},
							"autoScroll": false,
							"onmove": function (event)
									{
										let x = control.pos[0] + event.pageX - event.x0;
										let y = control.pos[1] + event.pageY - event.y0;
										panel.style.left = x + "px";
										panel.style.top = y + "px";
									},
							"onend": function (event)
									{
										let x = control.pos[0] + event.pageX - event.x0;
										let y = control.pos[1] + event.pageY - event.y0;
										panel.style.left = x + "px";
										panel.style.top = y + "px";
										control.pos = [x, y];
										if (control.state == "float") control.floatingpos = [x, y];
									},
						}).resizable({
							"edges": { right: true, bottom: true },
							"restrictEdges": { "outer": "parent", "endOnly": false },
							"restrictSize": { "min": { "width": 250, "height": 100 }, },
							"inertia": false,
							"onmove": function (event)
									{
										let w = event.rect.width;
										let h = event.rect.height;
										panel.style.width = w + "px";
										panel.style.height = h + "px";
										control.size = [w, h];
										if (control.state == "float") control.floatingsize = [w, h];
										else if (control.state == "left" || control.state == "right") control.dockedheight = h;
										control.onResize(w, Math.max(0, h - 22));
									},
						});
				}
				else if (state == "icon")
				{
					if (control.state != "disabled") control.fallbackState = control.state;
					module.iconcontainer.appendChild(control.icon.dom);
				}
				else if (state == "disabled")
				{ }
				else throw "[createPanel] invalid state: " + state;
				control.state = state;

				module.arrangePanels();

				if (create) control.onResize(control.size[0], Math.max(0, control.size[1] - 22));
			};

	if (description.state != "disabled") control.dock(description.state, true);

	return control;
}


let separator = module.createElement({
		"type": "div",
		"id": "tgui-separator",
		"classname": "tgui tgui-separator",
		"click": function(event)
				{
					// TODO: close popups, but not modal dialogs...?
					return false;   // important: consume clicks
				},
		});
let modal:any = [];

// Show a (newly created) element as a modal dialog. Modal dialogs can
// be stacked. The element should not have been added to a parent yet.
// It has "fixed" positioning and hence is expected to have been styled
// with top, left, width, and height.
module.startModal = function(element)
{
	if (modal.length == 0)
	{
		// activate the separator
		document.body.appendChild(separator);
	}
	else
	{
		// move the old topmost dialog below the separator
		modal[modal.length - 1].style.zIndex = 0;
	}

	// add the new modal dialog
	element.style.display = "block";
	element.style.zIndex = 100;
	element.className += " tgui tgui-modal";
	document.body.appendChild(element);
	modal.push(element);
}

// Discard the topmost modal dialog.
module.stopModal = function()
{
	if (modal.length == 0) throw "[tgui.stopModel] no modal dialog to close";

	// remove the topmost modal element
	let element = modal.pop();
	document.body.removeChild(element);

	// remove the separator after the last modal dialog was closed
	if (modal.length == 0) document.body.removeChild(separator);
	else modal[modal.length - 1].style.zIndex = 100;
}

// check whether an element is currently visible to the user
// https://stackoverflow.com/a/7557433
function isElementInViewport(element)
{
	var rect = element.getBoundingClientRect();
	if (rect.width == 0 || rect.height == 0) return false;
	if (rect.top >= (window.innerHeight || document.documentElement.clientHeight)) return false;
	if (rect.bottom < 0) return false;
	if (rect.left >= (window.innerWidth || document.documentElement.clientWidth)) return false;
	if (rect.right < 0) return false;
	return true;
}

// register a global key listener for hotkey events
document.addEventListener("keydown", function(event)
{
	if (modal.length > 0)
	{
		// redirect key events to the topmost dialog
		let dlg = modal[modal.length - 1];
		if (dlg.hasOwnProperty("onKeyDown"))
		{
			dlg.onKeyDown(event);
			return false;
		}
	}
	else
	{
		if (hotkeyElement && ! isElementInViewport(hotkeyElement)) return true;

		// compose the key code string
		let key = event.key;
		if (event.altKey) key = "alt-" + key;
		if (event.ctrlKey) key = "control-" + key;
		if (event.shiftKey) key = "shift-" + key;
		key = module.normalizeHotkey(key);

		// handle global hotkeys
		if (hotkeys.hasOwnProperty(key))
		{
			hotkeys[key](event);
			event.preventDefault();
			event.stopPropagation();
			return false;
		}
	}
	return true;
});


return module;
}());
