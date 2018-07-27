const Web3=require('web3');
const setNotification = require('../notification');
var party_model=require('../models/pr_party_model');
var web3=new Web3();

module.exports={
    register:function(req,res){
        console.log(req.body);
        party_model.find({$or:[ {'partyID':req.body.partyID}, {'name':req.body.name}]},function(err,result){
            if(err){
                res.status[500].send(error).end();
                
            }
            else if(result.length){
                res.send("Party Already Registered");
                console.log("party already registered");
                //setNotification(req,true,"error","Party Already Registered");
            }
            else{
                var prAddress=web3.eth.accounts.create();
                var horAddress=web3.eth.accounts.create();
                party_model.create({
                    partyID:req.body.partyID,
                    name:req.body.name,
                    symbolEnglish:req.body.symbolEnglish,
                    symbolNepali:req.body.symbolNepali,
                    prEthAddress:prAddress.address,
                    HOREthAddress:horAddress.address,
                    symbolFilename:req.body.symbolFileName
                },function(err, doc){
                    if(err)
                        res.status(500).send(error).end();
                    else{
                        setNotification(req, true, "success", "Candidate "+req.body.partyName+" has beem registered.");
                        res.redirect('/party/?id='+doc.id);
                    }
                });

            }

        });
        
    },

    registration_success:function(req,res){
        console.log("----------------------------------------");
        console.log(req.query.id);
        var viewModel={
            party : {}
        };
        party_model.findById( req.query.id, function(err, doc){
            viewModel.party=doc;
            //res.send(viewModel);
            res.render('party_info',viewModel);

        });
        
    },

    manage:function(req,res){
        res.render('party_management.ejs');

    },
    
    update_form:function(req,res){
        party_model.findById(req.query.id, function(err, doc){
            viewModel=doc;
            res.render('party_update', viewModel);
               
        });
    },

    update_party_info: function(req, res){
        var url=req.url.split("id=");
        var id=url[1];
        var updatedInfo=req.body;
        delete updatedInfo.submit;
        console.log(updatedInfo);
        
        party_model.findByIdAndUpdate(id,updatedInfo, function(err, result){
            if (!err) {
                setNotification(req, true, "success", "Party updated Successfully");
                res.redirect('/party/manage');
                console.log(result);
            } else {
                setNotification(req, true, "error", "Upadting Party Failed");
                res.redirect('/party/update?id=' + id);
            }
        });
        
       
    },

    delete: function(req, res){
        party_model.findByIdAndRemove(req.body.id, function (err, result) {
            if (!err) {
                res.send(result);
            } else {
                res.status(500).send(error).end();

            }
        })
    }
}