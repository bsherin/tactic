/**
 * Created by bls910 on 1/6/16.
 */

function getDataSource(tile_id, data_source, callback){
    $.getJSON($SCRIPT_ROOT + "/data_source/" + String(main_id) + "/" + String(tile_id) + "/" + data_source, callback)
}

//noinspection JSUnusedGlobalSymbols
function createLinePlot(tile_id, data_source, target_element_id) {
    var tda = $("#" + target_element_id).parent(".tile-display-area");
    w = tda.width();
    h = tda.height();
    getDataSource(tile_id, data_source, function (result) {
        //noinspection JSUnresolvedVariable
        drawLinePlot(result.data.data_list);
        function drawLinePlot(data) {
            $("#" + target_element_id + " .d3plot").html("");
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

function createHeatmap(tile_id, data_source, target_element_id) {
    var tda = $("#" + target_element_id).parent(".tile-display-area");
    var w = tda.width();
    var h = tda.height();
    getDataSource(tile_id, data_source, function (result) {
        drawHeatmap(result.data.data_list, target_element_id, result.data.row_labels, result.data.margins, result.data.domain);

        function drawHeatmap(data, target_element_id, labels, margin, domain) {

            colors = ['#005824','#1A693B','#347B53','#4F8D6B','#699F83','#83B09B','#9EC2B3','#B8D4CB','#D2E6E3','#EDF8FB','#FFFFFF','#F1EEF6','#E6D3E1','#DBB9CD','#D19EB9','#C684A4','#BB6990','#B14F7C','#A63467','#9B1A53','#91003F'];
            var colorScale = d3.scale.quantile()
                .domain(domain)
                .range(colors);

            $("#" + target_element_id + " .d3plot").html("");

            //noinspection JSUnusedLocalSymbols
            var vis = d3.select("#" + target_element_id + " .d3plot")
                .append("svg")
                .attr("width", w)
                .attr("height", h);

            var useable_width = w - margin.left - margin.right;
            var useable_height = h - margin.top - margin.bottom;
            var cellwidth = useable_width / data[0].length;
            var cellheight = useable_height / data.length;

            data_with_rows = [];
            for (var r = 0; r < data.length; ++r) {
                the_row = data[r];
                new_row = [];
                for (var c = 0; c < the_row.length; ++c) {
                    new_row.push([r, the_row[c]])
                }
                data_with_rows.push(new_row)
            }

            var gr = vis.selectAll("g").data(data_with_rows).enter().append("g");

            gr.selectAll("rect").data(function (d) {return d;}).enter().append("rect")
                .attr("x", function (d, i) {return margin.left + i * cellwidth;})
                .attr("y", function (d, i) {return margin.top + d[0] * cellheight;})
                .attr("class", "cell cell-border")
                .attr("width", cellwidth)
                .attr("height", cellheight)
                .style("fill", function (d) { return colorScale(d[1]);});
            if (!(labels == null)) {
                vis.append("g")
                  .selectAll(".heatmap-rowLabel")
                  .data(labels)
                  .enter()
                  .append("text")
                  .text(function (d) { return d; })
                  .attr("x", margin.left - 3)
                  .attr("y", function (d, i) { return margin.top + cellheight * (i +.5); })
                  .style("text-anchor", "end")
                    .attr("class", "heatmap-rowLabel");

            }
            var rows = data.length
            var cols = data[0].length;
            var col_labels = [];
            for (var c = 0; c < cols; ++c) {
                col_labels.push(String(c))
            }
            vis.append("g")
                .selectAll(".heatmap-colLabel")
                .data(col_labels)
                .enter()
                .append("text")
                .text(function (d) { return d; })
                .attr("x", (function (d, i) { return margin.left + cellwidth * (i +.5); }))
                .attr("y", margin.top + cellheight * rows + 10)
                .attr("class", "heatmap-colLabel")
        }

    })
}

//noinspection JSUnusedGlobalSymbols
function createScatterPlot(tile_id, data_source, target_element_id) {
    var tda = $("#" + target_element_id).parent(".tile-display-area");
    w = tda.width();
    h = tda.height();
    getDataSource(tile_id, data_source, function (result) {
        //noinspection JSUnresolvedVariable
        drawScatterPlot(result.data.data_list, target_element_id, result.data.xlabels, result.data.margins);
        function drawScatterPlot(data, target_element_id, xlabels, margin) {
            $("#" + target_element_id + " .d3plot").html("");

            //noinspection JSUnusedLocalSymbols
            var vis = d3.select("#" + target_element_id + " .d3plot")
                .append("svg")
                    .attr("width", w )
                    .attr("height", h);

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
                //noinspection JSDuplicatedDeclaration
                var xAxis = d3.svg.axis().scale(xScale).orient("bottom");
                d3.select("#" + target_element_id + " svg").append("g").attr("id", "xAxisG")
                    .attr("transform", "translate(" + String(0) + " ," + String(h -  margin.bottom) + ")")
                    .call(xAxis);
            }
            else {
                var tvalues = [];
                for (var i = 1; i <= data.length; i += 1) {
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
            d3.select("#" + target_element_id + " svg").append("g").attr("id", "yAxisG").attr("transform", "translate(" + String(margin.left) + " ," + String(0) + ")").call(yAxis);

        }
    })
}


