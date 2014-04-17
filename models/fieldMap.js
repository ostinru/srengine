var mongoose = require('../lib/mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
        X: {
            type: Number,
            default:0
        },
        Y: {
            type: Number,
            default:0
        },
        BS:
        {
            type: Boolean,
            default: false
        },
        ProblemId: {
            type: mongoose.Schema.Types.ObjectId,
            required: false
        }
    })
    ;

exports.FieldMap = mongoose.model('FieldMap', schema);
