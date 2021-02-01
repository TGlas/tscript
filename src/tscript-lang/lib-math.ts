import { TScript } from "../tscript";
import { Typeid } from "../helpers/typeIds";
import { tscript_math } from "./lib-math.tscript";

export const lib_math = {
    source: tscript_math,
    "impl": {
        "math": {
                "pi": function(arg) {
                    return {"type": this.program.types[Typeid.typeid_real], "value": {"b": 3.141592653589793}};
                },
                "e": function(arg) {
                    return {"type": this.program.types[Typeid.typeid_real], "value": {"b": 2.718281828459045}};
                },
                "abs": function(arg) {
                    if (TScript.isDerivedFrom(arg.type, Typeid.typeid_integer)) return {"type": this.program.types[Typeid.typeid_integer], "value": {"b": Math.abs(arg.value.b) | 0 }};
                    else if (TScript.isDerivedFrom(arg.type, Typeid.typeid_real)) return {"type": this.program.types[Typeid.typeid_real], "value": {"b": Math.abs(arg.value.b) }};
                    else this.error("/argument-mismatch/am-1", ["x", "math.abs", "numeric argument", TScript.displayname(arg.type)]);
                },
                "sqrt": function(arg) {
                    if (TScript.isNumeric(arg.type)) return {"type": this.program.types[Typeid.typeid_real], "value": {"b": Math.sqrt(arg.value.b) }};
                    else this.error("/argument-mismatch/am-1", ["x", "math.sqrt", "numeric argument", TScript.displayname(arg.type)]);
                },
                "cbrt": function(arg) {
                    if (TScript.isNumeric(arg.type)) return {"type": this.program.types[Typeid.typeid_real], "value": {"b": Math.cbrt(arg.value.b) }};
                    else this.error("/argument-mismatch/am-1", ["x", "math.cbrt", "numeric argument", TScript.displayname(arg.type)]);
                },
                "floor": function(arg) {
                    if (TScript.isNumeric(arg.type)) return {"type": this.program.types[Typeid.typeid_real], "value": {"b": Math.floor(arg.value.b) }};
                    else this.error("/argument-mismatch/am-1", ["x", "math.floor", "numeric argument", TScript.displayname(arg.type)]);
                },
                "round": function(arg) {
                    if (TScript.isNumeric(arg.type)) return {"type": this.program.types[Typeid.typeid_real], "value": {"b": Math.round(arg.value.b) }};
                    else this.error("/argument-mismatch/am-1", ["x", "math.round", "numeric argument", TScript.displayname(arg.type)]);
                },
                "ceil": function(arg) {
                    if (TScript.isNumeric(arg.type)) return {"type": this.program.types[Typeid.typeid_real], "value": {"b": Math.ceil(arg.value.b) }};
                    else this.error("/argument-mismatch/am-1", ["x", "math.ceil", "numeric argument", TScript.displayname(arg.type)]);
                },
                "sin": function(arg) {
                    if (TScript.isNumeric(arg.type)) return {"type": this.program.types[Typeid.typeid_real], "value": {"b": Math.sin(arg.value.b) }};
                    else this.error("/argument-mismatch/am-1", ["x", "math.sin", "numeric argument", TScript.displayname(arg.type)]);
                },
                "cos": function(arg) {
                    if (TScript.isNumeric(arg.type)) return {"type": this.program.types[Typeid.typeid_real], "value": {"b": Math.cos(arg.value.b) }};
                    else this.error("/argument-mismatch/am-1", ["x", "math.cos", "numeric argument", TScript.displayname(arg.type)]);
                },
                "tan": function(arg) {
                    if (TScript.isNumeric(arg.type)) return {"type": this.program.types[Typeid.typeid_real], "value": {"b": Math.tan(arg.value.b) }};
                    else this.error("/argument-mismatch/am-1", ["x", "math.tan", "numeric argument", TScript.displayname(arg.type)]);
                },
                "sinh": function(arg) {
                    if (TScript.isNumeric(arg.type)) return {"type": this.program.types[Typeid.typeid_real], "value": {"b": Math.sinh(arg.value.b) }};
                    else this.error("/argument-mismatch/am-1", ["x", "math.sinh", "numeric argument", TScript.displayname(arg.type)]);
                },
                "cosh": function(arg) {
                    if (TScript.isNumeric(arg.type)) return {"type": this.program.types[Typeid.typeid_real], "value": {"b": Math.cosh(arg.value.b) }};
                    else this.error("/argument-mismatch/am-1", ["x", "math.cosh", "numeric argument", TScript.displayname(arg.type)]);
                },
                "tanh": function(arg) {
                    if (TScript.isNumeric(arg.type)) return {"type": this.program.types[Typeid.typeid_real], "value": {"b": Math.tanh(arg.value.b) }};
                    else this.error("/argument-mismatch/am-1", ["x", "math.tanh", "numeric argument", TScript.displayname(arg.type)]);
                },
                "asin": function(arg) {
                    if (TScript.isNumeric(arg.type)) return {"type": this.program.types[Typeid.typeid_real], "value": {"b": Math.asin(arg.value.b) }};
                    else this.error("/argument-mismatch/am-1", ["x", "math.asin", "numeric argument", TScript.displayname(arg.type)]);
                },
                "acos": function(arg) {
                    if (TScript.isNumeric(arg.type)) return {"type": this.program.types[Typeid.typeid_real], "value": {"b": Math.acos(arg.value.b) }};
                    else this.error("/argument-mismatch/am-1", ["x", "math.acos", "numeric argument", TScript.displayname(arg.type)]);
                },
                "atan": function(arg) {
                    if (TScript.isNumeric(arg.type)) return {"type": this.program.types[Typeid.typeid_real], "value": {"b": Math.atan(arg.value.b) }};
                    else this.error("/argument-mismatch/am-1", ["x", "math.atan", "numeric argument", TScript.displayname(arg.type)]);
                },
                "atan2": function(y, x) {
                    if (! TScript.isNumeric(y.type)) this.error("/argument-mismatch/am-1", ["x", "math.atan2", "numeric argument", TScript.displayname(x.type)]);
                    if (! TScript.isNumeric(x.type)) this.error("/argument-mismatch/am-1", ["x", "math.atan2", "numeric argument", TScript.displayname(y.type)]);
                    return {"type": this.program.types[Typeid.typeid_real], "value": {"b": Math.atan2(y.value.b, x.value.b) }};
                },
                "asinh": function(arg) {
                    if (TScript.isNumeric(arg.type)) return {"type": this.program.types[Typeid.typeid_real], "value": {"b": Math.asinh(arg.value.b) }};
                    else this.error("/argument-mismatch/am-1", ["x", "math.asinh", "numeric argument", TScript.displayname(arg.type)]);
                },
                "acosh": function(arg) {
                    if (TScript.isNumeric(arg.type)) return {"type": this.program.types[Typeid.typeid_real], "value": {"b": Math.acosh(arg.value.b) }};
                    else this.error("/argument-mismatch/am-1", ["x", "math.acosh", "numeric argument", TScript.displayname(arg.type)]);
                },
                "atanh": function(arg) {
                    if (TScript.isNumeric(arg.type)) return {"type": this.program.types[Typeid.typeid_real], "value": {"b": Math.atanh(arg.value.b) }};
                    else this.error("/argument-mismatch/am-1", ["x", "math.atanh", "numeric argument", TScript.displayname(arg.type)]);
                },
                "exp": function(arg) {
                    if (TScript.isNumeric(arg.type)) return {"type": this.program.types[Typeid.typeid_real], "value": {"b": Math.exp(arg.value.b) }};
                    else this.error("/argument-mismatch/am-1", ["x", "math.exp", "numeric argument", TScript.displayname(arg.type)]);
                },
                "log": function(arg) {
                    if (TScript.isNumeric(arg.type)) return {"type": this.program.types[Typeid.typeid_real], "value": {"b": Math.log(arg.value.b) }};
                    else this.error("/argument-mismatch/am-1", ["x", "math.log", "numeric argument", TScript.displayname(arg.type)]);
                },
                "log2": function(arg) {
                    if (TScript.isNumeric(arg.type)) return {"type": this.program.types[Typeid.typeid_real], "value": {"b": Math.log2(arg.value.b) }};
                    else this.error("/argument-mismatch/am-1", ["x", "math.log2", "numeric argument", TScript.displayname(arg.type)]);
                },
                "log10": function(arg) {
                    if (TScript.isNumeric(arg.type)) return {"type": this.program.types[Typeid.typeid_real], "value": {"b": Math.log10(arg.value.b) }};
                    else this.error("/argument-mismatch/am-1", ["x", "math.log10", "numeric argument", TScript.displayname(arg.type)]);
                },
                "pow": function(base, exponent) {
                    if (! TScript.isNumeric(base.type)) this.error("/argument-mismatch/am-1", ["base", "math.pow", "numeric argument", TScript.displayname(base.type)]);
                    if (! TScript.isNumeric(exponent.type))this.error("/argument-mismatch/am-1", ["exponent", "math.pow", "numeric argument", TScript.displayname(exponent.type)]);
                    return {"type": this.program.types[Typeid.typeid_real], "value": {"b": Math.pow(base.value.b, exponent.value.b) }};
                },
                "sign": function(arg) {
                    if (TScript.isNumeric(arg.type)) return {"type": this.program.types[TScript.isDerivedFrom(arg.type, Typeid.typeid_integer) ? Typeid.typeid_integer : Typeid.typeid_real], "value": {"b": Math.sign(arg.value.b) }};
                    else this.error("/argument-mismatch/am-1", ["x", "math.sign", "numeric argument", TScript.displayname(arg.type)]);
                },
                "min": function(a, b) {
                    if (TScript.order.call(this, a, b) <= 0) return a; else return b;
                },
                "max": function(a, b) {
                    if (TScript.order.call(this, a, b) >= 0) return a; else return b;
                },
                "random": function() {
                    return {"type": this.program.types[Typeid.typeid_real], "value": {"b": Math.random() }};
                },
        },
    },
};