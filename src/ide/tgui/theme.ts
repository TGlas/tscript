/** Available themes */
export type ThemeName = "light" | "dark";

/**
 * Selectable theme configurations: includes `default` for automatic theme detection
 */
export type ThemeConfiguration = "default" | ThemeName;

export const isThemeConfig = (v: any): v is ThemeConfiguration =>
	["light", "dark", "default"].includes(v);

// The theme config starts as light (no class on <body>)
// This is later replaced when the configuration is loaded
let themeConfig: ThemeConfiguration = "light";
export const getThemeConfig = () => themeConfig;

let theme: ThemeName = "light";
export const getResolvedTheme = () => theme;

const themeListeners = new Set<() => void>();

/**
 * Listen to changes to the resolved theme
 *
 * @param handler the callback to call if the resolved theme has changed
 * @returns a function that can be used to unsubscribe
 */
export function subscribeOnThemeChange(handler: () => void) {
	themeListeners.add(handler);
	return () => themeListeners.delete(handler);
}

const prefersDarkQuery = window.matchMedia("(prefers-color-scheme: dark)");

/** Resolve the theme by detecting the system theme */
const resolveTheme = (config: ThemeConfiguration): ThemeName =>
	config === "default"
		? prefersDarkQuery.matches
			? "dark"
			: "light"
		: config;

/**
 * Set the desired theme configuration
 */
export function setThemeConfig(newTheme: ThemeConfiguration) {
	themeConfig = newTheme;
	applyThemeConfig();
}

function applyThemeConfig() {
	const newTheme = resolveTheme(themeConfig);
	if (theme !== newTheme) {
		// Remove old theme class, add new theme class (if applicable)
		// Note that the light theme is represented in the body tag by no class at all
		document.body.classList.remove(`${theme}-theme`);
		if (newTheme !== "light")
			document.body.classList.add(`${newTheme}-theme`);

		theme = newTheme;

		for (const listener of themeListeners) listener();
	}
}
