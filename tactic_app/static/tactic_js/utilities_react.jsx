/**
 * Created by bls910 on 6/12/15.
 */

let modal_template;
let select_modal_template;
let confirm_template;
let tooltips;

function doBinding(obj) {
    const proto = Object.getPrototypeOf(obj);
    for (const key of Object.getOwnPropertyNames(proto)) {
        if (key.startsWith("_")) {
            obj[key] = obj[key].bind(obj);
        }
    }
}

function updateObject(o1, o2) {
    for (let prop in o2) {
        if (o2.hasOwnProperty(prop)){
            o1[prop] = o2[prop]
        }
    }
}

function arraysMatch (arr1, arr2) {

	// Check if the arrays are the same length
	if (arr1.length !== arr2.length) return false;

	// Check if all items exist and are in the same order
	for (var i = 0; i < arr1.length; i++) {
		if (arr1[i] !== arr2[i]) return false;
	}

	// Otherwise, return true
	return true;

};

function doNothing() {}


function set_datum(e, type, dat) {
    e.dataTransfer.setData(type, dat);
}

function get_datum(e, type) {
    return e.dataTransfer.getData(type);
}

String.prototype.format = function() {
  let str = this;
  for (let i = 0; i < arguments.length; i++) {
    const reg = new RegExp("\\{" + i + "\\}", "gm");
    str = str.replace(reg, arguments[i]);
  }
  return str;
};

function get_ppi() {
  var d = $("<div/>").css({ position: 'absolute', top : '-1000in', left : '-1000in', height : '1000in', width : '1000in' }).appendTo('body');
  var px_per_in = d.height() / 1000;
  d.remove();
  return px_per_in;
}

function remove_duplicates (arrArg) {
  return arrArg.filter((elem, pos, arr) => {
    return arr.indexOf(elem) == pos;
  });
}

function objectKeys(obj) {
    const result = [];
    for (let key in obj){
        if (!obj.hasOwnProperty(key)) continue;
        result.push(key)
    }
    return result
}

Array.prototype.empty = function () {
  return this.length == 0;
};

$.get($SCRIPT_ROOT + "/get_modal_template", function(template){
    modal_template = $(template).filter('#modal-template').html();
    confirm_template = $(template).filter('#confirm-template').html();
    select_modal_template = $(template).filter('#select-modal-template').html();
});

alertify.set('notifier','position', 'top-right');


function startSpinner() {
    $("#spinner").css("display", "inline-block")
}

function stopSpinner() {
    $("#spinner").css("display", "none")
}

function doFlashStopSpinner(data) {
    stopSpinner();
    clearStatusMessage();
    doFlash(data)
}

function statusMessageText(message, timeout=null) {
    statusMessage({"message": message, "timeout": timeout})
}

function statusMessage(data) {
    $("#status-msg-area").text(data.message);
    $("#status-msg-area").fadeIn();
    if (data.hasOwnProperty("timeout") && (data.timeout != null)) {
        setTimeout(clearStatusMessage, data.timeout * 1000)
    }
}

function oldclearStatusMessage() {
    alertbox.close();
}

function clearStatusMessage() {
    $("#status-msg-area").fadeOut();
    $("#status-msg-area").text("")
}

function doSignOut(page_id) {
    window.open($SCRIPT_ROOT + "/logout/" + window.page_id, "_self");
    return (false)
}

function doFlashOnFailure(data) {
    if (!data.success) {
        doFlash(data, false)
    }

}

function doFlashOnSuccess(data) {
    if (!data.success) {
        doFlash(data, true)
    }
}

function doFlashAlways(data) {
    doFlash(data)
}

function doFlash(data) {
    // Flash a bootstrap-styled warning in status-area
    // data should be a dict with message and type fields.
    // type can be alert-success, alert-warning, alert-info, alert-danger
    let alert_type;
    let message;
    let timeout;
    let msg;
    let alert_settings = {'pinnable': false, 'modal':false};
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
        msg = alertify.success(message, timeout);

    } else if(alert_type =="alert-warning") {
        // msg = alertify.error(message, timeout);
        if ("title" in data) {
            msg = alertify.alert(title, `${message}`).set(alert_settings);
        }
        else {
            msg = alertify.alert("Error", `${message}`).set(alert_settings);
        }

    } else {
        msg = alertify.message(message, timeout);
    }

     $('body').one('click', function(){
         if (alert_type == "alert-warning") {
             msg.destroy()
         }
         else {
             msg.dismiss();
         }
     });
}

function scrollIntoView(element, container) {
  const containerTop = $(container).scrollTop();
  const containerBottom = containerTop + $(container).height();
  const elemTop = element.offsetTop;
  const elemBottom = elemTop + $(element).height();
  if (elemTop < containerTop) {
    $(container).scrollTop(elemTop);
  } else if (elemBottom > containerBottom) {
    $(container).scrollTop(elemBottom - $(container).height());
  }
}

function altScrollIntoView(element, container) {
    const containerTop = $(container).scrollTop();
    const containerBottom = containerTop + $(container).height();
    const elemTop = element.offsetTop;
    const elemBottom = elemTop + $(element).height();
    if (elemTop < containerTop) {
        element.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"})
    } else if (elemBottom > containerBottom) {
        element.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"})
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
    $('[data-toggle="tooltip"]').tooltip('toggle');
    return (false)
}


function resize_dom_to_bottom_given_selector(selector, bottom_margin) {
    if ($(selector).length > 0) {
        $(selector).css('height', window.innerHeight - $(selector).offset().top - bottom_margin)
    }
}

function fit_dom_in_parent(selector, parent_selector, bottom_margin) {
    if ($(selector).length > 0) {
        let me = $(selector);
        let parent = $(parent_selector);
        let new_max_height = parent.height() - (me.offset().top - parent.offset().top) - bottom_margin;
        $(selector).css('max-height', new_max_height)
    }
}

function resize_dom_to_bottom(dom, bottom_margin) {
    if (dom.length > 0) {
        const h = window.innerHeight - bottom_margin - dom.offset().top;
        dom.outerHeight(h);
    }
}


function confirmDialog(modal_title, modal_text, cancel_text, submit_text, submit_function) {
    const res = Mustache.to_html(confirm_template, {
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

function showSelectModal(modal_title, field_title, submit_function, options) {
    const res = Mustache.to_html(select_modal_template, {
        "modal_title": modal_title,
        "field_title": field_title,
        "options": options
    });
    $("#modal-area").html(res);
    $('#modal-dialog').on('shown.bs.modal', function () {
        $('#modal-text-input-field').focus();
    });
    $("#modal-dialog").modal();
    $("#modal-submit-button").on("click", submit_handler);

    function submit_handler() {
        const result = $("#modal-select-input-field").val();
        $("#modal-dialog").modal("hide");
        submit_function(result)
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