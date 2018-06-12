const router = require('express').Router();
const userModel = require('../models/users');

var getPage = function (role) {
    switch (role) {
        case 'Admin':
            return ('/admin');
            break;
        case 'voter-manager':
            return ('/voter');
            break;
    }
}

router.route('/')
    .get(function (req, res) {
        res.render('login');
    })
    .post(function (req, res) {
        var username = req.body.userName;
        var password = req.body.password;

        // const hash = crypto.createHash('sha256');
        // hash.update(password);
        // password = hash.digest('hex');

        userModel.findOne({ username: username }).then(function (user) {
            if (!user) {
                res.redirect('/login?error=user');
            } else if (password == user.password) {
                req.session.user = user.username;
                req.session.role = user.role;
                console.log(getPage(user.role));
                res.redirect(getPage(user.role));
            } else {
                res.redirect('/login?error=password');
            }

        });
    });

module.exports = router;


  