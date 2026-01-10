const Test = require('../model/TestModel');

exports.createTest = async (req, res) => {
  try {
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
  } catch (err) {
    console.log(err);

    res.status(400).json({
      status: 'fail',
      message: `${err._message}`,
      error: err
    })
  }
};

exports.getTestById = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id).select('+questions +questions.correctAnswer');

    res.status(200).json({
      status: 'success',
      data: {
        test
      }
    })
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};

exports.editTest = async (req, res) => {
  try {
    const newTest = await Test.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).select('+questions +questions.correctAnswer');

    res.status(200).json({
      status: 'success',
      data: {
        test: newTest
      }
    })
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err
    })
  }
};

exports.deleteTest = async (req, res) => {
  try {
    await Test.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null
    })
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      error: err
    })
  }
};