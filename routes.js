var candidate=require('./controllers/candidate_manager');

module.exports.initialize=function(app) {
    app.get('/candidate', candidate.index);
   
  
    };
  