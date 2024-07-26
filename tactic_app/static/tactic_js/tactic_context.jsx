import React from "react";

export {TacticContext}

const TacticContext = React.createContext({
    readOnly: false,
    tsocket: null,
    setTheme: () => {},
    am_controlled: false,
    am_selected: true
});