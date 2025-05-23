import { Iterator } from "./iterators";
import { tabWidth, Node, Interior, Leaf } from "./tree";
import { Document } from "./document";

// Abstract super class of all actions, defining only the interface.
// An action represents a modification of the document that can be
// applied and reverted arbitrarily often.
// Actions shall be lightweight. Therefore, they do not store a
// reference to the document.
export class Action {
	public constructor() {}

	// Apply the action. The parameter #redo is false on "do" and true on "redo".
	// The method alters the document, the cursor position, and the selection.
	public execute(document, redo) {
		throw "override me in all sub-classes";
	}

	// Revert the action.
	// The method alters the document, the cursor position, and the selection.
	public revert(document) {
		throw "override me in all sub-classes";
	}

	public static empty = new Uint32Array(0);
	public static tab = new Uint32Array([9]);
}

export interface LineStructureChange {
	/** the start line of the change */
	line: number;
	/** the number of additional lines */
	inserted: number;
	/** the number of lines removed */
	removed: number;
}

// A simple action operates at a single location in the document.
// It can remove and insert characters. The constructor expects the
// following formats for #remove and #insert:
//   - null indicates that nothing is removed or inserted
//   - Uint32Array representing the actual content (must be independent of the document tree)
//   - number is valid for remove only, it indicates the number of character to be removed
export class SimpleAction extends Action {
	pos: number;
	remove: Uint32Array;
	insert: Uint32Array;
	canMerge: boolean;

	public constructor(
		document: Document,
		pos: number,
		remove: number | null | Uint32Array = null,
		insert: null | Uint32Array = null,
		canMerge: boolean = true
	) {
		super();
		this.pos = pos;
		this.remove = remove
			? typeof remove === "number"
				? document.range(pos, pos + remove)
				: remove
			: Action.empty;
		this.insert = insert ? insert : Action.empty;
		this.canMerge = canMerge;
	}

	public execute(document, redo) {
		document._modify(this.pos, this.remove.length, this.insert);
		document.selection = redo && this.insert.length > 0 ? this.pos : null;
		document.cursor = this.pos + this.insert.length;
	}

	public revert(document) {
		document._modify(this.pos, this.insert.length, this.remove);
		document.selection = this.pos;
		document.cursor = this.pos + this.remove.length;
	}

	/**
	 * Return an object { line, removed, inserted } of line changes
	 * as it is needed for the "changed" event of the editor.
	 */
	public linesChanged(document: Document): LineStructureChange | null {
		let nr = 0,
			ni = 0;
		for (let c of this.remove) if (c === 10) nr++;
		for (let c of this.insert) if (c === 10) ni++;
		if (nr + ni === 0) return null;
		let iter = new Iterator(document);
		iter.setPosition(this.pos);
		return { line: iter.row, removed: nr, inserted: ni };
	}
}

// An IndentAction insert a tabulator at the start of a range
// begin:end of lines.
export class IndentAction extends Action {
	private readonly beginLine: number;
	private readonly endLine: number;

	public constructor(document, beginLine, endLine) {
		super();
		this.beginLine = beginLine;
		this.endLine = endLine;
	}

	public execute(document, redo) {
		for (let line = this.beginLine; line < this.endLine; line++) {
			let iter = new Iterator(document);
			iter.setCoordinates(line, 0);
			document._modify(iter.pos, 0, Action.tab);
		}
		let iter = new Iterator(document);
		iter.setCoordinates(this.beginLine, 0);
		document.selection = iter.pos;
		iter.setCoordinates(this.endLine, 0);
		document.cursor = iter.pos;
	}

	public revert(document) {
		for (let line = this.beginLine; line < this.endLine; line++) {
			let iter = new Iterator(document);
			iter.setCoordinates(line, 0);
			document._modify(iter.pos, 1, Action.empty);
		}
		let iter = new Iterator(document);
		iter.setCoordinates(this.beginLine, 0);
		document.selection = iter.pos;
		iter.setCoordinates(this.endLine, 0);
		document.cursor = iter.pos;
	}
}

// An UnindentAction removes a tabulator or up to four spaces at the
// start of a range of lines. There are tabWidth+2 options per line
// (0 to tabWidth spaces and a tabulator), which are stored in one byte
// per line. Since unindent operations do nothing on unindented lines,
// it is possible to detect this case with the trivial() method.
export class UnindentAction extends Action {
	private readonly beginLine: number;
	private readonly changed: Uint8Array | null;

	public constructor(document, beginLine, endLine) {
		super();
		this.beginLine = beginLine;
		this.changed = new Uint8Array(endLine - beginLine);
		let changed = false;
		for (let i = 0; i < this.changed.length; i++) {
			let iter = new Iterator(document);
			iter.setCoordinates(this.beginLine + i, 0);
			if (iter.character() === 9) {
				this.changed[i] = tabWidth + 1;
				changed = true;
			} else if (iter.character() !== 32) this.changed[i] = 0;
			else {
				let n = 0;
				for (let i = 0; i < tabWidth; i++) {
					if (iter.character() !== 32) break;
					n++;
					iter.advance();
				}
				this.changed[i] = n;
				changed = true;
			}
		}
		if (!changed) this.changed = null;
	}

	public trivial() {
		return this.changed === null;
	}

	public execute(document, redo) {
		if (!this.changed) return;
		for (let i = 0; i < this.changed.length; i++) {
			let change = this.changed[i];
			if (change === 0) continue;
			let iter = new Iterator(document);
			iter.setCoordinates(this.beginLine + i, 0);
			document._modify(
				iter.pos,
				change > tabWidth ? 1 : change,
				Action.empty
			);
		}
		let iter = new Iterator(document);
		iter.setCoordinates(this.beginLine, 0);
		document.selection = iter.pos;
		iter.setCoordinates(this.beginLine + this.changed.length, 0);
		document.cursor = iter.pos;
	}

