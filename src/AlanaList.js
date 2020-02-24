'use strict';

const emojiNext = '➡'; // unicode emoji are identified by the emoji itself
const emojiPrevious = '⬅';
const reactionArrow = [emojiPrevious, emojiNext];
const time = 60000; // time limit: 1 min
const listLength = 10;


async function sliceList(list, i, fn) {
  const ind = i*listLength;
  console.log(list.length);
  let embed = await fn(list.slice(ind, (i+1)*10));
  embed.setFooter(`${ind+1} -> ${Math.min(list.length, ind + listLength)} / ${list.length}`);
  return embed;
  
}


function filter(reaction, user){
  return (!user.bot) && (reactionArrow.includes(reaction.emoji.name)); // check if the emoji is inside the list of emojis, and if the user is not a bot
}


async function onCollect(emoji, message, i, getList) {
  if ((emoji.name === emojiPrevious) && (i >= 0)) {
    const embed = await getList(i-1);
    if (embed.fields.length !== 0) {
      message.edit(embed);
      i--;
    }
  } else if (emoji.name === emojiNext) {
    const embed = await getList(i+1);
    if (embed.fields.length !== 0) {
      message.edit(embed);
      i++;
    }
  }
  return i;
}


function createCollectorMessage(message, getList) {
  let i = 0;
  const collector = message.createReactionCollector(filter, { time });
  collector.on('collect', async r => {
    i = await onCollect(r.emoji, message, i, getList);
  });
  collector.on('end', collected => message.reactions.removeAll());
}


async function sendList(channel, list, fn){
  let getList = async i => await sliceList(list, i, fn);
  channel.send(await getList(0))
    .then(msg => msg.react(emojiPrevious))
    .then(msgReaction => msgReaction.message.react(emojiNext))
    .then(msgReaction => createCollectorMessage(msgReaction.message, getList));
}


module.exports = {
  sendList
};
