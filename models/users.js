var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchem = new Schema({
        username: String,
        password: String,
        role: String
});

var model = mongoose.model('users', userSchem);

module.exports = model;