const movieRoutes = require('express').Router();
/* const { checkNewCard } = require('../utils/validation');
const { checkCardId } = require('../utils/validation'); */

const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

movieRoutes.get('/', getMovies);
movieRoutes.post('/', /* checkNewCard, */ createMovie);
movieRoutes.delete('/:movieId', /* checkCardId, */ deleteMovie);

module.exports = movieRoutes;
