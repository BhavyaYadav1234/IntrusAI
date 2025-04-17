const mongoose = require('mongoose');

const intrusionSchema = mongoose.Schema({
    type: {
        type: String,
        required: true,
    },
    severity: {
        type: String,
        required: true,
    },
    sourceIP: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

const Intrusion = mongoose.model('Intrusion', intrusionSchema);

module.exports = Intrusion;