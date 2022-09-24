const express = require('express');
const router = express.Router();
const { createUser, userLogin } = require('../controller/users');

router.post('/create-user', createUser);
router.post('/login', userLogin);

module.exports = router;