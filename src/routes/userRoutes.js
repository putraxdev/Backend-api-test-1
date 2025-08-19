const express = require('express');
const userController = require('../controllers/userController');
const validateRequest = require('../middleware/validateRequest');
const authMiddleware = require('../middleware/authMiddleware');
const { registerRequest, loginRequest } = require('../dto/userRequest');

const router = express.Router();

router.post(
  '/register',
  validateRequest(registerRequest),
  (req, res) => userController.register(req, res),
);

router.post(
  '/login',
  validateRequest(loginRequest),
  (req, res) => userController.login(req, res),
);

router.get(
  '/profile',
  authMiddleware,
  (req, res) => userController.getProfile(req, res),
);

module.exports = router;
