var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var voterSchem = new Schema({
        formNo: Number,
        fullName: String,
        DOB: Date,
        sex: String,
        fatherName: String,
        motherName: String,
        citizenshipNo: String,
        voted: Boolean,
        district: String,
        address: String,
        ethAddress: String,
        nagarpalikaNo: String,
        pkHash: String,
        tokenTransferred :Boolean   
});

var model = mongoose.model('voters', voterSchem);

module.exports = model;

