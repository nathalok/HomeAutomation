/*
Aaha ..moment. Almost ready for production.

Finally this is a sketch which does the following 
- Gathers temperature and PIR data
- PIR uses interrupt based
- tested with laptop power
- Test with 9V battery

TODO :
- Sleep and wake based on PIR event
- Wake timely and send temperature data
*/

int temperaturePin = 2; 
int ledPin = 13;
volatile boolean motion = false;

void setup(){
  Serial.begin(9600); 
  pinMode(temperaturePin, INPUT);
  pinMode(ledPin, OUTPUT);  
  for(int i = 0; i < 20 ; i++){
    Serial.println(".");
    delay(1000);
  }
  attachInterrupt(0, interruptHandler, LOW);
}

void interruptHandler()
{
   motion = true ;
}

void loop(){
  temperature();
  if(motion){
    Serial.println("M");
    motion = false;
  }
  delay(3000);
}

void temperature()
{
  float voltage5v = 0; // setup some variables
  float sensor = 0;
  float celsius5v = 0;
	
  sensor = analogRead(temperaturePin);
  voltage5v = (sensor*5000)/1024; // convert raw sensor value to millivolts 
        
  //Temperature
  celsius5v = (voltage5v-500)/10;        // remove voltage offset and convert millivolts to Celsius
  Serial.println(celsius5v,2);
  delay(2000); 
}
