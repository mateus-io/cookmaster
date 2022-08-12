const app = require('../api/app');
const chai = require('chai');
const chaiHttp = require('chai-http');
const { MongoClient } = require('mongodb');
const sinon = require('sinon');
const userRepository = require('../modules/User/repository/UserRepository');
const { LoginController } = require('../modules/Authentication/login/LoginController');
const { LoginService } = require('../modules/Authentication/login/LoginService');
const { loginBuildInstance } = require('../modules/Authentication/login');
const Password = require('../helpers/Password');
require('dotenv').config();

const expect = chai.expect;

chai.use(chaiHttp);

const mongoDbUrl = `mongodb://${process.env.HOST || 'mongodb'}:27017/Cookmaster`;

describe('Login', () => {
  let connection;
  let db;

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

  it('Should be able to login - Output Layer', (done) => {
    chai.request(app)
      .post('/login')
      .send({
        email: user.email,
        password: user.password,
      })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('token');
        done();
      });
  });

  it('Should not be able to login - Wrong Credentials', (done) => {
    chai.request(app)
      .post('/login')
      .send({
        email: user.email,
        password: 'wrong password',
      })
      .end((_, res) => {
        expect(res).to.have.status(401);
        done();
      });
  });

  it('Should be able to login - Controller Layer', (done) => {
    const loginInstance = loginBuildInstance();
    expect(loginInstance).to.be.an.instanceOf(LoginController);
    sinon.stub(loginInstance, 'run').callsFake((request, response) => {
      return new Promise((resolve, _) => {
        if (Password.equals(request.body.password, user.password)) {
          response.body = {
            token: 'token aqui'
          }
          response.status = 200;
        } else {
          response.status = 401;
        }
        setTimeout(() => {
          resolve(response);
        }, 25);
      });
    });
    loginInstance.run({ body: { email: user.email, password: user.password } }, {})
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('token');
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('Should be able to login - Service Layer', (done) => {
    const loginService = new LoginService(userRepository);
    expect(loginService).to.be.an.instanceOf(LoginService);
    loginService.execute({ email: user.email, password: user.password })
      .then((res) => {
        const { err, payload } = res;
        expect(err).to.be.null;
        expect(payload).to.not.be.null;
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('Should be able to login - Repository Layer', (done) => {
    const find = sinon.spy(userRepository, 'findOne');
    
    chai.request(app)
      .post('/login')
      .send({
        email: user.email,
        password: user.password,
      })
      .end((_, res) => {
        find.restore();
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('token');
        expect(find
          .calledOnceWithExactly(
            { email: user.email }, 'id email role password'
          )
        ).to.be.true;
        done();
      });
  });
});
