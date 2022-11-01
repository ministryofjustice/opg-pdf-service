import { htmlToPdf } from './htmlToPdf';
import stripAnchorTags from './stripAnchorTags';

const generatePdf = async (html, options) => {
  if (options.stripTags) {
    html = await stripAnchorTags(html);
  }
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
