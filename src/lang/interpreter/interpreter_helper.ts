import { ErrorHelper } from "../errors/ErrorHelper";
import { binary_operator_impl, left_unary_operator_impl } from "../parser/parser_helper";
import { TScript } from "..";
import { simfalse } from "../helpers/sims";
import { Typeid } from "../helpers/typeIds";

export function deepcopy(value, excludekeys)
{
    if (typeof excludekeys === 'undefined') excludekeys = {};
    if (Array.isArray(value))
    {
        let ret = new Array();
        for (let i=0; i<value.length; i++) ret.push(deepcopy(value[i], excludekeys));
        return ret;
    }
    else if ((typeof value === "object") && (value !== null))
    {
        let ret = {};
        for (let key in value)
        {
            if (! value.hasOwnProperty(key)) continue;
            if (excludekeys.hasOwnProperty(key)) continue;
            ret[key] = deepcopy(value[key], excludekeys);
        }
        return ret;
    }
    else return value;
}

    // deep copy of a boxed constant
export function copyconstant(constant)
{
    if (constant.type.id === Typeid.typeid_array)
    {
        let value = new Array();
        for (let i=0; i<constant.value.b.length; i++) value.push(copyconstant.call(this, constant.value.b[i]));
        return {"type": this.program.types[Typeid.typeid_array], "value": {"b": value}};
    }
    else if (constant.type.id === Typeid.typeid_dictionary)
    {
        let value = {};
        for (let key in constant.value.b)
        {
            if (constant.value.b.hasOwnProperty(key)) value[key] = copyconstant.call(this, constant.value.b[key]);
        }
        return {"type": this.program.types[Typeid.typeid_dictionary], "value": {"b": value}};
    }
    else return constant;
}


// step function of all constants
export function constantstep()
{
	let frame = this.stack[this.stack.length - 1];
	let pe = frame.pe[frame.pe.length - 1];
	frame.temporaries.push(copyconstant.call(this, pe.typedvalue));
	frame.pe.pop();
	frame.ip.pop();
	return false;
};

// step function of most scopes, including global scope and functions
export function scopestep()
{
	let frame = this.stack[this.stack.length - 1];
	let pe = frame.pe[frame.pe.length - 1];
	let ip = frame.ip[frame.ip.length - 1];
	if (ip < pe.commands.length)
	{
		if (! pe.commands[ip].declaration)
		{
			frame.pe.push(pe.commands[ip]);
			frame.ip.push(-1);
		}
		return false;
	}
	else
	{
		frame.pe.pop();
		frame.ip.pop();
		if (pe.petype === "function")
		{
			this.stack.pop();
			let frame = this.stack[this.stack.length - 1];
			frame.temporaries.push({"type": this.program.types[Typeid.typeid_null], "value": {"b": null}});
			return false;
		}
		else if (pe.petype === "global scope")
		{
			// the program has finished
			this.stack.pop();
			return false;
		}
		else return false;
	}
}



// Create a program element of type breakpoint.
// The breakpoint is initially inactive.
export function create_breakpoint(parent, state)
{
	let active = false;
	return {
			"petype": "breakpoint",
			"parent": parent,
			"line": state.line,
			"where": state.get(),
			"active": function()
					{ return active; },
			"set": function()
					{ active = true; },
			"clear": function()
					{ active = false; },
			"toggle": function()
					{ active = !active; },
					"step": function()
					{
						let frame = this.stack[this.stack.length - 1];
						if (active)
						{
							this.interrupt();
							if (this.service.breakpoint) this.service.breakpoint();
						}
						frame.pe.pop();
						frame.ip.pop();
						return false;
					},
			"sim": () => active,
			};
}

export function get_program(pe)
{
	while (pe.parent) pe = pe.parent;
	return pe;
}

export function get_function(pe)
{
	while (true)
	{
		if (pe.petype === "function" || pe.petype === "method") return pe;
		if (pe.petype === "type") return null;
		if (! pe.parent) return pe;
		pe = pe.parent;
	}
}

export function get_type(pe)
{
	while (pe)
	{
		if (pe.petype === "type") return pe;
		pe = pe.parent;
	}
	return null;
}

export function get_context(pe)
{
	while (true)
	{
		if (pe.petype === "function" || pe.petype === "method" || pe.petype === "type" || ! pe.parent) return pe;
		pe = pe.parent;
	}
}

// Return an alternative pe, which is a constant, if possible.
// Otherwise return null.
export function asConstant(pe, state)
{
	if (pe.petype === "constant")
	{
		return pe;
	}
	else if (pe.petype === "array")
	{
		let value = new Array();
		for (let i=0; i<pe.elements.length; i++)
		{
			let sub = asConstant(pe.elements[i], state);
			if (sub === null) return null;
			value.push(sub.typedvalue);
		}
		return { "petype": "constant", "where": pe.where, "typedvalue": {"type": get_program(pe).types[Typeid.typeid_array], "value": {"b": value}}, "step": constantstep, "sim": simfalse };
	}
	else if (pe.petype === "dictionary")
	{
		let value = {};
		for (let i=0; i<pe.keys.length; i++)
		{
			let sub = asConstant(pe.values[i], state);
			if (sub === null) return null;
			value['#' + pe.keys[i]] = sub.typedvalue;
		}
		return { "petype": "constant", "where": pe.where, "typedvalue": {"type": get_program(pe).types[Typeid.typeid_dictionary], "value": {"b": value}}, "step": constantstep, "sim": simfalse };
	}
	else if (pe.petype.substring(0, 20) === "left-unary operator ")
	{
		let sub = asConstant(pe.argument, state);
		if (sub === null) return null;
		let symbol = pe.petype.substring(20);
		return { "petype": "constant", "where": pe.where, "typedvalue": left_unary_operator_impl[symbol].call(state, sub.typedvalue), "step": constantstep, "sim": simfalse };
	}
	else if (pe.petype.substring(0, 16) === "binary operator ")
	{
		let lhs = asConstant(pe.lhs, state);
		if (lhs === null) return null;
		let rhs = asConstant(pe.rhs, state);
		if (rhs === null) return null;
		let symbol = pe.petype.substring(16);
		return { "petype": "constant", "where": pe.where, "typedvalue": binary_operator_impl[symbol].call(state, lhs.typedvalue, rhs.typedvalue), "step": constantstep, "sim": simfalse };
	}
	else return null;
}