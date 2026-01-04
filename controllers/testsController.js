const crypto = require('crypto');
const fs = require('fs');
const Test = require('../model/TestModel');

const tests = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/tests.json`, 'utf-8'));

exports.getAllTests = async (req, res) => {
  const tests = await Test.find({});

  res.status(200).json({
    status: 'success',
    results: tests.length,
    data: {
      tests
    }
  });
};
exports.getTestById = (req, res) => {
  const test = req.foundTest;

  res.status(200).json({
    status: 'success',
    data: {
      test
    }
  });
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
