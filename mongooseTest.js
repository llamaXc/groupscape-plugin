var mongoose = require('mongoose');
var User = require('./UserModel.js').UserModel;
var url = 'mongodb+srv://preston:Preston1@cluster0.lgr7p.mongodb.net/mountian?retryWrites=true&w=majority'

class MongoConnection{

    constructor(){
        //Set up default mongoose connection
        mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});
        this.db = mongoose.connection;  
        console.log("Creating");

    }

    connect() {
        this.db.on('error', console.error.bind(console, 'MongoDB connection error:'));
        this.db.once("open", function() {
            console.log("Connection Successful!");
        });
    }

    async getUser(username){
        return await User.findOne({username: username}).exec();
    }

    async findUserById(id){
        if(mongoose.Types.ObjectId.isValid(id)){
            console.log("searching for id: " + id);
            var user = await User.findById(id);
            console.log(user);
            return user;
        }else{
            console.log("invalid id " + id);
            return null;
        }
    }

    

}

module.exports = {MongoConnection};


