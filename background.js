"use strict";

var ticketList = [];


chrome.alarms.create("jiraMon", {
    delayInMinutes: 1,
    periodInMinutes: 12
});


function alarmeAntigo(alarm) {
    if (alarm.name === "jiraMon") {
        var koidsCIT = [];
        var baseURL = 'https://jira.*.com/';

        chrome.storage.sync.get({
            ids: '',
            baseURL: baseURL
            }, function(items) {
            //document.getElementById('ids').value = items.ids;
            //document.getElementById('baseURL').value = items.baseURL;
            // Request the comments page for the current ticket
            koidsCIT = items.ids.split("\n");
            baseURL = items.baseURL;
            $.ajax({
                statusCode: {
                    400: function() {
                        chrome.browserAction.setBadgeText({text: "Auth"});
                    }
                },
                url: baseURL + "jira/rest/gadget/1.0/issueTable/filter?num=10&tableContext=jira.table.cols.dashboard&addDefault=false&columnNames=issuekey&columnNames=summary&columnNames=lastViewed&enableSorting=true&paging=true&showActions=true&filterId=31627&sortBy=&startIndex=0&_=1569954812196"
            }).done(function( data ) {
                var r = new RegExp(/(?:issuekey=.(AEM-\d*))/, 'gm');
                var keys = [];    
                
                // Check if the last comment is from the list of internal employees if not, include in the list
                checkComments(r, data, koidsCIT, keys, baseURL);
                
            });
        });

        

        function checkComments(r, data, koidsCIT, keys, baseURL){
            var match = r.exec(data.table);
            ticketList = [];
            if(match !== null){
                var ticket = match[1];
                console.log(ticket);
                $.ajax(baseURL + "jira/browse/"+ticket+"?page=com.atlassian.jira.plugin.system.issuetabpanels:comment-tabpanel&_=1569958096799").done(function( dataComments ) {
                    var regComments = new RegExp(/(?:alt=.*?"(\w\d{5}).*?added)/, 'gm');
                    var matchComments = regComments.exec(dataComments);
                    var lastKOID = "";
                    while(matchComments !== null){
                        lastKOID = matchComments[1]
                        matchComments = regComments.exec(dataComments);
                    }
                    if (koidsCIT.includes(lastKOID))
                    {
                        if (!keys.includes(ticket)){
                            keys.push(ticket);
                            ticketList.push(ticket);
                            console.log("Last comment not from CIT");
                        }
                    }
                    else
                    {
                        console.log("Last comment is from CIT");
                    }    
                    
                    
                    if (keys.length>0)
                        chrome.browserAction.setBadgeText({text: ""+keys.length});
                    else
                        chrome.browserAction.setBadgeText({text: ""});
                    
                    chrome.storage.local.set({keys: keys.join("|")}, function() {
                        console.log('Value is set to ' + keys);
                    });
                });
                
                checkComments(r, data, koidsCIT, keys);
            }
        }
    }
}