import { SVGIcon } from "../icons";
import { setHotkey } from "./hotkeys";
import { modal } from "./modals";

// Re-exports
export * from "./modals";
export * from "./panels";
export * from "./hotkeys";

///////////////////////////////////////////////////////////
// simplistic GUI framework
//

/** light theme, indicated by no theme css class in the body dom element which is the initial state */
export let theme = "light";

interface ElementDescription<T = keyof HTMLElementTagNameMap> {
	/** HTML element type name */
	type: T;
	/** optional ID of the element */
	id?: string;
	/** dictionary of CSS styles */
	style?: Record<string, string>;
	/** CSS class */
	classname?: string;
	/** tooltip */
	tooltip?: string;
	/** tooltip right */
	"tooltip-right"?: string;
	/** tabindex*/
	tabindex?: any;
	/** dictionary of properties of the HTML document (should not be used for id, className, and innerHTML) */
	properties?: Record<string, string>;
	/** click handler */
	click?: (event: MouseEvent) => any;
	/** double click handler */
	dblclick?: (event: MouseEvent) => any;
	/** dictionary of event handlers */
	events?: Record<string, (event: Event) => any>;
	/** text to be added to the element as a text node */
	text?: string;
	/** innerHTML to be added after the text */
	html?: string;
	/** DOM object containing the element */
	parent?: HTMLElement;
}

/**
 * Create a new DOM element, acting as the control's main DOM element.
 * Several standard properties of the description are honored.
 * see createElement
 */
export function createElement<T extends keyof HTMLElementTagNameMap>(
	description: ElementDescription<T>
): HTMLElementTagNameMap[T] {
	let element = document.createElement(description.type) as any;
	return setupElement(element, description);
}

function setupElement<T extends HTMLElement>(
	element: T,
	description: Omit<ElementDescription, "type">
): T {
	// set classes
	if (description.classname)
		element.setAttribute("class", description.classname);

	// set ID
	if (description.hasOwnProperty("id")) element.id = description.id!;

	// add properties to the element
	if (description.hasOwnProperty("properties")) {
		for (let key in description.properties) {
			if (!description.properties.hasOwnProperty(key)) continue;
			element[key] = description.properties[key];
		}
	}

	// apply styles
	if (description.hasOwnProperty("style")) {
		for (let key in description.style) {
			if (!description.style.hasOwnProperty(key)) continue;
			element.style[key] = description.style[key];
		}
	}

	// add inner text
	if (description.hasOwnProperty("text"))
		element.appendChild(document.createTextNode(description.text!));

	// add inner html
	if (description.hasOwnProperty("html"))
		element.innerHTML += description.html;

	// add a tooltip
	if (description.hasOwnProperty("tooltip"))
		setTooltip(element, description.tooltip);
	else if (description.hasOwnProperty("tooltip-right"))
		setTooltip(element, description["tooltip-right"], "right");

	// add a click handler
	if (description.hasOwnProperty("click")) {
		element.addEventListener("click", description.click!);
		element.style.cursor = "pointer";
	}

	// add a dblclick (double click) handler
	if (description.hasOwnProperty("dblclick")) {
		element.addEventListener("dblclick", description.dblclick!);
	}

	// add arbitrary event handlers
	if (description.hasOwnProperty("events")) {
		for (let key in description.events) {
			if (!description.events.hasOwnProperty(key)) continue;
			element.addEventListener(key, description.events[key]);
		}
	}

	// tabindex property to disable tab focus (tabindex: -1)
	if (description.hasOwnProperty("tabindex")) {
		element.tabIndex = description.tabindex;
	}

	// add to a parent
	if (description.parent) description.parent.appendChild(element);

	return element;
}

/**
 * simplistic convenience function for creating an HTML text node.
 */
export function createText(text: string, parent: HTMLElement | null = null) {
	let element = document.createTextNode(text);
	if (parent) parent.appendChild(element);
	return element;
}

interface LabelDescription {
	/**
	 * for text buttons
	 * @default ""
	 */
	text?: string;
	/** dictionary of CSS styles */
	style: Record<string, string>;
	/** DOM object containing the control */
	parent?: HTMLElement;
	/** ID of the control */
	id?: string;
	/** tooltip */
	tooltip?: string;
}

