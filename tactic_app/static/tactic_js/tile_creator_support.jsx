
import {TacticSocket} from "./tactic_socket";
import {renderSpinnerMessage} from "./utilities_react";
import {handleCallback, postWithCallback} from "./communication_react";
import {correctOptionListTypes} from "./creator_modules_react";

export {creator_props}

function creator_props(data, registerDirtyMethod, finalCallback, registerOmniFunction) {

    let mdata = data.mdata;
    let split_tags = mdata.tags == "" ? [] : mdata.tags.split(" ");
    let module_name = data.resource_name;
    let module_viewer_id = data.module_viewer_id;
    window.name = module_viewer_id;

    function readyListener() {
        _everyone_ready_in_context(finalCallback);
    }

    var tsocket = new TacticSocket("main", 5000, "creator", module_viewer_id, function (response) {
        tsocket.socket.on("remove-ready-block", readyListener);
        tsocket.socket.emit('client-ready', {
            "room": data.module_viewer_id, "user_id": window.user_id, "participant": "client",
            "rb_id": data.ready_block_id, "main_id": data.module_viewer_id
        })
    });
    let tile_collection_name = data.tile_collection_name;


    function _everyone_ready_in_context(finalCallback) {
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
        postWithCallback(module_viewer_id, "initialize_parser",
            the_content, (pdata) => got_parsed_data_in_context(pdata), null, module_viewer_id);

        function got_parsed_data_in_context(data_object) {
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
                    registerOmniFunction: registerOmniFunction
                }
            );
        }
    }
}
