const mongoose = require('mongoose');

const dialogSchema = new mongoose.Schema(
  {
    prefix: {type: String, require: true},
    session_id: {type: String, require: true},
    config: {type: mongoose.ObjectId, require: true},
    listen: {type: Boolean, default: false},
    talk: {type: Boolean, default: false}
  }
);

module.exports = dialogSchema;
