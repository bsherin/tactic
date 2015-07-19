/**
 * Created by bls910 on 6/12/15.
 */

function doFlash(data) {
    var alert_template = "<div class='alert alert-success alert-dismissible'>" +
        '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button> {{message}}</div>'
    // alert_template = "<div class='alert alert-success alert-dismissible' role='alert'>{{messsage}}"
    var result = Mustache.to_html(alert_template, data)
    $("#flashzone").html(result)
}