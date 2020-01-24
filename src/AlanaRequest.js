'use strict';

const { RichEmbed } = require('discord.js');
const request = require('request-promise-native');
const config = require('../config.json');


function sendEmbed(channel, text, author, configName)  {
  let embed = new RichEmbed()
      .setAuthor(author)
      .setColor('#FAA')
      .setTitle(text)
      .setTimestamp()
      .setFooter(configName);
  channel.send(embed);
}


function createSessionId() {
  return `${config.project}.${uuidv1()}`;

}


function buildRequest(question, data, session_id) {
  data.question = question;
  data.user_id = config.user_id;
  data.projectId = config.projectId;
  data.session_id = session_id;
  return data;
}


function buildOptions(question, dataBot, session_id, uri=config.alana) {
  const data = buildRequest(question, dataBot, session_id);
  console.log(`INFO: Request to ${uri}:`, data);
  return {
    method: 'POST',
    uri: uri,
    body: data,
    json: true
  };
}


function requestAlana(question, requestDialog, requestConfig) {
  const options = buildOptions(question, requestConfig.data, requestDialog.session_id);
  return request.post(options)
    .then(res => {
      console.log(`ANSWER: ${res.result}`);
      return res;
    })
    .catch(e => console.log(`ERR: ${e}`));
}


async function answer(message, text, db) {
  const requestDialog = await db.findDialogByPrefix(message.content[0]);
  console.log( `INFO: dialog prefix found: ${requestDialog !== null}`);
  if (requestDialog !== null) { // else not a prefix, regular message
    const requestConfig = await db.findByIdConfig(requestDialog.config);
    const res = await requestAlana(message.content.substr(1), requestDialog, requestConfig);
    sendEmbed(message.channel, res.result, res.bot_name, requestConfig.name);
  }
}


module.exports = { 
  answer
};
