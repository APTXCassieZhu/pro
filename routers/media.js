var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
var jsonParser = bodyParser.json()

const multer = require('multer');
var storage = multer.memoryStorage();
var upload = multer({ dest: 'uploads/', storage: storage })
var up = multer()

// create unique id
var uniqid = require("uniqid");

router.get('/:id', up.none(),function(req,res){
    console.log("Get a media file by its id.");
    console.log(req.params.id);
    var query = 'SELECT content FROM medias WHERE id=?';
    var client = req.app.locals.client;
    client.execute(query, [req.params.id], function(err, result){
        if(err)
            res.json({'status':'error', 'error':err});
        else{
            console.log('media is '+result)
            console.log('??? '+result.first());
            res.json({'status':"OK"});
        }
    });
});

module.exports = router;