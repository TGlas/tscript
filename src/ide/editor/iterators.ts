import { tabWidth, Node, Interior, Leaf } from "./tree";
import { Document } from "./document";
import { Language } from "./language";

// An iterator represents a position in a document.
// It keeps track of character index (pos) and layout position (row/col),
// and it can hence transform the two representations into each other.
export class Iterator {
	// (redundant) iterator state
	document: Document; // document this iterator refers to
	pos: number = 0; // character position within the document
	row: number = 0; // row within the document
	col: number = 0; // column within the document
	leaf: Leaf; // leaf node containing the position
	offset: number = 0; // offset into the node containing the position; the end is a legal offset

	// Construct an iterator, which starts at the beginning of the document.
	public constructor(document: Document) {
		this.document = document;
		this.leaf = document.begin;
	}

	// Two-stage initialization: initialize by character index.
	public setPosition(pos: number) {
		this.pos = 0;
		this.row = 0;
		this.col = 0;
		this.offset = 0;

		let node = this.document.root;
		while (node instanceof Interior) {
			if (pos >= this.pos + node.left.size) {
				this.pos += node.left.size;
				this.row += node.left.linebreaks;
				if (node.left.linebreaks === 0) {
					let t0 = node.left.tabulator;
					let w0 = node.left.lastwidth;
					if (t0 >= 0) {
						let overhang = this.col % tabWidth;
						this.col -= overhang;
						if (t0 + overhang >= tabWidth) this.col += tabWidth;
					}
					this.col += w0;
				} else this.col = node.left.lastwidth;
				node = node.right;
			} else node = node.left;
		}
		this._setleaf(node);
		this.leaf = <Leaf>node;
		while (this.pos < pos) if (!this.advance()) break;
	}

	// Two-stage initialization: initialize by row and column.
	public setCoordinates(row: number, col: number) {
		this.pos = 0;
		this.row = 0;
		this.col = 0;
		this.offset = 0;

		let node = this.document.root;
		while (node instanceof Interior) {
			if (node.left.linebreaks === 0) {
				let t0 = node.left.tabulator;
				let w0 = node.left.lastwidth;
				let midcol = this.col;
				if (t0 >= 0) {
					let overhang = this.col % tabWidth;
					midcol -= overhang;
					if (t0 + overhang >= tabWidth) midcol += tabWidth;
				}
				midcol += w0;
				if (row > this.row || (row === this.row && col >= midcol)) {
					this.pos += node.left.size;
					this.row += node.left.linebreaks;
					let t0 = node.left.tabulator;
					let w0 = node.left.lastwidth;
					if (t0 >= 0) {
						let overhang = this.col % tabWidth;
						this.col -= overhang;
						if (t0 + overhang >= tabWidth) this.col += tabWidth;
					}
					this.col += w0;
					node = node.right;
				} else node = node.left;
			} else {
				let midrow = this.row + node.left.linebreaks;
				if (
					row > midrow ||
					(row === midrow && col >= node.left.lastwidth)
				) {
					this.pos += node.left.size;
					this.row = midrow;
					this.col = node.left.lastwidth;
					node = node.right;
				} else node = node.left;
			}
		}

		this._setleaf(node);
		this.leaf = <Leaf>node;
		while (true) {
			let next_row = this.row;
			let next_col = this.col;
			let c = this.character();
			if (c === 0) break;
			if (c === 9) next_col = next_col + tabWidth - (next_col % tabWidth);
			else if (c === 10) {
				next_row++;
				next_col = 0;
			} else next_col++;

			if (next_row > row || (next_row === row && next_col > col)) break;
			if (!this.advance()) break;
		}
	}

	// Move the iterator forward by one character.
	// The function returns true if the iterator was advanced and false if it was already at EOF.
	public advance() {
		if (this.atEnd()) return false; // EOF reached

		// move the iterator
		let c = this.leaf.data[this.offset];
		if (c < 32) {
			if (c === 9) {
				// tabulator
				this.col += tabWidth;
				this.col -= this.col % tabWidth;
			} else if (c === 10) {
				// line break
				this.row++;
				this.col = 0;
			} else throw "invalid text character (" + this.pos + "): " + c;
		} else this.col++;
		this.pos++;
		this.offset++;

		this._advanced(c);

		// move to the next leaf
		if (this.offset === this.leaf.data.length) {
			if (this.leaf.next) {
				this.leaf = this.leaf.next;
				this.offset = 0;
			}
		}

		return true;
	}

