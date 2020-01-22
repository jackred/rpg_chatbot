const mongoose = require('mongoose');
const config = require('../config.json');
const { config_schema } = require('./model/config');


class AlanaDB {
  constructor(){
    this.initDb();
  }
  
  async initDb() {
    //this.db = await mongoose.connect("mongodb://172.18.0.2:27017/alana", {useNewUrlParser: true});
    this.db = await mongoose.connect(config.mongo, {useNewUrlParser: true});
    this.db.model('configs', config_schema);
  }
  
  find_prefix(prefix) {
      return this.db.models.configs.findOne({prefix}).exec();
  }
}

module.exports = { 
  AlanaDB
};

