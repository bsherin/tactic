
import React from "react";
import PropTypes from 'prop-types';

import { SortableContainer, SortableElement } from 'react-sortable-hoc';

import {doBinding} from "./utilities_react.js";

export {SortableComponent, MySortableElement}


function MySortableElement(WrappedComponent) {
    const SElement = SortableElement(WrappedComponent);
    return class extends React.PureComponent {
        render() {
            return <SElement {...this.props}/>
        }
    }
}

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
        let props_to_pass = {...this.props};
        delete props_to_pass.item_list;
        return (
            <div id={this.props.id} style={this.props.style} ref={this.container_ref}>
                {this.props.item_list.length > 0 &&
                    this.props.item_list.map((entry, index) => (
                        <WrappedComponent key={entry[this.props.key_field_name]}
                                          index={index}
                                          {...props_to_pass}
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