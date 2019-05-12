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
    var client = req.app.locals.client;
    var query = 'INSERT INTO medias (id, content, type) VALUES (?, ?, ?)';
    var form = new formidable.IncomingForm().parse(req)
        .on('file', function (name, file){
            console.log('Uploaded ' + file.name);
            console.log(form);
            console.log(form._parser);
            client.execute(query, [id, file, file.name.split('.')[1]], function(err, result){
                if(err)
                    res.json({'status':'error', 'error':err});
                else
                    res.json({'status':'OK', 'id':id});
            });
        })
        .on('error', function(err) {
            next(err);
        })
        .on('end', function() {
            res.end();
        });
    
});

module.exports = router;