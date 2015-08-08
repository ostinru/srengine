module.exports = {
    fetchMessages : superFetch('message'),
    postMessage: superPost("message"),

	fetchTimes : superFetch('time'),
    postTime: superPost("time"),

	fetchUsers : superFetch('user'),
    addUser: superPut("user"),
    updateUser: superPost("user"),
    removeUser: superDelete("user"),
    addAdminBonus: superPut("user"),
    updateAdminBonus: superPost("user"),
    removeAdminBonus: superDelete("user"),

    fetchProblems : superFetch('problem'),
}

var $ = require('jquery');
var REST_PREFIX = 'rest';

function superFetch(urlsfx) {
	return function()	{
		var args = getArguments(arguments, true);
		$.ajax(REST_PREFIX + '/' + urlsfx + '/' + args.path.join('/'), {
        	success: args.onSuccess,
	        error: args.onError
    	});
	}
}

function superPost(urlsfx) {
	return function() {
		var args = getArguments(arguments);
		$.post(REST_PREFIX + '/' + urlsfx + '/' + args.path.join('/'), args.data)
			.done(args.onSuccess)
			.fail(args.onError);
	}
}

function superPut(urlsfx) {
	return function() {
		var args = getArguments(arguments);
		$.ajax(REST_PREFIX + '/' + urlsfx + '/' + args.path.join('/'), {
			method: 'PUT',
			success: args.onSuccess,
			error: args.onError,
			data: args.data

		});
	}
}

function superDelete(urlsfx) {
	return function() {
		var args = getArguments(arguments, true);
		$.ajax(REST_PREFIX + '/' + urlsfx + '/' + args.path.join('/'), {
			method: 'DELETE',
			success: args.onSuccess,
			error: args.onError,
			data: args.data

		});
	}
}

function defaultOnSuccess() {
	console.log("success", arguments);
}

function defaultOnError() {
	console.log("error", arguments);
}

// path, path, path..., data, onError, onSuccess
function getArguments(args, noData) {
	args = Array.prototype.slice.call(args); // copy

	var result = {
		onSuccess: defaultOnSuccess,
		onError: defaultOnError,
		data: undefined,
		path: []
	}

	var callbacksCount = 0;
	while (args.length !== 0) {
		var arg = args.pop();
		// callbacks
		if (typeof arg === 'function') {
			if (callbacksCount > 2)
				throw 'Too many callbacks';

			if (callbacksCount == 0) {
				result.onError = arg;
			} else {
				result.onSuccess = result.onError;
				result.onError = arg;
			}
			callbacksCount++;
		} else if (result.data === undefined && !noData) {
				result.data = arg;
		} else {
			result.path.unshift(arg);
		}
	}
	return result;	
}