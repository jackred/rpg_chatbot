'use strict';

const { RichEmbed } = require('discord.js');


function buildEmbedAnswer(text, author, configName)  {
  let embed = new RichEmbed()
      .setAuthor(author)
      .setColor('#AFFF000')
      .setTitle(text)
      .setTimestamp()
      .setFooter(configName);
  return embed;
}

function buildEmbedListTemplate() {
  let embed = new RichEmbed()
      .setColor('#44FF11')
      .setTimestamp();
  return embed;
}

function buildEmbedListConfig(configs) {
  let embed = buildEmbedListTemplate();
  embed.setTitle('List of configuration');
  for (let conf of configs) {
    const title = conf.name;
    console.log(conf);
    // array of object/string to string
    let value = Object.keys(conf.data.overrides).map(k => k + ': '+ conf.data.overrides[k].map(JSON.stringify).join(', ')).join('\n');
    embed.addField(title, value);
  }
  return embed;
}

module.exports = { 
  buildEmbedAnswer,
  buildEmbedListConfig
};
