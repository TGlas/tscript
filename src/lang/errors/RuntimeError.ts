import { FileID } from "../parser/file_id";

// exception type
export class RuntimeError extends Error {
	public filename: FileID | null;
	public line: number | null;
	public ch: number | null;
	public href: string;

	public constructor(
		msg: string,
		filename?: FileID,
		line?: number,
		ch?: number,
		href?: string
	) {
		super();
		this.message = msg;
		this.name = "Runtime Error";

		this.filename = filename ?? null;
		this.line = line ?? null;
		this.ch = ch ?? null;
		this.href = href ?? "";
	}
}
