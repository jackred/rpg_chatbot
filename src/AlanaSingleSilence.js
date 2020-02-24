'use strict';

const AlanaSilence = require('./AlanaSilence');

class AlanaSingleSilence extends AlanaSilence {
  _read() {
    super._read();
    this.push(null);
  }
}

module.exports = AlanaSingleSilence;
