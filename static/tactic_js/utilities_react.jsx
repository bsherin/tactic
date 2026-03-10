// noinspection ProblematicWhitespace,ConstantOnRightSideOfComparisonJS,JSUnusedLocalSymbols

/*jshint esversion: 6 */

import _ from 'lodash';
import React from "react";
import {useState, useEffect, useRef, useReducer, createContext, useCallback, memo} from "react";
import {createRoot} from 'react-dom/client';
import {Spinner, Text} from "@blueprintjs/core";
import {postPromise} from "./communication_react";

import {useImmerReducer} from 'use-immer';

export {propsAreEqual, arrayMove, arraysMatch, get_ppi, isInt, hasAnyKey, copyToClipboard, getFileExtension};
export {remove_duplicates, guid, scrollMeIntoView, renderSpinnerMessage};
export {
    useConstructor, useCallbackStack, useStateAndRef, useReducerAndRef, useRegisterActivity,
    useStateAndRefAndCounter, useDidMount, useImmerReducerAndRef, useDeepCompareEffect, useWidget,
    withRegisterActivity
};

export {debounce, throttle, useDebounce, SelectedPaneContext, convertExtraKeys}

function amSelected(ltab_id, lselectedTabIdRef) {
    return !window.in_context || ltab_id === lselectedTabIdRef.current
}

const SelectedPaneContext = createContext({
    tab_id: "",
    selectedTabIdRef: "",
    amSelected: amSelected,
    counter: 0,
    addOmniItems: () => {
    },
    closeTab: () => {
    },
    refreshTab: () => {
    }
});

const convertExtraKeys = (extraKeys) => {
    const newExtraKeys = [];
    for (const key in extraKeys) {
        newExtraKeys.push({key: key, run: extraKeys[key], preventDefault: true, preventPropagation: true})
    }
    return newExtraKeys;

};

function isFunction(variable) {
    return typeof variable === 'function';
}

function useWidget(widgetIdArg = null, widgetTypeArg = null, widgetDataArg = {}) {
    const [widgetId, setWidgetId] = useState(widgetIdArg);
    const [widgetType, setWidgetType] = useState(widgetTypeArg);
    const [widgetData, setWidgetData] = useState(widgetDataArg);

    function setWidget(newWidget) {
        if ("widgetId" in newWidget) {
            setWidgetId(newWidget.widgetId);
        }
        if ("type" in newWidget) {
            setWidgetType(newWidget.type);
        }
        if ("data" in newWidget) {
            setWidgetData(newWidget.data);
        }
    }

    return [widgetId, widgetType, widgetData, setWidget];
}

// It's necessary to have effectcount be a ref. Otherwise there can be subtle bugs
function useCallbackStack(myId = "") {
    const [effectCount, setEffectCount, effectCountRef] = useStateAndRef(0);
    const myCallbacksList = useRef([]);
    useEffect(() => {
        if (myCallbacksList.current.length > 0) {
            myCallbacksList.current[0]();
            myCallbacksList.current.shift();
            if (myCallbacksList.current.length > 0) {
                setEffectCount(effectCountRef.current + 1);
            }
        }
    }, [effectCount]);

    return (callback) => {
        try {
            if (callback) {
                if (isFunction(callback)) {
                    myCallbacksList.current.push(callback);
                    setEffectCount(effectCountRef.current + 1);
                } else {
                    console.log("Bad callback in useCallbackStack", myId)
                }
            }
        } catch (err) {
            console.log("Problem invoking callback in useCallbackStack", err)
        }
    }
}

function useDeepCompareEffect(callback, dependencies) {
    const currentDependenciesRef = useRef();

    if (!_.isEqual(currentDependenciesRef.current, dependencies)) {
        currentDependenciesRef.current = dependencies;
    }

    useEffect(() => {
        return callback();
    }, [currentDependenciesRef.current]);
}

const RegisterActivityContext = React.createContext(null);

const activity_interval_msecs = window.activity_interval * 1000
function useLocalRegisterActivity() {
    const current_timer = useRef(null);
    const waiting = useRef(false);

    const registerActivity = useCallback(() => {
        if (waiting.current) {
            return
        }
        waiting.current = true;

        current_timer.current = setTimeout(() => {
            waiting.current = false;
            postPromise("host", "register_client_interaction", {
                global_id: window.global_id,
            })
                .then(()=>{})
        }, activity_interval_msecs);
    }, []);

    return [waiting, registerActivity];
}

