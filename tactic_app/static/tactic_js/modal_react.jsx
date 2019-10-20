
export {showModalReact, showConfirmDialogReact, showSelectDialog, showInformDialogReact}

var Bp = blueprint;

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
        if (this.props.handleCancel) {
            this.props.handleCancel()
        }
        this.props.handleClose()
    }

    _refHandler(the_ref) {
        this.input_ref = the_ref;
    }

    render() {
        let checkbox_items = [];
        if ((this.props.checkboxes != null) && (this.props.checkboxes.length != 0)) {
            for (let checkbox of this.props.checkboxes) {
                let new_item = (
                    <Bp.Checkbox checked={this.state.checkbox_states[checkbox.checkname]}
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
            <Bp.Dialog isOpen={this.state.show}
                       title={this.props.title}
                       onClose={this._cancelHandler}
                       onOpened={()=>{$(this.input_ref).focus()}}
                       canEscapeKeyClose={true}>
                <form onSubmit={this._submitHandler}>
                    <div className={Bp.Classes.DIALOG_BODY}>
                        <Bp.FormGroup label={this.props.field_title} helperText={this.state.warning_text}>
                                <Bp.InputGroup inputRef={this._refHandler}
                                               onChange={this._changeHandler}
                                               value={this.state.current_value}/>
                        </Bp.FormGroup>
                        {(checkbox_items.length != 0) && checkbox_items}
                    </div>
                    <div className={Bp.Classes.DIALOG_FOOTER}>
                        <div className={Bp.Classes.DIALOG_FOOTER_ACTIONS}>
                            <Bp.Button onClick={this._cancelHandler}>Cancel</Bp.Button>
                            <Bp.Button intent={Bp.Intent.PRIMARY} onClick={this._submitHandler}>Submit</Bp.Button>
                        </div>
                    </div>
                </form>
            </Bp.Dialog>
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

function showModalReact(modal_title, field_title, submit_function, default_value, existing_names, checkboxes=null, cancel_function=null) {

    if (typeof existing_names == "undefined") {
        existing_names = []
    }

    let domContainer = document.querySelector('#modal-area');

    function handle_close () {
        ReactDOM.unmountComponentAtNode(domContainer)
    }
    ReactDOM.render(<ModalDialog handleSubmit={submit_function}
                                 handleCancel={cancel_function}
                                 handleClose={handle_close}
                                 title={modal_title}
                                 field_title={field_title}
                                 default_value={default_value}
                                 checkboxes={checkboxes}
                                 existing_names={existing_names}/>, domContainer);
}

class SelectDialog extends React.Component {

    constructor(props) {
        super(props);
        doBinding(this);
        this.state = {
            show: false,
            value: null
        };
    }

    componentDidMount() {
        this.setState({"show": true, "value": this.props.option_list[0]})
    }

    _handleChange(event) {
        this.setState({"value": event.target.value})
    }

    _submitHandler(event) {
        this.setState({"show": false});
        this.props.handleSubmit(this.state.value);
        this.props.handleClose();
    }

    _cancelHandler() {
        this.setState({"show": false});
        this.props.handleClose()
    }

    render() {
        return (
            <Bp.Dialog isOpen={this.state.show}
                       title={this.props.title}
                       onClose={this._cancelHandler}
                       canEscapeKeyClose={true}>
                <div className={Bp.Classes.DIALOG_BODY}>
                   <Bp.FormGroup title={this.props.select_label}>
                       <Bp.HTMLSelect options={this.props.option_list} onChange={this._handleChange} value={this.state.value}/>
                   </Bp.FormGroup>
                </div>
                <div className={Bp.Classes.DIALOG_FOOTER}>
                    <div className={Bp.Classes.DIALOG_FOOTER_ACTIONS}>
                        <Bp.Button onClick={this._cancelHandler}>Cancel</Bp.Button>
                        <Bp.Button intent={Bp.Intent.PRIMARY} onClick={this._submitHandler}>Submit</Bp.Button>
                    </div>
                </div>
            </Bp.Dialog>
        )
    }
}

SelectDialog.propTypes = {
    handleSubmit: PropTypes.func,
    handleClose: PropTypes.func,
    handleCancel: PropTypes.func,
    title: PropTypes.string,
    select_label: PropTypes.string,
    option_list: PropTypes.array,
    submit_text: PropTypes.string,
    cancel_text: PropTypes.string,
};

function showSelectDialog(title, select_label, cancel_text, submit_text, submit_function, option_list) {

    let domContainer = document.querySelector('#modal-area');

    function handle_close () {
        ReactDOM.unmountComponentAtNode(domContainer)
    }
    ReactDOM.render(<SelectDialog handleSubmit={submit_function}
                                   handleClose={handle_close}
                                   title={title}
                                   select_label={select_label}
                                   submit_text={submit_text}
                                   option_list={option_list}
                                   cancel_text={cancel_text}/>, domContainer);
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
            <Bp.Dialog isOpen={this.state.show}
                       title={this.props.title}
                       onClose={this._cancelHandler}
                       canEscapeKeyClose={true}>
                <div className={Bp.Classes.DIALOG_BODY}>
                    <p>{this.props.text_body}</p>
                </div>
                <div className={Bp.Classes.DIALOG_FOOTER}>
                    <div className={Bp.Classes.DIALOG_FOOTER_ACTIONS}>
                        <Bp.Button onClick={this._cancelHandler}>Cancel</Bp.Button>
                        <Bp.Button intent={Bp.Intent.PRIMARY} onClick={this._submitHandler}>Submit</Bp.Button>
                    </div>
                </div>
            </Bp.Dialog>
        )
    }
}

ConfirmDialog.propTypes = {
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

class InformDialog extends React.Component {

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

    _closeHandler() {
        this.setState({"show": false});
        this.props.handleClose()
    }

    render() {
        return (
            <Bp.Dialog isOpen={this.state.show}
                       title={this.props.title}
                       onClose={this._closeHandler}
                       canEscapeKeyClose={true}>
                <div className={Bp.Classes.DIALOG_BODY}>
                    <p>{this.props.text_body}</p>
                </div>
                <div className={Bp.Classes.DIALOG_FOOTER}>
                    <div className={Bp.Classes.DIALOG_FOOTER_ACTIONS}>
                        <Bp.Button onClick={this._closeHandler}>Okay</Bp.Button>
                    </div>
                </div>
            </Bp.Dialog>
        )
    }
}

InformDialog.propTypes = {
    handleClose: PropTypes.func,
    title: PropTypes.string,
    text_body: PropTypes.string,
    close_text: PropTypes.string,
};

function showInformDialogReact(title, text_body, close_text="Okay") {

    let domContainer = document.querySelector('#modal-area');

    function handle_close () {
        ReactDOM.unmountComponentAtNode(domContainer)

    }
    ReactDOM.render(<ConfirmDialog
                                 handleClose={handle_close}
                                 title={title}
                                 text_body={text_body}
                                 close_text={close_text}/>, domContainer);
}