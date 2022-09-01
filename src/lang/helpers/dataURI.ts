// Check a data URI for formal correctness. The function returns the mime
// type in case of success and null in case of a problem.
export function checkURI(dataURI) {
	if (dataURI.substring(0, 5) != "data:") return null;
	let p = dataURI.split(",");
	if (p.length != 2) return null;
	let q = p[0].substring(5).split(";");
	if (q.length > 1 && (q.length > 2 || q[1] != "base64")) return null;
	let mime = q[0];
	return mime;
}

// Turn a data URI into an ArrayBuffer, return the buffer and its MIME type.
// The function throws an exception on error.
export function data2arraybuffer(dataURI) {
	if (dataURI.substring(0, 5) != "data:") throw "invalid data URI";
	let p = dataURI.split(",");
	if (p.length != 2) throw "invalid data URI";
	let q = p[0].substring(5).split(";");
	if (q.length > 1 && (q.length > 2 || q[1] != "base64"))
		throw "invalid data URI";
	let mime = q[0];
	let byteString = atob(p[1]);
	let buffer = new ArrayBuffer(byteString.length);
	let bytes = new Uint8Array(buffer);
	for (let i = 0; i < byteString.length; i++)
		bytes[i] = byteString.charCodeAt(i);
	return [buffer, mime];
}
