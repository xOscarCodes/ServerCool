#include <UIPEthernet.h> //UIPE ETHERNT LIBRARY FOR THE ETHERNET MODULE ENC28J60
#include <PubSubClient.h>
#include <OneWire.h>
#include <DallasTemperature.h>

const int oneWireBus = 32;

OneWire oneWire(oneWireBus);

DallasTemperature sensors(&oneWire);

const int buzzer = 4; // buzzer to arduino pin 9
byte mac[] = {0x0E, 0x96, 0x03, 0x38, 0x94, 0x92};
EthernetClient eclient;
PubSubClient client(eclient);
// CREATES A eclient WHICH CAN CONNECT TO A SPECIFIED INTERNET IP ADDRESS AND PORT
char server[] = "httpbin.org"; /// IP ADDRESS OF THE LOCAL SERVER WE CONNECT AND SEND DATA TO

int HTTP_PORT = 80;
String HTTP_METHOD = "GET"; // or POST
char host[] = "topic10-ltpn.onrender.com";
String PATH_NAME = "/";

unsigned long lastMillis = 0;
String tempC = "";

void connect()
{
    Serial.print("connecting...");

    while (!client.connect("arduino32"))
    {
        Serial.print(".");
        Enc28J60.init(mac);
        Serial.print("IP Address   : ");
        Serial.println(Ethernet.localIP());
    }

    Serial.println("\nconnected!");

    client.subscribe("/2110994758");
    sensors.begin();

    // client.unsubscribe("/hello");
}

void callback(char *topic, byte *payload, unsigned int length)
{
    Serial.print("Message arrived [");
    Serial.print(topic);
    Serial.print("] ");
    for (int i = 0; i < length; i++)
    {
        Serial.print((char)payload[i]);
    }
    Serial.println();
}

void setup()
{
    Serial.begin(115200);
    Serial.println("hello");
    Ethernet.init(5);
    if (Ethernet.begin(mac) == 0)
    {
        Serial.println("Failed");
    }                        // INITIALIZES THE ETHERNET LIBRARY AND NETWORK SETTINGS
                             // initialize the lcd
    pinMode(buzzer, OUTPUT); // Set buzzer - pin 9 as an output

    digitalWrite(buzzer, LOW);
    Serial.println("Temperature Logger");
    Serial.println("*********************");
    Serial.print("IP Address   : ");
    Serial.println(Ethernet.localIP());
    Serial.print("Subnet Mask  : ");
    Serial.println(Ethernet.subnetMask());
    Serial.print("Default Gateway IP: ");
    Serial.println(Ethernet.gatewayIP());
    Serial.print("DNS Server IP     : ");
    Serial.println(Ethernet.dnsServerIP());

    Serial.println("Start MQTT");
    client.setKeepAlive(90);
    client.setClient(eclient);
    client.setServer("broker.hivemq.com", 1883);
    connect();
}

void loop()
{
    // if (!eclient.connect(server, 80)) {
    //   status1 = eclient.connect(server, 80);
    // }

    if (!client.connected())
    {
        Serial.println("Reconnecting");
        connect();
    }

    // publish a message roughly every second.
    if (millis() - lastMillis > 10000)
    {
        sensors.requestTemperatures();
        float temperatureC = sensors.getTempCByIndex(0);
        tempC = String(temperatureC, 3);
        lastMillis = millis();
        if (client.publish("/2110994758", (char*)tempC.c_str()))
        {
            Serial.println("Sucess");
            Serial.print(temperatureC);
            Serial.println("ºC");
        }
        else
        {
            Serial.println("Failed Publish");
        }
        Serial.println("Published");
    }
    client.loop();
}
