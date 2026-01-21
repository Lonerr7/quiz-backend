const express = require('express');
const {getAllTests, getTestById, submitTest} = require('../controllers/testsController');

const router = express.Router();

router.route('/').get(getAllTests);
router.route('/:id').get(getTestById);
router.route('/:id/submit').post(submitTest);

module.exports = router;