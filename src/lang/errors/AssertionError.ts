export class AssertionError extends Error {
	public constructor(msg: string) {
		super();
		this.message = msg;
		this.name = "Assertion Error";
	}
}
