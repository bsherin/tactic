import { tags as t } from '@lezer/highlight';
import {createCMTheme} from "../create_cm_theme";
export { nord };
var themeBase = {
    variant: 'dark',
    settings: {
        background: '#2e3440',
        foreground: '#d8dee9',
        caret: '#E6E1C4',
        selection: '#575f72',
        gutterBackground: '#2e3440',
        gutterForeground: '#4c566a',
        lineHighlight: '#3b4252',
        borderColor: "#abb3bf99"
    },
    styles: [
        {
            tag: t.comment,
            color: '#4c566a'
        },
        {
            tag: [t.keyword, t.operator, t.derefOperator],
            color: '#81A1C1',
        },
        {
            tag: t.className,
            color: '#d8dee9',
        },
        {
            tag: [
                t.typeName,
                t.propertyName,
                t.function(t.variableName),
                t.definition(t.variableName),
            ],
            color: '#8FBCBB',
        },
        {
            tag: t.definition(t.typeName),
            color: '#8FBCBB',
        },
        {
            tag: t.labelName,
            color: '#d8dee9',
        },
        {
            tag: [t.number, t.bool],
            color: "#b48ead",
        },
        {
            tag: [t.variableName, t.self],
            color: '#d8dee9',
        },
        {
            tag: [t.string, t.special(t.brace), t.regexp],
            color: '#A3BE8C',
        },
        {
            tag: [t.angleBracket, t.tagName, t.attributeName],
            color: "#81A1C1",
        },
        {
            tag: [t.color, t.constant(t.name), t.standard(t.name)],
            color: "#d8dee9"
        }
    ],
};

const themeDict = createCMTheme(themeBase);
const nord = [themeDict.themeCss, themeDict.highlightStyles];