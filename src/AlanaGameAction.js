'use strict';

const AlanaGuildManager = require('./AlanaGuildManager');
const AlanaVoice = require('./AlanaVoice');

// this is ugly, but it works so far
async function deleteGame(channel, member, db, client) {
  await db.removeDialogGames({channelID: channel.id});
  await AlanaVoice.leaveChannelBotIsIn(client);
  await AlanaGuildManager.removeVoiceRole(member);
  await member.voice.kick();
}

module.exports = {
  deleteGame
};
