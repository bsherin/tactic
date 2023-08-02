// noinspection ProblematicWhitespace,ConstantOnRightSideOfComparisonJS,JSUnusedLocalSymbols

/**
 * Created by bls910 much later
 */
/*jshint esversion: 6 */

import _ from 'lodash';
import React from "react";
import {useState, useEffect, useRef, useReducer} from "react";
import * as ReactDOM from 'react-dom'
import {Spinner, Text} from "@blueprintjs/core";

export {doBinding, propsAreEqual, arrayMove, arraysMatch, get_ppi, isInt};
export {remove_duplicates, doSignOut, guid, scrollMeIntoView, renderSpinnerMessage};
export {useConstructor, useCallbackStack, useStateAndRef, useReducerAndRef, useConnection}

export {debounce, throttle, useDebounce}

// It's necessary to have effectcount be a ref. Otherwise there can be subtle bugs
function useCallbackStack(myId = "") {
    const [effectCount, setEffectCount, effectCountRef] = useStateAndRef(0);
    const myCallbacksList = useRef([]);
    useEffect(() => {
        // console.log(`${myId} Entering effect with length ${String(myCallbacksList.current.length)} and effectcount${String(effectCountRef.current)}`);
        if (myCallbacksList.current.length > 0) {
            myCallbacksList.current[0]();
            myCallbacksList.current.shift();
            if (myCallbacksList.current.length > 0) {
                setEffectCount(effectCountRef.current + 1);
            }
        }
        // console.log(`${myId} leaving with length ${String(myCallbacksList.current.length)} and effectcount${String(effectCountRef.current)}`)
    }, [effectCount]);

    return (callback) => {
        if (callback) {
            myCallbacksList.current.push(callback);
            setEffectCount(effectCountRef.current + 1);
            // console.log(`${myId} Pushed callback length ${String(myCallbacksList.current.length)} and effectcount${String(effectCountRef.current)}`);
            // console.log(String(callback))
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
    const [connection_status, set_connection_status] = useState(null);
    function socketNotifier(connected) {
        set_connection_status(connected ? "up" : "down")
    }
    useEffect(()=>{
        initSocket(tsocket)
        tsocket.notifier = socketNotifier;
        socketNotifier(tsocket.socket.connected)
        return (() => {
            tsocket.disconnect();
        })
    }, [])
    return connection_status
}

function useStateAndRef(initial) {
    const [value, setValue] = useState(initial);
    const valueRef = useRef(value);
    valueRef.current = value;
    return [value, setValue, valueRef];
}

function useReducerAndRef(reducer, initial) {
    const [value, dispatch] = useReducer(reducer, initial);
    const valueRef = useRef(value);
    valueRef.current = value;
    return [value, dispatch, valueRef]
}

function useDebounce(callback, delay=500) {
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

function doBinding(obj, seq = "_", proto = null) {
    if (!proto) {
        proto = Object.getPrototypeOf(obj);
    }
    for (const key of Object.getOwnPropertyNames(proto)) {
        if (key.startsWith(seq)) {
            obj[key] = obj[key].bind(obj);
        }
    }
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


String.prototype.format = function () {
    let str = this;
    for (let i = 0; i < arguments.length; i++) {
        const reg = new RegExp("\\{" + i + "\\}", "gm");
        str = str.replace(reg, arguments[i]);
    }
    return str;
};

function get_ppi() {
    const d = $("<div/>").css({
        position: 'absolute',
        top: '-1000in',
        left: '-1000in',
        height: '1000in',
        width: '1000in'
    }).appendTo('body');
    const px_per_in = d.height() / 1000;
    d.remove();
    return px_per_in;
}

function remove_duplicates(arrArg) {
    return arrArg.filter((elem, pos, arr) => arr.indexOf(elem) == pos);
}

Array.prototype.empty = function () {
    return this.length == 0;
};

function doSignOut(page_id) {
    window.open($SCRIPT_ROOT + "/logout/" + window.page_id, "_self");
    return false
}

function scrollIntoView(element, container) {
    const containerTop = $(container).scrollTop();
    const containerBottom = containerTop + $(container).height();
    const elemTop = element.offsetTop;
    const elemBottom = elemTop + $(element).height();
    if (elemTop < containerTop) {
        $(container).scrollTop(elemTop);
    } else if (elemBottom > containerBottom) {
        $(container).scrollTop(elemBottom - $(container).height());
    }
}

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

function altScrollIntoView(element, container) {
    const containerTop = $(container).scrollTop();
    const containerBottom = containerTop + $(container).height();
    const elemTop = element.offsetTop;
    const elemBottom = elemTop + $(element).height();
    if (elemTop < containerTop) {
        element.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"})
    } else if (elemBottom > containerBottom) {
        element.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"})
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
    let domContainer = document.querySelector(selector);
    ReactDOM.render(
        (<div className="screen-center" style={{textAlign: "center"}}>
            <Spinner size={100}/>
            <Text className="pt-2">
                {msg}
            </Text>
        </div>), domContainer
    )
}