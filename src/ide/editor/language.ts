import { Document } from "./document";

//
// This file contains the language definitions, in particular including
// tokenizer and bracket matching rules. Further down, it contains a
// simple (tabular) lexical scanned based on the definitions.
// Language support can be customized by changing the definitions,
// either directly in this file or by overwriting them at runtime,
// ideally before creating editor instances.
//

let language_definitions = {
	plain: {
		comments: {},
		highlight: {
			start: "plain start; (+)+[+]+{+} plain start bracket;",
		},
	},

	tscript: {
		comments: {
			line: "#",
			begin: "#*",
			end: "*#",
		},
		highlight: {
			start: 'plain start; (+)+[+]+{+} green start bracket; " red doublequoted; _+A-Z+a-z plain identifier again; 0-9 cyan number; # gray comment;',
			identifier:
				"plain start again; _+A-Z+a-z+0-9 plain identifier; keywords blue var function if then else for in do while break continue return not and or xor null true false try catch throw class public protected private static constructor this super namespace use from module include import export const switch case default enum operator ;",
			doublequoted:
				'red doublequoted; "+\n red start; \\ magenta doublequoted_escape;',
			doublequoted_escape:
				"magenta doublequoted; u magenta doublequoted_escape_u_1;",
			doublequoted_escape_u_1:
				"red doublequoted again; 0-9+a-f+A-F magenta doublequoted_escape_u_2;",
			doublequoted_escape_u_2:
				"red doublequoted again; 0-9+a-f+A-F magenta doublequoted_escape_u_3;",
			doublequoted_escape_u_3:
				"red doublequoted again; 0-9+a-f+A-F magenta doublequoted_escape_u_4;",
			doublequoted_escape_u_4:
				"red doublequoted again; 0-9+a-f+A-F magenta doublequoted;",
			comment: "gray commentline again; * gray commentblock;",
			commentline: "gray commentline; \n plain start;",
			commentblock: "gray commentblock; * gray commentblock_star;",
			commentblock_star:
				"gray commentblock again; * gray commentblock_star; # gray start;",
			number: "plain start again; 0-9 cyan number; . cyan number_after_dot; e+E cyan number_after_e;",
			number_after_dot:
				"plain start again; 0-9 cyan number_after_dot; e+E cyan number_after_e; f+F+l+L cyan start;",
			number_after_e: "plain start again; -+0-9 cyan number_after_e_1;",
			number_after_e_1: "plain start again; 0-9 cyan number_after_e_1;",
		},
	},

	python: {
		comments: {
			line: "#",
		},
		highlight: {
			start: "plain start; ' red singlequoted; \" red doublequoted; A-Z+a-z+_ plain identifier again; (+)+[+]+{+} plain start bracket; # gray comment; . cyan dot; 0-9 cyan number;",
			identifier:
				"plain start again; A-Z+a-z+_+0-9 plain identifier; # gray comment; keywords blue and as assert break class continue def del elif else except exec False finally for from global if import in is lambda None nonlocal not or pass print raise return True try while with yield ;",
			singlequoted: "red sq_short again; ' red singlequoted_2;",
			singlequoted_2: "plain start again; ' red sq_long;",
			doublequoted: 'red dq_short again; " red doublequoted_2;',
			doublequoted_2: 'plain start again; " red dq_long;',
			sq_short:
				"red sq_short; \\ magenta sq_short_escape; \n+' red start;",
			sq_long: "red sq_long; \\ magenta sq_long_escape; ' red sq_long_1;",
			sq_long_1:
				"red sq_long; \\ magenta sq_long_escape; ' red sq_long_2;",
			sq_long_2: "red sq_long; \\ magenta sq_long_escape; ' red start;",
			dq_short:
				'red dq_short; \\ magenta dq_short_escape; \n+" red start;',
			dq_long: 'red dq_long; \\ magenta dq_long_escape; " red dq_long_1;',
			dq_long_1:
				'red dq_long; \\ magenta dq_long_escape; " red dq_long_2;',
			dq_long_2: 'red dq_long; \\ magenta dq_long_escape; " red start;',
			sq_short_escape: "magenta sq_short;",
			sq_long_escape: "magenta sq_long;",
			dq_short_escape: "magenta dq_short;",
			dq_long_escape: "magenta dq_long;",
			dot: "1; plain start again; 0-9 cyan number_after_dot;",
			number: "plain start again; 0-9 cyan number; . cyan number_after_dot; e+E cyan number_after_e; j+J cyan start;",
			number_after_dot:
				"plain start again; 0-9 cyan number_after_dot; e+E cyan number_after_e; j+J cyan start;",
			number_after_e:
				"plain start again; - cyan number_after_e_1; 0-9 cyan number_after_e_2;",
			number_after_e_1: "plain start again; 0-9 cyan number_after_e_2;",
			number_after_e_2:
				"plain start again; 0-9 cyan number_after_e_2; j+J cyan start;",
			comment: "gray comment; \n plain start;",
		},
	},
};

