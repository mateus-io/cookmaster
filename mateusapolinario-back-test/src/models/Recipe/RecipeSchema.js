const mongoose = require('mongoose');

const { Schema } = mongoose;

const recipeSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  ingredients: { 
    type: String,
    required: true,
  },
  preparation: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  versionKey: false,
});
const Recipe = mongoose.model('Recipe', recipeSchema, 'recipes');

module.exports = { Recipe };