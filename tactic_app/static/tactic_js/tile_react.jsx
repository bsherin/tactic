
var Rbs = window.ReactBootstrap;

import {TileForm} from "./tile_form_react.js";

export {TileComponent}

const using_touch = "ontouchend" in document;

var click_event;

if (using_touch) {
    click_event = "touchstart"
}
else {
    click_event = "click"
}

class GlyphButton extends React.Component {

    render () {
        return (
           <button type="button"
                       className={this.props.butclass}
                       onClick={this.props.handleClick}>
                <span className={this.props.icon_class}></span>
            </button>
        )
    }
}

GlyphButton.propTypes = {
    butclass: PropTypes.string,
    icon_class: PropTypes.string,
    handleClick: PropTypes.func
};

const TILE_DISPLAY_AREA_MARGIN = 15;

class TileComponent extends React.Component {
    constructor(props) {
        super(props);
        this.my_ref = React.createRef();
        this.body_ref = React.createRef();
        this.tda_ref = React.createRef();
        this.state = {
            shrunk: false,
            show_log: false,
            tile_height: 345,
            tile_width: 410,
            header_height: 34
        };
        doBinding(this);
    }

    broadcastTileSize() {
        postWithCallback(this.props.tile_id, "TileSizeChange",
            {width: this.state.tile_width - TILE_DISPLAY_AREA_MARGIN * 2,
             height: this.state.tile_height - this.state.header_height - TILE_DISPLAY_AREA_MARGIN * 2})
    }

    _resizeTileArea(event, ui) {
        let hheight = $(this.body_ref.current).position().top;
        this.setState({
            tile_height: ui.size.height,
            tile_width: ui.size.width,
            header_height: hheight
        })
    }

    componentDidMount() {
        let self = this;
        this.broadcastTileSize();
        this.listen_for_clicks();
        $(this.my_ref.current).resizable({
            handles: "se",
            resize: self._resizeTileArea,
            stop: function () {
                self.broadcastTileSize();
            }
        });
    }

    shrink_or_expand() {
    }

    _toggleTileLog() {
        if (this.state.show_log) {
            this.setState({show_log: false});
            return
        }
        const self = this;
        postWithCallback("host", "get_container_log", {"container_id": this.props.tile_id}, function (res) {
            self.setState({
                log_content: res.log_text,
                show_log: true,
                show_form: false,
            })
        })
    }

    _toggleShrunk() {
        this.setState({
            shrunk: !this.state.shrunk
        })
    }

    _toggleBack() {
        this.props.toggleBack(this.props.tile_id)
    }

    _closeTile() {
        this.props.handleClose(this.props.tile_id)
    }

    compute_styles() {
        let the_margin = 15;
        let tile_height = this.state.shrunk ? this.state.header_height : this.state.tile_height;
        this.front_style = {
            "width": this.state.tile_width,
            "height": tile_height - this.state.header_height
        };
        this.tda_style = {
            "width": this.state.tile_width - TILE_DISPLAY_AREA_MARGIN * 2,
            "height": tile_height - this.state.header_height - TILE_DISPLAY_AREA_MARGIN * 2
        };
        this.back_style = this.front_style;
        this.tile_log_style = this.front_style;
        this.panel_body_style = {"width": this.state.tile_width};
        this.main_style = {width: this.state.tile_width,
            height: tile_height
        }
    }

    componentDidUpdate() {
        // this.listen_for_clicks();
    }

    _standard_click_data() {
        return{
            tile_id: this.props.tile_id,
            main_id: window.main_id,
            doc_name: this.props.current_doc_name,
            active_row_id: this.props.selected_row
        }
    }

