class ErrorResponse extends Error {
  constructor(message, code = 'BAD_REQUEST', statusCode = 400) {
    super(message);
    this.name = 'ErrorResponse';
    this.error = {
      message,
      code,
      timestamp: new Date().toISOString(),
    };
    this.statusCode = statusCode;
  }
}

module.exports = {
  ErrorResponse,
};
