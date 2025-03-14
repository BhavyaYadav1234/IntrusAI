const express = require('express');
const router = express.Router();

const { getIntrusions } = require('../controllers/idsController');

router.get('/intrusions', getIntrusions);

module.exports = router;