const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundErr = require('../errors/NotFoundErr');
const ConflictErr = require('../errors/ConflictErr');
const BadRequestErr = require('../errors/BadRequestErr');
const UnAutorized = require('../errors/UnAutorizedErr');
const { JWT_CODE } = require('../config');

const {
  STATUS_OK,
  STATUS_CREATED,
  STATUS_ACCEPTED,
} = require('../utils/constants');

exports.getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      throw new NotFoundErr('Пользователь не найден');
    }
    return res.status(STATUS_OK).send(user);
  } catch (err) {
    return next(err);
  }
};

exports.createUser = async (req, res, next) => {
  try {
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
    if (err.code === 11000) {
      throw new ConflictErr('Данный пользователь уже существует!');
    }
    return next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  const { name, email } = req.body;
  try {
    const data = await User.find({ email });

    if (data.length === 1) {
      if (data[0]._id.toString() !== req.user._id) {
        throw new ConflictErr(`Почтовый ящик ${email} принадлежит другому пользователю`);
      }
    }
    const updateUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, email },
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
      const token = jwt.sign({ _id: user._id }, JWT_CODE, {
        expiresIn: '7d',
      });
      res.send({ token });
    })
    .catch(() => {
      next(new UnAutorized('Неправильная почта или пароль'));
    });
};
