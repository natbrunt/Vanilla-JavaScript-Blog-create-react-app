const mongoose = require("mongoose");
const { v4: uuidv4 } = require('uuid');

const deletedUserSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    email: {type: String, required: true}
    
  },{strictQuery: false});
  
  module.exports = mongoose.model("deletedUsers", deletedUserSchema);