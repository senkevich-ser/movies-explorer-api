const userRoutes = require('express').Router();
/* const { checkUserId, checkAvatar, checkProfile } = require('../utils/validation'); */

const {
  getUsers,
  updateProfile,
  getCurrentUser,
} = require('../controllers/users');

userRoutes.get('/', getUsers);
userRoutes.get('/me', getCurrentUser);
userRoutes.patch('/me', /* checkProfile, */ updateProfile);

module.exports = userRoutes;
