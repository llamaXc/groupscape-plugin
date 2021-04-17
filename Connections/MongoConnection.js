var mongoose = require('mongoose');
var User = require('../Models/UserModel.js').UserModel;
var Room = require('../Models/RoomModel.js').RoomModel;

var url = 'mongodb+srv://preston:Preston1@cluster0.lgr7p.mongodb.net/mountian?retryWrites=true&w=majority'

class MongoConnection{

    constructor(){
        mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});
        this.db = mongoose.connection;  
    }

    connect() {
        this.db.on('error', console.error.bind(console, 'MongoDB connection error:'));
        this.db.once("open", function() {
            console.log("Connection Successful!");
        });
    }

    async createRoom(roomName, owner, ownerId){
        var room = new Room({roomName: roomName, owner: owner, ownerId: ownerId, connectedOsrsPlayers: 0, connectedViewers: 0});
        return await room.save();
    }

    async updateUserRoom(userId, roomId){
        console.log("Updating room id for user: " + userId + " to " + roomId);
        roomId = roomId.trim() + "";

        if(mongoose.Types.ObjectId.isValid(userId)){
            console.log("\t UpdateUserRoom: id is valid!")
            if(mongoose.Types.ObjectId.isValid(roomId)){
                console.log("\t UpdateUserROom: room id is valid");
            }
        }
        return await User.updateOne({_id: userId}, {
            currentRoomId: roomId
        }).then(function(err, doc){
            console.log(err)
            console.log(doc)
        });
    }

    async getAllRoomsOwnedById(id){
        var results = await Room.find({ownerId: id});
        return results;
    }


    async registerUser(username, password){
        var user = new User({username: username, password: password, currentRoomId: "NA"});
        console.log(user);
        return await user.save();
    }

    async getUser(username){
        return await User.findOne({username: username}).exec();
    }

    async getRoom(id){
        console.log("\t> Looking in database rooms for: " + id)
        var id = id.trim() + ""
        if(mongoose.Types.ObjectId.isValid(id)){
            console.log("it is valid...");
            return  await Room.findOne({_id: id});
       }else{
            return null;
        }
    }

    async findUserById(id){
        if(mongoose.Types.ObjectId.isValid(id)){
            return await User.findById(id);
        }else{
            return null;
        }
    }
}

module.exports = {MongoConnection};


