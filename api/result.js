var district_model=require('../models/districts');
var fptp_candidate_model=require('../models/fptp_candidate');
var pr_candidate_model=require('../models/pr_candidates');
var ObjectID=require('mongodb').ObjectID;
const voterModel = require('../models/voters');


module.exports={

    getResult:function(req,res){
        console.log(req.body);
        if(req.body.election_type=='FPTP'){
            fptp_candidate_model.find({electedfor:req.body.electedfor,district:req.body.district,constituency:req.body.constituency},function(err,result){
                if(!err)
                {
                    if(result!=null)
                    {
                        var ethAddress=[];
                            for(var i=0;i<result.length;i++){
                                ethAddress.push(result[i].ethAddress);
                                //console.log(result[0].parties[i]);
                            }
                            res.send(ethAddress);
                    }
                    else
                    {
                        res.send("no results found");
                    }
                }
                else
                {
                    console.log(err);
                }
            })

        }
        else
        {
            pr_candidate_model.find({electedfor:req.body.electedfor,district:req.body.district,constituency:req.body.constituency}).populate('parties').exec(function(err,result){
                if(!err)
                {
                    if(result!=null)
                    {
            
                        
                        if(req.body.electedfor=="HOR"){
                            var HOREthAddress=[];
                            for(var i=0;i<result[0].parties.length;i++){
                                HOREthAddress.push(result[0].parties[i].HOREthAddress);
                                //console.log(result[0].parties[i]);
                            }
                            res.send(HOREthAddress);
                            
                        }
                        else{
                            var prEthAddress=[];
                            var state=null;
                            district_model.findOne({district_name:req.body.district},function(err,dist){
                                if(!err){
                                    if(dist){
                                        state=dist.state;
                                        for(var i=0;i<result[0].parties.length;i++){
                                            prEthAddress.push(result[0].parties[i].prEthAddress[state-1]);
                                            //console.log(result[0].parties[i]);
                                        }
                                        res.send(prEthAddress);
                                                                               
                                    }

                                }
                                else{
                                    res.send(err);
                                }
                            });




                        }
                    }
                    else
                    {
                        res.send("no results found");
                    }
                }
                else
                {
                    console.log(err);
                }
            });


        }

    },
    
     
    
};