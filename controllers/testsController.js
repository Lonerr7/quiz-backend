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

exports.submitTest = catchAsync(async (req, res, next) => {
  const {id: submittedTestId, answers} = req.body.test;
  const dbTest = await Test.findById(submittedTestId).select('+questions +questions.correctAnswer');

  if (!dbTest) {
    return next(new AppError('Test does not exist', 404));
  }

  const checkedQuestions = dbTest.questions.reduce((acc, question) => {
    const convertedQuestion = question.toObject();
    const userAnswer = answers[convertedQuestion._id];

    const answerInfo = {
      ...convertedQuestion,
      userAnswer,
      isCorrect: userAnswer === convertedQuestion.correctAnswer,
    };
    return [...acc, answerInfo];
  }, []);

  res.status(200).json({
    status: 'success',
    data: {
      testId: dbTest._id,
      result: checkedQuestions
    }
  });
});
