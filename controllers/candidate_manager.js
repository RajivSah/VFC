module.exports={
    index: function(req, res) {
        console.log("Acessed candidate index function");
        res.render('candidate_home');
    },

    fptpRegistration: function(req, res){
        var viewModel={
            districts: [
                {
                    name: 'Jhapa'
                },
                {
                    name: 'Kathmandu'
                }

            ]
           
        }
        console.log("Accessed Candidate registration ");
        res.render('fptp_candidate_register', viewModel);
    },
    fptpManagement: function(req, res)
    {
        var url="http://www.google.com";
        res.render('fptp_candidate_management');
    }

};