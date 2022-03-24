const express = require('express');
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;

const app = express();
async function main() {
  await mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
    useNewUrlParser: true,
  });
  await app.listen(PORT);
  console.log(`This server is runing. Connect port is ${PORT} `);
}

main();
