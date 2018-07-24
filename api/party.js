var party_model=require('../models/pr_party_model');


module.exports={
    
    get_party_list: function(req, res)
    {
        party_model.find(function(err, docs){
           
        res.json(docs);
    });
    },

    get_party_info: function(req, res)
    {
        if(req.query.id)
        {
            console.log(req.query.id);
            party_model.findById( req.query.id, function(err, doc){
                // console.log("Printing");
                // console.log(doc);
                if (!err) {
                    res.json(doc);
                } else {
                    res.status(500).send(err).end();
                }
            });
            
        }
    }
};