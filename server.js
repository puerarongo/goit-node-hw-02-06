const app = require('./app');
const mongoose = require("mongoose");
require('dotenv').config();

const { MAIN_PORT = 3000, DB_HOST } = process.env;

mongoose.connect(DB_HOST)
  .then(() => app.listen(MAIN_PORT, () => {
  console.log("Database connection successful");
    })
  )
  .catch(err => {
    console.error(err.message);
    process.exit(1);
  });