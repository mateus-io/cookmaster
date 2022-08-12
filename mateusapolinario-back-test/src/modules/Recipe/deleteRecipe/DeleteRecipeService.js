const ObjectId = require('../../../helpers/ObjectId');

class DeleteRecipeService {
  constructor(repository) {
    this.repository = repository;
    this.execute = this.execute.bind(this);
  }

  async execute(id) {
    try {
      const objectId = ObjectId.generate(id);
      await this.repository.findByIdAndRemove(objectId);
      return { err: null, payload: null };
    } catch (err) {
      return { err, payload: null };
    }
  }
}

module.exports = { DeleteRecipeService };