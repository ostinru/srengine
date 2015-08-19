var mongoose = require('../lib/mongoose'),
    Schema = mongoose.Schema;

var coords = new Schema({
    sessionId: {
    	type: String,
    	required: true
    },
    userId: {
    	type: Schema.Types.ObjectId,
    	required: true
    },
    x: {
    	type: Number,
    	required: true
    },
    y: {
    	type: Number,
    	required: true
    },
    timestamp: {
    	type: Number,
    	required: true
    },
    userAgent: {
    	type: String
    }
});

exports.Message = mongoose.model('Coords', coords);