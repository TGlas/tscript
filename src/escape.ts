export function escapeHtmlChars(s) {
	let ret = "";
	for (let i = 0; i < s.length; i++) {
		let c = s[i];
		if (c == "\n") ret += "<br/>";
		else if (c == '"') ret += "&quot;";
		else if (c == "<") ret += "&lt;";
		else if (c == ">") ret += "&gt;";
		else if (c == "&") ret += "&amp;";
		else ret += c;
	}
	return ret;
}
