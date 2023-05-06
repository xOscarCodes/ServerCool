const mqtt = require('mqtt');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://<USERNAME>:<PASSWORD>@cluster0.y5qg6ce.mongodb.net/mydb', { useNewUrlParser: true, useUnifiedTopology: true });

const Sensor = require('./models/tempSensorModel');
const Node = require('./models/nodes')
const cors = require('cors');

const app = express();
app.use(cors);
app.use(express.static('public'));

const port = 6000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

const client = mqtt.connect("mqtt://broker.hivemq.com:1883");

client.on('connect', () => {
    client.subscribe('/nodes/temp/#');
    console.log('mqtt connected');
});

client.on('message', async (topic, message) => {

    var topicString = "";

    for (let index = 0; index < topic.length - 1; index++) {
        topicString += topic[index];
    }

    console.log(topicString);

    if (topicString == '/nodes/temp/') {
        message = String(message);
        const dataArray = message.split(",");

        const _id = dataArray[0];
        const location = dataArray[1];
        const temperature = dataArray[2];
        const unixTime = Date.now();

        for (let index = 0; index < dataArray.length; index++) {
            console.log(dataArray[index]);
        }
        console.log(unixTime);

        try {
            const abc = await Sensor.findOne({ 'sensorId': _id }).exec();
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
                const ins = await Sensor.create(newSensor);
                console.log(ins);
            }
            //console.log(abc);

            const node = await Node.findOne({ 'nodeId': _id }).exec();
            if (node == null) {
                var newNode = {
                    'nodeId': parseInt(_id),
                    'location': location,
                    'actemp': null,
                    'fanSpeed': "",
                    'roomtemp': parseFloat(temperature),
                    'mode': "Automatic",
                    'status': true,
                    'lastUpdated': Date.now()
                }
                const crt = await Node.create(newNode);
                console.log(crt);
            }
            //console.log(node);
        } catch (error) {
            console.log(error);
        }
        try {
            const nodedata = await Sensor.updateOne({ 'sensorId': _id }, {
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

            var node = await Node.updateOne({ 'Id': _id}, {
                    'roomtemp': parseFloat(temperature)
            });

            console.log(node)
   
        } catch (error) {
            console.log(error);
        }
    }

});

app.get('/mqttAPI/test', (req, res) => {
    res.send('MQTT API is working!');
});


app.get('/sensors', async (req, res) => {
    try {
        const allSesnors = await Sensor.find({});
        if (allSesnors != null) {
            res.send(allSesnors);
        } else {
            res.send("No sensors found");
        }
    } catch (error) {
        console.log(`Error: ${error}`);
    }
});

// app.get('/nodes', async (req, res) => {
//     try {
//         const allNodes = await nodeConfig.find({});
//         if (allNodes != null) {
//             res.send(allNodes);
//         } else {
//             res.send("No node found");
//         }
//     } catch (error) {
//         console.log(`Error: ${error}`);
//     }
// });

app.delete('/deleteSensor', async (req, res) => {
    const { sensorId } = req.body;

    try {
        const query = {
            sensorId
        }
        if (sensorId != null) {
            const confirm = await tempSensorModel.findOneAndDelete(query);
            if (confirm != null) {
                res.status(200).send("Sensor Deleted");
            } else {
                res.status(409).send("Sensor Cannot Be Deleted");
            }
        } else {
            res.status(409).send("Sensor Id is null");
        }
    } catch (error) {
        console.log(`Error Occured: ${error}`);
    }
});

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});