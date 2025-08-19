class UserResponse {
  constructor(user) {
    this.id = user.id;
    this.username = user.username;
    this.createdAt = user.created_at;
  }
}

module.exports = {
  UserResponse,
};
