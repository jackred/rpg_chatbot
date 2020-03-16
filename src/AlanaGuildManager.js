'use strict';


const permission = require('../permission.json');
const config = require('../config.json');


async function createChannel(reaction, user, db, client) {
  if ((!(reaction.message.pinned)) || (reaction.message.channel.id !== config.rulesChannel)) { return; }
  let channel = await db.findOneChannelByUserID(user.id);
  if (channel !== null) {
    await client.channels.resolve(channel.channelID).send(`Hey ${user}! You already have an assigned channel. You can discuss with the bot and play here!`);
  } else {
    const guild = reaction.message.guild;
    const newChan = await guild.channels.create(`${user.username}-channel`,
			  {
			    parent: reaction.message.channel.parentID,
			    permissionOverwrites:
			    [
			      {
				id: guild.roles.everyone,
				deny: ['VIEW_CHANNEL', 'SEND_MESSAGES']
			      },
			      {
				id: user.id,
				allow: ['VIEW_CHANNEL', 'SEND_MESSAGES']
			      },
			      ...permission.admins.roles.map(rID => {
				return {
				  id: rID,
				  allow: ['VIEW_CHANNEL', 'SEND_MESSAGES']
				};
			      })
			    ]
			  } );
    
    await db.addChannel({channelID: newChan.id, userID: user.id});
    newChan.send(`Hey ${user}!, You have now an assigned channel to play.`);
  }
  await reaction.remove();
}


async function removeRoles(member, rolesID) {
  await member.roles.remove(rolesID);
}

async function assignRoles(member, rolesID) {
  await member.roles.add(rolesID);
}


async function removeVoiceRole(member) {
  let role = config.voiceRole;
  await removeRoles(member, role);
}

async function assignVoiceRole(member, options) {
  if ((options.talk.value) || (options.listen.value)) {
    await assignRoles(member, config.voiceRole);
  }
}

module.exports = { 
  createChannel,
  assignVoiceRole,
  removeVoiceRole
};
