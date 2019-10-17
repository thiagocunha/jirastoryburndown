function createConfig(details, days, ref, real) {
    return {
        type: 'line',
        data: {
            labels: days,
            datasets: [{
                label: details.steppedLine,
                steppedLine: details.steppedLine,
                data: real,
                borderColor: 'red',
                fill: false,
                lineTension:0,
                spanGaps: true
            },
            {
                label: details.steppedLine,
                steppedLine: details.steppedLine,
                data: ref, //data: [85, 85*(6/7), 85*(5/7), 85*(4/7), 85*(3/7), 85*(2/7), 85*(1/7), 0],
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

function drawGraph2(days, ref, real) {
    var container = document.querySelector('#chartContainer');
    
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
        var config = createConfig(details, days, ref, real);
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

function extractJiraTimeFromText(text){
    var r = /(?:(\d*)w)?\s?(?:(\d*)d)?\s?(?:(\d*)h)?\s?(?:(\d*)m)?\s?/gm;
    var m = r.exec(text);
    if (m){
        var weeks = 0;
        var days = 0;
        var hours = 0;
        var minutes = 0;

        if (m[1]){
            weeks = parseInt(m[1]);
        }
        if (m[2]){
            days = parseInt(m[2]);
        }
        if (m[3]){
            hours = parseInt(m[3]);
        }
        if (m[4]){
            minutes = parseInt(m[4]);
        }
            
        return (weeks * 5 * 8 * 60) + (days * 8 * 60) + (hours * 60) + (minutes);
    }
    else{
        return 0;
    }
}
function cloneDate(original){
    return new Date(original.getFullYear(), original.getMonth(), original.getDate());
}

function getSubWorkingHours(itemsList, currentIndex, workLogs, cb){
    if (itemsList && itemsList[currentIndex]){
        $.ajax({
            url: "https://" + window.location.hostname + "/jira/rest/com.deniz.jira.worklog/1.0/timesheet/issueId?targetKey="+itemsList[currentIndex]+"&_=1571075815473"
        }).done(function( data ) {

            var tempLogs = [];
            if (data.projects && data.projects.length>0 && data.projects[0].issues && data.projects[0].issues.length>0){
                tempLogs = data.projects[0].issues[0].workLogs;    
                workLogs = workLogs.concat(tempLogs);            
            }    

            if (currentIndex<itemsList.length-1){
                getSubWorkingHours(itemsList, currentIndex+1, workLogs, cb);
            }
            else{
                // get data
                cb(workLogs);
            }
        });
    }
    else{
        cb(workLogs);
    }
}
function domChange(){
    console.log("starting dom changes");
    $('chartContainer').remove();
    var chartParentContainer = $("<div id='chartParentContainer'></div>");
    chartParentContainer.addClass("module").addClass("toggle-wrap");
    var titleTag = $(".toggle-title").not("a").prop("tagName");

    var chartToggle = $("<div id='chartmodule_heading' class='mod-header'><ul class='ops'></ul><a href='#' class='aui-button toggle-title'><svg xmlns='http://www.w3.org/2000/svg' width='14' height='14'><g fill='none' fill-rule='evenodd'><path d='M3.29175 4.793c-.389.392-.389 1.027 0 1.419l2.939 2.965c.218.215.5.322.779.322s.556-.107.769-.322l2.93-2.955c.388-.392.388-1.027 0-1.419-.389-.392-1.018-.392-1.406 0l-2.298 2.317-2.307-2.327c-.194-.195-.449-.293-.703-.293-.255 0-.51.098-.703.293z' fill='#344563'></path></g></svg></a><h4 class='toggle-title'>Burndown</h4></div>");

    if (titleTag == "H2"){
        chartToggle = $("<div id='chartmodule_heading' class='mod-header'><ul class='ops'></ul><h2 class='toggle-title'>Burndown</h2></div>");
    }
    var chartContent = $("<div class='mod-content'></div>");
    chartContent.prepend("<div id='chartContainer'>&nbsp;</div>");
    chartParentContainer.prepend(chartContent);
    chartParentContainer.prepend(chartToggle);

    $('#viewissuesidebar').prepend(chartParentContainer);


    var dueDate = $("#due-date time").attr("datetime");
    var issueID = $("#key-val.issue-link").attr("rel");

    if (dueDate){
        $.ajax({
            url: "https://" + window.location.hostname + "/jira/secure/QuickEditIssue!default.jspa?issueId="+issueID+"&decorator=none"
        }).done(function( ticketData ) {

            var ticketDueDate;
            var ticketOriginalEstimate;
            var todayDate;

            for (var i=0;i<ticketData.fields.length;i++){
                var currentField = ticketData.fields[i];

                if (currentField.id == "duedate"){

                    var r = /id=.duedate.*?value=.(\d+\/.{1,3}\/.{2,4}).>/gm;
                    var m = r.exec(currentField.editHtml);
                    if (m)
                    {
                        ticketDueDate = m[1];
                    }
                }
                else if (currentField.id == "timetracking"){

                    var r = /id=.timetracking_originalestimate.*?value=.([\d\w\s]*?).\/>/gm;
                    var m = r.exec(currentField.editHtml);
                    if (m)
                    {
                        ticketOriginalEstimate = m[1];
                    }
                }
            }

            $.ajax({
                url: "https://" + window.location.hostname + "/jira/rest/com.deniz.jira.worklog/1.0/timesheet/issueId?targetKey="+issueID+"&_=1571075815473"
            }).done(function( data ) {

                //console.log(data);
                
                var totalDaysRange = data.daysBetween;
                var firstLogDay;
                var lastLogDay;
                var workLogs = [];
                var workLogFinalList = {};
                var originalEstimate = ticketOriginalEstimate; 
                var numericTotalTime = 0;
                var dataReferenceLine = [];
                var dataRealBurnLine = [];
                var daysList = [];

                if (!originalEstimate)
                {
                    // Getting from the visible box on Time Tracking group (XXd XXh XXm)
                    originalEstimate = extractJiraTimeFromText($("#timetrackingmodule .tt_inner dl:first dd:last").text().trim());
                }                
                                
                // Getting remaining from the visible box on Time Tracking group (XXd XXh XXm)
                var remainingTime = extractJiraTimeFromText($("#timetrackingmodule .tt_inner dl:nth(1) dd:last").text().trim());

                // Getting logged from the visible box on Time Tracking group (XXd XXh XXm)
                var loggedTime = extractJiraTimeFromText($("#timetrackingmodule .tt_inner dl:last dd:last").text().trim());

                numericTotalTime = loggedTime + remainingTime;

                if (data.projects && data.projects.length>0 && data.projects[0].issues && data.projects[0].issues.length>0){
                    workLogs = data.projects[0].issues[0].workLogs;                
                }            

                // Get children items work logs
                var subIds = [];
                // Get sub-tasks ids
                $(".subtask-table-container .issuerow").each(function(i,e){subIds.push($(e).attr("rel"));});

                getSubWorkingHours(subIds, 0, workLogs, function (finalWorkLogs){
                    // do we have any work logged?
                    if (finalWorkLogs && finalWorkLogs.length>0){
                        // first day that we have time tracked
                        firstLogDay = cloneDate(DateFromEpochMs(finalWorkLogs[0].workStart));
                        // last day that we have time tracked
                        lastLogDay = cloneDate(firstLogDay);
                        var currentRemaining = numericTotalTime;

                        // Sort after merging all tickets
                        finalWorkLogs.sort(function(a,b){
                            if (a.workStart<b.workStart){
                                return -1;
                            }
                            else if (a.workStart>b.workStart){
                                return 1;
                            }
                            else{
                                return 0;
                            }
                        });
                        

                        for(var i=0;i<finalWorkLogs.length;i++){
                            var currentItem = finalWorkLogs[i];
                            var currentDate = DateFromEpochMs(currentItem.workStart);
                            if (firstLogDay>currentDate){
                                firstLogDay = cloneDate(currentDate);
                            }
                            else if (lastLogDay<currentDate){
                                lastLogDay = cloneDate(currentDate);
                            }

                            var currentKey = currentDate.toISOString().split('T')[0]; // yyyy-mm-dd
                            
                            if (!workLogFinalList[currentKey]){
                                workLogFinalList[currentKey] = { items: [], dailyBurnedMinutes: 0 };
                            }

                            var burnedOnTask = parseInt(currentItem.timeSpent)/60;
                            workLogFinalList[currentKey].dailyBurnedMinutes += burnedOnTask; 
                            currentRemaining = currentRemaining - burnedOnTask;
                            workLogFinalList[currentKey].items.push(currentItem.timeSpent);

                            workLogFinalList[currentKey].dailyRemaining = currentRemaining;

                        }

                        ticketDueDate = new Date(ticketDueDate);
                        var lastDay = (lastLogDay>ticketDueDate?cloneDate(lastLogDay):cloneDate(ticketDueDate));

                        
                        
                        // Filling the array with all dates between the first and the last day
                        for (var d = cloneDate(firstLogDay); d <= lastDay && daysList.length<50; d.setDate(d.getDate() + 1)) {
                            // Getting only weekdays
                            if (d.getDay()<6){
                                var formatedDate = d.toISOString().split('T')[0];
                                console.log(formatedDate);
                                if (!workLogFinalList[formatedDate]){
                                    dataRealBurnLine = dataRealBurnLine.concat([,]);
                                }
                                else{
                                    dataRealBurnLine.push(workLogFinalList[formatedDate].dailyRemaining);
                                }

                                if (d.getTime()==firstLogDay.getTime()){
                                    dataReferenceLine.push(numericTotalTime);
                                }
                                else if (d.getTime()==lastDay.getTime()){
                                    dataReferenceLine.push(0);
                                }
                                else{
                                    // Add an empty spot
                                    dataReferenceLine = dataReferenceLine.concat([,]);
                                }

                                const formatter = new Intl.DateTimeFormat('en', { month: 'short' });
                                const month1 = formatter.format(d);
                                const dayOfDate = d.getDate();

                                daysList.push(month1+", "+dayOfDate);
                            }
                        }

                        drawGraph2(daysList, dataReferenceLine, dataRealBurnLine);
                    }
                });
                
            });
        });

    }
    else{        
        $("#chartParentContainer").addClass("collapsed");
        $('#chartContainer').text("It's not possible to render a burndown without a due date");
    }
}
$(document).ready(function(){domChange();});