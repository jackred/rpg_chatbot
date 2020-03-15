const mongoose = require('mongoose');

var dialogGameSchema = new mongoose.Schema(
  {
    channelID: {type: String, require: true},
    listen: {
      value: {type: Boolean, default: false},
      setAt: {type: Date}
    },
    talk: {
      value: {type: Boolean, default: false},
      setAt: {type: Date}
    },
    gpt2: {
      value: {type: Boolean, default: false},
      setAt: {type: Date}
    },
  }
);

module.exports = dialogGameSchema;
