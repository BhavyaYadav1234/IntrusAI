const Intrusion = require('../models/Intrusions');
const { sendIntrusionUpdate } = require('../server'); // import the emit function

// GET all intrusions
const getIntrusions = async(req, res) => {
    try {
        console.log('GET /intrusions called');

        const intrusions = await Intrusion.find({});
        res.status(200).json(intrusions);
    } catch (error) {
        console.error('Failed to fetch intrusions:', error);
        res.status(500).json({ message: 'Failed to retrieve data' });
    }
};

// POST a new intrusion (to simulate live traffic intrusion detection)
const addIntrusion = async(req, res) => {
    try {
        const { type, sourceIP, destinationIP, description } = req.body;

        const newIntrusion = new Intrusion({
            type,
            sourceIP,
            destinationIP,
            description,
            timestamp: new Date(),
        });

        await newIntrusion.save();

        console.log('New intrusion logged:', newIntrusion);

        // Emit real-time update to all connected clients
        sendIntrusionUpdate(newIntrusion);

        res.status(201).json(newIntrusion);
    } catch (error) {
        console.error('Failed to log intrusion:', error);
        res.status(500).json({ message: 'Failed to log intrusion' });
    }
};

module.exports = { getIntrusions, addIntrusion };