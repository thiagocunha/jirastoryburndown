
$(window).focus(function(e) {
    chrome.storage.local.get(['keys', 'baseURL'], function(result) {
		// Clearing the container
		$('#ulLista').html("Nothing yet");
		var lista = result.keys.split("|");
		lista.forEach(function (item){
			// One link for each ticket that needs atention
			$('#ulLista').append("<il><a target='_blank' href='"+result.baseURL+"jira/browse/"+item+"'>"+item+"</a></il>");
		});
	});
});