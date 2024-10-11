import { Node, Interior, Leaf } from "./tree";
import { Iterator, HighlightingIterator } from "./iterators";
import { Action, SimpleAction } from "./actions";
import { Language } from "./language";

// The document class represents the following data:
//  - the actual text, i.e., a sequence of characters, organized in a tree
//  - the cursor position
//  - the current selection (if any)
//  - the undo history, including a "clean" state
// It provides several highly non-trivial methods, but overall it is
// a rather thin abstraction layer, resulting in the editor fiddling
// around with some of its internals like cursor and selection.
export class Document {
	readonly language: Language; // language for syntax highlighting and bracket matching
	root: Node; // document tree
	begin: Leaf; // begin of double-linked list of leaf nodes
	end: Leaf; // end of double-linked list of leaf nodes
	cursor: number = 0; // cursor, equals one selection end
	selection: number | null = null; // null or the other selection end
	properties: any = {}; // possibility to attach arbitrary data to a document, like a file name
	private history: Array<Action> = []; // list of transactions
	private history_pos: number = 0; // number of applied transactions
	private history_clean: number = 0; // undo position of a "saved" state, which is not considered "dirty"

	public constructor(language: Language, text: string) {
		this.language = language; // language for syntax highlighting and bracket matching

		// convert the string into an array of code points
		let a = Document.str2arr(text);

		// split it into chunks
		let chunks = this._createChunks(a, 0);
		this.begin = chunks[0];
		this.end = chunks[chunks.length - 1];

		// build a tree on top of the chunks
		this.root = this._buildTree(chunks);
	}

	// convert a string to an Uint32Array of code points
	public static str2arr(text: string) {
		let n = 0;
		let a = new Uint32Array(text.length);
		for (let i = 0; i < text.length; i++) {
			let c = <number>text.codePointAt(i);
			if (c < 32 && c !== 9 && c !== 10) continue;
			a[n] = c;
			n++;
			if (c >= 65536) i++;
		}
		if (n < a.length) a = a.subarray(0, n);
		return a;
	}

	// convert an Uint32Array of code points back into a string
	public static arr2str(arr: Uint32Array) {
		if (arr.length <= 1024) return String.fromCodePoint(...arr);
		let a = new Array();
		for (let i = 0; i < arr.length; i += 1024) {
			let j = Math.min(i + 1024, arr.length);
			let s = String.fromCodePoint(...arr.slice(i, j));
			a.push(s);
		}
		return a.join("");
	}

	// 0=endline, 1=whitespace, 2=letter or underscore, including most unicode characters, 3=digit, 4=punctuation (other than underscore)
	public static chartype(c: number) {
		if (c === 10) return 0;
		else if (c <= 32 || (c >= 128 && c <= 160)) return 1;
		else if (c >= 48 && c <= 57) return 3;
		else if (
			(c >= 65 && c <= 90) ||
			(c >= 97 && c <= 122) ||
			c === 95 ||
			c > 160
		)
			return 2;
		else return 4;
	}

	// return true if the document is in a "dirty" state
	public isDirty() {
		return this.history_clean !== this.history_pos;
	}

	// declare the current state as the "clean" state
	public setClean() {
		this.history_clean = this.history_pos;
	}

	// obtain the whole text represented by the document as a string
	public text() {
		let a = new Array();
		for (
			let leaf: Leaf | null = this.begin;
			leaf !== null;
			leaf = leaf.next
		)
			a.push(Document.arr2str(leaf.data));
		return a.join("");
	}

