var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchem = new Schema({
        username: String,
        password: String,
        role: String,
        district: String,
        constituency1: Number,
        constituency2: Number
});

var model = mongoose.model('users', userSchem);

module.exports = model;