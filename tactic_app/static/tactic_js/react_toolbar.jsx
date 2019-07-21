

// The button4
class ToolbarButton extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        return (
            <button type="button" value={this.props.name} onClick={this.props.click_handler}
                    className={"btn btn-sm action-button toolbar-button " + this.props.button_class}>
                <span className={"far button-icon fa-" + this.props.icon_name}/>
                <span className="button-text">{this.props.name_text}</span>
            </button>
     )
  }
}


class Toolbar extends React.Component {

    render() {
        const items = [];
        var group_counter = 0;
        for (let group of this.props.button_groups) {
            // let group_items = [];
            let group_items = group.map((button) =>
                <ToolbarButton name={button.name}
                   icon_name={button.icon_name}
                   click_handler={button.click_handler}
                   button_class={button.button_class}
                   name_text={button.name_text}
                   key={button.name}
                />
            );
            items.push(
                <div className="btn-group" role="group" key={group_counter}>
                    {group_items}
                </div>
            );
            group_counter += 1
        }
        return (
            <span>{items}</span>
        )
    }
}