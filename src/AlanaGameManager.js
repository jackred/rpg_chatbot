'use strict';


const AlanaGame = require('./AlanaGame');
const config = require('../config.json');

function timeDiff(date1, date2=Date.now()) {
  return date2 - date1; 
}


function isThereAHour(date) {
  return timeDiff(date) >= config.timeout;
}


async function clearTalk(db, client, tts) {
  const talkDialog = await db.findOneDialogGameTalk();
  if ((talkDialog !== null) && (talkDialog.talk) && isThereAHour(talkDialog.usedAt)) {
    const dbChannel = await db.findOneChannelByChannelID(talkDialog.channelID);
    const chan = client.channels.resolve(talkDialog.channelID);
    await chan.send('Closing the game by timeout.');
    await AlanaGame.endGameAction(chan, chan.guild.members.resolve(client.users.resolve(dbChannel.userID)), db, client, tts);
  }
}


async function clearListen(db, client, tts) {
  const listenDialog = await db.findOneDialogGameTalk();
  if ((listenDialog !== null) && (listenDialog.listen) && isThereAHour(listenDialog.usedAt)) {
    const dbChannel = await db.findOneChannelByChannelID(listenDialog.channelID);
    const chan = client.channels.resolve(listenDialog.channelID);
    await chan.send('Closing the game by timeout.');
    await AlanaGame.endGameAction(chan, chan.guild.members.resolve(client.users.resolve(dbChannel.userID)), db, client, tts);
  }
}


async function clearGPT2(db, client, tts) {
  const gpt2Dialog = await db.findOneDialogGameGPT2();
  if ((gpt2Dialog !== null) && (gpt2Dialog.gpt2) && isThereAHour(gpt2Dialog.usedAt)) {
    const dbChannel = await db.findOneChannelByChannelID(gpt2Dialog.channelID);
    const chan = client.channels.resolve(gpt2Dialog.channelID);
    await chan.send('Closing the game by timeout.');
    await AlanaGame.endGameAction(chan, chan.guild.members.resolve(client.users.resolve(dbChannel.userID)), db, client, tts);
  }
}


async function clearOldGPT2OrVoice(db, client, tts) {
  console.log('clear');
  await clearGPT2(db, client, tts);
  await clearTalk(db, client, tts);
  await clearListen(db, client, tts);
}


module.exports = {
  clearOldGPT2OrVoice
};
