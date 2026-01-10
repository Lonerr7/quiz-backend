const Test = require('../model/TestModel');

exports.getAllTests = async (req, res) => {
  try {
    const tests = await Test.find({});

    res.status(200).json({
      status: 'success',
      results: tests.length,
      data: {
        tests
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    })
  }
};

exports.getTestById = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id).select('+questions');

    res.status(200).json({
      status: 'success',
      data: {
        test
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    })
  }
};

exports.submitTest = (req, res) => {
  const {id} = req.params;

  if (!id) {
    res.status(404).json({
      status: 'fail',
      message: 'No test found'
    });
    return;
  }

  // Какой тут брать статус код??
  res.status(200).json({
    status: 'success',
    data: {

    // вернуть ответ в виде полного теста с доп полями для каждого вопроса: isAnswered, isCorrect, userAnswer
    }
  })
};
