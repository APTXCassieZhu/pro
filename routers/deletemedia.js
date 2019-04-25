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
    console.log('delete associated medias');
    console.log('want to delete: ',req.body.media);
    var client = req.app.locals.client;
    var query = 'DELECT * FROM medias WHERE id = ?';
    var i;
    for(i=0; i< req.body.media.length; i++) {
        client.execute(query, [req.body.media[i]], {prepare :true}, function(err, result){
            if(err)
                res.json({'status':'error', 'error':err});
            else{
                console.log('delete a media', req.body.media[i]);
                res.json({'status':'OK'});
            }
        });
    }
});
module.exports = router;
