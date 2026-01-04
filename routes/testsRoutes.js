const express = require('express');
const {getAllTests, getTestById, submitTest} = require('../controllers/testsController');
const {checkID} = require('../helpers/middlewares/checkID');

const router = express.Router();
router.param('id', checkID);

router.route('/').get(getAllTests);
router.route('/:id').get(getTestById);
router.route('/:id/submit').post(submitTest); // тут проверяю выполненный тест

module.exports = router;