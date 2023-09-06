import React from "react";
import {useState, createContext, memo, useEffect} from "react";
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

        return (
            <ThemeContext.Provider value={{dark_theme, setTheme}}>
                <WrappedComponent {...props}/>
            </ThemeContext.Provider>
        )
    }
    return memo(newFunc)
}
