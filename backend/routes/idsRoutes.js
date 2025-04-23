const express = require('express');
const router = express.Router();

const { getIntrusions, addIntrusion } = require('../controllers/idsController');

// GET all intrusions
router.get('/intrusions', getIntrusions);

// POST a new intrusion
router.post('/intrusions', addIntrusion);

module.exports = router;