import { ErrorHelper } from "../errors/ErrorHelper";
import { Lexer } from "./lexer";
import { get_type } from "../helpers/getParents";
import { TScript } from "..";
import { simfalse, callsim } from "../helpers/sims";
import { callstep } from "../helpers/steps";
import { Typeid } from "../helpers/typeIds";
import { parse_expression } from "./parse_expression";
import { ParseOptions, ParserState } from ".";

// Parse the argument list of a function call.
// The expression to the left of the parenthesis is provided as #base.
export function parse_call(
	state: ParserState,
	parent,
	base,
	options: ParseOptions
) {
	// parse the opening parenthesis, which is assumed to be already detected
	let where = state.get();
	let token = Lexer.get_token(state, options);
	ErrorHelper.assert(token.value === "(", "[parse_call] internal error");

	// parse comma-separated list of possibly named expressions
	let args = new Array();
	token = Lexer.get_token(state, options, true);
	if (token.type === "grouping" && token.value === ")")
		Lexer.get_token(state, options);
	else {
		let forcenamed = false;
		while (true) {
			// check for named parameters
			let where = state.get();
			let named = false;
			let name = Lexer.get_token(state, options);
			if (name.type === "identifier") {
				let token = Lexer.get_token(state, options);
				if (token.type === "operator" && token.value === "=")
					named = true;
				else state.set(where);
			} else state.set(where);
			if (forcenamed && !named) state.error("/syntax/se-14");
			if (named) forcenamed = true;

			// handle the actual argument
			let ex = parse_expression(state, parent, options);
			if (named) {
				let pe: any = {
					petype: "named argument",
					children: [ex],
					where: where,
					parent: parent,
					name: name.value,
					argument: ex,
					step: function () {
						let frame = this.stack[this.stack.length - 1];
						let pe: any = frame.pe[frame.pe.length - 1];
						let ip = frame.ip[frame.ip.length - 1];
						if (ip === 0) {
							frame.pe.push(pe.argument);
							frame.ip.push(-1);
							return false;
						} else {
							frame.pe.pop();
							frame.ip.pop();
							return false;
						}
					},
					sim: simfalse,
				};
				args.push(pe);
			} else args.push(ex);

			// delimiter or end
			token = Lexer.get_token(state, options);
			if (token.type === "grouping" && token.value === ")") break;
			else if (token.value !== ",") {
				state.set(Lexer.before_token);
				state.error("/syntax/se-15");
			}
		}
	}

	// create the function call operator
	let pe: any = {
		petype: "function call",
		children: [base].concat(args),
		where: where,
		parent: parent,
		base: base,
		arguments: args,
		step: callstep,
		sim: callsim,
		passResolveBack: function (state) {
			// check arguments at parse time if possible (which is the case most of the time)
			if (base.petype === "constant") {
				// check base type
				let f: any = null;
				if (
					TScript.isDerivedFrom(
						base.typedvalue.type,
						Typeid.typeid_function
					)
				)
					f = base.typedvalue.value.b.func;
				else if (
					TScript.isDerivedFrom(
						base.typedvalue.type,
						Typeid.typeid_type
					)
				) {
					let cls = base.typedvalue.value.b;
					ErrorHelper.assert(
						cls.class_constructor,
						"[parse_call] internal error; missing constructor"
					);
					if (cls.class_constructor.access !== "public") {
						// check whether the constructor is accessible from the current context
						let sub_cl = get_type(parent);
						let error = false;
						if (cls.class_constructor.access === "private") {
							if (sub_cl === null || sub_cl.id !== cls.id)
								error = true;
						} else if (
							cls.class_constructor.access === "protected"
						) {
							if (
								sub_cl === null ||
								!TScript.isDerivedFrom(sub_cl, cls.id)
							)
								error = true;
						} else error = true;
						if (error) {
							state.set(Lexer.before_token);
							state.error("/name/ne-25", [
								TScript.displayname(cls),
								cls.class_constructor.access,
							]);
						}
					}
					f = base.typedvalue.value.b.class_constructor;
				} else state.error("/syntax/se-16", [base.typedvalue.type]);

				let n = args.length; // number of given arguments
				let m = f.params.length; // number of required parameters
				let params = new Array(); // which parameters are provided?
				for (let i = 0; i < m; i++) params.push(false);

				// handle positional and named arguments
				for (let i = 0; i < n; i++) {
					if (args[i].petype === "named argument") {
						// parameter name lookup
						let name = args[i].name;
						let found = false;
						for (let j = 0; j < m; j++) {
							if (
								f.params[j].hasOwnProperty("name") &&
								f.params[j].name === name
							) {
								if (params[j])
									state.error("/name/ne-1", [
										name,
										TScript.displayname(f),
									]);
								params[j] = true;
								found = true;
								break;
							}
						}
						if (!found)
							state.error("/name/ne-2", [
								name,
								TScript.displayname(f),
							]);
					} else {
						if (i < params.length) params[i] = args[i];
						else
							state.error("/name/ne-3", [TScript.displayname(f)]);
					}
				}

				// check whether all missing parameters are covered by default values
				for (let j = 0; j < m; j++) {
					if (
						!params[j] &&
						!f.params[j].hasOwnProperty("defaultvalue")
					)
						state.error("/name/ne-4", [
							j +
								1 +
								" (" +
								TScript.displayname(f.params[j]) +
								")",
							TScript.displayname(f),
						]);
				}
			}
		},
	};

	return pe;
}
