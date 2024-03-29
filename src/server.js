/* istanbul ignore file */

import app from './app.js';

const port = process.env.PDF_SERVICE_PORT || 80;

const server = app.listen(port, (err) => {
  if (err) throw err;
  console.log(`> Running on localhost:${port}`);
});

export default server;
