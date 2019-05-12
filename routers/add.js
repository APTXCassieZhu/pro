var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
var jsonParser = bodyParser.json();

const multer = require('multer');
var storage = multer.memoryStorage();
var upload = multer({ dest: 'uploads/', storage: storage })
// create unique id
var uniqid = require("uniqid");

var Memcached = require('memcached');
var memcached = new Memcached('localhost:11211');

router.get('/',function(req, res){
    res.send("add media version")
});

router.post('/',upload.single('content'),function(req,res){
    console.log('start to add media');
    console.log(req.file);
    var id = uniqid();
    console.log("id is "+id);
    //console.log(req.file.buffer);
    var client = req.app.locals.client;
    var query = 'INSERT INTO medias (id, content, type) VALUES (?, ?, ?)';
    console.log("upload file is "+req.file);
    console.log(req.file.originalname.split('.')[1]);
    client.execute(query, [id, req.file.buffer, req.file.originalname.split('.')[1]], function(err, result){
        if(err)
            res.json({'status':'error', 'error':err});
        else{
            memcached.add(id, req.file.originalname.split('.')[1], 600, function(err){});
            res.json({'status':'OK', 'id':id});
        }
    });
});

module.exports = router;
