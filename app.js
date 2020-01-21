const Discord = require('discord.js');
const request = require('request-promise-native');
const uuidv1 = require('uuid/v1');
const config = require('./config.json');


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

function build_request(question) {
  let data = get_template();
  data.question = question;
  data.session_id = create_session_id();
  return data;
}

function build_options(question, uri=config.alana) {
  const data = build_request(question);
  return {
    method: 'POST',
    uri: uri,
    body: data,
    json: true
  };
}

function request_alana(question) {
  const options = build_options(question);
  return request.post(options)
    .then(res => {
      console.log(`ANSWER: ${res.result}`);
      return res;
    })
    .catch(e => console.log(`ERR: ${e}`));
}


client.on('message', async (message) => {
  if (message.content.startsWith('!')) {
    res = await request_alana(message.content.substr(1));
    send_embed(message.channel, res.result, res.bot_name);
  }
});


client.login(config.token)
  .then(() => console.log("We're in!"))
  .catch((err) => console.log(err));



