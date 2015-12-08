var mongoose = require('lib/mongoose'),
    Schema = mongoose.Schema;


// game sessions - archive copy of all sessions
// db.sessions.mapReduce(function() { emit(this._id, ObjectId(JSON.parse(this.session).user));}, function(k,v) { return v }, { query:{}, out: "asessions"})
var asessions = new Schema({
	// example: { "_id" : "-88WAg4ydAnmJ2xxVhkDNp3TGqABzflu", "value" : "55decec15c4bc27069b85047" }

    _id: {
    	type: String,
    	required: true
    },
    user: {
    	type: Schema.Types.ObjectId,
    	required: true,
    	ref: 'Problem'

    }
});

exports.ASessions = mongoose.model('ASessions', coords);
