import _ from 'lodash';
import React from "react";
import {createContext, useContext, useRef, useState, memo} from "react";
import { useCallback } from "react";
import debounce from "lodash/debounce";

const MAX_STACK_SIZE = 50;

export { makeUndoable, makeUndoHandler, makeRedoHandler, useStateAndRefWithUndo, useUndoRedoStacks, withUndo, UndoContext };

function useUndoRedoStacks() {
    const undoStackRef = useRef([]);
    const redoStackRef = useRef([]);
    const stagedUndoEntryRef = useRef(null);
    const commitUndoEntry = () => {
        if (stagedUndoEntryRef && stagedUndoEntryRef.current) {
            undoStackRef.current.push(stagedUndoEntryRef.current);
            if (undoStackRef.current.length > MAX_STACK_SIZE) {
                undoStackRef.current.shift()
            }
            stagedUndoEntryRef.current = null;
        }
    };
    const scheduleCommit = debounce(commitUndoEntry, 1000);
    return [undoStackRef, redoStackRef, stagedUndoEntryRef, commitUndoEntry, scheduleCommit];
}

function makeUndoHandler(undoStackRef, redoStackRef, stagedUndoEntryRef, commitUndoEntry) {
    return function handleUndo() {
        if (stagedUndoEntryRef && stagedUndoEntryRef.current) {
            commitUndoEntry();
        }
        const stack = undoStackRef.current;
        if (undoStackRef.current.length > 0) {
            const {dispatch, undoAction, redoAction} = stack.pop();
            dispatch(undoAction);
            if (redoAction && redoStackRef) {
                redoStackRef.current.push({
                    dispatch,
                    redoAction: redoAction,
                    undoAction: undoAction
                });
                if (redoStackRef.current.length > MAX_STACK_SIZE) {
                    redoStackRef.current.shift()
                }
            }
        }
    }
}

function makeRedoHandler(redoStackRef, undoStackRef, stagedUndoEntryRef, commitUndoEntry) {
    return function handleRedo() {
        if (stagedUndoEntryRef && stagedUndoEntryRef.current) {
            commitUndoEntry();
        }
        const stack = redoStackRef.current;
        if (stack.length > 0) {
            const {dispatch, redoAction, undoAction} = stack.pop();
            dispatch(redoAction);
            if (undoAction && undoStackRef) {
                undoStackRef.current.push({
                    dispatch,
                    undoAction: undoAction,
                    redoAction: redoAction
                });
                if (undoStackRef.current.length > MAX_STACK_SIZE) {
                    undoStackRef.current.shift()
                }
            }
        }
    }
}

const UndoContext = createContext(null);

function withUndo(WrappedComponent) {
    function newFunc(props) {
        const [undoStackRef, redoStackRef, stagedUndoEntryRef, commitUndoEntry, scheduleCommit] = useUndoRedoStacks();
        const handleUndo = makeUndoHandler(undoStackRef, redoStackRef,stagedUndoEntryRef, commitUndoEntry);
        const handleRedo = makeRedoHandler(redoStackRef, undoStackRef, stagedUndoEntryRef, commitUndoEntry);
        return (
            <UndoContext.Provider
                value={{handleUndo, handleRedo, undoStackRef, redoStackRef, stagedUndoEntryRef, commitUndoEntry, scheduleCommit}}>
                <WrappedComponent {...props} />
            </UndoContext.Provider>
        )
    }
    return memo(newFunc);

}


function makeUndoable(dispatch, stateRef, createUndoAction) {
    const {undoStackRef, redoStackRef, stagedUndoEntryRef, commitUndoEntry, scheduleCommit} = useContext(UndoContext);

    return useCallback((action, skipUndo = false) => {
            if (skipUndo) {
                dispatch(action);
                return
            }
            const [undoAction, doDebounce, forceCommit] = createUndoAction(action, stateRef, stagedUndoEntryRef);
            let redoAction = null;
            if (undoAction) {
                if (redoStackRef && redoStackRef.current) {
                    redoAction = action
                }
                const undoEntry = {
                    dispatch,
                    undoAction,
                    redoAction
                };
                if (redoStackRef && redoStackRef.current) {
                    redoStackRef.current = [];
                }
                if (doDebounce) {
                    if (forceCommit) {
                        commitUndoEntry();
                    }
                    stagedUndoEntryRef.current = undoEntry;
                    scheduleCommit();
                } else {
                    undoStackRef.current.push(undoEntry);
                    if (undoStackRef.current.length > MAX_STACK_SIZE) {
                        undoStackRef.current.shift()
                    }
                }
            }
            dispatch(action)
        }
    )
}


function useStateAndRefWithUndo(initial, doDebounce = true) {
    const [value, setValue] = useState(initial);
    const valueRef = useRef(value);
    valueRef.current = value;

    function createUndoAction(newValue, oldValueRef) {
        const oldValue = oldValueRef.current;
        if (_.isEqual(oldValue, newValue)) {
            return [null, false];
        }
        return [oldValue, doDebounce, false];
    }

    let setValueMod = makeUndoable(setValue, valueRef, createUndoAction);

    return [value, setValueMod, valueRef];
}