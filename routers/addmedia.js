var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
var jsonParser = bodyParser.json()
// canssandra part
var cassandra = require('cassandra-driver');
var client = new cassandra.Client({contactPoints: ['localhost'], localDataCenter:'datacenter1', keyspace: 'pro'});
const multer = require('multer');
var upload = multer({ dest: 'uploads/' })
// create unique id
var uniqid = require("uniqid");

//check connection to cassandra
client.connect(function(err, result) {
    if(err)
            console.log('Connection to cassandra error: '+err);
    else
            console.log('Connection with Cassandra established when addmedia');
});

router.post('/',jsonParser,function(req,res){
    var id = uniqid.time();
    console.log("id is"+id);
    var query = 'INSERT INTO medias (id, content) VALUES (?, ?)';
    client.execute(query, [id, req.file.buffer], function(err, result){
        if(err)
            res.json({'status':'error', 'error':err});
        else
            res.json({'status':"OK", 'id':id});
    });
});

module.exports = router;
