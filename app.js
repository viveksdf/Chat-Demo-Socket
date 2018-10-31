const express = require('express');
const bodyParser = require('body-parser');
var path = require('path');


var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
// var LocalStorage = require('node-localstorage').LocalStorage;
//     var localStorage = new LocalStorage('./scratch');

app.use(bodyParser.urlencoded({ extended: true }));

// displaying the index.html file

global.nick = ""
path.join(__dirname,'/bower_components/jquery-emoji-picker');
app.use('/bower_components', express.static(path.join(__dirname, 'bower_components')))


app.get('/', function(req, res){
    res.sendFile(__dirname + '/login.html');
  });

  app.post('/data', function(req, res) {
  
    // localStorage.setItem('nick', req.body.nickname);
    global.nick = req.body.nickname;
        res.redirect('http://192.168.1.180:3000/chat');
  });


app.get('/chat', function(req, res){
    res.sendFile(__dirname + '/index.html');
  });


// var nickname = localStorage.getItem("nick");

  io.on('connection', function(socket,nickname){
      nickname = global.nick;
      
    socket.broadcast.emit('chat message', nickname +" connected");
    socket.on('disconnect', function(){
        socket.broadcast.emit('chat message',nickname+" disconnected");
      });
      socket.on('chat message', function (msg) {
        io.emit('chat message', nickname +" : "+msg);
    });
  //   socket.on('typing', function (isTyping) {
  //     if(isTyping == true){
  //     io.emit('chat message', nickname +" is typing....");
  //     }
  // });
  });

// Starting the server
http.listen(3000,"0.0.0.0",(err) => {
    if(!err){
        console.log("Server started at port 3000");
    }
});
