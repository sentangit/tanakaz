var amazon = require('../controllers/amazonApiCaller.js');
var express = require('express');
var request = require('request');
var app = express();
var fs = require('fs');
const FS = require("fs-extra");
var Batch = require('batch')
	, batch = new Batch;

	var self = this;
    var filename = process.argv[2];
    //var dlDir = "./downloads";
    var dlDir = require('../../config.json')[app.get('env')]['dlDir'];
	batch.concurrency(4);



    function fileRead(done) {

        console.log("----------------------fileRead start----------------------");
        console.log(dlDir);
        var rs = fs.createReadStream("./uploads/"+filename);
        var dat = '';
        var file = fs.readFileSync("./uploads/"+filename).toString().split('\n');
        var dataArray = [];
        var urls = [];
        for (var i = 1; i < file.length; i++ ) {
            var url = [];
            data = file[i].split(',');
            dataArray.push(data);
            url.push(data[10].replace(/\"/g, ''),data[11].replace(/\"/g, ''));
            urls.push(url);
            mkDir(filename+"/"+data[0]).then(getPictures(url, data[0]));
        }

        //amazon.itemSearch();
        done(null, dat);
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

    function getPictures(urls,subDir) {
        console.log(urls);

        urls.forEach((value, index) => {
            var typeName = "main";
            if (index > 0) {
                typeName = "sub"+ index;
            }
            request(
                {method: 'GET', url: value, encoding: null},
                function (error, response, body){
                    //console.log(response);
                    if(!error && response.statusCode === 200){
                        fs.writeFileSync(dlDir +"/"+filename+"/"+ subDir + "/" + typeName +'.png', body, 'binary');
                    }
                }
            );
        });
    }

    fileRead(function(){
        console.log("here");
    });

	batch.on('progress', function(e) {
	    console.log('progress', e.complete / e.total * 100, '%');
	});

	batch.end(function(err, fleets) {
	    console.log('results', fleets);
	});