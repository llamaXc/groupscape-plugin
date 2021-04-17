//room current GP earned 
//active players connected 
//number of viwers connected 
//

class RoomConnection{

    constructor(){
        console.log("New room connection started");
        this.rooms = {};

    }

    //stats about the room 
    logoutUser(userId, roomId){
        var players = this.rooms[roomId].players;
        players.forEach(function(player){
            if(player.id == userId){
                player.loggedInState = false;
            }
        })
        this.rooms[roomId].players = players;
    }

    getPlayers(roomId){
        return this.rooms[roomId].players;
    }
    
    playerLoggedIn(user){
        console.log("Player logging in!");
        var roomId = user.currentRoomId;

        if(this.rooms[roomId] == null || this.rooms[roomId].players == null){
            console.log("Players not in this room, making one now")
            var players = [];
            players.push({name: user.username, id: user._id, loggedInState: true})
            this.rooms[roomId] = {players: players}
        }else{
            console.log("Room eixsts, lets add to it!")
            var players = this.rooms[roomId].players
            var found = false
            players.forEach((player) => {
                if(player.name == user.username){
                    player.loggedInState = true;
                    found = true 
                }
            });

            if(found == false){
                players.push({name: user.username,  id: user._id, loggedInState: true})
            }

            this.rooms[roomId].players = players;
        }
        console.log("Added player to room id: " + roomId);
        console.log("Active plyaers: ")
        console.log(this.rooms[roomId].players);
        
        return this.rooms[roomId].players;
    }
    
}

module.exports = {RoomConnection};


