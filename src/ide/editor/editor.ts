import { Document } from "./document";
import { Iterator } from "./iterators";
import { Language } from "./language";
import { themes } from "./theme";
import {
	Action,
	SimpleAction,
	IndentAction,
	UnindentAction,
	CommentAction,
	UncommentAction,
	ReplaceAction,
} from "./actions";

// The editor class links all components (DOM elements and internal
// management objects) together. It refers to exactly one document in a
// fixed language for syntax highlighting. Its main job is to process
// events and to forward resulting actions to the document.
export class Editor {
	private document: Document;
	private readOnly: boolean;
	private themeName: string;
	private theme: any = null;
	private offscreen: OffscreenCanvas;
	private devicePixelRatio: number = 0;
	private scroll_x: number = 0;
	private scroll_y: number = 0;
	private capture: number | null = null;
	private eventHandlers: any = {};
	private fontsize: number = 0;
	private tpad: number = 0;
	private bpad: number = 0;
	private em: number = 0;
	private lnwidth: number = 0;
	private charwidth: number = 0;
	private hpad: number = 0;
	private digits: number = 0;
	private target_x: number = 0;
	private dom_main: HTMLElement;
	private dom_container: HTMLElement;
	private dom_bars: HTMLElement;
	private dom_bar_linenumbers: HTMLCanvasElement;
	private dom_bar_icon: HTMLCanvasElement;
	private dom_content: HTMLElement;
	private dom_display: HTMLCanvasElement;
	private dom_scroller: HTMLElement;
	private dom_sizer: HTMLElement;
	private dom_focus: HTMLElement;
	private dom_search: HTMLElement;
	private dom_search_key: HTMLInputElement;
	private dom_search_replacement: HTMLInputElement;
	private dom_search_label: HTMLElement;
	private dom_search_ignorecase: HTMLInputElement;
	private dom_search_find: HTMLElement;
	private dom_search_replace: HTMLElement;
	private dom_search_replaceall: HTMLElement;
	private dom_search_close: HTMLElement;
	private observer: ResizeObserver;
	private keybindings: Map<string, string>;

