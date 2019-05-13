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

router.post('/',upload.single('content'),function(req,res){
    //console.log('add media check login');
    //console.log('cookies:'+req.cookies);
    if(req.cookies != undefined) {
        //console.log('cookies: ',req.cookies);
        if(req.cookies.session != undefined){
            //console.log('session:',req.cookies.session);
            if(req.cookies.session.current_user != null){
                var client = req.app.locals.client;
                var db = req.app.locals.db;
                
                if(req.file != undefined){
                    // insert into mongodb collection
                    req.body['id'] = uniqid();
                    req.body['poster'] = req.cookies.session.current_user;
                    req.body['used'] = false;
                    db.collection("medias").insertOne(req.body, function(err, a) {
                        if (err) {
                            console.log('add medias '+req.body['id']+' into mogondb err: ',err);
                        }else{
                            console.log('add medias '+req.body['id']+' into mogondb success');
                        }
                    });
                    req.body['query'] = 'INSERT INTO medias (id, content, type) VALUES (?, ?, ?)';
                    client.execute(req.body['query'], [req.body['id'], req.file.buffer, req.file.originalname.split('.')[1]], function(err, result){
                        if(err) {
                            // delete media id from mongodb
                            db.collection("medias").deleteOne({'id': req.body['id']}, function(err1, obj){
                                if(err1)
                                    res.status(416).json({'status':'error', 'error':err});
                            })
                            res.status(410).json({'status':'error', 'error':err});
                        } else {
                            res.json({'status':'OK', 'id':req.body['id']});
                        }
                    });
                } else{
                    //console.log('upload file is undefined');
                    res.status(412).json({'status':'error', 'error':'upload file error'});
                }
            }else {
                //console.log('user not login add media');
                res.status(413).json({'status':'error', 'error':'user does not log in add media'});
            }
        }else{
            //console.log('session undefined add media');
            res.status(414).json({'status':'error', 'error':'session undefined add media'});
        }
    }
    else {
	    //console.log('cookie undefined');
        res.status(415).json({'status':'error', 'error':'cookie undefined'});
    }
});
module.exports = router;
