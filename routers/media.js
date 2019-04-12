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
            console.log('Connection to cassandra error: ' + err);
    else
            console.log('Connection with Cassandra established');
});

router.get('/:id',jsonParser,function(req,res){
    console.log("Get a media file by its id.")
    var query = 'SELECT content FROM pro WHERE key=?';
    client.execute(query, [req.body.id], function(err, result){
        if(err)
            res.json({'status':'error', 'error':err});
        else{
            console.log('media is '+result[0])
            res.json({'status':"OK"});
        }
    });
});

module.exports = router;