	public constructor(options: any = {}) {
		// extract options with defaults
		let language = options.language ? options.language : "plain";
		let text = options.text ? options.text : "";
		let parent = options.parent ? options.parent : null;
		let focus = !!options.focus;
		let theme = options.theme ? options.theme : "auto";
		this.keybindings = options.keybindings
			? options.keybindings
			: new Map(Editor.defaultKeyBindings);
		this.readOnly = !!options.readOnly;

		// document associated with this editor
		language = new Language(language.toLowerCase());
		this.document = new Document(language, text);
		this.setTarget();

		// color theme, can be "light", "dark" or "auto"
		this.themeName = theme;

		// offscreen canvas for smooth drawing updates
		this.offscreen = new OffscreenCanvas(0, 0);

		// keep track of the current zoom
		this.devicePixelRatio = window.devicePixelRatio;

		// create DOM elements
		this.dom_main = document.createElement("div");
		this.dom_main.style.display = "flex";
		this.dom_main.style.flexDirection = "column";
		this.dom_main.className = "editor";

		this.dom_container = document.createElement("div");
		this.dom_container.className = "container";
		this.dom_container.style.height = "calc(100% - 37px)";
		this.dom_container.style.width = "100%";
		this.dom_container.style.display = "flex";
		this.dom_container.style.flexGrow = "1";
		this.dom_main.appendChild(this.dom_container);

		this.dom_bars = document.createElement("div");
		this.dom_bars.className = "bars";
		this.dom_bars.style.height = "100%";
		this.dom_bars.style.overflow = "hidden";
		this.dom_bars.style.flexGrow = "0";
		this.dom_bars.style.display = "flex";
		this.dom_container.appendChild(this.dom_bars);

		this.dom_bar_linenumbers = document.createElement("canvas");
		this.dom_bar_linenumbers.className = "bar linenumbers";
		this.dom_bar_linenumbers.style.height = "100%";
		this.dom_bars.appendChild(this.dom_bar_linenumbers);

		this.dom_bar_icon = document.createElement("canvas");
		this.dom_bar_icon.className = "bar icon";
		this.dom_bar_icon.style.height = "100%";
		this.dom_bars.appendChild(this.dom_bar_icon);

		this.dom_content = document.createElement("div");
		this.dom_content.className = "content";
		this.dom_content.style.position = "relative";
		this.dom_content.style.overflow = "auto";
		this.dom_content.style.height = "100%";
		this.dom_content.style.width = "100%";
		this.dom_content.style.flexGrow = "1";
		this.dom_container.appendChild(this.dom_content);

		this.dom_display = document.createElement("canvas");
		this.dom_display.className = "display";
		this.dom_display.style.position = "absolute";
		this.dom_display.style.left = "0";
		this.dom_display.style.top = "0";
		this.dom_display.style.width = "100%";
		this.dom_display.style.height = "100%";
		this.dom_display.style.overflow = "auto";
		this.dom_display.style.whiteSpace = "pre";
		this.dom_display.style.tabSize = "4";
		this.dom_content.appendChild(this.dom_display);

		this.dom_focus = document.createElement("div");
		this.dom_focus.className = "focus";
		this.dom_focus.style.position = "absolute";
		this.dom_focus.style.left = "0px";
		this.dom_focus.style.top = "0px";
		this.dom_focus.style.width = "100%";
		this.dom_focus.style.height = "100%";
		this.dom_focus.style.color = "transparent";
		this.dom_focus.style.caretColor = "transparent";
		this.dom_focus.setAttribute("tabindex", "0");
		this.dom_focus.setAttribute("contenteditable", "true");
		this.dom_content.appendChild(this.dom_focus);

		this.dom_scroller = document.createElement("div");
		this.dom_scroller.className = "scroller";
		this.dom_scroller.style.position = "absolute";
		this.dom_scroller.style.left = "0";
		this.dom_scroller.style.top = "0";
		this.dom_scroller.style.width = "100%";
		this.dom_scroller.style.height = "100%";
		this.dom_scroller.style.overflow = "auto";
		this.dom_content.appendChild(this.dom_scroller);

		this.dom_sizer = document.createElement("div");
		this.dom_sizer.className = "sizer";
		this.dom_sizer.style.minWidth = "100%";
		this.dom_sizer.style.minHeight = "100%";
		this.dom_scroller.appendChild(this.dom_sizer);

		this.dom_search = document.createElement("div");
		this.dom_search.className = "search";
		this.dom_search.addEventListener("keydown", (event) => {
			if (event.key === "Escape") this._closeSearch();
		});
		this.dom_search.style.fontFamily = "sans";
		this.dom_search.style.fontSize = "14px";
		this.dom_search.style.height = "36px";
		this.dom_search.style.overflow = "hidden";
		this.dom_search.style.flexGrow = "0";
		this.dom_search.style.width = "98%";
		this.dom_search.style.padding = "0 1%";
		this.dom_search.style.display = "none";
		this.dom_search.style.justifyContent = "space-evenly";
		this.dom_search.style.alignItems = "center";
		this.dom_search.style.gap = "1%";
		this.dom_main.appendChild(this.dom_search);

		this.dom_search_key = document.createElement("input");
		this.dom_search_key.setAttribute("type", "text");
		this.dom_search_key.setAttribute("placeholder", "search text");
		this.dom_search_key.addEventListener("keydown", (event) => {
			if (event.key === "Enter") {
				this.onFind();
				event.preventDefault();
				event.stopPropagation();
			}
		});
		this.dom_search_key.style.padding = "0 5px";
		this.dom_search_key.style.flexGrow = "1";
		this.dom_search_key.style.minWidth = "100px";
		this.dom_search_key.style.height = "24px";
		this.dom_search.appendChild(this.dom_search_key);

		this.dom_search_replacement = document.createElement("input");
		this.dom_search_replacement.setAttribute("type", "text");
		this.dom_search_replacement.setAttribute("placeholder", "replace with");
		this.dom_search_replacement.addEventListener("keydown", (event) => {
			if (event.key === "Enter") {
				this.onReplace();
				event.preventDefault();
				event.stopPropagation();
			}
		});
		this.dom_search_replacement.style.padding = "0 5px";
		this.dom_search_replacement.style.flexGrow = "1";
		this.dom_search_replacement.style.minWidth = "100px";
		this.dom_search_replacement.style.height = "24px";
		this.dom_search.appendChild(this.dom_search_replacement);

		this.dom_search_label = document.createElement("label");
		this.dom_search_label.innerText = "\u00a0ignore case\u00a0";
		this.dom_search_label.style.flexGrow = "0";
		this.dom_search_label.style.userSelect = "none";
		this.dom_search.appendChild(this.dom_search_label);

		this.dom_search_ignorecase = document.createElement("input");
		this.dom_search_ignorecase.setAttribute("type", "checkbox");
		this.dom_search_ignorecase.checked = true;
		this.dom_search_ignorecase.style.flexGrow = "0";
		this.dom_search_label.appendChild(this.dom_search_ignorecase);

		this.dom_search_find = document.createElement("button");
		this.dom_search_find.innerText = "find";
		this.dom_search_find.addEventListener("click", this.onFind.bind(this));
		this.dom_search_find.style.flexGrow = "0";
		this.dom_search_find.style.padding = "0 3px";
		this.dom_search_find.style.height = "24px";
		this.dom_search.appendChild(this.dom_search_find);

		this.dom_search_replace = document.createElement("button");
		this.dom_search_replace.innerText = "replace";
		this.dom_search_replace.addEventListener(
			"click",
			this.onReplace.bind(this)
		);
		this.dom_search_replace.style.flexGrow = "0";
		this.dom_search_replace.style.padding = "0 3px";
		this.dom_search_replace.style.height = "24px";
		this.dom_search.appendChild(this.dom_search_replace);

		this.dom_search_replaceall = document.createElement("button");
		this.dom_search_replaceall.innerText = "all";
		this.dom_search_replaceall.addEventListener(
			"click",
			this.onReplaceAll.bind(this)
		);
		this.dom_search_replaceall.style.flexGrow = "0";
		this.dom_search_replaceall.style.padding = "0 3px";
		this.dom_search_replaceall.style.height = "24px";
		this.dom_search.appendChild(this.dom_search_replaceall);

		this.dom_search_close = document.createElement("div");
		this.dom_search_close.className = "close";
		this.dom_search_close.innerText = "\u2715";
		this.dom_search_close.addEventListener("click", (event) => {
			this._closeSearch();
		});
		this.dom_search_close.style.flexGrow = "0";
		this.dom_search_close.style.fontSize = "24px";
		this.dom_search_close.style.cursor = "pointer";
		this.dom_search.appendChild(this.dom_search_close);

		// set color these
		this.applyColorTheme();

		// register event handlers
		this.observer = new ResizeObserver((entries) => {
			this.recalc();
			this.draw();
		});
		this.observer.observe(this.dom_content);

		this.dom_scroller.addEventListener("scroll", this.onScroll.bind(this));

		this.dom_scroller.addEventListener(
			"pointerdown",
			this.onPointerStart.bind(this)
		);
		this.dom_scroller.addEventListener(
			"pointermove",
			this.onPointerMove.bind(this)
		);
		this.dom_scroller.addEventListener(
			"pointerup",
			this.onPointerFinish.bind(this)
		);
		this.dom_scroller.addEventListener(
			"pointercancel",
			this.onPointerAbort.bind(this)
		);
		this.dom_scroller.addEventListener(
			"dblclick",
			this.onDoubleClick.bind(this)
		);

		this.dom_bars.addEventListener(
			"pointerdown",
			this.onBarClick.bind(this)
		);

		this.dom_focus.addEventListener("focus", this.onFocus.bind(this));
		this.dom_focus.addEventListener("blur", this.onBlur.bind(this));

		this.dom_focus.addEventListener("keydown", this.onKey.bind(this));
		this.dom_focus.addEventListener("input", this.onInput.bind(this));
		this.dom_focus.addEventListener("cut", this.onCut.bind(this));
		this.dom_focus.addEventListener("copy", this.onCopy.bind(this));
		this.dom_focus.addEventListener("paste", this.onPaste.bind(this));

		if (window.matchMedia) {
			let mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
			mediaQuery.addEventListener(
				"change",
				this.applyColorTheme.bind(this)
			);
		}

		// show the editor
		if (parent) parent.appendChild(this.dom_main);
		if (focus) this.focus();

		this.docChanged(); // webkit fix
	}

	// Return the main DOM element of the editor.
	public dom() {
		return this.dom_main;
	}

	// Obtain the whole text represented by the editor as a string.
	public text() {
		return this.document.text();
	}

	// Set the document text. Essentially, this amounts to creating a new document.
	public setText(text: string, options: any = {}) {
		let props = this.document.properties;
		this.document = new Document(this.document.language, text);
		this.document.properties = props;
		this.docChanged();
		this.setTarget(0);
		if (options.hasOwnProperty("cursor"))
			this.setCursorPosition(options.cursor.row, options.cursor.col);
		if (!options.hasOwnProperty("scrollIntoView") || options.scrollIntoView)
			this.scrollIntoView();
		this.draw();
	}

