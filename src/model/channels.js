const mongoose = require('mongoose');

var channelSchema = new mongoose.Schema(
  {
    userID: {type: String, required: true},
    channelID: {type: String, required: true},
    usedAt: {type: Date, default: Date.now}
  }
);

module.exports = channelSchema;
