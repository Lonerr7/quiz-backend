const express = require('express');
const {getTestById, createTest, editTest, deleteTest} = require('../controllers/adminController');
const {protect} = require('../controllers/authController');

const router = express.Router();

router.route('/').post(createTest);
router.route('/:id').get(protect, getTestById).patch(editTest).delete(deleteTest);

module.exports = router;
