const Test = require('../model/TestModel');
const catchAsync = require('../helpers/utils/catchAsync');
const AppError = require('../helpers/classes/AppError');
const Email = require('../helpers/classes/Email');

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
  const submittedTestId = req.params.id;
  const {answers, name} = req.body;
  const dbTest = await Test.findById(submittedTestId).select('+questions +questions.correctAnswer');

  if (!dbTest) {
    return next(new AppError('Test does not exist', 404));
  }
  
  const checkedQuestions = dbTest.questions.reduce((acc, question) => {
    const convertedQuestion = question.toObject();
    const userAnswer = answers[convertedQuestion._id] ?? null;

    const answerInfo = {
      ...convertedQuestion,
      userAnswer,
      isCorrect: userAnswer === convertedQuestion.correctAnswer,
    };
    return [...acc, answerInfo];
  }, []);

  const correctAnswersCount = checkedQuestions.reduce((acc, question) => {
    if (question.isCorrect) {
      acc += 1;
    }
    return acc;
  }, 0);

  const Mail = new Email();
  await Mail.send({
    testName: dbTest.name,
    userName: name,
    checkedQuestions,
    correctAnswersCount
  }).catch(err => console.error('Email error:', err));

  res.status(200).json({
    status: 'success',
    data: {
      testId: dbTest._id,
      result: checkedQuestions,
      correctAnswersCount,
      name: dbTest.name,
      description: dbTest.description
    }
  });
});
