'use strict';

// todo
// make it individual from the voice request, only tts / stt

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
    this.fileName = './test/answer.ogg';
  }

  play(resource, voiceConnection) {
    const dispatcher = voiceConnection.play(resource);
    dispatcher.on('end', end => console.log('INFO: finished speaking'));
  }

  buildParam(text, voice) {
    return {
      text: text,
      accept: 'audio/opus',
      voice: voice,
    };
  }

  requestApi(params) {
    return this.textToSpeech.synthesize(params);
  }

  writeFile(res) {
    return res.result.pipe(fs.createWriteStream(this.fileName));
  }
  
  speakFile(text, voiceConnection) {
    const params = this.buildParam(text);
    this.requestApi(params).then(res => {
      const stream = this.writeFile(res);
      stream.on('finish', d => {
	console.log('INFO: finished writing file');
	this.play(this.filename, voiceConnection);
      });
    });
  }

  speak(text, voice, voiceConnection) {
    const params = this.buildParam(text, voice);
    this.requestApi(params).then(res => {
       this.play(res.result, voiceConnection);
    });
  }
}


module.exports = AlanaTTS;
