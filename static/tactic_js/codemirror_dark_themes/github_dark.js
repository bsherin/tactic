import { tags as t } from '@lezer/highlight';
import {createCMTheme} from "../create_cm_theme";

export {github_dark}

var settings = {
  background: '#0d1117',
  foreground: '#c9d1d9',
  caret: '#c9d1d9',
  selection: '#596c7d',
  selectedSelection: "#730036",
  selectionMatch: '#003d73',
  lineHighlight: '#36334280',
  gutterBackground: '#0d1117',
  gutterForeground: '#c9d1d9',
  borderColor: '#abb3bf99'
};
var styles = [{
  tag: [t.standard(t.tagName), t.tagName],
  color: '#7ee787'
}, {
  tag: [t.comment, t.bracket],
  color: '#8b949e'
}, {
  tag: [t.className, t.propertyName],
  color: '#d2a8ff'
}, {
  tag: [t.variableName, t.attributeName, t.number, t.operator],
  color: '#79c0ff'
}, {
  tag: [t.keyword, t.typeName, t.typeOperator, t.typeName],
  color: '#ff7b72'
}, {
  tag: [t.string, t.meta, t.regexp],
  color: '#a5d6ff'
}, {
  tag: [t.name, t.quote],
  color: '#7ee787'
}, {
  tag: [t.heading, t.strong],
  color: '#d2a8ff',
  fontWeight: 'bold'
}, {
  tag: [t.emphasis],
  color: '#d2a8ff',
  fontStyle: 'italic'
}, {
  tag: [t.deleted],
  color: '#ffdcd7',
  backgroundColor: 'ffeef0'
}, {
  tag: [t.atom, t.bool, t.special(t.variableName)],
  color: '#ffab70'
}, {
  tag: t.link,
  textDecoration: 'underline'
}, {
  tag: t.strikethrough,
  textDecoration: 'line-through'
}, {
  tag: t.invalid,
  color: '#f97583'
}];

var themeBase = { settings, styles };
const themeDict = createCMTheme(themeBase);
const github_dark = [themeDict.themeCss, themeDict.highlightStyles];