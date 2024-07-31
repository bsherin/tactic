import { tags } from '@lezer/highlight';

export { material_light }

const config = {
    name: 'material_light',
    dark: false,
    background: '#FAFAFA',
    foreground: '#90A4AE',
    selection: '#80cbc482',
    cursor: '#272727',
    dropdownBackground: '#FAFAFA',
    dropdownBorder: '#00000010',
    activeLine: '#c2c2c222',
    matchingBracket: '#FAFAFA',
    keyword: '#39ADB5',
    storage: '#39ADB5',
    variable: '#90A4AE',
    parameter: '#90A4AE',
    function: '#6182B8',
    string: '#91B859',
    constant: '#39ADB5',
    type: '#E2931D',
    class: '#E2931D',
    number: '#F76D47',
    comment: '#90A4AE',
    heading: '#39ADB5',
    invalid: '#E5393570',
    regexp: '#91B859',
};
var settings ={
    '&': {
        color: config.foreground,
        backgroundColor: config.background,
    },
    '.cm-content': { caretColor: config.cursor },
    '.cm-cursor, .cm-dropCursor': { borderLeftColor: config.cursor },
    '&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection': { backgroundColor: config.selection },
    '.cm-panels': { backgroundColor: config.dropdownBackground, color: config.foreground },
    '.cm-panels.cm-panels-top': { borderBottom: '2px solid black' },
    '.cm-panels.cm-panels-bottom': { borderTop: '2px solid black' },
    '.cm-searchMatch': {
        backgroundColor: config.selection,
    },
    '.cm-activeLine': { backgroundColor: config.activeLine },
    '.cm-selectionMatch': { backgroundColor: config.selection },
    '&.cm-focused .cm-matchingBracket, &.cm-focused .cm-nonmatchingBracket': {
        backgroundColor: config.matchingBracket,
        outline: 'none'
    },
    '.cm-gutters': {
        backgroundColor: config.background,
        color: config.foreground,
        border: 'none'
    },
    '.cm-activeLineGutter': { backgroundColor: config.background },
    '.cm-foldPlaceholder': {
        backgroundColor: 'transparent',
        border: 'none',
        color: config.foreground
    },
    '.cm-tooltip': {
        border: `1px solid ${config.dropdownBorder}`,
        backgroundColor: config.dropdownBackground,
        color: config.foreground,
    },
    '.cm-tooltip .cm-tooltip-arrow:before': {
        borderTopColor: 'transparent',
        borderBottomColor: 'transparent'
    },
    '.cm-tooltip .cm-tooltip-arrow:after': {
        borderTopColor: config.foreground,
        borderBottomColor: config.foreground,
    },
    '.cm-tooltip-autocomplete': {
        '& > ul > li[aria-selected]': {
            background: config.selection,
            color: config.foreground,
        }
    }
};

settings[".cm-searchMatch.cm-searchMatch-selected"] = {
    outline: `3px solid ${config.selection}`,
    backgroundColor: config.background
};


const styles = [
    { tag: tags.keyword, color: config.keyword },
    { tag: [tags.name, tags.deleted, tags.character, tags.macroName], color: config.variable },
    { tag: [tags.propertyName], color: config.function },
    { tag: [tags.processingInstruction, tags.string, tags.inserted, tags.special(tags.string)], color: config.string },
    { tag: [tags.function(tags.variableName), tags.labelName], color: config.function },
    { tag: [tags.color, tags.constant(tags.name), tags.standard(tags.name)], color: config.constant },
    { tag: [tags.definition(tags.name), tags.separator], color: config.variable },
    { tag: [tags.className], color: config.class },
    { tag: [tags.number, tags.changed, tags.annotation, tags.modifier, tags.self, tags.namespace], color: config.number },
    { tag: [tags.typeName], color: config.type, fontStyle: config.type },
    { tag: [tags.operator, tags.operatorKeyword], color: config.keyword },
    { tag: [tags.url, tags.escape, tags.regexp, tags.link], color: config.regexp },
    { tag: [tags.meta, tags.comment], color: config.comment },
    { tag: tags.strong, fontWeight: 'bold' },
    { tag: tags.emphasis, fontStyle: 'italic' },
    { tag: tags.link, textDecoration: 'underline' },
    { tag: tags.heading, fontWeight: 'bold', color: config.heading },
    { tag: [tags.atom, tags.bool, tags.special(tags.variableName)], color: config.variable },
    { tag: tags.invalid, color: config.invalid },
    { tag: tags.strikethrough, textDecoration: 'line-through' },
];


const material_light = [settings, styles];
