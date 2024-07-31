import { tags as t } from '@lezer/highlight';
import {createCMTheme} from "../create_cm_theme";
export { rdark };
var themeBase = {
    variant: 'dark',
    settings: {
        background: '#1B2426',
        foreground: '#B9BDB6',
        caret: '#E6E1C4',
        selection: '#E0E8FF66',
        gutterBackground: '#1B2426',
        gutterForeground: '#B9BDB6',
        lineHighlight: '#1F1611',
        borderColor: "#abb3bf99"
    },
    styles: [
        {
            tag: t.comment,
            color: '#646763'
        },
        {
            tag: [t.keyword, t.operator, t.derefOperator],
            color: '#5BA1CF',
        },
        {
            tag: t.className,
            color: '#FFAA3E',
            fontWeight: 'bold',
        },
        {
            tag: [
                t.typeName,
                t.propertyName,
                t.function(t.variableName),
                t.definition(t.variableName),
            ],
            color: '#B9BDB6',
        },
        {
            tag: t.definition(t.typeName),
            color: '#FFFFFF',
            fontWeight: 'bold',
        },
        {
            tag: t.labelName,
            color: '#FFAA3E',
            fontWeight: 'bold',
        },
        {
            tag: [t.number, t.bool],
            color: "#B9BDB6",
        },
        {
            tag: [t.variableName, t.self],
            color: '#FFAA3E',
        },
        {
            tag: [t.string, t.special(t.brace), t.regexp],
            color: '#5CE638',
        },
        {
            tag: [t.angleBracket, t.tagName, t.attributeName],
            color: "#B9BDB6",
        },
        {
            tag: [t.color, t.constant(t.name), t.standard(t.name)],
            color: "#B9BDB6"
        }
    ],
};

const themeDict = createCMTheme(themeBase);
const rdark = [themeDict.themeCss, themeDict.highlightStyles];