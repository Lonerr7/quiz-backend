const {Schema} = require('mongoose');

const questionSchema = new Schema({
  text: {
    type: String,
    required: [true, 'Вопрос не может быть пустым'],
    trim: true,
    minLength: [3, 'Вопрос должен быть более 2 символов'],
    maxLength: [101, 'Вопрос не может быть более 100 символов']
  },
  options: {
    type: [String],
    required: true,
    validate: {
      validator: (value) => Array.isArray(value) && value.length >=2,
      message: 'У вопроса должно быть минимум 2 варианта ответа',
    }
  },
  correctAnswer: {
    type: Number,
    required: true,
    select: false,
    validate: {
      validator: function(value) {
        return value >= 0 && value < this.options.length;
      },
      message: 'Correct answer index is out of bounds'
    }
  }
});

module.exports = questionSchema;