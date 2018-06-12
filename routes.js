var candidate=require('./controllers/candidate_manager');

module.exports.initialize=function(app) {
    app.get('/candidate', candidate.index);
    app.get('/candidate/fptp/register', candidate.fptpRegistration);
    app.get('/candidate/fptp/manage', candidate.fptpManagement);
   
  
    };
  