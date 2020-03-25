'use strict';

const request = require('request-promise-native');
const AlanaBuildMessage = require('./AlanaBuildMessage');
const AlanaGameAction = require('./AlanaGameAction');
const AlanaVoice = require('./AlanaVoice');
const config = require('../config.json');
const permission = require('../permission.json');


function createSessionId() {
  return `${config.project}.${uuidv1()}`;

}


function buildRequest(question, data, session_id) {
  data.question = question;
  data.user_id = config.user_id;
  data.projectId = config.projectId;
  data.session_id = session_id;
  data.overrides.BOT_TIMEOUT = 30;
  return data;
}


function buildOptions(question, dataBot, session_id, uri=config.alana) {
  const data = buildRequest(question, dataBot, session_id);
  console.log(`INFO: Request to ${uri}:`, JSON.stringify(data));
  return {
    method: 'POST',
    uri: uri,
    body: data,
    json: true
  };
}


function requestAlana(options) {
  return request.post(options)
    .then(res => {
      console.log(`ANSWER: ${res.result}`, res);
      return res;
    })
    .catch(e => console.log(`ERR: ${e}`));
}


async function answerGame(text, channel, optionsDB, db, client, tts) {
  const requestConfigGame = await db.findConfigGame();
  const options = buildOptions(text, requestConfigGame, channel.id);
  const res = await requestAlana(options);
  if (res.bot_params.name !== undefined) {
    await db.updateOneDialogGamesNPC({channelID: channel.id}, res.bot_params.name);
  }
  console.log('option', optionsDB.npc, 'res', res.bot_params);
  channel.send(AlanaBuildMessage.buildEmbedAnswer(res.result, res.bot_params.name || optionsDB.npc || res.bot_name, 'RPG_Bot'));
  console.log("INFO: answer", res.result);
  if (optionsDB.talk) {
    console.log('trying to speak');
    await AlanaVoice.readAnswer(res.result, res.bot_params.voice, client, tts);
  }
  if (res.bot_params.over) {
    const dbChannel = await db.findOneChannelByChannelID(channel.id);
    await AlanaGameAction.deleteGame(channel, channel.members.get(dbChannel.userID), db, client);
  }
}

async function answerWithDialog(requestDialog, text, client, channel, db, tts) {
  const requestConfig = await db.findByIdConfig(requestDialog.config);
  const options = buildOptions(text, requestConfig.data, requestDialog.session_id);
  const res = await requestAlana(options);
  channel.send(AlanaBuildMessage.buildEmbedAnswer(res.result, res.bot_params.name || res.bot_name, requestConfig.name));
  console.log("INFO: answer", res.result);
  if (requestDialog.talk) {
    console.log('trying to speak');
    AlanaVoice.readAnswer(res.result, res.bot_params.voice, client, tts);
  }
}


async function answer(message, text, db, client, tts) {
  const requestChannel = await db.findOneChannelByChannelID(message.channel.id);
  console.log( `INFO: channel found: ${requestChannel !== null}`);
  if ((requestChannel !== null) && (requestChannel.userID === message.author.id)) {
    const requestDialogGame = await db.findOneDialogGameByChannelID(message.channel.id);
    if (requestDialogGame !== null) {
      await answerGame(text, message.channel, requestDialogGame, db, client, tts);
    } else {
      message.channel.send('You need to start game to discuss with the bot.');
    }
  } else {
    const requestDialog = await db.findDialogByPrefix(text[0]);
    console.log( `INFO: dialog prefix found: ${requestDialog !== null}`);
    if (requestDialog !== null) { // else not a prefix, regular message
      if (this.permission < permission.whitelist) {
	throw `Insufficient permisison`;
      }
      await answerWithDialog(requestDialog, text.substr(1), client, message.channel, db, tts);
    }
  }
}


module.exports = { 
  answer,
  answerGame,
  answerWithDialog
};


