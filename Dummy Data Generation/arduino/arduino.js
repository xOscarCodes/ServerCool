const axios = require('axios');
const mqtt = require('mqtt');

const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

const port = new SerialPort({
    path: 'COM4',   // Change the COM port as required 
    baudRate: 9600  // Change the Baude Rate as required
})

const MQTT_URL = 'http://localhost:6000/sensorData';

const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

const client = mqtt.connect("mqtt://broker.hivemq.com:1883");

let sum = 0;
parser.on('data', (data) => {
    const dataArray = data.split(" ");
    const sensorId = dataArray[0];
    const location = dataArray[1];
    const tempData = dataArray[2];
    const unixTime = Date.now();

    const sensorData = {
        sensorId,
        location,
        tempData,
        unixTime
    }

    console.log(sensorData);

    axios.post(`${MQTT_URL}`, sensorData)
        .then(response => {
            console.log(response.data);
        })
        .catch(error => {
            console.log(error);
        });
});