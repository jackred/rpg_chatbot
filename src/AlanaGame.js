'use strict';


function setOption(value) {
  if (value) {
    return  {value: true, setAt: Date.now()};
  } else {
    return {value: false};
  }
}


function isTalkListenArg(text) {
  if (text.replace('talk', '').replace('listen','').replace(' ','') !== '') {
    throw 'Argument for start function should be `talk` or/and `listen`';
  }
  const args = text.split(' ');
  let res = {};
  res.talk = setOption(args.some(d => d === 'talk'));
  res.listen = setOption(args.some(d => d === 'listen'));
  return res;
}

async function startGame(channelID, db, requestText, optionDB={}) {
  console.log(optionDB);
  console.log(requestText);
  const dbDialog = await db.findOneDialogGameByChannelID(channelID);
  console.log(dbDialog);
  if (dbDialog !== null) {
    throw `There's already a game going on!`;
  } else {
    await db.addDialogGame({...optionDB, channelID});
  }
}

async function startGameClassic(message, text, db, client, tts, stt) {
  await startGame(message.channel.id, db, 'start_game', isTalkListenArg(text));
}


async function startGameGPT2(message, text, db, client, tts, stt) {
  await startGame(message.channel.id, db, 'start_game_gpt2', {...isTalkListenArg(text), gpt2: {value: true, setAt: Date.now()}});
}


async function startGameGuided(message, text, db, client, tts, stt) {
  await startGame(message.channel.id, db, 'start_game_close', text, isTalkListenArg(text));
}


async function endGame(message, text, db, client, tts, stt) {
  // request end
  await db.removeDialogGames({channelID: message.channel.id});
}


module.exports = { 
  startGameClassic,
  startGameGPT2,
  startGameGuided,
  endGame
};
