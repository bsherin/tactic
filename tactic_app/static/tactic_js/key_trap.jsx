
export {KeyTrap}

class KeyTrap extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this);
        this.mousetrap = null;
    }

    componentDidMount() {
        this.initializeMousetrap()
    }

    initializeMousetrap() {
        if (!this.props.target_ref) {
            this.mousetrap = null
        }
        else if (!this.props.target_ref) {
            this.mousetrap = null;
        }
        else {
            this.mousetrap = new Mousetrap(this.props.target_ref);
            for (let binding of this.props.bindings) {
                this.mousetrap.bind(binding[0], binding[1])
            }
        }
    }

    componentDidUpdate() {
        if (!this.props.target_ref) {
            this.mousetrap = null
        }
        else if (!this.mousetrap && this.props.target_ref) {
            this.initializeMousetrap()
        }
        else if (!this.props.target_ref) {
            this.mousetrap = null;
        }
    }

    render() {
        return (
            <div/>
        )
    }
}

KeyTrap.propTypes = {
    target_ref: PropTypes.object,
    bindings: PropTypes.array
};
