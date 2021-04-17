const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const Mongo = require("./Connections/MongoConnection");
const bcrypt = require('bcrypt');
const saltRounds = 10;
const Clients = require('./Connections/ClientConnections');
const Rooms = require("./Connections/RoomConnections");
const jwt = require('jsonwebtoken');

const app = express();
const port = process.env.PORT || 5000;
const mongo = new Mongo.MongoConnection();
const rooms = new Rooms.RoomConnection();
const clients = new Clients.ClientConnections();
var server = app.listen(port, function(){
  mongo.connect();
});

//Socket connection 
var io = require('socket.io')(server, {cors:true});

//Middleware json parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Client ID to sockets 
var client;

io.on('connection', async (socket) => {

  console.log("============= A user joined! ============");

  socket.on("logged-in", async  function(account){
    console.log("============= New Login ============");

    clients.clientConnected(account.accountId, socket);

    var user = await mongo.findUserById(account.accountId);

    var room = await mongo.getRoom(user.currentRoomId);
    
    console.log(user)
    console.log(room)

    if(room != null){
      var players = rooms.playerLoggedIn(user)

      console.log(players);

      socket.join("" + room._id)

      await io.in(user.currentRoomId).emit("player-list", (players) );

      socket.emit("client-connected", room, true);
    }else{
      socket.emit("client-connected", null, false);
    }
  
  });


  
  socket.on('end', function (){
    console.log("Ending socket!");
    var userMappedFromSocket = clients.getClientBySocketId(socket.id)
    console.log("Passing user id to logout function: " + userMappedFromSocket)
    logoutUser(userMappedFromSocket);
    socket.removeAllListeners();
    socket.disconnect(1);
  });

  socket.on('disconnect', function (){
    console.log("Disconnecting socket!");
    //lets logout our player now, but we dont know him???
    var userMappedFromSocket = clients.getClientBySocketId(socket.id)
    logoutUser(userMappedFromSocket);
    socket.removeAllListeners();
    socket.disconnect(1);
  });

});

async function logoutUser (userId){
  if(userId != null){
    var user = await mongo.findUserById(userId);
    console.log("Room found: ")
    console.log(user)
    rooms.logoutUser(userId, user.currentRoomId);
    var players = rooms.getPlayers(user.currentRoomId);

    console.log("Room id to remove from: " + user.currentRoomId);
    
    io.in(user.currentRoomId .trim() + "").emit("player-list", players)
  }else{
    console.log("USER IS NULL, cant logout him outl....")
  }
}

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

app.post('/create-room', authorizeJWT, async(req,res) =>{
  console.log("============= Creating new room: " + req.body.roomName + " =======================");

  var roomName = req.body.roomName;
  var owner = req.body.owner;
  var ownerId = req.body.ownerId;
  

  var roomDoc = await mongo.createRoom(roomName, owner, ownerId);
  console.log("room made:  " + roomDoc)


  return res.send({success: true, msg: "Room created!", room: roomDoc});
})


app.post('/register', async(req,res) =>{

    //Extract the username and password from the request
    var name = req.body.username;
    var password = req.body.password;

    //Hash password 
    password  = await bcrypt.hash(password, saltRounds);

    //Get the user real user information from our database
    var user = await mongo.getUser(name);

    //If user does not exists, return bad login 
    if(user != null){
      return res.send({success: false, msg: "Username already exists"});
    }

    //Create the new users and register him 
    var userDoc = await mongo.registerUser(name, password);
    
    var token = jwt.sign({id: userDoc._id, name: name}, "31415926", {
      expiresIn: 86400
    });

    console.log(token);




    if(userDoc && userDoc.username == name){
      console.log("Would save new user: " + name);

      return res.send({success: true, jwtToken: token, accountId: userDoc._id, msg: "Account created"});
    }else{
      return res.send({success: false, msg: "Failed to save account"});
    }
});

