const app = require('../api/app');
const chai = require('chai');
const chaiHttp = require('chai-http');
const { MongoClient } = require('mongodb');
const sinon = require('sinon');
const recipeRepository = require('../modules/Recipe/repository/RecipeRepository');
const { GetRecipeController } = require('../modules/Recipe/getRecipe/GetRecipeController');
const { GetRecipeService } = require('../modules/Recipe/getRecipe/GetRecipeService');
const { getRecipeBuildInstance } = require('../modules/Recipe/getRecipe');
const ObjectId = require('../helpers/ObjectId');
require('dotenv').config();

const expect = chai.expect;

chai.use(chaiHttp);

const mongoDbUrl = `mongodb://${process.env.HOST || 'mongodb'}:27017/Cookmaster`;

describe('Get Recipe', () => {
  let connection;
  let db;

  const USER_ID = '62a771e7160a550a5492b997';
  const RECIPE_ID = '62a770819dcc59f1a4d7c99b';
  const recipe = {
    name: 'Frango',
    ingredients: 'Frango, Sazon',
    preparation: '10 minutos no forno',
    userId: ObjectId.generate(USER_ID),
    _id: ObjectId.generate(RECIPE_ID)
  };

  before(async () => {
    connection = await MongoClient.connect(mongoDbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = connection.db('Cookmaster');
  });

  beforeEach(async () => {
    await db.collection('recipes').deleteMany({});
    const recipes = [
      recipe
    ];
    await db.collection('recipes').insertMany(recipes);
  });

  after(async () => {
    await connection.close();
  });

  it('Should be able to get a recipe - Output Layer', (done) => {
    chai.request(app)
      .get('/recipes/' + RECIPE_ID)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('_id');
        expect(res.body).to.have.property('name');
        expect(res.body).to.have.property('ingredients');
        expect(res.body).to.have.property('preparation');
        expect(res.body).to.have.property('userId');
        expect(res.body.userId).to.equal(USER_ID);
        done();
      });
  });

  it('Should not be able to get a recipe - Recipe Not Found', (done) => {
    chai.request(app)
      .get('/recipes/' + 'Recipe not found')
      .end((_, res) => {
        expect(res).to.have.status(404);
        expect(res.body.message).to.equal('recipe not found');
        done();
      });
  });

  it('Should be able to get a recipe - Controller Layer', (done) => {
    const getRecipeInstance = getRecipeBuildInstance();
    expect(getRecipeInstance).to.be.an.instanceOf(GetRecipeController);
    sinon.stub(getRecipeInstance, 'run').callsFake((request, response) => {
      return new Promise((resolve, _) => {
        response.body = {
          ...recipe,
          _id: request.params.id,
          userId: USER_ID,
        }
        response.status = 200;
        setTimeout(() => {
          resolve(response);
        }, 25);
      });
    });
    getRecipeInstance.run({ params: { id: RECIPE_ID } }, {})
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('_id');
        expect(res.body).to.have.property('name');
        expect(res.body).to.have.property('ingredients');
        expect(res.body).to.have.property('preparation');
        expect(res.body).to.have.property('userId');
        expect(res.body.userId).to.equal(USER_ID);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('Should be able to get a recipe - Service Layer', (done) => {
    const getRecipeService = new GetRecipeService(recipeRepository);
    expect(getRecipeService).to.be.an.instanceOf(GetRecipeService);
    getRecipeService.execute(RECIPE_ID)
      .then((res) => {
        const { err, payload } = res;
        expect(err).to.be.null;
        expect(payload).to.have.property('_id');
        expect(payload).to.have.property('name');
        expect(payload).to.have.property('ingredients');
        expect(payload).to.have.property('preparation');
        expect(payload).to.have.property('userId');
        expect(payload.userId.toString()).to.equal(USER_ID);
        expect(payload.id).to.equal(RECIPE_ID);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('Should be able to get a recipe - Repository Layer', (done) => {
    const find = sinon.spy(recipeRepository, 'findById');
    chai.request(app)
      .get('/recipes/' + RECIPE_ID)
      .end(() => {
        find.restore();
        expect(find.calledOnceWithExactly(ObjectId.generate(RECIPE_ID)))
          .to.be.true;
        done();
      });
  });
});