	// Obtain the current selection as a string.
	public selection() {
		if (this.document.selection === null) return "";
		let begin = Math.min(this.document.cursor, this.document.selection);
		let end = Math.max(this.document.cursor, this.document.selection);
		let range = this.document.range(begin, end);
		return Document.arr2str(range);
	}

	// Turn the word at the cursor into the current selection.
	public selectWordAtCursor() {
		// find the word or number at the cursor position
		let ct = new Set([2, 3]);
		let iter = new Iterator(this.document);
		iter.setPosition(this.document.cursor);
		let c = iter.character();
		let t = Document.chartype(c);
		if (!ct.has(t)) {
			if (iter.pos > 0) iter.back();
			c = iter.character();
			t = Document.chartype(c);
			if (!ct.has(t)) return;
		}

		// set cursor and selection
		while (ct.has(Document.chartype(iter.character()))) iter.advance();
		this.document.cursor = iter.pos;
		while (ct.has(Document.chartype(iter.before()))) iter.back();
		this.document.selection = iter.pos;
	}

	// Set the theme to "default", "auto", "light" or "dark".
	// Here, "default" simply maps to "auto".
	public setTheme(name: string) {
		if (name === "default") name = "auto";
		this.themeName = name;
		this.applyColorTheme();
	}

	// check whether the editor has the keyboard focus
	public hasFocus() {
		return document.activeElement === this.dom_focus;
	}

	// give keyboard focus to the editor
	public focus() {
		if (document.activeElement === this.dom_focus) return;
		this.dom_focus.focus();
		window.setTimeout(() => {
			this.dom_focus.focus();
		}, 0);
	}

	// remove keyboard focus from the editor
	public blur() {
		if (document.activeElement !== this.dom_focus) return;
		this.dom_focus.blur();
		window.setTimeout(() => {
			this.dom_focus.blur();
		}, 0);
	}

	// An application can set the following event callbacks:
	//   focus() is triggered when the editor gains focus.
	//   blur() is triggered when the editor loses focus.
	//   changed(line, removed, inserted) is triggered after the
	//       document has changed. If the change involves line
	//       breaks then line is the start line of the change,
	//       removed is the number of lines removed, and inserted
	//       is the number of additional lines. This information
	//       allows to keep track of break points. For changes
	//       not modifying the line structure, all three
	//       parameters are null.
	//   barDraw(begin, end) takes a range begin:end of lines.
	//       It is expected to return an array of nulls or strings,
	//       one per line, to be drawn into the icon bar. Since the
	//       bar is narrow, single-character strings are expected.
	//   barClick(line) is triggered when the bar is clicked. The
	//       line number is provided as an argument.
	public setEventHandler(name: string, handler: any) {
		if (handler) this.eventHandlers[name] = handler;
		else delete this.eventHandlers[name];
	}

	// obtain the current cursor position as an object {row, col}
	public getCursorPosition() {
		let iter = new Iterator(this.document);
		iter.setPosition(this.document.cursor);
		return { row: iter.row, col: iter.col };
	}

	// set the cursor position; nothing will be selected
	public setCursorPosition(row: number, col: number) {
		let iter = new Iterator(this.document);
		iter.setCoordinates(row, col);
		this.document.cursor = iter.pos;
		this.document.selection = null;
		this.scrollIntoView();
		this.draw();
	}

	// set the cursor position; nothing will be selected
	// The difference to setCursorPosition is that ch is the character in the line, so a tabulator is a single character.
	public setCursorPositionByCharacter(row: number, ch: number) {
		let iter = new Iterator(this.document);
		iter.setCoordinates(row, 0);
		for (let i = 0; i < ch; i++) iter.advance();
		this.document.cursor = iter.pos;
		this.document.selection = null;
		this.scrollIntoView();
		this.draw();
	}

