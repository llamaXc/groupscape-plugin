class ClientConnections{

    constructor(){
        console.log("New client connection started");
        this.clients = {}
        this.sockets = {}
    }

    clientConnected(id, socket){
        this.clients[id] = socket;
        this.sockets[socket.id] = id;
        console.log("Saving socket and client!: " + socket.id +  " " + id)
        
    }

    getSocket(id){
        return this.clients[id];
    }

    getClientBySocketId(id){
        console.log("looking for client by socket id")
        console.log(this.sockets[id])
        return this.sockets[id];
    }
    
}

module.exports = {ClientConnections};


