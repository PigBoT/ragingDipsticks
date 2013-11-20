chrome.runtime.onConnect.addListener(function(port) {
	port.onMessage.addListener(function(msg) {
		switch (port.name){
			case 'toggle':
				console.log("Toggle Called.");
				try{
					chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
						console.log({'name': 'toggle', 'good': localStorage['agreedToGood'], 'publKeys': localStorage['publicKeys'], 'privKeys': localStorage['personalKeys']});
						chrome.tabs.sendMessage(tabs[0].id, {'name': 'toggle', 'publKeys': localStorage['publicKeys'], 'privKeys': localStorage['personalKeys']}, function(response) {
							console.log(response.result);
						});
					});
				} catch (err){
					console.log(err.message);
				}
				break;
			default:
				console.log("Unrecognized command.");
				break;
		}
	})
});