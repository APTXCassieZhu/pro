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
    console.log('add media check login');
    //console.log('cookies:'+req.cookies);
    if(req.cookies != undefined) {
        //console.log('cookies: ',req.cookies);
        if(req.cookies.session != undefined){
            //console.log('session:',req.cookies.session);
            if(req.cookies.session.current_user != null){
                console.log('start to add media');
                //console.log(req.file);
                var id = uniqid();
                console.log("id is ",id);
                //console.log(req.file.buffer);
                var client = req.app.locals.client;
                var db = req.app.locals.db;
                var query = 'INSERT INTO medias (id, content, type) VALUES (?, ?, ?)';
                //console.log("upload file is ",req.file);
                if(req.file != undefined){
                    //console.log(req.file.originalname.split('.')[1]);
                    client.execute(query, [id, req.file.buffer, req.file.originalname.split('.')[1]], function(err, result){
                        if(err)
                            res.status(410).json({'status':'error', 'error':err});
                        else {
                            // insert into mongodb collection
                            req.body['id'] = id;
                            req.body['poster'] = req.cookies.session.current_user;
                            req.body['used'] = false;
                            db.collection("medias").insertOne(req.body, function(err, a) {
                                if (err) {
                                    console.log('add medias into mogondb err: ',err);
                                }else{
                                    console.log('add medias into mogondb success');
                                }
                            });
                            res.json({'status':'OK', 'id':id});
                        }
                    });
                } else{
                    console.log('upload file is undefined');
                    res.status(412).json({'status':'error', 'error':'upload file error'});
                }
            }else {
                console.log('user not login add media');
                res.status(413).json({'status':'error', 'error':'user does not log in add media'});
            }
        }else{
            console.log('session undefined add media');
            res.status(414).json({'status':'error', 'error':'session undefined add media'});
        }
    }
    else {
	    console.log('cookie undefined');
        res.status(415).json({'status':'error', 'error':'cookie undefined'});
    }
});
module.exports = router;
