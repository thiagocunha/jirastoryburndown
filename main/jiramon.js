
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
            /*
			setTimeout(function () {
				$.ajax({
					url: url,
					type: 'GET',
					headers: {'Csrf-Token': token},
					dataType: 'json',
					contentType: 'application/vnd.linkedin.normalized+json',
					tryCount: 0,
					retryLimit: 3,
					success: function (res) { callback(null, res) },
					error: function(xhr, status, error) { 
						 if (xhr.status == 500) {
						 	this.tryCount++;
						 	if (this.tryCount <= this.retryLimit) {
						 		$.ajax(this);
						 		return;
						 	}
						 }
						callback({ text: xhr.responseText,  err: [xhr, status, error] }) ;
					}
				});
            }, 100);
            */
		};

		return MonitorTickets;

    });	

})(JiraMon || (JiraMon = {}));