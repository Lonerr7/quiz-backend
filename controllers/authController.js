const {promisify} = require('util');
const catchAsync = require('../helpers/utils/catchAsync');
const User = require('../model/UserModel');
const jwt = require('jsonwebtoken');
const AppError = require('../helpers/classes/AppError');
const {isProd} = require('../helpers/utils/getEnvironment');

const signToken = (userId) => {
  return jwt.sign({id: userId}, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
}

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user.id);

  const cookieOptions = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true, // means that the cookie cannot be accessed or modified by browser in any way (prevent cross site scripting attacks)
  };
  if (isProd) cookieOptions.secure = true; // sending cookie via HTTPS in production

  res.cookie('jwt', token, cookieOptions);

  user.password = undefined; // deleting password from response

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

exports.signUp = catchAsync(async (req, res, next) => {
  const {name, password, passwordConfirm, passwordChangedAt} = req.body;
  const newUser = await User.create({name, password, passwordConfirm, passwordChangedAt});

  createSendToken(newUser, 201, res);
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
  createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1. Get token and check if it's there
  const authHeader = req.headers.authorization;
  let token = null;
  if (authHeader && authHeader.startsWith('Bearer')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not logged in', 401));
  }

  // 2. Verify the token (Verification)
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3. If verification is successful -> check if user still exists
  const user = await User.findById(decoded.id);

  if (!user) {
    return new AppError('User does not exist', 401);
  }

  // 4. Check if user changed password after the token was issued
  if (user.isChangedPasswordAfter(decoded.iat)) {
    return next(new AppError('User recently has changed password. Please log in again', 401));
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = user;
  next();
});

exports.allowTo = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(new AppError("You don't have permission to perform this action", 403));
  }

  next();
};