	public revert(document) {
		if (!this.changed) return;
		let spaces = new Uint32Array(tabWidth);
		spaces.fill(32);
		for (let i = 0; i < this.changed.length; i++) {
			let change = this.changed[i];
			if (change === 0) continue;
			let ins =
				change <= tabWidth ? spaces.subarray(0, change) : Action.tab;
			let iter = new Iterator(document);
			iter.setCoordinates(this.beginLine + i, 0);
			document._modify(iter.pos, 0, ins);
		}
		let iter = new Iterator(document);
		iter.setCoordinates(this.beginLine, 0);
		document.selection = iter.pos;
		iter.setCoordinates(this.beginLine + this.changed.length, 0);
		document.cursor = iter.pos;
	}
}

// A CommentAction insert a line comment marker at the start of a range
// begin:end of lines.
export class CommentAction extends Action {
	private readonly beginLine: number;
	private readonly endLine: number;
	private readonly cursor0: number;
	private readonly selection0: number | null;
	private readonly cursor1: number;
	private readonly selection1: number | null;

	public constructor(document, beginLine, endLine) {
		super();
		this.beginLine = beginLine;
		this.endLine = endLine;

		this.cursor0 = document.cursor;
		this.selection0 = document.selection;
		this.cursor1 = document.cursor;
		this.selection1 = document.selection;

		let len = document.language.linecomment.length;
		if (this.selection1 === null) this.cursor1 += len;
		else if (this.cursor1 < this.selection1) {
			this.cursor1 += len;
			this.selection1 += (endLine - beginLine) * len;
		} else {
			this.cursor1 += (endLine - beginLine) * len;
			this.selection1 += len;
		}
	}

	public execute(document, redo) {
		for (let line = this.beginLine; line < this.endLine; line++) {
			let iter = new Iterator(document);
			iter.setCoordinates(line, 0);
			document._modify(iter.pos, 0, document.language.linecomment);
		}
		document.cursor = this.cursor1;
		document.selection = this.selection1;
	}

	public revert(document) {
		let len = document.language.linecomment.length;
		for (let line = this.beginLine; line < this.endLine; line++) {
			let iter = new Iterator(document);
			iter.setCoordinates(line, 0);
			document._modify(iter.pos, len, Action.empty);
		}
		document.cursor = this.cursor0;
		document.selection = this.selection0;
	}
}

// An UncommentAction insert a line comment marker at the start of a
// range begin:end of lines.
export class UncommentAction extends Action {
	private readonly beginLine: number;
	private readonly endLine: number;
	private readonly cursor0: number;
	private readonly selection0: number | null;
	private readonly cursor1: number;
	private readonly selection1: number | null;

	public constructor(document, beginLine, endLine) {
		super();
		this.beginLine = beginLine;
		this.endLine = endLine;

		this.cursor0 = document.cursor;
		this.selection0 = document.selection;
		this.cursor1 = document.cursor;
		this.selection1 = document.selection;

		let len = document.language.linecomment.length;
		if (this.selection1 === null) this.cursor1 -= len;
		else if (this.cursor1 < this.selection1) {
			this.cursor1 -= len;
			this.selection1 -= (endLine - beginLine) * len;
		} else {
			this.cursor1 -= (endLine - beginLine) * len;
			this.selection1 -= len;
		}
	}

	public execute(document, redo) {
		let len = document.language.linecomment.length;
		for (let line = this.beginLine; line < this.endLine; line++) {
			let iter = new Iterator(document);
			iter.setCoordinates(line, 0);
			document._modify(iter.pos, len, Action.empty);
		}
		document.cursor = this.cursor1;
		document.selection = this.selection1;
	}

	public revert(document) {
		for (let line = this.beginLine; line < this.endLine; line++) {
			let iter = new Iterator(document);
			iter.setCoordinates(line, 0);
			document._modify(iter.pos, 0, document.language.linecomment);
		}
		document.cursor = this.cursor0;
		document.selection = this.selection0;
	}
}

// The ReplaceAction replaces a search key with a replacement as the
// result of a "replace all" operation. It is prepared for case
// insensitive search (the default). It stores all capitalization
// variants of the search key, as well as the (single) replacement.
// It actually consists of a sequence of SimpleAction objects with
// shared contents.
// Note: the #positions array is expected to hold positions at which the
// replacement is to be made, with values referring to the original
// document, i.e., before any replacements are executed.
export class ReplaceAction extends Action {
	private readonly actions: Array<Action>;
	private readonly remove: Array<Uint32Array>;
	private readonly insert: Uint32Array;

	public constructor(document, positions, remove, insert) {
		super();
		this.actions = [];
		this.remove = [];
		this.insert = insert;
		positions.sort((a, b) => a - b);
		let len = remove.length;
		let delta = insert.length - len;
		let shift = 0;
		for (let pos of positions) {
			let rem = document.range(pos, pos + len);
			let index = this.remove.length;
			for (let i = 0; i < this.remove.length; i++) {
				let equal = true;
				for (let j = 0; j < len; j++)
					if (this.remove[i][j] !== rem[j]) {
						equal = false;
						break;
					}
				if (equal) {
					index = i;
					break;
				}
			}
			if (index === this.remove.length) this.remove.push(rem);
			let action = new SimpleAction(
				document,
				pos + shift,
				this.remove[index],
				this.insert
			);
			this.actions.push(action);
			shift += delta;
		}
	}

	public execute(document, redo) {
		for (let i = 0; i < this.actions.length; i++)
			this.actions[i].execute(document, redo);
	}

	public revert(document) {
		for (let i = this.actions.length - 1; i >= 0; i--)
			this.actions[i].revert(document);
	}
}
