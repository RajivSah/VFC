module.exports={
    index: function(req, res) {
        console.log("Acessed candidate index function");
        res.render('candidate_manager_nav');
    }
};