import { exitBrowser, htmlToPdf } from './htmlToPdf';

afterAll(async () => {
  await exitBrowser();
});

describe('Given you pass HTML to be returned into PDF', () => {
  const testHtml = `<html><head><script src="http://localhost/nonexistantfile"></script></head><body><p><a href="/home" class="govuk-link">Test with no links</a></p></body></html>`;

  describe('Given a PDF is not generated correctly due to an error', () => {
    test('it should return null and throw an error', () => {
      return expect(
        htmlToPdf(testHtml, {
          waitUntil: 'loads',
          pageHeight: 2000,
          pageWidth: 1100,
        }),
      ).rejects.toThrow('Unknown value for options.waitUntil: loads');
    });
  });

  describe('Given a PDF is valid and to be generated', () => {
    test('it should generate a PDF using puppeteer successfully', async () => {
      const pdf = await htmlToPdf(testHtml, {
        waitUntil: 'networkidle0',
        pageHeight: 2000,
        pageWidth: 1100,
      });

      expect(pdf).not.toBeNull();
      expect(pdf).toBeInstanceOf(Uint8Array);
    });
  });

  describe('Given a PDF is valid with page sizing sent and to be generated', () => {
    test('it should generate a PDF using puppeteer successfully', async () => {
      const pdf = await htmlToPdf(testHtml, {
        waitUntil: 'networkidle0',
        pageHeight: 20,
        pageWidth: 40,
      });

      expect(pdf).not.toBeNull();
      expect(pdf).toBeInstanceOf(Uint8Array);
    });
  });
});
