var district_model=require('../models/districts');

module.exports={
    fetch_Constituency: function(req, res){
        var dist_name=req.params.district_name;
        district_model.findOne({district_name: dist_name}, function(err, dist){
            if(err)
                throw err;
            console.log(dist);
            if(!err && dist)
                res.json({no_of_Hor: dist.no_of_Hor, no_of_Prov: dist.no_of_prov});
        });

    }
};