function authorizeJWT(req, res, next){
  const token = req.headers['authorization']
  console.log("Auth header: " + token);

  if(token == null) return res.sendStatus(401);
  
  jwt.verify(token, "31415926", (err, user)=>{
    if(err) return res.sendStatus(403)
    req.user = user 
    next();
  })
}

app.post('/my-rooms', authorizeJWT, async (req, res) => {
  var rooms = await  mongo.getAllRoomsOwnedById(req.body.accountId);
  return res.send({rooms: rooms})
})

app.post('/change-room', authorizeJWT, async (req, res) =>{
  console.log("CHANING NOW")
  console.log(req.body);
  
  //validate the room request first! 
  console.log(req.body.desiredRoomId);

  var room = await mongo.getRoom(req.body.desiredRoomId);
  console.log(room)

  if(room != null){
    console.log("UPDATING ROOM")
    await mongo.updateUserRoom(req.user.id, req.body.desiredRoomId);


    return res.send({status: 200, room: room, msg: "Changed users room!", success: true})
  }else{
    console.log("NO ROOM")
    return res.send({success: false, msg: "No room found!"});
  }
})


app.post('/login-webapp', async (req, res) =>{

  //Extract the username and password from the request
  var name = req.body.username;
  var password = req.body.password;
  var passwordMatch = false;

  //Get the user real user information from our database
  var user = await mongo.getUser(name);

  //If user does not exists, return bad login 
  if(user == null){
    return res.send({success: false, msg: "Bad login"});
  }

  passwordMatch = await bcrypt.compare(password, user.password);

  var token = jwt.sign({id: user._id, name: name}, "31415926", {
    expiresIn: 86400
  });


  //If user information matches our records, then return good login, else return bad login 
  if(passwordMatch && user.username == name){
    return res.send({success: true, accountId: user._id, token: token, username: name, msg: "Logged in", roomId: user.currentRoomId});
  }else{
    return res.send({success: false, msg: "Bad login"});
  }
});



function handleNewLootDrop(drop, user, room){
  console.log("\tEmitting drop to room: " + room._id)
  io.in("" + room._id).emit("process-drop", drop);
}

app.post('/loot-drop/', async  (req, res) => {
  console.log(" ================ New Drop Inbound ================");

  //Get loot information and account information from request  
  var accountId = req.body.accountHash;

  var lootInfo = {};
  if(req.body.event == null){
    lootInfo =  {
      id: 3034,
      name: 'Goblin',
      level: 2,
      lootItems: [
        { id: 526, name: 'Bones', value: 15, quantity: 1 },
        { id: 995, name: 'Coins', value: 0, quantity: 1 }
      ]
    }
  }else{
    lootInfo = req.body.event;
  }
  
  console.log(req.body);

  var user = await mongo.findUserById(accountId);
  console.log(" \t User who got the drop: ")
  console.log(user)

  var room = await mongo.getRoom(user.currentRoomId);

  if(user == null){
    return res.send({message: "Invalid account id", success: false});
  }

  var osrsPlayer = {name: "Iron 69M", world: 340, location: "Lumbridge"}
  var drop = {player: osrsPlayer, monster: {name: lootInfo.name, level: lootInfo.level}, items: lootInfo.lootItems}
  console.log(drop)

  handleNewLootDrop(drop, user, room)

  //Return 200 status ok 
  res.send({ message: 'Saved loot drop' });
});

app.post('/login-state-change', async (req, res) =>{
  //If user is logged in, find out which room they belong to and update the room to start sending data
  console.log("---> Login Status Change <---");
  console.log(req.body);
  var loginStatus = req.body.event.state 
  
  var playerId = req.body.accountHash;
  var player = await mongo.findUserById(playerId);
  console.log("Player found: ")
  console.log(player)

  if(player != null && loginStatus == "LOGGED_IN" || req.body.event == "LOGGED_IN"){
    var players = rooms.playerLoggedIn(player)
    console.log(players);
    await io.in(player.currentRoomId).emit("player-list", (players) );
  }

  return res.send({message: "Saved to server"});
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