	// canvas drawing, including bars and content.
	public draw() {
		if (!this.offscreen) return;

		let w = this.offscreen.width;
		let h = this.offscreen.height;

		let dw = this.document.width();
		let dh = this.document.height();
		let top = Math.min(dh, Math.floor(this.scroll_y / this.em));
		let bottom = Math.min(dh, Math.ceil((h + this.scroll_y) / this.em));
		let left = Math.floor(this.scroll_x / this.charwidth);
		let right = Math.ceil((w + this.scroll_x) / this.charwidth);

		// draw line numbers
		{
			let ctx = this.dom_bar_linenumbers.getContext(
				"2d"
			) as CanvasRenderingContext2D;
			ctx.fillStyle = this.theme.bars.linenumbers.background;
			ctx.fillRect(
				0,
				0,
				this.dom_bar_linenumbers.width,
				this.dom_bar_linenumbers.height
			);
			ctx.fillStyle = this.theme.bars.linenumbers.color;
			ctx.font = 0.8 * this.fontsize + "px monospace";
			ctx.textAlign = "right";
			ctx.textBaseline = "top";
			let x = this.dom_bar_linenumbers.width - 2;
			for (let line = top; line < bottom; line++) {
				let y =
					this.em * line +
					0.1 * this.fontsize +
					this.tpad -
					this.scroll_y;
				ctx.fillText(String(line + 1), x, y);
			}
		}

		// draw icons
		{
			let w = this.dom_bar_icon.width;
			let ctx = this.dom_bar_icon.getContext(
				"2d"
			) as CanvasRenderingContext2D;
			ctx.fillStyle = this.theme.bars.icons.background;
			ctx.fillRect(0, 0, w, this.dom_bar_icon.height);
			if (this.eventHandlers.barDraw) {
				ctx.font = 0.8 * this.fontsize + "px monospace";
				ctx.textAlign = "left";
				ctx.textBaseline = "top";
				ctx.fillStyle = this.theme.bars.icons.color;
				let a = this.eventHandlers.barDraw(top, bottom);
				for (let line = top; line < bottom; line++) {
					let e = a[line - top];
					if (!e) continue;
					let y =
						this.em * line +
						0.1 * this.fontsize +
						this.tpad -
						this.scroll_y;
					ctx.fillText(e, 1, y, w - 4);
				}
			}
		}

		// draw text
		{
			const colors = this.theme.content.highlight;
			let v = this.document.view(top, bottom, left, right);
			let ctx = this.offscreen.getContext(
				"2d"
			) as OffscreenCanvasRenderingContext2D;
			ctx.fillStyle = this.theme.content.background;
			ctx.fillRect(0, 0, this.offscreen.width, this.offscreen.height);
			ctx.globalAlpha = this.readOnly ? 0.6 : 1.0;
			ctx.textAlign = "left";
			ctx.textBaseline = "top";
			let index = 0;
			for (let line = top; line < bottom; line++) {
				let y = this.em * line - this.scroll_y;
				let yc = y + +this.tpad;
				let sel0 = right,
					sel1 = left,
					cursorline = false;
				let backup = index;
				for (let ch = left; ch < right; ch++) {
					let bits = (v[index] / 0x2000000) | 0;
					if (bits & 4) cursorline = true;
					if (bits & 1) {
						sel0 = Math.min(sel0, ch);
						sel1 = Math.max(sel1, ch + 1);
					}
					index++;
				}
				if (cursorline) {
					// highlight the line containing the cursor
					ctx.fillStyle =
						this.theme.content.cursorline[this.hasFocus() ? 0 : 1];
					ctx.fillRect(0, y, w, this.em);
				}
				if (sel0 < sel1) {
					// draw the current selection
					let x0 = this.charwidth * sel0 + this.hpad - this.scroll_x;
					let x1 = this.charwidth * sel1 + this.hpad - this.scroll_x;
					ctx.fillStyle =
						this.theme.content.selection[this.hasFocus() ? 0 : 1];
					ctx.fillRect(x0, y, x1 - x0, this.em);
				}
				index = backup;
				for (let ch = left; ch < right; ch++) {
					let x = this.charwidth * ch + this.hpad - this.scroll_x;
					let bracket = (v[index] / 0x20000000) & 3;
					if (bracket > 0) {
						// draw bracket background highlight
						ctx.fillStyle = this.theme.content.bracket[bracket - 1];
						ctx.fillRect(x, y, this.charwidth, this.em);
					}
					let uni = v[index] & 0x1fffff;
					let col = (v[index] / 0x200000) & 15;
					if (uni > 32) {
						// draw the character
						ctx.fillStyle = colors[col];
						ctx.fillText(
							String.fromCodePoint(uni),
							x,
							yc,
							this.charwidth
						);
					}
					if (v[index] & 0x4000000) {
						// draw the cursor
						ctx.fillStyle = colors[0];
						ctx.fillRect(
							x - 0.04 * this.charwidth,
							y + 0.05 * this.em,
							0.08 * this.charwidth,
							0.9 * this.em
						);
					}
					index++;
				}
			}
			ctx.globalAlpha = 1.0;

			// copy to visible canvas
			if (w > 0 && h > 0)
				this.dom_display
					.getContext("2d")!
					.putImageData(ctx.getImageData(0, 0, w, h), 0, 0);
		}
	}

	// scroll such that the given row/col position comes into view
	public scrollTo(row: number, col: number, center: boolean = false) {
		let pgx = this.offscreen.width - this.charwidth;
		let pgy = this.offscreen.height - this.em;

		if (center) {
			this.scroll_x = Math.max(0, this.em * row + this.hpad - pgy / 2);
			this.scroll_y = Math.max(0, this.charwidth * col - pgx / 2);
			window.setTimeout(() => {
				this.dom_scroller.scrollLeft =
					this.scroll_x / window.devicePixelRatio;
				this.dom_scroller.scrollTop =
					this.scroll_y / window.devicePixelRatio;
			}, 0);
		} else {
			if (this.em * row < this.scroll_y) {
				this.scroll_y = this.em * row;
				window.setTimeout(() => {
					this.dom_scroller.scrollTop =
						this.scroll_y / window.devicePixelRatio;
				}, 0);
			} else if (this.em * row > this.scroll_y + pgy) {
				this.scroll_y = this.em * row - pgy;
				window.setTimeout(() => {
					this.dom_scroller.scrollTop =
						this.scroll_y / window.devicePixelRatio;
				}, 0);
			}

			if (this.charwidth * col - this.hpad < this.scroll_x) {
				this.scroll_x = Math.max(0, this.charwidth * col - this.hpad);
				window.setTimeout(() => {
					this.dom_scroller.scrollLeft =
						this.scroll_x / window.devicePixelRatio;
				}, 0);
			} else if (this.charwidth * col + this.hpad > this.scroll_x + pgx) {
				this.scroll_x = this.charwidth * col + this.hpad - pgx;
				window.setTimeout(() => {
					this.dom_scroller.scrollLeft =
						this.scroll_x / window.devicePixelRatio;
				}, 0);
			}
		}
	}

	// Change the scroll position such that the given iterator comes into view.
	// If no iterator is provided then the document cursor is used.
	public scrollIntoView(
		iter: Iterator | null = null,
		center: boolean = false
	) {
		if (iter === null) {
			iter = new Iterator(this.document);
			iter.setPosition(this.document.cursor);
		}
		this.scrollTo(iter.row, iter.col, center);
	}

	// return true if the document has unsaved changes
	public isDirty() {
		return this.document.isDirty();
	}

	// declare the current document state as clean
	public setClean() {
		this.document.setClean();
	}

	// test whether the editor is in read-only mode
	public isReadOnly() {
		return this.readOnly;
	}

	// set or clear read-only mode
	public setReadOnly(readOnly: boolean) {
		if (readOnly === this.readOnly) return;
		this.readOnly = readOnly;
		if (readOnly) {
			this.dom_search_replacement.setAttribute("disabled", "disabled");
			this.dom_search_replace.setAttribute("disabled", "disabled");
			this.dom_search_replaceall.setAttribute("disabled", "disabled");
			this.dom_focus.setAttribute("contenteditable", "false");
		} else {
			this.dom_search_replacement.removeAttribute("disabled");
			this.dom_search_replace.removeAttribute("disabled");
			this.dom_search_replaceall.removeAttribute("disabled");
			this.dom_focus.setAttribute("contenteditable", "true");
		}
		this.draw();
	}

	// Return an object holding arbitrary extension properties,
	// i.e., data attached to the editor/document instance. The
	// mechanisms helps to attach data that is not the business
	// of the core editor itself, but linked to it by the
	// application. In the IDE, it is used for the filename, the
	// panel ID, and for managing breakpoints.
	public properties() {
		return this.document.properties;
	}

