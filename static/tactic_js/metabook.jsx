import React from "react";
import {useRef, useContext, useEffect, useMemo} from "react";

import {metabookReducer, makeUndoableDispatch} from "./metabook_reducer";
import {MetabookSuperItem} from "./metabook_elements";
import {useReducerAndRef} from "./utilities_react";
import {SortableComponent} from "./sortable_container";

import {SettingsContext} from "./settings";
import {TacticMenubar} from "./menu_utilities";
import {postAjaxPromise, postPromise} from "./communication_react";

export {Metabook};

const empty_style = {};

function Metabook(props) {
    props = {
        ...props,
    };

    const [state, baseDispatch, stateRef] = useReducerAndRef(metabookReducer, { nodes: []});
    const undoStackRef = useRef([]);
    // const dispatch = makeUndoableDispatch(baseDispatch, stateRef, "metabook", undoStackRef);
    const dispatch = baseDispatch;

    const settingsContext = useContext(SettingsContext);

    useEffect(()=>{
        postAjaxPromise(`read_metabook/${props.meta_id}`)
            .then(data => {
                dispatch({
                    type: "initialize",
                    new_nodes: data.metabook.nodes
                })
            })
    }, [props.meta_id]);

    function setNodeValue(_id, key, value) {
        dispatch({
            type: "update_node",
            _id: _id,
            new_node: {
                [key]: value
            }
        });
    }

    async function createEmptyNode(type, index=null) {
        const data = await postPromise("host", "create_empty_node_in_metabook_task", {
            type: type,
            meta_id: props.meta_id,
            index: index
        });
        const new_id = data._id;
        const new_item = {
            type: type,
            _id: new_id
        };
        if (index != null) {
            nodeListDispatch({
                type: "add_at_index",
                new_item: new_item,
                insert_index: index
            });
        } else {
            nodeListDispatch({
                type: "add_at_end",
                new_item: new_item
            });
        }
        return
    }

    const menu_specs = useMemo(() => {
        return {
            Insert: [{
                name_text: "Text Cell", icon_name: "new-text-box",
                click_handler: ()=>{createEmptyNode("text")},
                key_bindings: ["Ctrl+T"]
            },
                {name_text: "Section", icon_name: "header",
                    click_handler: ()=>{createEmptyNode("divider")}}
        ]}
    }, []);

    const extraProps = {dispatch, setNodeValue, selectedNode: state.selectedNode, tsocket: props.tsocket,};

    return (
        <div className="metabook">
            <div className="d-flex flex-column justify-content-around ">
                <div ref={header_ref}
                     className="console-heading d-flex flex-row justify-content-between">
                    <div className="console-header-left d-flex flex-row">
                            <TacticMenubar menu_specs={menu_specs}
                                           disabled_items={[]}
                                           suggestionGlyphs={[]}
                                           showRefresh={false}
                                           showClose={false}
                                           showIconBar={false}
                                           closeTab={null}
                                           controlled={true}
                            />
                    </div>
                </div>
            </div>
            <div className="console contingent-scroll"
                 onClick={null}
                 style={{flexGrow: 1, width: "100%", position: "relative", overflow: "auto"}}>
                <SortableComponent className="console-items-div"
                                   direction="vertical"
                                   style={empty_style}
                                   main_id={null}
                                   ElementComponent={MetabookSuperItem}
                                   key_field_name="unique_id"
                                   item_list={state.nodes}
                                   helperClass={settingsContext.isDark() ? "bp6-dark" : "light-theme"}
                                   handle=".console-sorter"
                                   onBeforeCapture={() => {}}
                                   onDragEnd={()=> {}}
                                   useDragHandle={false}
                                   axis="y"
                                   tsocket={props.tsocket}
                                   extraProps={extraProps}
                />
                <div id="padding-div" style={{height: 500}}></div>
                </div>
        </div>
    )
}

