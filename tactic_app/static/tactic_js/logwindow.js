
function start_post_load() {
    $("#console").sortable({
            handle: '.panel-heading',
            tolerance: 'pointer',
            revert: 'invalid',
            forceHelperSize: true
        });
}


function closeLogItem(e) {
    $(e.parentElement.parentElement).remove()
}

