'use strict';

const config = require('../config.json');

class AlanaController {
  constructor(client, command, reaction, vocalMessage,  db) {
    this.client = client;
    this.command = command;
    this.reaction = reaction;
    this.db = db;
    this.createHandler();
  }

  createHandler() {
    this.client.on('message', this.handleMessage.bind(this));
    this.client.on('guildMemberSpeaking', this.handleVocalMessage.bind(this));
    //this.client.on('messageReactionAdd', this.handleReaction.bind(this));
    //this.client.on('messageReactionRemove', this.handleReaction.bind(this));
  }
  
  handleReaction(){}


  handleVocalMessage(member, speaking){
    console.log(member.displayName, "is talking?", speaking);
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
    this.catchErrorCommand((msg => command.action.call(command, msg, text, this.db, this.client)), message);// some action can trigger command AND args
  }

  catchError(channel, error){
    console.log('Error:', error);
    channel.send('```A problem occured:\n' + error +'```');
  }
}

module.exports = AlanaController;
