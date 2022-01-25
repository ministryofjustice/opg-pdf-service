import { htmlToPdf } from './htmlToPdf';
import stripAnchorTags from './stripAnchorTags';
import { PDFDocument } from 'pdf-lib';

const generatePdf = async (html, options) => {
  if (options.stripTags) {
    html = await stripAnchorTags(html);
  }
  const pdf = await htmlToPdf(html, {
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

  const pdfDoc = await PDFDocument.load(pdf.buffer);

  if (options.title) {
    pdfDoc.setTitle(options.title);
  }

  if (options.subject) {
    pdfDoc.setSubject(options.subject);
  }

  return await pdfDoc.save();
};

export default generatePdf;
