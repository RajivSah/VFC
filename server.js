const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const config = require('./config')
const Web3 = require('web3');
const fs = require('fs');
const voterModel = require('./models/voters');
const candidateModel = require('./models/fptp_candidate');
const crypto = require('crypto');
const session = require('express-session');
const userModel = require('./models/users');
const url = require('url');
var routes = require('./routes/fptp_candidate');
var pr_candidate_routes = require('./routes/pr_candidate_routes');
var party_routes = require('./routes/party_routes');
var router = express.Router();
var app = express();
var multer = require('multer');

const logger = require('./logger');
const adminRoute = require('./routes/admin');
const userApi = require('./api/user');
const loginRoute = require('./routes/login');
const voterRoute = require('./routes/voter');
const votingRoute = require('./routes/voting');
const voterApi = require('./api/voter');
const Datastore = require('nedb');
const path = require('path');

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
        case 'admin':
            return ('/admin');
            break;
        case 'voter-manager':
            return ('/voter');
            break;

        case 'candidate-manager':
            return ('/candidate');
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

app.use((req, res, next) => {
    if (web3.currentProvider == null) {
        web3.setProvider(new Web3.providers.WebsocketProvider(config.web3Connection))
        myContract = new web3.eth.Contract(config.ABI, config.CONTRACT_ADDRESS);
        web3.eth.personal.unlockAccount(config.OWNER_ADDRESS, "r@jivgeth", 0);

        fs.readFile('./logs/tokenTransfer.log', function (err, data) {
            var blockNumber = parseInt(data.toString('utf8'));
            console.log(blockNumber);
            myContract.events.RegisteredVoter({ fromBlock: blockNumber })
                .on('data', function (data) {
                    console.log("data received");
                    fs.writeFileSync('./logs/tokenTransfer.log', data.blockNumber + 1);
                    voterModel.findOneAndUpdate({ ethAddress: data.returnValues.voter }, { tokenTransferred: true }, function (err, result) {
                        if (!err) {
                            console.log("status approved", data.returnValues.voter);
                        }
                    });

                    config.db.remove({ address: data.returnValues.voter }, { multi: false }, function (err, number) {
                        if (!err) console.log("removed data: ", number);
                    });

                })
                .on('error', function (error) {
                    console.log(error);
                });

                myContract.events.RegisteredCandidate({fromBlock: blockNumber})
                .on('data', function(data) {
                    fs.writeFileSync('./logs/tokenTransfer.log', data.blockNumber + 1);
                    candidateModel.findOneAndUpdate({ ethAddress: data.returnValues.candidate}, {registered: true}, function(err, result) {
                        if(!err) {
                            console.log("fptp candidate registered", data.returnValues.candidate);
                        }
                    });

                    config.db_fptp.remove({ address: data.returnValues.candidate}, {multi: false}, function(err, number) {
                        if(!err) console.log("removed candidate fom log: ", number);
                    });
                })
                .on('error', function (error) {
                    console.log(error);
                });


        });

        // fs.readFile('./logs/tokenTansfer.log', function(err, data) {
        //     var blockNumber = parseInt(data.toString('utf8'));
        //     console.log(blockNumber);
        //     myContract.events.RegisteredCandidate({fromBlock: blockNumber})
        //         .on('data', function(data) {
        //             fs.writeFileSync('./logs/tokenTransfer.log', data.blockNumber + 1);
        //             candidateModel.findOneAndUpdate({ ethAddress: data.returnValues.candidate}, {registered: true}, function(err, result) {
        //                 if(!err) {
        //                     console.log("fptp candidate registered", data.returnValues.candidate);
        //                 }
        //             });

        //             config.db_fptp.remove({ address: data.returnValues.candidate}, {multi: false}, function(err, number) {
        //                 if(!err) console.log("removed candidate fom log: ", number);
        //             });
        //         })
        //         .on('error', function (error) {
        //             console.log(error);
        //         });
        // });
    }
    next();
});

