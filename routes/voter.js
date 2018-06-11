const router = require('express').Router();
const voterModel = require('../models/voters');

router.get('/', function (req, res) {
    if (req.query.id) {
        voterModel.findById(req.query.id, function (err, doc) {
            res.render('voterInfo', { voter: doc, pk: pk });
            pk = null;
        });

    } else {
        res.render('voterRegister');
    }

});

router.get('/register', function (req, res) {

    res.render('voterRegister');
});

router.get('/manage', function (req, res) {
    res.render('voterManage');
});


router.get('/update', function (req, res) {
    voterModel.findById(req.query.id, function (err, doc) {
        if (!err) {
            res.render('voterUpdate');
        }
    })
});

module.exports = router;
