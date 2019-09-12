// comment
export { Suggestions };

function escapeForRegExp(query) {
  return query.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');
}

function markIt(input, query) {
  if (query) {
    const regex = RegExp(escapeForRegExp(query), 'gi');
    input = input.replace(regex, '<mark>$&</mark>');
  }

  return {
    __html: input
  };
}

function filterSuggestions(query, suggestions, length, suggestionsFilter) {
  if (!suggestionsFilter) {
    const regex = new RegExp(`(?:^|\\s)${escapeForRegExp(query)}`, 'i');
    suggestionsFilter = item => regex.test(item.name);
  }

  return suggestions.filter(item => suggestionsFilter(item, query)).slice(0, length);
}

class Suggestions extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      options: filterSuggestions(this.props.query, this.props.suggestions, this.props.maxSuggestionsLength, this.props.suggestionsFilter)
    };
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      options: filterSuggestions(newProps.query, newProps.suggestions, newProps.maxSuggestionsLength, newProps.suggestionsFilter)
    });
  }

  handleMouseDown(item, e) {
    // focus is shifted on mouse down but calling preventDefault prevents this
    e.preventDefault();
    this.props.addTag(item);
  }

  render() {
    if (!this.props.expandable || !this.state.options.length) {
      return null;
    }

    const options = this.state.options.map((item, i) => {
      const key = `${this.props.listboxId}-${i}`;
      const classNames = [];

      if (this.props.selectedIndex === i) {
        classNames.push(this.props.classNames.suggestionActive);
      }

      if (item.disabled) {
        classNames.push(this.props.classNames.suggestionDisabled);
      }

      return React.createElement(
        'li',
        {
          id: key,
          key: key,
          role: 'option',
          className: classNames.join(' '),
          'aria-disabled': item.disabled === true,
          onMouseDown: this.handleMouseDown.bind(this, item) },
        React.createElement('span', { dangerouslySetInnerHTML: markIt(item.name, this.props.query) })
      );
    });

    return React.createElement(
      'div',
      { className: this.props.classNames.suggestions },
      React.createElement(
        'ul',
        { role: 'listbox', id: this.props.listboxId },
        options
      )
    );
  }
}