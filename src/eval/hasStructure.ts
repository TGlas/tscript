"use strict";

import { Typeid } from "../lang/helpers/typeIds";
import { TScript } from "../lang";
import { Parser } from "../lang/parser";
import { createDefaultServices } from "../lang/interpreter/defaultService";
import { Interpreter } from "../lang/interpreter/interpreter";
import { escapeHtmlChars } from "../escape";
import { reserved_node_names } from "./reserved_node_names";

//
// This function returns true if the program, given as an AST,
// matches the given pseudo code pattern.
//
export function hasStructure(program, pseudo) {
	function compilePseudo(code) {
		let pos = 0;

		function skipwhite() {
			while (
				pos < code.length &&
				(code[pos] === " " ||
					code[pos] === "\t" ||
					code[pos] === "\n" ||
					code[pos] === "\r")
			)
				pos++;
		}

		function identifier() {
			skipwhite();
			if (pos >= code.length) return null;
			let c = code[pos];
			if (c === '"') {
				let ret = "";
				pos++;
				while (pos < code.length) {
					c = code[pos];
					pos++;
					if (c === '"') return ret;
					else ret += c;
				}
				return null;
			} else if (c === "'") {
				let ret = "";
				pos++;
				while (pos < code.length) {
					c = code[pos];
					pos++;
					if (c === "'") return ret;
					else ret += c;
				}
				return null;
			} else if (
				(c >= "A" && c <= "Z") ||
				(c >= "a" && c <= "z") ||
				c === "_"
			) {
				let ret = c;
				pos++;
				while (true) {
					c = code[pos];
					if (
						(c >= "A" && c <= "Z") ||
						(c >= "a" && c <= "z") ||
						(c >= "0" && c <= "9") ||
						c === "_"
					) {
						ret += c;
						pos++;
					} else break;
				}
				return ret;
			} else return null;
		}

		function command() {
			let ident = identifier();
			if (ident === null) return null;

			let ret: any = { petype: ident };

			skipwhite();
			if (pos >= code.length) return null;
			let c = code[pos];
			if (c === "(") {
				pos++;
				let name = identifier();
				if (name === null) return null;
				skipwhite();
				let c = code[pos];
				if (c != ")") return null;
				pos++;
				ret.base = { name: name };
			} else if (c === "[") {
				pos++;
				let name = identifier();
				if (name === null) return null;
				skipwhite();
				let c = code[pos];
				if (c != "]") return null;
				pos++;
				ret.name = name;
			}

			skipwhite();
			if (pos >= code.length) return null;
			c = code[pos];
			if (c === "{") {
				pos++;
				let sub = new Array();
				while (true) {
					skipwhite();
					if (pos >= code.length) return null;
					if (code[pos] === ";") {
						pos++;
						continue;
					}
					if (code[pos] === "}") {
						pos++;
						ret.sub = sub.length === 1 ? sub[0] : sub;
						return ret;
					}
					let cmd = command();
					if (cmd === null) return null;
					sub.push(cmd);
				}
			} else if (c === ";") {
				pos++;
				return ret;
			} else return null;
		}

		skipwhite();
		if (pos >= code.length) return null;
		let c = code[pos];
		if (c === "{") {
			pos++;
			let ret = new Array();
			while (true) {
				skipwhite();
				if (pos >= code.length) return null;
				if (code[pos] === ";") {
					pos++;
					continue;
				}
				if (code[pos] === "}") {
					pos++;
					skipwhite();
					if (pos >= code.length)
						return ret.length === 1 ? ret[0] : ret;
					else return null;
				}
				let cmd = command();
				if (cmd === null) return null;
				ret.push(cmd);
			}
		} else {
			let cmd = command();
			skipwhite();
			if (pos >= code.length) return cmd;
			else return null;
		}
	}

	// The function returns true if key is a sub-tree of data, and false otherwise.
	// A tree is an arbitrary array or object. Non-array non-object nodes are ignored.
	// Many member names like "parent" and "petype" are reserved. All other object members are considered child nodes.
	// Two nodes match under the following conditions:
	// - Arrays can match arrays; objects can match objects.
	// - If at least one of the nodes has a petype member then both need one, and the key petype must be a substring of the data petype.
	// - If at least one of the nodes has a name member then both need one, and the key name must match the data name.
	// - Array members are considered in their natural order.
	// - In the key tree, objects must have at most one child node, hence there is no order ambiguity.
	function isSubtree(key, data) {
		function isObject(value) {
			return (
				value !== null &&
				typeof value === "object" &&
				value.constructor === Object
			);
		}

		function isNode(value) {
			return Array.isArray(value) || isObject(value);
		}

		function equal(c1, c2) {
			if (
				c1.nstack.length != c2.nstack.length ||
				c1.dstack.length != c2.dstack.length ||
				c1.next.length != c2.next.length
			)
				return false;
			for (let i = 0; i < c1.nstack.length; i++) {
				if (c1.nstack[i].length != c2.nstack[i].length) return false;
				for (let j = 0; j < c1.nstack[i].length; j++) {
					if (c1.nstack[i][j] !== c2.nstack[i][j]) return false;
				}
			}
			for (let i = 0; i < c1.dstack.length; i++) {
				if (c1.dstack[i] !== c2.dstack[i]) return false;
			}
			for (let i = 0; i < c1.next.length; i++) {
				if (c1.next[i] !== c2.next[i]) return false;
			}
			return true;
		}

		// initial cursor
		let cs = [{ nstack: new Array(), dstack: new Array(), next: [key] }];

		// recursive traversal of the data tree
		function rec(node) {
			if (!node) return false;
			if (node.builtin) return false;
			if (node.petype === "breakpoint") return false;

			// forward pass: match nodes
			let ii = cs.length;
			for (let i = 0; i < ii; i++) {
				let c = cs[i];
				if (c.next.length === 0) continue; // this cursor is waiting for an ancestor of the current data node
				let next = c.next[0];
				if (!isNode(next))
					throw new Error(
						"[isSubtree] key node is not an array or object"
					);

				// do the nodes match?
				let match = Array.isArray(node) === Array.isArray(next);
				if (match && isObject(next)) {
					if (next.hasOwnProperty("petype")) {
						let d = node.petype ? node.petype : "";
						let k = next.petype ? next.petype : "";
						match = d.indexOf(k) >= 0;
					}
					if (next.hasOwnProperty("name")) {
						let d = node.name ? node.name : "";
						let k = next.name ? next.name : "";
						match = d === k;
					}
				}

				if (match) {
					// match found: create a new cursor
					// - create a new next array from the children of the key node
					// - add old next array with the first position removed and the data node to the stacks
					let ns = c.nstack.slice();
					let ds = c.dstack.slice();
					ns.push(c.next.slice(1));
					ds.push(node);
					let nx = new Array();
					for (let key in next) {
						if (!next.hasOwnProperty(key)) continue;
						if (reserved_node_names.hasOwnProperty(key)) continue;
						let n = next[key];
						if (isNode(n)) nx.push(n);
					}
					cs.push({ nstack: ns, dstack: ds, next: nx });
				}
			}

			// recursion
			for (let key in node) {
				if (!node.hasOwnProperty(key)) continue;
				if (reserved_node_names.hasOwnProperty(key)) continue;
				let n = node[key];
				if (isNode(n)) {
					if (rec(n)) return true;
				}
			}

			// backward pass: collect results
			let cs1 = new Array(),
				cs2 = new Array();
			for (let i = 0; i < cs.length; i++) {
				let c = cs[i];
				if (c.dstack[c.dstack.length - 1] === node) {
					if (c.next.length > 0) continue; // sub-tree match not completed: drop the cursor

					// move the cursor to the next sub-tree
					c.dstack.pop();
					c.next = c.nstack.pop();
					if (c.nstack.length === 0) return true; // success!
					cs2.push(c);
				} else cs1.push(c);
			}

			// check for duplicate cursors
			cs = cs1;
			for (let i = 0; i < cs2.length; i++) {
				let duplicate = false;
				for (let j = 0; j < cs.length; j++) {
					if (equal(cs2[i], cs[j])) {
						duplicate = true;
						break;
					}
				}
				if (!duplicate) cs.push(cs2[i]);
			}

			return false;
		}

		return rec(data);
	}

	let pc = compilePseudo(pseudo);
	//		console.log("[compilePseudo]", pseudo, pc, program.commands.slice(34));
	if (pc === null) {
		console.log("error in pseudo code:\n\n" + pseudo);
		return false;
	}
	// console.log(pc, program);
	return isSubtree(pc, program);
}
