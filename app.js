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
const AlanaDialog = require('./src/AlanaDialog');



let database = new AlanaDB();

const client = new Discord.Client();
client.on('ready', () => {
  console.log('Starting!');
  client.user.setActivity('Listening');
});

// config command
let createConfigCommand = new AlanaCommand(
  AlanaConfig.createConfig,
  {},
  () => `\`${config.prefix.general}config create <JSON>\n\``,
  function () {
    return this.generalHelp() + 'Create a configuration. Configuration pecify the bots to use in the request.\nE.g:\n `'+ config.prefix.general +'config create {JSON TEMPLATE}`';
  }
);

let deleteConfigCommand = new AlanaCommand(
  AlanaConfig.deleteConfig,
  {},
  () => `\`${config.prefix.general}config delete <configuration name>\n\``,
  function () {
    return this.generalHelp() + 'Delete a configuration, and all the dialog using it.  bot to use in the request.\nE.g:\n `'+ config.prefix.general +'config delete test_config`';
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

let configCommand = new AlanaCommand(
  () => console.log("INFO: Config command called"),
  {'create': createConfigCommand, 'delete': deleteConfigCommand, 'template': templateConfigCommand},
  function() {
    return `${config.prefix.general}\`config <subcomand>\`` + '\n'
      + this.listSubCommand().join(', ') + '\n'; // counter productive, but the indentation is ugly other ways
  }
);

// dialog command
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

let dialogCommand = new AlanaCommand(
  () => console.log("INFO: Dialog command called"),
  {'start': startDialogCommand, end: endDialogCommand},
  function() {
    return `${config.prefix.general}\`dialog <subcomand>\`` + '\n'
      + this.listSubCommand().join(', ') + '\n'; // counter productive, but the indentation is ugly other ways
  }
);

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



client.login(config.token)
  .then(() => console.log("We're in!"))
  .catch((err) => console.log(err));
