// noinspection ProblematicWhitespace,ConstantOnRightSideOfComparisonJS,JSUnusedLocalSymbols

/*jshint esversion: 6 */

import _ from 'lodash';
import React from "react";
import {useState, useEffect, useRef, useReducer, createContext} from "react";
import { createRoot } from 'react-dom/client';
import {Spinner, Text} from "@blueprintjs/core";

import { useImmerReducer } from 'use-immer';

export {propsAreEqual, arrayMove, arraysMatch, get_ppi, isInt, hasAnyKey};
export {remove_duplicates, guid, scrollMeIntoView, renderSpinnerMessage};
export {useConstructor, useCallbackStack, useStateAndRef, useReducerAndRef, useConnection,
    useStateAndRefAndCounter, useDidMount, useImmerReducerAndRef};

export {debounce, throttle, useDebounce, SelectedPaneContext, convertExtraKeys}

function trueFunc() {
    return true
}

const SelectedPaneContext = createContext({
    tab_id: "",
    selectedTabIdRef: "",
    amSelected: trueFunc,
    counter: 0
});

const convertExtraKeys = (extraKeys) => {
    const newExtraKeys = [];
    for (const key in extraKeys) {
        newExtraKeys.push({key: key, run: extraKeys[key], preventDefault: true, preventPropagation: true})
    }
    return newExtraKeys;

};

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
        if (callback) {
            myCallbacksList.current.push(callback);
            setEffectCount(effectCountRef.current + 1);
        }
    }
}

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


function useConnection(tsocket, initSocket) {
    if (!tsocket) return null;
    const [connection_status, set_connection_status] = useState(null);

    function socketNotifier(connected) {
        set_connection_status(connected ? "up" : "down")
    }

    useEffect(() => {
        initSocket(tsocket);
        tsocket.notifier = socketNotifier;
        socketNotifier(tsocket.socket.connected);
        return (() => {
            tsocket.disconnect();
            tsocket.notifier = null;
        })
    }, []);
    return connection_status
}

function useStateAndRef(initial) {
    const [value, setValue] = useState(initial);
    const valueRef = useRef(value);
    valueRef.current = value;
    return [value, setValue, valueRef];
}

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
    const [value, dispatch] = useReducer(reducer, initial);
    const valueRef = useRef(value);
    valueRef.current = value;
    return [value, dispatch, valueRef]
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
    var time;

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

// function get_ppi_old() {
//     const d = $("<div/>").css({
//         position: 'absolute',
//         top: '-1000in',
//         left: '-1000in',
//         height: '1000in',
//         width: '1000in'
//     }).appendTo('body');
//     const px_per_in = d.height() / 1000;
//     d.remove();
//     return px_per_in;
// }

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