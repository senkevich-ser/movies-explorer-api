const movieRoutes = require('express').Router();
const { checkNewMovie } = require('../utils/validation');
const { checkMovieId } = require('../utils/validation');

const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

movieRoutes.get('/movies', getMovies);
movieRoutes.post('/movies', checkNewMovie, createMovie);
movieRoutes.delete('/movies/:movieId', checkMovieId, deleteMovie);

module.exports = movieRoutes;
