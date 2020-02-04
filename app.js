const Discord = require('discord.js');
const config = require('./config.json');
// const exec = require('child_process').exec;
// const fs = require('fs').promises;
// class
const AlanaDB = require('./src/AlanaDB');
const AlanaController = require('./src/AlanaController');
const AlanaCommand = require('./src/AlanaCommand');

// module
const AlanaRequest = require('./src/AlanaRequest');
const AlanaParser = require('./src/AlanaParser');
const AlanaConfig = require('./src/AlanaConfig');
const AlanaDialog = require('./src/AlanaDialog');



let database = new AlanaDB();

const client = new Discord.Client();
client.on('ready', () => {
  console.log('Starting!');
  client.user.setActivity(`Listening to : ${config.prefix.general}`);
});

// config command
let createConfigCommand = new AlanaCommand(
  AlanaConfig.createConfig,
  {},
  () => `\`${config.prefix.general}config create <JSON>\n\``,
  function () {
    return this.generalHelp() + 'Create a configuration. Configuration pecify the bots to use in the request.\nE.g:\n `'+ config.prefix.general +'config create {JSON TEMPLATE}`\n';
  }
);

let deleteConfigCommand = new AlanaCommand(
  AlanaConfig.deleteConfig,
  {},
  () => `\`${config.prefix.general}config delete <configuration name>\n\``,
  function () {
    return this.generalHelp() + 'Delete a configuration, and all the dialog using it.  bot to use in the request.\nE.g:\n `'+ config.prefix.general +'config delete test_config`\n';
  }
);

let getConfigCommand = new AlanaCommand(
  AlanaConfig.getConfig,
  {},
  () => `\`${config.prefix.general}config get <name>\n\``,
  function () {
    return this.generalHelp() + 'Print the JSON of the config named <name>. Useful to copy it.\nE.g:'+config.prefix.general+'config get config1\n';
  }
);

let templateConfigCommand = new AlanaCommand(
  AlanaConfig.printTemplate,
  {},
  () => `\`${config.prefix.general}config template\n\``,
  function () {
    return this.generalHelp() + 'Print a template of configuration\n';
  }
);

let listConfigCommand = new AlanaCommand(
  AlanaConfig.listConfig,
  {},
  () => `\`${config.prefix.general}config list\n\``,
  function () {
    return this.generalHelp() + 'List all the configuration\n';
  }
);

let configCommand = new AlanaCommand(
  () => console.log("INFO: Config command called"),
  {'create': createConfigCommand, 'delete': deleteConfigCommand, 'template': templateConfigCommand, 'list': listConfigCommand, 'get': getConfigCommand},
  function() {
    return `${config.prefix.general}\`config <subcomand>\`` + '\n'
      + this.listSubCommand().join(', ') + '\n'; // counter productive, but the indentation is ugly other ways
  }
);

// dialog command
let listDialogCommand = new AlanaCommand(
  AlanaDialog.listDialog,
  {},
  () => `\`${config.prefix.general}dialog list\n\``,
  function () { // redundant
    return this.generalHelp() + 'List all the dialog\n';
  }
);

let startDialogCommand = new AlanaCommand(
  AlanaDialog.startDialog,
  {},
  () => `\`${config.prefix.general}dialog start <prefix> <config name>\n\``,
  function () {
    return this.generalHelp() + 'Start a dialog using a specific configuration. To talk to Alana, start your message with your <prefix>.\nE.g:\n `'+ config.prefix.general +'dialog start ! config_test`\n`!hello Alana`\n';
  }
);

let endDialogCommand = new AlanaCommand(
  AlanaDialog.endDialog,
  {},
  () => `\`${config.prefix.general}dialog end <prefix>\n\``,
  function () {
    return this.generalHelp() + 'End a dialog (specify it by using the <prefix>).\nE.g:\n `'+ config.prefix.general +'dialog end !`\n';
  }
);

let talkDialogCommand = new AlanaCommand(
  AlanaDialog.talkToggleDialog,
  {},
  () => `\`${config.prefix.general}dialog talk <prefix>\n\``,
  function () {
    return this.generalHelp() + "Toggle the talk function. If it's true and the user is in a vocalChannel, the chatbot will join the user in the channel and read the next message with text to speech. If toggled to false, the bot will leave the channel.\n";
  }
);

let listenDialogCommand = new AlanaCommand(
  AlanaDialog.listenToggleDialog,
  {},
  () => `\`${config.prefix.general}dialog listen <prefix>\n\``,
  function () {
    return this.generalHelp() + "Toggle the listen function. If it's true and the user is in a vocalChannel, the chatbot will join the user in the channel and listen to the user. If toggled to false, the bot will leave the channel.\n";
  }
);

let dialogCommand = new AlanaCommand(
  () => console.log("INFO: Dialog command called"),
  {'start': startDialogCommand, end: endDialogCommand, list: listDialogCommand, 'talk': talkDialogCommand, 'listen': listenDialogCommand}, 
  function() {
    return `${config.prefix.general}\`dialog <subcomand>\`` + '\n'
      + this.listSubCommand().join(', ') + '\n'; // counter productive, but the indentation is ugly other ways
  }
);



// console.log(std.length);
// fs.writeFile("./test.wav", std)
// 	.then((err) => {
// 	  if (err) throw err;
// 	  console.log('The file has been saved!');
// 	})
// 	.then(_ => {
// console.log('hey');
// console.log(voiceChannel);

// let testCommand = new AlanaCommand(
//   (msg, text, db) => {
//     console.log('s');
//     exec('espeak -w ./test.wav -s 120 -v english "' + text+ '"', (err, std, ste) => {
//       var voiceChannel = msg.member.voiceChannel;
//       voiceChannel.join()
// 	.then(connection => {
// 	  const dispatcher = connection.playFile('./test.wav');
// 	  dispatcher.on('end', end => voiceChannel.leave());
// 	})
// 	.catch(err => console.log(err));
//     });
//   });

// general command
let generalPrefixCmd = new AlanaCommand(
  () => console.log("INFO: Prefix general called"),
  {'dialog': dialogCommand, 'config': configCommand},
  function(){
    return `General Command prefix: ${config.prefix.general}\n`
      + this.listSubCommand().map(d => `\`${d}\``).join(', ')
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



client.login(config.token).then(() => console.log("We're in!")).catch((err) => console.log(err));
