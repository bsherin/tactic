import { tags } from '@lezer/highlight';
import {createCMTheme} from "../create_cm_theme";
export { basic_dark };
var themeBase = {
  variant: 'dark',
  settings: {
    background: '#2E3235',
    foreground: '#DDDDDD',
    caret: '#DDDDDD',
    selection: '#4e565b',
    selectionMatch: '#202325',
    gutterBackground: '#292d30',
    gutterForeground: '#808080',
    gutterBorder: '1px solid #ffffff10',
    lineHighlight: '#B9D2FF30',
    borderColor: "#abb3bf99"
  },
  styles: [
    {
      tag: tags.keyword,
      color: '#fda331'
    }, {
      tag: [tags.name, tags.deleted, tags.character, tags.propertyName, tags.macroName],
      color: '#b5bd68'
    }, {
      tag: [tags.variableName],
      color: '#6fb3d2'
    }, {
      tag: [tags["function"](tags.variableName)],
      color: '#fda331'
    }, {
      tag: [tags.labelName],
      color: '#fc6d24'
    }, {
      tag: [tags.color, tags.constant(tags.name), tags.standard(tags.name)],
      color: '#fda331'
    }, {
      tag: [tags.definition(tags.name), tags.separator],
      color: '#cc99cc'
    }, {
      tag: [tags.brace],
      color: '#cc99cc'
    }, {
      tag: [tags.annotation],
      color: '#fc6d24'
    }, {
      tag: [tags.number, tags.changed, tags.annotation, tags.modifier, tags.self, tags.namespace],
      color: '#fda331'
    }, {
      tag: [tags.typeName, tags.className],
      color: '#6fb3d2'
    }, {
      tag: [tags.operator, tags.operatorKeyword],
      color: '#cc99cc'
    }, {
      tag: [tags.tagName],
      color: '#fda331'
    }, {
      tag: [tags.squareBracket],
      color: '#cc99cc'
    }, {
      tag: [tags.angleBracket],
      color: '#cc99cc'
    }, {
      tag: [tags.attributeName],
      color: '#6fb3d2'
    }, {
      tag: [tags.regexp],
      color: '#fda331'
    }, {
      tag: [tags.quote],
      color: '#DDDDDD'
    }, {
      tag: [tags.string],
      color: '#b5bd68'
    }, {
      tag: tags.link,
      color: '#6987AF',
      textDecoration: 'underline',
      textUnderlinePosition: 'under'
    }, {
      tag: [tags.url, tags.escape, tags.special(tags.string)],
      color: '#8abeb7'
    }, {
      tag: [tags.meta],
      color: '#A54543'
    }, {
      tag: [tags.comment],
      color: '#808080',
      fontStyle: 'italic'
    }, {
      tag: tags.monospace,
      color: '#DDDDDD'
    }, {
      tag: tags.strong,
      fontWeight: 'bold',
      color: '#fda331'
    }, {
      tag: tags.emphasis,
      fontStyle: 'italic',
      color: '#6fb3d2'
    }, {
      tag: tags.strikethrough,
      textDecoration: 'line-through'
    }, {
      tag: tags.heading,
      fontWeight: 'bold',
      color: '#DDDDDD'
    }, {
      tag: tags.special(tags.heading1),
      fontWeight: 'bold',
      color: '#DDDDDD'
    }, {
      tag: tags.heading1,
      fontWeight: 'bold',
      color: '#DDDDDD'
    }, {
      tag: [tags.heading2, tags.heading3, tags.heading4],
      fontWeight: 'bold',
      color: '#DDDDDD'
    }, {
      tag: [tags.heading5, tags.heading6],
      color: '#DDDDDD'
    }, {
      tag: [tags.atom, tags.bool, tags.special(tags.variableName)],
      color: '#8abeb7'
    }, {
      tag: [tags.processingInstruction, tags.inserted],
      color: '#8abeb7'
    }, {
      tag: [tags.contentSeparator],
      color: '#6fb3d2'
    }, {
      tag: tags.invalid,
      color: '#B9D2FF',
      borderBottom: "1px dotted ".concat('#fc6d24')
    }]
};
const themeDict = createCMTheme(themeBase);
const basic_dark = [themeDict.themeCss, themeDict.highlightStyles];