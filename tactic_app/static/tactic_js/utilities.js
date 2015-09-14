/**
 * Created by bls910 on 6/12/15.
 */



function doFlash(data) {
    // Flash a bootstrap-styled warning in status-area
    // data should be a dict with message and type fields.
    // type can be alert-success, alert-warning, alert-info, alert-danger
    if (!data.hasOwnProperty("alert_type")){
        data.alert_type = "alert-info"
    }
    if (!data.hasOwnProperty("message")){
        data.message = "Unspecified message"
    }
    var alert_template = "<div class='alert {{alert_type}} alert-dismissible'>" +
        '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button> {{message}}</div>'
    // alert_template = "<div class='alert alert-success alert-dismissible' role='alert'>{{messsage}}"

    var result = Mustache.to_html(alert_template, data)

    $("#status-area").html(result)
}