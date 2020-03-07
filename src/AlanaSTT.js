'use strict';

// todo
// make it individual from the voice request, only tts / stt

const SpeechToTextV1 = require('ibm-watson/speech-to-text/v1');
const fs = require('fs');
const { IamAuthenticator } = require('ibm-watson/auth');
const config = require('../config.json');


class AlanaSTT {
  constructor() {
    this.speechToText = new SpeechToTextV1({
      authenticator: new IamAuthenticator({ apikey: config.stt.apiKey }),
      url: config.stt.urlAuth
    });
    this.fileName = './question.mp3';
  }

  buildParam() {
    const audio = fs.createReadStream(this.fileName);
    return {
      contentType: 'audio/mp3',
      model: config.stt.model,
      maxAlternatives: 1,
      audio
    };
  }
  
  // need to be a function out of stt
  async translate(voiceConnection, user, speaking, resDialog, client, db, tts) {
    const params = this.buildParam();
    const response = await this.speechToText.recognize(params);
    console.log("INFO: received response:", JSON.stringify(response.result, null, 2));
    if (response.result.results.length == 0) {
      throw 'No text was detected in the audio mesage';
    } else {
      return response.result.results[0].alternatives[0].transcript;
    }
  }

}


module.exports = AlanaSTT;
