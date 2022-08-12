class CreateRecipeService {
  constructor(repository) {
    this.repository = repository;
    this.execute = this.execute.bind(this);
  }

  async execute(data) {
    try {
      const payload = await this.repository.insertOne(data);
      return { err: null, payload };
    } catch (err) {
      return { err, payload: null };
    }
  }
}

module.exports = { CreateRecipeService };