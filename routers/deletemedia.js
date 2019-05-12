var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
var jsonParser = bodyParser.json()
var cookieParser = require('cookie-parser');
var session = require("express-session");

const multer = require('multer');
var storage = multer.memoryStorage();
var upload = multer({ dest: 'uploads/', storage: storage })
// create unique id
var uniqid = require("uniqid");

var Memcached = require('memcached');
var memcached = new Memcached('localhost:11211');

router.post('/',jsonParser,function(req,res){
    //console.log('delete associated medias');
    console.log('want to delete: ',req.body.media);
    var client = req.app.locals.client;
    var query = 'DELETE FROM medias WHERE id in (\'';
    var i;
    var errorList = [];
    for(i=0; i< req.body.media.length - 1; i++) {
        query += req.body.media[i] + "\', \'";
        memcached.del(req.body.media[i], function(err){});
    }
    
    query += req.body.media[req.body.media.length-1] + "\');"
    client.execute(query, {prepare :true}, function(err, result){
        if(err){
            errorList.push(req.body.media[i]);
        }
    });
    
    res.json({'status':'OK', 'error': errorList});
});
module.exports = router;
