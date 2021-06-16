const mailgun = require('mailgun-js');
const { MAILGUN_APIKEY, MAILGUN_DOMAIN } = require('../src/core/config');

const msg = mailgun({ apiKey: MAILGUN_APIKEY, domain: MAILGUN_DOMAIN });

module.exports = msg;
