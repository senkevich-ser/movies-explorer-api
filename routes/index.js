const routes = require('express').Router();
const auth = require('../middlewares/auth');
const movieRoutes = require('./movies');
const userRoutes = require('./users');
const NotFoundErr = require('../errors/NotFoundErr');
const { checkUser, checkUserLogin } = require('../utils/validation');
const { createUser, userLogin } = require('../controllers/users');

routes.post('/signup', checkUser, createUser);
routes.post('/signin', checkUserLogin, userLogin);

routes.use(auth);

routes.use(
  userRoutes,
  movieRoutes,
);
routes.use(auth, () => {
  throw new NotFoundErr('Запрашиваемый ресурс не найден');
});
module.exports = routes;
