const {Schema, model} = require('mongoose');

const testSchema = new Schema({
  name: String,
  description: String,
});

const Test = model('Test', testSchema);
module.exports = Test;