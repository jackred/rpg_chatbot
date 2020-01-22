'use strict';

const config = require('../config.json');

class AlanaController {
  constructor(client, command, reaction, db) {
    this.client = client;
    this.command = command;
    this.reaction = reaction;
    this.db = db;
    this.client.on('message', this.handleMessage.bind(this));
  }

  
  handleReaction(){}

  handleMention(){}

  handleAttachement(){}

  catchBadMessage(fn, message){
    try {
      fn(message);
    } catch (error){
      this.wrong_argument(message.channel, error);
    } 
  }
  
  handleMessage(message) {
    if (message.author.bot) { return; }
    if (message.channel.type === 'dm'){
    } else if (message.channel.type === 'text') {
      this.handleCommand(this.command, message, message.content, permission);
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
    // register command in db
    command.action.call(command, message, text, this.db); // some action can trigger command AND args
  }

  wrong_argument(channel, help){
    channel.send('Wrong argument given. Please, read the help below.\n' + help);
  }
}

module.exports = AlanaController;