export function createLabel(description: LabelDescription) {
	// main DOM element with styling
	let element = createElement({
		...description,
		type: "span",
		classname: "tgui tgui-control tgui-label",
	});

	// return the control
	return {
		dom: element,
		setText: function (text) {
			clearElement(this.dom);
			createText(text, this.dom);
			return this;
		},
		setBackground: function (color) {
			this.dom.style.background = color;
			return this;
		},
	};
}

interface IconDescription {
	/** SVGIcon */
	icon: SVGIcon;
	/** icon width */
	width: number;
	/** icon height */
	height: number;
	/** CSS class */
	classname?: string;
	/** DOM object containing the control */
	parent: HTMLElement;
	/** dictionary of CSS styles */
	style?: Record<string, string>;
}

/**
 * create an icon element with automatically zoomed contents
 */
export function createIcon(description: IconDescription) {
	let style = {
		display: "block",
		width: description.width + "px",
		height: description.height + "px",
	};

	if (description.hasOwnProperty("style"))
		Object.assign(style, description.style);

	function createSvg(icon: SVGIcon): SVGSVGElement {
		let svg: SVGSVGElement = document.createElementNS(
			"http://www.w3.org/2000/svg",
			"svg"
		);
		svg.setAttribute("width", icon.width + "px");
		svg.setAttribute("height", icon.height + "px");
		svg.innerHTML = icon.innerSVG;
		return svg;
	}

	let svg: SVGSVGElement = createSvg(description.icon);

	setupElement(svg as any, {
		parent: description.parent,
		style: style,
		classname: description.hasOwnProperty("classname")
			? description["classname"]
			: "tgui",
	});

	return svg;
}

interface ButtonDescription {
	/** event handler, taking an "event" argument */
	click: (event: MouseEvent) => any;
	/**
	 * for text buttons
	 * @default ""
	 */
	text?: string;
	/** SVGIcon */
	icon?: SVGIcon;
	/** icon width */
	width?: number;
	/** icon height */
	height?: number;
	/** CSS class */
	classname?: string;
	/** dictionary of CSS styles */
	style?: Record<string, string>;
	/** DOM object containing the control */
	parent?: HTMLElement;
	/** ID of the control */
	id?: string;
	/** tooltip */
	tooltip?: string;
	/** tooltip-right */
	"tooltip-right"?: string;
	/** hotkey, see setHotkey */
	hotkey?: string;
}

/**
 * create a new button
 */
export function createButton(description: ButtonDescription) {
	// main DOM element with styling
	let element = createElement({
		...description,
		type: "button",
		classname:
			"tgui tgui-control tgui-button" +
			(description.text ? "-text" : "-icon") +
			(description.classname ? " " + description.classname : ""),
	});

	// create the actual content
	if (description.icon) {
		// fancy icon button
		let icon = createIcon({
			parent: element,
			icon: description.icon,
			width: description.width!,
			height: description.height!,
		});
	} else if (!description.text)
		throw "[tgui.createButton] either .text or .icon are required";

	// add a hotkey
	setHotkey(description.hotkey!, description.click!);

	// return the control
	return { dom: element };
}

interface TreeDescription {
	/** dictionary of CSS styles */
	style?: Record<string, string>;
	/** DOM object containing the control */
	parent?: HTMLElement;
	/** ID of the control */
	id?: string;
	/** tooltip */
	tooltip?: string;
	/** function describing the tree content */
	info?: (value: any, node_id: string) => any;
	/** event handler, taking an "event" argument */
	nodeclick?: (event: MouseEvent, value: any, id: any) => any;
}

interface TreeControl extends TreeDescription {
	/** DOM element representing the value */
	element: HTMLElement;
	/** boolean indicating whether the tree node should be opened or closed by default */
	opened: boolean;
	/** array of child values */
	children: HTMLElement[];
	/** array of unique string IDs of the child nodes */
	ids: string[];
	/** if true then scroll to make this element visible */
	visible?: boolean;
}

