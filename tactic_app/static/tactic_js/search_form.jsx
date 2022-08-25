import {doBinding} from "./utilities_react";

import React from "react";
import PropTypes from 'prop-types';

import {InputGroup, ButtonGroup, Button} from "@blueprintjs/core";

export {FilterSearchForm}

class FilterSearchForm extends React.PureComponent {

    constructor(props, context) {
         super(props, context);
         doBinding(this);
     }
     
     _handleSubmit(e) {
         this.props.searchNext();
         e.preventDefault();
     }

    render() {
        let self = this;
        return (
            <form onSubmit={self._handleSubmit} id="console-search-form"
                  className="d-flex flex-row bp4-form-group" style={{
                justifyContent: "flex-end", marginRight: 116,
                marginBottom: 6, marginTop: 12
            }}>
                <div className="d-flex flex-column">
                    <div className="d-flex flex-row">
                        <InputGroup type="search"
                                    leftIcon="search"
                                    placeholder="Search"
                                    small={true}
                                    value={!this.props.search_string ? "" : this.props.search_string}
                                    onChange={this.props.handleSearchFieldChange}
                                    autoCapitalize="none"
                                    autoCorrect="off"
                                    className="mr-2"/>
                        <ButtonGroup>
                            {this.props.handleFilter &&
                                <Button onClick={this.props.handleFilter} small={true}>
                                    Filter
                                </Button>
                            }

                            {this.props.handleUnFilter &&
                                <Button onClick={this.props.handleUnFilter} small={true}>
                                    Clear
                                </Button>
                            }
                            {this.props.searchNext &&
                                <Button onClick={this.props.searchNext} icon="caret-down" text={undefined} small={true}/>
                            }
                            {this.props.searchPrevious &&
                                <Button onClick={this.props.searchPrevious} icon="caret-up" text={undefined}
                                     small={true}/>
                            }
                        </ButtonGroup>
                    </div>
                    <div className="bp4-form-helper-text" style={{marginLeft: 10}}>{this.props.search_helper_text}</div>
                </div>
            </form>
        )
    }
 }

 FilterSearchForm.propTypes = {
     search_string: PropTypes.string,
     handleSearchFieldChange: PropTypes.func,
     handleFilter: PropTypes.func,
     handleUnFilter: PropTypes.func,
     searchNext: PropTypes.func,
     searchPrevious: PropTypes.func,
     search_helper_text: PropTypes.string
};

 FilterSearchForm.defaultProps = {
     handleFilter: null,
     handleUnfilter: null,
     searchNext: null,
     searchPrevious: null,
     search_helper_text: null
 };