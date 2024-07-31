
export {createCMTheme}

function createCMTheme(styleDict) {
    const settings = styleDict.settings;
    return {
        themeCss: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            '&': {
                backgroundColor: settings.background,
                color: settings.foreground,
                border: "borderColor" in settings ? `.5px solid ${settings.borderColor}` : null
            },
            '.cm-content': {
                caretColor: settings.caret,
            },
            '.cm-cursor, .cm-dropCursor': {
                borderLeftColor: settings.caret,
            },
            '&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection': {
                backgroundColor: settings.selection,
            },
            '.cm-activeLine': {
                backgroundColor: settings.lineHighlight,
            },
            '.cm-gutters': {
                backgroundColor: "gutterBackground" in settings ? settings.gutterBackground : settings.background,
                color: "gutterForeground" in settings ? settings.gutterForeground : settings.foreground,
                borderRight: "none"
            },
            ".cm-searchMatch, .cm-activeLineGutter":{
                backgroundColor: settings.selection
            },
            ".cm-searchMatch.cm-searchMatch-selected": {
                backgroundColor: settings.background,
                outline: `3px solid ${settings.selection}`
            }
        },
        highlightStyles: styleDict.styles
    };
}


