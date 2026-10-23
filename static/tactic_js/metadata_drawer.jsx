// noinspection TypeScriptUMDGlobal

import React from "react";

import { memo, useContext, createContext} from "react";
import {Drawer} from "@blueprintjs/core";
import {SettingsContext} from "./settings";
import {CombinedMetadata} from "./combined_metadata";

export {MetadataDrawer, MetadataContext}

const drawerStyle = {paddingLeft: 0, paddingRight: 15, paddingBottom: 15, paddingTop: 0};

const icon_dict = {
    collection: "database",
    project: "projects",
    tile: "application",
    list: "list",
    code: "code"
};

const MetadataContext = createContext(null);

function MetadataDrawer(props) {

    const settingsContext = useContext(SettingsContext);

    return (
        <Drawer
            icon={icon_dict[props.res_type]}
            className={settingsContext.isDark() ? "bp6-dark" : "light-theme"}
            style={drawerStyle}
            title="Metadata"
            isOpen={props.show_drawer}
            position={props.position}
            canOutsideClickClose={false}
            onClose={props.onClose}
            enforceFocus={true}
            hasBackdrop={false}
            size={props.size}
        >
            <CombinedMetadata expandWidth={true}
                              outer_style={{
                                  marginTop: 0, marginLeft: 5, overflow: "auto", padding: 15,
                                  marginRight: 0, height: "100%", border: "none", boxShadow: "none"
                              }}
                              res_name={props.res_name}
                              readOnly={props.readOnly}
                              tsocket={props.tsocket}
                              res_type={props.res_type}/>
        </Drawer>
    )
}

MetadataDrawer = memo(MetadataDrawer);
