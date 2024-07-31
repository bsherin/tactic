export {importTheme, themeList}

const darkThemesContext = require.context('./codemirror_dark_themes', false, /\.js$/);
const lightThemesContext = require.context('./codemirror_light_themes', false, /\.js$/);

const themeList = [];

const getThemeList = () => {
  for (const key of darkThemesContext.keys()) {
    themeList.push(key.replace('./', '').replace('.js', ''));
  }
  for (const key of lightThemesContext.keys()) {
    themeList.push(key.replace('./', '').replace('.js', ''));
  }
};

const importTheme = async (themeName, darkOrLight) => {
    if (darkOrLight === 'dark') {
        const themeModule = await darkThemesContext(`./${themeName}.js`);
        return themeModule[themeName];
    } else {
        const themeModule = await lightThemesContext(`./${themeName}.js`);
        return themeModule[themeName];
    }
};

getThemeList();