const mongoose = require('mongoose');

const ExchangeInfoSchema = new mongoose.Schema({
    src: String,
    tgt: String,
    rate: Number,
    date: String,
});

module.exports = mongoose.model('ExchangeInfo', ExchangeInfoSchema);