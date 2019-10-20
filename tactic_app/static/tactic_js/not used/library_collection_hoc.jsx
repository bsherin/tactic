import {doFlash, Status} from "./toaster";
import {showModalReact} from "./modal_react";
import {postAjaxPromise} from "./communication_react";


function withCollectionFuncs(WrappedComponent) {
    return class extends React.Component {
        constructor(props) {
            super(props);
            doBinding(this);
            this.state = {
            }
        }
         _combineCollections (res_name, multi_select, list_of_selected) {
            var res_names;
            let self = this;
            if (!this.props.multi_select) {
                showModalReact("Name of collection to combine with " + res_name, "collection Name", function (other_name) {
                    self.props.startSpinner(true);
                    const target = `${$SCRIPT_ROOT}/combine_collections/${res_names[0]}/${other_name}`;
                    $.post(target, (data)=>{
                        self.props.stopSpinner();
                        if (!data.success) {
                            self.props.addErrorDrawerEntry({title: "Error combining collections", content: data.message})
                        }
                        {
                            doFlash(data);
                        }
                    });
                })
            }
            else {
                $.getJSON(`${$SCRIPT_ROOT}get_resource_names/collection`, function (data) {
                    showModalReact("Combine Collections", "Name for combined collection", CreateCombinedCollection, "NewCollection", data["resource_names"])
                });
            }

            function CreateCombinedCollection(new_name) {
                postAjaxPromise("combine_to_new_collection",
                    {"original_collections": list_of_selected, "new_name": new_name})
                    .then((data) => {
                        self.props.add_new_row(data.new_row)
                    })
                    .catch((data)=>{self.props.addErrorDrawerEntry({title: "Error combining collections", content: data.message})})
            }
        }

        _collection_duplicate() {
            this.props.duplicate_func("/duplicate_collection")
        }

        _collection_delete() {
            this.props.delete_func("/delete_collection")
        }

        _downloadCollection () {
            let res_name = this.props.selected_resource.name;
            showModalReact("Download Collection as Excel Notebook", "New File Name", function (new_name) {
                window.open(`${$SCRIPT_ROOT}/download_collection/` + res_name  + "/" + new_name)
            }, res_name + ".xlsx")
        };


        render() {
            return (
                <React.Fragment>
                    <WrappedComponent {...this.props}
                    />
                    <Status {...this.state}/>
                </React.Fragment>
            )
        }
    }
}