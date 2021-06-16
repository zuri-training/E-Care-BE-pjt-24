require('dotenv').config();

module.exports = {
  MONGODB_URI: process.env.MONGODB_URI,
  API_KEY: process.env.API_KEY,
  API_SECRET: process.env.API_SECRET,
  CLOUD_NAME: process.env.CLOUD_NAME,
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
  PORT: process.env.PORT || 5000,
  BASE_URL: process.env.BASE_URL,
  MAILGUN_APIKEY: process.env.MAILGUN_APIKEY,
  MAILGUN_DOMAIN: process.env.MAILGUN_DOMAIN,
  EMAIL_ADDRESS: process.env.EMAIL_ADDRESS,
};
