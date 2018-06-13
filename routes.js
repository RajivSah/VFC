var candidate=require('./controllers/candidate_manager');
var candidate_api=require('./api/candidate');

module.exports.initialize=function(app) {
    app.get('/candidate', candidate.index);                                                     // Candidate Homepage
    app.get('/candidate/fptp/register', candidate.fptpRegistration);                            // Candidate Registration
    app.get('/candidate/fptp/manage', candidate.fptpManagement);                                // Candidate Management (List)
    
    app.get('/candidate/fptp_candidate', candidate.fptp_candidate_registration_success);        // Fetch Candidate information and conformation Box
    app.get('/candidate/fptp/update', candidate.update_form_for_fptp_candidate);                // Html Form to update Candidate
    
    app.post('/candidate/fptp_candidate/:id', candidate.update_fptp_candidate_info);            // Updates the candidate Information
    app.post('/candidate/fptp/save', candidate.register);                                       // Registers a new Candidate
    app.delete('/candidate/fptp/delete', candidate.delete);     


    app.get('/get/district_const/:district_name', candidate_api.fetch_Constituency);            // API call to get District Information 
    app.get('/api/candidate_list/fptp', candidate_api.get_fptp_candidate_list);                 // API call to get the list of all candidates
    app.get('/api/candidate/fptp_candidate', candidate_api.get_fptp_candidate_info);        // API call to get Candidate Info

  
  
    };
  