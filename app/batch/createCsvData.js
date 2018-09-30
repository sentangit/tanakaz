var amazon = require('../controllers/amazonApiCaller.js');
var express = require('express');
var request = require('request');
var app = express();
var fs = require('fs');
var async = require('async');
const FS = require("fs-extra");
const transformOpts = { highWaterMark: 16384, encoding: 'Shift-JIS' };
const json2csv = require('json2csv').parse;
var Batch = require('batch')
	, batch = new Batch;

	var self = this;
    var filename = process.argv[2];
    //var dlDir = "./downloads";
    var dlDir = require('../../config.json')[app.get('env')]['dlDir'];
    var titleTriggerWords = ['新品 期間限定セール',
                            '新品 限定SALE',
                            '大好評 新品',
                            '新品 衝撃SALE',
                            'セール特価 新品',
                            '新品 目玉セール'
                            ];
    var templateA = 'ご覧いただきありがとうございます♪\r\n当店はすべて\r\n≪新品・未使用、コメントなし・即購入ＯＫ!≫\r\nとなってます(^^♪\r\n';
    var templateB = '【※　必読　※】\r\n人気商品のため在庫に限りがございますので、\r\n他のユーザー様に買われてしまわないようお早めにご注文くださいませ♪\r\n\r\nお気軽にコメントを下さいね(*^^*)\r\n誠意をもってお取引させて頂きます♪';
    var condition = '新品、未使用';
    var weight = '500gまで';
    var size = '60cmまで';
    var otherI = '落札者負担';
    var otherJ = '3日後';
    var otherK = '22時～23時';
    var otherL = '3回';
    var otherM = '3';
    var otherN = 'モバペイのみ';
    var otherO = 'ヤマト宅急便/普通郵便	2,3';

    console.log(filename);
	batch.concurrency(4);

    //var data = amazon.itemLookup('1517510635,1612549721');
    // csvからASINを取り出し、AMAZON API に投げる
    function fileRead() {
        var rs = fs.createReadStream("./uploads/"+filename);
        var dat = '';
        var file = fs.readFileSync("./uploads/"+filename).toString().split('\n');
        var asinQue = [];
        var asinList = [];
        console.log(file.length);
        for (var i = 1; i < file.length; i++ ) {
            data = file[i].split(',');
            asinList.push(data[0].replace(/\"/g, ''));
            if (asinList.length >= 10) {
                asinQue.push(asinList);
                asinList = [];
            }
        }
        asinQue.push(asinList);
        return asinQue;
    }

    function mkDir(dirname){
        console.log("dirs = ",dirname);
        dirname = dlDir+"/"+dirname;
        return new Promise(function(resolve, reject){
        FS.mkdirsSync(dirname, function (err) {
            if (err) {
                console.error(err);
                process.exit(1);
            } else {
                console.error("create ok : ",curDir);
                return resolve();
            }
        });
    });
    }

    function getAmazonData(asinQue) {
        return new Promise(function(resolve, reject){
            var jsonData = [];
                async.eachSeries(asinQue, function(asinList, cb){
                    setTimeout(function() {
                        amazon.itemLookup(asinList).then(items => {
                            jsonData.push(items);
                            cb(null);
                        });
                    }, 3000);
            },function(err){
                return resolve(writeCsv4mobaoku(jsonData[0]));
            })
        });
    }

    function writeCsv4mobaoku(jsonList){
        console.log("作成データ数",jsonList.length);
        var writeData = [];
        // 必要なデータを新しいjsonに切り出す
        jsonList.forEach(json => {
            var itemAttributes = json['ItemAttributes'][0];
            title = itemAttributes['Title'];
            amount = json['OfferSummary'][0]['LowestNewPrice'][0]['Amount'][0];
            console.log(JSON.stringify(amount));
            category = itemAttributes['Binding'][0];
            description = "";
            var data = {
                "title" : titleTriggerWords[Math.floor(Math.random() * titleTriggerWords.length)] +" "+ title,
                "category":category,
                "description": templateA + description + "\r\n" + templateB,
                "condition":condition,
                "weight":weight,
                "size":size,
                "amountB":amount,
                "amountA":amount,
                "otherI":otherI,
                "otherJ":otherJ,
                "otherK":otherK,
                "otherL":otherL,
                "otherM":otherM,
                "otherN":otherN,
                "otherO":otherO,

            };
            writeData.push(data);
        });
        return json2csv(writeData,transformOpts);
    }

    var asinQue = fileRead();
    mkDir(filename).then(
        getAmazonData(asinQue).then(csv =>{
            fs.writeFileSync(dlDir +"/"+filename+"/" +'mobaoku.csv', csv)
        })
    );

	batch.on('progress', function(e) {
	    console.log('progress', e.complete / e.total * 100, '%');
	});

	batch.end(function(err, fleets) {
	    console.log('results', fleets);
	});