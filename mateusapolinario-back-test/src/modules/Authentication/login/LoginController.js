const { handleRuntimeErrors } = require('./LoginError');

class LoginController {
  constructor(service) {
    this.service = service;
    this.run = this.run.bind(this);
  }

  async run(request, response) {
    const {
      email,
      password,
    } = request.body;
    const data = {
      email,
      password,
    };
    const { err, payload } = await this.service.execute(data);
    if (err) handleRuntimeErrors(err, response);
    else response.status(200).json({ token: payload });
  }
}

module.exports = { LoginController };