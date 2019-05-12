var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
var jsonParser = bodyParser.json();

router.get('/',function(req, res){
    var client = req.app.locals.client;
    client.execute("DROP TABLE medias;",[],function(err, result) {
        if (!err) {
            console.log("medias table droped");
            res.json({"status":"ok"});
        }
        else{
            console.log("error in medias table drop: "+ err);
            res.json({"status":"error"});
        }
    });
});

module.exports = router;
