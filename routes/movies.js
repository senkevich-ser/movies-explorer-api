const movieRoutes = require('express').Router();
const { checkNewMovie } = require('../utils/validation');
const { checkMovieId } = require('../utils/validation');

const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

movieRoutes.get('/', getMovies);
movieRoutes.post('/', checkNewMovie, createMovie);
movieRoutes.delete('/:movieId', checkMovieId, deleteMovie);

module.exports = movieRoutes;
