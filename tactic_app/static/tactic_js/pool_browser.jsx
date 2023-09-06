import React from "react";

import {Fragment, useState, useEffect, useRef, memo, useContext} from "react";

import { Menu, MenuItem, MenuDivider } from "@blueprintjs/core";

import {guid, useStateAndRef} from "./utilities_react";
import {LibraryMenubar} from "./library_menubars"
import {CombinedMetadata, icon_dict} from "./blueprint_mdata_fields";
import {PoolTree, getBasename, splitFilePath, getFileParentPath} from "./pool_tree";
import {HorizontalPanes} from "./resizing_layouts";
import {postAjax, postAjaxPromise, postWithCallback} from "./communication_react";
import {withErrorDrawer} from "./error_drawer";
import {withStatus} from "./toaster";
import {doFlash} from "./toaster";
import {ThemeContext} from "./theme";

import {DialogContext} from "./modal_react";

import {library_id} from "./library_home_react"

export {PoolBrowser}

const pool_browser_id = guid();

function PoolBrowser(props) {
    const [selected_resource, set_selected_resource, selected_resource_ref] = useStateAndRef({
        name: "",
        tags: "",
        notes: "",
        updated: "",
        created: "",
        size: ""
    });
    const [value, setValue] = useState(null);
    const [selectedNode, setSelectedNode] = useState(null);
    const [multi_select, set_multi_select, multi_select_ref] = useStateAndRef(false);
    const [list_of_selected, set_list_of_selected, list_of_selected_ref] = useStateAndRef([]);
    const [contextMenuItems, setContextMenuItems] = useState([]);
    const [left_width_fraction, set_left_width_fraction, left_width_fraction_ref] = useStateAndRef(.65);
    const [have_activated, set_have_activated] = useState(false);
    
    const theme = useContext(ThemeContext);
    const dialogFuncs = useContext(DialogContext);

    const treeRefreshFunc = useRef(null);
    // Important note: The first mounting of the pool tree must happen after the pool pane
    // is first activated. Otherwise, I do GetPoolTree before everything is ready and I don't
    // get the callback for the post.

    const top_ref = useRef(null);
    const resizing = useRef(false);

    useEffect(()=>{
        if (props.am_selected && !have_activated) {
            set_have_activated(true)
        }
    }, [props.am_selected]);

    useEffect(()=>{
        if (value) {
            postWithCallback("host", "GetFileStats", {user_id: window.user_id, file_path: value}, (data)=>{
                if (!data.stats) return;
                set_selected_resource({
                    name: getBasename(value),
                    tags: "",
                    notes: "",
                    updated: data.stats.updated,
                    created: data.stats.created,
                    size: String(data.stats.size)

                })
            })
        }
        else {
            set_selected_resource({name: "", tags: "", notes: "", updated: "", created: ""})
        }
    }, [value]);
    
    function _rename_func(node = null) {
        if (!value && !node) return;

        const path = node.constructor.name == 'SyntheticBaseEvent' ? value : node.fullpath;
        dialogFuncs.showModal("ModalDialog", {
                    title: "Rename Pool Resource",
                    field_title: "New Name",
                    handleSubmit: RenameResource,
                    default_value: getBasename(path),
                    existing_names: [],
                    checkboxes: [],
                    handleCancel: null,
                    handleClose: dialogFuncs.hideModal,
                });
        function RenameResource(new_name) {
            const the_data = {new_name: new_name, old_path: path};
            postAjax(`rename_pool_resource`, the_data, renameSuccess);

            function renameSuccess(data) {
                if (!data.success) {
                    props.addErrorDrawerEntry({title: "Error renaming resource", content: data.message});
                    return false
                } else {
                    return true
                }
            }
        }
    }

    function _add_directory(node = null) {
        if (!value && !node) return;

        const sNode = node.constructor.name == 'SyntheticBaseEvent' ? selectedNode : node;
        let initial_address;
        if (sNode.isDirectory) {
            initial_address = sNode.fullpath
        }
        else {
            initial_address = getFileParentPath(sNode.fullpath)
        }
        dialogFuncs.showModal("SelectAddressDialog", {
            title: "Add a Pool Directory",
            handleSubmit: AddDirectory,
            selectType: "folder",
            initial_address: initial_address,
            initial_name: "New Directory",
            showName: true,
            handleClose: dialogFuncs.hideModal,
        });
        function AddDirectory(full_path) {
            const the_data = {full_path: full_path};
            postAjax(`create_pool_directory`, the_data, addSuccess);

            function addSuccess(data) {
                if (!data.success) {
                    props.addErrorDrawerEntry({title: "Error Adding Directory", content: data.message});
                    return false
                } else {
                    return true
                }
            }
        }
    }

    function _duplicate_file(node = null) {
        if (!value && !node) return;

        const sNode = node.constructor.name == 'SyntheticBaseEvent' ? selectedNode : node;
        if (sNode.isDirectory) {
            doFlash("You can't duplicate a directory");
            return
        }
        const src = sNode.fullpath;
        const [initial_address, initial_name] = splitFilePath(sNode.fullpath);

        dialogFuncs.showModal("SelectAddressDialog", {
            title: "Duplicate a file",
            handleSubmit: DupFile,
            selectType: "folder",
            initial_address: initial_address,
            initial_name: initial_name,
            showName: true,
            handleClose: dialogFuncs.hideModal,
        });

        function DupFile(dst) {
            const the_data = {dst, src};
            postAjax(`duplicate_pool_file`, the_data, addSuccess);

            function addSuccess(data) {
                if (!data.success) {
                    props.addErrorDrawerEntry({title: "Error Adding Directory", content: data.message});
                    return false
                } else {
                    return true
                }
            }
        }
    }

    function _move_resource(node = null) {
        if (!value && !node) return;

        const sNode = node.constructor.name == 'SyntheticBaseEvent' ? selectedNode : node;
        const src = sNode.fullpath;
        let initial_address;
        if (sNode.isDirectory) {
            initial_address = sNode.fullpath
        }
        else {
            initial_address = getFileParentPath(sNode.fullpath)
        }

        dialogFuncs.showModal("SelectAddressDialog", {
            title: `Select a destination for ${getBasename(src)}`,
            handleSubmit: MoveResource,
            selectType: "folder",
            initial_address: initial_address,
            initial_name: "",
            showName: false,
            handleClose: dialogFuncs.hideModal,
        });
        function MoveResource(dst) {
            if (src == dst) return;
            const the_data = {dst: dst, src: src};
            postAjax(`move_pool_resource`, the_data, addSuccess);

            function addSuccess(data) {
                if (!data.success) {
                    props.addErrorDrawerEntry({title: "Error Moving Resource", content: data.message});
                    return false
                } else {
                    return true
                }
            }
        }
    }

    function _delete_func(node = null) {
        if (!value && !node) return;
        const path = node.constructor.name == 'SyntheticBaseEvent' ? value : node.fullpath;
        const sNode = node.constructor.name == 'SyntheticBaseEvent' ? selectedNode : node;
        if (sNode.isDirectory && sNode.childNodes.length > 0) {
            doFlash("You can't delete a non-empty directory");
            return
        }
        const basename = getBasename(path);
        const confirm_text = `Are you sure that you want to delete ${basename}?`;

        dialogFuncs.showModal("ConfirmDialog", {
            title: "Delete resource",
            text_body: confirm_text,
            cancel_text: "do nothing",
            submit_text: "delete",
            handleSubmit: ()=>{
                postAjaxPromise("delete_pool_resource", {full_path: path, is_directory: sNode.isDirectory})
                    .then(()=>{return true})
                    .catch((data)=>{
                        props.addErrorDrawerEntry({title: "Error deleting resource", content: data.message})
                    })
            },
            handleClose: dialogFuncs.hideModal,
            handleCancel: null
        });
    }

    function _add_to_pool(myDropZone, setCurrentUrl, current_value) {
        let new_url = `import_pool/${library_id}`;
        myDropZone.options.url = new_url;
        setCurrentUrl(new_url);
        myDropZone.processQueue();
    }

    function _showPoolImport(node = null) {
        var initial_directory = null;
        const sNode = node.constructor.name == 'SyntheticBaseEvent' ? selectedNode : node;
        if (sNode && sNode.isDirectory) {
            initial_directory = sNode.fullpath
        }
        dialogFuncs.showModal("FileImportDialog", {
            res_type: "pool",
            allowed_file_types: null,
            checkboxes: [],
            process_handler: _add_to_pool,
            tsocket: props.tsocket,
            combine: false,
            show_csv_options: false,
            after_upload: null,
            show_address_selector: true,
            initial_address: initial_directory,
            handleClose: dialogFuncs.hideModal,
            handleCancel: null
        });
    }

    function _handleSplitResize(left_width, right_width, width_fraction) {
        if (!resizing.current) {
            set_left_width_fraction(width_fraction);
        }
    }

    function _handleSplitResizeStart() {
        resizing.current = true;
    }

    function _handleSplitResizeEnd(width_fraction) {
        resizing.current = false;
        set_left_width_fraction(width_fraction);
    }

    function handleNodeClick(node, nodes) {
        setValue(node.fullpath);
        setSelectedNode(node);
        return true
    }

    function renderContextMenu(props) {
        return (
            <Menu>
                <MenuItem icon="edit"
                          onClick={()=>{_rename_func(props.node)}}
                          text="Rename Resource"/>
                <MenuItem icon="inheritance"
                          onClick={()=>{_move_resource(props.node)}}
                          text="Move Resource"/>
                <MenuItem icon="duplicate"
                          onClick={()=>{_duplicate_file(props.node)}}
                          text="Duplicate File"/>
                <MenuItem icon="folder-close"
                          onClick={()=>{_add_directory(props.node)}}
                          text="Create Directory"/>
                <MenuItem icon="trash"
                          onClick={()=>{_delete_func(props.node)}}
                          intent="danger"
                          text="Delete Resource"/>
                <MenuDivider/>
                <MenuItem icon="cloud-upload"
                          onClick={()=>{_showPoolImport(props.node)}}
                          text="Import To Pool"/>
            </Menu>
        );
    }

    function registerTreeRefreshFunc(func) {
        treeRefreshFunc.current = func
    }

    let outer_style = {marginTop: 0, marginLeft: 0, overflow: "auto", marginRight: 0, height: "100%"};
    let right_pane = (
        <CombinedMetadata useTags={false}
                              useNotes={false}
                              elevation={2}
                              name={selected_resource_ref.current.name}
                              created={selected_resource_ref.current.created}
                              updated={selected_resource_ref.current.updated}
                              size={selected_resource_ref.current.size}
                              icon={null}
                              handleChange={null}
                              res_type="pool"
                              pane_type="pool"
                              outer_style={outer_style}
                              handleNotesBlur={null}
                              additional_metadata={{
                                  size: selected_resource_ref.current.size,
                                  path: value
                              }}
                              readOnly={true}
            />
        );

    let left_pane = (
            <div className="d-flex flex-row" style={{maxHeight: "100%", position: "relative", padding: 15}}>
                {(props.am_selected || have_activated) &&
                    <PoolTree value={value}
                              renderContextMenu={renderContextMenu}
                              select_type="both"
                              registerTreeRefreshFunc={registerTreeRefreshFunc}
                              user_id={window.user_id}
                              tsocket={props.tsocket}
                              handleNodeClick={handleNodeClick}/>
                }
            </div>
    );
    return (
            <Fragment>
                <PoolMenubar selected_resource={selected_resource_ref.current}
                             connection_status={null}
                             rename_func={_rename_func}
                             delete_func={_delete_func}
                             add_directory={_add_directory}
                             duplicate_file={_duplicate_file}
                             move_resource={_move_resource}
                             refreshFunc={treeRefreshFunc.current}
                             showPoolImport={_showPoolImport}
                              registerOmniGetter={props.registerOmniGetter}
                              multi_select={multi_select_ref.current}
                              list_of_selected={list_of_selected_ref.current}
                              startSpinner={props.startSpinner}
                              stopSpinner={props.stopSpinner}
                              clearStatusMessage={props.clearStatusMessage}
                              sendContextMenuItems={setContextMenuItems}
                              {...props.errorDrawerFuncs}
                              library_id={props.library_id}
                              controlled={props.controlled}
                              am_selected={props.am_selected}
                              tsocket={props.tsocket}/>
                <div ref={top_ref} style={outer_style}>
                    <div style={{width: props.usable_width, height: props.usable_height}}>
                        <HorizontalPanes
                                available_width={props.usable_width}
                                available_height={props.usable_height}
                                show_handle={true}
                                left_pane={left_pane}
                                right_pane={right_pane}
                                right_pane_overflow="auto"
                                initial_width_fraction={.75}
                                scrollAdjustSelectors={[".bp5-table-quadrant-scroll-container"]}
                                handleSplitUpdate={_handleSplitResize}
                                handleResizeStart={_handleSplitResizeStart}
                                handleResizeEnd={_handleSplitResizeEnd}
                            />
                    </div>
                </div>
            </Fragment>
    )
}

