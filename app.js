const Discord = require('discord.js');
const request = require('request-promise-native');
const uuidv1 = require('uuid/v1');
const config = require('./config.json');

// class
const AlanaDB = require('./src/AlanaDB');
const AlanaController = require('./src/AlanaController');
const AlanaCommand = require('./src/AlanaCommand');

// module
const AlanaRequest = require('./src/AlanaRequest');
const AlanaParser = require('./src/AlanaParser');


let database = new AlanaDB();

const client = new Discord.Client();
client.on('ready', () => {
  console.log('Starting!');
  client.user.setActivity('Listening');
});



let cmd = new AlanaCommand(
  AlanaRequest.answer,
  {},
  '',
  '',
  AlanaParser.prefixParser
);

client.on('message', msg => AlanaRequest.answer(msg, msg, database));


client.login(config.token)
  .then(() => console.log("We're in!"))
  .catch((err) => console.log(err));
