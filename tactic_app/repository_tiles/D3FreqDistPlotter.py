@user_tile
class D3FreqDistPlotterComplete(TileBase):
    category = "plot"
    def __init__(self, main_id, tile_id, tile_name=None):
        TileBase.__init__(self, main_id, tile_id, tile_name)
        self.N = 20
        self.value_list = None
        self.word_list = None
        self.data_list = None
        self.fixed_labels = None
        self.save_attrs += ["data_list", "word_list", "data_dict", "fixed_labels"]
        self.margin_top = 20
        self.margin_bottom = 45
        self.margin_left = 40
        self.margin_right = 20
        self.jscript = """function createScatterPlot(data, target_element_id, xlabels, margin) {
                            var tda = $("#" + target_element_id).parent(".tile-display-area");
                            
                            if (margin.hasOwnProperty("width")){
                                var w = margin.width;
                                var h = margin.height
                            }
                            else {
                                var w = tda.width();
                                var h = tda.height();
                            }
                            
                            $("#" + target_element_id + " .d3plot").html("");
                            var vis = d3.select("#" + target_element_id + " .d3plot")
                                .append("svg").attr("width", w ).attr("height", h);
                            var xExtent = [0, d3.max(data, function(d) { return d[0]; })];
                            var yExtent = [0, d3.max(data, function(d) { return d[1]; })];
                            var xScale = d3.scale.linear().domain(xExtent).range([margin.left, w - margin.right]);
                            var yScale = d3.scale.linear().domain(yExtent).range([h - margin.bottom, margin.top]);
                            d3.select("#" + target_element_id + " svg").selectAll("circle")
                                .data(data).enter().append("circle")
                                .attr("r", 5).attr("class", "element-clickable").attr("cx", function (d) {return xScale(d[0])})
                                .attr("data-x", function (d) {return d[0]} )
                                .attr("cy", function (d) { return yScale(d[1])})
                                .attr("data-y", function (d) {return d[1]} );
                            if (xlabels.length == 0) {
                                var xAxis = d3.svg.axis().scale(xScale).orient("bottom");
                                d3.select("#" + target_element_id + " svg").append("g")
                                    .attr("id", "xAxisG").attr("transform", "translate(" + String(0) + " ," + String(h -  margin.bottom) + ")")
                                    .call(xAxis);
                            }
                            else {
                                var tvalues = [];
                                for (var i = 1; i <= data.length; i += 1) {
                                    tvalues.push(i)
                                }
                                var xAxis = d3.svg.axis().scale(xScale).orient("bottom").tickValues(tvalues)
                                    .tickFormat(function(d, i) {return xlabels[i]}).tickPadding(20);
                                d3.select("#" + target_element_id + " svg").append("g")
                                    .attr("id", "xAxisG")
                                    .attr("transform", "translate(" + String(0) + " ," + String(h -  margin.bottom) + ")")
                                    .call(xAxis).selectAll("text").attr("y", 0).attr("x", 9).attr("dy", ".35em")
                                    .attr("transform", "rotate(90)").style("text-anchor", "start");
                            }
                            var yAxis = d3.svg.axis().scale(yScale).orient("left");
                            d3.select("#" + target_element_id + " svg").append("g").attr("id", "yAxisG")
                                .attr("transform", "translate(" + String(margin.left) + " ," + String(0) + ")")
                                .call(yAxis);
                        }"""
        
    @property
    def options(self):
        return  [
            {"name": "data_source", "type": "pipe_select"},
            {"name": "N", "type": "int"},
            {"name": "margin_top", "type": "int"},
            {"name": "margin_bottom", "type": "int"},
            {"name": "margin_left", "type": "int"},
            {"name": "margin_right", "type": "int"}
        ]
    
    def handle_size_change(self):
        return
    
    
    def get_unique_id(self):
        import uuid
        return "div" + str(uuid.uuid4())
    
    def handle_log_tile(self):
        margins = {"top": self.margin_top, "bottom": self.margin_bottom, 
                   "left": self.margin_left, "right": self.margin_right}
        margins["width"] = self.width
        margins["height"] = self.height
        log_uid = self.get_unique_id()
        log_html = "<div id='{}'><div class='d3plot'></div>".format(str(log_uid))

        log_script = 'createScatterPlot({0}, "{1}", {2}, {3});'.format(str(self.data_list), str(log_uid), str(self.fixed_labels), str(margins))
        log_script += self.jscript
        log_html += '<script class="resize-rerun">' + log_script + '</script></div>'
        self.dm(log_html)
        return
    
    def handle_tile_element_click(self, dataset, doc_name, active_row_index):
        self.dm("got the message: " + str(dataset["x"]) + ", " + str(dataset["y"]))
    
    def create_plot_html(self, data_list, labels, margins):
        uid = self.get_unique_id()
        self.fixed_labels = [str(l) for l in labels]  # this is needed to get rid of unicode
        the_html = "<div id='{}'><div class='d3plot'></div>".format(str(uid))
        the_script = 'createScatterPlot({0}, "{1}", {2}, {3});'.format(str(data_list), str(uid), str(self.fixed_labels), str(margins))
        the_script += self.jscript
        the_html += '<script class="resize-rerun">' + the_script + '</script></div>'
        
        return the_html

    def render_content (self):
        if self.data_source is None:
            return "No vocab source selected."
        fdist = self.get_pipe_value(self.data_source)
        mc_tuples = fdist.most_common(self.N)
        self.word_list = []
        self.data_list = []
        for i, tup in enumerate(mc_tuples):
            self.word_list.append(tup[0])
            self.data_list.append([i + 1, tup[1]])
        margins = {"top": self.margin_top, "bottom": self.margin_bottom, 
                        "left": self.margin_left, "right": self.margin_right}
        new_html = self.create_plot_html(self.data_list, labels=self.word_list, margins=margins)
        return new_html