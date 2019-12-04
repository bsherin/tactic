/**
 * Created by bls910 much later
 */

function doBinding(obj, seq = "_") {
    const proto = Object.getPrototypeOf(obj);
    for (const key of Object.getOwnPropertyNames(proto)) {
        if (key.startsWith(seq)) {
            obj[key] = obj[key].bind(obj);
        }
    }
}

function propsAreEqual(p1, p2, skipProps = []) {

    if (!_.isEqual(Object.keys(p1), Object.keys(p2))) {
        return false;
    }

    for (let option in p1) {
        if (skipProps.includes(option)) continue;
        if (typeof p1[option] == "function") {
            if (!(typeof p2[option] == "function")) {
                return false;
            }
            continue;
        }
        if (!_.isEqual(p1[option], p2[option])) {
            return false;
        }
    }
    return true;
}

function arrayMoveMutate(array, from, to) {
    array.splice(to < 0 ? array.length + to : to, 0, array.splice(from, 1)[0]);
};

function arrayMove(array, from, to) {
    array = array.slice();
    arrayMoveMutate(array, from, to);
    return array;
};

function updateObject(o1, o2) {
    for (let prop in o2) {
        if (o2.hasOwnProperty(prop)) {
            o1[prop] = o2[prop];
        }
    }
}

function arraysMatch(arr1, arr2) {
    // Check if the arrays are the same length
    if (arr1.length !== arr2.length) return false;

    // Check if all items exist and are in the same order
    for (var i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) return false;
    }

    // Otherwise, return true
    return true;
}

function doNothing() {}

function set_datum(e, type, dat) {
    e.dataTransfer.setData(type, dat);
}

function get_datum(e, type) {
    return e.dataTransfer.getData(type);
}

String.prototype.format = function () {
    let str = this;
    for (let i = 0; i < arguments.length; i++) {
        const reg = new RegExp("\\{" + i + "\\}", "gm");
        str = str.replace(reg, arguments[i]);
    }
    return str;
};

function get_ppi() {
    var d = $("<div/>").css({ position: 'absolute', top: '-1000in', left: '-1000in', height: '1000in', width: '1000in' }).appendTo('body');
    var px_per_in = d.height() / 1000;
    d.remove();
    return px_per_in;
}

function remove_duplicates(arrArg) {
    return arrArg.filter((elem, pos, arr) => {
        return arr.indexOf(elem) == pos;
    });
}

function objectKeys(obj) {
    const result = [];
    for (let key in obj) {
        if (!obj.hasOwnProperty(key)) continue;
        result.push(key);
    }
    return result;
}

Array.prototype.empty = function () {
    return this.length == 0;
};

function doSignOut(page_id) {
    window.open($SCRIPT_ROOT + "/logout/" + window.page_id, "_self");
    return false;
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
        element.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
    } else if (elemBottom > containerBottom) {
        element.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
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
    $('.tooltip-top[data-toggle="tooltip"]').tooltip(options = opts_top);
    $('.tooltip-bottom[data-toggle="tooltip"]').tooltip(options = opts_bottom);
}

function toggleTooltips() {
    $('[data-toggle="tooltip"]').tooltip('toggle');
    return false;
}

function resize_dom_to_bottom_given_selector(selector, bottom_margin) {
    if ($(selector).length > 0) {
        $(selector).css('height', window.innerHeight - $(selector).offset().top - bottom_margin);
    }
}

function fit_dom_in_parent(selector, parent_selector, bottom_margin) {
    if ($(selector).length > 0) {
        let me = $(selector);
        let parent = $(parent_selector);
        let new_max_height = parent.height() - (me.offset().top - parent.offset().top) - bottom_margin;
        $(selector).css('max-height', new_max_height);
    }
}

function resize_dom_to_bottom(dom, bottom_margin) {
    if (dom.length > 0) {
        const h = window.innerHeight - bottom_margin - dom.offset().top;
        dom.outerHeight(h);
    }
}

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}