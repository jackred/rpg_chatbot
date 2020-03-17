'use strict';

const uuidv1 = require('uuid/v1');

const AlanaUtility = require('./AlanaUtility');
const AlanaBuildMessage = require('./AlanaBuildMessage');
const AlanaList = require('./AlanaList');
const AlanaVoice = require('./AlanaVoice');

const config = require('../config.json');


function createSessionId() {
  return `${config.project}.${uuidv1()}`;

}

async function startDialog(message, text, db, client){
  const splitted = AlanaUtility.reduceWhitespace(text);
  if (splitted[0].length !== 1) { throw 'Prefix should be one character'; }
  const requestDialog = await db.findDialogByPrefix(splitted[0]);
  if (requestDialog !== null) {
    const requestConfig = await db.findByIdConfig(requestDialog.config);
    throw `There's already a dialog using the prefix ${splitted[0]} with the config ${requestConfig.name}`;
  }
  const requestConfig = await db.findConfigByName(splitted[1]);
  if (requestConfig === null) { throw `There's no configuration named ${splitted[1]}`; }
  const dialog = {};
  dialog.prefix = splitted[0];
  dialog.session_id = createSessionId();
  dialog.config = requestConfig._id;
  db.addDialog(dialog).then(d => message.channel.send(d));
}


function endDialog(message, text, db, client) {
  if (text.length != 1) { throw 'Prefix should be one character'; }
  db.removeDialog({prefix: text}).then(d => message.channel.send(d));
}

function listDialog(message, text, db, client) {
  console.log('list');
  db.findInCollection({}, {'_id': 0, '__v':0 }, 0, 'dialogs').then(async resDialogs => { 
    AlanaList.sendList(message.channel, resDialogs, async (d) => await AlanaBuildMessage.buildEmbedListDialog(d, db));
  });
  return true;
}

async function toggleDialog(message, text, db, client, resDialog, oneP, twoP) {
  if (resDialog === null) { throw "This prefix doesn't exist"; }
  if (resDialog[oneP]) {
    if (!resDialog[twoP]) {
      AlanaVoice.leaveChannelBotIsIn(client);
    }
  } else {
    if (AlanaVoice.isInVoiceChannel(client)) {
      AlanaVoice.makeMemberJoinInChannel(message.member, client);
    } else {
      AlanaVoice.joinMemberInChannel(message.member);
    }
    await db.updateOneDialog({[oneP]: true}, {'$set': {[oneP]: false}});
  }
  await db.updateOneDialog({prefix: text}, {'$set': {[oneP]: !resDialog[oneP]}});
}


async function talkToggleDialog(message, text, db, client) {
  const resDialog = await db.findDialogByPrefix(text);
  await toggleDialog(message, text, db, client, resDialog, 'talk', 'listen');
  message.channel.send(await AlanaBuildMessage.buildEmbedDialog(await db.findDialogByPrefix(text, {"_id": 0, "__v": 0}), db));
}


async function listenToggleDialog(message, text, db, client, tts, stt) {
  let resDialog = await db.findDialogByPrefix(text);
  await toggleDialog(message,text, db, client, resDialog, 'listen', 'talk');
  message.channel.send(await AlanaBuildMessage.buildEmbedDialog(await db.findDialogByPrefix(text, {"_id": 0, "__v": 0}), db));
}

module.exports = { 
  startDialog,
  endDialog,
  listDialog,
  talkToggleDialog,
  listenToggleDialog
};
