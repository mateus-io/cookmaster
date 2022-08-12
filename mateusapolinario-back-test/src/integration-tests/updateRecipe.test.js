const app = require('../api/app');
const chai = require('chai');
const chaiHttp = require('chai-http');
const { MongoClient } = require('mongodb');
const sinon = require('sinon');
const recipeRepository = require('../modules/Recipe/repository/RecipeRepository');
const { UpdateRecipeController } = require('../modules/Recipe/updateRecipe/UpdateRecipeController');
const { UpdateRecipeService } = require('../modules/Recipe/updateRecipe/UpdateRecipeService');
const { updateRecipeBuildInstance } = require('../modules/Recipe/updateRecipe');
const ObjectId = require('../helpers/ObjectId');
require('dotenv').config();

const expect = chai.expect;

chai.use(chaiHttp);

const mongoDbUrl = `mongodb://${process.env.HOST || 'mongodb'}:27017/Cookmaster`;

describe('Update Recipe', () => {
  let connection;
  let db;

  const USER_ID = '62a770819dcc59f1a4d7c99b';
  const RECIPE_ID = '12a770819dcc59f1a4d7c19b';

  const updateRecipeData = {
    name: 'Frango Especial',
    ingredients: 'Frango, Sazon',
    preparation: '15 minutos no forno'
  }
  const recipe = {
    name: 'Frango',
    ingredients: 'Frango, Sazon',
    preparation: '10 minutos no forno',
    userId: ObjectId.generate(USER_ID),
    _id: ObjectId.generate(RECIPE_ID)
  };
  const user = {
    name: 'user',
    email: 'user@email.com',
    password: 'pass',
    role: 'user',
    _id: ObjectId.generate(USER_ID)
  };

  before(async () => {
    connection = await MongoClient.connect(mongoDbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = connection.db('Cookmaster');
  });

  beforeEach(async () => {
    await db.collection('users').deleteMany({});
    await db.collection('recipes').deleteMany({});
    const users = [
      user
    ];
    const recipes = [
      recipe
    ];
    await db.collection('users').insertMany(users);
    await db.collection('recipes').insertMany(recipes);
  });

  after(async () => {
    await connection.close();
  });

  it('Should be able to update a recipe - Output Layer', (done) => {
    const agent = chai.request.agent(app)
    agent
      .post('/login')
      .send({
        email: user.email,
        password: user.password,
      })
      .end((_, { body: { token } }) => {
        agent
          .put('/recipes/' + RECIPE_ID)
          .set('Authorization', token)
          .send(updateRecipeData)
          .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            expect(res.body.name).to.equal(updateRecipeData.name);
            expect(res.body.ingredients).to.equal(updateRecipeData.ingredients);
            expect(res.body.preparation).to.equal(updateRecipeData.preparation);
            expect(res.body.userId).to.equal(USER_ID);
            expect(res.body._id).to.equal(RECIPE_ID);
            agent
              .get('/recipes/' + RECIPE_ID)
              .end((_, resp) => {
                expect(resp).to.have.status(200);
                expect(resp.body.name).to.equal(updateRecipeData.name);
                expect(resp.body.ingredients).to.equal(updateRecipeData.ingredients);
                expect(resp.body.preparation).to.equal(updateRecipeData.preparation);
                expect(resp.body.userId).to.equal(USER_ID);
                expect(resp.body._id).to.equal(RECIPE_ID);
                agent.close();
                done();
              });
         });
      });
  });

  it('Should not be able to update a recipe - Recipe Not Found', (done) => {
    const agent = chai.request.agent(app)
    agent
      .post('/login')
      .send({
        email: user.email,
        password: user.password,
      })
      .end((_, { body: { token } }) => {
        agent
          .put('/recipes/62a6bfdc1ed0c8513d339bb3')
          .set('Authorization', token)
          .send(updateRecipeData)
          .end((_, res) => {
            expect(res).to.have.status(404);
            expect(res.body.message).to.equal('recipe not found');
            agent.close();
            done();
         });
      });
  });

  it('Should not be able to update a recipe - Not Authorized Invalid Token', (done) => {
    chai.request(app)
      .put('/recipes/' + RECIPE_ID)
      .set('Authorization', 'invalid token')
      .send(updateRecipeData)
      .end((_, res) => {
        expect(res).to.have.status(401);
        expect(res.body.message).to.equal('jwt malformed');
        done();
      });
  });

  it('Should be able to update a recipe - Controller Layer', (done) => {
    const updateRecipeInstance = updateRecipeBuildInstance();
    expect(updateRecipeInstance).to.be.an.instanceOf(UpdateRecipeController);
    sinon.stub(updateRecipeInstance, 'run').callsFake((request, response) => {
      return new Promise((resolve, _) => {
        response.body = {
          ...request.body,
          _id: RECIPE_ID,
          userId: USER_ID,
        }
        response.status = 200;
        setTimeout(() => {
          resolve(response);
        }, 25);
      });
    });
    updateRecipeInstance.run({ body: updateRecipeData }, {})
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.body.name).to.equal(updateRecipeData.name);
        expect(res.body.ingredients).to.equal(updateRecipeData.ingredients);
        expect(res.body.preparation).to.equal(updateRecipeData.preparation);
        expect(res.body.userId).to.equal(USER_ID);
        expect(res.body._id).to.equal(RECIPE_ID);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('Should be able to update a recipe - Service Layer', (done) => {
    const updateRecipeService = new UpdateRecipeService(recipeRepository);
    expect(updateRecipeService).to.be.an.instanceOf(UpdateRecipeService);
    updateRecipeService.execute(RECIPE_ID, updateRecipeData)
      .then((res) => {
        const { err, payload } = res;
        expect(err).to.be.null;
        expect(payload.name).to.equal(updateRecipeData.name);
        expect(payload.ingredients).to.equal(updateRecipeData.ingredients);
        expect(payload.preparation).to.equal(updateRecipeData.preparation);
        expect(payload.userId.toString()).to.equal(USER_ID);
        expect(payload.id).to.equal(RECIPE_ID);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('Should be able to update a recipe - Repository Layer', (done) => {
    const update = sinon.spy(recipeRepository, 'findByIdAndUpdate');
    const agent = chai.request.agent(app)
    agent
      .post('/login')
      .send({
        email: user.email,
        password: user.password,
      })
      .end((_, { body: { token } }) => {
        agent
          .put('/recipes/' + RECIPE_ID)
          .set('Authorization', token)
          .send(updateRecipeData)
          .end(() => {
            update.restore();
            expect(update
              .calledOnceWithExactly(ObjectId.generate(RECIPE_ID), updateRecipeData)
            ).to.be.true;
            agent.close();
            done();
         });
      });
  });
});
