import embedRemoteImages from './embedRemoteImages';
import GeneratePdf from './generatePdf';
import { exitBrowser } from './htmlToPdf';

const testHtml = `<html><head></head><body><p><a href="/home" class="govuk-link">Test with no links</a></p></body></html>`;

afterAll(async () => {
  await exitBrowser();
});

describe('Given you have a HTML document you want to create a PDF Document of', () => {
  test('It should generate a PDF with stripping tags', async () => {
    const result = await GeneratePdf(testHtml, {
      stripTags: true,
    });

    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(Uint8Array);
  });

  test('It should generate a PDF without stripping tags', async () => {
    const result = await GeneratePdf(testHtml, {
      stripTags: false,
    });

    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(Uint8Array);
  });

  test('It should generate a PDF with embedding of images', async () => {
    const result = await GeneratePdf(testHtml, {
      embedRemoteImages: true,
    });

    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(Uint8Array);
  });
});
