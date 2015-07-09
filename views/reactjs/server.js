module.exports = {
	fetchGlobalBonuses : superFetch('globalbonus'),
	fetchMessages : superFetch('message'),
    fetchUsers : superFetch('users'),
    fetchProblems : superFetch('problems'),
    fetchTimes : superFetch('times'),
}

var $ = require('jquery');
var REST_PREFIX = 'rest';

function superFetch(urlsfx) {
	return function(onError, onSuccess)	{
        //debugger;
		$.ajax(REST_PREFIX + '/' + urlsfx, {
        	success: onSuccess,
	        error: onError
    	});
	}
}
