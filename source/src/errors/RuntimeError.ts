// exception type
export class RuntimeError extends Error{
    public line;
    public ch;
    public href;

    public constructor(msg, line:any = undefined, ch:any = undefined, href:any = undefined)
	{
        super(msg);

		if (typeof line === 'undefined') line = null;
		if (typeof ch === 'undefined') ch = null;
		if (typeof href === 'undefined') href = "";
		this.line = line;
		this.ch = ch;
		this.href = href;
    }
}
