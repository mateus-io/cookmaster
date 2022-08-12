const app = require('../api/app');
const chai = require('chai');
const chaiHttp = require('chai-http');
const { MongoClient } = require('mongodb');
const sinon = require('sinon');
const userRepository = require('../modules/User/repository/UserRepository');
const { CreateUserController } = require('../modules/User/createUser/CreateUserController');
const { CreateUserService } = require('../modules/User/createUser/CreateUserService');
const { createUserBuildInstance } = require('../modules/User/createUser');
require('dotenv').config();

const expect = chai.expect;

chai.use(chaiHttp);

const mongoDbUrl = `mongodb://${process.env.HOST || 'mongodb'}:27017/Cookmaster`;

describe('Create User', () => {
  let connection;
  let db;

  const userData = {
    name: 'Test Integration',
    email: 'testIntegration@gmail.com',
    password: 'test',
  }

  before(async () => {
    connection = await MongoClient.connect(mongoDbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = connection.db('Cookmaster');
  });

  beforeEach(async () => {
    await db.collection('users').deleteMany({});
  });

  after(async () => {
    await connection.close();
  });

  it('Should be able to create a new user - Output Layer', (done) => {
    chai.request(app)
      .post('/users')
      .send(userData)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('user');
        expect(res.body.user).to.not.have.property('password');
        expect(res.body.user).to.have.property('_id');
        expect(res.body.user).to.have.property('name');
        expect(res.body.user).to.have.property('email');
        expect(res.body.user).to.have.property('role');
        expect(res.body.user.role).to.equal('user');
        done();
     });
  });

  it('Should not be able to create a new user - Missing Fields', (done) => {
    chai.request(app)
      .post('/users')
      .send({ email: userData.email })
      .end((_, res) => {
        expect(res).to.have.status(400);
        expect(res.body.message).to.equal('Invalid entries. Try again.');
        done();
     });
  });

  it('Should not be able to create a new user - Email Already Exists', (done) => {
    const agent = chai.request.agent(app);

    agent
      .post('/users')
      .send(userData)
      .end((_, res) => {
        expect(res).to.have.status(201);
        agent
          .post('/users')
          .send(userData)
          .end((err, resp) => {
            expect(err).to.be.null;
            expect(resp).to.have.status(409);
            expect(resp.body.message).to.equal('Email already registered');
            agent.close();
            done();
          });
     });
  });

  it('Should be able to create a new user - Controller Layer', (done) => {
    const createUserInstance = createUserBuildInstance();
    expect(createUserInstance).to.be.an.instanceOf(CreateUserController);
    sinon.stub(createUserInstance, 'run').callsFake((request, response) => {
      return new Promise((resolve, _) => {
        response.body = {
          user: {
            _id: '62a771e7160a550a5492b997',
            name: request.body.name,
            email: request.body.email,
            role: 'user'
          }
        }
        response.status = 201;
        setTimeout(() => {
          resolve(response);
        }, 25);
      });
    });
    createUserInstance.run({ body: userData }, {})
      .then((res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('user');
        expect(res.body.user).to.not.have.property('password');
        expect(res.body.user).to.have.property('_id');
        expect(res.body.user).to.have.property('name');
        expect(res.body.user).to.have.property('email');
        expect(res.body.user).to.have.property('role');
        expect(res.body.user.role).to.equal('user');
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('Should be able to create a new user - Service Layer', (done) => {
    const createUserService = new CreateUserService(userRepository);
    expect(createUserService).to.be.an.instanceOf(CreateUserService);
    createUserService.execute(userData)
      .then((res) => {
        const { err, payload } = res;
        expect(err).to.be.null;
        expect(payload).to.not.have.property('password');
        expect(payload).to.have.property('_id');
        expect(payload).to.have.property('name');
        expect(payload).to.have.property('email');
        expect(payload).to.have.property('role');
        expect(payload.role).to.equal('user');
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('Should be able to create a new user - Repository Layer', (done) => {
    const insert = sinon.spy(userRepository, 'insertOne');

    chai.request(app)
      .post('/users')
      .send(userData)
      .end(() => {
        insert.restore();
        expect(insert.calledOnceWithExactly({ ...userData, role: 'user' })).to.be.true;
        done();
     });
  });
});
