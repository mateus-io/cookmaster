const { handleRuntimeErrors } = require('./UpdateRecipeError');

class UpdateRecipeController {
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
    const { id } = request.params;
    const data = {
      name,
      ingredients,
      preparation,
    };
    const { err, payload } = await this.service.execute(id, data);
    if (err) handleRuntimeErrors(err, response);
    else response.status(200).json(payload);
  }
}

module.exports = { UpdateRecipeController };