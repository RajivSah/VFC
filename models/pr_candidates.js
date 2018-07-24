var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var pr_candidateSchem=new Schema({
    
    
    electedfor: String,
    district:String,
    constituency:Number,
    parties:Object
});

var model=mongoose.model('pr_candidates', pr_candidateSchem);
module.exports=model;