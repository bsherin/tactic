/**
 * Created by bls910 on 10/4/15.
 */
let current_theme = "default";
let myCodeMirror;
let savedCode = null;
let savedTags = null;
let savedNotes = null;
const this_viewer = "viewer";
let module_code = null;


function start_post_load() {
    postAjax("get_module_code/" + module_name, {}, continue_loading)
}

function continue_loading(data) {
    savedCode = data.module_code;
    const codearea = document.getElementById("codearea");
    myCodeMirror = createCMArea(codearea, true);
    myCodeMirror.setValue(savedCode);
    resize_code_area();
    resize_dom_to_bottom_given_selector("#api-area", 20);

    const result_dict = {"res_type": "tile", "res_name": module_name};
    const acc = document.getElementsByClassName("accordion");
    let i;
    for (i = 0; i < acc.length; i++) {
        acc[i].onclick = function(){
            this.classList.toggle("active");
            this.nextElementSibling.classList.toggle("show");
        }
    }
    postAjax("grab_metadata", result_dict, got_metadata);
    function got_metadata(data) {
        if (data.success) {
            $(".created").html(data.datestring);
            $("#tile-tags")[0].value = data.tags;
            $("#tile-notes")[0].value = data.notes;
            savedTags = data.tags;
            savedNotes = data.notes
        }
        else {
            // doFlash(data)
            $(".created").html("");
            $("#tile-tags")[0].value = "";
            $("#tile-tags").html("");
            $("#tile-notes")[0].value = "";
            $("#tile-notes").html("");
        }
    }
    myCodeMirror.refresh()
}
