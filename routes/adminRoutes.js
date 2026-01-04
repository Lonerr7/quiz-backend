const express = require('express');
const {createTest, editTest, deleteTest, checkBody} = require('../controllers/adminController');

const router = express.Router();

router.route('/').post(checkBody, createTest);
router.route('/:id').patch(editTest).delete(deleteTest);

module.exports = router;
