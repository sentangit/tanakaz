var express = require('express');
var app = express();
var router = express.Router();
var fs = require('fs');
var childProcess = require('child_process');

router.get('/',function(req, res, next) {

  // 取得するcsvファイル名
  var filename = req.query.filename;
  console.log(filename);

  var p = childProcess.spawn('node', ['./app/batch/createCSVData.js',filename]);
  p.on('exit', function (code) {
      console.log('createCSV process exited.');
  });
  p.on('error', function (err) {
      console.error(err);
      process.exit(1);
  });

  var p2 = childProcess.spawn('node', ['./app/batch/getPictures.js',filename]);
  p2.on('exit', function (code) {
    console.log('pictureDownload process exited.');
  });
  p2.on('error', function (err) {
      console.error(err);
      process.exit(1);
  });

});
router.post('/',function(req, res, next) {

  // 取得するcsvファイル名
  var filename = req.body.filename;

  csvParser.parseCsvLine(filename).then((data) => {
    res.render('dataGrid', { title: 'dataGridSamples', jsonData:data});
  })
});

module.exports = router;
