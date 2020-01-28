'use strict';

const { RichEmbed } = require('discord.js');


function buildEmbedAnswer(text, author, configName)  {
  let embed = new RichEmbed()
      .setAuthor(author)
      .setColor('#AFFF00')
      .setDescription('**' + text + '**')
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
  const value = Object.keys(conf.data.overrides).map(k => k + ': '+ conf.data.overrides[k].map(d => {
    if (typeof d === 'object') {
      for (let i in d){
	d[i] = '[' + d[i] + '](' + d[i] + ')';
      }
    }
    return JSON.stringify(d);
  }).join(', ')).join('\n');
  return [`**${title}**`, value];
}

function buildFieldsConfig(configs, embed) {
  for (let conf of configs) {
    const field = buildFieldConfig(conf);
    embed.addField(...field);
  }
  return embed;
}

function buildEmbedListConfig(configs) {
  let embed = buildEmbedListTemplate('List of configuration');
  embed = buildFieldsConfig(configs, embed);
  return embed;
}

function buildFieldDialog(dial, confName) {
  const title = dial.prefix + ' ' + confName;
  delete dial.prefix;
  delete dial.config;
  const value = Object.keys(dial).map(k => k + ': '+ JSON.stringify(dial[k])).join('\n');
  return [`**${title}**`, value];
}

async function buildFieldsDialog(dialogs, embed, db) {
  for (let dial of dialogs) {
    const confName = await db.findByIdConfig(dial.config);
    const field = buildFieldDialog(dial, confName.name);
    embed.addField(...field);
  }
  return embed;
}

async function buildEmbedListDialog(dialogs, db) {
  let embed = buildEmbedListTemplate('List of dialogs');
  embed = await buildFieldsDialog(dialogs, embed, db);
  return embed;
}

module.exports = { 
  buildEmbedAnswer,
  buildEmbedListConfig,
  buildEmbedListDialog
};
