const Intrusion = require('../models/Intrusion');

const getIntrusions = async(req, res) => {
    const intrusions = await Intrusion.find({});
    res.json(intrusions);
};

module.exports = { getIntrusions };