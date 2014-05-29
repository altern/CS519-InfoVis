function multiSeriesLineChart() {
    
    var margin = {top: 20, right: 20, bottom: 30, left: 50},
        width = 1000,
        height = 500,
        xFormat = d3.time.format('%B'),
        yFormat = d3.format(),
        xParseFormat = d3.time.format("%Y%m%d"),
        xLabel = '',
        yLabel = "Temperature (ºF)",
        xScale = d3.scale.linear(),
        yScale = d3.scale.linear(),
        xColumnName = 'date',
        yColumnName = 'temperature',
        xColumnOrdering = 'ascending',
        dataFile = "data/temperatures.csv",
        chartId = 'visualization',
        parentDOMElement = 'body';
        
    var dataProcessing = function(error, csv) {
        var x = xScale
            .range([0, width - margin.left - margin.right]);

        var y = yScale
            .range([height - margin.top - margin.bottom, 0]);

        var color = d3.scale.category10();

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom")
            .tickFormat(xFormat);

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .tickFormat(yFormat);

        var line = d3.svg.line()
            .interpolate("basis")
            .x(function(d) { return x(d[xColumnName]); })
            .y(function(d) { return y(d[yColumnName]); });

        d3.select('#' + chartId).remove()

        var svg = d3.select(parentDOMElement).append('div').attr('id', chartId)
            .append('div').attr('id', 'multiSeriesLineChart')
            .append('svg')
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
        if(xParseFormat.parse) {
            csv.sort(function(a, b) {return d3[xColumnOrdering].call(d3, xParseFormat.parse(a[xColumnName]), xParseFormat.parse(b[xColumnName]));})
        } else {
            csv.sort(function(a, b) {return d3[xColumnOrdering].call(d3, xFormat(a[xColumnName]), xFormat(b[xColumnName]));})
        }

        color.domain(d3.keys(csv[0]).filter( function(key) { return key !== xColumnName; }) );

        csv.forEach(function(d) {
            if(xParseFormat.parse) {
                d[xColumnName] = xParseFormat.parse(d[xColumnName]);
            } else {
                d[xColumnName] = xFormat(d[xColumnName]);
            }
        });

        var colors = color.domain().map(function(name) {
          return {
            name: name,
            values: csv.map(function(d) {
              return {date: d[xColumnName], temperature: +d[name]};
            })
          };
        });

        x.domain(d3.extent(csv, function(d) { return d[xColumnName]; }));

        y.domain([
          d3.min(colors, function(c) { return d3.min(c.values, function(v) { return v[yColumnName]; }); }),
          d3.max(colors, function(c) { return d3.max(c.values, function(v) { return v[yColumnName]; }); })
        ]);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .append("text")
            .attr("x", width)
            .attr("dy", ".71em")
            .attr("font-size", "24")
            .style("text-anchor", "end")
            .text(xLabel);

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "1em")
            .style("text-anchor", "end")
            .attr("font-size", "24")
            .text(yLabel);

        var col = svg.selectAll(".col")
            .data(colors)
            .enter().append("g")
            .attr("class", "col");

        col.append("path")
            .attr("class", "line")
            .attr("d", function(d) { return line(d.values); })
            .style("stroke", function(d) { return color(d.name); });

        col.append("text")
            .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
            .attr("transform", function(d) { return "translate(" + x(d.value[xColumnName]) + "," + y(d.value[yColumnName]) + ")"; })
            .attr("x", 3)
            .attr("dy", ".35em")
            .text(function(d) { return d.name; });
    }
    
    var chart = function() {
        var dataFileArr = dataFile.split('.')
        var extension = dataFileArr[1];
        
        d3[extension].call(d3, dataFile, dataProcessing);
    }
    function X(d) {
        return xScale(d[0]);
    }

    // The x-accessor for the path generator; yScale ∘ yValue.
    function Y(d) {
        return yScale(d[1]);
    }

    chart.margin = function(_) {
        if (!arguments.length)
            return margin;
        margin = _;
        return chart;
    };

    chart.width = function(_) {
        if (!arguments.length)
            return width;
        width = _;
        return chart;
    };

    chart.height = function(_) {
        if (!arguments.length)
            return height;
        height = _;
        return chart;
    };
    
    chart.xFormat  = function(_) {
        if (!arguments.length)
            return xFormat;
        xFormat = _;
        return chart;
    };
    
    chart.xParseFormat  = function(_) {
        if (!arguments.length)
            return xParseFormat;
        xParseFormat = _;
        return chart;
    };
    
    chart.yFormat  = function(_) {
        if (!arguments.length)
            return yFormat;
        yFormat = _;
        return chart;
    };
    
    chart.xScale  = function(_) {
        if (!arguments.length)
            return xScale;
        xScale = _;
        return chart;
    };
    
    chart.yScale  = function(_) {
        if (!arguments.length)
            return yScale;
        yScale = _;
        return chart;
    };
    
    chart.xLabel  = function(_) {
        if (!arguments.length)
            return xLabel;
        xLabel = _;
        return chart;
    };
    
    chart.yLabel  = function(_) {
        if (!arguments.length)
            return yLabel;
        yLabel = _;
        return chart;
    };
    
    chart.xColumnName  = function(_) {
        if (!arguments.length)
            return xColumnName;
        xColumnName = _;
        return chart;
    };
    
    chart.xColumnOrdering  = function(_) {
        if (!arguments.length)
            return xColumnOrdering;
        xColumnOrdering = _;
        return chart;
    };
    
    chart.dataFile  = function(_) {
        if (!arguments.length)
            return dataFile;
        dataFile = _;
        return dataFile;
    };
    
    chart.chartId  = function(_) {
        if (!arguments.length)
            return chartId;
        chartId = _;
        return chartId;
    };
    
    chart.parentDOMElement  = function(_) {
        if (!arguments.length)
            return parentDOMElement;
        parentDOMElement = _;
        return parentDOMElement;
    };

    return chart;
}