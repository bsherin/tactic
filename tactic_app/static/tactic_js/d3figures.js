/**
 * Created by bls910 on 1/6/16.
 */

function getDataSource(tile_id, data_source, callback){
    $.getJSON($SCRIPT_ROOT + "/data_source/" + String(main_id) + "/" + String(tile_id) + "/" + data_source, callback)
}

function createLinePlot(tile_id, data_source, target_element_id) {
    tda = $("#" + target_element_id).parent(".tile-display-area");
    w = tda.width();
    h = tda.height();
    getDataSource(tile_id, data_source, function (result) {
        drawLinePlot(result.data.data_list, target_element_id, result.data.xlabels);
        function drawLinePlot(data, target_id, xlabels) {
            $("#" + target_element_id + " .d3plot").html("")
            var margin = 30;
            var y = d3.scale.linear().range([h - margin, 0]);
            var x = d3.scale.linear().range([0, w - margin]);

            var xAxis = d3.svg.axis().scale(x)
                .orient("bottom").ticks(5);
            var yAxis = d3.svg.axis().scale(y)
                .orient("left").ticks(5);

            var vis = d3.select("#" + target_element_id + " .d3plot")
                .append("svg")
                    .attr("width", w )
                    .attr("height", h)
                .append("g")
                    .attr("transform", "translate(30, 10)");

            var line = d3.svg.line()
                .x(function (d, i) {
                    return x(i);
                })
                .y(function (d) {
                    return y(d);
                });

            x.domain(d3.extent(data, function(d, i) { return i; }));

            y.domain([0, d3.max(data, function(d) { return d; })]);

            vis.append("path").attr("d", line(data));

            vis.append("g")         // Add the X Axis
                .attr("class", "x axis")
                .attr("transform", "translate(0," + String(h -  margin) + ")")
                .call(xAxis);

            vis.append("g")         // Add the Y Axis
                .attr("class", "y axis")
                .call(yAxis);

        }
    })
}

function createScatterPlot(tile_id, data_source, target_element_id) {
    tda = $("#" + target_element_id).parent(".tile-display-area");
    w = tda.width();
    h = tda.height();
    getDataSource(tile_id, data_source, function (result) {
        drawLinePlot(result.data.data_list, target_element_id, result.data.xlabels);
        function drawLinePlot(data, target_id, xlabels) {
            $("#" + target_element_id + " .d3plot").html("");

            var vis = d3.select("#" + target_element_id + " .d3plot")
                .append("svg")
                    .attr("width", w )
                    .attr("height", h);

            if (xlabels.length == 0) {
                var margin = {top: 20, bottom: 20, left: 20, right: 20};
            }
            else {
                var margin = {top: 20, bottom: 45, left: 20, right: 20};
            }

            var xExtent = [0, d3.max(data, function(d) { return d[0]; })];
            var yExtent = [0, d3.max(data, function(d) { return d[1]; })];

            var xScale = d3.scale.linear().domain(xExtent).range([margin.left, w - margin.right]);
            var yScale = d3.scale.linear().domain(yExtent).range([h - margin.bottom, margin.top]);

            d3.select("#" + target_element_id + " svg").selectAll("circle")
                .data(data).enter().append("circle")
                .attr("r", 5).attr("cx", function (d) {
                return xScale(d[0])
            }).attr("cy", function (d) {
                return yScale(d[1])
            });

            if (xlabels.length == 0) {
                var xAxis = d3.svg.axis().scale(xScale).orient("bottom")
                d3.select("#" + target_element_id + " svg").append("g").attr("id", "xAxisG")
                    .attr("transform", "translate(" + String(0) + " ," + String(h -  margin.bottom) + ")")
                    .call(xAxis);
            }
            else {
                tvalues = [];
                for (var i = 1; i <= data.length; i += 1){
                    tvalues.push(i)
                }
                var xAxis = d3.svg.axis().scale(xScale).orient("bottom").tickValues(tvalues).tickFormat(function(d, i) {return xlabels[i]}).tickPadding(20);
                d3.select("#" + target_element_id + " svg").append("g").attr("id", "xAxisG")
                    .attr("transform", "translate(" + String(0) + " ," + String(h -  margin.bottom) + ")")
                    .call(xAxis)
                    .selectAll("text")
                        .attr("y", 0)
                        .attr("x", 9)
                        .attr("dy", ".35em")
                        .attr("transform", "rotate(90)")
                        .style("text-anchor", "start");
            }

            var yAxis = d3.svg.axis().scale(yScale).orient("left");
            d3.select("#" + target_element_id + " svg").append("g").attr("id", "yAxisG").attr("transform", "translate(" + String(margin.top) + " ," + String(0) + ")").call(yAxis);


        }
    })
}


