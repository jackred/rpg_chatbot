'use strict';


const TextToSpeechV1 = require('ibm-watson/text-to-speech/v1');
const fs = require('fs');
const { IamAuthenticator } = require('ibm-watson/auth');
const { tts: configTTS } = require('../config.json');
const AlanaVoice = require('./AlanaVoice.js');


class AlanaTTS {
  constructor() {
    this.textToSpeech = new TextToSpeechV1({
      authenticator: new IamAuthenticator({ apikey: configTTS.apiKey }),
      url: configTTS.urlAuth
    });
    this.fileName = 'answer.wav';
  }

  playStream(stream, voiceConnection) {
    const dispatcher = voiceConnection.playStream(stream);
    dispatcher.on('end', end => console.log('INFO: finished speaking'));
  }

  buildParam(text) {
    return {
      text: text,
      accept: 'audio/wav',
      voice: configTTS.voice,
    };
  }

  requestApi(params) {
    return this.textToSpeech.synthesize(params);
  }

  writeFile(res) {
    return res.result.pipe(fs.createWriteStream(this.fileName));
  }
  
  speakStream(text, voiceConnection) {
    const params = this.buildParam(text);
    this.requestApi(params).then(res => {
      this.playStream(res.result, voiceConnection);
    });
  }

  speakFile(text, voiceConnection) {
    const params = this.buildParam(text);
    this.requestApi(params).then(res => {
      const stream = this.writeFile(res);
      stream.on('finish', d => {
	console.log('finish');
	voiceConnection.playFile(this.fileName);
      });
    });
  }

  speak(text, voiceConnection) {
    this.speakStream(text, voiceConnection);
  }
}


module.exports = AlanaTTS;
