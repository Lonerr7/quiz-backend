const crypto = require('crypto');
const fs = require('fs');

const TESTS_FILEPATH = `${__dirname}/../dev-data/tests.json`;
const tests = JSON.parse(fs.readFileSync(TESTS_FILEPATH, 'utf-8'));

exports.checkBody = (req, res, next) => {
  const {name, questions} = req.body;
  if (!name || !questions?.length) {
    res.status(400).json({
      status: 'fail',
      message: 'Please provide correct data'
    });
    return;
  }
  next();
};
exports.createTest = (req, res) => {
  const id = crypto.randomUUID();

  const newTest = {
    id,
    createdAt: new Date().toISOString(),
    ...req.body
  };

  tests.push(newTest);
  fs.writeFile(TESTS_FILEPATH, JSON.stringify(tests), (err) => {
    res.status(201).json({
      status: 'success',
      data: {
        test: newTest
      }
    });
  });

  // res.send('Done');

  res.status(201).json({
    status: 'success',
    data: {
      test: newTest
    }
  })
};

exports.editTest = (req, res) => {
  const {id} = req.params;

  // Логика обновления теста

  res.status(200).json({
    status: 'success',
    data: {
      test: 'updatedTest'
    }
  })
};

exports.deleteTest = (req, res) => {
  const {id} = req.params;

  if (!id) {
    res.status(404).json({
      status: 'fail',
      message: 'Invalid ID'
    })
    return;
  }

  res.status(204).json({
    status: 'success',
    data: null
  })
};