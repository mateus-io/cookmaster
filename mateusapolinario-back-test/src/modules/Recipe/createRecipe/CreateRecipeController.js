const { handleRuntimeErrors } = require('./CreateRecipeError');
const ObjectId = require('../../../helpers/ObjectId');

class CreateRecipeController {
  constructor(service) {
    this.service = service;
    this.run = this.run.bind(this);
  }

  async run(request, response) {
    const {
      name,
      ingredients,
      preparation,
    } = request.body;
    const data = {
      name,
      ingredients,
      preparation,
      userId: ObjectId.generate(request.userData.id),
    };
    const { err, payload } = await this.service.execute(data);
    if (err) handleRuntimeErrors(err, response);
    else response.status(201).json({ recipe: payload });
  }
}

module.exports = { CreateRecipeController };