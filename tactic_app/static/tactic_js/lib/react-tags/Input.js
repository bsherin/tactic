var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

// just a comment
export { Input };

const SIZER_STYLES = {
  position: 'absolute',
  width: 0,
  height: 0,
  visibility: 'hidden',
  overflow: 'scroll',
  whiteSpace: 'pre'
};

const STYLE_PROPS = ['fontSize', 'fontFamily', 'fontWeight', 'fontStyle', 'letterSpacing'];

class Input extends React.Component {
  constructor(props) {
    super(props);
    this.state = { inputWidth: null };
  }

  componentDidMount() {
    if (this.props.autoresize) {
      this.copyInputStyles();
      this.updateInputWidth();
    }

    if (this.props.autofocus) {
      this.input.focus();
    }
  }

  componentDidUpdate() {
    this.updateInputWidth();
  }

  copyInputStyles() {
    const inputStyle = window.getComputedStyle(this.input);

    STYLE_PROPS.forEach(prop => {
      this.sizer.style[prop] = inputStyle[prop];
    });
  }

  updateInputWidth() {
    let inputWidth;

    if (this.props.autoresize) {
      // scrollWidth is designed to be fast not accurate.
      // +2 is completely arbitrary but does the job.
      inputWidth = Math.ceil(this.sizer.scrollWidth) + 2;
    }

    if (inputWidth !== this.state.inputWidth) {
      this.setState({ inputWidth });
    }
  }

  render() {
    const { inputAttributes, inputEventHandlers, query, placeholder, expandable, listboxId, selectedIndex } = this.props;

    return React.createElement(
      'div',
      { className: this.props.classNames.searchInput },
      React.createElement('input', _extends({}, inputAttributes, inputEventHandlers, {
        ref: c => {
          this.input = c;
        },
        value: query,
        placeholder: placeholder,
        role: 'combobox',
        'aria-autocomplete': 'list',
        'aria-label': placeholder,
        'aria-owns': listboxId,
        'aria-activedescendant': selectedIndex > -1 ? `${listboxId}-${selectedIndex}` : null,
        'aria-expanded': expandable,
        style: { width: this.state.inputWidth } })),
      React.createElement(
        'div',
        { ref: c => {
            this.sizer = c;
          }, style: SIZER_STYLES },
        query || placeholder
      )
    );
  }
}