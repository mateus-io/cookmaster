const app = require('../api/app');
const chai = require('chai');
const chaiHttp = require('chai-http');
const { MongoClient } = require('mongodb');
const sinon = require('sinon');
const userRepository = require('../modules/User/repository/UserRepository');
const { CreateAdminController } = require('../modules/User/createAdmin/CreateAdminController');
const { CreateAdminService } = require('../modules/User/createAdmin/CreateAdminService');
const { createAdminBuildInstance } = require('../modules/User/createAdmin');
require('dotenv').config();

const expect = chai.expect;

chai.use(chaiHttp);

const mongoDbUrl = `mongodb://${process.env.HOST || 'mongodb'}:27017/Cookmaster`;

describe('Create Admin', () => {
  let connection;
  let db;

  const adminData = {
    name: 'admin1',
    email: 'admin@email.com',
    password: 'admin1',
  }

  const root = {
    name: 'admin',
    email: 'root@email.com',
    password: 'admin',
    role: 'admin'
  };

  const user = {
    name: 'user',
    email: 'user@email.com',
    password: 'pass',
    role: 'user',
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
    const users = [
      root,
      user,
    ];
    await db.collection('users').insertMany(users);
  });

  after(async () => {
    await connection.close();
  });

  it('Should be able to create a new admin - Output Layer', (done) => {
    const agent = chai.request.agent(app)
    agent
      .post('/login')
      .send({
        email: root.email,
        password: root.password,
      })
      .end((_, { body: { token } }) => {
        agent
          .post('/users/admin')
          .set('Authorization', token)
          .send(adminData)
          .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(201);
            expect(res.body).to.have.property('user');
            expect(res.body.user).to.not.have.property('password');
            expect(res.body.user).to.have.property('_id');
            expect(res.body.user).to.have.property('name');
            expect(res.body.user).to.have.property('email');
            expect(res.body.user).to.have.property('role');
            expect(res.body.user.role).to.equal('admin');
            agent.close();
            done();
         });
      });
  });

  it('Should not be able to create a new admin - User Not is Admin', (done) => {
    const agent = chai.request.agent(app)
    agent
      .post('/login')
      .send({
        email: user.email,
        password: user.password,
      })
      .end((_, { body: { token } }) => {
        agent
          .post('/users/admin')
          .set('Authorization', token)
          .send(adminData)
          .end((_, res) => {
            expect(res).to.have.status(403);
            expect(res.body.message).to.equal('Only admins can register new admins');
            agent.close();
            done();
         });
      });
  });

  it('Should be able to create a new admin - Controller Layer', (done) => {
    const createAdminInstance = createAdminBuildInstance();
    expect(createAdminInstance).to.be.an.instanceOf(CreateAdminController);
    sinon.stub(createAdminInstance, 'run').callsFake((request, response) => {
      return new Promise((resolve, _) => {
        response.body = {
          user: {
            _id: '62a771e7160a550a5492b997',
            name: request.body.name,
            email: request.body.email,
            role: 'admin'
          }
        }
        response.status = 201;
        setTimeout(() => {
          resolve(response);
        }, 25);
      });
    });
    createAdminInstance.run({ body: adminData }, {})
      .then((res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('user');
        expect(res.body.user).to.not.have.property('password');
        expect(res.body.user).to.have.property('_id');
        expect(res.body.user).to.have.property('name');
        expect(res.body.user).to.have.property('email');
        expect(res.body.user).to.have.property('role');
        expect(res.body.user.role).to.equal('admin');
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('Should be able to create a new admin - Service Layer', (done) => {
    const createAdminService = new CreateAdminService(userRepository);
    expect(createAdminService).to.be.an.instanceOf(CreateAdminService);
    createAdminService.execute(adminData)
      .then((res) => {
        const { err, payload } = res;
        expect(err).to.be.null;
        expect(payload).to.not.have.property('password');
        expect(payload).to.have.property('_id');
        expect(payload).to.have.property('name');
        expect(payload).to.have.property('email');
        expect(payload).to.have.property('role');
        expect(payload.role).to.equal('admin');
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('Should be able to create a new admin - Repository Layer', (done) => {
    const insert = sinon.spy(userRepository, 'insertOne');
    const agent = chai.request.agent(app)
    agent
      .post('/login')
      .send({
        email: root.email,
        password: root.password,
      })
      .end((_, { body: { token } }) => {
        agent
          .post('/users/admin')
          .set('Authorization', token)
          .send(adminData)
          .end(() => {
            insert.restore();
            expect(insert.calledOnceWithExactly({ ...adminData, role: 'admin' })).to.be.true;
            agent.close();
            done();
         });
      });
  });
});
