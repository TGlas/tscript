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

		// add a dblclick (double click) handler
		if (description.hasOwnProperty("dblclick"))
		{
			element.addEventListener("dblclick", description.dblclick);
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

		// tabindex property to disable tab focus (tabindex: -1)
		if (description.hasOwnProperty("tabindex"))
		{
			element.tabIndex = description.tabindex;
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
	module.createText = function(text, parent = null)
	{
		let element = document.createTextNode(text);
		if (parent) (parent as any).appendChild(element);
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


	// Create a canvas icon element with automaticly zoomed contents
	// if the website is zoomed to 200% then the actual width of the
	// canvas is twice as large. The draw function does not need to
	// care about this
	// Fields of the #description object:
	// * draw - function with a "canvas" argument that draws the canvas icon
	// * width - canvas width
	// * height - canvas height
	// * parent - DOM object containing the control 
	// * style - optional dictionary of CSS styles
	module.createCanvasIcon = function(description)
	{
		let style = {"display": "block", "width": description.width+"px", "height": description.height+"px"};
		if(description.hasOwnProperty("style")) Object.assign(style, description.style);
		let canvas = module.createElement({
			"type": "canvas", 
			"parent": description.parent,
			"classname": description.hasOwnProperty("classname") ? description["classname"] : "tgui",
			"style": style,
		});
		canvas.width = description.width;
		canvas.height = description.height;
		
		// zoom
		// TODO: programmaticly detect whenever zoom changes
		let zoom = 2; // Good enough
		//let zoom = window.devicePixelRatio;
		if(zoom > 1)
		{
			canvas.width*=zoom;
			canvas.height*=zoom;
			let ctx = canvas.getContext("2d");
			ctx.scale(zoom, zoom);
		}
		description.draw(canvas);
		
		return canvas;
	}

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
			let canvas = module.createCanvasIcon({"parent": element, "draw": description.draw, "width": description.width, "height": description.height});
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
					"open": (value === null) ? true : (this.id2open.hasOwnProperty(id) ? this.id2open[id]: result.opened),
					"expanded": false,
					"main": (value === null) ? this.dom : module.createElement({"type": "table", "classname": "tgui tgui-tree-main"}),
					"childrows": [],
					"toggle": (value === null) ? null : module.createElement({"type": "div", "classname": "tgui tgui-tree-toggle"}),
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

				state.element.id = "tgui.id." + (Math.random() + 1); // TODO: bad code
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
	function loadPanelData(panel_name)
	{
		let str = localStorage.getItem("tgui.panels");
		if (str)
		{
			let paneldata = JSON.parse(str);
			if (paneldata.hasOwnProperty(panel_name)) return paneldata[panel_name];
		}
		return null;
	}

	// save panel arrangement data to local storage
	module.savePanelData = function()
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
			paneldata[p.name] = d;
		}
		localStorage.setItem("tgui.panels", JSON.stringify(paneldata));
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

		module.savePanelData();
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
	// - name:         a string that identifies the window, used to restore window positions
	// - title:        text in the title bar
	// - floatingpos:  [left, top] floating position
	// - floatingsize: [width, height] size in floating state
	// - dockedheight: height in left or right state
	// - state:        current state, i.e., "left", "right", "max", "float", "icon", "disabled"
	// - icondraw:     draw function for the icon representing the panel in "icon" mode, also drawn in the titlebar of the panel
	// - onResize:     callback function(width, height) on resize
	// - onArrange:    callback function() on arranging (possible position/size change)
	// those properties are carried over to the returned object
	// and the following fields are contained in the returned object:
	// - content:      a DOM element, that represents the content of the panel
	// - dom:          a DOM element, that represents the whole panel
	// - and others, mainly the titlebar components
	let free_panel_id = 1;
	module.createPanel = function(description)
	{
		// load state from local storage if possible
		let stored = loadPanelData(description.name);
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
		control.state = "disabled"; // Later overwritten by a call to control.dock
		let panel = tgui.createElement({"type": "div", "classname": "tgui-panel-container"});
		control.dom = panel;
		control.panelID = free_panel_id;
		free_panel_id++;
		
		
		
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
		

		// register the panel
		module.panels.push(control);

		// create the title bar with buttons
		control.titlebar_container = tgui.createElement({
					"type": "div",
					"parent": panel,
					"classname": "tgui tgui-panel-titlebar",
			});
		control.titlebar_icon = tgui.createCanvasIcon({
				"parent": control.titlebar_container,
				"draw": control.icondraw,
				"width": 20,
				"height": 20,
				"classname": "tgui-panel-titlebar-icon",
				"style": {"left": "1px", "top": "1px", "cursor": "pointer"},
		});
		control.titlebar_icon.addEventListener("dblclick", function (event) { control.dock("icon"); return false; });
		
		// title bar text only
		control.titlebar = tgui.createElement({ // TODO
					"type": "label",
					"dblclick": function (event) { 
						control.dock(control.state == "max" ? control.fallbackState : "max");
						return false;
					},
					"parent": control.titlebar_container,
					"text": control.title,
					"classname": "tgui-panel-titlebar-title",
					"style": {"height": "20px", "line-height": "20px"},
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
					"tooltip-right": "Dock left",
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
					"tooltip-right": "Dock right",
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
					"tooltip-right": "Maximize",
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
					"tooltip-right": "Floating",
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
						ctx.moveTo( 3, 14.5);
						ctx.lineTo(15, 14.5);
						ctx.stroke();
					},
					"parent": control.titlebar_container,
					"classname": "tgui-panel-dockbutton",
					"tooltip-right": "Minimize",
				});

		// create the content div
		control.content = tgui.createElement({
			"type":       "div", 
			"parent":     panel, 
			"classname":  "tgui tgui-panel-content"
		});

		// create the icon
		control.icon = tgui.createButton({
					"click": function() { control.dock(control.fallbackState); return false; },
					"width": 20,
					"height": 20,
					"draw": control.icondraw,
					"tooltip": control.title,
					"style": {
							"margin": "0 0 0 1px", // 1 px as a separator between multiple icons
							"padding": 0,
							"width": "22px",
							"height": "22px",
						},
				});
		let icon = control.icon.dom;

		if (! control.hasOwnProperty("onResize")) control.onResize = function(w, h) { };
		if (! control.hasOwnProperty("onArrange")) control.onArrange = function() { };


		
		// when a floating panel is clicked on, then the panel should move to the top of the panel stack
		var mousedown_focus = function(e) {
			if(control.state == "float" && module.panelcontainer.lastChild !== panel)
			{
				// bring panel to the front
				// appendChild moves controls to their new position,
				// by also removing them from their old position
				module.panelcontainer.appendChild(panel);
			}
		};
		panel.addEventListener("focusin", mousedown_focus);
		panel.addEventListener("mousedown", mousedown_focus);
		

		// dock function for changing docking state
		control.dock = function(state, create = false)
				{
					if (! create)
					{
						if (state == this.state) return;

						// disable
						interact(panel).unset(); // remove all event listeners set by interact
						panel.style.zIndex = 0;
						if (icon.parentNode) icon.parentNode.removeChild(icon);
						if (panel.parentNode) panel.parentNode.removeChild(panel);
						if (this.state == "left") module.panels_left.splice(module.panels_left.indexOf(this), 1);
						if (this.state == "right") module.panels_right.splice(module.panels_right.indexOf(this), 1);
						if (this.state == "float") module.panels_float.splice(module.panels_float.indexOf(this), 1);
						if (module.panel_max == this) module.panel_max = null;
						
						panel.classList.remove("tgui-panel-float");
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
											module.savePanelData();
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
											module.savePanelData();
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
						
						panel.classList.add("tgui-panel-float");
						
						
						var onmove = function(event)
						{
							if (control.state == "float") 
							{
								let x = control.pos[0] + event.dx;
								let y = control.pos[1] + event.dy;
								panel.style.left = x + "px";
								panel.style.top = y + "px";
								control.pos = [x, y];
								control.floatingpos = [x, y];
							}
						};
		
						interact(panel).draggable({
								"inertia": false,
								"allowFrom": ".tgui-panel-titlebar-title",
								"restrict": {
										"restriction": "parent",
										"endOnly": false,
										"elementRect": { top: 0, left: 0, bottom: 1, right: 1 }
									},
								"autoScroll": false,
								"onmove":onmove,
								"onend":onmove,
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

	// See `createModal` for a detailed description of the objects
	// that are stored here
	let modal = new Array();

	function roundToPhysicalPixel(virtual_px)
	{
		return (virtual_px*window.devicePixelRatio | 0)/window.devicePixelRatio;
	}

	// Center a dialog at the center of the window
	// Dialogs are aligned at integral pixel coordinates to
	// avoid pixel-jittering
	function centerModalDialog(dlg)
	{
		let dlg_width, dlg_height;
		let scr_width = window.innerWidth, scr_height = window.innerHeight;
		if(dlg.hasOwnProperty("minsize") && dlg.hasOwnProperty("scalesize"))
		{
			dlg_width = roundToPhysicalPixel(Math.min(Math.max(dlg.minsize[0], dlg.scalesize[0]*scr_width), scr_width));
			dlg_height = roundToPhysicalPixel(Math.min(Math.max(dlg.minsize[1], dlg.scalesize[1]*scr_height), scr_height));
			
			dlg.dom.style["width"] = dlg_width+"px";
			dlg.dom.style["height"] = dlg_height+"px";
		}
		else
		{
			let rect = dlg.dom.getBoundingClientRect();
			dlg_width = rect.width;
			dlg_height = rect.height;
		}
		dlg.dom.style["left"] = roundToPhysicalPixel((scr_width-dlg_width)/2)+"px";
		dlg.dom.style["top"]  = roundToPhysicalPixel((scr_height-dlg_height)/2)+"px";
	}

	// Center all dialogs whenever the window changed
	function centerAllModalDialogs()
	{
		for(let i = 0; i < modal.length; ++i) centerModalDialog(modal[i]);
	}

	// TODO: merge this with arrangePanels, that is also installed as a "resize"-callback
	window.addEventListener("resize", centerAllModalDialogs);

	function nodeListContains(nodeList, element)
	{
		for (let i = 0; i < nodeList.length; i++) {
			let item = nodeList[i];
			if (item === element) return true;
		}
		return false;
	}

	// Create a modal dialog. Similar to createPanel
	// The description object has the following fields:
	// - title:             text in the title bar
	// - scalesize:         [width, heigth] scaled size of the dialog
	// - minsize:           [width, height] minimum size of the dialog, 
	//                      when the whole viewport is smaller, the viewport size is used
	// - contentstyle:      object to add/override some styles to/of the content element
	// - onClose:           callback function() that is called when the dialog is closed by the user
	// - buttons:           list of strings like ["Okay", "Cancel"], each button is connected to
	//                      an eventhandler that is named on<Button>, if it is not available,
	//                      onClose is used instead, if this is not given, there is no button bar
	//                      at the bottom.
	// - default_button     the name of the button in buttons, that is defaulted; it gets highlighted in blue
	//
	// those properties are carried over to the returned object
	// and the following fields are contained in the returned object:
	// - content:           a DOM element, that represents the content of the dialog
	// - dom:               a DOM element, that represents the whole dialog
	// - button_doms:       dictionary of DOM elements, that represents the buttons in the button bar
	// - and others, mainly the titlebar components
	//
	// TODO: Support undecorated elements via a boolean property `decorated`, in this case
	//       control.dom might be the same as control.content.
	module.createModal = function(description)
	{
		let control = Object.assign({}, description);
		// handle default fields
		if (! control.hasOwnProperty("onClose")) control.onClose = function() { };
		
		// create dialog	
		let dialog = tgui.createElement({
			"type": "div",
			"className": "tgui tgui-modal",
			"style": {"background": "#eee", "overflow": "hidden", "display": "block", "zIndex": 100},
		});
		control.dom = dialog;
		
		dialog.addEventListener("keydown", function(event)
		{
			if(event.keyCode === 9) // TAB characterSet
			{			
				//let focus_query = 'button, [href], input, select, textarea, [tabIndex]:not([tabIndex="-1"])';
				let focus_query = 'button, [href], input, select, textarea';
				var focusable = Array(...control.content.querySelectorAll(focus_query));
				if(control.hasOwnProperty("div_buttons"))
				{
					focusable.push(...control.div_buttons.querySelectorAll(focus_query));
				}			
				
				if(focusable.length === 0)
				{
					(document.activeElement as any)?.blur();
				}
				else
				{
					let focusIndex = focusable.indexOf(document.activeElement);
					let n = focusable.length;
					if(focusIndex == -1 || (!event.shiftKey && focusIndex == n-1))
					{
						focusable[0].focus();
						event.preventDefault();
					}
					else if(event.shiftKey && focusIndex === 0)
					{
						focusable[n-1].focus();
						event.preventDefault();
					}
				}
			}
		});

		control.handleClose = handleDialogCloseWith(control.onClose);
		control.titlebar = createTitleBar(dialog, control.title, control.handleClose);

		// create the content div
		let contentHeight = control.hasOwnProperty("buttons") ? "calc(100% - 63px)" : "calc(100% - 24px)";
		let contentstyle = {"height": contentHeight};
		if(control.hasOwnProperty("contentstyle")) Object.assign(contentstyle, control.contentstyle);
		control.content = tgui.createElement({
			"type":       "div", 
			"parent":     dialog,
			"classname":  "tgui tgui-modal-content",
			"style":      contentstyle,
		});
		
		
		
		if(control.hasOwnProperty("buttons"))
		{
			control.div_buttons = tgui.createElement({
				"parent": control.dom,
				"type": "div",
				"classname": "tgui tgui-modal-buttonbar",
			});
			control.button_doms = {};
				
			let default_button = null;
			if(control.hasOwnProperty("default_button")) default_button = control.default_button;
				
			for(let i = 0; i < control.buttons.length; ++i)
			{
				let buttonName = control.buttons[i];
				let event_handler = control.onClose;
				if(control.hasOwnProperty("on"+buttonName))
					event_handler = control["on"+buttonName];
					
				control.button_doms[buttonName] = tgui.createElement({
					"parent":     control.div_buttons,
					"type":       "button",
					"style":      {"width": "100px", "height": "100%", "margin-right": "10px"},
					"text":       buttonName,
					"classname":  (default_button == buttonName ? "tgui-modal-default-button" : "tgui-modal-button"),
					"click":      handleDialogCloseWith(event_handler),
				});
			}
		}
		

		return control;
		
		// --- Local function definitions ---

		// creates an event handler for a dialog, whenever it is going to be closed.
		// - onClose:  a cleanup callback, use null for no cleanup
		function handleDialogCloseWith(onClose)
		{
			return function(event)
			{
				let ret = undefined;
				// by closing the current dialog before calling onClose,
				// onClose itself is able to open additional dialogs in place
				// of the current one
				// if the onClose returns true, the dialog is reopened, note
				// that the content keeps being the same, stopModal and addModal
				// do not invalidate the control object, thus the control object
				// can simply be reused
				tgui.stopModal(); // removes current dialog
				if(onClose!=null) ret = onClose();
				if(event)
				{
					event.preventDefault();
					event.stopPropagation();
				}
				if(ret) tgui.startModal(control); // reopen current dialog
				return false;
			}
		}


		function createTitleBar(dlg, title, handleClose)
		{
			let titlebar = tgui.createElement({
					"parent": dlg,
					"type": "div",
					"style": {"position": "absolute", "width": "100%", "left": "0", "height": "24px", "top": "0"},
					"classname": "tgui-modal-titlebar",
				});

			let titlebar_title = tgui.createElement({ // TODO similar to panel titlebars
					"parent": titlebar,
					"type": "span",
					"text": title,
					"classname": "tgui-modal-titlebar-title",
					"style": {"height": "20px", "line-height": "20px"},
				});

			if(0)
			{
				// TODO Show help to the current dialog
				let help = tgui.createButton({
						"parent": titlebar,
						"click": function ()
								{
									// TODO Open help/documentation here
								},
						"width": 20,
						"height": 20,
						"draw": function(canvas)
								{
									let ctx = canvas.getContext("2d");
									ctx.lineWidth = 2;
									ctx.strokeStyle = "#000";
									ctx.beginPath();
									ctx.arc(9, 6, 4, 1*Math.PI, 2.5*Math.PI, false);
									
									ctx.lineTo(9, 13);
									ctx.stroke();
									ctx.beginPath();
									ctx.moveTo( 9, 15);
									ctx.lineTo(9,  17);
									ctx.stroke();
								},
						"classname": "tgui-panel-dockbutton",
						"tooltip-right": "Help",
						"tabindex": "-1",
					});
			}

			let close = tgui.createButton({
					"parent": titlebar,
					"click": function ()
							{
								return handleClose(null);
							},
					"width": 20,
					"height": 20,
					"draw": function(canvas)
							{
								let ctx = canvas.getContext("2d");
								ctx.lineWidth = 2;
								ctx.strokeStyle = "#000";
								ctx.beginPath();
								ctx.moveTo( 4,  4);
								ctx.lineTo(14, 14);
								ctx.stroke();
								ctx.beginPath();
								ctx.moveTo( 4, 14);
								ctx.lineTo(14,  4);
								ctx.stroke();
							},
					"classname": "tgui-panel-dockbutton",
					"tooltip-right": "Close",
					"tabindex": "-1",
				});

			return titlebar;
		}
	}

	// Properties of description: prompt, [buttons], [default_button], title, on<ButtonName>...
	module.msgBox = function(description)
	{
		let default_description = {"buttons": ["Okay"], "default_button": null}
		description = Object.assign(default_description, description);
		
		let dlg = tgui.createModal(Object.assign({
			"scalesize":      [0.20, 0.15], 
			"minsize":        [300, 150],
		}, description));
		tgui.createElement({
			"parent": dlg.content,
			"type": "div",
			"style": {
				"margin-top": "10px",
				"white-space": "pre-wrap", // do linebreaks
			},
			"text": description.prompt,
		});

		tgui.startModal(dlg);
	};


	// Show a (newly created) modal dialog, that was created by createModal.
	// Modal dialogs can be stacked. The dialog should not have been shown yet.
	// The window appears at the center of the screen, aligned to physical
	// screen pixels.
	// THE FOLLOWING BEHAVIOR IS DEPRECATED/NOT SUPPORTED ANYMORE:
	// Show a (newly created) element as a modal dialog. Modal dialogs can
	// be stacked. The element should not have been added to a parent yet.
	// It has "fixed" positioning and hence is expected to have been styled
	// with top, left, width, and height.
	module.startModal = function(element: any)
	{
		// TODO: disable elements behind the separator.
		//       - if some elements are focused, it might lead to issues
		if (modal.length == 0)
		{
			// activate the separator
			document.body.appendChild(separator);
		}
		else
		{
			// move the old topmost dialog below the separator
			modal[modal.length - 1].dom.style.zIndex = 0;
		}

		// save previous active element to be restored later
		element.prevActiveElement = document.activeElement;
		(document.activeElement as any)?.blur();
		
		
		// add the new modal dialog
		// TODO: remove following 3 lines
		element.dom.style.display = "block";
		element.dom.style.zIndex = 100;
		element.dom.className += " tgui tgui-modal";
		document.body.appendChild(element.dom);
		centerModalDialog(element);
		modal.push(element);
			
		if(element.hasOwnProperty("default_button"))
			element.button_doms[element.default_button].focus();
		else
			element.content.focus();
	}

	// Discard the topmost modal dialog.
	module.stopModal = function()
	{
		if (modal.length == 0) throw "[tgui.stopModel] no modal dialog to close";

		// remove the topmost modal element
		let element = modal.pop();
		document.body.removeChild(element.dom);
		
		// restore previous active element
		if(element.prevActiveElement !== null) element.prevActiveElement.focus();

		// remove the separator after the last modal dialog was closed
		if (modal.length == 0) document.body.removeChild(separator);
		else modal[modal.length - 1].dom.style.zIndex = 100;
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
			if (!dlg.onKeyDownOverride && event.key == "Escape")
			{
				return dlg.handleClose(event);
			}
			
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
