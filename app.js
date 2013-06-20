
/**
 * Node express app which has the following
 * - Routing
 * - Jade template engine
 * - Socket.io
 * - Flot chart for realtime data
 * - Realtime temperature data from Arduino using serialport
 * - Deploy in Raspberry PI
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var intDetect = require('./routes/intrusiondetection');
var dataStore = "" ; // To hold the serial data
var clients = [];

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/intrusiondetection', intDetect.intrusiondetection);

var httpServer = http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
   });
   
var io = require('socket.io').listen(httpServer);   

//
// Setup for serialport and socket
//


var spawn = require('child_process').spawn,
    ls    = spawn('python',[path.join(__dirname, '/pyScripts/pyserial.py')]);
ls.stderr.on('data', function (data) {
  console.log('stderr: ' + data);
});

ls.on('close', function (code) {
  console.log('child process exited with code ' + code);
});
var buffer ; //contains raw data

io.sockets.on('connection', function(socket) {
    clients.push(socket);
	socket.emit('welcome', {'salutation':'TMP36 Sensor output!'});  	
	ls.stdout.on('data', onSPData) ; // call back when data is received    


   /* socket.on(disconnect, function(){ //TODO : Handle disconnect gracefully
        sp.removeListener('data', onSPData)
        var clientIdx = clients.indexOf(socket);
        if(clientIdx > -1){
            clients.splice(clientIdx,1)
        }
    })*/
});
//
////////////////////////////////////////////////////////////////////////////
//This function processes the serial data and send to the client
//   - If first character is digit its temperature and display in flot chart
//   - If first character is M, then send SMS
//   - If any other character just discard it
////////////////////////////////////////////////////////////////////////////
var test;
function onSPData (data) { // call back when data is received
	buffer = data.toString();		
       	buffer = buffer.substr(0, buffer.length-3);
        
	if((buffer != 'M')&&(buffer != ".")){
		console.log("Send Temperature");
		clients.forEach(function(client){
		        client.emit('welcome', {'salutation':buffer});
		});
	}else if(buffer == 'M'){
		//TODO : Send SMS 
		console.log("Sending SMS..");
		test = spawn('./sms.sh');
		test.stdout.on('data', function (data) {
		       data2 = data.toString()
       		data2 = data2.substr(0, data2.length-3);
  			console.log('Motion: ' + data2);
		});
	} 
	console.log("Data received : %s, Length : %d", buffer, buffer.length);
	buffer = "";
}


