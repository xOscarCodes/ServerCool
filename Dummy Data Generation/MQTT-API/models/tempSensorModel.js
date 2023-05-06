const mongoose = require('mongoose');

module.exports = mongoose.model('Device', new mongoose.Schema({
    sensorId: Number,
    location: String,
    tempsensorData: Array,
    unixtime:Array
}, { collection: 'SerevrCoolTemp' }));