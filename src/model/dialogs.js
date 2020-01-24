const mongoose = require('mongoose');

var dialogSchema = new mongoose.Schema(
  {
    prefix: {type: String, require: true},
    session_id: {type: String, require: true},
    config: {type: mongoose.ObjectId, require: true}
  }
);

module.exports = dialogSchema;
