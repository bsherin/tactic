
class DragManager {
    constructor (manager, selector_base, selector_extension, accept_types, hover_style, is_draggable) {
        this.manager = manager;
        this.selector_base = selector_base;
        this.selector_extension = selector_extension;
        this.accept_types = accept_types;
        this.hover_style = hover_style;
        let self = this;

        if (is_draggable) {
            selector_base.find(selector_extension).attr("draggable", "true");
            selector_base.on("dragstart", selector_extension, event => self.class_drag_start(event));
            var config = { childList: true, subtree: true, characterData: false};
            this.observer = new MutationObserver((mutationsList, observer) => self.mutation_callback(mutationsList, observer));
            this.observer.observe(selector_base[0], config);
        }
        if (accept_types.length) {
            selector_base.on("dragover", selector_extension, event => self.class_drag_over(event));
            selector_base.on("dragleave", selector_extension, event => self.class_drag_leave(event));
            selector_base.on("drop", selector_extension, event => self.class_drag_leave(event));
            selector_base.on("drop", selector_extension, event => self.class_drop(event));
        }
    }

    handle_drag_start(event) {}
    handle_drop(event) {}

    handle_drag_over(event) {
        $(event.target).addClass(this.hover_style);
    }

    handle_drag_leave(event) {
        $(event.target).removeClass(this.hover_style)
    }

    mutation_callback(mutationsList, observer) {
        for (var mutation of mutationsList) {
            if (mutation.addedNodes) {
                for (var addedNode of mutation.addedNodes) {
                    if ((addedNode.nodeType == 1) && (addedNode.matches(this.selector_extension))) {
                        this.selector_base.find(this.selector_extension).attr("draggable", "true");
                        return
                    }
                }
            }
        }
    }

    check_types(event) {
        let transfer_types = event.originalEvent.dataTransfer.types;
        let found = false;
        for (let type of this.accept_types) {
            if (transfer_types.includes(type)) {
                return true
            }
        }
        return false
    }

    get_datum(event, type) {
        return event.originalEvent.dataTransfer.getData(type);
    }

    set_datum(event, type, dat) {
        event.originalEvent.dataTransfer.setData(type, dat);
    }

    class_drag_over(event) {
        if (this.check_types(event)) {
            event.originalEvent.preventDefault();
            event.originalEvent.dataTransfer.dropEffect = this.effect;
            this.handle_drag_over(event)
        }
    }

    class_drag_leave(event) {
        if (this.check_types(event)) {
            event.originalEvent.preventDefault();
            event.originalEvent.dataTransfer.dropEffect = this.effect;
            this.handle_drag_leave(event)
        }
    }

    class_drag_start(event) {
        this.handle_drag_start(event)
    }


    class_drop(event) {
        event.originalEvent.preventDefault();
        this.handle_drop(event)
    }

}