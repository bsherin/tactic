
import React from "react";
import {useContext} from "react";
import {TacticSocket} from "./tactic_socket";
import {renderSpinnerMessage} from "./utilities_react";
import {handleCallback, postPromise} from "./communication_react";
import {correctOptionListTypes} from "./creator_modules_react";
import {SearchForm} from "./library_widgets";
import {ReactCodemirror} from "./react-codemirror";

import {SizeContext} from "./sizing_tools";

export {creator_props, TopCodePane}

function creator_props(data, registerDirtyMethod, finalCallback) {

    let mdata = data.mdata;
    let split_tags = mdata.tags == "" ? [] : mdata.tags.split(" ");
    let module_name = data.resource_name;
    let module_viewer_id = data.module_viewer_id;
    window.name = module_viewer_id;

    async function readyListener() {
        await _everyone_ready_in_context(finalCallback);
    }

    var tsocket = new TacticSocket("main", 5000, "creator", module_viewer_id, function (response) {
        tsocket.socket.on("remove-ready-block", readyListener);
        tsocket.socket.emit('client-ready', {
            "room": data.module_viewer_id, "user_id": window.user_id, "participant": "client",
            "rb_id": data.ready_block_id, "main_id": data.module_viewer_id
        })
    });
    let tile_collection_name = data.tile_collection_name;


    async function _everyone_ready_in_context(finalCallback) {
        if (!window.in_context) {
            renderSpinnerMessage("Everyone is ready, initializing...", '#creator-root');
        }
        let the_content = {
            "module_name": module_name,
            "module_viewer_id": module_viewer_id,
            "tile_collection_name": tile_collection_name,
            "user_id": window.user_id,
            "version_string": window.version_string
        };

        window.addEventListener("unload", function sendRemove() {
            navigator.sendBeacon("/delete_container_on_unload",
                JSON.stringify({"container_id": module_viewer_id, "notify": false}));
        });

        tsocket.attachListener('handle-callback', (task_packet) => {
            handleCallback(task_packet, module_viewer_id)
        });
        let data_object = await postPromise(module_viewer_id, "initialize_parser",
            the_content, module_viewer_id);

        if (!window.in_context) {
            renderSpinnerMessage("Creating the page...", '#creator-root');
        }

        tsocket.socket.off("remove-ready-block", readyListener);
        let parsed_data = data_object.the_content;
        let category = parsed_data.category ? parsed_data.category : "basic";
        let result_dict = {"res_type": "tile", "res_name": module_name, "is_repository": false};
        let odict = parsed_data.option_dict;
        let initial_line_number = !window.in_context && window.line_number ? window.line_number : null;
        let couple_save_attrs_and_exports =
            !("couple_save_attrs_and_exports" in mdata.additional_mdata) || mdata.additional_mdata.couple_save_attrs_and_exports;

        finalCallback(
            {
                resource_name: module_name,
                tsocket: tsocket,
                module_viewer_id: module_viewer_id,
                main_id: module_viewer_id,
                is_mpl: parsed_data.is_mpl,
                is_d3: parsed_data.is_d3,
                render_content_code: parsed_data.render_content_code,
                render_content_line_number: parsed_data.render_content_line_number,
                extra_methods_line_number: parsed_data.extra_methods_line_number,
                draw_plot_line_number: parsed_data.draw_plot_line_number,
                initial_line_number: initial_line_number,
                category: category,
                extra_functions: parsed_data.extra_functions,
                draw_plot_code: parsed_data.draw_plot_code,
                jscript_code: parsed_data.jscript_code,
                globals_code: parsed_data.globals_code,
                tags: split_tags,
                notes: mdata.notes,
                icon: mdata.additional_mdata.icon,
                initial_theme: window.theme,
                option_list: correctOptionListTypes(parsed_data.option_dict),
                export_list: parsed_data.export_list,
                additional_save_attrs: parsed_data.additional_save_attrs,
                couple_save_attrs_and_exports: couple_save_attrs_and_exports,
                created: mdata.datestring,
                registerDirtyMethod: registerDirtyMethod,
            }
        );
    }
}

function TopCodePane(props) {
    const sizeInfo = useContext(SizeContext);

    let mode = props.is_mpl ? "python" : "javascript";
    let code_content = props.is_mpl ? props.draw_plot_code_ref.current : props.jscript_code_ref.current;
    let first_line_number = props.is_mpl ? props.draw_plot_line_number_ref.current + 1 : 1;
    let title_label = props.is_mpl ? "draw_plot" : "(selector, w, h, arg_dict, resizing) =>";
    let ch_style = {"width": "100%"};
    return (
        <div key="dpcode" style={ch_style} className="d-flex flex-column align-items-baseline code-holder">
            <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", width: "100%"}}>
                <span className="bp5-ui-text"
                      style={{display: "flex", alignItems: "self-end"}}>{title_label}</span>
                <SearchForm update_search_state={props.updateSearchState}
                            search_string={props.search_string}
                            regex={props.regex}
                            allow_regex={true}
                            field_width={200}
                            include_search_jumper={true}
                            searchPrev={_searchPrev}
                            searchNext={_searchNext}
                            search_ref={props.search_ref}
                            number_matches={props.search_matches}
                />
            </div>
            <SizeContext.Provider value={{
                availableWidth: sizeInfo.availableWidth,
                availableHeight: sizeInfo.availableHeight,
                topX: sizeInfo.topX,
                topY: sizeInfo.topY
            }}>
                <ReactCodemirror code_content={code_content}
                                 mode={mode}
                                 extraKeys={props.extraKeys()}
                                 current_search_number={props.current_search_cm == "tc" ? props.current_search_number : null}
                                 handleChange={props.handleTopCodeChange}
                                 saveMe={props.saveAndCheckpoint}
                                 setCMObject={props.setCMObject}
                                 search_term={props.search_term}
                                 update_search_state={props.updateSearchState}
                                 alt_clear_selections={props.clearAllSelections}
                                 first_line_number={first_line_number.current}
                                 readOnly={props.read_only}
                                 regex_search={props.regex}
                                 setSearchMatches={(num) => props.setSearchMatches("tc", num)}
                                 extra_autocomplete_list={mode == "python" ? props.onames_for_autocomplete : []}
                />
            </SizeContext.Provider>
        </div>
    );
}

