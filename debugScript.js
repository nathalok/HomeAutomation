//
// This is just a debug script. It can be used to test whether the serial data is 
// correctly received and/or the SMS is send correctly.
// Command to run this script
// >node debugScript.js 
 
var path = require('path');
var spawn = require('child_process').spawn,
    ls    = spawn('python',[path.join(__dirname, '/pyScripts/pyserial.py')]);

var exec = require('child_process').exec;

var test;
ls.stdout.on('data', function (data) {
        data2 = data.toString()
       	data2 = data2.substr(0, data2.length-3);
        if(data2 != 'M'){ 
  		console.log('Temperatur: ' + data2);
	}else{
		console.log("Motion Detected");

    		test = spawn('./sms.sh');
		test.stdout.on('data', function (data) {
		        data2 = data.toString()
  			console.log('Motion: ' + data2);
		});
	}
});

ls.stderr.on('data', function (data) {
  console.log('stderr: ' + data);
});

ls.on('close', function (code) {
  console.log('child process exited with code ' + code);
});

