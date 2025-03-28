// backend/routes/intrusions.js
const express = require('express');
const router = express.Router();
const Intrusions = require('../models/Intrusions'); // Assuming Intrusions.js exists

router.get('/intrusions', async (req, res) => {
    try {
        const data = await Intrusions.find(); // Fetch data from DB
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