	// obtain a range of content as an Uint32Array
	public range(begin: number, end: number) {
		begin = Math.max(0, Math.min(this.root.size, begin));
		end = Math.max(begin, Math.min(this.root.size, end));

		let ret = new Uint32Array(end - begin);
		let iter = new Iterator(this);
		iter.setPosition(begin);
		let index = 0;
		while (iter.pos < end) {
			let available = iter.leaf.size - iter.offset;
			if (end - iter.pos < available) {
				ret.set(
					iter.leaf.data.subarray(
						iter.offset,
						iter.offset + end - iter.pos
					),
					index
				);
				break;
			} else {
				ret.set(
					iter.leaf.data.subarray(
						iter.offset,
						iter.offset + available
					),
					index
				);
				index += available;
				iter.jump(available);
			}
		}
		return ret;
	}

	// return the number of unicode code points
	public size() {
		return this.root.size;
	}

	// return the total number of lines, which is the number of line breaks plus one
	public height() {
		return this.root.linebreaks + 1;
	}

	// return the display width of the widest line
	public width() {
		return Math.max(
			this.root.firstwidth,
			this.root.innerwidth,
			this.root.lastwidth
		);
	}

	// return an Uint32Array of size (bottom-top) * (right-left)
	// representing one character per cell. The bits are used as follows:
	//  - bits 0-20: unicode code point (character), 0 means that the document does not cover this space
	//  - bits 21-24: highlighting code
	//  - bit 25: character is selected
	//  - bit 26: cursor position (left of this character)
	//  - bit 27: cursor is in this line
	//  - bit 28: matchable bracket
	//  - bits 29-30: bracket match (0=none, 1=matching, 2=mismatch)
	public view(top: number, bottom: number, left: number, right: number) {
		let h = bottom - top;
		let w = right - left;
		let ret = new Uint32Array(w * h);

		let bracketmatch = this.matchingBracket(this.cursor);

		let sel_begin = Math.min(
			this.cursor,
			this.selection === null ? this.cursor : this.selection
		);
		let sel_end = Math.max(
			this.cursor,
			this.selection === null ? this.cursor : this.selection
		);
		let cursor = new Iterator(this);
		cursor.setPosition(this.cursor);
		if (cursor.row >= top && cursor.row < bottom) {
			let index = (cursor.row - top) * w;
			if (cursor.col >= left && cursor.col < right) {
				ret[index + cursor.col - left] |= 0x4000000;
				if (bracketmatch.status === "match")
					ret[index + cursor.col - left] |= 0x20000000;
				else if (bracketmatch.status !== "none")
					ret[index + cursor.col - left] |= 0x40000000;
			}
			for (let i = 0; i < w; i++) ret[index++] |= 0x8000000;
		}
		if (
			bracketmatch.status === "match" ||
			bracketmatch.status === "mismatch"
		) {
			let bracket = new Iterator(this);
			bracket.setPosition(bracketmatch.position);
			if (bracket.row >= top && bracket.row < bottom) {
				let index = (bracket.row - top) * w;
				if (bracket.col >= left && bracket.col < right) {
					if (bracketmatch.status === "match")
						ret[index + bracket.col - left] |= 0x20000000;
					else ret[index + bracket.col - left] |= 0x40000000;
				}
			}
		}

		let index = 0;
		for (let y = top; y < bottom; y++) {
			let done = false;
			let x0 = left;
			let iter = new HighlightingIterator(
				this,
				(back, num, color, bracket) => {
					// apply highlighting, knowing that neither \t nor \n are affected
					let v = (0x200000 * color) | (bracket ? 0x10000000 : 0);
					for (let i = 0; i < num; i++) {
						let x = x0 - back + i;
						if (x < left) continue;
						if (x >= right) break;
						ret[index - back + i] += v;
					}
					if (x0 - back + num >= right) done = true;
				}
			);
			iter.setCoordinates(y, left);
			if (iter.atEnd()) return ret;

			while (!done) {
				let c = iter.character();
				if (c < 32) c = 32;
				if (
					this.selection !== null &&
					iter.pos >= sel_begin &&
					iter.pos < sel_end
				)
					c |= 0x2000000;
				if (!iter.advance()) return ret;
				if (iter.row > y) {
					// skip the remaining row
					if (sel_begin < iter.pos && sel_end >= iter.pos) {
						for (let x = x0; x < right; x++) ret[index++] += c;
					} else index += right - x0;
					break;
				} else {
					// fill in the character, limited to the given range
					let x1 = Math.min(right, iter.col);
					for (let x = x0; x < x1; x++) ret[index++] += c;
					x0 = iter.col;
				}
			}
		}
		// if (index !== w * h) throw "internal error (index is off)";
		return ret;
	}

