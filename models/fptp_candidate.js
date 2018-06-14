var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var fptp_candidateSchem=new Schema({
    district: String, 
    constituency: Number,
    electedfor: String ,
    candidateName_np: String, //
    candidateName_eng: String, //
    citizenshipNo: String, //
    fatherName: String, //S
    motherName: String, //
    dob: Date, //
    sex: String,  //
    partyId: Number, //
    partyName: String, //
    symbolId: Number,
    symbolName: String, //
    symbolFileName: String,
    ethAddress: String,
    // pkHash: String        // HOR (House of Representative) or PA (public Assembly)  


});

var model=mongoose.model('fptp_candidates', fptp_candidateSchem);
module.exports=model;