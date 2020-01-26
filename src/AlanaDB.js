'use strict';

const mongoose = require('mongoose');
const config = require('../config.json');
const configSchema = require('./model/configs');
const dialogSchema = require('./model/dialogs');


class AlanaDB {
  constructor(){
    this.initDb();
  }
  
  async initDb() {
    //this.db = await mongoose.connect("mongodb://172.18.0.2:27017/alana", {useNewUrlParser: true});
    this.db = await mongoose.connect(config.mongo, {useNewUrlParser: true, useUnifiedTopology: true});
    this.db.model('configs', configSchema);
    this.db.model('dialogs', dialogSchema);
  }

  findOneInCollection(filter={}, projection={}, collection='configs') {
    return this.db.models[collection].findOne(filter, projection).lean().exec();
  }

  findInCollection(filter={}, projection={}, limit=0, collection='configs') {
    return this.db.models[collection].find(filter, projection).lean().limit(limit).exec();
  }

  findByIdInCollection(id, collection='configs') {
    return this.db.models[collection].findById(id).lean().exec();
  }

  addInCollection(added={}, options={}, collection='configs') {
    console.log('to add', added);
    return this.db.models[collection]
      .insertMany(added, options)
      .then(res => {
	let  msg = `${res.length} object(s) added to collection ${collection}`;
	console.log('DB:', msg);
	return msg;
      });
  }

  deleteInCollection(filter={}, options={}, collection='configs') {
    return this.db.models[collection]
      .deleteMany(filter, options)
      .then(res => {
	let  msg = `${res.n} object(s) removed from collection ${collection}`;
	console.log('DB:', msg);
	return msg;
      });
  }

  findOneAndDeleteInCollection(filter={}, option={}, collection='configs') {
    return this.db.models[collection]
      .findOneAndDelete(filter, option)
      .lean()
      .then(deletedConfig => {
	let msg = '';
	if (deletedConfig !== null) {
	  msg = `1 object removed from collection ${collection}`;
	} else {
	  msg = `no objects matched in collection ${collection}`;
	}
	return {deletedConfig, msg};
      });
  }

  addConfig(configToAdd) {
    return this.addInCollection(configToAdd);
  }

  addDialog(dialogToAdd) {
    return this.addInCollection(dialogToAdd, {}, 'dialogs');
  }

  findByIdConfig(id) {
    return this.findOneInCollection(id);
  }
  
  findConfigByName(name, projection={}) {
    return this.findOneInCollection({name}, projection);
  }
  
  findDialogByPrefix(prefix) {
    return this.findOneInCollection({prefix}, {}, 'dialogs');
  }

  removeConfigAndReturn(configToRemove) {
    return this.findOneAndDeleteInCollection(configToRemove);
  }

  removeDialog(configToRemove) {
    return this.deleteInCollection(configToRemove, {}, 'dialogs');
  }
}


module.exports = AlanaDB;

