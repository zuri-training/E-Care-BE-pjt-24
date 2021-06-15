class GenericResponseError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
}

function throwError(message, code = 400) {
  throw new GenericResponseError(code, message);
}

module.exports = {
  throwError,
};
