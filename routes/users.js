const userRoutes = require('express').Router();
const { checkProfile } = require('../utils/validation');

const {
  updateProfile,
  getCurrentUser,
} = require('../controllers/users');

userRoutes.get('/me', getCurrentUser);
userRoutes.patch('/me', checkProfile, updateProfile);

module.exports = userRoutes;
