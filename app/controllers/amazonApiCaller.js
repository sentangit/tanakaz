const fs = require('fs');
const amazon = require('amazon-product-api');
var config = require('../../config.json')[app.get('env')];
const client = amazon.createClient({
  awsId: config['awsId'],
  awsSecret: config['awsSecret'],
  awsTag: config['awsTag'],
  domain:"webservices.amazon.co.jp"
});

function itemSearch() {
  client.itemSearch({
    director: 'Quentin Tarantino',
    actor: 'Samuel L. Jackson',
    searchIndex: 'DVD',
    responseGroup: 'ItemAttributes,Offers,Images'
  }, function(err, results, response) {
    if (err) {
      console.log(JSON.stringify(err))
      return err;
    } else {
      return response;
    }
  });
}
function itemLookup(asin) {
  return new Promise(function(resolve, reject){
    client.itemLookup({
      idType: 'ASIN',
      itemId: asin,
      responseGroup: 'ItemAttributes,Offers,Images'
    }, function(err, results, response) {
      if (err) {
        console.log(JSON.stringify(err));
        return reject(err);
      } else {
        return resolve(results);
      }
    });
});
}

function browseNodeLookup() {
  client.browseNodeLookup({
    browseNodeId: '549726',
    responseGroup: 'NewReleases'
  }, function(err, results, response) {
    if (err) {
      console.log(err);
    } else {
      console.log(results);
    }
  });
}

module.exports.itemSearch = itemSearch;
module.exports.itemLookup = itemLookup;
module.exports.browseNodeLookup = browseNodeLookup;