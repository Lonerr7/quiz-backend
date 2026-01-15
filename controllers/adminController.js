const Test = require('../model/TestModel');
const catchAsync = require('../helpers/utils/catchAsync');
const AppError = require('../helpers/classes/AppError');

exports.createTest = catchAsync(async (req, res) => {
  const {name, description, questions} = req.body;

  const newTest = await Test.create({
    name,
    description,
    questions
  });

  res.status(201).json({
    status: 'success',
    data: {
      test: newTest
    }
  })
});

exports.getTestById = catchAsync(async (req, res, next) => {
  const test = await Test.findById(req.params.id).select('+questions +questions.correctAnswer');

  if (!test) {
    return next(new AppError('No test found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      test
    }
  });
});

exports.editTest = catchAsync(async (req, res, next) => {
  const newTest = await Test.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  }).select('+questions +questions.correctAnswer');


  if (!newTest) {
    return next(new AppError('No test found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      test: newTest
    }
  });
});

exports.deleteTest = catchAsync(async (req, res, next) => {
  const deletedTest = await Test.findByIdAndDelete(req.params.id);

  if (!deletedTest) {
    return next(new AppError('No test found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});