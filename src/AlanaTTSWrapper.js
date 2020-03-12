'use strict';

function play(resource, voiceConnection) {
  const dispatcher = voiceConnection.play(resource);
  dispatcher.on('end', end => console.log('INFO: finished speaking'));
}

async function speak(text, voice, voiceConnection, tts) {
  console.log('INFO: text to translate:', text);
  const audio = await tts.translate(text, voice);
  play(audio, voiceConnection);
}


module.exports = { 
  speak
};
