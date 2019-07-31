
export {showModalReact}

var Rbs = window.ReactBootstrap;

class ModalDialog extends React.Component {

    constructor(props) {
        super(props);
        let default_name = this.props.default_value;
        var name_counter = 1;
        while (this.name_exists(default_name)) {
            name_counter += 1;
            default_name = this.props.default_value + String(name_counter)
        }
        this.state = {
            show: false,
            current_value: default_name,
            warning_text: ""
        };
        this.changeHandler = this.changeHandler.bind(this);
        this.submitHandler = this.submitHandler.bind(this);
        this.cancelHandler = this.cancelHandler.bind(this);
        this.name_exists = this.name_exists.bind(this);
    }

    changeHandler(event) {
        this.setState({"current_value": event.target.value})
    }

    componentDidMount() {
        this.setState({"show": true})
    }

    name_exists(name) {
        return (this.props.existing_names.indexOf(name) > -1)
    }

    submitHandler(event) {
        let msg;
        if (this.state.current_value == "") {
            msg = "An empty name is not allowed here.";
            this.setState({"warning_text": msg})
        }
        else if (this.name_exists(this.state.current_value)) {
            msg = "That name already exists";
            this.setState({"warning_text": msg})
        }
        else {
            this.setState({"show": false});
            this.props.handleSubmit(this.state.current_value);
            this.props.handleClose();
            }
    }

    cancelHandler() {
        this.setState({"show": false});
        this.props.handleClose()
    }

    render() {
        return (
            <Rbs.Modal show={this.state.show}>
                <Rbs.Modal.Header closeButton>
                  <Rbs.Modal.Title>{this.props.title}</Rbs.Modal.Title>
                </Rbs.Modal.Header>
                <Rbs.Modal.Body>
                    <Rbs.Form.Group>
                        <Rbs.Form.Label>{this.props.field_title}</Rbs.Form.Label>
                        <Rbs.Form>
                            <Rbs.Form.Control type="text" onChange={this.changeHandler} value={this.state.current_value}>
                            </Rbs.Form.Control>
                        </Rbs.Form>
                    </Rbs.Form.Group>
                </Rbs.Modal.Body>
                <Rbs.Modal.Footer>
                    <Rbs.Form.Text className="text-muted">
                        {this.state.warning_text}
                    </Rbs.Form.Text>
                    <Rbs.Button varian="secondary" onClick={this.cancelHandler}>Cancel</Rbs.Button>
                    <Rbs.Button varian="primary" onClick={this.submitHandler}>Submit</Rbs.Button>
                </Rbs.Modal.Footer>
            </Rbs.Modal>
        )
    }
}

ModalDialog.propTypes = {
    handleSubmit: PropTypes.func,
    handleClose: PropTypes.func,
    title: PropTypes.string,
    field_title: PropTypes.string,
    default_value: PropTypes.string,
    existing_names: PropTypes.array
};

ModalDialog.defaultProps = {
    existing_names: [],
    default_value: ""
};

function showModalReact(modal_title, field_title, submit_function, default_value, existing_names, checkboxes) {


    if (typeof existing_names == "undefined") {
        existing_names = []
    }

    let domContainer = document.querySelector('#modal-area');

    function handle_close () {
        ReactDOM.unmountComponentAtNode(domContainer)

    }
    ReactDOM.render(<ModalDialog handleSubmit={submit_function}
                                 handleClose={handle_close}
                                 title={modal_title}
                                 field_title={field_title}
                                 default_value={default_value}
                                 existing_names={existing_names}/>, domContainer);

    // $('.submitter-field').keypress(function(e) {
    //     if (e.which == 13) {
    //         submit_handler();
    //         e.preventDefault();
    //     }
    // });

}