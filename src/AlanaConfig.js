'use strict';

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

async function createConfig(message, text, db){
  let jsonConfig = {};
  try {
    jsonConfig = JSON.parse(text);
    console.log('INFO: Config:', jsonConfig);
  } catch(error) {
    throw `Incorrect JSON: ${error.message}`;
  }
  await insertConfigIfNotName(jsonConfig, db).then(d => message.channel.send(d));
}

async function deleteConfig(message, text, db) {
  const { deletedConfig, msg } = await db.removeConfigAndReturn({name: text});
  message.channel.send(msg);
  if (deletedConfig !== null){
    db.removeDialog({config: deletedConfig._id}).then(d => message.channel.send(d));
  }
}

function printTemplate(message, text, db) {
  message.channel.send('```{"name":"NAME", "data": {"overrides": {"BOT_LIST": ["BOT1", "BOT2", "BOT3"], "PRIORITY_BOTS":[["BOT2", "BOT1"], "BOT3"]}}}```');
}

module.exports = { 
  createConfig,
  deleteConfig,
  printTemplate
};
