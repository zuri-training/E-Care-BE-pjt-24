const { jwtManager } = require('../../utils/tokenizer');
const { throwError } = require('../../utils/handleErrors');
const { sendError } = require('../../utils/responseHandler');

const authenticate = async (req, res, next) => {
  try {
    const requestHeaderAuthorization = req.headers.authorization;

    if (!requestHeaderAuthorization) {
      throwError('Authentication Failed. Please login', 401);
    }

    const [authBearer, token] = requestHeaderAuthorization.split(' ');

    if (authBearer !== 'Bearer') {
      throwError('Authentication Failed', 401);
    }

    const data = await jwtManager().verify(token);

    req.auth = data;
    next();
  } catch (error) {
    sendError(res, error);
  }
};

const permit = (users) => (req, res, next) => {
  try {
    const isAuthorized = users.includes(req.auth.role);

    if (!isAuthorized) {
      throwError('Unauthorized request', 401);
    }

    next();
  } catch (err) {
    sendError(res, err);
  }
};

module.exports = {
  authenticate,
  permit,
};
