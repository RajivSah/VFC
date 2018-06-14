var mongoose=require('mongoose'),
Schema=mongoose.Schema;

var dist_schem=new Schema({
    district_name: {type: String},
    no_of_Hor: {type: Number},
    no_of_prov:{type: Number}

});

module.exports=mongoose.model('districts', dist_schem);