import assert from 'node:assert';
import { after, describe, test } from 'node:test';
import GeneratePdf from './generatePdf.js';
import { exitBrowser } from './htmlToPdf.js';

const testHtml = `<html><head></head><body><p><a href="/home" class="govuk-link">Test with no links</a></p></body></html>`;

after(async () => {
  await exitBrowser();
});

describe('Given you have a HTML document you want to create a PDF Document of', () => {
  test('It should generate a PDF with stripping tags', async () => {
    const result = await GeneratePdf(testHtml, {
      stripTags: true,
    });

    assert.notEqual(result, null);
    assert(result instanceof Uint8Array);
  });

  test('It should generate a PDF without stripping tags', async () => {
    const result = await GeneratePdf(testHtml, {
      stripTags: false,
    });

    assert.notEqual(result, null);
    assert(result instanceof Uint8Array);
  });

  test('It should generate a PDF with embedding of images', async () => {
    const result = await GeneratePdf(testHtml, {
      embedRemoteImages: true,
    });

    assert.notEqual(result, null);
    assert(result instanceof Uint8Array);
  });
});
