var district_model = require('../models/districts');
var fptp_candidate_model = require('../models/fptp_candidate');
var pr_candidate_model = require('../models/pr_candidates');
var ObjectID = require('mongodb').ObjectID;
const voterModel = require('../models/voters');
const Web3 = require('web3');
const config = require('../config');
var web3 = new Web3();
var myContract;

var balanceOf = async (address) => {
    var y = await myContract.methods.balanceOf(address).call();
    return y;
}



module.exports = {

    getResult: function (req, res) {
        var obj = [];
        if (web3.currentProvider == null) {
            web3.setProvider(new Web3.providers.WebsocketProvider(config.web3Connection))
            myContract = new web3.eth.Contract(config.ABI, config.CONTRACT_ADDRESS);
            web3.eth.personal.unlockAccount(config.OWNER_ADDRESS, "r@jivgeth", 0);
        }
        if (req.body.election_type == 'FPTP') {
            fptp_candidate_model.find({ electedfor: req.body.electedfor, district: req.body.district, constituency: req.body.constituency }, function (err, result) {
                if (!err) {
                    if (result != null) {
                        var ethAddress = [];
                        for (var i = 0; i < result.length; i++) {
                            ethAddress.push(result[i].ethAddress);
                            //console.log(result[0].parties[i]);
                        }
                        var count = 0;
                        for (var x = 0; x < result.length; x++) {
                            balanceOf(ethAddress[x]).then((balance) => {
                                obj.push({
                                    [ethAddress[count]]: balance
                                });
                                count = count + 1;
                                if (count == result.length) {
                                    res.send(obj);
                                }
                            });
                        }

                    }
                    else {
                        res.send("no results found");
                    }
                }
                else {
                    console.log(err);
                }
            })

        }
        else {
            pr_candidate_model.find({ electedfor: req.body.electedfor, district: req.body.district, constituency: req.body.constituency }).populate('parties').exec(function (err, result) {
                if (!err) {
                    if (result != null) {


                        if (req.body.electedfor == "HOR") {
                            var HOREthAddress = [];
                            for (var i = 0; i < result[0].parties.length; i++) {
                                HOREthAddress.push(result[0].parties[i].HOREthAddress);
                                //console.log(result[0].parties[i]);
                            }
                            var ethAddress = HOREthAddress;
                            var count = 0;
                            for (var x = 0; x < result[0].parties.length; x++) {
                                balanceOf(ethAddress[x]).then((balance) => {
                                    obj.push({
                                        [ethAddress[count]]: balance
                                    });
                                    count = count + 1;
                                    if (count == result[0].parties.length) {
                                        res.send(obj);
                                    }
                                });
                            }

                        }
                        else {
                            var prEthAddress = [];
                            var state = null;
                            district_model.findOne({ district_name: req.body.district }, function (err, dist) {
                                if (!err) {
                                    if (dist) {
                                        state = dist.state;
                                        for (var i = 0; i < result[0].parties.length; i++) {
                                            prEthAddress.push(result[0].parties[i].prEthAddress[state - 1]);
                                            //console.log(result[0].parties[i]);
                                        }
                                        var ethAddress = prEthAddress;
                                        var count = 0;
                                        for (var x = 0; x < result[0].parties.length; x++) {
                                            balanceOf(ethAddress[x]).then((balance) => {
                                                obj.push({
                                                    [ethAddress[count]]: balance
                                                });
                                                count = count + 1;
                                                if (count == result[0].parties.length) {
                                                    res.send(obj);
                                                }
                                            });
                                        }

                                    }

                                }
                                else {
                                    res.send(err);
                                }
                            });




                        }
                    }
                    else {
                        res.send("no results found");
                    }
                }
                else {
                    console.log(err);
                }
            });


        }

    },



};