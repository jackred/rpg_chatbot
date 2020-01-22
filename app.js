const Discord = require('discord.js');
const config = require('./config.json');

// class
const AlanaDB = require('./src/AlanaDB');
const AlanaController = require('./src/AlanaController');
const AlanaCommand = require('./src/AlanaCommand');

// module
const AlanaRequest = require('./src/AlanaRequest');
const AlanaParser = require('./src/AlanaParser');
const AlanaConfig = require('./src/AlanaConfig');


let database = new AlanaDB();

const client = new Discord.Client();
client.on('ready', () => {
  console.log('Starting!');
  client.user.setActivity('Listening');
});

// config command
let createCommand = new AlanaCommand(
  AlanaConfig.create,
  {},
  () => `Create a config` // 
);

let configCommand = new AlanaCommand(
  () => console.log("INGO: Config command called"),
  {'create': createCommand},
  function() {
    console.log("wtf");
    return `${config.prefix.general}\`config <subcomand>\`.` + '\n'
      + this.listSubCommand().join(', ') + '\n'; // counter productive, but the indentation is ugly other ways
  }
);

// dialog command
let dialogCommand = new AlanaCommand(
  () => console.log("INGO: Dialog command called"),
  {},
  function() {
    console.log("wtf");
    return `${config.prefix.general}\`dialog <subcomand>\`.` + '\n'
      + this.listSubCommand().join(', ') + '\n'; // counter productive, but the indentation is ugly other ways
  }
);

// general command
let generalPrefixCmd = new AlanaCommand(
  () => console.log("INFO: Prefix general called"),
  {'dialog': dialogCommand, 'config': configCommand},
  function(){
    return `General Command prefix: ${config.prefix.general}\n`
      + this.listSubCommand().join(', ')
      + '\n';
  },
);

let cmd = new AlanaCommand(
  AlanaRequest.answer,
  {[config.prefix.general]: generalPrefixCmd},
  '',
  '',
  AlanaParser.prefixParser
);


let controller = new AlanaController(client, cmd, {}, database);



client.login(config.token)
  .then(() => console.log("We're in!"))
  .catch((err) => console.log(err));
