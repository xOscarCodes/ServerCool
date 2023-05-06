const mongoose = require('mongoose');

module.exports = mongoose.model('NodeData', new mongoose.Schema({
    sensorId: Number,
    location: String,
    tempSensorData: Array,
    unixTime: Array
}, { collection: 'nodeData' }));