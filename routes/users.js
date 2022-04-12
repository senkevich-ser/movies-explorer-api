const userRoutes = require('express').Router();
const { checkProfile } = require('../utils/validation');

const {
  updateProfile,
  getCurrentUser,
} = require('../controllers/users');

userRoutes.get('/users/me', getCurrentUser);
userRoutes.patch('/users/me', checkProfile, updateProfile);

module.exports = userRoutes;
