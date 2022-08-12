const Joi = require('joi');
const ObjectId = require('../../helpers/ObjectId');

const RecipeRequestBodyDTO = Joi.object({
    name: Joi.string()
      .required(),
    ingredients: Joi.string()
      .required(),
    preparation: Joi.string()
      .required(),
});

const RecipeRequestParamsDTO = Joi.object({
  id: Joi.string()
    .custom((value, helper) => {
      const objectId = ObjectId.generate(value);
      if (!objectId) {
        return helper.message('Invalid Object Id');
      }
      return true;
    })
    .required(),
}).unknown(true);

module.exports = { RecipeRequestBodyDTO, RecipeRequestParamsDTO };