var mongoose = require('mongoose');
    
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    username: String,
    password: String,
    currentRoomId: String
});

// Compile model from schema
var UserModel = mongoose.model('users', UserSchema );

module.exports = {UserModel};