
export {MenuItem, ContextMenu}


class MenuItem extends React.Component {

  render() {
      let item = this.props.item;
      return (
          <span
              className="contextMenu"
              onClick={item.onClick}
              key={item.label}
              style={{
                "cursor": "pointer",
                "fontSize": "14px",
                "display": "flex",
                "alignItems": "center",
                "justifyContent": "flex-start",
                "marginBottom": "7px"
              }}
          >
            {item.icon_name && <span className={"mr-2 far button-icon fa-" + item.icon_name}/>}
            {item.label}
        </span>
      );
    }
}
// test

MenuItem.propTypes = {
  item: PropTypes.object
};

class ContextMenu extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      target: '',
    };
  }


  render() {
    let items = this.props.items.map(item => (
          <MenuItem item={item} key={item.label}/>
        ));
    let mstyle = {"position":"absolute","display":"flex","flexFlow":"column","border":"1px solid rgba(0,0,0,0.15)","borderRadius":"2px","boxShadow":"0 1px 1px 1px rgba(0,0,0,0.05)","padding":"10px 15px","background":"#f8f8f8"};
    mstyle.top = this.props.top;
    mstyle.left = this.props.left;
    return (
      <div id="contextMenu" style={mstyle}>
        {items}
      </div>
    );
  }
}

ContextMenu.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    icon: PropTypes.string,
  })),
  closeOnClick: PropTypes.bool,
  top: PropTypes.number,
  left: PropTypes.number
};

ContextMenu.defaultProps = {
  items: [],
  closeOnClick: true,
  click_x: 500,
  click_y: 500
};
