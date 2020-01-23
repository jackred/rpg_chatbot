'use strict';

const config = require('../config.json');
const AlanaUtility = require('./AlanaUtility');

function prefixParser(text) {
  let res = -1;
  for (let prefix in config.prefix) { // yeah iterating over all keys when I would have do a while and stop when needed...but I'm lazy this time
    console.log(prefix, config.prefix[prefix]);
    console.log('text', text);
    console.log('start? ', text.startsWith(config.prefix[prefix]));
    if (text.startsWith(config.prefix[prefix])){
      let rest = text.replace(config.prefix[prefix], '');
      console.log('->>', rest);
      res = {'first': config.prefix[prefix], 'rest': rest.trim()};
    }
  }
  return res;
}


function defaultParser(text, word=' ') {
  let res = AlanaUtility.splitIn2(text, word);
  return {'first': res[0], 'rest': (res.length === 1) ? '' : res[1].trim() };
}


module.exports = { 
  defaultParser,
  prefixParser
};
