const express = require('express');
const {getTestById, createTest, editTest, deleteTest} = require('../controllers/adminController');

const router = express.Router();

router.route('/').post(createTest);
router.route('/:id').get(getTestById).patch(editTest).delete(deleteTest);

module.exports = router;
