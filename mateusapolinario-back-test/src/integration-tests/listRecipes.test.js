const app = require('../api/app');
const chai = require('chai');
const chaiHttp = require('chai-http');
const { MongoClient } = require('mongodb');
const sinon = require('sinon');
const recipeRepository = require('../modules/Recipe/repository/RecipeRepository');
const { ListRecipesController } = require('../modules/Recipe/listRecipes/ListRecipesController');
const { ListRecipesService } = require('../modules/Recipe/listRecipes/ListRecipesService');
const { listRecipesBuildInstance } = require('../modules/Recipe/listRecipes');
const ObjectId = require('../helpers/ObjectId');
require('dotenv').config();

const expect = chai.expect;

chai.use(chaiHttp);

const mongoDbUrl = `mongodb://${process.env.HOST || 'mongodb'}:27017/Cookmaster`;

describe('Get Recipe', () => {
  let connection;
  let db;

  const USER_ID = '62a771e7160a550a5492b997';
  const recipes = [
    {
      name: 'Frango',
      ingredients: 'Frango, Sazon',
      preparation: '10 minutos no forno',
      userId: ObjectId.generate(USER_ID),
      _id: ObjectId.generate('62a770819dcc59f1a4d7c99b')
    },
    {
      name: 'Frango Especial',
      ingredients: 'Frango, Sazon',
      preparation: '15 minutos no forno',
      userId: ObjectId.generate(USER_ID),
      _id: ObjectId.generate('12a770819dcc59f1a4d7c19b')
    },
  ];

  const recipesResult = recipes
    .map((recipe) => ({
      ...recipe,
      _id: recipe._id.toString(),
      userId: recipe.userId.toString()
    }));

  before(async () => {
    connection = await MongoClient.connect(mongoDbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = connection.db('Cookmaster');
  });

  beforeEach(async () => {
    await db.collection('recipes').deleteMany({});
    await db.collection('recipes').insertMany(recipes);
  });

  after(async () => {
    await connection.close();
  });

  it('Should be able to list recipes - Output Layer', (done) => {
    chai.request(app)
      .get('/recipes')
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.have.deep.members(recipesResult);
        done();
      });
  });

  it('Should be able to list recipes - Controller Layer', (done) => {
    const listRecipesInstance = listRecipesBuildInstance();
    expect(listRecipesInstance).to.be.an.instanceOf(ListRecipesController);
    sinon.stub(listRecipesInstance, 'run').callsFake((request, response) => {
      return new Promise((resolve, _) => {
        response.body = recipesResult;
        response.status = 200;
        setTimeout(() => {
          resolve(response);
        }, 25);
      });
    });
    listRecipesInstance.run({}, {})
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.deep.members(recipesResult);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('Should be able to list recipes - Service Layer', (done) => {
    const listRecipesService = new ListRecipesService(recipeRepository);
    expect(listRecipesService).to.be.an.instanceOf(ListRecipesService);
    listRecipesService.execute()
      .then((res) => {
        const { err, payload } = res;
        const recoveredRecipes = payload
          .map((recipe) => (recipe.toJSON()));
        expect(err).to.be.null;
        expect(recoveredRecipes).to.have.deep.members(recipes);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('Should be able to list recipes - Repository Layer', (done) => {
    const findAll = sinon.spy(recipeRepository, 'findAll');
    chai.request(app)
      .get('/recipes')
      .end(() => {
        findAll.restore();
        expect(findAll.calledOnceWithExactly({})).to.be.true;
        done();
      });
  });
});