	// Recalculate element sizes based on document changes. This affects
	// the sizer element used for scrolling as well as the width of the
	// line number display, which may trigger a size change of the
	// content canvas.
	private docChanged() {
		let dw = this.document.width();
		let dh = this.document.height();

		this.dom_sizer.style.width =
			(dw * this.charwidth + 2 * this.hpad) / window.devicePixelRatio +
			"px";
		this.dom_sizer.style.height =
			(dh * this.em) / window.devicePixelRatio + "px";

		let digits = Math.floor(Math.log10(dh) + 1);
		if (digits !== this.digits) {
			this.digits = digits;
			this.dom_bar_linenumbers.width = this.digits * this.lnwidth + 6;
			this.dom_bar_linenumbers.style.width =
				this.dom_bar_linenumbers.width / window.devicePixelRatio + "px";
		}
	}

	// Set the target horizontal cursor position to the current cursor position.
	private setTarget(x: number | null = null) {
		if (x === null) {
			let iter = new Iterator(this.document);
			iter.setPosition(this.document.cursor);
			this.target_x = iter.col;
		} else this.target_x = x;
	}

	// Return a range begin:end of selected lines. If nothing is
	// selected then return line:line+1, where line contains the cursor.
	private selectedLines() {
		let iter = new Iterator(this.document);
		iter.setPosition(this.document.cursor);
		let begin_line = iter.row;
		let end_line = iter.row + 1;
		if (this.document.selection !== null) {
			let sel = new Iterator(this.document);
			sel.setPosition(this.document.selection);
			let line = sel.row;
			if (sel.pos < iter.pos) {
				begin_line = sel.row;
				if (iter.col === 0) end_line--;
			} else {
				end_line = sel.row + 1;
				if (sel.col === 0) end_line--;
			}
		}
		return [begin_line, end_line];
	}

	// Create, execute, and add a SimpleAction.
	private simpleAction(ins: null | string | Uint32Array) {
		if (this.readOnly) return;

		let pos = this.document.cursor;
		let rem = 0;
		if (this.document.selection !== null) {
			rem = Math.abs(pos - this.document.selection);
			pos = Math.min(pos, this.document.selection);
		}
		if (typeof ins === "string") {
			if (ins.length === 0) ins = null;
			else ins = Document.str2arr(ins);
		}
		let action = new SimpleAction(
			this.document,
			pos,
			rem,
			ins ? ins : null
		);
		this.document.execute(action, true);
		this.scrollIntoView();
		if (this.eventHandlers.changed) {
			let { line, removed, inserted } = action.linesChanged(
				this.document
			);
			this.eventHandlers.changed(line, removed, inserted);
		}
	}

	private onScroll(event: any = null) {
		let x = this.dom_scroller.scrollLeft;
		let y = this.dom_scroller.scrollTop;
		this.scroll_x = window.devicePixelRatio * x;
		this.scroll_y = window.devicePixelRatio * y;
		this.draw();
	}

	private onFocus(event: Event) {
		this.draw();
		if (this.eventHandlers.focus) this.eventHandlers.focus();
	}

	private onBlur(event: Event) {
		this.draw();
		if (this.eventHandlers.blur) this.eventHandlers.blur();
	}

