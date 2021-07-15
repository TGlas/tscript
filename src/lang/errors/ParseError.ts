export class ParseError extends Error {
	public constructor(msg: string) {
		super();
		this.message = msg;
		this.name = "Parse Error";
	}
}
