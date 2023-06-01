import {doBinding} from "./utilities_react";
import React from "react";
import PropTypes from 'prop-types';

import {Button, ControlGroup, HTMLSelect, InputGroup, Switch} from "@blueprintjs/core";
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
             console_command_value: "",
             livescroll: true
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

    _commandSubmit(e) {
        e.preventDefault();
        this.props.commandExec(this.state.console_command_value, ()=>{
            this.setState({console_command_value: ""})
        })
    }

    componentDidUpdate() {
        if (this.state.livescroll && this.props.inner_ref && this.props.inner_ref.current) {
            this.props.inner_ref.current.scrollTo(0, this.props.inner_ref.current.scrollHeight)
        }
    }

    _setLiveScroll(event) {
        this.setState({livescroll: event.target.checked})
    }

     render() {
        let the_text = {__html: this._prepareText()};
        let the_style = {whiteSpace: "nowrap", fontSize: 12, fontFamily: "monospace", ...this.props.outer_style};
        if (this.props.commandExec) {
            the_style.height = the_style.height - 40
        }
        let bottom_info = "575 lines";
        let self = this;
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
                            <Switch label="livescroll"
                                   large={false}
                                   checked={this.state.livescroll}
                                   onChange={this._setLiveScroll}
                                    style={{marginBottom: 0, marginTop: 5, alignSelf: "center", height: 30}}
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
                {this.props.commandExec && (
                    <form onSubmit={this._commandSubmit} style={{position: "relative", bottom: 8, margin: 10}}>

                      <InputGroup type="text"
                                   onChange={(event)=>{self.setState({console_command_value: event.target.value})}}
                                   small={true}
                                   large={false}
                                   leftIcon="chevron-right"
                                   fill={true}
                                   value={this.state.console_command_value}
                                   />
                    </form>
                    )
                }

            </div>
        )
    }
 }

 SearchableConsole.propTypes = {
     log_content: PropTypes.string,
     outer_style: PropTypes.object,
     inner_ref: PropTypes.object,
     clearConsole: PropTypes.func,
     setMaxConsoleLines: PropTypes.func,
     commandExec: PropTypes.func

};

 SearchableConsole.defaultProps = {
     log_content: "",
     outer_style: {},
     inner_ref: null,
     setMaxConsoleLines: null,
     clearConsole: null,
     commandExec: null
 };

