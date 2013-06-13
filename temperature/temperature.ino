/*     �������������������
*     |  Arduino Experimentation Kit Example Code             |
*     |  CIRC-10 .: Temperature :. (TMP36 Temperature Sensor) |
*     �������������������
*  
*  A simple program to output the current temperature to the IDE�s debug window
*
*  For more details on this circuit: http://tinyurl.com/c89tvd
*/
//TMP36 Pin Variables
int temperaturePin = 1; //the analog pin the TMP36's Vout (sense) pin is connected to
                        //the resolution is 10 mV / degree centigrade
                        //(500 mV offset) to make negative temperatures an option
/*
* setup() � this function runs once when you turn your Arduino on
* We initialize the serial connection with the computer
*/
void setup()
{
  Serial.begin(9600);  //Start the serial connection with the copmuter
                       //to view the result open the serial monitor
                       //last button beneath the file bar (looks like a box with an antenae)
}
void loop()
{
  float voltage5v = 0; // setup some variables
  float sensor = 0;
  float celsius5v = 0;
	
  sensor = analogRead(2);
   
  //dont use 5000mV instead measure the multimeter reading and use the same. Normally
  //when connected to laptop usb power, the voltage to arduino is 4.91V. The same
  //is used below and gives more closure temperature        
  voltage5v = (sensor*5000)/1024; // convert raw sensor value to millivolts 
	          
  //Temperature
  celsius5v = (voltage5v-500)/10;        // remove voltage offset and convert millivolts to Celsius
	
  Serial.print(celsius5v,2);
  Serial.println("N");
  delay(4000);  
}
