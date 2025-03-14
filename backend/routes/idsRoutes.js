const express = require('express');
const { getIntrusions } = require('../controllers/idsController');
const router = express.Router();

router.get('/', getIntrusions);

module.exports = router;