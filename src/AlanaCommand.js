'use string';

const AlanaParser = require('./AlanaParser');

class AlanaCommand {
  constructor(action, subCommand={},
	      generalHelp='', help='', 
	      parser=AlanaParser.defaultParser) {
    this.action = action; // function
    this.subCommand = subCommand; // map of Command
    this.help = (help === '') ? this.defaultHelp : help; // function > string
    this.generalHelp = (generalHelp === '') ? this.defaultGeneralHelp : generalHelp; // function > string
    this.parser = parser; // fuction -> [string]
  }

  defaultHelp() {
    console.log('just before', this);
    let msg = this.generalHelp();
    for (let command in this.subCommand) {
      msg += this.subCommand[command].generalHelp();
    }
    return msg;
  }

  defaultGeneralHelp() {
    return '';
  }

  listSubCommand(){
    return Object.keys(this.subCommand);
  }
}

module.exports = AlanaCommand;



