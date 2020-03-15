'use strict';


const AlanaGuildManager = require('./AlanaGuildManager');
const AlanaVoice = require('./AlanaVoice');
const AlanaRequest = require('./AlanaRequest');

const config = require('../config.json');


function setOption(value) {
  if (value) {
    return  {value: true, setAt: Date.now()};
  } else {
    return {value: false};
  }
}


function isTalkListenArg(text) {
  if (text.replace('talk', '').replace('listen','').replace(' ','') !== '') {
    throw 'Argument for start function should be `talk` or/and `listen`';
  }
  const args = text.split(' ');
  let res = {};
  res.talk = setOption(args.some(d => d === 'talk'));
  res.listen = setOption(args.some(d => d === 'listen'));
  return res;
}

async function checkChannel(user, channel, db) {
  const dbChannel = await db.findOneChannelByUserID(user.id);
  if (dbChannel === null) {
    throw "You need first to react to the rules message to obtain a channel to play in";
  }
  if (dbChannel.channelID !== channel.id) {
    channel.guild.channels.resolve(dbChannel.channelID).send(`Hey ${user} you should play here. This is your assigned channel!`);
    return false;
  }
  return true;
}

async function checkOptionDB(optionDB, db) {
  let msg = '';
  // todo timeout
  if ((optionDB.talk.value) && (await db.findOneDialogGameTalk() !== null)) {
    msg += `There's already someone using the text to speech function. You'll have to wait`;
  }
  if ((optionDB.listen.value) && (await db.findOneDialogGameListen() !== null)) {
    msg += `There's already someone using the speech to text function. You'll have to wait`;
  }
  if ((optionDB.gpt2.value) && (await db.findOneDialogGameGPT2() !== null)) {
    msg += `There's already someone using the gpt2 dialog game. You'll have to wait`;
  }
  if (msg !== '') {
    throw msg;
  }
}


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


async function startGame(channel, member, db, requestText, client, optionDB={}, tts) {
  if (await checkChannel(member.user, channel, db)) {
    const dbDialog = await db.findOneDialogGameByChannelID(channel.id);
    console.log(dbDialog);
    if (dbDialog !== null) {
      throw `There's already a game going on!`;
    } else {
      await checkOptionDB(optionDB, db);
      await db.addDialogGame({...optionDB, channelID: channel.id});
      await AlanaGuildManager.assignSTTandTTSRoles(member, optionDB);
      if (optionDB.talk.value) {
	channel.send('Please join the voice channel to be able to hear the bot');
	AlanaVoice.joinChannel(client.channels.resolve(config.tts.channel));
	await sleep(5000); // easier than create a listener for the user to join vocal, talk, and delete the listener
      } else if (optionDB.listen.value) {
	channel.send('Please join the voice channel to be able to talk to the bot');
	await AlanaVoice.joinChannel(client.channels.resolve(config.stt.channel));
      }
      await AlanaRequest.answerGame(requestText, channel, optionDB, db, client, tts);
    }
  }
}


async function startGameClassic(message, text, db, client, tts, stt) {
  await startGame(message.channel, message.member, db, 'start_game', client, {gpt2: {value: false}, ...isTalkListenArg(text)}, tts);
}


async function startGameGPT2(message, text, db, client, tts, stt) {
  await startGame(message.channel, message.member, db, 'start_game_gpt2', client, {gpt2: {value: true, setAt: Date.now()}, ...isTalkListenArg(text)}, tts);
}


async function startGameGuided(message, text, db, client, tts, stt) {
  await startGame(message.channel, message.member, db, 'start_game_close', client, {gpt2: {value: false}, ...isTalkListenArg(text)}, tts);
}


async function endGame(message, text, db, client, tts, stt) {
  // request end
  await AlanaRequest.answerGame('end_game', message.channel, {talk: {value: false}}, db, client, tts);
  await db.removeDialogGames({channelID: message.channel.id});
  await AlanaVoice.leaveChannelBotIsIn(client);
  await AlanaGuildManager.removeSTTandTTSRoles(message.member);
  await message.member.voice.kick();
  
}


module.exports = { 
  startGameClassic,
  startGameGPT2,
  startGameGuided,
  endGame
};
