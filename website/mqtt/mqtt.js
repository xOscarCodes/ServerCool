const mqtt = require('mqtt');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./config/keys');
const url = config.MongoURI;

const options = {
    authSource: 'admin',
    user: config.user,
    pass: config.pass,
    useNewUrlParser: true,
    useUnifiedTopology: true
};

mongoose.connect(url, options)
    .then(() => {
        console.log('Connected successfully to server');

    })
    .catch((error) => {
        console.log(error);
    });

const Nodes = require('./models/nodes');
const NodeData = require(('./models/nodedata'))

const app = express();
app.use(express.static('public'));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
const port = 5001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));



const client = mqtt.connect(config.mqttURI, {
    port: config.mqttPort,
    username: config.username,
    password: config.password
});
// hardware node to code topic

client.on('connect', () => {
    client.subscribe('/nodes/command/#', (err) => {
        if (err) {
            console.error(err);
        } else {
            console.log(`subscribed to /nodes`);
        }
    });
    client.subscribe('/nodes/temp/#', (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log('subscribed on /nodes/temp/#')
        }
    })
    console.log('mqtt connected');
})

client.on('error', function (error) {
    console.error('MQTT connection error:', error);
});

client.on('message', async (topic, message) => {
    // hardware node to code topic
    var topicString = "";

    for (let index = 0; index < topic.length - 1; index++) {
        topicString += topic[index];
    }

    console.log(topicString);

    if (topicString == '/nodes/temp/') {
        message = String(message);
        const dataArray = message.split(",");

        const _id = dataArray[0];
        const location = dataArray[2];
        const temperature = dataArray[1];
        const unixTime = Date.now();

        for (let index = 0; index < dataArray.length; index++) {
            console.log(dataArray[index]);
        }
        console.log(unixTime);

        try {
            const abc = await NodeData.findOne({ 'sensorId': _id }).exec();
            if (abc == null) {
                var newSensor = {
                    'sensorId': parseInt(_id),
                    'location': location,
                    'tempSensorData': [
                        {
                            'temp': parseFloat(temperature)
                        }
                    ],
                    'unixTime': [
                        {
                            'time': parseInt(unixTime)
                        }
                    ]
                }
                const ins = await NodeData.create(newSensor);
                console.log(ins);
            }


            const node = await Nodes.findOne({ 'nodeId': _id }).exec();
            if (node == null) {
                var newNode = {
                    'nodeId': parseInt(_id),
                    'location': location,
                    'actemp': 21,
                    'fanSpeed': "Medium",
                    'roomtemp': parseFloat(temperature),
                    'mode': "Automatic",
                    'status': true,
                    'lastUpdated': Date.now()
                }
                const crt = await Nodes.create(newNode);
                console.log(crt);
            }

        } catch (error) {
            console.log(error);
        }
        try {
            const nodedata = await NodeData.updateOne({ 'sensorId': _id }, {
                $push: {
                    'tempSensorData':
                    {
                        'temp': parseFloat(temperature)
                    },
                    'unixTime':
                    {
                        'time': parseInt(unixTime)
                    }
                }
            });
            console.log(nodedata);

            var node = await Nodes.updateOne({ 'nodeId': _id }, {
                'roomtemp': parseFloat(temperature)
            })

            if (node == null) {
                console.log("Not updated");
            } else {
                console.log("modified")
            }

            console.log(node)

        } catch (error) {
            console.log(error);
        }
    }
});

app.post('/send-command', async (req, res) => {

    const { nodeId,
        temperature,
        fanSpeed,
        delayTime,
        Status } = req.body;


    const node = await Nodes.findOne({ nodeId: nodeId });
    node.mode = "Manual";
    node.lastUpdated = Date.now();
    node.actemp = temperature;
    node.fanSpeed = fanSpeed;
    node.status = Status;
    node.save();


    const xHoursInMillis = parseInt(delayTime) * 60 * 60 * 100;
    setTimeout(async () => {
        // this code will run after x hours
        const node = await Nodes.findOne({ nodeId: nodeId });
        node.mode = "Automatic";
        node.lastUpdated = Date.now();
        node.save();
        console.log("Timer finished! after " + xHoursInMillis + " ms for " + nodeId);
    }, xHoursInMillis);


    const topic = `/nodes/${nodeId}`;
    let text = temperature.toString() + fanSpeed.charAt(0).toLowerCase();
    client.publish(topic, text, () => {
        res.send('published new message');
    });
});

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});
