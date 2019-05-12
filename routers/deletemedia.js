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

router.post('/',jsonParser,function(req,res){
    //console.log('delete associated medias');
    console.log('want to delete: ',req.body.media);
    var client = req.app.locals.client;
    req.body[query] = 'DELETE FROM medias WHERE id in (\'';
    var i;
    req.body[errorList]=[];
    for(i=0; i< req.body.media.length - 1; i++) {
        req.body[query] += req.body.media[i] + "\', \'";
    }
    req.body[query] += req.body.media[req.body.media.length-1] + "\');"
    //console.log(req.body[query]);
    client.execute(req.body[query], {prepare :true}, function(err, result){
        if(err){
            req.body[errorList].push(req.body.media[i]);
        }
    });
    
    res.json({'status':'OK', 'error': req.body[errorList]});
});
module.exports = router;
