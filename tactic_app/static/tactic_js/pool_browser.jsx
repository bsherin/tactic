import React from "react";

import {Fragment, useState, useEffect, useRef, memo, useContext} from "react";

import {Menu, MenuItem, MenuDivider, Breadcrumb, Breadcrumbs} from "@blueprintjs/core";

import {guid, useStateAndRef} from "./utilities_react";
import {LibraryMenubar} from "./library_menubars"
import {CombinedMetadata, icon_dict} from "./blueprint_mdata_fields";
import {PoolTree, getBasename, splitFilePath, getFileParentPath, PoolContext} from "./pool_tree";
import {HorizontalPanes} from "./resizing_layouts2";
import {getBlobPromise, postAjaxPromise, postPromise} from "./communication_react";
import {ErrorDrawerContext} from "./error_drawer";
import {useSize} from "./sizing_tools";
import {doFlash, StatusContext} from "./toaster";
import {SettingsContext} from "./settings";
import {copyToClipboard, getFileExtension} from "./utilities_react";

import {DialogContext} from "./modal_react";

import {library_id} from "./library_home_react"

export {PoolBrowser}

const pool_browser_id = guid();

function PoolBrowser(props) {
    const top_ref = useRef(null);
    const resizing = useRef(false);
    const [selected_resource, set_selected_resource, selected_resource_ref] = useStateAndRef({
        name: "",
        tags: "",
        notes: "",
        updated: "",
        created: "",
        size: "",
        res_type: null,
    });
    const [currentRootPath, setCurrentRootPath, currentRootPathRef] = useStateAndRef("/mydisk");
    const [value, setValue, valueRef] = useStateAndRef(null);
    const [selectedNode, setSelectedNode, selectedNodeRef] = useStateAndRef(null);
    const [multi_select, set_multi_select, multi_select_ref] = useStateAndRef(false);
    const [list_of_selected, set_list_of_selected, list_of_selected_ref] = useStateAndRef([]);
    const [contextMenuItems, setContextMenuItems] = useState([]);
    const [have_activated, set_have_activated] = useState(false);

    const settingsContext = useContext(SettingsContext);
    const dialogFuncs = useContext(DialogContext);
    const errorDrawerFuncs = useContext(ErrorDrawerContext);
    const statusFuncs = useContext(StatusContext);

    const [usable_width, usable_height, topX, topY] = useSize(top_ref, 0, "pool_browser");

    const treeRefreshFunc = useRef(null);
    // Important note: The first mounting of the pool tree must happen after the pool pane
    // is first activated. Otherwise, I do GetPoolTree before everything is ready and I don't
    // get the callback for the post.


    useEffect(() => {
        if (props.am_selected && !have_activated) {
            set_have_activated(true)
        }
    }, [props.am_selected]);

    useEffect(() => {
        if (selectedNodeRef.current) {
            set_selected_resource({
                name: getBasename(value),
                tags: "",
                notes: "",
                updated: selectedNodeRef.current.updated,
                created: selectedNodeRef.current.created,
                size: String(selectedNodeRef.current.size),
                res_type: selectedNodeRef.current.isDirectory ? "poolDir" : "poolFile"
            })

        } else {
            set_selected_resource({name: "", tags: "", notes: "", updated: "", created: "", res_type: null})
        }
    }, [value]);

    function handlePoolEvent() {

    }

    async function sendNewCell(path, main_id, read_as_dataframe) {
        const ext = getFileExtension(path);
        let code = "";
        if (read_as_dataframe) {
            if (ext === "csv") {
                code = `import pandas as pd\ndf = pd.read_csv("${path}")`
            } else if (ext === "parquet") {
                code = `import pandas as pd\ndf = pd.read_parquet("${path}")`
            }
            else {
                code = `import pandas as pd\ndf = pd.read_pickle("${path}")`
            }
        }
        else {
            if (ext == "pkl") {
                code = `import pickle\nwith open("${path}", "rb") as f:\n    data = pickle.load(f)`
            }
            else {
                code = `with open("${path}") as f:\n    txt = f.read()`
            }
        }

        await postPromise("host",
                "print_code_area_to_console",
                {"console_text": code, "user_id": window.user_id, "main_id": main_id},
                props.main_id);
    }

    async function openInNotebook(node = null) {
        if (!valueRef.current && !node) return;
        try {
            const path = node && "isDirectory" in node ? node.fullpath : valueRef.current;
            if (node.isDirectory) return;
            let openResources = props.getOpenResources();
            let open_projects = [];
            let open_projects_dict = {};
            for (let entry of openResources) {
                if (entry.res_type === "project" || entry.res_type === "collection") {
                    open_projects.push(entry.resource_name);
                    open_projects_dict[entry.resource_name] = entry
                }
            }
            let [selectedResource, checkResults] = await dialogFuncs.showModalPromise("SelectDialog", {
                    title: "Open resources in notebook",
                    checkboxes: [
                        {"checkname": "create_new_notebook", "checktext": "Create new notebook"},
                        {"checkname": "read_as_dataframe", "checktext": "Read as dataframe"},
                    ],
                    select_label: "Project",
                    cancel_text: "Cancel",
                    submit_text: "Open",
                    option_list: open_projects,
                    handleClose: dialogFuncs.hideModal,
                });
            let data;
            if (checkResults["create_new_notebook"]) {
                data = await postAjaxPromise("new_notebook_in_context", {});
                if (data.success) {
                    props.handleCreateViewer(data, async () => await sendNewCell(path, data.main_id, checkResults["read_as_dataframe"]))
                } else {
                    errorDrawerFuncs.addErrorDrawerEntry({
                        title: "Error opening in notebook",
                        content: "message" in data ? data.message : ""
                    });
                }
            }
            else {
                props.setSelectedTabId(open_projects_dict[selectedResource].id);
                await sendNewCell(path, open_projects_dict[selectedResource].main_id, checkResults["read_as_dataframe"])
            }

        } catch (e) {
            errorDrawerFuncs.addFromError(`Error opening in notebook`, e)
        }
    }

    async function viewTextFile(node = null) {
        if (!valueRef.current && !node) return;
        let data;
        try {
            const path = node && "isDirectory" in node ? node.fullpath : valueRef.current;
            if (node.isDirectory) return;
            data = await postAjaxPromise("view_text_in_context", {
                context_id: context_id,
                file_path: path
            });
            if (data.success) {
                props.handleCreateViewer(data)
            } else {
                errorDrawerFuncs.addErrorDrawerEntry({
                    title: "Error viewing text file",
                    content: "message" in data ? data.message : ""
                });
            }
        } catch (e) {
            errorDrawerFuncs.addFromError(`Error viewing text file`, e)
        }
    }

    function _copy_func(node = null) {
        if (!valueRef.current && !node) return;
        const path = node && "isDirectory" in node ? node.fullpath : valueRef.current;
        copyToClipboard(path);
    }

    async function _rename_func(node = null) {
        if (!valueRef.current && !node) return;
        try {
            const path = node && "isDirectory" in node ? node.fullpath : valueRef.current;
            let new_name = await dialogFuncs.showModalPromise("ModalDialog", {
                title: "Rename Pool Resource",
                field_title: "New Name",
                default_value: getBasename(path),
                existing_names: [],
                checkboxes: [],
                handleClose: dialogFuncs.hideModal,
            });
            const the_data = {new_name: new_name, old_path: path};
            await postAjaxPromise(`rename_pool_resource`, the_data);
        } catch (e) {
            if (e != "canceled") {
                errorDrawerFuncs.addFromError(`Error renaming`, e)
            }
            return
        }
    }

    async function _add_directory(node = null) {
        if (!valueRef.current && !node) return;

        try {
            const sNode = node && "isDirectory" in node ? node : selectedNodeRef.current;
            let initial_address;
            if (sNode.isDirectory) {
                initial_address = sNode.fullpath
            } else {
                initial_address = getFileParentPath(sNode.fullpath)
            }
            let full_path = await dialogFuncs.showModalPromise("SelectAddressDialog", {
                title: "Add a Pool Directory",
                selectType: "folder",
                initial_address: initial_address,
                initial_name: "New Directory",
                showName: true,
                handleClose: dialogFuncs.hideModal,
            });
            const the_data = {full_path: full_path};
            await postAjaxPromise(`create_pool_directory`, the_data);
        } catch (e) {
            if (e != "canceled") {
                errorDrawerFuncs.addFromError(`Error adding directory`, e)
            }
            return
        }
    }

    async function _duplicate_file(node = null) {
        if (!valueRef.current && !node) return;

        try {
            const sNode = node && "isDirectory" in node ? node : selectedNodeRef.current;
            if (sNode.isDirectory) {
                doFlash("You can't duplicate a directory");
                return
            }
            const src = sNode.fullpath;
            const [initial_address, initial_name] = splitFilePath(sNode.fullpath);
            let dst = await dialogFuncs.showModalPromise("SelectAddressDialog", {
                title: "Duplicate a file",
                selectType: "folder",
                initial_address: initial_address,
                initial_name: initial_name,
                showName: true,
                handleClose: dialogFuncs.hideModal,
            });
            const the_data = {dst, src};
            await postAjaxPromise(`duplicate_pool_file`, the_data);
        } catch (e) {
            if (e != "canceled") {
                errorDrawerFuncs.addFromError(`Error duplicating file`, e)
            }
            return
        }
    }

    async function _downloadFile(node = null) {
        if (!valueRef.current && !node) return;

        try {
            const sNode = node && "isDirectory" in node ? node : selectedNodeRef.current;
            if (sNode.isDirectory) {
                doFlash("You can't download a directory");
                return
            }
            const src = sNode.fullpath;
            console.log("Got source " + String(src));

            let new_name = await dialogFuncs.showModalPromise("ModalDialog", {
                title: "Download File",
                field_title: "New File Name",
                default_value: getBasename(src),
                existing_names: [],
                checkboxes: [],
                handleClose: dialogFuncs.hideModal,
            });
            const the_data = {src};
            let [data, status, xhr] = await getBlobPromise("download_pool_file", the_data);
            if (xhr.status === 200) {
                // Create a download link and trigger the download
                var blob = new Blob([data], {type: 'application/octet-stream'});
                var url = window.URL.createObjectURL(blob);
                var a = document.createElement('a');
                a.href = url;
                a.download = new_name; // Set the desired file name
                // noinspection XHTMLIncompatabilitiesJS
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
            }
        } catch (e) {
            if (e != "canceled") {
                errorDrawerFuncs.addFromError(`Error downloading from pool`, e)
            }
        }
    }

    async function MoveResource(src, dst) {
        if (src == dst) return;
        try {
            const the_data = {dst: dst, src: src};
            await postAjaxPromise(`move_pool_resource`, the_data);
        } catch (e) {
            errorDrawerFuncs.addFromError("Error moving resource", e)
        }
    }

    async function _move_resource(node = null) {
        if (!valueRef.current && !node) return;
        try {
            const sNode = node && "isDirectory" in node ? node : selectedNodeRef.current;
            const src = sNode.fullpath;
            let initial_address;
            if (sNode.isDirectory) {
                initial_address = sNode.fullpath
            } else {
                initial_address = getFileParentPath(sNode.fullpath)
            }
            let dst = await dialogFuncs.showModalPromise("SelectAddressDialog", {
                title: `Select a destination for ${getBasename(src)}`,
                selectType: "folder",
                initial_address: initial_address,
                initial_name: "",
                showName: false,
                handleClose: dialogFuncs.hideModal,
            });
            await MoveResource(src, dst)
        } catch (e) {
            if (e != "canceled") {
                errorDrawerFuncs.addFromError(`Error moving resource`, e)
            }
        }
    }

    async function _delete_func(node = null) {
        if (!valueRef.current && !node) return;
        try {
            const path = node && "isDirectory" in node ? node.fullpath : valueRef.current;
            const sNode = node && "isDirectory" in node ? node : selectedNodeRef.current;

            const basename = getBasename(path);
            let confirm_text;
            if (sNode.isDirectory && sNode.childNodes.length > 0) {
                confirm_text = `Are you sure that you want to delete the non-empty directory ${basename}?`;
            } else {
                confirm_text = `Are you sure that you want to delete ${basename}?`;
            }

            await dialogFuncs.showModalPromise("ConfirmDialog", {
                title: "Delete resource",
                text_body: confirm_text,
                cancel_text: "do nothing",
                submit_text: "delete",
                handleClose: dialogFuncs.hideModal,
            });
            await postAjaxPromise("delete_pool_resource", {full_path: path, is_directory: sNode.isDirectory})
        } catch (e) {
            if (e != "canceled") {
                errorDrawerFuncs.addFromError(`Error deleting`, e)
            }
        }
    }

    function _add_to_pool(myDropZone, setCurrentUrl, current_value) {
        let new_url = `import_pool/${library_id}`;
        myDropZone.options.url = new_url;
        setCurrentUrl(new_url);
        myDropZone.processQueue();
    }

    function _showPoolImport(node = null) {
        var initial_directory;
        const sNode = node && "isDirectory" in node ? node : selectedNodeRef.current;
        if (sNode && sNode.isDirectory) {
            initial_directory = sNode.fullpath
        } else {
            initial_directory = "/mydisk"
        }
        dialogFuncs.showModal("FileImportDialog", {
            res_type: "pool",
            allowed_file_types: null,
            checkboxes: [],
            process_handler: _add_to_pool,
            chunking: true,
            chunkSize: 1024 * 1000 * 25,
            forceChunking: true,
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

    async function handleDrop(e, dst) {
        const files = e.dataTransfer.files;

        if (files.length != 0) {
            dialogFuncs.showModal("FileImportDialog", {
                res_type: "pool",
                allowed_file_types: null,
                checkboxes: [],
                chunking: true,
                chunkSize: 1024 * 1000 * 25,
                forceChunking: true,
                process_handler: _add_to_pool,
                tsocket: props.tsocket,
                combine: false,
                show_csv_options: false,
                after_upload: null,
                show_address_selector: true,
                initial_address: dst,
                handleClose: dialogFuncs.hideModal,
                handleCancel: null,
                initialFiles: files
            });
        } else {
            let src = e.dataTransfer.getData("fullpath");
            if (src) {
                await MoveResource(src, dst)
            }
        }

    }

    function handleNodeClick(node, nodes) {
        setValue(node.fullpath);
        setSelectedNode(node);
        return true
    }

    function setRoot(node = null) {
        if (!node) {
            node = selectedNodeRef.current;
        }
        setCurrentRootPath(node.fullpath)
    }

    function setRootToBase() {
        setCurrentRootPath("/mydisk")
    }

    function renderContextMenu(props) {
        return (
            <Menu>
                {props.node.isDirectory &&
                    <MenuItem icon="folder-shared-open"
                              onClick={async () => {
                                  await setRoot(props.node)
                              }}
                              text="Go To Folder"/>
                }
                <MenuItem icon="home"
                          onClick={async () => {
                              await setRootToBase(props.node)
                          }}
                          text="Go Home"/>
                <MenuDivider/>
                <MenuItem icon="clipboard"
                  onClick={async () => {
                      await _copy_func(props.node)
                  }}
                  text="Copy Path"/>
                {!props.node.isDirectory &&
                    <Fragment>
                    <MenuItem icon="eye-open"
                              onClick={async () => {
                                  await viewTextFile(props.node)
                              }}
                              text="View as Text"/>
                    <MenuItem icon="code"
                              onClick={async () => {
                                  await openInNotebook(props.node)
                              }}
                              text="Open in Notebook"/>

                    </Fragment>
                }
                <MenuDivider/>
                <MenuItem icon="edit"
                          onClick={async () => {
                              await _rename_func(props.node)
                          }}
                          text="Rename Resource"/>
                <MenuItem icon="inheritance"
                          onClick={async () => {
                              await _move_resource(props.node)
                          }}
                          text="Move Resource"/>
                <MenuItem icon="duplicate"
                          onClick={async () => {
                              await _duplicate_file(props.node)
                          }}
                          text="Duplicate File"/>
                <MenuItem icon="folder-close"
                          onClick={async () => {
                              await _add_directory(props.node)
                          }}
                          text="Create Directory"/>
                <MenuItem icon="trash"
                          onClick={async () => {
                              await _delete_func(props.node)
                          }}
                          intent="danger"
                          text="Delete Resource"/>
                <MenuDivider/>
                <MenuItem icon="cloud-upload"
                          onClick={async () => {
                              await _showPoolImport(props.node)
                          }}
                          text="Import To Pool"/>
                <MenuItem icon="download"
                          onClick={async () => {
                              await _downloadFile(props.node)
                          }}
                          text="Download from Pool"/>
            </Menu>
        );
    }

    function registerTreeRefreshFunc(func) {
        treeRefreshFunc.current = func
    }


    let outer_style = {marginTop: 0, marginLeft: 0, overflow: "auto", marginRight: 0, height: "100%"};
    let res_type = null;
    let fixed_data = {
        created: selected_resource_ref.current.created,
        updated: selected_resource_ref.current.updated,
        size: selected_resource_ref.current.size,
        path: valueRef.current
    };
    let right_pane = (
        <CombinedMetadata res_type={selected_resource_ref.current.res_type}
                          res_name={selected_resource_ref.current.name}
                          useFixedData={true}
                          fixedData={fixed_data}
                          elevation={2}
                          outer_style={outer_style}
                          readOnly={true}
        />
    );

    let left_pane = (
        <Fragment>
            {/*<FileDropWrapper processFiles={handleFileDrop}>*/}
            <div className="d-flex flex-column"
                 style={{maxHeight: "100%", position: "relative", overflow: "scroll", padding: 15}}>
                {(props.am_selected || have_activated) &&
                    <PoolContext.Provider value={{
                        workingPath: null, setWorkingPath: () => {
                        }
                    }}>
                        <PoolBreadcrumbs path={currentRootPathRef.current} setRoot={setRoot}/>
                        <PoolTree value={valueRef.current}
                                  currentRootPath={currentRootPathRef.current}
                                  setRoot={setRoot}
                                  renderContextMenu={renderContextMenu}
                                  select_type="both"
                                  registerTreeRefreshFunc={registerTreeRefreshFunc}
                                  user_id={window.user_id}
                                  tsocket={props.tsocket}
                                  handleDrop={handleDrop}
                                  showSecondaryLabel={true}
                                  handleNodeClick={handleNodeClick}/>
                    </PoolContext.Provider>
                }
            </div>
            {/*</FileDropWrapper>*/}
        </Fragment>
    );
    return (
        <Fragment>
            <PoolMenubar selected_resource={selected_resource_ref.current}
                         connection_status={null}
                         copy_func={_copy_func}
                         rename_func={_rename_func}
                         delete_func={_delete_func}
                         view_func={viewTextFile}
                         open_in_notebook_func={openInNotebook}
                         add_directory={_add_directory}
                         duplicate_file={_duplicate_file}
                         move_resource={_move_resource}
                         download_file={_downloadFile}
                         refreshFunc={treeRefreshFunc.current}
                         showPoolImport={_showPoolImport}
                         multi_select={multi_select_ref.current}
                         list_of_selected={list_of_selected_ref.current}
                         sendContextMenuItems={setContextMenuItems}
                         setRootToBase={setRootToBase}
                         setRoot={setRoot}
                         {...props.errorDrawerFuncs}
                         library_id={props.library_id}
                         controlled={props.controlled}
                         tsocket={props.tsocket}/>
            <div ref={top_ref} style={outer_style} className="pool-browser">
                <div style={{width: usable_width, height: usable_height}}>
                    <HorizontalPanes
                        outer_hp_style={{paddingBottom: "50px"}}
                        show_handle={true}
                        left_pane={left_pane}
                        right_pane={right_pane}
                        right_pane_overflow="auto"
                        initial_width_fraction={.75}
                        scrollAdjustSelectors={[".bp5-table-quadrant-scroll-container"]}
                        handleSplitUpdate={null}
                        handleResizeStart={null}
                        handleResizeEnd={null}
                    />
                </div>
            </div>
        </Fragment>
    )
}

PoolBrowser = memo(PoolBrowser);

function PoolBreadcrumb(props) {
    return (
        <Breadcrumb className="pool-breadcrumb" key={props.path} icon={props.icon} onClick={props.onClick}>
            {props.name}
        </Breadcrumb>
    )
}

function PoolBreadcrumbs(props) {

    function clickFunc(path) {
        return () => {
            props.setRoot({fullpath: path})
        }
    }

    function pathToCrumbs(path) {
        let crumbs = [];
        let parts = path.split("/");
        let new_path = "";
        for (const item of parts) {
            if (item === "") {
                continue
            }
            new_path += "/" + item;
            crumbs.push({
                name: item, icon: "folder-close", path: new_path,
                onClick: clickFunc(new_path)
            })
        }
        return crumbs
    }

    function renderBreadcrumb(props) {
        return (
            <PoolBreadcrumb {...props}/>
        )
    }

    const crumbs = pathToCrumbs(props.path);
    return (
        <Breadcrumbs className="pool-breadcrumbs" breadcrumbRenderer={renderBreadcrumb} items={crumbs}/>
    )

}

function PoolMenubar(props) {

    const [selectedType, setSelectedType, selectedTypeRef] = useStateAndRef(props.selected_resource.res_type);

    useEffect(() => {
        setSelectedType(props.selected_resource.res_type)
    }, [props.selected_resource]);

    function context_menu_items() {
        return [];
    }

    function menu_specs() {
        return {
            Navigate: [
                {name_text: "Go Home", icon_name: "home", click_handler: props.setRootToBase},
                {
                    name_text: "Go to Folder", icon_name: "folder-shared-open",
                    click_handler: () => {
                        props.setRoot()
                    }, res_type: "poolDir"
                },
            ],
            Inspect: [
                {name_text: "Copy Path", icon_name: "clipboard", click_handler: props.copy_func},
                {name_text: "View As Text File", icon_name: "eye-open", click_handler: props.view_func},
                {name_text: "Open in Notebook", icon_name: "code", click_handler: props.open_in_notebook_func}
            ],
            Edit: [
                {name_text: "Rename Resource", icon_name: "edit", click_handler: props.rename_func},
                {name_text: "Move Resource", icon_name: "inheritance", click_handler: props.move_resource},
                {name_text: "Duplicate File", icon_name: "duplicate", click_handler: props.duplicate_file},
                {name_text: "Create Directory", icon_name: "folder-close", click_handler: props.add_directory},
                {name_text: "Delete Resource", icon_name: "trash", click_handler: props.delete_func},
            ],
            Transfer: [
                {name_text: "Import To Pool", icon_name: "cloud-upload", click_handler: props.showPoolImport},
                {name_text: "Download File", icon_name: "download", click_handler: props.download_file}
            ]
        };
    }

    return <LibraryMenubar sendContextMenuItems={props.sendContextMenuItems}
                           connection_status={props.connection_status}
                           context_menu_items={context_menu_items()}
                           selected_rows={props.selected_rows}
                           selectedTypeRef={selectedTypeRef}
                           selected_resource={props.selected_resource}
                           resource_icon={icon_dict["pool"]}
                           menu_specs={menu_specs()}
                           multi_select={props.multi_select}
                           controlled={props.controlled}
                           am_selected={props.am_selected}
                           tsocket={props.tsocket}
                           showRefresh={true}
                           refreshTab={props.refreshFunc}
                           closeTab={null}
                           resource_name=""
    />
}

PoolMenubar = memo(PoolMenubar);

function FileDropWrapper(props) {
    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);

        const files = e.dataTransfer.files;

        if (files) {
            if (props.processFiles) {
                props.processFiles(files)
            }
        }
    };

    return (
        <div
            id="pool-drop-zone"
            className={`drop-zone ${isDragging ? 'drag-over' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            {props.children}
        </div>
    );
}