    listen_for_clicks () {
         let self = this;
         $(this.my_ref.current).on(click_event, '.element-clickable', function(e) {
            let data_dict = self._standard_click_data();
            const dset = e.target.dataset;
            data_dict.dataset = {};
            for (let key in dset) {
                if (!dset.hasOwnProperty(key)) continue;
                data_dict.dataset[key] = dset[key]
            }
            postWithCallback(self.props.tile_id, "TileElementClick", data_dict);
             e.stopPropagation()
         });
         $(this.my_ref.current).on(click_event, '.word-clickable', function(e) {
             let data_dict = self._standard_click_data();
             const s = window.getSelection();
             const range = s.getRangeAt(0);
            const node = s.anchorNode;
            while ((range.toString().indexOf(' ') !== 0) && (range.startOffset !== 0)) {
              range.setStart(node, (range.startOffset - 1));
            }
            const nlen = node.textContent.length;
            if (range.startOffset !== 0) {
              range.setStart(node, range.startOffset + 1);
            }
            do {
              range.setEnd(node, range.endOffset + 1);

            } while (range.toString().indexOf(' ') == -1 &&
              range.toString().trim() !== '' &&
              range.endOffset < nlen);
            data_dict.clicked_text = range.toString().trim();
            postWithCallback(self.props.tile_id, "TileWordClick", data_dict)
        });
         $(this.my_ref.current).on(click_event, '.cell-clickable', function(e) {
             let data_dict = self._standard_click_data();
            data_dict.clicked_cell = $(this).text();
            postWithCallback(self.props.tile_id, "TileCellClick", data_dict)
        });
        $(this.my_ref.current).on(click_event, '.row-clickable', function(e) {
            let data_dict = self._standard_click_data();
            const cells = $(this).children();
            const row_vals = [];
            cells.each(function() {
                row_vals.push($(this).text())
            });
            data_dict["clicked_row"] = row_vals;
            postWithCallback(self.props.tile_id, "TileRowClick", data_dict)
        });
        $(this.my_ref.current).on(click_event, '.front button', function(e) {
            let data_dict = self._standard_click_data();
            data_dict["button_value"] = e.target.value;
            postWithCallback(self.props.tile_id, "TileButtonClick", data_dict)
        });
        $(this.my_ref.current).on('submit', '.front form', function(e) {
            let data_dict = self._standard_click_data();
            const form_data = {};
            let the_form = e.target;
            for (let i = 0; i < the_form.length; i += 1) {
                form_data[the_form[i]["name"]] = the_form[i]["value"]
            }
            data["form_data"] = form_data;
            postWithCallback(self.props.tile_id, "TileFormSubmit", data);
            return false
        });
        $(this.my_ref.current).on("change", '.front select', function (e) {
            let data_dict = self._standard_click_data();
            data.select_value = e.target.value;
            postWithCallback(self.props.tile_id, "SelectChange", data)
        });
        $(this.my_ref.current).on('change', '.front textarea', function(e) {
            let data_dict = self._standard_click_data();
            data["text_value"] = e.target.value;
            postWithCallback(self.props.tile_id, "TileTextAreaChange", data)
        });
    }

    render () {
        let show_front = (!this.props.show_form) && (!this.state.show_log);
        let front_dict = {__html: this.props.front_content};
        this.compute_styles();
        let tile_class = this.props.table_is_shrunk ? "tile-panel tile-panel-float" : "tile-panel";
        return (
            <Rbs.Card bg="light" ref={this.my_ref} style={this.main_style} className={tile_class} id={this.props.tile_id}>
                <Rbs.Card.Header className="tile-panel-heading" >
                    <div className="left-glyphs">
                        {this.state.shrunk &&
                            <GlyphButton butclass="notclose header-but triangle-right"
                                         icon_class="far fa-chevron-circle-right"
                                         handleClick={this._toggleShrunk} />}

                        {!this.state.shrunk &&
                            <GlyphButton butclass="notclose header-but triangle-bottom"
                                         icon_class="far fa-chevron-circle-down"
                                         handleClick={this._toggleShrunk} />}
                        <GlyphButton butclass="notclose header-but"
                                     handleClick={this._toggleBack}
                                     icon_class="far fa-cog"/>
                        <span className="tile-name-div">{this.props.tile_name}</span>
                    </div>
                    <div className="right-glyphs">
                        {this.props.show_spinner &&
                            <span className="spin-place">
                                <span className="loader-small"/>
                            </span>}
                        <GlyphButton butclass="notclose header-but"
                                     handleClick={this._toggleTileLog}
                                     icon_class="far fa-exclamation-triangle"/>
                        <GlyphButton butclass="notclose header-but"
                                     handleClick={this._logMe}
                                     icon_class="far fa-download"/>
                        <GlyphButton butclass="notclose header-but"
                                     handleClick={this._logParams}
                                     icon_class="far fa-list-ul"/>
                        <GlyphButton butclass="notclose header-but"
                                     handleClick={this._reload}
                                     icon_class="far fa-redo-alt"/>
                        <GlyphButton butclass="notclose header-but"
                                     handleClick={this._closeTile}
                                     icon_class="far fa-trash-alt"/>
                    </div>
                </Rbs.Card.Header>
                {!this.state.shrunk &&
                    <Rbs.Card.Body ref={this.body_ref} style={this.panel_body_style} className="tile-body">
                        {this.props.show_form &&
                            <div className="back" style={this.back_style}>
                                <TileForm options={this.props.form_data}
                                          tile_id={this.props.tile_id}
                                          updateValue={this.props.updateOptionValue}
                                          handleSubmit={this.props.handleSubmit}/>
                            </div>
                        }
                        {this.state.show_log &&
                            <div className="tile-log" style={this.tile_log_style}>
                                <div className="tile-log-area"><pre>{this.state.log_content}</pre></div>
                            </div>}
                        {show_front &&
                            <div className="front" style={this.front_style}>
                                <div className="tile-display-area" ref={this.tda_ref} dangerouslySetInnerHTML={front_dict}></div>
                            </div>
                        }
                    </Rbs.Card.Body>
                }
            </Rbs.Card>
        )
    }
}

TileComponent.propTypeps = {
    tile_name: PropTypes.string,
    tile_id: PropTypes.string,
    form_data: PropTypes.object,
    front_content: PropTypes.string,
    handleSubmit: PropTypes.func,
    handleClose: PropTypes.func,
    show_form: PropTypes.bool,
    show_spinner: PropTypes.bool,
    updateOptionValue: PropTypes.func,
    current_doc_name: PropTypes.string
};