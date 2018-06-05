var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var keysSchema = new Schema({
        address: String,
        voted: Boolean,
});

var model = mongoose.model('keys', keysSchema);

module.exports = model;