setInterval(function () {

    if (web3.currentProvider) {
        var ethAddress;
        config.db.findOne({ txHash: null }, function (err, doc) {
            if (doc) {
                ethAddress = doc.address;
                myContract.methods.addVoter(ethAddress).send({ from: config.OWNER_ADDRESS })
                    .on('transactionHash', function (hash) {
                        // console.log(hash);
                        config.db.update({ address: ethAddress }, { $set: { txHash: hash, timestamp: Date.now() } });
                    })
                    .on('confirmation', function (confNo, receipt) {
                        // console.log(confNo);
                    })
                    .on('receipt', function (receipt) {
                        // console.log("receipt received");
                    })
                    .on('error', function (error) {
                        console.log(error);
                    });
            }
        });

    }

}, 15000);

setInterval(function () {

    if (web3.currentProvider) {
        var ethAddress;
        var tenMinutes = Date.now() - 60000;
        config.db.findOne({ $and: [{ txHash: { $ne: null } }, { timestamp: { $lt: tenMinutes } }] }, function (err, doc) {
            if (doc) {
                web3.eth.getTransactionReceipt(doc.txHash, function (err, result) {
                    if (!err) {
                        if (result) {
                            if (result.status == "0x0") {
                                config.db.update({ _id: doc._id }, { $set: { txHash: null } }, { multi: false });
                            }
                        } else {
                            config.db.update({ _id: doc._id }, { $set: { txHash: null } }, { multi: false });
                        }

                    }
                });
            }

        });
    }

}, 15000);

setInterval(function () {

    if (web3.currentProvider) {
        var ethAddress;
        config.db_fptp.findOne({ txHash: null }, function (err, doc) {
            if (doc) {
                console.log("candidate blockchain")
                ethAddress = doc.address;
                myContract.methods.addCandidate(ethAddress).send({ from: config.OWNER_ADDRESS })
                    .on('transactionHash', function (hash) {
                        // console.log(hash);
                        config.db_fptp.update({ address: ethAddress }, { $set: { txHash: hash, timestamp: Date.now() } });
                    })
                    .on('confirmation', function (confNo, receipt) {
                        // console.log(confNo);
                    })
                    .on('receipt', function (receipt) {
                        // console.log("receipt received");
                    })
                    .on('error', function (error) {
                        console.log(error);
                    });
            }
        });

    }

}, 15000);

setInterval(function () {

    if (web3.currentProvider) {
        var ethAddress;
        var tenMinutes = Date.now() - 60000;
        config.db_fptp.findOne({ $and: [{ txHash: { $ne: null } }, { timestamp: { $lt: tenMinutes } }] }, function (err, doc) {
            if (doc) {
                console.log("candidate timeout");
                web3.eth.getTransactionReceipt(doc.txHash, function (err, result) {
                    if (!err) {
                        if (result) {
                            if (result.status == "0x0") {
                                config.db_fptp.update({ _id: doc._id }, { $set: { txHash: null } }, { multi: false });
                            }
                        } else {
                            config.db_fptp.update({ _id: doc._id }, { $set: { txHash: null } }, { multi: false });
                        }

                    }
                });
            }

        });
    }

}, 15000);

connectDb = function (username = 'rajiv', password = 'rajiv') {
    mongoose.connect(`mongodb://${username}:${password}@ds133630.mlab.com:33630/vfc`, (error) => {
        if (!error) {
            console.log("connected to Database: VFC");
        } else {
            console.log("Error: ", error);
        }
    });
}

app.use((req, res, next) => {
    if (mongoose.connection.readyState == 0) {
        connectDb();
    }
    next();
})
// Multer for File Upload

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer({ dest: path.join(__dirname, 'public/uploads/electionSymbols/') }).single('symbolFileName'));
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


app.use('/login', loginRoute);
app.use('/admin', adminRoute);
app.use('/api/users', userApi);
app.use('/voter', voterRoute);
app.use('/api/voter', voterApi);
app.use('/voting', votingRoute);


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
    else
        throw err;
});

routes.initialize(app);
pr_candidate_routes.initialize(app);
party_routes.initialize(app);
