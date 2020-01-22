'use strict';

function insertConfigIfNotPrefix(jsonConfig, db) {
  db.findPrefix(jsonConfig.prefix)
    .then(res => {
      if (res === null) {
	db.addInCollection(jsonConfig);
      } else {
	throw `There's already a configuration with the prefix ${jsonConfig.prefix}: ${res.name}`;
      }
    });
}

function create(message, text, db){
  try {
    const jsonConfig = JSON.parse(text);
    console.log(jsonConfig);
    insertConfigIfNotPrefix(jsonConfig, db);
  } catch(error) {
    throw `Incorrect JSON: ${error.message}`;
  }
}


module.exports = { 
  create
};