// Language definition, consisting of comments and a syntax scanner.
// The special property of the scanner is that it can enter in the middle of a token.
// It is a simple state machine. Each state is described by:
//  - the number of pending characters not yet syntax highlighted
//  - a table with one entry per possible input character, holding in each cell
//    - the successor state of the transition
//    - whether or not a bracket shall be highlighted and matched
//    - whether or not the scanner shall be applied again to the same input after the transition
//    - a color (or style) in which the pending characters shall be highlighted
export class Language {
	linecomment: Uint32Array | null; // marker for line comments as array of code points
	blockcomment_begin: Uint32Array | null; // begin marker for block comments as array of code points
	blockcomment_end: Uint32Array | null; // end marker for block comments as array of code points
	table: Array<Uint32Array> = []; // transition table
	num_pending: Array<number> = []; // state -> # pending characters

	public constructor(name: string) {
		if (!language_definitions.hasOwnProperty(name))
			throw "unknown highlighting language";
		let definition = language_definitions[name];
		let rules = definition.highlight;

		this.linecomment = definition.comments.line
			? Document.str2arr(definition.comments.line)
			: null;
		this.blockcomment_begin = definition.comments.begin
			? Document.str2arr(definition.comments.begin)
			: null;
		this.blockcomment_end = definition.comments.end
			? Document.str2arr(definition.comments.end)
			: null;

		// count and enumerate named rules
		let num = 1;
		let name2state = {};
		name2state["start"] = 0;
		this.table.push(new Uint32Array(99));
		this.num_pending.push(0);
		for (let rulename in rules) {
			if (rulename === "start") continue;
			this.table.push(new Uint32Array(99));
			this.num_pending.push(0);
			name2state[rulename] = num;
			num++;
		}

		// parse named rules and create transition tables
		for (let rulename in rules) {
			let rule = rules[rulename];
			let state = name2state[rulename];
			let trans = this.table[state];
			let pos = 0;
			let scanColor = () => {
				while (rule[pos] === " ") pos++;
				for (let c in Language.scanner_colors) {
					if (rule.substring(pos, pos + c.length) === c) {
						pos += c.length;
						return Language.scanner_colors[c];
					}
				}
				throw "invalid scanner rule (" + pos + "): " + rule;
			};
			let scanState = () => {
				while (rule[pos] === " ") pos++;
				let identifier = rule[pos];
				pos++;
				while (
					rule[pos] === "_" ||
					(rule[pos] >= "0" && rule[pos] <= "9") ||
					(rule[pos] >= "A" && rule[pos] <= "Z") ||
					(rule[pos] >= "a" && rule[pos] <= "z")
				) {
					identifier += rule[pos];
					pos++;
				}
				if (name2state.hasOwnProperty(identifier))
					return name2state[identifier];
				throw "invalid scanner rule (" + pos + "): " + rule;
			};
			let scanSemicolon = () => {
				while (rule[pos] === " ") pos++;
				if (rule[pos] !== ";")
					throw "invalid scanner rule (" + pos + "): " + rule;
				pos++;
				return;
			};
			let scanKeyword = (kw) => {
				while (rule[pos] === " ") pos++;
				if (rule.substring(pos, pos + kw.length) !== kw) return false;
				pos += kw.length;
				return true;
			};
			let scanSet = () => {
				while (rule[pos] === " ") pos++;
				let set = new Set<number>();
				while (true) {
					let begin = rule.charCodeAt(pos);
					if (begin === " ") break;
					begin = this.character2code(begin);
					let end = begin;
					pos++;
					if (rule[pos] === "-") {
						pos++;
						end = this.character2code(rule.charCodeAt(pos));
						if (end <= begin)
							throw "invalid scanner rule (" + pos + "): " + rule;
						pos++;
					}
					for (let i = begin; i <= end; i++) set.add(i);
					if (rule[pos] !== "+") break;
					pos++;
				}
				return set;
			};

			// parse number of pending characters, if any
			let pending = 0;
			if (rule[0] >= "0" && rule[0] <= "9") {
				pos++;
				while (rule[pos] >= "0" && rule[pos] <= "9") pos++;
				pending = parseInt(rule.substring(0, pos));
				scanSemicolon();
			}
			this.num_pending[state] = pending;

			// parse default result
			let highlight = scanColor();
			let successor = scanState();
			let bracket = scanKeyword("bracket");
			let again = scanKeyword("again");
			scanSemicolon();
			trans[0] = Language.compose(highlight, bracket, false, 0, state);
			let composite = Language.compose(
				highlight,
				bracket,
				again,
				pending,
				successor
			);
			for (let i = 1; i < 99; i++) trans[i] = composite;

			// parse rules
			while (pos < rule.length) {
				// handle keywords clause by splitting the state
				if (scanKeyword("keywords")) {
					let keyword_highlight = scanColor();

					// let the original state represent the empty prefix,
					// create an absorbing state for all unknown prefixes
					let fin_s = this.table.length;
					let fin_t = new Uint32Array(trans);
					for (let i = 0; i < 99; i++) {
						let s = (trans[i] / Language.scanresult_state) | 0;
						if (s === state) {
							let new_c =
								trans[i] +
								Language.scanresult_state * (fin_s - state);
							trans[i] = new_c;
							fin_t[i] = new_c;
						}
					}
					this.table.push(fin_t);
					this.num_pending.push(0);

					// split the state for each valid, non-empty keyword prefix
					if (rule[rule.length - 1] !== ";")
						throw "invalid scanner rule (" + pos + "): " + rule;
					let keywords = rule
						.substring(pos, rule.length - 1)
						.split(" ");
					let prefixes = new Map<Uint32Array, number>(); // map prefix to state index
					for (let kw of keywords) {
						if (kw === "") continue;
						let prev_s = state;
						let prev_t = trans;
						for (let l = 1; l <= kw.length; l++) {
							let prefix = kw.substring(0, l);
							let sub_s: number = 0;
							let sub_t: Uint32Array = new Uint32Array();
							if (prefixes.has(prefix)) {
								sub_s = prefixes.get(prefix)!;
								sub_t = this.table[sub_s]!;
							} else {
								sub_s = this.table.length;
								sub_t = new Uint32Array(fin_t);
								this.table.push(sub_t);
								this.num_pending.push(l);
								prefixes.set(prefix, sub_s);
							}

							// create the transition towards this state
							let c = this.character2code(kw.charCodeAt(l - 1));
							prev_t[c] =
								(prev_t[c] &
									(Language.scanresult_highlight_mask |
										Language.scanresult_bracket_bit |
										Language.scanresult_again_bit)) |
								(Language.scanresult_pending * l) |
								(Language.scanresult_state * sub_s);

							// create keyword transitions
							if (l === kw.length) {
								for (let i = 1; i < 99; i++) {
									let s =
										(sub_t[i] / Language.scanresult_state) |
										0;
									if (s < num) {
										let h =
											sub_t[i] &
											Language.scanresult_highlight_mask;
										sub_t[i] += keyword_highlight - h;
									}
								}
							}

							prev_s = sub_s;
							prev_t = sub_t;
						}
					}
					break;
				} else {
					let set = scanSet();
					let highlight = scanColor();
					let successor = scanState();
					let bracket = scanKeyword("bracket");
					let again = scanKeyword("again");
					scanSemicolon();
					let composite = Language.compose(
						highlight,
						bracket,
						again,
						pending,
						successor
					);
					for (let i of set) trans[i] = composite;
				}
			}
		}
	}

