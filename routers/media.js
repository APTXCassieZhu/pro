var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
var jsonParser = bodyParser.json()

var session = require("express-session");

const multer = require('multer');
var storage = multer.memoryStorage();
var upload = multer({ dest: 'uploads/', storage: storage })
var up = multer()

// create unique id
var uniqid = require("uniqid");

router.get('/:id', up.none(),function(req,res){
    console.log("Get a media file by its id.");
    console.log(req.params.id);
    var query = 'SELECT * FROM medias WHERE id=?';
    var client = req.app.locals.client;
    var types = ['webm', 'mkv', 'flv', 'ogg','avi', 'mov' , 'wmv', 'mp4','m4v', 'm4p', 'mpeg', '3gp','3g2'];
    var isVideo = false;
    client.execute(query, [req.params.id], {prepare :true}, function(err, result){
        if(err)
            res.status(404).json({'status':'error', 'error':err});
        else{
            if(result.first() == null) {
                res.status(404).json({'status':'error', 'err':'media has been deleted'});
            } else{
                console.log('media is '+result)
                console.log(result.first());
                //console.log(result.first().id);
                //console.log(result.first().content);
                //console.log(result.first().type);
                for(var i = 0; i < types.length; i++) {
                    if(result.first().type == types[i])
                        isVideo = true;
                }
                if(isVideo) {
                    res.type('video/'+result.first().type);
                    //res.type('application/octet-stream');
                }else {
                    res.type('image/'+result.first().type);
                }
                res.send(result.first().content);
            }
        }
    });
});

module.exports = router;