	// execute a new (not yet executed) action, optionally try to merge it with the previous one for undo/redo
	public execute(action: Action, canMerge: boolean = false) {
		this.history.splice(this.history_pos);
		if (this.history_clean > this.history_pos) this.history_clean = -1; // clear state is no longer reachable
		action.execute(this, false);
		if (canMerge && this.history_pos > 0) {
			let prev = this.history[this.history_pos - 1];
			if (
				prev instanceof SimpleAction &&
				action instanceof SimpleAction
			) {
				if (
					action.remove.length === 0 &&
					prev.insert.length > 0 &&
					action.pos === prev.pos + prev.insert.length
				) {
					// merge inserts in typing order
					var data = new Uint32Array(
						prev.insert.length + action.insert.length
					);
					data.set(prev.insert);
					data.set(action.insert, prev.insert.length);
					prev.insert = data;
					return;
				}
				if (
					action.insert.length === 0 &&
					prev.remove.length > 0 &&
					action.pos + action.remove.length === prev.pos
				) {
					// merge removes in backspace order
					var data = new Uint32Array(
						prev.remove.length + action.remove.length
					);
					data.set(action.remove);
					data.set(prev.remove, action.remove.length);
					prev.pos -= action.remove.length;
					prev.remove = data;
					return;
				}
				if (
					action.insert.length === 0 &&
					prev.insert.length === 0 &&
					action.pos === prev.pos
				) {
					// merge removes in delete order
					var data = new Uint32Array(
						prev.remove.length + action.remove.length
					);
					data.set(prev.remove);
					data.set(action.remove, prev.remove.length);
					prev.remove = data;
					return;
				}
			}
		}
		this.history.push(action);
		this.history_pos++;
	}

	// undo one action (if possible)
	public undo() {
		if (this.history_pos === 0) return null;
		this.history_pos--;
		let action = this.history[this.history_pos];
		action.revert(this);
		return action;
	}

	// redo one action (if possible)
	public redo() {
		if (this.history_pos === this.history.length) return null;
		let action = this.history[this.history_pos];
		action.execute(this, true);
		this.history_pos++;
		return action;
	}

	// Find a search key in the document.
	// Return its first position starting from pos, or null if it is not found.
	// The search can be made case-insensitive, and it can wrap around the end
	// of the document.
	public find(
		start: number,
		key: Uint32Array,
		ignoreCase: boolean = true,
		wrapAround: boolean = true
	) {
		let k = key.length;
		if (k === 0) return start;

		// case-insensitive match for the Latin-1 range
		function matches(c1, c2) {
			if (ignoreCase) {
				if (c1 < 256) c1 += Document._lower[c1];
				if (c2 < 256) c2 += Document._lower[c2];
			}
			return c1 === c2;
		}

		// Analyze the search key.
		// This naive implementation is O(k^2), but that's worst case and k is supposedly small.
		let shorten = new Uint32Array(k); // by how much to reduce the match size on a non-match
		for (let i = 0; i < k; i++) {
			shorten[i] = i;

			// try different step lengths
			for (let s = 1; s < i - 1; s++) {
				let match = true;
				for (let j = 0; j < i - s; j++) {
					if (!matches(key[j], key[s + j])) {
						match = false;
						break;
					}
				}
				if (match) {
					shorten[i] = s;
					break;
				}
			}
		}

		// actual search
		let end = this.root.size;
		let matchlen = 0;
		let iter = new Iterator(this);
		if (start <= end - k) {
			// search from start to the end of the document
			iter.setPosition(start);
			while (iter.pos < end) {
				let c = iter.character();
				if (matches(c, key[matchlen])) {
					matchlen++;
				} else {
					while (true) {
						matchlen = Math.max(0, matchlen - shorten[matchlen]);
						if (matchlen === 0) break;
						if (matches(c, key[matchlen])) {
							matchlen++;
							break;
						}
					}
				}
				if (matchlen === k) return iter.pos - k + 1;
				iter.advance();
			}
		}
		if (!wrapAround) return null;

		// search from the beginning of the document to start
		iter.setPosition(0);
		end = Math.min(this.root.size, start + k - 1);
		while (iter.pos < end) {
			let c = iter.character();
			if (matches(c, key[matchlen])) {
				matchlen++;
			} else {
				while (true) {
					matchlen = Math.max(0, matchlen - shorten[matchlen]);
					if (matchlen === 0) break;
					if (matches(c, key[matchlen])) {
						matchlen++;
						break;
					}
				}
			}
			if (matchlen === k) return iter.pos - k + 1;
			iter.advance();
		}
		return null;
	}

