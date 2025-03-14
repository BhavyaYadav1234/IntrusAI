const mongoose = require('mongoose');

const intrusionSchema = new mongoose.Schema({
    timestamp: { type: Date, default: Date.now },
    type: { type: String, required: true },
    confidence: { type: Number, required: true }
});

const Intrusion = mongoose.model('Intrusion', intrusionSchema);

module.exports = Intrusion;