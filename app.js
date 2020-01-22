const Discord = require('discord.js');
const request = require('request-promise-native');
const uuidv1 = require('uuid/v1');
const mongoose = require('mongoose');
const config = require('./config.json');
const { config_schema } = require('./src/model/config');

mongoose.connect(config.mongo, {useNewUrlParser: true});
// mongoose.connect("mongodb://172.18.0.2:27017/alana", {useNewUrlParser: true});
const config_model = mongoose.model('configs', config_schema);


const client = new Discord.Client();
client.on('ready', () => {
  console.log('Starting!');
  client.user.setActivity('Listening');
});


function send_embed(channel, text, author)  {
  let embed = new Discord.RichEmbed()
      .setAuthor(author)
      .setColor('#FAA')
      .setTitle(text)
      .setTimestamp(Date());
  channel.send(embed);
}


function get_template() {
  return require('./config_alana.json');
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


function db_find_config(prefix) {
  console.log(prefix);
  return config_model.findOne({prefix}).exec();
}


async function answer(message) {
  const request_config = await db_find_config(message.content[0]);
  console.log( `INFO: prefix found: ${request_config !== null}, ${request_config}`);
  if (request_config !== null) { // else not a prefix, regular message
    res = await request_alana(message.content.substr(1), request_config);
    send_embed(message.channel, res.result, res.bot_name);
  }
}


client.on('message', answer);


client.login(config.token)
  .then(() => console.log("We're in!"))
  .catch((err) => console.log(err));
