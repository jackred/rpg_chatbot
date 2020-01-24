const mongoose = require('mongoose');

var configSchema = new mongoose.Schema(
  {
    name: {type: String, required: true},
    data: {
      overrides: {
	BOT_LIST: [mongoose.Schema.Types.Mixed],
	PRIORITY_BOTS: [mongoose.Schema.Types.Mixed]
      }
    }
  }
);

module.exports = configSchema;
