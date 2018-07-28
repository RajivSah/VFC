const Web3=require('web3');
const setNotification = require('../notification');
var model_district=require('../models/districts');
var fptp_candidate_model=require('../models/fptp_candidate');
var candidate_api=require('../api/candidate');
var web3=new Web3();

var fs=require('fs'),
path=require('path');

module.exports={
    index: function(req, res) {
        var viewModel={
            candidates: []
        };
        console.log("Acessed candidate index function");
        fptp_candidate_model.find(function(err, candidates){
            viewModel.candidates=candidates;
            res.render('candidate_home', viewModel);
        });
        
    },

    fptpRegistration: function(req, res){
        var viewModel={
            districts: []
           
        }

        model_district.find({}, function(err, dists)
    {
        if(err)
            throw err;

        viewModel.districts=dists;
        res.render('fptp_candidate_register', viewModel);
    });
        
        
    },

    fptpManagement: function(req, res)
    {
        var url="http://www.google.com";
        res.render('fptp_candidate_management');
    },

    
    // POst controller for FPTP registration
    register: function(req, res)
    {

        fptp_candidate_model.find({  "citizenshipNo": req.body.citizenshipNo }, function(err, result){
            if(err) {
                res.status[500].send(error).end();
            } else if(result.length) {
                setNotification(req, true, "error", "Candidate Already Exists");
            } else {
                        console.log(req.file);

                        var saveImage=function()  {
                            var possible='abcdefghijklmnopqrstuvwxyz0123456789'
                            imgUrl= '';
                        //
                            for( var i=0; i<10; i+=1) {
                            imgUrl+=possible.charAt(Math.floor(Math.random()*possible.length));
                            }
                        //  Search for an image with the same filename by performing a find:

                        fptp_candidate_model.find({  "symbolFileName": imgUrl}, function(err, result){
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

                                var candidateAddress=web3.eth.accounts.create();
                            // console.log(candidateAddress);
                            
                            fptp_candidate_model.create({
                                district: req.body.district, 
                                constituency: req.body.constituency,
                                electedfor: req.body.electedfor ,
                                candidateName_np: req.body.candidateName_np, 
                                candidateName_eng: req.body.candidateName_eng,
                                citizenshipNo: req.body.citizenshipNo,
                                fatherName: req.body.fatherName,
                                motherName: req.body.motherName,
                                dob: req.body.dob,
                                sex: req.body.sex,
                                partyId: req.body.partyId, 
                                partyName:req.body.partyName,
                                symbolId: 1,
                                symbolName: req.body.symbolName,
                                symbolFileName: imgUrl+ext,
                                ethAddress: candidateAddress.address
                            }, function(err, doc){
                                if(err)
                                res.status(500).send(error).end();
                                else{
                                    setNotification(req, true, "success", "Candidate "+req.body.candidateName_eng+" has beem registered.");
                                    res.redirect('/candidate/fptp_candidate/?id='+doc.id);
                                }
                            }) 
                    
                            });
                            } else {
                            fs.unlink(tempPath, function() {
                                if(err) throw err;
                                res.json(500, {error: 'Only image files are allowed.'});
                            });
                            }
                    
                        };
                        saveImage();

                    }
                });
        

        // console.log("Name:" ,req.body.candidateName_eng );
        // fptp_candidate_model.find({  "citizenshipNo": req.body.citizenshipNo }, function(err, result){
        //     if(err) {
        //         res.status[500].send(error).end();
        //     } else if(result.length) {
        //         setNotification(req, true, "error", "Candidate Already Exists");
        //     } else {
        //         var candidateAddress=web3.eth.accounts.create();
        //         // console.log(candidateAddress);
                
        //         fptp_candidate_model.create({
        //             district: req.body.district, 
        //             constituency: req.body.constituency_selector,
        //             electedfor: req.body.electedfor ,
        //             candidateName_np: req.body.candidateName_np, 
        //             candidateName_eng: req.body.candidateName_eng,
        //             citizenshipNo: req.body.citizenshipNo,
        //             fatherName: req.body.fatherName,
        //             motherName: req.body.motherName,
        //             dob: req.body.dob,
        //             sex: req.body.sex,
        //             partyId: req.body.partyId, 
        //             partyName:req.body.partyName,
        //             symbolId: 1,
        //             symbolName: "Nepali Flag",
        //             symbolFileName: 'flag.jpg',
        //             ethAddress: candidateAddress.address
        //         }, function(err, doc){
        //             if(err)
        //             res.status(500).send(error).end();
        //             else{
        //                 setNotification(req, true, "success", "Candidate "+req.body.candidateName_eng+" has beem registered.");
        //                 res.redirect('/candidate/fptp_candidate/?id='+doc.id);
        //             }
        //         }) 
        //     }
        // });

    }, 
    
    fptp_candidate_registration_success: function(req, res)
    {
        console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%');
        // res.json(req.query.id);
        var viewModel={
            candidate : {}
        };
        fptp_candidate_model.findById( req.query.id, function(err, doc){
            viewModel.candidate=doc;
            res.render('fptp_candidate_info', viewModel);

        });


        // console.log('Printingggggggggggggggggggggggggggggggggggggggggggggggggg');
        // console.log(candidate);
        // res.render('fptp_candidate_info', viewModel);
    },

    update_form_for_fptp_candidate: function(req, res)
    {
        var viewModel={
            districts: []
           
        };

       
        fptp_candidate_model.findById(req.query.id, function(err, result){
            if(!err) {
                model_district.find(function(err, dists)
                {
                    if(err)
                        throw err;
            
                    viewModel.districts=dists;
                    res.render('fptp_candidate_update', viewModel);
                });
              
            }
        });
    },
    update_fptp_candidate_info: function(req, res){
        var updatedInfo=req.body;
        delete updatedInfo.submit;
        console.log(req.body);
        console.log(req.params.id);
        fptp_candidate_model.findByIdAndUpdate(req.params.id, updatedInfo, function(err, result){
            if (!err) {
                setNotification(req, true, "success", "Voter updated Successfully");
                res.redirect('/candidate/fptp/manage');
            } else {
                setNotification(req, true, "error", "Upadting Voter Failed");
                res.redirect('/candidate/fptp/update?id=' + req.params.id);
            }
        });
    },
    delete: function(req, res){
        fptp_candidate_model.findByIdAndRemove(req.body.id, function (err, result) {
            if (!err) {
                res.send(result);
            } else {
                res.status(500).send(error).end();

            }
        })
    },

    test: function(req, res)
    {
        console.log(req.body.fatherName);
        res.redirect('/');
    }

};