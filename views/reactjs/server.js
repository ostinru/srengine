module.exports = {
	fetchGlobalBonuses : superFetch('globalbonus'),
	fetchMessages : superFetch('message'),
    fetchUsers : superFetch('user'),
    fetchProblems : superFetch('problem'),
    fetchTimes : superFetch('time'),

    postMessage: superPost("message"),
    postGlobalBonus: superPost("globalbonus"),
    postTime: superPost("time"),
}

var $ = require('jquery');
var REST_PREFIX = 'rest';

function superFetch(urlsfx) {
	return function(onError, onSuccess)	{
		$.ajax(REST_PREFIX + '/' + urlsfx, {
        	success: onSuccess,
	        error: onError
    	});
	}
}

function superPost(urlsfx) {
	return function(data, onError, onSuccess) {
		$.post(REST_PREFIX + '/' + urlsfx, data).done(onSuccess).fail(onError);
	}
}
