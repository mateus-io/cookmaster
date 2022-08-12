const ObjectId = require('../../../helpers/ObjectId');
const { CustomException } = require('../../../utils/CustomException');
const { ERRORS } = require('../../../utils/Constants');

class AddRecipeImageService {
  constructor(repository) {
    this.repository = repository;
    this.execute = this.execute.bind(this);
  }

  async execute(id, data) {
    try {
      const objectId = ObjectId.generate(id);
      const payload = await this.repository.findByIdAndUpdate(objectId, data);
      if (!payload) throw CustomException('could not update', ERRORS.RECIPE_NOT_FOUND.code);
      return { err: null, payload };
    } catch (err) {
      return { err, payload: null };
    }
  }
}

module.exports = { AddRecipeImageService };