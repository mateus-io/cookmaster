const { USER_ROLE } = require('../../../utils/Constants');

class CreateUserService {
  constructor(repository) {
    this.repository = repository;
    this.execute = this.execute.bind(this);
  }

  async execute(data) {
    const entity = {
      ...data,
      role: USER_ROLE,
    };
    try {
      let payload = await this.repository.insertOne(entity);
      payload = payload.toJSON();
      delete payload.password;
      return { err: null, payload };
    } catch (err) {
      return { err, payload: null };
    }
  }
}

module.exports = { CreateUserService };