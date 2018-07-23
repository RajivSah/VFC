var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var pr_party=new Schema({
    partyID:Number,
    name:String,
    symbolEnglish:String,
    symbolNepali:String,
    prEthAddress:String,
    HOREthAddress:String,
    symbolFilename:String
});

var model=mongoose.model('pr_party_model', pr_party);
module.exports=model;