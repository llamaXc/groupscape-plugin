var mongoose = require('mongoose');
    
var Schema = mongoose.Schema;

var RoomSchema = new Schema({
    roomName: String,
    owner: String,
    ownerId: String,
    connectedOsrsPlayers : Number,
    connectedViewers: Number
});

// Compile model from schema
var RoomModel = mongoose.model('rooms', RoomSchema );

module.exports = {RoomModel};