	private onKey(event: KeyboardEvent) {
		// skip some keys early on
		if (
			Editor._modifierKeys.has(event.key) ||
			event.key === "Dead" ||
			event.key === "Unidentified"
		)
			return true;
		let key = event.key; // modifiable variable

		// Compose a unique key name string for key bindings. The order of modifiers is shift, control, alt.
		let keyname = "";
		if (event.shiftKey) keyname += "shift+";
		if (event.ctrlKey || event.metaKey) keyname += "ctrl+"; // includes "cmd" on mac
		if (event.altKey) keyname += "alt+";
		keyname += key.toLowerCase();

		if (this.keybindings.has(keyname)) {
			// configurable hotkey
			let bound = this.keybindings.get(keyname);
			if (bound === "find") {
				// open find dialog
				this.dom_search.style.display = "flex";
				this.dom_search_key.focus();
				this.dom_search_key.select();
			} else if (bound === "find next") {
				// call the find function using the value already entered into the hidden controls
				this.onFind();
			} else if (bound === "replace" && !this.readOnly) {
				// open find&replace dialog
				this.dom_search.style.display = "flex";
			} else if (bound === "select all") {
				this.document.selection = 0;
				this.document.cursor = this.document.size();
			} else if (bound === "undo" && !this.readOnly) {
				let action = this.document.undo();
				this.scrollIntoView();
				if (this.eventHandlers.changed) {
					if (action && action instanceof SimpleAction) {
						let { line, removed, inserted } = action.linesChanged(
							this.document
						);
						this.eventHandlers.changed(line, inserted, removed); // swap of inserted and removed is intentional!
					} else this.eventHandlers.changed(null, null, null);
				}
			} else if (bound === "redo" && !this.readOnly) {
				let action = this.document.redo();
				this.scrollIntoView();
				if (this.eventHandlers.changed) {
					if (action && action instanceof SimpleAction) {
						let { line, removed, inserted } = action.linesChanged(
							this.document
						);
						this.eventHandlers.changed(line, removed, inserted);
					} else this.eventHandlers.changed(null, null, null);
				}
			} else if (bound === "toggle comment" && !this.readOnly) {
				// toggle line comments
				let marker = this.document.language.linecomment;
				if (marker) {
					let len = marker.length;
					let [begin, end] = this.selectedLines();

					// test whether we need to comment or uncomment
					let commented = true;
					for (let line = begin; line < end; line++) {
						let iter = new Iterator(this.document);
						iter.setCoordinates(line, 0);

						let range = this.document.range(
							iter.pos,
							iter.pos + len
						);
						let match = true;
						for (let i = 0; i < len; i++) {
							if (range[i] !== marker[i]) {
								match = false;
								break;
							}
						}
						if (!match) {
							commented = false;
							break;
						}
					}

					// create and execute the appropriate action
					let action = commented
						? new UncommentAction(this.document, begin, end)
						: new CommentAction(this.document, begin, end);
					this.document.execute(action);
					this.scrollIntoView();
					if (this.eventHandlers.changed)
						this.eventHandlers.changed(null, null, null);
				}
			} else if (bound === "bracket") {
				// jump to matching bracket
				let result = this.document.matchingBracket(
					this.document.cursor
				);
				if (result.status === "match") {
					this.document.cursor = result.position;
					this.document.selection = null;
					this.scrollIntoView();
					this.draw();
				}
			}
		} else if (Editor._cursorKeys.has(key)) {
			// cursor key
			if (event.shiftKey) {
				if (this.document.selection === null)
					this.document.selection = this.document.cursor;
			} else this.document.selection = null;

			if (key === "ArrowUp") {
				if (event.ctrlKey) {
					// scroll up by one row without moving the cursor
					this.dom_scroller.scrollTop -=
						this.em / window.devicePixelRatio;
				} else {
					// move up by one row
					let iter = new Iterator(this.document);
					iter.setPosition(this.document.cursor);
					let y = iter.row;
					if (y > 0) {
						iter.setCoordinates(y - 1, this.target_x);
						this.document.cursor = iter.pos;
						this.scrollIntoView(iter);
					}
				}
			} else if (key === "ArrowDown") {
				if (event.ctrlKey) {
					// scroll down by one row without moving the cursor
					this.dom_scroller.scrollTop +=
						this.em / window.devicePixelRatio;
				} else {
					// move down by one row
					let iter = new Iterator(this.document);
					iter.setPosition(this.document.cursor);
					let y = iter.row;
					iter.setCoordinates(y + 1, this.target_x);
					this.document.cursor = iter.pos;
					this.scrollIntoView(iter);
				}
			} else if (key === "ArrowLeft") {
				if (event.ctrlKey) {
					// move left by one word
					if (this.document.cursor > 0) {
						let iter = new Iterator(this.document);
						iter.setPosition(this.document.cursor);
						let c = iter.before();
						let t = Document.chartype(c);
						if (t === 0) iter.back();
						else {
							if (t === 1) {
								iter.back();
								while (iter.pos > 0) {
									c = iter.before();
									if (Document.chartype(c) !== t) break;
									iter.back();
								}
							}

							if (
								iter.pos > 0 &&
								(iter.pos === this.document.cursor || c !== 10)
							) {
								iter.back();
								c = iter.character();
								let t = Document.chartype(c);
								if (t >= 2) {
									while (iter.pos > 0) {
										let c = iter.before();
										if (Document.chartype(c) !== t) break;
										iter.back();
									}
								}
							}
						}
						this.document.cursor = iter.pos;
						this.setTarget();
					}
				} else {
					// move left by one character
					if (this.document.cursor > 0) {
						this.document.cursor--;
						this.setTarget();
						this.scrollIntoView();
					}
				}
			} else if (key === "ArrowRight") {
				if (event.ctrlKey) {
					// move right by one word
					if (this.document.cursor < this.document.size()) {
						let iter = new Iterator(this.document);
						iter.setPosition(this.document.cursor);
						let c = iter.character();
						let t = Document.chartype(c);
						if (t === 0) iter.advance();
						else {
							if (t === 1) {
								iter.advance();
								while (!iter.atEnd()) {
									let c = iter.character();
									if (Document.chartype(c) !== t) break;
									iter.advance();
								}
							}

							if (!iter.atEnd()) {
								let c = iter.character();
								let t = Document.chartype(c);
								iter.advance();
								if (t >= 2) {
									while (!iter.atEnd()) {
										let c = iter.character();
										if (Document.chartype(c) !== t) break;
										iter.advance();
									}
								}
							}
						}
						this.document.cursor = iter.pos;
						this.setTarget();
					}
				} else {
					// move right by one character
					if (this.document.cursor < this.document.size()) {
						this.document.cursor++;
						this.setTarget();
						this.scrollIntoView();
					}
				}
			} else if (key === "PageUp") {
				if (event.ctrlKey) {
					// scroll up by N rows without moving the cursor
					let lines = Math.max(
						1,
						(this.offscreen.height / this.em - 1) | 0
					);
					this.dom_scroller.scrollTop -=
						(lines * this.em) / window.devicePixelRatio;
				} else {
					// move up by N rows
					let lines = Math.max(
						1,
						(this.offscreen.height / this.em - 1) | 0
					);
					let iter = new Iterator(this.document);
					iter.setPosition(this.document.cursor);
					let y = Math.max(0, iter.row - lines);
					iter.setCoordinates(y, this.target_x);
					this.document.cursor = iter.pos;
					this.scrollIntoView(iter);
				}
			} else if (key === "PageDown") {
				if (event.ctrlKey) {
					// scroll down by N rows without moving the cursor
					let lines = Math.max(
						1,
						(this.offscreen.height / this.em - 1) | 0
					);
					this.dom_scroller.scrollTop +=
						(lines * this.em) / window.devicePixelRatio;
				} else {
					// move down by N rows
					let lines = Math.max(
						1,
						(this.offscreen.height / this.em - 1) | 0
					);
					let iter = new Iterator(this.document);
					iter.setPosition(this.document.cursor);
					iter.setCoordinates(iter.row + lines, this.target_x);
					this.document.cursor = iter.pos;
					this.scrollIntoView(iter);
				}
			} else if (key === "Home") {
				if (event.ctrlKey) {
					// move to the start of the document
					this.document.cursor = 0;
					this.setTarget();
					this.scrollIntoView();
				} else {
					// "smart" home
					let iter = new Iterator(this.document);
					iter.setPosition(this.document.cursor);
					let x = iter.col,
						y = iter.row;
					iter.setCoordinates(y, 0);
					let h0 = iter.pos;
					while (iter.character() === 9 || iter.character() === 32)
						iter.advance();
					let h1 = iter.pos;
					this.document.cursor =
						this.document.cursor === h1 ? h0 : h1;
					this.setTarget();
					this.scrollIntoView();
				}
			} else if (key === "End") {
				if (event.ctrlKey) {
					// move to the end of the document
					this.document.cursor = this.document.size();
					this.setTarget();
					this.scrollIntoView();
				} else {
					// move to the end of the line
					let iter = new Iterator(this.document);
					iter.setPosition(this.document.cursor);
					let y = iter.row;
					iter.setCoordinates(y + 1, 0);
					this.document.cursor =
						iter.pos - (iter.col === 0 && iter.row > y ? 1 : 0);
					this.setTarget();
					this.scrollIntoView();
				}
			}
		} else if (Editor._specialKeys.has(key)) {
			// special editing action
			if (key === "Tab" && !this.readOnly) {
				if (event.shiftKey) {
					// unindent the current selection
					let [begin, end] = this.selectedLines();
					let action = new UnindentAction(this.document, begin, end);
					if (!action.trivial()) {
						this.document.execute(action);
						this.scrollIntoView();
						if (this.eventHandlers.changed)
							this.eventHandlers.changed(null, null, null);
					}
				} else {
					if (
						this.document.selection !== null &&
						this.document.selection !== this.document.cursor
					) {
						// indent the current selection
						let [begin, end] = this.selectedLines();
						let action = new IndentAction(
							this.document,
							begin,
							end
						);
						this.document.execute(action);
						this.scrollIntoView();
						if (this.eventHandlers.changed)
							this.eventHandlers.changed(null, null, null);
					} else {
						// insert a tabulator as a simple "typing" action
						this.simpleAction("\t");
					}
				}
			} else if (key === "Backspace" && !this.readOnly) {
				if (
					this.document.selection !== null &&
					this.document.selection !== this.document.cursor
				) {
					// delete selection
					this.simpleAction(null);
				} else {
					// delete key left of the cursor
					if (this.document.cursor > 0) {
						this.document.selection = this.document.cursor - 1;
						this.simpleAction(null);
					}
				}
			} else if (key === "Delete" && !this.readOnly) {
				if (
					this.document.selection !== null &&
					this.document.selection !== this.document.cursor
				) {
					// delete selection
					this.simpleAction(null);
				} else {
					// delete key right of the cursor
					if (this.document.cursor < this.document.size()) {
						this.document.selection = this.document.cursor + 1;
						this.simpleAction(null);
					}
				}
			} else if (key === "Enter" && !this.readOnly) {
				// insert "\n" followed by the current indentation, but at most up to the cursor position
				let iter = new Iterator(this.document);
				iter.setPosition(this.document.cursor);
				let row = iter.row;
				iter.setCoordinates(row, 0);
				let ins = [10];
				while (
					(iter.character() === 9 || iter.character() === 32) &&
					iter.pos < this.document.cursor
				) {
					ins.push(iter.character());
					iter.advance();
				}
				this.simpleAction(new Uint32Array(ins));
			} else if (key === "Escape") {
				this._closeSearch();
			}
		} else return true;

		event.preventDefault();
		event.stopPropagation();
		this.docChanged();
		this.draw();
	}

