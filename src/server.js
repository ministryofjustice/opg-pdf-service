/* istanbul ignore file */

import app from './app.js';
import { initBrowser } from './lib/htmlToPdf.js';

const port = process.env.PDF_SERVICE_PORT || 80;

await initBrowser();

const server = app.listen(port, (err) => {
  if (err) throw err;
  console.log(`> Running on localhost:${port}`);
});

export default server;
