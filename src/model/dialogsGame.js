const mongoose = require('mongoose');

const dialogGameSchema = new mongoose.Schema(
  {
    channelID: {type: String, require: true},
    listen: {type: Boolean, default: false},
    talk: {type: Boolean, default: false},
    gpt2:{type: Boolean, default: false},
    usedAt: {type: Date, default: Date.now},
    npc: {type: String}
  }
);

module.exports = dialogGameSchema;
