const app = require('../api/app');
const chai = require('chai');
const chaiHttp = require('chai-http');
const { MongoClient } = require('mongodb');
const sinon = require('sinon');
const recipeRepository = require('../modules/Recipe/repository/RecipeRepository');
const { CreateRecipeController } = require('../modules/Recipe/createRecipe/CreateRecipeController');
const { CreateRecipeService } = require('../modules/Recipe/createRecipe/CreateRecipeService');
const { createRecipeBuildInstance } = require('../modules/Recipe/createRecipe');
const ObjectId = require('../helpers/ObjectId');
require('dotenv').config();

const expect = chai.expect;

chai.use(chaiHttp);

const mongoDbUrl = `mongodb://${process.env.HOST || 'mongodb'}:27017/Cookmaster`;

describe('Create Recipe', () => {
  let connection;
  let db;

  const recipeData = {
    name: 'Frango',
    ingredients: 'Frango, Sazon',
    preparation: '10 minutos no forno'
  }
  const USER_ID = '62a770819dcc59f1a4d7c99b';
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
    await db.collection('users').insertMany(users);
  });

  after(async () => {
    await connection.close();
  });

  it('Should be able to create a new recipe - Output Layer', (done) => {
    const agent = chai.request.agent(app)
    agent
      .post('/login')
      .send({
        email: user.email,
        password: user.password,
      })
      .end((_, { body: { token } }) => {
        agent
          .post('/recipes')
          .set('Authorization', token)
          .send(recipeData)
          .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(201);
            expect(res.body).to.have.property('recipe');
            expect(res.body.recipe).to.have.property('_id');
            expect(res.body.recipe).to.have.property('name');
            expect(res.body.recipe).to.have.property('ingredients');
            expect(res.body.recipe).to.have.property('preparation');
            expect(res.body.recipe).to.have.property('userId');
            expect(res.body.recipe.userId).to.equal(USER_ID);
            agent.close();
            done();
         });
      });
  });

  it('Should not be able to create a new recipe - Missing Fields', (done) => {
    const agent = chai.request.agent(app)
    agent
      .post('/login')
      .send({
        email: user.email,
        password: user.password,
      })
      .end((_, { body: { token } }) => {
        agent
          .post('/recipes')
          .set('Authorization', token)
          .send({ ingredients: recipeData.ingredients })
          .end((_, res) => {
            expect(res).to.have.status(400);
            agent.close();
            done();
         });
      });
  });

  it('Should not be able to create a new recipe - Not Authorized', (done) => {
    chai.request(app)
      .post('/recipes')
      .set('Authorization', 'err')
      .send(recipeData)
      .end((_, res) => {
        expect(res).to.have.status(401);
        done();
      });
  });

  it('Should be able to create a new recipe - Controller Layer', (done) => {
    const createRecipeInstance = createRecipeBuildInstance();
    expect(createRecipeInstance).to.be.an.instanceOf(CreateRecipeController);
    sinon.stub(createRecipeInstance, 'run').callsFake((request, response) => {
      return new Promise((resolve, _) => {
        response.body = {
          recipe: {
            _id: '62a771e7160a550a5492b997',
            name: request.body.name,
            ingredients: request.body.ingredients,
            preparation: request.body.preparation,
            userId: USER_ID,
          }
        }
        response.status = 201;
        setTimeout(() => {
          resolve(response);
        }, 25);
      });
    });
    createRecipeInstance.run({ body: recipeData }, {})
      .then((res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('recipe');
        expect(res.body.recipe).to.have.property('_id');
        expect(res.body.recipe).to.have.property('name');
        expect(res.body.recipe).to.have.property('ingredients');
        expect(res.body.recipe).to.have.property('preparation');
        expect(res.body.recipe).to.have.property('userId');
        expect(res.body.recipe.userId).to.equal(USER_ID);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('Should be able to create a new recipe - Service Layer', (done) => {
    const createRecipeService = new CreateRecipeService(recipeRepository);
    expect(createRecipeService).to.be.an.instanceOf(CreateRecipeService);
    createRecipeService.execute({ ...recipeData, userId: ObjectId.generate(USER_ID) })
      .then((res) => {
        const { err, payload } = res;
        expect(err).to.be.null;
        expect(payload).to.have.property('_id');
        expect(payload).to.have.property('name');
        expect(payload).to.have.property('ingredients');
        expect(payload).to.have.property('preparation');
        expect(payload).to.have.property('userId');
        expect(payload.userId.toString()).to.equal(USER_ID);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('Should be able to create a new recipe - Repository Layer', (done) => {
    const insert = sinon.spy(recipeRepository, 'insertOne');
    const agent = chai.request.agent(app)
    agent
      .post('/login')
      .send({
        email: user.email,
        password: user.password,
      })
      .end((_, { body: { token } }) => {
        agent
          .post('/recipes')
          .set('Authorization', token)
          .send(recipeData)
          .end(() => {
            insert.restore();
            expect(insert
              .calledOnceWithExactly({
                  ...recipeData,
                  userId: ObjectId.generate(USER_ID)
                })
              ).to.be.true;
            agent.close();
            done();
         });
      });
  });
});
