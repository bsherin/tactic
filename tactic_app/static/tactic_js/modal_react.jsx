
export {showModalReact, showConfirmDialogReact}

var Rbs = window.ReactBootstrap;

class ModalDialog extends React.Component {

    constructor(props) {
        super(props);
        doBinding(this);
        let default_name = this.props.default_value;
        var name_counter = 1;
        while (this.name_exists(default_name)) {
            name_counter += 1;
            default_name = this.props.default_value + String(name_counter)
        }
        this.state = {
            show: false,
            current_value: default_name,
            checkbox_states: {},
            warning_text: ""
        };
    }

    _changeHandler(event) {
        this.setState({"current_value": event.target.value})
    }

    _checkbox_change_handler(event) {
        let val = event.target.checked;
        let new_checkbox_states = Object.assign({}, this.state.checkbox_states);
        new_checkbox_states[event.target.id] = event.target.checked;
        this.setState({checkbox_states: new_checkbox_states})
    }

    componentDidMount() {
        this.setState({"show": true});
        if ((this.props.checkboxes != null) && (this.props.checkboxes.length != 0)) {
            let checkbox_states = {};
            for (let checkbox of this.props.checkboxes) {
                checkbox_states[checkbox.id] = false
            }
            this.setState({checkbox_states: checkbox_states})
        }
    }

    name_exists(name) {
        return (this.props.existing_names.indexOf(name) > -1)
    }

    _submitHandler(event) {
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
            this.props.handleSubmit(this.state.current_value, this.state.checkbox_states);
            this.props.handleClose();
            }
    }

    _cancelHandler() {
        this.setState({"show": false});
        this.props.handleClose()
    }

    render() {
        let checkbox_items = [];
        if ((this.props.checkboxes != null) && (this.props.checkboxes.length != 0)) {
            for (let checkbox of this.props.checkboxes) {
                let new_item = (
                    <Rbs.Form.Check type="checkbox"
                                    label={checkbox.checktext}
                                    id={checkbox.checkname}
                                    key={checkbox.checkname}
                                    onChange={this._checkbox_change_handler}
                    />
                );
                checkbox_items.push(new_item)
            }
        }
        return (
            <Rbs.Modal show={this.state.show}>
                <Rbs.Modal.Header closeButton>
                  <Rbs.Modal.Title>{this.props.title}</Rbs.Modal.Title>
                </Rbs.Modal.Header>
                <Rbs.Modal.Body>
                    <Rbs.Form.Group onSubmit={this._submitHandler}>
                        <Rbs.Form.Label>{this.props.field_title}</Rbs.Form.Label>
                        <Rbs.Form>
                            <Rbs.Form.Control type="text" onChange={this._changeHandler} value={this.state.current_value}>
                            </Rbs.Form.Control>
                        </Rbs.Form>
                    </Rbs.Form.Group>
                    {(checkbox_items.length != 0) && checkbox_items}
                </Rbs.Modal.Body>
                <Rbs.Modal.Footer>
                    <Rbs.Form.Text className="text-muted">
                        {this.state.warning_text}
                    </Rbs.Form.Text>
                    <Rbs.Button variant="secondary" onClick={this._cancelHandler}>Cancel</Rbs.Button>
                    <Rbs.Button variant="primary" onClick={this._submitHandler}>Submit</Rbs.Button>
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
    existing_names: PropTypes.array,
    checkboxes: PropTypes.array
};

ModalDialog.defaultProps = {
    existing_names: [],
    default_value: "",
    checkboxes: null
};

function showModalReact(modal_title, field_title, submit_function, default_value, existing_names, checkboxes=null) {


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
                                 checkboxes={checkboxes}
                                 existing_names={existing_names}/>, domContainer);
}

class ConfirmDialog extends React.Component {

    constructor(props) {
        super(props);
        doBinding(this);
        this.state = {
            show: false,
        };
    }


    componentDidMount() {
        this.setState({"show": true})
    }

    _submitHandler(event) {
        this.setState({"show": false});
        this.props.handleSubmit();
        this.props.handleClose();
    }

    _cancelHandler() {
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
                    <p>{this.props.text_body}</p>
                </Rbs.Modal.Body>
                <Rbs.Modal.Footer>
                    <Rbs.Button variant="secondary" onClick={this._cancelHandler}>Cancel</Rbs.Button>
                    <Rbs.Button variant="primary" onClick={this._submitHandler}>Submit</Rbs.Button>
                </Rbs.Modal.Footer>
            </Rbs.Modal>
        )
    }
}

confirmDialog.propTypes = {
    handleSubmit: PropTypes.func,
    handleClose: PropTypes.func,
    title: PropTypes.string,
    text_body: PropTypes.string,
    submit_text: PropTypes.string,
    cancel_text: PropTypes.string,
};

function showConfirmDialogReact(title, text_body, cancel_text, submit_text, submit_function) {

    let domContainer = document.querySelector('#modal-area');

    function handle_close () {
        ReactDOM.unmountComponentAtNode(domContainer)

    }
    ReactDOM.render(<ConfirmDialog handleSubmit={submit_function}
                                 handleClose={handle_close}
                                 title={title}
                                 text_body={text_body}
                                 submit_text={submit_text}
                                 cancel_text={cancel_text}/>, domContainer);
}