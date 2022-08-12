const app = require('../api/app');
const chai = require('chai');
const chaiHttp = require('chai-http');
const { MongoClient } = require('mongodb');
const sinon = require('sinon');
const recipeRepository = require('../modules/Recipe/repository/RecipeRepository');
const { DeleteRecipeController } = require('../modules/Recipe/deleteRecipe/DeleteRecipeController');
const { DeleteRecipeService } = require('../modules/Recipe/deleteRecipe/DeleteRecipeService');
const { deleteRecipeBuildInstance } = require('../modules/Recipe/deleteRecipe');
const ObjectId = require('../helpers/ObjectId');
require('dotenv').config();

const expect = chai.expect;

chai.use(chaiHttp);

const mongoDbUrl = `mongodb://${process.env.HOST || 'mongodb'}:27017/Cookmaster`;

describe('Delete Recipe', () => {
  let connection;
  let db;

  const USER_ID = '62a770819dcc59f1a4d7c99b';
  const RECIPE_ID = '12a770819dcc59f1a4d7c19b';

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

  it('Should be able to delete a recipe - Output Layer', (done) => {
    const agent = chai.request.agent(app)
    agent
      .post('/login')
      .send({
        email: user.email,
        password: user.password,
      })
      .end((_, { body: { token } }) => {
        agent
          .delete('/recipes/' + RECIPE_ID)
          .set('Authorization', token)
          .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(204);
            agent
              .get('/recipes/' + RECIPE_ID)
              .end((_, resp) => {
                expect(resp).to.have.status(404);
                agent.close();
                done();
              });
         });
      });
  });

  it('Should not be able to delete a recipe - Recipe Not Found', (done) => {
    const agent = chai.request.agent(app)
    agent
      .post('/login')
      .send({
        email: user.email,
        password: user.password,
      })
      .end((_, { body: { token } }) => {
        agent
          .delete('/recipes/62a6bfdc1ed0c8513d339bb3')
          .set('Authorization', token)
          .end((_, res) => {
            expect(res).to.have.status(404);
            expect(res.body.message).to.equal('recipe not found');
            agent.close();
            done();
         });
      });
  });

  it('Should not be able to delete a recipe - Not Authorized Invalid Token', (done) => {
    chai.request(app)
      .delete('/recipes/' + RECIPE_ID)
      .set('Authorization', 'invalid token')
      .end((_, res) => {
        expect(res).to.have.status(401);
        expect(res.body.message).to.equal('jwt malformed');
        done();
      });
  });

  it('Should be able to delete a recipe - Controller Layer', (done) => {
    const deleteRecipeInstance = deleteRecipeBuildInstance();
    expect(deleteRecipeInstance).to.be.an.instanceOf(DeleteRecipeController);
    sinon.stub(deleteRecipeInstance, 'run').callsFake((_, response) => {
      return new Promise((resolve, _) => {
        response.status = 204;
        setTimeout(() => {
          resolve(response);
        }, 25);
      });
    });
    deleteRecipeInstance.run({ params: { id: RECIPE_ID } }, {})
      .then((res) => {
        expect(res).to.have.status(204);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('Should be able to delete a recipe - Service Layer', (done) => {
    const deleteRecipeService = new DeleteRecipeService(recipeRepository);
    expect(deleteRecipeService).to.be.an.instanceOf(DeleteRecipeService);
    deleteRecipeService.execute(RECIPE_ID)
      .then((res) => {
        const { err } = res;
        expect(err).to.be.null;
        chai.request(app)
          .get('/recipes/' + RECIPE_ID)
          .end((_, resp) => {
            expect(resp).to.have.status(404);
            done();
          });
      })
      .catch((err) => {
        done(err);
      });
  });

  it('Should be able to delete a recipe - Repository Layer', (done) => {
    const deleteOne = sinon.spy(recipeRepository, 'findByIdAndRemove');
    const agent = chai.request.agent(app)
    agent
      .post('/login')
      .send({
        email: user.email,
        password: user.password,
      })
      .end((_, { body: { token } }) => {
        agent
          .delete('/recipes/' + RECIPE_ID)
          .set('Authorization', token)
          .end(() => {
            deleteOne.restore();
            expect(deleteOne
              .calledOnceWithExactly(ObjectId.generate(RECIPE_ID))
            ).to.be.true;
            agent.close();
            done();
         });
      });
  });
});
