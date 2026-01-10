const {Schema} = require('mongoose');

const questionSchema = new Schema({
  text: {
    type: String,
    required: true,
  },
  options: {
    type: [String],
    required: true,
    validate: {
      validator: (value) => Array.isArray(value) && value.length >=2,
      message: 'Question must have at least 2 options',
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