var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var pr_candidateSchem=new Schema({
    district: String,
    constiturncy: Number,
    candidateParty_np: String,
    candidateParty_eng: String,
    age: Number,
    gender: String,
    partyId: Number,
    partyName: String,
    symbolId: Number,
    symbolName_np: String,
    symbolFileName: String,
    status:String,
    electedfor: String          // HOR (House of Representative) or PA (public Assembly)  


});

var model=mongoose.model('pr_candidates', pr_candidateSchem);
module.exports=model;