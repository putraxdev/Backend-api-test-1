const userRepository = require('../src/repositories/userRepository');
const User = require('../src/models/user');

// Mock Sequelize model
jest.mock('../src/models/user');

describe('UserRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should create user', async () => {
    const mockUser = { id: 1, username: 'test', password: 'hashedpass' };
    User.create.mockResolvedValue(mockUser);

    const result = await userRepository.createUser('test', 'hashedpass');
    expect(result).toEqual(mockUser);
    expect(User.create).toHaveBeenCalledWith({ username: 'test', password: 'hashedpass' });
  });

  test('should find user by username', async () => {
    const mockUser = { id: 1, username: 'test' };
    User.findOne.mockResolvedValue(mockUser);

    const result = await userRepository.findByUsername('test');
    expect(result).toEqual(mockUser);
    expect(User.findOne).toHaveBeenCalledWith({ where: { username: 'test' } });
  });

  test('should find user by id', async () => {
    const mockUser = { id: 1, username: 'test' };
    User.findByPk.mockResolvedValue(mockUser);

    const result = await userRepository.findById(1);
    expect(result).toEqual(mockUser);
    expect(User.findByPk).toHaveBeenCalledWith(1);
  });

  test('should update user', async () => {
    const mockUser = { id: 1, username: 'updated' };
    User.update.mockResolvedValue([1]);
    User.findByPk.mockResolvedValue(mockUser);

    const result = await userRepository.updateUser(1, { username: 'updated' });
    expect(result).toEqual(mockUser);
    expect(User.update).toHaveBeenCalledWith({ username: 'updated' }, { where: { id: 1 } });
  });

  test('should delete user', async () => {
    User.destroy.mockResolvedValue(1);

    const result = await userRepository.deleteUser(1);
    expect(result).toBe(1);
    expect(User.destroy).toHaveBeenCalledWith({ where: { id: 1 } });
  });
});
