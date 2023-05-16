**Git clone the entire repository**

```bash
git clone https://github.com/xOscarCodes/ServerCool.git
```

**Change directory**

```bash
cd /website/mqtt/config
```

**Make changes in 'keys.js' file**

```javascript
module.exports = {
    MongoURI:"mongodb://<MONGODB-USERNAME>:<MONGODB-PASSWORD>@<IP>:<PORT-Default-port:27017>/serverCool",
    mqttURI: "mqtt://<IP>:<PORT>", // HOSTNAME:PORT if using host of the broker
    username: '<MQTT-USERNAME>',
    password: '<MQTT-PASSWORD>',
    user: '<MONGODB-USERNAME>',
    pass: '<MONGODB-PASSWORD>',
    mqttPort: 1883
}
```

Replace `MONGODB-USERNAME`  and `MONGODB-PASSWORD` with authentication details of MongoDB database. Also change `IP` and `PORT` number. Mostly, `27017` is default port number. 
Replace `MQTT-USERNAME` and `MQTT-PASSWORD` with mqtt authentication details.

**Change directory**
```bash
cd /website/web/public
```

**Make changes to `statistics.html` file**
```javascript
const API_URL = 'http://<API-IP>:5000/api/nodeData';
```

Replace `<API-IP>` with actual IP of the API

**Change directory**
```bash
cd /website/web/public/Resources/script
```

**Make changes to `show-audit.js`, `show-nodes.js` and `ui.js` script file**
```javascript
const API_URL = 'http://<API-IP>:5000/api/nodeData';
```

Replace `<API-IP>` with actual IP of the API

**Make changes to `ui.js` script file**
```javascript
let mqttURI = 'http://<MQTT-API-IP>:5001/send-command';
```

Replace `<MQTT-API-IP>` with actual IP of the MQTT Broker