	// Jump forward by n characters within the leaf, or to the beginning of the next leaf is n is omitted.
	// This function invalidates row and col, which must not be used thereafter.
	public jump(n: number | null = null) {
		let delta = this.leaf.data.length - this.offset;
		if (delta <= 0) return;
		if (n === null) n = delta;
		if (n > delta) throw "[Document.jump] invalid jump length";
		this.pos += delta;
		if (n === delta) {
			if (this.leaf.next) {
				this.leaf = this.leaf.next;
				this.offset = 0;
			}
		} else this.offset += n;
	}

	// Move backward by one character.
	// This function invalidates row and col, which must not be used thereafter.
	public back() {
		if (this.pos === 0) return;
		this.pos--;
		this.offset--;
		if (this.offset < 0) {
			this.leaf = this.leaf.prev!;
			this.offset = this.leaf.size - 1;
		}
	}

	// Return true iff the iterator is at the end of the document.
	public atEnd() {
		return this.offset === this.leaf.data.length;
	}

	// Return the character at the iterator position (or 0 at the end).
	public character() {
		return this.offset < this.leaf.data.length
			? this.leaf.data[this.offset]
			: 0;
	}

	// Return the character BEFORE the iterator position (or 0 at the beginning).
	public before() {
		if (this.pos === 0) return 0;
		if (this.offset > 0) return this.leaf.data[this.offset - 1];
		let l = this.leaf.prev as Leaf;
		return l.data[l.data.length - 1];
	}

	// internal callbacks for customization; this avoids code duplication
	public _setleaf(node) {}
	public _advanced(c) {}
}

// In addition to a plain Iterator, a HighlightingIterator runs the
// language scanner while traversing the document in order to provide
// syntax highlighting information.
export class HighlightingIterator extends Iterator {
	state: number;
	private onHighlight: (a: number, b: number, c: number, d: boolean) => void;

	// Construct a highlighting iterator.
	// The #onHighlight callback is called with the following arguments:
	//   onHighlight(back, num, highlight, bracket)
	// Its parameters have the following meaning:
	//   - back is the number of characters before the currently processed one where highlighting starts
	//   - num is the number of consecutive characters to be highlighted
	//   - highlight is the color/style index
	//   - bracket is true if the character is an active bracket
	public constructor(
		document: Document,
		onHighlight: (a: number, b: number, c: number, d: boolean) => void
	) {
		super(document);
		this.state = this.leaf.state; // scanner state at the iterator position
		this.onHighlight = onHighlight; // callback; invoked as soon as highlighting becomes unambiguous
	}

	public setPosition(pos: number) {
		let backup = this.onHighlight;
		this.onHighlight = (a, b, c, d) => {};
		super.setPosition(pos);
		this.onHighlight = backup;
	}

	public setCoordinates(row: number, col: number) {
		let backup = this.onHighlight;
		this.onHighlight = (a, b, c, d) => {};
		super.setCoordinates(row, col);
		this.onHighlight = backup;
	}

	public _setleaf(node: Leaf) {
		this.state = node.state;
	}

	public _advanced(c: number) {
		// scan the character
		let p0 = this.document.language.num_pending[this.state];
		let entry = this.document.language.process(this.state, c);
		this.state = Language.state(entry);
		let p1 = Language.pending(entry);
		if (Language.again(entry)) {
			if (p1 < p0)
				this.onHighlight(
					p0,
					p0 - p1,
					Language.highlight(entry),
					Language.bracket(entry)
				);
			entry = this.document.language.process(this.state, c);
			this.state = Language.state(entry);
			let p2 = Language.pending(entry);
			if (p2 <= p1)
				this.onHighlight(
					p1,
					p1 + 1 - p2,
					Language.highlight(entry),
					Language.bracket(entry)
				);
		} else {
			if (p1 <= p0)
				this.onHighlight(
					p0,
					p0 + 1 - p1,
					Language.highlight(entry),
					Language.bracket(entry)
				);
		}
	}
}
