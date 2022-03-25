const Movie = require('../models/movie');
const { STATUS_OK, STATUS_CREATED } = require('../utils/constants');

const BadRequestErr = require('../errors/BadRequestErr');
const NotFoundErr = require('../errors/NotFoundErr');
const ForBiddenErr = require('../errors/ForbiddenErr');
const ConflictErr = require('../errors/ConflictErr');

exports.getMovies = async (req, res, next) => {
  try {
    const movies = await Movie.find({});
    return res.status(STATUS_OK).send(movies);
  } catch (err) {
    return next(err);
  }
};

exports.createMovie = async (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  try {
    const data = await Movie.find({ movieId });

    if (data.length > 0) {
      throw new ConflictErr(`Карточка с movieId:${movieId} уже существует`);
    }
    const newMovie = await Movie.create({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      nameRU,
      nameEN,
      thumbnail,
      movieId,
      owner: req.user._id,
    });
    if (!newMovie) {
      throw new BadRequestErr('Переданы некорректные данные');
    }
    return res.status(STATUS_CREATED).send(newMovie);
  } catch (err) {
    if (err.name.includes('ValidationError')) {
      return next(
        new BadRequestErr(
          `${Object.values(err.errors)
            .map((error) => error.message)
            .join(', ')}`,
        ),
      );
    }
    return next(err);
  }
};

exports.deleteMovie = async (req, res, next) => {
  try {
    const { movieId } = req.params;
    const movie = await Movie.findById(movieId);
    if (!movie) {
      throw new NotFoundErr('Данная карточка фильма не существует');
    }
    if (JSON.stringify(movie.owner) !== JSON.stringify(req.user._id)) {
      throw new ForBiddenErr('Вы не можете удалить данную карточку фильма');
    }
    const deleteMovie = await Movie.findByIdAndRemove(movieId);
    if (deleteMovie) {
      return res
        .status(STATUS_OK)
        .send({ message: `Карточка фильма: ${deleteMovie._id} удалена` });
    }
    throw new NotFoundErr('Данные не найдены');
  } catch (err) {
    if (err.name === 'CastError') {
      return next(
        new BadRequestErr(
          `${Object.values(err)
            .map((error) => error)
            .join(', ')}`,
        ),
      );
    }
    return next(err);
  }
};
