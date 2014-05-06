function forcedDirectedGraph() {
    
    var margin = {top: 20, right: 20, bottom: 30, left: 50},
        width = 960,
        height = 500,
        charge = -800,
        linkDistance = 150,
        circleRadius = 20,
        dataFile = "data/miserables.json",
        chartId = 'visualization',
        parentDOMElement = 'body';
    
    var dataProcessing = function(error, data) {
        
        var color = d3.scale.category20();

        d3.select('#' + chartId).remove();
        
        var svg = d3.select(parentDOMElement).append('div').attr('id', chartId)
            .append('div').attr('id', 'forcedDirectedGraph')
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append('g')
            .call(d3.behavior.zoom().scaleExtent([-8, 8]).on('zoom', function() {
                svg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
            }))
        
        var force = d3.layout.force()
            .charge(charge)
            .linkDistance(linkDistance)
            .size([width, height])
            .nodes(data.nodes)
            .links(data.links)
            .start();

        var link = svg.selectAll(".link")
            .data(data.links)
            .enter().append("line")
            .attr("class", "link")
            .style("stroke-width", function(d) { return Math.sqrt(d.value); });

        var node = svg.selectAll(".node")
            .data(data.nodes)
            .enter().append('g')
            .call(force.drag)
            
        node.append("circle")
            .attr("class", "node")
            .attr("r", circleRadius)
            .style("fill", function(d) { return color(d.group); })
    
        node.append('text')
            .style("text-anchor", "middle")
            .text(function(d) { return d.name; })

        node.append("title")
            .text(function(d) { return d.name; });

        force.on("tick", function() {
            link.attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });

            node.attr("transform", function(d) { 
                return "translate(" + d.x + "," + d.y + ")"; 
            })
        });
    }
    
    var chart = function() {
        
        var dataFileArr = dataFile.split('.')
        var extension = dataFileArr[1];
        
        d3[extension].call(d3, dataFile, dataProcessing);
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
    
    chart.charge  = function(_) {
        if (!arguments.length)
            return charge;
        charge = _;
        return charge;
    };
    
    chart.linkDistance  = function(_) {
        if (!arguments.length)
            return linkDistance;
        linkDistance = _;
        return linkDistance;
    };
    
    chart.circleRadius  = function(_) {
        if (!arguments.length)
            return circleRadius;
        circleRadius = _;
        return circleRadius;
    };
    
    chart.parentDOMElement  = function(_) {
        if (!arguments.length)
            return parentDOMElement;
        parentDOMElement = _;
        return parentDOMElement;
    };
    
    return chart;
}