const express = require('express');
const {getMe} = require('../controllers/userController');
const {protect} = require('../controllers/authController');

// Закончил 164 урок

const router = express.Router();

router.route('/me').get(protect, getMe);

module.exports = router;