import { tags as t } from '@lezer/highlight';
import { createCMTheme} from "../create_cm_theme";

export { bespin };
var themeBase = {
    variant: 'dark',
	settings: {
		background: '#2e241d',
		foreground: '#BAAE9E',
		caret: '#A7A7A7',
		selection: '#DDF0FF33',
		gutterBackground: '#28211C',
		gutterForeground: '#BAAE9E90',
		lineHighlight: '#FFFFFF08',
	},
	styles: [
		{
			tag: t.comment,
			color: '#666666',
		},
		{
			tag: [t.string, t.special(t.brace)],
			color: '#54BE0D',
		},
		{
			tag: t.regexp,
			color: '#E9C062',
		},
		{
			tag: t.number,
			color: '#CF6A4C',
		},
		{
			tag: [t.keyword, t.operator],
			color: '#5EA6EA',
		},
		{
			tag: t.variableName,
			color: '#7587A6',
		},
		{
			tag: [t.definitionKeyword, t.modifier],
			color: '#F9EE98',
		},
		{
			tag: [t.propertyName, t.function(t.variableName)],
			color: '#937121',
		},
		{
			tag: [t.typeName, t.angleBracket, t.tagName],
			color: '#9B859D',
		},
	],
};

const themeDict = createCMTheme(themeBase);
const bespin = [themeDict.themeCss, themeDict.highlightStyles];