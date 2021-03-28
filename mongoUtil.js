const mongoose = require("mongoose");
const UserModel = require('./usermodel')

const url = "mongodb+srv://duke:duke3744@cluster0.lgr7p.mongodb.net/mountian?retryWrites=true&w=majority";;

mongoose.connect(url, { useUnifiedTopology: true, useNewUrlParser: true });

const connection = mongoose.connection;

connection.once("open", async function() {
  console.log("MongoDB database connection established successfully");

  //var users = await UserModel.find();
  
  //Remove a user
  //  UserModel.find({username: "luke"}).remove().exec();

  //Add a user
  // var preston = new UserModel({username: "luke", password: "dog"})
  // preston.save(function(err,result){
  //   if(err) console.log(err)
  // });


});

async function getUserInfo(username){
  return await UserModel.findOne({username: username})
}

module.exports = {getUserInfo: getUserInfo}
