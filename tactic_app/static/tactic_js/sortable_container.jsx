
export {SortableComponent}

class SortableComponent extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this);
        this.state = {mounted: false};
        this.container_ref = this.props.container_ref == null ? React.createRef() : this.props.container_ref
    }

    get sorter_exists() {
        return $(this.container_ref.current).hasClass("ui-sortable")
    }

    componentDidMount() {
        this.setState({mounted: true});
        this.createSorter()
    }

     componentDidUpdate() {
        if (!this.sorter_exists && this.container_ref.current) {
            this.createSorter()
        }
    }

    createSorter() {
        let self = this;
        $(this.container_ref.current).sortable({
            handle: this.props.handle,
            tolerance: 'pointer',
            revert: 'invalid',
            forceHelperSize: true,
            stop: function() {
                const new_sort_list = $(self.container_ref.current).sortable("toArray");
                self.props.resortFunction(new_sort_list);
            }
        });
    }

    render () {
        let WrappedComponent = this.props.ElementComponent;
        return (
            <div id={this.props.id} style={this.props.style} ref={this.container_ref}>
                {this.props.item_list.length > 0 &&
                    this.props.item_list.map((entry, index) => (
                        <WrappedComponent key={entry[this.props.key_field_name]}
                                          {...this.props}
                                          {...entry}/>

                    ))
                }
            </div>
        )
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