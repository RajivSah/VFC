var boothModel = require('../models/booth');
const router = require('express').Router();
const bodyParser = require('body-parser');

router.post('/register_booth', function(req, res){
    console.log(req.body);
    res.end();
});