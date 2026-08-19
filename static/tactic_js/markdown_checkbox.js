import markdownItCheckbox from "markdown-it-checkbox";

const checkboxSelector = "input.tactic-markdown-checkbox[type=checkbox]";

export function enableMarkdownCheckboxes(md, {interactive = false} = {}) {
    md.use(markdownItCheckbox);
    md.renderer.rules.checkbox_input = (tokens, index, options, env, renderer) => {
        const token = tokens[index];
        token.attrJoin("class", "tactic-markdown-checkbox");
        if (!interactive || (env && env.markdownCheckboxesDisabled)) {
            token.attrSet("disabled", "");
        }
        return renderer.renderToken(tokens, index, options);
    };
}

export function updateMarkdownCheckbox(markdown, checkboxIndex, checked) {
    let currentIndex = -1;
    return markdown.replace(/\[(?:x|X|\s|_|-)](?=\s)/g, (marker) => {
        currentIndex += 1;
        if (currentIndex !== checkboxIndex) {
            return marker;
        }
        return checked ? "[x]" : "[ ]";
    });
}

export function handleMarkdownCheckboxClick(event, markdown, handleChange, readOnly = false) {
    const target = event.target;
    let checkbox = target.matches(checkboxSelector) ? target : null;
    const clickedLabel = target.tagName === "LABEL";

    if (!checkbox && clickedLabel) {
        const labelCheckbox = target.previousElementSibling;
        checkbox = labelCheckbox && labelCheckbox.matches(checkboxSelector) ? labelCheckbox : null;
    }
    if (!checkbox) {
        return false;
    }

    event.stopPropagation();
    if (readOnly || typeof handleChange !== "function") {
        event.preventDefault();
        return true;
    }

    const checkboxes = Array.from(event.currentTarget.querySelectorAll(checkboxSelector));
    const checkboxIndex = checkboxes.indexOf(checkbox);
    const checked = clickedLabel ? !checkbox.checked : checkbox.checked;
    const updatedMarkdown = updateMarkdownCheckbox(markdown, checkboxIndex, checked);

    if (clickedLabel || checkboxIndex < 0 || updatedMarkdown === markdown) {
        event.preventDefault();
    }
    if (checkboxIndex >= 0 && updatedMarkdown !== markdown) {
        handleChange(updatedMarkdown);
    }
    return true;
}