	private onInput(event: any) {
		if (this.readOnly) return;

		if (
			event.inputType === "insertText" ||
			(event.inputType === "insertCompositionText" &&
				!event.isComposing) ||
			event.inputType === "insertFromComposition" // needed for webkit
		) {
			this.simpleAction(event.data);
			this.docChanged();
			this.draw();
			this.dom_focus.innerHTML = ""; // TODO: this line kills the document bar!?!
		} else if (
			event.inputType === "insertLineBreak" ||
			event.inputType === "insertParagraph"
		) {
			this.simpleAction("\n");
			this.docChanged();
			this.draw();
			this.dom_focus.innerHTML = "";
		}
	}

	private onCut(event: ClipboardEvent) {
		let s = this.selection();
		if (s.length > 0 && event.clipboardData && !this.readOnly) {
			this.simpleAction(null);
			event.clipboardData.setData("text/plain", s);
			event.preventDefault();
			event.stopPropagation();
			this.docChanged();
			this.draw();
		}
	}

	private onCopy(event: ClipboardEvent) {
		let s = this.selection();
		if (s.length > 0 && event.clipboardData) {
			event.clipboardData.setData("text/plain", s);
			event.preventDefault();
			event.stopPropagation();
		}
	}

	private onPaste(event: ClipboardEvent) {
		let selected =
			this.document.selection !== null &&
			this.document.selection !== this.document.cursor;
		if (event.clipboardData && !this.readOnly) {
			let s = event.clipboardData.getData("Text");
			if (selected || s.length > 0) {
				this.simpleAction(s);
				this.docChanged();
				this.draw();
			}
		}
		event.preventDefault();
		event.stopPropagation();
		this.dom_focus.innerHTML = "";
	}

	// translate pointer coordinates into canvas coordinates
	// and determine the position within the document
	private _processPointer(
		event: PointerEvent | MouseEvent,
		cutoff: boolean = false
	) {
		// canvas pixel coordinates
		let x = Math.round(event.offsetX * window.devicePixelRatio) | 0;
		let y = Math.round(event.offsetY * window.devicePixelRatio) | 0;

		// character grid coordinates
		let cx = Math.round((x - this.hpad) / this.charwidth) | 0;
		let cy = Math.floor(y / this.em) | 0;
		if (cx < 0) cx = 0;

		// find the position within the document
		let iter = new Iterator(this.document);
		iter.setCoordinates(cy, cx);

		return {
			pos: iter.pos,
			row: iter.row,
			col: iter.col,
			bx: x,
			by: y,
			cx: cx,
			cy: cy,
			iter: iter,
		};
	}

	private onPointerStart(event: PointerEvent) {
		if (event.target !== this.dom_sizer) return; // most probably, a scroll bar is moved
		let desc = this._processPointer(event);
		this.dom_focus.focus();

		// acquire pointer capture
		this.capture = event.pointerId;
		this.dom_sizer.setPointerCapture(this.capture);

		// set cursor and selection
		if (this.document.selection === null) {
			if (event.shiftKey) this.document.selection = this.document.cursor;
			else this.document.selection = desc.pos;
		} else {
			if (!event.shiftKey) this.document.selection = desc.pos;
		}
		this.document.cursor = desc.pos;
		this.setTarget(desc.col);

		// redraw
		this.draw();
	}

	private onPointerMove(event: PointerEvent) {
		if (this.capture === null) return;

		let desc = this._processPointer(event);
		this.document.cursor = desc.pos;
		this.setTarget(desc.col);

		this.draw();
	}

	private onPointerFinish(event: PointerEvent) {
		if (this.capture === null) return;
		this.dom_sizer.releasePointerCapture(this.capture);
		this.capture = null;
		this.focus();

		let desc = this._processPointer(event);
		this.document.cursor = desc.pos;
		if (this.document.selection === this.document.cursor)
			this.document.selection = null;
		this.setTarget(desc.col);

		this.draw();
	}

	private onPointerAbort(event: PointerEvent) {
		if (this.capture === null) return;
		this.dom_sizer.releasePointerCapture(this.capture);
		this.capture = null;
	}

	private onDoubleClick(event: MouseEvent) {
		if (event.target !== this.dom_sizer) return; // most probably, a scroll bar is moved
		let desc = this._processPointer(event);
		this.dom_focus.focus();

		// find the word or number at the cursor position
		let ct = new Set([2, 3]);
		let iter = desc.iter;
		let c = iter.character();
		if (c === 0) return;
		let t = Document.chartype(c);
		if (!ct.has(t)) return;

		// set cursor and selection
		while (ct.has(Document.chartype(iter.character()))) iter.advance();
		this.document.cursor = iter.pos;
		while (ct.has(Document.chartype(iter.before()))) iter.back();
		this.document.selection = iter.pos;
		this.setTarget(desc.col); // maybe set to the cursor instead?

		// redraw
		this.draw();
	}

