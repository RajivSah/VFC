const Web3=require('web3');
const setNotification = require('../notification');
var pr_candidate_model=require('../models/pr_candidates');
var model_party=require('../models/pr_party_model');
var model_district=require('../models/districts');
var web3=new Web3();

module.exports={
    show_register_form:function(req,res){
        var viewModel={
           districts: [],
           parties : []
        }
        model_district.find({},function(err,dists){
            if (err)
                throw err;

            viewModel.districts=dists;
            model_party.find({},'name',function(err,parties){
                if (err){
                    throw err;
                }
                else{
                    viewModel.parties=parties;
                    console.log(parties);
                    
                    res.render('pr_candidate_register',viewModel);
    
                }
            });
            
        });

        

    },

    show_register_success:function(req,res){
        
        //***********JSON FOR CANDIDATE ************************

        console.log(req.body);
       var candidates={
            "electedFor":req.body.electedfor,
            "district":req.body.district,
            "constituency":req.body.constituency,
            "parties":[]
          };
          var parties=[];
          candidates.parties=parties;
        
        var partiesStr=(JSON.stringify(req.body.party)).replace(/\\r|\\n/g,'');
        var partyStr=partiesStr.split('",');
        var i;
        for(i=0;i<partyStr.length;i++){
                   
            var party_id=partyStr[i].split(',')[0].split('_id:')[1].replace(/\s/,'');
            candidates.parties.push(party_id);
        }
        
        //console.log(candidates);
        //res.send(candidates);

        //***************************************************************************************************************************************************



        // ****** REGISTRATION OF CANDIDATE ON DATA BASE ********************************************************************************************************

        pr_candidate_model.find({$and:[ {'electedfor':candidates.electedFor}, {'district':candidates.district},{'constituency':candidates.constituency}]},function(err,result){
            if(err){
                res.status[500].send(error).end();
                
            }
            else if(result.length){
                
                setNotification(req,true,"error","Candidate Already Registered");
                console.log("Candidate already registered");
            }
            else{
                
                pr_candidate_model.create({
                    electedfor: candidates.electedFor,
                    district:candidates.district,
                    constituency:candidates.constituency,
                    parties:candidates.parties
                },function(err, doc){
                    if(err)
                        res.status(500).send(error).end();
                    else{
                        setNotification(req, true, "success", "Candidate has beem registered.");
                        res.redirect('/pr_candidate/manage');
                    }
                });

            }

        });
        
    },

    candidate_info:function(req,res){
        var viewModel={
            candidate : {}
        };
        pr_candidate_model.findById( req.query.id).populate('parties').exec(function(err,doc){
            console.log(doc);
            viewModel.candidate=doc;
            res.render('pr_candidate_info', viewModel);

        });
        
    },


    getObject:function(req,res){
        console.log(req.body);
    },

    manage:function(req,res){
        res.render('pr_candidate_manage');
    },

    updateForm:function(req,res){
        var viewModel={
            districts: [],
            parties:[],
            candidates : []
         }

        model_district.find({},function(err,dists){
            if (err)
                throw err;

            viewModel.districts=dists;
            
            model_party.find({},'name',function(err,parties){
                if (err){
                        throw err;
                    }
                else{
                    viewModel.parties=parties;
                    pr_candidate_model.findById(req.query.id,function(err,cand){
                        if (err){
                            throw err;
                        }
                        else{
                            viewModel.candidates=cand;
                            //console.log(viewModel);
                            res.render('pr_candidate_update',viewModel);
            
                        }                            
                        
                    });
                        
                }
            });           
            
        });
        
       
        
        
    },

    delete: function(req, res){
        pr_candidate_model.findByIdAndRemove(req.body.id, function (err, result) {
            if (!err) {
                res.send(result);
            } else {
                res.status(500).send(error).end();

            }
        })
    },

    update: function(req, res){
        var url=req.url.split("id=");
        var id=url[1];
        var candidates={
            "electedfor":req.body.electedfor,
            "district":req.body.district,
            "constituency":req.body.constituency,
            "parties":[]
          };
          //var parties=[];
          //candidates.parties=parties;
        
        var partiesStr=(JSON.stringify(req.body.party)).replace(/\\r|\\n/g,'');
        var partyStr=partiesStr.split('",');
        var i;
        for(i=0;i<partyStr.length;i++){
                   
            /*var party={
                "id":partyStr[i].split(',')[0].split('_id:')[1].replace(/\s/,''),
                "name":partyStr[i].split(',')[1].split('name:')[1].split('}')[0].replace(/'/g,'').replace(/\s/,'').replace(/\s([^\s]*)$/,'$1')
            }*/
            candidates.parties.push(partyStr[i].split(',')[0].split('_id:')[1].replace(/\s/,''));

        }
        
        console.log("*********** UPDATED INFO ************");
        console.log(candidates);
        
        pr_candidate_model.findByIdAndUpdate(id,candidates, function(err, result){
            if (!err) {
                setNotification(req, true, "success", "PR Candidate updated Successfully");
                res.redirect('/pr_candidate/manage');
                //console.log(result);
            } else {
                setNotification(req, true, "error", "Upadting PR Candidate Failed");
                res.redirect('/pr_candidate/update?id=' + id);
            }
        });
        
       
    },

    test:function(req,res){
        var cand=[];
        pr_candidate_model.find({electedfor:'PA',district:'Taplejung',constituency:1}).
        populate('parties').
        exec(function(err,candidate){
            if(err)
                return err;
            
            console.log(candidate);
            res.send(candidate);
        });
       
    }
}