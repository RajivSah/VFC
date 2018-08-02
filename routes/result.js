var api=require('../api/result');
var result=require('../controllers/result');

module.exports.initialize=function(app) {
    

    //app.get('/result',api.get_ethCandidateEthAddress);
    app.get('/result',result.requestResultForm);



}

  