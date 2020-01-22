const { RichEmbed } = require('discord.js');
const request = require('request-promise-native');
const uuidv1 = require('uuid/v1');
const config = require('../config.json');


function send_embed(channel, text, author)  {
  let embed = new RichEmbed()
      .setAuthor(author)
      .setColor('#FAA')
      .setTitle(text)
      .setTimestamp(Date());
  channel.send(embed);
}


function create_session_id() {
  return `${config.project}.${uuidv1()}`;

}


function build_request(question, data) {
  data.question = question;
  data.session_id = create_session_id();
  data.user_id = config.user_id;
  return data;
}


function build_options(question, data_bot, uri=config.alana) {
  const data = build_request(question, data_bot);
  return {
    method: 'POST',
    uri: uri,
    body: data,
    json: true
  };
}


function request_alana(question, request_config) {
  const options = build_options(question, request_config.data);
  return request.post(options)
    .then(res => {
      console.log(`ANSWER: ${res.result}`);
      return res;
    })
    .catch(e => console.log(`ERR: ${e}`));
}


async function answer(message, text, db) {
  const request_config = await db.find_prefix(message.content[0]);
  console.log( `INFO: prefix found: ${request_config !== null}`);
  if (request_config !== null) { // else not a prefix, regular message
    res = await request_alana(message.content.substr(1), request_config);
    send_embed(message.channel, res.result, res.bot_name);
  }
}


module.exports = { 
  answer
};
