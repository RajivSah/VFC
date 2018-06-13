// const Web3=require('web3');
const setNotification = require('../notification');
var model_district=require('../models/districts');
var fptp_candidate_model=require('../models/fptp_candidate');
// var web3=new Web3();
module.exports={
    index: function(req, res) {
        console.log("Acessed candidate index function");
        res.render('candidate_home');
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

    create: function(req, res)
    {
        console.log("Create Function");
        var districts=[
            {
                name: "Taplejung",
                "no_of_Hor": 1,
                "no_of_prov":2
            },
            {
                name: "Panchthar",
                "no_of_Hor": 1,
                "no_of_prov":2
            },
            {
                name: "Ilam",
                "no_of_Hor": 2,
                "no_of_prov":4
            },
            {
                name: "Jhapa",
                "no_of_Hor": 5,
                "no_of_prov":10
            },
            {
                name: "Sankhuwasabha",
                "no_of_Hor": 1,
                "no_of_prov":2
            },
            {
                name: "Terhathum",
                "no_of_Hor": 1,
                "no_of_prov":2
            },
            {
                name: "Bhojpur",
                "no_of_Hor": 1,
                "no_of_prov":2
            },
            {
                name: "Dhankuta",
                "no_of_Hor": 1,
                "no_of_prov":2
            },
            {
                name: "Morang",
                "no_of_Hor": 6,
                "no_of_prov":12
            },
            {
                name: "Sunsari",
                "no_of_Hor": 4,
                "no_of_prov":8
            },
            {
                name: "Solukhumbu",
                "no_of_Hor": 1,
                "no_of_prov":2
            },
            {
                name: "Khotang",
                "no_of_Hor": 1,
                "no_of_prov":2
            },
            {
                name: "Okhaldhunga",
                "no_of_Hor": 1,
                "no_of_prov":2
            },
            {
                name: "Udayapaur",
                "no_of_Hor": 2,
                "no_of_prov":4
            },
            {
                name: "Saptari",
                "no_of_Hor": 4,
                "no_of_prov":8
            },
            {
                name: "Siraha",
                "no_of_Hor": 4,
                "no_of_prov":8
            },
            {
                name: "Dolakha",
                "no_of_Hor": 1,
                "no_of_prov":2
            },
            {
                name: "Ramechhap",
                "no_of_Hor": 1,
                "no_of_prov":2
            },
            {
                name: "Sindhuli",
                "no_of_Hor": 2,
                "no_of_prov":4
            },
            {
                name: "Dhanusha",
                "no_of_Hor": 4,
                "no_of_prov":8
            },
            {
                name: "Mahottari",
                "no_of_Hor": 4,
                "no_of_prov":8
            },
            {
                name: "Sarlahi",
                "no_of_Hor": 4,
                "no_of_prov":8
            },
            {
                name: "Rasuwa",
                "no_of_Hor": 1,
                "no_of_prov":2
            },
            {
                name: "Dhading",
                "no_of_Hor": 2,
                "no_of_prov":4
            },
            {
                name: "Nuwakot",
                "no_of_Hor": 2,
                "no_of_prov":4
            },
            {
                name: "Kathmandu",
                "no_of_Hor": 10,
                "no_of_prov":20
            },
            {
                name: "Bhaktapur",
                "no_of_Hor": 2,
                "no_of_prov":4
            },
            {
                name: "Lalitpur",
                "no_of_Hor": 3,
                "no_of_prov":6
            },
            {
                name: "Kabhrepalanchowk",
                "no_of_Hor": 2,
                "no_of_prov":4
            },
            {
                name: "Sindhupalchowk",
                "no_of_Hor": 2,
                "no_of_prov":4
            },
            {
                name: "Makwanpur",
                "no_of_Hor": 2,
                "no_of_prov":4
            },
            {
                name: "Rautahat",
                "no_of_Hor": 4,
                "no_of_prov":8
            },
            {
                name: "Bara",
                "no_of_Hor": 4,
                "no_of_prov":8
            },
            {
                name: "Parsa",
                "no_of_Hor": 4,
                "no_of_prov":8
            },
            {
                name: "Chitawan",
                "no_of_Hor": 3,
                "no_of_prov":6
            },
            {
                name: "Gorkha",
                "no_of_Hor": 2,
                "no_of_prov":4
            },
            {
                name: "Manang",
                "no_of_Hor": 1,
                "no_of_prov":2
            },
            {
                name: "Lamjung",
                "no_of_Hor": 1,
                "no_of_prov":2
            },
            {
                name: "Kaski",
                "no_of_Hor": 3,
                "no_of_prov":6
            },
            {
                name: "Tanahaun",
                "no_of_Hor": 2,
                "no_of_prov":4
            },
            {
                name: "Syangja",
                "no_of_Hor": 2,
                "no_of_prov":4
            },
            {
                name: "Gulmi",
                "no_of_Hor": 2,
                "no_of_prov":4
            },
            {
                name: "Palpa",
                "no_of_Hor": 2,
                "no_of_prov":4
            },
            {
                name: "Arghakhanchi",
                "no_of_Hor": 1,
                "no_of_prov":2
            },
            {
                name: "Nawalparasi (Bardaghat East)",
                "no_of_Hor": 2,
                "no_of_prov":4
            },
            {
                name: "Nawalparasi (Bardaghat West)",
                "no_of_Hor": 2,
                "no_of_prov":4
            },
            {
                name: "Rupandehi",
                "no_of_Hor": 5,
                "no_of_prov":10
            },
            {
                name: "Kapilbastu",
                "no_of_Hor": 3,
                "no_of_prov":6
            },
            {
                name: "Mustang",
                "no_of_Hor": 1,
                "no_of_prov":2
            },
            {
                name: "Myagdi",
                "no_of_Hor": 1,
                "no_of_prov":2
            },
            {
                name: "Baglung",
                "no_of_Hor": 2,
                "no_of_prov":4
            },
            {
                name: "Parbat",
                "no_of_Hor": 1,
                "no_of_prov":2
            },
            {
                name: "Rukum East",
                "no_of_Hor": 1,
                "no_of_prov":2
            },
            {
                name: "Rukum West",
                "no_of_Hor": 1,
                "no_of_prov":2
            },
            {
                name: "Rolpa",
                "no_of_Hor": 1,
                "no_of_prov":2
            },
            {
                name: "Pyuthan",
                "no_of_Hor": 1,
                "no_of_prov":2
            },
            {
                name: "Salyan",
                "no_of_Hor": 1,
                "no_of_prov":2
            },
            {
                name: "Dang",
                "no_of_Hor": 3,
                "no_of_prov":6
            },
            {
                name: "Dolpa",
                "no_of_Hor": 1,
                "no_of_prov":2
            },
            {
                name: "Mugu",
                "no_of_Hor": 1,
                "no_of_prov":2
            },
            {
                name: "Jumla",
                "no_of_Hor": 1,
                "no_of_prov":2
            },
            {
                name: "Kalikot",
                "no_of_Hor": 1,
                "no_of_prov":2
            },
            {
                name: "Humla",
                "no_of_Hor": 1,
                "no_of_prov":2
            },
            {
                name: "Jajarkot",
                "no_of_Hor": 1,
                "no_of_prov":2
            },
            {
                name: "Dailekh",
                "no_of_Hor": 2,
                "no_of_prov":4
            },
            {
                name: "Surket",
                "no_of_Hor": 2,
                "no_of_prov":4
            },
            {
                name: "Banke",
                "no_of_Hor": 3,
                "no_of_prov":6
            },
            {
                name: "Bardiya",
                "no_of_Hor": 2,
                "no_of_prov":4
            },
            {
                name: "Bajura",
                "no_of_Hor": 1,
                "no_of_prov":2
            },
            {
                name: "Achham",
                "no_of_Hor": 2,
                "no_of_prov":4
            },
            {
                name: "Bajhang",
                "no_of_Hor": 1,
                "no_of_prov":2
            },
            {
                name: "Doti",
                "no_of_Hor": 1,
                "no_of_prov":2
            },
            {
                name: "Kailali",
                "no_of_Hor": 5,
                "no_of_prov":10
            },
            {
                name: "Darchula",
                "no_of_Hor": 1,
                "no_of_prov":2
            },
            {
                name: "Baitadi",
                "no_of_Hor": 1,
                "no_of_prov":2
            },
            {
                name: "Dadeldhura",
                "no_of_Hor": 1,
                "no_of_prov":2
            },
            {
                name: "Kanchanpur",
                "no_of_Hor": 3,
                "no_of_prov":6
            }
            
            
        ];

        for (var i=0; i<districts.length; i++){
            // console.log(districts[i]);
            console.log(i);
            var newDist=new model_district({
                district_name: districts[i].name,
                no_of_Hor: districts[i].no_of_Hor,
                no_of_prov: districts[i].no_of_prov
            });

            newDist.save(function(err, dis){
                console.log(dis);
                if(err) {
                    console.log("Error occured");
                    throw err;
                }
                else 
                    console.log("Succes");
            });

           
            

    }

    res.redirect('https://www.google.com');
    },
    
    register: function(req, res)
    {
        console.log("Citizenship:" ,req.body.citizenshipNo );
        fptp_candidate_model.find({  "citizenshipNo": req.body.citizenshipNo }, function(err, result){
            if(err) {
                res.status[500].send(error).end();
            } else if(result.length) {
                setNotification(req, true, "error", "Candidate Already Exists");
            } else {
                // var candidateAddress=web3.eth.accounts.create();
                // console.log(candidateAddress);
                
                fptp_candidate_model.create({
                    district: req.body.district_selector, 
                    constituency: req.body.constituency_selector,
                    electedfor: req.body.election_selector ,
                    candidateName_np: req.body.fullName_np, //
                    candidateName_eng: req.body.fullName_eng,
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
                    ethAddress: 'Hello'
                }, function(err, doc){
                    if(err)
                    res.status(500).send(error).end();
                    else{
                        setNotification(req, true, "success", "Candidate "+req.body.fullName_eng+" has beem registered.");
                        res.redirect('https://www.google.com');
                    }
                }) 
            }
        });

    }, 

    test: function(req, res)
    {
        console.log(req.body.fatherName);
        res.redirect('/');
    }

};