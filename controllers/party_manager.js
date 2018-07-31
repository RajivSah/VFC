const Web3=require('web3');
const setNotification = require('../notification');
var party_model=require('../models/pr_party_model');
var web3=new Web3();
var config = require('../config');
var fs=require('fs'),
path=require('path');


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
                

                var saveImage=function()  {
                    var possible='abcdefghijklmnopqrstuvwxyz0123456789'
                    imgUrl= '';
                //
                    for( var i=0; i<10; i+=1) {
                    imgUrl+=possible.charAt(Math.floor(Math.random()*possible.length));
                    }
                //  Search for an image with the same filename by performing a find:

                party_model.find({'symbolFileName':imgUrl},function(err,result){
                    if(result.length>0) {
                        saveImage();
                    }
                    

                });

                    console.log('File path for the image: ', req.file.filename);
                    var tempPath=req.file.path,
                        ext=path.extname(req.file.originalname).toLowerCase(),
                        targetPath=path.resolve('./public/uploads/electionSymbols/'+imgUrl + ext );
            
                //
                        console.log('Extrension:::::',ext);
                //
                    if (ext=='.jpg' || ext=='.png' || ext=='.jpeg' || ext=='.gif') {
                    fs.rename(tempPath, targetPath, function (err){
                        if (err) throw err;

                        var prAddress=web3.eth.accounts.create();
                        var horAddress=web3.eth.accounts.create();
                        party_model.create({
                            partyID:req.body.partyID,
                            name:req.body.name,
                            symbolEnglish:req.body.symbolEnglish,
                            symbolNepali:req.body.symbolNepali,
                            prEthAddress:prAddress.address,
                            HOREthAddress:horAddress.address,
                            symbolFilename:imgUrl+ext
                        },function(err, doc){
                            if(err)
                                res.status(500).send(error).end();
                            else{
                                config.db_fptp.insert({ address: prAddress.address, txHash: null, timestamp: Date.now() });
                                config.db_fptp.insert({ address: horAddress.address, txHash: null, timestamp: Date.now() });
                                setNotification(req, true, "success", "Candidate has beem registered.");
                                res.redirect('/party/?id='+doc.id);
                            }
                        });
            
                    });
                    } else {
                    fs.unlink(tempPath, function() {
                        if(err) throw err;
                        res.json(500, {error: 'Only image files are allowed.'});
                    });
                    }
            
                };
                saveImage();



                // var prAddress=web3.eth.accounts.create();
                // var horAddress=web3.eth.accounts.create();
                // party_model.create({
                //     partyID:req.body.partyID,
                //     name:req.body.name,
                //     symbolEnglish:req.body.symbolEnglish,
                //     symbolNepali:req.body.symbolNepali,
                //     prEthAddress:prAddress.address,
                //     HOREthAddress:horAddress.address,
                //     symbolFilename:req.body.symbolFileName
                // },function(err, doc){
                //     if(err)
                //         res.status(500).send(error).end();
                //     else{
                //         setNotification(req, true, "success", "Candidate "+req.body.partyName+" has beem registered.");
                //         res.redirect('/party/?id='+doc.id);
                //     }
                // });

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