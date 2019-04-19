var express = require('express');
const app = express()

// canssandra part
var cassandra = require('cassandra-driver');
var client = new cassandra.Client({contactPoints: ['127.0.0.1:9042'], localDataCenter:'datacenter1', keyspace: 'pro'});

const port = 3000

var addmedia = require("./routers/addmedia")
var media = require("./routers/media")

//check connection to cassandra
client.connect(function(err, result) {
    if(err)
            console.log('Connection to cassandra error: '+err);
    else{
            console.log('Connection with Cassandra established');
            app.locals.client = client;
    }
});


app.use('/addmedia', addmedia)
app.use('/media', media)
app.get('/',function(req, res){
    res.send("media version")
})

app.listen(port,'0.0.0.0', () => {
    return console.log(`App listening on port ${port}!`);
})
