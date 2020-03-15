const mongoose = require('mongoose');

const configGameSchema = new mongoose.Schema(
  {
    overrides: {
	BOT_LIST: [{type: mongoose.Schema.Types.Mixed, required: true}],
	PRIORITY_BOTS: [{type: mongoose.Schema.Types.Mixed, required: true}]
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
