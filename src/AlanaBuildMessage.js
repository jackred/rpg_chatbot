'use strict';

const { RichEmbed } = require('discord.js');


function buildEmbedAnswer(text, author, configName)  {
  let embed = new RichEmbed()
      .setAuthor(author)
      .setColor('#AFFF00')
      .setTitle(text)
      .setTimestamp()
      .setFooter(configName);
  return embed;
}

function buildEmbedListTemplate(title) {
  let embed = new RichEmbed()
      .setColor('#44FF11')
      .setTimestamp()
      .setTitle(title);
  return embed;
}

function buildFieldConfig(conf) {
  const title = conf.name;
  // array of object/string to string
  let value = Object.keys(conf.data.overrides).map(k => k + ': '+ conf.data.overrides[k].map(JSON.stringify).join(', ')).join('\n');
  return [`**${title}**`, value];
}

function buildEmbedListConfig(configs) {
  let embed = buildEmbedListTemplate('List of configuration');
  for (let conf of configs) {
    const field = buildFieldConfig(conf);
    embed.addField(...field);
  }
  return embed;
}

function buildFieldDialog(dial, confName) {
  const title = dial.prefix + ' ' + confName;
  return [`**${title}**`, dial.session_id];
}

async function buildEmbedListDialog(dialogs, db) {
  let embed = buildEmbedListTemplate('List of dialogs');
  for (let dial of dialogs) {
    const confName = await db.findByIdConfig(dial.config);
    const field = buildFieldDialog(dial, confName.name);
    embed.addField(...field);
  }
  return embed;
}

module.exports = { 
  buildEmbedAnswer,
  buildEmbedListConfig,
  buildEmbedListDialog
};
