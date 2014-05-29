function streamlineGraph() {
    
    var margin = {top: 20, right: 20, bottom: 30, left: 50},
        width = 960,
        height = 500,
        charge = -800,
        linkDistance = 150,
        circleRadius = 20,
        dataFile = "data/versions.json",
        parentDOMElement = 'body',
        snapshotOnSeparateLevel = true,
        tagsDistance = 40,
        levelHeight = 30,
        useShapes = true;

    var dataProcessing = function(error, data) {
        
        var color = d3.scale.category20();

        var svg = d3.select('#streamlineGraph svg')
            .attr("width", width)
            .attr("height", height)
            .call(d3.behavior.zoom().scaleExtent([-8, 8]).on('zoom', function() {
                svg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
            }))
        
        svg.append("svg:defs").selectAll("marker")
            .data(["arrow"])
            .enter().append("svg:marker")
            .attr("id", String)
            .attr("viewBox", "0 -5 10 10")
            .attr("refX", 10)
            .attr("refY", 0)
            .attr("markerWidth", 10)
            .attr("markerHeight", 10)
            .attr("orient", "auto")
            .append("svg:path")
            .attr("d", "M0,-5L10,0L0,5");
    
        
        var numberOfTags = 12;
        var tags = Array.apply(null, {length: numberOfTags}).map(Number.call, Number)
        var numberOfLevels = 5;
        var yTopMargin = 20;
//        var levelHeight = ( height - yTopMargin ) / numberOfLevels;
        var xLeftMargin = 10;
        var xRightMargin = 100;
        var tagTextMargin = 10;
//        var tagsDistance = ( width - xLeftMargin - xRightMargin ) / numberOfTags; 
        
        if(snapshotOnSeparateLevel) {
            var ZERO_TAG_LEVEL = 0;
            var MAINLINE_LEVEL = 1;
            var MAINLINE_TAGS_LEVEL = 2;
            var BRANCH_LEVEL = 3;
            var BRANCH_TAGS_LEVEL = 4;
        } else {
            var ZERO_TAG_LEVEL = 0;
            var MAINLINE_LEVEL = 0;
            var MAINLINE_TAGS_LEVEL = 0;
            var BRANCH_LEVEL = 2;
            var BRANCH_TAGS_LEVEL = 2;
        }
        
        var branchConnectorNodes = [
            {x:xLeftMargin + tagsDistance*0, y:levelHeight*ZERO_TAG_LEVEL + yTopMargin }, {x:xLeftMargin + tagsDistance*0, y:levelHeight*MAINLINE_LEVEL + yTopMargin},
            {x:xLeftMargin + tagsDistance*3, y:levelHeight*MAINLINE_TAGS_LEVEL + yTopMargin + tagTextMargin}, {x:xLeftMargin + tagsDistance*3, y:levelHeight*BRANCH_LEVEL + yTopMargin},
            {x:xLeftMargin + tagsDistance*9, y:levelHeight*MAINLINE_TAGS_LEVEL + yTopMargin + tagTextMargin}, {x:xLeftMargin + tagsDistance*9, y:levelHeight*BRANCH_LEVEL + yTopMargin},
        ] 

        var tagConnectorNodes = [ 
            {x:xLeftMargin + tagsDistance*0, y:levelHeight*ZERO_TAG_LEVEL + yTopMargin }, {x:xLeftMargin + tagsDistance*0, y:levelHeight*ZERO_TAG_LEVEL + yTopMargin },
            {x:xLeftMargin + tagsDistance*1, y:levelHeight*MAINLINE_LEVEL + yTopMargin }, {x:xLeftMargin + tagsDistance*1, y:levelHeight*MAINLINE_TAGS_LEVEL + yTopMargin   },
            {x:xLeftMargin + tagsDistance*2, y:levelHeight*MAINLINE_LEVEL + yTopMargin }, {x:xLeftMargin + tagsDistance*2, y:levelHeight*MAINLINE_TAGS_LEVEL + yTopMargin   },
            {x:xLeftMargin + tagsDistance*3, y:levelHeight*MAINLINE_LEVEL + yTopMargin }, {x:xLeftMargin + tagsDistance*3, y:levelHeight*MAINLINE_TAGS_LEVEL + yTopMargin   },
            {x:xLeftMargin + tagsDistance*4, y:levelHeight*BRANCH_LEVEL   + yTopMargin }, {x:xLeftMargin + tagsDistance*4, y:levelHeight*BRANCH_TAGS_LEVEL   + yTopMargin   },
            {x:xLeftMargin + tagsDistance*5, y:levelHeight*MAINLINE_LEVEL + yTopMargin }, {x:xLeftMargin + tagsDistance*5, y:levelHeight*MAINLINE_TAGS_LEVEL + yTopMargin   },
            {x:xLeftMargin + tagsDistance*6, y:levelHeight*BRANCH_LEVEL   + yTopMargin }, {x:xLeftMargin + tagsDistance*6, y:levelHeight*BRANCH_TAGS_LEVEL   + yTopMargin   },
            {x:xLeftMargin + tagsDistance*7, y:levelHeight*MAINLINE_LEVEL + yTopMargin }, {x:xLeftMargin + tagsDistance*7, y:levelHeight*MAINLINE_TAGS_LEVEL + yTopMargin   },
            {x:xLeftMargin + tagsDistance*8, y:levelHeight*MAINLINE_LEVEL + yTopMargin }, {x:xLeftMargin + tagsDistance*8, y:levelHeight*MAINLINE_TAGS_LEVEL + yTopMargin   },
            {x:xLeftMargin + tagsDistance*9, y:levelHeight*MAINLINE_LEVEL + yTopMargin }, {x:xLeftMargin + tagsDistance*9, y:levelHeight*MAINLINE_TAGS_LEVEL + yTopMargin   },
            {x:xLeftMargin + tagsDistance*10, y:levelHeight*BRANCH_LEVEL  + yTopMargin }, {x:xLeftMargin + tagsDistance*10, y:levelHeight*BRANCH_TAGS_LEVEL  + yTopMargin   },
            {x:xLeftMargin + tagsDistance*11, y:levelHeight*MAINLINE_LEVEL + yTopMargin }, {x:xLeftMargin + tagsDistance*11, y:levelHeight*MAINLINE_TAGS_LEVEL + yTopMargin   },
        ]
        
        var arrowNodes = [ 
            {x:xLeftMargin + tagsDistance*0, y:levelHeight*MAINLINE_LEVEL + yTopMargin}, {x:width - xLeftMargin - xRightMargin, y:levelHeight*MAINLINE_LEVEL + yTopMargin},
            {x:xLeftMargin + tagsDistance*3, y:levelHeight*BRANCH_LEVEL + yTopMargin}, {x:xLeftMargin + tagsDistance*8, y:levelHeight*BRANCH_LEVEL + yTopMargin},
            {x:xLeftMargin + tagsDistance*9, y:levelHeight*BRANCH_LEVEL + yTopMargin}, {x:width - xLeftMargin - xRightMargin, y:levelHeight*BRANCH_LEVEL + yTopMargin},
        ];
        var branchConnectors = [
            {s:0, t:1},
            {s:2, t:3},
            {s:4, t:5},
        ]
        var tagConnectors = [
            {s:0, t:1, version: "0"},
            {s:2, t:3, version: "1"},
            {s:4, t:5, version: "2"},
            {s:6, t:7, version: "3"},
            {s:8, t:9, version: "4"},
            {s:10, t:11, version: "5"},
            {s:12, t:13, version: "6"},
            {s:14, t:15, version: "7"},
            {s:16, t:17, version: "8"},
            {s:18, t:19, version: "9"},
            {s:20, t:21, version: "10"},
            {s:22, t:23, version: "11"}
        ]
        var arrows = [ 
            {s:0, t:1, version:"x", branchName: "trunk"}, 
            {s:2, t:3, version:"x", branchName: "branch1"}, 
            {s:4, t:5, version:"x", branchName: "branch2"}, 
        ];
    
        var tagConnector = svg.selectAll(".tagConnector").data(tagConnectors)
        tagConnector.enter()
            .append("line")
            .attr("class", "tagConnector")
            .attr("x1", function(d) { return tagConnectorNodes[d.s].x; })
            .attr("x2", function(d) { return tagConnectorNodes[d.t].x; })
            .attr("y1", function(d) { return tagConnectorNodes[d.s].y; })
            .attr("y2", function(d) { return tagConnectorNodes[d.t].y; })
        tagConnector.transition().duration(1000).ease("quad")
            .attr("x1", function(d) { return tagConnectorNodes[d.s].x; })
            .attr("x2", function(d) { return tagConnectorNodes[d.t].x; })
            .attr("y1", function(d) { return tagConnectorNodes[d.s].y; })
            .attr("y2", function(d) { return tagConnectorNodes[d.t].y; })
        
        var branchConnector = svg.selectAll(".branchConnector").data(branchConnectors)
        branchConnector.enter()
            .append("line")
            .attr("class", "branchConnector")
            .attr("x1", function(d) { return branchConnectorNodes[d.s].x; })
            .attr("x2", function(d) { return branchConnectorNodes[d.t].x; })
            .attr("y1", function(d) { return branchConnectorNodes[d.s].y; })
            .attr("y2", function(d) { return branchConnectorNodes[d.t].y; })
        branchConnector.transition().duration(1000).ease("quad")
            .attr("x1", function(d) { return branchConnectorNodes[d.s].x; })
            .attr("x2", function(d) { return branchConnectorNodes[d.t].x; })
            .attr("y1", function(d) { return branchConnectorNodes[d.s].y; })
            .attr("y2", function(d) { return branchConnectorNodes[d.t].y; })
        
        var arrow = svg.selectAll(".arrow").data(arrows)
        arrow.enter()
            .append("line")
            .attr("class", "link arrow")
            .attr("x1", function(d) { return arrowNodes[d.s].x; })
            .attr("x2", function(d) { return arrowNodes[d.t].x; })
            .attr("marker-end", "url(#arrow)")
            .attr("y1", function(d) { return arrowNodes[d.s].y; })
            .attr("y2", function(d) { return arrowNodes[d.t].y; });
        arrow.transition().duration(1000).ease("quad")
            .attr("x1", function(d) { return arrowNodes[d.s].x; })
            .attr("x2", function(d) { return arrowNodes[d.t].x; })
            .attr("y1", function(d) { return arrowNodes[d.s].y; })
            .attr("y2", function(d) { return arrowNodes[d.t].y; });
        
        // ================ BRANCHES ========================
        
        var transformBranch = function(d) { 
            return "translate (" + arrowNodes[d.t].x + "," + (arrowNodes[d.t].y ) + ")"
        }
        
        var branchGroupEnter = svg.selectAll('.branchGroup').data(arrows).enter()
            .append("g")
            .attr('class', 'branchGroup')
            .attr('transform', transformBranch)
        var branchGroupUpdate = svg.selectAll('.branchGroup').data(arrows)
        svg.selectAll('.branchGroup').data(arrows).transition().duration(1000).ease("quad")
            .attr('transform', transformBranch)
            
        if (useShapes) {
            branchGroupEnter.append('circle')
                .attr("class", "branchShape")
                .attr("r", 10)
                .style("fill", '#eee')
                .style("stroke", 'black')
                .attr("cx", function(d) {
                    return (tagsDistance/2);
                })
                .attr('cy', function(d) {
                    return ( 0 );
                })
            branchGroupEnter.append("text")
                .text(function(d) { return d.version; })
                .attr("class", "branchVersion")
                .attr("text-anchor", "middle")
                .attr("x", function(d) {
                    return (tagsDistance/2);
                })
                .attr("y", function(d) {
                    return ( 3 );
                })
            branchGroupUpdate.append('circle')
                .attr("class", "branchShape")
                .attr("r", 10)
                .style("fill", '#eee')
                .style("stroke", 'black')
                .attr("cx", function(d) {
                    return (tagsDistance/2);
                })
                .attr('cy', function(d) {
                    return ( 0 );
                })
            branchGroupUpdate.append("text")
                .text(function(d) { return d.version; })
                .attr("class", "branchVersion")
                .attr("text-anchor", "middle")
                .attr("x", function(d) {
                    return (tagsDistance/2);
                })
                .attr("y", function(d) {
                    return ( 3 );
                })
        } else {
            svg.selectAll('.branchShape').remove();
            svg.selectAll('.branchVersion').remove();
            branchGroupEnter.append("text")
                .text(function(d) { return d.version; })
                .attr("class", "branchVersion")
                .attr("text-anchor", "middle")
                .attr("x", function(d) {
                    return (tagsDistance/2);
                })
                .attr("y", function(d) {
                    return ( 3 );
                })
            branchGroupUpdate.append("text")
                .text(function(d) { return d.version; })
                .attr("class", "branchVersion")
                .attr("text-anchor", "middle")
                .attr("x", function(d) {
                    return (tagsDistance/2);
                })
                .attr("y", function(d) {
                    return ( 3 );
                })
        }

        var branchText = svg.selectAll(".branchText").data(arrows)
        branchText.enter()
            .append("text")
            .text(function(d) { return "(" + d.branchName + ")"; })
            .attr("class", "branchText")
            .attr("text-anchor", "middle")
            .attr("x", function(d) {
                return ( arrowNodes[d.t].x + tagsDistance/2 );
            })
            .attr("y", function(d) {
                return ( arrowNodes[d.t].y + 22 );
            })
        branchText.transition().duration(1000).ease("quad")  
            .attr("x", function(d) {
                return ( arrowNodes[d.t].x + tagsDistance/2 );
            })
            .attr("y", function(d) {
                return ( arrowNodes[d.t].y + 22 );
            })    
            
        // ================ TAGS ========================
        
        
        var transformTag = function(d) { 
            return "translate (" + (tagConnectorNodes[d.t].x - tagTextMargin) + ", " + (tagConnectorNodes[d.t].y ) + ")"
        }
        
        var tagGroupEnter = svg.selectAll('.tagGroup').data(tagConnectors).enter()
            .append("g")
            .attr('class', 'tagGroup')
            .attr('transform', transformTag)
        var tagGroupUpdate = svg.selectAll('.tagGroup').data(tagConnectors)
        
        svg.selectAll('.tagGroup').data(tagConnectors).transition().duration(1000).ease("quad")
            .attr('transform', transformTag)
            
        svg.selectAll('.tagShape').remove();
        svg.selectAll('.tagVersion').remove();
        if(useShapes) {
            tagGroupEnter.append('rect')
                .attr("class", "tagShape")
                .attr("width", 2*tagTextMargin)
                .attr("height", 2*tagTextMargin)
                .attr('y', -tagTextMargin)
                .style("stroke", 'black')
            tagGroupEnter.append("text")
                .text(function(d) { return d.version } )
                .attr("class", "tagVersion")
                .attr("text-anchor", "middle")
                .attr("x", tagTextMargin)
                .attr('y', function(d) {
                    return ( 3 );
                })
            tagGroupUpdate.append('rect')
                .attr("class", "tagShape")
                .attr("width", 2*tagTextMargin)
                .attr("height", 2*tagTextMargin)
                .attr('y', -tagTextMargin)
                .style("fill", '#eee')
                .style("stroke", 'black')
            tagGroupUpdate.append("text")
                .text(function(d) { return d.version } )
                .attr("class", "tagVersion")
                .attr("text-anchor", "middle")
                .attr("x", tagTextMargin)
                .attr('y', function(d) {
                    return ( 3 );
                })
        } else {
            
            tagGroupEnter.append("text")
                .text(function(d) { return d.version } )
                .attr("class", "tagVersion")
                .attr("text-anchor", "middle")
                .attr("x", tagTextMargin)
                .attr('y', function(d) {
                    return ( 3 );
                })
            tagGroupUpdate.append("text")
                .text(function(d) { return d.version } )
                .attr("class", "tagVersion")
                .attr("text-anchor", "middle")
                .attr("x", tagTextMargin)
                .attr('y', function(d) {
                    return ( 3 );
                })
        }
        
        //if(useShapes) {
//            tagGroupEnter.selectAll('.tagShape').data(tagConnectors).enter()
//                .append('rect')
//                .attr("class", "tagShape")
//                .attr("width", 2*tagTextMargin)
//                .attr("height", 2*tagTextMargin)
//                .style("fill", '#eee')
//                .style("stroke", 'black')
//            tagGroupUpdate.append('rect')
//                .attr("class", "tagShape")
//                .attr("width", 2*tagTextMargin)
//                .attr("height", 2*tagTextMargin)
//                .style("fill", '#eee')
//                .style("stroke", 'black')
//            tagGroupEnter
//                .append('rect')
//                .attr("class", "tagShape")
//                .attr("width", 2*tagTextMargin)
//                .attr("height", 2*tagTextMargin)
//                .style("fill", '#eee')
//                .style("stroke", 'black')
//            tagGroupEnter.selectAll('.tagShape').data(tagConnectors)
//                .attr("class", "tagShape")
//                .attr("width", 2*tagTextMargin)
//                .attr("height", 2*tagTextMargin)
//                .style("fill", '#eee')
//                .style("stroke", 'black')
//            tagGroupEnter
//                .append("text")
//                .text(function(d) { return d.version } )
//                .attr("class", "tagVersion")
//                .attr("text-anchor", "middle")
//                .attr("x", tagTextMargin)
//                .attr('y', function(d) {
//                    return ( 3 + tagTextMargin );
//                })
//        } 
//        tagGroupEnter
//            .append("text")
//            .text(function(d) { return d.version } )
//            .attr("class", "tagVersion")
//            .attr("text-anchor", "middle")
//            .attr("x", tagTextMargin)
//            .attr('y', function(d) {
//                return ( 3 + tagTextMargin );
//            })
//        
//        tagGroup.transition().duration(1000).ease("quad")
//            .attr('transform', transformTag)
         
//        var tagVersion = svg.selectAll(".tagVersion").data(tagConnectors)
//        tagVersion.enter()
//            .append("text")
//            .text(function(d) { return d.version } )
//            .attr("class", "tagVersion")
//            .attr("text-anchor", "middle")
//            .attr("x", function(d) {
//                return ( tagConnectorNodes[d.t].x );
//            })
//            .attr('y', function(d) {
//                return ( tagConnectorNodes[d.t].y + 3 + tagTextMargin );
//            })
//        tagVersion.transition().duration(1000).ease("quad")
//            .attr("x", function(d) {
//                return ( tagConnectorNodes[d.t].x );
//            })
//            .attr('y', function(d) {
//                return ( tagConnectorNodes[d.t].y + 3 + tagTextMargin );
//            })
        
        
        
            
        
//        var force = d3.layout.force()
//            .charge(charge)
//            .linkDistance(linkDistance)
//            .size([width, height])
//            .nodes(data.nodes)
//            .links(data.links)
//            .start();

//        var link = svg.selectAll(".link")
//            .data(data.links)
//            .enter().append("line")
//            .attr("class", "link")
//            .style("stroke-width", function(d) { return Math.sqrt(d.value); });

//        var node = svg.selectAll(".node")
//            .data(data.nodes)
//            .enter().append('g')
//            .call(force.drag)
            
//        node.append("circle")
//            .attr("class", "node")
//            .attr("r", circleRadius)
//            .style("fill", function(d) { return color(d.group); })
//    
//        node.append('text')
//            .style("text-anchor", "middle")
//            .text(function(d) { return d.name; })
//
//        node.append("title")
//            .text(function(d) { return d.name; });
//
//        force.on("tick", function() {
//            link.attr("x1", function(d) { return d.source.x; })
//                .attr("y1", function(d) { return d.source.y; })
//                .attr("x2", function(d) { return d.target.x; })
//                .attr("y2", function(d) { return d.target.y; });
//
//            node.attr("transform", function(d) { 
//                return "translate(" + d.x + "," + d.y + ")"; 
//            })
//        });
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
    
    chart.snapshotOnSeparateLevel  = function(_) {
        if (!arguments.length)
            return snapshotOnSeparateLevel;
        snapshotOnSeparateLevel = _;
        return snapshotOnSeparateLevel;
    };
    
    chart.tagsDistance  = function(_) {
        if (!arguments.length)
            return tagsDistance;
        tagsDistance = _;
        return tagsDistance;
    };
    
    chart.levelHeight  = function(_) {
        if (!arguments.length)
            return levelHeight;
        levelHeight = _;
        return levelHeight;
    };
    
    chart.useShapes  = function(_) {
        if (!arguments.length)
            return useShapes;
        useShapes = _;
        return useShapes;
    };
    
    return chart;
}