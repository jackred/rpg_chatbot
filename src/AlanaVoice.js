'use strict';

// function VoiceEventHandler(oldMember, newMember) {
//   console.log(newMember);
// }

// VoiceEventHandler.setListen = function(listen) { this.listen = listen; };
// VoiceEventHandler.setTalk = function(talk) { this.talk = talk; };

function checkUserInVoiceChannel(member) {
  return member.voiceChannel !== undefined;
}


function joinChannel(channel) {
  channel.join().then(d => console.log(`INFO! joined ${d.channel.name}`));
}


function leaveChannel(channel) {
  if (channel !== undefined) {
    channel.leave();
    console.log(`INFO! left ${channel.name}`);
  } 
}


function leaveChannelBotIsIn(client) {
  const connections = client.voiceConnections.first();
  if (connections !== undefined) {
    leaveChannel(connections.channel);
  }  
}


function leaveAllChannel(client) {
  client.voiceConnections.forEach(c => leaveChannel(c));
}


function joinMemberInChannel(member) {
  if (!checkUserInVoiceChannel(member)) { throw `${member.displayName} isn't in a VoiceChannel`; }
  joinChannel(member.voiceChannel);
}


function leaveMemberInChannel(member) {
  if (!checkUserInVoiceChannel(member)) { throw `${member.displayName} isn't in a VoiceChannel`; }
  leaveChannel(member.voiceChannel);
}


function getVoiceChannel(client) {
  return client.voiceConnections.first().channel;
}


function isInVoiceChannel(client) {
  return client.voiceConnections.size !== 0;
}


function makeMemberJoinInChannel(member, client) {
  member.setVoiceChannel(getVoiceChannel(client));
}


module.exports = { 
  isInVoiceChannel,
  makeMemberJoinInChannel,
  joinMemberInChannel,
  leaveChannelBotIsIn
};