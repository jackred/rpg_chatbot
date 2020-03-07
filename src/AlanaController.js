'use strict';

const config = require('../config.json');
const AlanaSTTWrapper = require('./AlanaSTTWrapper');
const AlanaVoice = require('./AlanaVoice');

class AlanaController {
  constructor(client, command, reaction, vocalMessage,  db, tts, stt) {
    this.client = client;
    this.command = command;
    this.reaction = reaction;
    this.db = db;
    this.tts = tts;
    this.stt = stt;
    this.createHandler();
  }

  createHandler() {
    this.client.on('message', this.handleMessage.bind(this));
    this.client.on('guildMemberSpeaking', this.handleVocalMessage.bind(this));
    //this.client.on('messageReactionAdd', this.handleReaction.bind(this));
    //this.client.on('messageReactionRemove', this.handleReaction.bind(this));
  }
  
  handleReaction(){}


  async handleVocalMessage(member, speaking){
    const listenDialog = await this.db.findOneDialogListen();
    if (listenDialog.listen) {
      const voiceConnection = AlanaVoice.getVoiceConnection(this.client);
      try{
	AlanaSTTWrapper.listen(speaking, member, voiceConnection, listenDialog, [this.client, this.db, this.tts, this.stt]);
      } catch (error) {
	this.catchError(this.client.channels.resolve(config.default_channel), error);
      }
    }
  }

  async catchErrorCommand(fn, message){
    try {
      await fn(message);
    } catch (error){
      this.catchError(message.channel, error);
    } 
  }
  
  handleMessage(message) {
    if (message.author.bot) { return; }
    if (message.channel.type === 'dm'){
    } else if (message.channel.type === 'text') {
      this.handleCommand(this.command, message, message.content);

    }
  }

  handleCommand(command, message, text) {
    let parsed = command.parser(text);
    if (parsed !== -1){
      if (parsed.first === config.help){
	message.channel.send(command.help.call(command));
	return;
      }
      if (parsed.first in command.subCommand){
	this.handleCommand(command.subCommand[parsed.first], message, parsed.rest);
      }
    }
    this.catchErrorCommand((msg => command.action.call(command, msg, text, this.db, this.client, this.tts, this.stt)), message);// some action can trigger command AND args
  }

  catchError(channel, error){
    console.log('Error:', error);
    channel.send('```A problem occured:\n' + error +'```');
  }
}

module.exports = AlanaController;
