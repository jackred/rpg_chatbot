'use strict';

const mongoose = require('mongoose');
const config = require('../config.json');
const { configSchema } = require('./model/configs');


class AlanaDB {
  constructor(){
    this.initDb();
  }
  
  async initDb() {
    //this.db = await mongoose.connect("mongodb://172.18.0.2:27017/alana", {useNewUrlParser: true});
    this.db = await mongoose.connect(config.mongo, {useNewUrlParser: true});
    this.db.model('configs', configSchema);
  }

  findOneInCollection(filter={}, collection='configs') {
    return this.db.models[collection].findOne(filter).exec();
  }

  addInCollection(added={}, options={}, collection='configs') {
    this.db.models[collection]
      .insertMany(added, options)
      .then(d => console.log(`DB: object added to collection ${collection}`));
  }

  findPrefix(prefix) {
    return this.findOneInCollection({prefix}, 'configs');
  }
}



module.exports = AlanaDB;

