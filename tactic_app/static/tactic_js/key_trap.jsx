
import React from "react";
import PropTypes from 'prop-types';

import {doBinding} from "./utilities_react.js";

export {KeyTrap}

class KeyTrap extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this);
        this.mousetrap = null;
    }

    componentDidMount() {
        this.initializeMousetrap()
    }

    componentWillUnmount() {
        if (this.mousetrap) {
            this.mousetrap.reset();
            this.mousetrap = null
        }
    }

    initializeMousetrap() {
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
                this.mousetrap.bind(binding[0], binding[1])
            }
        }
    }

    componentDidUpdate() {
        if (!this.mousetrap) {
            this.initializeMousetrap()
        }
    }

    render() {
        return (
            <div/>
        )
    }
}

KeyTrap.propTypes = {
    target_ref: PropTypes.object,
    bindings: PropTypes.array,
    global: PropTypes.bool
};

KeyTrap.defaultProps = {
    global: false
};
