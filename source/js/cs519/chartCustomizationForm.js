
var datasetPath = 'data/';

var getValues = function() {
    return {
        'chartType': $('input[name=chartType]:checked').val(),
        'xColumnName': $('input[name=xColumnName]').val(),
        'dataset': datasetPath + $('select[name=dataset]>option:selected').val(),
        'width': parseInt($('input[name=width]').val()),
        'height': parseInt($('input[name=height]').val()),
        'xParseFormat': getParseFormat($('input[name=xParseFormat]').val()),
        'xFormat': getDataFormat($('select[name=xFormat]>option:selected').val()),
        'yFormat': getDataFormat($('select[name=yFormat]>option:selected').val()),
        'xScale': getScale($('select[name=xFormat]>option:selected').val()),
        'yScale': getScale($('select[name=yFormat]>option:selected').val()),
        'xLabel': $('input[name=xLabel]').val(),
        'yLabel': $('input[name=yLabel]').val(),
    }
}

var drawChart = function(valueObj) {
    var chart = window[valueObj.chartType].call();
    chart.xColumnName(valueObj.xColumnName)
    chart.width(valueObj.width)
    chart.height(valueObj.height)
    chart.dataFile(valueObj.dataset)
    chart.xParseFormat(valueObj.xParseFormat)
    chart.xFormat(valueObj.xFormat)
    chart.yFormat(valueObj.yFormat)
    chart.xScale(valueObj.xScale)
    chart.yScale(valueObj.yScale)
    chart.xLabel(valueObj.xLabel)
    chart.yLabel(valueObj.yLabel)
    chart.parentDOMElement('#charts')
    chart()
}

var selectChartType = function() {
    var valueObj = getValues()
    if(this.value) {
        valueObj.chartType = this.value;
    }
    switch (valueObj.chartType) {
        case 'forcedDirectedGraph': 
            $('select[name=dataset]').val('interests.json')
            $('input[name=yLabel]').val('')
            $('input[name=xLabel]').val('')
            break;
        case 'stackedAreaChart': 
            $('select[name=dataset]').val('temperatures.csv')
            $('input[name=yLabel]').val('Temperature (ºF)')
            $('input[name=xLabel]').val('Month')
            break;
        case 'multiSeriesLineChart': 
            $('select[name=dataset]').val('browsers.csv')
            $('input[name=yLabel]').val('Downloads')
            $('input[name=xLabel]').val('Month')
            break;
        default:
            break;
    }
    $('select[name=dataset]').trigger('change')
}

var selectDataset = function() {
    switch(this.value) {
        case 'browsers.csv':
            $('input[name=xParseFormat]').val('%y-%b-%d'); 
            $('input[name=yLabel]').val('Downloads')
            $('input[name=xLabel]').val('Month')
            break;
        case 'temperatures.csv':
            $('input[name=yLabel]').val('Temperature (ºF)')
            $('input[name=xLabel]').val('Month')
            $('input[name=xParseFormat]').val('%Y%m%d'); break;
        default:
            break;
    }
    var valueObj = getValues()
    if(this.value) {
        valueObj.dataset = datasetPath + this.value;
    }
    drawChart(valueObj)
}

var getParseFormat = function(format) {
    if(format) {
        return d3.time.format(format.trim())
    } else {
        return d3.format()
    }
}
var getDataFormat = function(format) {
    switch(format) {
        case 'date (%y-%b-%d)': 
            d3Format = d3.time.format("%y-%b-%d")
            break;
        case 'date (%Y%m%d)': 
            d3Format = d3.time.format("%Y%m%d")
            break;
        case 'month': 
            d3Format = d3.time.format('%B')
            break;
        case 'percents': 
            d3Format = d3.format(".0%")
            break;
        case 'number': 
        default:
            d3Format = d3.format()
            break;
    }
    return d3Format;
}
var getScale = function(format) {
    switch(format) {
        case 'month': 
        case 'date (%y-%b-%d)': 
        case 'date (%Y%m%d)': 
            d3Scale = d3.time.scale()
            break;
        case 'percents': 
        case 'number': 
        default:
            d3Scale = d3.scale.linear()
            break;
    }
    return d3Scale;
}
var selectXFormat = function() {
    var valueObj = getValues()
    if(this.value) {
        valueObj.xFormat = getDataFormat(this.value);
        valueObj.xScale = getScale(this.value);
    }
    drawChart(valueObj)
}

var selectYFormat = function() {
    var valueObj = getValues()
    if(this.value) {
        valueObj.yFormat = getDataFormat(this.value);
        valueObj.yScale = getScale(this.value);
    }
    drawChart(valueObj)
}

var updateGraph = function() {
    var valueObj = getValues()
    drawChart(valueObj)
}

$(document).ready( function() {
    $('input[name=chartType]').each(function(i, elem) {
        $(elem).on('click', selectChartType)
    })
    $('select[name=dataset]').on('change', selectDataset)
    $('input[name=xColumnName]').on('change', updateGraph)
    $('input[name=width]').on('change', updateGraph)
    $('input[name=height]').on('change', updateGraph)
    $('input[name=xLabel]').on('change', updateGraph)
    $('input[name=yLabel]').on('change', updateGraph)
    $('input[name=xParseFormat]').on('change', updateGraph)
    $('select[name=xFormat]').on('change', selectXFormat)
    $('select[name=yFormat]').on('change', selectYFormat)

    selectChartType();
});