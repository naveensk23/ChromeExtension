chrome.runtime.onMessage.addListener(function (request) {

console.log("BG => ",request);

    switch(request.type) {
        case "SAVE_PERSON":

		//console.log("BKGROUND SWITCH"+request);
			var serverRequest = $.ajax ({
			    url: 'http://52.27.195.247:8080/qlead/rest/profile',
			    type: "PUT",
			    data: JSON.stringify(request.user),
			    timeout: 3000,
			    dataType: "json",
			    contentType: "application/json; charset=utf-8"
			});

			serverRequest.done(function(data, status, xhr) {
				chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
				    chrome.tabs.sendMessage(tabs[0].id, {type: "SAVE_SUCCESS"}, function(response) {});
				});
			})

			serverRequest.fail(function(xhr) {

				switch (xhr.status){
					case 401:
						chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
						    chrome.tabs.sendMessage(tabs[0].id, {type: "NOT_LOGGED_IN"}, function(response) {});
						});
					break;

					default:
						chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
						    chrome.tabs.sendMessage(tabs[0].id, {type: "ERROR_MESSAGE", message: "SP=>There was a problem contacting the server. Please try again after some time.", xhr: xhr}, function(response) {});
						});
					break;
				}
			})
        break;

        case "SAVE_COMPANY":

			var serverRequest = $.ajax ({
			    url: 'http://52.27.195.247:8080/qlead/rest/company',
			    type: "PUT",
			    data: JSON.stringify(request.user),
			    timeout: 3000,
			    dataType: "json",
			    contentType: "application/json; charset=utf-8"
			});

			serverRequest.done(function(data, status, xhr) {
				chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
				    chrome.tabs.sendMessage(tabs[0].id, {type: "SAVE_SUCCESS"}, function(response) {});
				});
			})

			serverRequest.fail(function(xhr) {

				switch (xhr.status){
					case 401:
						chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
						    chrome.tabs.sendMessage(tabs[0].id, {type: "NOT_LOGGED_IN"}, function(response) {});
						});
					break;

					default:
						chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
						    chrome.tabs.sendMessage(tabs[0].id, {type: "ERROR_MESSAGE", message: "SC=>There was a problem contacting the server. Please try again after some time.", xhr: xhr}, function(response) {});
						});
					break;
				}
			})
        break;

        case "LOGIN":
			var serverRequest = $.ajax ({
			    url: 'http://52.27.195.247:8080/qlead/rest/user/sessions',
			    type: "POST",
			    data: JSON.stringify(request.user),
			    timeout: 3000,
			    dataType: "json",
			    contentType: "application/json; charset=utf-8"
			});

			serverRequest.done(function(data, status, xhr) {
				chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
				    chrome.tabs.sendMessage(tabs[0].id, {type: "LOGIN_SUCCESS"}, function(response) {});
				});
			})

			serverRequest.fail(function(xhr) {

				switch (xhr.status){
					case 404:
						chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
						    chrome.tabs.sendMessage(tabs[0].id, {type: "LOGIN_ERROR"}, function(response) {});
						});
					break;

					default:
						chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
						    chrome.tabs.sendMessage(tabs[0].id, {type: "ERROR_MESSAGE", message: "LG=>There was a problem contacting the server. Please try again after some time.", xhr: xhr},  function(response) {});
						});
					break;
				}
			})
        break;

        case "CREATE_ACCOUNT":
			var serverRequest = $.ajax ({
			    url: 'http://52.27.195.247:8080/qlead/rest/user/account',
			    type: "POST",
			    data: JSON.stringify(request.user),
			    timeout: 3000,
			    dataType: "json",
			    contentType: "application/json; charset=utf-8"
			});

			serverRequest.done(function(data, status, xhr) {
				chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
				    chrome.tabs.sendMessage(tabs[0].id, {type: "LOGIN_SUCCESS"}, function(response) {});
				});
			})

			serverRequest.fail(function(xhr) {

				switch (xhr.status){
					case 403:
						chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
						    chrome.tabs.sendMessage(tabs[0].id, {type: "ACCOUNT_EXISTS"}, function(response) {});
						});
					break;

					default:
						chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
						    chrome.tabs.sendMessage(tabs[0].id, {type: "ERROR_MESSAGE", message: "CA=>There was a problem contacting the server. Please try again after some time.", xhr: xhr},  function(response) {});
						});
					break;
				}
			})
        break;

        case "GET_PROFILE_DATA":
        	var serverRequest = $.ajax ({
			    url: request.url,
			    type: "GET"
			});

			serverRequest.done(function(data, status, xhr) {
				chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
				    chrome.tabs.sendMessage(tabs[0].id, {type: "GOT_PROFILE", dom:data}, function(response) {});
				});
			})

			serverRequest.fail(function(xhr) {
				chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
				    chrome.tabs.sendMessage(tabs[0].id, {type: "ERROR_MESSAGE", message: "GP=>There was a problem contacting the linkedIn server. Please try again after some time.", xhr: xhr}, function(response) {});
				});
			})
        break;

        case "GET_COMPANY_DATA":
        	console.log('getting company data');
        	var serverRequest = $.ajax ({
			    url: request.url,
			    type: "GET"
			});

			serverRequest.done(function(data, status, xhr) {
				chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
				    chrome.tabs.sendMessage(tabs[0].id, {type: "GOT_COMPANY", dom:data}, function(response) {});
				});
			})

			serverRequest.fail(function(xhr) {
				chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
				    chrome.tabs.sendMessage(tabs[0].id, {type: "ERROR_MESSAGE", message: "GC=>There was a problem contacting the linkedIn server. Please try again after some time.", xhr: xhr}, function(response) {});
				});
			})
        break;
    }
});
