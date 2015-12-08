var mongoose = require('lib/mongoose'),
    Schema = mongoose.Schema;

var coords = new Schema({
    sessionID: {
    	type: String,
    	required: true
    },
    userId: {
    	type: Schema.Types.ObjectId,
    	required: true,
        ref: 'User'
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

exports.Coords = mongoose.model('Coords', coords);
