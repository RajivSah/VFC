var party=require('../controllers/party_manager');
var party_api=require('../api/party');


module.exports.initialize=function(app) {
    //***************   GET REQUESTS **************************** */

    app.get('/party/register',function(req,res){
        res.render('party_registration'); 
    });
    app.get('/party',party.registration_success);
    
    app.get('/api/party_list',party_api.get_party_list);
    app.get('/api/party_info',party_api.get_party_info);

    app.get('/party/manage',party.manage);    
    app.get('/party/update',party.update_form);

    
    
    //******************** POST REQUESTS ************************ */   


    app.post('/party/save',party.register);
    app.post('/party/update?:id',party.update_party_info);

    

    //******************** DELETE REQUESTS *********************** */

    app.delete('/party/delete',party.delete);
    
    
    
};
  


    