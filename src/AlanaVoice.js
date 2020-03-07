'use strict';

const AlanaSingleSilence = require('./AlanaSingleSilence');
const AlanaSTTWrapper = require('./AlanaSTTWrapper.js');

function checkUserInVoiceChannel(member) {
  return member.voice.channel !== null;
}


function joinChannel(channel) {
  channel.join().then(d => {
    console.log(`INFO! joined ${d.channel.name}`);
    const dispatcher = d.play(new AlanaSingleSilence(), { type: 'opus' });
    dispatcher.once('finish', _ => {
      console.log('INFO: finished playing silence');
    });
    d.receiver.on('debug', e => console.log('ERROR', e));
  });
}


function leaveChannel(channel) {
  if (channel !== undefined) {
    channel.leave();
    console.log(`INFO! left ${channel.name}`);
  } 
}


function leaveChannelBotIsIn(client) {
  const connections = client.voice.connections.first();
  if (connections !== undefined) {
    leaveChannel(connections.channel);
  }  
}


function leaveAllChannel(client) {
  client.voice.connections.forEach(c => leaveChannel(c));
}


function joinMemberInChannel(member) {
  if (!checkUserInVoiceChannel(member)) { throw `${member.displayName} isn't in a VoiceChannel`; }
  joinChannel(member.voice.channel);
}


function leaveMemberInChannel(member) {
  if (!checkUserInVoiceChannel(member)) { throw `${member.displayName} isn't in a VoiceChannel`; }
  leaveChannel(member.voiceChannel);
}


function getVoiceChannel(client) {
  console.log(client);
  return client.voice.connections.first().channel;
}


function isInVoiceChannel(client) {
  return client.voice.connections.size !== 0;
}

// assume there's only one connection, on the server
// if not, there should be a function to get the one on the current server
function getVoiceConnection(client) {
  return client.voice.connections.first();
}


function makeMemberJoinInChannel(member, client) {
  member.voice.setChannel(getVoiceChannel(client));
}


function readAnswer(answer, client, tts, voiceConnection) {
  if ((voiceConnection === undefined)) {
    voiceConnection = getVoiceConnection(client);
  }
  tts.speak(answer, voiceConnection);
}



module.exports = { 
  isInVoiceChannel,
  makeMemberJoinInChannel,
  joinMemberInChannel,
  leaveChannelBotIsIn,
  readAnswer,
  getVoiceConnection
};
