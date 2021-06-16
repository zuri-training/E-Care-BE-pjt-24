require('dotenv').config();
const mongoose = require('mongoose');
const { MONGODB_URI } = require('../core/config');

const InitiateMongoServer = async () => {
  try {
    await mongoose.connect('mongodb+srv://tech4Mation:tech4mation@cluster0.10uvd.mongodb.net/eCareDatabase?retryWrites=true&w=majority', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log('Connected to DB');
  } catch (err) {
    console.error(err);
    throw err;
  }
};

module.exports = InitiateMongoServer;
