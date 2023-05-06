const mongoose = require('mongoose');

module.exports = mongoose.model('Audits', new mongoose.Schema({
    userName: String,
    userId:String,
    message: String,
    time: String
}, { collection: 'audits' }));