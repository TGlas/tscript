// exception type
export class RuntimeError extends Error {
	public filename;
	public line;
	public ch;
	public href;

	public constructor(
		msg,
		filename: any = undefined,
		line: any = undefined,
		ch: any = undefined,
		href: any = undefined
	) {
		super();
		this.message = msg;
		this.name = "Runtime Error";

		if (typeof filename === "undefined") filename = null;
		if (typeof line === "undefined") line = null;
		if (typeof ch === "undefined") ch = null;
		if (typeof href === "undefined") href = "";
		this.filename = filename;
		this.line = line;
		this.ch = ch;
		this.href = href;
	}
}
