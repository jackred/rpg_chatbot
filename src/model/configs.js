const mongoose = require('mongoose');

const configSchema = new mongoose.Schema(
  {
    name: {type: String, required: true},
    data: {
      overrides: {
	BOT_LIST: [{type: mongoose.Schema.Types.Mixed, required: true}],
	PRIORITY_BOTS: [{type: mongoose.Schema.Types.Mixed, required: true}]
      }
    }
  }
);

module.exports = configSchema;