	// The function refers to a given position, otherwise to the cursor position.
	// If a matchable bracket is at the position then it tries to find the bracket
	// matching it. It returns an object { status, position } with the following
	// possible status values:
	//   "none"     - not a matchable bracket; position is null
	//   "match"    - matching bracket was found, position points at it
	//   "mismatch" - position point to the bracket(s) causing a mismatch
	//   "missing"  - match position would exceed the document; position is null
	public matchingBracket(pos: number | null = null) {
		if (pos === null) pos = this.cursor;
		let iter = new Iterator(this);
		iter.setPosition(pos);
		let c = iter.character();
		let me = String.fromCharCode(c);

		if ("()[]{}".indexOf(me) < 0) return { status: "none", position: null };

		const open2close = { "(": ")", "[": "]", "{": "}" };
		let open = open2close.hasOwnProperty(me);
		let node: Node = iter.leaf;
		let bo = iter.offset;
		pos -= bo; // position of the start of the node

		// return a list of matchable brackets and their offsets
		let parseLeaf = (leaf, filterUnmatched) => {
			let a = new Array();
			let state = leaf.state;
			for (let i = 0; i < leaf.data.length; i++) {
				let c = leaf.data[i];
				let entry = this.language.process(state, c);
				state = Language.state(entry);
				if (Language.again(entry)) {
					entry = this.language.process(state, c);
					state = Language.state(entry);
				}
				if (Language.bracket(entry)) {
					let s = String.fromCharCode(c);
					if (
						filterUnmatched &&
						a.length > 0 &&
						s === open2close[a[a.length - 1].bracket]
					)
						a.pop();
					else a.push({ bracket: s, offset: i });
				}
			}
			return a;
		};

		// process the leaf containing the bracket
		let a = parseLeaf(node, false);

		let matchable = false;
		for (let e of a) if (e.offset === bo) matchable = true;
		if (!matchable) return { status: "none", iterator: null };

		if (open) {
			// find the index in the bracket list
			let unmatched = new Array();
			for (let e of a) {
				if (e.offset < bo) continue;

				if (open2close.hasOwnProperty(e.bracket))
					unmatched.push(e.bracket);
				else if (unmatched.length === 0)
					throw "[Document.matchingBracket] internal error (unmatched is empty)";
				else if (
					open2close[unmatched[unmatched.length - 1]] !== e.bracket
				) {
					// mismatch identified
					return { status: "mismatch", position: pos + e.offset };
				} else {
					// matching pair
					unmatched.pop();
					if (unmatched.length === 0) {
						// partner bracket found
						return { status: "match", position: pos + e.offset };
					}
				}
			}
			let index = node.brackets.length - unmatched.length; // index of the "me" bracket within node.brackets

			// climb the tree
			while (true) {
				let parent = node.parent;
				if (!parent) {
					// global mismatch
					return { status: "missing", position: null };
				}
				if (node === parent.left) {
					// we are the left child (the interesting case)
					let sibling = parent.right;
					let n = node.brackets.length;
					let m = Math.min(n, sibling.brackets.length);
					let k = 0; // number of matching brackets among siblings
					while (k < m) {
						if (
							open2close[node.brackets[n - k - 1]] ===
							sibling.brackets[k]
						)
							k++;
						else break;
					}
					if (index >= node.brackets.length - k) {
						// correct sibling found, stop climbing
						index = node.brackets.length - index - 1; // corresponding index in the sibling
						pos += node.size;
						node = sibling;
						break;
					} else {
						// continue climbing
					}
				} else {
					// we are the right sibling, continue climbing
					index += parent.brackets.length - node.brackets.length;
					pos -= parent.left.size;
				}
				node = parent;
			}

			// descent to a leaf
			let status = "match";
			while (node instanceof Interior) {
				if (
					2 * index <
					node.brackets.length +
						node.left.brackets.length -
						node.right.brackets.length
				) {
					node = node.left;
				} else {
					index += node.right.brackets.length - node.brackets.length;
					pos += node.left.size;
					node = node.right;
				}
			}

			// find the indexed unmatched bracket in the leaf node
			a = parseLeaf(node, true);
			let e = a[index];
			if (open2close[me] !== e.bracket) status = "mismatch";
			return { status: status, position: pos + e.offset };
		} else {
			// find the index in the bracket list
			let unmatched = new Array();
			for (let i = a.length - 1; i >= 0; i--) {
				let e = a[i];
				if (e.offset > bo) continue;

				if (!open2close.hasOwnProperty(e.bracket))
					unmatched.push(e.bracket);
				else if (unmatched.length === 0)
					throw "[Document.matchingBracket] internal error (unmatched is empty)";
				else if (
					open2close[e.bracket] !== unmatched[unmatched.length - 1]
				) {
					// mismatch identified
					return { status: "mismatch", position: pos + e.offset };
				} else {
					// matching pair
					unmatched.pop();
					if (unmatched.length === 0) {
						// partner bracket found
						return { status: "match", position: pos + e.offset };
					}
				}
			}
			let index = unmatched.length - 1; // index of the "me" bracket within node.brackets

			// climb the tree
			while (true) {
				let parent = node.parent;
				if (!parent) {
					// global mismatch
					return { status: "missing", position: null };
				}
				if (node === parent.right) {
					// we are the right child (the interesting case)
					let sibling = parent.left;
					pos -= sibling.size;
					let n = sibling.brackets.length;
					let m = Math.min(n, node.brackets.length);
					let k = 0; // number of matching brackets among siblings
					while (k < m) {
						if (
							open2close[sibling.brackets[n - k - 1]] ===
							node.brackets[k]
						)
							k++;
						else break;
					}
					if (index < k) {
						// correct sibling found, stop climbing
						index = sibling.brackets.length - index - 1; // corresponding index in the sibling
						node = sibling;
						break;
					} else {
						// continue climbing
						index += parent.brackets.length - node.brackets.length;
					}
				} else {
					// we are the left sibling, continue climbing
				}
				node = parent;
			}

			// descent to a leaf
			let status = "match";
			while (node instanceof Interior) {
				if (
					2 * index <
					node.brackets.length +
						node.left.brackets.length -
						node.right.brackets.length
				) {
					node = node.left;
				} else {
					index += node.right.brackets.length - node.brackets.length;
					pos += node.left.size;
					node = node.right;
				}
			}

			// find the indexed unmatched bracket in the leaf node
			a = parseLeaf(node, true);
			let e = a[index];
			if (open2close[e.bracket] !== me) status = "mismatch";
			return { status: status, position: pos + e.offset };
		}
	}

