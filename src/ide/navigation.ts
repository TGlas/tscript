export interface IPageController {
	navigate?(newLocation: URL): boolean;
	checkUnsavedChanges?(): boolean;
}

export type PageControllerConstructor = {
	new (container: HTMLElement, location: URL): IPageController;
};

export type PageResolver = (url: URL) => PageControllerConstructor | null;

let currentController: IPageController | undefined;
let pageResolver: PageResolver | undefined;

/**
 * Called on load to show the desired page
 *
 * @param url the current URL
 * @param container the container element to place the page in
 * @param resolver a function mapping URLs to their controller classes
 */
export function initializeNavigation(
	url: URL,
	container: HTMLElement,
	resolver: PageResolver
): void {
	if (pageResolver) return;

	const controllerType = resolver(url);
	if (!controllerType) return;

	currentController = new controllerType(container, url);
	pageResolver = resolver;

	window.addEventListener("popstate", () => {
		if (!tryHandleNavigation(new URL(location.href))) location.reload();
	});

	document.addEventListener("click", (event) => {
		if (!(event.target instanceof HTMLAnchorElement)) return;

		if (navigate(event.target.href, false)) event.preventDefault();
	});

	if (currentController.checkUnsavedChanges) {
		window.addEventListener("beforeunload", (event) => {
			if (currentController?.checkUnsavedChanges?.()) {
				event.preventDefault();
				event.returnValue = "";
			}
		});
	}
}

/**
 * Tries to handle a navigation to the given URL by updating the page.
 * If false is returned, it means that the navigation can't be performed by the
 * page itself and the browser needs to take over.
 *
 * @param newUrl the URL to navigate to
 * @returns whether the navigation could be handled by the page
 */
function tryHandleNavigation(newUrl: URL): boolean {
	if (!pageResolver || newUrl.origin !== location.origin) return false;

	const desiredType = pageResolver(newUrl);
	if (
		currentController &&
		currentController.constructor === desiredType &&
		currentController.navigate
	) {
		if (currentController.navigate(newUrl)) return true;
	}

	return false;
}

/**
 * Navigate to the given URL
 *
 * If the new URL belongs to the same origin, the current page tries to handle
 * the navigation by itself. If this fails, a browser navigation is performed
 * by default.
 *
 * @param newUrl the url to navigate to
 * @param navigateFallback whether to let the browser do the navigation if the page couldn't do it
 * @returns whether the navigation was handled by the page
 */
export function navigate(
	newUrl: string | URL,
	navigateFallback = true
): boolean {
	newUrl = new URL(newUrl, location.href);

	if (tryHandleNavigation(newUrl)) {
		try {
			history.pushState(null, "", newUrl);
			return true;
		} catch (e) {}
	}

	if (navigateFallback) location.href = newUrl.toString();
	return false;
}

/**
 * Replaces the current URL with the given one
 *
 * The browser will show the given URL in the address bar without adding a new
 * history entry.
 *
 * @param newUrl the URl navigate to
 * @param navigateFallback whether to let the browser load the new URL if replaceState fails
 */
export function replaceUrl(
	newUrl: string | URL,
	navigateFallback = true
): void {
	try {
		history.replaceState(null, "", newUrl);
	} catch (e) {
		if (navigateFallback) location.replace(newUrl);
	}
}
