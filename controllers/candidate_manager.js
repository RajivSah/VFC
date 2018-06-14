const Web3=require('web3');
const setNotification = require('../notification');
var model_district=require('../models/districts');
var fptp_candidate_model=require('../models/fptp_candidate');
var candidate_api=require('../api/candidate');
var web3=new Web3();
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

    
    register: function(req, res)
    {
        console.log("Name:" ,req.body.candidateName_eng );
        fptp_candidate_model.find({  "citizenshipNo": req.body.citizenshipNo }, function(err, result){
            if(err) {
                res.status[500].send(error).end();
            } else if(result.length) {
                setNotification(req, true, "error", "Candidate Already Exists");
            } else {
                var candidateAddress=web3.eth.accounts.create();
                // console.log(candidateAddress);
                
                fptp_candidate_model.create({
                    district: req.body.district_selector, 
                    constituency: req.body.constituency_selector,
                    electedfor: req.body.election_selector ,
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
                    symbolName: "Nepali Flag",
                    symbolFileName: 'flag.jpg',
                    ethAddress: candidateAddress.address
                }, function(err, doc){
                    if(err)
                    res.status(500).send(error).end();
                    else{
                        setNotification(req, true, "success", "Candidate "+req.body.candidateName_eng+" has beem registered.");
                        res.redirect('/candidate/fptp_candidate/?id='+doc.id);
                    }
                }) 
            }
        });

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