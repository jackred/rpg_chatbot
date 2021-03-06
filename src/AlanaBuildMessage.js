'use strict';

const { MessageEmbed,  } = require('discord.js');


function buildEmbedAnswerTemplate(text, author, footer, color='#AFFF00')  {
  let embed = new MessageEmbed()
      .setAuthor(...(typeof author === 'string') ? [author] : author)
      .setColor(color)
      .setDescription('**' + text + '**')
      .setTimestamp()
      .setFooter(footer);
  return embed;
}


function buildEmbedAnswer(text, authorName, configName)  {
  let embed = buildEmbedAnswerTemplate(text, authorName, configName);
  return embed;
}


function buildEmbedSTTMessage(text, member) {
  let embed = buildEmbedAnswerTemplate(text, [member.user.username, member.user.avatarURL()], "stt", member.displayHexColor);
  embed.setTitle('STT message');
  return embed;
}


function buildEmbedListTemplate(title) {
  let embed = new MessageEmbed()
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
  return {name: `**${title}**`, value, inline: false};
}


function buildFieldsConfig(configs, embed) {
  let fields = [];
  for (let conf of configs) {
    fields.push(buildFieldConfig(conf));
  }
  embed.addFields(fields);
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
  return {name: `**${title}**`, value, inline: false};
}


async function buildFieldsDialog(dialogs, embed, db) {
  let fields = [];
  for (let dial of dialogs) {
    const confName = await db.findByIdConfig(dial.config);
    fields.push(buildFieldDialog(dial, confName.name));
  }
  embed.addFields(fields);
  return embed;
}


async function buildEmbedListDialog(dialogs, db) {
  let embed = buildEmbedListTemplate('List of dialogs');
  embed = await buildFieldsDialog(dialogs, embed, db);
  return embed;
}


async function buildEmbedDialog(dialog, db) {
  let embed = buildEmbedListTemplate('Dialog');
  embed = await buildFieldsDialog([dialog], embed, db);
  return embed;
}


module.exports = { 
  buildEmbedAnswer,
  buildEmbedSTTMessage,
  buildEmbedListConfig,
  buildEmbedListDialog,
  buildEmbedDialog,
};
