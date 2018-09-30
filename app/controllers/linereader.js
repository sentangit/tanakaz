var readline = require('readline');

function Linereader(stream) {
  var self = this;
  self.rl = readline.createInterface({
    input: stream,
    output: {},
  });
  self.list = [];
}

module.exports = Linereader;

/**
 * @param {Number} unit // unit行ごとに取得する
 * @param {Function} fn // unit行取得した際に実行する関数
 * @param {Function} callback // ストリームの読み込みが終わった際のコールバック
 */
Linereader.prototype.forEach = function(unit, fn, callback) {
  var self = this;

  self.rl.on('line', function(line) {
    self.list.push(line);
    if (self.list.length >= unit) {
      fn(self.list);
      self.list = [];
    }
  });
  self.rl.on('close', function(line) {
    if (self.list.length) {
      fn(self.list);
    }
    callback();
  });
};