function useRegisterActivity() {
    const contextValue = React.useContext(RegisterActivityContext);
    if (contextValue) {
        return contextValue;
    }
    return useLocalRegisterActivity();
}

function ActivityTracker() {
    const [, registerActivity] = useRegisterActivity();

    useEffect(()=>{
        postPromise("host", "register_client_interaction", {
                global_id: window.global_id,
            })
            .then(()=>{})
    }, [])

    useEffect(() => {
        const handler = () => {
            registerActivity();
        };

        const events = ["click", "keydown", "mousedown", "touchstart", "scroll"];

        events.forEach((evt) =>
            window.addEventListener(evt, handler, { passive: true })
        );

        return () => {
            events.forEach((evt) =>
                window.removeEventListener(evt, handler)
            );
        };
    }, [registerActivity]);

    return null; // nothing to render
}

function withRegisterActivity(WrappedComponent) {
    function WithRegisterActivity(props) {
        const value = useLocalRegisterActivity();
        return (
            <RegisterActivityContext.Provider value={value}>
                <ActivityTracker/>
                <WrappedComponent {...props}/>
            </RegisterActivityContext.Provider>
        )
    }
    return memo(WithRegisterActivity)
}

export default useDeepCompareEffect;

const useConstructor = (callback = () => {
}) => {
    const hasBeenCalled = useRef(false);
    const returnVal = useRef(null);
    if (hasBeenCalled.current) {
        return returnVal.current;
    }
    hasBeenCalled.current = true;
    returnVal.current = callback();
    return returnVal
};


function useStateAndRef(initial) {
    const [value, setValue] = useState(initial);
    const valueRef = useRef(value);
    valueRef.current = value;
    return [value, setValue, valueRef];
}

// function useStateAndRefWithUndo(initial, undoStackRef, doDebounce = true) {
//     const [value, setValue] = useState(initial);
//     const valueRef = useRef(value);
//     const stagedUndoEntryRef = useRef(null);
//     valueRef.current = value;
//
//     const commitUndoEntry = () => {
//         if (stagedUndoEntryRef.current) {
//             undoStackRef.current.push(stagedUndoEntryRef.current);
//             stagedUndoEntryRef.current = null;
//         }
//     };
//
//     const scheduleCommit = debounce(commitUndoEntry, 1000);
//
//     let setFunc = function(newValue, skipUndo = false) {
//         const oldValue = valueRef.current;
//         if(!_.isEqual(oldValue, newValue)){
//             setValue(newValue);
//             if (!skipUndo) {
//                 let undoEntry = {
//                     dispatch: setValue,
//                     undoAction: oldValue,
//                     description: "Undo set"
//                 }
//                 if (doDebounce) {
//                     stagedUndoEntryRef.current = undoEntry;
//                     scheduleCommit();
//                 }
//                 else {
//                     undoStackRef.current.push(undoEntry);
//                 }
//             }
//         }
//     }
//
//     return [value, setFunc, valueRef];
// }

function useStateAndRefAndCounter(initial) {
    function setMe(newValue) {
        setValue(newValue);
        setCounter(counter + 1);
    }

    const [value, setValue] = useState(initial);
    const [counter, setCounter] = useState(0);
    const valueRef = useRef(value);
    valueRef.current = value;
    return [value, setMe, valueRef, counter];
}

function useReducerAndRef(reducer, initial) {
    const [value, customDispatch] = useReducer(reducer, initial);
    const valueRef = useRef(value);
    valueRef.current = value;
    return [value, customDispatch, valueRef]
}

function useImmerReducerAndRef(reducer, initial) {
    const [value, dispatch] = useImmerReducer(reducer, initial);
    const valueRef = useRef(value);
    valueRef.current = value;
    return [value, dispatch, valueRef]
}

function useDebounce(callback, delay = 500) {
    const current_timer = useRef(null);
    const waiting = useRef(false);
    return [waiting, (...args) => {
        clearTimeout(current_timer.current);
        waiting.current = true;
        current_timer.current = setTimeout(() => {
            waiting.current = false;
            callback(...args);
        }, delay);
    }]
}

