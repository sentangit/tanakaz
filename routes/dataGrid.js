var express = require('express');
var app = express();
var csvParser = require('../app/controllers/csvParser.js');
var router = express.Router();
var multer = require('multer');
var fs = require('fs');


router.get('/',function(req, res, next) {

  // 取得するcsvファイル名
  var filename = "8357021c0619fca07313d49ba1617046";

  csvParser.parseCsv(filename).then((data) => {
    console.log(data[0]);
    var cutData = [];
    if (data.length > 50) {
      for(var i = 0; i < 50; i++) {
        cutData.push(data[i]);
      }
    } else {
      cutData = data;
    }

    res.render('dataGrid', { title: 'dataGridSamples', jsonData:cutData});
  })
});
router.post('/',function(req, res, next) {

  // 取得するcsvファイル名
  var filename = "8357021c0619fca07313d49ba1617046";

  csvParser.parseCsvLine(filename).then((data) => {
    res.render('dataGrid', { title: 'dataGridSamples', jsonData:data});
  })
});

module.exports = router;
