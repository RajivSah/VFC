var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var boothSchema = new Schema({
    state: Number,
    district: String,
    region: Number,
});

var model = mongoose.model('booth', configSchema);

module.exports = model;