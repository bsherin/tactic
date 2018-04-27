
function start_post_load() {
    $("#console").sortable({
        handle: '.card-header',
        tolerance: 'pointer',
        revert: 'invalid',
        forceHelperSize: true
    });
    $("#console").on("click", ".close-log-button", {"cobject": this}, closeLogItem)
}


function closeLogItem(e) {
    self = e.data.cobject;
    const el = $(e.target).closest(".log-panel");
    el.remove()
}

