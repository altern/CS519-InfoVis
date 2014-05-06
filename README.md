# Installation

1. Make sure you have NodeJS installed on your computer. Install it from [http://nodejs.org](http://nodejs.org) if you don't have it.
1. Run `start.sh` (or `start.bat` if you are on windows)
1. Open URL [http://localhost:8080](http://localhost:8080)

# Implementation of reusable charts

## Stacked Area Chart
Stacked Area Chart implementation (`js/cs519/stackedAreaChart.js`) contains following list of chart property setters:

- **margin(** a **)**				`a = {top: 20, right: 20, bottom: 30, left: 50}`
- **width(** a **)**				`a = 1000`                       (numeric value for chart width)
- **height(** a **)**				`a = 600`                        (numeric value for chart height)
- **xFormat(** a **)**          	`a = d3.format()`                (d3 format object for X axis tick labels)
- **yFormat(** a **)**           	`a = d3.format()`                (d3 format object for Y axis tick labels)
- **xParseFormat(** a **)**      	`a = d3.time.format("%Y%m%d")`   (d3 format object for parsing data values extracted from datafile )
- **xLabel(** a **)**            	`a = 'Date'`                     (string value for X axis label)
- **yLabel(** a **)**            	`a = 'Ratio'`                    (string value for Y axis label)
- **xScale(** a **)**            	`a = d3.scale.linear()`          (d3 scale object representing scale of X axis)
- **yScale(** a **)**            	`a = d3.scale.log()`             (d3 scale object representing scale of Y axis)
- **xColumnName(** a **)**       	`a = 'Date'`                     (string value of column name of dataset containing data for X axis)
- **yColumnName(** a **)**       	`a = 'Ratio'`                    (string value of column name of dataset containing data for Y axis)
- **xColumnOrdering(** a **)**   	`a = 'ascending'`                (string value for datasetordering. allowed values: 'ascending', 'descending')
- **dataFile(** a **)**          	`a = 'data/data.csv'`            (string value of relative path to the datafile. supported formats: csv, json, tsv, xml)
- **chartId(** a **)**           	`a = 'visualization'`            (string value of id for DOM element to use to append svg)
- **parentDOMElement(** a **)**  	`a = 'body>div.chart'`           (string value for css selector)

## Multi-series Line Chart 
Multi-series Line Chart implementation (`js/cs519/multiSeriesLineChart.js`) contains following list of chart property setters:

- **margin(** a **)**				`a = {top: 20, right: 20, bottom: 30, left: 50}`
- **width(** a **)**				`a = 1000`                       (numeric value for chart width)
- **height(** a **)**				`a = 600`                        (numeric value for chart height)
- **xFormat(** a **)**          	`a = d3.format()`                (d3 format object for X axis tick labels)
- **yFormat(** a **)**           	`a = d3.format()`                (d3 format object for Y axis tick labels)
- **xParseFormat(** a **)**      	`a = d3.time.format("%Y%m%d")`   (d3 format object for parsing data values extracted from datafile )
- **xLabel(** a **)**            	`a = 'Date'`                     (string value for X axis label)
- **yLabel(** a **)**            	`a = 'Ratio'`                    (string value for Y axis label)
- **xScale(** a **)**            	`a = d3.scale.linear()`          (d3 scale object representing scale of X axis)
- **yScale(** a **)**            	`a = d3.scale.log()`             (d3 scale object representing scale of Y axis)
- **xColumnName(** a **)**       	`a = 'Date'`                     (string value of column name of dataset containing data for X axis)
- **yColumnName(** a **)**       	`a = 'Ratio'`                    (string value of column name of dataset containing data for Y axis)
- **xColumnOrdering(** a **)**   	`a = 'ascending'`                (string value for datasetordering. allowed values: 'ascending', 'descending')
- **dataFile(** a **)**          	`a = 'data/data.csv'`            (string value of relative path to the datafile. supported formats: csv, json, tsv, xml)
- **chartId(** a **)**           	`a = 'visualization'`            (string value of id for DOM element to use to append svg)
- **parentDOMElement(** a **)**  	`a = 'body>div.chart'`           (string value for css selector)

## Forced Directed Graph
Forced Directed Graph implementation (`js/cs519/forcedDirectedGraph.js`) contains following list of chart property setters:

- **margin(** a **)**				`a = {top: 20, right: 20, bottom: 30, left: 50}`
- **width(** a **)** 				`a = 1000`                       (numeric value for chart width)
- **height(** a **)** 			`a = 600`                        (numeric value for chart height)
- **dataFile(** a **)**  			`a = 'data/data.csv'`            (string value of relative path to the datafile. supported formats: csv, json, tsv, xml)
- **chartId(** a **)** 			`a = 'visualization'`            (string value of id for DOM element to use to append svg)
- **charge(** a **)** 			`a = -120`						 (numeric value for the charge of nodes in forced directed graph)
- **linkDistance(** a **)** 		`a = 60`						 (numeric value for distance between parent and child nodes)
- **circleRadius(** a **)** 		`a = 20`						 (numeric value for radius of nodes)
- **parentDOMElement(** a **)**	`a = 'body>div.chart'`           (string value for css selector)
