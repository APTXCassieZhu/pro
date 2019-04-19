var express = require('express');
const app = express()

// canssandra part
var cassandra = require('cassandra-driver');
var client = new cassandra.Client({contactPoints: ['localhost'], localDataCenter:'datacenter1', keyspace: 'pro'});

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
            var query = "CREATE KEYSPACE IF NOT EXISTS pro with strategy_options:replication_factor = '3' and strategy_class = 'SimpleStrategy'";
            client.execute(query, [],function(err) {
                if (!err) {
                    console.log("new keyspace created");
                }
                else{
                    console.log("error in keyspace creation: "+ err);
                }
            });
            var tableQuery = "CREATE TABLE IF NOT EXISTS medias (id text PRIMARY KEY, content blob,type text);";
            client.execute(tableQuery, [],function(err) {
                if (!err) {
                    console.log("new table created");
                }
                else{
                    console.log("error in table creation: "+ err);
                }
            });
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
