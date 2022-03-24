const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundErr = require('../errors/NotFoundErr');
const ConflictErr = require('../errors/ConflictErr');
const BadRequestErr = require('../errors/BadRequestErr');
const UnAutorized = require('../errors/UnAutorizedErr');

const {
  STATUS_OK,
  STATUS_CREATED,
  STATUS_ACCEPTED,
} = require('../utils/constants');

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    if (!users) {
      throw new NotFoundErr(
        'Данные пользователей с такими параметрами не найдены',
      );
    }
    return res.status(STATUS_OK).send(users);
  } catch (err) {
    return next(err);
  }
};

exports.getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      throw new NotFoundErr('Пользователь не найден');
    }
    return res.status(STATUS_OK).send(user);
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new BadRequestErr(`${Object.values(err).map((error) => error).join(', ')}`));
    }
    return next(err);
  }
};

exports.createUser = async (req, res, next) => {
  try {
    const { email } = req.body;
    const checkUser = await User.findOne({ email });
    if (checkUser) {
      throw new ConflictErr('Данный пользователь уже существует!');
    }
    const user = new User(req.body);
    const hash = await bcrypt.hash(user.password, 10);
    user.password = hash;
    await user.save();
    return res
      .status(STATUS_CREATED)
      .send({ _id: user._id, email: user.email });
  } catch (err) {
    if (err.name.includes('ValidationError')) {
      return next(new BadRequestErr(`${Object.values(err.errors).map((error) => error.message).join(', ')}`));
    }
    return next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { name, about } = req.body;
    const updateUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      {
        new: true,
        runValidators: true,
      },
    );
    if (updateUser) {
      return res.status(STATUS_ACCEPTED).send(updateUser);
    }
    throw new NotFoundErr('Данный пользователь не найден');
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestErr(`${Object.values(err.errors).map((error) => error.message).join(', ')}`));
    }
    return next(err);
  }
};

exports.userLogin = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const { NODE_ENV, JWT_SECRET } = process.env;
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key', {
        expiresIn: '7d',
      });
      res.send({ token });
    })
    .catch(() => {
      next(new UnAutorized('Данный пользователь не авторизован'));
    });
};
