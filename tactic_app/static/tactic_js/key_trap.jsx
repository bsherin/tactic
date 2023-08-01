
import React from "react";
import {useEffect, useRef, memo} from "react";
import PropTypes from 'prop-types';

import Mousetrap from "mousetrap";

export {KeyTrap}

function KeyTrap(props) {
    const mousetrap = useRef(null);

    useEffect(()=>{
        _initializeMousetrap()
        return (()=>{
            if (mousetrap.current) {
                mousetrap.current.reset();
                mousetrap.current = null
            }
        })
    }, []);

    useEffect(()=>{
        if (!mousetrap.current) {
            _initializeMousetrap()
        }
    })

    function _initializeMousetrap() {
        if (mousetrap.current) {
            mousetrap.current.reset();
        }
        if (!props.target_ref && !props.global) {
            mousetrap.current = null
        }
        else {

            if (props.global) {
                mousetrap.current = new Mousetrap();
            }
            else {
                mousetrap.current = new Mousetrap(props.target_ref);
            }

            for (let binding of props.bindings) {
                mousetrap.current.bind(binding[0], (e)=> {
                        if (props.active) {
                            binding[1](e)
                        }
                    }
                )
            }
        }
    }

    return (
        <div/>
    )
}

KeyTrap.propTypes = {
    active: PropTypes.bool,
    target_ref: PropTypes.object,
    bindings: PropTypes.array,
    global: PropTypes.bool
};

KeyTrap.defaultProps = {
    active: true,
    global: false
};

KeyTrap = memo(KeyTrap);