	// Turn a 32-bit unicode code point into a code in the range 0:99.
	public character2code(character: number) {
		if (character === 0) return 0;
		if (character === 9) return 1;
		else if (character === 10) return 2;
		else if (character >= 32 && character < 127) return character - 29;
		else return 98;
	}

	// Given a state and a character, return a composite table entry.
	// The 32-bit integer table entry contains the following information:
	// bits 0-3: highlighting of the pending characters; the input character is included if "again" is false
	// bit 4: set if the input is an active bracket
	// bit 5: again; request to call process again with the same character, but with the updated state (the input character remains pending)
	// bits 6-11: number of pending characters (up to 63)
	// bits 12-30: successor state after the transition
	public process(state: number, character: number) {
		let c = this.character2code(character);
		return this.table[state][c];
	}

	// Compose a 32-bit table entry from components
	public static compose(
		highlight: number,
		bracket: boolean,
		again: boolean,
		pending: number,
		nextstate: number
	) {
		return (
			highlight |
			(bracket ? Language.scanresult_bracket_bit : 0) |
			(again ? Language.scanresult_again_bit : 0) |
			(Language.scanresult_pending * pending) |
			(Language.scanresult_state * nextstate)
		);
	}

	// split the table entry into its components
	public static split(entry: number) {
		return [
			entry & Language.scanresult_highlight_mask,
			(entry & Language.scanresult_bracket_bit) != 0,
			(entry & Language.scanresult_again_bit) != 0,
			((entry & Language.scanresult_pending_mask) /
				Language.scanresult_pending) |
				0,
			(entry / Language.scanresult_state) | 0,
		];
	}

