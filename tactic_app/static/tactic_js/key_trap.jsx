
import React from "react";
import PropTypes from 'prop-types';

import {doBinding} from "./utilities_react.js";
import Mousetrap from "mousetrap";

export {KeyTrap}

class KeyTrap extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this);
        this.mousetrap = null;
    }

    componentDidMount() {
        this._initializeMousetrap()
    }

    componentWillUnmount() {
        if (this.mousetrap) {
            this.mousetrap.reset();
            this.mousetrap = null
        }
    }

    _initializeMousetrap() {
        let self = this;
        if (this.mousetrap) {
            this.mousetrap.reset();
        }
        if (!this.props.target_ref && !this.props.global) {
            this.mousetrap = null
        }
        else {

            if (this.props.global) {
                this.mousetrap = new Mousetrap();
            }
            else {
                this.mousetrap = new Mousetrap(this.props.target_ref);
            }

            for (let binding of this.props.bindings) {
                this.mousetrap.bind(binding[0], (e)=> {
                        if (this.props.active) {
                            binding[1](e)
                        }
                    }
                )
            }
        }
    }

    componentDidUpdate() {
        if (!this.mousetrap) {
            this._initializeMousetrap()
        }
    }

    render() {
        return (
            <div/>
        )
    }
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
