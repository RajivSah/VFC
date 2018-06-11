const express = require('express');
const adminRoute = express.Router();
const config = require('../config');
const voterModel = require('../models/voters');

adminRoute.get('/', (req, res) => {
    var data = {};
    data.ownerAddress = config.OWNER_ADDRESS;
    data.contractAddress = config.CONTRACT_ADDRESS;
    voterModel.count({}, function (err, count) {
        data.count = count;
        voterModel.count({ voted: true }, function (err, count) {
            data.voted = count;
            res.render('home', { data: data });
        });
    });
});

adminRoute.route('/createUser')
    .get(function (req, res) {
        res.render('admin-addUser');
    });

adminRoute.route('/searchUser')
    .get(function (req, res) {
        res.render('admin-searchUser');
    });

adminRoute.route('/contract')
    .get(function (req, res) {
        res.render('contract');
    });


module.exports = adminRoute;