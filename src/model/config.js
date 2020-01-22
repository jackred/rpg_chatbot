const mongoose = require('mongoose');

var config_schema = new mongoose.Schema(
  {
    name: {type: String, required: true},
    prefix: {type: String, require: true},
    data: {
      overrides: {
	BOT_LIST: [{type: mongoose.Schema.Types.Mixed, required: true}],
	PRIORITY_BOTS: [{type: mongoose.Schema.Types.Mixed, required: true}] 
      }
    }
  }
);

module.exports = { 
  config_schema
};
