class ErrorResponse {
  constructor(message, code = 'BAD_REQUEST') {
    this.error = {
      message,
      code,
      timestamp: new Date().toISOString(),
    };
  }
}

module.exports = {
  ErrorResponse,
};
