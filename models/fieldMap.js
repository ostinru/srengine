var mongoose = require('../lib/mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
        ID: {
            type: Number,
            unique: true,
            required: true
        },
        X: {
            type: Number,
            default:0
        },
        Y: {
            type: Number,
            default:0
        }
    })
    ;

exports.FieldMap = mongoose.model('FieldMap', schema);
