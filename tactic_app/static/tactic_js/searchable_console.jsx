import {doBinding} from "./utilities_react";

import React from "react";
import PropTypes from 'prop-types';

import {Button, ControlGroup, HTMLSelect} from "@blueprintjs/core";
import {FilterSearchForm} from "./search_form";

export {SearchableConsole}

class SearchableConsole extends React.PureComponent {

    constructor(props, context) {
         super(props, context);
         doBinding(this);
         this.state = {
             search_string: null,
             search_helper_text: null,
             filter: false,
         }
     }

     _prepareText() {
        let tlist = this.props.log_content.split(/\r?\n/);
        // let the_text = this.props.log_content.replace(/(?:\r\n|\r|\n)/g, '<br>');

        let the_text = "";
        if (this.state.search_string) {
            if (this.state.filter) {
                let new_tlist = [];
                for (let t of tlist) {
                    if (t.includes(this.state.search_string)) {
                        new_tlist.push(t)
                    }
                }
                tlist = new_tlist;

            }
            for (let t of tlist) {
                the_text = the_text + t + "<br>";
            }
            const regex = new RegExp(this.state.search_string, "gi");
            the_text = String(the_text).replace(regex, function (matched) {
                    return "<mark>" + matched + "</mark>";
                }
            )
        }
        else {
            for (let t of tlist) {
                the_text = the_text + t + "<br>";
            }
        }
       return `<div style="white-space:pre">${the_text}</div>`
     }

     _handleSearchFieldChange(event) {
         this.setState({search_helper_text: null, search_string: event.target.value})
     }

     _handleFilter() {
        this.setState({filter: true})
     }

     _handleUnFilter() {
        this.setState({search_helper_text: null, search_string: null, filter: false})
     }

     _searchNext() {

     }

     _structureText() {

     }

     _searchPrevious() {

     }

     _setMaxConsoleLines(event) {
        this.props.setMaxConsoleLines(parseInt(event.target.value))
    }

     render() {
        let the_text = {__html: this._prepareText()};
        let the_style = {whiteSpace: "nowrap", fontSize: 12, fontFamily: "monospace", ...this.props.outer_style};
        let bottom_info = "575 lines";
        return (
            <div className="searchable-console">
                <div className="d-flex flex-row" style={{justifyContent: "space-between"}}>
                        <ControlGroup vertical={false}
                                      style={{marginLeft: 15, marginTop: 10}}>
                            <Button onClick={this.props.clearConsole}
                                    style={{height: 30}}
                                    minimal={true} small={true} icon="trash"/>
                            <HTMLSelect onChange={this._setMaxConsoleLines}
                                        large={false}
                                        minimal={true}
                                        value={this.props.max_console_lines}
                                        options={[100, 250, 500, 1000, 2000]}
                            />

                        </ControlGroup>
                    <FilterSearchForm
                         search_string={this.state.search_string}
                         handleSearchFieldChange={this._handleSearchFieldChange}
                         handleFilter={this._handleFilter}
                         handleUnFilter={this._handleUnFilter}
                         searchNext={null}
                         searchPrevious={null}
                         search_helper_text={this.state.search_helper_text}
                         margin_right={25}
                     />
                </div>
                <div ref={this.props.inner_ref} style={the_style} dangerouslySetInnerHTML={the_text}/>
            </div>
        )
    }
 }

 SearchableConsole.propTypes = {
     log_content: PropTypes.string,
     outer_style: PropTypes.object,
     inner_ref: PropTypes.object,
     clearConsole: PropTypes.func,
     setMaxConsoleLines: PropTypes.func

};

 SearchableConsole.defaultProps = {
     log_content: "",
     outer_style: {},
     inner_ref: null,
     setMaxConsoleLines: null,
     clearConsole: null
 };

