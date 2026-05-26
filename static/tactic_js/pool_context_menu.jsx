import React, {Fragment, memo, useContext, useEffect} from "react";
import {Menu, MenuDivider, MenuItem} from "@blueprintjs/core";
import {copyToClipboard, getFileExtension, useStateAndRef} from "./utilities_react";
import {getBasename, getFileParentPath, PoolTree, splitFilePath} from "./pool_tree";
import {getBlobPromise, postPromise} from "./communication_react";
import {LibraryMenubar} from "./library_menubars"
import {DialogContext} from "./modal_react";
import {ErrorDrawerContext} from "./error_drawer";
import {doFlash} from "./toaster";
import {icon_dict} from "./combined_metadata";

export {PoolTreeWithContextMenu, PoolMenubar}

function withPoolMenuFuncs(WrappedComponent) {
    function WithPoolMenuComponent(props) {
        const dialogFuncs = useContext(DialogContext);
        const errorDrawerFuncs = useContext(ErrorDrawerContext);

        function _copy_func(node = null) {
            if (!props.value && !node) return;
            const path = node && "isDirectory" in node ? node.fullpath : props.value;
            copyToClipboard(path);
        }

        async function _rename_func(node = null) {
            if (!props.value && !node) return;
            try {
                const path = node && "isDirectory" in node ? node.fullpath : props.value;
                let new_name = await dialogFuncs.showModalPromise("ModalDialog", {
                    title: "Rename Pool Resource",
                    field_title: "New Name",
                    default_value: getBasename(path),
                    existing_names: [],
                    checkboxes: [],
                    handleClose: dialogFuncs.hideModal,
                });
                const the_data = {new_name: new_name, old_path: path};
                await postPromise("host", "rename_pool_resource_task", the_data);
            } catch (e) {
                if (e != "canceled") {
                    errorDrawerFuncs.addFromError(`Error renaming`, e)
                }
            }
        }

        async function viewTextFile(node = null) {
            if (!props.value && !node) return;
            try {
                const path = node && "isDirectory" in node && !node.isDirectory ? node.fullpath : props.value;
                if (!path) return;
                props.handleCreateViewer("text", null, null, null, path)
            } catch (e) {
                errorDrawerFuncs.addFromError(`Error viewing text file`, e)
            }
        }

        async function sendNewCell(path, main_id, read_as_dataframe) {
            const ext = getFileExtension(path);
            let code;
            if (read_as_dataframe) {
                if (ext === "csv") {
                    code = `import pandas as pd\ndf = pd.read_csv("${path}")`
                } else if (ext === "parquet") {
                    code = `import pandas as pd\ndf = pd.read_parquet("${path}")`
                } else {
                    code = `import pandas as pd\ndf = pd.read_pickle("${path}")`
                }
            } else {
                if (ext == "pkl") {
                    code = `import pickle\nwith open("${path}", "rb") as f:\n    data = pickle.load(f)`
                } else {
                    code = `with open("${path}") as f:\n    txt = f.read()`
                }
            }

            await postPromise("host",
                "print_code_area_to_console",
                {"console_text": code, "user_id": window.user_id, "local_id": main_id},
                window.global_id);
        }

        async function openInNotebook(node = null) {
            if (!props.value && !node) return;
            try {
                const path = node && "isDirectory" in node && !node.isDirectory ? node.fullpath : props.value;
                let openResources = props.getOpenResources();
                let open_projects = [];
                let open_projects_dict = {};
                let requireNewNotebook;
                if (openResources.length === 0) {
                    requireNewNotebook = true;
                } else {
                    requireNewNotebook = false;
                    for (let entry of openResources) {
                        if (entry.res_type === "project" || entry.res_type === "collection") {
                            open_projects.push(entry.resource_name);
                            open_projects_dict[entry.resource_name] = entry
                        }
                    }
                }
                let [selectedResource, checkResults] = await dialogFuncs.showModalPromise("SelectDialog", {
                    title: "Open resources in notebook",
                    checkboxes: [
                        {
                            "checkname": "create_new_notebook",
                            "checktext": "Create new notebook",
                            "checked": requireNewNotebook,
                            "disabled": requireNewNotebook
                        },
                        {"checkname": "read_as_dataframe", "checktext": "Read as dataframe", "checked": false},
                    ],
                    select_label: "Project",
                    cancel_text: "Cancel",
                    submit_text: "Open",
                    option_list: open_projects,
                    handleClose: dialogFuncs.hideModal,
                });
                if (checkResults["create_new_notebook"]) {
                    props.handleCreateViewer("new-notebook", null, async (main_id) => await sendNewCell(path, main_id, checkResults["read_as_dataframe"]))
                } else {
                    props.setSelectedTabId(open_projects_dict[selectedResource].id);
                    await sendNewCell(path, open_projects_dict[selectedResource].local_id, checkResults["read_as_dataframe"])
                }

            } catch (e) {
                errorDrawerFuncs.addFromError(`Error opening in notebook`, e)
            }
        }

        async function MoveResource(src, dst) {
            if (src == dst) return;
            try {
                const the_data = {dst: dst, src: src};
                await postPromise("host", "move_pool_resource_task", the_data);
            } catch (e) {
                errorDrawerFuncs.addFromError("Error moving resource", e)
            }
        }

        async function _move_resource(node = null) {
            if (!props.value && !node) return;
            try {
                const sNode = node && "isDirectory" in node ? node : props.selectedNode;
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

        async function _duplicate_file(node = null) {
            if (!props.value && !node) return;

            try {
                const sNode = node && "isDirectory" in node ? node : props.selectedNode;
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
                await postPromise("host", "duplicate_pool_file_task", the_data);
            } catch (e) {
                if (e != "canceled") {
                    errorDrawerFuncs.addFromError(`Error duplicating file`, e)
                }
            }
        }

        async function _add_directory(node = null) {
            if (!props.value && !node) return;

            try {
                const sNode = node && "isDirectory" in node ? node : props.selectedNode;
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
                await postPromise("host", "create_pool_directory_task", the_data);
            } catch (e) {
                if (e != "canceled") {
                    errorDrawerFuncs.addFromError(`Error adding directory`, e)
                }
            }
        }

        async function _delete_func(node = null) {
            if (!props.value && !node) return;
            try {
                const path = node && "isDirectory" in node ? node.fullpath : props.value;
                const sNode = node && "isDirectory" in node ? node : props.selectedNode;

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
                await postPromise("host", "delete_pool_resource_task", {
                    full_path: path,
                    is_directory: sNode.isDirectory
                })
            } catch (e) {
                if (e != "canceled") {
                    errorDrawerFuncs.addFromError(`Error deleting`, e)
                }
            }
        }

        function _showPoolImport(node = null) {
            let initial_directory;
            const sNode = node && "isDirectory" in node ? node : props.selectedNode;
            if (sNode && sNode.isDirectory) {
                initial_directory = sNode.fullpath
            } else {
                initial_directory = props.currentRootPath
            }
            dialogFuncs.showModal("FileImportDialog", {
                res_type: "pool",
                allowed_file_types: null,
                checkboxes: [],
                process_handler: props.add_to_pool,
                chunking: true,
                chunkSize: 1024 * 1000 * 25,
                forceChunking: true,
                tsocket: props.tsocket,
                combine: false,
                show_csv_options: false,
                after_upload: null,
                show_address_selector: true,
                allowFolderSelection: true,
                initial_address: initial_directory,
                handleClose: dialogFuncs.hideModal,
                handleCancel: null,
                use_s3: window.use_s3,
            });
        }

        async function _downloadFile(node = null) {
            if (!props.value && !node) return;

            try {
                const sNode = node && "isDirectory" in node ? node : props.selectedNode;
                if (sNode.isDirectory) {
                    doFlash("You can't download a directory");
                    return
                }
                const src = sNode.fullpath;

                let new_name = await dialogFuncs.showModalPromise("ModalDialog", {
                    title: "Download File",
                    field_title: "New File Name",
                    default_value: getBasename(src),
                    existing_names: [],
                    checkboxes: [],
                    handleClose: dialogFuncs.hideModal,
                });
                const the_data = {src};
                let [data, , xhr] = await getBlobPromise("download_pool_file", the_data);
                if (xhr.status === 200) {
                    // Create a download link and trigger the download
                    let url = window.URL.createObjectURL(data);
                    let a = document.createElement('a');
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

        async function _add_to_pool(myDropZone, setCurrentUrl, current_value) {
            if (!window.use_s3) {
                let new_url = `import_pool/${window.global_id}`;
                myDropZone.options.url = new_url;
                setCurrentUrl(new_url);
                myDropZone.processQueue();
            } else {
                for (let file of myDropZone.getQueuedFiles()) {
                    myDropZone.emit("processing", file);
                    let resp = await postPromise("host", "get_s3_upload_info_task", {
                        filename: file.name,
                        content_type: file.type || "application/octet-stream",
                        dest_path: current_value
                    });

                    if (!resp.success) {
                        myDropZone.emit("error", file, resp.message);
                        errorDrawerFuncs.addErrorDrawerEntry({
                            title: "Failed to get presign",
                            content: resp.message
                        });
                        return;
                    }

                    const {url, fields, key, bucket, content_type} = resp.upload_info;

                    const fd = new FormData();
                    Object.entries(fields).forEach(([k, v]) => fd.append(k, v));
                    fd.append("file", file);

                    try {
                        const xhr = new XMLHttpRequest();
                        xhr.open("POST", url, true);
                        xhr.upload.onprogress = (e) => {
                            if (e.lengthComputable) {
                                const pct = (e.loaded / e.total) * 100;
                                myDropZone.emit("uploadprogress", file, pct, e.loaded);
                            } else {
                                myDropZone.emit("uploadprogress", file, 50, 0);
                            }
                        };
                        xhr.onload = async () => {
                            if (xhr.status >= 200 && xhr.status < 300) {
                                // S3 presigned POST usually returns 204 or 201
                                myDropZone.emit("success", file, xhr.responseText);
                                myDropZone.emit("complete", file);
                            } else {
                                const msg = xhr.responseText || `Status ${xhr.status}`;
                                myDropZone.emit("error", file, msg);
                                errorDrawerFuncs.addErrorDrawerEntry({
                                    title: "S3 upload failed",
                                    content: msg
                                });
                            }
                        };

                        xhr.onerror = () => {
                            myDropZone.emit("error", file, "Network error");
                            const msg = xhr.responseText || `Status ${xhr.status}`;
                            myDropZone.emit("error", file, msg);
                            errorDrawerFuncs.addErrorDrawerEntry({
                                title: "S3 upload failed",
                                content: "Network error"
                            });
                        };

                        xhr.send(fd);
                    } catch (e) {
                        myDropZone.emit("error", file, e.message);
                        errorDrawerFuncs.addErrorDrawerEntry({
                            title: "S3 upload failed",
                            content: e.message
                        });
                    }
                }
            }
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
                    allowFolderSelection: true,
                    initial_address: dst,
                    handleClose: dialogFuncs.hideModal,
                    handleCancel: null,
                    initialFiles: files,
                    use_s3: window.use_s3,
                });
            } else {
                let src = e.dataTransfer.getData("fullpath");
                if (src) {
                    await MoveResource(src, dst)
                }
            }

        }


        return (
            <WrappedComponent
                _copy_func={_copy_func}
                _rename_func={_rename_func}
                viewTextFile={viewTextFile}
                sendNewCell={sendNewCell}
                openInNotebook={openInNotebook}
                _move_resource={_move_resource}
                moveResource={MoveResource}
                _duplicate_file={_duplicate_file}
                _add_directory={_add_directory}
                _delete_func={_delete_func}
                _showPoolImport={_showPoolImport}
                _downloadFile={_downloadFile}
                handleDrop={handleDrop}
                {...props}
            />
        )
    }

    return memo(WithPoolMenuComponent)
}

function PoolTreeWithContextMenu(props) {
    props = {
        setRoot: () => {
        },
        value: null,
        currentRootPath: null,
        selectedNode: null,
        showHidden: false,
        handleCreateViewer: null,
        getOpenResources: null,
        allow_import_and_download: false,
        select_type: "both",
        registerTreeRefreshFunc: null,
        user_id: window.user_id,
        tsocket: null,
        handleDrop: null,
        showSecondaryLabel: false,
        handleNodeClick: null,
        ...props
    }

    function renderContextMenu(lprops) {
        return (
            <Menu>
                {lprops.node && lprops.node.isDirectory &&
                    <Fragment>
                        <MenuItem icon="folder-shared-open"
                                  onClick={async () => {
                                      props.setRoot(lprops.node)
                                  }}
                                  text="Set Root"/>
                        <MenuDivider/>
                    </Fragment>
                }

                <MenuItem icon="clipboard"
                          onClick={async () => {
                              props._copy_func(lprops.node)
                          }}
                          text="Copy Path"/>
                {lprops.node && !lprops.node.isDirectory &&
                    <Fragment>
                        <MenuItem icon="eye-open"
                                  onClick={async () => {
                                      await props.viewTextFile(lprops.node)
                                  }}
                                  text="View as Text"/>
                        <MenuItem icon="code"
                                  onClick={async () => {
                                      await props.openInNotebook(lprops.node)
                                  }}
                                  text="Open in Notebook"/>

                    </Fragment>
                }
                <MenuDivider/>
                <MenuItem icon="edit"
                          onClick={async () => {
                              await props._rename_func(lprops.node)
                          }}
                          text="Rename Resource"/>
                <MenuItem icon="inheritance"
                          onClick={async () => {
                              await props._move_resource(lprops.node)
                          }}
                          text="Move Resource"/>
                <MenuItem icon="duplicate"
                          onClick={async () => {
                              await props._duplicate_file(lprops.node)
                          }}
                          text="Duplicate File"/>
                <MenuItem icon="folder-close"
                          onClick={async () => {
                              await props._add_directory(lprops.node)
                          }}
                          text="Create Directory"/>
                <MenuItem icon="trash"
                          onClick={async () => {
                              await props._delete_func(lprops.node)
                          }}
                          intent="danger"
                          text="Delete Resource"/>
                {props.allow_import_and_download &&
                    <Fragment>
                        <MenuDivider/>
                        <MenuItem icon="cloud-upload"
                                  onClick={async () => {
                                      props._showPoolImport(lprops.node)
                                  }}
                                  text="Show Import Dialog"/>
                        <MenuItem icon="download"
                                  onClick={async () => {
                                      await props._downloadFile(lprops.node)
                                  }}
                                  text="Download from Pool"/>
                    </Fragment>
                }

            </Menu>
        );
    }

    return (
        <PoolTree
            value={props.value}
            currentRootPath={props.currentRootPath}
            showHidden={props.showHidden}
            setRoot={props.setRoot}
            renderContextMenu={renderContextMenu}
            select_type={props.select_type}
            tsocket={props.tsocket}
            handleDrop={props.handleDrop}
            showSecondaryLabel={props.showSecondaryLabel}
            handleNodeClick={props.handleNodeClick}
            {...props}
        />
    );
}

PoolTreeWithContextMenu = withPoolMenuFuncs(PoolTreeWithContextMenu)

function PoolMenubar(props) {

    const [, setSelectedType, selectedTypeRef] = useStateAndRef(props.selected_resource.res_type);

    useEffect(() => {
        setSelectedType(props.selected_resource.res_type)
    }, [props.selected_resource]);

    function context_menu_items() {
        return [];
    }

    function noArg(theFunc)  {
        return () => theFunc()
    }

    function menu_specs() {
        return {
            Inspect: [
                {name_text: "Copy Path", icon_name: "clipboard", click_handler: noArg(props._copy_func)},
                {name_text: "View As Text File", icon_name: "eye-open", click_handler: noArg(props.viewTextFile)},
                {name_text: "Open in Notebook", icon_name: "code", click_handler: noArg(props.openInNotebook)}
            ],
            Edit: [
                {name_text: "Rename Resource", icon_name: "edit", click_handler: noArg(props._rename_func)},
                {name_text: "Move Resource", icon_name: "inheritance", click_handler: noArg(props._move_resource)},
                {name_text: "Duplicate File", icon_name: "duplicate", click_handler: noArg(props._duplicate_file)},
                {name_text: "Create Directory", icon_name: "folder-close", click_handler: noArg(props._add_directory)},
                {name_text: "Delete Resource", icon_name: "trash", click_handler: noArg(props._delete_func)},
            ],
            Transfer: [
                {name_text: "Show Import Dialog", icon_name: "cloud-upload", click_handler: noArg(props._showPoolImport)},
                {name_text: "Download File", icon_name: "download", click_handler: props._downloadFile}
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

PoolMenubar = withPoolMenuFuncs(PoolMenubar)

PoolMenubar = memo(PoolMenubar);