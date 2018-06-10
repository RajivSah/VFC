var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var fptp_candidateSchem=new Schema({
    district: String,
    constituency: Number,
    candidateName_np: String,
    candidateName_eng: String,
    age: Number,
    gender: String,
    partyId: Number,
    partyName: String,
    symbolId: Number,
    symbolName: String,
    symbolFileName: String,
    status:String,
    electedfor: String          // HOR (House of Representative) or PA (public Assembly)  


});

var model=mongoose.model('fptp_candidates', fptp_candidateSchem);
module.exports=model;