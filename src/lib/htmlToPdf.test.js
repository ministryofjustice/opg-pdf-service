import assert from 'node:assert';
import { after, describe, test } from 'node:test';
import { exitBrowser, htmlToPdf } from './htmlToPdf.js';

after(async () => {
  await exitBrowser();
});

describe('Given you pass HTML to be returned into PDF', () => {
  const testHtml = `<html><head><script src="http://localhost/nonexistantfile"></script></head><body><p><a href="/home" class="govuk-link">Test with no links</a></p></body></html>`;

  describe('Given a PDF is not generated correctly due to an error', () => {
    test('it should return null and throw an error', async () => {
      try {
        await htmlToPdf(testHtml, {
          waitUntil: 'loads',
          pageHeight: 2000,
          pageWidth: 1100,
        });
        assert.fail('Expected error was not thrown');
      } catch (error) {
        assert.strictEqual(
          error.message,
          'Unknown value for options.waitUntil: loads',
        );
      }
    });
  });

  describe('Given a PDF is valid and to be generated', () => {
    test('it should generate a PDF using puppeteer successfully', async () => {
      const pdf = await htmlToPdf(testHtml, {
        waitUntil: 'load',
        pageHeight: 2000,
        pageWidth: 1100,
      });

      assert.notEqual(pdf, null);
      assert(pdf instanceof Uint8Array);
    });
  });

  describe('Given a PDF is valid with page sizing sent and to be generated', () => {
    test('it should generate a PDF using puppeteer successfully', async () => {
      const pdf = await htmlToPdf(testHtml, {
        waitUntil: 'load',
        pageHeight: 20,
        pageWidth: 40,
      });

      assert.notEqual(pdf, null);
      assert(pdf instanceof Uint8Array);
    });
  });
});
