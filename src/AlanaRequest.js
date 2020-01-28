'use strict';

const request = require('request-promise-native');
const AlanaBuildMessage = require('./AlanaBuildMessage');
const config = require('../config.json');


function createSessionId() {
  return `${config.project}.${uuidv1()}`;

}


function buildRequest(question, data, session_id) {
  data.question = question;
  data.user_id = config.user_id;
  data.projectId = config.projectId;
  data.session_id = session_id;
  return data;
}


function buildOptions(question, dataBot, session_id, uri=config.alana) {
  const data = buildRequest(question, dataBot, session_id);
  console.log(`INFO: Request to ${uri}:`, JSON.stringify(data));
  return {
    method: 'POST',
    uri: uri,
    body: data,
    json: true
  };
}


function requestAlana(question, requestDialog, requestConfig) {
  const options = buildOptions(question, requestConfig.data, requestDialog.session_id);
  return request.post(options)
    .then(res => {
      console.log(`ANSWER: ${res.result}`, res);
      return res;
    })
    .catch(e => console.log(`ERR: ${e}`));
}


async function answer(message, text, db) {
  const requestDialog = await db.findDialogByPrefix(message.content[0]);
  console.log( `INFO: dialog prefix found: ${requestDialog !== null}`);
  if (requestDialog !== null) { // else not a prefix, regular message
    const requestConfig = await db.findByIdConfig(requestDialog.config);
    const res = await requestAlana(message.content.substr(1), requestDialog, requestConfig);
    message.channel.send(AlanaBuildMessage.buildEmbedAnswer(res.result, res.bot_name, requestConfig.name));
  }
}


module.exports = { 
  answer
};
