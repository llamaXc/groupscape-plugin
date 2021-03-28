const express = require('express');
const path = require('path');
const UserModel = require('./usermodel')
const bodyParser = require('body-parser');
var mongo = require('./mongoUtil.js');


const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/api/login', async (req, res) => {

  var requestingUsername = req.body.username;
  var requstingPassword = req.body.password;

  var correctUserInfo = await mongo.getUserInfo(requestingUsername);
  console.log(correctUserInfo)
  console.log(JSON.stringify(req.body))  
  //Check to see if the username is even real
  if(correctUserInfo == null){
    return res.send({success: false, msg: "No user found"})
  }

  //Check to see if the login is good or bad 
  if(correctUserInfo.username == requestingUsername && correctUserInfo.password == requstingPassword){

    console.log("User Logged In: " + correctUserInfo.username)

    return res.send({success: true, msg: "logged in"})

  }else{

    return res.send({success: false, msg: "No user found"});

  }

});

app.post('/api/register', async (req, res) => {
  
  var newUser = new UserModel({username: req.body.username, password: req.body.password});
  var userInfo = await mongo.getUserInfo(req.body.username);
  console.log(req.body.username);

  console.log(userInfo);

  //Check to see if the username is even real
  if(userInfo == null){

    //Attempt to save the user: returns a bool
    var userSaved = await newUser.save();
    
    //If we succesfully saved the user, let the user know
    if(userSaved){
      
      console.log("New User Created: " + newUser.username)

      return res.send({message: "Saved new user"});
    }
  }else{
    //Username exists
    return res.send({message: "Username already exists"})
  }

});

app.listen(port, () => console.log(`Listening on port ${port}`));


//Leave this alone, one time setup needed here
if (process.env.NODE_ENV === 'production') {
  //Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')));

  //Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}