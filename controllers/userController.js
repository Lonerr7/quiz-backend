const catchAsync = require('../helpers/utils/catchAsync');
const User = require('../model/UserModel');

exports.getMe = catchAsync(async (req, res, next) => {
  const me = await User.findById(req.user.id);

  res.status(200).json({
    status: 'success',
    user: me,
  });
})
