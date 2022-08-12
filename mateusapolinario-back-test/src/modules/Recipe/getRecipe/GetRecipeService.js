const ObjectId = require('../../../helpers/ObjectId');
const { CustomException } = require('../../../utils/CustomException');
const { ERRORS } = require('../../../utils/Constants');

class GetRecipeService {
  constructor(repository) {
    this.repository = repository;
    this.execute = this.execute.bind(this);
  }

  async execute(id) {
    try {
      const objectId = ObjectId.generate(id);
      const payload = await this.repository.findById(objectId);
      if (!payload) throw CustomException('recipe not found', ERRORS.RECIPE_NOT_FOUND.code);
      return { err: null, payload };
    } catch (err) {
      return { err, payload: null };
    }
  }
}

module.exports = { GetRecipeService };