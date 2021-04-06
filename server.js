const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const WebSocket = require('ws');
const http = require('http')
const Mongo = require("./mongooseTest");

const app = express();
const port = process.env.PORT || 5000;
const mongo = new Mongo.MongoConnection();
var server = app.listen(port);
var io = require('socket.io')(server, {cors:true});

mongo.connect();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Client ID to sockets 
var client;

io.on('connection', async (socket) => {
  var handshakeData = socket.request;
  var id = handshakeData._query['playerId'];
  console.log("id:", id);

  var user = await mongo.findUserById(id);
  console.log(user);

  if(user == null || user == "null" ){
    console.log("no such user found");
  }

  socket.on('end', function (){
    socket.disconnect(1);
  });

  client = socket;

  console.log('a user connected');
});

io.on('join-room', (socket) => {
  console.log("User joining room");
})



//need concept of a room?
//room has many users
//room has info about each osrs player 
  //username, combat level, health, prayer, location
  //latest kill event, gp earned?

//room has a unique id in DB
//room has list of user IDs (FROM DB)
//on load of a room, find all users 

//Player uses plugin 
//send event to server, mark player as active 
//plugin uses spcial player token to login from plugin 

//loot dropped event 
//find out which room player belongs to
//send the info to the room 

app.post('/login-webapp', async (req, res) =>{
  var name = req.body.username;
  var password = req.body.password;
  
  console.log("Loggin: " + name);
  console.log(password);
  
  var user = await mongo.getUser(name);

  if(user == null){
    console.log("no user found!");
    return res.send({success: false, msg: "Bad login"});
  }else{
    console.log(user);
  }

  if(user.password == password && user.username == name){
    return res.send({success: true, token: user._id, username: name, msg: "Logged in"});
  }else{
    return res.send({success: false, msg: "Bad login"});
  }
});

app.post('/loot-drop/', (req, res) => {

  console.log("---> Loot Drop <---");
  
  var lootInfo = req.body.event;
  var accountId = req.body.accountHash;
  
  console.log(accountId);

  console.log(lootInfo);

  client.emit("process-drop", {drop: lootInfo});
  

  res.send({ message: 'Saved loot drop' });
});

app.post('/login-state-change', (req, res) =>{
  console.log("---> Login Status Change <---");
  console.log(req.body);
  res.send({message: "Saved to server"});
})





//Leave this alone, one time setup needed here
if (process.env.NODE_ENV === 'production') {
  //Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')));

  //Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}