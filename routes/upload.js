var express = require('express');
var app = express();
var csvParser = require('../app/controllers/csvParser.js');
var router = express.Router();
var multer = require('multer');
var fs = require('fs');
var jschardet = require('jschardet');
var Datastore = require('nedb');
var db = new Datastore({
    filename: './db/uploadList.db'
});

function getNow(){
  var dt = new Date();
  var y = dt.getFullYear();
  var m = ("00" + (dt.getMonth()+1)).slice(-2);
  var d = ("00" + dt.getDate()).slice(-2);
  var Hour = dt.getHours();
  var Min = dt.getMinutes();
  var Sec = dt.getSeconds();
  var result = y + "/" + m + "/" + d + "/" +  + Hour + ":" + Min + ":" + Sec;
  return result;
}

// アップロードされたファイルをストレージへ保存する場合
const storage = multer.diskStorage({
  // ファイルの保存先を指定
  destination: (req, file, cb) => {
    cb(null, './uploads');
  },
  // ファイル名を指定(オリジナルのファイル名を指定)

  /*
  filename: (req, file, cb) => {
    cb(null, 'tmp.csv');
  }
  */

});

const fileFilter = function(req, file, cb) {
  console.log(file);
  var detectResult = jschardet.detect(file);
  console.log("dataType",detectResult);
  //var iconv = new Iconv(detectResult.encoding,'UTF-8');
  //var convertedString = iconv.convert(file).toString();
  if (!file.originalname.match(/\.(csv)$/)) {
    return cb(null, false)
  }
  return cb(null, true);
}

var upload = multer({
  fileFilter: fileFilter,
  storage:storage,
  preservePath: true,
  // ファイルの保存先を指定
  destination: (req, file, cb) => {
    return cb(null, './uploads');
  }
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  fs.readdir('./uploads', function(err, files){
    db.loadDatabase();
    if (err) throw err;
    findFileData(files).then((fileList) =>{
       res.render('upload', { title: 'uploadFiles', fileList:fileList});
    });
  });
});

router.post('/uploadBigDataTest', function(req, res, next) {
  console.log(req);
})
router.post('/uploadBigData', function(req, res, next) {
  upload.single('csv');
  fs.readdir('./uploads', function(err, files){
    var fileList = [];
    files.forEach(function(file){
      fileList.push(file);
    });
    res.render('upload', { title: 'uploadFiles', fileList:fileList});
  })

})
router.post('/', upload.single('csv'), function(req, res, next) {
  var doc = {
    "hash": req.file['filename'],
    "dispName": req.file['originalname'],
    "createTime":getNow(),
    "complete":0
  };
  db.loadDatabase();
  db.insert(doc);
  fs.readdir('./uploads', function(err, files){
  if (err) throw err;
   findFileData(files).then((fileList) =>{
     console.log("----------------------------------------");
      console.log(fileList);
      res.render('upload', { title: 'uploadFiles', fileList:fileList});
   });

});

});

function findFileData(files) {
  return new Promise(function(resolve, reject){
    var hashList = [];
    files.forEach(function(file){
      hashList.push("{hash:'"+file+"'}");
     });
     console.log(hashList);
     db.find({ $or: [hashList.toString]}, function(err, docs){
      console.log("dddddd",docs);
      return resolve(docs);
    })

  })
};

router.post('/uploadDetails', upload.single('csv'), function(req, res, next) {
  const file = req.file
  const meta = req.body

  // デッバグのため、アップしたファイルの名前を表示する
  console.log(file, meta);
  console.log("heyhey",file.filename)
  csvParser.parseCsv(file.filename).then((data) => {
    console.log("debug--------------------------------",data);
    res.render('dataGrid', { title: 'dataGridSamples', jsonData:data});
  })
});


module.exports = router;
