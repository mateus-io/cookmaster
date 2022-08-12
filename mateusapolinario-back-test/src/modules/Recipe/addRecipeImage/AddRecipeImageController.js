const { handleRuntimeErrors } = require('./AddRecipeImageError');
const { CDN } = require('../../../utils/Constants');

class AddRecipeImageController {
  constructor(service) {
    this.service = service;
    this.run = this.run.bind(this);
  }

  async run(request, response) {
    const { id } = request.params;
    const relativePath = `/src/uploads/${id}.jpeg`;
    const data = {
      image: CDN + relativePath,
    };
    const { err, payload } = await this.service.execute(id, data);
    if (err) handleRuntimeErrors(err, response);
    else response.status(200).json(payload);
  }
}

module.exports = { AddRecipeImageController };