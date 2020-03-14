const mongoose = require('mongoose');

var configGameSchema = new mongoose.Schema(
  {
    data: {
      overrides: {
	BOT_LIST: [{type: mongoose.Schema.Types.Mixed, required: true}],
	PRIORITY_BOTS: [{type: mongoose.Schema.Types.Mixed, required: true}]
      }
    }
  },
  {
    capped: {
      size: 100000,
      max: 1
    }
  }
);

module.exports = configGameSchema;
