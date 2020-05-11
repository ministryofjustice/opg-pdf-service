const fs = require("fs");
import htmlToPdf from "./htmlToPdf";
import stripAnchorTags from "./stripAnchorTags";
import { PDFDocument } from "pdf-lib";

const generatePdf = async (html, options) => {
  if (options.stripTags) {
    html = await stripAnchorTags(html);
  }
  const pdf = await htmlToPdf(html, { waitUntil: "load",
    pageWidth: options.pageWidth,
    pageHeight: options.pageHeight
  });

  const pdfDoc = await PDFDocument.load(pdf.buffer);

  if (options.title) {
    pdfDoc.setTitle(options.title);
  }

  if (options.subject) {
    pdfDoc.setSubject(options.subject);
  }

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
};

export default generatePdf;
