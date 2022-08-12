const { handleRuntimeErrors } = require('./ListRecipesError');

class ListRecipesController {
  constructor(service) {
    this.service = service;
    this.run = this.run.bind(this);
  }

  async run(_, response) {
    const { err, payload } = await this.service.execute();
    if (err) handleRuntimeErrors(err, response);
    else response.status(200).json(payload);
  }
}

module.exports = { ListRecipesController };