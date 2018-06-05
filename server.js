const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const config = require('./config')
const Web3 = require('web3');
const fs = require('fs');
const voterModel = require('./models/voters');
const crypto = require('crypto');
const session = require('express-session');
const userModel = require('./models/users');
const url =require('url');

var router = express.Router();
var app = express();
var pk = null;
app.set('view engine', 'ejs');

app.use('/plugins', express.static(__dirname + '/plugins'));
app.use('/public', express.static(__dirname + '/public'));
app.use('/test', express.static(__dirname + '/test'));

app.use(session({
    key: 'user_sid',
    resave: false,
    secret: 'sussh',
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}));
// app.use((req, res, next) => {
//     console.log(req.url);
//     next();
// });
app.use((req, res, next) => {
    if (!req.session.user && url.parse(req.url).pathname != '/login' && req.url != '/notification') {
        res.redirect('/login');
    } else {
        next();
    }
});

var sessionChecker = (req, res, next) => {
    if (req.session.user) {
        var role = req.session.role;
        res.redirect(getPage(role));
    } else {
        next();
    }
};

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

var notification = {
    toNotify: false,
    type: null,
    message: null
}


var setNotification = function (req, notify, Type = null, Message = null) {
    notification.toNotify = notify;
    notification.type = Type;
    notification.message = Message;
    req.session.notification = notification;
}

var web3 = new Web3();
var myContract;
if (web3.setProvider(new Web3.providers.WebsocketProvider('ws://127.0.0.1:8546'))) {
    console.log('*************************');
    web3.eth.net.isListening().then(console.log);
    myContract = new web3.eth.Contract(config.ABI, config.OWNER_ADDRESS);
}

connectDb = function (username = 'rajiv', password = 'rajiv') {
    mongoose.connect(`mongodb://${username}:${password}@ds133630.mlab.com:33630/vfc`, (error) => {
        if (!error) {
            console.log("connected to Database: VFC");
        } else {
            console.log("Error: ", error);
        }
    });
}
connectDb();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});


// app.get('/', sessionChecker, (req, res) => {
//     res.redirect('/login');
// });

app.get('/notification', function (req, res) {
    res.json(req.session.notification).end();
});

app.get('/clearNotification', function (req, res) {
    setNotification(req, false);
    res.json(req.session.notification).end();
});

app.route('/login')
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


// admin

app.get('/admin', (req, res) => {
    res.render('admin');
});

app.route('/admin/createUser')
    .get(function (req, res) {
        res.render('admin-addUser');
    });

app.route('/admin/searchUser')
    .get(function (req, res) {
        res.render('admin-searchUser');
    });

app.route('/api/users')
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
                    console.log(data)
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
                    setNotification(req, true, "success", "User added successfully");
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

app.get('/voter', function (req, res) {
    if (req.query.id) {
        voterModel.findById(req.query.id, function (err, doc) {
            res.render('voterInfo', { voter: doc, pk: pk });
            pk = null;
        });

    } else {
        res.render('voterRegister');
    }

});

app.get('/voter/register', function (req, res) {

    res.render('voterRegister');
});

app.get('/voter/manage', function (req, res) {
    res.render('voterManage');
});


app.get('/voter/update', function (req, res) {
    voterModel.findById(req.query.id, function (err, doc) {
        if (!err) {
            res.render('voterUpdate');
        }
    })
})

app.post('/api/voter/:id', function (req, res) {
    var updatedInfo = req.body;
    delete updatedInfo.submit;
    voterModel.findByIdAndUpdate(req.params.id, updatedInfo, function (err, result) {
        if (!err) {
            setNotification(req, true, "success", "Voter added Successfully");
            res.redirect('/voter/manage');
        } else {
            setNotification(req, true, "error", "Upadting Voter Failed");
            res.redirect('/voter/update?id=' + req.params.id);
        }
    });
});

app.route('/api/voter')
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
                    pkHash: pkHash
                }, function (error, doc) {
                    if (error) {
                        res.status(500).send(error).end();
                        console.log(error);
                    } else {
                        setNotification(req, true, "success", "Voter Added Successfully");
                        pk = voterAddress.privateKey;
                        res.redirect('/voter?id=' + doc.id);
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
                    var votersDetails = {};
                    votersDetails.total = docs.length;
                    votersDetails.rows = docs;
                    res.json(votersDetails);
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

app.get('/logout', (req, res) => {
    if (req.session.user) {
        req.session.destroy();
        res.redirect('/');
    } else {
        res.redirect('/login');
    }
});



app.listen(config.PORT, function (err) {
    if (!err) {
        console.log("Listening at PORT: ", config.PORT);
    }
});