	private onBarClick(event: PointerEvent) {
		event.preventDefault();
		event.stopPropagation();
		this.dom_focus.focus();

		if (!this.eventHandlers.barClick) return;

		// canvas pixel coordinates
		let y = Math.round(event.offsetY * window.devicePixelRatio) | 0;

		// character grid coordinates
		let line = Math.floor((y + this.scroll_y) / this.em) | 0;

		let h = this.document.height();
		this.eventHandlers.barClick(Math.min(line, h));
		this.draw();
	}

	private _closeSearch() {
		this.dom_search.style.display = "none";
		this.focus();
	}

	private onFind() {
		let key = Document.str2arr(this.dom_search_key.value);
		let ignoreCase = this.dom_search_ignorecase.checked;

		let pos = this.document.find(
			this.document.cursor,
			key,
			ignoreCase,
			true
		);
		if (pos === null) return;

		this.document.selection = pos;
		this.document.cursor = pos + key.length;
		this.scrollIntoView();
		this.draw();
	}

	private onReplace() {
		if (this.readOnly) return;

		let key = Document.str2arr(this.dom_search_key.value);
		let replacement = Document.str2arr(this.dom_search_replacement.value);
		let ignoreCase = this.dom_search_ignorecase.checked;

		let start = this.document.cursor;
		if (this.document.selection !== null && this.document.selection < start)
			start = this.document.selection;
		let pos = this.document.find(start, key, ignoreCase, true);
		if (pos === null) return;

		if (pos === this.document.selection || pos === this.document.cursor) {
			// replace
			this.document.selection = pos;
			this.document.cursor = pos + key.length;
			this.simpleAction(replacement);
		} else {
			// move to next occurrence
			this.document.selection = pos;
			this.document.cursor = pos + key.length;
			this.scrollIntoView();
		}
		this.draw();
	}

	private onReplaceAll() {
		if (this.readOnly) return;

		let key = Document.str2arr(this.dom_search_key.value);
		let replacement = Document.str2arr(this.dom_search_replacement.value);
		let ignoreCase = this.dom_search_ignorecase.checked;

		let positions = new Array<number>();
		let start = 0,
			end = this.document.size();
		while (start < end) {
			let pos = this.document.find(start, key, ignoreCase, false);
			if (pos === null) break;
			positions.push(pos);
			start = pos + key.length;
		}
		if (positions.length === 0) return;

		let action = new ReplaceAction(
			this.document,
			positions,
			key,
			replacement
		);
		this.document.execute(action);
		this.scrollIntoView();
		if (this.eventHandlers.changed)
			this.eventHandlers.changed(null, null, null);

		this._closeSearch();
	}

	private applyColorTheme() {
		let name = this.themeName;
		if (name === "auto") {
			let dark =
				window.matchMedia &&
				window.matchMedia("(prefers-color-scheme: dark)").matches;
			name = dark ? "dark" : "light";
		}
		if (!themes.hasOwnProperty(name)) return;
		this.theme = themes[name];

		// set CSS colors directly in the DOM
		this.dom_bars.style.borderRight =
			"solid 1px " + this.theme.bars.separator;
		this.dom_content.style.background = this.theme.content.background;
		this.dom_search.style.background = this.theme.search.background;
		this.dom_search.style.color = this.theme.search.color;
		this.dom_search.style.borderTop =
			"solid 1px " + this.theme.search.separator;
		this.dom_search_close.style.color = this.theme.search.close;
		this.dom_search_key.style.background = this.theme.search.fields;
		this.dom_search_key.style.color = this.theme.search.color;
		this.dom_search_replacement.style.background = this.theme.search.fields;
		this.dom_search_replacement.style.color = this.theme.search.color;

		// redraw with new theme
		this.draw();
	}

	// Recalculate all sizes. This is called on size changes of the editor.
	// All values computed here are in SCREEN pixels, not in CSS pixels!
	// This makes contents scale in an intuitive way with browser zoom.
	private recalc() {
		let sw =
			Math.round(this.dom_content.offsetWidth * window.devicePixelRatio) |
			0;
		let sh =
			Math.round(
				this.dom_content.offsetHeight * window.devicePixelRatio
			) | 0;
		this.dom_display.width = sw;
		this.dom_display.height = sh;
		this.offscreen = new OffscreenCanvas(sw, sh);
		let ctx = this.offscreen.getContext(
			"2d"
		)! as OffscreenCanvasRenderingContext2D;
		this.fontsize = window.devicePixelRatio * 13.5; // font size
		this.tpad = 0.25 * this.fontsize; // vertical line padding (top)
		this.bpad = 0.05 * this.fontsize; // vertical line padding (bottom)
		this.em = Math.ceil(this.fontsize + this.tpad + this.bpad); // line height
		ctx.font = 0.8 * this.fontsize + "px monospace";
		this.lnwidth = Math.ceil(ctx.measureText("0").width); // line number char width in pixels
		ctx.font = this.fontsize + "px monospace";
		this.charwidth = ctx.measureText("0").width; // char width in pixels
		this.hpad = 0.5 * this.charwidth; // horizontal padding
		this.dom_bar_linenumbers.width = this.digits * this.lnwidth + 6;
		this.dom_bar_linenumbers.height = sh;
		this.dom_bar_icon.width = this.lnwidth + 4;
		this.dom_bar_icon.height = sh;
		this.dom_bar_linenumbers.style.width =
			this.dom_bar_linenumbers.width / window.devicePixelRatio + "px";
		this.dom_bar_icon.style.width =
			this.dom_bar_icon.width / window.devicePixelRatio + "px";
		this.docChanged();
		if (this.devicePixelRatio !== window.devicePixelRatio) {
			this.devicePixelRatio = window.devicePixelRatio;
			this.scrollIntoView(); // much more robust than scroll correction
		}
	}

	private static _modifierKeys = new Set([
		"Shift",
		"Control",
		"Alt",
		"AltGraph",
		"CapsLock",
		"Fn",
		"FnLock",
		"Hyper",
		"Meta",
		"NumLock",
		"ScrollLock",
		"Super",
		"Symbol",
		"SymbolLock",
	]);
	private static _cursorKeys = new Set([
		"ArrowUp",
		"ArrowDown",
		"ArrowLeft",
		"ArrowRight",
		"Home",
		"End",
		"PageUp",
		"PageDown",
	]);
	private static _specialKeys = new Set([
		"Tab",
		"Backspace",
		"Delete",
		"Enter",
		"Escape",
	]);

	public static defaultKeyBindings = new Map([
		["ctrl+f", "find"],
		["f3", "find next"],
		["ctrl+a", "select all"],
		["ctrl+z", "undo"],
		["shift+ctrl+z", "redo"],
		["ctrl+d", "toggle comment"],
		["ctrl+b", "bracket"],
	]);
}
