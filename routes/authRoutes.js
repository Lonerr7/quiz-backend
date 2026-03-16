const express = require('express');
const {logIn, signUp, logOut} = require('../controllers/authController');

const router = express.Router();

router.post('/signUp', signUp);
router.post('/logIn', logIn);
router.post('/logOut', logOut);

module.exports = router;