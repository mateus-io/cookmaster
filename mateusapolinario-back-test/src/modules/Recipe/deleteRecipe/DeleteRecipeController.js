const { handleRuntimeErrors } = require('./DeleteRecipeError');

class DeleteRecipeController {
  constructor(service) {
    this.service = service;
    this.run = this.run.bind(this);
  }

  async run(request, response) {
    const { id } = request.params;
    const { err } = await this.service.execute(id);
    if (err) handleRuntimeErrors(err, response);
    else response.status(204).send();
  }
}

module.exports = { DeleteRecipeController };