	// access the components of a table entry individually
	public static highlight(entry: number) {
		return entry & Language.scanresult_highlight_mask;
	}
	public static bracket(entry: number) {
		return (entry & Language.scanresult_bracket_bit) != 0;
	}
	public static again(entry: number) {
		return (entry & Language.scanresult_again_bit) != 0;
	}
	public static pending(entry: number) {
		return (
			((entry & Language.scanresult_pending_mask) /
				Language.scanresult_pending) |
			0
		);
	}
	public static state(entry: number) {
		return (entry / Language.scanresult_state) | 0;
	}

	// do not touch the following definitions
	private static readonly scanresult_highlight_mask = 15; // highlight color 0 to 9
	private static readonly scanresult_bracket_bit = 16; // is this bracket supposed to be highlighted and matched?
	private static readonly scanresult_again_bit = 32; // is the scanner supposed to be called again on the same input?
	private static readonly scanresult_pending_mask = 4096 - 64; // bit mask for the number of pending characters
	private static readonly scanresult_pending = 64; // divisor for the number of pending characters
	private static readonly scanresult_state = 4096; // divisor for the successor state
	private static readonly scanner_colors = {
		plain: 0,
		black: 0, // plain in light theme
		white: 0, // plain in dark theme
		blue: 1,
		green: 2,
		cyan: 3,
		red: 4,
		magenta: 5,
		brown: 6,
		orange: 7,
		yellow: 8,
		gray: 9,
		grey: 9,
	};
}
