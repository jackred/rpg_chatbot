'use strict';

const config = require('../config.json');
const AlanaUtility = require('./AlanaUtility');

function prefixParser(text) {
  let res = -1;
  for (let prefix in config.prefix) { // yeah iterating over all keys when I would have do a while and stop when needed...but I'm lazy this time
    console.log(prefix);
    if (text.startsWith(prefix)){
      let rest = text.replace(text, '');
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
