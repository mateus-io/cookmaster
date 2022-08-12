const { handleRuntimeErrors } = require('./GetRecipeError');

class GetRecipeController {
  constructor(service) {
    this.service = service;
    this.run = this.run.bind(this);
  }

  async run(request, response) {
    const { id } = request.params;
    const { err, payload } = await this.service.execute(String(id));
    if (err) handleRuntimeErrors(err, response);
    else response.status(200).json(payload);
  }
}

module.exports = { GetRecipeController };