PoolBrowser = memo(PoolBrowser);
PoolBrowser = withErrorDrawer(withStatus(PoolBrowser));

function PoolMenubar(props) {

    function context_menu_items() {
        return [
        ];
    }

    function menu_specs() {
        return {
            Edit: [
                {name_text: "Rename Resource", icon_name: "edit", click_handler: props.rename_func},
                {name_text: "Move Resource", icon_name: "inheritance", click_handler: props.move_resource},
                {name_text: "Duplicate File", icon_name: "duplicate", click_handler: props.duplicate_file},
                {name_text: "Create Directory", icon_name: "folder-close", click_handler: props.add_directory},
                {name_text: "Delete Resource", icon_name: "trash", click_handler: props.delete_func},
            ],
            Transfer: [
                {name_text: "Import To Pool", icon_name: "cloud-upload", click_handler: props.showPoolImport}
            ]
        };
    }

    return <LibraryMenubar sendContextMenuItems={props.sendContextMenuItems}
                           connection_status={props.connection_status}
                           registerOmniGetter={props.registerOmniGetter}
                           context_menu_items={context_menu_items()}
                           selected_rows={props.selected_rows}
                           selected_type={props.selected_type}
                           selected_resource={props.selected_resource}
                           resource_icon={icon_dict["all"]}
                           menu_specs={menu_specs()}
                           multi_select={props.multi_select}
                           controlled={props.controlled}
                           am_selected={props.am_selected}
                           tsocket={props.tsocket}
                           showRefresh={true}
                           refreshTab={props.refreshFunc}
                           closeTab={null}
                           resource_name=""
                           showErrorDrawerButton={true}
                           toggleErrorDrawer={props.toggleErrorDrawer}
    />
}

PoolMenubar = memo(PoolMenubar);