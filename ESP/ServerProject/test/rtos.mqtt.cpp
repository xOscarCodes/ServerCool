extern "C"
{
#include "freertos/FreeRTOS.h"
#include "freertos/timers.h"
}
#include <AsyncMqttClient.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include <UIPEthernet.h> //UIPE ETHERNT LIBRARY FOR THE ETHERNET MODULE ENC28J60

byte mac[] = {0x0E, 0x96, 0x03, 0x38, 0x94, 0x92};
EthernetClient eclient;

// Raspberry Pi Mosquitto MQTT Broker
// #define MQTT_HOST IPAddress(192, 168, 1, XXX)
// For a cloud MQTT broker, type the domain name
#define MQTT_HOST "hivemq.com"
#define MQTT_PORT 1883

// Temperature MQTT Topic
#define MQTT_PUB_TEMP "/2110994758"

// GPIO where the DS18B20 is connected to
const int oneWireBus = 4;
// Setup a oneWire instance to communicate with any OneWire devices
OneWire oneWire(oneWireBus);
// Pass our oneWire reference to Dallas Temperature sensor
DallasTemperature sensors(&oneWire);
// Temperature value
float temp;

AsyncMqttClient mqttClient;
TimerHandle_t mqttReconnectTimer;

unsigned long previousMillis = 0; // Stores last time temperature was published
const long interval = 10000;      // Interval at which to publish sensor readings

void connectToLAN()
{
    Serial.print(".");
    Enc28J60.init(mac);
    Serial.print("IP Address   : ");
    Serial.println(Ethernet.localIP());
}

void connectToMqtt()
{
    Serial.println("Connecting to MQTT...");
    mqttClient.connect();
    Serial.println("\nconnected!");
}

void onMqttConnect(bool sessionPresent)
{
    Serial.println("Connected to MQTT.");
    Serial.print("Session present: ");
    Serial.println(sessionPresent);
}

void onMqttDisconnect(AsyncMqttClientDisconnectReason reason)
{
    Serial.println("Disconnected from MQTT.");
    if (Enc28J60.linkStatus() == LinkON)
    {
        xTimerStart(mqttReconnectTimer, 0);
    }
    else
    {
        connectToLAN();
    }
}

/*void onMqttSubscribe(uint16_t packetId, uint8_t qos) {
  Serial.println("Subscribe acknowledged.");
  Serial.print("  packetId: ");
  Serial.println(packetId);
  Serial.print("  qos: ");
  Serial.println(qos);
}
void onMqttUnsubscribe(uint16_t packetId) {
  Serial.println("Unsubscribe acknowledged.");
  Serial.print("  packetId: ");
  Serial.println(packetId);
}*/

void onMqttPublish(uint16_t packetId)
{
    Serial.println("Publish acknowledged.");
    Serial.print("  packetId: ");
    Serial.println(packetId);
}

void setup()
{
    // Start the DS18B20 sensor

    Serial.begin(115200);
    Serial.println("hello");
    Ethernet.init(5);

    mqttReconnectTimer = xTimerCreate("mqttTimer", pdMS_TO_TICKS(2000), pdFALSE, (void *)0, reinterpret_cast<TimerCallbackFunction_t>(connectToMqtt));

    mqttClient.onConnect(onMqttConnect);
    mqttClient.onDisconnect(onMqttDisconnect);
    // mqttClient.onSubscribe(onMqttSubscribe);
    // mqttClient.onUnsubscribe(onMqttUnsubscribe);
    mqttClient.onPublish(onMqttPublish);
    mqttClient.setServer(MQTT_HOST, MQTT_PORT);
    // If your broker requires authentication (username and password), set them below
    // mqttClient.setCredentials("REPlACE_WITH_YOUR_USER", "REPLACE_WITH_YOUR_PASSWORD");
    // connectToLAN();
}

void loop()
{
    unsigned long currentMillis = millis();
    // Every X number of seconds (interval = 10 seconds)
    // it publishes a new MQTT message
    if (currentMillis - previousMillis >= interval)
    {
        // Save the last time a new reading was published
        previousMillis = currentMillis;
        // New temperature readings
        // sensors.requestTemperatures();
        // Temperature in Celsius degrees
        // temp = sensors.getTempCByIndex(0);
        temp = 30;
        // Temperature in Fahrenheit degrees
        // temp = sensors.getTempFByIndex(0);

        // Publish an MQTT message on topic esp32/ds18b20/temperature
        uint16_t packetIdPub1 = mqttClient.publish(MQTT_PUB_TEMP, 1, true, String(temp).c_str());
        Serial.printf("Publishing on topic %s at QoS 1, packetId: ", MQTT_PUB_TEMP);
        Serial.println(packetIdPub1);
        Serial.printf("Message: %.2f /n", sensors.getTempCByIndex(0));
    }
}
