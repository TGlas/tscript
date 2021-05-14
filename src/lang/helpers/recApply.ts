import { Typeid } from "./typeIds";

// Recursively apply an operation to a loop-free typed data structure.
// If a loop is detected then a "recursive data structure" exception is thrown.
// The function operation is invoked on each non-container value.
// The function compose(...) is invoked on a container holding return values
// of operation and container. Both functions return the processed result.
export function recApply(value, operation, compose) {
	function doit(v, k) {
		if (v.type.id === Typeid.typeid_array) {
			if (k.has(v)) throw "recursive data structure";
			let known = new Set<any>(k);
			known.add(v);
			let b = Array<any>();
			for (let i = 0; i < v.value.b.length; i++) {
				let c = doit.call(this, v.value.b[i], known);
				b.push(c);
			}
			return compose.call(this, b);
		} else if (v.type.id === Typeid.typeid_dictionary) {
			if (k.has(v)) throw "recursive data structure";
			let known = new Set(k);
			known.add(v);
			let b = {};
			for (let key in v.value.b) {
				if (!v.value.b.hasOwnProperty(key)) continue;
				let c = doit.call(this, v.value.b[key], known);
				b[key] = c;
			}
			return compose.call(this, b);
		} else {
			return operation.call(this, v);
		}
	}
	return doit.call(this, value, new Set());
}
