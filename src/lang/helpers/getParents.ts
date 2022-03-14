export function get_program(pe) {
	while (pe.parent) pe = pe.parent;
	return pe;
}

export function get_function(pe) {
	while (true) {
		if (pe.petype === "function" || pe.petype === "method") return pe;
		if (pe.petype === "type") return null;
		if (!pe.parent) return pe;
		pe = pe.parent;
	}
}

export function get_type(pe) {
	while (pe) {
		if (pe.petype === "type") return pe;
		pe = pe.parent;
	}
	return null;
}

export function get_context(pe) {
	while (true) {
		if (
			pe.petype === "function" ||
			pe.petype === "method" ||
			pe.petype === "type" ||
			!pe.parent
		)
			return pe;
		pe = pe.parent;
	}
}
