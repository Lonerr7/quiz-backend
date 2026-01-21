const express = require('express');
const {getTestById, createTest, editTest, deleteTest} = require('../controllers/adminController');
const {protect, allowTo} = require('../controllers/authController');
const {USER_ROLES} = require('../config/UserConfig');

const router = express.Router();

router.route('/').post(createTest);
router.route('/:id').get(protect, allowTo(USER_ROLES.ADMIN), getTestById)
                    .patch(protect, allowTo(USER_ROLES.ADMIN), editTest)
                    .delete(protect, allowTo(USER_ROLES.ADMIN), deleteTest);

module.exports = router;
