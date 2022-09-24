const express = require('express');
const router = express.Router();

const { addTech } = require('../controller/technology');

router.post('/addTech', addTech);


module.exports = router;