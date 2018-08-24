const fs = require('fs');
const csv = require('csv');
const JSONStream = require('JSONStream');

const filename = 'sample.csv';

const columns = [
  'jis',
  'postNumOld',
  'postNum',
  'prefKana',
  'countryKana',
  'townKana',
  'pref',
  'country',
  'town',
  'etc1',
  'etc2',
  'etc3',
  'etc4',
  'etc5',
  'etc6'];

const parser = csv.parse({columns: columns});
const readableStream = fs.createReadStream(filename, {encoding: 'utf-8'});

readableStream.pipe(parser);

parser.on('readable', () => {
  var data;
  while (data = parser.read()) {
    console.log(data);
  }
});

parser.on('end', () => {
  console.log('end');
});

module.exports = parser;