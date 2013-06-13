// Yahoo ..
// It captures data from Arduino serial port and displays it in web page.

var http = require('http').createServer(handler);
var io = require('socket.io').listen(http);
var sys = require('sys');
var fs = require('fs');
var path = require('path');

var clients = [];
var HTTP_OK = 200,
    HTTP_ERR_UNKNOWN = 500,
    HTTP_ERR_NOT_FOUND = 404;
	
http.listen(8000);

var SerialPort  = require('serialport2').SerialPort;
var portName = 'COM12';
var sp = new SerialPort(); // instantiate the serial port.
sp.open(portName, { // portName is instatiated to be COM3, replace as necessary
   baudRate: 9600, // this is synced to what was set for the Arduino Code
   dataBits: 8, // this is the default for Arduino serial communication
   parity: 'none', // this is the default for Arduino serial communication
   stopBits: 1, // this is the default for Arduino serial communication
   flowControl: false // this is the default for Arduino serial communication
});

function contentType(ext) {
    var ct;
    switch (ext) {
    case '.html':
        ct = 'text/html';
        break;
	case '.htm':
        ct = 'text/html';
        break;
    case '.css':
        ct = 'text/css';
        break;
    case '.js':
        ct = 'text/javascript';
        break;
    default:
        ct = 'text/plain';
        break;
    }
    return {'Content-Type': ct};
}

/*
  The handler function is updated to handle diffferent file extensions
  like html, htm and javascript.
*/
function handler(req, res) {
	var filepath ; 
    var fileext;
		
	switch (req.url) {
		case '/':
			filepath = "./index.htm"
			break;
		case '/3rdParty/flot/jquery.js':
			filepath = "3rdParty/flot/jquery.js";
			break;	
		case '/3rdParty/flot/jquery.flot.js':
			filepath = "3rdParty/flot/jquery.flot.js";
			break;	
		default :
			filepath = req.url;
			break;
    }
	fileext = path.extname(filepath); 
    console.log("filepath = ",filepath, ",fileext = ",fileext, ",request url =", req.url);
		
    fs.exists(filepath, function (f) {
        if (f) {
            fs.readFile(filepath, function (err, content) {
                if (err) {
					console.log("ERROR ");
                    res.writeHead(HTTP_ERR_UNKNOWN);
                    res.end();
                } else {					
					console.log("Success ");
                    res.writeHead(HTTP_OK, contentType(fileext));
                    res.end(content);				
                }
            });
        } else {
			console.log("Not found ");
            res.writeHead(HTTP_ERR_NOT_FOUND);
            res.end();
        }
    });
}	
var buffer ; //contains raw data
var dataStore = "" ; // To hold the string

io.sockets.on('connection', function(socket) {
	var username;
	clients.push(socket);
	socket.emit('welcome', {'salutation':'TMP36 Sensor output!'});

    sp.on('data', function (data) { // call back when data is received
		buffer = data.toString();
		// // // check for end character in buffer
		for(i=0; i<buffer.length; i++)
		{
			if(buffer[i] != "N")
			{
				//store it in data
				dataStore = dataStore + buffer[i];					
			}  
			 if(buffer[i] == "N")
			 {
				//spit the data
				//console.log(dataStore);			
				socket.emit('welcome', {'salutation':dataStore});    
				// //initialize data to null	
				dataStore = "";
			 }
		}			
    });		
});

