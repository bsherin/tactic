/**
 * Created by bls910 on 11/1/15.
 */

function start_post_load() {

    editor = new EpicEditor(opts).load();
    if (use_ssl) {
        socket = io.connect('https://'+document.domain + ':' + location.port  + '/doc_manage');
    }
    else {
        socket = io.connect('http://'+document.domain + ':' + location.port  + '/doc_manage');
    }

    socket.emit('join', {"user_id":  user_id});
    socket.on('update-doc-list', function(data) {
        $("#doc-selector").html(data.html)
    });

    $.get($SCRIPT_ROOT + "/get_resource_module_template", function(template){
        resource_module_template = $(template).filter('#resource-module-template').html();
        docManager.create_module_html();
        $("#doc-selector").load($SCRIPT_ROOT + "/request_update_doc_list");
        docManager.add_listeners();
    });
    resize_to_fit();

    //$("#epiceditor").height(window.innerHeight)
}

function resize_to_fit () {
    $("#epiceditor").height(window.innerHeight - $("#epiceditor").offset()["top"] - 50);
    editor.reflow()
}

var docManager = Object.create(resourceManager);

doc_manager_specifics = {
    res_type: "doc",
    show_new: false,
    show_add: false,
    show_duplicate: false,
    show_loaded_list: false,
    show_save: true,
    show_new: true,
    add_view: '',
    view_view: '',
    save_view: "/save_doc",
    new_view: "/new_doc",
    delete_view: "/delete_doc/",
    view_func: function (event) {
        var manager = event.data.manager;
        var res_name = manager.check_for_selection(manager.res_type);
        if (res_name == "") return;
        $.getJSON($SCRIPT_ROOT + '/get_doc_markdown/' + String(res_name), success=function(data){
            if (data.success) {
                $("#current-doc-name").text(res_name);
                editor.importFile("meaningless_name", data.doc_text);
                editor.preview();
                resize_to_fit()
                editor.reflow()

            }
        })
    },
    save_func: function (event) {
        var manager = event.data.manager;
        var res_name = manager.check_for_selection(manager.res_type);
        if (res_name == "") return;
        data_dict = {};
        var result_dict = {
                "res_name": res_name,
                "doc_markdown": editor.exportFile()
            };

        $.ajax({
                url: $SCRIPT_ROOT + manager.save_view,
                contentType: 'application/json',
                type: 'POST',
                async: true,
                data: JSON.stringify(result_dict),
                dataType: 'json',
                success: function (data) {
                    doFlash(data)
                }
            });
    }

};
updateObject(docManager, doc_manager_specifics);