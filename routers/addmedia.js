var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
var jsonParser = bodyParser.json()

const multer = require('multer');
var upload = multer({ dest: 'uploads/' })
// create unique id
var uniqid = require("uniqid");


router.get('/',function(req, res){
    res.send("add media version")
});

router.post('/',upload.single('content'),function(req,res){
    console.log('start to add media');
    var id = uniqid.time();
    console.log("id is "+id);
    var client = req.app.locals.client;
    var query = 'INSERT INTO medias (id, content) VALUES (?, ?)';
    client.execute(query, [id, req.file.buffer], function(err, result){
        if(err)
            res.json({'status':'error', 'error':err});
        else
            res.json({'status':"OK", 'id':id});
    });
});

module.exports = router;
