var mongoose = require('../lib/mongoose'),
    Schema = mongoose.Schema;

var game = new Schema({
    startTime: {
    	type: Date,
    	required: true
    },
    finishTime: {
    	type: Date,
    	required: true
    },
    title: {
    	type: String,
    	required: true
    },
    anons: String,
    statisticVisibiity: {
    	type: Boolean,
    	default: true,
    }
    statisticType: {
    	type: String, // 'table', 'acm'
    	default: 'table'
    showTakenPlace: {
    	type: Boolean, // show taken place right after finish
    	default: true,
    },
    hideProblemTitles: {
    	type: Boolean,
    	default: false
    }
});
/*
var level = new Schema({
	serial: {
		type: Number,
        unique: true
	},
	topic: {
        type: String,
        unique: true,
        required: true
    },
    question: {
        type: String,
        required: true
    },
    cost: {
        type: Number,
        required: true
    },
    answers: [{
        type: String,
        required: true
    }],
	autoskip: {
		// timeout
		// penalty (cost)
	},
	ban: {
		// N attempts in M seconds
	},
	hints: [{
		// timeout,
		// penalty (cost)
        text: {
            type: String,
            required: true
        },
        cost: {
            type: Number,
            required: true
        }
    }]
	bonuses: [{
		// accessible on levels...
		// time restriction (from/to)
		// cost
		text: { // bonus answer
            type: String,
            required: true
        },
        cost: {
            type: Number,
            required: true
        }
	}],
});
*/

exports.Message = mongoose.model('Game', game);
