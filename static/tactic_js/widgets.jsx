import React, {useEffect} from "react";

import {postPromise, postWithCallback} from "./communication_react";

export {useWidget}

function useWidget(uid, main_id) {
     useEffect(() => {
        return () => {
            postWithCallback(main_id, "remove_widget", {uid: uid});
        }
    }, []);

     function widgetGet(data) {
         let ndata = {uid, ...data};
         return postPromise(props.main_id, "widget_get",
            ndata, main_id)
     }

     return widgetGet;
}