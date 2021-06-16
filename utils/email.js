const sendGridMail = require('@sendgrid/mail');
const { logger } = require('./logger');

const { SENDGRID_API_KEY } = require('../src/core/config');

sendGridMail.setApiKey(SENDGRID_API_KEY);

// eslint-disable-next-line consistent-return
const sendMail = async (email, subject, message) => {
  try {
    const data = {
      to: `${email}`,
      from: 'E-care <ebukanathan@gmail.com>',
      subject,
      html: message,
    };
    await sendGridMail.send(data);
  } catch (err) {
    logger.log({
      level: 'error',
      message: err.message,
    });
    return { err };
  }
};

module.exports = sendMail;
