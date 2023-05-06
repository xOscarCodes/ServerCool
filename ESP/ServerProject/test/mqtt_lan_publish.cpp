#include <PubSubClient.h>
#include <UIPEthernet.h> //UIPE ETHERNT LIBRARY FOR THE ETHERNET MODULE ENC28J60

byte mac[] = {0x0E, 0x96, 0x03, 0x38, 0x94, 0x92};
EthernetClient eclient;
PubSubClient client(eclient);
const char *mqttUser = "yourMQTTuser";
const char *mqttPassword = "yourMQTTpassword";

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

    Serial.print("Message arrived in topic: ");
    Serial.println(topic);

    Serial.print("Message:");
    for (int i = 0; i < length; i++)
    {
        Serial.print((char)payload[i]);
    }

    Serial.println();
    Serial.println("-----------------------");
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
    client.setCallback(callback);
    connect();
}

void loop()
{
    client.loop();
}