'use strict';

/* utility function */
function random2Int(a,b) {
  return Math.floor(Math.random() * b) + a;
}

function randomInt(a) {
  return random2Int(0,a);
}

function isBetween(x, low, up) {
  return (x >= low) && (x <= up);
}

function splitIn2(text, cut){
  let index = text.indexOf(cut);
  if (index === -1){ return [text]; }
  return [text.substr(0, index), text.substr(index+1)];
}

function reduceWhitespace(text) {
  return text.replace(/\s\s+/g, ' ').trim().split(' ');
}

module.exports = { 
  splitIn2,
  randomInt,
  random2Int,
  isBetween,
  reduceWhitespace
};
