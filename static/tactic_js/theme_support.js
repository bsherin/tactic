import {HighlightStyle, syntaxHighlighting} from "@codemirror/language";
import {EditorView} from "@codemirror/view";
import catalog from "./codemirror_theme_catalog.json";

export {importTheme, themeCatalog, themeList, themesByVariant};

const themeCatalog = catalog.themes;
const themeList = themeCatalog.map(theme => theme.id);
const themesByVariant = {
    dark: themeCatalog.filter(theme => theme.variant === "dark"),
    light: themeCatalog.filter(theme => theme.variant === "light"),
};
const themesById = new Map(themeCatalog.map(theme => [theme.id, theme]));

function resolveTheme(themeName, variant) {
    const requestedTheme = themesById.get(themeName);
    if (requestedTheme && requestedTheme.variant === variant) {
        return requestedTheme;
    }
    return themesById.get(catalog.defaults[variant]);
}

function normalizeLocalTheme(theme, variant) {
    if (!Array.isArray(theme) || theme.length !== 2) {
        throw new Error("Local CodeMirror themes must export [themeCss, highlightStyles]");
    }
    return [
        EditorView.theme(theme[0], {dark: variant === "dark"}),
        syntaxHighlighting(HighlightStyle.define(theme[1])),
    ];
}

async function importLocalTheme(theme) {
    const module = theme.variant === "dark"
        ? await import(
            /* webpackChunkName: "codemirror-dark-theme-[request]" */
            `./codemirror_dark_themes/${theme.id}.js`
        )
        : await import(
            /* webpackChunkName: "codemirror-light-theme-[request]" */
            `./codemirror_light_themes/${theme.id}.js`
        );
    return normalizeLocalTheme(module[theme.export], theme.variant);
}

async function importTheme(themeName, darkOrLight) {
    const variant = darkOrLight === "light" ? "light" : "dark";
    const theme = resolveTheme(themeName, variant);
    if (!theme) {
        throw new Error(`No default CodeMirror theme is configured for ${variant} mode`);
    }
    if (theme.source === "local") {
        return importLocalTheme(theme);
    }
    const themeBundle = await import(
        /* webpackChunkName: "codemirror-fsegurai-themes" */
        "@fsegurai/codemirror-theme-bundle"
    );
    const extension = themeBundle[theme.export];
    if (!extension) {
        throw new Error(`CodeMirror theme export ${theme.export} was not found`);
    }
    return extension;
}
