/**
 * Created by bls910 on 7/18/15.
 */

function load_selected_collection() {
    var collection_name = $('#collection-selector > .btn.active').text().trim();
    window.open("/main/" + collection_name)
}