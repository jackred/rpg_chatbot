const Discord = require('discord.js');

// configs
const config = require('./config.json');
const permission = require('./permission.json');

// class
const AlanaDB = require('./src/AlanaDB');
const AlanaController = require('./src/AlanaController');
const AlanaCommand = require('./src/AlanaCommand');
const AlanaTTS = require('./src/AlanaTTS');
const AlanaSTT = require('./src/AlanaSTT');

// module
const AlanaRequest = require('./src/AlanaRequest');
const AlanaParser = require('./src/AlanaParser');
const AlanaConfig = require('./src/AlanaConfig');
const AlanaDialog = require('./src/AlanaDialog');
const AlanaGame = require('./src/AlanaGame');
const AlanaGuildManager = require('./src/AlanaGuildManager');
const AlanaGameManager = require('./src/AlanaGameManager');


let database = new AlanaDB();
let tts = new AlanaTTS();
let stt = new AlanaSTT();


const client = new Discord.Client({ partials: ['MESSAGE', 'REACTION'] });
client.on('ready', () => {
  console.log('Starting!');
  client.user.setActivity(`Listening to : ${config.prefix.dev}`);
  const chan = client.channels.resolve(config.rulesChannel);
  const emoji = chan.guild.emojis.cache.find(d => d.name === 'play');
  chan.messages.fetchPinned().then(msgs => msgs.forEach(msg => msg.react(emoji)));
});

// config command
let createConfigCommand = new AlanaCommand(
  AlanaConfig.createConfig,
  {},
  () => `\`${config.prefix.dev}config create <JSON>\n\``,
  function () {
    return this.generalHelp() + 'Create a configuration. Configuration pecify the bots to use in the request.\nE.g:\n `'+ config.prefix.dev +'config create {JSON TEMPLATE}`\n';
  }
);

let deleteConfigCommand = new AlanaCommand(
  AlanaConfig.deleteConfig,
  {},
  () => `\`${config.prefix.dev}config delete <configuration name>\n\``,
  function () {
    return this.generalHelp() + 'Delete a configuration, and all the dialog using it.  bot to use in the request.\nE.g:\n `'+ config.prefix.dev +'config delete test_config`\n';
  }
);

let getConfigCommand = new AlanaCommand(
  AlanaConfig.getConfig,
  {},
  () => `\`${config.prefix.dev}config get <name>\n\``,
  function () {
    return this.generalHelp() + 'Print the JSON of the config named <name>. Useful to copy it.\nE.g:'+config.prefix.dev+'config get config1\n';
  }
);

let templateConfigCommand = new AlanaCommand(
  AlanaConfig.printTemplate,
  {},
  () => `\`${config.prefix.dev}config template\n\``,
  function () {
    return this.generalHelp() + 'Print a template of configuration\n';
  }
);

let listConfigCommand = new AlanaCommand(
  AlanaConfig.listConfig,
  {},
  () => `\`${config.prefix.dev}config list\n\``,
  function () {
    return this.generalHelp() + 'List all the configuration\n';
  }
);

let configCommand = new AlanaCommand(
  () => console.log("INFO: Config command called"),
  {'create': createConfigCommand, 'delete': deleteConfigCommand, 'template': templateConfigCommand, 'list': listConfigCommand, 'get': getConfigCommand},
  function() {
    return `\`${config.prefix.dev}config <subcomand>\`\n${this.listSubCommand().join(', ')}\n`;
  }
);

// dialog command
let listDialogCommand = new AlanaCommand(
  AlanaDialog.listDialog,
  {},
  () => `\`${config.prefix.dev}dialog list\n\``,
  function () { // redundant
    return this.generalHelp() + 'List all the dialog\n';
  }
);

let startDialogCommand = new AlanaCommand(
  AlanaDialog.startDialog,
  {},
  () => `\`${config.prefix.dev}dialog start <prefix> <config name>\n\``,
  function () {
    return this.generalHelp() + 'Start a dialog using a specific configuration. To talk to Alana, start your message with your <prefix>.\nE.g:\n `'+ config.prefix.dev +'dialog start ! config_test`\n`!hello Alana`\n';
  }
);

let endDialogCommand = new AlanaCommand(
  AlanaDialog.endDialog,
  {},
  () => `\`${config.prefix.dev}dialog end <prefix>\n\``,
  function () {
    return this.generalHelp() + 'End a dialog (specify it by using the <prefix>).\nE.g:\n `'+ config.prefix.dev +'dialog end !`\n';
  }
);

