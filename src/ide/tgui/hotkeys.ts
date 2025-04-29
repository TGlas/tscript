import { modal } from "./modals";

// global mapping of hotkeys to handlers
let hotkeys = {};
let hotkeyElement = null;

/**
 * register a new hotkey, check for conflicts
 */
export function setHotkey(
	hotkey: string,
	handler: (event: MouseEvent) => Promise<any> | any
) {
	if (!hotkey) return;
	hotkey = normalizeHotkey(hotkey);
	if (hotkeys.hasOwnProperty(hotkey))
		throw (
			"[tgui.setHotkey] hotkey conflict; key '" +
			hotkey +
			"' is already taken"
		);
	hotkeys[hotkey] = handler;
}

/** remove a hotkey */
export function releaseHotkey(hotkey) {
	if (!hotkey) return;
	delete hotkeys[normalizeHotkey(hotkey)];
}

/** remove all hotkeys */
export function releaseAllHotkeys() {
	hotkeys = {};
}

/** return true if the hotkey is in use */
export function hotkey(hotkey) {
	return hotkeys.hasOwnProperty(normalizeHotkey(hotkey));
}

/** enable hotkeys only if the given element is visible */
export function setHotkeyElement(element) {
	hotkeyElement = element;
}

/** normalize the hotkey to lowercase */
export function normalizeHotkey(hotkey) {
	let pos = hotkey.lastIndexOf("-") + 1;
	let key = hotkey.substr(pos);
	if (key.length == 1) return hotkey.substr(0, pos) + key.toLowerCase();
	else return hotkey;
}

/** register a global key listener for hotkey events */
document.addEventListener("keydown", async function (event) {
	if (modal.length > 0) {
		// redirect key events to the topmost dialog
		let dlg = modal[modal.length - 1];
		if (!dlg.onKeyDownOverride) {
			if (event.key == "Escape") {
				return await dlg.handleClose(event);
			}
			if (event.key == "F1") {
				return dlg.handleHelp?.(event);
			} else if (
				event.key == "Enter" &&
				dlg.hasOwnProperty("enterConfirms") &&
				dlg.enterConfirms
			) {
				return await dlg.handleDefault(event);
			}
		}

		if (dlg.hasOwnProperty("onKeyDown")) {
			dlg.onKeyDown(event);
			return false;
		}
	} else {
		if (hotkeyElement && !isElementInViewport(hotkeyElement)) return true;

		// compose the key code string
		let key = event.key;
		if (event.altKey) key = "alt-" + key;
		if (event.ctrlKey) key = "control-" + key;
		if (event.shiftKey) key = "shift-" + key;
		key = normalizeHotkey(key);

		// handle global hotkeys
		if (hotkeys.hasOwnProperty(key)) {
			await hotkeys[key](event);
			event.preventDefault();
			event.stopPropagation();
			return false;
		}
	}
	return true;
});

/**
 * check whether an element is currently visible to the user
 * https://stackoverflow.com/a/7557433
 */
function isElementInViewport(element) {
	var rect = element.getBoundingClientRect();
	if (rect.width == 0 || rect.height == 0) return false;
	if (
		rect.top >=
		(window.innerHeight || document.documentElement.clientHeight)
	)
		return false;
	if (rect.bottom < 0) return false;
	if (
		rect.left >= (window.innerWidth || document.documentElement.clientWidth)
	)
		return false;
	if (rect.right < 0) return false;
	return true;
}
