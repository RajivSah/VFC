const router = require('express').Router();
const config = require('../config');
const bodyPraser = require('body-parser');
const voterModel = require('../models/voters');

router.get('/', function (req, res) {
    res.render('../views/voting.ejs');
});

router.post('/validateUser', function(req, res) {
    const pkHash = req.body.pkHash;
    voterModel.findOne({pkHash: pkHash}, function(err, result) {
        if(!err) {
            if (result) {
            res.end("true");
            } else {
                res.end("false");
            }
        } 
    });
});


module.exports = router;
