import React from "react";

export {TacticContext}

const TacticContext = React.createContext({
    readOnly: false,
    tsocket: null,
    dark_theme: false,
    setTheme: () => {},
    am_controlled: false,
    am_selected: true
});