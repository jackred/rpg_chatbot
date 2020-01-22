const Discord = require('discord.js');
const request = require('request-promise-native');
const uuidv1 = require('uuid/v1');
const config = require('./config.json');
const { answer } = require('./src/AlanaRequest');
const { AlanaDB } = require('./src/AlanaDB');
const { config_schema } = require('./src/model/config');


let database = new AlanaDB();

const client = new Discord.Client();
client.on('ready', () => {
  console.log('Starting!');
  client.user.setActivity('Listening');
});


client.on('message', msg => answer(msg, msg, database));


client.login(config.token)
  .then(() => console.log("We're in!"))
  .catch((err) => console.log(err));
