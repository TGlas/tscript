import { documentationData } from "../doc";
import { ErrorHelper } from "../lang/errors/ErrorHelper";
import { createDefaultServices } from "../lang/interpreter/defaultService";
import { Interpreter } from "../lang/interpreter/interpreter";
import { defaultParseOptions, Parser } from "../lang/parser";
import { Lexer } from "../lang/parser/lexer";
import { Version } from "../lang/version";
import { navigate } from "./navigation";
import { searchengine } from "./search";
import * as tgui from "./tgui";
import { toClipboard } from "./clipboard";
import { escapeHtmlChars } from "../escape";

///////////////////////////////////////////////////////////
// TScript documentation
//

export const doc = (function () {
	// define the central documentation data object, to be extended in other files
	let module: any = documentationData;
	let docpath = "";
	let doctree: any = null;

	// load theme from localStorage or use the theme of the operating system
	function loadTheme() {
		let str = localStorage.getItem("tscript.ide.config");
		let theme = "default";
		if (str) {
			let config = JSON.parse(str);
			if (config.hasOwnProperty("theme")) theme = config.theme;
		}
		if (tgui.isThemeConfig(theme)) tgui.setThemeConfig(theme);
		return null;
	}

	function docinfo(value, node_id) {
		let ret: any = { children: [], ids: [] };

		if (value === null) {
			ret.children.push(doc);
			ret.ids.push("");
		} else {
			ret.opened =
				node_id.split("/").length <= 2 ||
				docpath.substr(0, node_id.length) == node_id;
			for (var i = 0; i < value.children.length; i++) {
				ret.children.push(value.children[i]);
				ret.ids.push(node_id + "/" + value.children[i].id);
			}
			ret.element = tgui.createElement({ type: "span" });
			tgui.createElement({
				type: "span",
				parent: ret.element,
				classname: node_id == docpath ? "entry current" : "entry",
				text: value.name,
			});
		}

		return ret;
	}

	// tokenizer for EBNF, compatible with the lexer interface
	let get_token_ebnf = function (state) {
		let c = state.current();
		if ((c >= "A" && c <= "Z") || (c >= "a" && c <= "z") || c == "_") {
			// parse an identifier or a keyword
			let value = c;
			state.advance();
			while (state.good()) {
				let c = state.current();
				if (
					(c >= "A" && c <= "Z") ||
					(c >= "a" && c <= "z") ||
					(c >= "0" && c <= "9") ||
					c == "_" ||
					c == "-"
				) {
					value += c;
					state.advance();
				} else break;
			}
			return { type: "identifier", value: value };
		} else if (c == '"') {
			// parse string literal
			state.advance();
			let value = "";
			while (true) {
				if (!state.good())
					state.error(
						"syntax error in string literal; closing double quotes '\"' expected"
					);
				let c = state.current();
				if (c == "\r" || c == "\n")
					state.error(
						"syntax error in string literal; closing double quotes '\"' expected before end-of-line"
					);
				else if (c == '"') {
					state.advance();
					break;
				} else {
					value += c;
					state.advance();
				}
			}
			return { type: "literal", value: value };
		} else if (c == "'") {
			// parse string literal
			state.advance();
			let value = "";
			while (true) {
				if (!state.good())
					state.error(
						"syntax error in string literal; closing single quotes ' expected"
					);
				let c = state.current();
				if (c == "\r" || c == "\n")
					state.error(
						"syntax error in string literal; closing double quotes '\"' expected before end-of-line"
					);
				else if (c == "'") {
					state.advance();
					break;
				} else {
					value += c;
					state.advance();
				}
			}
			return { type: "literal", value: value };
		} else if (c == "$") {
			// parse special
			state.advance();
			let value = "";
			while (true) {
				if (!state.good())
					state.error(
						"syntax error in special; closing dollar sigh '$' expected"
					);
				let c = state.current();
				state.advance();
				if (c == "$") break;
				value += c;
			}
			return { type: "special", value: value };
		} else if (c == "#") {
			// line comment   TODO: EBNF defines block comments (* ... *) instead
			state.advance();
			let value = "";
			while (state.good()) {
				let c = state.current();
				value += c;
				state.advance();
				if (c == "\n") break;
			}
			return { type: "comment", value: value };
		} else {
			// all the rest, including operators
			state.advance();
			//			if ("=-*|".indexOf(c) >= 0) return { type: "operator", value: c };
			if ("=,-|".indexOf(c) >= 0) return { type: "operator", value: c };
			if ("()[]{}".indexOf(c) >= 0) return { type: "grouping", value: c };
			if (";".indexOf(c) >= 0) return { type: "delimiter", value: c };
			state.error("EBNF syntax error; invalid character '" + c + "'");
		}
	};

	let get_token_code = function (state) {
		if (state.current() == "#") {
			state.advance();
			if (state.current() == "*") {
				state.advance();
				while (
					(state.current() != "*" || state.next() != "#") &&
					state.current() != ""
				)
					state.advance();
				state.advance(2);
				return { type: "comment" };
			} else {
				while (state.current() != "\n" && state.current() != "")
					state.advance();
				state.advance();
				return { type: "comment" };
			}
		} else {
			let ret = Lexer.get_token(state, defaultParseOptions, true);
			state.advance(ret.code.length);
			return ret;
		}
	};

	function processCode(code, css_prefix, lex) {
		const white = " \t\r";
		if (code.indexOf("\n") >= 0) {
			// multiple lines: find shared indentation
			let lines = code.split("\n");
			let indent = "";
			let maxlength = 1000000;
			for (let i = 0; i < lines.length; i++) {
				let line = lines[i];
				if (maxlength >= 1000000) {
					for (let j = 0; j < line.length; j++) {
						if (white.indexOf(line[j]) < 0) {
							indent = line.substr(0, j);
							maxlength = j;
							break;
						}
					}
				} else {
					for (let j = 0; j < line.length; j++) {
						if (j >= maxlength) break;
						if (indent[j] != line[j]) {
							maxlength = j;
							indent = indent.substr(0, maxlength);
							break;
						}
					}
				}
			}

			// encode lines individually
			let ret =
				'<div class="' +
				css_prefix +
				'"><pre class="' +
				css_prefix +
				'">';
			for (let i = 0; i < lines.length; i++) {
				let line = lines[i];
				if (i == 0 && line.length <= indent.length) continue;
				if (line.length > indent.length)
					ret += processCode(
						line.substr(indent.length),
						css_prefix,
						lex
					);
				ret += "\n";
			}
			while (ret.length > 0 && ret[ret.length - 1] == "\n")
				ret = ret.substr(0, ret.length - 1);
			ret += "</pre></div>";
			return ret;
		} else {
			// single line
			let state = createState(code);

			let ret = '<code class="' + css_prefix + '">';
			while (!state.eof()) {
				while (state.good()) {
					let c = state.current();
					if (white.indexOf(c) < 0) break;
					if (c == " ") ret += c;
					else if (c == "\t") ret += "    ";
					else if (c == "\r") {
					}
					state.advance();
				}
				if (state.eof()) break;
				let start = state.pos;
				let token = lex(state);
				let value = code.substr(start, state.pos - start);
				value = value.replaceAll("&", "&amp").replaceAll("<", "&lt;");
				ret +=
					'<span class="' +
					css_prefix +
					"-" +
					token.type +
					'">' +
					value +
					"</span>";
			}
			ret += "</code>";
			return ret;
		}
	}

	// Check code for correctness by parsing and running it.
	// On success, the function does nothing, otherwise is throws an error message.
	function checkCode(code) {
		let result = Parser.parse(code);
		if (result.hasOwnProperty("errors") && result.errors.length > 0)
			throw result.errors[0].message;
		let interpreter = new Interpreter(
			result.program,
			createDefaultServices()
		);
		interpreter.reset();
		interpreter.service.message = function (msg) {
			throw msg;
		};
		interpreter.service.documentation_mode = true;
		while (
			interpreter.status == "running" ||
			interpreter.status == "waiting"
		)
			interpreter.exec_step();
		if (interpreter.status != "finished")
			alert("code sample failed to run:\n" + code);
	}

	// Check an EBNF definition for syntactical correctness.
	// On success, the function does nothing, otherwise is throws an error message.
	function checkEBNF(ebnf) {
		let state = createState(ebnf);

		// parse an alternating sequence of expressions and binary operators
		function parseSequence() {
			let expressionExpected = true;
			while (state.good()) {
				state.skip();
				let token = get_token_ebnf(state);
				if (!token) return null;
				if (token.type == "comment") continue;
				else if (token.type == "grouping") {
					if (")]}".indexOf(token.value) >= 0) return token;
					else {
						if (!expressionExpected)
							state.error(
								"EBNF syntax error: operator or closing bracket expected"
							);
						let end = parseSequence();
						if (end === null)
							state.error(
								"EBNF: opening " +
									token.value +
									" not properly closed"
							);
						expressionExpected = false;
					}
				} else if (
					token.type == "identifier" ||
					token.type == "literal" ||
					token.type == "special"
				) {
					if (!expressionExpected)
						state.error(
							"EBNF syntax error: operator or closing bracket expected"
						);
					expressionExpected = false;
				} else if (token.type == "operator") {
					if (expressionExpected)
						state.error(
							"EBNF syntax error: expression expected before operator " +
								token.value
						);
					if (token.value == "=")
						state.error(
							"EBNF syntax error: assignment does not work here"
						);
					expressionExpected = true;
				} else if (token.type == "delimiter") {
					if (expressionExpected)
						state.error(
							"EBNF syntax error: expression expected before semicolon"
						);
					return token;
				} else state.error("unexpected token type in checkEBNF");
			}
			return null;
		}

		let first = true; // be prepared for a single identifier
		while (true) {
			// parse one rule
			state.skip();
			if (!state.good()) break;
			let lhs = get_token_ebnf(state);
			if (lhs?.type != "identifier")
				state.error(
					"EBNF syntax error: left-hand-side must be an identifier"
				);
			state.skip();
			if (!state.good()) {
				if (first) break;
				else
					state.error(
						"EBNF syntax error: assignment operator '=' expected"
					);
			}
			let assignment = get_token_ebnf(state);
			if (!assignment) break;
			if (assignment.type != "operator" || assignment.value != "=")
				state.error(
					"EBNF syntax error: assignment operator '=' expected"
				);
			let closing = parseSequence();
			if (closing?.value != ";")
				state.error("EBNF syntax error: final semicolon expected");
			first = false;
		}
	}

	// Create a state object for lexing, operating on a state.
	function createState(str) {
		return {
			source: str,
			pos: 0, // zero-based position in the source code string
			good: function () {
				return this.pos < this.source.length;
			},
			bad: function () {
				return !this.good();
			},
			eof: function () {
				return this.pos >= this.source.length;
			},
			indentation: function () {
				return 0;
			},
			error: function (path, args = []) {
				let str =
					"documentation internal error in code: '" +
					this.source +
					"' (" +
					path +
					")";
				throw new Error(str);
			},
			current: function () {
				return this.pos >= this.source.length
					? ""
					: this.source[this.pos];
			},
			lookahead: function (num) {
				return this.pos + num >= this.source.length
					? ""
					: this.source[this.pos + num];
			},
			next: function () {
				return this.lookahead(1);
			},
			get: function () {
				return { pos: this.pos, line: this.line, ch: this.ch };
			},
			set: function (where) {
				this.pos = where.pos;
				(this.line = where.line), (this.ch = where.ch);
			},
			advance: function (n = 1) {
				if (this.pos + n > this.source.length)
					n = this.source.length - this.pos;
				for (let i = 0; i < n; i++) {
					let c = this.current();
					if (c == "\n") {
						this.line++;
						this.ch = 0;
					}
					this.pos++;
					this.ch++;
				}
			},
			skip: function () {
				while (this.good()) {
					let c = this.current();
					if (c == "#") {
						this.pos++;
						this.ch++;
						if (this.current() == "*") {
							this.pos++;
							this.ch++;
							let star = false;
							while (this.good()) {
								if (this.current() == "\n") {
									this.pos++;
									this.line++;
									this.ch = 0;
									star = false;
									continue;
								}
								if (star && this.current() == "#") {
									this.pos++;
									this.ch++;
									break;
								}
								star = this.current() == "*";
								this.pos++;
								this.ch++;
							}
						} else {
							while (this.good() && this.current() != "\n") {
								this.pos++;
								this.ch++;
							}
						}
						continue;
					}
					if (c != " " && c != "\t" && c != "\r" && c != "\n") break;
					if (c == "\n") {
						this.line++;
						this.ch = 0;
					} else this.ch++;
					this.pos++;
				}
			},
		};
	}

	// This function returns an altered version of the pseudo-html #content
	// suitable for placing it as innerHTML into the DOM. It performs a
	// number of stylistic replacements:
	// * It scans for the ebnf tag and adds proper syntax highlighting.
	// * It scans for the tscript tag and adds proper syntax highlighting.
	//   As an additional sanity check, it parses and executes the code.
	// * For the above tags, it removes leading empty lines, removes leading
	//   indentation, and converts the remaining leading tabulators to four
	//   spaces each.
	// * It scans for keyword tags, which are styled appropriately.
	function prepare(content, tutorial = false) {
		let search = content.toLowerCase();
		let ret = "";
		let start = 0;
		while (start < content.length) {
			let pos = search.indexOf("<", start);
			if (pos < 0) {
				ret += content.substr(start);
				break;
			}
			ret += content.substr(start, pos - start);
			start = pos;
			if (search.substr(start, 6) == "<ebnf>") {
				start += 6;
				let end = search.indexOf("</ebnf>", start);
				if (end < 0) throw "[doc] <ebnf> tag not closed";
				let ebnf = content.substr(start, end - start);
				start = end + 7;
				if (!tutorial) checkEBNF(ebnf);
				ret += processCode(ebnf, "ebnf", get_token_ebnf);
			} else if (search.substr(start, 19) == "<ebnf do-not-check>") {
				start += 19;
				let end = search.indexOf("</ebnf>", start);
				if (end < 0) throw "[doc] <ebnf> tag not closed";
				let ebnf = content.substr(start, end - start);
				start = end + 7;
				ret += processCode(ebnf, "ebnf", get_token_ebnf);
			} else if (search.substr(start, 9) == "<tscript>") {
				start += 9;
				let end = search.indexOf("</tscript>", start);
				if (end < 0) throw "[doc] <tscript> tag not closed";
				let code = content.substr(start, end - start);
				start = end + 10;
				if (!tutorial) checkCode(code);
				ret += processCode(
					code,
					tutorial ? "code" : "copy code",
					get_token_code
				);
			} else if (search.substr(start, 20) == "<tscript do-not-run>") {
				start += 20;
				let end = search.indexOf("</tscript>", start);
				if (end < 0) throw "[doc] <tscript> tag not closed";
				let code = content.substr(start, end - start);
				start = end + 10;
				ret += processCode(
					code,
					tutorial ? "code" : "copy code",
					get_token_code
				);
			} else if (search.substr(start, 9) == "<keyword>") {
				start += 9;
				let end = search.indexOf("</keyword>", start);
				if (end < 0) throw "[doc] <keyword> tag not closed";
				let kw = content.substr(start, end - start);
				start = end + 10;
				ret += '<span class="keyword">' + kw + "</span>";
			} else {
				ret += content[start];
				start++;
			}
		}
		return ret;
	}
	module.get_token_ebnf = get_token_ebnf;
	module.get_token_code = get_token_code;
	module.processCode = processCode;
	module.prepare = prepare;

	// This function returns an altered version of the pseudo-html #content
	// suitable for searching. It removes all tags, as well as the contents
	// of ebnf and tscript tags.
	function plaintext(content) {
		let search = content.toLowerCase();
		let ret = "";
		let start = 0;
		while (start < content.length) {
			let pos = search.indexOf("<", start);
			if (pos < 0) {
				ret += content.substr(start);
				break;
			}
			ret += content.substr(start, pos - start);
			start = pos;
			if (search.substr(start, 6) == "<ebnf>") {
				start += 6;
				let end = search.indexOf("</ebnf>", start);
				if (end < 0) throw "[doc] <ebnf> tag not closed";
				start = end + 7;
				ret += " ";
			} else if (search.substr(start, 10) == "<tscript>") {
				start += 10;
				let end = search.indexOf("</tscript>", start);
				if (end < 0) throw "[doc] <tscript> tag not closed";
				start = end + 11;
				ret += " ";
			} else if (search.substr(start, 4) == "<h1>") {
				start += 4;
				let end = search.indexOf("</h1>", start);
				if (end < 0) throw "[doc] <h1> tag not closed";
				let s = content.substr(start, end - start) + " ";
				start = end + 5;
				ret += s;
				ret += s;
				ret += s;
				ret += s;
				ret += s;
			} else if (search.substr(start, 4) == "<h2>") {
				start += 4;
				let end = search.indexOf("</h2>", start);
				if (end < 0) throw "[doc] <h2> tag not closed";
				let s = content.substr(start, end - start) + " ";
				start = end + 5;
				ret += s;
				ret += s;
				ret += s;
			} else if (search.substr(start, 4) == "<h3>") {
				start += 4;
				let end = search.indexOf("</h3>", start);
				if (end < 0) throw "[doc] <h3> tag not closed";
				let s = content.substr(start, end - start) + " ";
				start = end + 5;
				ret += s;
				ret += s;
			} else {
				let end = content.indexOf(">", start + 1);
				if (end < 0) throw "[doc] tag not closed";
				start = end + 1;
				ret += " ";
			}
		}
		return ret;
	}

	function getnode(path) {
		let tokens = path.split("/");
		if (tokens[0] != "") throw "invalid path: " + path;
		let parent: any = null;
		let parentpath: any = null;
		let index = -1;
		let node = doc;
		for (let i = 1; i < tokens.length; i++) {
			if (!node.hasOwnProperty("children")) throw "invalid path: " + path;
			let ch = node.children;
			let found: any = null;
			for (let j = 0; j < ch.length; j++) {
				if (ch[j].id == tokens[i]) {
					parent = node;
					parentpath =
						parent == doc ? "" : parentpath + "/" + parent.id;
					index = j;
					found = ch[j];
					break;
				}
			}
			if (found === null) throw "invalid path: " + path;
			node = found;
		}
		return [node, parent, parentpath, index];
	}

	module.setpath = function (path) {
		if (!path) path = "";
		if (path.length > 0 && path[0] == "#") path = path.substr(1);

		if (path.substr(0, 7) == "search/") {
			// prepare the search results page
			let keys = path.substr(7).split("/");
			let html = "<h2>Search Results for <i>&quot;";
			for (let i = 0; i < keys.length; i++) {
				if (i != 0) html += " ";
				html += escapeHtmlChars(keys[i]);
			}
			html += "&quot;</i></h2>";
			let results = searchengine.find(keys);
			if (results.length > 0) {
				html += "<ul>";
				for (let i = 0; i < results.length; i++) {
					let path = results[i].id;
					let node = getnode(path)[0];
					html +=
						'<li><a href="?doc=' +
						path +
						'">' +
						node.title +
						'</a><div class="searchresults">terms:<i>';
					// sort words by relevance
					let words = new Array();
					for (let word in results[i].matches) {
						if (!results[i].matches.hasOwnProperty(word)) continue;
						words.push([word, results[i].matches[word]]);
					}
					words.sort(function (lhs, rhs) {
						return rhs[1] - lhs[1];
					});
					for (let i = 0; i < words.length; i++) {
						html += " " + words[i][0];
					}
					html += "</i></div></li>";
				}
				html += "</ul>";
			} else {
				html += "<p>sorry, no results found</p>";
			}

			// display the page
			module.dom_content.innerHTML = html;
			module.dom_content.scrollTop = 0;
			docpath = "";
			doctree.update(docinfo);
		} else {
			try {
				let data = getnode(path);
				let node = data[0];
				let parent = data[1];
				let parentpath = data[2];
				let index = data[3];
				let html = "<h1>" + node.title + "</h1>\n";
				if (node.hasOwnProperty("content")) html += node.content + "\n";
				if (node.hasOwnProperty("children")) {
					html += '<div class="related">\n';
					html += "<h2>Related Topics</h2>\n<ul>\n";
					if (parent) {
						html +=
							'back to enclosing topic: <a href="?doc=' +
							parentpath +
							'">' +
							parent.name +
							"<a><br/>\n";
						if (index > 0) {
							let sibling = parent.children[index - 1];
							html +=
								'previous topic: <a href="?doc=' +
								parentpath +
								"/" +
								sibling.id +
								'">' +
								sibling.name +
								"<a><br/>\n";
						}
						if (index + 1 < parent.children.length) {
							let sibling = parent.children[index + 1];
							html +=
								'next topic: <a href="?doc=' +
								parentpath +
								"/" +
								sibling.id +
								'">' +
								sibling.name +
								"<a><br/>\n";
						}
					}
					if (node.children.length > 0) {
						html += "<h3>Subordinate Topics</h3>\n<ul>\n";
						for (let i = 0; i < node.children.length; i++)
							html +=
								'<li><a href="?doc=' +
								path +
								"/" +
								node.children[i].id +
								'">' +
								node.children[i].name +
								"</a></li>\n";
						html += "</ul>\n";
					}
					html += "</div>\n";
				}
				html += '<div class="pad"></div>\n';

				module.dom_content.innerHTML = prepare(html);
				module.dom_content.scrollTop = 0;
				docpath = path;
				doctree.update(docinfo);

				let pres = document.getElementsByTagName("pre");
				for (let i = 0; i < pres.length; i++) {
					let pre: any = pres[i];
					if (pre.className.indexOf("code") >= 0) {
						let c = pre.textContent + "\n";
						pre.parentNode.addEventListener(
							"click",
							function (event) {
								toClipboard(c);
							}
						);
					}
				}
			} catch (ex: any) {
				if (ex.message) alert(ex.message);
				else alert(ex);
				throw ex;
			}
		}
	};

	function initsearch(path, node) {
		let s = plaintext("<h1>" + node.title + "</h1>\n" + node.content);
		searchengine.add(path, s);
		for (let i = 0; i < node.children.length; i++) {
			let c = node.children[i];
			initsearch(path + "/" + c.id, c);
		}
	}

	function checklinks(node, path) {
		let start = 0;
		while (true) {
			let pos = node.content.indexOf('href="', start);
			if (pos < 0) break;
			start = pos + 6;
			pos = node.content.indexOf('"', start);
			let s = node.content.substr(start, pos - start);
			start = pos + 1;
			if (s.startsWith("?doc=")) {
				try {
					getnode(s.slice(5));
				} catch (ex) {
					// invalid link
					alert(
						"[link checker] broken link to '" +
							s +
							"' in document '" +
							path +
							"'"
					);
				}
			}
		}

		for (let i = 0; i < node.children.length; i++)
			checklinks(node.children[i], path + "/" + node.children[i].id);
	}

	module.dom_container = null;
	module.dom_main = null;
	module.dom_sidebar = null;
	module.dom_version = null;
	module.dom_search = null;
	module.dom_searchtext = null;
	module.dom_tree = null;
	module.dom_content = null;
	module.embedded = false;

	module.create = function (container, options) {
		if (!options)
			options = {
				embedded: false,
			};

		module.embedded = options.embedded;
		if (!options.embedded) {
			document.title = "TScript Documentation";
			loadTheme();
		}

		// create the framing html elements
		module.dom_container = container;
		module.dom_main = tgui.createElement({
			type: "div",
			parent: container,
			id: "doc-main",
		});
		module.dom_sidebar = tgui.createElement({
			type: "div",
			parent: container,
			id: "sidebar",
		});
		module.dom_version = tgui.createElement({
			type: "div",
			parent: module.dom_sidebar,
			id: "version",
		});
		module.dom_search = tgui.createElement({
			type: "div",
			parent: module.dom_sidebar,
			id: "search",
		});
		module.dom_searchtext = tgui.createElement({
			type: "input",
			parent: module.dom_search,
			id: "searchtext",
			properties: { type: "text", placeholder: "search" },
		});
		module.dom_tree = tgui.createElement({
			type: "div",
			parent: module.dom_sidebar,
			id: "tree",
		});
		module.dom_content = tgui.createElement({
			type: "div",
			parent: container,
			id: "content",
		});

		// display the version
		window.setTimeout(function (event) {
			module.dom_version.innerHTML = Version.full();
			module.dom_version.addEventListener("click", function (event) {
				if (module.embedded) module.setpath("/legal");
				else navigate("?doc=/legal");
			});
		}, 100);

		// prepare the error sub-tree of the documentation tree
		let rec = function (entry, path = "") {
			let placeholders = ["X", "Y", "Z", "W", "V"];
			if (!entry.hasOwnProperty("name")) {
				let tmpl = ErrorHelper.errorTemplate(path);
				let tokens = tmpl.split("$$");
				entry.name = tokens[0];
				for (let i = 1; i < tokens.length; i++)
					entry.name += placeholders[i - 1] + tokens[i];
			}
			if (!entry.hasOwnProperty("title"))
				entry.title = "Error Message: " + entry.name;
			for (let i = 0; i < entry.children.length; i++) {
				rec(entry.children[i], path + "/" + entry.children[i].id);
			}
		};
		for (let i = 0; i < doc.children.length; i++) {
			if (doc.children[i].id == "errors") rec(doc.children[i]);
		}

		// prepare the tree control
		doctree = tgui.createTreeControl({
			parent: module.dom_tree,
			info: docinfo,
			nodeclick: function (event, value, id) {
				if (module.embedded) module.setpath(id);
				else navigate("?doc=" + id);
			},
		});

		// make the search field functional
		searchengine.clear();
		initsearch("", doc); // index the docs
		module.dom_searchtext.addEventListener("keypress", function (event) {
			if (event.key != "Enter") return;

			if (module.embedded) {
				let keys = searchengine.tokenize(module.dom_searchtext.value);
				let h = "#search";
				for (let i = 0; i < keys.length; i++) h += "/" + keys[i];
				window.sessionStorage.setItem("docpath", h);
				module.setpath(h);
			} else {
				const searchParams = new URLSearchParams({
					doc: "search",
					q: module.dom_searchtext.value,
				});
				navigate("?" + searchParams.toString());
			}
		});

		// check all internal links
		checklinks(doc, "");

		if (options.embedded) {
			let path = window.sessionStorage.getItem("docpath");
			if (!path) path = "#";
			module.setpath(path);

			document.addEventListener("click", function (event) {
				let target: any = event.target || event.srcElement;
				if (target.tagName === "A") {
					let href = target.getAttribute("href");
					if (href.length == 0) return true;
					if (!href.startsWith("?doc=")) return true;
					href = href.replace("?doc=", "#");
					window.sessionStorage.setItem("docpath", href);
					module.setpath(href);
					event.preventDefault();
					event.stopPropagation();
					event.stopImmediatePropagation();
					return false;
				}
			});
		}
	};

	return module;
})();
