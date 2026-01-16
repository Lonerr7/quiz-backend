const catchAsync = require('../helpers/utils/catchAsync');
const User = require('../model/UserModel');

exports.signUp = catchAsync(async (req, res, next) => {
  const {name, password, passwordConfirm} = req.body;
  const newUser = await User.create({name, password, passwordConfirm});

  res.status(201).json({
    status: 'success',
    data: {
      user: newUser,
    }
  })
});