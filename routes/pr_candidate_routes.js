var pr_candidate= require('../controllers/pr_candidate_manager');
var api=require('../api/candidate');

module.exports.initialize=function(app) {
    app.get('/pr_candidate/register',pr_candidate.show_register_form);

    app.post('/pr_candidate/save',pr_candidate.show_register_success);
    app.post('/pr_candidate/update?:id',pr_candidate.update);
    app.post('/pr_candidate/send',pr_candidate.getObject);
    app.get('/pr_candidate/manage',pr_candidate.manage);
    app.get('/pr_candidate/update?:id',pr_candidate.updateForm);
    app.delete('/pr_candidate/delete',pr_candidate.delete);
    app.get('/pr_candidate',pr_candidate.candidate_info);

    app.get('/api/pr_candidate_list',api.get_pr_candidate_list);
    app.get('/api/candidate/pr_candidate',api.get_pr_candidate_info);


}

  