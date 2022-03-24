const { celebrate, Joi } = require("celebrate");

const checkUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    // eslint-disable-next-line no-useless-escape
    avatar: Joi.string().pattern(/https?:\/\/(www)?[\-\.~:\/\?#\[\]@!$&'\(\)*\+,;=\w]+#?\b/),
  }),
});

const checkProfile = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required(2).min(2).max(30),
  }),
});

const checkAvatar = celebrate({
  body: Joi.object().keys({
    // eslint-disable-next-line no-useless-escape
    avatar: Joi.string().required().pattern(/https?:\/\/(www)?[\-\.~:\/\?#\[\]@!$&'\(\)*\+,;=\w]+#?\b/),
  }),
});

const checkNewCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    // eslint-disable-next-line no-useless-escape
    link: Joi.string().required().pattern(/https?:\/\/(www)?[\-\.~:\/\?#\[\]@!$&'\(\)*\+,;=\w]+#?\b/),
  }),
});

const checkCardId = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),
});
const checkUserId = celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24),
  }),
});

module.exports = {
  checkUser,
  checkProfile,
  checkAvatar,
  checkNewCard,
  checkCardId,
  checkUserId,
};
