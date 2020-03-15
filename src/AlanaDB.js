'use strict';

const mongoose = require('mongoose');

const config = require('../config.json');

const configSchema = require('./model/configs');
const dialogSchema = require('./model/dialogs');
const channelSchema = require('./model/channels');
const configGameSchema = require('./model/configsGame');
const dialogGameSchema = require('./model/dialogsGame');

const uniqueConfigGame = require('./model/configsGameUnique');

/*
  /!\ TODO /!\
  simplify db function
  findOneInCollection

  findOneEachCollection

  findParticular
*/

class AlanaDB {
  constructor(){
    this.initDb();
  }
  
  async initDb() {
    this.db = await mongoose.connect("mongodb://172.18.0.2:27017/alana", {useNewUrlParser: true, useUnifiedTopology: true});
    //this.db = await mongoose.connect(config.mongo, {useNewUrlParser: true, useUnifiedTopology: true});
    // less ugly way? TODO
    this.db.model('configs', configSchema);
    this.db.model('dialogs', dialogSchema);
    this.db.model('channels', channelSchema);
    this.db.model('configs_game', configGameSchema);
    this.db.model('dialogs_game', dialogGameSchema);
    // add default config // reset
    this.findOneAndUpdateInCollection({}, uniqueConfigGame, {upsert: true, useFindAndModify: false}, 'configs_game');
  }

  findOneAndUpdateInCollection(filter={}, update={}, options={}, collection='configs') {
    return this.db.models[collection].findOneAndUpdate(filter, update, options).exec();
  }
  
  findOneInCollection(filter={}, projection={}, collection='configs') {
    console.log('DB: to find', filter);
    return this.db.models[collection].findOne(filter, projection).lean().exec();
  }

  findInCollection(filter={}, projection={}, limit=0, collection='configs') {
    return this.db.models[collection].find(filter, projection).lean().limit(limit).exec();
  }

  findByIdInCollection(id, collection='configs') {
    return this.db.models[collection].findById(id).lean().exec();
  }

  addInCollection(added={}, options={}, collection='configs') {
    console.log('DB: to add', added);
    return this.db.models[collection]
      .insertMany(added, options)
      .then(res => {
	let  msg = `${res.length} object(s) added to collection ${collection}`;
	console.log('DB:', msg);
	return msg;
      });
  }

  updateOneInCollection(filter={}, doc={}, options={}, collection='configs') {
    console.log('DB: filter', filter);
    console.log('DB: update', doc);
    return this.db.models[collection]
      .updateOne(filter, doc, options)
      .then(updatedObject => {
	let  msg = `${updatedObject.nModified} object(s) updated to collection ${collection}`;
	console.log('DB:', msg);
	return  msg;
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
	console.log(`DB: ${msg}`);
	return {deletedConfig, msg};
      });
  }

  addConfig(configToAdd) {
    return this.addInCollection(configToAdd);
  }

  addDialog(dialogToAdd) {
    return this.addInCollection(dialogToAdd, {}, 'dialogs');
  }

  addChannel(channelToAdd) {
    return this.addInCollection(channelToAdd, {}, 'channels');
  }

  addDialogGame(dialogGameToAdd) {
    return this.addInCollection(dialogGameToAdd, {}, 'dialogs_game');
  }

  findConfigGame() {
    return this.findOneInCollection({}, {'_id': 0, 'overrides': 1}, 'configs_game');
  }

  findByIdConfig(id) {
    return this.findOneInCollection(id);
  }
  
  findConfigByName(name, projection={}) {
    return this.findOneInCollection({name}, projection);
  }
  
  findDialogByPrefix(prefix, projection={}) {
    return this.findOneInCollection({prefix}, projection, 'dialogs');
  }

  findOneDialogListen() {
    return this.findOneInCollection({listen: true}, {}, 'dialogs');
  }

  findOneDialogTalk() {
    return this.findOneInCollection({talk: true}, {}, 'dialogs');
  }

  findOneDialogGameListen() {
    return this.findOneInCollection({"listen.value": true}, {}, 'dialogs_game');
  }

  findOneDialogGameTalk() {
    return this.findOneInCollection({"talk.value": true}, {}, 'dialogs_game');
  }

  findOneDialogGameGPT2() {
    return this.findOneInCollection({"gpt2.value": true}, {}, 'dialogs_game');
  }
  
  findOneDialogGameByChannelID(channelID) {
    return this.findOneInCollection({channelID}, {}, 'dialogs_game');
  }
  
  findOneChannelByUserID (userID) {
    return this.findOneInCollection({userID}, {}, 'channels');
  }

  findOneChannelByChannelID (channelID) {
    return this.findOneInCollection({channelID}, {}, 'channels');
  }
  
  removeConfigAndReturn(configToRemove) {
    return this.findOneAndDeleteInCollection(configToRemove);
  }

  removeDialog(dialogToRemove) {
    return this.deleteInCollection(dialogToRemove, {}, 'dialogs');
  }

  removeDialogGames(dialogGameToRemove) {
    return this.deleteInCollection(dialogGameToRemove, {}, 'dialogs_game');
  }

  updateOneDialog(filter, doc, options={}) {
    return this.updateOneInCollection(filter, doc, options, 'dialogs');
  }
}


module.exports = AlanaDB;

