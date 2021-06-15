const mailgun = require('mailgun-js');
const { MAILGUN_APIKEY, MAILGUN_DOMAIN, EMAIL_ADDRESS } = require('../src/core/config');

const sendMail = async (email, subject, message, cb) => {
  const mg = mailgun({
    apiKey: MAILGUN_APIKEY,
    domain: MAILGUN_DOMAIN,
  });
  const data = {
    from: `<${EMAIL_ADDRESS}>`,
    to: `${email}`,
    subject,
    html: message,
  };
  await mg.messages().send(data);
};

module.exports = sendMail;
