const mongoose = require("mongoose");
const { v4: uuidv4 } = require('uuid');

const userSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    MagicLink: { 
        type     : String, 
        required : false,
        unique   : false,
        default  : uuidv4
      },
      MagicLinkExpired: { 
        type     : Boolean, 
        default  : false
      }  
  },{strictQuery: false});
  
  module.exports = mongoose.model("users", userSchema);