const { ErrorResponse } = require('../dto/errorResponse');

const validateRequest = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    const message = error.details.map((detail) => detail.message).join(', ');
    return res.status(400).json(new ErrorResponse(message, 'VALIDATION_ERROR'));
  }
  return next();
};

module.exports = validateRequest;
