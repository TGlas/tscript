import { SimFn } from "../interpreter/program-elements";

export const simfalse: SimFn = () => false;

/** Used for PEs that always complete after their first instruction */
export const simtrue: SimFn = () => true;

export const callsim: SimFn = function () {
	let frame = this.stack[this.stack.length - 1];
	let pe = frame.pe[frame.pe.length - 1];
	let ip = frame.ip[frame.ip.length - 1];
	let n = pe.arguments.length;
	return ip === n + 1;
};
