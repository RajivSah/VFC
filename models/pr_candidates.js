var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var pr_candidateSchema=new Schema({
    
    
    electedfor: String,
    district:String,
    constituency:Number,
    parties:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'pr_party_model'
    }]
});

var model=mongoose.model('pr_candidates', pr_candidateSchema);
module.exports=model;