import React, {useContext} from "react";
import {Fragment} from "react";
import {Button, Collapse, FormGroup, InputGroup,} from "@blueprintjs/core";

import {ErrorBoundary} from "./error_boundary";

import {ReactCodemirror6} from "./react-codemirror6";

import {MakerPaneContext} from "./tile_maker_support";

export {CmElement, MakerNavigator}

const INDENT = 25;

function SignatureHeader(props) {
    props = {
        funcName: "",
        argString: "",
        handleNameChange: () => {},
        handleArgChange: () => {},
        allowNameChange: true,
        allowArgChange: true,
        ...props
    }
    return (
        <div className="d-flex flex-row" style={{marginTop: 5, marginBottom: 5, alignSelf: "self-end"}}>
            <FormGroup label="Method Name" style={{fontSize: 12, marginBottom: 0}}>
                <InputGroup type="text"
                            size="small"
                            readOnly={props.allowNameChange}
                            onChange={(event) => props.handleNameChange(event.target.value)}
                            value={props.funcName} />
            </FormGroup>
            <FormGroup label="Arguments" style={{fontSize: 12, marginBottom: 0}}>
                <InputGroup type="text"
                            size="small"
                            readOnly={props.allowArgChange}
                            onChange={(event) => props.handleArgChange(event.target.value)}
                            value={props.argString} />
            </FormGroup>
        </div>
    )
}

function CmElement(props) {
    props = {
        cmState: null,
        cmDispatch: null,
        cmObjectRef: null,
        funcName: "",
        argString: "",
        identifier: "",
        extraKeys: null,
        saveAndCheckpoint: null,
        searchState: null,
        searchDispatch: null,
        clearAllSelections: null,
        search_ref: null,
        handleTabSelect: null,
        pushCallback: null,
        tsocket: null,
        extraSelfCompletions: null,
        module_viewer_id: null,
        show_search: true,
        ...props
    };
    function handleCodeChange(new_code) {
        props.cmDispatch({type: "SET_CODE_TEXT", payload: new_code, identifier: props.identifier});
    }
    function handleNameChange(new_name) {
        props.cmDispatch({type: "SET_FUNC_NAME", payload: new_name, identifier: props.identifier});
    }
    function handleArgChange(new_args) {
        props.cmDispatch({type: "SET_ARG_STRING", payload: new_args, identifier: props.identifier});
    }
    function setCmObject(cmObject) {
        if (props.cmObjectRef && props.cmObjectRef.current) {
            props.cmObjectRef.current = cmObject;
        }
    }
    function updateSearchState(new_state) {
        props.searchDispatch({type: "UPDATE_STATE", new_state: new_state, identifier: props.identifier});
    }
    function searchNext() {
        props.searchDispatch({type: "SEARCH_NEXT"});
        props.pushCallback(()=>{
            props.handleTabSelect(props.searchState.current_search_cm);
        })
    }

    function searchPrev() {
        props.searchDispatch({type: "SEARCH_PREVIOUS"});
        props.pushCallback(()=>{
            props.handleTabSelect(props.searchState.current_search_cm);
        })
    }

    function setSearchMatches(num) {
        props.searchDispatch({type: "SET_SEARCH_MATCHES", payload: {"identifier": props.identifier, "num": num}});
    }

    let header_left = (
        <SignatureHeader funcName={props.funcName}
                 argString={props.argString}
                 allowNameChange={props.allowNameChange}
                 allowArgChange={props.allowArgChange}
                 handleNameChange={handleNameChange}
                 handleArgChange={handleArgChange}
            />
    )

    return (
        <div>
            <ReactCodemirror6 code_content={props.cmState.codeText}
                              title_label={null}
                              show_search={true}
                              header_left={header_left}
                              mode={props.cmState.mode}
                              extraKeys={props.extraKeys()}
                              current_search_number={props.searchState.current_search_cm == props.identifier ?
                                  props.searchState.current_search_number : null}
                              handleChange={handleCodeChange}
                              saveMe={props.saveAndCheckpoint}
                              setCMObject={setCmObject}
                              search_term={props.searchState.search_string}
                              updateSearchState={updateSearchState}
                              alt_clear_selections={props.clearAllSelections}
                              first_line_number={props.cmState.firstLineNumber}
                              readOnly={props.read_only}
                              regex_search={props.searchState.use_regex}
                              search_ref={props.search_ref}
                              searchPrev={searchPrev}
                              searchNext={searchNext}
                              search_matches={props.searchState.search_matches}
                              setSearchMatches={setSearchMatches}
                              tsocket={props.tsocket}
                              extraSelfCompletions={props.mode == "python" ? props.extraSelfCompletions : []}
                              container_id={props.module_viewer_id}
                              highlight_active_line={true}/>
        </div>
    )
}

