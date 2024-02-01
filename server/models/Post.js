const mongoose = require("mongoose");
const { v4: uuidv4 } = require('uuid');

const postSchema = new mongoose.Schema({
    image: {type: Array, required: false},
    username: {type: String, required: true},
    body: {type: String, required: true},
    date: {type: String, required: true},
    timeStamp: {type: Date, required: true},
    bookTitle: {type: String, required: true},
    bookAuthor: {type: String, required: true},
    id: { type: String, unique: true, default: uuidv4, }
  });
  
  module.exports = mongoose.model("posts", postSchema);