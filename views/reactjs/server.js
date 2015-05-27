module.exports = {
	fetchGlobalBonuses : superFetch('globalbonus'),
	fetchMessages : superFetch('message'),
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