HomeAutomation
==============

A node.js based home automation project. 

Its a node.js/express based web application which reads the data from Arduino board and displays realtime data. The 
node application uses serialport2 module to read the data from the serial port. The realtime temperature data is displayed in 
a flot chart using websockets.

The Arduino board in this project also has a PIR sensor. When the PIR sensor reaceives any signal, the interrupt routine
gets triggered which sends an SMS to the registered mobile phone.

To run the web app, type the following in command prompt
>node serialFlot.js



