var express = require('express');
var csvParser = require('../app/controllers/csvParser.js');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log(csvParser.parser);
  res.render('dataGrid', { title: 'dataGridSamples' });
});

module.exports = router;
