const mongoose = require('mongoose');

var channelSchema = new mongoose.Schema(
  {
    userID: {type: String, required: true},
    channelID: {type: String, required: true}
  }
);

module.exports = channelSchema;
