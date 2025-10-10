import { htmlToPdf } from './htmlToPdf.js';
import { logger } from '../logging.js';
import stripAnchorTags from './stripAnchorTags.js';
import embedRemoteImages from './embedRemoteImages.js';

const generatePdf = async (html, options) => {
  if (options.stripTags) {
    html = await stripAnchorTags(html);
  }
  if (options.embedRemoteImages) {
    html = await embedRemoteImages(html);
  }

  logger.debug({ pdf_options: options }, 'creating PDF with options');

  return await htmlToPdf(html, {
    waitUntil: 'load',
    marginTop: options.marginTop,
    marginBottom: options.marginBottom,
    marginLeft: options.marginLeft,
    marginRight: options.marginRight,
    printBackground: options.printBackground,
    emulateMediaType: options.emulateMediaType
      ? options.emulateMediaType // jshint ignore:line
      : 'print',
  });
};

export default generatePdf;
