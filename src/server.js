/* istanbul ignore file */

import app from './app.js';
import { logger, loggerMiddleware } from './logging.js';
import { initBrowser } from './lib/htmlToPdf.js';

const port = process.env.PDF_SERVICE_PORT || 80;

initBrowser();

const server = app
  .use(loggerMiddleware)
  .listen(port, (err) => {
    if (err) throw err;
    logger.info('Server started on :' + port);
  });

export default server;
