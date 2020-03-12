'use string';

const permission = require('../permission.json');
const AlanaParser = require('./AlanaParser');

class AlanaCommand {
  constructor(action, subCommand={},
	      generalHelp='', help='', perm=permission.level.default,
	      parser=AlanaParser.defaultParser) {
    this.action = action; // function
    this.subCommand = subCommand; // map of Command
    this.generalHelp = (generalHelp === '') ? this.defaultGeneralHelp : generalHelp; // function > string
    this.help = (help === '') ? this.defaultHelp : help; // function > string
    this.permission = perm; // int
    this.parser = parser; // fuction -> [string]
  }
  // todo: add a help function for `helpXXX`
  // that return `generalHelp` + `help`
  defaultHelp() {
    let msg = this.generalHelp();
    for (let command in this.subCommand) {
      msg +='  ' + this.subCommand[command].generalHelp();
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
