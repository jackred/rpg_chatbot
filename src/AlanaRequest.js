'use strict';

const { RichEmbed } = require('discord.js');
const request = require('request-promise-native');
const uuidv1 = require('uuid/v1');
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


function buildRequest(question, data) {
  data.question = question;
  data.session_id = createSessionId();
  data.user_id = config.user_id;
  return data;
}


function buildOptions(question, dataBot, uri=config.alana) {
  const data = buildRequest(question, dataBot);
  return {
    method: 'POST',
    uri: uri,
    body: data,
    json: true
  };
}


function requestAlana(question, requestConfig) {
  const options = buildOptions(question, requestConfig.data);
  return request.post(options)
    .then(res => {
      console.log(`ANSWER: ${res.result}`);
      return res;
    })
    .catch(e => console.log(`ERR: ${e}`));
}


async function answer(message, text, db) {
  const requestConfig = await db.findPrefix(message.content[0]);
  console.log( `INFO: prefix found: ${requestConfig !== null}`);
  if (requestConfig !== null) { // else not a prefix, regular message
    const res = await requestAlana(message.content.substr(1), requestConfig);
    sendEmbed(message.channel, res.result, res.bot_name, requestConfig.name);
  }
}


module.exports = { 
  answer
};
