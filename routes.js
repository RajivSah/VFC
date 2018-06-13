var candidate=require('./controllers/candidate_manager');
var candidate_api=require('./api/candidate');

module.exports.initialize=function(app) {
    app.get('/candidate', candidate.index);
    app.get('/candidate/fptp/register', candidate.fptpRegistration);
    app.get('/candidate/fptp/manage', candidate.fptpManagement);
    app.get('/get/district_const/:district_name', candidate_api.fetch_Constituency);
    app.post('/candidate/fptp/save', candidate.register);


    app.use((req, res, next) => {
        if (web3.currentProvider == undefined) {
            web3.setProvider(new Web3.providers.WebsocketProvider(config.web3Connection))
            web3.eth.net.isListening().then(console.log);
            myContract = new web3.eth.Contract(config.ABI, config.CONTRACT_ADDRESS);
        }
        next();
    });



   
  
    };
  