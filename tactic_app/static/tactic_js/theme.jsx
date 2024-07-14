import React from "react";
import {useState, createContext, memo, Fragment} from "react";

import {Helmet} from 'react-helmet';

import {useCallbackStack} from "./utilities_react";


export {ThemeContext, withTheme}

const ThemeContext = createContext(null);

function withTheme(WrappedComponent) {
    function newFunc(props) {
        const [dark_theme, set_dark_theme] = useState(() => {
            return props.initial_theme === "dark"
        });

        const pushCallback = useCallbackStack();

        function setTheme(local_dark_theme) {
            set_dark_theme(local_dark_theme);
        }

        const ChildElement = props.wrapped_element;
        const highlightTheme = dark_theme ? "github-dark.css" : "github.css";

        return (
            <Fragment>
                <Helmet>
                    <link rel="stylesheet" href={`/static/tactic_css/${highlightTheme}`} type="text/css"/>
                </Helmet>
                <ThemeContext.Provider value={{dark_theme, setTheme}}>
                    <WrappedComponent {...props}/>
                </ThemeContext.Provider>
            </Fragment>
        )
    }

    return memo(newFunc)
}
