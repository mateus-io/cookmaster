const { handleRuntimeErrors } = require('./CreateAdminError');

class CreateAdminController {
  constructor(service) {
    this.service = service;
    this.run = this.run.bind(this);
  }

  async run(request, response) {
    const {
      name,
      email,
      password,
    } = request.body;
    const data = {
      name,
      email,
      password,
    };
    const { err, payload } = await this.service.execute(data);
    if (err) handleRuntimeErrors(err, response);
    else response.status(201).json({ user: payload });
  }
}

module.exports = { CreateAdminController };