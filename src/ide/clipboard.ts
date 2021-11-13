///////////////////////////////////////////////////////////
// copy text to the clipboard
//

export function toClipboard(text) {
	// dummy text area
	let textarea = document.createElement("textarea");
	textarea.value = text;
	document.body.appendChild(textarea);
	textarea.focus();
	textarea.select();

	try {
		// actual copy
		document.execCommand("copy");
	} catch (err) {
		// ignore
	}

	// cleanup
	document.body.removeChild(textarea);
}
