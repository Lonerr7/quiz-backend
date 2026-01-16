const express = require('express');
const {logIn, signUp} = require('../controllers/authController');

const router = express.Router();

router.post('/signUp', signUp);
router.post('/logIn', logIn);

module.exports = router;