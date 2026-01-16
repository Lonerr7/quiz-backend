const catchAsync = require('../helpers/utils/catchAsync');
const User = require('../model/UserModel');
const jwt = require('jsonwebtoken');
const AppError = require('../helpers/classes/AppError');

// Закончил 130 урок

const signToken = (userId) => {
  return jwt.sign({id: userId}, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
}

exports.signUp = catchAsync(async (req, res, next) => {
  const {name, password, passwordConfirm} = req.body;
  const newUser = await User.create({name, password, passwordConfirm});

  const token = signToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    }
  });
});

exports.logIn = catchAsync(async (req, res, next) => {
  const {name, password, passwordConfirm} = req.body;

  // 1. Check if email and password exist
  if (!name || !password) {
    return next(new AppError('Please provide name and password', 400));
  }

  // 2. Check if user exists and if password is correct
  const user = await User.findOne({name}).select('+password');

  if (!user || !(await user.isPasswordCorrect(password, user.password))) {
    return next(new AppError('Incorrect name or password', 401));
  }

  // 3. If everything is ok, send token to client
  const token = signToken(user._id);

  res.status(200).json({
    status: 'success',
    token,
  })
});