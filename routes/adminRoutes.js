const express = require('express');
const {
  getTestById,
  createTest,
  editTest,
  deleteTest,
} = require('../controllers/adminController');
const { protect, allowTo } = require('../controllers/authController');
const { USER_ROLES } = require('../config/UserConfig');

const router = express.Router();

router.use(protect, allowTo(USER_ROLES.ADMIN));

router.route('/').post(createTest);
router
  .route('/:id')
  .get(getTestById)
  .patch(editTest)
  .delete(deleteTest);

module.exports = router;
