function stackedAreaChart() {
    var margin = {top: 20, right: 20, bottom: 30, left: 50},
        width = 1000,
        height = 500,
//        xScale = d3.time.scale(),
        xScale = d3.scale.linear(),
        yScale = d3.scale.linear(),
//        xFormat = d3.time.format("%y-%b-%d").parse,
        xFormat = d3.format(),
        yFormat = d3.format(),
        xColumnName = 'date';
    
    var chart = function(selection) {
        var color = d3.scale.category20();

        var stack = d3.layout.stack()
            .values(function(d) { return d.values; });

        var svg = d3.select('#visualization').append('div').attr('id', 'stackedAreaChart').append('svg') 
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var x = xScale
            .range([0, width - margin.left - margin.right])

        var y = yScale
            .range([height - margin.top - margin.bottom, 0])
            
        selection.each(function(data) {
            color.domain(d3.keys(data[0]).filter(function(key) { 
                return key !== xColumnName; 
            }));
            
            var xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom")
                .tickFormat(xFormat);

            var yAxis = d3.svg.axis()
                .scale(y)
                .orient("left")
                .tickFormat(yFormat);
                
            var area = d3.svg.area()
                .x(function(d) { return x(d.x); })
                .y0(function(d) { return y(d.y0); })
                .y1(function(d) { return y(d.y0 + d.y); });
            
            data.forEach(function(d) {
                d[xColumnName] = xFormat(d[xColumnName]);
            });
            var areaData = stack(color.domain().map(function(name) {
                return {
                    name: name,
                    values: data.map(function(d) {
                        return {x: d[xColumnName], y: parseFloat(d[name])};
                    })
                };
            }));
            
            x.domain(d3.extent(data, function(d) { return d[xColumnName]; }));
            y.domain([0, d3.max(data.map(function(elem, i) {
                return d3.sum(color.domain().map(function(name) { return data[i][name] }))
            }))])

            var singleArea = svg.selectAll(".singleArea")
                .data(areaData)
                .enter().append("g")
                .attr("class", "singleArea");

            singleArea.append("path")
                .attr("class", "area")
                .attr("d", function(d) { return area(d.values); })
                .style("fill", function(d) { return color(d.name); });

            singleArea.append("text")
                .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
                .attr("transform", function(d) { return "translate(" + x(d.value.x) + "," + y(d.value.y0 + d.value.y / 2) + ")"; })
                .attr("x", -6)
                .attr("dy", ".35em")
                .text(function(d) { return d.name; });

            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + (height - margin.top - margin.bottom) + ")")
                .call(xAxis);

            svg.append("g")
                .attr("class", "y axis")
                .call(yAxis);
        });
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
    
    chart.yFormat  = function(_) {
        if (!arguments.length)
            return yFormat;
        yFormat = _;
        return chart;
    };
    
    chart.xColumnName  = function(_) {
        if (!arguments.length)
            return xColumnName;
        xColumnName = _;
        return chart;
    };

    return chart;
}