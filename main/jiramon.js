
var JiraMon = {};

(function (p) {
	'use strict';
    let Monitor = (function(){
       
        function MonitorTickets() {}

		MonitorTickets.prototype.request = function (url, token, callback) {
            axios({
                method: 'get',
                url: 'https://jira.domain.com/jira/secure/RapidBoard.jspa?rapidView=1890'
            });            
		};

		return MonitorTickets;

    });	

})(JiraMon || (JiraMon = {}));