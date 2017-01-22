var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var leadershipSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    image: String,
    designation: String,
    abbr: String,
    description: {
        type: String,
        required: true
    },
    featured: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

var leadership = mongoose.model('leaderships', leadershipSchema);
module.exports = leadership;
