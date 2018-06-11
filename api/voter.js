const router = require('express').Router();
const voterModel = require('../models/voters');

router.post('/:id', function (req, res) {
    var updatedInfo = req.body;
    delete updatedInfo.submit;
    voterModel.findByIdAndUpdate(req.params.id, updatedInfo, function (err, result) {
        if (!err) {
            setNotification(req, true, "success", "Voter updated Successfully");
            res.redirect('/voter/manage');
        } else {
            setNotification(req, true, "error", "Upadting Voter Failed");
            res.redirect('/voter/update?id=' + req.params.id);
        }
    });
});

router.route('/')
    .post(function (req, res) {
        voterModel.find({ $or: [{ "formNo": req.body.formNo }, { "citizenshipNo": req.body.citizenshipNo }] }, function (err, result) {
            if (err) {
                res.status(500).send(error).end();
                console.log(error);
            } else if (result.length) {
                setNotification(req, true, "error", "Voter Already Exists");
                res.redirect('/voter/register');
            } else {
                var voterAddress = web3.eth.accounts.create();

                const hash = crypto.createHash('sha256');
                hash.update(voterAddress.privateKey);
                var pkHash = hash.digest('hex');

                voterModel.create({
                    formNo: req.body.formNo,
                    fullName: req.body.fullName,
                    DOB: req.body.dob,
                    sex: req.body.sex,
                    fatherName: req.body.fatherName,
                    motherName: req.body.motherName,
                    citizenshipNo: req.body.citizenshipNo,
                    voted: false,
                    district: req.body.district,
                    address: req.body.address,
                    ethAddress: voterAddress.address,
                    nagarpalikaNo: req.body.nagarpalikaNo,
                    pkHash: pkHash,
                    tokenTransferred: false
                }, function (error, doc) {
                    if (error) {
                        res.status(500).send(error).end();
                        console.log(error);
                    } else {
                        web3.eth.
                        myContract.methods.addVoter(doc.ethAddress).send({ from: config.OWNER_ADDRESS })
                            .on('transactionHash', function (hash) {
                                console.log(hash);

                                setNotification(req, true, "success", "Voter Added Successfully");
                                pk = voterAddress.privateKey;
                                res.redirect('/voter?id=' + doc.id);
                            })
                            .on('confirmation', function (confNo, receipt) {
                                console.log(confNo);
                            })
                            .on('receipt', function (receipt) {
                                console.log("receipt received");
                            })
                            .on('error', function (error) {
                                console.log(error);
                            });
                    }
                });
            }
        });

    })
    .get(function (req, res) {
        if (req.query.id) {
            voterModel.findById(req.query.id, function (err, doc) {
                if (!err) {
                    res.json(doc);
                } else {
                    res.status(500).send(err).end();
                }
            });
        } else {
            voterModel.find(function (err, docs) {
                if (!err) {
                    // var votersDetails = {};
                    // votersDetails.total = docs.length;
                    // votersDetails.rows = docs;
                    // res.json(votersDetails);
                    res.json(docs);
                } else {
                    res.status(500).send(err).end();
                }
            });
        }

    })
    .delete(function (req, res) {
        voterModel.findByIdAndRemove(req.body.id, function (err, result) {
            if (!err) {
                res.send(result);
            } else {
                res.status(500).send(error).end();

            }
        })
    });

module.exports = router;