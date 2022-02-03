export function simfalse() {
	return false;
}

export function simtrue() {
	return true;
}

export function callsim() {
	let frame = this.stack[this.stack.length - 1];
	let pe = frame.pe[frame.pe.length - 1];
	let ip = frame.ip[frame.ip.length - 1];
	let n = pe.arguments.length;
	return ip === n + 1;
}