const useDidMount = (func, deps) => {
    const didMount = useRef(false);
    useEffect(() => {
        if (didMount.current) {
            func();
        } else {
            didMount.current = true;
        }
    }, deps);
};

function debounce(callback, delay = 1000) {
    let time;

    return (...args) => {
        clearTimeout(time);
        time = setTimeout(() => {
            callback(...args);
        }, delay);
    };
}

function throttle(callback, delay = 1000) {
    let shouldWait = false;

    return (...args) => {
        if (shouldWait) return;

        callback(...args);
        shouldWait = true;
        setTimeout(() => {
            shouldWait = false;
        }, delay);
    };
}

function isInt(value) {
    if (isNaN(value)) {
        return false;
    }

    return parseFloat(value) == parseInt(value)
}

function propsAreEqual(p1, p2, skipProps = []) {
    if (!_.isEqual(Object.keys(p1), Object.keys(p2))) {
        return false
    }

    for (const option in p1) {
        if (skipProps.includes(option)) {
            continue;
        }
        if (typeof p1[option] == "function") {
            if (!(typeof p2[option] == "function")) {
                return false
            }
            continue
        }
        if (!_.isEqual(p1[option], p2[option])) {
            return false
        }
    }
    return true
}

function arrayMoveMutate(array, from, to) {
    array.splice(to < 0 ? array.length + to : to, 0, array.splice(from, 1)[0]);
}

function arrayMove(array, from, to) {
    array = array.slice();
    arrayMoveMutate(array, from, to);
    return array;
}

function arraysMatch(arr1, arr2) {
    // Check if the arrays are the same length
    if (arr1.length !== arr2.length) {
        return false;
    }
    // Check if all items exist and are in the same order
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) {
            return false;
        }
    }
    // Otherwise, return true
    return true;
}

function hasAnyKey(object, keysList) {
    return keysList.some(key => Object.keys(object).includes(key));
}


String.prototype.format = function () {
    let str = this;
    for (let i = 0; i < arguments.length; i++) {
        const reg = new RegExp("\\{" + i + "\\}", "gm");
        str = str.replace(reg, arguments[i]);
    }
    return str;
};

function get_ppi() {
    const d = document.createElement("div");

    Object.assign(d.style, {
        position: 'absolute',
        top: '-1000in',
        left: '-1000in',
        height: '1000in',
        width: '1000in'
    });

    document.body.appendChild(d);
    const px_per_in = d.offsetHeight / 1000;
    document.body.removeChild(d);

    return px_per_in;
}

function remove_duplicates(arrArg) {
    return arrArg.filter((elem, pos, arr) => arr.indexOf(elem) == pos);
}

Array.prototype.empty = function () {
    return this.length == 0;
};

function scrollMeIntoView(element) {
    const outer_element = element.parentNode.parentNode;
    const scrolled_element = element.parentNode;
    const outer_height = outer_element.offsetHeight;
    const distance_from_top = element.offsetTop - outer_element.scrollTop - scrolled_element.offsetTop;
    if (distance_from_top > outer_height - 35) {
        const distance_to_move = distance_from_top - 0.5 * outer_height;
        outer_element.scrollTop += distance_to_move
    } else if (distance_from_top < 0) {
        const distance_to_move = 0.25 * outer_height - distance_from_top;
        outer_element.scrollTop -= distance_to_move
    }
}

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

function renderSpinnerMessage(msg, selector = "#main-root") {
    const domContainer = document.querySelector(selector);
    const root = createRoot(domContainer);
    root.render(
        (<div className="screen-center" style={{textAlign: "center"}}>
            <Spinner size={100}/>
            <Text className="pt-2">
                {msg}
            </Text>
        </div>)
    )
}

function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(function () {
        }).catch(function (error) {
            console.error('Failed to copy text: ', error);
        });
    } else {
        // Fallback: Create a temporary text area for copying
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            document.execCommand('copy');
        } catch (err) {
            console.error('Fallback: Oops, unable to copy', err);
        }
        document.body.removeChild(textArea);
    }
}

function getFileExtension(filePath) {
    const dotIndex = filePath.lastIndexOf('.');
    if (dotIndex === -1) {
        return ''; // No extension found
    }
    return filePath.substring(dotIndex + 1);
}
