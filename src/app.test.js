import { exitBrowser, initBrowser } from './lib/htmlToPdf';
import { fromBuffer } from 'pdf2pic';
import { OPG_TEST_LETTER } from './assets/opgTestLetter';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import { readFileSync, writeFileSync } from 'node:fs';

import request from 'supertest';
import app from './app';

const testHtml = `<html><head></head><body><p><a href="/home" class="govuk-link">Test with no links</a></p></body></html>0i9`;

beforeEach(async () => {
  await initBrowser();
});

afterAll(async () => {
  await exitBrowser();
});

describe('Given the app gets an api request to an endpoint', () => {
  describe('GET /health-check', () => {
    test('It should respond with a http status code of 200', async () => {
      await request(app.handler).get('/health-check').expect(200);
    });
  });
});

describe('Given the app gets an api request to an endpoint', () => {
  describe('POST /generate-pdf', () => {
    test('It should respond with a valid PDF and correct headers', async () => {
      const response = await request(app.handler)
        .post('/generate-pdf')
        .set('content-type', 'text/html')
        .send(testHtml);
      expect(response.statusCode).toBe(200);
      expect(response.type).toBe('application/pdf');
      expect(response.headers['content-disposition']).toBe(
        'attachment; filename=download.pdf',
      );
      expect(response.body).toBeInstanceOf(Uint8Array);
    });
  });
  describe('POST /generate-pdf with page width and height', () => {
    test('It should respond with a valid PDF and new page size', async () => {
      const response = await request(app.handler)
        .post('/generate-pdf')
        .set('content-type', 'text/html')
        .send(testHtml);
      expect(response.statusCode).toBe(200);
      expect(response.type).toBe('application/pdf');
      expect(response.headers['content-disposition']).toBe(
        'attachment; filename=download.pdf',
      );
      expect(response.body).toBeInstanceOf(Uint8Array);
    });
  });

  describe('POST /generate-pdf with known HTML', () => {
    test('It should respond with a consistently rendered PDF', async () => {
      const response = await request(app.handler)
        .post('/generate-pdf')
        .set('content-type', 'text/html')
        .send(OPG_TEST_LETTER);
      //expected output
      const options = {
        density: 100,
        saveFilename: 'logo-pdf',
        savePath: '/app/test-results/images',
        format: 'png',
        width: 600,
        height: 600,
      };
      const convert = fromBuffer(response.body, options);
      const pageToConvertAsImage = 1;
      await convert(pageToConvertAsImage, { responseType: 'image' });
      const baseline_image = PNG.sync.read(
        readFileSync('/app/src/baseline/logo-pdf.1.png'),
      );
      const generated_image = PNG.sync.read(
        readFileSync('/app/test-results/images/logo-pdf.1.png'),
      );
      const { width, height } = baseline_image;
      const diff = new PNG({ width, height });
      const match = pixelmatch(
        baseline_image.data,
        generated_image.data,
        diff.data,
        600,
        600,
        { threshold: 0.1 },
      );
      writeFileSync(
        '/app/test-results/images/logo-pdf.1.diff.png',
        PNG.sync.write(diff),
      );

      expect(match).toBe(0);
    });
  });
});
