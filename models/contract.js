var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var configSchema = new Schema({
        contractAddress: String,
        ownerAddress: String,
});

var model = mongoose.model('config', configSchema);

module.exports = model;