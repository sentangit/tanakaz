const fs = require('fs');
const storage = require('electron-json-storage');
const csvtojson = require('csvtojson');
const JSONStream = require('JSONStream');

function getConfigAll(){
  return new Promise(function(resolve, reject){
  storage.get('config', function (error, data) {
    if (error) throw error;
    if (Object.keys(data).length === 0) {
        // データがないときの処理
        var json = {
          dlPath: 'C:\\Users\\Public\\Downloads',
        };
      storage.set('config', json, function (error) {
          if (error) throw error;
          return resolve(json);
      });
    } else {
      return resolve(data);
    }
  });
});
}

function getDlpath(){
  return new Promise(function(resolve, reject){
  storage.get('config', function (error, data) {
    if (error) throw error;
    if (Object.keys(data).length === 0) {
        // データがないときの処理
        var json = {
          dlPath: 'C:\\Users\\Public\\Downloads',
        };
      storage.set('config', json, function (error) {
          if (error) throw error;
          return resolve(json['dlPath']);
      });
    } else {
      return resolve(data['dlPath']);
    }
  });
});
}

function setDlpath(path){
  return new Promise(function(resolve, reject){
    storage.get('config', function (error, data) {
      if (error) throw error;
      data['dlPath'] = path;
      console.log(data);
      storage.set('config', data, function (error) {
        if (error) throw error;
        resolve(data);
      });
    });
});
}

module.exports.getConfigAll = getConfigAll;
module.exports.setDlpath = setDlpath;