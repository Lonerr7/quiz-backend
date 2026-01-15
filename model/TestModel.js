const {Schema, model} = require('mongoose');
const questionSchema = require('./QuestionModel');

const testSchema = new Schema({
  name: {
    type: String,
    required: [true, 'У теста должно быть название'],
    unique: true,
    trim: true,
    minLength: [3, 'Название теста должно быть более 2 символов'],
    maxLength: [51, 'Название теста не может быть более 50 символов']
  },
  description: {
    type: String,
    trim: true
  },
  questions: {
    type: [questionSchema],
    select: false,
    validate: {
      validator: (questions) => questions.length,
      message: 'Тест не может быть без вопросов',
    }
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  }
});

const Test = model('Test', testSchema);
module.exports = Test;