var amazon = require('../controllers/amazonApiCaller.js');
const fs = require('fs');
var async = require('async');
var Batch = require('batch')
	, batch = new Batch;

	var self = this;

	batch.concurrency(4);

	var ids = [0,1,2,3];
	var fleetName = ['加賀', '赤城', '島風', '出雲'];

	function organizeFleet(id, done) {
        var fleet = fleetName[id];
        console.log('organized', fleet);
        done(null, fleet);
	}

    function fileRead(filename, done) {
        var rs = fs.createReadStream("./uploads/"+filename);
        var dat = '';
        var file = fs.readFileSync("./uploads/"+filename).toString().split('\n');
        var dataArray = [];
        for (var i = 1; i < file.length; i++ ) {
            dataArray.push(file[i].split(','));
            console.log(file[i]);
        }
        console.log(dataArray);
        //amazon.itemSearch();
        done(null, dat);
    }

    //amazon.itemSearch();
    console.log("hey");
    var arr = ['1517510635','1612549721','B009IE112A','B00AELC5OE','B004UDGUMU','B001GQGXXU','B01GCPY07K','B014OSNX70'];
    asyncTest(arr);
    /*
    amazon.itemLookup('1517510635,1612549721,B009IE112A,B00AELC5OE,B004UDGUMU,B001GQGXXU,B01GCPY07K,B014OSNX70').then((data) =>{
        console.log(data);
        batch.end(function(err, fleets) {
            console.log('results', fleets);
        });
    });
    */

    function asyncTest(arr) {
        console.log("-- EachSeries test start ----------");
        var test = [];
        async.eachSeries(arr, function(data, callback){
            setTimeout(function() {
                var d = 'eachSeries : ' + data;
                test.push(d);
                callback(null);
            }, 100);
        }, function(err){
            if (err) {
                console.log("err[" + err + "]");
            }
            console.log("- EachSeries test done" + test +" ----------");
        });
        console.log("EachSeries test end of line");
    }

    /*
    fileRead("8357021c0619fca07313d49ba1617046", function(){
        console.log("here");
    });
    ids.forEach(function(id) {
	    batch.push(function(done) {
            console.log("hphp!");
	        organizeFleet(id, done);
	    });
	});
    */



	batch.on('progress', function(e) {
	    console.log('progress', e.complete / e.total * 100, '%');
	});

