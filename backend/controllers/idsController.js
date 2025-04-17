const Intrusion = require('../models/Intrusions');

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

module.exports = { getIntrusions };