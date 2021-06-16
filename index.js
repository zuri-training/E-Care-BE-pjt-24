const { createServer } = require('http');
const app = require('./server');
const { logger } = require('./utils/logger');
const { PORT } = require('./src/core/config');

const server = createServer(app);
server.listen(PORT, () => logger.info(`E-Care Server Started on port ${PORT}`));
