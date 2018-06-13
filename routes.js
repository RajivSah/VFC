var candidate=require('./controllers/candidate_manager');
var candidate_api=require('./api/candidate');

module.exports.initialize=function(app) {
    app.get('/candidate', candidate.index);
    app.get('/candidate/fptp/register', candidate.fptpRegistration);
    app.get('/candidate/fptp/manage', candidate.fptpManagement);
    app.get('/get/district_const/:district_name', candidate_api.fetch_Constituency);
    app.post('/candidate/fptp/save', candidate.register);



   
  
    };
  