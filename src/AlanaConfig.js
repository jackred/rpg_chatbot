'use strict';

const AlanaBuildMessage = require('./AlanaBuildMessage');
const AlanaList = require('./AlanaList');


function insertConfigIfNotName(jsonConfig, db) {
  return db.findConfigByName(jsonConfig.name)
    .then(res => {
      if (res === null) {
	return db.addConfig(jsonConfig);
      } else {
	throw `There's already a configuration with the name ${jsonConfig.name}`;
      }
    });
}

async function createConfig(message, text, db, client){
  let jsonConfig = {};
  try {
    jsonConfig = JSON.parse(text);
    console.log('INFO: Config:', jsonConfig);
  } catch(error) {
    throw `Incorrect JSON: ${error.message}`;
  }
  await insertConfigIfNotName(jsonConfig, db).then(d => message.channel.send(d));
}

async function deleteConfig(message, text, db, client) {
  const { deletedConfig, msg } = await db.removeConfigAndReturn({name: text});
  message.channel.send(msg);
  if (deletedConfig !== null){
    db.removeDialog({config: deletedConfig._id}).then(d => message.channel.send(d));
  }
}

function listConfig(message, text, db, client) {
  db.findInCollection().then(resConfigs => {
    AlanaList.sendList(message.channel, resConfigs, AlanaBuildMessage.buildEmbedListConfig);
  });
}

function getConfig(message, text, db, client) {
  console.log(text);
  db.findConfigByName(text, {'name': 1, 'data':1, '_id': 0}).then(d => {
    let msg = '';
    if (d === null){
      msg = 'No config with this name.';
    } else {
      msg = '```json\n' + JSON.stringify(d) + '```';
    }
    message.channel.send(msg);
  });
}

function printTemplate(message, text, db, client) {
  message.channel.send('```json\n{"name":"NAME", "data": {"overrides": {"BOT_LIST": ["BOT1", "BOT2", "BOT3"], "PRIORITY_BOTS":[["BOT2", "BOT1"], "BOT3"]}}}```');
}

module.exports = { 
  createConfig,
  deleteConfig,
  listConfig,
  getConfig,
  printTemplate
};
