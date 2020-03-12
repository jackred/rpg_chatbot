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
  }

  buildParam(text, voice) {
    return {
      text: text,
      accept: 'audio/opus',
      voice: voice,
    };
  }

  async translate(text, voice) {
    const params = this.buildParam(text, voice);
    const response =  await this.textToSpeech.synthesize(params);
    console.log("INFO: received voice stream:");
    return response.result;
  }
}


module.exports = AlanaTTS;
