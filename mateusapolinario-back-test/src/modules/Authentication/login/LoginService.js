const { CustomException } = require('../../../utils/CustomException');
const { ERRORS } = require('../../../utils/Constants');
const Password = require('../../../helpers/Password');
const Token = require('../../../helpers/Token');

class LoginService {
  constructor(repository) {
    this.repository = repository;
    this.execute = this.execute.bind(this);
  }

  async execute(data) {
    const { email, password } = data;
    try {
      const user = await this.repository.findOne({ email }, 'id email role password');
      if (!user) throw CustomException('User not found', ERRORS.LOGIN_CREDENTIALS.code);
      if (!Password.equals(password, user.password)) {
        throw CustomException('Incorrect password', ERRORS.LOGIN_CREDENTIALS.code);
      }
      const token = Token.encrypt({
        id: user.id,
        email: user.email,
        role: user.role,
      });
      return { err: null, payload: token };
    } catch (err) {
      return { err, payload: null };
    }
  }
}

module.exports = { LoginService };