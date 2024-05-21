import * as tgui from "../tgui";

// manage documentation container or window
let onDocumentationClick: any = null;
let documentationWindow: any = null;

export function showdoc(path = "") {
	if (onDocumentationClick) {
		// notify a surrounding application of a doc link click
		onDocumentationClick(path);
	} else {
		// open documentation in a new window; this enables proper browser navigation
		if (documentationWindow) {
			documentationWindow.close();
			documentationWindow = null;
		}
		if (path.startsWith("#/")) path = path.slice(1);
		showdocWindow("?doc=" + path);
	}
}

function showdocWindow(href: string) {
	// open documentation in a new window; this enables proper browser navigation
	if (documentationWindow) {
		documentationWindow.close();
		documentationWindow = null;
	}
	documentationWindow = window.open(href, "TScript documentation");
}

export function showdocConfirm(path?: string, search_string?: string) {
	// The dialog is added here, because some browsers disallow
	// that a new tab/window is created, when not initiated by a button press.
	// In this case the user would simply press [Enter] which should be no problem.
	let dlg = tgui.createModal({
		title: "Open documentation",
		scalesize: [0.2, 0.15],
		minsize: [300, 150],
		buttons: [
			{
				text: "Open tab",
				onClick: () => {
					if (search_string) {
						showdocWindow(
							"?doc=search&q=" + encodeURIComponent(search_string)
						);
					} else {
						showdoc(path);
					}
				},
				isDefault: true,
			},
			{ text: "Cancel" },
		],
	});
	tgui.createElement({
		parent: dlg.content,
		type: "div",
		style: { "margin-top": "10px" },
		text: "Open the documentation in another tab?",
	});

	if (path || search_string) {
		tgui.createElement({
			parent: dlg.content,
			type: "div",
			style: { "margin-top": "10px" },
			text: search_string
				? 'Search for "' + search_string + '"?'
				: 'Go to "' + path + '"?',
		});
	}

	tgui.startModal(dlg);
}