/**
 * Create a new tree control.
 * The tree content is determined by the function description.info.
 * On calling `control.update(info)` the tree is rebuilt from scratch.
 * The function `control.value(element)` returns the value identifying a given tree element.
 */
export function createTreeControl(description: TreeDescription): TreeControl {
	// control with styling
	let element = createElement({
		...description,
		type: "div",
		classname: "tgui tgui-control tgui-tree",
	});

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
		value: null,
		id: "",
		open: true,
		expanded: false,
		main: element,
		childrows: [],
		toggle: null,
		element: null,
		children: [],
	};

	// create the control object
	let control: any = {
		dom: element,
		info: description.info ? description.info : null,
		update: null,
		value: null,
		state: state,
		visible: null,
		numberOfNodes: 0,
		nodeclick: description.nodeclick ? description.nodeclick : null,
		element2state: {},
		id2state: {},
		id2open: {}, // preserved across updates
	};

	// recursively add elements to the reverse lookup
	function updateLookup(state) {
		if (state.element) this.element2state[state.element.id] = state;
		if (state.id) this.id2state[state.id] = state;
		for (let i = 0; i < state.children.length; i++)
			updateLookup.call(this, state.children[i]);
	}

	// As part of createInternalTree, this function creates the actual
	// child nodes. It is called when the node is opened for the first
	// time, or if the node is created in the opened state.
	function createChildNodes(state, result) {
		for (let i = 0; i < result.children.length; i++) {
			let child = result.children[i];
			let child_id = result.ids[i];
			let substate = createInternalTree.call(this, child, child_id);
			state.children.push(substate);
			if (state.value === null) {
				state.main.appendChild(substate.main);
			} else {
				let tr = createElement({
					type: "tr",
					parent: state.main,
					classname: "tgui",
				});
				let td1 = createElement({
					type: "td",
					parent: tr,
					classname: "tgui tgui-tree-cell-toggle",
				});
				let td2 = createElement({
					type: "td",
					parent: tr,
					classname: "tgui tgui-tree-cell-content",
				});
				td2.appendChild(substate.main);
				state.childrows.push(tr);
			}
		}
		state.expanded = true;
	}

	// Recursively create a new state and DOM tree.
	// The function assumes that #this is the control.
	function createInternalTree(value, id) {
		let result = this.info(value, id);

		// create a new state
		let state = {
			value: value,
			id: id,
			open:
				value === null
					? true
					: this.id2open.hasOwnProperty(id)
					? this.id2open[id]
					: result.opened,
			expanded: false,
			main:
				value === null
					? this.dom
					: createElement({
							type: "table",
							classname: "tgui tgui-tree-main",
					  }),
			childrows: [],
			toggle:
				value === null
					? null
					: createElement({
							type: "div",
							classname: "tgui tgui-tree-toggle",
					  }),
			element: value === null ? null : result.element,
			children: [],
		};

		if (value !== null) {
			// create a table cell for the element
			let tr = createElement({
				type: "tr",
				parent: state.main,
				classname: "tgui",
			});
			let td1 = createElement({
				type: "td",
				parent: tr,
				classname: "tgui tgui-tree-cell-toggle",
			});
			let td2 = createElement({
				type: "td",
				parent: tr,
				classname: "tgui tgui-tree-cell-content",
			});
			td1.appendChild(state.toggle!);
			td2.appendChild(state.element);

			state.element.id = "tgui.id." + (Math.random() + 1); // TODO: bad code
			state.element.className = "tgui tgui-tree-element";

			// initialize the toggle button
			let s =
				result.children.length > 0
					? state.open
						? "\u25be"
						: "\u25b8"
					: "\u25ab";
			state.toggle!.innerHTML = s;

			// make the toggle button clickable
			if (result.children.length > 0) {
				td1.style.cursor = "pointer";
				td1.addEventListener("click", function (event) {
					let element = this.parentNode!.children[1].children[0];
					let state = control.element2state[element.id];
					if (state.open) {
						// close the node, i.e., add the tgui-hidden class to all child rows
						for (let i = 0; i < state.childrows.length; i++)
							state.childrows[i].className = "tgui tgui-hidden";
					} else {
						// expand the tree
						if (!state.expanded) {
							let result = control.info(state.value, state.id);
							createChildNodes.call(control, state, result);
							updateLookup.call(control, state);
						}

						// open the node, i.e., remove the tgui-hidden class from all child rows
						for (let i = 0; i < state.childrows.length; i++)
							state.childrows[i].className = "tgui";
					}
					state.open = !state.open;
					control.id2open[state.id] = state.open;
					let s = state.open ? "\u25be" : "\u25b8";
					state.toggle.innerHTML = s;
				});
			}

			// make the element clickable
			if (this.nodeclick) {
				td2.style.cursor = "pointer";
				td2.addEventListener("click", function (event) {
					let element = this.children[0];
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
		if (state.open) {
			createChildNodes.call(this, state, result);
			state.expanded = true;
		}

		return state;
	}

	// Update the tree to represent new data, i.e., replace the stored
	// info function and apply the new function to obtain the tree.
	control.update = function (info) {
		// store the new info object for later use
		this.info = info;
		this.visible = null;
		this.numberOfNodes = 0;

		// clear the root DOM element
		clearElement(this.dom);

		// update the state and the DOM based on info
		this.state = createInternalTree.call(this, null, "");

		// prepare reverse lookup
		this.element2state = {};
		this.id2state = {};
		updateLookup.call(this, this.state);

		// scroll a specific element into view
		if (this.visible !== null) {
			window.setTimeout(function () {
				let h = control.dom.clientHeight;
				let y =
					(control.dom.scrollHeight * control.visible) /
					control.numberOfNodes;
				if (
					y < control.dom.scrollTop + 0.1 * h ||
					y >= control.dom.scrollTop + 0.9 * h
				) {
					y -= 0.666 * h;
					if (y < 0) y = 0;
					control.dom.scrollTop = y;
				}
			}, 0);
		}
	};

	// obtain the value corresponding to a DOM element
	control.value = function (element) {
		if (!this.element2state.hasOwnProperty(element.id))
			throw "[tgui TreeControl.get] unknown element";
		return this.element2state[element.id].value;
	};

	// initialize the control
	if (control.info) control.update.call(control, control.info);

	return control;
}

/**
 * remove all children from an element.
 */
export function clearElement(element: HTMLElement) {
	element.innerHTML = "";
}

/**
 * set the tooltip for a given HTMLElement
 */
export function setTooltip(
	element: HTMLElement,
	tooltip = "",
	direction = "left"
) {
	let tt = element.getElementsByClassName("tgui-tooltip");
	for (let i = 0; i < tt.length; i++) element.removeChild(tt[i]);

	createElement({
		type: "div",
		parent: element,
		text: tooltip,
		classname: "tgui tgui-tooltip tgui-tooltip-" + direction,
	});
}

/**
 * set the theme
 */
export function setTheme(newTheme: string) {
	if (newTheme === "default") {
		// Auto detect theme of the operating system
		if (window.matchMedia) {
			var q = window.matchMedia("(prefers-color-scheme: dark)");
			newTheme = q.matches ? "dark" : "light";
		} else {
			newTheme = "light";
		}
	}

	// Note that the light theme is represented in the body tag by no class at all
	if (theme !== newTheme) {
		if (newTheme === "light")
			document.body.classList.remove(`${theme}-theme`);
		else if (theme == "light")
			document.body.classList.add(`${newTheme}-theme`);
		else
			document.body.classList.replace(
				`${theme}-theme`,
				`${newTheme}-theme`
			);

		theme = newTheme;
	}
}

export let separator = createElement({
	type: "div",
	id: "tgui-separator",
	classname: "tgui tgui-separator",
	click: function (event) {
		// TODO: close popups, but not modal dialogs...?
		return false; // important: consume clicks
	},
	tabindex: -1, // focusable, not by tab
});

separator.addEventListener("focusin", (event) => {
	modal[modal.length - 1]?.focusControl.focus();
	return false;
});
