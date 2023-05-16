**Git clone the entire repository**
```bash
git clone https://github.com/xOscarCodes/ServerCool.git
```

**Change directory**
```bash
cd /ESP/ServerProject/src
```

**Change `ID` and `LOC`**
```c++
const String nodeId = "ID";
const String location = "LOC";
```

**Change IP Address**
```c++
String domain_name_str = "<MQTT-BROKER-IP-ADDRESS>";
```

Replace `<MQTT-BROKER-IP-ADDRESS>` with IP Address of MQTT Broker

**Change username and password**
```c++
  while (!client.connect("serverESP32", "<USERNAME>", "<PASSWORD>"))
  {
    Serial.print(".");
    Ethernet.init(5);
    if (Ethernet.begin(mac) == 0)
    {
      Serial.println("Failed");
    }
    Serial.print("IP Address   : ");
    Serial.println(Ethernet.localIP());
  }
```

Replace `<USERNAME>` and `<PASSWORD>` with correct MQTT credentials. 