let talkDialogCommand = new AlanaCommand(
  AlanaDialog.talkToggleDialog,
  {},
  () => `\`${config.prefix.dev}dialog talk <prefix>\n\``,
  function () {
    return this.generalHelp() + "Toggle the talk function. If it's true and the user is in a vocalChannel, the chatbot will join the user in the channel and read the next message with text to speech. If toggled to false, the bot will leave the channel.\n";
  }
);

let listenDialogCommand = new AlanaCommand(
  AlanaDialog.listenToggleDialog,
  {},
  () => `\`${config.prefix.dev}dialog listen <prefix>\n\``,
  function () {
    return this.generalHelp() + "Toggle the listen function. If it's true and the user is in a vocalChannel, the chatbot will join the user in the channel and listen to the user. If toggled to false, the bot will leave the channel.\n";
  }
);

let dialogCommand = new AlanaCommand(
  () => console.log("INFO: Dialog command called"),
  {'start': startDialogCommand, end: endDialogCommand, list: listDialogCommand, 'talk': talkDialogCommand, 'listen': listenDialogCommand}, 
  function() {
    return `\`${config.prefix.dev}dialog <subcomand>\`\n${this.listSubCommand().join(', ')}\n`;
  }
);


// dev command
let devPrefixCmd = new AlanaCommand(
  () => console.log("INFO: Dev prefix called"),
  {'dialog': dialogCommand, 'config': configCommand},
  function(){
    return `Dev Command prefix: ${config.prefix.dev}\n${this.listSubCommand().map(d => `\`${d}\``).join(', ')}\n`;
  },
  '',
  permission.level.admins
);


//game commands
let startGameCommand = new AlanaCommand(
  AlanaGame.startGameClassic,
  {}, 
  () => `\`${config.prefix.game}start_game\n\``,
  function () {
    return this.generalHelp() + "Start a normal game using fixed dialog.";
  }
);

let startGameGPT2Command = new AlanaCommand(
  AlanaGame.startGameGPT2,
  {}, 
  () => `\`${config.prefix.game}start_game_gpt2\n\``,
  function () {
    return this.generalHelp() + "Start a normal game using gpt2 dialog. There could only be one gpt2 game at a time, go it may be already used when you try. Please try another time. There's a timeout of 5 mins without activity on this type of dialog.";
  }
);

let startGameGuidedCommand = new AlanaCommand(
  AlanaGame.startGameGuided,
  {}, 
  () => `\`${config.prefix.game}start_game_guided\n\``,
  function () {
    return this.generalHelp() + "Start a normal game using guided dialog. Every possible option will be disclaused to you when the game master will give you description.";
  }
);

let endGameCommand = new AlanaCommand(
  AlanaGame.endGame,
  {},
  () => `\`${config.prefix.game}end_game\n\``,
  function () {
    return this.generalHelp() + "Terminate any type of game. It will also close the channel you're in.";
  }
);

// game command
let gamePrefixCmd = new AlanaCommand(
  () => console.log("INFO: Game prefix called"),
  {
    'start_game': startGameCommand,
    'start_game_gpt2': startGameGPT2Command,
    'start_game_guided': startGameGuidedCommand,
    'end_game': endGameCommand
  },
  function(){
    return `Game Command prefix: ${config.prefix.game}\n${this.listSubCommand().map(d => `\`${d}\``).join(', ')}\n`;
  },
);


let cmdMessage = new AlanaCommand(
  AlanaRequest.answer,
  {[config.prefix.dev]: devPrefixCmd, [config.prefix.game]: gamePrefixCmd},
  '',
  '',
  permission.level.blacklist,
  AlanaParser.prefixParser
);


let reactionPlay = new AlanaCommand(
  AlanaGuildManager.createChannel,
  {},
  '',
  '',
  permission.level.blacklist
);

let reactionCmd = {'play': reactionPlay};

let controller = new AlanaController(client, cmdMessage, reactionCmd, {}, database, tts, stt);


const interval = setInterval(() => {
  AlanaGameManager.clearOldGPT2OrVoice(database, client, tts);
}, config.timeout);


client.login(config.token).then(() => console.log("We're in!")).catch((err) => console.log(err));

