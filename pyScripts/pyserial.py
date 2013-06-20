import serial
import sys
from time import sleep

ser = serial.Serial('/dev/ttyUSB0', 9600, timeout =1)

line = ""
while 1 :
	line = ser.readline()	
	if line:
		print line
		sys.stdout.flush()
		sleep(2)
