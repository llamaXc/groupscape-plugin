const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
    username : String,
    password : String
});

const model = mongoose.model("users", userSchema);

module.exports = model
