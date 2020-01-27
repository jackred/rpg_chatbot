'use strict';

const uuidv1 = require('uuid/v1');

const AlanaUtility = require('./AlanaUtility');
const AlanaBuildMessage = require('./AlanaBuildMessage');
const AlanaList = require('./AlanaList');

const config = require('../config.json');


function createSessionId() {
  return `${config.project}.${uuidv1()}`;

}

async function startDialog(message, text, db){
  const splitted = AlanaUtility.reduceWhitespace(text);
  if (splitted[0].length !== 1) { throw 'Prefix should be one character'; }
  const requestDialog = await db.findDialogByPrefix(splitted[0]);
  if (requestDialog !== null) { throw `There's already a dialog using the prefix ${splitted[0]}: ${requestDialog.name}`; }
  const requestConfig = await db.findConfigByName(splitted[1]);
  if (requestConfig === null) { throw `There's no configuration named ${splitted[1]}`; }
  const dialog = {};
  dialog.prefix = splitted[0];
  dialog.session_id = createSessionId();
  dialog.config = requestConfig._id;
  db.addDialog(dialog).then(d => message.channel.send(d));
}


function endDialog(message, text, db) {
  if (text.length != 1) { throw 'Prefix should be one character'; }
  db.removeDialog({prefix: text}).then(d => message.channel.send(d));
}

function listDialog(message, text, db) {
  db.findInCollection({}, {}, 0, 'dialogs').then(async resDialogs => {
    AlanaList.sendList(message.channel, resDialogs, async (d) => await AlanaBuildMessage.buildEmbedListDialog(d, db));
  });
}

module.exports = { 
  startDialog,
  endDialog,
  listDialog
};
