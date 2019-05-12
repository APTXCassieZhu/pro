var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
var jsonParser = bodyParser.json();
var formidable = require('formidable');

var uniqid = require("uniqid");

router.post('/',function(req,res){
    console.log('start to add media');
    
    var id = uniqid();
    console.log("id is "+id);
    //console.log(req.file.buffer);
    //var client = req.app.locals.client;
    //var query = 'INSERT INTO medias (id, content, type) VALUES (?, ?, ?)';
    var form = new formidable.IncomingForm().parse(req)
        .on('file', function (name, file){
            console.log('Uploaded ' + file.name);
        })
        .on('field', function(name, field) {
            console.log('Got a field:', name);
        })
        .on('error', function(err) {
            console.log(err);
            next(err);
        })
        .on('end', function() {
            console.log("end");
            res.end();
        });
    /*client.execute(query, [id, req.file.buffer, req.file.originalname.split('.')[1]], function(err, result){
        if(err)
            res.json({'status':'error', 'error':err});
        else
            res.json({'status':'OK', 'id':id});
    });*/
});

module.exports = router;