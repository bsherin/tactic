
import React from "react";
import PropTypes from 'prop-types';

import { SortableContainer } from 'react-sortable-hoc';

import {doBinding} from "./utilities_react.js";

export {SortableComponent}

class RawSortableComponent extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this);
        this.state = {mounted: false};
        this.container_ref = this.props.container_ref == null ? React.createRef() : this.props.container_ref
    }

    get sorter_exists() {
        return $(this.container_ref.current).hasClass("ui-sortable")
    }

    componentDidMount() {
        this.setState({mounted: true});
        // this.createSorter()
    }


    render () {
        let WrappedComponent = this.props.ElementComponent;
        return (
            <div id={this.props.id} style={this.props.style} ref={this.container_ref}>
                {this.props.item_list.length > 0 &&
                    this.props.item_list.map((entry, index) => (
                        <WrappedComponent key={entry[this.props.key_field_name]}
                                          index={index}
                                          {...this.props}
                                          {...entry}/>

                    ))
                }
            </div>
        )
    }
}

RawSortableComponent.propTypes = {
    id: PropTypes.string,
    handle: PropTypes.string,
    key_field_name: PropTypes.string,
    ElementComponent: PropTypes.func,
    item_list: PropTypes.array,
    style: PropTypes.object,
    container_ref: PropTypes.object,
    resortFunction: PropTypes.func
};

RawSortableComponent.defaultProps = {
    container_ref: null
};

let SortableComponent = SortableContainer(RawSortableComponent);