	// Apply an elementary modification. Parameters:
	//  - pos: position at which to apply the modification
	//  - remove: number of characters to remove
	//  - insert: Uint32Array of characters to insert
	// This function should almost never be called directly, but rather through an appropriate action.
	_modify(pos: number, remove: number, insert: Uint32Array) {
		if (remove + insert.length === 0) return;
		if (pos + remove > this.root.size)
			throw "[Document.modify] invalid parameters";

		if (pos === 0 && remove === this.root.size) {
			// handle this special case separately since it removes the root node
			let chunks = this._createChunks(insert, 0);
			this.begin = chunks[0];
			this.end = chunks[chunks.length - 1];
			this.root = this._buildTree(chunks);
			return;
		}

		let interior = new Set<Interior>(); // modified interior nodes (unspecified order)
		let to_merge = new Array<Leaf>(); // too small nodes that need reorganization higher up in the tree
		let to_delete = new Set<Leaf>(); // nodes that shall be removed completely

		// preparation
		let delta = insert.length - remove; // size difference
		let overlap = Math.min(insert.length, remove); // number of characters to overwrite
		let iter = new Iterator(this);
		iter.setPosition(pos);
		let scanleaf: Leaf | null = iter.leaf;
		let state = scanleaf.state;

		// overwrite as much as possible
		for (let i = 0; i < overlap; ) {
			// collect modified interior nodes
			for (let node = iter.leaf.parent; node !== null; node = node.parent)
				interior.add(node);

			// replace content
			let available = iter.leaf.data.length - iter.offset;
			let n = Math.min(available, overlap - i);
			iter.leaf.data.set(insert.subarray(i, i + n), iter.offset);
			iter.jump(n);
			i += n;

			// re-scan
			if (iter.leaf !== scanleaf) {
				(scanleaf as Leaf).state = state;
				state = (scanleaf as Leaf).recalc(this.language);
				scanleaf = (scanleaf as Leaf).next;
			}
		}

		// delete or insert
		if (delta < 0) {
			let remaining = -delta;
			while (remaining > 0) {
				// collect modified interior nodes
				for (
					let node = iter.leaf.parent;
					node !== null;
					node = node.parent
				)
					interior.add(node);

				// remove content
				let available = iter.leaf.data.length - iter.offset;
				let rem = Math.min(remaining, available);
				if (iter.leaf.data.length === rem) {
					to_delete.add(iter.leaf);
					iter.jump(rem);
					scanleaf = iter.leaf; // SAME state as before
				} else {
					let leaf = iter.leaf; // BEFORE the jump
					let offset = iter.offset; // BEFORE the jump
					iter.jump(rem);
					let sz = leaf.data.length - rem;
					let newdata = new Uint32Array(sz);
					newdata.set(leaf.data.subarray(0, offset), 0);
					newdata.set(leaf.data.subarray(offset + rem), offset);
					leaf.data = newdata;
					if (sz < Leaf.minNodeSize) to_merge.push(leaf);
				}
				remaining -= rem;

				if (iter.leaf !== scanleaf) {
					(scanleaf as Leaf).state = state;
					state = (scanleaf as Leaf).recalc(this.language);
					scanleaf = (scanleaf as Leaf).next;
				}
			}
		} else if (delta > 0) {
			// collect modified interior nodes
			for (let node = iter.leaf.parent; node !== null; node = node.parent)
				interior.add(node);

			// insert content
			let newdata = new Uint32Array(iter.leaf.data.length + delta);
			newdata.set(iter.leaf.data.subarray(0, iter.offset), 0);
			newdata.set(insert.subarray(overlap), iter.offset);
			newdata.set(
				iter.leaf.data.subarray(iter.offset),
				iter.offset + delta
			);
			iter.leaf.data = newdata;
			if (newdata.length > Leaf.maxNodeSize) {
				// split an overfull node into a whole sub-tree
				let to_split = iter.leaf;

				// build a sub-tree
				let chunks = this._createChunks(to_split.data, state);
				let node = this._buildTree(chunks);

				// enter it into the hierarchy
				let parent = to_split.parent;
				node.parent = parent;
				if (parent) {
					if (parent.left === to_split) parent.left = node;
					else parent.right = node;
				} else this.root = node;

				// alter the double-linked list
				let a = chunks[0];
				let z = chunks[chunks.length - 1];
				a.prev = to_split.prev;
				z.next = to_split.next;
				if (a.prev) a.prev.next = a;
				else this.begin = a;
				if (z.next) z.next.prev = z;
				else this.end = z;

				// recover a valid scan state
				scanleaf = z;
				state = z.state;

				// help the garbage collector
				to_split.prev = null;
				to_split.next = null;
				to_split.parent = null;
			}
		}

		// delete the given leaf node
		let deleteLeaf = (node: Leaf) => {
			// remove node from the double-linked list
			if (node.prev) node.prev.next = node.next;
			else this.begin = node.next as Leaf;
			if (node.next) node.next.prev = node.prev;
			else this.end = node.prev as Leaf;

			// replace parent with sibling
			let parent = node.parent;
			if (!parent) throw "[Document.modify] internal error (no parent)";
			let sibling = parent.left === node ? parent.right : parent.left;

			let grand = parent.parent;
			if (grand) {
				if (grand.left == parent) grand.left = sibling;
				else grand.right = sibling;
			} else this.root = sibling;
			sibling.parent = grand;

			// bookkeeping
			interior.delete(parent);
			let index = to_merge.indexOf(node);
			if (index >= 0) to_merge.splice(index, 1);

			// help the garbage collector
			node.prev = null;
			node.next = null;
			node.parent = null;
			parent.parent = null;
			//			parent.left = null;
			//			parent.right = null;
		};

		// move all content from two consecutive leaves into node1, delete node2
		let mergeLeaves = (node1: Leaf, node2: Leaf) => {
			let size = node1.data.length + node2.data.length;
			let newdata = new Uint32Array(size);
			newdata.set(node1.data, 0);
			newdata.set(node2.data, node1.data.length);

			let leaf = new Leaf(newdata, state);
			node1.data = newdata;
			node1.recalc(this.language);
			if (size < Leaf.minNodeSize) to_merge.push(node1);

			deleteLeaf(node2);
		};

		// re-distribute content between the leaves, which are assumed to be consecutive
		let balanceLeaves = (node1: Leaf, node2: Leaf) => {
			// join contents
			let size = node1.data.length + node2.data.length;
			let newdata = new Uint32Array(size);
			newdata.set(node1.data, 0);
			newdata.set(node2.data, node1.data.length);

			// split contents fairly
			let chunks = this._createChunks(newdata, state);
			if (chunks.length !== 2)
				throw "[Document.modify balanceLeaves] internal error (bad number of chunks)";

			// copy only data and meta-data, no structure information
			let target = [node1, node2];
			for (let i = 0; i < 2; i++) {
				target[i].height = chunks[i].height;
				target[i].size = chunks[i].size;
				target[i].linebreaks = chunks[i].linebreaks;
				target[i].tabulator = chunks[i].tabulator;
				target[i].firstwidth = chunks[i].firstwidth;
				target[i].innerwidth = chunks[i].innerwidth;
				target[i].lastwidth = chunks[i].lastwidth;
				target[i].brackets = chunks[i].brackets;
				target[i].data = chunks[i].data;
				target[i].state = chunks[i].state;
			}
		};

		// delete empty nodes
		for (let node of to_delete) deleteLeaf(node);

		// complete the scan, keep scanning until the state becomes stable
		do {
			(scanleaf as Leaf).state = state;
			state = (scanleaf as Leaf).recalc(this.language);
			scanleaf = (scanleaf as Leaf).next;
		} while (scanleaf && scanleaf.state !== state);

		// handle tiny nodes
		while (to_merge.length > 0) {
			let leaf: Leaf = to_merge.pop() as Leaf;
			let leaves;
			if (leaf.prev) leaves = [leaf.prev, leaf];
			else if (leaf.next) leaves = [leaf, leaf.next];
			else break;

			let size = leaves[0].data.length + leaves[1].data.length;
			if (2 * size < Leaf.maxNodeSize + Leaf.bestNodeSize)
				mergeLeaves(leaves[0], leaves[1]);
			else balanceLeaves(leaves[0], leaves[1]);
		}

		// update interior nodes
		{
			// topological sort
			let f = new Array<Interior>(); // list of dependency-free nodes
			let parents = new Map<Interior, Interior>(); // map from node to parent
			for (let node of interior) {
				let d = 0;
				if (node.left instanceof Interior && interior.has(node.left)) {
					parents.set(node.left, node);
					d++;
				}
				if (
					node.right instanceof Interior &&
					interior.has(node.right)
				) {
					parents.set(node.right, node);
					d++;
				}

				if (d === 0) f.push(node);
			}
			while (f.length > 0) {
				let node = f.pop() as Interior;
				node.recalc(this.language); // actual update
				interior.delete(node);
				let parent = parents.get(node);
				if (!parent) break;
				if (
					(parent.left instanceof Leaf ||
						!interior.has(parent.left as Interior)) &&
					(parent.right instanceof Leaf ||
						!interior.has(parent.right as Interior))
				) {
					f.push(parent);
				}
			}
			if (f.length > 0)
				throw "[Document.modify] internal error (topological sort failed)";
		}

		// re-balance the tree if it became too high overall
		if (
			this.root.height >
			1.5 * Math.log2(this.root.numberOfLeaves()) + 2
		) {
			let chunks = new Array<Leaf>();
			for (
				let node: Leaf | null = this.begin;
				node !== null;
				node = node.next
			)
				chunks.push(node);
			this.root = this._buildTree(chunks);
		}

		return delta;
	}

