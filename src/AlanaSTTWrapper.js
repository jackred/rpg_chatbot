'use strict';

const AlanaRequest = require("./AlanaRequest");
const AlanaBuildMessage = require("./AlanaBuildMessage");
const AlanaVoice = require("./AlanaVoice");
const lame = require('lame');
const fs = require('fs');
const config = require('../config.json');


function pcmStreamToMP3file(pcmStream, fileName='./question.mp3') {
  const encoder = new lame.Encoder({ channels: 2, bitDepth: 16, sampleRate: 48000 });
  encoder.on("close", () => console.log('INFO: finished converting to MP3 audio'));
  const fileStream = fs.createWriteStream(fileName);
  return pcmStream.pipe(encoder).pipe(fileStream);
}


function getStreamUserSpeaking(user, voiceConnection) {
  const stream = voiceConnection.receiver.createStream(user, { mode: 'pcm' });
  return stream;
}


async function handleVoiceMessage(fn, member, channel, stt) {
  const textFromVoice = await stt.translate();
  channel.send(AlanaBuildMessage.buildEmbedSTTMessage(textFromVoice, member));
  fn(textFromVoice);
}

async function handleVoiceMessageGame(member, listenDialog, client, db, tts, stt) {
  const chan = client.channels.resolve(listenDialog.channelID);
  const fn = (text) => AlanaRequest.answerGame(text, chan, listenDialog, db, client, tts);
  handleVoiceMessage(fn, member, chan, stt);
}

async function handleVoiceMessageDev(member, listenDialog, client, db, tts, stt) {
  const defaultChannel = client.channels.resolve(config.defaultChannel);
  const fn = (text) => AlanaRequest.answerWithDialog(listenDialog, text, client, defaultChannel, db, tts);
  handleVoiceMessage(fn, member, defaultChannel, stt);
}

function listen(speaking, member, voiceConnection, listenDialog, options, fn) {
  if (speaking.equals(1)) {
    console.log('INFO: user talking?', member.user.username, speaking);
    const speakingStream = getStreamUserSpeaking(member, voiceConnection);
    const mp3WrittingStream = pcmStreamToMP3file(speakingStream);
    mp3WrittingStream.on("close", () => fn(member, listenDialog, ...options));
  } else if (speaking.equals(0)) {
    console.log('INFO: user talking?', member.user.username, speaking);
  } 
}

function listenGame(speaking, member, voiceConnection, listenDialogGame, options) {
  listen(speaking, member, voiceConnection, listenDialogGame, options, handleVoiceMessageGame);
}

function listenDev(speaking, member, voiceConnection, listenDialog, options) {
  listen(speaking, member, voiceConnection, listenDialog, options, handleVoiceMessageDev);
}

module.exports = { 
  listenDev,
  listenGame
};
