'use strict';

const { TextChannel } = require('discord.js');

const config = require('../config.json');
const permission = require('../permission.json');

const AlanaSTTWrapper = require('./AlanaSTTWrapper');
const AlanaVoice = require('./AlanaVoice');

class AlanaController {
  constructor(client, command, reaction, vocalMessage,  db, tts, stt) {
    this.client = client;
    this.commands = command;
    this.reactions = reaction;
    this.db = db;
    this.tts = tts;
    this.stt = stt;
    this.createHandler();
  }

  createHandler() {
    this.client.on('message', this.handleMessage.bind(this));
    this.client.on('guildMemberSpeaking', this.handleVocalMessage.bind(this));
    this.client.on('messageReactionAdd', this.handleReactionAdd.bind(this));
    //this.client.on('messageReactionRemove', this.handleReaction.bind(this));
  }

  checkPermission(id, level, key) {
    return permission[level][key].some((d) => d === id);
  }

  checkRolesPermission(roles, level) {
    return roles.some(r => this.checkPermission(r.id, level, 'roles'));
  }
  
  checkLevelMessage(authorID, roles, channelID, level) {
    return this.checkPermission(authorID, level, 'users')
      || this.checkRolesPermission(roles, level)
      || this.checkPermission(channelID, level, 'channels');
  }
  
  getPermission(authorID, roles, channelID){
    if (this.checkLevelMessage(authorID, roles, channelID, 'admins')) { return permission.level.admins; }
    if (this.checkLevelMessage(authorID, roles, channelID, 'whitelist')) { return permission.level.whitelist; }
    if (this.checkLevelMessage(authorID, roles, channelID, 'blacklist')) { return permission.level.blacklist; }
    return permission.level.default;
  }
  
  async handleReactionAdd(reaction, user){
    if (user.bot) { return; }
    if (reaction.message.partial) { await reaction.message.fetch(); }
    if (reaction.partial) { await reaction.fetch(); }
    if (!(reaction.message.channel instanceof TextChannel)) { return; }
    if (reaction.emoji.name in this.reactions) {
      const permissionLevel = this.getPermission(user.id, reaction.message.guild.members.resolve(user).roles.cache , reaction.message.channel.id);
      const reactionCommand = this.reactions[reaction.emoji.name];
      const dmChannel = await user.createDM();
      if (permissionLevel < reactionCommand.permission) {
	this.sendError(dmChannel, 'Insufficient permission');
      } else {
	this.catchErrorCommand(() => reactionCommand.action.call(reactionCommand, reaction, user, this.db, this.client, this.tts, this.stt),
			      dmChannel);
      }
    }
  }

  async handleVocalMessage(member, speaking){
    const listenDialog = await this.db.findOneDialogListen();
    if (listenDialog.listen) {
      const voiceConnection = AlanaVoice.getVoiceConnection(this.client);
      try{
	AlanaSTTWrapper.listen(speaking, member, voiceConnection, listenDialog, [this.client, this.db, this.tts, this.stt]);
      } catch (error) {
	this.sendError(this.client.channels.resolve(config.defaultChannel), error);
      }
    }
  }

  async catchErrorCommand(fn, channel){
    try {
      return await fn();
    } catch (error){
      this.sendError(channel, error);
      return true;
    } 
  }
  
  handleMessage(message) {
    if (message.author.bot) { return; }
    if (message.channel.type === 'dm'){
      console.log('INFO: DM message received');
      message.reply("There's no DM functionality");
    } else if (message.channel.type === 'text') {
      this.handleMessageCommand(this.commands, message, message.content);
    }
  }

  async handleMessageCommand(command, message, text) {
    const permissionLevel = this.getPermission(message.author.id, message.member.roles.cache, message.channel.id);
    console.log('INFO: permission', permissionLevel, 'command permission', command.permission);
    if (permissionLevel < command.permission) {
      this.sendError(message.channel, 'Insufficient permission');
    } else {
      let parsed = command.parser(text);
      if (parsed !== -1){
	if (parsed.first === config.help){
	  message.channel.send(command.help.call(command));
	  return true;
	}
	if (parsed.first in command.subCommand){
	  const stopHere = await this.handleMessageCommand(command.subCommand[parsed.first], message, parsed.rest);
	  if (stopHere) { return stopHere; }
	}
      }
      const stopHere = await this.catchErrorCommand(async () => {
	return await command.action.call(command, message, text, this.db, this.client, this.tts, this.stt);
      },
						    message.channel);// some action can trigger command AND args
      return stopHere;
    }
    return false;
  }

  sendError(channel, error){
    console.log('Error:', error);
    channel.send('```A problem occured:\n' + error +'```');
  }
  
}

module.exports = AlanaController;
