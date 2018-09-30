const fs = require('fs');
const csv = require('csv');
const csvtojson = require('csvtojson');
const JSONStream = require('JSONStream');
const multer  = require('multer');

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

// アップロードされたファイルをストレージへ保存する場合
const storage = multer.diskStorage({
  // ファイルの保存先を指定
  destination: (req, file, cb) => {
    cb(null, '/tmp');
  },
  // ファイル名を指定(オリジナルのファイル名を指定)
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

// アップロードされたファイルを一時的にメモリへ保存する場合
const storageMem = multer.memoryStorage();

// 1 つのファイルをアップロードする場合
const upload_ = multer({ storage: storage }).single('qafile');

const upload = (req, res, next) => {
  upload_(req, res, (err) => {
    if (err) {
      next(err);
    }
    const csvData = req.file.buffer;
    const mimetype = req.file.mimetype;
    let message = '';
    let qaData = [];
    let errorData = [];
    if(mimetype == 'text/csv' || mimetype == 'application/vnd.ms-excel') {
      // 何らかのファイルの処理ロジック
      // テキストファイルであれば `csvData.toString()` してから処理する
    }
  });
}
let parsedList = [];
// csv to Json
function parseCsv(filename) {
  console.log(filename);
  return new Promise(function(resolve, reject){
    csvtojson()
    .fromFile("./uploads/"+filename)
    .then((jsonObj)=>{
      resolve(jsonObj);
    });
  })

}

function parseCsvTest(str) {
  console.log(str.toString());
  return new Promise(function(resolve, reject){
    csvtojson(str.toString(),{ header : 1, columnName : ['ASIN,出品者数,最安値[FBA],最安値[自社発送]送料,商品名,商品重量(kg),メーカ名,メーカ型番,ブランド名,プラットフォーム,画像1[メイン],画像1[サムネイル],最上位カテゴリセールスランク,商品グループ,アダルトフラグ'] })
    .then((jsonObj)=>{
      resolve(jsonObj);
    });
  })
    /*
  csvtojson()
    .fromFile("./uploads/tmp.csv")
    .then((jsonObj)=>{
      console.log("ahahaha",jsonObj);
      return jsonObj;
    });
  /*
  parser.on('readable', () => {
    var data;
    while (data = parser.read()) {
      console.log(data);
    }
  });

  parser.on('end', () => {
    console.log('end');
  });
  */
}

function parseCsvLine(filename) {
  return new Promise(function(resolve, reject){
  var rs = fs.createReadStream("./uploads/"+filename);
  var dat = '';
  fs.readFileSync("./uploads/"+filename).toString().split('\n')
  .forEach(function (line) { dat = dat + line + '\n'; })
  resolve(dat);
});
}


module.exports.parseCsv = parseCsv;
module.exports.parseCsvLine = parseCsvLine;
module.exports.parseCsvTest = parseCsvTest;