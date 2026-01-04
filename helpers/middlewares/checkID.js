const fs = require("fs");
const TESTS_FILEPATH = `${__dirname}/../../dev-data/tests.json`;
const tests = JSON.parse(fs.readFileSync(TESTS_FILEPATH, 'utf-8'));

exports.checkID = (req, res, next, value) => {
  const test = tests.find((testObj) => testObj.id === value);

  if (!test) {
    res.status(404).json({
      status: 'fail',
      message: 'not found'
    });
    return;
  }

  req.foundTest = test;
  next();
};