function drawGraph() {

    var chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: true,
        exportEnabled: false,        
        axisY:{ 
            title: "Percentage",
            includeZero: false, 
            interval: .2,
            suffix: "%",
            valueFormatString: "#.0"
        },
        data: [{
            type: "stepLine",
            yValueFormatString: "#0.0\"%\"",
            xValueFormatString: "DD, MMM",
            markerSize: 5,
            dataPoints: [
                { x: new Date(2016, 0), y: 4.9 },
                { x: new Date(2016, 1), y: 4.9 },
                { x: new Date(2016, 2), y: 5.0 },
                { x: new Date(2016, 3), y: 5.0, indexLabel: "Highest", indexLabelFontColor: "#C24642" },
                { x: new Date(2016, 4), y: 4.7 },
                { x: new Date(2016, 5), y: 4.9 },
                { x: new Date(2016, 6), y: 4.9 },
                { x: new Date(2016, 7), y: 4.9 },
                { x: new Date(2016, 8), y: 4.9 },
                { x: new Date(2016, 9), y: 4.8 },
                { x: new Date(2016, 10), y: 4.6 },
                { x: new Date(2016, 11), y: 4.7 },
                { x: new Date(2017, 0), y: 4.8 },
                { x: new Date(2017, 1), y: 4.7 },
                { x: new Date(2017, 2), y: 4.5 },
                { x: new Date(2017, 3), y:4.4 },
                { x: new Date(2017, 4), y:4.3 },
                { x: new Date(2017, 5), y:4.4 }
            ]
        }]
    });
    chart.render();
    
}

function createConfig(details, data) {
    return {
        type: 'line',
        data: {
            labels: ['Oct, 1', 'Oct, 2', 'Oct, 3', 'Oct, 4', 'Oct, 5', 'Oct, 6', 'Oct, 7', 'Oct, 8'],
            datasets: [{
                label: details.steppedLine,
                steppedLine: details.steppedLine,
                data: data,
                borderColor: 'red',
                fill: false,
            },
            {
                label: details.steppedLine,
                steppedLine: details.steppedLine,
                data: [85, 85*(6/7), 85*(5/7), 85*(4/7), 85*(3/7), 85*(2/7), 85*(1/7), 0],
                borderColor: 'green',
                fill: false,
            }]
        },
        options: {
            bezierCurve: false,
            responsive: true,
            scales:{
                xAxes:[
                    {
                        ticks: {
                            fontSize: 9
                        }
                    }
                ]
            },
            legend: {
                display:false
            },
            title: {
                display: false,
                text: details.label,
            }
        }
    };
}

function drawGraph2() {
    var container = document.querySelector('#chartContainer');
    var data = [
        85, 82, 55, 50, 30, 20, 10, 5    
    ];
    var steppedLineSettings = [{
        steppedLine: false,
        label: 'No Step Interpolation'
    }];
    steppedLineSettings.forEach(function(details) {
        var div = document.createElement('div');
        div.classList.add('chart-container');
        var canvas = document.createElement('canvas');
        div.appendChild(canvas);
        container.appendChild(div);
        var ctx = canvas.getContext('2d');
        var config = createConfig(details, data);
        new Chart(ctx, config);
    });
}

function domChange(){
    $('chartContainer').remove();
    var chartParentContainer = $("<div id='chartParentContainer'></div>");
    chartParentContainer.addClass("module").addClass("toggle-wrap");
    var chartToggle = $("<div id='chartmodule_heading' class='mod-header'><ul class='ops'></ul><a href='#' class='aui-button toggle-title'><svg xmlns='http://www.w3.org/2000/svg' width='14' height='14'><g fill='none' fill-rule='evenodd'><path d='M3.29175 4.793c-.389.392-.389 1.027 0 1.419l2.939 2.965c.218.215.5.322.779.322s.556-.107.769-.322l2.93-2.955c.388-.392.388-1.027 0-1.419-.389-.392-1.018-.392-1.406 0l-2.298 2.317-2.307-2.327c-.194-.195-.449-.293-.703-.293-.255 0-.51.098-.703.293z' fill='#344563'></path></g></svg></a><h4 class='toggle-title'>Burndown</h4></div>");
    var chartContent = $("<div class='mod-content'></div>");
    chartContent.prepend("<div id='chartContainer'>&nbsp;</div>");
    chartParentContainer.prepend(chartContent);
    chartParentContainer.prepend(chartToggle);

    $('#viewissuesidebar').prepend(chartParentContainer);
    drawGraph2();
}
$(document).ready(function(){domChange();});