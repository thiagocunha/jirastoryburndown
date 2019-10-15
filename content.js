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
                lineTension:0
            },
            {
                label: details.steppedLine,
                steppedLine: details.steppedLine,
                data: [85, ,,,,,, 0], //data: [85, 85*(6/7), 85*(5/7), 85*(4/7), 85*(3/7), 85*(2/7), 85*(1/7), 0],
                borderColor: 'green',
                fill: false,
                lineTension:0,
                spanGaps: true
            }]
        },
        options: {
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

function DateFromEpochMs(e){
    if (e){
        var d = new Date(0);
        d.setUTCMilliseconds(e);
        return d;
    }
    else{
        return e;
    }
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


    var dueDate = $("#due-date time").attr("datetime");
    var issueID = $("#key-val.issue-link").attr("rel");

    if (dueDate){
        //https://jira.coke.com/jira/secure/QuickEditIssue!default.jspa?issueId=679196&decorator=none

        $.ajax({
            url: "https://" + window.location.hostname + "/jira/secure/QuickEditIssue!default.jspa?issueId="+issueID+"&decorator=none"
        }).done(function( ticketData ) {

            var ticketDueDate;
            var ticketOriginalEstimate;
            var todayDate;

            for (var i=0;i<ticketData.fields.length;i++){
                var currentField = ticketData.fields[i];

                if (currentField.id == "duedate"){
                    console.log(currentField.editHtml);

                    var r = /id=.duedate.*?value=.(\d+\/.{1,3}\/.{2,4}).>/gm;
                    var m = r.exec(currentField.editHtml);
                    if (m)
                    {
                        console.log(m);
                        ticketDueDate = m[1];
                    }
                }
                else if (currentField.id == "timetracking"){
                    console.log(currentField.editHtml);

                    var r = /id=.timetracking_originalestimate.*?value=.([\d\w\s]*?).\/>/gm;
                    var m = r.exec(currentField.editHtml);
                    if (m)
                    {
                        console.log(m);
                        ticketOriginalEstimate = m[1];
                    }
                }
            }

            $.ajax({
                url: "https://" + window.location.hostname + "/jira/rest/com.deniz.jira.worklog/1.0/timesheet/issueId?targetKey="+issueID+"&_=1571075815473"
            }).done(function( data ) {

                console.log(data);
                
                var totalDaysRange = data.daysBetween;
                var firstLogDay;
                var lastLogDay;
                var isWeekend = data.isWeekend;
                var workLogs = [];
                var workLogFinalList = {};
                var originalEstimate = ticketOriginalEstimate; 
                if (!originalEstimate)
                {
                    // Getting from the visible box on Time Tracking group (XXd XXh XXm)
                    originalEstimate = $("#timetrackingmodule .tt_inner dl:first dd:last").text().trim();
                }
                
                if (data.projects && data.projects.length>0 && data.projects[0].issues && data.projects[0].issues.length>0){
                    workLogs = data.projects[0].issues[0].workLogs;                
                }            

                if (workLogs && workLogs.length>0){
                    // first day that we have time tracked
                    firstLogDay = DateFromEpochMs(workLogs[0].workStart);
                    // last day that we have time tracked
                    lastLogDay = firstLogDay;

                    //var workStart = DateFromEpochMs(workLogs[0].workStart);
                    for(var i=0;i<workLogs.length;i++){
                        var currentItem = workLogs[i];
                        var currentDate = DateFromEpochMs(currentItem.workStart);
                        if (firstLogDay>currentDate){
                            firstLogDay = currentDate;
                        }
                        else if (lastLogDay<currentDate){
                            lastLogDay = currentDate;
                        }

                        var currentKey = currentDate.toISOString().split('T')[0]; // yyyy-mm-dd
                        console.log(workLogFinalList[currentKey]);
                        if (!workLogFinalList[currentKey]){
                            workLogFinalList[currentKey] = [];
                        }
                        workLogFinalList[currentKey].push(currentItem.timeSpent);
                        
                    }

                    // Filling the array with all dates between the first and the last day
                    for (var d = firstLogDay; d <= (lastLogDay>ticketDueDate?lastLogDay:ticketDueDate); d.setDate(d.getDate() + 1)) {
                        var formatedDate = d.toISOString().split('T')[0];
                        if (!workLogFinalList[formatedDate]){
                            workLogFinalList[formatedDate] = [];
                        }
                    }

                    console.table(workLogFinalList);
                }
            });
        });
        drawGraph2();

    }
    else{

        
        ///jira/rest/com.deniz.jira.worklog/1.0/timesheet/issueId?targetKey=679196&_=1571075815473
        $("#chartParentContainer").addClass("collapsed");
        $('#chartContainer').text("It's not possible to render a burndown without a due date");
    }
}
$(document).ready(function(){domChange();});