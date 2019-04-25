var express = require('express');
const app = express();

// canssandra part
var cassandra = require('cassandra-driver');
var client = new cassandra.Client({contactPoints: ['localhost'], localDataCenter:'datacenter1', keyspace: 'system'});
var newClient = new cassandra.Client({contactPoints: ['localhost'], localDataCenter:'datacenter1', keyspace: 'pro'});

const port = 3000

var addmedia = require("./routers/addmedia")
var media = require("./routers/media")
var reset = require("./routers/reset")

// store session
var cookieParser = require('cookie-parser');
app.use(cookiePareser());

/*var session = require("express-session");
var MongoStore  = require("connect-mongo")(session);
app.use(session({
    store: new MongoStore({
        url: 'mongodb://192.168.122.39:27017/mysession'
    }),
    resave: false,
    saveUninitialized: true,
    cookie: {
        domain:"130.245.171.196",
        maxAge: 1000*30*60
    },
    secret: "lalala"}));*/

//check connection to cassandra
client.connect(function(err, result) {
    if(err)
            console.log('Connection to cassandra error: '+err);
    else{
            console.log('Connection with Cassandra established');
            //app.locals.client = client;
            var query = "CREATE KEYSPACE IF NOT EXISTS pro with replication = {'class':'SimpleStrategy', 'replication_factor' : 3}";
            client.execute(query, [],function(err) {
                if (!err) {
                    console.log("new keyspace created");
                    newClient = new cassandra.Client({contactPoints: ['localhost'], localDataCenter:'datacenter1', keyspace: 'pro'});
                }
                else{
                    console.log("error in keyspace creation: "+ err);
                }
            });
    }
});

// create table
newClient.connect(function(err, result) {
    if(err)
            console.log('Connection to pro cassandra error: '+err);
    else{
            console.log('Connection with pro Cassandra established');
            app.locals.client = newClient;
            var tableQuery = "CREATE TABLE IF NOT EXISTS medias (id text PRIMARY KEY, content blob,type text);";
            newClient.execute(tableQuery, [],function(err) {
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
app.use('/reset', reset)
app.get('/',function(req, res){
    res.send("media version")
})

app.listen(port,'0.0.0.0', () => {
    return console.log(`App listening on port ${port}!`);
})


