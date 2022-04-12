const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cors = require('cors');
const { limiter } = require('./middlewares/ratelimiter');
const routes = require('./routes/index');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { MONGO_DB, PORT } = require('./config');
const { errorHandler } = require('./middlewares/errorHandler');

const app = express();
app.use(helmet());
app.use(express.json());
app.use(cors());

app.use(requestLogger);

app.use(limiter);
app.use(routes);
app.use(errors());
app.use(errorLogger);
app.use(errorHandler);

async function main() {
  await mongoose.connect(MONGO_DB, {
    useNewUrlParser: true,
  });
  await app.listen(PORT);
  console.log(`This server is runing. Connect port is ${PORT} `);
}

main();
