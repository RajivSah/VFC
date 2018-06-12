const express  = require('express');
const router = express.Router();
const config = require('../config');
const userModel = require('../models/users');
const setNotification = require('../notification');


router.route('/')
    .get(function (req, res) {
        userModel.find(function (err, result) {
            if (!err) {
                new Promise(function (resolve, reject) {
                    var data = [];
                    result.forEach((value, index) => {
                        data.push({ sn: index + 1, username: value.username, role: value.role, id: value.id });
                    });
                    resolve(data);
                }).then((data) => {
                    res.json(data);
                });
            }
        });
    })
    .post(function (req, res) {
        var user = req.body
        userModel.findOne({ username: user.username }, function (err, result) {
            if (err) {
                setNotification(req, true, "error", "Error While ading User");
                res.status(500).send().end();
            } else if (result) {
                setNotification(req, true, "error", "Username already exists");
                res.redirect('/admin/createUser');
            } else {
                userModel.create({
                    username: user.username,
                    password: user.password,
                    role: user.role
                }, function (err, doc) {
                    if (!err){
                        setNotification(req, true, "success", "User added successfully");
                    } else {
                        setNotification(req, true, "error", "User Failed to add");
                    }
                    res.redirect('/admin/createUser');
                });
            }
        });
    })
    .delete(function (req, res) {
        userModel.findByIdAndRemove(req.body.id, function (err, result) {
            if (!err) {
                res.send("user deleted sucessfully");
            } else {
                res.status(500).send(err);
            }
        });

    });

module.exports = router;

