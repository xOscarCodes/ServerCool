const mqtt = require('mqtt');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://<USERNAME>:<PASSWORD>@cluster0.n2vfmc7.mongodb.net/mydb', { useNewUrlParser: true, useUnifiedTopology: true });
const Sensor = require('./models/tempSensorModel');

const app = express();
app.use(express.static('public'));

const port = 6000;

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

const client = mqtt.connect("mqtt://broker.hivemq.com:1883");

client.on('connect', () => {
    client.subscribe('/2110994758/sensorData');
    console.log('mqtt connected');
});

client.on('message', async (topic, message) => {
    if (topic == '/2110994758/sensorData') {

        const data = JSON.parse(message);
        console.log(message);
        console.log(JSON.stringify(data.sensorId));
        console.log(JSON.stringify(data.location))
        console.log(JSON.stringify(data.tempData));
        console.log(JSON.stringify(data.unixTime));

        try {
            const abc = await Sensor.findOne({ 'sensorId': data.sensorId }).exec();
            if (abc == null) {
                var newDocument = {
                    'sensorId': parseInt(data.sensorId),
                    'location': JSON.stringify(data.location),
                    'tempsensorData': [
                        {
                            'temp': parseFloat(data.tempData),
                        }
                    ],
                    'unixtime': [
                        {
                            'unixTime': parseInt(data.unixTime)
                        }
                    ]
                }

                const ins = await Sensor.create(newDocument);
                console.log(ins);
            }
            console.log(abc);
        } catch (error) {
            console.log(error);
        }

        try {
            const x = await Sensor.updateOne({ 'sensorId': data.sensorId }, {
                $push: {
                    'tempsensorData':
                    {
                        'temp': parseFloat(data.tempData)
                    },
                    'unixtime': 
                    {
                        'unixTime': parseInt(data.unixTime)
                    }
                }
            });
            console.log(x);
        } catch (error) {
            console.log(error);
        }
    }
});

app.post('/sensorData', (req, res) => {
    const { sensorId, location, tempData, unixTime } = req.body;
    const topic = '/2110994758/sensorData';

    const message = JSON.stringify({
        sensorId,
        location,
        tempData,
        unixTime
    });
    client.publish(topic, message, () => {
        res.status(201).send(message);
    })
});



app.listen(port, () => {
    console.log(`listening on port ${port}`);
});