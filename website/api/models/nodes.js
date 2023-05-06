const mongoose = require('mongoose');

module.exports = mongoose.model('Nodes', new mongoose.Schema({
    nodeId: Number,
    location: String,
    actemp: Number,
    fanSpeed: String,
    roomtemp: Number,
    mode: String,
    status: Boolean,
    lastUpdated: String
}, { collection: 'nodes' }));