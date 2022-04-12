const { celebrate, Joi } = require('celebrate');
const isURL = require('validator/lib/isURL');

const checkUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().required().min(2).max(30),
  }),
});
const checkUserLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

const checkProfile = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
});
const checkUrl = (value, helpers) => {
  if (isURL(value)) {
    return value;
  }
  return helpers.message('Не правильный формат url');
};

const checkNewMovie = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required().max(4).pattern(/\d{4}/),
    description: Joi.string().required(),
    image: Joi.string().required().custom(checkUrl),
    trailerLink: Joi.string().required().custom(checkUrl),
    thumbnail: Joi.string().required().custom(checkUrl),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    movieId: Joi.number().integer().positive().required(),
  }),
});

const checkMovieId = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().length(24).required(),
  }),
});

module.exports = {
  checkUser,
  checkUserLogin,
  checkProfile,
  checkNewMovie,
  checkMovieId,
};
