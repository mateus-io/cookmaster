class ListRecipesService {
  constructor(repository) {
    this.repository = repository;
    this.execute = this.execute.bind(this);
  }

  async execute() {
    try {
      const payload = await this.repository.findAll({});
      return { err: null, payload };
    } catch (err) {
      return { err, payload: null };
    }
  }
}

module.exports = { ListRecipesService };