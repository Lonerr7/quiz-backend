const {Schema, model} = require('mongoose');
const questionSchema = require('./QuestionModel');

const testSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: String,
  questions: {
    type: [questionSchema],
    select: false,
    validate: {
      validator: (questions) => questions.length,
      message: 'Questions must not be empty',
    }
  }
});

const Test = model('Test', testSchema);
module.exports = Test;