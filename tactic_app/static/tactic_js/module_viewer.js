/**
 * Created by bls910 on 10/4/15.
 */
var current_theme = "default";
var mousetrap = new Mousetrap();
var myCodeMirror;
var savedCode = null;
var savedTags = null;
var savedNotes = null;
var this_viewer = "viewer";
var module_code = null;


function start_post_load() {
    postAjax("get_module_code/" + module_name, {}, continue_loading)
}

function continue_loading(data) {
    savedCode = data.module_code;
    var codearea = document.getElementById("codearea");
    myCodeMirror = createCMArea(codearea, true);
    myCodeMirror.setValue(savedCode);
    resize_dom_to_bottom_given_selector(".CodeMirror", 20);
    resize_dom_to_bottom_given_selector("#api-area", 20);

    var result_dict = {"res_type": "tile", "res_name": module_name};
    var acc = document.getElementsByClassName("accordion");
    var i;
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
