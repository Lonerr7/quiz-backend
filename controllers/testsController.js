const Test = require('../model/TestModel');
const catchAsync = require('../helpers/utils/catchAsync');
const AppError = require('../helpers/classes/AppError');

exports.getAllTests = catchAsync(async (req, res) => {
  const tests = await Test.find({});

  res.status(200).json({
    status: 'success',
    results: tests.length,
    data: {
      tests
    }
  });
});

exports.getTestById = catchAsync(async (req, res, next) => {
  const test = await Test.findById(req.params.id).select('+questions');

  if (!test) {
    return next(new AppError('No test found with that Id', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      test
    }
  });
});

exports.submitTest = catchAsync(async (req, res) => {
  const subbmitedTest = req.body;



  // Какой тут брать статус код??
  res.status(200).json({
    status: 'success',
    data: {

    // вернуть ответ в виде полного теста с доп полями для каждого вопроса: isAnswered, isCorrect, userAnswer
    }
  })
});
