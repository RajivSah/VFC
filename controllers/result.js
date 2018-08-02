var model_district = require('../models/districts');

module.exports = {
    requestResultForm: function (req, res) {
        var viewModel={
            districts: [],
            parties : []
         }
        model_district.find({}, function (err, dists) {
            if (err)
                throw err;

            viewModel.districts = dists;
            res.render('result_form', viewModel);
        });
    }
}