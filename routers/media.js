var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
var jsonParser = bodyParser.json()

const multer = require('multer');
var storage = multer.memoryStorage();
var upload = multer({ dest: 'uploads/', storage: storage })
// create unique id
var uniqid = require("uniqid");

router.get('/',function(req, res){
    res.send("find media version")
});

router.get('/:id',jsonParser,function(req,res){
    console.log("Get a media file by its id.");
    /*var query = 'SELECT content FROM pro WHERE id=?';
    var client = req.app.locals.client;
    client.execute(query, [req.params.id], function(err, result){
        if(err)
            res.json({'status':'error', 'error':err});
        else{
            console.log('media is '+result[0])
            res.json({'status':"OK"});
        }
    });*/
});

module.exports = router;