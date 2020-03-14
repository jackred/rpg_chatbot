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


async function handleVoiceMessage(member, listenDialog, client, db, tts, stt) {
  const textFromVoice = await stt.translate();
  const defaultChannel = client.channels.resolve(config.defaultChannel);
  defaultChannel.send(AlanaBuildMessage.buildEmbedSTTMessage(textFromVoice, member, listenDialog.prefix));
  AlanaRequest.answerWithDialog(listenDialog, textFromVoice, client, defaultChannel, db, tts);
}


function listen(speaking, member, voiceConnection, listenDialog, options) {
  if (speaking.equals(1)) {
    console.log('INFO: user talking?', member.user.username, speaking);
    const speakingStream = getStreamUserSpeaking(member, voiceConnection);
    const mp3WrittingStream = pcmStreamToMP3file(speakingStream);
    mp3WrittingStream.on("close", () => handleVoiceMessage(member, listenDialog, ...options));
  } else if (speaking.equals(0)) {
    console.log('INFO: user talking?', member.user.username, speaking);
  }
}


module.exports = { 
  listen
};
