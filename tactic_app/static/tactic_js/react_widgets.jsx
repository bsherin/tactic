
export {SelectList}

class SelectList extends React.Component {

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(event) {
        this.props.handleChange(event.target.value)
    }
    render() {
        let sstyle = {"marginBottom": 5, "width": "auto"};
        let option_items = this.props.option_list.map((opt, index) =>
                <option key={index}>
                    {opt}
                </option>
        );
        return (
            <select style={sstyle}
                    className="form-control"
                    onChange={this.handleChange}
                    value={this.props.value}
            >
                {option_items}
            </select>
        )
    }
}

SelectList.propTypes = {
    option_list: PropTypes.array,
    handlChange: PropTypes.func,
    value: PropTypes.string
};