var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

export { SortableComponent };

class SortableComponent extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this);
        this.state = { mounted: false };
        this.container_ref = this.props.container_ref == null ? React.createRef() : this.props.container_ref;
    }

    get sorter_exists() {
        return $(this.container_ref.current).hasClass("ui-sortable");
    }

    componentDidMount() {
        this.setState({ mounted: true });
        this.createSorter();
    }

    componentDidUpdate() {
        if (!this.sorter_exists && this.container_ref.current) {
            this.createSorter();
        }
    }

    createSorter() {
        let self = this;
        $(this.container_ref.current).sortable({
            handle: this.props.handle,
            tolerance: 'pointer',
            revert: 'invalid',
            forceHelperSize: true,
            stop: function () {
                const new_sort_list = $(self.container_ref.current).sortable("toArray");
                self.props.resortFunction(new_sort_list);
            }
        });
    }

    render() {
        let WrappedComponent = this.props.ElementComponent;
        return React.createElement(
            'div',
            { id: this.props.id, style: this.props.style, ref: this.container_ref },
            this.props.item_list.length > 0 && this.props.item_list.map((entry, index) => React.createElement(WrappedComponent, _extends({ key: entry[this.props.key_field_name]
            }, this.props, entry)))
        );
    }
}

SortableComponent.propTypes = {
    id: PropTypes.string,
    handle: PropTypes.string,
    key_field_name: PropTypes.string,
    ElementComponent: PropTypes.func,
    item_list: PropTypes.array,
    style: PropTypes.object,
    container_ref: PropTypes.object,
    resortFunction: PropTypes.func
};

SortableComponent.defaultProps = {
    container_ref: null
};