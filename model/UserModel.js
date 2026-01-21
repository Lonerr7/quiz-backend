const {Schema, model} = require('mongoose');
const bcrypt = require('bcryptjs');
const {USER_ROLES} = require('../config/UserConfig');

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    unique: [true, 'The user with this name already exists'],
  },
  role: {
    type: String,
    enum: [USER_ROLES.USER, USER_ROLES.ADMIN],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minLength: [5, 'Password must be not less than 5 characters long'],
    maxLength: [25, 'Password must not be more than 25 characters long'],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    minLength: [5, 'Password must be not less than 5 characters long'],
    maxLength: [25, 'Password must not be more than 25 characters long'],
    validate: {
      validator: function(val) {
        return val === this.password;
      },
      message: 'Passwords are not the same'
    }
  },
  passwordChangedAt: Date
});

// hashing passwords (works only on .create() and .save())
userSchema.pre('save', async function() {
  if (!this.isModified('password')) {
    return; //! возможно вызовет ошибку, если да - то переписать
  }

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
});

// Instance methods
userSchema.methods.isPasswordCorrect = async function(enteredPassword, userPassword) {
  return await bcrypt.compare(enteredPassword, userPassword);
}

userSchema.methods.isChangedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < changedTimestamp;
  }

  return false;
}
const User = model('User', userSchema);
module.exports = User;