var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
var jsonParser = bodyParser.json()

router.get('/:id',jsonParser,function(req,res){
    console.log("Get a media file by its id.")
    var query = 'SELECT content FROM pro WHERE id=?';
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