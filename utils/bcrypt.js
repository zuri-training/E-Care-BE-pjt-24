/* eslint-disable no-return-await */
const bcrypt = require('bcrypt');

const saltRounds = 10;

module.exports = {
  hashManager() {
    return {
      async hash(password) {
        return await bcrypt.hash(password, saltRounds);
      },
      async compare(password, hash) {
        return await bcrypt.compare(password, hash);
      },
    };
  },
};