	// Given a (potentially large) array, split it into a list of chunks.
	// The list is returned as an array, but it is additionally double-linked internally.
	// The chunks are readily scanned given an initial scanner state.
	// There is rarely a use for calling this function directly.
	_createChunks(data: Uint32Array, state: number) {
		// split it into chunks
		let n = data.length;
		let k = Math.max(1, Math.ceil(n / Leaf.bestNodeSize) | 0);
		let chunks = new Array<Leaf>();
		for (let i = 0; i < k; i++) {
			let begin = ((n * i) / k) | 0;
			let end = ((n * (i + 1)) / k) | 0;
			let cdata = data.slice(begin, end);
			let chunk = new Leaf(cdata, state);
			state = chunk.recalc(this.language);
			chunks.push(chunk);
			if (i > 0) {
				let prev = chunks[i - 1];
				prev.next = chunk;
				chunk.prev = prev;
			}
		}
		return chunks;
	}

	// Build a (more or less) balanced tree on top of an array of leaves (chunks).
	// There is rarely a use for calling this function directly.
	_buildTree(chunks: Array<Leaf>): Node {
		let level = chunks;
		while (level.length > 1) {
			let upper = new Array();
			for (let i = 0; i < level.length; i += 2) {
				if (i + 1 < level.length) {
					let node = new Interior(level[i], level[i + 1]);
					node.recalc(this.language);
					upper.push(node);
				} else upper.push(level[i]);
			}
			level = upper;
		}
		return level[0];
	}

	// offset for converting characters in the range 0:255 to lower case
	static _lower = new Uint8Array([
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 32, 32, 32, 32, 32,
		32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32,
		32, 32, 32, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32,
		32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 0, 32, 32, 32, 32, 32,
		32, 32, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	]);
}
