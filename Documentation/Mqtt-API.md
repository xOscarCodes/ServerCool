**Git clone the entire repository**

```bash

```

**Change directories**

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
