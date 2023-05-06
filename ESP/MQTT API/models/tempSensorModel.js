const mongoose = require('mongoose');

module.exports = mongoose.model('tempSensor', new mongoose.Schema({
    sensorId: Number,
    location: String,
    tempSensorData: Array,
    unixTime: Array
}, { collection: 'serverProjectTemp' }));