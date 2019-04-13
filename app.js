var express = require('express');
const app = express()
const cookieSession = require('cookie-session');

const port = 3000

app.use(cookieSession({
    name: 'session',
    keys: ['lalala'],
  }))

var addmedia = require("./routers/addmedia")
var media = require("./routers/media")

app.use('/addmedia', addmedia)
app.use('/media', media)
app.get('/',function(req, res){
    res.send("media version")
})

//app.listen(port,'0.0.0.0', () => {
//    return console.log(`App listening on port ${port}!`);
//})
app.listen(80);
