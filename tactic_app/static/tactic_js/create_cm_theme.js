
export {createCMTheme}

function createCMTheme(styleDict) {
    const settings = styleDict.settings;
    return {
        themeCss: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            '&': {
                backgroundColor: settings.background,
                color: settings.foreground,
            },
            '.cm-content': {
                caretColor: settings.caret,
            },
            '.cm-cursor, .cm-dropCursor': {
                borderLeftColor: settings.caret,
            },
            '&.cm-focused .cm-selectionBackgroundm .cm-selectionBackground, .cm-content ::selection': {
                backgroundColor: settings.selection,
            },
            '.cm-activeLine': {
                backgroundColor: settings.lineHighlight,
            },
            '.cm-gutters': {
                backgroundColor: settings.gutterBackground,
                color: settings.gutterForeground,
            },
            '.cm-activeLineGutter': {
                backgroundColor: settings.lineHighlight,
            },
        },
        highlightStyles: styleDict.styles
    };
}

