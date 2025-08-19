const User = require('../models/user');

class UserRepository {
  async createUser(username, hashedPassword) {
    return User.create({ username, password: hashedPassword });
  }

  async findByUsername(username) {
    return User.findOne({ where: { username } });
  }

  async findById(id) {
    return User.findByPk(id);
  }

  async updateUser(id, userData) {
    await User.update(userData, { where: { id } });
    return this.findById(id);
  }

  async deleteUser(id) {
    return User.destroy({ where: { id } });
  }
}

module.exports = new UserRepository();
