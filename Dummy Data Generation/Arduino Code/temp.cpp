/* How to use the DHT-22 sensor with Arduino uno
   Temperature and humidity sensor
*/
#include <Arduino.h>
//Libraries
#include <DHT.h>;

//Constants
#define DHTPIN 2       // what pin we're connected to
#define DHTTYPE DHT22  // DHT 22  (AM2302)
#define deviceID 1
DHT dht(DHTPIN, DHTTYPE);  //// Initialize DHT sensor for normal 16mhz Arduino
const String location = "Edison";

//Variables
int chk;
float hum;   //Stores humidity value
float temp;  //Stores temperature value

void setup() {
  Serial.begin(9600);
  dht.begin();
}

void loop() {
  //Read data and store it to variables hum and temp
  temp = dht.readTemperature();
  //Print temp and humidity values to serial monitor
  Serial.print(deviceID);
  Serial.print(" ");
  Serial.print(location);
  Serial.print(" ");
  Serial.print(temp);
  Serial.println();
  delay(2000);  //Delay 2 sec.
}