function MakerNavigator(props) {
    props = {
        handleTabSelect: () => {},
        selectedTab: "metadata",
        option_list: [],
        export_list: [],
        umList: [],
        is_mpl: false,
        is_d3: false,
        ...props
    }
    let option_name_list = props.option_list.map((option) => {return {title: option.name, identifier: null, onClick: ()=>{}}});
    let export_name_list = props.export_list.map((export_item) => {return {title: export_item.name, identifier: null, onClick: ()=>{}}});
    let um_item_list = props.umList.map((um) => {
        return {title: um.funcName, identifier: um.method_id, onClick: () => props.handleTabSelect(um.method_id)}
    });
    let code_sub_items = [
        {identifier: "render_content", title: "render_content", onClick: () => props.handleTabSelect("render_content"), icon: "play", item_list: []},
        {identifier: "globals", title: "globals", onClick: () => props.handleTabSelect("globals"), icon: "globe", item_list: []},
        {identifier: "user_methods", title: "user_methods", onClick: () => props.handleTabSelect("user_methods"), icon: "code", item_list: um_item_list}
    ]

    if (props.is_mpl) {
        code_sub_items.unshift({identifier: "draw_plot", title: "draw_plot", onClick: () => props.handleTabSelect("draw_plot"), icon: "graph", item_list: []});
    }
    if (props.is_d3) {
        code_sub_items.unshift({identifier: "javascript", title: "javascript", onClick: () => props.handleTabSelect("javascript"), icon: "code", item_list: []});
    }
    const sections = [{
            title: "PROPERTIES",
            icon: "properties",
            sub_items: [
                {identifier:"metadata", title: "Metadata", onClick: () => props.handleTabSelect("metadata"), icon:"manually-entered-data", start_open: true, item_list: []},
                {identifier:"options", title: "Options", onClick: () => props.handleTabSelect("options"), icon: "select", start_open: true, item_list: option_name_list},
                {identifier:"exports", title: "Exports", onClick: () => props.handleTabSelect("exports"), icon: "export", start_open: true, item_list: export_name_list},
            ]
        },
        {
            title: "CODE",
            icon: "code",
            sub_items: code_sub_items
        }
    ]

    return (
        <ErrorBoundary custom_message="There was an error in the Maker Navigator">
            <div style={{overflow:"hidden"}}>
                {sections.map((section, index) => (
                    <NavSection key={index} title={section.title} sub_items={section.sub_items} icon={section.icon}/>
                ))}
            </div>
        </ErrorBoundary>
    )

}

function NavSection(props) {
    props = {
        "title": "",
        "sub_items": [],
        "start_open": true,
        ...props
    }
    const [isOpen, setIsOpen] = React.useState(props.start_open);

    return (
        <div>
            <Button variant="minimal" icon={props.icon} size="large" onClick={() => setIsOpen(!isOpen)}>
                {props.title}
            </Button>
            <Collapse className="nav-section-class" isOpen={isOpen}>
                {props.sub_items.map((item, index) => (
                    <ErrorBoundary custom_message={`There was an error in the NavItem: ${item.title}`}>
                    <NavItem key={index} identifier={item.identifier} title={item.title} icon={item.icon} onClick={item.onClick} item_list={item.item_list}/>
                    </ErrorBoundary>
                ))}
            </Collapse>
        </div>
    );
}

function NavItem(props) {
    props = {
        title: "",
        onClick: () => {},
        item_list: [],
        identifier: "",
        ...props
    }
    const mpContext = useContext(MakerPaneContext);
    return (
        <Fragment>
            <Button style={{marginLeft: INDENT}}
                    icon={props.icon}
                    intent={mpContext.visibleTab == props.identifier ? "primary" : "none"}
                    size="medium"
                    variant="minimal"
                    onClick={props.onClick}>
                {props.title}
            </Button>
            {props.item_list.map((item, index) => (
                <NavListItem key={index} title={item.title} onClick={item.onClick} />
            ))}
        </Fragment>
    );
}

function NavListItem(props) {
    props = {
        title: "",
        ...props
    }
    return (
        <Button style={{marginLeft: INDENT * 2, fontSize: 13}}  size="small" variant="minimal" onClick={props.onClick}>
            {props.title}
        </Button>
    );
}