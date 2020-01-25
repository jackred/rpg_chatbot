'use strict';



const emojiNext = '➡'; // unicode emoji are identified by the emoji itself
const emojiPrevious = '⬅';
const reactionArrow = [emojiPrevious, emojiNext];
const time = 60000; // time limit: 1 min

function sliceList(configs, i, fn) {
  const ind = i*10;
  let embed = fn(configs.slice(ind, (i+1)*10));
  embed.setFooter(`${ind} -> ${Math.min(configs.length, ind + configs.length)} / ${configs.length}`);
  return embed;
  
}

function filter(reaction, user){
  return (!user.bot) && (reactionArrow.includes(reaction.emoji.name)); // check if the emoji is inside the list of emojis, and if the user is not a bot
}

function onCollect(emoji, message, i, getList) {
  if ((emoji.name === emojiPrevious) && (i > 0)) {
    const embed = getList(i-1);
    if (embed.fields.length !== 0) {
      message.edit(embed);
      i--;
    }
  } else if (emoji.name === emojiNext) {
    const embed = getList(i+1);
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
  collector.on('collect', r => {
    i = onCollect(r.emoji, message, i, getList);
  });
  collector.on('end', collected => message.clearReactions());
}

function sendList(channel, list, fn){
  let getList = i => sliceList(list, i, fn);
  channel.send(getList(0))
    .then(msg => msg.react(emojiPrevious))
    .then(msgReaction => msgReaction.message.react(emojiNext))
    .then(msgReaction => createCollectorMessage(msgReaction.message, getList));
}

module.exports = {
  sendList
};
