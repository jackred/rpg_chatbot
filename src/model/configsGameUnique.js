'use strict';


const uniqueConfigGame = {
  "overrides": {
    "BOT_LIST": [
      { "toby":"http://seblg.eu:5130/" },
      "aiml_bot",
      "evi",
      {"boby":"http://seblg.eu:5140/"}
    ],
    "PRIORITY_BOTS": [
      "toby",
      "eliza",
      "evi",
      "boby"
    ]
  }
};


module.exports = uniqueConfigGame;
