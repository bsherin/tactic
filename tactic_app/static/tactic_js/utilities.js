/**
 * Created by bls910 on 6/12/15.
 */

var modal_template;
var tooltips_

$.get($SCRIPT_ROOT + "/get_modal_template", function(template){
    modal_template = $(template).filter('#modal-template').html();
    confirm_template = $(template).filter('#confirm-template').html();
});

alertbox = alertify.alert()
        .setting({
            'basic': true,
            'modal': false,
            'frameless': true,
            'closable': false,
            'transition': 'fade',
            'resizable': true
        });

function statusMessage(data) {
    if (data.hasOwnProperty("timeout") && (data.timeout != null)) {
        timeout = data.timeout
    } else {
        timeout = 0
    }

    if (!alertbox.isOpen()){
        alertbox.setContent(data.message).show().resizeTo("100%", 50).moveTo(0,0)
    } else {
        alertbox.setContent(data.message)
    }
}

function clearStatusMessage() {
    alertbox.close();
}

function doFlash(data) {
    // Flash a bootstrap-styled warning in status-area
    // data should be a dict with message and type fields.
    // type can be alert-success, alert-warning, alert-info, alert-danger
    if (!data.hasOwnProperty("alert_type")){
        alert_type = "alert-info"
    }
    else {
        alert_type = data.alert_type
    }
    if (!data.hasOwnProperty("message")){
        message = "Unspecified message"
    }
    else {
        message = data.message
    }
    if (!data.hasOwnProperty("timeout")) {
        timeout = 0
    } else {
        timeout = data.timeout
    }

    if (alert_type == "alert-success") {
        var msg = alertify.success(message, timeout);

    } else if(alert_type =="alert-warning") {
        var msg = alertify.error(message, timeout);

    } else {
        var msg = alertify.message(message, timeout);
    }

     $('body').one('click', function(){
        msg.dismiss();
     });
}

function scrollIntoView(element, container) {
  var containerTop = $(container).scrollTop();
  var containerBottom = containerTop + $(container).height();
  var elemTop = element.offsetTop;
  var elemBottom = elemTop + $(element).height();
  if (elemTop < containerTop) {
    $(container).scrollTop(elemTop);
  } else if (elemBottom > containerBottom) {
    $(container).scrollTop(elemBottom - $(container).height());
  }
}

function tooltipper() {
    return tooltip_dict[this.id];
}

opts_top = {
    delay: { "show": 1000, "hide": 100 },
    title: tooltipper,
    placement: "top"
};

opts_bottom = {
    delay: { "show": 1000, "hide": 100 },
    title: tooltipper,
    placement: "bottom"
};

function initializeTooltips() {
    $('.tooltip-top[data-toggle="tooltip"]').tooltip(options=opts_top);
    $('.tooltip-bottom[data-toggle="tooltip"]').tooltip(options=opts_bottom);
}

function toggleTooltips() {
    $('[data-toggle="tooltip"]').tooltip('toggle')
    return (false)
}

function clearStatusArea() {
    $("#status-area").fadeOut()
}

function confirmDialog(modal_title, modal_text, cancel_text, submit_text, submit_function) {
    var res = Mustache.to_html(confirm_template, {
        "modal_title": modal_title,
        "modal_text": modal_text,
        "cancel_text": cancel_text,
        "submit_text": submit_text
    });

    $("#modal-area").html(res);
    $("#modal-dialog").modal();

    $("#modal-submit-button").on("click", submit_handler);

    function submit_handler() {
        $("#modal-dialog").modal("hide");
        submit_function()
    }
}

function showModal(modal_title, field_title, submit_function, default_value) {
    data_dict = {"modal_title": modal_title, "field_title": field_title};

    var res = Mustache.to_html(modal_template, {
        "modal_title": modal_title,
        "field_title": field_title
    });
    $("#modal-area").html(res);
    $('#modal-dialog').on('shown.bs.modal', function () {
        $('#modal-text-input-field').focus();
    });
    $("#modal-dialog").modal();

    if (!(default_value == undefined)) {
        $("#modal-text-input-field").val(default_value)
    }

    $("#modal-submit-button").on("click", submit_handler);


    $('.submitter-field').keypress(function(e) {
        if (e.which == 13) {
            submit_handler();
            e.preventDefault();
        }
    });

    function submit_handler() {
        $("#modal-dialog").modal("hide");
        submit_function($("#modal-text-input-field").val())
    }
}

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}