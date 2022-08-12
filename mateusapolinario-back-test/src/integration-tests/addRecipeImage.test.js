const app = require('../api/app');
const chai = require('chai');
const chaiHttp = require('chai-http');
const { MongoClient } = require('mongodb');
const sinon = require('sinon');
const path = require('path');
const recipeRepository = require('../modules/Recipe/repository/RecipeRepository');
const { AddRecipeImageController } = require('../modules/Recipe/addRecipeImage/AddRecipeImageController');
const { AddRecipeImageService } = require('../modules/Recipe/addRecipeImage/AddRecipeImageService');
const { addRecipeImageBuildInstance } = require('../modules/Recipe/addRecipeImage');
const ObjectId = require('../helpers/ObjectId');
const FileSystem = require('../helpers/FileSystem');
require('dotenv').config();

const expect = chai.expect;

chai.use(chaiHttp);

const mongoDbUrl = `mongodb://${process.env.HOST || 'mongodb'}:27017/Cookmaster`;

describe('Add Recipe Image', () => {
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
    FileSystem.remove(path.resolve(__dirname, '..', 'uploads', `${RECIPE_ID}.jpeg`));
  });

  after(async () => {
    await connection.close();
  });

  it('Should be able to add recipe image - Output Layer', (done) => {
    const agent = chai.request.agent(app)
    agent
      .post('/login')
      .send({
        email: user.email,
        password: user.password,
      })
      .end((_, { body: { token } }) => {
        agent
          .put('/recipes/' + RECIPE_ID + '/image')
          .set('Authorization', token)
          .attach('image', FileSystem.read(path.resolve(__dirname, '..', 'uploads', 'ratinho.jpg')), 'ratinho.jpg')
          .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            expect(FileSystem.read(path.resolve(__dirname, '..', 'uploads', `${RECIPE_ID}.jpeg`))).to.not.be.null;
            expect(res.body.image).to.equal(`localhost:3000/src/uploads/${RECIPE_ID}.jpeg`);
            agent
              .get('/recipes/' + RECIPE_ID)
              .end((_, resp) => {
                expect(resp).to.have.status(200);
                expect(resp.body.image).to.equal(`localhost:3000/src/uploads/${RECIPE_ID}.jpeg`);
                agent.close();
                done();
              });
         });
      });
  });

  it('Should be able to add recipe image - Controller Layer', (done) => {
    const addRecipeImageInstance = addRecipeImageBuildInstance();
    expect(addRecipeImageInstance).to.be.an.instanceOf(AddRecipeImageController);
    sinon.stub(addRecipeImageInstance, 'run').callsFake((request, response) => {
      return new Promise((resolve, _) => {
        response.body = {
          ...recipe,
          image: `localhost:3000/src/uploads/${request.params.id}.jpeg`,
          _id: RECIPE_ID,
          userId: USER_ID,
        }
        response.status = 200;
        setTimeout(() => {
          resolve(response);
        }, 25);
      });
    });
    addRecipeImageInstance.run({ params: { id: RECIPE_ID } }, {})
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.body.image).to.equal(`localhost:3000/src/uploads/${RECIPE_ID}.jpeg`);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('Should be able to add recipe image - Service Layer', (done) => {
    const addRecipeImageService = new AddRecipeImageService(recipeRepository);
    expect(addRecipeImageService).to.be.an.instanceOf(AddRecipeImageService);
    addRecipeImageService.execute(RECIPE_ID, { image: `localhost:3000/src/uploads/${RECIPE_ID}.jpeg` })
      .then((res) => {
        const { err, payload } = res;
        expect(err).to.be.null;
        expect(payload.image).to.equal(`localhost:3000/src/uploads/${RECIPE_ID}.jpeg`);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('Should be able to add recipe image - Repository Layer', (done) => {
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
        .put('/recipes/' + RECIPE_ID + '/image')
        .set('Authorization', token)
        .attach('image', FileSystem.read(path.resolve(__dirname, '..', 'uploads', 'ratinho.jpg')), 'ratinho.jpg')
          .end((_, res) => {
            update.restore();
            expect(res).to.have.status(200);
            expect(update
              .calledOnceWithExactly(
                ObjectId.generate(RECIPE_ID),
                { image: `localhost:3000/src/uploads/${RECIPE_ID}.jpeg` }
              )
            ).to.be.true;
            expect(FileSystem.read(path.resolve(__dirname, '..', 'uploads', `${RECIPE_ID}.jpeg`))).to.not.be.null;
            expect(res.body.image).to.equal(`localhost:3000/src/uploads/${RECIPE_ID}.jpeg`);
            agent.close();
            done();
         });
      });
  });

  it('Should be able to view recipe image - View Layer', (done) => {
    const agent = chai.request.agent(app)
    agent
      .post('/login')
      .send({
        email: user.email,
        password: user.password,
      })
      .end((_, { body: { token } }) => {
        agent
        .put('/recipes/' + RECIPE_ID + '/image')
        .set('Authorization', token)
        .attach('image', FileSystem.read(path.resolve(__dirname, '..', 'uploads', 'ratinho.jpg')), 'ratinho.jpg')
          .end((_, res) => {
            expect(res).to.have.status(200);
            agent
              .get(`/images/${RECIPE_ID}.jpeg`)
              .end((_, resp) => {
                expect(resp.header).to.not.be.null;
                expect(resp.header['content-type']).to.equal('image/jpeg');
                agent.close();
                done();
              })
         });
      });
  });
});
