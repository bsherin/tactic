
class MarkdownHelper {
    constructor(notes_selector, markdown_output_selector) {
        this.notes_selector = notes_selector;
        this.markdown_output_selector = markdown_output_selector
    }

    hideMarkdown(el) {
        this.getNotesField(el).show();
        this.getMarkdownField(el).hide();
    }

    showMarkdown(el, dont_show_if_empty=true) {
        if (dont_show_if_empty && (this.getNotesValue(el) == "")) {
            this.hideMarkdown(el)
        }
        else {
            this.getNotesField(el).hide();
            this.getMarkdownField(el).show();
        }
    }

    updateMarkdownHeight(el, outer_selector) {
        let me = this.getMarkdownField(el);
        let outer = $(outer_selector);
        let new_max_height = outer.height() - (me.offset().top - outer.offset().top);
        me.css('max-height', new_max_height)
    }

    toggleMarkdown(el) {
        if (this.getNotesField(el).is(":visible")) {
            this.convertMarkdown(el)
        }
        else {
           this.hideMarkdown(el)
        }
    }

    getNotesField(el) {
        return el.find(this.notes_selector)
    }

    getMarkdownField(el) {
        return el.find(this.markdown_output_selector)
    }

    getNotesValue(el) {
        if (this.getNotesField(el).prop("tagName") == "TEXTAREA") {
            return this.getNotesField(el).val()
        }
        else {
            return this.getNotesField(el).html()
        }

    }
    setNotesValue(el, the_text) {
        this.clearNotes(el);
        if (this.getNotesField(el).prop("tagName") == "TEXTAREA") {
            this.getNotesField(el).val(the_text)
        }
        else {
            this.getNotesField(el).html(the_text)
        }
    }

    focusNotes(el) {
        this.getNotesField(el).focus()
    }

    clearNotes(el) {
        this.getNotesField(el).html("")
    }


    setMarkdown(el, converted_markdown) {
        this.getMarkdownField(el).html(converted_markdown)
    }

    convertMarkdown(el, dont_convert_if_empty=true, outer_selector=null) {
        let the_text = this.getNotesValue(el);
        if (dont_convert_if_empty && (the_text == "")) {
            this.setMarkdown(el, "");
            this.hideMarkdown(el)
        }
        else {
            let ddict = {"the_text": the_text};
            let self = this;
            postAjaxPromise("convert_markdown", ddict)
                .then(function(data) {
                    self.setMarkdown(el, "");
                    self.setMarkdown(el, data["converted_markdown"]);
                    self.showMarkdown(el);
                    if (outer_selector != null) {
                        self.updateMarkdownHeight(el, outer_selector)
                    }
                })
            .catch(doFlash)
        }
    }
}