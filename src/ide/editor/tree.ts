import { Language } from "./language";

export const tabWidth = 4;

// Super class of all document tree nodes.
// The class used two-stage construction. It is mandatory to call recalc(...) right after the constructor!
export class Node {
	parent: null | Interior = null; // parent reference
	height: number = 0; // maximal distance to leaf
	size: number = 0; // number of characters in the sub-tree
	linebreaks: number = 0; // number of line breaks in the sub-tree
	tabulator: number = 0; // position of the first tabulator in the first line modulo tabulator width, or -1 if there is no tabulator in the first line
	firstwidth: number = 0; // display width of the first line, assuming a start right after a tabulator
	innerwidth: number = 0; // display width of the widest line fully contained within the subtree
	lastwidth: number = 0; // display width after the last line break, or if there is none, then the display width of the content assuming a start right after a tabulator.
	brackets: string = ""; // summary of non-matching bracket characters inside

	// construct the node with all of its bookkeeping data for efficient lookups
	public constructor() {}

	// update the bookkeeping data from content or children
	public recalc(language: Language): void {
		throw "override me in a subclass!";
	}

	public numberOfLeaves(): number {
		throw "override me in a subclass!";
	}

	protected static readonly bracket_l2r = { "(": ")", "[": "]", "{": "}" };
}

// interior node, containing exactly two children
export class Interior extends Node {
	left: Node; // left subtree
	right: Node; // right subtree
	leaves: number = 0; // number of leaf nodes in the subtree

	public constructor(left, right) {
		super();
		this.left = left;
		this.right = right;
		left.parent = this;
		right.parent = this;
	}

	public recalc(language) {
		this.height = Math.max(this.left.height, this.right.height) + 1;

		this.size = this.left.size + this.right.size;

		this.linebreaks = this.left.linebreaks + this.right.linebreaks;

		if (this.left.linebreaks === 0) {
			if (this.left.tabulator >= 0) this.tabulator = this.left.tabulator;
			else if (this.right.tabulator < 0) this.tabulator = -1;
			else
				this.tabulator =
					(this.left.size + this.right.tabulator) % tabWidth;
		} else this.tabulator = this.left.tabulator;

		if (this.left.linebreaks > 0) this.firstwidth = this.left.firstwidth;
		else {
			this.firstwidth = this.left.firstwidth + this.right.firstwidth;
			if (this.right.tabulator >= 0) {
				let overhang = this.left.firstwidth % tabWidth;
				this.firstwidth -= overhang;
				if (overhang + this.right.tabulator >= tabWidth)
					this.firstwidth += tabWidth;
			}
		}

		let o = Math.max(this.left.innerwidth, this.right.innerwidth);
		if (this.left.linebreaks > 0 && this.right.linebreaks > 0) {
			let b = this.left.lastwidth + this.right.firstwidth;
			if (this.right.tabulator >= 0) {
				let overhang = this.left.lastwidth % tabWidth;
				b -= overhang;
				if (overhang + this.right.tabulator >= tabWidth) b += tabWidth;
			}
			this.innerwidth = Math.max(o, b);
		} else this.innerwidth = o;

		if (this.right.linebreaks > 0) this.lastwidth = this.right.lastwidth;
		else {
			this.lastwidth = this.left.lastwidth + this.right.lastwidth;
			if (this.right.tabulator >= 0) {
				let overhang = this.left.lastwidth % tabWidth;
				this.lastwidth -= overhang;
				if (overhang + this.right.tabulator >= tabWidth)
					this.lastwidth += tabWidth;
			}
		}

		{
			let n = this.left.brackets.length;
			let m = Math.min(n, this.right.brackets.length);
			let k = 0;
			while (k < m) {
				if (
					Node.bracket_l2r[this.left.brackets[n - k - 1]] ===
					this.right.brackets[k]
				)
					k++;
				else break;
			}
			this.brackets =
				this.left.brackets.substring(0, n - k) +
				this.right.brackets.substring(k);
		}

		this.leaves = this.left.numberOfLeaves() + this.right.numberOfLeaves();
	}

	public numberOfLeaves() {
		return this.leaves;
	}
}

export class Leaf extends Node {
	data: Uint32Array; // Uint32Array storing unicode code points
	state: number; // scanner state before the first character
	prev: null | Leaf = null; // leaves form a double-linked list
	next: null | Leaf = null; // leaves form a double-linked list

	// Construct a new leaf node. The constructor does NOT take case of inserting the new leaf into the double linked list.
	// The data is not copied! That's up to the caller, if desired.
	public constructor(data, state) {
		super();
		this.data = data;
		this.state = state;
	}

	// Update all internal data based on this.data and this.state. Return the scan state at the end of the node.
	public recalc(language) {
		this.size = this.data.length;
		this.tabulator = -1;
		this.firstwidth = 0;
		this.innerwidth = 0;
		this.lastwidth = 0;
		this.linebreaks = 0;

		// The following loop is somewhat redundant with the iterator,
		// but it may still be best to keep it separate.
		let s = this.state;
		let width = 0;
		let first = true;
		let brackets = new Array<string>();
		for (let i = 0; i < this.size; i++) {
			let c = this.data[i];
			if (c < 32) {
				if (c === 9) {
					// tabulator
					if (this.linebreaks === 0 && this.tabulator < 0)
						this.tabulator = i % tabWidth;
					width += tabWidth;
					width -= width % tabWidth;
				} else if (c === 10) {
					// line break
					if (first) {
						this.firstwidth = width;
						first = false;
					} else this.innerwidth = Math.max(this.innerwidth, width);
					width = 0;
					this.linebreaks++;
				} else throw "invalid text character (" + i + "): " + c;
			} else width++;

			let result = language.process(s, c);
			s = Language.state(result);
			while (Language.again(result)) {
				result = language.process(s, c);
				s = Language.state(result);
			}
			if (Language.bracket(result)) {
				// compose bracket list
				let b = String.fromCharCode(this.data[i]);
				if (
					brackets.length > 0 &&
					Node.bracket_l2r[brackets[brackets.length - 1]] === b
				)
					brackets.pop();
				else brackets.push(b);
			}
		}
		if (first) this.firstwidth = width;
		this.lastwidth = width;
		this.brackets = brackets.join("");

		return s;
	}

	public numberOfLeaves() {
		return 1;
	}

	public static readonly minNodeSize = 128;
	public static readonly bestNodeSize = 384;
	public static readonly maxNodeSize = 512;
}
