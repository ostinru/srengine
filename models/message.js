var mongoose = require('lib/mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
        timestamp: {
            type: Date,
            default: Date.now()
        },
        message: {
            type: String,
        }
    });

exports.Message = mongoose.model('Message', schema);
