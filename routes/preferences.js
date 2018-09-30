var express = require('express');
var app = express();
var router = express.Router();
var preferenceCtr = require('../app/controllers/preferenceCtr.js');

/* GET users listing. */
router.get('/', function(req, res, next) {
  var config = preferenceCtr.getConfigAll().then((config) =>{
    res.render('preferences', { title: 'preferences', config:config});
  });
});

router.post('/setDlpath', function(req, res, next) {
  var dlPath = req.body['dlPath'];
  preferenceCtr.setDlpath(dlPath).then((config)=>{
    res.render('preferences', { title: 'preferences', config:config});
  })
})


module.exports = router;
